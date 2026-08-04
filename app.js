// ============================================================
//  家庭点菜 — 中国优化版 (localStorage)
//  无需服务器、无需翻墙、微信分享同步
// ============================================================

const DEFAULT_CATEGORIES = [
    { name: '凉菜', emoji: '🧊' },
    { name: '热菜', emoji: '🍳' },
    { name: '汤类', emoji: '🍲' },
    { name: '主食', emoji: '🍚' },
    { name: '饮品', emoji: '🥤' },
];

const DEFAULT_MEMBERS = [
    { name: '爸爸', avatar: '' }, { name: '妈妈', avatar: '' },
    { name: '爷爷', avatar: '' }, { name: '奶奶', avatar: '' },
    { name: '大宝', avatar: '' }, { name: '小宝', avatar: '' },
];

const DEFAULT_MENU = [
    { id:1,  name:'拍黄瓜', cat:'凉菜', price:12, emoji:'🥒', image:'', desc:'清爽脆嫩，蒜香十足' },
    { id:2,  name:'凉拌木耳', cat:'凉菜', price:15, emoji:'🍄', image:'', desc:'爽口开胃，营养丰富' },
    { id:3,  name:'皮蛋豆腐', cat:'凉菜', price:14, emoji:'🥚', image:'', desc:'嫩滑豆腐配松花蛋' },
    { id:4,  name:'口水鸡', cat:'凉菜', price:28, emoji:'🍗', image:'', desc:'麻辣鲜香，鸡肉嫩滑' },
    { id:5,  name:'酱牛肉', cat:'凉菜', price:32, emoji:'🥩', image:'', desc:'酱香浓郁，肉质紧实' },
    { id:6,  name:'糖拌西红柿', cat:'凉菜', price:10, emoji:'🍅', image:'', desc:'酸甜清爽' },
    { id:7,  name:'红烧排骨', cat:'热菜', price:38, emoji:'🦴', image:'', desc:'软烂入味，酱汁浓郁' },
    { id:8,  name:'鱼香肉丝', cat:'热菜', price:26, emoji:'🐟', image:'', desc:'经典川菜，酸甜微辣' },
    { id:9,  name:'宫保鸡丁', cat:'热菜', price:28, emoji:'🐔', image:'', desc:'花生脆香，鸡肉滑嫩' },
    { id:10, name:'糖醋里脊', cat:'热菜', price:30, emoji:'🍖', image:'', desc:'外酥里嫩，酸甜可口' },
    { id:11, name:'麻婆豆腐', cat:'热菜', price:18, emoji:'🧈', image:'', desc:'麻辣烫香，下饭神器' },
    { id:12, name:'清炒时蔬', cat:'热菜', price:16, emoji:'🥬', image:'', desc:'时令蔬菜，清淡健康' },
    { id:13, name:'回锅肉', cat:'热菜', price:28, emoji:'🥓', image:'', desc:'肥而不腻' },
    { id:14, name:'干煸四季豆', cat:'热菜', price:18, emoji:'🫘', image:'', desc:'干香微辣' },
    { id:15, name:'番茄炒蛋', cat:'热菜', price:15, emoji:'🍳', image:'', desc:'国民家常菜' },
    { id:16, name:'番茄蛋花汤', cat:'汤类', price:12, emoji:'🥣', image:'', desc:'清淡鲜美' },
    { id:17, name:'酸辣汤', cat:'汤类', price:14, emoji:'🌶️', image:'', desc:'酸辣开胃' },
    { id:18, name:'排骨玉米汤', cat:'汤类', price:25, emoji:'🌽', image:'', desc:'清甜滋补' },
    { id:19, name:'紫菜蛋花汤', cat:'汤类', price:10, emoji:'🫧', image:'', desc:'简单快手' },
    { id:20, name:'白米饭', cat:'主食', price:3, emoji:'🍚', image:'', desc:'香喷喷' },
    { id:21, name:'蛋炒饭', cat:'主食', price:12, emoji:'🍛', image:'', desc:'粒粒分明' },
    { id:22, name:'手工水饺', cat:'主食', price:22, emoji:'🥟', image:'', desc:'皮薄馅大' },
    { id:23, name:'番茄鸡蛋面', cat:'主食', price:14, emoji:'🍜', image:'', desc:'家常味' },
    { id:24, name:'馒头', cat:'主食', price:2, emoji:'🥖', image:'', desc:'松软白馒头' },
    { id:25, name:'可乐', cat:'饮品', price:5, emoji:'🥤', image:'', desc:'冰爽' },
    { id:26, name:'雪碧', cat:'饮品', price:5, emoji:'🧊', image:'', desc:'清爽' },
    { id:27, name:'橙汁', cat:'饮品', price:8, emoji:'🍊', image:'', desc:'鲜榨' },
    { id:28, name:'王老吉', cat:'饮品', price:6, emoji:'🫖', image:'', desc:'怕上火' },
    { id:29, name:'酸梅汤', cat:'饮品', price:5, emoji:'🫗', image:'', desc:'消暑解腻' },
];

