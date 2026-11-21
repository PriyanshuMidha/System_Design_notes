/* reel kit: shared 3D + overlay runtime. A reel's scene.js defines:
   KC  = camera keys [[t,[px,py,pz],[lx,ly,lz],fov], ...]   (t in seconds; use E.<event> times)
   KW  = big keywords [[t0,t1,'TEXT','#hex'], ...]          (max one at a time)
   setup()      build the 3D world once (physics may be precomputed here)
   update(t)    pose everything for time t (must be deterministic: no Date, no Math.random)
   SHAKE = [[t,dur,amp], ...] optional camera shakes
   Globals available: THREE, CANNON, E (event times + total), WORDS, W, H, scene, cam, renderer,
   helpers V3 clamp ease eo ei lerp backOut rnd M box cyl sph glow sky ground label3d burst tween */
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const eo=x=>{x=clamp(x);return 1-Math.pow(1-x,3)};
const ei=x=>{x=clamp(x);return x*x*x};
const lerp=(a,b,u)=>a+(b-a)*u;
const backOut=x=>{x=clamp(x);const c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const tween=(t,t0,d,f=ease)=>f((t-t0)/d);            // 0..1 progress
const win=(t,a,b)=>t>=a&&t<b;                       // inside window
const rnd=(function(){let s=12345;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}})();

const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(W,H);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
document.getElementById('wrap').prepend(renderer.domElement);
const scene=new THREE.Scene();
const cam=new THREE.PerspectiveCamera(50,W/H,.1,600);
const hemi=new THREE.HemisphereLight(0xcfe4ff,0x404858,.8);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff2da,1.4);sun.position.set(-16,30,-14);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
{const sc=sun.shadow.camera;sc.left=-30;sc.right=30;sc.top=30;sc.bottom=-30;sc.near=1;sc.far=120;sun.shadow.bias=-.0005}
scene.add(sun);scene.add(sun.target);

function M(c,o={}){return new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.6,metalness:.1},o))}
function Mglow(c,i=1.5){return new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:i,roughness:.4})}
function addMesh(geo,mat,x,y,z,parent){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m}
function box(w,h,d,mat,x=0,y=0,z=0,parent){return addMesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent)}
function rbox(w,h,d,r,mat,x=0,y=0,z=0,parent){/* rounded box, outer size w x h x d */r=Math.min(r,w/2-.01,h/2-.01,d/2-.01);const a=w/2-r,b=h/2-r;const s=new THREE.Shape();s.moveTo(-a,-b);s.lineTo(a,-b);s.lineTo(a,b);s.lineTo(-a,b);s.lineTo(-a,-b);
 const g=new THREE.ExtrudeGeometry(s,{depth:Math.max(.001,d-2*r),bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:3,curveSegments:6});g.translate(0,0,-(d-2*r)/2);return addMesh(g,mat,x,y,z,parent)}
function cyl(rt,rb,h,mat,x=0,y=0,z=0,parent,seg=24){return addMesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat,x,y,z,parent)}
function sph(r,mat,x=0,y=0,z=0,parent){return addMesh(new THREE.SphereGeometry(r,24,16),mat,x,y,z,parent)}
function grp(x=0,y=0,z=0,parent){const g=new THREE.Group();g.position.set(x,y,z);(parent||scene).add(g);return g}

function gradTex(stops,h=256){const c=document.createElement('canvas');c.width=4;c.height=h;const g=c.getContext('2d');const gr=g.createLinearGradient(0,0,0,h);stops.forEach((s,i)=>gr.addColorStop(i/(stops.length-1),s));g.fillStyle=gr;g.fillRect(0,0,4,h);return new THREE.CanvasTexture(c)}
function sky(top,mid,bot,fogCol,fogNear=80,fogFar=300){scene.background=gradTex([top,mid,bot]);if(fogCol!==undefined)scene.fog=new THREE.Fog(fogCol,fogNear,fogFar)}
function ground(col,size=400,y=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(size,size),M(col,{roughness:.95}));m.rotation.x=-Math.PI/2;m.position.y=y;m.receiveShadow=true;scene.add(m);return m}
function grid(size,div,col,y=.01){const g=new THREE.GridHelper(size,div,col,col);g.position.y=y;g.material.transparent=true;g.material.opacity=.35;scene.add(g);return g}

