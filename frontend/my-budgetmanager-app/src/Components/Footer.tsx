import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{
      width: '100%',
      background: '#f7f5fb',
      borderTop: '1.5px solid #e9e3f7',
      padding: '32px 0 18px 0',
      textAlign: 'center',
      fontSize: '1.08em',
      color: '#4d3a5a',
      marginTop: 64
    }}>
      <div style={{marginBottom: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <span style={{
            display:'inline-block',
            transform:'rotate(-25deg)',
            marginRight:'-8px',
            marginLeft:'2px',
          }}>
            <span style={{fontSize:'2.2em'}}>💵</span>
          </span>
          <span style={{
            fontWeight: 900,
            fontSize: '2.7em',
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
          fontSize: '1.35em',
          background: 'linear-gradient(90deg,#f357a8 0%,#7b2ff7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '2px',
          fontFamily: 'cursive',
          marginLeft: '8px',
        }}>budgety</span>
      </div>
      <nav style={{marginBottom: 16, fontWeight: 700, fontSize: '1.13em'}}>
        <span style={{cursor: 'pointer', color: '#7b2ff7'}} onClick={() => navigate('/')}>דף הבית</span>
        {' | '}
        <span style={{cursor: 'pointer', color: '#7b2ff7'}} onClick={() => navigate('/about')}>אודות</span>
        {' | '}
        <span style={{cursor: 'pointer', color: '#7b2ff7'}} onClick={() => navigate('/contact')}>צור קשר</span>
        {' | '}
        <span style={{cursor: 'pointer', color: '#7b2ff7'}} onClick={() => navigate('/terms')}>תנאי שימוש</span>
        {' | '}
        <span style={{color: '#bdbdbd', cursor: 'not-allowed'}}>מדיניות פרטיות</span>
      </nav>
      <div style={{fontSize: '1.08em', color: '#bdbdbd', fontWeight: 600}}>
        © 2025 כל הזכויות שמורות
      </div>
    </footer>
  );
}
