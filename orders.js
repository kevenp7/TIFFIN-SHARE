// Render saved orders from localStorage key 'mfd_orders' with in-page confirm modal and toast
(function(){
  const fallbackMealNames = {
    rajma: 'Rajma Chawal',
    Upma: 'Upma',
    Pulao: 'Pulao',
    Burji: 'Egg Bhurji',
    paneer: 'Paneer Butter Masala',
    'chicken-curry': 'Chicken Curry',
    dal: 'Dal Tadka',
    'jain-biryani': 'Jain Biryani',
    'fish-curry': 'Goan Fish Curry',
    poha: 'Poha',
    roti: 'Roti',
    'chicken-biryani': 'Chicken Biryani',
    rice: 'Steamed Rice',
    jain_sand: 'Jain Sandwich',
    jain_pul: 'Jain Pulao',
    'mutton-curry': 'Mutton Curry',
    'fish-fry': 'Fish Fry',
    'jain-pav': 'Jain Pav Bhaji',
    'egg-curry': 'Egg Curry',
    chick_fried: 'Chicken Fried Rice'
  };

  function read(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}

  function getOrders(){
    if (window.mfdBackend && typeof window.mfdBackend.loadOrders === 'function') {
      return window.mfdBackend.loadOrders();
    }
    return Promise.resolve(Array.isArray(read('mfd_orders')) ? read('mfd_orders') : []);
  }

  function normalizeStatus(status){
    const value = (status || 'pending').toLowerCase();
    return ['pending', 'preparing', 'ready'].includes(value) ? value : 'pending';
  }

  function getStatusLabel(status){
    const normalized = normalizeStatus(status);
    return {
      pending: 'Pending',
      preparing: 'Preparing',
      ready: 'Ready'
    }[normalized] || 'Pending';
  }

  function getMealDisplayName(item){
    if (!item) return 'Unknown item';
    if (typeof item === 'string') return fallbackMealNames[item] || item;
    if (typeof item === 'object') {
      if (item.name) return item.name;
      if (item.id) return fallbackMealNames[item.id] || item.id;
    }
    return String(item);
  }

  function showToast(msg, timeout=2000){
    const t = document.getElementById('toast');
    if(!t){ console.log(msg); return; }
    t.textContent = msg; t.classList.remove('hidden'); t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(()=>{ t.classList.remove('show'); t.classList.add('hidden'); }, timeout);
  }

  function showConfirm(message, onConfirm){
    const modal = document.getElementById('confirm-modal');
    if(!modal){ if(window.confirm(message)) onConfirm(); return; }
    const msgEl = modal.querySelector('#confirm-message');
    const ok = modal.querySelector('#confirm-ok');
    const cancel = modal.querySelector('#confirm-cancel');
    msgEl.textContent = message;
    modal.classList.remove('hidden');
    function cleanup(){ modal.classList.add('hidden'); ok.removeEventListener('click', onOk); cancel.removeEventListener('click', onCancel); }
    function onOk(){ cleanup(); onConfirm(); }
    function onCancel(){ cleanup(); }
    ok.addEventListener('click', onOk);
    cancel.addEventListener('click', onCancel);
  }

  async function render(){
    const list = document.getElementById('orders-list');
    if(!list) return;
    list.innerHTML = '';
    const orders = await getOrders();
    if(!orders.length){ list.innerHTML = '<p class="muted">No orders placed yet.</p>'; return; }
    orders.slice().reverse().forEach(o=>{
      const card = document.createElement('div'); card.className='card';
      const date = new Date(o.placedAt).toLocaleString();
      const title = document.createElement('h3'); title.textContent = `Order ${o.id} — ${date}`;
      const ul = document.createElement('ul');
      (o.items || []).forEach(item => {
        const li = document.createElement('li');
        li.textContent = getMealDisplayName(item);
        ul.appendChild(li);
      });

      const status = document.createElement('span');
      const statusValue = normalizeStatus(o.status);
      status.className = `order-status ${statusValue}`;
      status.textContent = `Status: ${getStatusLabel(statusValue)}`;

      const deliveryDiv = document.createElement('div'); 
      deliveryDiv.style.cssText = 'margin-top:12px;padding:10px;background:rgba(255,255,255,0.01);border-radius:6px;border-left:3px solid #ff7a59;';
      if(o.delivery){
        const del = o.delivery;
        deliveryDiv.innerHTML = `<p style="margin:0 0 4px 0;font-size:13px;"><strong>Name:</strong> ${del.name}</p>
          <p style="margin:0 0 4px 0;font-size:13px;"><strong>Phone:</strong> ${del.phone}</p>
          <p style="margin:0 0 4px 0;font-size:13px;"><strong>Address:</strong> ${del.address}</p>
          <p style="margin:0;font-size:13px;"><strong>Payment:</strong> ${(del.payment || 'cod').toUpperCase()}</p>`;
      } else {
        deliveryDiv.innerHTML = '<p style="margin:0;font-size:13px;color:var(--muted);">No delivery details provided.</p>';
      }

      const controls = document.createElement('div'); controls.className = 'order-controls';
      const del = document.createElement('button');
      del.className = 'btn small danger'; del.textContent = i18n.get('cancelOrder');
      del.addEventListener('click', ()=>{
        showConfirm(`${i18n.get('cancelOrderConfirm')} ${o.id}${i18n.get('thisCannotBeUndone')}`, async ()=>{
          if (window.mfdBackend && typeof window.mfdBackend.deleteOrder === 'function') {
            await window.mfdBackend.deleteOrder(o.id);
          } else {
            const all = Array.isArray(read('mfd_orders')) ? read('mfd_orders') : [];
            const idx = all.findIndex(it=> it.id === o.id);
            if(idx === -1){ showToast(i18n.get('orderNotFound')); return; }
            all.splice(idx,1);
            localStorage.setItem('mfd_orders', JSON.stringify(all));
          }
          showToast(`${i18n.get('orderCancelled')} ${o.id}`);
          render();
        });
      });
      controls.appendChild(del);

      card.appendChild(title); card.appendChild(ul); card.appendChild(status); card.appendChild(deliveryDiv); card.appendChild(controls);
      list.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', ()=> {
    render();
    document.addEventListener('i18n:changed', render);
    document.addEventListener('mfd:ordersUpdated', render);
    window.addEventListener('storage', (event) => {
      if (event.key === 'mfd_orders' || event.key === 'mfd_lang') render();
    });
  });
})();
