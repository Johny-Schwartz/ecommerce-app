import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function ProductList({ cart = [], onAddToCart, onEdit, notify }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setProducts(await api.getProducts(search));
    } catch (err) {
      notify(err.message, "danger");
    }
  };

  // Re-fetch whenever the search text changes (search by name or category)
  useEffect(() => { load(); }, [search]);

  const remove = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    try {
      await api.deleteProduct(p._id);
      notify("Product deleted");
      load();
    } catch (err) {
      notify(err.message, "danger");
    }
  };

  return (
    <>
      <input
        className="form-control mb-3"
        placeholder="Search by name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="row g-3">
        {products.map((p) => {
          // Calculate available stock minus items already in cart
          const inCart = cart.find((c) => c._id === p._id)?.qty || 0;
          const availableStock = Math.max(0, p.quantity - inCart);

          return (
            <div className="col-sm-6 col-lg-4" key={p._id}>
              <div className="card h-100">
                <div className="card-body">
                  <span className="badge bg-secondary mb-2">{p.category}</span>
                  <h5 className="card-title">{p.name}</h5>
                  <p className="text-muted small mb-1">ID: {p.productId}</p>
                  <p className="card-text">{p.description}</p>
                  <p className="mb-0 fw-bold">₹{p.price}</p>
                  <p className={availableStock > 0 ? "text-success" : "text-danger"}>
                    {availableStock > 0 ? `In stock: ${availableStock}` : "Out of stock"}
                  </p>
                </div>
                <div className="card-footer d-flex gap-2">
                  <button
                    className="btn btn-success btn-sm"
                    disabled={availableStock < 1}
                    onClick={() => onAddToCart(p)}
                  >
                    Add to Cart
                  </button>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit(p)}>
                    Edit
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => remove(p)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {products.length === 0 && <p className="text-muted">No products found.</p>}
      </div>
    </>
  );
}
