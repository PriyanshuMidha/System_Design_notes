# Rebuild tools

- `lint_notes.py`: checks a note or folder against the conventions.
  - Run: `python3 -I lint_notes.py "07 Databases"`
- `validate_mermaid.mjs`: parses every Mermaid block with Mermaid 11.
  - It needs `mermaid@11` and `jsdom@24` installed outside the vault.
  - Setup: `npm i mermaid@11 jsdom@24` in a scratch folder, copy this file there, and run `node validate_mermaid.mjs note.md`.
