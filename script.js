/* ===== settings you may tweak ===== */
const CFG={
  // which way each sprite looks in the picture: 'left' | 'right' | 'front' (front is never mirrored)
  faces:{walk:'left',hi:'front',wave:'front',point:'left',tipping:'left',bye:'front'},
  handY:.5,     // how far down the pointing sprite her hand is (0 = top, 1 = bottom)
  stride:.5     // bigger = slower steps
};
const GACHA_URL="https://gacha-machine-rho.vercel.app/"; // paste your published Gacha Machine link here
/* ================================== */
gsap.registerPlugin(ScrollTrigger);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],SM=()=>innerWidth<=800,S={};
function setPose(el,p,d,t){
  if(el._p!==p||el._d!==d){el._p=p;el._d=d;el.dataset.p=p;const f=CFG.faces[p];el.querySelector('.s.'+p).style.setProperty('--sx',(f==='front'||f===d)?1:-1)}
  const b=el.querySelector('.bubble');if(b.textContent!==(t||''))b.textContent=t||'';b.classList.toggle('on',!!t)}
$$('.char').forEach(c=>{c.innerHTML='<div class="bubble"></div><div class="bob"><div class="idle">'+['walk','hi','wave','point','tipping','bye'].map(p=>'<div class="s '+p+'"></div>').join('')+'</div></div>';setPose(c,'walk','left','')});
['hi','tipping','bye'].forEach(p=>{const im=new Image();im.onload=()=>$$('.s.'+p).forEach(e=>e.style.aspectRatio=im.naturalWidth+'/'+im.naturalHeight);im.src='images/'+p+'.webp'});
// make sure the bye picture (images/bye.webp) is used even if style.css has no rule for it
$$('.s.bye').forEach(e=>{e.style.backgroundImage='url(images/bye.webp)';e.style.backgroundSize='contain';e.style.backgroundRepeat='no-repeat';e.style.backgroundPosition='center bottom'});
// steps are driven by the distance she has travelled, so feet and ground stay in sync
function stepBob(el,dist){const h=el.offsetHeight,ph=dist/(h*CFG.stride)*Math.PI;gsap.set(el.querySelector('.bob'),{y:-Math.abs(Math.sin(ph))*h*.03,rotation:Math.sin(ph)*1.8})}
function actor(el,tl,plan,tick){let w=false;tl.eventCallback('onUpdate',()=>{const t=tl.time(),s=plan.find(s=>t>=s.a&&t<s.b)||(t<plan[0].a?plan[0]:plan[plan.length-1]);
  setPose(el,s.p,s.d,s.t);if(s.p==='walk'){stepBob(el,gsap.getProperty(el,'x'));w=true}else if(w){gsap.to(el.querySelector('.bob'),{y:0,rotation:0,duration:.2,overwrite:true});w=false}tick&&tick(t)})}
function scene(id,end,tl0){const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#'+id,start:'top top',end:end,pin:true,scrub:1,invalidateOnRefresh:true}});S[id]=tl.scrollTrigger;return tl}
const R=()=>innerWidth+40, CW=el=>el.offsetWidth;

/* typed name: types Aleezay letter by letter, waits 10s, deletes, types again */
const NAME='Aleezay',ty={set textContent(v){$$('.typed').forEach(e=>e.textContent=v)}},TY={on:false,t:0};
function typeLoop(){let i=0,dir=1;const step=()=>{if(!TY.on)return;ty.textContent=NAME.slice(0,i);let d;
  if(dir>0){if(i<NAME.length){i++;d=150}else{dir=-1;d=10000}}else{if(i>0){i--;d=80}else{dir=1;d=600}}
  TY.t=setTimeout(step,d)};step()}
function typeStart(){if(TY.on)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){ty.textContent=NAME;return}TY.on=true;typeLoop()}
function typeStop(){TY.on=false;clearTimeout(TY.t);ty.textContent=''}

/* 1 · photo flips and grows; the big "Hi, I’m Aleezay." travels to the intro block */
function hmv(k){const a=$('#hi').getBoundingClientRect(),b=$('#introh').getBoundingClientRect();return gsap.getProperty('#hi',k)+(k==='x'?(b.left+b.width/2)-(a.left+a.width/2):(b.top+b.height/2)-(a.top+a.height/2))}
gsap.set('#intro',{opacity:0});
const hm=scene('home','+=150%').to('#hint',{opacity:0,duration:.3},0).to('.role',{y:-60,opacity:0,duration:.8},0).fromTo('#hi',{x:0,y:0,scale:1,opacity:1},{x:()=>hmv('x'),y:()=>hmv('y'),scale:()=>parseFloat(getComputedStyle($('#introh')).fontSize)/parseFloat(getComputedStyle($('#hi')).fontSize),duration:2.2,ease:'power2.inOut',immediateRender:false},0).to('#hi',{opacity:0,duration:.5},1.9).fromTo('.ring',{scale:()=>SM()?1.2:1.35},{scale:1,duration:2,ease:'power2.inOut'},0)
 .fromTo('.photo',{scale:1,rotationY:0,x:0,y:0,transformPerspective:900},{rotationY:360,scale:()=>SM()?1.9:2.8,x:()=>SM()?0:-innerWidth*.24,y:()=>SM()?-innerHeight*.2:0,duration:2,ease:'power2.inOut'},0)
 .to('#intro',{opacity:1,duration:1},1.3);
