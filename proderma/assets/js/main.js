
(()=>{const header=document.getElementById('header'),progress=document.getElementById('progress'),menu=document.getElementById('menu'),nav=document.getElementById('navlinks');
const onScroll=()=>{const y=window.scrollY,max=document.documentElement.scrollHeight-innerHeight;header.classList.toggle('sticky',y>50);progress.style.width=(max>0?y/max*100:0)+'%'};window.addEventListener('scroll',onScroll,{passive:true});onScroll();
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Tutup navigasi':'Buka navigasi');menu.textContent=open?'×':'☰';document.body.classList.toggle('lock',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';document.body.classList.remove('lock')}));
const nodes=document.querySelectorAll('.reveal');if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});nodes.forEach(n=>io.observe(n))}else nodes.forEach(n=>n.classList.add('visible'));
const video=document.getElementById('heroVideo'),still=document.getElementById('heroStill');if(video&&still){const second=new Image();second.src='https://res.cloudinary.com/naqr1mob/image/upload/v1793335220/Luxury_Clinic_Reception_Celebration.png';video.addEventListener('ended',()=>{video.pause();video.style.opacity='0';still.classList.add('show');window.setTimeout(()=>{still.src=second.src},3000);window.setTimeout(()=>{still.classList.remove('show');video.style.opacity='.55';video.currentTime=0;const p=video.play();if(p&&p.catch)p.catch(()=>{})},5000)});video.addEventListener('error',()=>{video.style.display='none';still.classList.add('show')})}
const range=document.getElementById('baRange'),visual=document.getElementById('baVisual');
const baBefore=document.getElementById('baBeforeImage'),baAfter=document.getElementById('baAfterImage');
const baTag=document.getElementById('baTreatmentTag'),baTitle=document.getElementById('baTreatmentTitle'),baDescription=document.getElementById('baTreatmentDescription');
const baPrev=document.getElementById('baPrev'),baNext=document.getElementById('baNext'),baCount=document.getElementById('baGalleryCount');
const galleryItems=[
 {title:'Bebas Jerawat',before:'https://res.cloudinary.com/naqr1mob/image/upload/v1793335190/Clinical_Acne_Skin_Portrait.png',after:'https://res.cloudinary.com/naqr1mob/image/upload/v1793335117/Clearer_Skin_at_the_Dermatology_Clinic.png',description:'Dokumentasi perbandingan kondisi kulit sebelum dan sesudah treatment.'},
 {title:'Flek Removal',before:'https://res.cloudinary.com/naqr1mob/image/upload/v1793609642/Detailed_Facial_Skin_Texture_Close-Up.png',after:'https://res.cloudinary.com/naqr1mob/image/upload/v1793609624/Dermatological_Close-Up_Portrait.png',description:'Dokumentasi perbandingan kondisi kulit sebelum dan sesudah treatment flek removal.'},
 {title:'Filler Area Dagu & Hidung',before:'https://res.cloudinary.com/naqr1mob/image/upload/v1793610057/Clinical_Side-Profile_Portrait.png',after:'https://res.cloudinary.com/naqr1mob/image/upload/v1793609921/Clinical_Side_Profile_with_Skin_Texture.png',description:'Dokumentasi perbandingan sebelum dan sesudah filler area dagu dan hidung.'}
];
let galleryIndex=0;
const showGalleryItem=(index)=>{
 galleryIndex=(index+galleryItems.length)%galleryItems.length;
 const item=galleryItems[galleryIndex];
 baBefore.src=item.before;baAfter.src=item.after;
 baBefore.alt='Kondisi sebelum treatment '+item.title;baAfter.alt='Kondisi setelah treatment '+item.title;
 baTag.textContent='Treatment · '+item.title;baTitle.textContent=item.title;baDescription.textContent=item.description;
 if(baCount)baCount.textContent=String(galleryIndex+1).padStart(2,'0')+' / '+String(galleryItems.length).padStart(2,'0');

 if(range&&visual){range.value='50';visual.style.setProperty('--split','50%')}
};
if(range&&visual){const set=()=>visual.style.setProperty('--split',range.value+'%');range.addEventListener('input',set);set()}
if(baBefore&&baAfter&&baTag&&baTitle&&baDescription){
 if(baPrev)baPrev.addEventListener('click',()=>showGalleryItem(galleryIndex-1));
 if(baNext)baNext.addEventListener('click',()=>showGalleryItem(galleryIndex+1));
 showGalleryItem(0);
}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
})();