const COMMON_EMOJIS = [
    '🥒','🍄','🥚','🍗','🥩','🍅','🦴','🐟','🐔','🍖','🧈','🥬','🥓','🍳',
    '🥣','🌶️','🌽','🫧','🍚','🍛','🥟','🍜','🥖','🥤','🧊','🍊','🥛','🫖',
    '🫗','🍕','🍔','🌭','🥗','🍝','🌮','🍣','🍤','🍰','🍪','🍩','🍉','🍇',
    '🥦','🥕','🧅','🧄','🥔','🍞','🧀','🥜','🍯','🦐','🦀','🍲','🍱','🥘',
];

// === 状态 ===
let menuData = [], categories = [], members = [], cart = [], orders = [];
let currentCat = 'all', currentSearch = '', currentManageTab = 'dishes', nextId = 1000;
let tempDishImage = '', tempMemberAvatar = '';

// === localStorage keys ===
const KEYS = { menu: 'fm_menu', cats: 'fm_categories', members: 'fm_members', cart: 'fm_cart', orders: 'fm_orders' };

// === 存储 ===
function loadData() {
    try {
        menuData = JSON.parse(localStorage.getItem(KEYS.menu)) || deepClone(DEFAULT_MENU);
        categories = JSON.parse(localStorage.getItem(KEYS.cats)) || deepClone(DEFAULT_CATEGORIES);
        const rawMembers = JSON.parse(localStorage.getItem(KEYS.members));
        if (rawMembers) {
            members = (typeof rawMembers[0] === 'string') ? rawMembers.map(n => ({ name: n, avatar: '' })) : rawMembers;
        } else { members = deepClone(DEFAULT_MEMBERS); }
        cart = JSON.parse(localStorage.getItem(KEYS.cart)) || [];
        orders = JSON.parse(localStorage.getItem(KEYS.orders)) || [];

        // 修复旧数据：给没有 id 的菜品补上 id（修复之前的 bug）
        let needsSave = false;
        let maxId = 0;
        menuData.forEach(d => {
            if (!d.id && d.id !== 0) { d.id = ++maxId; needsSave = true; }
            else if (d.id > maxId) maxId = d.id;
        });
        nextId = maxId >= 999 ? maxId + 1 : 1000;
        if (needsSave) saveMenu();

        // 清理购物车中失效的菜品（旧数据 id 为 undefined 的）
        const dishIds = new Set(menuData.map(d => d.id));
        const cartBefore = cart.length;
        cart = cart.filter(c => dishIds.has(c.id));
        if (cart.length !== cartBefore) saveCart();
    } catch(e) { resetAllData(); }
}

function save(key, data) {
    try { localStorage.setItem(KEYS[key], JSON.stringify(data)); } catch(e) { showToast('⚠️ 存储空间不足，请清理图片'); }
}
function saveMenu()    { save('menu', menuData); }
function saveCats()    { save('cats', categories); }
function saveMembers() { save('members', members); }
function saveCart()    { save('cart', cart); }
function saveOrders()  { save('orders', orders); }

function resetAllData() {
    menuData = deepClone(DEFAULT_MENU); categories = deepClone(DEFAULT_CATEGORIES);
    members = deepClone(DEFAULT_MEMBERS); cart = []; orders = []; nextId = 1000;
    tempDishImage = ''; tempMemberAvatar = '';
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// === 工具 ===
function rBg(id) { const c=['#fef5e7','#fdecea','#edf7f0','#e8f4fd','#fdf2f8','#f5f0e8','#e8f8f5','#fef9e7']; return c[Math.abs(id)%c.length]; }
function catEmoji(n) { const c=categories.find(x=>x.name===n); return c?c.emoji:'📂'; }
function dishCountInCat(n) { return menuData.filter(d=>d.cat===n).length; }
function memberByName(n) { return members.find(m=>m.name===n); }

function compressImage(file, maxW, maxH, q) {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) return reject(new Error('非图片'));
        const r = new FileReader();
        r.onload = e => {
            const img = new Image();
            img.onload = () => {
                let w=img.width, h=img.height;
                if(w>maxW){h*=(maxW/w);w=maxW;} if(h>maxH){w*=(maxH/h);h=maxH;}
                const c=document.createElement('canvas'); c.width=Math.round(w); c.height=Math.round(h);
                c.getContext('2d').drawImage(img,0,0,c.width,c.height);
                resolve(c.toDataURL('image/jpeg',q));
            };
            img.onerror=()=>reject(new Error('加载失败'));
            img.src=e.target.result;
        };
        r.onerror=()=>reject(new Error('读取失败'));
        r.readAsDataURL(file);
    });
}

