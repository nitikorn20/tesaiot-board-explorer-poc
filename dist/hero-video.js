import {t} from './locale.js';
import {icon} from './icons.js';
const video=document.querySelector('#hero-video');
const button=document.querySelector('#hero-play');
if(video&&button){
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const narrow=matchMedia('(max-width: 760px)');
 let loaded=false,wantsPlayback=false,visible=true;
 function label(){
  const playing=!video.paused&&!video.ended;
  button.innerHTML=`${icon(playing?'pause':'play')}<span>${playing?t('หยุดวิดีโอ','Pause video'):t('เล่นวิดีโอ','Play video')}</span>`;
  button.setAttribute('aria-pressed',String(playing));
 }
 function load(){
  if(loaded)return;
  loaded=true;
  for(const [path,type] of [[video.dataset.webm,'video/webm'],[video.dataset.mp4,'video/mp4']]){
   const source=document.createElement('source');source.src=path;source.type=type;video.append(source);
  }
  video.muted=true;video.load();
 }
 async function play(){load();try{await video.play();}catch{wantsPlayback=false;}label();}
 button.addEventListener('click',()=>{
  if(!video.paused){wantsPlayback=false;video.pause();}
  else{wantsPlayback=true;play();}
 });
 video.addEventListener('play',label);video.addEventListener('pause',label);video.addEventListener('error',()=>{wantsPlayback=false;label();});
 document.addEventListener('languagechange',label);
 function eligibility(){return visible&&!document.hidden;}
 function sync(){if(!eligibility())video.pause();else if(wantsPlayback)play();}
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.12}).observe(video);
 document.addEventListener('visibilitychange',sync);
 motion.addEventListener('change',()=>{if(motion.matches){wantsPlayback=false;video.pause();}});
 narrow.addEventListener('change',()=>{if(narrow.matches){wantsPlayback=false;video.pause();}});
 label();
 // Phone, reduced-motion and data-saving visitors see the poster until they opt in.
 if(!motion.matches&&!narrow.matches&&!navigator.connection?.saveData){wantsPlayback=true;play();}
}
