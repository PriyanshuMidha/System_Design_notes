#!/usr/bin/env python3
"""Generate folder map notes (MOCs) from the Rebuild Tracker.

Usage: python3 -I build_mocs.py
A MOC is (re)written only if it does not exist or its frontmatter says `generated: true`.
Hand-finished MOCs (`generated: false`) are never touched.
"""
import datetime
import os
import re

VAULT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
TRACKER = os.path.join(VAULT, '00 Rebuild', 'Rebuild Tracker.md')

PURPOSE = {
    '01 CS Fundamentals': 'How a computer runs a program: CPU, memory hierarchy, storage, the operating system, data structures and Big-O.',
    '02 Networking & Web': 'How bytes cross the internet: IP, DNS, TCP/UDP/QUIC, HTTP 1.1/2/3, TLS, HTTP caching, CDNs and proxies.',
    '03 Frontend': 'How browsers render pages, plus the core of CSS, JavaScript and React a backend engineer needs.',
    '04 Go Language': 'Go from syntax to concurrency, generics, the runtime (scheduler, GC) and profiling.',
    '05 APIs': 'Designing APIs: REST, contracts, errors, pagination, versioning, idempotency, webhooks, GraphQL, gRPC and real-time.',
    '06 Backend Engineering in Go': 'Building a production Go service end to end, plus the InvoiceOps capstone.',
    '07 Databases': 'SQL, transactions, indexes, storage engines, isolation and MVCC, replication, sharding, NoSQL, search and analytics stores.',
    '08 Caching & Redis': 'Caching patterns, invalidation, eviction and failure modes, then Redis internals and operations.',
    '09 Messaging & Async': 'Queues vs streams, delivery semantics, retries and DLQs, the outbox, Kafka, schedulers and workflow engines.',
    '10 Distributed Systems & Resilience': 'Surviving partial failure: timeouts, retries, circuit breakers, CAP, consistency, consensus, locks, sagas and multi-region.',
    '11 System Design': 'Fundamentals, estimation and building blocks, then 17 case studies end to end.',
    '12 Security & Auth': 'Authentication, authorization, passwords, sessions, JWT, OAuth/OIDC, web security and secrets.',
    '13 DevOps & Cloud': 'Docker, CI/CD, deployment strategies, Kubernetes and AWS.',
    '14 Observability & SRE': 'Logs, metrics, traces, SLOs, alerting, incidents, debugging playbooks and capacity.',
    '15 Testing': 'Test strategy, unit to E2E, test doubles, contract, fuzz, load, chaos and CI.',
    '16 Software Architecture': 'Coupling and cohesion, monolith vs microservices, layered/hexagonal/clean architecture, DDD and ADRs.',
    '17 LLD': 'The LLD interview method, design principles, SOLID, UML, design patterns in Go and practice problems.',
    '18 AI Engineering': 'LLMs, prompting, tool calling, embeddings, vector databases, RAG and evals, agents, MCP and production AI.',
    '19 Interview & Career': 'Roadmap, SDE-3 readiness checklist, learning resources, Go traps and the LLD round playbook.',
}
BEFORE = {
    '02 Networking & Web': ['01 CS Fundamentals'], '03 Frontend': ['02 Networking & Web'],
    '04 Go Language': ['01 CS Fundamentals'], '05 APIs': ['02 Networking & Web'],
    '06 Backend Engineering in Go': ['04 Go Language', '05 APIs'], '07 Databases': ['01 CS Fundamentals'],
    '08 Caching & Redis': ['07 Databases'], '09 Messaging & Async': ['07 Databases'],
    '10 Distributed Systems & Resilience': ['07 Databases', '08 Caching & Redis', '09 Messaging & Async'],
    '11 System Design': ['10 Distributed Systems & Resilience', '16 Software Architecture'],
    '12 Security & Auth': ['02 Networking & Web'], '13 DevOps & Cloud': ['06 Backend Engineering in Go'],
    '14 Observability & SRE': ['13 DevOps & Cloud'], '15 Testing': ['06 Backend Engineering in Go'],
    '16 Software Architecture': ['06 Backend Engineering in Go'], '17 LLD': ['04 Go Language'],
    '18 AI Engineering': ['05 APIs', '07 Databases'], '19 Interview & Career': ['11 System Design', '17 LLD'],
}
AFTER = {}
for f, bs in BEFORE.items():
    for b in bs:
        AFTER.setdefault(b, []).append(f)
LEVEL = {'B': 'basic', 'I': 'intermediate', 'A': 'advanced', 'B/I': 'basic → intermediate',
         'I/A': 'intermediate → advanced', '-': ''}


def parse_tracker():
    folders, cur = {}, None
    for line in open(TRACKER, encoding='utf-8'):
        h = re.match(r'## (\d\d [^·\n]+?)(?: · .*)?$', line.strip())
        if h:
            cur = h.group(1).strip()
            folders[cur] = []
            continue
        m = re.match(r'- \[[ x]\] \*\*(.+?)\*\* · (\S+)', line)
        if m and cur and not m.group(1).endswith('MOC'):
            folders[cur].append((m.group(1), m.group(2)))
    return folders


def link_list(names):
    return ' · '.join(f'[[{n} MOC]]' for n in names) or 'nothing; this is a starting point'


def build(folder, items):
    path = os.path.join(VAULT, folder, f'{folder} MOC.md')
    if os.path.exists(path) and 'generated: true' not in open(path, encoding='utf-8').read(600):
        return 'kept (hand-finished)'
    written = 0
    out, group = [], None
    for i, (title, lv) in enumerate(items, 1):
        sub, _, name = title.rpartition('/')
        if sub != group:
            if sub:
                out.append(f'\n### {sub}\n')
            group = sub
        exists = os.path.exists(os.path.join(VAULT, folder, title + '.md'))
        written += exists
        level = LEVEL.get(lv, lv)
        level = f' · {level}' if level else ''
        out.append(f'{i}. [[{name}]]{level}' if exists else f'{i}. {name}{level} · *planned*')
    today = datetime.date.today().isoformat()
    text = f"""---
tags: [moc]
status: draft
generated: true
updated: {today}
---

# {folder} MOC

> [!summary] What this folder covers
> {PURPOSE[folder]}

## Before and after

- **Before this:** {link_list(BEFORE.get(folder, []))}
- **After this:** {link_list(AFTER.get(folder, []))}

## Learning path

Progress: **{written} / {len(items)}** notes written. Back to [[Home]].

{chr(10).join(out).lstrip()}

%% Generated from the Rebuild Tracker by 00 Rebuild/tools/build_mocs.py. When the folder is finished it gets a concept map and interview focus, and `generated` becomes false. %%
"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(text)
    return f'{written}/{len(items)} written'


if __name__ == '__main__':
    for folder, items in parse_tracker().items():
        if folder.startswith('00'):
            continue
        print(f'{folder:40s} {build(folder, items)}')
