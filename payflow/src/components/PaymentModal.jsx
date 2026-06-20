import { useState, useEffect } from 'react';
import styles from './PaymentModal.module.css';

export default function PaymentModal({ mode, prefill, onClose, onSubmit }) {
  const [orderNumber, setOrderNumber] = useState('');
  const [amount, setAmount]           = useState('');
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    if (prefill) {
      setOrderNumber(String(prefill.orderId || ''));
      setAmount(String(prefill.amount || ''));
    } else {
      setOrderNumber('');
      setAmount('');
    }
    setLoading(false);
  }, [mode, prefill]);

  const isRetry = mode === 'retry';

  async function handleSubmit() {
    if (!orderNumber.trim() || !amount) return;
    setLoading(true);
    try {
      await onSubmit({ orderNumber: orderNumber.trim(), Amount: parseFloat(amount) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{isRetry ? 'Retry payment' : 'New payment'}</h2>
            <p className={styles.sub}>
              {isRetry ? `Re-attempt checkout for order ${prefill?.orderId}` : 'Enter details to open Razorpay checkout'}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label htmlFor="orderNumber">Order number</label>
            <input
              id="orderNumber"
              type="text"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="e.g. ORD-2025-001"
              disabled={isRetry}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="payAmount">Amount (INR ₹)</label>
            <input
              id="payAmount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 500"
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>Cancel</button>
          <button
            className={styles.payBtn}
            onClick={handleSubmit}
            disabled={loading || !orderNumber.trim() || !amount}
          >
            {loading ? 'Creating order…' : isRetry ? 'Retry via Razorpay' : 'Pay via Razorpay'}
          </button>
        </div>
      </div>
    </div>
  );
}