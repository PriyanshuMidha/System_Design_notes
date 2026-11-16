import os
HERE=os.path.dirname(os.path.abspath(__file__))+'/'
import json,sys
W=open(HERE+'reel.html').read()
w,h=int(sys.argv[1]),int(sys.argv[2]);out=sys.argv[3]
ev=open(HERE+'events.json').read()
W=W.replace('__EV__',ev).replace('__W__',str(w)).replace('__H__',str(h)).replace('__TT__',str(int(h*.2))).replace('__F1__',str(int(w*.095))).replace('__F2__',str(int(w*.042)))
open(out,'w').write(W)
