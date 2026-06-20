import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:8080/payment/users";

export default function ProfilePage({ onBack }) {
  const { token, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  //FETCH LOGGED-IN USER
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch profile (${res.status})`);

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  //DELETE LOGGED-IN USER
  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`${BASE_URL}/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Delete failed (${res.status})`);

      logout();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          ← Dashboard
        </button>
        <h1 style={styles.title}>My Profile</h1>
      </div>

      {/* Loading */}
      {loading && (
        <div style={styles.centerBox}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading profile…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.retryBtn} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {/* PROFILE */}
      {profile && !loading && !error && (
        <div style={styles.card}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>{getInitials(profile.username || profile.name)}</div>
            <div>
              <p style={styles.profileName}>{profile.username || profile.name}</p>
              <span style={styles.roleBadge}>{profile.role || "User"}</span>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.detailsGrid}>
            <ProfileRow icon="✉" label="Email" value={profile.email} />
            <ProfileRow icon="🆔" label="User ID" value={profile.id} />
          </div>

          <div style={styles.divider} />

          {/* DELETE */}
          <div style={styles.dangerZone}>
            <p style={styles.dangerTitle}>Delete Account</p>
            <p style={styles.dangerDesc}>
              This action is permanent and cannot be undone.
            </p>

            {confirmDelete ? (
              <div style={styles.confirmRow}>
                <button
                  style={styles.deleteBtn}
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? "Deleting…" : "Yes, delete my account"}
                </button>

                <button
                  style={styles.cancelBtn}
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button style={styles.deleteBtn} onClick={handleDeleteAccount}>
                Delete Account
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function ProfileRow({ icon, label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.rowIcon}>{icon}</span>
      <span style={styles.rowLabel}>{label}</span>
      <span style={styles.rowValue}>{value || "—"}</span>
    </div>
  );
}


const styles = {
  page: {
    padding: "40px",
    maxWidth: 720,
    margin: "0 auto",
    fontFamily: "inherit",
    background: "#f6f7fb",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 26,
  },

  backBtn: {
    background: "rgba(255,255,255,0.8)",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 13,
    cursor: "pointer",
    color: "#374151",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "all 0.2s ease",
  },

  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.5px",
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "26px 28px",
    background: "linear-gradient(135deg, #f5f3ff, #eef2ff)",
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
    boxShadow: "0 10px 20px rgba(124,58,237,0.25)",
  },

  profileName: {
    margin: "0 0 4px",
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
  },

  roleBadge: {
    display: "inline-block",
    background: "rgba(99,102,241,0.1)",
    color: "#4f46e5",
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 999,
    textTransform: "capitalize",
  },

  divider: {
    borderTop: "1px solid #f1f5f9",
  },

  detailsGrid: {
    padding: "10px 28px",
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid #f8fafc",
    fontSize: 14,
  },

  rowIcon: {
    fontSize: 16,
    width: 22,
    textAlign: "center",
    color: "#6366f1",
  },

  rowLabel: {
    color: "#6b7280",
    minWidth: 120,
    fontWeight: 500,
  },

  rowValue: {
    color: "#111827",
    fontWeight: 600,
    wordBreak: "break-word",
  },

  dangerZone: {
    padding: "22px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
    background: "#fff5f5",
  },

  dangerTitle: {
    margin: "0 0 4px",
    fontSize: 14,
    fontWeight: 700,
    color: "#b91c1c",
  },

  dangerDesc: {
    margin: 0,
    fontSize: 13,
    color: "#6b7280",
  },

  deleteBtn: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(239,68,68,0.25)",
  },

  cancelBtn: {
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 16px",
    fontSize: 13,
    cursor: "pointer",
  },

  confirmRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },

  confirmText: {
    margin: 0,
    fontSize: 13,
    color: "#374151",
    fontWeight: 600,
  },

  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 60,
    gap: 12,
  },

  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #e5e7eb",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    margin: 0,
    fontSize: 14,
    color: "#6b7280",
  },

  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 12,
    padding: "18px 22px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  errorText: {
    margin: 0,
    flex: 1,
    fontSize: 14,
    color: "#991b1b",
    fontWeight: 500,
  },

  retryBtn: {
    background: "white",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 13,
    cursor: "pointer",
  },
};