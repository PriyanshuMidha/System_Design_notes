import asyncio, json, subprocess, time, re
import edge_tts
TEXT=("Two crews are building one bridge, one from each bank. Nobody told them how high to build. "
"So when they meet in the middle... they don't. Here's the fix: a contract. One blueprint, and both crews follow it, bolt for bolt. "
"Now the two halves lock together, and the train rolls across. And here's the rule. Add a new lane any time you like. The train doesn't care. "
"But pull out a pillar, and everything that used to work comes crashing down. So write it first, then only add.")
async def main():
    for k in range(5):
        try:
            c=edge_tts.Communicate(TEXT,"en-US-AndrewMultilingualNeural",rate="+4%",boundary="WordBoundary")
            words=[];buf=bytearray()
            async for m in c.stream():
                if m["type"]=="audio": buf+=m["data"]
                elif m["type"]=="WordBoundary": words.append([m["text"],m["offset"]/1e7])
            break
        except Exception as e:
            print("retry",e); time.sleep(2)
    open("nar.mp3","wb").write(bytes(buf))
    d=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0","nar.mp3"]).decode())
    json.dump({"words":words,"dur":d},open("words.json","w"))
    print(len(words),d)
    print([ (w,round(t,2)) for w,t in words][:200])
asyncio.run(main())
