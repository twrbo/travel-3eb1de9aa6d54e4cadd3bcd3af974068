// Scripts with a src attribute do not execute inline bodies; run candidate labels here.
document.querySelectorAll('.meal-grid').forEach(grid => {
  const cards = [...grid.querySelectorAll('.meal')];
  cards.forEach((card, i) => card.setAttribute('aria-label', `候選 ${i + 1} / ${cards.length}`));
});

// Keep every station chip readable against Korean platform signs: Chinese / English / Korean.
const STATION_ENGLISH = {
  '鐘路五街':'Jongno 5-ga',
  '清涼里':'Cheongnyangni',
  '首爾林':'Seoul Forest',
  '狎鷗亭羅德奧':'Apgujeong Rodeo',
  '聖水':'Seongsu',
  '弘大入口':'Hongik Univ.',
  '雲西':'Unseo',
  '仁川 T1':"Incheon Airport T1",
  '仁川機場第1航廈':"Incheon Airport T1",
  '首爾站':'Seoul Station',
  '新設洞':'Sinseol-dong',
  '鐘閣':'Jonggak',
  '乙支路入口':'Euljiro 1-ga',
  '市廳':'City Hall',
  '明洞':'Myeongdong',
  '東大門':'Dongdaemun',
  '往 首爾站':'Toward Seoul Station',
  '往 清涼里':'Toward Cheongnyangni',
  '往 往十里':'Toward Wangsimni',
  '往 往十里／水原':'Toward Wangsimni / Suwon',
  '往 東大門／清涼里':'Toward Dongdaemun / Cheongnyangni',
  '往 首爾站／仁川':'Toward Seoul Station / Incheon',
  '往 往十里／清涼里':'Toward Wangsimni / Cheongnyangni',
  '往 市廳／弘大入口':'Toward City Hall / Hongik Univ.',
  '往 市廳／乙支路入口':'Toward City Hall / Euljiro 1-ga',
  '往 新設洞':'Toward Sinseol-dong',
  '往 仁川機場 T1':'Toward Incheon Airport T1'
};

document.querySelectorAll('.station > span').forEach((stationText) => {
  const nameNode = [...stationText.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  const name = nameNode?.textContent.trim();
  const englishName = STATION_ENGLISH[name];
  if (!englishName || stationText.querySelector('.station-en')) return;

  const english = document.createElement('span');
  english.className = 'station-en';
  english.textContent = englishName;
  const korean = stationText.querySelector('small');
  stationText.insertBefore(english, korean || null);
});

// Day 3 starts with pork soup; breakfast choices are intentionally hidden.
document.querySelector('#d3 .meal-section')?.remove();

function openNaverDeepLink(deep, fallback){

  // NAVER's official mobile URL Scheme. If the app opens, the page is hidden.
  let leftPage = false;
  const onVisibility = () => {
    if(document.hidden) leftPage = true;
  };
  document.addEventListener('visibilitychange', onVisibility, {once:true});

  try{
    window.location.href = deep;
  }catch(e){}

  // If the Naver app does not open (for example, it is not installed),
  // use same-tab navigation. iOS Safari can block a delayed window.open().
  // Keeping this in the current tab makes the fallback reliable on iOS while
  // Android still opens the app normally when it handles the custom scheme.
  setTimeout(()=>{
    if(!leftPage && document.visibilityState === 'visible'){
      window.location.assign(fallback);
    }
  }, 1100);

  return false;
}

function openNaverNext(event, el){
  event.preventDefault();
  return openNaverDeepLink(el.getAttribute('href'), el.dataset.fallback);
}

function openNaverSearch(event, el){
  if(event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const fallback = el.href;
  const url = new URL(fallback);
  const query = decodeURIComponent(url.pathname.replace('/p/search/', ''));
  if(!query) return;
  event.preventDefault();
  const deep = `nmap://search?query=${encodeURIComponent(query)}&appname=https%3A%2F%2Fseoul-trip.local`;
  return openNaverDeepLink(deep, fallback);
}

// All ordinary Naver Map search links (including dynamically-rendered map pins)
// now open the installed app first. The web page is only a fallback.
document.addEventListener('click', (event) => {
  const el = event.target.closest('a[href*="map.naver.com/p/search/"]');
  if(el) openNaverSearch(event, el);
});


const maps = {};


function showCopyToast(message='已複製'){
  const t=document.getElementById('toast');
  t.textContent=message;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),1300);
}

function legacyCopy(text){
  let ok=false;
  const x=document.createElement('textarea');
  x.value=text;
  x.setAttribute('readonly','');
  x.setAttribute('aria-hidden','true');
  x.style.position='fixed';
  x.style.left='0';
  x.style.top='0';
  x.style.width='2px';
  x.style.height='2px';
  x.style.opacity='0.01';
  x.style.fontSize='16px';
  document.body.appendChild(x);
  x.focus({preventScroll:true});
  x.select();
  x.setSelectionRange(0, x.value.length);
  try { ok=document.execCommand('copy'); } catch(e) { ok=false; }
  document.body.removeChild(x);
  return ok;
}

