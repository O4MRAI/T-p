const tracks=new Map();const audio=new Audio();audio.loop=true;audio.preload='auto';let context='intro',label='الافتتاحية',panel;
export function pauseAmbient(){blocked=false;audio.pause()}
export function mountAmbient(parent,id,name){
 const changed=context!==id;context=id;label=name;
 if(!panel){panel=document.createElement('details');panel.className='ambient-controls';panel.innerHTML='<summary>♫ صوت المكان</summary><span class="ambient-name"></span><label class="wbtn">اختيار MP3 لهذا المكان<input type="file" accept="audio/*" hidden></label><button class="wbtn" data-audio-play>تشغيل</button><button class="wbtn" data-audio-stop>إيقاف</button><p role="status"></p>';panel.querySelector('input').onchange=e=>{const f=e.target.files[0];if(!f)return;const old=tracks.get(context);audio.pause();if(old)URL.revokeObjectURL(old.url);tracks.set(context,{url:URL.createObjectURL(f),name:f.name});audio.src=tracks.get(context).url;play()};panel.querySelector('[data-audio-play]').onclick=play;panel.querySelector('[data-audio-stop]').onclick=()=>{blocked=false;audio.pause();status('الصوت متوقف')}}
 parent.append(panel);panel.querySelector('.ambient-name').textContent=label;
 if(changed||!audio.src||audio.paused){audio.pause();const track=tracks.get(context);if(track){audio.src=track.url;play()}else{audio.removeAttribute('src');status('بانتظار ملف MP3 لهذا المكان؛ يمكنك اختياره من جهازك.')}}
}
function status(text){if(panel)panel.querySelector('[role=status]').textContent=text}
export async function playAmbient(){return play()}
async function play(){if(!tracks.has(context)){status('اختر ملف الصوت أولًا.');return}try{await audio.play();status('يعمل الآن: '+tracks.get(context).name)}catch{blocked=true;status('المتصفح يحتاج لمسة: اضغط تشغيل للسماح بالصوت.')}}
// Retry only blocked playback, never restart an explicitly paused track.
let blocked=false;audio.addEventListener('play',()=>blocked=false);

for(const event of ['pointerup','keydown'])document.addEventListener(event,e=>{if(blocked&&e.isTrusted&&!e.target.closest('[data-audio-stop]'))play()});
