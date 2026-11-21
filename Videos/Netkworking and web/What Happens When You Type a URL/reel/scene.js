/* EP1 What happens when you type a URL: neon speedrun track, 6 levels */
const KC=[
 [0,[5,3.4,4.2],[0,.6,0],46],[E.enter,[4.4,3.2,3.8],[0,.5,0],42],[E.slow,[2.5,6,7.5],[-2,2,0],52],
 [E.notes-1.2,[-4,3,2.2],[6,1,0],55],[E.notes,[5,3.4,5],[10,1.6,-2],48],[E.dns-1.3,[8,3,2.6],[14,1,0],50],
 [E.dns,[11,3,9.5],[20,5.5,-3],60],[E.dns+2.3,[16,2.2,4],[21,2.4,-1],48],
 [E.tcp,[25,4.5,6],[33.5,1.2,0],54],[E.tcp+2.7,[31,4.2,6.5],[37,1.2,0],52],
 [E.tls,[38,3,4.2],[44,2,0],48],[E.tls+1.9,[39.5,3.4,6],[44,1.8,-.5],48],[E.key,[50.5,4.2,7.5],[45,1.8,-1],50],
 [E.flies,[46,2,3.2],[52,2,0],50],[E.flies+1.5,[52,9,10],[58,6,0],56],[E.edge,[60,4,6.5],[64,1.6,0],48],
 [E.cached,[59,5,8.5],[52,3,0],52],[E.cached+1.9,[62,3.2,3.4],[70,1,0],50],
 [E.lb,[72,6.5,7.5],[80,1,0],52],[E.server,[79.5,5,8.5],[86,1.8,0],50],[E.database,[85.5,4.6,8],[92,1.8,0],50],
 [E.html,[88,6,8.5],[80,6,0],55],[E.html+1.4,[40,22,28],[18,6,0],62],[E.html+2.5,[3,6,5],[-8.6,5.5,0],50],
 [E.files-.6,[5,6.5,9],[-8.6,5.5,0],56],[E.side,[2,6,5],[-8.6,5.5,0],50],[E.paints,[.4,5.6,2.4],[-8.6,5.5,0],50],
 [E.paints+.95,[.6,5.7,2.8],[-8.6,5.5,0],50],[E.name+.7,[-6,16,22],[30,0,-2],58],[E.six-.2,[4,18,24],[40,0,-2],58],
 [E.six+.6,[8,5,6.5],[0,1,-1],48],[E.under,[4.4,3.2,3.8],[0,.5,0],42],[E.total,[4.8,3.4,4.3],[0,.5,0],44]];
const KW=[[E.enter-.2,E.slow-.2,'PRESS ENTER','#ffe14d'],[E.notes-1.3,E.dns-.3,'CACHE?','#9fe7ff'],[E.dns,E.tcp-.5,'DNS','#4fd1ff'],
 [E.tcp,E.tls-.4,'TCP','#7dff9a'],[E.tls,E.flies-1,'TLS','#ffd36a'],[E.edge-1.5,E.lb-1.6,'CDN EDGE','#ff9df0'],[E.lb,E.html-.2,'SERVER','#ff9a6b'],
 [E.html,E.files-.8,'HTML','#ffffff'],[E.files-.4,E.builds,'FETCH','#9fe7ff'],[E.builds,E.paints+1,'BUILD + PAINT','#ffe14d'],[E.six,E.end+.2,'< 1 SECOND','#ffe14d']];
