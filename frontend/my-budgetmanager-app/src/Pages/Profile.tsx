import React, { useState, useEffect } from 'react';
import { changePassword, updateUser, uploadProfileImage, getUserById,getProfileImageUrl } from '../Api/ApiUser';
import { useUser } from '../Contexts/UserContext';
import { FaUserCircle, FaEnvelope, FaEdit, FaSave, FaBell } from 'react-icons/fa';
import { useRef } from 'react';

export default function Profile() {
  const { user, setUser } = useUser();
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileImage, setProfileImage] = useState(user?.profile_image_url || '');
    const [imageVersion, setImageVersion] = useState(Date.now());

    // טען נתוני משתמש עדכניים מהשרת בכל כניסה לדף
    useEffect(() => {
      const fetchUser = async () => {
        if (user && user.user_id) {
          try {
            const freshUser = await getUserById(user.user_id);
            setUser && setUser(freshUser);
            setFirstName(freshUser.first_name || '');
            setLastName(freshUser.last_name || '');
            setEmail(freshUser.email || '');
            setProfileImage(freshUser.profile_image_url || '');
          } catch (err) {
            // אפשר להוסיף טיפול בשגיאה כאן
          }
        }
      };
      fetchUser();
      // eslint-disable-next-line
    }, []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelMsg, setCancelMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);


  // העלאת תמונה (תמיד משתמשים ב-uploadProfileImage)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      const res = await uploadProfileImage(user.user_id, fileInputRef.current!.files![0]);
      setMessage(user.profile_image_url ? 'תמונת הפרופיל עודכנה בהצלחה!' : 'תמונת הפרופיל הועלתה בהצלחה!');
      setProfileImage(res.profile_image_url);
      setImageVersion(Date.now());
      setUser && setUser({ ...user, profile_image_url: res.profile_image_url });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setUploadError(err.message || 'שגיאה בהעלאת תמונה');
      setTimeout(() => setUploadError(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  // שמירה מתוך המודאל
  const handleSave = async () => {
    setMessage(null);
    setError(null);
    if (!firstName || !lastName || !email) {
      setError('יש למלא את כל השדות');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      // עדכון פרטי משתמש בשרת
      const updated = await updateUser(user.user_id, {
        first_name: firstName,
        last_name: lastName,
        email: email
      });
      setUser && setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      // שינוי סיסמה אם נבחר
      if (showPasswordFields && oldPassword && newPassword) {
        await changePassword(user.user_id, oldPassword, newPassword);
        setMessage('הפרטים והסיסמה נשמרו בהצלחה!');
      } else {
        setMessage('הפרטים נשמרו בהצלחה!');
      }
      setShowEditModal(false);
      setShowPasswordFields(false);
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'שגיאה בעדכון הפרטים');
      setTimeout(() => setError(null), 3000);
    }
  };

  // פתיחת מודאל עריכה
  const handleEditClick = () => {
    setShowEditModal(true);
    setShowPasswordFields(false);
    setCancelMsg(null);
  };

  // ביטול עריכה
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setError(null);
    setMessage(null);
    setOldPassword('');
    setNewPassword('');
    setShowPasswordFields(false);
    setCancelMsg('השינויים בוטלו ולא נשמרו');
    setTimeout(() => setCancelMsg(null), 3000);
  };

  return (
    <div style={{maxWidth: 520, margin: '40px auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #e9e3f7', padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      {/* תמונת פרופיל */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18, width: '100%'}}>
        <div
          style={{position: 'relative', width: 84, height: 84, marginBottom: 8}}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {profileImage ? (
            <img
              src={getProfileImageUrl(profileImage) + `?v=${imageVersion}`}
              alt="profile"
              style={{width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '2px solid #7b2ff7', cursor: 'pointer'}}
              onClick={() => setShowImageModal(true)}
            />
          ) : (
            <FaUserCircle size={84} color="#7b2ff7" style={{cursor: 'pointer'}} onClick={() => setShowImageModal(true)} />
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              background: isHovering ? '#f357a8' : '#fff',
              color: isHovering ? '#fff' : '#7b2ff7',
              border: '2px solid #7b2ff7',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #e9e3f7',
              transition: 'background 0.2s, color 0.2s',
            }}
            title={user.profile_image_url ? 'החלף תמונה' : 'העלה תמונה'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 21V19C19 17.8954 18.1046 17 17 17H7C5.89543 17 5 17.8954 5 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            style={{display: 'none'}}
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={uploading}
          />
              {/* מודאל תמונה מוגדלת */}
              {showImageModal && (
                <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => setShowImageModal(false)}>
                  <div style={{position: 'relative', background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 2px 16px #e9e3f7', display: 'flex', flexDirection: 'column', alignItems: 'center'}} onClick={e => e.stopPropagation()}>
                    <img
                      src={getProfileImageUrl(profileImage) + `?v=${imageVersion}`}
                      alt="profile-large"
                      style={{width: 260, height: 260, borderRadius: '50%', objectFit: 'cover', border: '3px solid #7b2ff7', marginBottom: 18}}
                    />
                    <FaEdit
                      onClick={() => { setShowImageModal(false); fileInputRef.current && fileInputRef.current.click(); }}
                      style={{
                        position: 'absolute',
                        bottom: 36,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#fff',
                        color: '#7b2ff7',
                        border: '2px solid #7b2ff7',
                        borderRadius: '50%',
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px #e9e3f7',
                        fontSize: 28,
                        padding: 10
                      }}
                      title="החלף תמונה"
                    />
                  
                  </div>
                </div>
              )}
        </div>
        {isHovering && (
          <div style={{color: '#7b2ff7', fontWeight: 700, fontSize: 14, marginBottom: 4}}>
            {user.profile_image_url ? 'החלף תמונת פרופיל' : 'העלה תמונת פרופיל'}
          </div>
        )}
        {uploading && <div style={{color: '#7b2ff7', fontWeight: 700, fontSize: 15, marginBottom: 8}}>מעלה תמונה...</div>}
        {uploadError && <div style={{color: '#c00', fontWeight: 700, fontSize: 15, marginBottom: 8}}>{uploadError}</div>}
        <div style={{fontSize: 26, fontWeight: 800, color: '#7b2ff7'}}>
          {firstName} {lastName}
        </div>
        <div style={{color: '#32243d', fontWeight: 700, fontSize: 18, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center'}}>
          <FaEnvelope color="#f357a8" />
          {email}
        </div>
        <button
          onClick={handleEditClick}
          style={{marginTop: 10, fontSize: 16, background: '#fff', color: '#7b2ff7', border: '2px solid #7b2ff7', borderRadius: 8, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}
        >
          <FaEdit /> ערוך פרטים
        </button>
      </div>

      {/* מודאל עריכת פרטים אישיים + שינוי סיסמה */}
      {showEditModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #e9e3f7', padding: 32, maxWidth: 340, textAlign: 'center', width: '100%'}}>
            <div style={{fontWeight: 700, fontSize: 18, color: '#7b2ff7', marginBottom: 12}}>עריכת פרטים אישיים</div>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="שם פרטי" required style={{fontWeight: 700, fontSize: 16, margin: 4, borderRadius: 6, border: '1px solid #d3cbe9', padding: '6px 8px', width: '90%'}} />
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="שם משפחה" required style={{fontWeight: 700, fontSize: 16, margin: 4, borderRadius: 6, border: '1px solid #d3cbe9', padding: '6px 8px', width: '90%'}} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="אימייל" required style={{fontWeight: 700, fontSize: 16, margin: 4, borderRadius: 6, border: '1px solid #d3cbe9', padding: '6px 8px', width: '90%'}} />
            <div style={{marginTop: 12}}>
              <button
                onClick={() => setShowPasswordFields(v => !v)}
                style={{fontSize: 15, background: '#fff', color: '#f357a8', border: '2px solid #f357a8', borderRadius: 8, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', marginBottom: 8}}
              >
                שנה סיסמה
              </button>
            </div>
            {showPasswordFields && (
              <div style={{margin: '10px 0'}}>
                <input
                  type="password"
                  placeholder="סיסמה נוכחית"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  required
                  style={{marginBottom: 8, width: '90%', padding: 8, borderRadius: 6, border: '1px solid #d3cbe9'}}
                />
                <input
                  type="password"
                  placeholder="סיסמה חדשה"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  style={{marginBottom: 8, width: '90%', padding: 8, borderRadius: 6, border: '1px solid #d3cbe9'}}
                />
              </div>
            )}
            <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16}}>
              <button
                onClick={handleSave}
                disabled={!firstName || !lastName || !email || (showPasswordFields && (!oldPassword || !newPassword))}
                style={{fontSize: 16, background: '#7b2ff7', color: '#fff', border: '2px solid #7b2ff7', borderRadius: 8, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}
              >
                <FaSave /> שמור שינויים
              </button>
              <button
                onClick={handleCancelEdit}
                style={{fontSize: 16, background: '#fff', color: '#7b2ff7', border: '2px solid #7b2ff7', borderRadius: 8, padding: '6px 18px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8}}
              >
                בטל
              </button>
            </div>
            {/* הודעות בתוך המודאל */}
            {message && (
              <div style={{background: '#d4f7e3', borderRadius: 12, padding: 10, color: '#1a7f4d', fontWeight: 700, fontSize: 15, marginBottom: 8}}>{message}</div>
            )}
            {error && (
              <div style={{background: '#ffe3e3', borderRadius: 12, padding: 10, color: '#c00', fontWeight: 700, fontSize: 15, marginBottom: 8}}>{error}</div>
            )}
          </div>
        </div>
      )}

      {/* הודעת ביטול מעוצבת */}
      {cancelMsg && (
        <div style={{background: '#ffe3e3', borderRadius: 12, padding: 14, color: '#c00', fontWeight: 700, fontSize: 16, marginBottom: 8, marginTop: 8}}>
          {cancelMsg}
        </div>
      )}

      {/* הודעות מערכת */}
      {message && !showEditModal && (
        <div style={{background: '#d4f7e3', borderRadius: 12, padding: 14, color: '#1a7f4d', fontWeight: 700, fontSize: 16, marginBottom: 8}}>{message}</div>
      )}
      {error && !showEditModal && (
        <div style={{background: '#ffe3e3', borderRadius: 12, padding: 14, color: '#c00', fontWeight: 700, fontSize: 16, marginBottom: 8}}>{error}</div>
      )}
      <div style={{background: '#e9e3f7', borderRadius: 12, padding: 14, color: '#7b2ff7', fontWeight: 700, fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
        <FaBell style={{fontSize: 22}} />
        <span>הודעות מערכת יופיעו כאן בקרוב...</span>
      </div>
    </div>
  );
}