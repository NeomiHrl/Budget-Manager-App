import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '../Contexts/UserContext';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/overview');
    }
  }, [isAuthenticated, navigate]);
  return (
    <div style={{maxWidth: 540, margin: '48px auto', padding: '32px', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #e9e3f7', textAlign: 'center'}}>
      <h1 style={{fontSize: '2.7em', color: '#7b2ff7', marginBottom: 18, fontWeight: 700}}>ברוכים הבאים למערכת לניהול הפיננסי האישי שלכם</h1>
      <h2 style={{fontWeight: 700, fontSize: '1.6em', color: '#32243d', marginBottom: 28}}>
        שליטה בהוצאות, מעקב אחר הכנסות, וקבלת תמונה מלאה – במקום אחד פשוט ונוח.
      </h2>
      <p style={{fontSize: '1.25em', color: '#4d3a5a', marginBottom: 36, lineHeight: 1.7, fontWeight: 700}}>
        כאן תוכלו לעקוב אחר ההכנסות וההוצאות שלכם, לזהות דפוסי התנהלות כספית, ולתכנן את העתיד הכלכלי שלכם בצורה חכמה.<br/>
        התחברו למערכת או הירשמו כדי להתחיל בניהול כלכלי מדויק ואפקטיבי.
      </p>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center'}}>
        <button onClick={() => navigate('/login')} style={{fontSize: '1.1em', padding: '12px 32px', borderRadius: 8, background: 'linear-gradient(90deg,#7b2ff7 0%,#f357a8 100%)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', marginBottom: 4}}>
          🔐 התחברות לחשבון
        </button>
        <button onClick={() => navigate('/register')} style={{fontSize: '1.1em', padding: '12px 32px', borderRadius: 8, background: '#fff', color: '#7b2ff7', border: '2px solid #7b2ff7', fontWeight: 700, cursor: 'pointer', marginBottom: 4}}>
          ✍️ הרשמה למשתמש חדש
        </button>
        
      </div>
    </div>
  );
}