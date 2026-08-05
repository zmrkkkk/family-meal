// 家庭点菜 v11 — 单文件云同步 · 无价格 · Emoji图标
const G='zmrkkkk',R='family-meal';
let T='',M=[],C=[],P=[],O=[],cart=[],cur='all',sr='',cm='d',nextId=1000,tDI='',tMA='',_dirty=false,_saving=false;

function gT(){T=localStorage.getItem('fm_tk')||'';return T;}
function svTk(){const v=document.getElementById('tkInput').value.trim();if(!v){toast('请输入Token');return;}localStorage.setItem('fm_tk',v);T=v;document.getElementById('tkModal').classList.remove('open');ld();}

async function ld(){
  sS('⏳');
  try{const r=await fetch(`https://${G}.github.io/${R}/data.json?t=${Date.now()}`);if(r.ok){const d=await r.json();M=d.menu||[];C=d.cats||[];P=d.mems||[];O=d.orders||[];}}catch(e){}
  let mx=0;M.forEach(d=>{if(d.id>mx)mx=d.id;});nextId=mx>=999?mx+1:1000;
  lc();cart=cart.filter(c=>M.some(d=>d.id===c.id));sc();
  rA();sS(M.length>0?'✅ '+M.length+'道菜':'');_dirty=false;
}
async function sv(){
  if(!T||_saving||!_dirty)return;_saving=true;sS('⏳');
  const json=JSON.stringify({menu:M,cats:C,mems:P,orders:O});
  const bytes=new TextEncoder().encode(json);
  const bin=Array.from(bytes).map(b=>String.fromCharCode(b)).join('');
  const content=btoa(bin);
  try{
    let sha='';try{const cur=await gh('https://api.github.com/repos/'+G+'/'+R+'/contents/data.json');sha=cur.sha;}catch(e){}
    await gh('https://api.github.com/repos/'+G+'/'+R+'/contents/data.json',{method:'PUT',body:JSON.stringify({message:'update',content,sha:sha||undefined})});
    sS('✅ '+M.length+'道菜');_dirty=false;
  }catch(e){sS('⚠️');console.error(e);}
  _saving=false;
}
async function gh(url,opts={}){const r=await fetch(url,{...opts,headers:{...opts.headers,Authorization:'Bearer '+T,Accept:'application/vnd.github+json'}});if(!r.ok)throw new Error(r.status);return r.json();}
function mark(){_dirty=true;saveCart();clearTimeout(mark._t);mark._t=setTimeout(()=>sv(),600);}
function sS(m){const el=document.getElementById('ss');if(el)el.textContent=m;}
async function syncNow(){sS('⏳');await ld();toast('🔄 已刷新');}

async function init(){if(!gT()){document.getElementById('tkModal').classList.add('open');return;}await ld();}
function rA(){rMS();rCN();rMG();rCB();rCP();rH();rMD();rMC();rMM();}

function lc(){try{cart=JSON.parse(localStorage.getItem('fm_cart')||'[]');}catch(e){cart=[];}}
function sc(){localStorage.setItem('fm_cart',JSON.stringify(cart));}
function saveCart(){sc();}

