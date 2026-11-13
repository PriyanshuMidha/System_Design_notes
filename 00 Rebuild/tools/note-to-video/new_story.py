#!/usr/bin/env python3
"""Scaffold a story video folder:  python new_story.py "Topic Name"  ->  Videos/<Topic Name>/story/{script.txt,scenes.js,cast.json}"""
import shutil, sys
from pathlib import Path
here = Path(__file__).resolve().parent
vault = here.parents[2]
topic = sys.argv[1]
dst = vault / "Videos" / topic / "story"
dst.mkdir(parents=True, exist_ok=True)
for f in ("script.txt", "scenes.js", "cast.json"):
    if not (dst / f).exists():
        shutil.copy(here / "templates" / f, dst / f)
print("created", dst)