const SHAKE=[[E.enter,.35,.05],[E.key,.4,.05],[E.edge,.3,.04],[E.under,.35,.05]];
let orb,orbGlow,trail=[],key,keyTop,mon,scrC,scrG,scrT,book,bookCover,dnsSlabs=[],plate,gates=[],arch,scanRing,badge,vault,lockRing,kiosk,ghost,rails=[],servers=[],dbs=[],scroll,files=[],hl=[],hud,keyA,keyB,timerEl;
function setup(){
 sky('#03040f','#0b1240','#3a1650',0x0b0b26,40,170);renderer.toneMappingExposure=1.0;hemi.intensity=.8;sun.intensity=.9;
 const g=ground(0x070b1e,500);grid(500,250,0x3346ff);
 /* track */
 box(102,.08,.32,Mglow(0x37e2ff,1.2),45,.05,0);[-1,1].forEach(s=>box(102,.06,.08,Mglow(0xff4fd8,1.0),45,.05,s*.95));
 /* enter key + monitor */
 box(3.4,.4,3.4,M(0x1b2040),0,.2,0);key=grp(0,.4,0);rbox(2.6,.7,2.6,.22,M(0xb8bdd8,{roughness:.45}),0,.35,0,key);
 keyTop=label3d('ENTER ⏎',2.2,{fg:'#1b2040',font:'900 120px -apple-system,Helvetica'},key);keyTop.position.set(1.32,.35,0);keyTop.rotation.set(0,Math.PI/2,0);
 mon=grp(-9,0,0);box(2,1.2,5.4,M(0x2a2f50),0,.6,0,mon);rbox(.5,8.2,4.7,.35,M(0x181c34,{metalness:.6,roughness:.3}),0,5.5,0,mon);
 scrC=document.createElement('canvas');scrC.width=560;scrC.height=1000;scrG=scrC.getContext('2d');scrT=new THREE.CanvasTexture(scrC);
 const scr=new THREE.Mesh(new THREE.PlaneGeometry(4.2,7.5),new THREE.MeshBasicMaterial({map:scrT}));scr.position.set(.27,5.5,0);scr.rotation.y=Math.PI/2;mon.add(scr);
 /* notebook (browser cache) */
 book=grp(10,0,-2.6);box(3,.25,4,M(0x6a3cff),0,.6,0,book);box(2.8,.22,3.8,M(0xfafaff),0,.8,0,book);bookCover=grp(-1.5,.95,0,book);box(3,.12,4,M(0x8a5cff),1.5,0,0,bookCover);
 /* DNS tower */
 for(let i=0;i<9;i++){const s=rbox(3.4,1.1,3.4,.12,M(i%2?0x1f6fff:0x2fb8ff,{roughness:.3,emissive:i%2?0x0a2a80:0x0a4a70,emissiveIntensity:.6}),20,.6+i*1.2,-3.4);dnsSlabs.push(s)}
 
 plate=sprite3d('IP 93.184.216.34',3.4,{fg:'#06223a',bg:'#7fe9ff',font:'900 64px -apple-system,Helvetica'});
 /* TCP gates */
 [31,33,35].forEach((x,i)=>{const gp=grp(x,0,0);box(.3,3.2,.3,M(0x2a3050),0,1.6,-1.5,gp);box(.3,3.2,.3,M(0x2a3050),0,1.6,1.5,gp);box(.3,.3,3.3,M(0x2a3050),0,3.25,0,gp);
  const L=grp(0,0,-1.35,gp),R=grp(0,0,1.35,gp);const dm=Mglow(0xff4060,.8);box(.16,2.6,1.3,dm,0,1.5,.65,L);box(.16,2.6,1.3,dm,0,1.5,-.65,R);gates.push({L,R,dm})});
 /* TLS arch + vault */
 arch=new THREE.Mesh(new THREE.TorusGeometry(2.3,.28,16,48),M(0x2a3050,{metalness:.6,roughness:.3}));arch.position.set(44,2.3,0);arch.rotation.y=Math.PI/2;scene.add(arch);
 scanRing=new THREE.Mesh(new THREE.TorusGeometry(1.0,.05,8,48),Mglow(0x5cff9d,2.5));scanRing.rotation.y=Math.PI/2;scene.add(scanRing);
 badge=sprite3d('ID ✓ VERIFIED',3.2,{fg:'#063a1c',bg:'#6dffa8',font:'900 62px -apple-system,Helvetica'});
 keyA=sph(.22,Mglow(0xffd36a,2),0,0,0);keyB=sph(.22,Mglow(0xffd36a,2),0,0,0);
 const srv=grp(44,0,-5);box(1.6,4.5,1.6,M(0x4a5aa0,{metalness:.4,roughness:.4}),0,2.25,0,srv);for(let i=0;i<5;i++)box(1.65,.08,1.2,Mglow(0x37e2ff,1),0,.8+i*.8,0,srv);
 vault=grp(46.6,0,0);cyl(2.1,2.1,.4,M(0x9aa3c0,{metalness:.8,roughness:.25}),0,0,0,vault,40).rotation.z=Math.PI/2;cyl(.6,.6,.5,M(0xffd36a,{metalness:.8}),0,0,0,vault).rotation.z=Math.PI/2;
 lockRing=new THREE.Mesh(new THREE.TorusGeometry(.75,.08,8,40),Mglow(0xffd36a,2));scene.add(lockRing);
 /* ramp */
 const rp=box(5,.2,2,M(0x2a3050),51.5,.8,0);rp.rotation.z=.32;
 /* CDN kiosk */
 kiosk=grp(64,0,0);rbox(3.2,2.8,3.2,.2,M(0x2a1840),0,1.4,0,kiosk);box(3.8,.3,3.8,Mglow(0xff4fd8,1.2),0,2.95,0,kiosk);
 ghost=sph(.4,Mglow(0xff7be8,2));
 /* LB + servers + db */
 const hub=cyl(1.4,1.6,1.2,M(0x283060,{metalness:.5}),78,.6,0,null,8);box(1.6,.2,1.6,Mglow(0xffa040,1.2),78,1.3,0);
 [-4,0,4].forEach(z=>{const len=Math.hypot(8,z);const r=box(len,.08,.25,Mglow(0xffa040,.8),82,.08,z/2);r.rotation.y=-Math.atan2(z,8);rails.push(r);
  const s=grp(86,0,z);box(1.8,4,1.8,M(0x4a5aa0,{metalness:.4,roughness:.4}),0,2,0,s);const leds=[];for(let i=0;i<6;i++)leds.push(box(.1,.14,.14,Mglow(0x57ff8a,1.5),.92,.8+i*.55,.5,s));servers.push({s,leds})});
 for(let i=0;i<3;i++)dbs.push(cyl(1.5,1.5,1.0,M(0xffb84d,{emissive:0x6a3a00,emissiveIntensity:.6,roughness:.35}),92,.6+i*1.15,0,null,32));
 /* orb + trail + scroll */
 orb=sph(.42,Mglow(0x5ff4ff,1.2));orbGlow=glow(0x5ff4ff,1.8);for(let i=0;i<10;i++)trail.push(glow(0x5ff4ff,.9));
 scroll=grp();cyl(.18,.18,1.6,M(0xfff6e0),0,0,0,scroll).rotation.x=Math.PI/2;const pp=box(.04,1.2,1.5,M(0xfff6e0),.0,-.6,0,scroll);const tg=sprite3d('</>',1.4,{fg:'#ff8a5c',font:'900 110px Menlo,monospace'},scroll);tg.position.set(0,.9,0);
 for(let i=0;i<8;i++)files.push(rbox(.6,.6,.6,.08,Mglow([0x5ff4ff,0xffd36a,0xff7be8,0x7dff9a][i%4],1.1)));
 /* recap highlights */
 [[10,-2.6],[20,-3.4],[33,0],[44,0],[64,0],[86,0],[-9,0]].forEach(p=>{const s=glow(0xffffff,10);s.position.set(p[0],3,p[1]);s.material.opacity=0;hl.push(s)});
 /* HUD timer */
 hud=document.createElement('div');hud.style.cssText='position:absolute;left:50%;top:96px;transform:translateX(-50%);font:900 54px Menlo,monospace;color:#7fe9ff;letter-spacing:3px;background:rgba(5,8,25,.6);padding:10px 26px;border-radius:20px;border:2px solid rgba(127,233,255,.35)';document.getElementById('wrap').appendChild(hud);
}
/* orb path */
const OK=[[0,0,1.25,0],[E.slow+.6,0,1.25,0],[E.notes,10,1,0],[E.notes+2.4,12.5,1,0],[E.dns,19,1,0],[E.dns+2.3,21,1,0],[E.tcp+.6,29.5,1,0],[15.2,31.5,1,0],[15.6,33.5,1,0],[16.0,35.5,1,0],[E.tls,40,1,0],[E.tls+1.1,44,1.1,0],[E.key-.3,44,1.1,0],[E.key+.4,47.8,1,0],[E.flies,49,1,0]];
function pathAt(t){if(t<=OK[0][0])return V3(OK[0][1],OK[0][2],OK[0][3]);
 for(let i=0;i<OK.length-1;i++){const a=OK[i],b=OK[i+1];if(t<b[0]){const u=ease((t-a[0])/(b[0]-a[0]));return V3(lerp(a[1],b[1],u),lerp(a[2],b[2],u),lerp(a[3],b[3],u))}}
 if(t<E.edge){const u=(t-E.flies)/(E.edge-E.flies);return V3(lerp(49,64,u),1+Math.sin(Math.PI*u)*8.5,0)}
 if(t<E.cached+1.8)return V3(64,1.5,0);
 if(t<E.lb){const u=ease((t-E.cached-1.8)/(E.lb-E.cached-1.8));return V3(lerp(64,78,u),1,0)}
 if(t<E.server){const u=ease((t-E.lb)/(E.server-E.lb));return V3(lerp(78,85,u),1.2,0)}
 if(t<E.database){const u=ease((t-E.server)/(E.database-E.server));return V3(lerp(85,90.6,u),lerp(1.2,2.2,u),0)}
 if(t<E.html)return V3(90.6,2.2,0);
 const T2=E.html+2.4;if(t<T2){const u=ease((t-E.html)/(T2-E.html));return V3(lerp(90.6,-8.4,u),lerp(2.2,5.5,u)+Math.sin(Math.PI*u)*16,0)}
 return V3(-8.4,5.5,0)}
