import styles from './StatusBadge.module.css';

const config = {
  SUCCESS:   { cls: 'success',   label: 'Success'   },
  PENDING:   { cls: 'pending',   label: 'Pending'   },
  FAILED:    { cls: 'failed',    label: 'Failed'    },
  CANCELLED: { cls: 'cancelled', label: 'Cancelled' },
};

export default function StatusBadge({ status }) {
  const cfg = config[status] || { cls: 'default', label: status || '—' };
  return <span className={`${styles.badge} ${styles[cfg.cls]}`}>{cfg.label}</span>;
}