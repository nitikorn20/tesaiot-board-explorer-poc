import {t} from './locale.js';
import {boards} from './boards.js';
const $=s=>document.querySelector(s);
const stage=$('#model-stage');
if(stage){
 let boardId=$('#board-stage')?.dataset.board||'training',viewer,ready=false,loading=false,generation=0,selected=-1,exploded=false,failed=false;
 const poster=$('#model-poster'),gate=$('#model-gate'),canvas=$('#model-canvas'),load=$('#model-load'),status=$('#model-status');
 function labels(){
  const training=boardId==='training';
  $('#model-kind').textContent=training?'TESA / TRAINING 3D MODEL':'NDR / CONCEPT · NOT FINAL PCB';
  $('#model-load-hint').textContent=training?t('โมเดล TESA 1.9 MB · โหลดเมื่อกด','TESA model 1.9 MB · Loads on demand'):t('รูปทรงจำลอง · ไม่ใช่ CAD จริง','Illustrative geometry · Not final CAD');
  $('#model-disclaimer').textContent=training?t('โมเดลจาก TESAIoT SDK · © TESA อุปกรณ์และ Revision อาจต่างจากชุดที่มี โมเดลไม่รวม OPTIGA Trust M เสริมที่ปรากฏในภาพถ่าย','Model from TESAIoT SDK · © TESA. Devices and revisions may differ from your kit. The model excludes the optional OPTIGA Trust M module shown in the photograph.'):t('Concept เท่านั้น: รูปทรง ขนาด สี ตำแหน่งชิ้นส่วนและขั้วต่อเป็นภาพจำลอง ไม่ใช่ PCB ของ NDR ที่ยืนยันแล้ว ไม่ยืนยัน Pinout หรือความเข้ากันได้ของ Example','Concept only: shapes, dimensions, colors, component and connector positions are illustrative, not confirmed NDR PCB geometry. No pinout or example compatibility is implied.');
  poster.alt=training?t('ภาพชุด QWA309 Training','QWA309 Training assembly'):t('ภาพแนวคิด TSOM และ Base NDR ไม่ใช่แบบ PCB จริง','TSOM and NDR carrier concept, not final PCB geometry');
  load.disabled=loading;
  load.textContent=loading?t('กำลังเตรียมโมเดล…','Loading model…'):failed?t('ลองโหลด 3D อีกครั้ง','Retry 3D'):t('สำรวจแบบ 3D','Explore in 3D');
  status.textContent=failed?t('เปิด 3D ไม่สำเร็จ ภาพนิ่งและ Hardware Tour ด้านล่างยังใช้งานได้','3D could not load. The still image and hardware tour below remain available.'):loading?t('กำลังโหลด Viewer และโมเดล…','Loading viewer and model…'):ready?t('โมเดลพร้อมแล้ว · เลือกจุดเพื่อสำรวจ','Model ready · Select a feature to explore'):t('เริ่มจากภาพนิ่ง แล้วเปิด 3D เมื่อต้องการ','Start with a still image. Open 3D when you’re ready.');
  const parts=training?boards.training.hotspots.slice(0,7):[
   {title:{th:'TSOM / Compute',en:'TSOM / Compute'}},
   {title:{th:'NDR / Base Concept',en:'NDR / Carrier concept'}}
  ];
  $('#model-parts').replaceChildren();
  if(ready)parts.forEach((point,index)=>{
   const button=document.createElement('button');button.type='button';button.textContent=`${index+1}. ${point.title[document.documentElement.lang==='en'?'en':'th']}`;button.setAttribute('aria-pressed',String(index===selected));button.addEventListener('click',()=>select(index));$('#model-parts').append(button);
  });
  $('#model-explode').hidden=training||!ready;
  $('#model-explode').setAttribute('aria-pressed',String(exploded));
  if(ready&&selected>=0){
   status.textContent=training?boards.training.hotspots[selected].desc[document.documentElement.lang==='en'?'en':'th']:selected===0?t('TSOM: ส่วนประมวลผล แยกจาก Base ที่กำลังออกแบบ','TSOM: compute module, separate from the carrier under design.'):t('Base: ภาพจำลองโครงสร้างเพื่ออธิบายแนวคิด ยังไม่ใช่ตำแหน่งอุปกรณ์จริง','Carrier: a structural concept, not confirmed component placement.');
  }
 }
 function select(index){selected=index;viewer?.focus(index);labels();if(boardId==='training')document.dispatchEvent(new CustomEvent('hardwarefocus',{detail:{index}}));}
 function showStill(){generation++;loading=false;ready=false;failed=false;selected=-1;exploded=false;canvas.hidden=true;poster.hidden=false;gate.hidden=false;$('#model-hotspots').hidden=true;$('#model-tools').hidden=true;$('#model-static').hidden=true;viewer?.suspend();labels();}
 function setBoard(id){
  if(id!==boardId){boardId=id;showStill();}
  poster.src=boardId==='training'?'assets/training-board.webp':'assets/ndr-concept.svg';
  labels();
 }
 load.addEventListener('click',async()=>{
  if(loading)return;
  const ticket=++generation;loading=true;failed=false;labels();
  try{
   if(!viewer){const mod=await import('./board-viewer.js');if(ticket!==generation)return;viewer=mod.createBoardViewer(canvas,$('#model-hotspots'),select,()=>{showStill();viewer?.dispose();viewer=undefined;failed=true;labels();});}
   canvas.hidden=false;
   await viewer.show(boardId);
   if(ticket!==generation)return;
   ready=true;loading=false;poster.hidden=true;gate.hidden=true;$('#model-hotspots').hidden=false;$('#model-tools').hidden=false;$('#model-static').hidden=false;viewer.resize();labels();
  }catch(error){
   if(ticket!==generation)return;
   console.warn('Board viewer unavailable:',error.message);loading=false;ready=false;failed=true;canvas.hidden=true;poster.hidden=false;gate.hidden=false;viewer?.suspend();labels();
  }
 });
 $('#model-static').addEventListener('click',showStill);
 document.querySelectorAll('[data-model-action]').forEach(button=>button.addEventListener('click',()=>viewer?.action(button.dataset.modelAction)));
 $('#model-explode').addEventListener('click',()=>{exploded=!exploded;viewer?.explode(exploded);labels();});
 document.addEventListener('boardchange',event=>setBoard(event.detail.id));
 document.addEventListener('languagechange',labels);
 setBoard(boardId);
}
