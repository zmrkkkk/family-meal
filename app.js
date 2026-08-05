// 家庭点菜 — GitHub云同步 v9
// 读: GitHub Pages (国内可访问)
// 写: GitHub API   (国内可访问)
const DC=[{name:'凉菜',emoji:'🧊'},{name:'热菜',emoji:'🍳'},{name:'汤类',emoji:'🍲'},{name:'主食',emoji:'🍚'},{name:'饮品',emoji:'🥤'}];
const DM=[{name:'爸爸',a:''},{name:'妈妈',a:''},{name:'爷爷',a:''},{name:'奶奶',a:''},{name:'大宝',a:''},{name:'小宝',a:''}];
const DD=[{id:1,n:'拍黄瓜',c:'凉菜',p:12,e:'🥒',img:'',d:'清爽脆嫩'},{id:2,n:'凉拌木耳',c:'凉菜',p:15,e:'🍄',img:'',d:'爽口开胃'},{id:3,n:'皮蛋豆腐',c:'凉菜',p:14,e:'🥚',img:'',d:'嫩滑豆腐'},{id:4,n:'口水鸡',c:'凉菜',p:28,e:'🍗',img:'',d:'麻辣鲜香'},{id:5,n:'酱牛肉',c:'凉菜',p:32,e:'🥩',img:'',d:'酱香浓郁'},{id:6,n:'糖拌西红柿',c:'凉菜',p:10,e:'🍅',img:'',d:'酸甜清爽'},{id:7,n:'红烧排骨',c:'热菜',p:38,e:'🦴',img:'',d:'软烂入味'},{id:8,n:'鱼香肉丝',c:'热菜',p:26,e:'🐟',img:'',d:'酸甜微辣'},{id:9,n:'宫保鸡丁',c:'热菜',p:28,e:'🐔',img:'',d:'花生脆香'},{id:10,n:'糖醋里脊',c:'热菜',p:30,e:'🍖',img:'',d:'外酥里嫩'},{id:11,n:'麻婆豆腐',c:'热菜',p:18,e:'🧈',img:'',d:'麻辣下饭'},{id:12,n:'清炒时蔬',c:'热菜',p:16,e:'🥬',img:'',d:'清淡健康'},{id:13,n:'回锅肉',c:'热菜',p:28,e:'🥓',img:'',d:'肥而不腻'},{id:14,n:'干煸四季豆',c:'热菜',p:18,e:'🫘',img:'',d:'干香微辣'},{id:15,n:'番茄炒蛋',c:'热菜',p:15,e:'🍳',img:'',d:'国民家常'},{id:16,n:'番茄蛋花汤',c:'汤类',p:12,e:'🥣',img:'',d:'清淡鲜美'},{id:17,n:'酸辣汤',c:'汤类',p:14,e:'🌶️',img:'',d:'酸辣开胃'},{id:18,n:'排骨玉米汤',c:'汤类',p:25,e:'🌽',img:'',d:'清甜滋补'},{id:19,n:'紫菜蛋花汤',c:'汤类',p:10,e:'🫧',img:'',d:'简单鲜美'},{id:20,n:'白米饭',c:'主食',p:3,e:'🍚',img:'',d:'香喷喷'},{id:21,n:'蛋炒饭',c:'主食',p:12,e:'🍛',img:'',d:'粒粒分明'},{id:22,n:'手工水饺',c:'主食',p:22,e:'🥟',img:'',d:'皮薄馅大'},{id:23,n:'番茄鸡蛋面',c:'主食',p:14,e:'🍜',img:'',d:'家常味'},{id:24,n:'馒头',c:'主食',p:2,e:'🥖',img:'',d:'松软'},{id:25,n:'可乐',c:'饮品',p:5,e:'🥤',img:'',d:'冰爽'},{id:26,n:'雪碧',c:'饮品',p:5,e:'🧊',img:'',d:'清爽'},{id:27,n:'橙汁',c:'饮品',p:8,e:'🍊',img:'',d:'鲜榨'},{id:28,n:'王老吉',c:'饮品',p:6,e:'🫖',img:'',d:'怕上火'},{id:29,n:'酸梅汤',c:'饮品',p:5,e:'🫗',img:'',d:'消暑'}];

