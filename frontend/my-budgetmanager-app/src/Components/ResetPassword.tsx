
import React, { useState, useEffect } from 'react';
import { forgotPassword, resetPassword } from '../Api/ApiUser';
import styles from './Register.module.css';

// פונקציה לשליפת פרמטר מה-URL
function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token') || '';
}

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(getTokenFromUrl());
  }, []);

  // שליחת בקשת איפוס למייל
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) {
      setError('נא להכניס אימייל');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess('קישור איפוס נשלח לאימייל שלך');
    } catch (err: any) {
      setError(err.message || 'שגיאה בשליחת קישור');
    }
    setLoading(false);
  };

  // איפוס סיסמה בפועל
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!newPassword) {
      setError('נא להכניס סיסמה חדשה');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, new_password: newPassword });
      setSuccess('הסיסמה אופסה בהצלחה!');
    } catch (err: any) {
      setError(err.message || 'שגיאה באיפוס הסיסמה');
    }
    setLoading(false);
  };

  return (
    <div className={styles['register-page']}>
      <div className={styles['register-card']}>
        <div className={styles['register-title']}>איפוס סיסמה</div>
        {token ? (
          <form onSubmit={handleResetPassword} dir="rtl" noValidate>
            <div className={styles['form-group']}>
              <label className={styles.label} htmlFor="newPassword">
                <span className={styles.required}>*</span>סיסמה חדשה
              </label>
              <input
                className={styles.input}
                dir="rtl"
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="הכנס סיסמה חדשה"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles['submit-btn']} disabled={loading}>
              {loading ? "מאפס..." : "אפס סיסמה"}
            </button>
            {error && <div className={styles['error-message']} style={{ textAlign: 'center', marginTop: 10 }}>{error}</div>}
            {success && <div style={{ color: '#7b2ff7', textAlign: 'center', marginTop: 10, fontWeight: 700 }}>{success}</div>}
          </form>
        ) : (
          <form onSubmit={handleSendEmail} dir="rtl" noValidate>
            <div className={styles['form-group']}>
              <label className={styles.label} htmlFor="email">
                <span className={styles.required}>*</span>אימייל
              </label>
              <input
                className={styles.input}
                dir="rtl"
                type="email"
                name="email"
                id="email"
                placeholder="הכנס אימייל"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <button type="submit" className={styles['submit-btn']} disabled={loading}>
              {loading ? "שולח..." : "שלח קישור לאיפוס"}
            </button>
            {error && <div className={styles['error-message']} style={{ textAlign: 'center', marginTop: 10 }}>{error}</div>}
            {success && <div style={{ color: '#7b2ff7', textAlign: 'center', marginTop: 10, fontWeight: 700 }}>{success}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
