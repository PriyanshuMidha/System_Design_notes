import os
HERE=os.path.dirname(os.path.abspath(__file__))+'/'
import json, subprocess, os, sys
from multiprocessing import Pool
from playwright.sync_api import sync_playwright
W=HERE
FPS=30
E=json.load(open(W+'events.json')); N=int(E['total']*FPS)
os.makedirs(W+'fr',exist_ok=True)
def chunk(ids):
    with sync_playwright() as p:
        b=p.chromium.launch(channel="chrome",args=["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
        pg=b.new_page(viewport={"width":1080,"height":1920}); pg.goto("file://"+W+"page.html"); pg.wait_for_timeout(2500)
        for i in ids:
            pg.evaluate(f"seek({i/FPS})"); pg.screenshot(path=W+f"fr/{i:05d}.jpg",type="jpeg",quality=92)
        b.close()
if __name__=="__main__":
    ids=list(range(N)); K=3
    with Pool(K) as pool: pool.map(chunk,[ids[k::K] for k in range(K)])
    out=sys.argv[1]
    d=int((E['T0'])*1000)
    fc=f"[1:a]adelay={d}|{d},volume=1.0[n];[2:a]volume=0.55[s];[n][s]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.0[a]"
    subprocess.check_call(['ffmpeg','-y','-loglevel','error','-framerate',str(FPS),'-i',W+'fr/%05d.jpg','-i',W+'nar.mp3','-i',W+'sfx.wav','-filter_complex',fc,'-map','0:v','-map','[a]','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-t',str(E['total']),'-movflags','+faststart',out])
    print('wrote',out)
