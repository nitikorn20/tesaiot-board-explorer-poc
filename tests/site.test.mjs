import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeFilters, filterExamples, escapeHTML } from '../dist/catalog.js';
import { boards } from '../dist/boards.js';
import { english } from '../dist/example-translations.js';
import { thresholdRGB } from '../dist/hardware-logic.js';
const root = fileURLToPath(new URL('../dist/',import.meta.url));
const catalog = JSON.parse(await readFile(resolve(root,'data/catalog.json'),'utf8'));
const examples = catalog.examples;

test('curated snapshot has 9 unique examples and preserves original board IDs',()=>{
  assert.equal(examples.length,9);
  assert.equal(new Set(examples.map(x=>x.id)).size,9);
  for(const item of examples){
    assert.ok(item.originalBoards.length);
    assert.ok(item.hardware.length);
    assert.match(item.ref,/^[a-f0-9]{40}$/);
    assert.ok(item.source.startsWith(`https://github.com/tesaiot/developer-hub/tree/${item.ref}/`));
    assert.ok(item.readme.startsWith(`https://github.com/tesaiot/developer-hub/blob/${item.ref}/`));
    assert.ok(item.imageSource.startsWith('https://raw.githubusercontent.com/tesaiot/'));
  }
});
test('filters compose: category, level, text, board',()=>{
  assert.equal(filterExamples(examples,{category:'control'}).length,2);
  assert.equal(filterExamples(examples,{category:'sensors',level:'beginner'}).length,3);
  assert.deepEqual(filterExamples(examples,{q:'bmi270 gyro'}).map(x=>x.id),['motion']);
  assert.equal(filterExamples(examples,{q:'not-an-example-193'}).length,0);
  assert.equal(filterExamples(examples,{board:'training'}).length,9);
  assert.equal(filterExamples(examples,{board:'ndr'}).length,0);
});
test('unsafe query values normalize; all renderable strings escape',()=>{
  assert.deepEqual(normalizeFilters({board:'unknown',category:'__proto__',level:'invalid',q:'  Pot  '}),{board:'all',category:'all',level:'all',q:'Pot'});
  assert.equal(escapeHTML('<img src=x onerror="bad">'), '&lt;img src=x onerror=&quot;bad&quot;&gt;');
  assert.equal(normalizeFilters({q:'a'.repeat(300)}).q.length,120);
});
test('each selected image exists and is nonempty',async()=>{
  for(const item of examples) assert.ok((await stat(resolve(root,item.image))).size > 1000,item.image);
  assert.equal(examples.filter(x=>x.imageKind==='upstream-screenshot').length,7);
});
test('all local static href/src and CSS imports resolve under dist',async()=>{
  const files=(await readdir(root)).filter(x=>/\.(html|css|js)$/.test(x));
  for(const file of files){
    const source=await readFile(resolve(root,file),'utf8');
    const urls=[...source.matchAll(/(?:href|src)="([^"$]+)"/g),...source.matchAll(/@import url\('([^']+)'\)/g)];
    for(const [,url] of urls){
      if(/^(https?:|data:|#)/.test(url)) continue;
      const path=url.split(/[?#]/)[0];
      if(!path) continue;
      const target=resolve(dirname(resolve(root,file)),path);
      assert.ok(target.startsWith(root),`Escapes dist: ${file}: ${path}`);
      assert.ok((await stat(target)).isFile(),`${file}: ${path}`);
    }
  }
});
test('no hardware APIs, third-party tracking or embedded secrets in site code',async()=>{
  for(const file of ['explorer.js','ui.js','locale.js','preferences.js','catalog.js','index.html','examples.html','sources.html']) {
    const source=await readFile(resolve(root,file),'utf8');
    assert.doesNotMatch(source,/navigator\.(usb|serial|bluetooth)|getUserMedia|requestDevice|requestPort|google-analytics|gtag\(|github_pat_|ghp_[a-zA-Z0-9]{20}/);
  }
});

test('board content is bilingual, coordinates bounded, NDR honestly labeled',()=>{
  assert.equal(boards.training.hotspots.length,8);
  assert.equal(boards.ndr.kind,'reference');
  assert.match(boards.ndr.caption.en,/not a finished NDR PCB/);
  for(const board of Object.values(boards)){
    for(const point of board.hotspots){assert.ok(point.x>0&&point.x<100&&point.y>0&&point.y<100);assert.ok(point.title.th&&point.title.en&&point.desc.th&&point.desc.en);}
    for(const block of board.groups)assert.ok(block.desc.th&&block.desc.en);
  }
  assert.ok(boards.ndr.groups.find(x=>x.id==='ethernet').optional);
  assert.match(boards.ndr.groups.find(x=>x.id==='usb').desc.en,/share a PHY/);
});
test('all examples have English summaries; translated terms remain searchable',()=>{
  for(const item of examples){assert.ok(english[item.id].description);assert.ok(english[item.id].outcome);if(item.note)assert.ok(english[item.id].note);}
  const searchable=examples.map(item=>({...item,searchTerms:Object.values(english[item.id])}));
  assert.ok(filterExamples(searchable,{q:'relative humidity'}).some(x=>x.id==='climate'));
});
test('RGB simulation respects 50% boundary and all eight digital combinations',()=>{
  assert.deepEqual(thresholdRGB([0,50,51]),[0,0,1]);
  const outputs=new Set();
  for(let n=0;n<8;n++)outputs.add(thresholdRGB([n&1?100:0,n&2?100:0,n&4?100:0]).join(''));
  assert.equal(outputs.size,8);
});
test('all pages expose language/theme controls and use the current entry points',async()=>{
  for(const file of ['index.html','examples.html','sources.html']){
    const html=await readFile(resolve(root,file),'utf8');
    assert.match(html,/data-lang="th"/);assert.match(html,/data-lang="en"/);assert.match(html,/id="theme-toggle"/);
    assert.match(html,/src="preferences.js"/);assert.match(html,/href="v2.css"/);
    assert.doesNotMatch(html,/src="app.js"|href="styles.css"/);
  }
});
