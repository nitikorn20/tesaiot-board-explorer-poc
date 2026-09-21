// Apply saved choices before the stylesheet paints. Storage may be unavailable.
(()=>{try{const l=localStorage.getItem('tesa-lang'),t=localStorage.getItem('tesa-theme');document.documentElement.lang=l==='en'?'en':'th';document.documentElement.dataset.theme=t==='dark'?'dark':'light';}catch{document.documentElement.dataset.theme='light';}})();
