// On-demand viewer. Vendor/model assets are local; no CDN, telemetry or continuous render loop.
import * as THREE from 'three';
import {OrbitControls} from './vendor/three-addons/controls/OrbitControls.js';
import {GLTFLoader} from './vendor/three-addons/loaders/GLTFLoader.js';
import {DRACOLoader} from './vendor/three-addons/loaders/DRACOLoader.js';
import {RoomEnvironment} from './vendor/three-addons/environments/RoomEnvironment.js';

// Measured anchors/poses from the TESA SDK viewer, pinned in THIRD_PARTY_NOTICES.
const trainingStops=[
 {anchor:[.34,.27,-.27],target:[.34,.16,-.27],theta:8,phi:44,r:2.24},
 {anchor:[-.72,.12,-.21],target:[-.72,.09,-.21],theta:-55,phi:36,r:1.8},
 {anchor:[-.56,.1,-.14],target:[-.63,.09,-.18],theta:-32,phi:26,r:1.8},
 {anchor:[-.75,.09,.52],target:[-.5,.03,.4],theta:-28,phi:52,r:2.2},
 {anchor:[.43,.13,.89],target:[.42,.05,.72],theta:32,phi:56,r:2.05},
 {anchor:[.73,.06,.58],target:[.85,.04,.1],theta:70,phi:44,r:2.25},
 {anchor:[.59,.15,.30],target:[.59,.07,.30],theta:44,phi:28,r:1.85}
];