let M=[],C=[],P=[],O=[],cart=[],cur='all',sr='',cm='d',nextId=1000,tDI='',tMA='';
let ghU='',ghR='',ghT='',famPw='';

// === 配置 ===
function gCfg(){try{return JSON.parse(localStorage.getItem('fm_gh'));}catch(e){return null;}}
function svCfg(u,r,t,p){localStorage.setItem('fm_gh',JSON.stringify({u,r,t,p}));ghU=u;ghR=r;ghT=t;famPw=p;}
function initCfg(){const c=gCfg();if(!c){document.getElementById('cfgBox').style.display='block';document.getElementById('lockNew').style.display='block';document.getElementById('lockEnter').style.display='none';document.getElementById('lockBtn').textContent='🔒 设置并进入';return false;}ghU=c.u;ghR=c.r;ghT=c.t;famPw=c.p;document.getElementById('cfgBox').style.display='none';document.getElementById('lockNew').style.display='none';document.getElementById('lockEnter').style.display='block';document.getElementById('lockBtn').textContent='🔓 解锁';document.getElementById('shareBtn').style.display='block';return true;}

// === 锁屏 ===
async function hL(){
  const cfg=gCfg();
  const u=document.getElementById('cfgUser').value.trim(),r=document.getElementById('cfgRepo').value.trim(),t=document.getElementById('cfgToken').value.trim();
  if(!cfg&&u&&r&&t){
    const p1=document.getElementById('pin1').value.trim(),p2=document.getElementById('pin2').value.trim();
    if(!p1)return;if(p1!==p2){e('两次密码不一致');return;}
    svCfg(u,r,t,p1);await initData();return;
  }
  if(!cfg){e('请填写 GitHub 配置');return;}
  const p3=document.getElementById('pin3').value.trim();
  if(p3!==famPw){e('密码错误');return;}
  await initData();
}
function e(m){const el=document.getElementById('cfgErr');el.textContent=m;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),3000);}
async function initData(){
  document.getElementById('cfgErr').classList.remove('show');
  ss('mainScreen');sl('⏳ 加载中...');
  M=await load('menu')||dCp(DD);C=await load('cats')||dCp(DC);P=await load('mems')||dCp(DM);O=await load('orders')||[];
  let mx=0;M.forEach(d=>{if(d.id>mx)mx=d.id;});nextId=mx>=999?mx+1:1000;
  const ids=new Set(M.map(d=>d.id));lc();cart=cart.filter(c=>ids.has(c.id));sc();
  rA();sl('✅ 已加载('+M.length+'菜)');bE();
}
function dCp(o){return JSON.parse(JSON.stringify(o));}
async function load(k){const url=`https://${ghU}.github.io/${ghR}/data/${k}.json?t=${Date.now()}`;try{const r=await fetch(url);if(!r.ok)return null;return await r.json();}catch(e){return null;}}
async function save(k,data){if(!ghT)return false;const path=`/repos/${ghU}/${ghR}/contents/data/${k}.json`;try{let sha='';try{const curr=await ghAPI(path);sha=curr.sha;}catch(e){}const json=JSON.stringify(data);const bytes=new TextEncoder().encode(json);const bin=Array.from(bytes).map(b=>String.fromCharCode(b)).join('');const content=btoa(bin);const body={message:'update '+k,content};if(sha)body.sha=sha;await ghAPI(path,{method:'PUT',body:JSON.stringify(body)});return true;}catch(e){console.error('save error:',e);return false;}}
async function ghAPI(path,opts={}){const r=await fetch('https://api.github.com'+path,{...opts,headers:{...opts.headers,Authorization:'Bearer '+ghT,'Accept':'application/vnd.github+json'}});if(!r.ok)throw new Error(r.status+' '+r.statusText);return r.json();}
async function saveAll(){sl('⏳ 保存中...');const r=await Promise.all([save('menu',M),save('cats',C),save('mems',P),save('orders',O)]);sl(r.every(x=>x)?'✅ 已同步':'⚠️ 保存失败');}

