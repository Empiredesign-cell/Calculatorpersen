import { CALCULATORS, TOOL_MAP, CATEGORY_META, POPULAR_IDS, UNIT_GROUPS, computeTool, evaluateExpression } from './calculators.mjs';

// Kalkulin • accessible, dependency-free application layer.
const $ = id => document.getElementById(id);
const qs = selector => document.querySelector(selector);
const qsa = selector => [...document.querySelectorAll(selector)];
const escapeHtml = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ICON_PATHS = {
  home:'<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22v-8h6v8"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  star:'<path d="m12 2 3.1 6.3 7 1-5.1 5 .9 7-5.9-3.1-5.9 3.1 1.1-7-5.1-5 7-1z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calculator:'<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 11h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"/>',
  atom:'<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4"/>',
  percent:'<path d="M19 5 5 19"/><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/>',
  trending:'<path d="m3 17 7-7 4 4 7-8"/><path d="M15 6h6v6"/>',
  ruler:'<path d="m3 17 14-14 4 4L7 21l-4-4Z"/><path d="m9 11 3 3m0-6 3 3m0-6 3 3"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5"/>',
  wallet:'<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 9V5a2 2 0 0 1 2-2h13m-1 11h4m-7 0h1"/>',
  tag:'<path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1"/>',
  credit:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4"/>',
  piggy:'<path d="M19 10c2 0 3 1 3 3s-1 3-3 3a8 8 0 0 1-3 3v2h-3v-2H8v2H5v-4a7 7 0 0 1-3-6V9h3a8 8 0 0 1 13-2M17 8h.01"/><path d="M8 7a4 4 0 0 1 5-2"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18m-9-9a14 14 0 0 1 0 18m0-18a14 14 0 0 0 0 18"/>',
  repeat:'<path d="m17 2 4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4m14-1v3a2 2 0 0 1-2 2H3"/>',
  store:'<path d="M3 10h18l-2-6H5l-2 6Zm2 0v10h14V10M9 20v-6h6v6"/>',
  chart:'<path d="M4 20h16M7 17V9m5 8V4m5 13v-6"/>',
  briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 12h18"/>',
  receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Zm4 5h6M9 12h6"/>',
  rocket:'<path d="M4 16c2-7 7-12 16-13 0 9-6 15-13 17l-3-4Z"/><circle cx="14" cy="9" r="2"/><path d="M4 16 2 22l6-2M4 10H2v5m10 7h5v-2"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  boxes:'<path d="m3 7 6-4 6 4-6 4-6-4Zm0 0v8l6 4 6-4V7m-6 4v8m6-12 6-4 1 8-6 4-1-8Z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-12 4h2m3 0h2m-7 4h2"/>',
  cake:'<path d="M4 12h16v9H4v-9Zm0 4h16M8 4v4m4-6v6m4-4v4M4 12c0-3 3-3 4 0 1-3 3-3 4 0 1-3 3-3 4 0 1-3 3-3 4 0"/>',
  heart:'<path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.3 8.8-8.3a5.5 5.5 0 0 0 0-7.8Z"/>',
  activity:'<path d="M2 12h4l3-7 5 14 3-7h5"/>',
  printer:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 15h12v6H6v-6Zm11-3h1"/>',
  car:'<path d="m5 17-2-4 2-7h14l2 7-2 4H5ZM3 13h18M6 17v3m12-3v3M7 6l2-3h6l2 3M7 13h.01M17 13h.01"/>',
  zap:'<path d="m13 2-9 12h7l-1 8 10-12h-7V2Z"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  back:'<path d="m15 18-6-6 6-6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  moon:'<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
  download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  refresh:'<path d="M20 10a8 8 0 0 0-14-5L3 8m0-5v5h5M4 14a8 8 0 0 0 14 5l3-3m0 5v-5h-5"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 11v6m4-6v6"/>',
  share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
  spark:'<path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3L12 2Z"/>',
};
const icon=(name,cl='')=>`<svg class="${cl}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]||ICON_PATHS.calculator}</svg>`;
const state={page:'home',category:'Semua',search:'',tool:null,previous:'home',favs:[],recent:[],history:[],forms:{},fxTable:null,fxBase:'',fxDate:'',fxStatus:'',fxSource:'',fxRequest:0,deferredInstall:null,installed:false,currentResult:null};
const STORAGE='kalkulin-v2';
const formatNumber=(v,max=4)=>Number.isFinite(+v)?new Intl.NumberFormat('id-ID',{maximumFractionDigits:max}).format(+v):String(v);
const formatValue=(value,format='number',suffix='')=>{
  if(typeof value==='string' || format==='text')return String(value);
  if(format==='money')return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0,maximumFractionDigits:0}).format(Math.round(value));
  if(format==='percent')return `${formatNumber(value,2)}%`;
  if(format==='integer')return formatNumber(Math.round(value),0);
  return `${formatNumber(value,6)}${suffix ? ` ${suffix.trim()}` : ''}`;
};
const storeGet = key => {try{return localStorage.getItem(key)}catch{return null}};
const storeSet = (key,value) => {try{localStorage.setItem(key,value);return true}catch{return false}};
const safelyParse = (value,fallback)=>{try{return JSON.parse(storeGet(value))??fallback}catch{return fallback}};
function initStorage(){
  const saved=safelyParse(STORAGE,{});
  state.favs=Array.isArray(saved.favs)?saved.favs.filter(id=>TOOL_MAP[id]):[];
  state.recent=Array.isArray(saved.recent)?saved.recent.filter(id=>TOOL_MAP[id]).slice(0,10):[];
  state.history=Array.isArray(saved.history)?saved.history.filter(item=>TOOL_MAP[item?.id]).slice(0,60):[];
  const theme=storeGet('kalkulin-theme');
  const dark=theme?theme==='dark':window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  document.body.classList.toggle('dark',!!dark);
  const meta=qs('meta[name="theme-color"]');if(meta)meta.content=dark?'#142b39':'#f4faff';
}
function saveStorage(){if(!storeSet(STORAGE,JSON.stringify({favs:state.favs,recent:state.recent,history:state.history})))toast('Penyimpanan lokal tidak tersedia.')}
function toast(text){const node=$('toast');node.textContent=text;node.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>node.classList.remove('show'),2300)}
function renderNav(){
  const navs=[{id:'home',title:'Beranda',icon:'home'},{id:'catalog',title:'Semua Kalkulator',icon:'grid'},{id:'favorites',title:'Favorit',icon:'star'},{id:'history',title:'Riwayat',icon:'clock'}];
  $('desktopNav').innerHTML=navs.map(n=>`<button type="button" class="nav-link ${state.page===n.id?'active':''}" data-nav="${n.id}">${icon(n.icon)}<span>${n.title}</span>${n.id==='favorites'?`<span class="nav-count">${state.favs.length}</span>`:''}</button>`).join('');
  $('mobileNav').innerHTML=navs.map(n=>`<button type="button" class="bottom-item ${state.page===n.id?'active':''}" data-nav="${n.id}">${icon(n.icon)}<span>${n.id==='catalog'?'Kalkulator':n.title}</span></button>`).join('');
  $('categoryNav').innerHTML=Object.entries(CATEGORY_META).filter(([key])=>key!=='Semua').map(([name,data])=>`<button type="button" class="cat-link ${state.page==='catalog'&&state.category===name?'active':''}" data-category="${escapeHtml(name)}">${icon(data.icon)}<span>${name}</span></button>`).join('');
  const themeDark=document.body.classList.contains('dark');qsa('[data-theme]').forEach(el=>{el.innerHTML=icon(themeDark?'sun':'moon');el.setAttribute('aria-label',themeDark?'Gunakan mode terang':'Gunakan mode gelap')});
}
function toolIcon(tool){return `<span class="tool-icon ${tool.accent}" aria-hidden="true">${icon(tool.icon)}</span>`}
function card(tool,index=0){const selected=state.favs.includes(tool.id);return `<article class="tool-card" style="animation-delay:${Math.min(index,10)*24}ms"><button class="tool-open" type="button" data-tool="${tool.id}" aria-label="Buka ${escapeHtml(tool.title)}">${toolIcon(tool)}<span class="tool-title">${escapeHtml(tool.title)}</span><span class="tool-desc">${escapeHtml(tool.summary)}</span></button><button class="fav-btn ${selected?'is-fav':''}" data-fav="${tool.id}" type="button" title="${selected?'Hapus dari':'Tambah ke'} favorit" aria-label="${selected?'Hapus':'Tambah'} ${escapeHtml(tool.title)} ${selected?'dari':'ke'} favorit">${icon('star')}</button><span class="card-chevron" aria-hidden="true">${icon('arrow')}</span></article>`}
function sectionHeading(title,subtitle='',action=''){return `<div class="section-heading"><div><h2>${title}</h2>${subtitle?`<p>${subtitle}</p>`:''}</div>${action}</div>`}
function emptyState(iconName,title,description,action=''){return `<div class="empty-state"><span class="empty-icon">${icon(iconName)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p>${action}</div>`}
function heroArt(){return `<div class="hero-illustration" aria-hidden="true"><svg viewBox="0 0 300 210" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="154" cy="195" rx="112" ry="9" fill="#0E85BB" fill-opacity=".15"/><g transform="rotate(-9 125 107)"><rect x="55" y="12" width="165" height="185" rx="23" fill="#EAF9FE"/><rect x="65" y="23" width="145" height="164" rx="15" fill="#FFF"/><rect x="82" y="42" width="110" height="40" rx="10" fill="#C4ECFA"/><path d="M96 61h82" stroke="#7DCBEA" stroke-width="6" stroke-linecap="round"/><rect x="84" y="100" width="29" height="29" rx="9" fill="#ECF7FD"/><rect x="123" y="100" width="29" height="29" rx="9" fill="#ECF7FD"/><rect x="162" y="100" width="29" height="29" rx="9" fill="#ECF7FD"/><rect x="84" y="139" width="29" height="29" rx="9" fill="#ECF7FD"/><rect x="123" y="139" width="29" height="29" rx="9" fill="#ECF7FD"/><rect x="162" y="139" width="29" height="29" rx="9" fill="#FFBA36"/><g stroke="#50B7DE" stroke-width="3" stroke-linecap="round"><path d="M93 114h12m-6-6v12M132 114h12m-8 28 6 9m0-9-6 9M173 112h9M173 118h9M93 153h12M132 153h12"/></g><path d="m170 152 5 5 8-10" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g><rect x="185" y="10" width="88" height="46" rx="15" fill="#FFF1C3" transform="rotate(12 185 10)"/><path d="m213 31 8 8 16-18" stroke="#F4A728" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="253" cy="108" r="25" fill="#FFE399"/><path d="M245 108h16m-8-8v16" stroke="#FFF" stroke-width="4" stroke-linecap="round"/><circle cx="35" cy="52" r="7" stroke="#FFF" stroke-width="2" opacity=".7"/><path d="m250 167 6-9 6 9-6 9-6-9Z" fill="#fff" opacity=".8"/></svg><span class="hero-float one"></span><span class="hero-float two"></span></div>`}
function hero(){return `<section class="hero"><div class="hero-copy"><div class="hero-kicker"><span></span> YOUR DAILY MATH BUDDY</div><h1>Semua hitungan,<br/>jadi lebih gampang.</h1><p>Dari angka sederhana sampai hitungan bisnis, semuanya ada di satu tempat.</p><button class="hero-cta" type="button" data-nav="catalog">Jelajahi Kalkulator ${icon('arrow')}</button></div>${heroArt()}</section>`}
function searchBox(){return `<div class="search-container">${icon('search','search-icon')}<input id="searchInput" class="search-input" type="search" autocomplete="off" spellcheck="false" placeholder="Cari kalkulator... mis. DP, diskon, luas banner" aria-label="Cari kalkulator" value="${escapeHtml(state.search)}"/><button class="search-clear" type="button" id="clearSearch" aria-label="Hapus pencarian" ${state.search?'':'hidden'}>×</button></div>`}
function chips(){return `<div class="chip-row" id="categoryChips">${Object.entries(CATEGORY_META).map(([name,data])=>`<button type="button" class="chip ${state.category===name?'active':''}" data-filter="${escapeHtml(name)}">${icon(data.icon)}<span>${name}</span></button>`).join('')}</div>`}
function directoryTools(){return CALCULATORS.filter(t=>(state.category==='Semua'||t.category===state.category)&&(`${t.title} ${t.category} ${t.summary}`).toLowerCase().includes(state.search.toLowerCase()))}
function directory(){return `${searchBox()}${chips()}<div id="directoryResults"></div>`}
function renderDirectoryResults(){
  const results=$('directoryResults');if(!results)return;
  const tools=directoryTools();
  results.innerHTML=sectionHeading(state.search?`Hasil pencarian <span class="spark">✦</span>`:`${state.category==='Semua'?'Semua kalkulator':state.category} <span class="spark">✦</span>`,`${tools.length} kalkulator tersedia`)+ (tools.length?`<div class="tool-grid">${tools.map(card).join('')}</div>`:emptyState('search','Tidak ditemukan','Coba kata kunci atau kategori yang berbeda.','<button class="outline-button" data-clear-filters type="button">Reset pencarian</button>'));
  $('categoryChips')?.querySelectorAll('[data-filter]').forEach(el=>el.classList.toggle('active',el.dataset.filter===state.category));
  $('clearSearch')?.toggleAttribute('hidden',!state.search);
}
function recentList(){const tools=state.recent.slice(0,4).map(id=>TOOL_MAP[id]).filter(Boolean);if(!tools.length)return '';return `<section class="section-secondary">${sectionHeading('Terakhir dibuka','Lanjutkan hitunganmu yang sebelumnya.')}<div class="mini-recent-list">${tools.map(tool=>`<button class="recent-item" type="button" data-tool="${tool.id}"><span class="recent-mini-icon">${icon(tool.icon)}</span><span><strong>${tool.title}</strong><small>${tool.category}</small></span><span class="arr">${icon('arrow')}</span></button>`).join('')}</div></section>`}
function showHome(){return `${hero()}${sectionHeading('Pilihan populer <span class="spark">✦</span>','Buat kebutuhan yang paling sering dihitung.',`<button type="button" class="text-link" data-nav="catalog">Lihat semua ${icon('arrow')}</button>`)}<div class="tool-grid featured">${POPULAR_IDS.map((id,i)=>card(TOOL_MAP[id],i)).join('')}</div><section class="section-secondary">${sectionHeading('Temukan kalkulatormu','Pilih kategori atau cari sesuai kebutuhanmu.')}${directory()}</section>${recentList()}<p style="font-size:10px;color:var(--muted);margin-top:24px">Kalkulator dan data lokal dapat digunakan offline setelah aplikasi pernah dimuat. Kurs baru memerlukan koneksi internet.</p>`}
function showCatalog(){return `<div class="view-header"><h1 class="view-title">Semua kalkulator <span style="color:var(--amber)">✦</span></h1><p class="view-subtitle">Dari keseharian sampai kebutuhan bisnis, pilih alat sesuai keperluan.</p></div>${directory()}`}
function showFavorites(){const tools=state.favs.map(id=>TOOL_MAP[id]).filter(Boolean);return `<div class="view-header"><h1 class="view-title">Kalkulator favorit <span style="color:var(--amber)">★</span></h1><p class="view-subtitle">Akses cepat ke kalkulator yang paling sering kamu butuhkan.</p></div>${tools.length?`<div class="tool-grid">${tools.map(card).join('')}</div>`:emptyState('star','Belum ada favorit','Tekan ikon bintang pada kartu kalkulator untuk menyimpannya di sini.','<button class="outline-button" data-nav="catalog" type="button">Jelajahi kalkulator</button>')}`}
function showHistory(){return `<div class="history-wrap"><div class="view-header"><h1 class="view-title">Riwayat perhitungan</h1><p class="view-subtitle">Hasil yang kamu simpan hanya tersimpan di perangkat ini, tanpa akun.</p></div>${state.history.length?`${sectionHeading('Hasil tersimpan',`${state.history.length} hasil kalkulasi`, '<button class="text-link" type="button" data-clear-history>Hapus semua</button>')}<div class="history-list">${state.history.map((h,i)=>{const t=TOOL_MAP[h.id];return `<article class="history-row">${toolIcon(t)}<div class="history-info"><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(h.time)}</small></div><span class="history-result">${escapeHtml(h.result)}</span><div class="history-actions"><button type="button" data-history-open="${i}" title="Buka kembali" aria-label="Buka kembali perhitungan">${icon('arrow')}</button><button type="button" data-history-delete="${i}" title="Hapus" aria-label="Hapus hasil">${icon('trash')}</button></div></article>`}).join('')}</div>`:emptyState('clock','Riwayat masih kosong','Buka kalkulator, lakukan perhitungan, lalu tekan “Simpan riwayat”.','<button class="outline-button" type="button" data-nav="catalog">Mulai menghitung</button>')}</div>`}
function toolDefaults(tool){const today=new Date();const localISO=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');return Object.fromEntries(tool.fields.map(field=>[field.id,field.id==='at'&&tool.id==='age'?localISO:field.value]));}
function ensureForm(tool){if(!state.forms[tool.id])state.forms[tool.id]=toolDefaults(tool);return state.forms[tool.id]}
function fieldHtml(f,val){const id=`field-${f.id}`;const label=`<label for="${id}">${escapeHtml(f.label)}</label>`;
  let input;
  if(f.type==='select'){
    const options=f.id==='from'||f.id==='to' ? (state.tool==='unit'?Object.keys(UNIT_GROUPS[ensureForm(TOOL_MAP.unit).kind]).map(x=>({value:x,label:x})):f.options) : f.options;
    input=`<select class="form-input" id="${id}" data-field="${f.id}">${options.map(o=>`<option value="${escapeHtml(o.value)}" ${o.value===String(val)?'selected':''}>${escapeHtml(o.label)}</option>`).join('')}</select>`;
  } else {
    const type=f.type==='number'?'number':f.type==='text'?'text':f.type;
    input=`<input class="form-input" id="${id}" type="${type}" data-field="${f.id}" ${f.type==='number'?'inputmode="decimal"':''} ${f.type==='number'?`step="${f.step||'any'}"`:''} value="${escapeHtml(val)}" autocomplete="off"/>`;
  }
  return `<div class="field ${f.type==='text'||f.type==='date'?'wide':''}">${label}${input}${f.helper?`<div class="field-help">${escapeHtml(f.helper)}</div>`:''}</div>`;
}
function keypadHTML(scientific=false){const sci=['sin(','cos(','tan(','sqrt(','log(','ln(','π','^','(',')','7','8','9','÷','DEL','4','5','6','×','C','1','2','3','−','%','0','.','!','+','='];const basic=['C','(',')','%','7','8','9','÷','4','5','6','×','1','2','3','−','0','.','DEL','+','='];
  return `<div class="calc-expression"><input id="exprInput" class="expr-input" type="text" spellcheck="false" inputmode="text" value="${escapeHtml(state.forms[state.tool]?.expression||'')}" placeholder="0" aria-label="Ekspresi matematika"/><span id="exprPreview" class="expr-preview">Hasil otomatis muncul di sini</span></div><div class="keypad ${scientific?'scientific':''}">${(scientific?sci:basic).map(key=>`<button class="key ${['÷','×','−','+','^','%'].includes(key)?'operator':''} ${['C','DEL','(',')'].includes(key)?'special':''} ${key==='='?'equal':''} ${key.length>4?'small':''}" type="button" data-key="${escapeHtml(key)}">${key==='DEL'?'⌫':key}</button>`).join('')}</div><p class="keypad-tip">${scientific?'Sin, cos, tan dalam derajat. Contoh: sin(30) + sqrt(9).':'Gunakan tanda kurung untuk urutan operasi. Persen berarti dibagi 100.'} Tekan Enter untuk hasil.</p>`}
function showTool(){const tool=TOOL_MAP[state.tool];if(!tool)return showCatalog();const values=ensureForm(tool);const keypad=tool.id==='basic'||tool.id==='scientific';return `<div class="view-header"><button type="button" class="back-btn" data-go-back>${icon('back')} Kembali</button><div class="tool-detail-hero"><div class="detail-meta">${toolIcon(tool)}<div class="detail-title-wrap"><h1>${escapeHtml(tool.title)}</h1><p>${escapeHtml(tool.summary)}</p></div></div><button class="detail-fav ${state.favs.includes(tool.id)?'is-fav':''}" type="button" data-fav="${tool.id}" aria-label="Favoritkan ${escapeHtml(tool.title)}" title="Favorit">${icon('star')}</button></div></div><div class="detail-layout"><section class="panel"><div class="panel-heading"><h2>${keypad?'Kalkulator':'Masukkan angka'}</h2><span>${keypad?'Ketik atau klik tombol':'Hasil diperbarui otomatis'}</span></div>${keypad?keypadHTML(tool.id==='scientific'):`<div class="input-grid" id="toolFields">${tool.fields.map(f=>fieldHtml(f,values[f.id])).join('')}</div><div class="form-actions">${['currency','unit'].includes(tool.id)?`<button class="outline-button" type="button" data-swap-values>${icon('repeat')} Tukar arah</button>`:''}<button class="link-reset" data-reset type="button">${icon('refresh')} Reset nilai</button>${tool.id==='currency'?'<button class="fx-retry" data-fx-retry type="button">↻ Perbarui kurs</button>':''}</div>`}</section><div><section class="result-panel"><div class="result-inner"><span class="result-badge">${icon('spark')} HASIL KALKULASI</span><span class="result-label" id="resultLabel">Hasil perhitungan</span><div class="result-value" id="resultValue" aria-live="polite">—</div><div class="result-extra" id="resultExtra" hidden></div></div></section><div class="result-actions"><button class="result-action primary" type="button" data-copy-result>${icon('copy')} Salin hasil</button><button class="result-action" type="button" data-save-history>${icon('clock')} Simpan riwayat</button><button class="result-action" type="button" data-share>${icon('share')} Bagikan</button></div>${tool.id==='currency'?'<div id="fxInfo" class="fx-meta" aria-live="polite">Kurs diambil saat alat dibuka.</div>':''}${tool.note?`<div class="helper-note">${icon('info')}<span>${escapeHtml(tool.note)}</span></div>`:''}</div></div><section class="section-secondary">${sectionHeading('Coba kalkulator lain','Alat yang mungkin juga kamu butuhkan.')}<div class="suggested-grid">${CALCULATORS.filter(t=>t.id!==tool.id && (t.category===tool.category || POPULAR_IDS.includes(t.id))).slice(0,3).map(t=>`<button class="recent-item" type="button" data-tool="${t.id}"><span class="recent-mini-icon">${icon(t.icon)}</span><span><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.category)}</small></span><span class="arr">${icon('arrow')}</span></button>`).join('')}</div></section>`}
function render(){renderNav();let html='';if(state.page==='home')html=showHome();else if(state.page==='catalog')html=showCatalog();else if(state.page==='favorites')html=showFavorites();else if(state.page==='history')html=showHistory();else if(state.page==='tool')html=showTool();$('pageContent').innerHTML=html;
  if(state.page==='home'||state.page==='catalog')renderDirectoryResults();
  if(state.page==='tool')refreshResult();
  document.title=(state.page==='tool'?`${TOOL_MAP[state.tool].title} — `:state.page==='favorites'?'Favorit — ':state.page==='history'?'Riwayat — ':'')+'Kalkulin';
}
function navigate(page){state.page=page;state.tool=null;if(page==='catalog'&&state.previous==='from-category')state.previous='home';state.search='';if(page==='home')state.category='Semua';render();window.scrollTo({top:0,behavior:'instant'})}
function openTool(id){if(!TOOL_MAP[id])return;const old=state.page;state.previous=old==='tool'?state.previous:old;state.page='tool';state.tool=id;state.currentResult=null;state.recent=[id,...state.recent.filter(x=>x!==id)].slice(0,10);saveStorage();render();window.scrollTo({top:0,behavior:'instant'});if(id==='currency')refreshFx()}
function toggleFav(id){state.favs=state.favs.includes(id)?state.favs.filter(x=>x!==id):[id,...state.favs];saveStorage();renderNav();if(state.page==='tool'){const b=qs('.detail-fav');b?.classList.toggle('is-fav',state.favs.includes(id))}else if(state.page==='favorites')render();else qsa(`[data-fav="${id}"]`).forEach(b=>b.classList.toggle('is-fav',state.favs.includes(id)));toast(state.favs.includes(id)?'Ditambahkan ke favorit':'Dihapus dari favorit')}
function setResult(result,error=''){const label=$('resultLabel'),value=$('resultValue'),extra=$('resultExtra');if(!label||!value||!extra)return;
  if(error){state.currentResult=null;label.textContent='Periksa input';value.textContent=error;value.classList.add('result-error');extra.hidden=true;return;}
  state.currentResult=result;const formatted=formatValue(result.value,result.format,result.suffix);
  label.textContent=result.label;value.classList.remove('result-error');value.textContent=formatted;value.classList.remove('change');void value.offsetWidth;value.classList.add('change');
  extra.hidden=!result.extra?.length;extra.innerHTML=(result.extra||[]).map(row=>`<div class="result-row"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(formatValue(row.value,row.format,row.suffix))}</strong></div>`).join('');
}
function refreshResult(){if(state.page!=='tool')return;const tool=TOOL_MAP[state.tool];if(!tool)return;
  if(tool.id==='basic'||tool.id==='scientific')return refreshExpression();
  if(tool.id==='currency')return renderFxResult();
  try{setResult(computeTool(tool.id,ensureForm(tool)))}catch(err){setResult(null,err.message)}
}
function refreshExpression(){const expression=state.forms[state.tool]?.expression || '';const prev=$('exprPreview');if(!expression.trim()){prev.textContent='Hasil otomatis muncul di sini';setResult({label:'Hasil perhitungan',value:0,format:'number',extra:[]});return}
  try{const n=evaluateExpression(expression,state.tool==='scientific');prev.textContent=`= ${formatValue(n)}`;setResult({label:'Hasil perhitungan',value:n,format:'number',extra:[]})}catch(err){prev.textContent='Ekspresi belum selesai';setResult(null,err.message)}
}
function fieldChanged(id,raw){const tool=TOOL_MAP[state.tool];const field=tool.fields.find(f=>f.id===id);if(!field)return;const vals=ensureForm(tool);vals[id]=field.type==='number'?(raw.trim()===''?NaN:Number(raw)):raw;
  if(tool.id==='unit'&&id==='kind'){const options=Object.keys(UNIT_GROUPS[raw]||{});vals.from=options[0];vals.to=options[1]||options[0];for(const kind of ['from','to']){const sel=$(`field-${kind}`);if(sel)sel.innerHTML=options.map(x=>`<option value="${escapeHtml(x)}" ${x===vals[kind]?'selected':''}>${escapeHtml(x)}</option>`).join('')}}
  if(tool.id==='currency'){if(id==='from'||(id==='to'&&state.fxSource==='sama'))refreshFx();else renderFxResult()}
  else refreshResult();
}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Berhasil disalin')}catch{const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();const okay=document.execCommand('copy');t.remove();toast(okay?'Berhasil disalin':'Salin tidak didukung browser')}}
function resultText(){if(!state.currentResult)return '';const r=state.currentResult;return `${r.label}: ${formatValue(r.value,r.format,r.suffix)}`}
function saveHistory(){if(!state.currentResult){toast('Perbaiki input terlebih dahulu');return}const tool=TOOL_MAP[state.tool],item={id:tool.id,time:new Date().toLocaleString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),result:formatValue(state.currentResult.value,state.currentResult.format,state.currentResult.suffix),values:{...ensureForm(tool)}};state.history.unshift(item);state.history=state.history.slice(0,60);saveStorage();toast('Hasil disimpan ke riwayat')}
async function shareResult(){if(!state.currentResult){toast('Belum ada hasil yang valid');return}const data={title:`Kalkulin • ${TOOL_MAP[state.tool].title}`,text:`${TOOL_MAP[state.tool].title}\n${resultText()}\nDihitung dengan Kalkulin`};if(navigator.share){try{await navigator.share(data)}catch(err){if(err.name!=='AbortError')toast('Tidak dapat membagikan hasil')}}else await copy(data.text)}
function keyPressed(key){const el=$('exprInput');if(!el)return;let v=el.value;if(key==='C')v='';else if(key==='DEL')v=v.slice(0,-1);else if(key==='='){if(!state.currentResult){toast('Ekspresi belum valid');return}v=String(state.currentResult.value)}else v+=key;el.value=v;state.forms[state.tool]={expression:v};refreshExpression();if(key==='=')toast('Hasil dihitung')}
// Currency rates are explicitly fetched and dated. No fabricated offline FX rates.
function fxCacheGet(base){try{const raw=storeGet(`kalkulin-fx-${base}`);return raw?JSON.parse(raw):null}catch{return null}}
function fxCacheSet(base,data){storeSet(`kalkulin-fx-${base}`,JSON.stringify(data))}
async function fetchFX(base){const key=base.toLowerCase();const urls=[`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${key}.min.json`,`https://latest.currency-api.pages.dev/v1/currencies/${key}.min.json`];let error;
  for(const url of urls){const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),7500);try{const response=await fetch(url,{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error(`HTTP ${response.status}`);const data=await response.json();if(!data[key]||typeof data[key]!=='object')throw new Error('Data kurs tidak valid');return data}catch(e){error=e}finally{clearTimeout(timeout)}}throw error||new Error('Koneksi kurs gagal')}
