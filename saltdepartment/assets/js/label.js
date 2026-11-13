(()=>{"use strict";
const $=id=>document.getElementById(id);
const fields={size:$("sizeInput"),waist:$("waistInput"),outseam:$("outseamInput"),price:$("priceInput")};
const preview={size:$("previewSize"),waist:$("previewWaist"),outseam:$("previewOutseam"),price:$("previewPrice")};
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
 const width=576,height=187,canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext("2d",{alpha:false});ctx.fillStyle="#fff";ctx.fillRect(0,0,width,height);ctx.fillStyle="#000";ctx.strokeStyle="#000";
 const top=0,bottom=height,midX=width/2,splitY=Math.round(height*.62);
 if(borderToggle.checked){ctx.lineWidth=2;ctx.strokeRect(0,0,width,height);ctx.beginPath();ctx.moveTo(midX,top);ctx.lineTo(midX,splitY);ctx.moveTo(0,splitY);ctx.lineTo(width,splitY);ctx.moveTo(midX,splitY);ctx.lineTo(midX,bottom);ctx.stroke()}
 const featured=[{label:"SIZE",value:clean(fields.size.value)||"—",x:width*.25},{label:"PRICE",value:clean(fields.price.value)||"—",x:width*.75}];
 ctx.textAlign="center";ctx.textBaseline="middle";
 featured.forEach((item,index)=>{ctx.font="bold 14px Arial";ctx.fillText(item.label,item.x,25);if(!blank){ctx.font=index===0?"900 48px Arial":"900 34px Arial";ctx.fillText(item.value,item.x,75)}})
 const details=[{label:"HALF WAIST",value:(clean(fields.waist.value)||"—")+'″',x:width*.25},{label:"LENGTH",value:(clean(fields.outseam.value)||"—")+" cm",x:width*.75}];
 details.forEach(item=>{ctx.textAlign="center";ctx.font="bold 11px Arial";ctx.fillText(item.label,item.x-48,splitY+(bottom-splitY)/2);if(!blank){ctx.textAlign="right";ctx.font="bold 14px Arial";ctx.fillText(item.value,item.x+52,splitY+(bottom-splitY)/2)}})
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
 const grid=document.createElement("div");grid.className="label-grid label-layout";
 [["SIZE",clean(fields.size.value)||"—"],["PRICE",clean(fields.price.value)||"—"]].forEach(([label,value],index)=>{const cell=document.createElement("div");cell.className="featured-cell"+(index===1?" price-cell":"");const title=document.createElement("span");title.textContent=label;const val=document.createElement("strong");if(!blank)val.textContent=value;cell.append(title,val);grid.append(cell)});
 [["HALF WAIST",(clean(fields.waist.value)||"—")+'″'],["LENGTH",(clean(fields.outseam.value)||"—")+" cm"]].forEach(([label,value])=>{const cell=document.createElement("div");cell.className="detail-cell";const name=document.createElement("b");name.textContent=label;const val=document.createElement("span");if(!blank)val.textContent=value;cell.append(name,val);grid.append(cell)});
 if(!borderToggle.checked){grid.style.border="0";grid.querySelectorAll(".featured-cell").forEach(cell=>cell.style.borderBottom="0");grid.querySelectorAll(".featured-cell:first-child,.detail-cell:first-of-type").forEach(cell=>cell.style.borderRight="0")}
 wrapper.append(grid);return wrapper;
}
updatePreview();
})();