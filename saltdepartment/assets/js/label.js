(()=>{"use strict";
const $=id=>document.getElementById(id);
const fields={size:$("sizeInput"),brand:$("brandInput"),waist:$("waistInput"),outseam:$("outseamInput"),lo:$("loInput")};
const preview={size:$("previewSize"),brand:$("previewBrand"),waist:$("previewWaist"),outseam:$("previewOutseam"),lo:$("previewLo")};
const borderToggle=$("borderToggle"),printRoot=$("printRoot"),printMode=$("printMode"),blankQuantity=$("blankQuantity");
const statusEl=$("printerStatus"),connectButton=$("connectPrinterButton");
const OPTIONAL_SERVICES=["000018f0-0000-1000-8000-00805f9b34fb","0000e025-0000-1000-8000-00805f9b34fb","00001101-0000-1000-8000-00805f9b34fb"];
let copies=1,cachedBluetoothDevice=null,printerCharacteristic=null,connectionPromise=null;
const wiredDevices=new WeakSet();
const clean=value=>String(value??"").trim();
const isBlank=()=>printMode.value==="blank";
function status(message,connected=false){statusEl.textContent=message;statusEl.classList.toggle("connected",connected)}
function updatePreview(){
 Object.keys(fields).forEach(key=>{const value=clean(fields[key].value);preview[key].textContent=value||"—"});
 $("labelPreview").classList.toggle("no-border",!borderToggle.checked);
 $("labelPreview").classList.toggle("blank-preview",isBlank());
 $("previewCaption").innerHTML=isBlank()?'BLANK LABEL — WRITE BY HAND <span>•</span> NO DATA':'LAYOUT A — CLEAN GRID <span>•</span> NO LOGO';
 $("blankQuantityWrap").hidden=!isBlank();
 $("copiesLabel").textContent="COPIES";
 $("printHelper").textContent=isBlank()?"Blank label dicetak tanpa data produk, dengan ruang kosong untuk ditulis menggunakan pena. Atur jumlah pada Blank Label Qty.":"Connect MP80 / RPP20N terlebih dahulu. Pilih Filled atau Blank, lalu cetak langsung via Bluetooth. Browser Print tersedia sebagai alternatif.";
}
function setCopies(next){copies=Math.max(1,Math.min(20,next));$("copiesValue").textContent=String(copies)}
Object.values(fields).forEach(input=>input.addEventListener("input",updatePreview));
borderToggle.addEventListener("change",updatePreview);
printMode.addEventListener("change",updatePreview);
blankQuantity.addEventListener("input",()=>{const n=parseInt(blankQuantity.value,10);blankQuantity.setCustomValidity(Number.isInteger(n)&&n>=1&&n<=200?"": "Masukkan jumlah 1 sampai 200.")});
$("minusCopies").addEventListener("click",()=>setCopies(copies-1));
$("plusCopies").addEventListener("click",()=>setCopies(copies+1));
$("resetButton").addEventListener("click",()=>{setTimeout(()=>{setCopies(1);blankQuantity.value=10;printMode.value="filled";updatePreview()},0)});

async function connectSelectedDevice(device){
 if(!device)throw new Error("Printer Bluetooth belum dipilih.");
 cachedBluetoothDevice=device;
 // Reuse the active GATT session and cached writable characteristic.
 if(device.gatt?.connected&&printerCharacteristic){status("CONNECTED · "+(device.name||"MP80"),true);return printerCharacteristic}
 if(connectionPromise)return connectionPromise;
 connectionPromise=(async()=>{
  if(!wiredDevices.has(device)){
   device.addEventListener("gattserverdisconnected",()=>{
    printerCharacteristic=null;
    status("DISCONNECTED");
   });
   wiredDevices.add(device);
  }
  status("CONNECTING…");
  const server=device.gatt.connected?device.gatt:await device.gatt.connect();
  const services=await server.getPrimaryServices();
  let characteristic=null;
  for(const service of services){
   const characteristics=await service.getCharacteristics();
   for(const item of characteristics){if(item.properties.write||item.properties.writeWithoutResponse){characteristic=item;break}}
   if(characteristic)break;
  }
  if(!characteristic)throw new Error("Printer terhubung, tetapi characteristic Bluetooth yang bisa ditulis tidak ditemukan. Pastikan printer mendukung BLE GATT.");
  printerCharacteristic=characteristic;
  status("CONNECTED · "+(device.name||"MP80"),true);
  return characteristic;
 })();
 try{return await connectionPromise}finally{connectionPromise=null}
}
async function connectFromUserGesture(){
 if(!navigator.bluetooth)throw new Error("Web Bluetooth tidak tersedia. Buka halaman ini melalui Chrome/Edge desktop dan HTTPS.");
 // No chooser, reconnect, or GATT scan when the current session is still alive.
 if(cachedBluetoothDevice?.gatt?.connected&&printerCharacteristic)return printerCharacteristic;
 if(cachedBluetoothDevice)return connectSelectedDevice(cachedBluetoothDevice);
 const chooser=navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:OPTIONAL_SERVICES});
 const device=await chooser;
 return connectSelectedDevice(device);
}
// Pulihkan perangkat yang pernah diberi izin pada kunjungan sebelumnya.
if(navigator.bluetooth?.getDevices){
 navigator.bluetooth.getDevices().then(devices=>{
  cachedBluetoothDevice=devices.find(d=>d.name&&(/MP.?80|RPP.?20N|RPP02N|printer/i.test(d.name)))||devices[0]||null;
  if(cachedBluetoothDevice)status("PRINTER REMEMBERED");
 }).catch(()=>{});
}
connectButton.addEventListener("click",async()=>{
 connectButton.disabled=true;connectButton.textContent="CONNECTING";
 try{await connectFromUserGesture();connectButton.textContent="CONNECTED"}
 catch(error){console.error("Bluetooth connect:",error);status("CONNECTION FAILED");alert(error.message||"Gagal menghubungkan printer.");connectButton.textContent="CONNECT"}
 finally{connectButton.disabled=false}
});