async function refreshFx(force=false){if(state.page!=='tool'||state.tool!=='currency')return;const vals=ensureForm(TOOL_MAP.currency);const base=vals.from;
  if(base===vals.to){state.fxTable={[base.toLowerCase()]:1};state.fxBase=base;state.fxDate='';state.fxSource='sama';state.fxStatus='';renderFxResult();return}
  const cached=fxCacheGet(base);if(cached?.data?.[base.toLowerCase()]){state.fxTable=cached.data[base.toLowerCase()];state.fxBase=base;state.fxDate=cached.data.date||'';state.fxSource='cached';state.fxStatus='';renderFxResult()}
  else {state.fxTable=null;state.fxBase='';state.fxStatus='Mengambil kurs terbaru…';renderFxResult()}
  if(cached && cached.data?.[base.toLowerCase()] && !force && cached.cachedAt && Date.now()-cached.cachedAt<15*60*1000){state.fxSource='cached';renderFxResult();return}
  const id=++state.fxRequest;
  try{const data=await fetchFX(base);if(id!==state.fxRequest||state.tool!=='currency')return;state.fxBase=base;state.fxTable=data[base.toLowerCase()];state.fxDate=data.date||'';state.fxSource='online';state.fxStatus='';fxCacheSet(base,{data,cachedAt:Date.now()});renderFxResult()}
  catch{if(id!==state.fxRequest||state.tool!=='currency')return;state.fxStatus=cached?'Koneksi gagal — menggunakan data tersimpan.':'Tidak dapat memuat kurs. Periksa internet dan coba lagi.';renderFxResult()}
}
function renderFxResult(){if(state.tool!=='currency'||!$('fxInfo'))return;const v=ensureForm(TOOL_MAP.currency);if(v.from===v.to){setResult({label:`${v.from} → ${v.to}`,value:Number(v.amount)||0,format:'number',extra:[{label:'Nilai tukar',value:'1 : 1',format:'text'}]});$('fxInfo').textContent='Mata uang asal dan tujuan sama.';return}
  if(state.fxBase!==v.from||!state.fxTable){setResult(null,state.fxStatus||'Kurs belum tersedia.');$('fxInfo').textContent=state.fxStatus||'Muat data kurs terlebih dahulu.';return}
  const rate=Number(state.fxTable[v.to.toLowerCase()]);if(!Number.isFinite(rate)){setResult(null,'Pasangan kurs tidak tersedia.');return}
  const result=v.amount*rate;setResult({label:`${v.from} → ${v.to}`,value:formatNumber(result,4)+' '+v.to,format:'text',extra:[{label:'Kurs per 1 '+v.from,value:formatNumber(rate,6)+' '+v.to,format:'text'}]});
  $('fxInfo').textContent=`Sumber: Currency API • tanggal kurs ${state.fxDate||'tidak tersedia'} • ${state.fxSource==='online'?'online':'data tersimpan'}${state.fxStatus?' • '+state.fxStatus:''}. Kurs indikatif, bukan harga transaksi bank.`;
}
function setTheme(){const dark=!document.body.classList.contains('dark');document.body.classList.toggle('dark',dark);storeSet('kalkulin-theme',dark?'dark':'light');qs('meta[name="theme-color"]').content=dark?'#142b39':'#f4faff';renderNav()}
function installGuide(){const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);const isFirefox=/Firefox/.test(navigator.userAgent);let steps=[];
  if(location.protocol==='file:')steps=['File ini dibuka langsung dari penyimpanan. Untuk instalasi PWA, unggah seluruh folder Kalkulin ke hosting HTTPS atau jalankan di localhost.','Setelah online, buka alamat situs lewat browser HP dan pilih opsi instalasi.'];
  else if(isIOS)steps=['Buka Kalkulin melalui <strong>Safari</strong> pada iPhone.','Ketuk tombol <strong>Bagikan</strong> (ikon kotak dengan panah).','Pilih <strong>Tambahkan ke Layar Utama</strong> lalu konfirmasi.'];
  else if(isFirefox)steps=['Gunakan browser yang mendukung instalasi web app, seperti Chrome atau Edge di Android.','Buka menu browser, lalu pilih <strong>Tambahkan ke layar utama</strong> jika tersedia.'];
  else steps=['Buka Kalkulin di Chrome atau Edge melalui koneksi HTTPS.','Ketuk menu browser <strong>⋮</strong> dan pilih <strong>Instal aplikasi</strong> atau <strong>Tambahkan ke layar utama</strong>.','Aplikasi akan muncul di layar utama dan dapat dibuka tanpa tab browser.'];
  $('installSteps').innerHTML=steps.map((step,i)=>`<div class="install-step"><strong>${i+1}.</strong> ${step}</div>`).join('');$('installModal').hidden=false;document.body.style.overflow='hidden';qs('[data-close-install]')?.focus();}
