
const docs = window.OT_DOCUMENTS || [];
const $ = id => document.getElementById(id);
const els = {
  search:$('searchInput'), section:$('sectionFilter'), group:$('groupFilter'),
  study:$('studyFilter'), type:$('typeFilter'), format:$('formatFilter'),
  reset:$('resetBtn'), results:$('results'), empty:$('emptyState'),
  count:$('resultCount'), mapSelect:$('mapSelect'), mapFrame:$('mapFrame'), mapOpen:$('mapOpen')
};
const clean=s=>(s||'').toString().trim();
const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

function fill(el, vals, label){
  const current=el.value;
  const u=[...new Set(vals.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es',{numeric:true}));
  el.innerHTML=`<option value="">${label}</option>`+u.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
  if(u.includes(current)) el.value=current;
}
function setupFilters(){
  fill(els.section,docs.map(d=>d.section),'Todas');
  fill(els.group,docs.map(d=>d.group),'Todos');
  fill(els.study,docs.map(d=>d.study),'Todos');
  fill(els.type,docs.map(d=>d.type),'Todos');
  fill(els.format,docs.map(d=>d.format),'Todos');
}
function filtered(){
  const q=norm(els.search.value);
  return docs.filter(d=>{
    const txt=norm([d.name,d.section,d.group,d.study,d.type,d.format].join(' '));
    return (!q||txt.includes(q))
      &&(!els.section.value||d.section===els.section.value)
      &&(!els.group.value||d.group===els.group.value)
      &&(!els.study.value||d.study===els.study.value)
      &&(!els.type.value||d.type===els.type.value)
      &&(!els.format.value||d.format===els.format.value);
  });
}
function icon(d){
  if(d.type==='Mapa') return '🗺️';
  if(d.group==='Normativa') return '⚖️';
  if(d.group==='Submodelos') return '🧩';
  if(d.group==='ZEE') return '🌿';
  return '📄';
}
function card(d){
  const previewBtn=d.type==='Mapa'
    ? `<button class="action preview" data-preview="${d.id}">🗺 Previsualizar mapa</button>`:'';
  return `<article class="card">
    <div class="card-icon">${icon(d)}</div>
    <div>
      <h3>${esc(d.name)}</h3>
      <div class="study">${esc(d.study)}</div>
      <div class="meta">
        <span class="tag">${esc(d.group)}</span>
        <span class="tag">${esc(d.type)}</span>
        <span class="tag">${esc(d.format)}</span>
      </div>
      <div class="actions">
        ${previewBtn}
        <a class="action view" href="${d.viewUrl}" target="_blank" rel="noopener">👁 Ver</a>
        <a class="action download" href="${d.downloadUrl}" target="_blank" rel="noopener">⇩ Descargar</a>
      </div>
    </div>
  </article>`;
}
function render(){
  const items=filtered();
  els.count.textContent=items.length;
  els.results.innerHTML=items.map(card).join('');
  els.empty.hidden=items.length!==0;
  els.results.hidden=items.length===0;
  document.querySelectorAll('[data-preview]').forEach(btn=>btn.addEventListener('click',()=>{
    const d=docs.find(x=>x.id===Number(btn.dataset.preview));
    if(d){ setMap(d.id); document.querySelector('.map-viewer').scrollIntoView({behavior:'smooth',block:'start'}); }
  }));
}
function setupMap(){
  const maps=docs.filter(d=>d.type==='Mapa');
  els.mapSelect.innerHTML=maps.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('');
  if(maps.length) setMap(maps[0].id);
  els.mapSelect.addEventListener('change',()=>setMap(Number(els.mapSelect.value)));
}
function setMap(id){
  const d=docs.find(x=>x.id===id && x.type==='Mapa');
  if(!d)return;
  els.mapSelect.value=String(d.id);
  els.mapFrame.src=d.previewUrl;
  els.mapOpen.href=d.viewUrl;
}
function preset(name){
  els.search.value=''; els.section.value=''; els.group.value=''; els.study.value=''; els.type.value=''; els.format.value='';
  if(name==='normativa') els.section.value='Marco Normativo';
  if(name==='zee') els.group.value='ZEE';
  if(name==='submodelos') els.group.value='Submodelos';
  if(name==='tematicos') els.group.value='Temáticos - Físico'; // then broaden via search token below
  if(name==='mapas') els.type.value='Mapa';
  if(name==='tematicos'){ els.group.value=''; els.search.value='Memoria'; }
  render();
}
function init(){
  setupFilters();
  $('heroTotal').textContent=docs.length;
  $('kpiTotal').textContent=docs.length;
  $('kpiNorm').textContent=docs.filter(d=>d.section==='Marco Normativo').length;
  $('kpiDocs').textContent=docs.filter(d=>d.type==='Documento').length;
  $('kpiMaps').textContent=docs.filter(d=>d.type==='Mapa').length;
  [els.search,els.section,els.group,els.study,els.type,els.format].forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',render));
  els.reset.addEventListener('click',()=>{els.search.value='';els.section.value='';els.group.value='';els.study.value='';els.type.value='';els.format.value='';render();});
  document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>preset(b.dataset.preset)));
  document.querySelectorAll('.switch').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.switch').forEach(x=>x.classList.remove('active')); btn.classList.add('active');
    els.results.classList.toggle('cards-view',btn.dataset.view==='cards');
    els.results.classList.toggle('list-view',btn.dataset.view==='list');
  }));
  setupMap();
  render();
}
init();
