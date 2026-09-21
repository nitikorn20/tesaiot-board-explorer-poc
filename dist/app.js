import { categories, normalizeFilters, filterExamples, escapeHTML as e } from './catalog.js';

const $ = selector => document.querySelector(selector);
const categoryLabel = value => categories[value] || value;
let examples = [];
let filters = normalizeFilters(Object.fromEntries(new URLSearchParams(location.search)));
const grid = $('#catalog-grid');
const dialog = $('#example-dialog');
const imageCaption = item => item.imageKind === 'upstream-screenshot' ? 'Screenshot จาก GitHub ต้นทาง' : 'ภาพ Hardware อ้างอิง · ต้นทางไม่มี Screenshot';

function card(item, featured = false) {
  return `<article class="example-card ${item.imageKind==='hardware-reference'?'hardware-card':''}">
    <a class="example-image" href="examples.html#${e(item.id)}" ${!featured?`data-open="${e(item.id)}"`:''} aria-label="ดูรายละเอียด ${e(item.subtitle)}"><img src="${e(item.image)}" alt="${e(imageCaption(item))}: ${e(item.subtitle)}" width="800" height="480" loading="lazy"><span class="image-caption">${e(imageCaption(item))}</span></a>
    <div class="example-body"><div class="example-kicker"><span>${e(categoryLabel(item.category))}</span><span class="level">${e(item.difficulty)}</span></div><h3><a href="examples.html#${e(item.id)}" ${!featured?`data-open="${e(item.id)}"`:''}>${e(item.title)}</a></h3><p class="example-subtitle">${e(item.subtitle)}</p><p class="example-description">${e(item.description)}</p><div class="example-hardware">${item.hardware.slice(0,3).map(h=>`<span>${e(h)}</span>`).join('')}${item.hardware.length>3?`<span>+${item.hardware.length-3}</span>`:''}</div><div class="example-bottom"><span>${item.imageKind==='hardware-reference'?'QWA309 / Training Kit':'PSoC Edge AI Kit'}</span><a href="examples.html#${e(item.id)}" ${!featured?`data-open="${e(item.id)}"`:''} aria-label="รายละเอียด ${e(item.subtitle)}">ดูรายละเอียด ↗</a></div></div></article>`;
}

function updateURL() {
  const url = new URL(location.href);
  for (const [key,value] of Object.entries(filters)) {
    if (value && value !== 'all') url.searchParams.set(key,value);
    else url.searchParams.delete(key);
  }
  history.replaceState(null,'',url);
}

