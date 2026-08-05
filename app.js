// ============================================================
//  家庭点菜 — LeanCloud 版
//  一次配置 · 全家密码登录 · 自动云端同步
// ============================================================

const DEF_CATS=[{name:'凉菜',emoji:'🧊'},{name:'热菜',emoji:'🍳'},{name:'汤类',emoji:'🍲'},{name:'主食',emoji:'🍚'},{name:'饮品',emoji:'🥤'}];
const DEF_MEMBERS=[{name:'爸爸',avatar:''},{name:'妈妈',avatar:''},{name:'爷爷',avatar:''},{name:'奶奶',avatar:''},{name:'大宝',avatar:''},{name:'小宝',avatar:''}];
const DEF_MENU=[{name:'拍黄瓜',cat:'凉菜',price:12,emoji:'🥒',image:'',desc:'清爽脆嫩'},{name:'凉拌木耳',cat:'凉菜',price:15,emoji:'🍄',image:'',desc:'爽口开胃'},{name:'皮蛋豆腐',cat:'凉菜',price:14,emoji:'🥚',image:'',desc:'嫩滑豆腐'},{name:'口水鸡',cat:'凉菜',price:28,emoji:'🍗',image:'',desc:'麻辣鲜香'},{name:'酱牛肉',cat:'凉菜',price:32,emoji:'🥩',image:'',desc:'酱香浓郁'},{name:'糖拌西红柿',cat:'凉菜',price:10,emoji:'🍅',image:'',desc:'酸甜清爽'},{name:'红烧排骨',cat:'热菜',price:38,emoji:'🦴',image:'',desc:'软烂入味'},{name:'鱼香肉丝',cat:'热菜',price:26,emoji:'🐟',image:'',desc:'酸甜微辣'},{name:'宫保鸡丁',cat:'热菜',price:28,emoji:'🐔',image:'',desc:'花生脆香'},{name:'糖醋里脊',cat:'热菜',price:30,emoji:'🍖',image:'',desc:'外酥里嫩'},{name:'麻婆豆腐',cat:'热菜',price:18,emoji:'🧈',image:'',desc:'麻辣下饭'},{name:'清炒时蔬',cat:'热菜',price:16,emoji:'🥬',image:'',desc:'清淡健康'},{name:'回锅肉',cat:'热菜',price:28,emoji:'🥓',image:'',desc:'肥而不腻'},{name:'干煸四季豆',cat:'热菜',price:18,emoji:'🫘',image:'',desc:'干香微辣'},{name:'番茄炒蛋',cat:'热菜',price:15,emoji:'🍳',image:'',desc:'国民家常'},{name:'番茄蛋花汤',cat:'汤类',price:12,emoji:'🥣',image:'',desc:'清淡鲜美'},{name:'酸辣汤',cat:'汤类',price:14,emoji:'🌶️',image:'',desc:'酸辣开胃'},{name:'排骨玉米汤',cat:'汤类',price:25,emoji:'🌽',image:'',desc:'清甜滋补'},{name:'紫菜蛋花汤',cat:'汤类',price:10,emoji:'🫧',image:'',desc:'简单鲜美'},{name:'白米饭',cat:'主食',price:3,emoji:'🍚',image:'',desc:'香喷喷'},{name:'蛋炒饭',cat:'主食',price:12,emoji:'🍛',image:'',desc:'粒粒分明'},{name:'手工水饺',cat:'主食',price:22,emoji:'🥟',image:'',desc:'皮薄馅大'},{name:'番茄鸡蛋面',cat:'主食',price:14,emoji:'🍜',image:'',desc:'家常味'},{name:'馒头',cat:'主食',price:2,emoji:'🥖',image:'',desc:'松软'},{name:'可乐',cat:'饮品',price:5,emoji:'🥤',image:'',desc:'冰爽'},{name:'雪碧',cat:'饮品',price:5,emoji:'🧊',image:'',desc:'清爽'},{name:'橙汁',cat:'饮品',price:8,emoji:'🍊',image:'',desc:'鲜榨'},{name:'王老吉',cat:'饮品',price:6,emoji:'🫖',image:'',desc:'怕上火'},{name:'酸梅汤',cat:'饮品',price:5,emoji:'🫗',image:'',desc:'消暑'}];