function rMS(){const s=document.getElementById('ms'),v=s.value;s.innerHTML='<option value="">-- 选择家人 --</option>'+P.filter(m=>m.name).map(m=>`<option value="${esc(m.name)}">${esc(m.name)}</option>`).join('');if(P.some(m=>m.name===v))s.value=v;oMC();}
function oMC(){const m=P.find(x=>x.name===document.getElementById('ms').value);document.getElementById('ma').innerHTML=m&&m.a?`<img src="${m.a}">`:'👤';}
function rCN(){document.getElementById('cn').innerHTML='<button class="cat-btn active" data-cat="all">🔥 全部</button>'+C.map(c=>`<button class="cat-btn" data-cat="${esc(c.name)}">${c.emoji||'📂'} ${esc(c.name)}</button>`).join('');}
function rMG(){const g=document.getElementById('mg');let d=M;if(cur!=='all')d=d.filter(x=>x.c===cur);if(sr){const k=sr.toLowerCase();d=d.filter(x=>(x.n||'').toLowerCase().includes(k));}if(!d.length){g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-light);"><p style="font-size:3rem;">🔍</p><p>没有找到</p></div>';return;}const bs=['#fef5e7','#fdecea','#edf7f0','#e8f4fd','#fdf2f8','#f5f0e8','#e8f8f5','#fef9e7'];g.innerHTML=d.map(dd=>{const ic=cart.find(c=>c.id===dd.id),q=ic?ic.q:0;const emoji=dd.img?'':(dd.e||'🍽️');return`<div class="menu-card"><div class="menu-card-img" style="${dd.img?'':'background:'+bs[Math.abs(dd.id)%bs.length]}">${dd.img?`<img src="${dd.img}" loading="lazy">`:emoji}</div><div class="menu-card-body"><div class="menu-card-name">${esc(dd.n)}</div><div class="menu-card-desc">${esc(dd.d)}</div><div class="menu-card-footer">${q>0?`<div class="menu-card-qty"><button onclick="event.stopPropagation();cQ(${dd.id},-1)">−</button><span class="qty-num">${q}</span><button onclick="event.stopPropagation();cQ(${dd.id},1)">+</button></div>`:`<button class="menu-card-add" onclick="event.stopPropagation();aT(${dd.id})">+</button>`}</div></div></div>`;}).join('');}
function fM(){sr=document.getElementById('si').value.trim();rMG();}

function aT(id){const d=M.find(x=>x.id===id);if(!d)return;const m=document.getElementById('ms').value;if(!m){toast('⚠️ 请选择点菜人');return;}const ex=cart.find(c=>c.id===id&&c.m===m);if(ex)ex.q++;else cart.push({id,name:d.n,emoji:d.e,img:d.img||'',q:1,m});sc();rMG();rCB();rCP();}
function cQ(id,d){const m=document.getElementById('ms').value,it=cart.find(c=>c.id===id&&c.m===m);if(!it)return;it.q+=d;if(it.q<=0)cart=cart.filter(c=>!(c.id===id&&c.m===m));sc();rMG();rCB();rCP();}
function cCQ(id,mb,d){const it=cart.find(c=>c.id===id&&c.m===mb);if(!it)return;it.q+=d;if(it.q<=0)cart=cart.filter(c=>!(c.id===id&&c.m===mb));sc();rMG();rCB();rCP();}
function tC(){return cart.reduce((s,c)=>s+c.q,0);}
function rCB(){const c=tC(),b=document.getElementById('cb');b.textContent=c;b.style.display=c>0?'flex':'none';}
function togC(){const p=document.getElementById('cp'),o=document.getElementById('co');if(p.classList.contains('open'))lC();else{rCP();o.classList.add('open');p.classList.add('open');}}
function lC(){document.getElementById('co').classList.remove('open');document.getElementById('cp').classList.remove('open');}
function rCP(){const l=document.getElementById('cl'),e=document.getElementById('ce'),f=document.getElementById('cf');if(!cart.length){l.innerHTML='';l.style.display='none';e.style.display='flex';f.classList.remove('show');}else{l.style.display='block';e.style.display='none';f.classList.add('show');l.innerHTML=cart.map(c=>`<div class="cart-item"><div class="cart-item-img">${c.img?`<img src="${c.img}">`:c.emoji||'🍽️'}</div><div class="cart-item-info"><div class="cart-item-name">${esc(c.name)}</div><div class="cart-item-member">👤 ${esc(c.m)}</div></div><div class="cart-item-qty"><button onclick="cCQ(${c.id},'${escJs(c.m)}',-1)">−</button><span>${c.q}</span><button onclick="cCQ(${c.id},'${escJs(c.m)}',1)">+</button></div></div>`).join('');}document.getElementById('cc').textContent=tC();document.getElementById('ct').textContent='';}

function sO(){if(!cart.length){toast('⚠️ 购物车空');return;}const g={};cart.forEach(c=>{if(!g[c.m])g[c.m]=[];g[c.m].push(c);});let h='';for(const[m,items]of Object.entries(g)){h+=`<p style="font-weight:600;margin:12px 0 4px;">👤 ${esc(m)}</p><ul class="confirm-list">`;items.forEach(c=>{h+=`<li><span class="dish-info"><span class="confirm-item-img">${c.img?`<img src="${c.img}">`:c.emoji||'🍽️'}</span>${esc(c.name)} ×${c.q}</span></li>`;});h+='</ul>';}document.getElementById('cmb').innerHTML=h;document.getElementById('com').classList.add('open');}
function lM(){document.getElementById('com').classList.remove('open');}
async function cO(){const n=document.getElementById('cnn').value.trim();O.unshift({id:Date.now(),time:new Date().toLocaleString('zh-CN'),items:[...cart],note:n});cart=[];document.getElementById('cnn').value='';sc();lC();lM();rCB();rCP();rH();mark();toast('🎉 下单成功');}
function rH(){const l=document.getElementById('hl');if(!O.length){l.innerHTML='<div class="history-empty"><p>📋</p><p>暂无订单</p></div>';return;}l.innerHTML=O.map(o=>{const t=(o.items||[]).map(c=>`<span class="history-tag">${c.img?'🖼️':c.emoji||'🍽️'} ${esc(c.name)}×${c.q}</span>`).join(''),ms=[...new Set((o.items||[]).map(c=>c.m))].join('、');return`<div class="history-card"><div class="history-card-header"><span>📅 ${o.time}</span><span>👤 ${esc(ms)}</span></div><div class="history-card-dishes">${t}</div>${o.note?`<div class="order-note">📝 ${esc(o.note)}</div>`:''}</div>`;}).join('');}
async function clH(){if(!O.length)return;if(!confirm('清空全部订单？'))return;O=[];mark();rH();toast('🗑️');}

function sT(t){document.querySelectorAll('#mainApp .tab').forEach(x=>x.classList.remove('active'));document.getElementById(t+'Tab')?.classList.add('active');document.querySelectorAll('.btn-icon').forEach(b=>b.classList.remove('active-nav'));if(t==='manage'){document.getElementById('btnM')?.classList.add('active-nav');rMD();rMC();rMM();}if(t==='history'){document.getElementById('btnH')?.classList.add('active-nav');rH();}window.scrollTo({top:0,behavior:'smooth'});}

function rMD(){const l=document.getElementById('mdl');document.getElementById('dc').textContent=`共 ${M.length} 道菜`;if(!M.length){l.innerHTML='<div class="history-empty"><p>🍽️</p><p>暂无菜品</p></div>';return;}const g={};M.forEach(d=>{if(!g[d.c])g[d.c]=[];g[d.c].push(d);});let h='';for(const[c,ds]of Object.entries(g)){const ce=(C.find(x=>x.name===c)||{}).emoji||'📂';h+=`<p style="font-weight:700;margin:16px 0 6px;font-size:0.9rem;color:var(--text-light);">${ce} ${esc(c)} (${ds.length})</p>`;ds.forEach(d=>{h+=`<div class="manage-dish-item"><div class="manage-dish-thumb">${d.img?`<img src="${d.img}">`:d.e||'🍽️'}</div><div class="manage-dish-info"><div class="manage-dish-name">${esc(d.n)}</div><div class="manage-dish-meta"><span class="cat-tag">${esc(d.c)}</span>${esc(d.d)}</div></div><div class="manage-dish-actions"><button class="btn-icon-sm" onclick="oD(${d.id})">✏️</button><button class="btn-icon-sm danger" onclick="delD(${d.id})">🗑️</button></div></div>`;});}l.innerHTML=h;}
function rMC(){const l=document.getElementById('mcl');if(!C.length){l.innerHTML='<div class="history-empty"><p>📂</p><p>暂无分类</p></div>';return;}l.innerHTML=C.map(c=>`<div class="manage-cat-item"><div class="manage-cat-emoji">${esc(c.emoji||'📂')}</div><div class="manage-cat-info"><div class="manage-cat-name">${esc(c.name)}</div><div class="manage-cat-count">${M.filter(d=>d.c===c.name).length} 道</div></div><div class="manage-cat-actions"><button class="btn-icon-sm" onclick="oC('${escJs(c.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="delC('${escJs(c.name)}')">🗑️</button></div></div>`).join('');}
function rMM(){const l=document.getElementById('mml');if(!P.length){l.innerHTML='<div class="history-empty"><p>👨‍👩‍👧‍👦</p><p>暂无家人</p></div>';return;}const av=['👨','👩','👴','👵','👦','👧','🧑','👶','🧒'];l.innerHTML=P.map((m,i)=>`<div class="manage-member-item"><div class="manage-member-avatar">${m.a?`<img src="${m.a}">`:av[i%av.length]}</div><div class="manage-member-name">${esc(m.name)}</div><div class="manage-member-actions"><button class="btn-icon-sm" onclick="oM('${escJs(m.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="delM('${escJs(m.name)}')">🗑️</button></div></div>`).join('');}

function ci(f,mw,mh,q){return new Promise((r,j)=>{if(!f.type.startsWith('image/'))return j(new Error('非图片'));const fr=new FileReader();fr.onload=e=>{const img=new Image();img.onload=()=>{let w=img.width,h=img.height;if(w>mw){h*=mw/w;w=mw;}if(h>mh){w*=mh/h;h=mh;}const c=document.createElement('canvas');c.width=Math.round(w);c.height=Math.round(h);c.getContext('2d').drawImage(img,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',q));};img.onerror=()=>j(new Error('失败'));img.src=e.target.result;};fr.onerror=()=>j(new Error('失败'));fr.readAsDataURL(f);});}

function oD(id){tDI='';document.getElementById('dcat').innerHTML=C.map(c=>`<option value="${esc(c.name)}">${c.emoji||'📂'} ${esc(c.name)}</option>`).join('');if(id){const d=M.find(x=>x.id===id);if(!d)return;document.getElementById('dt').textContent='✏️ 编辑菜品';document.getElementById('di').value=d.id;document.getElementById('dn').value=d.n;document.getElementById('dcat').value=d.c;document.getElementById('dde').value=d.d;if(d.img){tDI=d.img;document.getElementById('dp').innerHTML=`<img src="${d.img}">`;document.getElementById('dp').classList.add('has-image');document.getElementById('dcb').style.display='inline-block';}else clD();}else{document.getElementById('dt').textContent='🍽️ 添加菜品';document.getElementById('di').value='';document.getElementById('dn').value='';document.getElementById('dde').value='';document.getElementById('dcat').value=C[0]?.name||'';clD();}document.getElementById('dm').classList.add('open');}
async function hD(e){const f=e.target.files[0];if(!f)return;try{tDI=await ci(f,400,300,0.7);document.getElementById('dp').innerHTML=`<img src="${tDI}">`;document.getElementById('dp').classList.add('has-image');document.getElementById('dcb').style.display='inline-block';}catch(er){toast('⚠️ '+er.message);}e.target.value='';}
function clD(){document.getElementById('dp').innerHTML='<span class="image-placeholder">🥘</span>';document.getElementById('dp').classList.remove('has-image');document.getElementById('dcb').style.display='none';tDI='';}
function clDM(){document.getElementById('dm').classList.remove('open');}
async function sD(){const id=document.getElementById('di').value,n=document.getElementById('dn').value.trim(),cat=document.getElementById('dcat').value,desc=document.getElementById('dde').value.trim();if(!n){toast('⚠️ 请输入菜名');return;}if(!cat){toast('⚠️ 请选择分类');return;}if(id){const d=M.find(x=>x.id===parseInt(id));d.n=n;d.c=cat;d.d=desc||n;d.img=tDI;}else{M.push({id:nextId++,n,cat,e:'🍽️',img:tDI,d:desc||n});}mark();clDM();rMG();rCN();rMD();toast('✅ 已保存');}
async function delD(id){const d=M.find(x=>x.id===id);if(!d||!confirm(`删除「${d.n}」？`))return;M=M.filter(x=>x.id!==id);cart=cart.filter(c=>c.id!==id);sc();mark();rMG();rCN();rMD();rCB();rCP();toast('🗑️');}

function oC(on){if(on){const c=C.find(x=>x.name===on);if(!c)return;document.getElementById('catt').textContent='✏️ 编辑分类';document.getElementById('coid').value=on;document.getElementById('cnm').value=on;document.getElementById('cem').value=c.emoji||'';}else{document.getElementById('catt').textContent='📂 添加分类';document.getElementById('coid').value='';document.getElementById('cnm').value='';document.getElementById('cem').value='';}document.getElementById('catm').classList.add('open');}
function clCM(){document.getElementById('catm').classList.remove('open');}
async function sC(){const on=document.getElementById('coid').value.trim(),nn=document.getElementById('cnm').value.trim(),em=document.getElementById('cem').value.trim();if(!nn){toast('⚠️ 请输入名称');return;}if(on){if(on!==nn&&C.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}const c=C.find(x=>x.name===on);c.name=nn;c.emoji=em||'📂';M.forEach(d=>{if(d.c===on)d.c=nn;});}else{if(C.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}C.push({name:nn,emoji:em||'📂'});}mark();clCM();rMC();rMD();rMG();rCN();toast('✅ 已保存');}
async function delC(n){if(!confirm(`删除分类「${n}」？`))return;const fb=C.find(x=>x.name!==n)?.name||'';M.forEach(d=>{if(d.c===n)d.c=fb;});C=C.filter(c=>c.name!==n);mark();rMC();rMD();rMG();rCN();toast('🗑️');}

function oM(on){tMA='';if(on){const m=P.find(x=>x.name===on);if(!m)return;document.getElementById('memt').textContent='✏️ 编辑家人';document.getElementById('moid').value=on;document.getElementById('mnm').value=on;if(m.a){tMA=m.a;document.getElementById('map').innerHTML=`<img src="${m.a}">`;document.getElementById('map').classList.add('has-image');document.getElementById('mab').style.display='inline-block';}else clM();}else{document.getElementById('memt').textContent='👤 添加家人';document.getElementById('moid').value='';document.getElementById('mnm').value='';clM();}document.getElementById('memm').classList.add('open');}
async function hM(e){const f=e.target.files[0];if(!f)return;try{tMA=await ci(f,200,200,0.7);document.getElementById('map').innerHTML=`<img src="${tMA}">`;document.getElementById('map').classList.add('has-image');document.getElementById('mab').style.display='inline-block';}catch(er){toast('⚠️ '+er.message);}e.target.value='';}
function clM(){document.getElementById('map').innerHTML='<span class="avatar-placeholder">👤</span>';document.getElementById('map').classList.remove('has-image');document.getElementById('mab').style.display='none';tMA='';}
function clMM(){document.getElementById('memm').classList.remove('open');}
async function sM(){const on=document.getElementById('moid').value.trim(),nn=document.getElementById('mnm').value.trim();if(!nn){toast('⚠️ 请输入称呼');return;}if(on){const i=P.findIndex(x=>x.name===on);if(on!==nn&&P.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}if(i>=0){P[i].name=nn;P[i].a=tMA;}cart.forEach(c=>{if(c.m===on)c.m=nn;});sc();}else{if(P.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}P.push({name:nn,a:tMA});}mark();clMM();rMM();rMS();rCP();toast('✅ 已保存');}
async function delM(n){if(!confirm(`删除「${n}」？`))return;P=P.filter(m=>m.name!==n);cart=cart.filter(c=>c.m!==n);sc();mark();rMM();rMS();rCB();rCP();toast('🗑️');}

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2000);}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
function escJs(s){return(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('cn').addEventListener('click',e=>{const b=e.target.closest('.cat-btn');if(!b)return;document.querySelectorAll('#cn .cat-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');cur=b.dataset.cat;rMG();});
  document.getElementById('mn').addEventListener('click',e=>{const b=e.target.closest('.subnav-btn');if(!b)return;document.querySelectorAll('#mn .subnav-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');cm=b.dataset.m;document.querySelectorAll('.manage-panel').forEach(p=>p.classList.remove('active'));document.getElementById('mp'+cm.toUpperCase())?.classList.add('active');if(cm==='d')rMD();if(cm==='c')rMC();if(cm==='m')rMM();});
  init();
  setInterval(()=>{if(!document.hidden)ld();},60000);
});
