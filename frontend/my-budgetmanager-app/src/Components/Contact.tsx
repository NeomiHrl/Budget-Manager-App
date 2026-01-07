import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';
import emailjs from 'emailjs-com';
function Contact() {
// יש להכניס את המזהים שלך מ-MailJS
  const SERVICE_ID = 'service_a9nsdel';
  const TEMPLATE_ID = 'template_2aa6hyh';
  const USER_ID = 'W-SxHWDDnTJfIFqJi';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          message,
        },
        USER_ID
      );
      setShowSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('אירעה שגיאה בשליחת ההודעה.');
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth: 480, margin: '48px auto', padding: '32px', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #e9e3f7', textAlign: 'center'}}>
      <h2 style={{color: '#7b2ff7', fontWeight: 800, marginBottom: 18}}>צור קשר</h2>
      {showSuccess ? (
        <div style={{padding: '32px 0'}}>
          <div style={{
            background: '#f7f5fb',
            border: '1.5px solid #e9e3f7',
            borderRadius: 14,
            maxWidth: 340,
            margin: '0 auto',
            padding: '32px 18px',
            color: '#7b2ff7',
            fontWeight: 700,
            fontSize: '1.18em',
            boxShadow: '0 2px 12px #e9e3f7',
            marginBottom: 24,
          }}>
            ההודעה נשלחה בהצלחה!<br/>
            תודה על המשוב :)
          </div>
          <button
            style={{
              fontSize: '1.1em',
              padding: '12px 32px',
              borderRadius: 8,
              background: 'linear-gradient(90deg,#7b2ff7 0%,#f357a8 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => isAuthenticated ? navigate('/overview') : navigate('/')}
          >
            {isAuthenticated ? 'מעבר ללוח הבקרה' : 'חזרה לדף הבית'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          <input
            type="text"
            placeholder="שם מלא"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{padding: '12px', borderRadius: 8, border: '1.5px solid #e9e3f7', fontSize: '1em'}}
          />
          <input
            type="email"
            placeholder="אימייל ליצירת קשר"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{padding: '12px', borderRadius: 8, border: '1.5px solid #e9e3f7', fontSize: '1em'}}
          />
          <textarea
            placeholder="ההודעה שלך..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            rows={5}
            style={{padding: '12px', borderRadius: 8, border: '1.5px solid #e9e3f7', fontSize: '1em', resize: 'vertical'}}
          />
          <button type="submit" disabled={loading} style={{fontSize: '1.1em', padding: '12px 32px', borderRadius: 8, background: 'linear-gradient(90deg,#7b2ff7 0%,#f357a8 100%)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer'}}>
            {loading ? 'שולח...' : 'שלח הודעה'}
          </button>
        </form>
      )}
      {status && <div style={{marginTop: 18, color: status.includes('שגיאה') ? '#f357a8' : '#7b2ff7', fontWeight: 700}}>{status}</div>}
    </div>
  );
};

export default Contact;
