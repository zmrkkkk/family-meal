// 家庭点菜 — CloudBase版 v8.1
const DC=[{name:'凉菜',emoji:'🧊'},{name:'热菜',emoji:'🍳'},{name:'汤类',emoji:'🍲'},{name:'主食',emoji:'🍚'},{name:'饮品',emoji:'🥤'}];
const DM=[{name:'爸爸',a:''},{name:'妈妈',a:''},{name:'爷爷',a:''},{name:'奶奶',a:''},{name:'大宝',a:''},{name:'小宝',a:''}];
const DD=[{n:'拍黄瓜',c:'凉菜',p:12,e:'🥒',img:'',d:'清爽脆嫩'},{n:'凉拌木耳',c:'凉菜',p:15,e:'🍄',img:'',d:'爽口开胃'},{n:'皮蛋豆腐',c:'凉菜',p:14,e:'🥚',img:'',d:'嫩滑豆腐'},{n:'口水鸡',c:'凉菜',p:28,e:'🍗',img:'',d:'麻辣鲜香'},{n:'酱牛肉',c:'凉菜',p:32,e:'🥩',img:'',d:'酱香浓郁'},{n:'糖拌西红柿',c:'凉菜',p:10,e:'🍅',img:'',d:'酸甜清爽'},{n:'红烧排骨',c:'热菜',p:38,e:'🦴',img:'',d:'软烂入味'},{n:'鱼香肉丝',c:'热菜',p:26,e:'🐟',img:'',d:'酸甜微辣'},{n:'宫保鸡丁',c:'热菜',p:28,e:'🐔',img:'',d:'花生脆香'},{n:'糖醋里脊',c:'热菜',p:30,e:'🍖',img:'',d:'外酥里嫩'},{n:'麻婆豆腐',c:'热菜',p:18,e:'🧈',img:'',d:'麻辣下饭'},{n:'清炒时蔬',c:'热菜',p:16,e:'🥬',img:'',d:'清淡健康'},{n:'回锅肉',c:'热菜',p:28,e:'🥓',img:'',d:'肥而不腻'},{n:'干煸四季豆',c:'热菜',p:18,e:'🫘',img:'',d:'干香微辣'},{n:'番茄炒蛋',c:'热菜',p:15,e:'🍳',img:'',d:'国民家常'},{n:'番茄蛋花汤',c:'汤类',p:12,e:'🥣',img:'',d:'清淡鲜美'},{n:'酸辣汤',c:'汤类',p:14,e:'🌶️',img:'',d:'酸辣开胃'},{n:'排骨玉米汤',c:'汤类',p:25,e:'🌽',img:'',d:'清甜滋补'},{n:'紫菜蛋花汤',c:'汤类',p:10,e:'🫧',img:'',d:'简单鲜美'},{n:'白米饭',c:'主食',p:3,e:'🍚',img:'',d:'香喷喷'},{n:'蛋炒饭',c:'主食',p:12,e:'🍛',img:'',d:'粒粒分明'},{n:'手工水饺',c:'主食',p:22,e:'🥟',img:'',d:'皮薄馅大'},{n:'番茄鸡蛋面',c:'主食',p:14,e:'🍜',img:'',d:'家常味'},{n:'馒头',c:'主食',p:2,e:'🥖',img:'',d:'松软'},{n:'可乐',c:'饮品',p:5,e:'🥤',img:'',d:'冰爽'},{n:'雪碧',c:'饮品',p:5,e:'🧊',img:'',d:'清爽'},{n:'橙汁',c:'饮品',p:8,e:'🍊',img:'',d:'鲜榨'},{n:'王老吉',c:'饮品',p:6,e:'🫖',img:'',d:'怕上火'},{n:'酸梅汤',c:'饮品',p:5,e:'🫗',img:'',d:'消暑'}];

let cb,db,auth,_,M=[],C=[],P=[],O=[],cart=[],cur='all',sr='',cm='d',fi=null,tDI='',tMA='',tDIF=null,tMAF=null;

