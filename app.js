// ============================================================
//  家庭点菜 — IndexedDB 版
//  零后端 · 大容量存储 · 图片不丢失 · PIN 密码保护
// ============================================================

// === 默认数据 ===
const DEF_CATS = [{name:'凉菜',emoji:'🧊'},{name:'热菜',emoji:'🍳'},{name:'汤类',emoji:'🍲'},{name:'主食',emoji:'🍚'},{name:'饮品',emoji:'🥤'}];
const DEF_MEMBERS = [{name:'爸爸',avatar:''},{name:'妈妈',avatar:''},{name:'爷爷',avatar:''},{name:'奶奶',avatar:''},{name:'大宝',avatar:''},{name:'小宝',avatar:''}];
const DEF_MENU = [
  {id:1,name:'拍黄瓜',cat:'凉菜',price:12,emoji:'🥒',image:'',desc:'清爽脆嫩，蒜香十足'},
  {id:2,name:'凉拌木耳',cat:'凉菜',price:15,emoji:'🍄',image:'',desc:'爽口开胃，营养丰富'},
  {id:3,name:'皮蛋豆腐',cat:'凉菜',price:14,emoji:'🥚',image:'',desc:'嫩滑豆腐配松花蛋'},
  {id:4,name:'口水鸡',cat:'凉菜',price:28,emoji:'🍗',image:'',desc:'麻辣鲜香，鸡肉嫩滑'},
  {id:5,name:'酱牛肉',cat:'凉菜',price:32,emoji:'🥩',image:'',desc:'酱香浓郁，肉质紧实'},
  {id:6,name:'糖拌西红柿',cat:'凉菜',price:10,emoji:'🍅',image:'',desc:'酸甜清爽，童年味道'},
  {id:7,name:'红烧排骨',cat:'热菜',price:38,emoji:'🦴',image:'',desc:'软烂入味，酱汁浓郁'},
  {id:8,name:'鱼香肉丝',cat:'热菜',price:26,emoji:'🐟',image:'',desc:'经典川菜，酸甜微辣'},
  {id:9,name:'宫保鸡丁',cat:'热菜',price:28,emoji:'🐔',image:'',desc:'花生脆香，鸡肉滑嫩'},
  {id:10,name:'糖醋里脊',cat:'热菜',price:30,emoji:'🍖',image:'',desc:'外酥里嫩，酸甜可口'},
  {id:11,name:'麻婆豆腐',cat:'热菜',price:18,emoji:'🧈',image:'',desc:'麻辣烫香，下饭神器'},
  {id:12,name:'清炒时蔬',cat:'热菜',price:16,emoji:'🥬',image:'',desc:'时令蔬菜，清淡健康'},
  {id:13,name:'回锅肉',cat:'热菜',price:28,emoji:'🥓',image:'',desc:'肥而不腻，香气扑鼻'},
  {id:14,name:'干煸四季豆',cat:'热菜',price:18,emoji:'🫘',image:'',desc:'干香微辣，下饭好菜'},
  {id:15,name:'番茄炒蛋',cat:'热菜',price:15,emoji:'🍳',image:'',desc:'国民家常菜，酸甜开胃'},
  {id:16,name:'番茄蛋花汤',cat:'汤类',price:12,emoji:'🥣',image:'',desc:'清淡鲜美，开胃暖身'},
  {id:17,name:'酸辣汤',cat:'汤类',price:14,emoji:'🌶️',image:'',desc:'酸辣开胃，暖身驱寒'},
  {id:18,name:'排骨玉米汤',cat:'汤类',price:25,emoji:'🌽',image:'',desc:'清甜滋补，老少皆宜'},
  {id:19,name:'紫菜蛋花汤',cat:'汤类',price:10,emoji:'🫧',image:'',desc:'简单快手，鲜美可口'},
  {id:20,name:'白米饭',cat:'主食',price:3,emoji:'🍚',image:'',desc:'香喷喷的白米饭'},
  {id:21,name:'蛋炒饭',cat:'主食',price:12,emoji:'🍛',image:'',desc:'粒粒分明，香气十足'},
  {id:22,name:'手工水饺',cat:'主食',price:22,emoji:'🥟',image:'',desc:'皮薄馅大，鲜嫩多汁'},
  {id:23,name:'番茄鸡蛋面',cat:'主食',price:14,emoji:'🍜',image:'',desc:'家常味道，暖心暖胃'},
  {id:24,name:'馒头',cat:'主食',price:2,emoji:'🥖',image:'',desc:'松软白馒头'},
  {id:25,name:'可乐',cat:'饮品',price:5,emoji:'🥤',image:'',desc:'冰爽可乐'},
  {id:26,name:'雪碧',cat:'饮品',price:5,emoji:'🧊',image:'',desc:'清爽柠檬味'},
  {id:27,name:'橙汁',cat:'饮品',price:8,emoji:'🍊',image:'',desc:'鲜榨橙汁'},
  {id:28,name:'王老吉',cat:'饮品',price:6,emoji:'🫖',image:'',desc:'怕上火喝王老吉'},
  {id:29,name:'酸梅汤',cat:'饮品',price:5,emoji:'🫗',image:'',desc:'消暑解腻，酸甜可口'},
];
const EMOJIS = '🥒🍄🥚🍗🥩🍅🦴🐟🐔🍖🧈🥬🥓🍳🥣🌶️🌽🫧🍚🍛🥟🍜🥖🥤🧊🍊🥛🫖🫗🍕🍔🌭🥗🍝🌮🍣🍤🍰🍉🥦🥕🧅🧄🍞🧀🦐🦀🍲🥘'.split('');

