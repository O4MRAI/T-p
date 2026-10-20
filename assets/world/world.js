import { sections, intro, brief } from './sections.js';

// This prototype deliberately keeps new content in memory only.
const state = { current:null, screen:'intro', unlocked:new Set(), data:Object.fromEntries(sections.map(s=>[s.id,[]])), pages:[{id:crypto.randomUUID(),name:'الصفحة الأولى',items:[]}], page:0, selected:null, media:new Set() };
const $ = (s, root=document) => root.querySelector(s);
const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = s => s.normalize('NFKC').replace(/[\u064B-\u065F\u0670\s،,.؛;:'’‘"!?؟ـ]/g,'').toLowerCase();
const date = () => new Date().toLocaleDateString('ar',{year:'numeric',month:'short',day:'numeric'});
const newId = () => crypto.randomUUID();
let returnFocus = null, dialogReturnFocus = null, toastTimer;
let category = 'all';
const root = document.createElement('div');
root.id='world-ui';
root.innerHTML = `
<div id="world-intro" class="world-screen" role="dialog" aria-modal="true" aria-labelledby="intro-title">
  <article class="world-paper"><div class="eyebrow">ورقةٌ عند عتبة العالم</div><h1 id="intro-title">هسيس تشرين</h1><p class="dedication">${brief.dedication}</p><div class="world-symbols" aria-hidden="true">☾ ✧ ❦ ✒</div><blockquote>${intro}</blockquote><button class="leaf-enter" id="enter-world" aria-label="ورقة الخريف؛ ادخل إلى العالم"><span aria-hidden="true">🍂</span></button><p class="muted">اتبع الورقة… إلى الداخل</p><button class="wbtn quiet" id="opening-music">♫ موسيقى البداية</button><div id="intro-audio"></div></article>
</div>
<div id="world-bar"><button id="open-map" aria-label="افتح فهرس الأركان">❦ أركان تشرين</button><button id="show-intro" aria-label="العودة إلى ورقة البداية">🍂</button></div>
<section id="world-map" class="world-screen" hidden aria-labelledby="map-title"><div class="world-wrap">
  <div class="antique-ornament ornament-key" aria-hidden="true"><svg viewBox="0 0 100 200"><g fill="none" stroke="currentColor" stroke-width="3"><path d="M45 65v116h19v-13H53v-13h12v-12H45"/><circle cx="45" cy="40" r="24"/><circle cx="45" cy="40" r="15"/><path d="M45 25v30M30 40h30M34 29l22 22m0-22L34 51"/></g></svg></div><div class="antique-ornament ornament-clock" aria-hidden="true"><svg viewBox="0 0 140 190"><g fill="none" stroke="currentColor"><path d="M59 36V24h22v12" stroke-width="5"/><ellipse cx="70" cy="16" rx="16" ry="12" stroke-width="3"/><circle cx="70" cy="105" r="58" stroke-width="5"/><circle cx="70" cy="105" r="49" stroke-width="1.5"/><path d="M70 62v7m0 73v7m-43-44h7m73 0h7M41 76l5 5m48 48 5 5M41 134l5-5m48-48 5-5M70 77v28l24 15" stroke-width="3"/><circle cx="70" cy="105" r="3"/></g></svg></div>
  <header class="world-top world-masthead"><div class="header-note"><span>رسائل، وكتب، وأشياء عزيزة</span><small>منذ أوّل ورقة خريف</small></div><div class="world-brand"><span class="brand-flourish" aria-hidden="true">❧</span><div><span class="brand-name">هسيس تشرين</span><small>حكاياتٌ لا يطالها الغبار</small></div><span class="brand-flourish" aria-hidden="true">☙</span></div><button class="wbtn quiet" id="back-room">مفتاح الغرفة <span aria-hidden="true">🗝</span></button></header>
  <div class="category-tabs paper-navigation" role="group" aria-label="تصفية الأركان"><button data-category="all" aria-pressed="true">كل الحكايات</button><button data-category="writing" aria-pressed="false">حبر وورق</button><button data-category="books" aria-pressed="false">خزانة الكتب</button><button data-category="collection" aria-pressed="false">ذاكرة وشغف</button><button data-category="daily" aria-pressed="false">تفاصيل صغيرة</button></div>
  <div class="world-heading antique-hero"><div class="hero-copy"><div class="eyebrow">إلى ثاني أكسيد الكربون</div><h1 id="map-title" tabindex="-1">بعضُ الأشياء، لا تصبحُ قديمة…<br><em>تصبحُ أثمن.</em></h1><p class="muted">وللكلمات والكتب والذكريات، صنعتُ هذا المكان.</p></div><img class="antique-hero-image" src="assets/world/antique-hero.webp" alt="كتب عتيقة وريشة حبر وساعة جيب ومفتاح، وثعلب نائم بينها" width="1200" height="800" fetchpriority="high"><div class="hero-inscription"><span aria-hidden="true">❦</span> ثلاثة عشر مفتاحًا… وعالمٌ واحد يشبهك <span aria-hidden="true">❦</span></div></div>
  <div class="collection-toolbar"><div><span class="eyebrow">افتح بابًا، واتبع الحكاية</span><h2>خزانةُ الأشياء العزيزة</h2></div><div class="search-wrap"><span aria-hidden="true">⌕</span><input id="section-search" class="world-search" type="search" placeholder="عن أيّ حكاية تبحث؟" aria-label="ابحث عن ركن"></div></div>
  <div id="sections-grid" class="world-grid"></div>
  <footer class="world-bottom"><div class="world-companion"><span class="fox-avatar" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="m6 7 12 6h4L34 7l-3 20-11 8L9 27 6 7Z" stroke="currentColor" stroke-width="1.3"/><path d="m7 9 7 14 6 10 6-10 7-14M12 22l5 1m6 0 5-1m-11 5h6l-3 4-3-4Z" stroke="currentColor" stroke-width="1.3"/></svg></span><span>أنا هنا، أيّ باب سنفتح اليوم؟</span></div><span class="muted">مسودة للتجربة · الإضافات تختفي عند تحديث الصفحة</span></footer>
</div></section>
<section id="world-section" class="world-screen" hidden aria-labelledby="section-title"><div class="world-wrap">
  <header class="world-top"><button class="wbtn quiet" id="back-map">→ كل الأركان</button><div class="world-companion"><span class="fox-avatar" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="m6 7 12 6h4L34 7l-3 20-11 8L9 27 6 7Z" stroke="currentColor" stroke-width="1.3"/><path d="m7 9 7 14 6 10 6-10 7-14M12 22l5 1m6 0 5-1m-11 5h6l-3 4-3-4Z" stroke="currentColor" stroke-width="1.3"/></svg></span><span id="fox-mood"></span></div><button class="wbtn" id="section-room">الغرفة <svg class="w-arrow" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10"/></svg></button></header>
  <div class="world-section-head"><span id="section-eyebrow" class="eyebrow"></span><h1 id="section-title" tabindex="-1"></h1><p id="section-desc" class="muted"></p></div>
  <div id="section-audio"></div><div id="section-content"></div>
</div></section>
<div id="world-dialog-shell" class="world-screen world-dialog-shell" hidden><section class="world-dialog" role="dialog" aria-modal="true" aria-labelledby="world-dialog-title"><div class="world-top"><h2 id="world-dialog-title"></h2><button class="wbtn quiet" id="dialog-close" aria-label="إغلاق النافذة">✕</button></div><div id="world-dialog-body"></div></section></div>
<div id="world-toast" class="world-toast" role="status" hidden></div>`;
document.body.append(root);

function toast(message) { const el=$('#world-toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.hidden=true},3500); }
function emitSection(s=null, sleeping=false) {window.dispatchEvent(new CustomEvent('tishreen:section',{detail:{id:s?.id,color:s?.color,mood:s?.mood,sleeping}}));}
function setScreen(name) {
  const previous=state.screen;
  state.screen=name;
  for(const n of ['intro','map','section']) $(`#world-${n}`).hidden=n!==name;
  $('#world-bar').hidden=name!=='room';
  const blocked=name!=='room';
  for(const id of ['scene','joy','reader']) {const el=document.getElementById(id);if(el)el.inert=blocked;}
  document.body.classList.toggle('world-open',blocked);
  window.dispatchEvent(new CustomEvent('tishreen:overlay',{detail:{open:blocked}}));
  if(name==='room') {stopAudio();if(previous!=='room')returnFocus?.focus();}
  if(name==='map') {stopAudio();emitSection();$('#world-map').scrollTop=0;$('#map-title').focus({preventScroll:true});}
  if(name==='section') {$('#world-section').scrollTop=0;$('#section-title').focus({preventScroll:true});}
  if(name==='intro') $('#enter-world').focus({preventScroll:true});
}
function stopAudio() {for(const el of root.querySelectorAll('audio,video'))el.pause();for(const el of root.querySelectorAll('iframe'))el.remove();}
function modal(title,body,after) {
  dialogReturnFocus=document.activeElement;
  $('#world-dialog-title').textContent=title;$('#world-dialog-body').innerHTML=body;
  $('#world-dialog-shell').hidden=false;
  for(const id of ['world-intro','world-map','world-section','world-bar'])$('#'+id).inert=true;
  window.dispatchEvent(new CustomEvent('tishreen:overlay',{detail:{open:true}}));
  after?.();
  ($('#world-dialog-body input') || $('#dialog-close')).focus();
}
function closeModal() {
  $('#world-dialog-shell').hidden=true;$('#world-dialog-body').replaceChildren();
  for(const id of ['world-intro','world-map','world-section','world-bar'])$('#'+id).inert=false;
  window.dispatchEvent(new CustomEvent('tishreen:overlay',{detail:{open:state.screen!=='room'}}));
  dialogReturnFocus?.focus();
}
$('#dialog-close').onclick=closeModal;
$('#world-dialog-shell').onclick=e=>{if(e.target.id==='world-dialog-shell')closeModal()};
function gate(s) {
  const title=s ? s.name : 'باب هسيس تشرين';
  const password=s ? s.pass : brief.mainPassword;
  const enter=()=>{closeModal();if(s){state.unlocked.add(s.id);openSection(s.id,true)}else{setScreen('map');$('#intro-audio').replaceChildren()}};
  modal(title,`<p class="muted">${s?'لهذا الركن كلمة يعرفها صاحبه.':'في أيّ ليلة نفتح الباب؟'}</p><form id="gate-form"><label for="gate-password">كلمة الدخول</label><div class="password-row"><input id="gate-password" type="password" autocomplete="off" required><button type="button" class="wbtn" id="toggle-password" aria-label="إظهار كلمة الدخول">◉</button></div><p class="w-error" id="gate-error" role="alert"></p><div class="world-dialog-actions"><button type="button" class="wbtn quiet" id="demo-enter">دخول تجريبي سريع</button><button type="submit" class="wbtn primary">افتح الباب</button></div><details><summary class="muted">تلميح للتجربة</summary><p dir="auto">${escape(password)}</p></details></form>`,()=>{
    $('#gate-form').onsubmit=e=>{e.preventDefault();if(normalize($('#gate-password').value)===normalize(password))enter();else $('#gate-error').textContent='الكلمة لا تطابق هذا الباب. جرّب مرة أخرى أو ادخل للتجربة.'};
    $('#toggle-password').onclick=()=>{const input=$('#gate-password');input.type=input.type==='password'?'text':'password';$('#toggle-password').setAttribute('aria-label',input.type==='text'?'إخفاء كلمة الدخول':'إظهار كلمة الدخول')};
    $('#demo-enter').onclick=enter;
  });
}
function icon(id) {
  const paths={
    insomnia:'<path d="M27 5a13 13 0 1 0 9 21A13 13 0 0 1 27 5Z"/><path d="M31 7v5m-2-2h5"/>',
    ink:'<path d="m9 29 4-12L28 3l8 8-15 14-12 4Zm4-12 8 8M9 29l-4 5m0 2h29"/><path d="m25 6 8 8"/>',
    table:'<rect x="5" y="11" width="30" height="5" rx="1"/><path d="M9 16v19m22-19v19M14 6h12"/>',
    camus:'<path d="M20 9C14 5 7 6 4 7v25c6-2 11-1 16 2 5-3 10-4 16-2V7c-5-2-11-1-16 2Zm0 0v25M9 13l6 1m-6 5 6 1m10-6 6-1m-6 7 6-1"/>',
    '167':'<path d="m20 3 4 12 12 5-12 4-4 13-4-13L3 20l13-5 4-12Z"/>',
    yusr:'<circle cx="20" cy="20" r="8"/><path d="M20 2v5m0 26v5M2 20h5m26 0h5M7 7l4 4m18 18 4 4M7 33l4-4M29 11l4-4"/>',
    shawqi:'<path d="M20 35V14m0 10C6 24 4 14 8 6c10 0 15 7 12 18Zm0 6c13-1 18-10 13-18-8 0-14 8-13 18Z"/>',
    spacetoon:'<path d="m20 3 5 11 12 2-9 9 2 12-10-6-11 6 2-12-9-9 13-2 5-11Z"/>',
    mercedes:'<circle cx="20" cy="20" r="16"/><path d="m20 4-2 17L6 30m12-9 16 9m-14-9 0-17"/>',
    milan:'<path d="M8 5h24v14c0 9-12 16-12 16S8 28 8 19V5Z"/><path d="M16 6v24m8-24v24M9 16h23"/>',
    journal:'<rect x="8" y="4" width="25" height="32" rx="2"/><path d="M14 4v32M5 10h6m-6 8h6m-6 8h6m9-14h8m-8 6h8"/>',
    '2052':'<path d="M7 15h23v10c0 7-23 7-23 0V15Zm23 2h3a5 5 0 0 1 0 10h-3M5 35h29M13 5v4m7-6v6m7-4v4"/>',
    library:'<path d="M5 8h7v27H5Zm9-4h7v31h-7Zm10 6 7-2 7 25-7 2-7-25ZM5 29h7m2-19h7"/>',
  };
  return `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${paths[id]||paths.library}</svg>`;
}
function renderMap(filter=$('#section-search')?.value || '') {
  const found=sections.filter(s=>normalize(s.name+' '+s.desc).includes(normalize(filter)) && (category==='all'||(category==='daily'?['tasks','journal'].includes(s.type):s.type===category)));
  $('#sections-grid').innerHTML=found.length ? found.map(s=>`<button class="section-card" data-section="${s.id}" style="--card-color:${s.color}"><span class="section-number">${String(sections.indexOf(s)+1).padStart(2,'0')}</span><div class="card-topline"><span class="section-symbol" aria-hidden="true">${icon(s.id)}</span><span class="card-type">${({writing:'حبر وورق',books:'بين الكتب',collection:'ذاكرة وشغف',tasks:'خطوات صغيرة',journal:'مساحة حرة'})[s.type]}</span></div><h2>${s.name}</h2><p>${s.desc}</p><div class="card-footer"><small>${state.unlocked.has(s.id)||!s.pass?'عد إلى الحكاية':'مفتاح الحكاية'}</small><span class="card-arrow" aria-hidden="true"><svg class="w-arrow" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10"/></svg></span></div></button>`).join('') : '<p class="empty-state">لا يوجد ركن بهذا الاسم.</p>';
  for(const el of $('#sections-grid').querySelectorAll('[data-section]'))el.onclick=()=>openSection(el.dataset.section);
}
function openSection(id,bypass=false) {
  const s=sections.find(s=>s.id===id);if(!s)return;
  if(!bypass&&s.pass&&!state.unlocked.has(s.id)){gate(s);return;}
  state.current=s;state.selected=null;
  $('#world-section').style.setProperty('--world-accent',s.color);
  $('#section-eyebrow').textContent=`${String(sections.indexOf(s)+1).padStart(2,'0')} / ${s.icon} هسيس تشرين`;
  $('#section-title').textContent=s.name;$('#section-desc').textContent=s.desc;$('#fox-mood').textContent=s.mood;
  stopAudio();renderAudio(s);renderContent();setScreen('section');emitSection(s,s.type==='tasks'&&isSleeping());
}
function renderAudio(s) {
  $('#section-audio').innerHTML=`<details class="world-audio"><summary>♫ ${s.audio?'صوت هذا الركن':'صوت المطر'} <span class="muted">· اختر التشغيل</span></summary><div class="world-tools">${s.audio?'<button class="wbtn" id="play-reference">تشغيل المقطع المحدد</button>':''}<label class="wbtn" style="margin:0;cursor:pointer">اختَر تسجيلًا من جهازك<input id="ambient-file" type="file" accept="audio/*" hidden></label></div><div id="audio-slot"></div></details>`;
  const play=$('#play-reference');if(play)play.onclick=()=>embed($('#audio-slot'),s.audio);
  $('#ambient-file').onchange=e=>{const f=e.target.files[0];if(!f)return;const url=mediaUrl(f);$('#audio-slot').innerHTML=`<audio controls src="${url}" aria-label="صوت الركن"></audio>`;$('#audio-slot audio').play().catch(()=>{});};
}
function embed(slot,id) {slot.innerHTML=`<iframe title="المقطع الصوتي المحدد" src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;}
function mediaUrl(file) {const url=URL.createObjectURL(file);state.media.add(url);return url;}
function release(url) {if(url&&state.media.has(url)){URL.revokeObjectURL(url);state.media.delete(url)}}
function empty(symbol,title,desc) {return `<div class="empty-state"><div class="symbol">${symbol}</div><h3>${title}</h3><p class="muted">${desc}</p></div>`;}
function renderContent() {
  const s=state.current;
  if(s.type==='journal'){renderJournal();return}
  const noun=s.type==='books'?'كتاب':s.type==='tasks'?'مهمة أو عادة':s.type==='collection'?'ذكرى':'نص';
  $('#section-content').innerHTML=`<div class="world-tools"><button class="wbtn primary" id="new-entry">+ أضف ${noun}</button><span class="spacer"></span>${s.type==='books'?'<select id="book-filter" aria-label="حالة القراءة" style="max-width:190px"><option value="">كل الكتب</option><option>أريد قراءته</option><option>أقرأه الآن</option><option>قرأته</option></select>':''}<span class="muted" id="entry-count"></span></div><div id="entries" class="${s.type==='tasks'?'':'world-entry-grid '+(s.type==='books'?'books':'')}"></div>`;
  $('#new-entry').onclick=()=>editEntry();
  if($('#book-filter'))$('#book-filter').onchange=renderEntries;
  renderEntries();
}
function renderEntries() {
  const s=state.current;let entries=state.data[s.id];
  const filter=$('#book-filter')?.value;if(filter)entries=entries.filter(e=>e.status===filter);
  $('#entry-count').textContent=`${entries.length.toLocaleString('ar')} ${s.type==='tasks'?'خطوة':'إضافة'}`;
  const container=$('#entries');
  if(!entries.length){container.innerHTML=empty(s.icon,s.type==='books'?'رفٌّ ينتظر كتبك':s.type==='tasks'?'خطوة صغيرة تكفي':'هذه الصفحة لك',s.type==='tasks'?'أضف مهمة أو عادة يومية. الثعلب سيتابع خطواتك.':'أضف أول محتوى لتجربة هذا الركن.');return}
  container.innerHTML=entries.map(e=>s.type==='tasks'?taskHTML(e):entryHTML(e)).join('');
  container.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editEntry(b.dataset.edit));
  container.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteEntry(b.dataset.delete));
  container.querySelectorAll('[data-check]').forEach(b=>b.onchange=()=>{const e=entries.find(x=>x.id===b.dataset.check);e.done=b.checked;renderEntries()});
  container.querySelectorAll('[data-repeat]').forEach(b=>b.onclick=()=>{const e=entries.find(x=>x.id===b.dataset.repeat);e.count=Math.min(8,(e.count||0)+1);renderEntries();const sleeping=isSleeping();emitSection(s,sleeping);$('#fox-mood').textContent=sleeping?'يستريح؛ أكمل سبع خطوات إضافية ليعود':'صحا الثعلب! خطوة أخرى نحو يُسر';});
}
function entryHTML(e) {
  const s=state.current;
  const media=e.url?e.kind==='image'?`<img src="${e.url}" alt="${escape(e.title)}">`:e.kind==='audio'?`<audio controls src="${e.url}" aria-label="${escape(e.title)}"></audio>`:e.kind==='video'?`<video controls playsinline src="${e.url}" aria-label="${escape(e.title)}"></video>`:'':'';
  return `<article class="entry-card">${media}<div class="entry-meta">${escape(e.status||e.date)}${e.rating?' · '+ '★'.repeat(Number(e.rating)):''}</div><h3>${escape(e.title)}</h3><p>${escape(e.body)}</p>${e.quote?`<blockquote>«${escape(e.quote)}»</blockquote>`:''}<div class="entry-actions"><button class="wbtn quiet" data-edit="${e.id}">تعديل</button><button class="wbtn quiet" data-delete="${e.id}" aria-label="حذف ${escape(e.title)}">حذف</button></div></article>`;
}
function taskHTML(e) {return `<article class="task-item ${e.done?'done':''}">${e.habit?'☀':`<input type="checkbox" data-check="${e.id}" ${e.done?'checked':''} aria-label="إنجاز ${escape(e.title)}">`}<div class="task-body"><h3>${escape(e.title)} ${e.required?'· إلزامية':''}</h3><span class="muted">${escape(e.body)} ${e.habit?`· ${e.count||0} / 8 خطوات`:''}</span></div>${e.habit?`<progress value="${e.count||0}" max="8" aria-label="تقدم العادة"></progress><button class="wbtn" data-repeat="${e.id}" ${(e.count||0)>=8?'disabled':''}>${(e.count||0)>=8?'اكتملت ✓':'أنجزتها +1'}</button>`:''}<button class="wbtn quiet" data-edit="${e.id}">تعديل</button><button class="wbtn quiet" data-delete="${e.id}" aria-label="حذف ${escape(e.title)}">حذف</button></article>`;}
function isSleeping() {return state.data.yusr.some(e=>e.habit&&(e.count||0)<8);}
function editEntry(id) {
  const s=state.current, old=state.data[s.id].find(e=>e.id===id),e=old||{};
  modal(old?'تعديل الإضافة':'شيءٌ جديد لهذا الركن',`<form id="entry-form"><label for="entry-title">${s.type==='books'?'اسم الكتاب':'العنوان'}</label><input id="entry-title" value="${escape(e.title)}" required maxlength="160"><label for="entry-body">${s.type==='tasks'?'ملاحظة':s.type==='books'?'ملاحظاتك':'النص / الوصف'}</label><textarea id="entry-body">${escape(e.body)}</textarea>
  ${s.type==='books'?`<div class="form-row"><div><label for="entry-status">حالة القراءة</label><select id="entry-status">${['أريد قراءته','أقرأه الآن','قرأته'].map(x=>`<option ${e.status===x?'selected':''}>${x}</option>`).join('')}</select></div><div><label for="entry-rating">تقييمك</label><select id="entry-rating">${[0,1,2,3,4,5].map(x=>`<option value="${x}" ${Number(e.rating)===x?'selected':''}>${x?x+' / 5':'دون تقييم'}</option>`).join('')}</select></div></div><label for="entry-quote">اقتباس</label><textarea id="entry-quote">${escape(e.quote)}</textarea>`:''}
  ${s.type==='tasks'?`<div class="form-row"><div><label for="entry-habit">النوع</label><select id="entry-habit"><option value="task">مهمة</option><option value="habit" ${e.habit?'selected':''}>عادة · ثماني خطوات للتجربة</option></select></div><div><label for="entry-required">الأهمية</label><select id="entry-required"><option value="no">اختيارية</option><option value="yes" ${e.required?'selected':''}>إلزامية</option></select></div></div><p class="muted">في التجربة: أول إنجاز ثم سبعة إنجازات إضافية لإيقاظ الثعلب. يمكنك تجربة الخطوات مباشرة.</p>`:`<label for="entry-file">${s.type==='books'?'غلاف الكتاب':'صورة أو فيديو أو تسجيل صوتي'} (اختياري)</label><input id="entry-file" type="file" accept="${s.type==='books'?'image/*':'image/*,audio/*,video/*'}">${e.url?'<label><input type="checkbox" id="remove-file" style="width:auto"> إزالة الملف الحالي</label>':''}`}
  <p id="entry-error" class="w-error" role="alert"></p><div class="world-dialog-actions"><button type="button" class="wbtn quiet" id="cancel-entry">إلغاء</button><button class="wbtn primary" type="submit">${old?'تحديث':'أضف إلى الركن'}</button></div></form>`,()=>{
    $('#cancel-entry').onclick=closeModal;
    $('#entry-form').onsubmit=event=>{
      event.preventDefault();const title=$('#entry-title').value.trim();if(!title){$('#entry-error').textContent='اكتب عنوانًا أولًا.';return}
      const f=$('#entry-file')?.files[0];
      if(f&&!/^(image|audio|video)\//.test(f.type)){$('#entry-error').textContent='اختر صورة أو ملف صوت أو فيديو.';return}
      const next={...e,id:e.id||newId(),title,body:$('#entry-body').value,date:e.date||date()};
      if(s.type==='books'){next.status=$('#entry-status').value;next.rating=Number($('#entry-rating').value);next.quote=$('#entry-quote').value}
      if(s.type==='tasks'){next.habit=$('#entry-habit').value==='habit';next.required=$('#entry-required').value==='yes'}
      if(f){release(e.url);next.url=mediaUrl(f);next.kind=f.type.split('/')[0]}
      else if($('#remove-file')?.checked){release(e.url);delete next.url;delete next.kind}
      if(old)state.data[s.id]=state.data[s.id].map(x=>x.id===id?next:x);else state.data[s.id].unshift(next);
      closeModal();renderEntries();if(s.type==='tasks'){emitSection(s,isSleeping());$('#fox-mood').textContent=isSleeping()?'يستريح؛ أكمل سبع خطوات إضافية ليعود':s.mood}toast('أُضيفت إلى مسودتك المؤقتة');
    };
  });
}
function deleteEntry(id) {const s=state.current,e=state.data[s.id].find(e=>e.id===id);modal('حذف الإضافة؟',`<p>سيُحذف «${escape(e.title)}» من هذه المسودة.</p><div class="world-dialog-actions"><button class="wbtn" id="cancel-delete">تراجع</button><button class="wbtn primary" id="confirm-delete">حذف</button></div>`,()=>{$('#cancel-delete').onclick=closeModal;$('#confirm-delete').onclick=()=>{release(e.url);state.data[s.id]=state.data[s.id].filter(x=>x.id!==id);closeModal();renderEntries();if(s.type==='tasks')emitSection(s,isSleeping())}})}

function renderJournal() {
  const pages=state.pages,p=pages[state.page];
  $('#section-content').innerHTML=`<div class="world-tools"><select class="page-select" id="journal-page" aria-label="صفحة الجورنال">${pages.map((x,i)=>`<option value="${i}" ${state.page===i?'selected':''}>${escape(x.name)}</option>`).join('')}</select><button class="wbtn" id="add-page">+ صفحة</button><button class="wbtn quiet" id="rename-page">تسمية الصفحة</button><span class="spacer"></span><button class="wbtn primary" id="add-scrap">+ قصاصة</button><label class="wbtn" style="margin:0;cursor:pointer">+ صورة<input type="file" id="journal-image" accept="image/*" hidden></label><button class="wbtn" id="add-sticker">+ ملصق 🍂</button></div><p class="muted">اسحب القصاصة لتغيير مكانها؛ اضغط عليها لضبط حجمها أو تعديلها.</p><div id="journal-board" class="journal-board" aria-label="لوحة قصاصات الجورنال"></div><div class="journal-controls" id="journal-controls"></div>`;
  $('#journal-page').onchange=e=>{state.page=Number(e.target.value);state.selected=null;renderJournal()};
  $('#add-page').onclick=()=>namePage(false);$('#rename-page').onclick=()=>namePage(true);
  $('#add-scrap').onclick=()=>scrapDialog();
  $('#journal-image').onchange=e=>{const f=e.target.files[0];if(!f||!f.type.startsWith('image/'))return;p.items.push({id:newId(),kind:'image',url:mediaUrl(f),title:f.name,x:15,y:15,width:180,rotation:0});renderBoard()};
  $('#add-sticker').onclick=()=>{p.items.push({id:newId(),kind:'text',text:'🍂',x:30,y:20,width:100,rotation:-5});renderBoard()};
  renderBoard();
}
function namePage(rename) {modal(rename?'اسم الصفحة':'صفحة جديدة',`<form id="page-form"><label for="page-name">اسم الصفحة</label><input id="page-name" required maxlength="80" value="${rename?escape(state.pages[state.page].name):''}"><div class="world-dialog-actions"><button class="wbtn primary">اعتمد الاسم</button></div></form>`,()=>{$('#page-form').onsubmit=e=>{e.preventDefault();const name=$('#page-name').value.trim();if(!name)return;if(rename)state.pages[state.page].name=name;else{state.pages.push({id:newId(),name,items:[]});state.page=state.pages.length-1}closeModal();renderJournal()}})}
function scrapDialog(item) {modal(item?'تعديل القصاصة':'قصاصة جديدة',`<form id="scrap-form"><label for="scrap-text">كلمات على الورق</label><textarea id="scrap-text" required maxlength="1200">${escape(item?.text)}</textarea><div class="world-dialog-actions"><button class="wbtn primary">أضف للصفحة</button></div></form>`,()=>{$('#scrap-form').onsubmit=e=>{e.preventDefault();const text=$('#scrap-text').value.trim();if(!text)return;if(item)item.text=text;else state.pages[state.page].items.push({id:newId(),kind:'text',text,x:10,y:10,width:180,rotation:-3});closeModal();renderBoard()}})}
function renderBoard() {
  const p=state.pages[state.page],board=$('#journal-board');
  board.innerHTML=p.items.length?p.items.map(i=>`<div class="journal-item ${i.id===state.selected?'selected':''}" tabindex="0" role="button" aria-label="قصاصة؛ استخدم الأسهم للتحريك" data-item="${i.id}" style="left:${i.x}%;top:${i.y}%;width:${i.width}px;transform:rotate(${i.rotation}deg)">${i.kind==='image'?`<img src="${i.url}" alt="${escape(i.title)}">`:escape(i.text)}</div>`).join(''):empty('❦','صفحة بيضاء، واحتمالات كثيرة','أضف صورة أو كلمة أو ورقة خريف.');
  for(const el of board.querySelectorAll('[data-item]')){
    const i=p.items.find(i=>i.id===el.dataset.item);let drag=null;
    el.onpointerdown=e=>{state.selected=i.id;board.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');renderJournalControls();drag={x:e.clientX,y:e.clientY,left:i.x,top:i.y};el.setPointerCapture(e.pointerId);};
    el.onpointermove=e=>{if(!drag)return;const r=board.getBoundingClientRect();i.x=Math.max(0,Math.min(Math.max(0,100-el.offsetWidth/r.width*100),drag.left+(e.clientX-drag.x)/r.width*100));i.y=Math.max(0,Math.min(Math.max(0,100-el.offsetHeight/r.height*100),drag.top+(e.clientY-drag.y)/r.height*100));el.style.left=i.x+'%';el.style.top=i.y+'%'};
    el.onpointerup=el.onpointercancel=()=>{drag=null};
    el.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();state.selected=i.id;renderBoard();return}const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(d){e.preventDefault();i.x=Math.max(0,Math.min(80,i.x+d[0]));i.y=Math.max(0,Math.min(80,i.y+d[1]));el.style.left=i.x+'%';el.style.top=i.y+'%'}};
  }
  renderJournalControls();
}
function renderJournalControls() {
  const p=state.pages[state.page],i=p.items.find(i=>i.id===state.selected),controls=$('#journal-controls');if(!i){controls.innerHTML='<span class="muted">الصفحة مؤقتة لهذه الزيارة.</span>';return}
  controls.innerHTML=`<label for="scrap-size" style="margin:0">الحجم</label><input id="scrap-size" type="range" min="90" max="300" value="${i.width}"><label for="scrap-rotation" style="margin:0">الميل</label><input id="scrap-rotation" type="range" min="-20" max="20" value="${i.rotation}">${i.kind==='text'?'<button class="wbtn" id="edit-scrap">تعديل النص</button>':''}<button class="wbtn quiet" id="remove-scrap">حذف القصاصة</button>`;
  const apply=()=>{const el=$(`[data-item="${i.id}"]`);el.style.width=i.width+'px';el.style.transform=`rotate(${i.rotation}deg)`};
  $('#scrap-size').oninput=e=>{i.width=Number(e.target.value);apply()};$('#scrap-rotation').oninput=e=>{i.rotation=Number(e.target.value);apply()};
  if($('#edit-scrap'))$('#edit-scrap').onclick=()=>scrapDialog(i);
  $('#remove-scrap').onclick=()=>{release(i.url);p.items=p.items.filter(x=>x.id!==i.id);state.selected=null;renderBoard()};
}

$('#enter-world').onclick=()=>gate(null);
$('#opening-music').onclick=()=>embed($('#intro-audio'),brief.openingMusic);
$('#open-map').onclick=()=>{returnFocus=$('#open-map');renderMap();setScreen('map')};
$('#show-intro').onclick=()=>{returnFocus=$('#show-intro');setScreen('intro')};
$('#back-room').onclick=()=>{emitSection();setScreen('room')};
$('#section-room').onclick=()=>{emitSection(state.current,state.current?.id==='yusr'&&isSleeping());setScreen('room')};
$('#back-map').onclick=()=>{renderMap();setScreen('map')};
$('#section-search').oninput=e=>renderMap(e.target.value);
for(const tab of root.querySelectorAll('[data-category]'))tab.onclick=()=>{category=tab.dataset.category;for(const t of root.querySelectorAll('[data-category]'))t.setAttribute('aria-pressed',String(t===tab));renderMap();$('.collection-toolbar').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})};
window.addEventListener('tishreen:open',e=>openSection(e.detail.id));
window.addEventListener('keydown',e=>{
  const shell=$('#world-dialog-shell'),active=!shell.hidden?shell:state.screen==='room'?null:$(`#world-${state.screen}`);
  if(e.key==='Escape') {if(!shell.hidden){e.preventDefault();closeModal()}else if(state.screen==='section'){renderMap();setScreen('map')}else if(state.screen==='map'){setScreen('room')}return}
  if(e.key==='Tab'&&active){const focusables=[...active.querySelectorAll('button,input,textarea,select,a[href],summary,[tabindex="0"]')].filter(x=>!x.disabled&&x.offsetParent!==null);const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&(document.activeElement===first||!active.contains(document.activeElement))){e.preventDefault();last?.focus()}else if(!e.shiftKey&&(document.activeElement===last||!active.contains(document.activeElement))){e.preventDefault();first?.focus()}}
});
renderMap();setScreen('intro');
