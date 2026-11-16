"""Turn words.json (from tts.py) into events.json: times of key words (edit KEYS) + total length.
usage: python events.py   (run after tts.py)"""
import json, os
HERE=os.path.dirname(os.path.abspath(__file__))+'/'
T0=1.0      # seconds of lead-in before the narration starts
TAIL=4.0    # seconds after narration ends
# name -> (word, occurrence index). Edit to match YOUR narration; reel.html reads these as E.<name>
KEYS={'nobody':('Nobody',0),'meet':('meet',0),'dont':("don't",0),'contract':('contract',0),'bolt1':('bolt',0),'bolt2':('bolt',1),
      'lock':('lock',0),'train':('train',0),'rolls':('rolls',0),'rule':('rule',0),'lane':('lane',0),'care':('care',0),
      'pillar':('pillar',0),'crash':('crashing',0),'first':('first',0),'add':('add',1)}
d=json.load(open(HERE+'words.json'));w=d['words']
def at(word,k):
    c=0
    for t,o in w:
        if t.strip(".,:").lower()==word.lower():
            if c==k: return round(o+T0,2)
            c+=1
    raise SystemExit('word not found: '+word)
ev={n:at(*v) for n,v in KEYS.items()};ev['dur']=d['dur'];ev['T0']=T0;ev['total']=round(T0+d['dur']+TAIL,2)
json.dump(ev,open(HERE+'events.json','w'));print(ev)
