const BASE = 'http://localhost:8080/payment';

export async function apiFetch(path, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(txt || `HTTP ${res.status}`);
  }

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json')
    ? res.json()
    : res.text();
}

/* ---------------- Payment APIs ---------------- */

export const paymentApi = {
  getUserPayments: (token) =>
  apiFetch('/payments/user', {}, token),


  retryPayment: (body, token) =>
  apiFetch('/payments/retry', {
    method: 'POST',
    body: JSON.stringify(body),
  }, token),

initiatePayment: (body, token) =>
  apiFetch('/payments/pay', {
    method: 'POST',
    body: JSON.stringify(body),
  }, token),

  cancelPayment: (paymentId, token) =>
    apiFetch(`/payments/cancel/${paymentId}`, {
      method: 'POST',
    }, token),

  getPaymentById: (paymentId, token) =>
    apiFetch(`/payments/getById/${paymentId}`, {}, token),

  getPaymentStatus: (paymentId, token) =>
    apiFetch(`/payments/getByStatus/${paymentId}`, {}, token),

  verifyPayment: (body, token) =>
    apiFetch('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(body),
    }, token),
};