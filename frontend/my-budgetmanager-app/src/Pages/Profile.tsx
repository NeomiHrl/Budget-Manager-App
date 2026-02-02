import React, { useState, useEffect } from 'react';
import { changePassword, updateUser, uploadProfileImage, getUserById,getProfileImageUrl } from '../Api/ApiUser';
import { useUser } from '../Contexts/UserContext';
import { FaUserCircle, FaTrash, FaEnvelope, FaEdit, FaSave, FaBell, FaSearchPlus } from 'react-icons/fa';
// DropZone component for drag-and-drop upload
function DropZone({ onDrop }: { onDrop: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDrop(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDrop(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      style={{
        width: 260,
        height: 260,
        borderRadius: '50%',
        background: dragActive ? '#e9e3f7' : '#f3f3f3',
        border: dragActive ? '3px solid #7b2ff7' : '3px dashed #bbb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        marginBottom: 18,
        color: '#7b2ff7',
        fontWeight: 700,
        fontSize: 20,
        position: 'relative',
        transition: 'border 0.2s, background 0.2s',
      }}
      tabIndex={0}
      aria-label="גרור או העלה תמונה"
    >
      <span style={{textAlign: 'center', color: '#7b2ff7', fontWeight: 700, fontSize: 20}}>גרור/העלה תמונה</span>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{display: 'none'}}
        onChange={handleChange}
      />
    </div>
  );
}
import NotificationCard from '../Components/NotificationCard';
import { useRef } from 'react';

export default function Profile() {
  const { user, setUser } = useUser();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(user?.profile_image_url || '');
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type?: 'success' | 'error' | 'info' } | null>(null);

  // מחיקת תמונת פרופיל
  const handleDeleteImage = async () => {
    if (!profileImage) return;
    setDeleting(true);
    setNotification(null);
    try {
      await import('../Api/ApiUser').then(({ deleteProfileImage }) => deleteProfileImage(user.user_id));
      setProfileImage('');
      setUser && setUser({ ...user, profile_image_url: '' });
      setShowImageModal(false);
      setNotification({ message: 'תמונת הפרופיל נמחקה בהצלחה', type: 'success' });
    } catch (err: any) {
      setNotification({ message: err.message || 'שגיאה במחיקת תמונה', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);


  // העלאת תמונה (תמיד משתמשים ב-uploadProfileImage)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setNotification(null);
    setUploading(true);
    try {
      const res = await uploadProfileImage(user.user_id, fileInputRef.current!.files![0]);
      setNotification({ message: user.profile_image_url ? 'תמונת הפרופיל עודכנה בהצלחה!' : 'תמונת הפרופיל הועלתה בהצלחה!', type: 'success' });
      setProfileImage(res.profile_image_url);
      setImageVersion(Date.now());
      setUser && setUser({ ...user, profile_image_url: res.profile_image_url });
    } catch (err: any) {
      setNotification({ message: err.message || 'שגיאה בהעלאת תמונה', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  // שמירה מתוך המודאל
  const handleSave = async () => {
    setNotification(null);
    if (!firstName || !lastName || !email) {
      setNotification({ message: 'יש למלא את כל השדות', type: 'error' });
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
        setNotification({ message: 'הפרטים והסיסמה נשמרו בהצלחה!', type: 'success' });
      } else {
        setNotification({ message: 'הפרטים נשמרו בהצלחה!', type: 'success' });
      }
      setShowEditModal(false);
      setShowPasswordFields(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setNotification({ message: err.message || 'שגיאה בעדכון הפרטים', type: 'error' });
    }
  };

  // פתיחת מודאל עריכה
  const handleEditClick = () => {
    setShowEditModal(true);
    setShowPasswordFields(false);
  };

  // ביטול עריכה
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setNotification(null);
    setOldPassword('');
    setNewPassword('');
    setShowPasswordFields(false);
    setNotification({ message: 'השינויים בוטלו ולא נשמרו', type: 'info' });
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
                  <div style={{position: 'relative', background: '#fff', borderRadius: 18, padding: 24, boxShadow: '0 2px 16px #e9e3f7', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 320}} onClick={e => e.stopPropagation()}>
                    {/* איקס לסגירה */}
                    <button onClick={() => setShowImageModal(false)} style={{position: 'absolute', top: 10, left: 10, background: 'transparent', border: 'none', fontSize: 28, color: '#7b2ff7', cursor: 'pointer', zIndex: 2}} title="סגור">×</button>
                    {profileImage ? (
                      <div style={{position: 'relative', width: 260, height: 260, marginBottom: 18}}>
                        <img
                          src={getProfileImageUrl(profileImage) + `?v=${imageVersion}`}
                          alt={user?.first_name ? `תמונת פרופיל של ${user.first_name}` : 'תמונת פרופיל' }
                          style={{width: 260, height: 260, borderRadius: '50%', objectFit: 'cover', border: '3px solid #7b2ff7'}}
                        />
                        {/* זכוכית מגדלת */}
                        <button
                          style={{position: 'absolute', bottom: 10, right: 10, background: '#fff', border: '2px solid #7b2ff7', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, boxShadow: '0 2px 8px #e9e3f7'}}
                          title="הגדל תמונה"
                          onClick={() => window.open(getProfileImageUrl(profileImage) + `?v=${imageVersion}`, '_blank')}
                        >
                          <FaSearchPlus size={22} color="#7b2ff7" />
                        </button>
                      </div>
                    ) : (
                      <DropZone onDrop={async (file) => {
                        setUploading(true);
                        setNotification(null);
                        try {
                          const res = await uploadProfileImage(user.user_id, file);
                          setNotification({ message: 'תמונת הפרופיל הועלתה בהצלחה!', type: 'success' });
                          setProfileImage(res.profile_image_url);
                          setImageVersion(Date.now());
                          setUser && setUser({ ...user, profile_image_url: res.profile_image_url });
                          setShowImageModal(false);
                        } catch (err: any) {
                          setNotification({ message: err.message || 'שגיאה בהעלאת תמונה', type: 'error' });
                        } finally {
                          setUploading(false);
                        }
                      }} />
                    )}
                    {profileImage && (
                      <div style={{display: 'flex', gap: 16, marginTop: 10}}>
                        {/* כפתור עריכה */}
                        <button
                          onClick={() => { setShowImageModal(false); fileInputRef.current && fileInputRef.current.click(); }}
                          style={{background: '#fff', color: '#7b2ff7', border: '2px solid #7b2ff7', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8}}
                          title="החלף תמונה"
                          disabled={uploading}
                        >
                          <FaEdit /> ערוך
                        </button>
                        {/* כפתור מחיקה */}
                        <button
                          onClick={handleDeleteImage}
                          style={{background: '#fff', color: '#c00', border: '2px solid #c00', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8}}
                          title="מחק תמונה"
                          disabled={deleting}
                        >
                          <FaTrash style={{marginLeft: 6}} /> {deleting ? 'מוחק...' : 'מחק'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
        </div>
        {isHovering && (
          <div style={{color: '#7b2ff7', fontWeight: 700, fontSize: 14, marginBottom: 4}}>
            {user.profile_image_url ? 'החלף תמונת פרופיל' : 'העלה תמונת פרופיל'}
          </div>
        )}
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
            {/* הודעות בתוך המודאל */}
            {notification && (
              <NotificationCard
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
                duration={4000}
              />
            )}
          </div>
        </div>
      )}

      {/* הודעות מערכת מעוצבות */}
      {notification && !showEditModal && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          duration={4000}
        />
      )}
      <div style={{background: '#e9e3f7', borderRadius: 12, padding: 14, color: '#7b2ff7', fontWeight: 700, fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
        <FaBell style={{fontSize: 22}} />
        <span>הודעות מערכת יופיעו כאן בקרוב...</span>
      </div>
    </div>
  );
}