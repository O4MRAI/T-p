import { sections } from './sections.js';
const tracks=new Map(),audio=new Audio();audio.loop=true;audio.preload='auto';
const places=[['intro','الافتتاحية'],['map','فهرس الأركان'],['room','التجوّل في الغرفة'],...sections.map(s=>[s.id,s.name])];
let context='intro',panel,blocked=false,playingTarget=null;
export function pauseAmbient(){blocked=false;audio.pause()}
function status(text){if(panel)panel.querySelector('[role=status]').textContent=text}
function selection(){return panel.querySelector('select').value}
function refresh(){const track=tracks.get(selection());panel.querySelector('.assigned-track').textContent=track?track.name:'لم تُضف أغنية لهذا المكان بعد';panel.querySelector('[data-audio-remove]').disabled=!track;panel.querySelector('[data-audio-play]').disabled=!track}
export function mountAmbient(parent,id,name){
 const changed=context!==id;context=id;
 if(!panel){
  panel=document.createElement('details');panel.className='ambient-controls';
  panel.innerHTML='<summary>♫ أضف أغنية للموقع</summary><label for="song-place">مكان تشغيل الأغنية</label><select id="song-place" aria-label="مكان تشغيل الأغنية"></select><p class="assigned-track"></p><label class="wbtn song-upload">＋ إضافة أو تبديل أغنية<input type="file" accept="audio/*,.mp3,.m4a,.wav,.ogg" hidden></label><div class="song-actions"><button class="wbtn" data-audio-play>معاينة الصوت</button><button class="wbtn" data-audio-stop>إيقاف</button><button class="wbtn" data-audio-remove>حذف الأغنية</button></div><p role="status"></p><small>الصوت يبدأ عند دخول المكان بعد إضافته. الأغاني مؤقتة لهذه الزيارة وتختفي عند تحديث الصفحة.</small>';
  for(const [value,title] of places){const option=document.createElement('option');option.value=value;option.textContent=title;panel.querySelector('select').append(option)}
  panel.querySelector('select').onchange=()=>{refresh();status('اختر ملفًا صوتيًا لهذا المكان، أو عاين الأغنية المضافة.')};
  panel.querySelector('input').onchange=e=>{const file=e.target.files[0];if(!file)return;if(!file.type.startsWith('audio/')&&!/\.(mp3|m4a|wav|ogg|aac|flac)$/i.test(file.name)){status('اختر ملفًا صوتيًا مثل MP3 أو M4A.');e.target.value='';return}const target=selection(),old=tracks.get(target);if(playingTarget===target)pauseAmbient();if(old)URL.revokeObjectURL(old.url);tracks.set(target,{url:URL.createObjectURL(file),name:file.name});e.target.value='';refresh();status('تمت إضافة الأغنية إلى '+panel.querySelector('select').selectedOptions[0].textContent);if(target===context)play(target)};
  panel.querySelector('[data-audio-play]').onclick=()=>play(selection());
  panel.querySelector('[data-audio-stop]').onclick=()=>{pauseAmbient();status('الصوت متوقف')};
  panel.querySelector('[data-audio-remove]').onclick=()=>{const target=selection(),track=tracks.get(target);if(!track)return;if(playingTarget===target){pauseAmbient();audio.removeAttribute('src');audio.load();playingTarget=null}URL.revokeObjectURL(track.url);tracks.delete(target);refresh();status('حُذفت الأغنية من هذا المكان')};
 }
 parent.append(panel);panel.querySelector('select').value=places.some(p=>p[0]===id)?id:'intro';refresh();
 if(changed||!audio.src||audio.paused){pauseAmbient();if(tracks.has(context))play(context);else{audio.removeAttribute('src');audio.load();playingTarget=null;status('أضف أغنية وحدّد مكان تشغيلها من القائمة.')}}
}
export async function playAmbient(){if(!tracks.has(context)){panel.open=true;panel.querySelector('select').value=context;refresh();status('اختر أغنية للبدء.');return}return play(context)}
async function play(target){const track=tracks.get(target);if(!track){status('أضف الأغنية أولًا.');return}if(playingTarget!==target||audio.getAttribute('src')!==track.url){audio.pause();audio.src=track.url;playingTarget=target}try{await audio.play();blocked=false;status('يعمل الآن: '+track.name)}catch(error){if(error.name==='AbortError')return;blocked=error.name==='NotAllowedError';status(blocked?'اضغط معاينة الصوت للسماح بالتشغيل.':'تعذّر تشغيل الملف؛ جرّب صيغة MP3 أو M4A.')}}
for(const event of ['pointerup','keydown'])document.addEventListener(event,e=>{if(blocked&&e.isTrusted&&!e.target.closest('[data-audio-stop],[data-audio-remove]'))play(playingTarget)});
