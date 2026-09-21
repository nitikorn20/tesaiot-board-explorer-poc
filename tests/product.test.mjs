import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../dist/',import.meta.url);
const read=file=>readFile(new URL(file,root),'utf8');

test('homepage follows film → two products + hub → three stories',async()=>{
 const html=await read('index.html');
 assert.equal((html.match(/class="product-tile product-/g)||[]).length,3);
 assert.equal((html.match(/class="story-card"/g)||[]).length,3);
 assert.ok(html.indexOf('cinema-hero')<html.indexOf('id="boards"'));
 assert.ok(html.indexOf('id="boards"')<html.indexOf('home-featured'));
 assert.doesNotMatch(html,/editorial-strip|See sources & status|Infineon AI references/);
 assert.match(html,/DEVELOPMENT PREVIEW/);assert.match(html,/CONCEPT · NOT FINAL PCB GEOMETRY/);
});

test('hero is muted, pausable and poster-first, with responsive/motion guards',async()=>{
 const html=await read('index.html'),code=await read('hero-video.js');
 const video=html.match(/<video\b[^>]*>/)[0];
 assert.match(video,/muted loop playsinline preload="none"/);
 assert.doesNotMatch(video,/\ssrc=|autoplay/);assert.match(video,/poster=/);
 assert.match(html,/id="hero-play"/);
 for(const guard of ['prefers-reduced-motion','max-width: 760px','saveData','visibilitychange','IntersectionObserver'])assert.ok(code.includes(guard));
 for(const file of ['assets/tesa-hero.webm','assets/tesa-hero.mp4']){const s=await stat(new URL(file,root));assert.ok(s.size>100000&&s.size<1500000);}
});

test('3D is opt-in, with static fallback, keyboard controls and board-specific warnings',async()=>{
 const html=await read('boards.html'),code=await read('model-interface.js'),viewer=await read('board-viewer.js');
 assert.match(html,/id="model-load"/);assert.match(html,/id="model-poster"/);assert.match(html,/id="model-static"/);
 assert.doesNotMatch(html,/<script[^>]*src="(?:board-viewer|vendor\/three)/);
 assert.match(code,/import\('\.\/board-viewer.js'\)/);
 for(const action of ['left','right','in','out','reset'])assert.ok(html.includes(`data-model-action="${action}"`));
 assert.match(code,/optional OPTIGA Trust M/);assert.match(code,/not confirmed NDR PCB geometry/);
 assert.match(viewer,/webglcontextlost/);assert.doesNotMatch(viewer,/requestAnimationFrame|setInterval|autoRotate\s*=\s*true/);
 assert.match(html,/"three":"\.\/vendor\/three.module.min.js"/);
});

test('Training GLB matches the upstream asset and is self-contained',async()=>{
 const buffer=await readFile(new URL('assets/training-board.glb',root));
 assert.equal(createHash('sha256').update(buffer).digest('hex'),'db66684dafec857a8b05b1481430dfdb7e6f15800866f1d680e7d6f409857b9d');
 assert.equal(buffer.toString('ascii',0,4),'glTF');assert.equal(buffer.readUInt32LE(4),2);assert.equal(buffer.readUInt32LE(8),buffer.length);
 const json=JSON.parse(buffer.subarray(20,20+buffer.readUInt32LE(12)));
 assert.ok(json.extensionsUsed.includes('KHR_draco_mesh_compression'));
 assert.ok(json.buffers.every(b=>!b.uri));assert.ok(json.images.every(i=>!i.uri));
});

test('vendored viewer dependencies and licenses resolve locally',async()=>{
 async function check(dir){
  for(const entry of await readdir(new URL(dir,root),{withFileTypes:true})){
   const file=dir+entry.name;
   if(entry.isDirectory()){await check(file+'/');continue;}
   if(!file.endsWith('.js'))continue;
   const source=await read(file);
   for(const [,specifier]of source.matchAll(/^import\s+[\s\S]*?\sfrom\s+['"]([^'"]+)['"]/gm)){
    if(specifier==='three')continue;
    assert.ok(specifier.startsWith('.'),`${file}: ${specifier}`);
    assert.ok((await stat(new URL(specifier,new URL(file,root)))).isFile());
   }
  }
 }
 await check('vendor/three-addons/');
 for(const file of ['vendor/three.module.min.js','vendor/draco/draco_wasm_wrapper.js','vendor/draco/draco_decoder.wasm','vendor/THREE-LICENSE.txt','vendor/DRACO-LICENSE.txt'])assert.ok((await stat(new URL(file,root))).size>1000);
});

test('public resources exclude unrelated design-inspiration product links',async()=>{
 const html=await read('sources.html');
 assert.doesNotMatch(html,/arduino\.cc|espressif\.com|nxp\.com|Luckfox|Design inspiration/);
 for(const domain of ['tesaiot.github.io','dev.tesaiot.dev','www.tesaiot.com','www.infineon.com','deepcraft.infineon.com'])assert.ok(html.includes(domain));
 assert.match(html,/Media credits &amp; PoC scope/);
});

test('new modules do not add hardware access, credentials or telemetry',async()=>{
 for(const file of ['hero-video.js','model-interface.js','board-viewer.js']){
  const source=await read(file);
  assert.doesNotMatch(source,/navigator\.(usb|serial|bluetooth)|getUserMedia|requestDevice|requestPort|google-analytics|gtag\(|github_pat_|ghp_[a-zA-Z0-9]{20}/);
  assert.doesNotMatch(source,/https?:\/\//);
 }
});
