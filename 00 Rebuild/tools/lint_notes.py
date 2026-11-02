#!/usr/bin/env python3
"""Lint rebuilt topic notes against the vault conventions.

Usage: python3 -I lint_notes.py <note.md | folder> [...]
Exit code 1 if any note FAILs. Warnings never fail.
"""
import os
import re
import sys

VAULT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
TRACKER = os.path.join(VAULT, '00 Rebuild', 'Rebuild Tracker.md')
LEGACY_DIRS = ('advance backend', 'Api architecture', 'bytes GO complete thimh', 'LLD with Go', 'Excalidraw')

FRONTMATTER_KEYS = ['tags', 'level', 'status', 'prereqs', 'related', 'sources', 'updated']
LEVELS = {'basic', 'intermediate', 'advanced'}
STATUSES = {'draft', 'reviewed', 'done'}
REQUIRED_SECTIONS = ['why it exists', 'mental model', 'how it works', 'worked example',
                     'trade-offs', 'interview questions', 'cheat sheet', 'links']
DEPTH5_SECTIONS = ['in production', 'deep dive']
# LLD practice problems (files under a Practice/ folder) keep the 10-step interview-round format.
PRACTICE_SECTIONS = ['problem statement'] + [f'step {i}' for i in range(1, 11)] + [
    'test cases', 'interview questions', 'cheat sheet', 'links']
BANNED = [
    'senior interview bank', 'topic-specific drill', 'reviewer checklist', 'deep understanding checklist',
    'sde-3 depth notes', 'what is the trap question for', 'draw the smallest flow',
    'it helps you understand the main job of', 'is not learned alone', 'one user action',
    'in simple words: if you can explain', 'these are topic-specific questions', 'revision prompts',
    'how to relate this topic', 'class="sd-', 'lorem ipsum', 'todo', 'tbd',
]


def note_names():
    names = set()
    for dp, dn, fn in os.walk(VAULT):
        if '/.git' in dp or '/.obsidian' in dp:
            continue
        for f in fn:
            if f.endswith('.md'):
                names.add(f[:-3])
    return names


def planned_titles():
    titles = set()
    if os.path.exists(TRACKER):
        for line in open(TRACKER, encoding='utf-8'):
            m = re.match(r'- \[[ x]\] \*\*(.+?)\*\*', line)
            if m:
                titles.add(m.group(1).split('/')[-1])
    return titles


def legacy_names():
    names = set()
    for d in LEGACY_DIRS:
        for dp, dn, fn in os.walk(os.path.join(VAULT, d)):
            for f in fn:
                if f.endswith('.md'):
                    names.add(f[:-3])
    return names


def strip_code(text):
    text = re.sub(r'```.*?```', '', text, flags=re.S)
    return re.sub(r'`[^`\n]*`', '', text)