// === IndexedDB ===
const DB_NAME='FamilyMealDB', DB_VER=1;
function idb(){return new Promise((r,e)=>{const q=indexedDB.open(DB_NAME,DB_VER);q.onupgradeneeded=ev=>{const db=ev.target.result;if(!db.objectStoreNames.contains('store'))db.createObjectStore('store');};q.onsuccess=ev=>r(ev.target.result);q.onerror=ev=>e(ev.target.error);});}
async function dbGet(key){const db=await idb();return new Promise((r,e)=>{const t=db.transaction('store','readonly'),s=t.objectStore('store'),q=s.get(key);q.onsuccess=()=>r(q.result);q.onerror=()=>e(q.error);});}
async function dbSet(key,val){const db=await idb();return new Promise((r,e)=>{const t=db.transaction('store','readwrite'),s=t.objectStore('store'),q=s.put(val,key);q.onsuccess=()=>r();q.onerror=()=>e(q.error);});}
async function dbDel(key){const db=await idb();return new Promise((r,e)=>{const t=db.transaction('store','readwrite'),s=t.objectStore('store'),q=s.delete(key);q.onsuccess=()=>r();q.onerror=()=>e(q.error);});}

function dCopy(o){return JSON.parse(JSON.stringify(o));}

// === 状态 ===
let menuData=[], categories=[], members=[], orders=[], cart=[];
let currentCat='all', currentSearch='', currentManageTab='dishes', nextId=1000;
let tempDishImage='', tempMemberAvatar='';
let isLockSetup=false;

