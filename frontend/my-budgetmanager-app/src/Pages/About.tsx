import { useNavigate } from 'react-router-dom';
export default function About() {
  const navigate = useNavigate();
  return (
    <div style={{maxWidth: 600, margin: '48px auto', padding: '32px', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #e9e3f7', textAlign: 'center'}}>
      <h1 style={{fontSize: '3em', color: '#7b2ff7', fontWeight: 800, marginBottom: 18}}>קצת עלינו</h1>
      <div style={{fontSize: '1.13em', color: '#32243d', fontWeight: 600, lineHeight: 1.7, marginBottom: 24}}>
        המערכת נבנתה מתוך צורך אמיתי – לעזור לכל אדם לקבל שליטה מלאה על הניהול הכלכלי שלו, בקלות.<br/>
        הממשק פשוט, ברור ומותאם לכל משתמש – גם בלי רקע פיננסי.<br/>
        המטרה שלנו היא להנגיש כלים מתקדמים של ניהול תקציב, חישוב הוצאות, ותכנון חכם – לכל אחד ואחת.
      </div>
      <div style={{fontSize: '1.16em', color: '#7b2ff7', fontWeight: 700, marginBottom: 24}}>
        ✨ בלי פרסומות, בלי הסחות דעת – רק אתם והכסף שלכם.
      </div>
      <br></br>
      <div style={{fontSize: '1.11em', color: '#4d3a5a', fontWeight: 600}}>
        נשמח לשמוע מכם – הצעות, שאלות או רעיונות תמיד מתקבלים בברכה
      </div>
      <br></br>
      <br></br>
      <button
        onClick={() => navigate('/contact')}
        style={{fontSize: '1.11em', color: '#7b2ff7', fontWeight: 700, padding: '10px 24px', borderRadius: 12, border: '2px solid #7b2ff7', background: 'none', cursor: 'pointer'}}
      >
        שלחו לנו מייל
      </button>
    </div>
  );
}