// === 初始化 ===
function init() {
    loadData();
    renderMemberSelect(); renderCategoryNav(); renderMenu();
    updateCartBadge(); updateCartPanel(); renderHistory();
    document.getElementById('categoryNav').addEventListener('click', e => {
        const b = e.target.closest('.cat-btn'); if(!b) return;
        document.querySelectorAll('#categoryNav .cat-btn').forEach(x=>x.classList.remove('active'));
        b.classList.add('active'); currentCat = b.dataset.cat; renderMenu();
    });
    document.getElementById('manageSubnav').addEventListener('click', e => {
        const b = e.target.closest('.subnav-btn'); if(!b) return;
        document.querySelectorAll('#manageSubnav .subnav-btn').forEach(x=>x.classList.remove('active'));
        b.classList.add('active'); currentManageTab = b.dataset.mtab;
        document.querySelectorAll('.manage-panel').forEach(p=>p.classList.remove('active'));
        const p=document.getElementById('mPanel'+currentManageTab.charAt(0).toUpperCase()+currentManageTab.slice(1));
        if(p)p.classList.add('active');
        if(currentManageTab==='dishes')renderManageDishes();
        if(currentManageTab==='categories')renderManageCategories();
        if(currentManageTab==='members')renderManageMembers();
        if(currentManageTab==='data')updateStorageStats();
    });
    const de=document.getElementById('dishFormEmoji'); if(de)de.addEventListener('input',()=>{document.getElementById('emojiPreview').textContent=de.value||'🥘';});
    const ce=document.getElementById('catFormEmoji'); if(ce)ce.addEventListener('input',()=>{document.getElementById('catEmojiPreview').textContent=ce.value||'📂';});
}

// === Tab ===
function switchTab(t) {
    document.querySelectorAll('#mainScreen .tab, .tab').forEach(x=>x.classList.remove('active'));
    const el=document.getElementById(t+'Tab'); if(el)el.classList.add('active');
    document.querySelectorAll('.btn-icon.active-nav').forEach(b=>b.classList.remove('active-nav'));
    if(t==='manage')document.getElementById('btnManage')?.classList.add('active-nav');
    if(t==='history')document.getElementById('btnHistory')?.classList.add('active-nav');
    if(t==='history')renderHistory();
    if(t==='manage'){renderManageDishes();renderManageCategories();renderManageMembers();updateStorageStats();}
    window.scrollTo({top:0,behavior:'smooth'});
}

// === 点菜人 ===
function renderMemberSelect() {
    const s=document.getElementById('memberSelect'), v=s.value;
    s.innerHTML='<option value="">-- 选择家人 --</option>'+members.map(m=>`<option value="${esc(m.name)}">${esc(m.name)}</option>`).join('');
    if(members.some(m=>m.name===v))s.value=v; onMemberChange();
}
function onMemberChange() {
    const v=document.getElementById('memberSelect').value, p=document.getElementById('memberAvatarPreview');
    const m=memberByName(v);
    p.innerHTML=m&&m.avatar?`<img src="${m.avatar}" alt="">`:'👤';
}

// === 分类导航 ===
function renderCategoryNav() {
    const n=document.getElementById('categoryNav');
    n.innerHTML='<button class="cat-btn active" data-cat="all">🔥 全部</button>'+categories.map(c=>`<button class="cat-btn" data-cat="${esc(c.name)}">${c.emoji} ${esc(c.name)}</button>`).join('');
}

