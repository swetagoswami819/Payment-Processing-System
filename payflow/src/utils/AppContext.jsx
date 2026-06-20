import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

const PAD = (n, l = 3) => String(n).padStart(l, '0');

const DEMO_ORDERS = [
  { id: 'ORD-001', amount: 500,  desc: 'Website Design',   status: 'CREATED' },
  { id: 'ORD-002', amount: 1000, desc: 'API Integration',  status: 'PAID'    },
];

const DEMO_PAYMENTS = [
  { id: 'PAY-001', orderId: 'ORD-002', amount: 1000, status: 'SUCCEED', gatewayPaymentId: 'pay_demo9x2k1', gatewayOrderId: 'order_demo01' },
  { id: 'PAY-002', orderId: 'ORD-001', amount: 500,  status: 'FAILED',  gatewayPaymentId: null,           gatewayOrderId: 'order_demo02' },
];

export function AppProvider({ children }) {
  const [user,            setUser]           = useState(null);
  const [page,            setPage]           = useState('login');
  const [orders,          setOrders]         = useState(DEMO_ORDERS);
  const [payments,        setPayments]       = useState(DEMO_PAYMENTS);
  const [selectedOrder,   setSelectedOrder]  = useState(null);
  const [selectedPayment, setSelectedPayment]= useState(null);
  const [orderCounter,    setOrderCounter]   = useState(3);
  const [payCounter,      setPayCounter]     = useState(3);
  const [showRazorpay,    setShowRazorpay]   = useState(false);

  const navigate = (p, extra = {}) => {
    if (extra.order)   setSelectedOrder(extra.order);
    if (extra.payment) setSelectedPayment(extra.payment);
    setPage(p);
  };

  const login = (email, name = 'Sweta Sharma') => {
    setUser({ name, email });
    setPage('dashboard');
  };

  const logout = () => { setUser(null); setPage('login'); };

  const createOrder = (amount, desc) => {
    const id = `ORD-${PAD(orderCounter)}`;
    setOrderCounter(c => c + 1);
    const order = { id, amount: Number(amount), desc, status: 'CREATED' };
    setOrders(prev => [...prev, order]);
    return order;
  };

  const initiatePayment = (order) => {
    const id = `PAY-${PAD(payCounter)}`;
    setPayCounter(c => c + 1);
    const payment = {
      id,
      orderId: order.id,
      amount: order.amount,
      status: 'PROCESSING',
      gatewayOrderId: `order_${Math.random().toString(36).substr(2, 9)}`,
      gatewayPaymentId: null,
    };
    setPayments(prev => [...prev, payment]);
    return payment;
  };

  const confirmPayment = (paymentId) => {
    const gwId = `pay_${Math.random().toString(36).substr(2, 9)}`;
    setPayments(prev => prev.map(p =>
      p.id === paymentId ? { ...p, status: 'SUCCEED', gatewayPaymentId: gwId } : p
    ));
    const pmt = payments.find(p => p.id === paymentId);
    if (pmt) {
      setOrders(prev => prev.map(o =>
        o.id === pmt.orderId ? { ...o, status: 'PAID' } : o
      ));
    }
    return gwId;
  };

  const cancelPayment = (paymentId) => {
    setPayments(prev => prev.map(p =>
      p.id === paymentId ? { ...p, status: 'FAILED' } : p
    ));
  };

  return (
    <AppContext.Provider value={{
      user, page, orders, payments,
      selectedOrder, selectedPayment,
      showRazorpay, setShowRazorpay,
      navigate, login, logout,
      createOrder, initiatePayment,
      confirmPayment, cancelPayment,
      setSelectedPayment,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
