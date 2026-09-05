import {places,itinerary,naverLinks,packing} from './data.js?v=1';
import {points,drivingRoute,dayRoute} from './routes.js?v=1';
const KEY='chotohwa-buyeo-20260906-v1';
const defaultDay=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())==='2026-09-07'?'mon':'sun';
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch{}
let state={plan:saved.plan===1?1:2,day:['sun','mon'].includes(saved.day)?saved.day:defaultDay,boatMonday:saved.boatMonday===true,done:Array.isArray(saved.done)?saved.done.filter(x=>typeof x==='string'):[],packed:Array.isArray(saved.packed)?saved.packed.filter(x=>Number.isInteger(x)):[]};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast('저장 공간을 사용할 수 없어 이번 화면에서만 유지됩니다.');}}
let timer;function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>$('#toast').classList.remove('visible'),4200);}
function mapButtons(p){if(!p.query)return '';const u=naverLinks(p.query);return `<a class="primary map-app" href="${esc(u.app)}" data-web="${esc(u.web)}">N · ${p===places.home?'첫 목적지 주차장':p.parking?'주차장 찾기':'지도에서 찾기'}</a><a class="secondary" href="${esc(u.web)}" target="_blank" rel="noopener noreferrer">웹 지도 ↗</a>`;}
function render(){
 const items=itinerary(state.plan,state.day,state.boatMonday),done=items.filter(s=>state.done.includes(s.id)).length;
 const next=items.find(s=>!state.done.includes(s.id));
 document.querySelectorAll('[data-plan]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.plan)===state.plan)));
 document.querySelectorAll('[data-day]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.day===state.day)));
 const relaxed=state.plan===1||state.boatMonday;
 $('#overview').innerHTML=`<div class="day-heading">${state.day==='sun'?(relaxed?'향로를 보고, 밤의 백제로':'박물관에서 백마강, 그리고 야경'):(relaxed?'배 타고, 부여를 한 바퀴':'대향로가 발견된 곳으로')}</div><p class="small muted">${state.day==='sun'?'09시 안산 출발 · 첫 목적지 국립부여박물관':'09시대 체크아웃 · 월요일 운영 장소 중심'}<br>시간은 예상입니다. 입장 회차·출항·교통에 맞춰 조정하세요.</p>${state.boatMonday&&state.plan===2?'<span class="badge warn">배를 월요일로 옮긴 일정</span>':''}`;
 $('#progress').textContent=`${done} / ${items.length} 완료`;
 if(next){const p=places[next.id];$('#next').innerHTML=`<div class="next-label"><span>다음 일정 · 방문 완료 기준</span><span>${next.time}</span></div><h2>${esc(p.name)}</h2><p>${esc(p.desc)}</p><div class="actions">${mapButtons(p)}<a class="secondary" href="#stop-${next.id}">상세 보기 ↓</a></div>`;}else{$('#next').innerHTML='<div class="all-done"><h2>오늘 일정, 모두 다녀왔어요.</h2><p>즐거운 기억을 챙겨요. 다른 날짜의 일정도 위에서 볼 수 있어요.</p></div>';}
 $('#route-list').innerHTML=items.filter(s=>!['home','breakfast','return','sleep','leisure','dinner','cafe'].includes(s.id)).map((s,i)=>`<a class="route-chip ${state.done.includes(s.id)?'done':''}" href="#stop-${s.id}"><b>${state.done.includes(s.id)?'✓':i+1}</b>${esc(places[s.id].short)}</a>`).join('');
 $('#full-route').href=dayRoute(state.plan,state.day,state.boatMonday);
 $('#timeline').innerHTML=items.map(s=>{const p=places[s.id],isDone=state.done.includes(s.id);return `<details class="stop ${isDone?'completed':''}" id="stop-${s.id}" ${next?.id===s.id?'open':''}><summary><span class="stop-time">${s.time}${isDone?'<br>✓ 완료':''}</span><span><span class="stop-name">${esc(p.name)}</span><span class="stop-sub">${esc(s.sub)} · ${esc(p.kind)}</span></span></summary><div class="stop-content"><p>${esc(p.desc)}</p>${p.note?`<p class="warning">${esc(p.note)}</p>`:''}${p.parking?`<div class="parking"><strong>P · 주차 안내</strong><p>${esc(p.parking)}</p></div>`:''}${p.address?`<p class="small muted">${esc(p.address)}</p>`:''}<div class="actions">${mapButtons(p)}</div>${p.query?'<p class="small muted" style="margin-top:10px">지도에서 장소·주차장 선택 후 ‘길찾기’를 눌러주세요.</p>':''}<div class="stop-links">${p.phone?`<a href="tel:${p.phone}">전화 문의</a>`:''}${p.alt?`<a href="${esc(naverLinks(p.alt).web)}" target="_blank" rel="noopener noreferrer">대체 식사 찾기 ↗</a>`:''}${p.source?`<a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">안내 출처 ↗</a>`:''}${p.address?`<button class="text-button" data-copy="${esc(p.address)}">주소 복사</button>`:''}</div><button class="complete" data-complete="${s.id}" aria-pressed="${isDone}">${isDone?'✓ 방문 완료 · 취소':'다녀왔어요 ✓'}</button></div></details>`;}).join('');
 let previous=state.day==='mon'?'resort':null;
 for(const s of items){if(!points[s.id])continue;const url=drivingRoute(previous&&previous!==s.id?[previous,s.id]:[s.id]);const actions=document.querySelector(`#stop-${s.id} .actions`);if(actions){const a=document.createElement('a');a.className='secondary';a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=previous?'이전 장소 → 여기 길찾기':'자동차 길찾기';actions.append(a);}previous=s.id;}
 $('#boat-switch').checked=state.plan===1||state.boatMonday;$('#boat-switch').disabled=state.plan===1;
 $('#boat-note').textContent=state.plan===1?'1안은 원래 월요일에 배를 타는 일정입니다.':state.boatMonday?'월요일 왕릉원 대신 유람선이 표시됩니다. 스위치를 끄면 원래 2안으로 돌아갑니다.':'일요일 출항이 어려우면 이 스위치로 변경하세요.';
 $('#packing').innerHTML=packing.map((s,i)=>`<label><input type="checkbox" data-pack="${i}" ${state.packed.includes(i)?'checked':''}><span>${s}</span></label>`).join('');
}
document.addEventListener('click',async e=>{
 const plan=e.target.closest('[data-plan]');if(plan){state.plan=Number(plan.dataset.plan);save();render();return;}
 const day=e.target.closest('[data-day]');if(day){state.day=day.dataset.day;save();render();return;}
 const complete=e.target.closest('[data-complete]');if(complete){const id=complete.dataset.complete;state.done=state.done.includes(id)?state.done.filter(x=>x!==id):[...state.done,id];save();render();const b=document.querySelector(`[data-complete="${id}"]`);b?.closest('details')?.setAttribute('open','');b?.focus({preventScroll:true});toast(state.done.includes(id)?'방문 완료! 다음 일정이 바뀌었어요.':'완료 표시를 취소했어요.');return;}
 const copy=e.target.closest('[data-copy]');if(copy){try{await navigator.clipboard.writeText(copy.dataset.copy);toast('주소를 복사했어요.');}catch{toast('주소를 길게 눌러 복사해 주세요.');}return;}
 const app=e.target.closest('.map-app');if(app){if(!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){e.preventDefault();window.open(app.dataset.web,'_blank','noopener,noreferrer');}else{toast('앱이 열리지 않으면 옆의 ‘웹 지도’를 눌러주세요.');}}
});
$('#boat-switch').addEventListener('change',e=>{state.boatMonday=e.target.checked;save();render();toast(state.boatMonday?'배를 월요일로 옮겼어요.':'일요일에 배를 타는 2안으로 돌아왔어요.');});
document.addEventListener('change',e=>{if(e.target.matches('[data-pack]')){const i=Number(e.target.dataset.pack);state.packed=e.target.checked?[...new Set([...state.packed,i])]:state.packed.filter(x=>x!==i);save();}});
$('#reset').addEventListener('click',()=>{if(window.confirm('이 기기에 저장된 방문 완료와 준비물 표시를 지울까요? 선택한 일정은 유지됩니다.')){state.done=[];state.packed=[];save();render();toast('방문·준비물 표시를 초기화했어요.');}});
render();
