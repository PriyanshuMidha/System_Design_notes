import os
HERE=os.path.dirname(os.path.abspath(__file__))+'/'
import sys
from playwright.sync_api import sync_playwright
W=HERE
ts=[float(x) for x in sys.argv[1].split(',')]
with sync_playwright() as p:
    b=p.chromium.launch(channel="chrome",args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg=b.new_page(viewport={"width":1080,"height":1920});errs=[]
    pg.on("console",lambda m: errs.append(m.text) if m.type in("warning","error") else None)
    pg.on("pageerror",lambda e: errs.append("PAGEERROR "+str(e)))
    pg.goto("file://"+W+"page.html");pg.wait_for_timeout(2500)
    print("phys",pg.evaluate("window.PHYS"))
    for t in ts:
        pg.evaluate(f"seek({t})");pg.screenshot(path=W+f"p_{t:.1f}.png")
    print("\n".join(sorted(set(e for e in errs if 'GL Driver' not in e))) or "no errors")
    b.close()
