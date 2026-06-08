/**
 * DECORISA - api.js
 * Cliente HTTP centralizado para comunicacao com o backend oficial.
 */

const API_URL = window.DECORISA_API_URL || 'https://decorisa-api.onrender.com/api';

/* === TOKEN === */
const Auth = {
  getToken: () => localStorage.getItem('decorisa_token'),
  setToken: (t) => localStorage.setItem('decorisa_token', t),
  clearToken: () => localStorage.removeItem('decorisa_token'),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('decorisa_user') || 'null'); }
    catch { return null; }
  },
  setUser: (u) => localStorage.setItem('decorisa_user', JSON.stringify(u)),
  clearUser: () => localStorage.removeItem('decorisa_user'),
  isLoggedIn: () => !!Auth.getToken(),
  isAdmin: () => Auth.getUser()?.role === 'admin',
  logout: () => { Auth.clearToken(); Auth.clearUser(); window.location.href = '/pages/cliente.html'; },
};

/* === REQUEST HELPER === */
async function request(method, path, body = null, auth = false) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth || Auth.getToken()) {
    headers.Authorization = `Bearer ${Auth.getToken()}`;
  }

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${path}`, opts);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || `Erro ${res.status}`);
    err.status = res.status;
    err.fields = data.fields || [];
    throw err;
  }

  return data;
}

const get = (path, auth) => request('GET', path, null, auth);
const post = (path, body, auth) => request('POST', path, body, auth);
const put = (path, body, auth) => request('PUT', path, body, auth);
const patch = (path, body, auth) => request('PATCH', path, body, auth);
const del = (path, auth) => request('DELETE', path, null, auth);

/* === API === */
const api = {
  auth: {
    async register(name, email, password, phone) {
      const data = await post('/auth/register', { name, email, password, phone });
      Auth.setToken(data.token);
      Auth.setUser(data.user);
      return data;
    },
    async login(email, password) {
      const data = await post('/auth/login', { email, password });
      Auth.setToken(data.token);
      Auth.setUser(data.user);
      return data;
    },
    async me() {
      return get('/auth/me', true);
    },
    async updateProfile(payload) {
      const data = await put('/auth/profile', payload, true);
      Auth.setUser(data.user);
      return data;
    },
    async forgotPassword(email) {
      return post('/auth/forgot-password', { email });
    },
    async resetPassword(token, password) {
      return post('/auth/reset-password', { token, password });
    },
    logout: Auth.logout,
    isLoggedIn: Auth.isLoggedIn,
    isAdmin: Auth.isAdmin,
    getUser: Auth.getUser,
  },

  products: {
    async list({ category, featured, search, sort, order, page, limit } = {}) {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (featured) params.set('featured', featured);
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);
      if (order) params.set('order', order);
      if (page) params.set('page', page);
      if (limit) params.set('limit', limit);
      return get(`/products?${params}`);
    },
    async get(slug) {
      return get(`/products/${slug}`);
    },
    async categories() {
      return get('/products/categories');
    },
    async create(payload) {
      return post('/products', payload, true);
    },
    async update(id, payload) {
      return put(`/products/${id}`, payload, true);
    },
    async delete(id) {
      return del(`/products/${id}`, true);
    },
    async addImage(id, payload) {
      return post(`/products/${id}/images`, payload, true);
    },
    async addVariant(id, payload) {
      return post(`/products/${id}/variants`, payload, true);
    },
  },

  images: {
    /**
     * Upload de imagem via multipart/form-data.
     * Retorna uma Promise com progresso via onProgress(percent).
     */
    upload(productId, file, { alt = '', sort_order = 0, is_cover = false, onProgress } = {}) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);
        if (alt)        formData.append('alt', alt);
        formData.append('sort_order', String(sort_order));
        formData.append('is_cover', String(is_cover));

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/images/products/${productId}/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${Auth.getToken()}`);

        if (typeof onProgress === 'function') {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              onProgress(Math.round((e.loaded / e.total) * 100));
            }
          });
        }

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data);
            } else {
              const err = new Error(data.error || `Erro ${xhr.status}`);
              err.status = xhr.status;
              reject(err);
            }
          } catch {
            reject(new Error('Resposta inválida do servidor.'));
          }
        };

        xhr.onerror = () => reject(new Error('Erro de rede. Verifique sua conexão.'));
        xhr.ontimeout = () => reject(new Error('Tempo limite de upload excedido.'));
        xhr.timeout = 60000; // 60s

        xhr.send(formData);
      });
    },

    async list(productId) {
      return get(`/images/products/${productId}`);
    },

    async delete(imageId) {
      return del(`/images/${imageId}`, true);
    },

    async setCover(imageId) {
      return patch(`/images/${imageId}/cover`, {}, true);
    },

    async update(imageId, payload) {
      return patch(`/images/${imageId}`, payload, true);
    },
  },

  orders: {
    async create(payload) {
      return post('/orders', payload);
    },
    async mine() {
      return get('/orders/mine', true);
    },
    async get(id) {
      return get(`/orders/${id}`, true);
    },
    async list({ status, page, limit, search } = {}) {
      const p = new URLSearchParams();
      if (status) p.set('status', status);
      if (page) p.set('page', page);
      if (limit) p.set('limit', limit);
      if (search) p.set('search', search);
      return get(`/orders?${p}`, true);
    },
    async updateStatus(id, payload) {
      return patch(`/orders/${id}/status`, payload, true);
    },
  },

  coupons: {
    async validate(code, subtotal) {
      return post('/coupons/validate', { code, subtotal });
    },
    async list() {
      return get('/coupons', true);
    },
    async create(payload) {
      return post('/coupons', payload, true);
    },
    async toggle(id, active) {
      return patch(`/coupons/${id}`, { active }, true);
    },
  },

  addresses: {
    async list() {
      return get('/addresses', true);
    },
    async create(payload) {
      return post('/addresses', payload, true);
    },
    async update(id, payload) {
      return put(`/addresses/${id}`, payload, true);
    },
    async delete(id) {
      return del(`/addresses/${id}`, true);
    },
  },

  newsletter: {
    async subscribe(email) {
      return post('/newsletter', { email });
    },
  },

  contact: {
    async send(payload) {
      return post('/contact', payload);
    },
  },

  payment: {
    async createMPPreference(order_id) {
      return post('/payment/mp/preference', { order_id }, true);
    },
    async getShipping(cep) {
      return get(`/payment/shipping/${cep.replace(/\D/g, '')}`);
    },
  },

  admin: {
    async metrics() {
      return get('/admin/metrics', true);
    },
    async lowStock() {
      return get('/admin/low-stock', true);
    },
    async clients({ page, limit, search } = {}) {
      const p = new URLSearchParams();
      if (page) p.set('page', page);
      if (limit) p.set('limit', limit);
      if (search) p.set('search', search);
      return get(`/admin/clients?${p}`, true);
    },
    async banners() {
      return get('/admin/banners', true);
    },
    async updateBanner(id, payload) {
      return put(`/admin/banners/${id}`, payload, true);
    },
    async newsletter() {
      return get('/newsletter', true);
    },
    async allCategories() {
      return get('/admin/categories', true);
    },
    async createCategory(payload) {
      return post('/admin/categories', payload, true);
    },
    async updateCategory(id, payload) {
      return put(`/admin/categories/${id}`, payload, true);
    },
    async deleteCategory(id) {
      return del(`/admin/categories/${id}`, true);
    },
  },
};

window.api = api;
window.Auth = Auth;
