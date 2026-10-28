import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard.jsx";
import ProductForm from "./components/ProductForm.jsx";
import ProductList from "./components/ProductList.jsx";
import Cart from "./components/Cart.jsx";
import Orders from "./components/Orders.jsx";

export default function App() {
  // Default tab is "dashboard"
  const [tab, setTab] = useState("dashboard");

  // Load initial cart from localStorage (with try/catch for safety)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Auto-hide popup toast after 2 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Show feedback popup
  const notify = (text, type = "success") => {
    setToast({ text, type });
  };

  // Add product to cart with stock validation
  const addToCart = (p) => {
    const existing = cart.find((c) => c._id === p._id);
    const inCartQty = existing ? existing.qty : 0;

    // Show warning if trying to add more than available stock
    if (inCartQty >= p.quantity) {
      return notify("No more stock available", "warning");
    }

    if (existing) {
      setCart(cart.map((c) => (c._id === p._id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { _id: p._id, name: p.name, price: p.price, stock: p.quantity, qty: 1 }]);
    }
    notify(`Product "${p.name}" added to cart successfully`, "success");
  };

  // Total item count in cart
  const cartCount = cart.reduce((n, c) => n + c.qty, 0);

  // App tabs (Dashboard is first)
  const tabs = [
    ["dashboard", "Dashboard"],
    ["products", "Products"],
    ["form", editing ? "Edit Product" : "Add Product"],
    ["cart", `Cart (${cartCount})`],
    ["orders", "Orders"],
  ];

  return (
    <>
      {/* Navbar with brand and Cart button */}
      <nav className="navbar navbar-dark bg-dark mb-3">
        <div className="container">
          <span
            className="navbar-brand fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => setTab("dashboard")}
          >
            🛒 E-Commerce App
          </span>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setTab("cart")}
          >
            Cart <span className="badge bg-danger ms-1">{cartCount}</span>
          </button>
        </div>
      </nav>

      {/* Bootstrap Toast fixed at top-right (visible even when scrolled) */}
      {toast && (
        <div
          className="toast-container position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1080 }}
        >
          <div
            className={`toast show align-items-center text-bg-${toast.type} border-0 shadow`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body fw-semibold">{toast.text}</div>
              <button
                type="button"
                className={`btn-close ${toast.type === "warning" ? "" : "btn-close-white"} me-2 m-auto`}
                onClick={() => setToast(null)}
              ></button>
            </div>
          </div>
        </div>
      )}

      <div className="container pb-5">
        {/* Navigation Tabs */}
        <ul className="nav nav-pills mb-3 flex-wrap">
          {tabs.map(([key, label]) => (
            <li className="nav-item" key={key}>
              <button
                className={`nav-link ${tab === key ? "active" : ""}`}
                onClick={() => {
                  if (key === "form" && tab !== "form") setEditing(null);
                  setTab(key);
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Tab Views */}
        {tab === "dashboard" && (
          <Dashboard cart={cart} onAddToCart={addToCart} notify={notify} />
        )}
        {tab === "products" && (
          <ProductList
            cart={cart}
            onAddToCart={addToCart}
            onEdit={(p) => {
              setEditing(p);
              setTab("form");
            }}
            notify={notify}
          />
        )}
        {tab === "form" && (
          <ProductForm
            editing={editing}
            notify={notify}
            onDone={() => {
              setEditing(null);
              setTab("products");
            }}
          />
        )}
        {tab === "cart" && (
          <Cart
            cart={cart}
            setCart={setCart}
            notify={notify}
            onOrdered={() => {
              setCart([]);
              localStorage.removeItem("cart");
              setTab("orders");
            }}
          />
        )}
        {tab === "orders" && <Orders notify={notify} />}
      </div>
    </>
  );
}
