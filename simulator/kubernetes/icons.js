(()=>{"use strict";
const P={
logo:'<path d="M12 2l2.2 2.2 3.1-.4.9 3 2.8 1.4-1 3 1.7 2.6-2.3 2.2-.1 3.2-3.1.7-1.6 2.7-2.8-1.2-2.8 1.2-1.6-2.7-3.1-.7-.1-3.2L2 13.2l1.7-2.6-1-3 2.8-1.4.9-3 3.1.4z" fill="#326ce5"/><circle cx="12" cy="12" r="4.3" fill="white"/><path d="M12 7.7v8.6M7.7 12h8.6M9 9l6 6m0-6l-6 6" stroke="#326ce5" stroke-width="1.25"/>',
overview:'<path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" fill="none" stroke="currentColor" stroke-width="1.6"/>',
workload:'<rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="1.5"/>',
pod:'<path d="M12 3l7 4v10l-7 4-7-4V7z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>',
network:'<circle cx="6" cy="7" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="7" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 8.5l3 7m5-7.1l-3 7M8.5 7h7" stroke="currentColor" stroke-width="1.5"/>',
storage:'<ellipse cx="12" cy="6" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" fill="none" stroke="currentColor" stroke-width="1.5"/>',
config:'<circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1m0-12.8l-2.1 2.1m-8.6 8.6l-2.1 2.1" fill="none" stroke="currentColor" stroke-width="1.3"/>',
node:'<rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.5"/>',
rbac:'<path d="M12 3l7 3v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 12l2 2 4-5" fill="none" stroke="currentColor" stroke-width="1.6"/>',
terminal:'<rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 9l3 3-3 3m5 0h5" fill="none" stroke="currentColor" stroke-width="1.7"/>',
yaml:'<path d="M6 3h9l4 4v14H6zM15 3v5h4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 12h6M9 16h6" stroke="currentColor" stroke-width="1.4"/>',
event:'<path d="M12 3l9 16H3z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v5m0 3h.01" stroke="currentColor" stroke-width="1.7"/>',
map:'<circle cx="6" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 6h8M6 8v8m12-8v8M8 18h8" stroke="currentColor" stroke-width="1.4"/>',
project:'<path d="M3 6h7l2 2h9v11H3z" fill="none" stroke="currentColor" stroke-width="1.5"/>',
metrics:'<path d="M4 19V9m5 10V5m5 14v-7m5 7V3" stroke="currentColor" stroke-width="2"/>',
crd:'<path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" fill="none" stroke="currentColor" stroke-width="1.4"/>',
search:'<circle cx="10" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 14l6 6" stroke="currentColor" stroke-width="1.6"/>',
sun:'<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9L7 7m10 10l2.1 2.1m0-14.2L17 7M7 17l-2.1 2.1" stroke="currentColor" stroke-width="1.2"/>'
};
window.K8S_ICONS=P;
window.K8S_ICON=(n,s=20)=>'<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" aria-hidden="true">'+(P[n]||P.workload)+'</svg>';
})();