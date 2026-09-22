(()=>{"use strict";const P={
report:'<path d="M4 3h16v18H4z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7 17v-5h2v5zm4 0V7h2v10zm4 0V10h2v7z" fill="currentColor"/>',
data:'<ellipse cx="12" cy="5" rx="7.5" ry="2.7" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4.5 5v6c0 1.5 3.4 2.7 7.5 2.7s7.5-1.2 7.5-2.7V5M4.5 11v6c0 1.5 3.4 2.7 7.5 2.7s7.5-1.2 7.5-2.7v-6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
model:'<rect x="3" y="3" width="7" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.7"/><rect x="14" y="15" width="7" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 6h4c2 0 3 1 3 3v6M7 9v4c0 2 1 3 3 3h4" fill="none" stroke="currentColor" stroke-width="1.7"/>',
dax:'<path d="M4 5h16v14H4z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7 9l3 3-3 3m5 0h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
tmdl:'<path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M15 3v5h5M9 12h6M9 16h6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
getData:'<path d="M12 3v11m0 0l-4-4m4 4l4-4M5 17v3h14v-3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
transform:'<path d="M4 6h10m-7-3v6m3 6h10m-3-3v6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
refresh:'<path d="M19 8a7 7 0 10.6 6M19 3v5h-5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
visual:'<rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 16v-4h2v4zm4 0V8h2v8zm4 0v-6h2v6z" fill="currentColor"/>',
publish:'<path d="M12 20V8m0 0l-4 4m4-4l4 4M5 5h14" fill="none" stroke="currentColor" stroke-width="1.8"/>',
measure:'<path d="M4 5h16v14H4zM8 15l2.4-6 2.2 6 2.4-6 1.5 6" fill="none" stroke="currentColor" stroke-width="1.6"/>',
relationship:'<circle cx="7" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 12h4" stroke="currentColor" stroke-width="1.7"/>',
theme:'<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 4a8 8 0 000 16z" fill="currentColor" opacity=".25"/>',
grid:'<path d="M4 4h16v16H4zM4 10h16M10 4v16" fill="none" stroke="currentColor" stroke-width="1.4"/>',
pane:'<path d="M4 4h16v16H4zM14 4v16" fill="none" stroke="currentColor" stroke-width="1.6"/>'
};window.PBI_ICONS=P;window.PBI_ICON=(n,s=20)=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" aria-hidden="true">'+(P[n]||P.visual)+'</svg>';})();