function renderLabelCanvas(blank){
 const width=576,height=374,canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext("2d",{alpha:false});ctx.fillStyle="#fff";ctx.fillRect(0,0,width,height);ctx.fillStyle="#000";ctx.strokeStyle="#000";
 const labelLeft=width*.25,labelRight=width*.75,top=height*.25,bottom=height*.75,margin=4,left=labelLeft+(labelRight-labelLeft)*.4,right=labelRight;
 if(borderToggle.checked){ctx.lineWidth=2;ctx.strokeRect(labelLeft,top,labelRight-labelLeft,bottom-top);ctx.beginPath();ctx.moveTo(left,top);ctx.lineTo(left,bottom);ctx.stroke()}
 const boxX=labelLeft+margin,boxW=left-boxX;
 ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="bold 17px Arial";ctx.fillText("SIZE",boxX+boxW/2,top+29);
 if(!blank){ctx.font="900 56px Arial";ctx.fillText(clean(fields.size.value)||"—",boxX+boxW/2,top+97)}
 const rowH=(bottom-top)/4,labels=["BRAND","WAIST","OUTSEAM","LO"];
 const values=[clean(fields.brand.value)||"—",(clean(fields.waist.value)||"—")+'″',(clean(fields.outseam.value)||"—")+" cm",(clean(fields.lo.value)||"—")+" cm"];
 ctx.textBaseline="middle";
 for(let i=0;i<4;i++){
  const y=top+rowH*i;
  if(i>0){ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke()}
  const cy=y+rowH/2;ctx.textAlign="left";ctx.font="bold 11px Arial";ctx.fillText(labels[i],left+7,cy);
  if(!blank){ctx.textAlign="right";ctx.font="bold 13px Arial";ctx.fillText(values[i],right-7,cy)}
 }
 return ctx.getImageData(0,0,width,height);
}
function rasterCommand(imageData){
 const {width,height,data}=imageData,bytesPerRow=Math.ceil(width/8),raster=new Uint8Array(bytesPerRow*height);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const p=(y*width+x)*4,gray=(data[p]*299+data[p+1]*587+data[p+2]*114)/1000;if(gray<160)raster[y*bytesPerRow+(x>>3)]|=0x80>>(x&7)}
 const header=Uint8Array.from([0x1d,0x76,0x30,0x00,bytesPerRow&255,(bytesPerRow>>8)&255,height&255,(height>>8)&255]);
 const out=new Uint8Array(header.length+raster.length);out.set(header);out.set(raster,header.length);return out;
}
async function writeBytes(characteristic,bytes){
 const useResponse=!!(characteristic.properties.write&&characteristic.writeValueWithResponse);
 const chunkSize=useResponse?180:100;
 for(let offset=0;offset<bytes.length;offset+=chunkSize){
  if(!cachedBluetoothDevice?.gatt?.connected)throw new Error("Koneksi printer terputus saat mengirim data.");
  const chunk=bytes.slice(offset,Math.min(offset+chunkSize,bytes.length));
  if(useResponse)await characteristic.writeValueWithResponse(chunk);
  else if(characteristic.writeValueWithoutResponse){
   await characteristic.writeValueWithoutResponse(chunk);
   await new Promise(resolve=>setTimeout(resolve,18));
  }else if(characteristic.writeValue)await characteristic.writeValue(chunk);
  else throw new Error("Printer tidak menyediakan metode penulisan Bluetooth.");
 }
}
async function printBluetooth(){
 const blank=isBlank();let quantity=copies;
 if(blank){quantity=Number(blankQuantity.value);if(!Number.isInteger(quantity)||quantity<1||quantity>200){blankQuantity.focus();blankQuantity.reportValidity();return}}
 else if(!clean(fields.size.value)){fields.size.focus();alert("Isi SIZE dulu sebelum mencetak.");return}
 const characteristic=await connectFromUserGesture();
 for(let i=0;i<quantity;i++){
  const init=Uint8Array.from([0x1b,0x40]);
  await writeBytes(characteristic,init);
  await writeBytes(characteristic,rasterCommand(renderLabelCanvas(blank)));
  await writeBytes(characteristic,Uint8Array.from([0x0a,0x0a]));
 }
}
$("printButton").addEventListener("click",async()=>{
 const button=$("printButton");button.disabled=true;button.textContent="CONNECTING / PRINTING…";
 try{await printBluetooth();status("PRINT SENT",true)}
 catch(error){console.error("Bluetooth print:",error);status("DISCONNECTED");alert(error.message||"Gagal mencetak melalui Bluetooth.");}
 finally{button.disabled=false;button.innerHTML='<span>▣</span> PRINT VIA BLUETOOTH'}
});
$("browserPrintButton").addEventListener("click",()=>{
 const blank=isBlank();let quantity=copies;
 if(blank){quantity=Number(blankQuantity.value);if(!Number.isInteger(quantity)||quantity<1||quantity>200){blankQuantity.focus();blankQuantity.reportValidity();return}}
 else if(!clean(fields.size.value)){fields.size.focus();alert("Isi SIZE dulu sebelum mencetak.");return}
 printRoot.replaceChildren();for(let i=0;i<quantity;i++)printRoot.append(makeBrowserLabel(blank));window.print();
});
function makeBrowserLabel(blank){
 const wrapper=document.createElement("div");wrapper.className="print-label"+(blank?" blank-print-label":"");
 const grid=document.createElement("div");grid.className="label-grid";
 const sizeBox=document.createElement("div");sizeBox.className="size-box";
 const caption=document.createElement("span");caption.className="size-caption";caption.textContent="SIZE";
 sizeBox.append(caption);
 if(blank){}
 else{const size=document.createElement("strong");size.textContent=clean(fields.size.value)||"—";sizeBox.append(size)}
 const details=document.createElement("div");details.className="detail-list";
 const rows=[["BRAND",clean(fields.brand.value)||"—"],["WAIST",(clean(fields.waist.value)||"—")+"″"],["OUTSEAM",(clean(fields.outseam.value)||"—")+" cm"],["LO",(clean(fields.lo.value)||"—")+" cm"]];
 rows.forEach(([label,value])=>{const row=document.createElement("div");row.className="detail-row";const name=document.createElement("b");name.textContent=label;const val=document.createElement("span");if(!blank)val.textContent=value;row.append(name,val);details.append(row)});
 grid.append(sizeBox,details);
 if(!borderToggle.checked){grid.style.border="0";sizeBox.style.borderRight="0";details.querySelectorAll(".detail-row").forEach((row,i)=>{if(i!==3)row.style.borderBottom="1px solid #000"})}
 wrapper.append(grid);return wrapper;
}
updatePreview();
})();