export function createBoardViewer(mount,pins,onSelect,onFailure){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
 renderer.toneMapping=THREE.NeutralToneMapping;renderer.toneMappingExposure=1;
 mount.replaceChildren(renderer.domElement);
 renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','Interactive board model. Use the labeled controls and feature buttons below.');
 const contextLost=event=>{event.preventDefault();onFailure();};
 renderer.domElement.addEventListener('webglcontextlost',contextLost);
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(38,1,.02,60);
 const controls=new OrbitControls(camera,renderer.domElement);
 controls.enableDamping=false;controls.enablePan=false;controls.enableZoom=false;controls.minDistance=.7;controls.maxDistance=7;controls.maxPolarAngle=Math.PI*.87;
 const pmrem=new THREE.PMREMGenerator(renderer),environment=new RoomEnvironment();
 scene.environment=pmrem.fromScene(environment,.04).texture;scene.environmentIntensity=.95;environment.dispose();pmrem.dispose();
 const sunlight=new THREE.DirectionalLight(0xffffff,2.0);sunlight.position.set(-2,4,3);scene.add(sunlight,new THREE.HemisphereLight(0xffffff,0x40504a,1.2));
 let active='training',visible=false,selected=-1,request=0,trainingPromise,training,ndr,som,exploded=false;
 const draco=new DRACOLoader();draco.setDecoderPath(new URL('./vendor/draco/',import.meta.url).href);draco.setWorkerLimit(2);
 const loader=new GLTFLoader();loader.setDRACOLoader(draco);
 const point=new THREE.Vector3();
 function stops(){return active==='training'?trainingStops:[{anchor:[0,exploded?.66:.23,0]},{anchor:[.65,.03,.38]}];}
 function render(){
  if(!visible||mount.hidden||document.hidden)return;
  const w=mount.clientWidth,h=mount.clientHeight;
  [...pins.children].forEach((pin,index)=>{
   const st=stops()[index];if(!st)return;
   point.set(...st.anchor).project(camera);
   const x=(point.x*.5+.5)*w,y=(-point.y*.5+.5)*h;
   pin.hidden=point.z>1||point.z< -1||x<20||x>w-20||y<35||y>h-20||(w<600&&index!==selected);
   pin.style.left=`${x}px`;pin.style.top=`${y}px`;pin.setAttribute('aria-pressed',String(index===selected));
  });
  renderer.render(scene,camera);
 }
 function resize(){const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render();}
 const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(mount);
 controls.addEventListener('change',render);
 document.addEventListener('visibilitychange',render);
 function pose(theta,phi,r,target){
  controls.target.set(...target);camera.position.setFromSpherical(new THREE.Spherical(r,phi*Math.PI/180,theta*Math.PI/180)).add(controls.target);camera.lookAt(controls.target);controls.update();render();
 }
 function reset(){selected=-1;const mobile=mount.clientWidth<600;pose(active==='training'?-25: -35,active==='training'?55:48,mobile?4.65:3.8,[0,.08,0]);}
 function buildConcept(){
  const group=new THREE.Group();som=new THREE.Group();
  const pcb=new THREE.MeshStandardMaterial({color:0x254a40,roughness:.65,metalness:.1});
  const module=new THREE.MeshStandardMaterial({color:0xa4c6c0,roughness:.53,metalness:.18});
  const chip=new THREE.MeshStandardMaterial({color:0x26313d,roughness:.7});
  const metal=new THREE.MeshStandardMaterial({color:0xa4adaf,roughness:.4,metalness:.7});
  function box(parent,x,y,z,w,h,d,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
  // Intentional abstraction: no claimed final connectors, dimensions or routing.
  box(group,0,0,0,1.8,.035,1.2,pcb);
  for(const x of [-.74,.74])for(const z of [-.44,.44])box(group,x,-.06,z,.065,.11,.065,metal);
  for(const x of [-.32,.32])box(group,x,.055,0,.08,.075,.65,chip);
  box(group,-.68,.05,.15,.18,.075,.32,metal);box(group,.63,.05,.2,.23,.055,.2,metal);
  box(som,0,0,0,.92,.027,.68,module);box(som,-.1,.045,-.02,.29,.07,.29,chip);
  box(som,.24,.035,-.15,.12,.045,.16,chip);box(som,.24,.035,.11,.12,.045,.16,chip);
  som.position.y=.16;group.add(som);return group;
 }
 async function show(id){
  const token=++request;active=id;visible=false;selected=-1;exploded=false;
  if(training)training.visible=false;if(ndr)ndr.visible=false;
  if(id==='training'){
   if(!trainingPromise)trainingPromise=loader.loadAsync(new URL('./assets/training-board.glb',import.meta.url).href).then(gltf=>{
    training=gltf.scene;
    training.traverse(o=>{if(o.isMesh&&o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])if(m.transmission>0){m.transmission=0;m.transparent=true;m.opacity=.3;m.depthWrite=false;m.side=THREE.FrontSide;m.needsUpdate=true;}}});
    training.visible=false;scene.add(training);return training;
   }).catch(error=>{trainingPromise=undefined;throw error;});
   await trainingPromise;
   if(token!==request)return;training.visible=true;
  }else{if(!ndr){ndr=buildConcept();scene.add(ndr);}ndr.visible=true;som.position.y=.16;}
  pins.replaceChildren();
  stops().forEach((_,i)=>{const button=document.createElement('button');button.type='button';button.className='model-pin';button.textContent=String(i+1);button.setAttribute('aria-label',`3D feature ${i+1}`);button.addEventListener('click',()=>onSelect(i));pins.append(button);});
  visible=true;resize();reset();mount.dataset.loaded=id;
 }
 function focus(index){
  selected=index;
  if(active==='training'){const st=trainingStops[index];if(st)pose(st.theta,st.phi,mount.clientWidth<600?st.r*1.35:st.r,st.target);}
  else pose(-35,48,3.3,[0,index===0?(exploded?.62:.18):0,0]);
  render();
 }
 function action(name){
  if(name==='reset'){reset();return;}
  const sph=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
  if(name==='left')sph.theta-=Math.PI/10;if(name==='right')sph.theta+=Math.PI/10;
  if(name==='in')sph.radius=Math.max(.7,sph.radius*.82);if(name==='out')sph.radius=Math.min(7,sph.radius/ .82);
  camera.position.setFromSpherical(sph).add(controls.target);controls.update();render();
 }
 return{show,resize,focus,select(index){selected=index;render();},action,explode(value){if(active!=='ndr')return;exploded=value;som.position.y=value?.6:.16;render();},suspend(){visible=false;request++;delete mount.dataset.loaded;},dispose(){
  visible=false;request++;sizeObserver.disconnect();controls.dispose();draco.dispose();
  document.removeEventListener('visibilitychange',render);renderer.domElement.removeEventListener('webglcontextlost',contextLost);
  const geometries=new Set(),materials=new Set(),textures=new Set();
  scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);for(const material of object.material?(Array.isArray(object.material)?object.material:[object.material]):[]){materials.add(material);for(const value of Object.values(material))if(value?.isTexture)textures.add(value);}});
  for(const resource of [...geometries,...materials,...textures])resource.dispose();
  scene.environment?.dispose();renderer.dispose();mount.replaceChildren();pins.replaceChildren();
 }};
}