function openCopyModal(text){
  const modal=document.getElementById('copyModal');
  const field=document.getElementById('copyField');
  field.value=text;
  modal.classList.add('show');
  setTimeout(()=>{
    field.focus({preventScroll:true});
    field.select();
    field.setSelectionRange(0, field.value.length);
  },60);
}

function closeCopyModal(){
  document.getElementById('copyModal').classList.remove('show');
}

async function copyText(button, text){
  let ok=false;

  // 1) Modern Clipboard API. Some HTML viewers expose the API even when
  // window.isSecureContext is false, so try it directly and catch rejection.
  try{
    if(navigator.clipboard && typeof navigator.clipboard.writeText==='function'){
      await navigator.clipboard.writeText(text);
      ok=true;
    }
  }catch(e){ ok=false; }

  // 2) Older Safari / Android WebView fallback.
  if(!ok) ok=legacyCopy(text);

  if(ok){
    showCopyToast('地址已複製');
    if(button){
      const old=button.textContent;
      button.textContent='已複製 ✓';
      button.disabled=true;
      setTimeout(()=>{button.textContent=old;button.disabled=false;},1100);
    }
  }else{
    // 3) Some file:// viewers intentionally block clipboard access.
    // Show a selected text box so the user can long-press Copy.
    openCopyModal(text);
  }
}

async function retryCopyFromModal(button){
  const field=document.getElementById('copyField');
  const text=field.value;
  let ok=false;
  try{
    if(navigator.clipboard && typeof navigator.clipboard.writeText==='function'){
      await navigator.clipboard.writeText(text);
      ok=true;
    }
  }catch(e){ ok=false; }
  if(!ok) ok=legacyCopy(text);

  if(ok){
    showCopyToast('地址已複製');
    closeCopyModal();
  }else{
    field.focus({preventScroll:true});
    field.select();
    field.setSelectionRange(0, field.value.length);
    if(button) button.textContent='已全選，請長按複製';
  }
}


const candidateLoadState = {};

function markerIcon(label, category='other', candidate=false){
  if(category==='hotel'){
    return L.divIcon({
      className:'',
      html:`<div class="route-marker hotel" aria-label="飯店"><span class="house">⌂</span></div>`,
      iconSize:[38,38],
      iconAnchor:[19,19]
    });
  }
  return L.divIcon({
    className:'',
    html:`<div class="route-marker ${category} ${candidate?'candidate':''}">${label}</div>`,
    iconSize:[46,34],
    iconAnchor:[23,17]
  });
}

function naverSearchUrl(query){
  return 'https://map.naver.com/p/search/' + encodeURIComponent(query);
}
function routeNaverQuery(point){
  return point.naverQuery || NAVER_POINT_QUERIES[point.name] || point.name;
}

function getGeoCache(){
  try{ return JSON.parse(localStorage.getItem('seoulV14GeoCache')||'{}'); }
  catch(e){ return {}; }
}
function saveGeoCache(cache){
  try{ localStorage.setItem('seoulV14GeoCache',JSON.stringify(cache)); }catch(e){}
}
const sleep = ms => new Promise(r=>setTimeout(r,ms));

async function geocodeCandidate(item){
  const cache=getGeoCache();
  if(cache[item.query]) return cache[item.query];

  const url='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=kr&accept-language=ko&q='+encodeURIComponent(item.query);
  try{
    const res=await fetch(url,{headers:{'Accept':'application/json'}});
    if(!res.ok) return null;
    const data=await res.json();
    if(!data || !data.length) return null;
    const pos={lat:Number(data[0].lat),lng:Number(data[0].lon)};
    if(Number.isFinite(pos.lat)&&Number.isFinite(pos.lng)){
      cache[item.query]=pos;
      saveGeoCache(cache);
      return pos;
    }
  }catch(e){}
  return null;
}

