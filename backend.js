(function () {
  const STORAGE_KEY = 'mfd_orders';

  window.MFD_FIREBASE_CONFIG = Object.assign({
    enabled: false,
    apiKey: 'AIzaSyCo_CI3at3dLP949Vw1hpZHwPmDV_bR3iA',
    authDomain: 'tiffin-28594.firebaseapp.com',
    projectId: 'tiffin-28594',
    storageBucket: 'tiffin-28594.firebasestorage.app',
    messagingSenderId: '789036216905',
    appId: '1:789036216905:web:10480e3d1d599406b54598',
    measurementId: 'G-F0GLXNCMKQ'
  }, window.MFD_FIREBASE_CONFIG || {});

  function dedupeOrders(orders) {
    const seen = new Map();

    (Array.isArray(orders) ? orders : []).forEach((order) => {
      if (!order || !order.id) return;
      const key = String(order.id);
      const existing = seen.get(key);

      if (!existing) {
        seen.set(key, order);
        return;
      }

      const existingTime = new Date(existing.placedAt || 0).getTime();
      const incomingTime = new Date(order.placedAt || 0).getTime();
      seen.set(key, incomingTime >= existingTime ? order : existing);
    });

    return Array.from(seen.values());
  }

  function readLocalOrders() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return dedupeOrders(Array.isArray(value) ? value : []);
    } catch (error) {
      return [];
    }
  }

  function writeLocalOrders(orders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dedupeOrders(orders)));
  }

  function firebaseReady() {
    if (!window.MFD_FIREBASE_CONFIG.enabled || !window.firebase) {
      return null;
    }

    const config = window.MFD_FIREBASE_CONFIG;
    const hasRequired = config.apiKey && config.projectId && config.appId;
    if (!hasRequired) {
      return null;
    }

    if (!window.firebase.apps || !window.firebase.apps.length) {
      window.firebase.initializeApp(config);
    }

    return window.firebase.firestore();
  }

  function normalizeOrder(doc) {
    const data = doc && typeof doc.data === 'function' ? doc.data() : {};
    return {
      id: data.id || doc.id,
      placedAt: data.placedAt || data.placed_at || new Date().toISOString(),
      location: data.location || 'General',
      status: data.status || 'pending',
      items: Array.isArray(data.items) ? data.items : [],
      delivery: data.delivery || {}
    };
  }

  async function loadRemoteOrders() {
    const db = firebaseReady();
    if (!db) {
      return readLocalOrders();
    }

    try {
      const snapshot = await db.collection('orders').get();
      const orders = snapshot.docs.map(normalizeOrder);
      if (orders.length) {
        writeLocalOrders(orders);
      }
      return orders;
    } catch (error) {
      console.warn('Firebase load failed, using local storage fallback:', error);
      return readLocalOrders();
    }
  }

  async function saveRemoteOrder(order) {
    const db = firebaseReady();
    if (!db) return order;

    try {
      await db.collection('orders').doc(order.id).set({
        id: order.id,
        placedAt: order.placedAt || new Date().toISOString(),
        location: order.location || 'General',
        status: order.status || 'pending',
        items: order.items || [],
        delivery: order.delivery || {}
      }, { merge: true });
    } catch (error) {
      console.warn('Firebase save failed:', error);
    }

    return order;
  }

  async function updateRemoteOrderStatus(id, status) {
    const db = firebaseReady();
    if (!db) return;

    try {
      await db.collection('orders').doc(id).update({ status });
    } catch (error) {
      console.warn('Firebase status update failed:', error);
    }
  }

  async function deleteRemoteOrder(id) {
    const db = firebaseReady();
    if (!db) return;

    try {
      await db.collection('orders').doc(id).delete();
    } catch (error) {
      console.warn('Firebase delete failed:', error);
    }
  }

  window.mfdBackend = {
    isEnabled() {
      const isLocalFile = typeof window !== 'undefined' && window.location && window.location.protocol === 'file:';
      return Boolean(
        window.MFD_FIREBASE_CONFIG &&
        window.MFD_FIREBASE_CONFIG.enabled &&
        window.firebase &&
        !isLocalFile
      );
    },
    readLocalOrders,
    writeLocalOrders,
    async loadOrders() {
      if (this.isEnabled()) {
        return loadRemoteOrders();
      }
      return readLocalOrders();
    },
    async saveOrder(order) {
      const orders = readLocalOrders();
      const index = orders.findIndex((existing) => String(existing.id) === String(order.id));
      const nextOrders = [...orders];

      if (index >= 0) {
        nextOrders[index] = { ...nextOrders[index], ...order };
      } else {
        nextOrders.push(order);
      }

      writeLocalOrders(nextOrders);
      if (this.isEnabled()) {
        await saveRemoteOrder(order);
      }
      document.dispatchEvent(new CustomEvent('mfd:ordersUpdated'));
      return readLocalOrders();
    },
    async updateOrderStatus(id, status) {
      const orders = readLocalOrders();
      const target = orders.find((order) => order.id === id);
      if (target) {
        target.status = status;
        writeLocalOrders(orders);
      }
      if (this.isEnabled()) {
        await updateRemoteOrderStatus(id, status);
      }
      document.dispatchEvent(new CustomEvent('mfd:ordersUpdated'));
      return orders;
    },
    async deleteOrder(id) {
      const orders = readLocalOrders();
      const filtered = orders.filter((order) => order.id !== id);
      writeLocalOrders(filtered);
      if (this.isEnabled()) {
        await deleteRemoteOrder(id);
      }
      document.dispatchEvent(new CustomEvent('mfd:ordersUpdated'));
      return filtered;
    }
  };
})();
