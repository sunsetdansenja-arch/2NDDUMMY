(()=>{"use strict";
const $=id=>document.getElementById(id);
const fields={size:$("sizeInput"),brand:$("brandInput"),waist:$("waistInput"),outseam:$("outseamInput"),lo:$("loInput")};
const preview={size:$("previewSize"),brand:$("previewBrand"),waist:$("previewWaist"),outseam:$("previewOutseam"),lo:$("previewLo")};
const borderToggle=$("borderToggle"),printRoot=$("printRoot");
let copies=1;
const clean=value=>String(value??"").trim();
function updatePreview(){
 Object.keys(fields).forEach(key=>{const value=clean(fields[key].value);preview[key].textContent=value||"—"});
 $("labelPreview").classList.toggle("no-border",!borderToggle.checked);
}
function setCopies(next){copies=Math.max(1,Math.min(20,next));$("copiesValue").textContent=String(copies)}
Object.values(fields).forEach(input=>input.addEventListener("input",updatePreview));
borderToggle.addEventListener("change",updatePreview);
$("minusCopies").addEventListener("click",()=>setCopies(copies-1));
$("plusCopies").addEventListener("click",()=>setCopies(copies+1));
$("resetButton").addEventListener("click",()=>{setTimeout(()=>{setCopies(1);updatePreview()},0)});
function makePrintLabel(){
 const wrapper=document.createElement("div");wrapper.className="print-label";
 const grid=document.createElement("div");grid.className="label-grid";
 const sizeBox=document.createElement("div");sizeBox.className="size-box";
 const caption=document.createElement("span");caption.className="size-caption";caption.textContent="SIZE";
 const size=document.createElement("strong");size.textContent=clean(fields.size.value)||"—";
 sizeBox.append(caption,size);
 const details=document.createElement("div");details.className="detail-list";
 const rows=[["BRAND",clean(fields.brand.value)||"—"],["WAIST",(clean(fields.waist.value)||"—")+"″"],["OUTSEAM",(clean(fields.outseam.value)||"—")+" cm"],["LO",(clean(fields.lo.value)||"—")+" cm"]];
 rows.forEach(([label,value])=>{const row=document.createElement("div");row.className="detail-row";const name=document.createElement("b");name.textContent=label;const val=document.createElement("span");val.textContent=value;row.append(name,val);details.append(row)});
 grid.append(sizeBox,details);
 if(!borderToggle.checked){grid.style.border="0";sizeBox.style.borderRight="0";details.querySelectorAll(".detail-row").forEach((row,i)=>{if(i!==3)row.style.borderBottom="1px solid #000"})}
 wrapper.append(grid);return wrapper;
}
$("printButton").addEventListener("click",()=>{
 if(!clean(fields.size.value)){fields.size.focus();alert("Isi SIZE dulu sebelum mencetak.");return}
 printRoot.replaceChildren();
 for(let i=0;i<copies;i++)printRoot.append(makePrintLabel());
 window.print();
});
updatePreview();
})();