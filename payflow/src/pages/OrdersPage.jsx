import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";
import Badge from "../components/Badge";

export default function OrdersPage({ setPage, setSelectedOrder }) {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState("");

  const loadAllOrders = async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/orders/ordersByUserId", {}, token);

      setOrders(data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllOrders();
  }, [token]);

  const filterByOrderNumber = async () => {
    if (!orderNumber.trim()) {
      alert("Please enter an Order Number");
      return;
    }

    try {
      setLoading(true);

      const data = await apiFetch(
        `/orders/number?orderNumber=${encodeURIComponent(orderNumber)}`,
        {},
        token,
      );

      setOrders(data ? [data] : []);
      setError("");
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterByStatus = async () => {
    if (!status) {
      alert("Please select a status");
      return;
    }

    try {
      setLoading(true);

      const data = await apiFetch(`/orders/status/${status}`, {}, token);

      setOrders(data || []);
      setError("");
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div className="page-title">Orders</div>
          <div className="page-sub">All your orders in one place</div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Order Number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="form-input"
            style={{ width: "180px" }}
          />

          <button className="btn btn-outline" onClick={filterByOrderNumber}>
            Search Order
          </button>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-input"
            style={{ width: "160px" }}
          >
            <option value="">Select Status</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="FAILED">FAILED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <button className="btn btn-outline" onClick={filterByStatus}>
            Filter Status
          </button>

          <button className="btn btn-outline" onClick={loadAllOrders}>
            Reset
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setPage("create-order")}
          >
            + New Order
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="card empty">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="card empty">
          <div className="empty-icon">📋</div>
          No orders found.
          <span
            style={{
              color: "#0284C7",
              cursor: "pointer",
              marginLeft: "5px",
            }}
            onClick={() => setPage("create-order")}
          >
            Create your first order
          </span>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.orderNumber}>
                  <td>
                    <strong>{o.orderNumber}</strong>
                  </td>

                  <td>₹{o.amount}</td>

                  <td>
                    <Badge status={o.orderStatus} />
                  </td>

                  <td
                    style={{
                      fontSize: 12,
                      color: "#94A3B8",
                    }}
                  >
                    {o.orderCreatedAt
                      ? new Date(o.orderCreatedAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <button
                      className="btn btn-outline"
                      style={{
                        padding: "4px 12px",
                        fontSize: 12,
                      }}
                      onClick={() => {
                        setSelectedOrder(o);
                        setPage("order-detail");
                      }}
                    >
                      View
                    
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
