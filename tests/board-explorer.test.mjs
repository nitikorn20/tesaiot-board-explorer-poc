import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {boards} from '../dist/boards.js';
import {boardGuides} from '../dist/board-guides.js';
import {normalizeBoard,featureIndex,modelFeatureIndex} from '../dist/explorer-state.js';
const read=file=>readFile(new URL(`../dist/${file}`,import.meta.url),'utf8');

test('both board guides describe audience, hardware and extras in TH/EN',()=>{
 for(const [id,guide] of Object.entries(boardGuides)){
  assert.ok(boards[id]);assert.equal(guide.sections.length,3);
  for(const value of [guide.audience,guide.status,guide.note,...guide.sections.flatMap(section=>[section.title,...section.items])]){
   assert.ok(value.th.length>10);assert.ok(value.en.length>10);
  }
 }
 assert.match(boardGuides.training.note.en,/not a confirmed in-box list/);
 assert.match(JSON.stringify(boardGuides.training),/USB camera is an external accessory/);
 assert.match(JSON.stringify(boardGuides.ndr),/Ethernet is optional/);
 assert.match(JSON.stringify(boardGuides.ndr),/share a PHY/);
 assert.match(boardGuides.ndr.note.en,/no verified examples/);
 assert.match(JSON.stringify(boardGuides.ndr),/Do not assume Training-style pots/);
});

test('shared feature navigation wraps safely for both boards',()=>{
 assert.equal(normalizeBoard('__proto__'),'training');assert.equal(normalizeBoard('ndr'),'ndr');
 for(const id of ['training','ndr']){
  const count=boards[id].hotspots.length;
  assert.equal(featureIndex(id,-1),count-1);assert.equal(featureIndex(id,count),0);
  assert.equal(featureIndex(id,NaN),0);assert.equal(featureIndex(id,'7'),0);
 }
});

test('model mapping never invents an eighth Training GLB point',()=>{
 for(let i=0;i<7;i++)assert.equal(modelFeatureIndex('training',i),i);
 assert.equal(modelFeatureIndex('training',7),null);
 assert.equal(modelFeatureIndex('ndr',0),0);assert.equal(modelFeatureIndex('ndr',1),1);
 for(const id of ['ndr','training'])for(const value of [-1,8,NaN,Infinity,'0'])assert.equal(modelFeatureIndex(id,value),null);
});

test('board page has exactly one explorer, photo layer and shared detail panel',async()=>{
 const html=await read('boards.html');
 for(const id of ['hardware','board-stage','model-stage','model-canvas','hotspot-detail','model-parts','board-overview'])assert.equal((html.match(new RegExp(`id="${id}"`,'g'))||[]).length,1,id);
 assert.match(html,/id="explore-3d"/); // Preserve old incoming anchors.
 assert.doesNotMatch(html,/board-tour-layout|id="model-gate"/);
 assert.match(html,/data-view="photo" aria-pressed="true"/);
 assert.match(html,/id="model-load" data-view="3d" aria-pressed="false"/);
 assert.match(html,/id="model-photo-note" hidden/);assert.match(html,/id="model-retry" hidden/);
 assert.equal((html.match(/data-board-overview=/g)||[]).length,2);
});

test('photo and model share feature content while async results are guarded',async()=>{
 const source=await read('model-interface.js'),ui=await read('ui.js');
 assert.match(source,/board\(\)\.hotspots\[selected\]/);
 assert.match(source,/modelFeatureIndex\(boardId,selected\)/);
 assert.match(source,/if\(ticket!==generation\)return/g);
 assert.match(source,/viewer\?\.suspend\(\)/);
 assert.match(source,/canvas.hidden=true;pins.hidden=true;photo.hidden=false/);
 assert.doesNotMatch(ui,/hotspot-detail|model-parts/); // One owner for feature rendering.
});

test('homepage keeps three tiles and adds only board audience guidance',async()=>{
 const html=await read('index.html');
 for(const guide of Object.values(boardGuides))assert.ok(html.includes(guide.audience.th));
 assert.equal((html.match(/class="product-tile product-/g)||[]).length,3);
 assert.doesNotMatch(html,/id="board-overview"|id="model-stage"/);
});