// === 状态 ===
let menu=[],cats=[],mems=[],orders=[],cart=[],curCat='all',curSearch='',curMTab='dishes',nextId=1000;
let famId=null,famData=null,isReg=false;
let tDI='',tMA='',tDIF=null,tMAF=null;

// === LC 配置 ===
function getCfg(){try{return JSON.parse(localStorage.getItem('fm_lc')||'null');}catch(e){return null;}}
function saveCfg(){
  const a=document.getElementById('cfgAppId').value.trim(),k=document.getElementById('cfgAppKey').value.trim(),s=document.getElementById('cfgServer').value.trim(),p=document.getElementById('cfgAdminPw').value.trim();
  if(!a||!k||!s||!p){toast('⚠️ 请填写所有字段');return;}
  localStorage.setItem('fm_lc',JSON.stringify({appId:a,appKey:k,server:s,adminPw:p}));
  toast('✅ 已保存');setTimeout(()=>location.reload(),500);
}
function initLC(){
  const c=getCfg();if(!c){sS('configScreen');hideL();return false;}
  try{AV.init({appId:c.appId,appKey:c.appKey,server:c.server});return true;}catch(e){toast('⚠️ 初始化失败');return false;}
}

// === 屏幕 ===
function sS(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id)?.classList.add('active');}
function hideL(){document.getElementById('loadingScreen').style.display='none';}
function ft(t){document.querySelectorAll('.family-tab').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.family-panel').forEach(p=>p.classList.remove('active'));document.querySelector(`.family-tab:nth-${t==='create'?'first':'last'}-child`).classList.add('active');document.getElementById(t==='create'?'fpCreate':'fpJoin').classList.add('active');}

// === Auth ===
function toggleMode(){isReg=!isReg;document.getElementById('authTitle').textContent=isReg?'注册':'登录';document.getElementById('authBtn').textContent=isReg?'注册':'登录';document.getElementById('authSwitchText').textContent=isReg?'已有账号？':'还没账号？';document.getElementById('authSwitch').textContent=isReg?'去登录':'去注册';}
async function handleAuth(e){e.preventDefault();const u=document.getElementById('authUser').value.trim(),p=document.getElementById('authPass').value,btn=document.getElementById('authBtn'),er=document.getElementById('authError');er.classList.remove('show');btn.disabled=true;btn.textContent='请稍候...';
try{if(isReg){const user=new AV.User();user.setUsername(u);user.setPassword(p);await user.signUp();}else{await AV.User.logIn(u,p);}}catch(ex){er.textContent=ex.message||'操作失败';er.classList.add('show');btn.disabled=false;btn.textContent=isReg?'注册':'登录';}}
async function logout(){await AV.User.logOut();sS('authScreen');}

// === 启动 ===
AV.User.loginWithWeapp=undefined;
document.addEventListener('DOMContentLoaded',async()=>{
  if(!initLC())return;
  hideL();
  AV.User.loginWithWeapp=undefined;
  const user=AV.User.current();
  if(!user){sS('authScreen');showL('');return;}
  famId=user.get('familyId');
  if(!famId){sS('familyScreen');showL('');return;}
  await loadFam();sS('mainScreen');showL('✅ 已就绪');initApp();
});
function showL(m){const el=document.getElementById('syncStatus');if(el)el.textContent=m;}

// === 家庭 ===
async function createFam(){
  const n=document.getElementById('famName').value.trim();if(!n){toast('⚠️ 请输入名称');return;}
  const code=genCode();
  try{
    const F=AV.Object.extend('Family');const f=new F();f.set({name:n,code});await f.save();
    const u=AV.User.current();u.set('familyId',f.id);await u.save();
    for(const c of DEF_CATS)await saveO('Category',{...c,famId:f.id});
    for(const m of DEF_MEMBERS)await saveO('Member',{...m,famId:f.id});
    for(const d of DEF_MENU)await saveO('Dish',{...d,famId:f.id,sort:0});
    famId=f.id;famData={id:f.id,name:n,code};
    document.getElementById('famCreated').style.display='block';document.getElementById('famCodeDisp').textContent=code;
    toast('🎉 创建成功！');
    setTimeout(async()=>{sS('mainScreen');initApp();},1500);
  }catch(e){toast('⚠️ '+e.message);}
}
async function joinFam(){
  const code=document.getElementById('famCode').value.trim().toUpperCase();if(!code||code.length!==6){toast('⚠️ 请输入6位码');return;}
  try{
    const q=new AV.Query('Family');q.equalTo('code',code);const f=await q.first();
    if(!f){toast('⚠️ 未找到');return;}
    const u=AV.User.current();u.set('familyId',f.id);await u.save();
    famId=f.id;famData={id:f.id,name:f.get('name'),code};
    sS('mainScreen');initApp();toast('🎉 加入成功！');
  }catch(e){toast('⚠️ '+e.message);}
}
function genCode(){const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let r='';for(let i=0;i<6;i++)r+=c[Math.floor(Math.random()*c.length)];return r;}
async function loadFam(){
  try{const q=new AV.Query('Family');const f=await q.get(famId);famData={id:f.id,name:f.get('name'),code:f.get('code')};}
  catch(e){AV.User.current().set('familyId',null);AV.User.current().save();logout();}
}

// === 数据操作 ===
async function saveO(cls,data){const O=AV.Object.extend(cls);const o=new O();return o.save(data);}
async function updateO(cls,id,data){const O=AV.Object.extend(cls);const o=AV.Object.createWithoutData(id);Object.entries(data).forEach(([k,v])=>o.set(k,v));return o.save();}
async function deleteO(cls,id){return AV.Object.createWithoutData(id).destroy();}
function qAll(cls){const q=new AV.Query(cls);q.equalTo('famId',famId);q.limit(1000);return q.find();}

async function refreshAll(){
  showL('⏳ 同步中...');
  try{const[ds,cs,ms,os]=await Promise.all([qAll('Dish'),qAll('Category'),qAll('Member'),qAll('Order')]);menu=ds.map(r=>({id:r.id,...r.toJSON()}));cats=cs.map(r=>({id:r.id,...r.toJSON()}));mems=ms.map(r=>({id:r.id,...r.toJSON()}));orders=os.map(r=>({id:r.id,...r.toJSON()}));if(menu.length){nextId=Math.max(...menu.map(d=>d.sort||0),999)+1;}showL('✅ 已同步');}catch(e){showL('⚠️ 同步失败');console.error(e);}
  renderAll();
}

// === 渲染 ===
function initApp(){loadCart();refreshAll();document.getElementById('hdrFam').textContent=famData.name;document.getElementById('famNameDisp').textContent=famData.name;document.getElementById('userName').textContent=AV.User.current().getUsername();bindEv();}
function renderAll(){rMemSel();rCatNav();rMenu();rCartBadge();rCartPanel();rHist();rMDishes();rMCats();rMMems();}
function bindEv(){
  document.getElementById('catNav').addEventListener('click',e=>{const b=e.target.closest('.cat-btn');if(!b)return;document.querySelectorAll('#catNav .cat-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');curCat=b.dataset.cat;rMenu();});
  document.getElementById('mNav').addEventListener('click',e=>{const b=e.target.closest('.subnav-btn');if(!b)return;document.querySelectorAll('#mNav .subnav-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');curMTab=b.dataset.mtab;document.querySelectorAll('.manage-panel').forEach(p=>p.classList.remove('active'));document.getElementById('mPanel'+curMTab.charAt(0).toUpperCase()+curMTab.slice(1))?.classList.add('active');});
}

function rMemSel(){const s=document.getElementById('memberSelect'),v=s.value;s.innerHTML='<option value="">-- 选择家人 --</option>'+mems.filter(m=>m.name).map(m=>`<option value="${esc(m.name)}">${esc(m.name)}</option>`).join('');if(mems.some(m=>m.name===v))s.value=v;onMC();}
function onMC(){const m=mems.find(x=>x.name===document.getElementById('memberSelect').value);document.getElementById('mAvatar').innerHTML=m&&m.avatar?`<img src="${m.avatar}">`:'👤';}
function rCatNav(){document.getElementById('catNav').innerHTML='<button class="cat-btn active" data-cat="all">🔥 全部</button>'+cats.map(c=>`<button class="cat-btn" data-cat="${esc(c.name)}">${c.emoji} ${esc(c.name)}</button>`).join('');}
function rMenu(){const g=document.getElementById('menuGrid');let d=menu;if(curCat!=='all')d=d.filter(x=>x.cat===curCat);if(curSearch){const k=curSearch.toLowerCase();d=d.filter(x=>(x.name||'').toLowerCase().includes(k));}if(!d.length){g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-light);"><p style="font-size:3rem;">🔍</p><p>没有找到</p></div>';return;}const bgs=['#fef5e7','#fdecea','#edf7f0','#e8f4fd','#fdf2f8','#f5f0e8','#e8f8f5','#fef9e7'];g.innerHTML=d.map(dd=>{const ic=cart.find(c=>c.id===dd.id),q=ic?ic.qty:0;return`<div class="menu-card"><div class="menu-card-img" style="${dd.image?'':'background:'+bgs[Math.abs(dd.id?.length||0)%bgs.length]}">${dd.image?`<img src="${dd.image}" loading="lazy">`:dd.emoji||'🍽️'}</div><div class="menu-card-body"><div class="menu-card-name">${esc(dd.name)}</div><div class="menu-card-desc">${esc(dd.desc)}</div><div class="menu-card-footer"><div class="menu-card-price"><span class="unit">¥</span>${dd.price}</div>${q>0?`<div class="menu-card-qty"><button onclick="event.stopPropagation();cQ('${dd.id}',-1)">−</button><span class="qty-num">${q}</span><button onclick="event.stopPropagation();cQ('${dd.id}',1)">+</button></div>`:`<button class="menu-card-add" onclick="event.stopPropagation();aTC('${dd.id}')">+</button>`}</div></div></div>`;}).join('');}
function filterMenu(){curSearch=document.getElementById('searchInput').value.trim();rMenu();}

// === 购物车(localStorage) ===
function loadCart(){try{cart=JSON.parse(localStorage.getItem('fm_cart')||'[]');}catch(e){cart=[];}}
function saveCart(){localStorage.setItem('fm_cart',JSON.stringify(cart));}
function aTC(id){const d=menu.find(x=>x.id===id);if(!d)return;const m=document.getElementById('memberSelect').value;if(!m){toast('⚠️ 请选点菜人');return;}const ex=cart.find(c=>c.id===id&&c.member===m);if(ex)ex.qty++;else cart.push({id,name:d.name,price:d.price,emoji:d.emoji,image:d.image||'',qty:1,member:m});saveCart();rMenu();rCartBadge();rCartPanel();}
function cQ(id,d){const m=document.getElementById('memberSelect').value,it=cart.find(c=>c.id===id&&c.member===m);if(!it)return;it.qty+=d;if(it.qty<=0)cart=cart.filter(c=>!(c.id===id&&c.member===m));saveCart();rMenu();rCartBadge();rCartPanel();}
function cCQ(id,member,d){const it=cart.find(c=>c.id===id&&c.member===member);if(!it)return;it.qty+=d;if(it.qty<=0)cart=cart.filter(c=>!(c.id===id&&c.member===member));saveCart();rMenu();rCartBadge();rCartPanel();}
function tC(){return cart.reduce((s,c)=>s+c.qty,0);}
function tP(){return cart.reduce((s,c)=>s+c.price*c.qty,0);}
function rCartBadge(){const c=tC(),b=document.getElementById('cartBadge');b.textContent=c;b.style.display=c>0?'flex':'none';}
function toggleCart(){const p=document.getElementById('cartPanel'),o=document.getElementById('cartOverlay');if(p.classList.contains('open'))closeCart();else{rCartPanel();o.classList.add('open');p.classList.add('open');}}
function closeCart(){document.getElementById('cartOverlay').classList.remove('open');document.getElementById('cartPanel').classList.remove('open');}
function rCartPanel(){const l=document.getElementById('cartList'),e=document.getElementById('cartEmpty'),f=document.getElementById('cartFooter');if(!cart.length){l.innerHTML='';l.style.display='none';e.style.display='flex';f.classList.remove('show');}else{l.style.display='block';e.style.display='none';f.classList.add('show');l.innerHTML=cart.map(c=>`<div class="cart-item"><div class="cart-item-img">${c.image?`<img src="${c.image}">`:c.emoji||'🍽️'}</div><div class="cart-item-info"><div class="cart-item-name">${esc(c.name)}</div><div class="cart-item-member">👤 ${esc(c.member)}</div><div class="cart-item-price">¥${c.price*c.qty}</div></div><div class="cart-item-qty"><button onclick="cCQ('${c.id}','${escJs(c.member)}',-1)">−</button><span>${c.qty}</span><button onclick="cCQ('${c.id}','${escJs(c.member)}',1)">+</button></div></div>`).join('');}document.getElementById('cartCount').textContent=tC();document.getElementById('cartTotal').textContent=tP();}

// === 订单 ===
function submitOrder(){if(!cart.length){toast('⚠️ 购物车空');return;}const g={};cart.forEach(c=>{if(!g[c.member])g[c.member]=[];g[c.member].push(c);});let h='';for(const[m,items]of Object.entries(g)){h+=`<p style="font-weight:600;margin:12px 0 4px;">👤 ${esc(m)}</p><ul class="confirm-list">`;items.forEach(c=>{h+=`<li><span class="dish-info"><span class="confirm-item-img">${c.image?`<img src="${c.image}">`:c.emoji||'🍽️'}</span>${esc(c.name)} ×${c.qty}</span><span style="color:var(--primary);font-weight:600;">¥${c.price*c.qty}</span></li>`;});h+='</ul>';}h+=`<div class="confirm-total">合计：<span>¥${tP()}</span></div>`;document.getElementById('confirmBody').innerHTML=h;document.getElementById('confirmModal').classList.add('open');}
function closeModal(){document.getElementById('confirmModal').classList.remove('open');}
async function confirmOrder(){const note=document.getElementById('cartNote').value.trim();try{await saveO('Order',{items:[...cart],total:tP(),note,famId,createdAt:new Date().toISOString()});cart=[];document.getElementById('cartNote').value='';saveCart();closeCart();closeModal();await refreshAll();rCartBadge();rCartPanel();toast('🎉 下单成功');}catch(e){toast('⚠️ 下单失败');}}
function rHist(){const l=document.getElementById('historyList');if(!orders.length){l.innerHTML='<div class="history-empty"><p>📋</p><p>暂无订单</p></div>';return;}l.innerHTML=[...orders].reverse().map(o=>{const t=(o.items||[]).map(c=>`<span class="history-tag">${c.image?'🖼️':c.emoji||'🍽️'} ${esc(c.name)}×${c.qty}</span>`).join(''),ms=[...new Set((o.items||[]).map(c=>c.member))].join('、'),time=o.createdAt?new Date(o.createdAt).toLocaleString('zh-CN'):'';return`<div class="history-card"><div class="history-card-header"><span>📅 ${time}</span><span>👤 ${esc(ms)}</span></div><div class="history-card-dishes">${t}</div>${o.note?`<div class="order-note">📝 ${esc(o.note)}</div>`:''}<div class="history-card-footer">¥${o.total}</div></div>`;}).join('');}
async function clearHistory(){if(!orders.length)return;if(!confirm('清空全部订单？'))return;for(const o of orders)await deleteO('Order',o.id);await refreshAll();toast('🗑️ 已清空');}

// === Tab ===
function switchTab(t){document.querySelectorAll('#mainScreen .tab').forEach(x=>x.classList.remove('active'));document.getElementById(t+'Tab')?.classList.add('active');document.querySelectorAll('.btn-icon.active-nav').forEach(b=>b.classList.remove('active-nav'));if(t==='manage'){document.getElementById('btnManage')?.classList.add('active-nav');rMDishes();rMCats();rMMems();}if(t==='history'){document.getElementById('btnHistory')?.classList.add('active-nav');rHist();}window.scrollTo({top:0,behavior:'smooth'});}
setInterval(()=>{if(famId&&document.getElementById('mainScreen').classList.contains('active'))refreshAll();},30000);

// === 管理渲染 ===
function rMDishes(){const l=document.getElementById('mDishList');document.getElementById('dishCount').textContent=`共 ${menu.length} 道菜`;if(!menu.length){l.innerHTML='<div class="history-empty"><p>🍽️</p><p>暂无菜品</p></div>';return;}const g={};menu.forEach(d=>{if(!g[d.cat])g[d.cat]=[];g[d.cat].push(d);});let h='';for(const[cat,dishes]of Object.entries(g)){const ce=(cats.find(c=>c.name===cat)||{}).emoji||'📂';h+=`<p style="font-weight:700;margin:16px 0 6px;font-size:0.9rem;color:var(--text-light);">${ce} ${esc(cat)} (${dishes.length})</p>`;dishes.forEach(d=>{h+=`<div class="manage-dish-item"><div class="manage-dish-thumb">${d.image?`<img src="${d.image}">`:d.emoji||'🍽️'}</div><div class="manage-dish-info"><div class="manage-dish-name">${esc(d.name)}</div><div class="manage-dish-meta"><span class="cat-tag">${esc(d.cat)}</span>${esc(d.desc)}</div></div><div class="manage-dish-price">¥${d.price}</div><div class="manage-dish-actions"><button class="btn-icon-sm" onclick="openDishForm('${d.id}')">✏️</button><button class="btn-icon-sm danger" onclick="deleteDish('${d.id}')">🗑️</button></div></div>`;});}l.innerHTML=h;}
function rMCats(){const l=document.getElementById('mCatList');if(!cats.length){l.innerHTML='<div class="history-empty"><p>📂</p><p>暂无分类</p></div>';return;}l.innerHTML=cats.map(c=>`<div class="manage-cat-item"><div class="manage-cat-emoji">${esc(c.emoji)}</div><div class="manage-cat-info"><div class="manage-cat-name">${esc(c.name)}</div><div class="manage-cat-count">${menu.filter(d=>d.cat===c.name).length} 道</div></div><div class="manage-cat-actions"><button class="btn-icon-sm" onclick="openCatForm('${escJs(c.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="deleteCat('${escJs(c.name)}')">🗑️</button></div></div>`).join('');}
function rMMems(){const l=document.getElementById('mMemList');if(!mems.length){l.innerHTML='<div class="history-empty"><p>👨‍👩‍👧‍👦</p><p>暂无家人</p></div>';return;}const av=['👨','👩','👴','👵','👦','👧','🧑','👶','🧒'];l.innerHTML=mems.map((m,i)=>`<div class="manage-member-item"><div class="manage-member-avatar">${m.avatar?`<img src="${m.avatar}">`:av[i%av.length]}</div><div class="manage-member-name">${esc(m.name)}</div><div class="manage-member-actions"><button class="btn-icon-sm" onclick="openMemForm('${escJs(m.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="deleteMem('${escJs(m.name)}')">🗑️</button></div></div>`).join('');}

// === 图片 ===
function ci(f,mw,mh,q){return new Promise((resolve,reject)=>{if(!f.type.startsWith('image/'))return reject(new Error('非图片'));const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{let w=img.width,h=img.height;if(w>mw){h*=mw/w;w=mw;}if(h>mh){w*=mh/h;h=mh;}const c=document.createElement('canvas');c.width=Math.round(w);c.height=Math.round(h);c.getContext('2d').drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',q));};img.onerror=()=>reject(new Error('失败'));img.src=e.target.result;};r.onerror=()=>reject(new Error('失败'));r.readAsDataURL(f);});}
async function upImg(f){if(!f)return'';const avf=new AV.File(f.name,f);const s=await avf.save();return s.url();}

// === 菜品 CRUD ===
function openDishForm(id){tDI='';tDIF=null;document.getElementById('dfCat').innerHTML=cats.map(c=>`<option value="${esc(c.name)}">${c.emoji} ${esc(c.name)}</option>`).join('');if(id){const d=menu.find(x=>x.id===id);if(!d)return;document.getElementById('dishTitle').textContent='✏️ 编辑';document.getElementById('dfId').value=d.id;document.getElementById('dfName').value=d.name;document.getElementById('dfCat').value=d.cat;document.getElementById('dfPrice').value=d.price;document.getElementById('dfEm').value=d.emoji;document.getElementById('dfDesc').value=d.desc;document.getElementById('emPrev').textContent=d.emoji||'🥘';if(d.image){tDI=d.image;document.getElementById('diPrev').innerHTML=`<img src="${d.image}">`;document.getElementById('diPrev').classList.add('has-image');document.getElementById('diClr').style.display='inline-block';}else clDi();}else{document.getElementById('dishTitle').textContent='🍽️ 添加';document.getElementById('dfId').value='';['dfName','dfEm','dfDesc'].forEach(x=>document.getElementById(x).value='');document.getElementById('dfPrice').value='';document.getElementById('dfCat').value=cats[0]?.name||'';document.getElementById('emPrev').textContent='🥘';clDi();}document.getElementById('dishModal').classList.add('open');}
async function hDi(e){const f=e.target.files[0];if(!f)return;tDIF=f;try{tDI=await ci(f,400,300,0.7);document.getElementById('diPrev').innerHTML=`<img src="${tDI}">`;document.getElementById('diPrev').classList.add('has-image');document.getElementById('diClr').style.display='inline-block';}catch(er){toast('⚠️ '+er.message);}e.target.value='';}
function clDi(){document.getElementById('diPrev').innerHTML='<span class="image-placeholder">🥘</span>';document.getElementById('diPrev').classList.remove('has-image');document.getElementById('diClr').style.display='none';}
function clearDi(){tDI='';tDIF=null;clDi();}
function closeDishModal(){document.getElementById('dishModal').classList.remove('open');}
async function saveDish(){const id=document.getElementById('dfId').value,n=document.getElementById('dfName').value.trim(),cat=document.getElementById('dfCat').value,pr=parseInt(document.getElementById('dfPrice').value),em=document.getElementById('dfEm').value.trim(),desc=document.getElementById('dfDesc').value.trim();if(!n){toast('⚠️ 请输入菜名');return;}if(!cat){toast('⚠️ 请选分类');return;}if(isNaN(pr)||pr<0){toast('⚠️ 请输入价格');return;}showL('⏳ 保存中...');try{let img=tDI;if(tDIF)img=await upImg(tDIF);const data={name:n,cat,price:pr,emoji:em||'🍽️',desc:desc||n,image:img,famId};if(id){await updateO('Dish',id,data);}else{await saveO('Dish',{...data,sort:nextId++});}closeDishModal();await refreshAll();}catch(e){toast('⚠️ 保存失败');}}
async function deleteDish(id){const d=menu.find(x=>x.id===id);if(!d||!confirm(`删除「${d.name}」？`))return;try{await deleteO('Dish',id);cart=cart.filter(c=>c.id!==id);saveCart();await refreshAll();rCartBadge();rCartPanel();}catch(e){toast('⚠️ 删除失败');}}

// === 分类 CRUD ===
function openCatForm(on){if(on){const c=cats.find(x=>x.name===on);if(!c)return;document.getElementById('catTitle').textContent='✏️ 编辑';document.getElementById('cfOld').value=on;document.getElementById('cfName').value=on;document.getElementById('cfEm').value=c.emoji;document.getElementById('cfEmPrev').textContent=c.emoji||'📂';}else{document.getElementById('catTitle').textContent='📂 添加';document.getElementById('cfOld').value='';document.getElementById('cfName').value='';document.getElementById('cfEm').value='';document.getElementById('cfEmPrev').textContent='📂';}document.getElementById('catModal').classList.add('open');}
function closeCatModal(){document.getElementById('catModal').classList.remove('open');}
async function saveCat(){const on=document.getElementById('cfOld').value.trim(),nn=document.getElementById('cfName').value.trim(),em=document.getElementById('cfEm').value.trim();if(!nn){toast('⚠️ 请输入名称');return;}try{if(on){const c=cats.find(x=>x.name===on);if(!c)return;if(on!==nn&&cats.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}await updateO('Category',c.id,{name:nn,emoji:em||'📂'});for(const d of menu.filter(x=>x.cat===on))await updateO('Dish',d.id,{cat:nn});}else{if(cats.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}await saveO('Category',{name:nn,emoji:em||'📂',famId});}closeCatModal();await refreshAll();}catch(e){toast('⚠️ 保存失败');}}
async function deleteCat(n){const ct=menu.filter(d=>d.cat===n).length;if(!confirm(`删除「${n}」？${ct>0?`\n${ct}道菜将移到其他分类`:''}`))return;try{const c=cats.find(x=>x.name===n);const fb=cats.find(x=>x.name!==n)?.name||'';for(const d of menu.filter(x=>x.cat===n))await updateO('Dish',d.id,{cat:fb});await deleteO('Category',c.id);await refreshAll();}catch(e){toast('⚠️ 删除失败');}}

// === 成员 CRUD ===
function openMemForm(on){tMA='';tMAF=null;if(on){const m=mems.find(x=>x.name===on);if(!m)return;document.getElementById('memTitle').textContent='✏️ 编辑';document.getElementById('mfOld').value=on;document.getElementById('mfName').value=on;if(m.avatar){tMA=m.avatar;document.getElementById('maPrev').innerHTML=`<img src="${m.avatar}">`;document.getElementById('maPrev').classList.add('has-image');document.getElementById('maClr').style.display='inline-block';}else clMa();}else{document.getElementById('memTitle').textContent='👤 添加';document.getElementById('mfOld').value='';document.getElementById('mfName').value='';clMa();}document.getElementById('memberModal').classList.add('open');}
async function hMa(e){const f=e.target.files[0];if(!f)return;tMAF=f;try{tMA=await ci(f,200,200,0.7);document.getElementById('maPrev').innerHTML=`<img src="${tMA}">`;document.getElementById('maPrev').classList.add('has-image');document.getElementById('maClr').style.display='inline-block';}catch(er){toast('⚠️ '+er.message);}e.target.value='';}
function clMa(){document.getElementById('maPrev').innerHTML='<span class="avatar-placeholder">👤</span>';document.getElementById('maPrev').classList.remove('has-image');document.getElementById('maClr').style.display='none';}
function clearMa(){tMA='';tMAF=null;clMa();}
function closeMemModal(){document.getElementById('memberModal').classList.remove('open');}
async function saveMem(){const on=document.getElementById('mfOld').value.trim(),nn=document.getElementById('mfName').value.trim();if(!nn){toast('⚠️ 请输入称呼');return;}try{let av=tMA;if(tMAF)av=await upImg(tMAF);if(on){const m=mems.find(x=>x.name===on);if(!m)return;if(on!==nn&&mems.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}await updateO('Member',m.id,{name:nn,avatar:av});cart.forEach(c=>{if(c.member===on)c.member=nn;});saveCart();}else{if(mems.some(x=>x.name===nn)){toast('⚠️ 已存在');return;}await saveO('Member',{name:nn,avatar:av,famId});}closeMemModal();await refreshAll();}catch(e){toast('⚠️ 保存失败');}}
async function deleteMem(n){if(!confirm(`删除「${n}」？`))return;try{const m=mems.find(x=>x.name===n);await deleteO('Member',m.id);cart=cart.filter(c=>c.member!==n);saveCart();await refreshAll();rCartBadge();rCartPanel();}catch(e){toast('⚠️ 删除失败');}}

// === 工具 ===
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2000);}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
function escJs(s){return(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
