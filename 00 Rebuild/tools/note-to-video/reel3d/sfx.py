import numpy as np, json, wave
E=json.load(open('events.json'));SR=44100;TOT=E['total']
rng=np.random.default_rng(7)
buf=np.zeros(int(TOT*SR)+SR)
def add(t,x,g=1.0):
    i=int(t*SR);x=x*g;n=min(len(x),len(buf)-i);
    if n>0: buf[i:i+n]+=x[:n]
def env(n,a=.005,d=1.0):
    t=np.arange(n)/SR;return np.minimum(t/a,1)*np.exp(-t/d)
def lp(x,k):
    y=np.copy(x);
    for i in range(1,len(y)): y[i]=y[i-1]+k*(x[i]-y[i-1])
    return y
def noise(n): return rng.standard_normal(n)
def tone(f,n,dec=.3):
    t=np.arange(n)/SR;return np.sin(2*np.pi*f*t)*env(n,.002,dec)
def clang(g=1):
    n=int(.9*SR);return (tone(520,n,.35)+.7*tone(830,n,.25)+.5*tone(1410,n,.15)+.4*noise(n)*env(n,.001,.03))*.5*g
def clink(g=1):
    n=int(.35*SR);return (tone(1800,n,.08)+.6*tone(2650,n,.05))*.25*g
def whoosh(dur,g=1,up=True):
    n=int(dur*SR);x=lp(noise(n),.08);t=np.linspace(0,1,n);sh=np.sin(np.pi*t)**2;return x*sh*.8*g*(1.0)
def click(g=1):
    n=int(.12*SR);return (tone(2200,n,.02)+.5*noise(n)*env(n,.0005,.01))*.5*g
def rumble(dur,g=1):
    n=int(dur*SR);x=lp(noise(n),.01);t=np.linspace(0,1,n);return x*3.0*g*np.minimum(t*8,1)*np.minimum((1-t)*8,1)
def crack(g=1):
    n=int(.25*SR);return noise(n)*env(n,.0005,.05)*g*.7
def crash(g=1):
    n=int(2.2*SR);x=lp(noise(n),.15)*env(n,.003,.6)*2.2+noise(n)*env(n,.001,.08)*.5;return x*g*.6
def splash(g=1):
    n=int(1.6*SR);x=noise(n);x=x-lp(x,.05);return x*env(n,.01,.5)*g*.5
def creak(dur,g=1):
    n=int(dur*SR);t=np.arange(n)/SR;f=180+60*np.sin(t*9)+40*t;ph=np.cumsum(2*np.pi*f/SR);return np.sign(np.sin(ph))*.25*g*np.minimum(t*10,1)*np.minimum((dur-t)*6,1)
def chime(g=1):
    n=int(1.8*SR);return (tone(880,n,.6)+.6*tone(1320,n,.5)+.4*tone(1760,n,.4))*.18*g
for t in [1.0,1.9,2.8,3.7,1.3,2.2,3.1,4.0]: add(t,clink(),.7)
add(7.9,whoosh(1.2),.6)  # train arrives
add(E['dont'],clang(),1.0)
add(E['contract'],whoosh(1.6),.8)
for t in [13.4,13.78,14.27,14.62]: add(t,click(),.9)
add(E['lock'],clang(),1.3);add(E['lock'],rumble(.5),.5)
add(16.3,rumble(3.2),.9)
add(E['lane'],whoosh(1.1),.7);add(21.6,rumble(1.8),.4)
add(E['pillar']-.2,creak(1.3),.9)
add(E['crash']-.9,crack(),1.0);add(E['crash']-.4,creak(.6),.8)
add(E['crash'],crash(),1.0);add(E['crash']+.45,splash(),1.0)
add(E['first']-.1,whoosh(1.3),.8)
add(E['first']+1.3,chime(),1.0)
# music pad
t=np.arange(len(buf))/SR;ch=[(220,277.2,329.6),(196,246.9,293.7),(174.6,220,261.6),(196,246.9,293.7)]
pad=np.zeros(len(buf))
for k in range(len(buf)//SR+1):
    seg=slice(k*SR,min((k+1)*SR,len(buf)))
for idx,(a,b,c) in enumerate(ch*10):
    st=idx*4.5
    if st>TOT: break
    i0=int(st*SR);n=int(5.2*SR);tt=np.arange(n)/SR
    x=sum(np.sin(2*np.pi*f*tt)+.5*np.sin(2*np.pi*2*f*tt) for f in (a,b,c))*np.minimum(tt/1.5,1)*np.minimum((5.2-tt)/1.5,1)
    m=min(n,len(buf)-i0)
    if m>0: pad[i0:i0+m]+=x[:m]*.035
pad*=np.minimum(t/2,1)*np.minimum((TOT-t)/2.5,1).clip(0,1)
buf+=pad
buf=np.clip(buf/ (np.abs(buf).max()+1e-6)*.9,-1,1)
w=wave.open('sfx.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((buf*32767).astype(np.int16).tobytes());w.close();print('sfx ok',len(buf)/SR)