function closeInstallGuide(){$('installModal').hidden=true;document.body.style.overflow=''}
async function installApp(){if(state.installed||window.matchMedia?.('(display-mode: standalone)').matches){toast('Kalkulin sudah terpasang sebagai aplikasi');return}if(state.deferredInstall){const evt=state.deferredInstall;state.deferredInstall=null;evt.prompt();try{const choice=await evt.userChoice;if(choice?.outcome==='accepted')toast('Instalasi dimulai')}catch{}return}installGuide()}
function bindEvents(){document.addEventListener('click',async e=>{
  const t=e.target.closest('button,a');if(!t)return;
  if(t.matches('[data-nav]')){e.preventDefault();navigate(t.dataset.nav);return}
  if(t.matches('[data-tool]')){openTool(t.dataset.tool);return}
  if(t.matches('[data-fav]')){toggleFav(t.dataset.fav);return}
  if(t.matches('[data-category]')){state.category=t.dataset.category;state.search='';state.previous='from-category';navigate('catalog');state.category=t.dataset.category;render();return}
  if(t.matches('[data-filter]')){state.category=t.dataset.filter;renderDirectoryResults();return}
  if(t.id==='clearSearch'||t.matches('[data-clear-filters]')){state.search='';state.category='Semua';const s=$('searchInput');if(s){s.value='';s.focus()}renderDirectoryResults();return}
  if(t.matches('[data-go-back]')){navigate(state.previous==='tool'?'home':state.previous);return}
  if(t.matches('[data-theme]')){setTheme();return}
  if(t.matches('[data-install]')){installApp();return}
  if(t.matches('[data-close-install]')){closeInstallGuide();return}
  if(t.matches('[data-reset]')){state.forms[state.tool]=toolDefaults(TOOL_MAP[state.tool]);render();if(state.tool==='currency')refreshFx(true);toast('Input dikembalikan ke nilai awal');return}
  if(t.matches('[data-key]')){keyPressed(t.dataset.key);return}
  if(t.matches('[data-copy-result]')){if(!state.currentResult)toast('Belum ada hasil yang valid');else await copy(resultText());return}
  if(t.matches('[data-save-history]')){saveHistory();return}
  if(t.matches('[data-share]')){shareResult();return}
  if(t.matches('[data-swap-values]')){const tool=TOOL_MAP[state.tool];if(!['unit','currency'].includes(tool.id))return;const v=ensureForm(tool);[v.from,v.to]=[v.to,v.from];render();if(tool.id==='currency')refreshFx();return}
  if(t.matches('[data-fx-retry]')){refreshFx(true);return}
  if(t.matches('[data-history-open]')){const h=state.history[+t.dataset.historyOpen];if(h){openTool(h.id);state.forms[h.id]={...h.values};render();if(h.id==='currency')refreshFx()}return}
  if(t.matches('[data-history-delete]')){state.history.splice(+t.dataset.historyDelete,1);saveStorage();render();toast('Riwayat dihapus');return}
  if(t.matches('[data-clear-history]')){if(window.confirm('Hapus seluruh riwayat tersimpan di perangkat ini?')){state.history=[];saveStorage();render();toast('Semua riwayat dihapus')}return}
});
  document.addEventListener('input',e=>{const t=e.target;if(t.id==='searchInput'){state.search=t.value;renderDirectoryResults();return}if(t.matches('[data-field]')){fieldChanged(t.dataset.field,t.value);return}if(t.id==='exprInput'){state.forms[state.tool]={expression:t.value};refreshExpression()}});
  document.addEventListener('change',e=>{const t=e.target;if(t.matches('[data-field]'))fieldChanged(t.dataset.field,t.value)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('installModal').hidden){closeInstallGuide();return}if(e.key==='Enter'&&e.target.id==='exprInput'){e.preventDefault();if(state.currentResult)keyPressed('=')}});
  $('installModal').addEventListener('click',e=>{if(e.target===$('installModal'))closeInstallGuide()});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.deferredInstall=e});
  window.addEventListener('appinstalled',()=>{state.installed=true;state.deferredInstall=null;toast('Kalkulin berhasil dipasang!')});
}
function initPWA(){if('serviceWorker' in navigator && (location.protocol==='https:' || ['localhost','127.0.0.1'].includes(location.hostname))){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('SW registration:',err)))}if(window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone)state.installed=true}
initStorage();$('copyYear').textContent=new Date().getFullYear();bindEvents();render();initPWA();