typeStart();

/* 3 · computer: she stops beside it, it flips and shows my work */
const c2=$('#c2'),comp=$('#computer'),dk=scene('desk','+=650%');
const zm=$('#zoom'),zin=$('#zin'),dsk=$('#desk'),DW=()=>SM()?460:1200,FW=()=>dsk.clientWidth,FH=()=>dsk.clientHeight;
const zx=()=>comp.offsetLeft+8,zy=()=>comp.offsetTop+8,zw=()=>comp.offsetWidth-16,zh=()=>comp.offsetHeight*.8-16;   // the monitor's screen
const maxY=()=>-Math.max(0,zin.offsetHeight*FW()/DW()-FH());
const initZ=()=>{zin.style.width=DW()+'px';gsap.set(zm,{left:zx(),top:zy(),width:zw(),height:zh(),borderRadius:6});gsap.set(zin,{transformOrigin:'0 0',scale:zw()/DW()})};
initZ();ScrollTrigger.addEventListener('refreshInit',initZ);
const dStop=()=>SM()?(innerWidth-CW(c2))/2:comp.getBoundingClientRect().left+CW(comp)+40;
dk.fromTo(c2,{x:R},{x:dStop,duration:3},0)
  .to('#cflip',{rotationY:180,duration:3,ease:'power2.inOut'},4)
  /* zoom the monitor to full screen, scroll the portfolio, zoom back out */
  .fromTo(zm,{opacity:0},{opacity:1,duration:.1,immediateRender:false},7.3)
  .fromTo(zm,{left:zx,top:zy,width:zw,height:zh,borderRadius:6},{left:0,top:0,width:FW,height:FH,borderRadius:0,duration:2,ease:'power2.inOut',immediateRender:false},7.5)
  .fromTo(zin,{scale:()=>zw()/DW(),y:0},{scale:()=>FW()/DW(),y:0,duration:2,ease:'power2.inOut',immediateRender:false},7.5)
  .fromTo(zin,{y:0},{y:maxY,duration:11,ease:'none',immediateRender:false},9.5)
  .to({},{duration:1},20.5)
  .fromTo(zm,{left:0,top:0,width:FW,height:FH,borderRadius:0},{left:zx,top:zy,width:zw,height:zh,borderRadius:6,duration:2,ease:'power2.inOut',immediateRender:false},21.5)
  .fromTo(zin,{scale:()=>FW()/DW(),y:maxY},{scale:()=>zw()/DW(),y:0,duration:2,ease:'power2.inOut',immediateRender:false},21.5)
  .fromTo(zm,{opacity:1},{opacity:0,duration:.1,immediateRender:false},23.5)
  .to({},{duration:.8},23.6);
actor(c2,dk,[{a:0,b:3,p:'walk',d:'left'},{a:3,b:4,p:'wave',d:'left',t:'Let me switch this on…'},{a:4,b:99,p:'point',d:'left',t:'A Little About Me✨'}]);

/* 4 · phone slides in, she tips it over, it becomes a desktop, zooms to full screen and back.
       She says bye and walks away (she never walks in front of the screen). The desktop does not scroll. */
