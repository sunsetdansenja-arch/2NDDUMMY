(()=>{"use strict";
const $=id=>document.getElementById(id);
const fields={size:$("sizeInput"),brand:$("brandInput"),waist:$("waistInput"),outseam:$("outseamInput"),lo:$("loInput")};
const preview={size:$("previewSize"),brand:$("previewBrand"),waist:$("previewWaist"),outseam:$("previewOutseam"),lo:$("previewLo")};
const borderToggle=$("borderToggle"),printRoot=$("printRoot"),printMode=$("printMode"),blankQuantity=$("blankQuantity");
let copies=1;
const clean=value=>String(value??"").trim();
const isBlank=()=>printMode.value==="blank";
function updatePreview(){
 Object.keys(fields).forEach(key=>{const value=clean(fields[key].value);preview[key].textContent=value||"—"});
 $("labelPreview").classList.toggle("no-border",!borderToggle.checked);
 $("labelPreview").classList.toggle("blank-preview",isBlank());
 $("previewCaption").innerHTML=isBlank()?'BLANK LABEL — WRITE BY HAND <span>•</span> NO DATA':'LAYOUT A — CLEAN GRID <span>•</span> NO LOGO';
 $("blankQuantityWrap").hidden=!isBlank();
 $("copiesLabel").textContent=isBlank()?"FILLED COPIES":"COPIES";
 $("printHelper").textContent=isBlank()?"Blank label akan dicetak tanpa data produk. Isi dengan pena setelah dicetak. Atur jumlah label kosong di kolom Blank Label Qty.":"Pilih Filled untuk mencetak data produk atau Blank untuk mencetak label kosong yang bisa diisi dengan pena. Gunakan kertas thermal roll 80 mm.";
}
function setCopies(next){copies=Math.max(1,Math.min(20,next));$("copiesValue").textContent=String(copies)}
Object.values(fields).forEach(input=>input.addEventListener("input",updatePreview));
borderToggle.addEventListener("change",updatePreview);
printMode.addEventListener("change",updatePreview);
blankQuantity.addEventListener("input",()=>{const n=parseInt(blankQuantity.value,10);if(Number.isFinite(n))blankQuantity.setCustomValidity(n<1||n>200?"Masukkan jumlah 1 sampai 200.":"");else blankQuantity.setCustomValidity("Masukkan jumlah label.")});
$("minusCopies").addEventListener("click",()=>setCopies(copies-1));
$("plusCopies").addEventListener("click",()=>setCopies(copies+1));
$("resetButton").addEventListener("click",()=>{setTimeout(()=>{setCopies(1);blankQuantity.value=10;printMode.value="filled";updatePreview()},0)});
function makePrintLabel(blank){
 const wrapper=document.createElement("div");wrapper.className="print-label"+(blank?" blank-print-label":"");
 const grid=document.createElement("div");grid.className="label-grid";
 const sizeBox=document.createElement("div");sizeBox.className="size-box";
 const caption=document.createElement("span");caption.className="size-caption";caption.textContent="SIZE";
 const size=document.createElement("strong");size.textContent=blank?"":(clean(fields.size.value)||"—");
 if(blank){const write=document.createElement("span");write.className="blank-write-area size-write-area";sizeBox.append(caption,write)}else sizeBox.append(caption,size);
 const details=document.createElement("div");details.className="detail-list";
 const rows=[["BRAND",clean(fields.brand.value)||"—"],["WAIST",(clean(fields.waist.value)||"—")+"″"],["OUTSEAM",(clean(fields.outseam.value)||"—")+" cm"],["LO",(clean(fields.lo.value)||"—")+" cm"]];
 rows.forEach(([label,value])=>{const row=document.createElement("div");row.className="detail-row";const name=document.createElement("b");name.textContent=label;const val=document.createElement("span");if(blank){val.className="blank-write-area"}else val.textContent=value;row.append(name,val);details.append(row)});
 grid.append(sizeBox,details);
 if(!borderToggle.checked){grid.style.border="0";sizeBox.style.borderRight="0";details.querySelectorAll(".detail-row").forEach((row,i)=>{if(i!==3)row.style.borderBottom="1px solid #000"})}
 wrapper.append(grid);return wrapper;
}
$("printButton").addEventListener("click",()=>{
 const blank=isBlank();
 let quantity=copies;
 if(blank){quantity=Number(blankQuantity.value);if(!Number.isInteger(quantity)||quantity<1||quantity>200){blankQuantity.focus();blankQuantity.reportValidity();return}}
 else if(!clean(fields.size.value)){fields.size.focus();alert("Isi SIZE dulu sebelum mencetak.");return}
 printRoot.replaceChildren();
 for(let i=0;i<quantity;i++)printRoot.append(makePrintLabel(blank));
 window.print();
});
updatePreview();
})();