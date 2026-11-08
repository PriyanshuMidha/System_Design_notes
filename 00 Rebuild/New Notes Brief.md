# New Notes Brief: HLD guides, incident playbooks, security incidents

The owner asked for three things, written so they are easy to understand and detailed:

1. A complete **HLD round** guide. It should cover everything in a high-level design interview, with real decision guides such as "Kafka or RabbitMQ?" and "which database should I pick?". Every decision point needs real-life examples.
2. **What to do when a production issue hits.** Give exact steps to find the cause and fix it.
3. **What to do and check if your website gets hacked**, plus how to harden a website beforehand.

Read and follow the "Ease rules for theory notes" in `00 Rebuild/Split Brief.md`. Also skim `00 Home/Conventions.md`. Every note uses the standard sections, because the linter requires them:

1. TL;DR `> [!summary]`, then `> [!abstract] Core idea`.
2. Why it exists.
3. Mental model.
4. How it works.
5. Worked example.
6. Variants and comparison.
7. Trade-offs.
8. In production.
9. Deep dive.
10. Interview questions: at least 4 `> [!question]-` callouts.
11. Cheat sheet.
12. Links.

Add a `### Whiteboard version` before the deep dive. Aim for 6–10 Mermaid diagrams per note, each showing the real mechanism or decision. The frontmatter follows the conventions, with `status: reviewed` and `updated: 2026-11-09`.

## Decision guides (`11 System Design/HLD Decision Guides/`)

Each decision guide must have:

- **A decision flowchart** in Mermaid that asks questions such as "Need ordering per key?", "Need replay?" or "Strong consistency?" and ends at a concrete choice.
- **A comparison table** across 8–15 dimensions:
  - guarantees and the consistency model;
  - throughput and latency, as rough documented or estimated numbers, labelled as such;
  - ordering, durability and scaling model;
  - operational cost, managed options, typical failure modes;
  - when it is the wrong choice.
- **Real-life examples.** Name the company or system and what it uses, with a source for anything that isn't common knowledge. Examples: LinkedIn built Kafka for activity streams, Uber, Netflix, Discord's move from Cassandra to ScyllaDB, Shopify, Stripe, WhatsApp, Instagram. Name the source in `sources`. Don't invent numbers.
- **"Scenario → choice → why" drills:** 8–12 mini scenarios such as "payment ledger", "chat messages", "clickstream", "order emails" or "leaderboard". For each, give the pick, the reason, and what you'd say in an interview.
- **"How to say it in the interview":** the exact phrasing for justifying the choice and naming the trade-off.
- **Links** to the existing deep notes in 07, 08, 09, 10, 05 and 13. Don't re-teach them; link them.

Two notes need extra coverage:

- **`HLD Round - Complete Step-by-Step Guide`** must go deeper than `[[System Design Interview Framework]]` and link it. Cover:
  - timeboxing for a 45- and a 60-minute round;
  - the exact questions to ask for requirements: functional, non-functional, scale, SLAs;
  - estimation, API design, the data model;
  - the high-level diagram, then the deep dives;
  - bottlenecks and scaling, reliability and failure handling;
  - security, observability, and the wrap-up;
  - what interviewers score at SDE-2, SDE-3 and Staff level, red flags, common follow-ups, and how to handle "what if traffic grows 10×?".
- **`HLD Round - Full Worked Mock (Food Delivery App)`** walks one design end to end. At every decision point, name the alternatives, the choice and the reason, and link the matching decision guide.

## Incident playbooks (`14 Observability & SRE/Incident Playbooks/`)

Each playbook covers one production problem. "Why it exists" covers the symptoms and the user impact. The rest of the playbook must have:

- **"First 5 minutes":** a numbered checklist.
  1. Confirm the problem and its blast radius.
  2. Check what changed: a deploy, a config change, traffic, a dependency.
  3. Mitigate first: roll back, scale, shed load, flip a feature flag, fail over.
  4. Communicate.
- **A diagnosis flowchart** in Mermaid that leads from the symptom to the likely causes.
- **Investigation steps** for each likely cause:
  - the exact dashboards and metrics to look at, with real PromQL;
  - the commands to run, such as `kubectl`, `top`, `ss`, `curl -w`, `pg_stat_activity`, `EXPLAIN`, `redis-cli INFO`, `kafka-consumer-groups`, `go tool pprof`, `dig` and `openssl`;
  - what each result means.
- **Fixes:** the immediate fix, the proper fix, and the prevention.
- **A real-world-style incident walkthrough** as the worked example, as a timeline.
- **The post-incident checklist,** linking `[[Postmortems and Root Cause Analysis]]`.
- **Links** to the existing deep notes: `[[Production Debugging Playbook]]`, `[[Incident Response]]`, and the debugging notes in 14, 07, 08 and 09.

## Security notes (`12 Security & Auth/`)

- **`Security Incident Response - When Your Website Is Hacked`** covers the step-by-step response:
  1. Detect and confirm.
  2. Contain: isolate hosts, revoke and rotate credentials and keys, take a snapshot for forensics before you change anything.
  3. Preserve evidence.
  4. Investigate. Check the logs and these signs:
     - access logs and CloudTrail;
     - new users and SSH keys;
     - cron jobs and web shells;
     - changed files and outbound traffic;
     - database dumps.
  5. Eradicate the attacker's access.
  6. Recover from clean builds and backups.
  7. Notify: legal, users, regulators such as GDPR's 72-hour window, and payment card brands where card data is involved (PCI).
  8. Run a post-incident review and harden.

  Cover common attack types and their tell-tale signs: SQL injection, XSS, credential stuffing, leaked keys, a vulnerable dependency, SSRF to cloud metadata, ransomware, defacement.
- **`Website Security Hardening Checklist`** is a prioritized checklist of what to check before launch and continuously. It covers:
  - TLS and headers;
  - authentication, sessions and rate limits;
  - input validation and injection;
  - secrets, dependencies and patching;
  - least-privilege IAM;
  - WAF and DDoS protection;
  - backups;
  - logging and alerting, and monitoring for compromise;
  - incident-response readiness.

  Link the existing 12 notes and `[[OWASP API Security Top 10]]`.

## Rules

- **Accuracy matters most.** Verify commands, PromQL and flags. Label any number you can't verify as an estimate.
- **Go code is optional.** Include it only where it helps, such as a small runnable snippet; if you do, it must pass `go vet` and `go test -race` in the scratch dir.
- **Checks before you finish.** Run the linter on every note you write and fix every ✗: `python3 -I "/Users/priyanshumidha/Documents/OBZEDIAN/00 Rebuild/tools/lint_notes.py" "<note>"`. Also run the Mermaid validator: `PATH=/opt/homebrew/bin:$PATH node /private/tmp/claude-502/-Users-priyanshumidha-Documents-OBZEDIAN/00fc1435-48e1-42f0-9888-340e4e0fbca2/scratchpad/tools/mermaid/validate.mjs "<note>"`. Quote Mermaid labels that contain special characters.
- **Links.** Links to notes in this batch that other agents are still writing are fine: the titles are planned in the tracker.
- **Scope.** Create only your assigned notes, and create the subfolder if it is missing. Do not edit other notes, MOCs or the tracker.
