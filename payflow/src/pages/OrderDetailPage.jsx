import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import Badge from '../components/Badge';

export default function OrderDetailPage({
  order,
  setPage,
  setSelectedPayment
}) {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!order) {
    return (
      <div className="card empty">
        No order selected.{' '}
        <span
          style={{ color: '#0284C7', cursor: 'pointer' }}
          onClick={() => setPage('orders')}
        >
          Go to Orders
        </span>
      </div>
    );
  }

  async function handlePay() {
  try {
    setLoading(true);
    setError('');

    // Initiate payment
    const paymentDto = await apiFetch(
      '/payments/pay',
      {
        method: 'POST',
        body: JSON.stringify({
          orderNumber: order.orderNumber,
        }),
      },
      token
    );

    const options = {
      key: 'rzp_test_Sz8l7vAX7ZsEmX',
      amount: Math.round(Number(paymentDto.amount) * 100),
      currency: 'INR',
      name: 'PayFlow',
      description: `Payment for Order #${order.orderNumber}`,
      order_id: paymentDto.gatewayOrderId,

      handler: async function (response) {
        try {
          await apiFetch(
            '/payments/verify',
            {
              method: 'POST',
              body: JSON.stringify({
                paymentId: paymentDto.paymentId,
                gatewayOrderId: response.razorpay_order_id,
                gatewayPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            },
            token
          );

          alert('Payment successful');

          setPage('payments');
        } catch (err) {
          alert('Payment verification failed');
        }
      },

      modal: {
        ondismiss: () => {
          console.log('Payment cancelled by user');
        },
      },

      theme: {
        color: '#0284C7',
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      alert(
        `Payment Failed: ${
          response.error?.description || 'Unknown error'
        }`
      );
    });

    rzp.open();
  } catch (err) {
    setError(err.message || 'Failed to initiate payment');
  } finally {
    setLoading(false);
  }
}
  async function cancelOrder() {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setLoading(true);

      await apiFetch(
        `/orders/cancel/${order.orderNumber}`,
        {
          method: 'PUT',
        },
        token
      );

      alert('Order cancelled successfully');

      setPage('orders');
    } catch (err) {
      setError(err.message || 'Failed to cancel order.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <div className="page-header">
        <button
          className="btn btn-outline"
          style={{
            marginBottom: 14,
            padding: '6px 14px',
            fontSize: 13,
          }}
          onClick={() => setPage('orders')}
        >
          ← Back to Orders
        </button>

        <div className="page-title">Order Details</div>
      </div>

      <div className="card">
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Order Number</span>
          <span className="detail-value">{order.orderNumber}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Amount</span>
          <span
            className="detail-value"
            style={{
              color: '#0284C7',
              fontSize: 20,
            }}
          >
            ₹{order.amount}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Status</span>
          <span className="detail-value">
            <Badge status={order.orderStatus} />
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">User ID</span>
          <span className="detail-value">{order.userId}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Created At</span>
          <span className="detail-value">
            {order.orderCreatedAt
              ? new Date(order.orderCreatedAt).toLocaleString()
              : '—'}
          </span>
        </div>

        {order.orderStatus === 'PENDING' && (
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              gap: '10px',
            }}
          >
            <button
              className="btn btn-primary"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? 'Processing...' : '💳 Pay Now'}
            </button>

            <button
              className="btn"
              onClick={cancelOrder}
              disabled={loading}
              style={{
                background: '#dc2626',
                color: 'white',
              }}
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}