// Removed misplaced duplicate MonthAccordion declaration
import React, { useEffect, useState } from 'react';
import { getIncomesByUserId } from '../Api/ApiIncomes';
import { getIncomeSources } from '../Api/ApiIncomeSource';
import styles from './Incomes.module.css';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { deleteIncome } from '../Api/ApiIncomes';
import { useUser } from '../Contexts/UserContext';

interface Income {
  id?: number;
  income_id?: number;
  income_description: string;
  amount: number;
  income_date: string;
  income_source_id: number;
}

interface IncomeSource {
  income_source_id: number;
  income_source_name: string;
}

interface MonthGroup {
  month: string;
  year: string;
  incomes: Income[];
}

function groupByMonth(incomes: Income[]): MonthGroup[] {
  const groups: {[key: string]: MonthGroup} = {};
  incomes.forEach(income => {
    const d = new Date(income.income_date);
    const month = d.toLocaleString('he-IL', { month: 'long' });
    const year = d.getFullYear().toString();
    const key = `${year}-${month}`;
    if (!groups[key]) {
      groups[key] = { month, year, incomes: [] };
    }
    groups[key].incomes.push(income);
  });
  return Object.values(groups).sort((a, b) => {
    const aDate = new Date(`${a.year}-${a.month}`);
    const bDate = new Date(`${b.year}-${b.month}`);
    return bDate.getTime() - aDate.getTime();
  });
}

const Incomes: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    getIncomesByUserId(user.user_id).then(data => {
      setIncomes(data || []);
    });
    getIncomeSources().then(data => setIncomeSources(data || []));
  }, [user.user_id]);

  const getSourceName = (id: number): string =>
    incomeSources.find(src => src.income_source_id === id)?.income_source_name || String(id);

  const monthGroups = groupByMonth(incomes);
  const showOnlyLastMonth = incomes.length === 0 || monthGroups.length === 0;
  const lastMonthGroup = monthGroups[0];

  const handleDeleteIncome = async () => {
    if (incomeToDelete == null) return;
    await deleteIncome(incomeToDelete);
    setIncomes(prev => prev.filter(i => i.income_id !== incomeToDelete && i.id !== incomeToDelete));
    setShowDeleteModal(false);
    setIncomeToDelete(null);
  };

  // Removed unused openDeleteModal declaration

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setIncomeToDelete(null);
  };

  return (
    <>
      <div className={styles.incomesPage}>
        <div className={styles.headerBar}>
          <h2 className={styles.title}>ההכנסות שלי</h2>
          <button className={styles.addIncomeBtn} onClick={()=>{navigate('/add-income')}}>+ הוספת הכנסה</button>
        </div>
        <div className={styles.monthsList}>
          {(showOnlyLastMonth && lastMonthGroup) ? (
            <MonthAccordion
              key={lastMonthGroup.year + lastMonthGroup.month}
              month={lastMonthGroup.month}
              year={lastMonthGroup.year}
              incomes={lastMonthGroup.incomes}
              expanded={expanded === lastMonthGroup.year + lastMonthGroup.month}
              onToggle={() => setExpanded(expanded === lastMonthGroup.year + lastMonthGroup.month ? null : lastMonthGroup.year + lastMonthGroup.month)}
              getSourceName={getSourceName}
              setIncomeToDelete={setIncomeToDelete}
              setShowDeleteModal={setShowDeleteModal}
            />
          ) : (
            monthGroups.map(group => (
              <MonthAccordion
                key={group.year + group.month}
                month={group.month}
                year={group.year}
                incomes={group.incomes}
                expanded={expanded === group.year + group.month}
                onToggle={() => setExpanded(expanded === group.year + group.month ? null : group.year + group.month)}
                getSourceName={getSourceName}
                setIncomeToDelete={setIncomeToDelete}
                setShowDeleteModal={setShowDeleteModal}
              />
            ))
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalTitle}>האם את/ה בטוח/ה שתרצה למחוק את ההכנסה?</div>
            <div className={styles.modalActions}>
              <button className={styles.modalApprove} onClick={handleDeleteIncome}>מחק</button>
              <button className={styles.modalCancel} onClick={closeDeleteModal}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface MonthAccordionProps {
  month: string;
  year: string;
  incomes: Income[];
  expanded: boolean;
  onToggle: () => void;
  getSourceName: (id: number) => string;
  setIncomeToDelete: (id: number) => void;
  setShowDeleteModal: (show: boolean) => void;
}

const MonthAccordion: React.FC<MonthAccordionProps> = ({ month, year, incomes, expanded, onToggle, getSourceName, setIncomeToDelete, setShowDeleteModal }) => (
  <div className={styles.monthAccordion}>
    <div className={styles.monthBar} onClick={onToggle}>
      <span className={styles.monthTitle}>{month} {year}</span>
      <span style={{marginRight: '18px', color: '#32243d', fontWeight: 700, fontSize: '1.08rem'}}>
        סה"כ: {incomes.reduce((sum, i) => sum + (i.amount || 0), 0).toLocaleString()} ₪
      </span>
      <span className={styles.arrow}>{expanded ? '▲' : '▼'}</span>
    </div>
    {expanded && (
      <div className={styles.incomesList}>
        {incomes.length === 0 ? (
          <div className={styles.noIncomes}>אין עדיין שום הכנסות</div>
        ) : (
          incomes.map((income, idx) => 
            <div key={income.income_id ?? income.id ?? idx} className={styles.incomeRow}>
              <span className={styles.incomeAmount}>{income.amount.toLocaleString()} ₪</span>
              <span className={styles.incomeSource}>{getSourceName(income.income_source_id)}</span>
              <span className={styles.incomeDate}>{new Date(income.income_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              <span className={styles.incomeActions}>
                <button className={styles.iconBtn} data-tooltip="עריכה" onClick={() => window.location.href = `/edit-income/${income.income_id ?? income.id}`}>
                  <FaEdit />
                </button>
                <button className={styles.iconBtn} data-tooltip="מחיקה" onClick={() => { if (typeof income.income_id === 'number') { setIncomeToDelete(income.income_id); setShowDeleteModal(true); } }}>
                  <FaTrashAlt />
                </button>
              </span>
            </div>
          )
        ) }
      </div>
    )}
  </div>
);

  export default Incomes;