const GT=(function(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.3,'rgba(255,255,255,.5)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)})();
function glow(col,size,parent){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:GT,color:col,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));s.scale.set(size,size,1);(parent||scene).add(s);return s}

/* text on a plane/sprite in 3D (signs, labels on objects). Keep words few. */
function textTex(txt,{w=512,h=128,font='900 72px -apple-system,Helvetica,Arial',fg='#fff',bg=null,radius=24,stroke=null}={}){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 if(bg){g.fillStyle=bg;g.beginPath();g.moveTo(radius,0);g.arcTo(w,0,w,h,radius);g.arcTo(w,h,0,h,radius);g.arcTo(0,h,0,0,radius);g.arcTo(0,0,w,0,radius);g.fill()}
 g.font=font;g.textAlign='center';g.textBaseline='middle';if(stroke){g.lineWidth=10;g.strokeStyle=stroke;g.strokeText(txt,w/2,h/2+4)}g.fillStyle=fg;g.fillText(txt,w/2,h/2+4);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
function label3d(txt,width,opts={},parent){const w=opts.w||512,h=opts.h||128;const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width*h/w),new THREE.MeshBasicMaterial({map:textTex(txt,opts),transparent:true,depthWrite:false,side:THREE.DoubleSide}));(parent||scene).add(m);return m}
function sprite3d(txt,width,opts={},parent){const w=opts.w||512,h=opts.h||128;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:textTex(txt,opts),transparent:true,depthWrite:false}));s.scale.set(width,width*h/w,1);(parent||scene).add(s);return s}

/* particle bursts: call setupBursts() is automatic; in update call burst(t,t0,pos,col,n,dur,size,spread) */
const _NP=120,_parts=[];for(let i=0;i<_NP;i++){const s=glow(0xffffff,.5);s.visible=false;_parts.push({s,a:rnd()*6.283,b:rnd()*2-1,v:.6+rnd()})}
let _pi=0;function _resetParts(){_pi=0;for(const p of _parts)p.s.visible=false}
function burst(t,t0,pos,col,n=24,dur=.8,size=.5,spread=3,grav=4){const u=(t-t0)/dur;if(u<0||u>1){_pi+=0;return}for(let k=0;k<n&&_pi<_NP;k++,_pi++){const p=_parts[_pi];p.s.visible=true;p.s.material.color.set(col);const r=p.v*spread*eo(u);p.s.position.set(pos.x+Math.cos(p.a)*r*Math.sqrt(1-p.b*p.b),pos.y+p.b*r*.8+Math.abs(p.b)*r*.4-grav*u*u,pos.z+Math.sin(p.a)*r*Math.sqrt(1-p.b*p.b));p.s.material.opacity=1-u;p.s.scale.setScalar(size*(1-u*.5))}}

/* camera: Catmull-Rom through KC keys */
function _herm(p0,p1,m0,m1,u){const u2=u*u,u3=u2*u;return(2*u3-3*u2+1)*p0+(u3-2*u2+u)*m0+(-2*u3+3*u2)*p1+(u3-u2)*m1}
function camAt(t){const K=KC;let i=0;while(i<K.length-2&&t>=K[i+1][0])i++;const a=K[i],b=K[i+1],pa=K[Math.max(0,i-1)],nb=K[Math.min(K.length-1,i+2)];const dt=Math.max(1e-3,b[0]-a[0]),u=clamp((t-a[0])/dt);
 const c=(f,k)=>{const va=a[f][k],vb=b[f][k],vpa=pa[f][k],vnb=nb[f][k];const m0=i>0?(vb-vpa)/(b[0]-pa[0])*dt:(vb-va);const m1=i<K.length-2?(vnb-va)/(nb[0]-a[0])*dt:(vb-va);return _herm(va,vb,m0*.5,m1*.5,u)};
 return{p:V3(c(1,0),c(1,1),c(1,2)),l:V3(c(2,0),c(2,1),c(2,2)),fov:lerp(a[3],b[3],ease(u))}}

