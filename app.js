(()=>{
const $=s=>document.querySelector(s);
const F=[['Coca-Cola\nOriginal Taste',[210,25,35]],['Diet Coke\nNo Sugar',[176,186,201]],['Coca-Cola\nZero Sugar',[235,40,70]],['Coca-Cola\nCherry',[170,30,140]],['Coca-Cola\nVanilla',[232,200,130]],['Coca-Cola\nLime',[70,200,60]]],NF=F.length,IMG=['original','diet','zero','cherry','vanilla','lime'];
const FEAT=[['Description',''],['Ingredients',''],['Nutrition facts',''],['Caffeine','']];
const DATA=[
{ing:'Carbonated water, sugar, acidity regulator (INS 338), caffeine (8.7 mg/100 g), colour (INS 150d), natural flavouring substances.',nut:['44 kcal','10.9 g','10.6 g','0 g','0 g','8.5 mg']},
{ing:'Carbonated water, sweeteners (aspartame, acesulfame K), acidity regulator (INS 338), caffeine (8.7 mg/100 ml), natural flavourings, colour (INS 150d).',nut:['1 kcal','0 g','0 g','0 g','0 g','11 mg']},
{ing:'Carbonated water, colour (INS 150d), acidity regulator (INS 338), natural flavourings, caffeine (8.7 mg/100 ml).',nut:['1 kcal','0 g','0 g','0 g','0 g','11 mg']},
{ing:'Carbonated water, sugar, acidulant (INS 330), acidity regulator (INS 338), caffeine (8.7 mg/100 ml), natural flavourings, colour (INS 122).',nut:['44 kcal','10.8 g','10.6 g','0 g','0 g','8.5 mg']},
{ing:'Carbonated water, sugar, caramel colour (INS 150d), acidity regulator (INS 338), natural flavourings, caffeine (8.7 mg/100 ml).',nut:['44 kcal','10.9 g','10.6 g','0 g','0 g','8.5 mg']},
{ing:'Carbonated water, sugar, acidity regulator (INS 338), natural flavourings, lime flavour, caffeine (8.7 mg/100 ml).',nut:['44 kcal','10.9 g','10.6 g','0 g','0 g','8.5 mg']}];
const NL=['Energy','Carbohydrate','of which sugars','Total fat','Protein','Sodium'];
function featFor(i,f){const d=DATA[i];
 if(f===0)return['Description',INFO[i]+' 300 ml can, best served ice cold.'];
 if(f===1)return['Ingredients',d.ing];
 if(f===2)return['Nutrition facts','<span class="sub">Average values per 100 ml</span>'+NL.map((n,k)=>`<div class="nt"><span>${n}</span><b>${d.nut[k]}</b></div>`).join('')];
 return['Caffeine','Contains 8.7 mg of caffeine per 100 ml, about 26 mg per 300 ml can. Not recommended for children, pregnant or breastfeeding women.']}
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), sm=(a,b,x)=>{x=clamp((x-a)/(b-a));return x*x*(3-2*x)}, lerp=(a,b,t)=>a+(b-a)*t;

/* ---------- can images (separate PNGs, one per can) ---------- */
const stage=$('#stage');
const IM=IMG.map((n,i)=>{const im=new Image();im.src='assets/cans/'+n+'.webp';im.alt=F[i][0].replace('\n',' ');im.className='can';im.draggable=false;im.decoding='async';stage.appendChild(im);return im});


/* ---------- rotating can: front image wrapped round a cylinder, ingredients printed on the back ---------- */
const SC=1,PW=3200,PI=Math.PI,cache={},TG=[0,PI,PI,2*PI];
const BODY=[[205,12,24],[196,200,208],[16,16,20],[128,22,108],[238,218,172],[96,192,44]],TXT=['#fff','#1b1b1b','#fff','#fff','#3a2208','#04280a'];
const SP=document.createElement('canvas');SP.className='can';SP.style.visibility='hidden';stage.appendChild(SP);const spc=SP.getContext('2d');
function wrapT(c,t,mw){const w=t.split(' '),L=[];let l='';w.forEach(o=>{const q=l?l+' '+o:o;if(c.measureText(q).width>mw&&l){L.push(l);l=o}else l=q});L.push(l);return L}
function buildTex(i){const im=IM[i];if(!im.complete||!im.naturalWidth)return null;if(cache[i])return cache[i];
 const w0=im.naturalWidth,h0=im.naturalHeight,Hp=Math.round(h0*SC),P=document.createElement('canvas');P.width=PW;P.height=Hp;const x=P.getContext('2d');x.imageSmoothingQuality='high';
 for(let c=0;c<PW;c++){const a=(c+.5)/PW*PI*2-PI,fa=Math.abs(a)<=PI/2?a:(a>0?a-PI:a+PI);x.drawImage(im,Math.floor((Math.sin(fa)+1)/2*(w0-1)),0,1,h0,c,0,1,Hp)}
 // back label painted in "design" units so the text keeps its true proportions on this can's curvature
 const BW=PW/2,B=document.createElement('canvas');B.width=BW;B.height=Hp;const b=B.getContext('2d'),sy=Hp/894,R=w0*SC/2,sx=sy*PW/(2*PI*R);b.scale(sx,sy);
 const BD=BW/sx,bc=BODY[i],r0=20,r1=866,mw=Math.min(500,BD*.62),fs=Math.min(1,Math.max(.72,BD/640)),cx=BD/2,d=DATA[i],ft=(w,px,f)=>`${w} ${Math.round(px*fs)}px ${f||'Arial'}`;
 const g=b.createLinearGradient(0,r0-6,0,r1+6);g.addColorStop(0,`rgba(${bc},0)`);g.addColorStop(.03,`rgb(${bc})`);g.addColorStop(.97,`rgb(${bc})`);g.addColorStop(1,`rgba(${bc},0)`);
 b.fillStyle=g;b.fillRect(0,r0-6,BD,r1-r0+12);
 const sg=b.createLinearGradient(0,r0,0,r1);sg.addColorStop(0,'rgba(0,0,0,.4)');sg.addColorStop(.1,'rgba(0,0,0,0)');sg.addColorStop(.9,'rgba(0,0,0,0)');sg.addColorStop(1,'rgba(0,0,0,.35)');b.fillStyle=sg;b.fillRect(0,r0,BD,r1-r0);
 let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
 for(let k=0;k<Math.round(160*BD/900);k++){const dx=rnd()*BD,dy=r0+rnd()*(r1-r0),r=1.5+rnd()*3.5;b.fillStyle='rgba(255,255,255,.16)';b.beginPath();b.ellipse(dx,dy,r,r*1.2,0,0,7);b.fill();b.fillStyle='rgba(255,255,255,.5)';b.beginPath();b.arc(dx-r*.3,dy-r*.4,r*.28,0,7);b.fill()}
 b.textAlign='center';b.fillStyle=TXT[i];
 b.font=ft('900 italic',34,'"Arial Black",Arial');b.fillText('INGREDIENTS',cx,r0+130);
 b.font=ft('600',23);let y=r0+175;wrapT(b,d.ing,mw).forEach(l=>{b.fillText(l,cx,y);y+=30*fs});
 y=Math.max(y+40*fs,r0+450*fs);b.font=ft('900 italic',28,'"Arial Black",Arial');b.fillText('NUTRITION FACTS',cx,y);
 b.font=ft('600',19);b.fillText('Average values per 100 ml',cx,y+28*fs);y+=66*fs;b.font=ft('700',22);
 NL.forEach((n,k)=>{b.textAlign='left';b.fillText(n,cx-mw/2+16,y);b.textAlign='right';b.fillText(d.nut[k],cx+mw/2-16,y);b.globalAlpha=.35;b.fillRect(cx-mw/2+16,y+8,mw-32,1.5);b.globalAlpha=1;y+=36*fs});
 x.drawImage(B,0,0,BW/2,Hp,PW*.75,0,PW/4,Hp);x.drawImage(B,BW/2,0,BW/2,Hp,0,0,PW/4,Hp);
 return cache[i]=P}
function drawSpin(i,ph,sh){const T=buildTex(i);if(!T)return false;const im=IM[i],Wc=Math.round(im.naturalWidth*SC),Hc=T.height;
 if(SP.width!==Wc||SP.height!==Hc){SP.width=Wc;SP.height=Hc}
 const c=spc,R=Wc/2;c.globalCompositeOperation='source-over';c.clearRect(0,0,Wc,Hc);
 for(let xx=0;xx<Wc;xx++){const a=ph+Math.asin(clamp((xx+.5-R)/R,-1,1));let u=((a+PI)/(2*PI))%1;if(u<0)u+=1;c.drawImage(T,Math.min(PW-1,Math.floor(u*PW)),0,1,Hc,xx,0,1,Hc)}
 c.globalCompositeOperation='source-atop';const g=c.createLinearGradient(0,0,Wc,0);g.addColorStop(0,`rgba(0,0,0,${.5*sh})`);g.addColorStop(.2,'rgba(0,0,0,0)');g.addColorStop(.8,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${.5*sh})`);c.fillStyle=g;c.fillRect(0,0,Wc,Hc);
 const hl=c.createLinearGradient(0,0,Wc,0);hl.addColorStop(.1,'rgba(255,255,255,0)');hl.addColorStop(.26,`rgba(255,255,255,${.22*sh})`);hl.addColorStop(.42,'rgba(255,255,255,0)');c.fillStyle=hl;c.fillRect(0,0,Wc,Hc);
 c.globalCompositeOperation='destination-in';c.drawImage(im,0,0,Wc,Hc);c.globalCompositeOperation='source-over';return true}

/* ---------- state ---------- */
let W,Hh,asp=1,p=0,ps=0,cur=0,tgt=0,lastIdx=-1,lastF=-1,lastFI=-1,phi=0,spUsed=false;
const els={hero:$('#hero'),feat:$('#feat'),zero:$('#zero'),faq:$('#faq'),join:$('#join')};
const UW=5.66,CS=1.15;let UNIT=1;
function resize(){W=innerWidth;Hh=innerHeight;asp=W/Hh;UNIT=Hh/UW;stage.style.setProperty('--h',(1.5*UNIT*CS)+'px')}
addEventListener('resize',resize);resize();
const maxS=()=>document.documentElement.scrollHeight-innerHeight;
addEventListener('scroll',()=>p=clamp(scrollY/maxS()));
const go=d=>{if(ps<.15)tgt+=d};
let hold=0;const user=d=>{hold=Date.now()+9000;go(d)};
const pick=i=>{let d=((i-Math.round(tgt))%NF+NF)%NF;if(d>NF/2)d-=NF;user(d)};
$('#next').onclick=()=>user(1);$('#prev').onclick=()=>user(-1);
$('.slider').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();pick(Math.round((e.clientX-r.left)/r.width*(NF-1)))};
addEventListener('keydown',e=>{if(e.key==='ArrowRight'){user(1);if(ps>.2&&ps<.62)dv+=.12}if(e.key==='ArrowLeft'){user(-1);if(ps>.2&&ps<.62)dv-=.12}if(e.key==='Escape')closeAll()});
let dragging=false,dX=0,dragPhi=0,dv=0;
addEventListener('pointerdown',e=>{if(ps>.2&&ps<.62&&!e.target.closest('#cart,#menu,#quiz,#mod,nav,button,a,summary,form')){dragging=true;dX=e.clientX;document.body.classList.add('drag')}});
addEventListener('pointermove',e=>{if(!dragging)return;const d=e.clientX-dX;dX=e.clientX;dragPhi+=d*.011;dv=d*.011});
const endDrag=()=>{dragging=false;document.body.classList.remove('drag')};addEventListener('pointerup',endDrag);addEventListener('pointercancel',endDrag);
let sx=null;addEventListener('pointerdown',e=>sx=e.target.closest('#cart,#menu,#quiz,#mod,form')?null:e.clientX);addEventListener('pointerup',e=>{if(sx!==null&&Math.abs(e.clientX-sx)>50)user(e.clientX<sx?1:-1);sx=null});
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
let auto=true;setInterval(()=>{if(auto&&p<.04&&Date.now()>hold&&!rm)go(1)},3800);
$('#autob').onclick=e=>{auto=!auto;e.currentTarget.textContent=auto?'❚❚':'▶';e.currentTarget.setAttribute('aria-label',auto?'Pause autoplay':'Play autoplay')};
let mx=0,my=0,mxs=0,mys=0;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1});

/* ---------- extra features: flavor info, cart, menu, toast, newsletter ---------- */
const INFO=['The original taste: delicious and refreshing.','No sugar, no calories, with a hint of caffeine.','Zero calories, zero sugar, great taste.','The classic taste with a juicy cherry twist.','A smooth, velvety touch of vanilla.','A bright, fizzy splash of lime.'];
const PRICE=1.99,fmt=n=>'€'+n.toFixed(2),nm=i=>F[i][0].replace('\n',' '),cart={};
try{Object.assign(cart,JSON.parse(localStorage.getItem('ciao-cart')||'{}'))}catch(e){}
let sub=false;try{sub=localStorage.getItem('ciao-sub')==='1'}catch(e){}let promo='';try{promo=localStorage.getItem('ciao-promo')||''}catch(e){}
let favs=new Set();try{favs=new Set(JSON.parse(localStorage.getItem('ciao-favs')||'[]'))}catch(e){}
const disc=n=>n>=24?.12:n>=12?.08:n>=6?.05:0,FREE=15;let qty=1;const setQ=n=>{qty=Math.max(1,Math.min(24,n));const d=disc(qty);$('#qv').textContent=qty;$('#price').innerHTML=fmt(PRICE*qty*(1-d))+(d?'<s>'+fmt(PRICE*qty)+'</s>':'');document.querySelectorAll('.packs b').forEach(b=>b.classList.toggle('on',+b.dataset.q===qty))};setQ(1);document.querySelectorAll('.packs b').forEach(b=>b.onclick=()=>setQ(+b.dataset.q));$('#qm').onclick=()=>setQ(qty-1);$('#qp').onclick=()=>setQ(qty+1);
let tt;function toast(s){const e=$('#toast');e.textContent=s;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2200)}
function closeAll(){document.querySelectorAll('#cart,#menu,#quiz,#mod').forEach(e=>e.classList.remove('open'))}
function renderCart(){let n=0,tot=0,h='';
 F.forEach((f,i)=>{const q=cart[i]|0;if(!q)return;n+=q;tot+=q*PRICE;
  h+=`<div class="ci"><i style="background:rgb(${f[1]})"></i><span>${nm(i)}</span><b data-d="-1" data-i="${i}">−</b><u>${q}</u><b data-d="1" data-i="${i}">+</b></div>`});
 const dsc=disc(n),sav=tot*dsc;tot-=sav;const pv=promo==='CIAO10'?tot*.1:0;tot-=pv;const sv=sub?tot*.05:0;tot-=sv;const free=promo==='FREESHIP'||tot>=FREE;
 $('#items').innerHTML=h||'<p class="empty">Your cart is empty.</p>';$('#total').textContent=fmt(tot);
 $('#ship').innerHTML=n?(sav?`<div class="row"><span>Bundle discount (−${Math.round(dsc*100)}%)</span><b>−${fmt(sav)}</b></div>`:'<div class="row"><span>Buy 6+ cans for −5%, 12+ for −8%, 24 for −12%</span></div>')+(sv?`<div class="row"><span>Subscribe &amp; save (−5%)</span><b>−${fmt(sv)}</b></div>`:'')+(pv?`<div class="row"><span>Promo CIAO10 (−10%)</span><b>−${fmt(pv)}</b></div>`:'')+`<div class="row"><span>${free?(promo==='FREESHIP'?'Free shipping applied 🎉':'You’ve unlocked free shipping 🎉'):'Add '+fmt(FREE-tot)+' more for free shipping'}</span></div><div class="bar"><i style="width:${free?100:Math.min(100,tot/FREE*100)}%"></i></div>`:'';
 $('#cnt').textContent=n;$('#cnt').style.display=n?'grid':'none';
 try{localStorage.setItem('ciao-cart',JSON.stringify(cart))}catch(e){}}
renderCart();
$('#items').onclick=e=>{const b=e.target.closest('b');if(!b)return;const i=+b.dataset.i;cart[i]=Math.max(0,(cart[i]|0)+ +b.dataset.d);renderCart()};
$('#add').onclick=()=>{cart[lastF]=(cart[lastF]|0)+qty;renderCart();toast('Added: '+qty+' × '+nm(lastF));setQ(1)};
const th=$('#thumbs');IM.forEach((im,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',nm(i));const g=new Image();g.src=im.src;g.alt='';b.appendChild(g);b.onclick=()=>pick(i);th.appendChild(b)});
$('#cartbtn').onclick=e=>{e.stopPropagation();closeAll();$('#cart').classList.add('open')};
$('#menubtn').onclick=e=>{e.stopPropagation();closeAll();$('#menu').classList.add('open')};
$('#pay').onclick=()=>{if(!Object.values(cart).some(q=>q>0)){toast('Your cart is empty');return}openCheckout()};
const to=f=>scrollTo({top:maxS()*f,behavior:rm?'auto':'smooth'});
document.addEventListener('click',e=>{const a=e.target.closest('[data-f]');
 if(a){closeAll();to(+a.dataset.f)}else if(e.target.closest('[data-close]')||(!e.target.closest('#cart')&&$('#cart').classList.contains('open')))closeAll()});

/* ---------- sound (synthesised fizz), flavour finder quiz, share ---------- */
let snd=true;try{snd=localStorage.getItem('ciao-snd')!=='0'}catch(e){}
let AC;function fizz(){if(!snd)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const n=AC.sampleRate*.9|0,buf=AC.createBuffer(1,n,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.2);const sr=AC.createBufferSource();sr.buffer=buf;const f=AC.createBiquadFilter();f.type='highpass';f.frequency.value=3500;const g=AC.createGain();g.gain.value=.3;sr.connect(f);f.connect(g);g.connect(AC.destination);sr.start();
 const o=AC.createOscillator(),og=AC.createGain(),T=AC.currentTime;o.type='square';o.frequency.setValueAtTime(900,T);o.frequency.exponentialRampToValueAtTime(200,T+.06);og.gain.setValueAtTime(.1,T);og.gain.exponentialRampToValueAtTime(.001,T+.08);o.connect(og);og.connect(AC.destination);o.start();o.stop(T+.09)}catch(e){}}
const sb=$('#snd');const sndL=()=>sb.textContent=snd?'SOUND ON':'SOUND OFF';sndL();
sb.onclick=e=>{e.stopPropagation();snd=!snd;try{localStorage.setItem('ciao-snd',snd?'1':'0')}catch(x){}sndL();fizz()};
const addFx=$('#add').onclick;$('#add').onclick=e=>{fizz();addFx(e)};
const QZ={step:0,a:[]},QS=[['Do you want sugar?',['Yes, full sugar','No, sugar free']],['Which mood are you in?',['Classic','Sweet cherry','Zesty citrus','Smooth vanilla']]],QM=[[0,3,5,4],[2,1,1,1]];
function quiz(){QZ.step=0;QZ.a=[];closeAll();$('#quiz').classList.add('open');qr()}
function qr(){const b=$('#qbody');if(QZ.step<2){const[q,o]=QS[QZ.step];b.innerHTML=`<em>QUESTION ${QZ.step+1} / 2</em><h3>${q}</h3>`+o.map((t,k)=>`<button class="opt" data-k="${k}">${t}</button>`).join('')}
 else{const i=QM[QZ.a[0]][QZ.a[1]];b.innerHTML=`<em>YOUR MATCH</em><h3>${nm(i)}</h3><img src="${IM[i].src}" alt="${nm(i)}"><p>${INFO[i]}</p>${QZ.a[0]&&QZ.a[1]?'<p>The closest sugar-free option to your mood.</p>':''}<div class="res"><button class="opt" data-add="${i}">Add to cart</button><button class="opt" data-show="${i}">Show me</button><button class="opt" data-again="1">Retry</button></div>`}}
$('#quiz').onclick=e=>{const t=e.target;if(t.id==='quiz'||t.closest('[data-qclose]')){$('#quiz').classList.remove('open');return}const o=t.closest('.opt');if(!o)return;
 if(o.dataset.k!==undefined){QZ.a.push(+o.dataset.k);QZ.step++;qr()}
 else if(o.dataset.add!==undefined){const i=+o.dataset.add;cart[i]=(cart[i]|0)+1;renderCart();fizz();toast('Added: '+nm(i))}
 else if(o.dataset.show!==undefined){const i=+o.dataset.show;$('#quiz').classList.remove('open');to(0);setTimeout(()=>pick(i),1500)}
 else quiz()};
$('#findhd').onclick=e=>{e.stopPropagation();quiz()};$('#findbtn').onclick=e=>{e.stopPropagation();quiz()};
$('#share').onclick=async e=>{e.stopPropagation();closeAll();const u=location.href;try{if(navigator.share)await navigator.share({title:document.title,url:u});else{await navigator.clipboard.writeText(u);toast('Link copied')}}catch(x){toast('Copy the link from your address bar')}};

/* ---------- more features: compare + daily intake, favourites, mix-pack builder, promo codes, checkout demo ---------- */
const NUM=DATA.map(d=>d.nut.map(parseFloat)),esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const savF=()=>{try{localStorage.setItem('ciao-favs',JSON.stringify([...favs]))}catch(e){}};
let cmp={m:0,per:100,c:0,n:1},mix=[0,0,0,0,0,0],mode='';
function openMod(m){closeAll();mode=m;$('#mod').classList.add('open');({cmp:cmpR,mix:mixR,fav:favR,out:outR,ord:ordR})[m]()}
const bar=(p,c)=>`<div class="pb"><i class="${c}" style="width:${Math.min(100,p)}%"></i></div>`,lvl=p=>p<60?'g':p<100?'a':'r';
function cmpR(){const M=[['Energy','kcal',i=>NUM[i][0]],['Sugars','g',i=>NUM[i][2]],['Caffeine','mg',()=>8.7],['Sodium','mg',i=>NUM[i][5]]],m=M[cmp.m],f=cmp.per/100,v=F.map((_,i)=>m[2](i)*f),mx=Math.max(...v,1e-9);
 const g=NUM[cmp.c][2]*3*cmp.n,k=8.7*3*cmp.n,e=NUM[cmp.c][0]*3*cmp.n,gp=g/50*100,kp=k/400*100;
 $('#mbody').innerHTML=`<em>COMPARE</em><h3>Flavour comparison</h3><div class="tabs">${M.map((x,j)=>`<b data-m="${j}" class="${j===cmp.m?'on':''}">${x[0]}</b>`).join('')}<span class="sp"></span><b data-per="100" class="${cmp.per===100?'on':''}">per 100 ml</b><b data-per="300" class="${cmp.per===300?'on':''}">per can</b></div>`
 +v.map((x,i)=>`<div class="bars"><img src="${IM[i].src}" alt=""><span>${nm(i)}</span><div><i style="width:${x/mx*100}%;background:rgb(${F[i][1]})"></i></div><b>${+x.toFixed(1)} ${m[1]}</b></div>`).join('')
 +`<h4>Daily intake calculator</h4><div class="tabs">${F.map((_,i)=>`<b data-c="${i}" class="${i===cmp.c?'on':''}">${nm(i).replace('Coca-Cola ','')}</b>`).join('')}</div>
 <div class="qty cq"><b data-n="-1">−</b><u>${cmp.n}</u><b data-n="1">+</b><span>can${cmp.n>1?'s':''} per day · ${Math.round(e)} kcal</span></div>
 <div class="calc"><div><span>Sugars</span><b>${+g.toFixed(1)} g · ${Math.round(gp)}% of 50 g</b></div>${bar(gp,lvl(gp))}<div><span>Caffeine</span><b>${+k.toFixed(0)} mg · ${Math.round(kp)}% of 400 mg</b></div>${bar(kp,lvl(kp))}</div>
 <p class="note">Guideline values for healthy adults: under 50 g free sugars a day (WHO) and up to 400 mg caffeine a day (EFSA). Not medical advice.</p>`}
function favR(){const a=[...favs].sort();$('#mbody').innerHTML='<em>SAVED</em><h3>Your favourites</h3>'+(a.length?a.map(i=>`<div class="lrow"><img src="${IM[i].src}" alt=""><span>${nm(i)}</span><button class="mini" data-favadd="${i}">ADD TO CART</button><button class="mini" data-favrm="${i}">REMOVE</button></div>`).join(''):'<p>No favourites yet. Tap the ♡ next to the quantity on any can to save it here.</p>')}
function mixR(){const n=mix.reduce((a,b)=>a+b,0),d=disc(n),sub=n*PRICE;
 $('#mbody').innerHTML=`<em>BUILD YOUR OWN</em><h3>Mix pack</h3>`+F.map((_,i)=>`<div class="lrow"><img src="${IM[i].src}" alt=""><span>${nm(i)}</span><div class="qty"><b data-mx="${i}" data-d="-1">−</b><u>${mix[i]}</u><b data-mx="${i}" data-d="1">+</b></div></div>`).join('')
 +`<div class="mixsum"><span>${n} can${n===1?'':'s'}${d?` · −${Math.round(d*100)}% bundle`:' · 6+ cans for −5%'}</span><b>${fmt(sub*(1-d))}${d?'<s>'+fmt(sub)+'</s>':''}</b></div><div class="res"><button class="opt" data-onecan="1">One of each</button><button class="opt" data-addmix="1">Add mix to cart</button></div>`}
function openCheckout(){closeAll();mode='out';$('#mod').classList.add('open');outR()}
function outR(){const n=Object.values(cart).reduce((a,b)=>a+(b|0),0);$('#mbody').innerHTML=`<em>CHECKOUT · DEMO</em><h3>${n} can${n===1?'':'s'} · ${$('#total').textContent}</h3><input id="cn" placeholder="FULL NAME" autocomplete="name"><input id="ce" type="email" placeholder="EMAIL ADDRESS" autocomplete="email"><input id="ca" placeholder="DELIVERY ADDRESS" autocomplete="street-address"><button class="opt" data-place="1">PLACE ORDER</button><p class="note">Estimated delivery: ${eta()} · Demo only: no payment is taken and nothing is sent.</p>`}
function place(){const nme=$('#cn').value.trim(),em=$('#ce').value.trim(),ad=$('#ca').value.trim();if(!nme||!/^\S+@\S+\.\S+$/.test(em)||!ad){toast('Please enter your name, a valid email and an address');return}
 const id='CE-'+(100000+Math.random()*899999|0),tt=$('#total').textContent;addOrder(id,tt,{...cart});Object.keys(cart).forEach(k=>delete cart[k]);promo='';try{localStorage.removeItem('ciao-promo')}catch(e){}renderCart();
 $('#mbody').innerHTML=`<em>ORDER CONFIRMED</em><h3>Thank you, ${esc(nme)}!</h3><p>Order <b>${id}</b> · ${tt} · arrives ${eta()}</p><p>A confirmation would be sent to ${esc(em)}. This is a demo, so no payment was taken.</p><button class="opt" data-mclose="1">Continue shopping</button>`;fizz()}
$('#mod').onclick=e=>{const t=e.target;if(t.id==='mod'||t.closest('[data-mclose]')){$('#mod').classList.remove('open');return}let el;
 if(el=t.closest('[data-m]')){cmp.m=+el.dataset.m;cmpR()}
 else if(el=t.closest('[data-per]')){cmp.per=+el.dataset.per;cmpR()}
 else if(el=t.closest('[data-c]')){cmp.c=+el.dataset.c;cmpR()}
 else if(el=t.closest('[data-n]')){cmp.n=Math.max(1,Math.min(8,cmp.n+ +el.dataset.n));cmpR()}
 else if(el=t.closest('[data-mx]')){const i=+el.dataset.mx;mix[i]=Math.max(0,mix[i]+ +el.dataset.d);mixR()}
 else if(t.closest('[data-onecan]')){mix=[1,1,1,1,1,1];mixR()}
 else if(t.closest('[data-addmix]')){const n=mix.reduce((a,b)=>a+b,0);if(!n){toast('Pick at least one can');return}mix.forEach((q,i)=>{if(q)cart[i]=(cart[i]|0)+q});renderCart();fizz();toast('Added mix: '+n+' cans');mix=[0,0,0,0,0,0];$('#mod').classList.remove('open')}
 else if(el=t.closest('[data-favadd]')){const i=+el.dataset.favadd;cart[i]=(cart[i]|0)+1;renderCart();fizz();toast('Added: '+nm(i))}
 else if(el=t.closest('[data-favrm]')){favs.delete(+el.dataset.favrm);savF();favR();$('#fav').textContent=favs.has(lastF)?'♥':'♡'}
 else if(el=t.closest('[data-reord]')){const o=orders[+el.dataset.reord];if(o){Object.entries(o.items).forEach(([k,q])=>cart[k]=(cart[k]|0)+q);renderCart();fizz();toast('Order '+o.id+' added to cart');$('#mod').classList.remove('open');setTimeout(()=>$('#cart').classList.add('open'),0)}}
 else if(t.closest('[data-clrord]')){orders=[];try{localStorage.removeItem('ciao-orders')}catch(e){}ordR()}
 else if(t.closest('[data-place]'))place()};
$('#fav').onclick=()=>{if(favs.has(lastF)){favs.delete(lastF);toast('Removed from favourites')}else{favs.add(lastF);toast('Saved to favourites ♥')}savF();$('#fav').textContent=favs.has(lastF)?'♥':'♡'};
[['cmphd','cmp'],['cmpbtn','cmp'],['mixhd','mix'],['mixbtn','mix'],['favbtn','fav'],['ordbtn','ord']].forEach(([id,m])=>$('#'+id).onclick=e=>{e.stopPropagation();openMod(m)});
$('#pa').onclick=()=>{const c=$('#pc').value.trim().toUpperCase();if(c==='CIAO10'||c==='FREESHIP'){promo=c;try{localStorage.setItem('ciao-promo',c)}catch(e){}renderCart();toast('Promo applied: '+c);$('#pc').value=''}else toast('Invalid promo code')};
$('form').onsubmit=e=>{e.preventDefault();const i=$('form input');
 if(/^\S+@\S+\.\S+$/.test(i.value.trim())){toast('Thanks, welcome to Ciao! 🎉');i.value=''}else{toast('Invalid email address');i.focus()}};
const nav=$('#fnav');FEAT.forEach((f,i)=>{const b=document.createElement('b');b.textContent=i+1;b.onclick=()=>scrollTo({top:maxS()*(.265+i*.08+.01),behavior:'smooth'});nav.appendChild(b)});

/* ---------- v8: deep links, subscribe & save, clear cart, order history, delivery estimate, shortcuts ---------- */
{const m=location.hash.match(/can=(\w+)/),i=m?IMG.indexOf(m[1]):-1;if(i>=0){tgt=cur=i}}
const syncHash=i=>{try{history.replaceState(null,'','#can='+IMG[i])}catch(e){}};
const sb2=$('#sub');sb2.checked=sub;sb2.onchange=()=>{sub=sb2.checked;try{localStorage.setItem('ciao-sub',sub?'1':'0')}catch(e){}renderCart();toast(sub?'Subscribe & save on: −5%':'Subscription off')};
$('#clr').onclick=()=>{if(!Object.values(cart).some(q=>q>0))return toast('Your cart is already empty');Object.keys(cart).forEach(k=>delete cart[k]);renderCart();toast('Cart cleared')};
let orders=[];try{orders=JSON.parse(localStorage.getItem('ciao-orders')||'[]')}catch(e){}
function addOrder(id,total,items){Object.keys(items).forEach(k=>{if(!(items[k]>0))delete items[k]});orders.unshift({id,total,items,d:Date.now()});orders=orders.slice(0,10);try{localStorage.setItem('ciao-orders',JSON.stringify(orders))}catch(e){}}
function eta(){const d=new Date();let n=3;while(n){d.setDate(d.getDate()+1);if(d.getDay()%6)n--}return d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})}
function ordR(){$('#mbody').innerHTML='<em>HISTORY · DEMO</em><h3>Your orders</h3>'+(orders.length?orders.map((o,k)=>`<div class="lrow"><span><b>${o.id}</b> · ${o.total}<i class="od">${new Date(o.d).toLocaleDateString('en-GB')} · ${Object.entries(o.items).map(([i,q])=>q+' × '+nm(i).replace('Coca-Cola ','')).join(', ')}</i></span><button class="mini" data-reord="${k}">REORDER</button></div>`).join('')+'<div class="res"><button class="opt" data-clrord="1">Clear history</button></div>':'<p>No orders yet. Orders placed in the demo checkout show up here, so you can reorder in one tap.</p>')}
addEventListener('keydown',e=>{if(e.target.closest('input,textarea')||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(k==='c'){closeAll();$('#cart').classList.add('open')}if(k==='f'&&ps<.15)$('#fav').click()});

/* keyframes for the active can: p, x(frac of half-width), y, scale, rx, rz, spin(turns) */
const K=[[0,0,.5,1,.1,.08,0],[.17,0,.5,1,.1,.08,0],[.27,.42,.1,1.6,.12,-.07,0],[.58,.42,.1,1.6,.12,-.07,1.05],[.64,0,.5,2,0,0,1.3],[.72,0,1.5,1.2,0,0,1.5],[.86,0,1.5,1.2,0,0,1.6],[.94,0,-1.6,1.1,0,0,1.7],[1,0,-1.7,1.1,0,0,1.8]];
function pose(p){let i=0;while(i<K.length-2&&p>K[i+1][0])i++;const a=K[i],b=K[i+1],t=sm(a[0],b[0],p);return a.map((v,j)=>lerp(v,b[j],t))}
const vis=(p,a,b,f=.035)=>clamp((p-a)/f)*clamp((b-p)/f);

function frame(ms){
 const t=ms/1000;ps+=(p-ps)*.09;cur+=(tgt-cur)*.07;mxs+=(mx-mxs)*.06;mys+=(my-mys)*.06;$('#bar').style.width=ps*100+'%';
 const idx=((Math.round(tgt)%NF)+NF)%NF,c=F[idx][1];
 if(idx!==lastF){lastF=idx;syncHash(idx);$('#flavor').innerHTML=F[idx][0].replace('\n','<br>');$('#fdesc').textContent=INFO[idx];$('#dot').style.left=(idx/(NF-1)*100)+'%';$('#chips').innerHTML=[DATA[idx].nut[0],'Sugars '+DATA[idx].nut[2],'Caffeine 8.7 mg'].map(q=>'<span>'+q+'</span>').join('');[...th.children].forEach((b,j)=>b.classList.toggle('on',j===idx));$('#fav').textContent=favs.has(idx)?'♥':'♡';
  const r=document.documentElement.style;r.setProperty('--c',`rgb(${c})`);r.setProperty('--c1',`rgb(${c.map(v=>v*.22|0)})`);r.setProperty('--c2',`rgb(${c.map(v=>v*.75|0)})`)}
 const vh=1-sm(.1,.19,ps),vf=vis(ps,.2,.61),vz=vis(ps,.6,.73),vq=vis(ps,.73,.89),vj=clamp((ps-.89)/.04);
 [[els.hero,vh],[els.feat,vf],[els.zero,vz],[els.faq,vq],[els.join,vj]].forEach(([e,v])=>{e.style.opacity=v;e.classList.toggle('on',v>.5)});
 $('#bgF').style.opacity=Math.max(vf,vh*.38);$('#bgZ').style.opacity=vz;
 const fi=clamp(Math.floor((ps-.265)/.08),0,3);
 if(fi!==lastIdx||idx!==lastFI){lastIdx=fi;lastFI=idx;const f=featFor(idx,fi);$('#ftag').textContent=`0${fi+1} / 04`;$('#ft').textContent=f[0];$('#fp').innerHTML=f[1];[...nav.children].forEach((b,i)=>b.classList.toggle('on',i===fi))}
 if(ps<.15){phi=0;dragPhi=0;dv=0}else{phi+=(TG[fi]-phi)*.045;if(!dragging){dragPhi+=dv;dv*=.93;const w=dragPhi-Math.round(dragPhi/(2*PI))*2*PI;dragPhi=Math.abs(dv)<.004?w*.97:w}}spUsed=false;
 const mob=asp<.85,HY=mob?.28:0,hw=Math.tan(.305)*9*asp,k=pose(ps),_m=mob&&(k[1]=0,k[3]=Math.min(k[3],.95),k[2]+=1.05*sm(.17,.27,ps)*(1-sm(.58,.66,ps))+.85*sm(.86,.94,ps)),others=1-sm(.15,.25,ps),sp=Math.min(1,asp/1.4+.4),D=180/Math.PI;
 for(let i=0;i<NF;i++){
  const off=((i-cur+NF/2)%NF+NF)%NF-NF/2,ao=Math.abs(off),im=IM[i];
  let x,y,s,rz,rx,ry,al,dim,useSpin=false,bl=0;
  if(i===idx||ao<.5){ // active can follows keyframes, blended with carousel slot
   const hx=off*1.15*sp,hy=.5+HY-.06*off*off+Math.sin(t*1.3+i)*.04,blend=sm(.12,.2,ps);bl=blend;useSpin=i===idx&&blend>.001;
   x=lerp(hx,k[1]*hw,blend);y=lerp(hy,k[2],blend);s=lerp((1-.1*ao)*1.25,k[3],blend);
   rz=lerp(-off*.08+Math.sin(t+i)*.05,k[5],blend);rx=lerp(.12+mys*.25,k[4],blend);
   ry=lerp(off*.6+Math.sin(t*.7+i)*.2+mxs*.7,0,blend);
   al=1;dim=lerp(lerp(1,.3,Math.min(1,ao)),1,blend);
  }else{
   x=off*1.15*sp;y=.5+HY-.06*off*off+Math.sin(t*1.3+i)*.05;s=(1-.08*ao)*1.25;
   rz=-off*.08+Math.sin(t+i)*.05;rx=.12;ry=off*.6+Math.sin(t*.7+i)*.2;
   al=others;dim=.3+.1*Math.sin(t+i);
  }
  if(al<.01){im.style.visibility='hidden';continue}
  let el=im;
  if(useSpin&&drawSpin(i,phi+dragPhi+Math.sin(t*.8)*.1*bl,bl*.6)){el=SP;spUsed=true;im.style.visibility='hidden'}else im.style.visibility='visible';
  el.style.visibility='visible';
  el.style.transform=`translate3d(${(W/2+x*UNIT).toFixed(1)}px,${(Hh/2-y*UNIT).toFixed(1)}px,0) translate(-50%,-50%) perspective(900px) rotateX(${(-(rx-.12)*D*.6).toFixed(2)}deg) rotateY(${(ry*D*.35).toFixed(2)}deg) rotateZ(${(-rz*D).toFixed(2)}deg) scale(${s.toFixed(3)})`;
  el.style.opacity=al;el.style.filter=`brightness(${dim.toFixed(2)}) drop-shadow(0 24px 28px rgba(0,0,0,.45))`;el.style.zIndex=10-Math.round(ao*3);
 }
 if(!spUsed)SP.style.visibility='hidden';
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);
})();