const c3=$('#c3'),dev=$('#device'),phs=$('#phone'),pn=scene('phone','+=1100%');
const DESK={live:false,hint:document.createElement('div')};
DESK.hint.textContent='Use the site · scroll to its end to zoom back out';
DESK.hint.style.cssText='position:absolute;left:50%;bottom:18px;transform:translateX(-50%);padding:8px 16px;border-radius:999px;background:rgba(40,40,50,.82);color:#fff;font:600 13px Nunito,sans-serif;opacity:0;transition:opacity .3s;pointer-events:none;z-index:50;white-space:nowrap';
phs.append(DESK.hint);
const PW=()=>SM()?150:250,PH=()=>SM()?260:420,DX0=()=>SM()?-innerWidth*.16:-innerWidth*.14;
const DWd=()=>SM()?Math.min(innerWidth*.92,430):Math.min(innerWidth*.7,1040),DHd=()=>SM()?DWd()*.68:Math.min(DWd()*.72,innerHeight*.7);
const DXd=()=>SM()?0:-Math.min(innerWidth*.1,140);   // desktop sits a little left
const pStop=()=>innerWidth/2+DX0()+(SM()?PH()/2:PW()/2+PH())+16;   // clear of the fallen phone, so it never touches her
// offsets that put the device's centre on the centre of the section (= full screen)
const fsX=()=>{const p=dev.offsetParent||phs,a=p.getBoundingClientRect(),s=phs.getBoundingClientRect();return (s.left+s.width/2)-(a.left+dev.offsetLeft)};
const fsY=()=>{const p=dev.offsetParent||phs,a=p.getBoundingClientRect(),s=phs.getBoundingClientRect();return (s.top+s.height/2)-(a.top+dev.offsetTop)};
gsap.set(dev,{xPercent:-50,yPercent:-50,transformPerspective:1400});
pn.fromTo(dev,{x:()=>-(innerWidth/2+PW())},{x:DX0,duration:2},0)
  .fromTo(c3,{x:R},{x:pStop,duration:3},2.4)
  /* she says bye, then walks off to the right and does not come back */
  .to(c3,{x:R,duration:1.8},12.2)
  /* the phone FLIPS (turns edge-on, comes back around as a desktop), it does not tip over */
  .to(dev,{rotationY:90,duration:1.2,ease:'power2.in'},13.2)
  .fromTo(dev,{rotationY:-90,x:DXd,y:0,width:DWd,height:DHd,borderRadius:14},{rotationY:0,x:DXd,y:0,width:DWd,height:DHd,borderRadius:14,duration:1.6,ease:'power2.out',immediateRender:false},14.4)
  .to('.notch',{opacity:0,duration:.4},14.2).to('.stand,#device .base',{opacity:1,duration:.8},17.4)
  /* zoom the desktop to full screen, hold, then zoom back out */
  .to('.stand,#device .base',{opacity:0,duration:.4},18.6)
  .fromTo(dev,{x:DXd,y:0,width:DWd,height:DHd,borderRadius:14},{x:fsX,y:fsY,width:()=>phs.clientWidth,height:()=>phs.clientHeight,borderRadius:0,duration:2,ease:'power2.inOut',immediateRender:false},18.6)
  .to({},{duration:3},20.6)
  .fromTo(dev,{x:fsX,y:fsY,width:()=>phs.clientWidth,height:()=>phs.clientHeight,borderRadius:0},{x:DXd,y:0,width:DWd,height:DHd,borderRadius:14,duration:2,ease:'power2.inOut',immediateRender:false},23.6)
  .to('.stand,#device .base',{opacity:1,duration:.4},25.4)
  .to({},{duration:1.5},25.8);
actor(c3,pn,[{a:0,b:5.4,p:'walk',d:'left'},
  {a:5.4,b:7.4,p:'point',d:'left',t:'Keep your mouse on the phone screen to scroll the site 👈'},
  {a:7.4,b:10.4,p:'wave',d:'left',t:'Watch this, it flips into a desktop! ✨'},
  {a:10.4,b:12.2,p:'bye',d:'left'},
  {a:12.2,b:99,p:'walk',d:'right'}],
  t=>{
    $('#siteframe').style.pointerEvents=(t>=2&&t<8.2)?'auto':'none';
    /* desktop is fully zoomed (hold: 20.6 to 23.6): make the site live. Scroll/click inside it; when it reaches its end, scrolling chains to the page and the desktop zooms back out */
    const live=t>=20.7&&t<23.5;
    if(live!==DESK.live){DESK.live=live;const f=$('#siteframe2');f.style.pointerEvents=live?'auto':'none';f.tabIndex=live?0:-1;f.setAttribute('scrolling',live?'yes':'no');DESK.hint.style.opacity=live?1:0}});

/* 5 · vertical scroll moves projects sideways, she walks along beside them */
const tr=$('#track'),c4=$('#c4'),dist=()=>Math.max(1,tr.scrollWidth-innerWidth),names=['Gacha Notes','Maison Aura','Urban Green Space','Sealsa Mechanics','Exam System','Secure Transfer','Faculty Evaluation','Ticket Management'];
gsap.set(c4,{x:()=>innerWidth*.05});setPose(c4,'walk','right','');
const ph=gsap.timeline({defaults:{ease:'none'}}).to(tr,{x:()=>-dist()});
S.projects=ScrollTrigger.create({trigger:'#projects',start:'top top',end:()=>'+='+dist(),pin:true,scrub:1,animation:ph,invalidateOnRefresh:true,
  onUpdate:s=>{stepBob(c4,s.progress*dist());$('#bar').style.width=s.progress*100+'%';setPose(c4,'walk','right',names[Math.min(7,Math.floor(s.progress*8))])}});