// === 存储 ===
function gCfg(){try{return JSON.parse(localStorage.getItem('fm_tcb'));}catch(e){return null;}}
function gPin(){return localStorage.getItem('fm_pin');}
async function iCB(){
  const cfg=gCfg();
  if(!cfg){document.getElementById('cfgBar').style.display='block';return false;}
  document.getElementById('cfgBar').style.display='none';
  try{
    cb=cloudbase.init({env:cfg.env});db=cb.database();auth=cb.auth({persistence:'local'});_=db.command;
    const ls=auth.hasLoginState();if(!ls)await auth.anonymousAuthProvider().signIn();
    return true;
  }catch(e){
    const m=e.message||'';
    if(m.includes('permission')||m.includes('Permission'))document.getElementById('syncErr').innerHTML='⚠️ 数据库权限未设！<br><small>控制台→数据库→每个集合→权限→<b>所有用户可读写</b></small>';
    else if(m.includes('not found')||m.includes('not exist'))document.getElementById('syncErr').innerHTML='⚠️ 需创建5个集合！<br><small>控制台→数据库→新建: <b>families dishes categories members orders</b></small>';
    else if(m.includes('domain')||m.includes('不在')||m.includes('not allowed'))document.getElementById('syncErr').innerHTML='⚠️ 需添加安全域名！<br><small>控制台→环境→安全配置→添加: <b>zmrkkkk.github.io</b></small>';
    else document.getElementById('syncErr').textContent='连接失败: '+m;
    document.getElementById('syncErr').style.display='block';return false;
  }
}
function gFid(){return localStorage.getItem('fm_fid');}

// === 锁屏 ===
async function initLock(){await iCB();const p=gPin();if(!p){document.getElementById('lockNew').style.display='block';document.getElementById('lockEnter').style.display='none';document.getElementById('lockBtn').textContent='🔒 设置密码并进入';}else{document.getElementById('lockNew').style.display='none';document.getElementById('lockEnter').style.display='block';document.getElementById('lockBtn').textContent='🔓 解锁';}ss('lockScreen');}
async function hL(){
  const cfg=gCfg(),env=document.getElementById('cfgEnv').value.trim();
  if(env&&!cfg){localStorage.setItem('fm_tcb',JSON.stringify({env}));await iCB();}
  if(!gCfg()&&!env){document.getElementById('syncErr').textContent='请填写CloudBase环境ID';document.getElementById('syncErr').style.display='block';return;}
  const pin=gPin();
  if(!pin){const p1=document.getElementById('pin1').value.trim(),p2=document.getElementById('pin2').value.trim();if(!p1)return;if(p1!==p2){document.getElementById('pinErr').textContent='两次不一致';document.getElementById('pinErr').classList.add('show');return;}localStorage.setItem('fm_pin',p1);fi=await eF();}
  else{const p3=document.getElementById('pin3').value.trim();if(p3!==pin){document.getElementById('pinErr').textContent='密码错误';document.getElementById('pinErr').classList.add('show');return;}}
  if(!fi){document.getElementById('syncErr').textContent='⏳ 正在初始化...';document.getElementById('syncErr').style.display='block';fi=await eF();if(!fi){document.getElementById('syncErr').textContent='初始化失败，请确认：\n1. CloudBase已开启匿名登录\n2. 安全域名已添加 github.io\n3. 5个集合权限均为所有用户可读写';document.getElementById('syncErr').style.display='block';return;}}
  await rf();ss('mainScreen');sl('✅ 已同步');rA();bE();lc();
}
async function eF(){
  let fid=gFid();
  if(fid){try{await db.collection('families').doc(fid).get();return fid;}catch(e){localStorage.removeItem('fm_fid');}}
  const code=gC();try{const r=await db.collection('families').add({name:'我的家庭',code,createdAt:new Date()});fid=r.id;localStorage.setItem('fm_fid',fid);try{for(const d of DD)await db.collection('dishes').add({...d,fid});}catch(e){}try{for(const c of DC)await db.collection('categories').add({...c,fid});}catch(e){}try{for(const m of DM)await db.collection('members').add({...m,fid});}catch(e){}return fid;}catch(e){document.getElementById('syncErr').textContent='创建失败: '+e.message;document.getElementById('syncErr').style.display='block';return null;}
}
function gC(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let r='';for(let i=0;i<6;i++)r+=c[Math.floor(Math.random()*c.length)];return r;}
async function rstAll(){if(!confirm('⚠️ 清空所有数据并重置？'))return;localStorage.clear();location.reload();}

