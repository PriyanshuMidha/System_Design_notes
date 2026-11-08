"""Regenerate 00 Home/Study Index.md from the Rebuild Tracker (learning order) and what exists on disk."""
import os
import re
import sys

V = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
os.chdir(V)
t = open("00 Rebuild/Rebuild Tracker.md").read()
secs = re.findall(r"^## (\d\d [^·\n]+?) · .*?\n(.*?)(?=^## |\Z)", t, re.S | re.M)
out = ["---", "tags: [home]", "type: reference", "level: basic", "prereqs: []", 'related: ["[[Home]]"]',
       "status: reviewed", "sources: []", "updated: 2026-11-09", "---", "", "# Study Index", "",
       "> [!summary] Every topic in the vault, in order",
       "> Work down this page line by line. Open each link, read it, then tick its box.",
       "> - **Theory** is the main note: concepts and diagrams.",
       "> - **Go** is the code companion. Read it after the theory note, where one exists.", "",
       "Levels: 🟢 basic · 🟡 intermediate · 🔴 advanced. Back to [[Home]].", ""]
body, total = [], 0
for name, sec in secs:
    name = name.strip()
    if name.startswith("00"):
        continue
    rows, sub = [], None
    for title, lvl in re.findall(r"^- \[[ x]\] \*\*(.+?)\*\* · ([^·]+?) ", sec, re.M):
        if "MOC" in title or not os.path.exists(f"{name}/{title}.md"):
            continue
        parts = title.split("/")
        leaf = parts[-1]
        group = parts[0] if len(parts) > 1 else None
        if group != sub:
            sub = group
            rows.append(f"\n### {sub or 'Core topics'}\n")
        icon = {"B": "🟢", "I": "🟡", "A": "🔴"}.get(lvl.replace("🆕", "").strip().split("/")[0], "⚪")
        go = f"{name}/{'/'.join(parts[:-1] + [leaf + ' - Go'])}.md"
        rows.append(f"- [ ] {icon} [[{leaf}]]" + (f" · Go: [[{leaf} - Go]]" if os.path.exists(go) else ""))
        total += 1
    body += [f"## {name}", "", f"Folder map: [[{name} MOC]]", ""] + rows + [""]
out += [f"**{total} topics** across 19 folders.", ""] + body + ["## Links", "", "- [[Home]] · [[Conventions]] · [[Depth Ratings]]", ""]
open("00 Home/Study Index.md", "w").write("\n".join(out))
print(total, "topics")