/* post */
const _rt=new THREE.WebGLMultisampleRenderTarget(W,H);const composer=new THREE.EffectComposer(renderer,_rt);composer.addPass(new THREE.RenderPass(scene,cam));
const bloom=new THREE.UnrealBloomPass(new THREE.Vector2(W,H),.35,.5,.85);composer.addPass(bloom);

/* overlays: sting, keyword, karaoke captions, end card */
const _cap=document.getElementById('cap'),_kw=document.getElementById('kw'),_st=document.getElementById('sting'),_end=document.getElementById('end');
const CHUNKS=(function(){const out=[];let cur=[];WORDS.forEach((w,i)=>{cur.push(i);const txt=w[0];const brk=/[.,!?;:]$/.test(txt)||cur.length>=3;if(brk){out.push(cur);cur=[]}});if(cur.length)out.push(cur);
 return out.map(ix=>({ix,t0:WORDS[ix[0]][1],t1:(WORDS[ix[ix.length-1]+1]||[0,WORDS[ix[ix.length-1]][1]+.6])[1]}))})();
let _lastCap=-2,_lastKw=null;
function overlays(t){
 /* sting 0..1.1s */
 const su=t<1.15?1-ease((t-.8)/.35):0;_st.style.opacity=su;_st.style.transform='scale('+(1+.08*ease(t/1.1))+')';
 /* captions */
 let ci=-1;for(let k=0;k<CHUNKS.length;k++){if(t>=CHUNKS[k].t0-.05&&t<CHUNKS[k].t1+.05){ci=k}}
 if(t>E.total-2.6)ci=-1;
 if(ci!==_lastCap){_cap.innerHTML=ci<0?'':CHUNKS[ci].ix.map(i=>'<span data-t="'+WORDS[i][1]+'">'+WORDS[i][0].replace(/[,;:]$/,'')+'</span>').join(' ');_lastCap=ci}
 if(ci>=0){const sp=_cap.children;for(const s of sp){const on=t>=+s.dataset.t-.02;s.className=on?'on':''}const u=clamp((t-CHUNKS[ci].t0)/.12);_cap.style.transform='translateX(-50%) scale('+(.92+.08*u)+')'}
 /* keyword */
 let kw=null;for(const k of (typeof KW!=='undefined'?KW:[])){if(t>=k[0]&&t<k[1])kw=k}
 if(kw!==_lastKw){_kw.textContent=kw?kw[2]:'';if(kw)_kw.style.color=kw[3]||'#fff';_lastKw=kw}
 if(kw){const a=clamp((t-kw[0])/.18),b=clamp((kw[1]-t)/.18);_kw.style.opacity=Math.min(a,b);_kw.style.transform='translateX(-50%) scale('+backOut(a)*(1)+')'}else _kw.style.opacity=0;
 /* end card in the tail */
 const eu=ease((t-(E.total-2.4))/.4);_end.style.opacity=eu;_end.style.transform='translateY('+((1-eu)*40)+'px)';
}
function seek(t){_resetParts();update(t);const c=camAt(t);let sx=0;for(const s of (typeof SHAKE!=='undefined'?SHAKE:[])){const u=t-s[0];if(u>0&&u<s[1])sx+=Math.sin(u*70)*s[2]*(1-u/s[1])}
 cam.position.copy(c.p);cam.position.x+=sx;cam.position.y+=sx*.6;cam.fov=c.fov;cam.updateProjectionMatrix();cam.lookAt(c.l);overlays(t);composer.render()}
window.seek=seek;window.TOTAL=E.total;
try{setup();window.PHYS=true}catch(e){console.error('SETUP '+e.stack);window.PHYS=false}
seek(0);