function renderCatalog() {
  const visible = filterExamples(examples,filters);
  grid.innerHTML = visible.map(item=>card(item)).join('');
  grid.setAttribute('aria-busy','false');
  $('#result-count').textContent = `${visible.length} Examples · จากชุดที่คัดไว้ ${examples.length} รายการ`;
  if (document.activeElement !== $('#search')) $('#search').value = filters.q;
  $('#board-filter').value = filters.board;
  $('#level-filter').value = filters.level;
  document.querySelectorAll('[data-category]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category===filters.category)));
  const message = $('#catalog-message');
  message.hidden = visible.length > 0;
  if (!visible.length) {
    message.innerHTML = filters.board==='ndr'
      ? '<span class="mono">NDR BASE / COMPATIBILITY PENDING</span><h2>บอร์ดใหม่ ต้องยืนยันใหม่</h2><p>ยังไม่มี Example ที่ยืนยันสำหรับ NDR Base ใหม่ในชุด PoC นี้<br>เมื่อพร้อม จะเพิ่ม Base Revision, BSP, อุปกรณ์ และผล Validation ของแต่ละ Example แยกจาก Training</p><button type="button" class="button primary" data-reset>ดูตัวอย่าง Training ที่คัดไว้ ↗</button>'
      : '<span class="mono">NO MATCHES</span><h2>ยังไม่พบตัวอย่างที่ตรงกัน</h2><p>ลองค้นชื่อ Sensor เช่น BMI270, Pot หรือ Wi-Fi<br>หรือล้างตัวกรองเพื่อดูชุดตัวอย่างทั้งหมด</p><button type="button" class="button secondary" data-reset>ล้างตัวกรอง</button>';
  }
}

function detailFromHash() {
  if (!dialog) return;
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ''; }
  const item = examples.find(item=>item.id===id);
  if (!item) { if (dialog.open) dialog.close(); return; }
  $('#dialog-content').innerHTML = `<figure class="detail-image ${item.imageKind==='hardware-reference'?'hardware-reference':''}"><img src="${e(item.image)}" alt="${e(imageCaption(item))}: ${e(item.subtitle)}" width="800" height="480"><figcaption>${e(imageCaption(item))} · ไม่ใช่ผลทดสอบของ PoC นี้</figcaption></figure><div class="detail-copy"><div class="example-kicker"><span>${e(categoryLabel(item.category))}</span><span class="level">${e(item.difficulty)}</span></div><h2 id="detail-title">${e(item.subtitle)}</h2><p class="detail-outcome">${e(item.outcome)}</p><h3>Hardware & Requirements</h3><div class="example-hardware">${item.hardware.map(h=>`<span>${e(h)}</span>`).join('')}</div><dl class="source-facts"><div><dt>Board IDs จากต้นทาง</dt><dd>${item.originalBoards.map(b=>`<code>${e(b)}</code>`).join(' ')}</dd></div><div><dt>GitHub branch</dt><dd>${e(item.branch)}</dd></div><div><dt>Source snapshot</dt><dd><code>${e(item.ref.slice(0,12))}</code></dd></div></dl>${item.note?`<p class="notice">${e(item.note)}</p>`:''}<p class="detail-warning">ต้องมี Master Template, BSP และอุปกรณ์ที่ README ระบุ ตัวอย่างนี้ยังไม่ถูก Build หรือ Flash โดย PoC และไม่ยืนยันความเข้ากันได้กับ NDR Base ใหม่</p><div class="actions"><a class="button primary" href="${e(item.readme)}" target="_blank" rel="noopener noreferrer">อ่าน README ↗</a><a class="button secondary" href="${e(item.source)}" target="_blank" rel="noopener noreferrer">เปิด Source Code ↗</a></div><p class="detail-footnote">Online Flash ยังไม่เชื่อมต่อใน Design PoC</p></div>`;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop = 0;
}

if (grid) {
  $('#search').addEventListener('input',event=>{ filters.q=event.target.value.trim().slice(0,120); renderCatalog(); updateURL(); });
  $('#board-filter').addEventListener('change',event=>{ filters.board=event.target.value; renderCatalog(); updateURL(); });
  $('#level-filter').addEventListener('change',event=>{ filters.level=event.target.value; renderCatalog(); updateURL(); });
  document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{ filters.category=button.dataset.category; renderCatalog(); updateURL(); }));
  const reset = () => { filters=normalizeFilters(); renderCatalog(); updateURL(); };
  $('#reset-filters').addEventListener('click',reset);
  document.addEventListener('click',event=>{
    const open = event.target.closest('[data-open]');
    if (open && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button===0) {
      event.preventDefault(); location.hash=open.dataset.open;
    }
    if (event.target.closest('[data-reset]')) reset();
  });
  window.addEventListener('hashchange',detailFromHash);
  window.addEventListener('popstate',()=>{ filters=normalizeFilters(Object.fromEntries(new URLSearchParams(location.search))); renderCatalog(); detailFromHash(); });
  dialog.addEventListener('close',()=>{ document.body.classList.remove('modal-open'); if (examples.some(item=>`#${item.id}`===location.hash)) history.replaceState(null,'',location.pathname+location.search); });
  dialog.addEventListener('click',event=>{ if (event.target===dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close(); } });
}

