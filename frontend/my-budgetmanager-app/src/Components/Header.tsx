import { useUser } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import styles from './Header.module.css';
import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";

function LogoutModal({ open, onApprove, onCancel }: { open: boolean, onApprove: () => void, onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className={styles['modal-backdrop']}>
      <div className={styles['modal']}> 
        <div className={styles['modal-title']}>בחרת להתנתק מהמערכת</div>
        <div className={styles['modal-actions']}>
          <button className={styles['modal-approve']} onClick={onApprove}>אישור</button>
          <button className={styles['modal-cancel']} onClick={onCancel}>ביטול</button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { user, isAuthenticated, userFullName, logout } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <Sidebar />
        <button
          onClick={() => isAuthenticated ? navigate('/overview') : navigate('/')}
          className={styles.logoBtn}
          aria-label="מעבר לדף הבית"
        >
          <div className={styles.logoMain} style={{display:'flex',alignItems:'center'}}>
            <span className={styles.logoIcon} style={{
              display:'inline-block',
              transform:'rotate(-25deg)',
              marginRight:'-8px',
              marginLeft:'2px',
            }}>
              <span style={{fontSize:'1.5em'}}>💵</span>
            </span>
            <span className={styles.logoMy} style={{
              fontWeight: 900,
              fontSize: '2em',
              background: 'linear-gradient(90deg,#7b2ff7 0%,#f357a8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '2px',
              fontFamily: 'cursive',
              marginBottom: '-8px',
            }}>MY</span>
          </div>
          <span style={{
            fontWeight: 700,
            fontSize: '1.15em',
            background: 'linear-gradient(90deg,#f357a8 0%,#7b2ff7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
            fontFamily: 'cursive',
            marginLeft: '8px',
          }}>budgety</span>
        </button>
    
    
      <div className={styles['header-left']}>
        {isAuthenticated && user ? (
          <div className={styles['user-menu']} ref={menuRef}>
            <button className={styles['user-menu-btn']} onClick={() => setMenuOpen((v) => !v)}>
              <div className={styles['user-info']}>
                <span className={styles['user-name-tooltip']}>
                  <span className={styles['user-icon']}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                      <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </span>
                  <span className={styles['user-name']}>{userFullName}</span>
                </span>
              </div>
              <span className={styles['user-menu-caret']}>▼</span>
            </button>
            {menuOpen && (
              <div className={styles['user-dropdown']}>
                <div className={styles['user-email-title']}>{user.email}</div>
                <button className={styles['dropdown-item']} onClick={() => { setMenuOpen(false); navigate('/profile'); }}>פרופיל</button>
                <button className={styles['dropdown-item']} onClick={() => { setMenuOpen(false); setShowLogoutModal(true); }}>התנתק</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className={styles['nav-btn']} onClick={() => navigate('/login')}>
              התחבר
            </button>
            <button className={styles['nav-btn']} onClick={() => navigate('/register')}>
              הרשם
            </button>
          </>
        )}
      </div>
      <LogoutModal
        open={showLogoutModal}
        onApprove={() => { setShowLogoutModal(false); logout(); window.location.href = '/'; }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </header>
  );
}

