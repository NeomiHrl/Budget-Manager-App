import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIncome } from '../Api/ApiIncomes';
import { getIncomeSources } from '../Api/ApiIncomeSource';
import styles from './AddIncome.module.css';
import { useUser } from '../Contexts/UserContext';

interface IncomeSource {
  income_source_id: number;
  income_source_name: string;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}
function getMaxDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

const AddIncome: React.FC = () => {
    const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(getToday());
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [error, setError] = useState('');
  const {user} = useUser();

  useEffect(() => {
    getIncomeSources().then(data => {
      setSources(data || []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!amount || !source || !date) {
      setError('נא למלא את כל השדות (מלבד תיאור)');
      return;
    }
    try {
      await createIncome({
        income_description: description,
        amount: Number(amount),
        income_source_id: Number(source),
        income_date: date,
        user_id: user.user_id
      });
      navigate('/incomes', { replace: true });
    } catch (err) {
      setError('שגיאה ביצירת הכנסה');
    }
  };

  return (
    <div className={styles.addIncomePage}>
      <h2 className={styles.title}>הוספת הכנסה חדשה</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>תיאור הכנסה
          <input className={styles.input} value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <label className={styles.label}>סכום הכנסה
          <input className={styles.input} type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
        </label>
        <label className={styles.label}>סוג הכנסה
          <select className={styles.input} value={source} onChange={e => setSource(e.target.value)} required>
            <option value="">בחר סוג</option>
            {sources.map((src) => (
              <option key={src.income_source_id} value={src.income_source_id}>{src.income_source_name}</option>
            ))}
          </select>
        </label>
        <label className={styles.label}>תאריך
          <input className={styles.input} type="date" value={date} onChange={e => setDate(e.target.value)} max={getMaxDate()} required />
        </label>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.submitBtn} type="submit">הוסף הכנסה</button>
        <button type="button" className={styles.cancelBtn} onClick={() => setShowCancelModal(true)}>ביטול</button>
      </form>
      {showCancelModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalTitle}>האם את/ה בטוח/ה שתרצה לבטל את ההוספה?</div>
            <div className={styles.modalActions}>
              <button className={styles.modalApprove} onClick={() => navigate('/incomes')}>כן, בטל</button>
              <button className={styles.modalCancel} onClick={() => setShowCancelModal(false)}>לא, המשך</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddIncome;
