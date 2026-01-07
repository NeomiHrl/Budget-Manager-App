import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useUser } from '../Contexts/UserContext';

const Sidebar: React.FC = () => {
  const { user } = useUser();        
  const [open, setOpen] = useState(false);
  if (!user) return null;

  // Close sidebar on navigation
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        className={styles.toggleBtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "סגור תפריט צד" : "פתח תפריט צד"}
      >
        {open ? (
          <span style={{fontSize: 28, color: '#7b2ff7', fontWeight: 900}}>&times;</span>
        ) : (
          <span className={styles.burger}>
            <span className={open ? styles.burgerLineOpen : styles.burgerLine}></span>
            <span className={open ? styles.burgerLineOpen : styles.burgerLine}></span>
            <span className={open ? styles.burgerLineOpen : styles.burgerLine}></span>
          </span>
        )}
      </button>
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <nav className={styles.sidebarNavBottom}>
          <ul>
            <li><Link to="/overview" className={styles.link} onClick={handleClose}>מבט כללי</Link></li>
            <li><Link to="/incomes" className={styles.link} onClick={handleClose}>ההכנסות שלי</Link></li>
            <li><Link to="/expenses" className={styles.link} onClick={handleClose}>ההוצאות שלי</Link></li>
            <li><Link to="/about" className={styles.link} onClick={handleClose}>אודות</Link></li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
