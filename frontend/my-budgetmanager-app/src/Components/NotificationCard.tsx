import  { useEffect } from 'react';

interface NotificationCardProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number; // milliseconds
}

const getColor = (type: string) => {
  switch (type) {
    case 'success': return '#28a745';
    case 'error': return '#c00';
    case 'info':
    default: return '#7b2ff7';
  }
};

export default function NotificationCard({ message, type = 'info', onClose, duration = 4000 }: NotificationCardProps) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      minWidth: 320,
      maxWidth: 420,
      background: 'rgba(255,255,255,0.98)',
      zIndex: 3000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
      boxShadow: '0 2px 24px #e9e3f7',
      padding: '32px 24px 24px 24px',
      opacity: 1,
      transition: 'opacity 0.7s cubic-bezier(.68,-0.55,.27,1.55), transform 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
      animation: 'fadeInScale 0.7s cubic-bezier(.68,-0.55,.27,1.55)'
    }}>
      <button onClick={onClose} style={{position: 'absolute', top: 10, left: 10, background: 'transparent', border: 'none', fontSize: 28, color: getColor(type), cursor: 'pointer', zIndex: 2}} title="סגור">×</button>
      <div style={{fontSize: 20, fontWeight: 800, color: getColor(type), marginBottom: 8, textAlign: 'center'}}>{message}</div>
      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8) translate(-50%, -50%); }
          100% { opacity: 1; transform: scale(1) translate(-50%, -50%); }
        }
      `}</style>
    </div>
  );
}
