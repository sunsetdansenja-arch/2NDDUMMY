// Always start a fresh page view at the top; avoid browser scroll restoration.
if("scrollRestoration" in history)history.scrollRestoration="manual";
window.scrollTo(0,0);
window.addEventListener("pageshow",()=>{if(window.scrollY!==0)window.scrollTo(0,0)});
const STORE_KEY="saltdepartment.products.v1";
const seed=[
{id:"SD-001",brand:"Quiksilver",size:"L",price:185000,condition:"Good",title:"Quiksilver Tribal Boardshort",status:"available",image:"",createdAt:"2026-11-06"},
{id:"SD-002",brand:"Billabong",size:"M",price:175000,condition:"Very Good",title:"Billabong Vintage Boardshort",status:"available",image:"",createdAt:"2026-11-06"},
{id:"SD-003",brand:"O'Neill",size:"XL",price:225000,condition:"Excellent",title:"O'Neill Surf Boardshort",status:"available",image:"",createdAt:"2026-11-06"}
];
const readProducts=()=>{try{return JSON.parse(localStorage.getItem(STORE_KEY))||seed}catch{return seed}};
const writeProducts=items=>localStorage.setItem(STORE_KEY,JSON.stringify(items));
const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0);
const safe=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function initIntro(){
 const pre=document.getElementById("preloader"),sequence=document.getElementById("introSequence"),introLogo=document.getElementById("introWordmark"),headerLogo=document.getElementById("headerWordmark"),video=document.querySelector(".site-background-video");
 if(!pre||!sequence||!introLogo||!headerLogo)return;
 const waitForImage=src=>new Promise(resolve=>{const image=new Image();image.onload=resolve;image.onerror=resolve;image.src=src});
 const waitForVideo=()=>new Promise(resolve=>{if(!video||video.readyState>=2){resolve();return}const done=()=>resolve();video.addEventListener("loadeddata",done,{once:true});video.addEventListener("error",done,{once:true});setTimeout(done,6500)});
 let ready=false,raf=0;
 const transitionDistance=180;
 const revealIntro=()=>{if(ready)return;ready=true;document.body.classList.remove("is-loading");pre.classList.add("done");setTimeout(()=>pre.remove(),500);sequence.classList.add("active");introLogo.classList.add("centered");introLogo.style.opacity="1";updateScrollState()};
 const clamp=n=>Math.max(0,Math.min(1,n));
 const updateScrollState=()=>{
  if(!ready)return;
  const progress=clamp(window.scrollY/transitionDistance);
  if(!introLogo.dataset.startRect){const r=introLogo.getBoundingClientRect();introLogo.dataset.startRect=JSON.stringify({left:r.left,top:r.top,width:r.width,height:r.height})}
  const origin=JSON.parse(introLogo.dataset.startRect),target=headerLogo.getBoundingClientRect();
  const mix=(a,b,t)=>a+(b-a)*t;
  const x=mix(origin.left+origin.width/2,target.left+target.width/2,progress);
  const y=mix(origin.top+origin.height/2,target.top+target.height/2,progress);
  introLogo.style.left=x+"px";introLogo.style.top=y+"px";
  introLogo.style.width=mix(origin.width,target.width,progress)+"px";
  introLogo.style.height=mix(origin.height,target.height,progress)+"px";
  introLogo.style.transform="translate(-50%,-50%)";
  introLogo.style.opacity=String(1-clamp((progress-.88)/.12));
  headerLogo.style.opacity=String(progress);
  const introLabels=document.getElementById("introLabels");if(introLabels)introLabels.style.opacity=String(1-progress);
  document.body.classList.toggle("site-revealed",progress>=.999);
  document.body.classList.toggle("site-entered",progress>=.999);
 };
 const onScroll=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;updateScrollState()})};
 Promise.all([waitForImage("assets/brand/Distressed%20Chrome%20S_D%20Lettering.webp"),waitForImage("assets/brand/Rugged%20Chrome%20SALT%20DEPT%20Text.webp"),waitForVideo()]).then(revealIntro);
 setTimeout(revealIntro,9000);
 window.addEventListener("scroll",onScroll,{passive:true});
 window.addEventListener("resize",()=>{introLogo.dataset.startRect="";if(ready){introLogo.style.left="50%";introLogo.style.top="50%";introLogo.style.width="min(86vw,760px)";introLogo.style.height="min(58vh,420px)";updateScrollState()}},{passive:true});
}
function initStore(){
 const grid=document.getElementById("productGrid");if(!grid)return;
 const search=document.getElementById("searchInput"),brand=document.getElementById("brandFilter"),size=document.getElementById("sizeFilter"),min=document.getElementById("minPrice"),max=document.getElementById("maxPrice"),count=document.getElementById("resultCount"),empty=document.getElementById("emptyState");
 let products=readProducts();
 const populateBrands=()=>{const val=brand.value;brand.innerHTML='<option value="">ALL BRANDS</option>'+[...new Set(products.map(p=>p.brand).filter(Boolean))].sort().map(b=>'<option>'+safe(b)+'</option>').join("");brand.value=val};
 const render=()=>{const q=search.value.trim().toLowerCase();const shown=products.filter(p=>p.status!=="sold"&&(!q||[p.title,p.brand,p.id].join(" ").toLowerCase().includes(q))&&(!brand.value||p.brand===brand.value)&&(!size.value||p.size===size.value)&&(!min.value||Number(p.price)>=Number(min.value))&&(!max.value||Number(p.price)<=Number(max.value)));
 count.textContent=shown.length;empty.hidden=shown.length!==0;grid.innerHTML=shown.map(p=>'<article class="product-card"><div class="product-image">'+(p.image?'<img loading="lazy" src="'+safe(p.image)+'" alt="'+safe(p.title)+'">':'<div class="image-placeholder">SALT<br>DEPT.</div>')+'<span class="product-tag">'+safe(p.condition||"PRELOVED")+'</span></div><div class="product-info"><div class="product-topline"><span>'+safe(p.brand)+'</span><span>'+safe(p.size)+'</span></div><h3>'+safe(p.title)+'</h3><div class="product-price">'+money(p.price)+'</div><div class="product-condition">ONE-OFF PIECE · '+safe(p.id)+'</div></div></article>').join("");};
 populateBrands();render();[search,brand,size,min,max].forEach(el=>el.addEventListener("input",render));document.getElementById("resetFilters")?.addEventListener("click",()=>{[search,brand,size,min,max].forEach(el=>el.value="");render()});
}
function initMenu(){const b=document.querySelector(".menu-toggle"),n=document.querySelector(".main-nav");if(b&&n)b.addEventListener("click",()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",String(o));});if(n)n.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{n.classList.remove("open");b?.setAttribute("aria-expanded","false")}));}
initIntro();initStore();initMenu();