import { useState } from "react";
import { api } from "../api.js";

export default function Cart({ cart, setCart, onOrdered, notify }) {
  const [customerName, setCustomerName] = useState("");

  // Calculate total bill
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  // Update item quantity (capped between 1 and available stock)
  const setQty = (id, qty, stock) => {
    if (qty < 1) return;
    if (qty > stock) {
      return notify("Cannot exceed available stock", "warning");
    }
    setCart(cart.map((c) => (c._id === id ? { ...c, qty } : c)));
  };

  // Remove item from cart
  const remove = (id) => setCart(cart.filter((c) => c._id !== id));

  // Place order
  const placeOrder = async () => {
    try {
      await api.placeOrder({
        customerName: customerName.trim(),
        items: cart.map((c) => ({ productId: c._id, qty: c.qty })),
      });
      notify("Order placed successfully");
      setCustomerName("");
      onOrdered();
    } catch (err) {
      notify(err.message, "danger");
    }
  };

  if (cart.length === 0) return <p className="text-muted">Your cart is empty.</p>;

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th style={{ width: 160 }}>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>₹{c.price}</td>
                <td>
                  <div className="input-group input-group-sm">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQty(c._id, c.qty - 1, c.stock)}
                      disabled={c.qty <= 1}
                    >
                      −
                    </button>
                    <input className="form-control text-center" value={c.qty} readOnly />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQty(c._id, c.qty + 1, c.stock)}
                      disabled={c.qty >= c.stock}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>₹{c.price * c.qty}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(c._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="3" className="text-end">Total Bill</th>
              <th colSpan="2">₹{total}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="row g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <button
            className="btn btn-primary"
            disabled={!customerName.trim()}
            onClick={placeOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}
