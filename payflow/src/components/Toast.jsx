import { useEffect } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.icon}>{type === 'error' ? '✕' : '✓'}</span>
      {message}
    </div>
  );
}