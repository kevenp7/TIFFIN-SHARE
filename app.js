(function(){
  const todayKey = ()=> new Date().toISOString().slice(0,10);
  const MAX_SELECTION = 3;

  const locations = ['Thane', 'BKC', 'Churchgate', 'Andheri', 'Borivali'];

  const locationMenus = {
    Thane: [
      { id: 'thane-rajma', name: 'Rajma Chawal', desc: 'Classic comfort meal with rich gravy and steamed rice.', price: 180, category: 'veg', img: 'Rajma_chawal.jpeg' },
      { id: 'thane-chicken', name: 'Chicken Curry', desc: 'Tender chicken in a cozy, spiced curry.', price: 200, category: 'non-veg', img: 'chick.jpg' },
      { id: 'thane-jain', name: 'Jain Biryani', desc: 'Aromatic biryani made without onion or garlic.', price: 200, category: 'jain', img: 'jain.jpg' },
      { id: 'thane-upma', name: 'Upma', desc: 'Warm semolina breakfast with vegetables and spices.', price: 90, category: 'veg', img: 'Upma.jpeg' },
      { id: 'thane-bhurji', name: 'Egg Bhurji', desc: 'Flavourful scrambled eggs with masala and onion.', price: 120, category: 'non-veg', img: 'bhurji.jpeg' }
    ],
    BKC: [
      { id: 'bkc-dal', name: 'Dal Tadka', desc: 'Yellow lentils tempered with ghee, garlic, and spices.', price: 120, category: 'veg', img: 'dal.jpg' },
      { id: 'bkc-biryani', name: 'Chicken Biryani', desc: 'Fragrant basmati rice layered with spiced chicken.', price: 250, category: 'non-veg', img: 'chicken.jpg' },
      { id: 'bkc-poha', name: 'Poha', desc: 'Light and comforting flattened rice with vegetables.', price: 80, category: 'veg', img: 'Poha.jpeg' },
      { id: 'bkc-jain-sandwich', name: 'Jain Sandwich', desc: 'Fresh veg sandwich with Jain-friendly fillings.', price: 90, category: 'jain', img: 'jain_sand.jpg' },
      { id: 'bkc-fish', name: 'Goan Fish Curry', desc: 'Tangy coconut curry with tender fish pieces.', price: 220, category: 'non-veg', img: 'goan.jpg' }
    ],
    Churchgate: [
      { id: 'churchgate-paneer', name: 'Paneer Butter Masala', desc: 'Creamy cottage cheese curry with rich tomato gravy.', price: 150, category: 'veg', img: 'paneer.jpg' },
      { id: 'churchgate-mutton', name: 'Mutton Curry', desc: 'Slow-cooked, rich, and deeply spiced.', price: 220, category: 'non-veg', img: 'mutton.jpg' },
      { id: 'churchgate-jain-pulao', name: 'Jain Pulao', desc: 'Fragrant rice with vegetables and aromatic spices.', price: 140, category: 'jain', img: 'jain_pul.jpg' },
      { id: 'churchgate-roti', name: 'Roti & Sabzi', desc: 'Simple, wholesome wheat roti with a fresh veg sabzi.', price: 110, category: 'veg', img: 'roti.jpg' },
      { id: 'churchgate-fish-fry', name: 'Fish Fry', desc: 'Crispy spicy fish fillets with a roasted finish.', price: 180, category: 'non-veg', img: 'fish_fry.jpg' }
    ],
    Andheri: [
      { id: 'andheri-pulao', name: 'Veg Pulao', desc: 'Basmati rice with vegetables and warm spices.', price: 150, category: 'veg', img: 'Pulao.jpeg' },
      { id: 'andheri-egg-curry', name: 'Egg Curry', desc: 'Boiled eggs simmered in a flavorful tomato gravy.', price: 100, category: 'non-veg', img: 'egg_curry.jpg' },
      { id: 'andheri-jain-pav', name: 'Jain Pav Bhaji', desc: 'Mumbai-style pav bhaji without onion and garlic.', price: 120, category: 'jain', img: 'jain_pav.jpg' },
      { id: 'andheri-rajma', name: 'Rajma Chawal', desc: 'A hearty North Indian favourite with soft rice.', price: 180, category: 'veg', img: 'Rajma_chawal.jpeg' },
      { id: 'andheri-chicken-fried-rice', name: 'Chicken Fried Rice', desc: 'Stir-fried rice with chicken and vegetables.', price: 180, category: 'non-veg', img: 'chick_fried.jpg' }
    ],
    Borivali: [
      { id: 'borivali-upma', name: 'Upma', desc: 'A quick, savoury and warm breakfast classic.', price: 90, category: 'veg', img: 'Upma.jpeg' },
      { id: 'borivali-dal', name: 'Dal Tadka', desc: 'Comforting lentils with tempering and ghee.', price: 120, category: 'veg', img: 'dal.jpg' },
      { id: 'borivali-chicken-curry', name: 'Chicken Curry', desc: 'Comfort bowl packed with hearty spice.', price: 200, category: 'non-veg', img: 'chick.jpg' },
      { id: 'borivali-jain-biryani', name: 'Jain Biryani', desc: 'Aromatic and satisfying without onion or garlic.', price: 200, category: 'jain', img: 'jain.jpg' },
      { id: 'borivali-fish-curry', name: 'Goan Fish Curry', desc: 'Tangy and creamy with coastal spices.', price: 220, category: 'non-veg', img: 'goan.jpg' }
    ]
  };

  function read(key){
    try { return JSON.parse(localStorage.getItem(key)); }
    catch (e) { return null; }
  }

  function write(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function showToast(message){
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('show');
    }, 2200);
  }

  function getLocationStorageKey(location){
    return `mfd_selection_${todayKey()}_${location.toLowerCase().replace(/\s+/g, '-')}`;
  }

  function getSelectedMeals(location){
    const raw = read(getLocationStorageKey(location));
    if (Array.isArray(raw)) return raw;
    return [];
  }

  function getCurrentLocation(){
    const panel = document.getElementById('menu-panel');
    const title = document.getElementById('selected-location-title');
    if (!panel || !title) return null;
    if (panel.classList.contains('hidden')) return null;
    return title.textContent.trim();
  }

  function renderLocationButtons(){
    const grid = document.getElementById('location-grid');
    if (!grid) return;

    grid.innerHTML = '';
    locations.forEach((location) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'location-card';
      button.textContent = location;
      button.addEventListener('click', () => {
        openLocation(location);
      });
      grid.appendChild(button);
    });
  }

  function renderMenu(location){
    const container = document.getElementById('menu-grid');
    const selectionText = document.getElementById('current-selection');
    const countEl = document.getElementById('selection-count');
    const selectedMeals = getSelectedMeals(location);

    if (!container) return;

    const items = filteredMenu(location);
    container.innerHTML = '';

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'menu-item';
      card.dataset.id = item.id;
      if (selectedMeals.includes(item.id)) {
        card.classList.add('selected');
      }

      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.name;
      img.onerror = () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        placeholder.textContent = item.name;
        card.replaceChild(placeholder, img);
      };

      const badge = document.createElement('div');
      badge.className = 'cat-badge';
      badge.textContent = item.category.toUpperCase();

      const title = document.createElement('h4');
      title.textContent = item.name;

      const desc = document.createElement('p');
      desc.textContent = item.desc;
      desc.className = 'muted';

      const price = document.createElement('div');
      price.className = 'menu-price';
      price.textContent = `₹${item.price}`;

      card.appendChild(img);
      card.appendChild(badge);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(price);
      card.addEventListener('click', () => chooseMeal(location, item.id));
      container.appendChild(card);
    });

    const mealMap = new Map((locationMenus[location] || []).map((item) => [item.id, item]));
    const names = selectedMeals.map((id) => mealMap.get(id)?.name).filter(Boolean);
    const total = selectedMeals.reduce((sum, id) => sum + (mealMap.get(id)?.price || 0), 0);

    if (selectionText) {
      selectionText.textContent = names.length ? `${names.join(', ')} — ${i18n.get('total')}: ₹${total}` : i18n.get('noSelection');
    }
    if (countEl) {
      countEl.textContent = i18n.get('selectionSummary').replace('{count}', selectedMeals.length).replace('{max}', MAX_SELECTION);
    }
  }

  function filteredMenu(location){
    const items = locationMenus[location] || [];
    const filterButtons = document.querySelectorAll('#menu-filters button[data-filter]');
    const activeFilter = [...filterButtons].find((button) => button.classList.contains('active'))?.dataset.filter || 'all';
    if (activeFilter === 'all') return items;
    return items.filter((item) => item.category === activeFilter);
  }

  function openLocation(location){
    const panel = document.getElementById('menu-panel');
    const title = document.getElementById('selected-location-title');
    const grid = document.getElementById('location-grid');
    if (!title || !panel) return;

    title.textContent = location;
    panel.classList.remove('hidden');
    if (grid) grid.classList.add('hidden');

    const buttons = document.querySelectorAll('.location-card');
    buttons.forEach((button) => {
      button.classList.toggle('active', button.textContent.trim() === location);
    });

    renderMenu(location);
  }

  function chooseMeal(location, id){
    const selected = getSelectedMeals(location);
    const index = selected.indexOf(id);

    if (index === -1) {
      if (selected.length >= MAX_SELECTION) {
        showToast(i18n.get('maxSelectionReached').replace('{count}', MAX_SELECTION));
        return;
      }
      selected.push(id);
    } else {
      selected.splice(index, 1);
    }

    write(getLocationStorageKey(location), selected);
    renderMenu(location);
  }

  function showCheckout(){
    const location = getCurrentLocation();
    if (!location) {
      showToast(i18n.get('selectLocationFirst'));
      return;
    }

    const modal = document.getElementById('checkout-modal');
    const totalEl = document.getElementById('checkout-total');
    const selected = getSelectedMeals(location);
    const mealMap = new Map((locationMenus[location] || []).map((item) => [item.id, item]));
    const total = selected.reduce((sum, id) => sum + (mealMap.get(id)?.price || 0), 0);

    if (!modal) return;
    if (totalEl) totalEl.textContent = `Total: ₹${total}`;
    modal.classList.remove('hidden');
    const form = document.getElementById('checkout-form');
    if (form) form.reset();
  }

  function finalizeOrder(details){
    const location = getCurrentLocation();
    if (!location) return;

    const selected = getSelectedMeals(location);
    if (!selected.length) {
      showToast(i18n.get('cartEmpty'));
      return;
    }

    const id = `ORD${Date.now().toString().slice(-6)}`;
    const order = {
      id,
      placedAt: new Date().toISOString(),
      location,
      items: selected,
      status: 'pending',
      delivery: {
        name: details.name,
        phone: details.phone,
        address: details.address,
        payment: details.payment
      }
    };

    if (window.mfdBackend && typeof window.mfdBackend.saveOrder === 'function') {
      window.mfdBackend.saveOrder(order);
    } else {
      const orders = read('mfd_orders') || [];
      const index = orders.findIndex((existing) => String(existing.id) === String(order.id));
      const nextOrders = [...orders];
      if (index >= 0) {
        nextOrders[index] = { ...nextOrders[index], ...order };
      } else {
        nextOrders.push(order);
      }
      const deduped = Array.from(new Map(nextOrders.map((entry) => [String(entry.id), entry])).values());
      write('mfd_orders', deduped);
    }
    write(getLocationStorageKey(location), []);

    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.add('hidden');

    const successModal = document.getElementById('order-success-modal');
    const successText = document.getElementById('order-success-message');
    if (successText) successText.textContent = `${id} • ${location}`;
    if (successModal) successModal.classList.remove('hidden');

    renderMenu(location);
  }

  function bindFilterButtons(){
    const filterWrap = document.getElementById('menu-filters');
    if (!filterWrap) return;

    filterWrap.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-filter]');
      if (!button) return;

      filterWrap.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
      const location = getCurrentLocation();
      if (location) renderMenu(location);
    });
  }

  document.addEventListener('click', function(e){
    const t = e.target.closest('a[href^="#"]');
    if(!t) return;
    e.preventDefault();
    const id = t.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  });

  function setMobileNav(open){
    const panel = document.getElementById('mobile-nav-panel');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if(!panel || !backdrop || !toggle) return;
    panel.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderLocationButtons();
    bindFilterButtons();
    document.addEventListener('i18n:changed', () => {
      const currentLocation = getCurrentLocation();
      if (currentLocation) renderMenu(currentLocation);
    });
    localStorage.removeItem('mfd_active_location');

    const changeLocationBtn = document.getElementById('change-location');
    if (changeLocationBtn) {
      changeLocationBtn.addEventListener('click', () => {
        const grid = document.getElementById('location-grid');
        const panel = document.getElementById('menu-panel');
        const title = document.getElementById('selected-location-title');
        document.querySelectorAll('.location-card').forEach((button) => {
          button.classList.remove('active');
        });
        localStorage.removeItem('mfd_active_location');
        if (title) title.textContent = i18n.get('selectLocation');
        if (grid) grid.classList.remove('hidden');
        if (panel) panel.classList.add('hidden');
      });
    }

    const placeOrderBtn = document.getElementById('place-order');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', showCheckout);
    }

    const checkoutCancel = document.getElementById('checkout-cancel');
    if (checkoutCancel) {
      checkoutCancel.addEventListener('click', () => {
        const modal = document.getElementById('checkout-modal');
        if (modal) modal.classList.add('hidden');
      });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('order-name').value.trim();
        const phone = document.getElementById('order-phone').value.trim();
        const address = document.getElementById('order-address').value.trim();
        const payment = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
        if (!name || !phone || !address) {
          showToast(i18n.get('completeCheckout'));
          return;
        }
        finalizeOrder({ name, phone, address, payment });
      });
    }

    const successClose = document.getElementById('order-success-close');
    const successModal = document.getElementById('order-success-modal');
    if (successClose && successModal) {
      successClose.addEventListener('click', () => successModal.classList.add('hidden'));
    }
    if (successModal) {
      successModal.querySelector('.modal-overlay').addEventListener('click', () => successModal.classList.add('hidden'));
    }

    document.querySelectorAll('.fade-up').forEach((el, index)=>{
      el.style.animationDelay = (index * 80) + 'ms';
    });

    document.querySelectorAll('.nav a').forEach((a)=>{
      a.addEventListener('click', ()=>{
        a.classList.add('nav-pop');
        setTimeout(() => a.classList.remove('nav-pop'), 260);
      });
    });

    const toggle = document.querySelector('.mobile-menu-toggle');
    const closeBtn = document.querySelector('.mobile-nav-close');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const panel = document.getElementById('mobile-nav-panel');

    if(toggle){
      toggle.addEventListener('click', ()=> {
        const open = panel && panel.classList.contains('open');
        setMobileNav(!open);
      });
    }

    if(closeBtn){ closeBtn.addEventListener('click', ()=> setMobileNav(false)); }
    if(backdrop){ backdrop.addEventListener('click', ()=> setMobileNav(false)); }
    document.querySelectorAll('.mobile-nav a').forEach((link) => {
      link.addEventListener('click', ()=> setMobileNav(false));
    });

    const headerSelect = document.getElementById('lang-select');
    const mobileSelect = document.getElementById('mobile-lang-select');
    const syncLangSelection = (sourceValue)=>{
      const selects = [headerSelect, mobileSelect].filter(Boolean);
      selects.forEach((select) => { select.value = sourceValue; });
      if(typeof i18n !== 'undefined' && typeof i18n.setLang === 'function') {
        i18n.setLang(sourceValue);
      }
    };

    if(headerSelect){
      headerSelect.addEventListener('change', (e)=> syncLangSelection(e.target.value));
    }
    if(mobileSelect){
      mobileSelect.addEventListener('change', (e)=> syncLangSelection(e.target.value));
    }
    if(headerSelect && mobileSelect){
      syncLangSelection(headerSelect.value);
    }
  });
})();
