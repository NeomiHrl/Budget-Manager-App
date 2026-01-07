
import React, { useEffect, useState } from 'react';
import { getExpensesByUserId, deleteExpense } from '../Api/ApiExpenses';
import { getExpenseSources } from '../Api/ApiExpenseSource';
import styles from './Incomes.module.css';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useUser } from '../Contexts/UserContext';

interface Expense {
    id?: number;
    expense_id?: number;
    expense_description: string;
    amount: number;
    expense_date: string;
    expense_source_id: number;
}

interface ExpenseSource {
    expense_source_id: number;
    expense_source_name: string;
}

interface MonthGroup {
    month: string;
    year: string;
    expenses: Expense[];
}

function groupByMonth(expenses: Expense[]): MonthGroup[] {
    const groups: {[key: string]: MonthGroup} = {};
    expenses.forEach(expense => {
        const d = new Date(expense.expense_date);
        const month = d.toLocaleString('he-IL', { month: 'long' });
        const year = d.getFullYear().toString();
        const key = `${year}-${month}`;
        if (!groups[key]) {
            groups[key] = { month, year, expenses: [] };
        }
        groups[key].expenses.push(expense);
    });
    return Object.values(groups).sort((a, b) => {
        const aDate = new Date(`${a.year}-${a.month}`);
        const bDate = new Date(`${b.year}-${b.month}`);
        return bDate.getTime() - aDate.getTime();
    });
}

const Expenses: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [expenseSources, setExpenseSources] = useState<ExpenseSource[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        getExpensesByUserId(user.user_id).then(data => setExpenses(data || []));
        getExpenseSources().then(data => setExpenseSources(data || []));
    }, [user.user_id]);

    const getSourceName = (id: number): string =>
        expenseSources.find(src => src.expense_source_id === id)?.expense_source_name || String(id);

    const monthGroups = groupByMonth(expenses);
    const showOnlyLastMonth = expenses.length === 0 || monthGroups.length === 0;
    const lastMonthGroup = monthGroups[0];

    const handleDeleteExpense = async () => {
        if (expenseToDelete == null) return;
        await deleteExpense(expenseToDelete);
        setExpenses(prev => prev.filter(e => e.expense_id !== expenseToDelete && e.id !== expenseToDelete));
        setShowDeleteModal(false);
        setExpenseToDelete(null);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setExpenseToDelete(null);
    };

    return (
        <>
            <div className={styles.incomesPage}>
                <div className={styles.headerBar}>
                    <h2 className={styles.title}>ההוצאות שלי</h2>
                    <button className={styles.addIncomeBtn} onClick={()=>{navigate('/add-expense')}}>+ הוספת הוצאה</button>
                </div>
                <div className={styles.monthsList}>
                    {(showOnlyLastMonth && lastMonthGroup) ? (
                        <MonthAccordion
                            key={lastMonthGroup.year + lastMonthGroup.month}
                            month={lastMonthGroup.month}
                            year={lastMonthGroup.year}
                            expenses={lastMonthGroup.expenses}
                            expanded={expanded === lastMonthGroup.year + lastMonthGroup.month}
                            onToggle={() => setExpanded(expanded === lastMonthGroup.year + lastMonthGroup.month ? null : lastMonthGroup.year + lastMonthGroup.month)}
                            getSourceName={getSourceName}
                            setExpenseToDelete={setExpenseToDelete}
                            setShowDeleteModal={setShowDeleteModal}
                        />
                    ) : (
                        monthGroups.map(group => (
                            <MonthAccordion
                                key={group.year + group.month}
                                month={group.month}
                                year={group.year}
                                expenses={group.expenses}
                                expanded={expanded === group.year + group.month}
                                onToggle={() => setExpanded(expanded === group.year + group.month ? null : group.year + group.month)}
                                getSourceName={getSourceName}
                                setExpenseToDelete={setExpenseToDelete}
                                setShowDeleteModal={setShowDeleteModal}
                            />
                        ))
                    )}
                </div>
            </div>
            {showDeleteModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalTitle}>האם את/ה בטוח/ה שתרצה למחוק את ההוצאה?</div>
                        <div className={styles.modalActions}>
                            <button className={styles.modalApprove} onClick={handleDeleteExpense}>מחק</button>
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
    expenses: Expense[];
    expanded: boolean;
    onToggle: () => void;
    getSourceName: (id: number) => string;
    setExpenseToDelete: (id: number) => void;
    setShowDeleteModal: (show: boolean) => void;
}

const MonthAccordion: React.FC<MonthAccordionProps> = ({ month, year, expenses, expanded, onToggle, getSourceName, setExpenseToDelete, setShowDeleteModal }) => (
    <div className={styles.monthAccordion}>
        <div className={styles.monthBar} onClick={onToggle}>
            <span className={styles.monthTitle}>{month} {year}</span>
            <span style={{marginRight: '18px', color: '#32243d', fontWeight: 700, fontSize: '1.08rem'}}>
                סה"כ: {expenses.reduce((sum, i) => sum + (i.amount || 0), 0).toLocaleString()} ₪
            </span>
            <span className={styles.arrow}>{expanded ? '▲' : '▼'}</span>
        </div>
        {expanded && (
            <div className={styles.incomesList}>
                {expenses.length === 0 ? (
                    <div className={styles.noIncomes}>אין עדיין שום הוצאות</div>
                ) : (
                    expenses.map((expense, idx) => 
                        <div key={expense.expense_id ?? expense.id ?? idx} className={styles.incomeRow}>
                            <span className={styles.incomeAmount}>{expense.amount.toLocaleString()} ₪</span>
                            <span className={styles.incomeSource}>{getSourceName(expense.expense_source_id)}</span>
                            <span className={styles.incomeDate}>{new Date(expense.expense_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                            <span className={styles.incomeActions}>
                                <button className={styles.iconBtn} data-tooltip="עריכה" onClick={() => window.location.href = `/edit-expense/${expense.expense_id ?? expense.id}`}>
                                    <FaEdit />
                                </button>
                                <button className={styles.iconBtn} data-tooltip="מחיקה" onClick={() => { if (typeof expense.expense_id === 'number') { setExpenseToDelete(expense.expense_id); setShowDeleteModal(true); } }}>
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

export default Expenses;