async function loadCatalog() {
  const target = grid || $('#featured-grid');
  if (!target) return;
  try {
    const response = await fetch('data/catalog.json');
    if (!response.ok) throw new Error('Catalog unavailable');
    const catalog = await response.json();
    if (!Array.isArray(catalog.examples)) throw new Error('Invalid catalog');
    examples = catalog.examples;
    if (grid) { renderCatalog(); detailFromHash(); }
    else target.innerHTML=examples.filter(item=>item.featured).map(item=>card(item,true)).join('');
  } catch {
    target.setAttribute('aria-busy','false');
    target.innerHTML='<div class="notice load-error" role="alert"><h3>โหลดชุดข้อมูลไม่สำเร็จ</h3><p>ลองโหลดใหม่ หรือเปิด GitHub ต้นทางโดยตรง</p><button class="button secondary" type="button" id="retry-catalog">ลองอีกครั้ง</button> <a class="text-link" href="https://github.com/tesaiot/developer-hub">GitHub ↗</a></div>';
    if ($('#result-count')) $('#result-count').textContent='ยังโหลดชุดข้อมูลไม่ได้';
    $('#retry-catalog').addEventListener('click',loadCatalog);
  }
}
loadCatalog();

const features = {
  input:{label:'POTENTIOMETER / BUTTON / ADC',title:'เปลี่ยนการหมุน<br>ให้เป็นข้อมูลและสี',description:'อ่านค่า Pot บน QWA309 แล้วนำไปแสดงเป็นกราฟ หรือควบคุมสี RGB Matrix จาก Input จริง',href:'examples.html?category=control',link:'Explore Input Examples ↗'},
  display:{label:'LCD / TOUCH / LVGL',title:'สร้างหน้าจอ<br>ที่โต้ตอบกับ Hardware',description:'ใช้ LVGL แสดงข้อมูล Sensor และสร้าง HMI แบบสัมผัส รวมถึงหน้า Wi-Fi Manager ตามตัวอย่างต้นทาง',href:'examples.html?category=dashboard',link:'Explore Dashboard ↗'},
  sensor:{label:'IMU / ENVIRONMENT / PDM MICROPHONE',title:'รับรู้การเคลื่อนไหว<br>สิ่งแวดล้อมและเสียง',description:'ตัวอย่างต้นทางครอบคลุม BMI270, DPS368, SHT4x, BMM350 และ PDM Microphone โดยตรวจอุปกรณ์และ BSP ของชุด Kit ก่อนทดลอง',href:'examples.html?category=sensors',link:'Explore Sensor Examples ↗'},
  connect:{label:'WI-FI / CAN / RS485',title:'จากบอร์ดหนึ่งชุด<br>สู่ระบบที่เชื่อมต่อกัน',description:'ชุด Training มี Interface สำหรับงานเชื่อมต่อ ใน PoC นี้คัด Wi-Fi Manager มาแสดง ส่วน CAN / RS485 ต้องเลือกอุปกรณ์คู่ทดสอบและ Example ที่ตรงกับบอร์ด',href:'examples.html?category=connectivity',link:'Explore Connectivity ↗'}
};
const tabs = [...document.querySelectorAll('[data-feature]')];
function activateTab(button) {
  tabs.forEach(tab=>{ const selected=tab===button; tab.setAttribute('aria-selected',String(selected)); tab.tabIndex=selected?0:-1; });
  const feature=features[button.dataset.feature];
  $('#feature-panel').setAttribute('aria-labelledby',button.id);
  $('#feature-panel').innerHTML=`<span class="mono">${feature.label}</span><h3>${feature.title}</h3><p>${feature.description}</p><a class="text-link" href="${feature.href}">${feature.link}</a>`;
}
tabs.forEach((button,index)=>{
  button.addEventListener('click',()=>activateTab(button));
  button.addEventListener('keydown',event=>{
    let next=index;
    if(['ArrowDown','ArrowRight'].includes(event.key)) next=(index+1)%tabs.length;
    else if(['ArrowUp','ArrowLeft'].includes(event.key)) next=(index+tabs.length-1)%tabs.length;
    else if(event.key==='Home') next=0;
    else if(event.key==='End') next=tabs.length-1;
    else return;
    event.preventDefault(); tabs[next].focus(); activateTab(tabs[next]);
  });
});
