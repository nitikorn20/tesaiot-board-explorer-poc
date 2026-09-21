import {normalizeFilters,filterExamples,escapeHTML as e} from './catalog.js';
import {lang,t,translateDOM} from './locale.js';
import {english} from './example-translations.js';
const $=selector=>document.querySelector(selector);
const labels={control:'Input & Control',sensors:'Sensors',audio:'Audio',dashboard:'Dashboard',connectivity:'Connectivity'};
let examples=[];
let filters=normalizeFilters(Object.fromEntries(new URLSearchParams(location.search)));
const grid=$('#catalog-grid'),dialog=$('#example-dialog');
const imageCaption=item=>item.imageKind==='upstream-screenshot'?t('Screenshot จาก GitHub ต้นทาง','Original GitHub screenshot'):t('ภาพ Hardware อ้างอิง · ไม่ใช่ Screenshot','Hardware reference · not a screenshot');
const translated=item=>lang()==='en'?{...item,...english[item.id]}:item;
function card(original,featured=false){
  const item=translated(original),open=featured?'':`data-open="${e(item.id)}"`;
  return `<article class="example-card ${item.imageKind==='hardware-reference'?'hardware-card':''}"><a class="example-image" href="examples.html#${e(item.id)}" ${open} aria-label="${t('ดูรายละเอียด','View details')}: ${e(item.subtitle)}"><img src="${e(item.image)}" alt="${e(imageCaption(item))}: ${e(item.subtitle)}" width="800" height="480" loading="lazy"><span class="image-caption">${e(imageCaption(item))}</span></a><div class="example-body"><div class="example-kicker"><span>${labels[item.category]}</span><span class="level">${e(item.difficulty)}</span></div><h3><a href="examples.html#${e(item.id)}" ${open}>${e(item.title)}</a></h3><p class="example-subtitle">${e(item.subtitle)}</p><p class="example-description">${e(item.description)}</p><div class="example-hardware">${item.hardware.slice(0,3).map(h=>`<span>${e(h)}</span>`).join('')}${item.hardware.length>3?`<span>+${item.hardware.length-3}</span>`:''}</div><div class="example-bottom"><span>${item.imageKind==='hardware-reference'?'QWA309 / Training Kit':'PSoC Edge AI Kit'}</span><a href="examples.html#${e(item.id)}" ${open} aria-label="${t('รายละเอียด','Details')}: ${e(item.subtitle)}">${t('ดูรายละเอียด','View example')} ↗</a></div></div></article>`;
}
function updateURL(){const url=new URL(location.href);for(const [key,value] of Object.entries(filters)){if(value&&value!=='all')url.searchParams.set(key,value);else url.searchParams.delete(key);}history.replaceState(null,'',url);}
function renderCatalog(){
  const visible=filterExamples(examples,filters);
  grid.innerHTML=visible.map(item=>card(item)).join('');grid.setAttribute('aria-busy','false');
  $('#result-count').textContent=t(`${visible.length} Examples · จากชุดที่คัดไว้ ${examples.length} รายการ`,`${visible.length} examples · ${examples.length} in this collection`);
  if(document.activeElement!==$('#search'))$('#search').value=filters.q;
  $('#board-filter').value=filters.board;$('#level-filter').value=filters.level;
  document.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===filters.category)));
  const message=$('#catalog-message');message.hidden=visible.length>0;
  if(!visible.length)message.innerHTML=filters.board==='ndr'?`<span class="mono">NDR BASE / COMPATIBILITY PENDING</span><h2>${t('บอร์ดใหม่ ต้องยืนยันใหม่','New base. New validation.')}</h2><p>${t('ยังไม่มี Example ที่ยืนยันสำหรับ NDR Base ใหม่ใน PoC นี้ ต้องระบุ Revision, BSP, อุปกรณ์ และผล Validation แยกจาก Training','This PoC has no verified examples for the new NDR base. Revision, BSP, hardware and validation must be documented separately from Training.')}</p><button class="button primary" data-reset>${t('ดูตัวอย่าง Training ที่คัดไว้','Browse the Training collection')} ↗</button>`:`<span class="mono">NO MATCHES</span><h2>${t('ยังไม่พบตัวอย่างที่ตรงกัน','No matching examples yet.')}</h2><p>${t('ลองค้นชื่อ Sensor เช่น BMI270, Pot หรือ Wi-Fi หรือล้างตัวกรอง','Try a sensor or feature such as BMI270, Pot or Wi-Fi, or clear your filters.')}</p><button class="button secondary" data-reset>${t('ล้างตัวกรอง','Reset filters')}</button>`;
}
function detailFromHash(){
  if(!dialog)return;
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{id='';}
  const original=examples.find(item=>item.id===id);
  if(!original){if(dialog.open)dialog.close();return;}
  const item=translated(original);
  $('#dialog-content').innerHTML=`<figure class="detail-image ${item.imageKind==='hardware-reference'?'hardware-reference':''}"><img src="${e(item.image)}" alt="${e(imageCaption(item))}: ${e(item.subtitle)}" width="800" height="480"><figcaption>${e(imageCaption(item))} · ${t('ไม่ใช่ผลทดสอบของ PoC','Not PoC hardware-test evidence')}</figcaption></figure><div class="detail-copy"><div class="example-kicker"><span>${labels[item.category]}</span><span class="level">${e(item.difficulty)}</span></div><h2 id="detail-title">${e(item.subtitle)}</h2><p class="detail-outcome">${e(item.outcome)}</p><h3>Hardware & Requirements</h3><div class="example-hardware">${item.hardware.map(h=>`<span>${e(h)}</span>`).join('')}</div><dl class="source-facts"><div><dt>${t('Board IDs จากต้นทาง','Original Board IDs')}</dt><dd>${item.originalBoards.map(b=>`<code>${e(b)}</code>`).join(' ')}</dd></div><div><dt>GitHub branch</dt><dd>${e(item.branch)}</dd></div><div><dt>Source snapshot</dt><dd><code>${e(item.ref.slice(0,12))}</code></dd></div></dl>${item.note?`<p class="notice">${e(item.note)}</p>`:''}<p class="detail-warning">${t('ต้องมี Master Template, BSP และอุปกรณ์ที่ README ระบุ PoC นี้ยังไม่ Build/Flash ตัวอย่าง และไม่รับรอง NDR Base ใหม่','Use the master template, BSP and hardware specified in the README. This PoC has not built or flashed the example and does not certify the new NDR base.')}</p><div class="actions"><a class="button primary" href="${e(item.readme)}" target="_blank" rel="noopener noreferrer">${t('อ่าน README','Read README')} ↗</a><a class="button secondary" href="${e(item.source)}" target="_blank" rel="noopener noreferrer">${t('เปิด Source Code','View source')} ↗</a></div><p class="detail-footnote">${t('Online Flash ยังไม่เชื่อมต่อใน Design PoC','Online Flash is not connected in this design PoC.')}</p></div>`;
  if(!dialog.open)dialog.showModal();document.body.classList.add('modal-open');dialog.scrollTop=0;
}
if(grid){
  $('#search').addEventListener('input',event=>{filters.q=event.target.value.trim().slice(0,120);renderCatalog();updateURL();});
  for(const [id,key] of [['#board-filter','board'],['#level-filter','level']])$(id).addEventListener('change',event=>{filters[key]=event.target.value;renderCatalog();updateURL();});
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{filters.category=button.dataset.category;renderCatalog();updateURL();}));
  const reset=()=>{filters=normalizeFilters();renderCatalog();updateURL();};$('#reset-filters').addEventListener('click',reset);
  document.addEventListener('click',event=>{const open=event.target.closest('[data-open]');if(open&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&event.button===0){event.preventDefault();location.hash=open.dataset.open;}if(event.target.closest('[data-reset]'))reset();});
  window.addEventListener('hashchange',detailFromHash);
  window.addEventListener('popstate',()=>{filters=normalizeFilters(Object.fromEntries(new URLSearchParams(location.search)));renderCatalog();detailFromHash();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(examples.some(item=>`#${item.id}`===location.hash))history.replaceState(null,'',location.pathname+location.search);});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
}
let loadingFailed=false;
function renderError(){const target=grid||$('#featured-grid');target.setAttribute('aria-busy','false');target.innerHTML=`<div class="notice load-error" role="alert"><h3>${t('โหลดชุดข้อมูลไม่สำเร็จ','The collection could not load.')}</h3><p>${t('ลองใหม่ หรือเปิด GitHub ต้นทางโดยตรง','Try again, or open the source on GitHub.')}</p><button class="button secondary" id="retry-catalog">${t('ลองอีกครั้ง','Try again')}</button> <a class="text-link" href="https://github.com/tesaiot/developer-hub">GitHub ↗</a></div>`;if($('#result-count'))$('#result-count').textContent=t('ยังโหลดข้อมูลไม่ได้','Collection unavailable');$('#retry-catalog').addEventListener('click',loadCatalog);}
async function loadCatalog(){
  if(!grid&&!$('#featured-grid'))return;
  try{const response=await fetch('data/catalog.json');if(!response.ok)throw Error('Catalog unavailable');const catalog=await response.json();if(!Array.isArray(catalog.examples))throw Error('Invalid catalog');examples=catalog.examples.map(item=>({...item,searchTerms:Object.values(english[item.id]||{})}));loadingFailed=false;if(grid){renderCatalog();detailFromHash();}else $('#featured-grid').innerHTML=examples.filter(item=>item.featured).map(item=>card(item,true)).join('');}
  catch{loadingFailed=true;renderError();}
}
document.addEventListener('languagechange',()=>{translateDOM();if(loadingFailed)renderError();else if(grid){renderCatalog();detailFromHash();}else if($('#featured-grid'))$('#featured-grid').innerHTML=examples.filter(item=>item.featured).map(item=>card(item,true)).join('');});
loadCatalog();
