# Go Password Hashing

## Complete notes

Never store plain passwords. Store password hashes.

## Common choices

- bcrypt
- argon2id
- scrypt

For learning, bcrypt is simple. For modern high-security systems, Argon2id is often preferred.

## Flow

```text
signup: password -> hash -> store hash
login: password + stored hash -> compare -> success/fail
```

## Rules

- never log password
- never return hash in API
- use strong minimum password policy
- rate limit login
- audit failed login bursts
- support password reset safely later

## Common mistakes

- SHA256 password hashing without salt/work factor
- storing passwords in logs
- leaking whether email exists
- no rate limit on login

## Connect to notes

- [[Auth Security Content Table]]
- [[API Abuse and Bot Protection]]
- [[Go Auth JWT Sessions]]

## Coding task

Implement password hashing and comparison. Add tests that verify correct password passes and wrong password fails.