def lint(path, existing, planned, legacy):
    fails, warns = [], []
    text = open(path, encoding='utf-8').read()
    lines = text.split('\n')
    title = os.path.basename(path)[:-3]

    fm = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if not fm:
        fails.append('no frontmatter')
    else:
        body = fm.group(1)
        for k in FRONTMATTER_KEYS:
            if not re.search(rf'^{k}:', body, re.M):
                fails.append(f'frontmatter missing `{k}`')
        lv = re.search(r'^level:\s*(\S+)', body, re.M)
        if lv and lv.group(1) not in LEVELS:
            fails.append(f'level `{lv.group(1)}` not in {sorted(LEVELS)}')
        st = re.search(r'^status:\s*(\S+)', body, re.M)
        if st and st.group(1) not in STATUSES:
            fails.append(f'status `{st.group(1)}` not in {sorted(STATUSES)}')

    if not re.search(rf'^# {re.escape(title)}\s*$', text, re.M):
        fails.append(f'H1 must equal file name "# {title}"')
    if '> [!summary]' not in text:
        fails.append('missing TL;DR callout `> [!summary]`')

    headings = [h.lower() for h in re.findall(r'^##\s+(?:\d+\.\s*)?(.+?)\s*$', text, re.M)]
    practice = f'{os.sep}Practice{os.sep}' in path
    # `type: reference` (resource lists, cheat sheets) needs only frontmatter, H1, TL;DR and Links.
    reference = bool(fm and re.search(r'^type:\s*reference\s*$', fm.group(1), re.M))
    if reference:
        if not any(h.startswith('links') for h in headings):
            fails.append('missing section "links"')
        for b in BANNED:
            if re.search(rf'(?<![a-z]){re.escape(b)}(?![a-z])', strip_code(text).lower()):
                fails.append(f'banned/boilerplate phrase: "{b}"')
        return fails, warns
    for s in (PRACTICE_SECTIONS if practice else REQUIRED_SECTIONS):
        if not any(h == s or h.startswith(s + ':') or h.startswith(s + ' ') or (h.startswith(s) and not s[-1].isdigit())
                   for h in headings):
            fails.append(f'missing section "{s}"')
    if not practice:
        for s in DEPTH5_SECTIONS:
            if not any(h.startswith(s) for h in headings):
                warns.append(f'no "{s}" section (needed for depth 5 unless truly not applicable)')

    mermaid = text.count('```mermaid')
    if mermaid == 0:
        fails.append('no mermaid diagram')
    elif mermaid == 1:
        warns.append('only one diagram')

    q = len(re.findall(r'^> \[!question\]', text, re.M))
    if q < 4:
        fails.append(f'only {q} interview questions (need >= 4)')

    low = strip_code(text).lower()
    for b in BANNED:
        if re.search(rf'(?<![a-z]){re.escape(b)}(?![a-z])', low):
            fails.append(f'banned/boilerplate phrase: "{b}"')

    fence_lines = [i for i, l in enumerate(lines) if l.startswith('```')]
    for idx, i in enumerate(fence_lines):
        if idx % 2 == 0 and lines[i].strip() == '```':
            fails.append(f'line {i + 1}: code fence without language')

    for block in re.findall(r'```.*?```', text, re.S):
        if '[[' in block:
            fails.append('wikilink inside a code block')
            break

    plain = strip_code(text)
    for link in set(re.findall(r'\[\[([^\]|#]+)', plain)):
        target = link.strip().split('/')[-1]
        if target.endswith('.excalidraw'):
            if target not in existing:
                fails.append(f'drawing not found: [[{target}]]')
            continue
        if target in legacy and target not in planned:
            fails.append(f'links to legacy note [[{target}]] (link the new note instead)')
        elif target not in existing and target not in planned:
            fails.append(f'link target not found or planned: [[{target}]]')

    n = len(lines)
    if n < 150:
        warns.append(f'short for depth 5 ({n} lines)')
    # Length is informational only. Never cut code, tests, SQL or facts to shorten a note.
    if n > (2000 if practice else 1000):
        warns.append(f'long ({n} lines): fine if every section earns its place; never cut code, tests or facts to shorten')
    return fails, warns


def main(args):
    files = []
    for a in args:
        if os.path.isdir(a):
            for dp, dn, fn in os.walk(a):
                files += [os.path.join(dp, f) for f in fn if f.endswith('.md') and not f.endswith(' MOC.md')]
        else:
            files.append(a)
    existing, planned, legacy = note_names(), planned_titles(), legacy_names()
    bad = 0
    for f in sorted(files):
        fails, warns = lint(f, existing, planned, legacy)
        status = 'FAIL' if fails else 'PASS'
        bad += bool(fails)
        print(f'{status}  {os.path.relpath(f, VAULT)}')
        for x in fails:
            print(f'      ✗ {x}')
        for x in warns:
            print(f'      ~ {x}')
    print(f'\n{len(files) - bad}/{len(files)} notes pass')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
