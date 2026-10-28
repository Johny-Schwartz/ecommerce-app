import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Orders({ notify }) {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    try {
      setOrders(await api.getOrders());
    } catch (err) {
      notify(err.message, "danger");
    }
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.cancelOrder(id);
      notify("Order cancelled and stock updated");
      load();
    } catch (err) {
      notify(err.message, "danger");
    }
  };

  if (orders.length === 0) return <p className="text-muted">No orders yet.</p>;

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.customerName}</td>
              <td>{o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</td>
              <td>₹{o.total}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>
                <span className={`badge ${o.status === "Placed" ? "bg-success" : "bg-secondary"}`}>{o.status}</span>
              </td>
              <td>
                {o.status === "Placed" && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(o._id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
