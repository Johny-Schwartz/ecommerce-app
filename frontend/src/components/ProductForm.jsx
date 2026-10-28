import { useState, useEffect } from "react";
import { api } from "../api.js";

const empty = { productId: "", name: "", category: "", price: "", description: "", quantity: "" };

export default function ProductForm({ editing, onDone, notify }) {
  const [form, setForm] = useState(editing || empty);

  useEffect(() => {
    setForm(editing || empty);
  }, [editing]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), quantity: Number(form.quantity) };
    try {
      if (editing) {
        await api.updateProduct(editing._id, payload);
        notify("Product updated");
      } else {
        await api.addProduct(payload);
        notify("Product added");
      }
      onDone();
    } catch (err) {
      notify(err.message, "danger");
    }
  };

  return (
    <form onSubmit={submit} className="card card-body">
      <h5>{editing ? "Edit Product" : "Add New Product"}</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Product ID</label>
          <input className="form-control" name="productId" value={form.productId} onChange={change} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Name</label>
          <input className="form-control" name="name" value={form.name} onChange={change} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Category</label>
          <input className="form-control" name="category" value={form.category} onChange={change} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Price (₹)</label>
          <input type="number" min="0" className="form-control" name="price" value={form.price} onChange={change} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Quantity</label>
          <input type="number" min="0" className="form-control" name="quantity" value={form.quantity} onChange={change} required />
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="2" name="description" value={form.description} onChange={change} />
        </div>
      </div>
      <div className="mt-3">
        <button className="btn btn-primary me-2" type="submit">{editing ? "Update" : "Add Product"}</button>
        <button className="btn btn-outline-secondary" type="button" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}
