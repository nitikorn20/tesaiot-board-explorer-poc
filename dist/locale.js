export function lang(){return document.documentElement.lang==='en'?'en':'th';}
export function t(th,en){return lang()==='en'?en:th;}
export function translateDOM(root=document){
  root.querySelectorAll('[data-th][data-en]').forEach(el=>{el.textContent=el.dataset[lang()];});
  for(const attr of ['aria-label','placeholder','title','alt']) root.querySelectorAll(`[data-th-${attr}]`).forEach(el=>{el.setAttribute(attr,el.getAttribute(`data-${lang()}-${attr}`));});
  document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===lang())));
}
export function setLanguage(value){
  if(!['th','en'].includes(value))return;
  document.documentElement.lang=value;
  try{localStorage.setItem('tesa-lang',value);}catch{}
  translateDOM(); document.dispatchEvent(new Event('languagechange'));
}