// === 图片压缩 ===
function compressImg(file, mw, mh, q){
  return new Promise((resolve,reject)=>{
    if(!file.type.startsWith('image/'))return reject(new Error('非图片'));
    const r=new FileReader();
    r.onload=e=>{const img=new Image();img.onload=()=>{let w=img.width,h=img.height;if(w>mw){h*=mw/w;w=mw;}if(h>mh){w*=mh/h;h=mh;}const c=document.createElement('canvas');c.width=Math.round(w);c.height=Math.round(h);c.getContext('2d').drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',q));};img.onerror=()=>reject(new Error('加载失败'));img.src=e.target.result;};
    r.onerror=()=>reject(new Error('读取失败'));r.readAsDataURL(file);
  });
}

// === PIN 锁 ===
async function initLock(){
  const pin=await dbGet('family_pin');
  if(!pin){isLockSetup=true;document.getElementById('lockSetupMsg').style.display='block';document.getElementById('lockEnterMsg').style.display='none';document.getElementById('lockPin2Group').style.display='block';}
  else{isLockSetup=false;document.getElementById('lockSetupMsg').style.display='none';document.getElementById('lockEnterMsg').style.display='block';document.getElementById('lockPin2Group').style.display='none';}
  showScreen('lockScreen');
}

async function handleLock(){
  const p1=document.getElementById('lockPin').value.trim();
  const errEl=document.getElementById('lockError');errEl.classList.remove('show');
  if(!p1){errEl.textContent='请输入密码';errEl.classList.add('show');return;}
  if(isLockSetup){
    const p2=document.getElementById('lockPin2').value.trim();
    if(p1!==p2){errEl.textContent='两次输入不一致';errEl.classList.add('show');return;}
    await dbSet('family_pin',p1);
    showToast('✅ 密码已设置');
    startApp();
  }else{
    const saved=await dbGet('family_pin');
    if(p1!==saved){errEl.textContent='密码错误';errEl.classList.add('show');return;}
    startApp();
  }
}

async function resetLock(){
  if(!confirm('⚠️ 重置密码会清空所有数据！\n\n确定要继续吗？'))return;
  await dbDel('family_pin');
  await dbDel('menu');await dbDel('categories');await dbDel('members');await dbDel('orders');
  document.getElementById('lockPin').value='';
  document.getElementById('lockPin2').value='';
  initLock();
}

async function changePin(){
  const np=document.getElementById('newPin').value.trim();
  if(!np){showToast('⚠️ 请输入新密码');return;}
  await dbSet('family_pin',np);
  document.getElementById('newPin').value='';
  showToast('✅ 密码已修改');
}

// === 启动 ===
async function startApp(){
  await loadAllData();
  renderAll();
  showScreen('mainScreen');
  document.getElementById('lockPin').value='';
  document.getElementById('lockPin2').value='';
}

async function loadAllData(){
  menuData=await dbGet('menu')||dCopy(DEF_MENU);
  categories=await dbGet('categories')||dCopy(DEF_CATS);
  const rm=await dbGet('members');
  if(rm){members=(typeof rm[0]==='string')?rm.map(n=>({name:n,avatar:''})):rm;}
  else members=dCopy(DEF_MEMBERS);
  orders=await dbGet('orders')||[];
  // 修复旧数据：补 id
  let ns=false,mx=0;
  menuData.forEach(d=>{if(!d.id&&d.id!==0){d.id=++mx;ns=true;}else if(d.id>mx)mx=d.id;});
  nextId=mx>=999?mx+1:1000;
  if(ns)await dbSet('menu',menuData);
  // 清理无效购物车条目
  const ids=new Set(menuData.map(d=>d.id));
  const cb=cart.length;
  cart=cart.filter(c=>ids.has(c.id));
  if(cart.length!==cb)saveCart();
}
async function saveAll(){
  await dbSet('menu',menuData);await dbSet('categories',categories);
  await dbSet('members',members);await dbSet('orders',orders);
}
function loadCart(){try{cart=JSON.parse(localStorage.getItem('fm_cart')||'[]');}catch(e){cart=[];}}
function saveCart(){localStorage.setItem('fm_cart',JSON.stringify(cart));}

// === 渲染 ===
function renderAll(){renderMemberSelect();renderCategoryNav();renderMenu();updateCartBadge();updateCartPanel();renderHistory();}
function renderMemberSelect(){
  const s=document.getElementById('memberSelect'),v=s.value;
  s.innerHTML='<option value="">-- 选择家人 --</option>'+members.filter(m=>m.name).map(m=>`<option value="${esc(m.name)}">${esc(m.name)}</option>`).join('');
  if(members.some(m=>m.name===v))s.value=v;onMemberChange();
}
function onMemberChange(){
  const m=members.find(x=>x.name===document.getElementById('memberSelect').value);
  document.getElementById('memberAvatarPreview').innerHTML=m&&m.avatar?`<img src="${m.avatar}">`:'👤';
}
function renderCategoryNav(){
  document.getElementById('categoryNav').innerHTML='<button class="cat-btn active" data-cat="all">🔥 全部</button>'+categories.map(c=>`<button class="cat-btn" data-cat="${esc(c.name)}">${c.emoji} ${esc(c.name)}</button>`).join('');
}
function renderMenu(){
  const g=document.getElementById('menuGrid');let d=menuData;
  if(currentCat!=='all')d=d.filter(x=>x.cat===currentCat);
  if(currentSearch){const k=currentSearch.toLowerCase();d=d.filter(x=>(x.name||'').toLowerCase().includes(k)||(x.cat||'').toLowerCase().includes(k));}
  if(!d.length){g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--text-light);"><p style="font-size:3rem;">🔍</p><p>没有找到</p></div>';return;}
  const bgs=['#fef5e7','#fdecea','#edf7f0','#e8f4fd','#fdf2f8','#f5f0e8','#e8f8f5','#fef9e7'];
  g.innerHTML=d.map(dd=>{const ic=cart.find(c=>c.id===dd.id),q=ic?ic.qty:0;return`<div class="menu-card"><div class="menu-card-img" style="${dd.image?'':'background:'+bgs[Math.abs(dd.id||0)%bgs.length]}">${dd.image?`<img src="${dd.image}" loading="lazy">`:dd.emoji||'🍽️'}</div><div class="menu-card-body"><div class="menu-card-name">${esc(dd.name)}</div><div class="menu-card-desc">${esc(dd.desc)}</div><div class="menu-card-footer"><div class="menu-card-price"><span class="unit">¥</span>${dd.price}</div>${q>0?`<div class="menu-card-qty"><button onclick="event.stopPropagation();changeQty(${dd.id},-1)">−</button><span class="qty-num">${q}</span><button onclick="event.stopPropagation();changeQty(${dd.id},1)">+</button></div>`:`<button class="menu-card-add" onclick="event.stopPropagation();addToCart(${dd.id})">+</button>`}</div></div></div>`;}).join('');
}
function filterMenu(){currentSearch=document.getElementById('searchInput').value.trim();renderMenu();}

// === 购物车 ===
function addToCart(id){const d=menuData.find(x=>x.id===id);if(!d)return;const m=document.getElementById('memberSelect').value;if(!m){showToast('⚠️ 请选点菜人');return;}const ex=cart.find(c=>c.id===id&&c.member===m);if(ex)ex.qty++;else cart.push({id:d.id,name:d.name,price:d.price,emoji:d.emoji,image:d.image||'',qty:1,member:m});saveCart();renderMenu();updateCartBadge();updateCartPanel();}
function changeQty(id,d){const m=document.getElementById('memberSelect').value,it=cart.find(c=>c.id===id&&c.member===m);if(!it)return;it.qty+=d;if(it.qty<=0)cart=cart.filter(c=>!(c.id===id&&c.member===m));saveCart();renderMenu();updateCartBadge();updateCartPanel();}
function changeCartQty(id,member,d){const it=cart.find(c=>c.id===id&&c.member===member);if(!it)return;it.qty+=d;if(it.qty<=0)cart=cart.filter(c=>!(c.id===id&&c.member===member));saveCart();renderMenu();updateCartBadge();updateCartPanel();}
function totalCount(){return cart.reduce((s,c)=>s+c.qty,0);}
function totalPrice(){return cart.reduce((s,c)=>s+c.price*c.qty,0);}
function updateCartBadge(){const c=totalCount(),b=document.getElementById('cartBadge');b.textContent=c;b.style.display=c>0?'flex':'none';}
function toggleCart(){const p=document.getElementById('cartPanel'),o=document.getElementById('cartOverlay');if(p.classList.contains('open'))closeCart();else{updateCartPanel();o.classList.add('open');p.classList.add('open');}}
function closeCart(){document.getElementById('cartOverlay').classList.remove('open');document.getElementById('cartPanel').classList.remove('open');}
function updateCartPanel(){
  const l=document.getElementById('cartList'),e=document.getElementById('cartEmpty'),f=document.getElementById('cartFooter');
  if(!cart.length){l.innerHTML='';l.style.display='none';e.style.display='flex';f.classList.remove('show');}
  else{l.style.display='block';e.style.display='none';f.classList.add('show');l.innerHTML=cart.map(c=>`<div class="cart-item"><div class="cart-item-img">${c.image?`<img src="${c.image}">`:c.emoji||'🍽️'}</div><div class="cart-item-info"><div class="cart-item-name">${esc(c.name)}</div><div class="cart-item-member">👤 ${esc(c.member)}</div><div class="cart-item-price">¥${c.price*c.qty}</div></div><div class="cart-item-qty"><button onclick="changeCartQty(${c.id},'${escJs(c.member)}',-1)">−</button><span>${c.qty}</span><button onclick="changeCartQty(${c.id},'${escJs(c.member)}',1)">+</button></div></div>`).join('');}
  document.getElementById('cartCount').textContent=totalCount();document.getElementById('cartTotal').textContent=totalPrice();
}

// === 订单 ===
function submitOrder(){
  if(!cart.length){showToast('⚠️ 购物车是空的');return;}
  const g={};cart.forEach(c=>{if(!g[c.member])g[c.member]=[];g[c.member].push(c);});
  let h='';for(const[m,items]of Object.entries(g)){h+=`<p style="font-weight:600;margin:12px 0 4px;">👤 ${esc(m)}</p><ul class="confirm-list">`;items.forEach(c=>{h+=`<li><span class="dish-info"><span class="confirm-item-img">${c.image?`<img src="${c.image}">`:c.emoji||'🍽️'}</span>${esc(c.name)} ×${c.qty}</span><span style="color:var(--primary);font-weight:600;">¥${c.price*c.qty}</span></li>`;});h+='</ul>';}
  h+=`<div class="confirm-total">合计：<span>¥${totalPrice()}</span></div>`;document.getElementById('confirmBody').innerHTML=h;
  const note=document.getElementById('cartNote').value.trim();
  document.getElementById('confirmNoteDisplay').innerHTML=note?`<div class="order-note">📝 ${esc(note)}</div>`:'';
  document.getElementById('confirmModal').classList.add('open');
}
function closeModal(){document.getElementById('confirmModal').classList.remove('open');}
async function confirmOrder(){
  const note=document.getElementById('cartNote').value.trim();
  orders.unshift({id:Date.now(),time:new Date().toLocaleString('zh-CN'),items:[...cart],total:totalPrice(),note});
  cart=[];document.getElementById('cartNote').value='';
  saveCart();await saveAll();closeCart();closeModal();updateCartBadge();updateCartPanel();renderHistory();showToast('🎉 下单成功');
}
function renderHistory(){
  const l=document.getElementById('historyList');
  if(!orders.length){l.innerHTML='<div class="history-empty"><p>📋</p><p>暂无订单</p></div>';return;}
  l.innerHTML=orders.map(o=>{const t=(o.items||[]).map(c=>`<span class="history-tag">${c.image?'🖼️':c.emoji||'🍽️'} ${esc(c.name)}×${c.qty}</span>`).join(''),ms=[...new Set((o.items||[]).map(c=>c.member))].join('、');return`<div class="history-card"><div class="history-card-header"><span>📅 ${o.time}</span><span>👤 ${esc(ms)}</span></div><div class="history-card-dishes">${t}</div>${o.note?`<div class="order-note">📝 ${esc(o.note)}</div>`:''}<div class="history-card-footer">¥${o.total}</div></div>`;}).join('');
}
async function clearHistory(){if(!orders.length)return;if(confirm('清空全部订单？')){orders=[];await saveAll();renderHistory();showToast('🗑️ 已清空');}}

// === Tab ===
function switchTab(t){
  document.querySelectorAll('#mainScreen .tab').forEach(x=>x.classList.remove('active'));document.getElementById(t+'Tab')?.classList.add('active');
  document.querySelectorAll('.btn-icon.active-nav').forEach(b=>b.classList.remove('active-nav'));
  if(t==='manage'){document.getElementById('btnManage')?.classList.add('active-nav');renderManageDishes();renderManageCategories();renderManageMembers();}
  if(t==='history'){document.getElementById('btnHistory')?.classList.add('active-nav');renderHistory();}
  window.scrollTo({top:0,behavior:'smooth'});
}

// === 管理渲染 ===
function renderManageDishes(){
  const l=document.getElementById('manageDishList');document.getElementById('dishCount').textContent=`共 ${menuData.length} 道菜`;
  if(!menuData.length){l.innerHTML='<div class="history-empty"><p>🍽️</p><p>暂无菜品</p></div>';return;}
  const g={};menuData.forEach(d=>{if(!g[d.cat])g[d.cat]=[];g[d.cat].push(d);});
  let h='';for(const[cat,dishes]of Object.entries(g)){const ce=(categories.find(c=>c.name===cat)||{}).emoji||'📂';h+=`<p style="font-weight:700;margin:16px 0 6px;font-size:0.9rem;color:var(--text-light);">${ce} ${esc(cat)} (${dishes.length})</p>`;dishes.forEach(d=>{h+=`<div class="manage-dish-item"><div class="manage-dish-thumb">${d.image?`<img src="${d.image}">`:d.emoji||'🍽️'}</div><div class="manage-dish-info"><div class="manage-dish-name">${esc(d.name)}</div><div class="manage-dish-meta"><span class="cat-tag">${esc(d.cat)}</span>${esc(d.desc)}</div></div><div class="manage-dish-price">¥${d.price}</div><div class="manage-dish-actions"><button class="btn-icon-sm" onclick="openDishForm(${d.id})">✏️</button><button class="btn-icon-sm danger" onclick="deleteDish(${d.id})">🗑️</button></div></div>`;});}
  l.innerHTML=h;
}
function renderManageCategories(){
  const l=document.getElementById('manageCatList');if(!categories.length){l.innerHTML='<div class="history-empty"><p>📂</p><p>暂无分类</p></div>';return;}
  l.innerHTML=categories.map(c=>`<div class="manage-cat-item"><div class="manage-cat-emoji">${esc(c.emoji)}</div><div class="manage-cat-info"><div class="manage-cat-name">${esc(c.name)}</div><div class="manage-cat-count">${menuData.filter(d=>d.cat===c.name).length} 道</div></div><div class="manage-cat-actions"><button class="btn-icon-sm" onclick="openCategoryForm('${escJs(c.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="deleteCategory('${escJs(c.name)}')">🗑️</button></div></div>`).join('');
}
function renderManageMembers(){
  const l=document.getElementById('manageMemberList');if(!members.length){l.innerHTML='<div class="history-empty"><p>👨‍👩‍👧‍👦</p><p>暂无家人</p></div>';return;}
  const av=['👨','👩','👴','👵','👦','👧','🧑','👶','🧒'];l.innerHTML=members.map((m,i)=>`<div class="manage-member-item"><div class="manage-member-avatar">${m.avatar?`<img src="${m.avatar}">`:av[i%av.length]}</div><div class="manage-member-name">${esc(m.name)}</div><div class="manage-member-actions"><button class="btn-icon-sm" onclick="openMemberForm('${escJs(m.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="deleteMember('${escJs(m.name)}')">🗑️</button></div></div>`).join('');
}

// === 菜品 CRUD ===
function openDishForm(id){
  tempDishImage='';document.getElementById('dishFormCat').innerHTML=categories.map(c=>`<option value="${esc(c.name)}">${c.emoji} ${esc(c.name)}</option>`).join('');
  document.getElementById('emojiSuggestions').innerHTML=EMOJIS.map(e=>`<button type="button" onclick="pickEmoji('${e}')">${e}</button>`).join('');
  if(id){const d=menuData.find(x=>x.id===id);if(!d)return;document.getElementById('dishModalTitle').textContent='✏️ 编辑菜品';document.getElementById('dishFormId').value=d.id;document.getElementById('dishFormName').value=d.name;document.getElementById('dishFormCat').value=d.cat;document.getElementById('dishFormPrice').value=d.price;document.getElementById('dishFormEmoji').value=d.emoji;document.getElementById('dishFormDesc').value=d.desc;document.getElementById('emojiPreview').textContent=d.emoji||'🥘';if(d.image){tempDishImage=d.image;document.getElementById('dishImagePreview').innerHTML=`<img src="${d.image}">`;document.getElementById('dishImagePreview').classList.add('has-image');document.getElementById('dishImageClear').style.display='inline-block';}else clearDishUI();}
  else{document.getElementById('dishModalTitle').textContent='🍽️ 添加菜品';document.getElementById('dishFormId').value='';['dishFormName','dishFormEmoji','dishFormDesc'].forEach(x=>document.getElementById(x).value='');document.getElementById('dishFormPrice').value='';document.getElementById('dishFormCat').value=categories[0]?.name||'';document.getElementById('emojiPreview').textContent='🥘';clearDishUI();}
  document.getElementById('dishModal').classList.add('open');
}
async function handleDishImage(e){const f=e.target.files[0];if(!f)return;try{tempDishImage=await compressImg(f,400,300,0.7);document.getElementById('dishImagePreview').innerHTML=`<img src="${tempDishImage}">`;document.getElementById('dishImagePreview').classList.add('has-image');document.getElementById('dishImageClear').style.display='inline-block';}catch(er){showToast('⚠️ '+er.message);}e.target.value='';}
function clearDishUI(){document.getElementById('dishImagePreview').innerHTML='<span class="image-placeholder">🥘</span>';document.getElementById('dishImagePreview').classList.remove('has-image');document.getElementById('dishImageClear').style.display='none';}
function clearDishImage(){tempDishImage='';clearDishUI();}
function closeDishModal(){document.getElementById('dishModal').classList.remove('open');}
async function saveDish(){
  const id=document.getElementById('dishFormId').value,n=document.getElementById('dishFormName').value.trim(),cat=document.getElementById('dishFormCat').value,pr=parseInt(document.getElementById('dishFormPrice').value),em=document.getElementById('dishFormEmoji').value.trim(),desc=document.getElementById('dishFormDesc').value.trim();
  if(!n){showToast('⚠️ 请输入菜名');return;}if(!cat){showToast('⚠️ 请选分类');return;}if(isNaN(pr)||pr<0){showToast('⚠️ 请输入有效价格');return;}
  if(id){const d=menuData.find(x=>x.id===parseInt(id));if(!d)return;d.name=n;d.cat=cat;d.price=pr;d.emoji=em||'🍽️';d.desc=desc||n;d.image=tempDishImage;showToast('✅ 已更新');}
  else{menuData.push({id:nextId++,name:n,cat,price:pr,emoji:em||'🍽️',image:tempDishImage,desc:desc||n});showToast('✅ 已添加');}
  await saveAll();closeDishModal();renderManageDishes();renderMenu();renderCategoryNav();
}
async function deleteDish(id){const d=menuData.find(x=>x.id===id);if(!d||!confirm(`删除「${d.name}」？`))return;menuData=menuData.filter(x=>x.id!==id);cart=cart.filter(c=>c.id!==id);saveCart();await saveAll();renderManageDishes();renderMenu();renderCategoryNav();updateCartBadge();updateCartPanel();showToast('🗑️ '+d.name);}

// === 分类 CRUD ===
function openCategoryForm(on){
  if(on){const c=categories.find(x=>x.name===on);if(!c)return;document.getElementById('catModalTitle').textContent='✏️ 编辑分类';document.getElementById('catFormOldName').value=on;document.getElementById('catFormName').value=on;document.getElementById('catFormEmoji').value=c.emoji;document.getElementById('catEmojiPreview').textContent=c.emoji||'📂';}
  else{document.getElementById('catModalTitle').textContent='📂 添加分类';document.getElementById('catFormOldName').value='';document.getElementById('catFormName').value='';document.getElementById('catFormEmoji').value='';document.getElementById('catEmojiPreview').textContent='📂';}
  document.getElementById('catModal').classList.add('open');
}
function closeCatModal(){document.getElementById('catModal').classList.remove('open');}
async function saveCategory(){
  const on=document.getElementById('catFormOldName').value.trim(),nn=document.getElementById('catFormName').value.trim(),em=document.getElementById('catFormEmoji').value.trim();
  if(!nn){showToast('⚠️ 请输入名称');return;}
  if(on){const c=categories.find(x=>x.name===on);if(!c)return;if(on!==nn&&categories.some(x=>x.name===nn)){showToast('⚠️ 已存在');return;}c.name=nn;c.emoji=em||'📂';menuData.forEach(d=>{if(d.cat===on)d.cat=nn;});showToast('✅ 已更新');}
  else{if(categories.some(x=>x.name===nn)){showToast('⚠️ 已存在');return;}categories.push({name:nn,emoji:em||'📂'});showToast('✅ 已添加');}
  await saveAll();closeCatModal();renderManageCategories();renderManageDishes();renderMenu();renderCategoryNav();
}
async function deleteCategory(n){const ct=menuData.filter(d=>d.cat===n).length;if(!confirm(`删除「${n}」？${ct>0?`\n${ct}道菜将移到其他分类`:''}`))return;categories=categories.filter(c=>c.name!==n);const fb=categories[0]?.name||'';menuData.forEach(d=>{if(d.cat===n)d.cat=fb;});await saveAll();renderManageCategories();renderManageDishes();renderMenu();renderCategoryNav();showToast('🗑️ '+n);}

// === 成员 CRUD ===
function openMemberForm(on){
  tempMemberAvatar='';if(on){const m=members.find(x=>x.name===on);if(!m)return;document.getElementById('memberModalTitle').textContent='✏️ 编辑家人';document.getElementById('memberFormOldName').value=on;document.getElementById('memberFormName').value=on;if(m.avatar){tempMemberAvatar=m.avatar;document.getElementById('memberAvatarUploadPreview').innerHTML=`<img src="${m.avatar}">`;document.getElementById('memberAvatarUploadPreview').classList.add('has-image');document.getElementById('memberAvatarClear').style.display='inline-block';}else clearMemberUI();}
  else{document.getElementById('memberModalTitle').textContent='👤 添加家人';document.getElementById('memberFormOldName').value='';document.getElementById('memberFormName').value='';clearMemberUI();}
  document.getElementById('memberModal').classList.add('open');
}
async function handleMemberAvatar(e){const f=e.target.files[0];if(!f)return;try{tempMemberAvatar=await compressImg(f,200,200,0.7);document.getElementById('memberAvatarUploadPreview').innerHTML=`<img src="${tempMemberAvatar}">`;document.getElementById('memberAvatarUploadPreview').classList.add('has-image');document.getElementById('memberAvatarClear').style.display='inline-block';}catch(er){showToast('⚠️ '+er.message);}e.target.value='';}
function clearMemberUI(){document.getElementById('memberAvatarUploadPreview').innerHTML='<span class="avatar-placeholder">👤</span>';document.getElementById('memberAvatarUploadPreview').classList.remove('has-image');document.getElementById('memberAvatarClear').style.display='none';}
function clearMemberAvatar(){tempMemberAvatar='';clearMemberUI();}
function closeMemberModal(){document.getElementById('memberModal').classList.remove('open');}
async function saveMember(){
  const on=document.getElementById('memberFormOldName').value.trim(),nn=document.getElementById('memberFormName').value.trim();if(!nn){showToast('⚠️ 请输入称呼');return;}
  if(on){const i=members.findIndex(x=>x.name===on);if(i===-1)return;if(on!==nn&&members.some(x=>x.name===nn)){showToast('⚠️ 已存在');return;}members[i].name=nn;members[i].avatar=tempMemberAvatar;cart.forEach(c=>{if(c.member===on)c.member=nn;});saveCart();showToast('✅ 已更新');}
  else{if(members.some(x=>x.name===nn)){showToast('⚠️ 已存在');return;}members.push({name:nn,avatar:tempMemberAvatar});showToast('✅ 已添加');}
  await saveAll();closeMemberModal();renderManageMembers();renderMemberSelect();updateCartPanel();
}
async function deleteMember(n){if(!confirm(`删除「${n}」？购物车中该家人的记录也会被移除。`))return;members=members.filter(m=>m.name!==n);cart=cart.filter(c=>c.member!==n);saveCart();await saveAll();renderManageMembers();renderMemberSelect();updateCartBadge();updateCartPanel();showToast('🗑️ '+n);}

// === 导出/导入/恢复 ===
function exportData(){
  const data={menu:menuData.map(({id,...r})=>r),categories:categories.map(({...r})=>r),members:members.map(({...r})=>r)};
  const json=JSON.stringify(data,null,2),blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`家庭点菜_备份_${new Date().toLocaleDateString('zh-CN').replace(/\//g,'-')}.json`;
  a.style.display='none';document.body.appendChild(a);a.click();
  setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},1000);
  showToast('📥 下载已触发，查看浏览器底部下载栏');
}
async function importData(e){
  const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=async ev=>{try{const d=JSON.parse(ev.target.result);if(!d.menu)throw new Error('格式错误');let md=d.members||[];if(md.length&&typeof md[0]==='string')md=md.map(n=>({name:n,avatar:''}));if(!confirm(`导入：🍽️${d.menu.length}道菜 📂${(d.categories||[]).length}个分类 👤${md.length}位家人\n\n⚠️ 覆盖当前数据？`)){e.target.value='';return;}
    menuData=d.menu;categories=d.categories||[];members=md;nextId=menuData.length?Math.max(...menuData.map(x=>x.id||0),999)+1:1000;await saveAll();renderAll();renderManageDishes();renderManageCategories();renderManageMembers();showToast('✅ 导入成功');}catch(er){showToast('⚠️ 文件格式错误');}};
  r.readAsText(f);e.target.value='';
}
async function resetToDefault(){if(!confirm('⚠️ 恢复默认？所有自定义数据（含图片）将丢失！'))return;menuData=dCopy(DEF_MENU);categories=dCopy(DEF_CATS);members=dCopy(DEF_MEMBERS);nextId=1000;await saveAll();renderAll();renderManageDishes();renderManageCategories();renderManageMembers();showToast('🔄 已恢复');}

