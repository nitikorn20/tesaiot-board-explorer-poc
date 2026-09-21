import {boards} from './boards.js';
import {icon} from './icons.js';
import {escapeHTML as e} from './catalog.js';
import {lang,t,translateDOM,setLanguage} from './locale.js';
import {thresholdRGB} from './hardware-logic.js';
const $=selector=>document.querySelector(selector);
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
function updateThemeControl(){
  const dark=document.documentElement.dataset.theme!=='light';
  $('#theme-toggle').innerHTML=icon(dark?'sun':'moon');
  $('#theme-toggle').setAttribute('aria-label',dark?t('เปลี่ยนเป็น Light Theme','Switch to light theme'):t('เปลี่ยนเป็น Dark Theme','Switch to dark theme'));
  $('#theme-toggle').title=dark?'Light theme':'Dark theme';
}
$('#theme-toggle').addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='light'?'dark':'light';
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('tesa-theme',theme);}catch{}
  updateThemeControl();
});
translateDOM();updateThemeControl();

let boardId=new URLSearchParams(location.search).get('board')==='ndr'?'ndr':'training';
let blockId='power';
const stage=$('#board-stage');
function showBlock(id){
  const block=boards[boardId].groups.find(b=>b.id===id)||boards[boardId].groups[0];blockId=block.id;
  document.querySelectorAll('[data-block]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.block===blockId)));
  $('#architecture-detail').innerHTML=`${icon(block.icon)}<div><h4>${e(block.title)} · ${e(block.bus)}</h4><p>${e(block.desc[lang()])}</p></div>`;
}
function renderBoard(){
  if(!stage)return;
  const board=boards[boardId];
  document.querySelectorAll('button[data-board]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.board===boardId)));
  if($('#board-page-title'))$('#board-page-title').textContent=board.name;
  if($('#board-page-summary'))$('#board-page-summary').textContent=boardId==='training'?t('QWA309 + KIT_PSE84_AI: ทดลอง Input, Sensor, Audio และ HMI จากภาพบอร์ดจริง พร้อมเชื่อมไปยัง Example และ SDK','QWA309 + KIT_PSE84_AI: explore inputs, sensors, audio and HMI on the real assembly, then continue to examples and the SDK.'):t('TSOM + Base ใหม่ของ NDR: ภาพจำลองแนวคิด ไม่ใช่ PCB ที่เสร็จแล้ว ต้องยืนยัน Revision, BSP และ Interface ก่อนเริ่มพัฒนา','TSOM + the new NDR base: an illustrative concept, not a finished PCB. Confirm revision, BSP and interfaces before development.');
  document.querySelectorAll('[data-training-only]').forEach(el=>{el.hidden=boardId!=='training';});
  stage.dataset.board=boardId;
  document.querySelectorAll('[data-board-overview]').forEach(el=>{el.hidden=el.dataset.boardOverview!==boardId;});
  $('#architecture-title').textContent=board.name;
  const half=Math.ceil(board.groups.length/2);
  const node=block=>`<button type="button" class="architecture-node" data-block="${block.id}" aria-pressed="false" aria-controls="architecture-detail">${icon(block.icon)}<span><b>${e(block.title)}</b><small>${e(block.bus)}</small>${block.optional?`<span class="optional">${t('รอยืนยัน','NOT CONFIRMED')}</span>`:''}</span></button>`;
  $('#architecture-content').innerHTML=`<div class="architecture-canvas" style="--nodes:${half}"><div class="node-stack">${board.groups.slice(0,half).map(node).join('')}</div><div class="core-block">${icon('chip')}<b>${boardId==='training'?'KIT_PSE84_AI':'TSOM MODULE'}</b><small>PSoC™ Edge E84<br>${boardId==='training'?'QWA309 BASE':'NDR BASE · DRAFT'}</small></div><div class="node-stack">${board.groups.slice(half).map(node).join('')}</div></div>`;
  document.querySelectorAll('[data-block]').forEach(button=>button.addEventListener('click',()=>showBlock(button.dataset.block)));
  showBlock(blockId);
  document.dispatchEvent(new CustomEvent('boardchange',{detail:{id:boardId}}));
}
function changeBoard(id){
  if(!Object.hasOwn(boards,id))return;
  boardId=id;blockId='power';renderBoard();
  const url=new URL(location.href);url.searchParams.set('board',id);history.replaceState(null,'',url);
}
if(stage){
  document.querySelectorAll('button[data-board]').forEach(button=>button.addEventListener('click',()=>changeBoard(button.dataset.board)));
  renderBoard();
}

function updateSimulation(){
  if(!$('#rgb-matrix'))return;
  const values=['R','G','B'].map(channel=>Number($(`#pot-${channel}`).value));
  ['R','G','B'].forEach((channel,index)=>{$(`#pot-${channel}-value`).textContent=`${values[index]}%`;});
  const bits=thresholdRGB(values);
  $('#color-code').textContent=`RGB ${bits.join('')}`;
  $('#rgb-matrix').style.setProperty('--rgb',bits.every(value=>value===0)?'#182231':`rgb(${bits.map(value=>value*255).join(' ')})`);
  $('#rgb-matrix').setAttribute('aria-label',t(`แบบจำลอง RGB: ${bits.join('')}, ไม่เชื่อมต่อบอร์ด`,`Simulated RGB: ${bits.join('')}, no hardware connected`));
}
document.querySelectorAll('.pot-control input').forEach(input=>input.addEventListener('input',updateSimulation));updateSimulation();
document.addEventListener('languagechange',()=>{updateThemeControl();renderBoard();updateSimulation();});
