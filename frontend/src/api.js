const BASE = import.meta.env.VITE_API_URL || "";

// Thin wrapper around fetch for all backend calls
async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  getProducts: (search = "") => request(`${BASE}/api/products?search=${encodeURIComponent(search)}`),
  addProduct: (p) => request(`${BASE}/api/products`, { method: "POST", body: JSON.stringify(p) }),
  updateProduct: (id, p) => request(`${BASE}/api/products/${id}`, { method: "PUT", body: JSON.stringify(p) }),
  deleteProduct: (id) => request(`${BASE}/api/products/${id}`, { method: "DELETE" }),
  getOrders: () => request(`${BASE}/api/orders`),
  placeOrder: (o) => request(`${BASE}/api/orders`, { method: "POST", body: JSON.stringify(o) }),
  cancelOrder: (id) => request(`${BASE}/api/orders/${id}/cancel`, { method: "PUT" }),
};
