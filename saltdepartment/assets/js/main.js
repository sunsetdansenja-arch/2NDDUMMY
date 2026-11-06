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
 const pre=document.getElementById("preloader"),seq=document.getElementById("introSequence"),tent=seq?.querySelector(".intro-tentacle"),word=seq?.querySelector(".intro-wordmark");
 if(!pre||!seq)return;
 const assetUrls=["assets/brand/Distressed%20Chrome%20S_D%20Lettering.webp","assets/brand/Chrome%20Tentacle%20Eye%20Emblem.webp","assets/brand/Rugged%20Chrome%20SALT%20DEPT%20Text.webp"];
 let done=false;const finish=()=>{if(done)return;done=true;pre.classList.add("done");document.body.classList.remove("is-loading");setTimeout(()=>pre.remove(),500);};
 Promise.all(assetUrls.map(src=>new Promise(resolve=>{const im=new Image();im.onload=resolve;im.onerror=resolve;im.src=src}))).then(()=>{
 setTimeout(()=>{finish();seq.classList.add("active");tent.classList.add("show");
 setTimeout(()=>{tent.classList.remove("show");tent.classList.add("flip");word.classList.add("show");
 setTimeout(()=>{word.classList.add("to-header");setTimeout(()=>{seq.remove()},900)},1000)},1000);
 },250);
 });
 setTimeout(finish,12000);
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