function drawScreen(t){const g=scrG,w=560,h=1000;g.fillStyle='#0d1022';g.fillRect(0,0,w,h);
 g.fillStyle='#232842';g.fillRect(0,0,w,80);g.fillStyle='#0d1022';g.fillRect(30,20,500,42);g.fillStyle='#9fb0ff';g.font='600 28px -apple-system';g.fillText('🔒 example.com',50,50);
 const lu=clamp((t-E.html-2.3)/1.0);if(lu>0&&t<E.builds){g.fillStyle='rgba(159,231,255,'+(.8*lu)+')';g.font='700 36px Menlo';['<html>','<head>','<body>','img.png','style.css','app.js'].forEach((x,i)=>g.fillText(x,50,160+i*70))}
 const b=clamp((t-E.builds)/1.0),p=clamp((t-E.paints)/.9);
 const blocks=[[30,100,500,110,'#4f7cff'],[30,230,500,250,'#ff7be8'],[30,500,240,210,'#ffd36a'],[290,500,240,210,'#5ff4ff'],[30,730,500,230,'#7dff9a']];
 blocks.forEach((bk,i)=>{const u=clamp(b*blocks.length-i);if(u<=0)return;g.strokeStyle='rgba(200,210,255,.8)';g.lineWidth=4;g.strokeRect(bk[0],bk[1],bk[2],bk[3]*u);
  if(p>0){const fillH=bk[3]*clamp(p*1.6-i*.12);g.fillStyle=bk[4];g.fillRect(bk[0],bk[1],bk[2],fillH)}});
 if(p>.7){g.fillStyle='#fff';g.font='900 50px -apple-system';g.fillText('Hello, page!',60,170)}
 scrT.needsUpdate=true}
