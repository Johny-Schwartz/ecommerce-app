import { useEffect, useState } from "react";
import { api } from "../api.js";

// Dashboard component: displays high-level stats and the product catalog
export default function Dashboard({ cart = [], onAddToCart, notify }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch products and orders using existing endpoints
  const loadData = async () => {
    try {
      const [p, o] = await Promise.all([api.getProducts(), api.getOrders()]);
      setProducts(p);
      setOrders(o);
    } catch (err) {
      notify(err.message, "danger");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate stats in the frontend
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status === "Placed")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      {/* 3 Simple Bootstrap Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-light shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Products</h6>
              <h2 className="card-title text-primary fw-bold">{totalProducts}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-light shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Orders</h6>
              <h2 className="card-title text-info fw-bold">{totalOrders}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-light shadow-sm">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Revenue</h6>
              <h2 className="card-title text-success fw-bold">₹{totalRevenue}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <h4 className="mb-3">Products</h4>
      <div className="row g-3">
        {products.map((p) => {
          // Calculate available stock minus items already in cart
          const inCart = cart.find((c) => c._id === p._id)?.qty || 0;
          const availableStock = Math.max(0, p.quantity - inCart);

          return (
            <div className="col-sm-6 col-lg-4" key={p._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <span className="badge bg-secondary mb-2">{p.category}</span>
                  <h5 className="card-title">{p.name}</h5>
                  {p.description && <p className="card-text text-muted small">{p.description}</p>}
                  <p className="mb-1 fw-bold fs-5">₹{p.price}</p>
                  <p className={availableStock > 0 ? "text-success mb-2" : "text-danger mb-2"}>
                    {availableStock > 0 ? `In stock: ${availableStock}` : "Out of stock"}
                  </p>
                </div>
                <div className="card-footer bg-white border-top-0 pt-0">
                  <button
                    className="btn btn-success btn-sm w-100"
                    disabled={availableStock < 1}
                    onClick={() => onAddToCart(p)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {products.length === 0 && <p className="text-muted">No products available.</p>}
      </div>
    </>
  );
}