/* 6 · contact: she stops beside the heading and points at it */
const c5=$('#c5'),cmid=$('#cmid'),form=$('#form'),mm=gsap.matchMedia();
function align(){ // lines the form box up with her pointing hand
  if(SM())return;gsap.set(form,{y:0});const r=c5.getBoundingClientRect(),f=form.getBoundingClientRect(),h=$('.cleft').getBoundingClientRect(),g=$('#contact .ground').getBoundingClientRect();
  const handY=r.bottom-.8*r.height+CFG.handY*.8*r.height;let y=handY-(f.top+f.height/2);
  y=Math.max(y,h.bottom+12-f.top);y=Math.min(y,g.top-8-f.bottom);gsap.set(form,{y})}
mm.add('(min-width:801px)',()=>{
  gsap.set(form,{opacity:0});
  const ct=scene('contact','+=200%');
  ct.fromTo(c5,{x:()=>innerWidth-cmid.getBoundingClientRect().left+40},{x:14,duration:4},0).to(form,{opacity:1,duration:1},4.6).to({},{duration:1.4});
  actor(c5,ct,[{a:0,b:4,p:'walk',d:'left'},{a:4,b:99,p:'point',d:'left',t:'Say hello here! 👈'}]);
  align();return()=>gsap.set(form,{opacity:1})});
mm.add('(max-width:800px)',()=>{
  const ct=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'#contact',start:'top 70%',end:'top 5%',scrub:1,invalidateOnRefresh:true}});S.contact=ct.scrollTrigger;
  ct.fromTo(c5,{x:()=>innerWidth},{x:0,duration:3},0).to({},{duration:1});
  actor(c5,ct,[{a:0,b:3,p:'walk',d:'left'},{a:3,b:99,p:'point',d:'left',t:'Say hello! 👆'}])});
ScrollTrigger.addEventListener('refresh',align);addEventListener('load',()=>{align();ScrollTrigger.refresh()});

/* live site inside the device screen.
   The desktop copy is laid out at a normal 1440px-wide desktop and scaled down to fit, so it looks like the real site. */
const fr=$('#siteframe'),fr2=$('#siteframe2'),ds=$('#dscr');
function fit(){const cw=ds.clientWidth,ch=ds.clientHeight;if(!cw)return;
  [[fr,390],[fr2,1440]].forEach(([f,W])=>{const sc=Math.min(1,cw/W);f.style.position='absolute';f.style.top='0';f.style.left='0';f.style.border='0';f.style.background='#fff';f.style.visibility='visible';f.style.transformOrigin='0 0';f.style.width=W+'px';f.style.height=(ch/sc)+'px';f.style.transform=sc>.999?'none':'scale('+sc+')'});
  const big=cw>(SM()?200:300);fr.style.opacity=big?0:1;fr2.style.opacity=big?1:0}
new ResizeObserver(fit).observe(ds);fit();

/* extras */
if(GACHA_URL){const l=$('#glink');l.href=GACHA_URL;l.hidden=false}
const dome=$('#dome');['#ff9fb2','#9cc9ff','#ffe08a','#9fe3c3','#d7b8ff','#ffc8a0'].forEach((c,i)=>{const e=document.createElement('i');e.style.cssText='background:'+c+';left:'+(6+i%3*26)+'px;top:'+(10+Math.floor(i/3)*30)+'px';dome.append(e)});
const prizes=['Pink capsule: common','Blue capsule: common','Gold capsule: RARE!','Green capsule: uncommon','Mystery capsule: ULTRA RARE!'];
const pcol=['#ff9fb2','#9cc9ff','#ffd166','#9fe3c3','#d7b8ff'],knob=$('#knob'),gcap=$('#gcap');
const pull=()=>{const i=Math.random()*5|0;dome.classList.remove('shake');gcap.classList.remove('drop');knob.classList.remove('turn');void dome.offsetWidth;dome.classList.add('shake');knob.classList.add('turn');gcap.style.background=pcol[i];setTimeout(()=>{gcap.classList.add('drop');$('#prize').textContent=prizes[i]},450)};
$('#gmach').onclick=pull;$('#gmach').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pull()}};
form.onsubmit=e=>{e.preventDefault();$('#thanks').textContent='Opening your email app…';location.href='mailto:aleezaybabar01@gmail.com?subject='+encodeURIComponent('Portfolio message from '+$('#nm').value)+'&body='+encodeURIComponent($('#ms').value+'\n\n'+$('#em').value)};