// === 菜单 ===
function renderMenu() {
    const g=document.getElementById('menuGrid'); let d=menuData;
    if(currentCat!=='all')d=d.filter(x=>x.cat===currentCat);
    if(currentSearch){const kw=currentSearch.toLowerCase();d=d.filter(x=>x.name.toLowerCase().includes(kw)||x.cat.toLowerCase().includes(kw)||x.desc.toLowerCase().includes(kw));}
    if(!d.length){g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px 20px;color:var(--text-light);"><p style="font-size:3rem;">🔍</p><p>没有找到</p></div>';return;}
    g.innerHTML=d.map(dd=>{
        const ic=cart.find(c=>c.id===dd.id), q=ic?ic.qty:0;
        return `<div class="menu-card"><div class="menu-card-img" style="${dd.image?'':'background:'+rBg(dd.id)}">${dd.image?`<img src="${dd.image}" alt="${esc(dd.name)}" loading="lazy">`:dd.emoji||'🍽️'}</div><div class="menu-card-body"><div class="menu-card-name">${esc(dd.name)}</div><div class="menu-card-desc">${esc(dd.desc)}</div><div class="menu-card-footer"><div class="menu-card-price"><span class="unit">¥</span>${dd.price}</div>${q>0?`<div class="menu-card-qty"><button onclick="event.stopPropagation();changeQty(${dd.id},-1)">−</button><span class="qty-num">${q}</span><button onclick="event.stopPropagation();changeQty(${dd.id},1)">+</button></div>`:`<button class="menu-card-add" onclick="event.stopPropagation();addToCart(${dd.id})">+</button>`}</div></div></div>`;
    }).join('');
}
function filterMenu(){currentSearch=document.getElementById('searchInput').value.trim();renderMenu();}

// === 购物车 ===
function addToCart(id){
    const d=menuData.find(x=>x.id===id); if(!d)return;
    const m=document.getElementById('memberSelect').value; if(!m){showToast('⚠️ 请先选择点菜人');return;}
    const ex=cart.find(c=>c.id===id&&c.member===m);
    if(ex)ex.qty++; else cart.push({id:d.id,name:d.name,price:d.price,emoji:d.emoji,image:d.image||'',qty:1,member:m});
    saveCart();renderMenu();updateCartBadge();updateCartPanel();showToast('✅ '+d.name);
}
function changeQty(id,d){
    const m=document.getElementById('memberSelect').value, it=cart.find(c=>c.id===id&&c.member===m); if(!it)return;
    it.qty+=d; if(it.qty<=0)cart=cart.filter(c=>!(c.id===id&&c.member===m));
    saveCart();renderMenu();updateCartBadge();updateCartPanel();
}
function changeCartQty(id,member,d){
    const it=cart.find(c=>c.id===id&&c.member===member); if(!it)return;
    it.qty+=d; if(it.qty<=0)cart=cart.filter(c=>!(c.id===id&&c.member===member));
    saveCart();renderMenu();updateCartBadge();updateCartPanel();
}
function totalCount(){return cart.reduce((s,c)=>s+c.qty,0);}
function totalPrice(){return cart.reduce((s,c)=>s+c.price*c.qty,0);}
function updateCartBadge(){const b=document.getElementById('cartBadge'),c=totalCount();b.textContent=c;b.style.display=c>0?'flex':'none';}

function toggleCart(){
    const p=document.getElementById('cartPanel'),o=document.getElementById('cartOverlay');
    if(p.classList.contains('open'))closeCart(); else{o.classList.add('open');p.classList.add('open');}
}
function closeCart(){document.getElementById('cartOverlay').classList.remove('open');document.getElementById('cartPanel').classList.remove('open');}
function updateCartPanel(){
    const l=document.getElementById('cartList'),e=document.getElementById('cartEmpty'),f=document.getElementById('cartFooter');
    if(!cart.length){l.innerHTML='';l.style.display='none';e.style.display='flex';f.classList.remove('show');}
    else{l.style.display='block';e.style.display='none';f.classList.add('show');
        l.innerHTML=cart.map(c=>`<div class="cart-item"><div class="cart-item-img">${c.image?`<img src="${c.image}" alt="">`:c.emoji||'🍽️'}</div><div class="cart-item-info"><div class="cart-item-name">${esc(c.name)}</div><div class="cart-item-member">👤 ${esc(c.member)}</div><div class="cart-item-price">¥${c.price*c.qty}</div></div><div class="cart-item-qty"><button onclick="changeCartQty(${c.id},'${escJs(c.member)}',-1)">−</button><span>${c.qty}</span><button onclick="changeCartQty(${c.id},'${escJs(c.member)}',1)">+</button></div></div>`).join('');
    }
    document.getElementById('cartCount').textContent=totalCount(); document.getElementById('cartTotal').textContent=totalPrice();
}

// === 订单 ===
function submitOrder(){
    if(!cart.length){showToast('⚠️ 购物车是空的');return;}
    const g={}; cart.forEach(c=>{if(!g[c.member])g[c.member]=[];g[c.member].push(c);});
    let h=''; for(const[m,items]of Object.entries(g)){h+=`<p style="font-weight:600;margin:12px 0 4px;">👤 ${esc(m)}</p><ul class="confirm-list">`;items.forEach(c=>{h+=`<li><span class="dish-info"><span class="confirm-item-img">${c.image?`<img src="${c.image}" alt="">`:c.emoji||'🍽️'}</span>${esc(c.name)} ×${c.qty}</span><span style="color:var(--primary);font-weight:600;">¥${c.price*c.qty}</span></li>`;});h+='</ul>';}
    h+=`<div class="confirm-total">合计：<span>¥${totalPrice()}</span></div>`;document.getElementById('confirmBody').innerHTML=h;
    document.getElementById('confirmNote').value='';
    document.getElementById('confirmModal').classList.add('open');
}
function closeModal(){document.getElementById('confirmModal').classList.remove('open');}
function confirmOrder(){
    const note=document.getElementById('confirmNote').value.trim();
    orders.unshift({id:Date.now(),time:new Date().toLocaleString('zh-CN'),items:[...cart],total:totalPrice(),note:note});
    cart=[];saveCart();saveOrders();closeCart();closeModal();renderMenu();updateCartBadge();updateCartPanel();renderHistory();showToast('🎉 下单成功！');
}

function renderHistory(){
    const l=document.getElementById('historyList');
    if(!orders.length){l.innerHTML='<div class="history-empty"><p>📋</p><p>暂无订单</p></div>';return;}
    l.innerHTML=orders.map(o=>{const t=(o.items||[]).map(c=>`<span class="history-tag">${c.image?'🖼️':c.emoji||'🍽️'} ${esc(c.name)}×${c.qty}</span>`).join(''),ms=[...new Set((o.items||[]).map(c=>c.member))].join('、');return `<div class="history-card"><div class="history-card-header"><span>📅 ${o.time}</span><span>👤 ${esc(ms)}</span></div><div class="history-card-dishes">${t}</div>${o.note?`<div style="margin-top:8px;padding:8px 10px;background:#fef5e7;border-radius:6px;font-size:0.82rem;color:var(--accent);">📝 ${esc(o.note)}</div>`:''}<div class="history-card-footer">¥${o.total}</div></div>`;}).join('');
}
function clearHistory(){if(!orders.length)return;if(confirm('确定清空所有订单记录？')){orders=[];saveOrders();renderHistory();showToast('🗑️ 已清空');}}
function shareOrders(){
    if(!orders.length){showToast('⚠️ 暂无订单');return;}
    let txt='📋 家庭点菜订单汇总\n'+'─'.repeat(20)+'\n';
    orders.slice(0,5).forEach((o,i)=>{txt+=`\n📅 ${o.time}\n`;(o.items||[]).forEach(c=>{txt+=`  ${c.emoji||'🍽️'} ${c.name} ×${c.qty} (${c.member}) ¥${c.price*c.qty}\n`;});if(o.note)txt+=`  📝 备注: ${o.note}\n`;txt+=`  合计: ¥${o.total}\n`;});
    if(orders.length>5)txt+=`\n...共${orders.length}条订单\n`;
    copyToClipboard(txt);
}

// === 管理渲染 ===
function renderManageDishes(){
    const l=document.getElementById('manageDishList');document.getElementById('dishCount').textContent=`共 ${menuData.length} 道菜`;
    if(!menuData.length){l.innerHTML='<div class="history-empty"><p>🍽️</p><p>还没有菜品</p></div>';return;}
    const g={};menuData.forEach(d=>{if(!g[d.cat])g[d.cat]=[];g[d.cat].push(d);});
    let h=''; for(const[cat,dishes]of Object.entries(g)){h+=`<p style="font-weight:700;margin:16px 0 6px;font-size:0.9rem;color:var(--text-light);">${catEmoji(cat)} ${esc(cat)} (${dishes.length})</p>`;dishes.forEach(d=>{h+=`<div class="manage-dish-item"><div class="manage-dish-thumb">${d.image?`<img src="${d.image}" alt="">`:d.emoji||'🍽️'}</div><div class="manage-dish-info"><div class="manage-dish-name">${esc(d.name)}</div><div class="manage-dish-meta"><span class="cat-tag">${esc(d.cat)}</span>${esc(d.desc)}</div></div><div class="manage-dish-price">¥${d.price}</div><div class="manage-dish-actions"><button class="btn-icon-sm" onclick="openDishForm(${d.id})">✏️</button><button class="btn-icon-sm danger" onclick="deleteDish(${d.id})">🗑️</button></div></div>`;});}
    l.innerHTML=h;
}
function renderManageCategories(){
    const l=document.getElementById('manageCatList');
    if(!categories.length){l.innerHTML='<div class="history-empty"><p>📂</p><p>还没有分类</p></div>';return;}
    l.innerHTML=categories.map(c=>`<div class="manage-cat-item"><div class="manage-cat-emoji">${esc(c.emoji)}</div><div class="manage-cat-info"><div class="manage-cat-name">${esc(c.name)}</div><div class="manage-cat-count">${dishCountInCat(c.name)} 道</div></div><div class="manage-cat-actions"><button class="btn-icon-sm" onclick="openCategoryForm('${escJs(c.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="deleteCategory('${escJs(c.name)}')">🗑️</button></div></div>`).join('');
}
function renderManageMembers(){
    const l=document.getElementById('manageMemberList');
    if(!members.length){l.innerHTML='<div class="history-empty"><p>👨‍👩‍👧‍👦</p><p>还没有家人</p></div>';return;}
    const av=['👨','👩','👴','👵','👦','👧','🧑','👶','🧒'];
    l.innerHTML=members.map((m,i)=>`<div class="manage-member-item"><div class="manage-member-avatar">${m.avatar?`<img src="${m.avatar}" alt="">`:av[i%av.length]}</div><div class="manage-member-name">${esc(m.name)}</div><div class="manage-member-actions"><button class="btn-icon-sm" onclick="openMemberForm('${escJs(m.name)}')">✏️</button><button class="btn-icon-sm danger" onclick="deleteMember('${escJs(m.name)}')">🗑️</button></div></div>`).join('');
}
function updateStorageStats(){
    let total=0; for(const k of Object.values(KEYS)){const v=localStorage.getItem(k);if(v)total+=v.length;}
    const used=(total/1024).toFixed(1), limit=(5*1024).toFixed(0);
    document.getElementById('storageStats').textContent=`已用 ${used} KB / 约 ${limit} KB（localStorage 限制约 5MB） · 含图片越多占用越大`;
}

// === 菜品 CRUD ===
function openDishForm(id){
    tempDishImage=''; const cs=document.getElementById('dishFormCat');
    cs.innerHTML=categories.map(c=>`<option value="${esc(c.name)}">${c.emoji} ${esc(c.name)}</option>`).join('');
    document.getElementById('emojiSuggestions').innerHTML=COMMON_EMOJIS.map(e=>`<button type="button" onclick="pickEmoji('${e}')">${e}</button>`).join('');
    if(id){const d=menuData.find(x=>x.id===id);if(!d)return;
        document.getElementById('dishModalTitle').textContent='✏️ 编辑菜品';document.getElementById('dishFormId').value=d.id;
        document.getElementById('dishFormName').value=d.name;document.getElementById('dishFormCat').value=d.cat;
        document.getElementById('dishFormPrice').value=d.price;document.getElementById('dishFormEmoji').value=d.emoji;
        document.getElementById('dishFormDesc').value=d.desc;document.getElementById('emojiPreview').textContent=d.emoji||'🥘';
        const p=document.getElementById('dishImagePreview');
        if(d.image){tempDishImage=d.image;p.innerHTML=`<img src="${d.image}" alt="">`;p.classList.add('has-image');document.getElementById('dishImageClear').style.display='inline-block';}
        else{clearDishImageUI();}
    }else{
        document.getElementById('dishModalTitle').textContent='🍽️ 添加菜品';document.getElementById('dishFormId').value='';
        document.getElementById('dishFormName').value='';document.getElementById('dishFormCat').value=categories.length?categories[0].name:'';
        document.getElementById('dishFormPrice').value='';document.getElementById('dishFormEmoji').value='';document.getElementById('dishFormDesc').value='';
        document.getElementById('emojiPreview').textContent='🥘';clearDishImageUI();
    }
    document.getElementById('dishModal').classList.add('open');
}
async function handleDishImage(e){const f=e.target.files[0];if(!f)return;try{tempDishImage=await compressImage(f,400,300,0.7);document.getElementById('dishImagePreview').innerHTML=`<img src="${tempDishImage}" alt="">`;document.getElementById('dishImagePreview').classList.add('has-image');document.getElementById('dishImageClear').style.display='inline-block';}catch(err){showToast('⚠️ '+err.message);}e.target.value='';}
function clearDishImageUI(){document.getElementById('dishImagePreview').innerHTML='<span class="image-placeholder">🥘</span>';document.getElementById('dishImagePreview').classList.remove('has-image');document.getElementById('dishImageClear').style.display='none';}
function clearDishImage(){tempDishImage='';clearDishImageUI();}
function closeDishModal(){document.getElementById('dishModal').classList.remove('open');}
function saveDish(){
    const id=document.getElementById('dishFormId').value,n=document.getElementById('dishFormName').value.trim(),cat=document.getElementById('dishFormCat').value,pr=parseInt(document.getElementById('dishFormPrice').value),em=document.getElementById('dishFormEmoji').value.trim(),desc=document.getElementById('dishFormDesc').value.trim();
    if(!n){showToast('⚠️ 请输入菜名');return;} if(!cat){showToast('⚠️ 请选分类');return;} if(isNaN(pr)||pr<0){showToast('⚠️ 请输入有效价格');return;}
    if(id){const d=menuData.find(x=>x.id===parseInt(id));if(!d)return;d.name=n;d.cat=cat;d.price=pr;d.emoji=em||'🍽️';d.desc=desc||n;d.image=tempDishImage;showToast('✅ 已更新');}
    else{menuData.push({id:nextId++,name:n,cat:cat,price:pr,emoji:em||'🍽️',image:tempDishImage,desc:desc||n});showToast('✅ 已添加');}
    saveMenu();closeDishModal();renderManageDishes();renderMenu();renderCategoryNav();
}
function deleteDish(id){const d=menuData.find(x=>x.id===id);if(!d||!confirm(`删除「${d.name}」？`))return;menuData=menuData.filter(x=>x.id!==id);cart=cart.filter(c=>c.id!==id);saveMenu();saveCart();updateCartBadge();updateCartPanel();renderManageDishes();renderMenu();renderCategoryNav();showToast('🗑️ '+d.name);}

// === 分类 CRUD ===
function openCategoryForm(n){
    if(n){const c=categories.find(x=>x.name===n);if(!c)return;document.getElementById('catModalTitle').textContent='✏️ 编辑分类';document.getElementById('catFormOldName').value=n;document.getElementById('catFormName').value=n;document.getElementById('catFormEmoji').value=c.emoji;document.getElementById('catEmojiPreview').textContent=c.emoji||'📂';}
    else{document.getElementById('catModalTitle').textContent='📂 添加分类';document.getElementById('catFormOldName').value='';document.getElementById('catFormName').value='';document.getElementById('catFormEmoji').value='';document.getElementById('catEmojiPreview').textContent='📂';}
    document.getElementById('catModal').classList.add('open');
}
function closeCatModal(){document.getElementById('catModal').classList.remove('open');}
function saveCategory(){
    const on=document.getElementById('catFormOldName').value.trim(),nn=document.getElementById('catFormName').value.trim(),em=document.getElementById('catFormEmoji').value.trim();
    if(!nn){showToast('⚠️ 请输入名称');return;}
    if(on){const c=categories.find(x=>x.name===on);if(!c)return;if(on!==nn&&categories.some(x=>x.name===nn)){showToast('⚠️ 已存在');return;}c.name=nn;c.emoji=em||'📂';menuData.forEach(d=>{if(d.cat===on)d.cat=nn;});saveMenu();saveCats();showToast('✅ 已更新');}
    else{if(categories.some(x=>x.name===nn)){showToast('⚠️ 已存在');return;}categories.push({name:nn,emoji:em||'📂'});saveCats();showToast('✅ 已添加');}
    closeCatModal();renderManageCategories();renderManageDishes();renderMenu();renderCategoryNav();
}
function deleteCategory(n){
    const ct=dishCountInCat(n);if(!confirm(`删除「${n}」？${ct>0?`\n${ct}道菜将移到其他分类`:''}`))return;
    categories=categories.filter(c=>c.name!==n);const fb=categories.length?categories[0].name:'';menuData.forEach(d=>{if(d.cat===n)d.cat=fb;});
    saveCats();saveMenu();renderManageCategories();renderManageDishes();renderMenu();renderCategoryNav();showToast('🗑️ '+n);
}

// === 成员 CRUD ===
function openMemberForm(n){
    tempMemberAvatar='';const p=document.getElementById('memberAvatarUploadPreview'),cb=document.getElementById('memberAvatarClear');
    if(n){const m=members.find(x=>x.name===n);if(!m)return;document.getElementById('memberModalTitle').textContent='✏️ 编辑家人';document.getElementById('memberFormOldName').value=n;document.getElementById('memberFormName').value=n;
        if(m.avatar){tempMemberAvatar=m.avatar;p.innerHTML=`<img src="${m.avatar}" alt="">`;p.classList.add('has-image');cb.style.display='inline-block';}else{clearMemberAvatarUI();}}
    else{document.getElementById('memberModalTitle').textContent='👤 添加家人';document.getElementById('memberFormOldName').value='';document.getElementById('memberFormName').value='';clearMemberAvatarUI();}
    document.getElementById('memberModal').classList.add('open');
}
async function handleMemberAvatar(e){const f=e.target.files[0];if(!f)return;try{tempMemberAvatar=await compressImage(f,200,200,0.7);document.getElementById('memberAvatarUploadPreview').innerHTML=`<img src="${tempMemberAvatar}" alt="">`;document.getElementById('memberAvatarUploadPreview').classList.add('has-image');document.getElementById('memberAvatarClear').style.display='inline-block';}catch(err){showToast('⚠️ '+err.message);}e.target.value='';}
function clearMemberAvatarUI(){document.getElementById('memberAvatarUploadPreview').innerHTML='<span class="avatar-placeholder">👤</span>';document.getElementById('memberAvatarUploadPreview').classList.remove('has-image');document.getElementById('memberAvatarClear').style.display='none';}
function clearMemberAvatar(){tempMemberAvatar='';clearMemberAvatarUI();}
function closeMemberModal(){document.getElementById('memberModal').classList.remove('open');}
function saveMember(){
    const on=document.getElementById('memberFormOldName').value.trim(),nn=document.getElementById('memberFormName').value.trim();if(!nn){showToast('⚠️ 请输入称呼');return;}
    if(on){const i=members.findIndex(x=>x.name===on);if(i===-1)return;if(on!==nn&&members.some(x=>x.name===nn)){showToast('⚠️ 已存在');return;}members[i].name=nn;members[i].avatar=tempMemberAvatar;cart.forEach(c=>{if(c.member===on)c.member=nn;});orders.forEach(o=>o.items.forEach(it=>{if(it.member===on)it.member=nn;}));saveMembers();saveCart();saveOrders();showToast('✅ 已更新');}
    else{if(members.some(x=>x.name===nn)){showToast('⚠️ 已存在');return;}members.push({name:nn,avatar:tempMemberAvatar});saveMembers();showToast('✅ 已添加');}
    closeMemberModal();renderManageMembers();renderMemberSelect();updateCartPanel();
}
function deleteMember(n){if(!confirm(`删除「${n}」？购物车中该家人的记录也会被移除。`))return;members=members.filter(m=>m.name!==n);cart=cart.filter(c=>c.member!==n);saveMembers();saveCart();updateCartBadge();updateCartPanel();renderManageMembers();renderMemberSelect();showToast('🗑️ '+n);}

// === 导出/导入 ===
function exportData(){
    const d={version:3,exportedAt:new Date().toISOString(),menu:menuData,categories:categories,members:members};
    try{const j=JSON.stringify(d,null,2),b=new Blob([j],{type:'application/json'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download=`家庭点菜_${new Date().toLocaleDateString('zh-CN').replace(/\//g,'-')}.json`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);showToast('📥 已下载');}catch(err){showToast('⚠️ 导出失败');}
}
function copyShareText(){
    const d={version:3,menu:menuData,categories:categories,members:members};
    try{const j=JSON.stringify(d);copyToClipboard(j);}catch(err){showToast('⚠️ 复制失败');}
}
function copyToClipboard(text){
    if(navigator.clipboard){navigator.clipboard.writeText(text).then(()=>showToast('📋 已复制！发给家人→对方在管理→数据同步→导入'));}
    else{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);showToast('📋 已复制！');}
}
function importData(e){
    const f=e.target.files[0];if(!f)return;const r=new FileReader();
    r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(!d.menu){throw new Error('格式错误');}
            let mData=d.members||[];if(mData.length&&typeof mData[0]==='string')mData=mData.map(n=>({name:n,avatar:''}));
            if(!confirm(`导入：\n🍽️ ${d.menu.length}道菜\n📂 ${(d.categories||[]).length}个分类\n👤 ${mData.length}位家人\n\n⚠️ 会覆盖当前数据，确定？`)){e.target.value='';return;}
            menuData=d.menu;categories=d.categories||[];members=mData;nextId=menuData.length?Math.max(...menuData.map(x=>x.id||0),999)+1:1000;
            saveMenu();saveCats();saveMembers();renderMenu();renderCategoryNav();renderMemberSelect();renderManageDishes();renderManageCategories();renderManageMembers();showToast('✅ 导入成功！');}catch(err){showToast('⚠️ 文件格式错误');}};
    r.readAsText(f);e.target.value='';
}
function resetToDefault(){
    if(!confirm('⚠️ 恢复默认？\n所有自定义内容（含图片）将丢失！'))return;
    menuData=deepClone(DEFAULT_MENU);categories=deepClone(DEFAULT_CATEGORIES);members=deepClone(DEFAULT_MEMBERS);nextId=1000;
    saveMenu();saveCats();saveMembers();renderMenu();renderCategoryNav();renderMemberSelect();renderManageDishes();renderManageCategories();renderManageMembers();showToast('🔄 已恢复');
}

// === Emoji / Toast / 工具 ===
function pickEmoji(e){document.getElementById('dishFormEmoji').value=e;document.getElementById('emojiPreview').textContent=e;}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2000);}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
function escJs(s){return(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
document.addEventListener('DOMContentLoaded',init);
