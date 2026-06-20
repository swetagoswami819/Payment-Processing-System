import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";

export default function CreateOrderPage({ setPage, setSelectedOrder }) {
  const { token } = useAuth();
  const [form, setForm] = useState({ amount: "", userId: 1 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const order = await apiFetch(
        "/orders/buy",
        {
          method: "POST",
          body: JSON.stringify({
            amount: parseFloat(form.amount),
            userId: Number(form.userId),
          }),
        },
        token,
      );
      setSelectedOrder(order);
      setPage("order-detail");
    } catch (err) {
      setError(err.message || "Failed to create order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div className="page-header">
        <div className="page-title">Create Order</div>
        <div className="page-sub">Fill in the details to place a new order</div>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Order Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              min="1"
              step="0.01"
              placeholder="e.g. 500"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Order Description</label>
            <input
              className="form-input"
              type="text"
              value={form.orderDescription}
              onChange={(e) =>
                setForm({ ...form, orderDescription: e.target.value })
              }
              required
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Creating…
                </>
              ) : (
                "+ Create Order"
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setPage("orders")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