async function addCandidateMarkers(day,m,allLatLngs){
  if(candidateLoadState[day]) return;
  candidateLoadState[day]=true;
  const list=MEAL_CANDIDATES[day]||[];

  for(let i=0;i<list.length;i++){
    const item=list[i];
    const [baseLabel,choiceLabel]=String(item.label).split('-');
    const anchor=ROUTES[day].points.find(p=>String(p.label)===baseLabel);
    if(!anchor) continue;

    // Candidate pins must never depend on an external geocoder. Position each option
    // beside its primary meal point, so labels such as 3-1 / 3-2 always render.
    const group=list.filter(x=>String(x.label).split('-')[0]===baseLabel);
    const choiceIndex=Math.max(0,group.findIndex(x=>x.label===item.label));
    const angle=(-Math.PI/2)+(choiceIndex*Math.PI*2/Math.max(group.length,1));
    const radius=0.00115;
    const lat=anchor.lat + Math.sin(angle)*radius;
    const lng=anchor.lng + Math.cos(angle)*radius*1.28;

    const marker=L.marker([lat,lng],{icon:markerIcon(item.label,'food',true)}).addTo(m);
    marker.bindPopup(
      `<b>${item.label}. ${item.name}</b><br>`+
      `<span style="color:#ffb36e">三選一候選餐廳</span><br>`+
      `<span style="color:#aab3c0">標籤位置依主選餐廳附近排列；請點 Naver Map 開啟精確店址。</span><br>`+
      `<a href="${naverSearchUrl(item.query)}" target="_blank" rel="noopener" style="color:#8fdcff">Naver Map ↗</a>`
    );
    allLatLngs.push([lat,lng]);
  }

  if(allLatLngs.length>1){
    m.fitBounds(allLatLngs,{padding:[38,38],maxZoom:15});
  }
}

function initMap(day){
  if(maps[day] || !ROUTES[day] || typeof L==='undefined') return;
  const el=document.getElementById('map-'+day);
  if(!el) return;

  const m=L.map(el,{zoomControl:true,attributionControl:true});
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    maxZoom:20,
    attribution:'&copy; OpenStreetMap &copy; CARTO'
  }).addTo(m);

  const routeLatLngs=[];
  const allLatLngs=[];

  const hotelGroups={};

  ROUTES[day].points.forEach((p,i)=>{
    // A point with no verified WGS84 coordinate must never be drawn as a precise map pin.
    // Its itinerary card links to Naver's verified Place page instead.
    if(p.mapDisabled) return;
    const label=p.label || String(i+1);

    // Route line always keeps every visit, even when a hotel is visited twice.
    routeLatLngs.push([p.lat,p.lng]);
    allLatLngs.push([p.lat,p.lng]);

    // Merge repeated hotel markers at the same coordinate into one house icon.
    if(p.category==='hotel'){
      const key=`${p.lat.toFixed(5)},${p.lng.toFixed(5)}`;
      if(!hotelGroups[key]){
        hotelGroups[key]={point:p, labels:[]};
      }
      if(label) hotelGroups[key].labels.push(label);
      return;
    }

    const marker=L.marker([p.lat,p.lng],{
      icon:markerIcon(label,p.category||'other',false)
    }).addTo(m);
    const naverUrl=naverSearchUrl(routeNaverQuery(p));

    const typeText=p.category==='food'
      ? (!String(label).includes('-') ? '三選一｜主選餐廳' : '餐廳')
      : p.category==='shop' ? '逛店' : '行程點';

    marker.bindPopup(
      `<b>${label}. ${p.name}</b><br>`+
      `<span style="color:#aab3c0">${p.time||''}</span><br>`+
      `<span style="color:${p.category==='food'?'#ff9aa1':p.category==='shop'?'#80d8ff':'#aab3c0'}">${typeText}</span><br>`+
      `<a href="${naverUrl}" target="_blank" rel="noopener" style="color:#8fdcff">Naver Map ↗</a>`
    );
  });

  Object.values(hotelGroups).forEach(group=>{
    const p=group.point;
    const marker=L.marker([p.lat,p.lng],{
      icon:markerIcon('', 'hotel', false),
      zIndexOffset:650
    }).addTo(m);

    marker.bindPopup(
      `<b>⌂ ${p.name}</b><br>`+
      `<span style="color:#c9bfff">住宿點</span><br>`+
      `<span style="color:#aab3c0">飯店不列入當日行程序號</span><br>`+
      `<a href="${naverSearchUrl(routeNaverQuery(p))}" target="_blank" rel="noopener" style="color:#8fdcff">Naver Map ↗</a>`
    );
  });

  L.polyline(routeLatLngs,{color:'#8ec5ff',weight:4,opacity:.72,dashArray:'9 9'}).addTo(m);
  m.fitBounds(routeLatLngs,{padding:[35,35],maxZoom:14});
  maps[day]=m;

  setTimeout(()=>m.invalidateSize(),100);
  addCandidateMarkers(day,m,allLatLngs);
}

const tabs=[...document.querySelectorAll('.tab')];
const panels=[...document.querySelectorAll('.panel')];
function showPanel(id){
  tabs.forEach(x=>x.classList.toggle('active',x.dataset.target===id));
  panels.forEach(x=>x.classList.toggle('active',x.id===id));
  localStorage.setItem('seoulV14Tab',id);
  if(ROUTES[id]) setTimeout(()=>{initMap(id); if(maps[id]) maps[id].invalidateSize();},80);
  window.scrollTo({top:0,behavior:'smooth'});
}
tabs.forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.target)));
const saved=localStorage.getItem('seoulV14Tab');
if(saved && document.getElementById(saved)) showPanel(saved);