function update(t){
 const P=pathAt(t);const inScroll=t>=E.html&&t<E.html+2.4,atScreen=t>=E.html+2.4,loopBack=t>=E.six+.4;
 let op=P.clone();if(loopBack)op=V3(0,1.25,0);
 orb.position.copy(op);orbGlow.position.copy(op);orb.visible=!inScroll&&!(atScreen&&!loopBack);orbGlow.visible=orb.visible;
 const pulse=1+.08*Math.sin(t*9);orb.scale.setScalar(pulse*(loopBack?ease((t-E.six-.4)/.5):1));orbGlow.material.opacity=.8;
 trail.forEach((s,i)=>{const q=pathAt(t-.045*(i+1));s.position.copy(q);s.visible=orb.visible&&!loopBack&&t>E.slow+.6&&t<E.html;s.material.opacity=.5*(1-i/10);s.scale.setScalar(.9*(1-i/12))});
 scroll.visible=inScroll;if(inScroll){scroll.position.copy(P);scroll.rotation.set(0,0,t*4)}
 /* key press at enter and under */
 const kp=Math.max(win(t,E.enter-.1,E.enter+.5)?Math.sin(Math.PI*clamp((t-E.enter+.1)/.6)):0,win(t,E.under-.1,E.under+.5)?Math.sin(Math.PI*clamp((t-E.under+.1)/.6)):0);key.position.y=.4-.28*kp;
 if(!loopBack&&t<E.slow+.6)orb.position.y=1.25-.28*kp;
 burst(t,E.enter,V3(0,1,0),0x5ff4ff,30,.9,.3,4,0);burst(t,E.under,V3(0,1,0),0xffe14d,30,.9,.3,4,0);
 /* notebook */
 const bo=ease((t-E.notes+.3)/.6)*(1-ease((t-E.dns+.8)/.5));bookCover.rotation.z=bo*2.6;
 /* DNS lookup: slab slides, plate flies to orb */
 dnsSlabs.forEach((s,i)=>{const act=i===5;const u=act?ease((t-E.dns-.2)/.6)*(1-ease((t-E.tcp)/.6)):0;s.position.z=-3.4+u*2.2;s.material.emissiveIntensity=.6+(act?u*1.5:0)+.5*Math.max(0,Math.sin((t-E.dns)*6-i))*(win(t,E.dns,E.dns+1.2)?1:0)});
 const pu=ease((t-E.dns-1.4)/.9);plate.visible=win(t,E.dns+.6,E.tcp+.3);plate.position.set(lerp(20,P.x,pu),lerp(6.6+.6,P.y+1.4,pu),lerp(-1.2,0,pu));
 /* TCP gates open on the three words */
 [15.15,15.45,15.75].forEach((tt,i)=>{const o=backOut((t-tt)/.35);gates[i].L.rotation.y=-o*1.35;gates[i].R.rotation.y=o*1.35;gates[i].dm.color.setHex(o>.5?0x57ff8a:0xff4060);gates[i].dm.emissive.setHex(o>.5?0x57ff8a:0xff4060);burst(t,tt,V3([31,33,35][i],2,0),0x7dff9a,14,.5,.4,2.5,1)});
 /* TLS */
 const su=clamp((t-E.tls-1.0)/.9);scanRing.visible=win(t,E.tls+1.0,E.tls+2.1);scanRing.position.set(44,lerp(.2,2.2,Math.abs(Math.sin(su*Math.PI*2))),0);scanRing.scale.setScalar(1);
 badge.visible=win(t,E.tls+1.9,E.key+.3);badge.position.set(44,2.5+.15*backOut((t-E.tls-1.9)/.3),0);badge.scale.set(2.2*backOut((t-E.tls-1.9)/.3),.55*backOut((t-E.tls-1.9)/.3),1);
 const ku=ease((t-E.key+1.4)/1.3);keyA.visible=keyB.visible=win(t,E.key-1.5,E.key+.1);keyA.position.set(44,lerp(1.1,2.2,ku),lerp(0,-2.5,ku));keyB.position.set(44,lerp(4,2.2,ku),lerp(-5,-2.5,ku));
 burst(t,E.key,V3(44,2.2,-2.5),0xffd36a,30,.7,.5,3,0);
 vault.rotation.y=(1-ease((t-E.key-.1)/.5))*1.4;vault.position.set(46.6,2.1,0);
 lockRing.visible=t>E.key+.3&&t<E.html;lockRing.position.copy(op);lockRing.rotation.set(t*2,t*3,0);
 /* CDN + ghost */
 kiosk.children[1].material.emissiveIntensity=1.2+(win(t,E.edge,E.edge+.5)?2*(1-(t-E.edge)/.5):0);burst(t,E.edge,V3(64,2.5,0),0xff7be8,30,.7,.5,3,1);
 const gu=(t-E.cached)/1.8;ghost.visible=gu>0&&gu<1;ghost.position.set(lerp(64,0,ease(gu)),1.5+Math.sin(Math.PI*gu)*9,0);ghost.material.emissiveIntensity=2*(1-gu);
 /* LB rails + servers */
 rails.forEach((r,i)=>{r.material.emissiveIntensity=i===1&&t>E.lb?2:.6});
 servers.forEach((s,i)=>s.leds.forEach((l,k)=>{l.material.emissiveIntensity=(i===1&&win(t,E.server-.2,E.html))?(Math.sin(t*20+k*2)>0?2.5:.2):(Math.sin(t*3+k+i)>.6?1.5:.3)}));
 dbs.forEach((d,i)=>{d.material.emissiveIntensity=.6+(win(t,E.database,E.html)?1.4*Math.max(0,Math.sin((t-E.database)*8-i)):0)});
 /* files fetched side by side */
 files.forEach((f,i)=>{const a=i/8*Math.PI*2;const out=ease((t-E.files)/.7),back=ease((t-E.side)/.7);const r=out*(1-back)*4.2;f.visible=win(t,E.files,E.side+.75);f.position.set(-7.5+out*(1-back)*2.5,5.5+Math.sin(a)*r*.75,Math.cos(a)*r);f.rotation.set(t*3+i,t*2,0)});
 drawScreen(t);burst(t,E.paints+.5,V3(-7.8,5.5,0),0xffe14d,40,1.0,.5,5,0);
 /* recap highlight pulses */
 const rk=[E.name,E.name+.3,E.name+.7,E.name+1.3,E.name+1.7,E.name+2.0,E.name+2.3];hl.forEach((s,i)=>{const u=(t-rk[i])/1.4;s.material.opacity=u>0&&u<1?Math.sin(Math.PI*u)*.9:0;s.scale.setScalar(10+6*u)});
 /* HUD timer: slow-motion clock 0 -> 0.48 s */
 const clock=clamp((t-E.enter)/(E.under-E.enter))*0.48;hud.textContent=(t<E.enter?'0.000':clock.toFixed(3))+' s';hud.style.opacity=t<1.1?0:1;
}
