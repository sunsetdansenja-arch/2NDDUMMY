
(()=>{const header=document.getElementById('header'),progress=document.getElementById('progress'),menu=document.getElementById('menu'),nav=document.getElementById('navlinks');
const onScroll=()=>{const y=window.scrollY,max=document.documentElement.scrollHeight-innerHeight;header.classList.toggle('sticky',y>50);progress.style.width=(max>0?y/max*100:0)+'%'};window.addEventListener('scroll',onScroll,{passive:true});onScroll();
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Tutup navigasi':'Buka navigasi');menu.textContent=open?'×':'☰';document.body.classList.toggle('lock',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';document.body.classList.remove('lock')}));
const nodes=document.querySelectorAll('.reveal');if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});nodes.forEach(n=>io.observe(n))}else nodes.forEach(n=>n.classList.add('visible'));
const video=document.getElementById('heroVideo'),still=document.getElementById('heroStill');if(video&&still){const second=new Image();second.src='https://res.cloudinary.com/naqr1mob/image/upload/v1793335220/Luxury_Clinic_Reception_Celebration.png';video.addEventListener('ended',()=>{video.pause();video.style.opacity='0';still.classList.add('show');window.setTimeout(()=>{still.src=second.src},3000);window.setTimeout(()=>{still.classList.remove('show');video.style.opacity='.55';video.currentTime=0;const p=video.play();if(p&&p.catch)p.catch(()=>{})},5000)});video.addEventListener('error',()=>{video.style.display='none';still.classList.add('show')})}
const range=document.getElementById('baRange'),visual=document.getElementById('baVisual');
const treatmentButtons=document.querySelectorAll('[data-treatment]');
const baBefore=document.getElementById('baBeforeImage'),baAfter=document.getElementById('baAfterImage');
const baTag=document.getElementById('baTreatmentTag'),baTitle=document.getElementById('baTreatmentTitle'),baDescription=document.getElementById('baTreatmentDescription'),baNote=document.getElementById('baTreatmentNote');
const treatmentCases={
 acne:{title:'Bebas Jerawat',before:'https://res.cloudinary.com/naqr1mob/image/upload/v1793335190/Clinical_Acne_Skin_Portrait.png',after:'https://res.cloudinary.com/naqr1mob/image/upload/v1793335117/Clearer_Skin_at_the_Dermatology_Clinic.png',description:'Dokumentasi perbandingan kondisi kulit sebelum dan sesudah treatment.',note:''},
 fleks:{title:'Flek Removal',before:'https://res.cloudinary.com/naqr1mob/image/upload/v1793609624/Dermatological_Close-Up_Portrait.png',after:'https://res.cloudinary.com/naqr1mob/image/upload/v1793609624/Dermatological_Close-Up_Portrait.png',description:'Dokumentasi visual untuk treatment flek removal.',note:'Catatan: gambar before dan after yang diberikan saat ini sama. Kirim foto after yang berbeda agar perbandingan hasilnya dapat terlihat.'},
 threadlift:{title:'Threadlift',before:'https://res.cloudinary.com/naqr1mob/image/upload/v1793609708/Clinical_Close-Up_of_Natural_Lips_1.png',after:'https://res.cloudinary.com/naqr1mob/image/upload/v1793609918/Clinical_Close-Up_of_Natural_Lips.png',description:'Dokumentasi perbandingan sebelum dan sesudah treatment threadlift.',note:''},
 filler:{title:'Filler Area Dagu & Hidung',before:'https://res.cloudinary.com/naqr1mob/image/upload/v1793610057/Clinical_Side-Profile_Portrait.png',after:'https://res.cloudinary.com/naqr1mob/image/upload/v1793609921/Clinical_Side_Profile_with_Skin_Texture.png',description:'Dokumentasi perbandingan sebelum dan sesudah filler area dagu dan hidung.',note:''}
};
if(range&&visual){const set=()=>visual.style.setProperty('--split',range.value+'%');range.addEventListener('input',set);set()}
if(treatmentButtons.length&&baBefore&&baAfter&&baTag&&baTitle&&baDescription&&baNote){
treatmentButtons.forEach(button=>button.addEventListener('click',()=>{
const item=treatmentCases[button.dataset.treatment];if(!item)return;
baBefore.src=item.before;baAfter.src=item.after;
baBefore.alt='Kondisi sebelum treatment '+item.title;baAfter.alt='Kondisi setelah treatment '+item.title;
baTag.textContent='Treatment · '+item.title;baTitle.textContent=item.title;baDescription.textContent=item.description;baNote.textContent=item.note;
treatmentButtons.forEach(option=>option.setAttribute('aria-pressed',String(option===button)));
if(range&&visual){range.value='50';visual.style.setProperty('--split','50%')}
}));
}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
})();