// === 工具 ===
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id)?.classList.add('active');}
function pickEmoji(e){document.getElementById('dishFormEmoji').value=e;document.getElementById('emojiPreview').textContent=e;}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2000);}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
function escJs(s){return(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}

// === 事件绑定 ===
document.addEventListener('DOMContentLoaded',async()=>{
  document.getElementById('categoryNav')?.addEventListener('click',e=>{const b=e.target.closest('.cat-btn');if(!b)return;document.querySelectorAll('#categoryNav .cat-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');currentCat=b.dataset.cat;renderMenu();});
  document.getElementById('manageSubnav')?.addEventListener('click',e=>{const b=e.target.closest('.subnav-btn');if(!b)return;document.querySelectorAll('.subnav-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');currentManageTab=b.dataset.mtab;document.querySelectorAll('.manage-panel').forEach(p=>p.classList.remove('active'));document.getElementById('mPanel'+currentManageTab.charAt(0).toUpperCase()+currentManageTab.slice(1))?.classList.add('active');if(currentManageTab==='dishes')renderManageDishes();if(currentManageTab==='categories')renderManageCategories();if(currentManageTab==='members')renderManageMembers();});
  document.getElementById('dishFormEmoji')?.addEventListener('input',function(){document.getElementById('emojiPreview').textContent=this.value||'🥘';});
  document.getElementById('catFormEmoji')?.addEventListener('input',function(){document.getElementById('catEmojiPreview').textContent=this.value||'📂';});
  document.getElementById('lockPin')?.addEventListener('keydown',e=>{if(e.key==='Enter')handleLock();});
  document.getElementById('lockPin2')?.addEventListener('keydown',e=>{if(e.key==='Enter')handleLock();});
  loadCart();
  initLock();
});
