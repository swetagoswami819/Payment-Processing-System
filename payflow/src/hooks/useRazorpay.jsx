import { useEffect, useState } from 'react';

export function useRazorpay() {
  const [loaded, setLoaded] = useState(!!window.Razorpay);

  useEffect(() => {
    if (window.Razorpay) { setLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => setLoaded(true);
    script.onerror = () => console.error('Failed to load Razorpay SDK');
    document.head.appendChild(script);
  }, []);

  return loaded;
}