// === 渲染 ===
function ss(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id)?.classList.add('active');}
function sl(m){document.getElementById('ss').textContent=m;}
function rA(){rMS();rCN();rMG();rCB();rCP();rH();rMD();rMC();rMM();}
function lc(){try{cart=JSON.parse(localStorage.getItem('fm_cart')||'[]');}catch(e){cart=[];}}
function sc(){localStorage.setItem('fm_cart',JSON.stringify(cart));}
function rMS(){const s=document.getElementById('ms'),v=s.value;s.innerHTML='<option value="">-- 选择家人 --</option>'+P.filter(m=>m.name).map(m=>`<option value="${esc(m.name)}">${esc(m.name)}</option>`).join('');if(P.some(m=>m.name===v))s.value=v;oMC();}
function oMC(){const m=P.find(x=>x.name===document.getElementById('ms').value);document.getElementById('ma').innerHTML=m&&m.a?`<img src="${m.a}">`:'👤';}
function rCN(){document.getElementById('cn').innerHTML='<button class="cat-btn active" data-cat="all">🔥 全部</button>'+C.map(c=>`<button class="cat-btn" data-cat="${esc(c.name)}">${c.emoji} ${esc(c.name)}</button>`).join('');}
function rMG(){const g=document.getElementById('mg');let d=M;if(cur!=='all')d=d.filter(x=>x.c===cur);if(sr){const k=sr.toLowerCase();d=d.filter(x=>(x.n||'').toLowerCase().includes(k));}if(!d.length){g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-light);"><p style="font-size:3rem;">🔍</p><p>没有找到</p></div>';return;}const bs=['#fef5e7','#fdecea','#edf7f0','#e8f4fd','#fdf2f8','#f5f0e8','#e8f8f5','#fef9e7'];g.innerHTML=d.map(dd=>{const ic=cart.find(c=>c.id===dd.id),q=ic?ic.q:0;return`<div class="menu-card"><div class="menu-card-img" style="${dd.img?'':'background:'+bs[Math.abs(dd.id)%bs.length]}">${dd.img?`<img src="${dd.img}" loading="lazy">`:dd.e||'🍽️'}</div><div class="menu-card-body"><div class="menu-card-name">${esc(dd.n)}</div><div class="menu-card-desc">${esc(dd.d)}</div><div class="menu-card-footer"><div class="menu-card-price"><span class="unit">¥</span>${dd.p}</div>${q>0?`<div class="menu-card-qty"><button onclick="event.stopPropagation();cQ(${dd.id},-1)">−</button><span class="qty-num">${q}</span><button onclick="event.stopPropagation();cQ(${dd.id},1)">+</button></div>`:`<button class="menu-card-add" onclick="event.stopPropagation();aT(${dd.id})">+</button>`}</div></div></div>`;}).join('');}
function fM(){sr=document.getElementById('si').value.trim();rMG();}

// === 购物车 ===
function aT(id){const d=M.find(x=>x.id===id);if(!d)return;const m=document.getElementById('ms').value;if(!m){toast('⚠️ 请选点菜人');return;}const ex=cart.find(c=>c.id===id&&c.m===m);if(ex)ex.q++;else cart.push({id,name:d.n,price:d.p,emoji:d.e,img:d.img||'',q:1,m});sc();rMG();rCB();rCP();}
function cQ(id,d){const m=document.getElementById('ms').value,it=cart.find(c=>c.id===id&&c.m===m);if(!it)return;it.q+=d;if(it.q<=0)cart=cart.filter(c=>!(c.id===id&&c.m===m));sc();rMG();rCB();rCP();}
function cCQ(id,mb,d){const it=cart.find(c=>c.id===id&&c.m===mb);if(!it)return;it.q+=d;if(it.q<=0)cart=cart.filter(c=>!(c.id===id&&c.m===mb));sc();rMG();rCB();rCP();}
function tC(){return cart.reduce((s,c)=>s+c.q,0);}
function tP(){return cart.reduce((s,c)=>s+c.price*c.q,0);}
function rCB(){const c=tC(),b=document.getElementById('cb');b.textContent=c;b.style.display=c>0?'flex':'none';}
function togC(){const p=document.getElementById('cp'),o=document.getElementById('co');if(p.classList.contains('open'))lC();else{rCP();o.classList.add('open');p.classList.add('open');}}
function lC(){document.getElementById('co').classList.remove('open');document.getElementById('cp').classList.remove('open');}
function rCP(){const l=document.getElementById('cl'),e=document.getElementById('ce'),f=document.getElementById('cf');if(!cart.length){l.innerHTML='';l.style.display='none';e.style.display='flex';f.classList.remove('show');}else{l.style.display='block';e.style.display='none';f.classList.add('show');l.innerHTML=cart.map(c=>`<div class="cart-item"><div class="cart-item-img">${c.img?`<img src="${c.img}">`:c.emoji||'🍽️'}</div><div class="cart-item-info"><div class="cart-item-name">${esc(c.name)}</div><div class="cart-item-member">👤 ${esc(c.m)}</div><div class="cart-item-price">¥${c.price*c.q}</div></div><div class="cart-item-qty"><button onclick="cCQ(${c.id},'${escJs(c.m)}',-1)">−</button><span>${c.q}</span><button onclick="cCQ(${c.id},'${escJs(c.m)}',1)">+</button></div></div>`).join('');}document.getElementById('cc').textContent=tC();document.getElementById('ct').textContent=tP();}

// === 订单 ===
function sO(){if(!cart.length){toast('⚠️ 购物车空');return;}const g={};cart.forEach(c=>{if(!g[c.m])g[c.m]=[];g[c.m].push(c);});let h='';for(const[m,items]of Object.entries(g)){h+=`<p style="font-weight:600;margin:12px 0 4px;">👤 ${esc(m)}</p><ul class="confirm-list">`;items.forEach(c=>{h+=`<li><span class="dish-info"><span class="confirm-item-img">${c.img?`<img src="${c.img}">`:c.emoji||'🍽️'}</span>${esc(c.name)} ×${c.q}</span><span style="color:var(--primary);font-weight:600;">¥${c.price*c.q}</span></li>`;});h+='</ul>';}h+=`<div class="confirm-total">合计：<span>¥${tP()}</span></div>`;document.getElementById('cmb').innerHTML=h;document.getElementById('com').classList.add('open');}
function lM(){document.getElementById('com').classList.remove('open');}
async function cO(){const n=document.getElementById('cnn').value.trim();O.unshift({id:Date.now(),time:new Date().toLocaleString('zh-CN'),items:[...cart],total:tP(),note:n});cart=[];document.getElementById('cnn').value='';sc();lC();lM();await saveAll();rCB();rCP();rH();toast('🎉 下单成功');}
function rH(){const l=document.getElementById('hl');if(!O.length){l.innerHTML='<div class="history-empty"><p>📋</p><p>暂无订单</p></div>';return;}l.innerHTML=O.map(o=>{const t=(o.items||[]).map(c=>`<span class="history-tag">${c.img?'🖼️':c.emoji||'🍽️'} ${esc(c.name)}×${c.q}</span>`).join(''),ms=[...new Set((o.items||[]).map(c=>c.m))].join('、');return`<div class="history-card"><div class="history-card-header"><span>📅 ${o.time}</span><span>👤 ${esc(ms)}</span></div><div class="history-card-dishes">${t}</div>${o.note?`<div class="order-note">📝 ${esc(o.note)}</div>`:''}<div class="history-card-footer">¥${o.total}</div></div>`;}).join('');}
async function clH(){if(!O.length)return;if(!confirm('清空全部订单？'))return;O=[];await saveAll();rH();toast('🗑️ 已清空');}

// === Tab ===
function sT(t){document.querySelectorAll('#mainScreen .tab').forEach(x=>x.classList.remove('active'));document.getElementById(t+'Tab')?.classList.add('active');if(t==='manage'){rMD();rMC();rMM();}if(t==='history')rH();window.scrollTo({top:0,behavior:'smooth'});}

// === 管理 ===
function rMD(){const l=document.getElementById('mdl');document.getElementById('dc').textContent=`共 ${M.length} 道菜`;if(!M.length){l.innerHTML='<div class="history-empty"><p>🍽️</p><p>暂无菜品</p></div>';return;}const g={};M.forEach(d=>{if(!g[d.c])g[d.c]=[];g[d.c].push(d);});let h='';for(const[c,ds]of Object.entries(g)){const ce=(C.find(x=>x.name===c)||{}).emoji||'📂';h+=`<p style="font-weight:700;margin:16px 0 6px;font-size:0.9rem;color:var(--text-light);">${ce} ${esc(c)} (${ds.length})</p>`;ds.forEach(d=>{h+=`<div class="manage-dish-item"><div class="manage-dish-thumb">${d.img?`<img src="${d.img}">`:d.e||'🍽️'}</div><div class="manage-dish-info"><div class="manage-dish-name">${esc(d.n)}</div><div class="manage-dish-meta"><span class="cat-tag">${esc(d.c)}</span>${esc(d.d)}</div></div><div class="manage-dish-price">¥${d.p}</div><div class="manage-dish-actions"><button class="btn-icon-sm" onclick="oD(${d.id})">✏️</button><button class="btn-icon-sm danger" onclick="delD(${d.id})">🗑️</button></div></div>`;});}l.innerHTML=h;}
function rMC(){const l=document.getElementById('mcl');if(!C.length){l.innerHTML='<div class="history-empty"><p>📂</p><p>暂无分类</p></div>';return;}l.innerHTML=C.map(c=>`<div class="manage-cat-item"><div class="manage-cat-emoji">${esc(c.emoji)}</div><div class="manage-cat-info"><div class="manage-cat-name">${esc(c.name)}</div><div class="manage-cat-count">${M.filter(d=>d.c===c.name).length} 道</div></div><div class="manage-cat-actions"><button class="btn-icon-sm" onclick="oC('${escJs(c.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="delC('${escJs(c.name)}')">🗑️</button></div></div>`).join('');}
function rMM(){const l=document.getElementById('mml');if(!P.length){l.innerHTML='<div class="history-empty"><p>👨‍👩‍👧‍👦</p><p>暂无家人</p></div>';return;}const av=['👨','👩','👴','👵','👦','👧','🧑','👶','🧒'];l.innerHTML=P.map((m,i)=>`<div class="manage-member-item"><div class="manage-member-avatar">${m.a?`<img src="${m.a}">`:av[i%av.length]}</div><div class="manage-member-name">${esc(m.name)}</div><div class="manage-member-actions"><button class="btn-icon-sm" onclick="oM('${escJs(m.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="delM('${escJs(m.name)}')">🗑️</button></div></div>`).join('');}

// === 图片 ===
function ci(f,mw,mh,q){return new Promise((r,j)=>{if(!f.type.startsWith('image/'))return j(new Error('非图片'));const fr=new FileReader();fr.onload=e=>{const img=new Image();img.onload=()=>{let w=img.width,h=img.height;if(w>mw){h*=mw/w;w=mw;}if(h>mh){w*=mh/h;h=mh;}const c=document.createElement('canvas');c.width=Math.round(w);c.height=Math.round(h);c.getContext('2d').drawImage(img,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',q));};img.onerror=()=>j(new Error('失败'));img.src=e.target.result;};fr.onerror=()=>j(new Error('失败'));fr.readAsDataURL(f);});}

// === CRUD ===
function oD(id){tDI='';document.getElementById('dcat').innerHTML=C.map(c=>`<option value="${esc(c.name)}">${c.emoji} ${esc(c.name)}</option>`).join('');if(id){const d=M.find(x=>x.id===id);if(!d)return;document.getElementById('dt').textContent='✏️ 编辑';document.getElementById('di').value=d.id;document.getElementById('dn').value=d.n;document.getElementById('dcat').value=d.c;document.getElementById('dpr').value=d.p;document.getElementById('de').value=d.e;document.getElementById('dde').value=d.d;document.getElementById('dep').textContent=d.e||'🥘';if(d.img){tDI=d.img;document.getElementById('dp').innerHTML=`<img src="${d.img}">`;document.getElementById('dp').classList.add('has-image');document.getElementById('dcb').style.display='inline-block';}else clD();}else{document.getElementById('dt').textContent='🍽️ 添加';document.getElementById('di').value='';['dn','de','dde'].forEach(x=>document.getElementById(x).value='');document.getElementById('dpr').value='';document.getElementById('dcat').value=C[0]?.name||'';document.getElementById('dep').textContent='🥘';clD();}document.getElementById('dm').classList.add('open');}
async function hD(e){const f=e.target.files[0];if(!f)return;try{tDI=await ci(f,400,300,0.7);document.getElementById('dp').innerHTML=`<img src="${tDI}">`;document.getElementById('dp').classList.add('has-image');document.getElementById('dcb').style.display='inline-block';}catch(er){toast('⚠️ '+er.message);}e.target.value='';}
function clD(){document.getElementById('dp').innerHTML='<span class="image-placeholder">🥘</span>';document.getElementById('dp').classList.remove('has-image');document.getElementById('dcb').style.display='none';tDI='';}
function clDM(){document.getElementById('dm').classList.remove('open');}
async function sD(){const id=document.getElementById('di').value,n=document.getElementById('dn').value.trim(),cat=document.getElementById('dcat').value,pr=parseInt(document.getElementById('dpr').value),em=document.getElementById('de').value.trim(),desc=document.getElementById('dde').value.trim();if(!n){toast('⚠️ 请输入菜名');return;}if(!cat){toast('⚠️ 请选分类');return;}if(isNaN(pr)||pr<0){toast('⚠️ 请输入价格');return;}if(id){const d=M.find(x=>x.id===parseInt(id));d.n=n;d.c=cat;d.p=pr;d.e=em||'🍽️';d.d=desc||n;d.img=tDI;}else{M.push({id:nextId++,n,cat,p:pr,e:em||'🍽️',img:tDI,d:desc||n});}await saveAll();clDM();rMG();rCN();rMD();toast('✅ 已保存');}
async function delD(id){const d=M.find(x=>x.id===id);if(!d||!confirm(`删除「${d.n}」？`))return;M=M.filter(x=>x.id!==id);cart=cart.filter(c=>c.id!==id);sc();await saveAll();rMG();rCN();rMD();rCB();rCP();toast('🗑️ '+d.n);}

function oC(on){if(on){const c=C.find(x=>x.name===on);if(!c)return;document.getElementById('catt').textContent='✏️ 编辑';document.getElementById('coid').value=on;document.getElementById('cnm').value=on;document.getElementById('cem').value=c.emoji;document.getElementById('cep').textContent=c.emoji||'📂';}else{document.getElementById('catt').textContent='📂 添加';document.getElementById('coid').value='';document.getElementById('cnm').value='';document.getElementById('cem').value='';document.getElementById('cep').textContent='📂';}document.getElementById('catm').classList.add('open');}
function clCM(){document.getElementById('catm').classList.remove('open');}
async function sC(){const on=document.getElementById('coid').value.trim(),nn=document.getElementById('cnm').value.trim(),em=document.getElementById('cem').value.trim();if(!nn){toast('⚠️ 请输入名称');return;}if(on){if(on!==nn&&C.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}const c=C.find(x=>x.name===on);c.name=nn;c.emoji=em||'📂';M.forEach(d=>{if(d.c===on)d.c=nn;});}else{if(C.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}C.push({name:nn,emoji:em||'📂'});}await saveAll();clCM();rMC();rMD();rMG();rCN();toast('✅ 已保存');}
async function delC(n){const ct=M.filter(d=>d.c===n).length;if(!confirm(`删除「${n}」？${ct>0?`\n${ct}道菜移到其他分类`:''}`))return;const fb=C.find(x=>x.name!==n)?.name||'';M.forEach(d=>{if(d.c===n)d.c=fb;});C=C.filter(c=>c.name!==n);await saveAll();rMC();rMD();rMG();rCN();toast('🗑️ '+n);}

function oM(on){tMA='';if(on){const m=P.find(x=>x.name===on);if(!m)return;document.getElementById('memt').textContent='✏️ 编辑';document.getElementById('moid').value=on;document.getElementById('mnm').value=on;if(m.a){tMA=m.a;document.getElementById('map').innerHTML=`<img src="${m.a}">`;document.getElementById('map').classList.add('has-image');document.getElementById('mab').style.display='inline-block';}else clM();}else{document.getElementById('memt').textContent='👤 添加';document.getElementById('moid').value='';document.getElementById('mnm').value='';clM();}document.getElementById('memm').classList.add('open');}
async function hM(e){const f=e.target.files[0];if(!f)return;try{tMA=await ci(f,200,200,0.7);document.getElementById('map').innerHTML=`<img src="${tMA}">`;document.getElementById('map').classList.add('has-image');document.getElementById('mab').style.display='inline-block';}catch(er){toast('⚠️ '+er.message);}e.target.value='';}
function clM(){document.getElementById('map').innerHTML='<span class="avatar-placeholder">👤</span>';document.getElementById('map').classList.remove('has-image');document.getElementById('mab').style.display='none';tMA='';}
function clMM(){document.getElementById('memm').classList.remove('open');}
async function sM(){const on=document.getElementById('moid').value.trim(),nn=document.getElementById('mnm').value.trim();if(!nn){toast('⚠️ 请输入称呼');return;}if(on){const i=P.findIndex(x=>x.name===on);if(on!==nn&&P.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}if(i>=0){P[i].name=nn;P[i].a=tMA;}cart.forEach(c=>{if(c.m===on)c.m=nn;});sc();}else{if(P.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}P.push({name:nn,a:tMA});}await saveAll();clMM();rMM();rMS();rCP();toast('✅ 已保存');}
async function delM(n){if(!confirm(`删除「${n}」？`))return;P=P.filter(m=>m.name!==n);cart=cart.filter(c=>c.m!==n);sc();await saveAll();rMM();rMS();rCB();rCP();toast('🗑️ '+n);}

// === 分享 ===
function shareLink(){const c=localStorage.getItem('fm_gh');if(!c)return;const link=location.origin+location.pathname+'#'+btoa(c);navigator.clipboard?.writeText(link).then(()=>toast('📋 链接已复制！微信发给家人'));}

// === 工具 ===
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2000);}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
function escJs(s){return(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
function rstAll(){if(!confirm('⚠️ 清空所有数据？'))return;localStorage.clear();location.reload();}

// === 事件 ===
function bE(){document.getElementById('cn').addEventListener('click',e=>{const b=e.target.closest('.cat-btn');if(!b)return;document.querySelectorAll('#cn .cat-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');cur=b.dataset.cat;rMG();});document.getElementById('mn').addEventListener('click',e=>{const b=e.target.closest('.subnav-btn');if(!b)return;document.querySelectorAll('#mn .subnav-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');cm=b.dataset.m;document.querySelectorAll('.manage-panel').forEach(p=>p.classList.remove('active'));document.getElementById('mp'+cm.toUpperCase())?.classList.add('active');if(cm==='d')rMD();if(cm==='c')rMC();if(cm==='m')rMM();});document.getElementById('de')?.addEventListener('input',function(){document.getElementById('dep').textContent=this.value||'🥘';});document.getElementById('cem')?.addEventListener('input',function(){document.getElementById('cep').textContent=this.value||'📂';});document.getElementById('pin3')?.addEventListener('keydown',e=>{if(e.key==='Enter')hL();});}

document.addEventListener('DOMContentLoaded',()=>{
  try{
  const h=location.hash.slice(1);if(h&&!gCfg()){try{const c=JSON.parse(atob(h));if(c.u&&c.t){localStorage.setItem('fm_gh',JSON.stringify(c));location.hash='';}}}catch(e){}
  initCfg();ss('lockScreen');
  }catch(e){document.body.innerHTML='<div style="padding:40px;text-align:center;"><h2>⚠️ 加载失败</h2><p>'+e.message+'</p><p><small>请刷新页面或清除缓存重试</small></p></div>';}
});
