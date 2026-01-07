import  { useState } from 'react';
import { useUser } from '../Contexts/UserContext';
import { FaUserCircle, FaEnvelope, FaEdit, FaSave } from 'react-icons/fa';

export default function Profile() {
  const { user } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');

  // TODO: הוספת שמירה לשרת
  const handleSave = () => {
    setEditMode(false);
    // כאן תבוא קריאה ל-API לעדכון פרטי משתמש
  };

  return (
    <div style={{maxWidth: 520, margin: '40px auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #e9e3f7', padding: 32, textAlign: 'center'}}>
      {/* תמונת פרופיל */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18}}>
        <FaUserCircle size={84} color="#7b2ff7" style={{marginBottom: 8}} />
        <div style={{fontSize: 26, fontWeight: 800, color: '#7b2ff7'}}>
          {editMode ? (
            <input value={firstName} onChange={e => setFirstName(e.target.value)} style={{fontWeight: 700, fontSize: 22, margin: 2, borderRadius: 6, border: '1px solid #d3cbe9', padding: '2px 8px'}} />
          ) : firstName}
          {' '}
          {editMode ? (
            <input value={lastName} onChange={e => setLastName(e.target.value)} style={{fontWeight: 700, fontSize: 22, margin: 2, borderRadius: 6, border: '1px solid #d3cbe9', padding: '2px 8px'}} />
          ) : lastName}
        </div>
        <div style={{color: '#32243d', fontWeight: 700, fontSize: 18, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center'}}>
          <FaEnvelope color="#f357a8" />
          {editMode ? (
            <input value={email} onChange={e => setEmail(e.target.value)} style={{fontWeight: 700, fontSize: 16, margin: 2, borderRadius: 6, border: '1px solid #d3cbe9', padding: '2px 8px'}} />
          ) : email}
        </div>
        <button
          onClick={() => editMode ? handleSave() : setEditMode(true)}
          style={{marginTop: 10, fontSize: 16, background: editMode ? '#7b2ff7' : '#fff', color: editMode ? '#fff' : '#7b2ff7', border: '2px solid #7b2ff7', borderRadius: 8, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}
        >
          {editMode ? <FaSave /> : <FaEdit />} {editMode ? 'שמור' : 'ערוך פרטים'}
        </button>
      </div>


      {/* הודעות מערכת */}
      <div style={{background: '#e9e3f7', borderRadius: 12, padding: 14, color: '#7b2ff7', fontWeight: 700, fontSize: 16, marginBottom: 8}}>
        <span>הודעות מערכת יופיעו כאן בקרוב...</span>
      </div>
    </div>
  );
}