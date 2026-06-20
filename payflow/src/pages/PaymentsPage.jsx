import { useState, useEffect, useCallback } from 'react';
import { paymentApi } from '../api';
import { useRazorpay } from '../hooks/useRazorpay';
import StatusBadge from '../components/StatusBadge';
import PaymentModal from '../components/PaymentModal';
import Toast from '../components/Toast';
import styles from './PaymentsPage.module.css';
import { useAuth } from '../context/AuthContext';

const RAZORPAY_KEY = 'rzp_test_Sz8l7vAX7ZsEmX';

export default function PaymentsPage() {

  const { token } = useAuth();
  const [payments, setPayments]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal]             = useState(null); // null | { mode: 'pay'|'retry', prefill? }
  const [toast, setToast]             = useState({ message: '', type: 'success' });
  const razorpayReady                 = useRazorpay();

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const loadPayments = useCallback(async () => {
    
    setLoading(true);
    setError('');
    try {
      const data = await paymentApi.getUserPayments(token);
      console.log(data);
      setPayments(data || []);
    } catch (e) {
      setError('Failed to fetch payments. Is your backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPayments(); }, [loadPayments]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      payments.filter(p =>
        (!q || (p.paymentId || '').toLowerCase().includes(q) || String(p.orderId || '').includes(q)) &&
        (!statusFilter || p.paymentStatus === statusFilter)
      )
    );
  }, [payments, search, statusFilter]);

  function launchRazorpay(paymentDto) {
    if (!razorpayReady) { showToast('Razorpay SDK not loaded', 'error'); return; }

    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round(Number(paymentDto.amount) * 100),
      currency: 'INR',
      name: 'PayFlow',
      description: `Payment for Order #${paymentDto.orderId}`,
      order_id: paymentDto.gatewayOrderId,
      handler: async function (response) {
        try {
          await paymentApi.verifyPayment({
            paymentId:        paymentDto.paymentId,
            gatewayOrderId:   response.razorpay_order_id,
            gatewayPaymentId: response.razorpay_payment_id,
            signature:        response.razorpay_signature,
          },token);
          showToast('Payment verified successfully!');
        } catch {
          showToast('Verification failed — contact support', 'error');
        } finally {
          loadPayments();
        }
      },
      prefill: { name: '', email: '', contact: '' },
      theme: { color: '#1a5f8a' },
      modal: {
        ondismiss: () => {
          showToast('Payment was not completed', 'error');
          loadPayments();
        },
      },
    };
   
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', resp => {
      showToast(`Payment failed: ${resp.error.description}`, 'error');
      loadPayments();
    });
    rzp.open();
  }

  async function handleModalSubmit({ orderNumber, Amount }) {
    const isRetry = modal?.mode === 'retry';
    try {
      const dto = isRetry
        ? await paymentApi.retryPayment({ orderNumber, Amount }, token)
        : await paymentApi.initiatePayment({ orderNumber, Amount }, token);
      setModal(null);
      launchRazorpay(dto);
    } catch (e) {
      showToast('Failed to initiate payment — check your order details', 'error');
      throw e;
    }
  }

  async function handleRetry(payment) {
  try {
    const dto = await paymentApi.retryPayment({
      orderNumber: payment.orderNumber
    }, token);

    launchRazorpay(dto);
  } catch (e) {
    showToast("Retry failed", "error");
  }
}

  async function handleCancel(paymentId) {
    if (!window.confirm('Cancel this payment?')) return;
    try {
      await paymentApi.cancelPayment(paymentId,token);
      showToast('Payment cancelled');
      loadPayments();
    } catch {
      showToast('Failed to cancel payment', 'error');
    }
  }

  async function handleViewStatus(paymentId) {
    try {
      const status = await paymentApi.getPaymentStatus(paymentId, token);
      showToast(`Payment status: ${status}`);
    } catch {
      showToast('Failed to fetch status', 'error');
    }
  }

  const stats = {
    total:     payments.length,
    success:   payments.filter(p => p.paymentStatus === 'SUCCEED').length,
    Processing:   payments.filter(p => p.paymentStatus === 'PROCESSING').length,
    collected: payments
      .filter(p => p.paymentStatus === 'SUCCEED')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0),
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>Payments</h1>
          <p className={styles.pageSub}>Track and manage all your payments</p>
        </div>
        <div className={styles.topbarActions}>
          <div className={styles.searchWrap}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by payment Id…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}g
            className={styles.filterSelect}
          >
            <option value="">Payment Status</option>
            <option value="PROCESSING">Processing</option>
            <option value="SUCCEED">Success</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button className={styles.refreshBtn} onClick={loadPayments} title="Refresh">
            <RefreshIcon /> Refresh
          </button>
          <button className={styles.newBtn} onClick={() => setModal({ mode: 'pay' })}>
            <span>+</span> New Payment
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <StatCard label="Total payments"   value={stats.total}   sub="All time" />
          <StatCard label="Successful"        value={stats.success} sub="Completed" color="teal" />
          <StatCard label="Processing"        value={stats.Processing} sub="In progress" color="amber" />
          <StatCard
            label="Total collected"
            value={`₹${stats.collected.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            sub="From successful payments"
            color="blue"
          />
        </div>

        <div className={styles.tableCard}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={styles.stateCell}>Loading payments…</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.stateCell}>
                    <EmptyIcon />
                    <p>No payments found.</p>
                    {!search && !statusFilter && (
                      <button className={styles.createLink} onClick={() => setModal({ mode: 'pay' })}>
                        Create your first payment
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <PaymentRow
                    key={p.paymentId || p.id}
                    payment={p}
                    onPay={() => setModal({ mode: 'pay', prefill: p })}
                    onRetry={() => handleRetry(p)}
                    onCancel={() => handleCancel(p.paymentId)}
                    onViewStatus={() => handleViewStatus(p.paymentId)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <PaymentModal
          mode={modal.mode}
          prefill={modal.prefill}
          onClose={() => setModal(null)}
          onSubmit={handleModalSubmit}
        />
      )}

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, message: '' })} />
    </div>
  );
}

function PaymentRow({ payment: p, onPay, onRetry, onCancel, onViewStatus }) {
  const isPending = p.paymentStatus === 'PROCESSING' || p.paymentStatus === 'PENDING';
  const isFailed  = p.paymentStatus === 'FAILED';

  return (
    <tr className={styles.row}>
      <td className={styles.monoCell}>{p.paymentId || '—'}</td>
      <td>{p.orderId || '—'}</td>
      <td>
        {p.amount != null
          ? `₹${Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : '—'}
      </td>
      <td><StatusBadge status={p.paymentStatus} /></td>
      <td>
        <div className={styles.actions}>
          {isPending && (
            <button className={`${styles.actionBtn} ${styles.payBtn}`} onClick={onPay}>Pay</button>
          )}
          {isFailed && (
            <button className={`${styles.actionBtn} ${styles.retryBtn}`} onClick={onRetry}>Retry</button>
          )}
          {isPending && (
            <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={onCancel}>Cancel</button>
          )}
          <button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={onViewStatus} title="Check status">
            <EyeIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatCard({ label, value, sub, color }) {
  const colorMap = { teal: '#0F6E56', amber: '#854F0B', blue: '#185FA5' };
  return (
    <div className={styles.statCard}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue} style={{ color: color ? colorMap[color] : undefined }}>{value}</p>
      <p className={styles.statSub}>{sub}</p>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)', margin: '0 auto 10px', display: 'block' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" />
    </svg>
  );
}