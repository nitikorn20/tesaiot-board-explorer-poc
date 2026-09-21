// Small, consistent outline icons authored for the site; no external icon runtime.
const paths={
  play:'<path d="m8 4 13 8-13 8z"/>',
  pause:'<path d="M8 4v16M16 4v16"/>',
  chip:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
  display:'<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8m-4-4v4m-6-8 3-3 3 3 5-5"/>',
  sensor:'<circle cx="12" cy="12" r="3"/><path d="M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14M8 8a6 6 0 0 0 0 8m8-8a6 6 0 0 1 0 8"/>',
  sliders:'<path d="M5 3v8m0 4v6m7-18v2m0 4v12m7-18v11m0 4v3M2 11h6m1-6h6m1 9h6"/>',
  grid:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>',
  network:'<rect x="8" y="2" width="8" height="6" rx="1"/><rect x="2" y="16" width="7" height="5" rx="1"/><rect x="15" y="16" width="7" height="5" rx="1"/><path d="M12 8v5H5v3m7-3h7v3"/>',
  shield:'<path d="m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5z"/><path d="m8 12 3 3 5-6"/>',
  expand:'<path d="M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6M8 8l-5-5m13 5 5-5M8 16l-5 5m13-5 5 5"/>',
  power:'<path d="m13 2-8 12h6l-1 8 9-12h-6z"/>',
  usb:'<path d="M12 20V3m-3 3 3-3 3 3M12 15l-6-4V8m6 4 6-3V6"/><circle cx="12" cy="20" r="2"/><circle cx="6" cy="6" r="2"/><rect x="16" y="2" width="4" height="4"/>',
  audio:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8"/>',
  storage:'<path d="M7 2h10l3 4v16H4V6zM8 3v5m4-5v5m4-5v5"/><rect x="8" y="13" width="8" height="5" rx="1"/>',
  code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  moon:'<path d="M20 15A9 9 0 0 1 9 4 9 9 0 1 0 20 15Z"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  board:'<rect x="3" y="4" width="18" height="16" rx="2"/><rect x="8" y="8" width="7" height="7" rx="1"/><path d="M6 18h3m7-11h2m-2 4h2m-2 4h2"/>',
  camera:'<rect x="2" y="6" width="20" height="15" rx="2"/><circle cx="12" cy="13" r="4"/><path d="m6 6 2-4h8l2 4"/>'
};
export function icon(name,className=''){return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.chip}</svg>`;}
