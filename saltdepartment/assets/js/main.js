// Start every fresh load at the intro, never at the browser-restored scroll position.
if("scrollRestoration" in history)history.scrollRestoration="manual";
const resetPageToIntro=()=>{
 document.body.classList.remove("site-entered","site-revealed");
 window.scrollTo(0,0);
 requestAnimationFrame(()=>{window.scrollTo(0,0);requestAnimationFrame(()=>window.scrollTo(0,0))});
};
resetPageToIntro();
window.addEventListener("pageshow",resetPageToIntro);
window.addEventListener("load",resetPageToIntro,{once:true});

/* Storefront language system — default English, toggle to Indonesian. */
const LANGUAGE_KEY="saltdepartment.language.v1";
const translations={
 en:{navShop:"SHOP ALL",navAbout:"THE DEPARTMENT",navManage:"MANAGE ↗",heroEyebrow:"CURATED PRELOVED BOARDSHORTS / DROP 001",heroTitle:"FOUND<br>BY THE<br><em>TIDE.</em>",heroSub:"Good boardshorts deserve another session.",heroCta:"ENTER THE DEPARTMENT",scrollDiscover:"SCROLL TO DISCOVER ↓",rotationEyebrow:"01 / THE ROTATION",shopTitle:"SHOP THE<br><em>FINDS.</em>",piecesInRotation:"PIECES IN ROTATION",search:"SEARCH",searchPlaceholder:"Brand or product name",brand:"BRAND",allBrands:"ALL BRANDS",size:"SIZE",priceRange:"PRICE RANGE (IDR)",from:"FROM",to:"TO",resetFilters:"RESET FILTERS ↺",emptyState:"NO PIECES MATCH. TRY ANOTHER SEARCH.",manifestoLabel:"02 / THE DEPARTMENT",manifestoEyebrow:"PRE-OWNED. RE-SELECTED.",manifestoTitle:"GOOD GEAR.<br>ANOTHER <em>RUN.</em>",manifestoCopy:"One-off preloved boardshorts, individually checked and documented. Every piece has its own story, condition and fit — no duplicates promised.",manifestoSide:"FOUND, NOT MADE.<br>WORN, NOT WASTED.",oneOff:"ONE-OFF PIECE",preloved:"PRELOVED",conditions:{Excellent:"Excellent", "Very Good":"Very Good",Good:"Good",Fair:"Fair"},searchBrands:"Brand or product name"},
 id:{navShop:"LIHAT SEMUA",navAbout:"TENTANG KAMI",navManage:"KELOLA ↗",heroEyebrow:"BOARDSHORT PRELOVED PILIHAN / DROP 001",heroTitle:"DITEMUKAN<br>OLEH<br><em>OMBAK.</em>",heroSub:"Boardshort berkualitas layak menemani sesi berikutnya.",heroCta:"MASUK KE DEPARTEMEN",scrollDiscover:"GULIR UNTUK MENJELAJAH ↓",rotationEyebrow:"01 / KOLEKSI PILIHAN",shopTitle:"TEMUKAN<br><em>PILIHAN.</em>",piecesInRotation:"PRODUK TERSEDIA",search:"CARI",searchPlaceholder:"Nama brand atau produk",brand:"MEREK",allBrands:"SEMUA MEREK",size:"UKURAN",priceRange:"RENTANG HARGA (IDR)",from:"DARI",to:"HINGGA",resetFilters:"ATUR ULANG FILTER ↺",emptyState:"PRODUK TIDAK DITEMUKAN. COBA PENCARIAN LAIN.",manifestoLabel:"02 / TENTANG KAMI",manifestoEyebrow:"PRELOVED. DIPILIH KEMBALI.",manifestoTitle:"PERLENGKAPAN TERPILIH.<br>SIAP UNTUK <em>BERAKSI.</em>",manifestoCopy:"Boardshort preloved pilihan yang diperiksa dan didokumentasikan satu per satu. Setiap produk punya cerita, kondisi, dan ukuran tersendiri — tanpa menjanjikan stok duplikat.",manifestoSide:"DITEMUKAN, BUKAN DIPRODUKSI.<br>PERNAH DIPAKAI, BUKAN TERBUANG.",oneOff:"PRODUK UNIK",preloved:"PRELOVED",conditions:{Excellent:"Sangat Baik","Very Good":"Baik Sekali",Good:"Baik",Fair:"Cukup"},searchBrands:"Nama merek atau produk"}
};
let currentLanguage=localStorage.getItem(LANGUAGE_KEY)==="id"?"id":"en";
function t(key){return translations[currentLanguage][key]??translations.en[key]??key}
function applyLanguage(){
 document.documentElement.lang=currentLanguage;
 document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
 document.querySelectorAll("[data-i18n-html]").forEach(el=>el.innerHTML=t(el.dataset.i18nHtml));
 document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder));
 const toggle=document.getElementById("languageToggle");
 if(toggle){toggle.textContent=currentLanguage.toUpperCase();toggle.setAttribute("aria-pressed",String(currentLanguage==="id"));toggle.setAttribute("aria-label",currentLanguage==="en"?"Switch language to Indonesian":"Ganti bahasa ke Inggris")}
 document.title=currentLanguage==="en"?"SALT DEPARTMENT — Preloved Boardshorts":"SALT DEPARTMENT — Boardshort Preloved";
 document.querySelectorAll("#brandFilter option[value='']").forEach(o=>o.textContent=t("allBrands"));
 if(typeof window.renderStoreProducts==="function")window.renderStoreProducts();
}
function setLanguage(lang){
 const nextLanguage=lang==="id"?"id":"en";
 if(nextLanguage===currentLanguage)return;
 const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const translated=document.querySelectorAll("[data-i18n],[data-i18n-html],[data-i18n-placeholder]");
 if(reduceMotion){currentLanguage=nextLanguage;localStorage.setItem(LANGUAGE_KEY,currentLanguage);applyLanguage();return}
 document.body.classList.remove("language-revealing");
 document.body.classList.add("language-changing");
 translated.forEach(el=>el.classList.add("language-text"));
 window.setTimeout(()=>{
  currentLanguage=nextLanguage;
  localStorage.setItem(LANGUAGE_KEY,currentLanguage);
  applyLanguage();
  document.body.classList.remove("language-changing");
  document.body.classList.add("language-revealing");
  window.requestAnimationFrame(()=>{
   window.requestAnimationFrame(()=>{
    document.body.classList.remove("language-revealing");
    translated.forEach(el=>el.classList.remove("language-text"));
   });
  });
 },130);
}

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
 const waitForImage=src=>new Promise(resolve=>{
  const image=new Image();
  const done=()=>resolve();
  image.onload=done;image.onerror=done;image.src=src;
  if(image.complete)done();
 });
 const waitForVideo=()=>new Promise(resolve=>{
  if(!video||video.readyState>=2){resolve();return}
  video.addEventListener("loadeddata",resolve,{once:true});
  video.addEventListener("error",resolve,{once:true});
 });
 const waitForFonts=()=>document.fonts?.ready||Promise.resolve();
 let ready=false,raf=0;
 const transitionDistance=180;
 const revealIntro=()=>{
  if(ready)return;
  ready=true;
  // Prepare the intro behind the preloader before allowing any storefront UI to paint.
  sequence.classList.add("active");
  introLogo.classList.add("centered");
  introLogo.style.opacity="1";
  updateScrollState();
  requestAnimationFrame(()=>{
   document.body.classList.remove("is-loading");
   pre.classList.add("done");
   setTimeout(()=>pre.remove(),500);
  });
 };
 const clamp=n=>Math.max(0,Math.min(1,n));
 const updateScrollState=()=>{
  if(!ready)return;
  const progress=clamp(window.scrollY/transitionDistance);
  document.body.classList.toggle("logo-morphing",progress>0&&progress<.999);
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
 Promise.all([
  waitForImage("assets/brand/Distressed%20Chrome%20S_D%20Lettering.webp"),
  waitForImage("assets/brand/Rugged%20Chrome%20SALT%20DEPT%20Text.webp"),
  waitForVideo(),
  waitForFonts()
 ]).then(revealIntro);
 window.addEventListener("scroll",onScroll,{passive:true});
 window.addEventListener("resize",()=>{introLogo.dataset.startRect="";if(ready){introLogo.style.left="50%";introLogo.style.top="50%";introLogo.style.width="min(86vw,760px)";introLogo.style.height="min(58vh,420px)";updateScrollState()}},{passive:true});
}
function initStore(){
 const grid=document.getElementById("productGrid");if(!grid)return;
 const search=document.getElementById("searchInput"),brand=document.getElementById("brandFilter"),size=document.getElementById("sizeFilter"),min=document.getElementById("minPrice"),max=document.getElementById("maxPrice"),count=document.getElementById("resultCount"),empty=document.getElementById("emptyState");
 let products=readProducts();
 const populateBrands=()=>{const val=brand.value;brand.innerHTML='<option value="">'+safe(t("allBrands"))+'</option>'+[...new Set(products.map(p=>p.brand).filter(Boolean))].sort().map(b=>'<option>'+safe(b)+'</option>').join("");brand.value=val};
 const render=()=>{const q=search.value.trim().toLowerCase();const shown=products.filter(p=>p.status!=="sold"&&(!q||[p.title,p.brand,p.id].join(" ").toLowerCase().includes(q))&&(!brand.value||p.brand===brand.value)&&(!size.value||p.size===size.value)&&(!min.value||Number(p.price)>=Number(min.value))&&(!max.value||Number(p.price)<=Number(max.value)));
 count.textContent=shown.length;empty.hidden=shown.length!==0;grid.innerHTML=shown.map((p,index)=>'<article class="product-card" style="--card-index:'+index+'"><div class="product-image">'+(p.image?'<img loading="lazy" src="'+safe(p.image)+'" alt="'+safe(p.title)+'">':'<div class="image-placeholder">SALT<br>DEPT.</div>')+'<span class="product-tag">'+safe(translations[currentLanguage].conditions[p.condition]||p.condition||t("preloved"))+'</span></div><div class="product-info"><div class="product-topline"><span>'+safe(p.brand)+'</span><span>'+safe(p.size)+'</span></div><h3>'+safe(p.title)+'</h3><div class="product-price">'+money(p.price)+'</div><div class="product-condition">'+safe(t("oneOff"))+' · '+safe(p.id)+'</div></div></article>').join("");};
 window.renderStoreProducts=render;
 populateBrands();render();[search,brand,size,min,max].forEach(el=>el.addEventListener("input",render));document.getElementById("resetFilters")?.addEventListener("click",()=>{[search,brand,size,min,max].forEach(el=>el.value="");render()});
}
function spinControl(button){
 if(!button)return;
 button.classList.remove("is-spinning");
 // Restart the CSS animation on every deliberate press.
 void button.offsetWidth;
 button.classList.add("is-spinning");
 button.addEventListener("animationend",()=>button.classList.remove("is-spinning"),{once:true});
}
function initMenu(){
 const languageButton=document.getElementById("languageToggle");
 const b=document.querySelector(".menu-toggle"),n=document.querySelector(".main-nav");
 applyLanguage();
 languageButton?.addEventListener("click",()=>{
  setLanguage(currentLanguage==="en"?"id":"en");
  spinControl(languageButton);
 });
 if(b&&n)b.addEventListener("click",()=>{
  const o=n.classList.toggle("open");
  b.setAttribute("aria-expanded",String(o));
  spinControl(b);
 });
 if(n)n.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  n.classList.remove("open");b?.setAttribute("aria-expanded","false")
 }));
}
initIntro();initStore();initMenu();