// === 数据 ===
async function rf(){sl('⏳ 同步中...');try{const[ds,cs,ms,os]=await Promise.all([db.collection('dishes').where({fid:fi}).limit(1000).get(),db.collection('categories').where({fid:fi}).limit(1000).get(),db.collection('members').where({fid:fi}).limit(1000).get(),db.collection('orders').where({fid:fi}).orderBy('createdAt','desc').limit(500).get()]);M=ds.data.map(r=>({id:r._id,...r}));C=cs.data.map(r=>({id:r._id,...r}));P=ms.data.map(r=>({id:r._id,...r}));O=os.data.map(r=>({id:r._id,...r}));sl('✅ 已同步('+M.length+'菜)');}catch(e){sl('⚠️ 同步失败');}rA();}
function sl(m){document.getElementById('ss').textContent=m;}

// === 渲染 ===
function rA(){rMS();rCN();rMG();rCB();rCP();rH();rMD();rMC();rMM();}
function rMS(){const s=document.getElementById('ms'),v=s.value;s.innerHTML='<option value="">-- 选择家人 --</option>'+P.filter(m=>m.name).map(m=>`<option value="${esc(m.name)}">${esc(m.name)}</option>`).join('');if(P.some(m=>m.name===v))s.value=v;oMC();}
function oMC(){const m=P.find(x=>x.name===document.getElementById('ms').value);document.getElementById('ma').innerHTML=m&&m.a?`<img src="${m.a}">`:'👤';}
function rCN(){document.getElementById('cn').innerHTML='<button class="cat-btn active" data-cat="all">🔥 全部</button>'+C.map(c=>`<button class="cat-btn" data-cat="${esc(c.name)}">${c.emoji} ${esc(c.name)}</button>`).join('');}
function rMG(){const g=document.getElementById('mg');let d=M;if(cur!=='all')d=d.filter(x=>x.c===cur);if(sr){const k=sr.toLowerCase();d=d.filter(x=>(x.n||'').toLowerCase().includes(k));}if(!d.length){g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-light);"><p style="font-size:3rem;">🔍</p><p>没有找到</p></div>';return;}const bs=['#fef5e7','#fdecea','#edf7f0','#e8f4fd','#fdf2f8','#f5f0e8','#e8f8f5','#fef9e7'];g.innerHTML=d.map(dd=>{const ic=cart.find(c=>c.id===dd.id),q=ic?ic.q:0;return`<div class="menu-card"><div class="menu-card-img" style="${dd.img?'':'background:'+bs[Math.abs(dd.id?.length||0)%bs.length]}">${dd.img?`<img src="${dd.img}" loading="lazy">`:dd.e||'🍽️'}</div><div class="menu-card-body"><div class="menu-card-name">${esc(dd.n)}</div><div class="menu-card-desc">${esc(dd.d)}</div><div class="menu-card-footer"><div class="menu-card-price"><span class="unit">¥</span>${dd.p}</div>${q>0?`<div class="menu-card-qty"><button onclick="event.stopPropagation();cQ('${dd.id}',-1)">−</button><span class="qty-num">${q}</span><button onclick="event.stopPropagation();cQ('${dd.id}',1)">+</button></div>`:`<button class="menu-card-add" onclick="event.stopPropagation();aT('${dd.id}')">+</button>`}</div></div></div>`;}).join('');}
function fM(){sr=document.getElementById('si').value.trim();rMG();}

// === 购物车 ===
function lc(){try{cart=JSON.parse(localStorage.getItem('fm_cart')||'[]');}catch(e){cart=[];}}
function sc(){localStorage.setItem('fm_cart',JSON.stringify(cart));}
function aT(id){const d=M.find(x=>x.id===id);if(!d)return;const m=document.getElementById('ms').value;if(!m){toast('⚠️ 请选点菜人');return;}const ex=cart.find(c=>c.id===id&&c.m===m);if(ex)ex.q++;else cart.push({id,name:d.n,price:d.p,emoji:d.e,img:d.img||'',q:1,m});sc();rMG();rCB();rCP();}
function cQ(id,d){const m=document.getElementById('ms').value,it=cart.find(c=>c.id===id&&c.m===m);if(!it)return;it.q+=d;if(it.q<=0)cart=cart.filter(c=>!(c.id===id&&c.m===m));sc();rMG();rCB();rCP();}
function cCQ(id,mb,d){const it=cart.find(c=>c.id===id&&c.m===mb);if(!it)return;it.q+=d;if(it.q<=0)cart=cart.filter(c=>!(c.id===id&&c.m===mb));sc();rMG();rCB();rCP();}
function tC(){return cart.reduce((s,c)=>s+c.q,0);}
function tP(){return cart.reduce((s,c)=>s+c.price*c.q,0);}
function rCB(){const c=tC(),b=document.getElementById('cb');b.textContent=c;b.style.display=c>0?'flex':'none';}
function togC(){const p=document.getElementById('cp'),o=document.getElementById('co');if(p.classList.contains('open'))lC();else{rCP();o.classList.add('open');p.classList.add('open');}}
function lC(){document.getElementById('co').classList.remove('open');document.getElementById('cp').classList.remove('open');}
function rCP(){const l=document.getElementById('cl'),e=document.getElementById('ce'),f=document.getElementById('cf');if(!cart.length){l.innerHTML='';l.style.display='none';e.style.display='flex';f.classList.remove('show');}else{l.style.display='block';e.style.display='none';f.classList.add('show');l.innerHTML=cart.map(c=>`<div class="cart-item"><div class="cart-item-img">${c.img?`<img src="${c.img}">`:c.emoji||'🍽️'}</div><div class="cart-item-info"><div class="cart-item-name">${esc(c.name)}</div><div class="cart-item-member">👤 ${esc(c.m)}</div><div class="cart-item-price">¥${c.price*c.q}</div></div><div class="cart-item-qty"><button onclick="cCQ('${c.id}','${escJs(c.m)}',-1)">−</button><span>${c.q}</span><button onclick="cCQ('${c.id}','${escJs(c.m)}',1)">+</button></div></div>`).join('');}document.getElementById('cc').textContent=tC();document.getElementById('ct').textContent=tP();}

// === 订单 ===
function sO(){if(!cart.length){toast('⚠️ 购物车空');return;}const g={};cart.forEach(c=>{if(!g[c.m])g[c.m]=[];g[c.m].push(c);});let h='';for(const[m,items]of Object.entries(g)){h+=`<p style="font-weight:600;margin:12px 0 4px;">👤 ${esc(m)}</p><ul class="confirm-list">`;items.forEach(c=>{h+=`<li><span class="dish-info"><span class="confirm-item-img">${c.img?`<img src="${c.img}">`:c.emoji||'🍽️'}</span>${esc(c.name)} ×${c.q}</span><span style="color:var(--primary);font-weight:600;">¥${c.price*c.q}</span></li>`;});h+='</ul>';}h+=`<div class="confirm-total">合计：<span>¥${tP()}</span></div>`;document.getElementById('cmb').innerHTML=h;document.getElementById('com').classList.add('open');}
function lM(){document.getElementById('com').classList.remove('open');}
async function cO(){const n=document.getElementById('cnn').value.trim();try{await db.collection('orders').add({items:[...cart],total:tP(),note:n,fid:fi,createdAt:new Date()});cart=[];document.getElementById('cnn').value='';sc();lC();lM();await rf();rCB();rCP();toast('🎉 下单成功');}catch(e){toast('⚠️ 下单失败: '+e.message);}}
function rH(){const l=document.getElementById('hl');if(!O.length){l.innerHTML='<div class="history-empty"><p>📋</p><p>暂无订单</p></div>';return;}l.innerHTML=O.map(o=>{const t=(o.items||[]).map(c=>`<span class="history-tag">${c.img?'🖼️':c.emoji||'🍽️'} ${esc(c.name)}×${c.q}</span>`).join(''),ms=[...new Set((o.items||[]).map(c=>c.m))].join('、'),time=o.createdAt?new Date(o.createdAt).toLocaleString('zh-CN'):'';return`<div class="history-card"><div class="history-card-header"><span>📅 ${time}</span><span>👤 ${esc(ms)}</span></div><div class="history-card-dishes">${t}</div>${o.note?`<div class="order-note">📝 ${esc(o.note)}</div>`:''}<div class="history-card-footer">¥${o.total}</div></div>`;}).join('');}
async function clH(){if(!O.length)return;if(!confirm('清空全部订单？'))return;for(const o of O)await db.collection('orders').doc(o.id).remove();await rf();toast('🗑️ 已清空');}

// === Tab ===
function sT(t){document.querySelectorAll('#mainScreen .tab').forEach(x=>x.classList.remove('active'));document.getElementById(t+'Tab')?.classList.add('active');if(t==='manage'){rMD();rMC();rMM();}if(t==='history')rH();window.scrollTo({top:0,behavior:'smooth'});}
setInterval(()=>{if(fi&&document.getElementById('mainScreen').classList.contains('active'))rf();},15000);

// === 管理 ===
function rMD(){const l=document.getElementById('mdl');document.getElementById('dc').textContent=`共 ${M.length} 道菜`;if(!M.length){l.innerHTML='<div class="history-empty"><p>🍽️</p><p>暂无菜品</p></div>';return;}const g={};M.forEach(d=>{if(!g[d.c])g[d.c]=[];g[d.c].push(d);});let h='';for(const[c,ds]of Object.entries(g)){const ce=(C.find(x=>x.name===c)||{}).emoji||'📂';h+=`<p style="font-weight:700;margin:16px 0 6px;font-size:0.9rem;color:var(--text-light);">${ce} ${esc(c)} (${ds.length})</p>`;ds.forEach(d=>{h+=`<div class="manage-dish-item"><div class="manage-dish-thumb">${d.img?`<img src="${d.img}">`:d.e||'🍽️'}</div><div class="manage-dish-info"><div class="manage-dish-name">${esc(d.n)}</div><div class="manage-dish-meta"><span class="cat-tag">${esc(d.c)}</span>${esc(d.d)}</div></div><div class="manage-dish-price">¥${d.p}</div><div class="manage-dish-actions"><button class="btn-icon-sm" onclick="oD('${d.id}')">✏️</button><button class="btn-icon-sm danger" onclick="delD('${d.id}')">🗑️</button></div></div>`;});}l.innerHTML=h;}
function rMC(){const l=document.getElementById('mcl');if(!C.length){l.innerHTML='<div class="history-empty"><p>📂</p><p>暂无分类</p></div>';return;}l.innerHTML=C.map(c=>`<div class="manage-cat-item"><div class="manage-cat-emoji">${esc(c.emoji)}</div><div class="manage-cat-info"><div class="manage-cat-name">${esc(c.name)}</div><div class="manage-cat-count">${M.filter(d=>d.c===c.name).length} 道</div></div><div class="manage-cat-actions"><button class="btn-icon-sm" onclick="oC('${escJs(c.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="delC('${escJs(c.name)}')">🗑️</button></div></div>`).join('');}
function rMM(){const l=document.getElementById('mml');if(!P.length){l.innerHTML='<div class="history-empty"><p>👨‍👩‍👧‍👦</p><p>暂无家人</p></div>';return;}const av=['👨','👩','👴','👵','👦','👧','🧑','👶','🧒'];l.innerHTML=P.map((m,i)=>`<div class="manage-member-item"><div class="manage-member-avatar">${m.a?`<img src="${m.a}">`:av[i%av.length]}</div><div class="manage-member-name">${esc(m.name)}</div><div class="manage-member-actions"><button class="btn-icon-sm" onclick="oM('${escJs(m.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="delM('${escJs(m.name)}')">🗑️</button></div></div>`).join('');}

// === 图片 ===
function ci(f,mw,mh,q){return new Promise((r,j)=>{if(!f.type.startsWith('image/'))return j(new Error('非图片'));const fr=new FileReader();fr.onload=e=>{const img=new Image();img.onload=()=>{let w=img.width,h=img.height;if(w>mw){h*=mw/w;w=mw;}if(h>mh){w*=mh/h;h=mh;}const c=document.createElement('canvas');c.width=Math.round(w);c.height=Math.round(h);c.getContext('2d').drawImage(img,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',q));};img.onerror=()=>j(new Error('失败'));img.src=e.target.result;};fr.onerror=()=>j(new Error('失败'));fr.readAsDataURL(f);});}
async function upF(f,p){if(!f)return'';const r=await cb.uploadFile({cloudPath:p+Date.now()+'_'+f.name,filePath:f});return r.fileID;}

// === CRUD ===
function oD(id){tDI='';tDIF=null;document.getElementById('dcat').innerHTML=C.map(c=>`<option value="${esc(c.name)}">${c.emoji} ${esc(c.name)}</option>`).join('');if(id){const d=M.find(x=>x.id===id);if(!d)return;document.getElementById('dt').textContent='✏️ 编辑';document.getElementById('di').value=d.id;document.getElementById('dn').value=d.n;document.getElementById('dcat').value=d.c;document.getElementById('dpr').value=d.p;document.getElementById('de').value=d.e;document.getElementById('dde').value=d.d;if(d.img){tDI=d.img;document.getElementById('dp').innerHTML=`<img src="${d.img}">`;document.getElementById('dp').classList.add('has-image');document.getElementById('dcb').style.display='inline-block';}else clD();}else{document.getElementById('dt').textContent='🍽️ 添加';document.getElementById('di').value='';['dn','de','dde'].forEach(x=>document.getElementById(x).value='');document.getElementById('dpr').value='';document.getElementById('dcat').value=C[0]?.name||'';clD();}document.getElementById('dep').textContent=document.getElementById('de').value||'🥘';document.getElementById('dm').classList.add('open');}
async function hD(e){const f=e.target.files[0];if(!f)return;tDIF=f;try{tDI=await ci(f,400,300,0.7);document.getElementById('dp').innerHTML=`<img src="${tDI}">`;document.getElementById('dp').classList.add('has-image');document.getElementById('dcb').style.display='inline-block';}catch(er){toast('⚠️ '+er.message);}e.target.value='';}
function clD(){document.getElementById('dp').innerHTML='<span class="image-placeholder">🥘</span>';document.getElementById('dp').classList.remove('has-image');document.getElementById('dcb').style.display='none';tDI='';tDIF=null;}
function clDM(){document.getElementById('dm').classList.remove('open');}
async function sD(){const id=document.getElementById('di').value,n=document.getElementById('dn').value.trim(),cat=document.getElementById('dcat').value,pr=parseInt(document.getElementById('dpr').value),em=document.getElementById('de').value.trim(),desc=document.getElementById('dde').value.trim();if(!n){toast('⚠️ 请输入菜名');return;}if(!cat){toast('⚠️ 请选分类');return;}if(isNaN(pr)||pr<0){toast('⚠️ 请输入价格');return;}sl('⏳ 保存中...');try{let img=tDI||'';if(tDIF)img=await upF(tDIF,'dishes/');const data={n,c:cat,p:pr,e:em||'🍽️',d:desc||n,img,fid:fi};if(id){await db.collection('dishes').doc(id).update(data);}else{await db.collection('dishes').add(data);}clDM();await rf();toast('✅ 已保存');}catch(e){toast('⚠️ 保存失败: '+e.message);}}
async function delD(id){const d=M.find(x=>x.id===id);if(!d||!confirm(`删除「${d.n}」？`))return;try{await db.collection('dishes').doc(id).remove();cart=cart.filter(c=>c.id!==id);sc();await rf();rCB();rCP();toast('🗑️ '+d.n);}catch(e){toast('⚠️ 删除失败');}}

function oC(on){if(on){const c=C.find(x=>x.name===on);if(!c)return;document.getElementById('catt').textContent='✏️ 编辑';document.getElementById('coid').value=on;document.getElementById('cnm').value=on;document.getElementById('cem').value=c.emoji;document.getElementById('cep').textContent=c.emoji||'📂';}else{document.getElementById('catt').textContent='📂 添加';document.getElementById('coid').value='';document.getElementById('cnm').value='';document.getElementById('cem').value='';document.getElementById('cep').textContent='📂';}document.getElementById('catm').classList.add('open');}
function clCM(){document.getElementById('catm').classList.remove('open');}
async function sC(){const on=document.getElementById('coid').value.trim(),nn=document.getElementById('cnm').value.trim(),em=document.getElementById('cem').value.trim();if(!nn){toast('⚠️ 请输入名称');return;}try{if(on){const c=C.find(x=>x.name===on);if(!c)return;if(on!==nn&&C.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}await db.collection('categories').doc(c.id).update({name:nn,emoji:em||'📂'});for(const d of M.filter(x=>x.c===on))await db.collection('dishes').doc(d.id).update({c:nn});}else{if(C.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}await db.collection('categories').add({name:nn,emoji:em||'📂',fid:fi});}clCM();await rf();toast('✅ 已保存');}catch(e){toast('⚠️ 保存失败: '+e.message);}}
async function delC(n){const ct=M.filter(d=>d.c===n).length;if(!confirm(`删除「${n}」？${ct>0?`\n${ct}道菜将移到其他分类`:''}`))return;try{const c=C.find(x=>x.name===n),fb=C.find(x=>x.name!==n)?.name||'';for(const d of M.filter(x=>x.c===n))await db.collection('dishes').doc(d.id).update({c:fb});await db.collection('categories').doc(c.id).remove();await rf();toast('🗑️ '+n);}catch(e){toast('⚠️ 删除失败');}}

function oM(on){tMA='';tMAF=null;if(on){const m=P.find(x=>x.name===on);if(!m)return;document.getElementById('memt').textContent='✏️ 编辑';document.getElementById('moid').value=on;document.getElementById('mnm').value=on;if(m.a){tMA=m.a;document.getElementById('map').innerHTML=`<img src="${m.a}">`;document.getElementById('map').classList.add('has-image');document.getElementById('mab').style.display='inline-block';}else clM();}else{document.getElementById('memt').textContent='👤 添加';document.getElementById('moid').value='';document.getElementById('mnm').value='';clM();}document.getElementById('memm').classList.add('open');}
async function hM(e){const f=e.target.files[0];if(!f)return;tMAF=f;try{tMA=await ci(f,200,200,0.7);document.getElementById('map').innerHTML=`<img src="${tMA}">`;document.getElementById('map').classList.add('has-image');document.getElementById('mab').style.display='inline-block';}catch(er){toast('⚠️ '+er.message);}e.target.value='';}
function clM(){document.getElementById('map').innerHTML='<span class="avatar-placeholder">👤</span>';document.getElementById('map').classList.remove('has-image');document.getElementById('mab').style.display='none';tMA='';tMAF=null;}
function clMM(){document.getElementById('memm').classList.remove('open');}
async function sM(){const on=document.getElementById('moid').value.trim(),nn=document.getElementById('mnm').value.trim();if(!nn){toast('⚠️ 请输入称呼');return;}try{let av=tMA||'';if(tMAF)av=await upF(tMAF,'avatars/');if(on){const m=P.find(x=>x.name===on);if(!m)return;if(on!==nn&&P.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}await db.collection('members').doc(m.id).update({name:nn,a:av});cart.forEach(c=>{if(c.m===on)c.m=nn;});sc();}else{if(P.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}await db.collection('members').add({name:nn,a:av,fid:fi});}clMM();await rf();}catch(e){toast('⚠️ 保存失败: '+e.message);}}
async function delM(n){if(!confirm(`删除「${n}」？`))return;try{const m=P.find(x=>x.name===n);await db.collection('members').doc(m.id).remove();cart=cart.filter(c=>c.m!==n);sc();await rf();rCB();rCP();toast('🗑️ '+n);}catch(e){toast('⚠️ 删除失败');}}

// === 工具 ===
function ss(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id)?.classList.add('active');}
function bE(){document.getElementById('cn').addEventListener('click',e=>{const b=e.target.closest('.cat-btn');if(!b)return;document.querySelectorAll('#cn .cat-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');cur=b.dataset.cat;rMG();});document.getElementById('mn').addEventListener('click',e=>{const b=e.target.closest('.subnav-btn');if(!b)return;document.querySelectorAll('#mn .subnav-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');cm=b.dataset.m;document.querySelectorAll('.manage-panel').forEach(p=>p.classList.remove('active'));document.getElementById('mp'+cm.toUpperCase())?.classList.add('active');if(cm==='d')rMD();if(cm==='c')rMC();if(cm==='m')rMM();});document.getElementById('de')?.addEventListener('input',function(){document.getElementById('dep').textContent=this.value||'🥘';});document.getElementById('cem')?.addEventListener('input',function(){document.getElementById('cep').textContent=this.value||'📂';});document.getElementById('pin3')?.addEventListener('keydown',e=>{if(e.key==='Enter')hL();});}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2000);}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
function escJs(s){return(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
document.addEventListener('DOMContentLoaded',initLock);
