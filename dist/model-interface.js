import {lang,t} from './locale.js';
import {boards} from './boards.js';
import {icon} from './icons.js';
import {escapeHTML as e} from './catalog.js';
import {featureIndex,modelFeatureIndex,normalizeBoard} from './explorer-state.js';

const $=s=>document.querySelector(s);
const photo=$('#board-stage');
if(photo){
 let boardId=normalizeBoard(photo.dataset.board),selected=0,view='photo';
 let viewer,ready=false,loading=false,failed=false,generation=0,exploded=false;
 const canvas=$('#model-canvas'),pins=$('#model-hotspots'),parts=$('#model-parts');
 const board=()=>boards[boardId];

 function updateSelection(){
  const point=board().hotspots[selected];
  for(const container of [photo,parts])container.querySelectorAll('[data-feature]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.feature)===selected)));
  $('#hotspot-count').textContent=`${String(selected+1).padStart(2,'0')} / ${String(board().hotspots.length).padStart(2,'0')}`;
  $('#hotspot-detail').innerHTML=`${icon(point.icon)}<div><p class="feature-spec">${e(point.spec)}</p><h3>${e(point.title[lang()])}</h3><p>${e(point.desc[lang()])}</p><a href="${e(point.href)}" ${point.href.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}>${t('สำรวจต่อ','Explore this capability')} ↗</a></div>`;
  $('#model-photo-note').hidden=!(view==='3d'&&modelFeatureIndex(boardId,selected)===null);
 }
 function labels(){
  const training=boardId==='training';
  $('#photo-view-label').textContent=training?t('ภาพถ่าย','Photo'):t('ภาพแนวคิด','Concept');
  $('#model-view-label').textContent=training?'3D':'3D Concept';
  document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
  $('#model-load').disabled=loading;
  canvas.setAttribute('aria-busy',String(loading));
  $('#model-tools').hidden=!ready||view!=='3d';
  $('#model-explode').hidden=training||!ready;
  $('#model-explode').setAttribute('aria-pressed',String(exploded));
  $('#model-retry').hidden=!failed;
  $('#model-kind').textContent=training?(ready&&view==='3d'?'TESA / TRAINING 3D MODEL':'TESA / TRAINING PHOTO'):'NDR / CONCEPT · NOT FINAL PCB';
  $('#board-caption').textContent=ready&&view==='3d'?(training?t('โมเดลจาก TESAIoT SDK · © TESA','Model from TESAIoT SDK · © TESA'):t('รูปทรงจำลอง SOM + Base · ไม่ใช่ CAD ฉบับจริง','Illustrative SOM + carrier geometry · Not final CAD')):board().caption[lang()];
  $('#model-status').textContent=failed?t('เปิด 3D ไม่สำเร็จ ใช้ภาพและ Hotspot ต่อได้ หรือลองโหลดอีกครั้ง','3D could not load. The image and hotspots remain available, or retry.'):loading?t('กำลังโหลด 3D… ภาพและรายละเอียด Hotspot ยังใช้งานได้','Loading 3D… The image and feature details remain available.'):ready&&view==='3d'?t('ลากเพื่อหมุน · ใช้ปุ่มเพื่อซูม · เลือกหมายเลขเพื่อดูรายละเอียด','Drag to orbit · Use buttons to zoom · Select a numbered feature'):training?t('Hover / แตะหมายเลข · เปิด 3D เมื่อกดเท่านั้น (โมเดล 1.9 MB)','Hover / tap a number · 3D loads only when selected (1.9 MB model)'):t('ภาพแนวคิด · แตะหมายเลขเพื่อสำรวจ SOM / Base','Concept illustration · Select a number to explore SOM / carrier');
  $('#model-disclaimer').textContent=training?t('ภาพและโมเดลจาก TESAIoT SDK · อุปกรณ์และ Revision อาจต่างจากชุดที่มี โมเดลไม่รวม OPTIGA Trust M เสริมที่ปรากฏในภาพถ่าย','Image and model from TESAIoT SDK. Devices and revisions may differ from your kit. The model excludes the optional OPTIGA Trust M module shown in the photograph.'):t('Concept เท่านั้น: รูปทรง ขนาด สี ตำแหน่งชิ้นส่วนและขั้วต่อเป็นภาพจำลอง ไม่ใช่ PCB ของ NDR ที่ยืนยันแล้ว ไม่ยืนยัน Pinout หรือความเข้ากันได้ของ Example','Concept only: shapes, dimensions, colors, component and connector positions are illustrative, not confirmed NDR PCB geometry. No pinout or example compatibility is implied.');
  $('#hotspot-prev').setAttribute('aria-label',t('จุด Hardware ก่อนหน้า','Previous hardware point'));
  $('#hotspot-next').setAttribute('aria-label',t('จุด Hardware ถัดไป','Next hardware point'));
  photo.querySelector('img').alt=board().caption[lang()];
  photo.querySelectorAll('[data-feature]').forEach((button,i)=>{
   const point=board().hotspots[i];button.setAttribute('aria-label',`${i+1}. ${point.title[lang()]}`);
   button.querySelector('.pin-tooltip').innerHTML=`<b>${icon(point.icon)}${e(point.title[lang()])}</b><small>${e(point.spec)}</small>`;
  });
  [...parts.children].forEach((button,i)=>{button.innerHTML=`<span class="feature-number">${i+1}</span>${icon(board().hotspots[i].icon)}<span>${e(board().hotspots[i].title[lang()])}</span>`;});
  [...pins.children].forEach((button,i)=>{const point=board().hotspots[i];if(point)button.setAttribute('aria-label',`${i+1}. ${point.title[lang()]} (3D)`);});
  updateSelection();
 }
 function select(index,focusCamera=true){
  selected=featureIndex(boardId,index);
  if(ready&&view==='3d'){
   const modelIndex=modelFeatureIndex(boardId,selected);
   if(focusCamera&&modelIndex!==null)viewer.focus(modelIndex);
   else viewer.select(modelIndex??-1);
  }
  updateSelection();
 }
 function keyboard(event,index,container){
  if(event.key==='Escape'){photo.classList.add('tooltip-dismissed');return;}
  const next={ArrowRight:index+1,ArrowDown:index+1,ArrowLeft:index-1,ArrowUp:index-1,Home:0,End:board().hotspots.length-1}[event.key];
  if(next===undefined)return;
  event.preventDefault();container.querySelector(`[data-feature="${featureIndex(boardId,next)}"]`).focus({preventScroll:true});
 }
 function renderFeatures(){
  photo.dataset.board=boardId;
  photo.innerHTML=`<img id="model-poster" src="${board().image}" width="${boardId==='training'?1000:600}" height="${boardId==='training'?750:400}" alt="${e(board().caption[lang()])}">`;
  photo.insertAdjacentHTML('beforeend',board().hotspots.map((point,i)=>`<button type="button" class="hotspot" style="--x:${point.x}%;--y:${point.y}%" data-feature="${i}" data-side="${point.x<35?'start':point.x>65?'end':'middle'}" aria-label="${i+1}. ${e(point.title[lang()])}" aria-controls="hotspot-detail" aria-pressed="${i===selected}"><span>${i+1}</span><span class="pin-tooltip" aria-hidden="true"></span></button>`).join(''));
  parts.replaceChildren();
  board().hotspots.forEach((point,index)=>{
   const button=document.createElement('button');button.type='button';button.dataset.feature=index;button.setAttribute('aria-controls','hotspot-detail');
   button.addEventListener('click',()=>select(index));button.addEventListener('focus',()=>select(index));button.addEventListener('keydown',event=>keyboard(event,index,parts));parts.append(button);
  });
  photo.querySelectorAll('[data-feature]').forEach((button,index)=>{
   const activate=()=>{photo.classList.remove('tooltip-dismissed');select(index,false);};
   button.addEventListener('click',activate);button.addEventListener('focus',activate);
   button.addEventListener('pointerenter',event=>{if(['mouse','pen'].includes(event.pointerType))activate();});
   button.addEventListener('keydown',event=>keyboard(event,index,photo));
  });
  labels();
 }
 function showPhoto(){
  generation++;view='photo';loading=false;ready=false;failed=false;exploded=false;
  viewer?.suspend();canvas.hidden=true;pins.hidden=true;photo.hidden=false;labels();
 }
 async function showModel(){
  if(loading||ready&&view==='3d')return;
  const ticket=++generation,id=boardId;view='3d';loading=true;failed=false;labels();
  try{
   if(!viewer){
    const mod=await import('./board-viewer.js');if(ticket!==generation)return;
    viewer=mod.createBoardViewer(canvas,pins,index=>select(index),()=>{
     showPhoto();viewer?.dispose();viewer=undefined;failed=true;labels();
    });
   }
   canvas.hidden=false;
   await viewer.show(id);
   if(ticket!==generation)return;
   ready=true;loading=false;photo.hidden=true;pins.hidden=false;
   [...pins.children].forEach((button,index)=>{
    button.setAttribute('aria-controls','hotspot-detail');
    button.addEventListener('focus',()=>select(index,false));
    button.addEventListener('pointerenter',event=>{if(['mouse','pen'].includes(event.pointerType))select(index,false);});
   });
   viewer.resize();viewer.select(modelFeatureIndex(boardId,selected)??-1);labels();
  }catch(error){
   if(ticket!==generation)return;
   console.warn('Board viewer unavailable:',error.message);showPhoto();failed=true;labels();
  }
 }
 $('#model-load').addEventListener('click',showModel);
 $('#model-retry').addEventListener('click',showModel);
 $('[data-view="photo"]').addEventListener('click',showPhoto);
 $('#model-static').addEventListener('click',()=>{showPhoto();photo.querySelector(`[data-feature="${selected}"]`).focus({preventScroll:true});});
 $('#hotspot-prev').addEventListener('click',()=>select(selected-1));
 $('#hotspot-next').addEventListener('click',()=>select(selected+1));
 document.querySelectorAll('[data-model-action]').forEach(button=>button.addEventListener('click',()=>{viewer?.action(button.dataset.modelAction);if(button.dataset.modelAction==='reset')viewer?.select(modelFeatureIndex(boardId,selected)??-1);}));
 $('#model-explode').addEventListener('click',()=>{exploded=!exploded;viewer?.explode(exploded);labels();});
 document.addEventListener('boardchange',event=>{
  const next=normalizeBoard(event.detail.id);
  if(next!==boardId){showPhoto();boardId=next;selected=0;renderFeatures();}
  else labels();
 });
 document.addEventListener('languagechange',labels);
 renderFeatures();
}
