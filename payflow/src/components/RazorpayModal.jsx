import { useState } from 'react';
import { useApp } from '../utils/AppContext.jsx';

export default function RazorpayModal() {
  const { selectedPayment, confirmPayment, cancelPayment,
          setShowRazorpay, navigate, setSelectedPayment } = useApp();

  const [card,   setCard]   = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv,    setCvv]    = useState('');
  const [name,   setName]   = useState('');

  const pmt = selectedPayment;

  const handlePay = () => {
    confirmPayment(pmt.id);
    // Update the local ref for success page
    setSelectedPayment({ ...pmt, status: 'SUCCEED', gatewayPaymentId: `pay_${Math.random().toString(36).substr(2,9)}` });
    setShowRazorpay(false);
    navigate('paymentSuccess');
  };

  const handleCancel = () => {
    cancelPayment(pmt.id);
    setShowRazorpay(false);
  };

  const fmtCard = (v) => v.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);
  const fmtExp  = (v) => v.replace(/\D/g,'').replace(/^(\d{2})(\d)/,'$1/$2').slice(0,5);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && handleCancel()}>
      <div className="modal-box">
        <div className="rp-header">
          <span className="rp-badge">razorpay</span>
          <span className="rp-merchant">PayFlow Merchant</span>
        </div>

        <div className="rp-amount-box">
          <div className="rp-amount-label">Amount to Pay</div>
          <div className="rp-amount-value">₹{pmt?.amount?.toLocaleString()}</div>
        </div>

        <div className="rp-input-group">
          <label>Card Number</label>
          <input
            type="text"
            placeholder="4111 1111 1111 1111"
            value={card}
            onChange={e => setCard(fmtCard(e.target.value))}
          />
        </div>

        <div className="rp-input-row">
          <div className="rp-input-group">
            <label>Expiry</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={e => setExpiry(fmtExp(e.target.value))}
            />
          </div>
          <div className="rp-input-group">
            <label>CVV</label>
            <input
              type="password"
              placeholder="•••"
              value={cvv}
              onChange={e => setCvv(e.target.value.slice(0,3))}
            />
          </div>
        </div>

        <div className="rp-input-group">
          <label>Name on Card</label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <button className="btn-rp-pay" onClick={handlePay}>
          Pay ₹{pmt?.amount?.toLocaleString()}
        </button>
        <button className="btn-rp-cancel" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}
