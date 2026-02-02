import { useState, useEffect } from 'react';
import { useRef } from 'react';
import ExpensesPieChart, { COLORS as PIE_COLORS } from '../Components/ExpensesPieChart';
import IncomeExpenseBar from '../Components/IncomeExpenseBar';
import { getExpenseSources } from '../Api/ApiExpenseSource';
import { useUser } from '../Contexts/UserContext';
import { getBudgetSummary } from '../Api/ApiBudgetSummary';

const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

function getCurrentMonthYear() {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
}

export default function Overview() {
    const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const { user } = useUser();
    const [showWelcome, setShowWelcome] = useState(() => {
        const shown = localStorage.getItem('welcomeShown');
        return !shown;
    });
    const welcomeTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (!user) return;
        if (!showWelcome) return;
        if (welcomeTimeout.current) clearTimeout(welcomeTimeout.current);
        welcomeTimeout.current = setTimeout(() => {
            setShowWelcome(false);
            localStorage.setItem('welcomeShown', 'true');
        }, 6000);
        return () => {
            if (welcomeTimeout.current) clearTimeout(welcomeTimeout.current);
        };
    }, [user, showWelcome]);
    const [summary, setSummary] = useState<any>(null);
    const [expenseSources, setExpenseSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // טען נתוני תקציר בכל שינוי חודש/משתמש
    useEffect(() => {
        if (!user) return;
        const fetchSummary = async () => {
            setLoading(true);
            setError(null);
            try {
                const monthStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                const data = await getBudgetSummary(user.user_id, monthStr);
                setSummary(data);
            } catch (err) {
                setError('שגיאה בטעינת נתוני התקציר');
            }
            setLoading(false);
        };
        fetchSummary();
    }, [user, selectedMonth, selectedYear]);

    // טען קטגוריות הוצאה פעם אחת
    useEffect(() => {
        getExpenseSources().then(data => setExpenseSources(data || []));
    }, []);

    // הגדר את החודש הראשון של המשתמש (למשל ינואר 2023)
    const minYear = 2023; // שנה ראשונה שיש נתונים
    const minMonth = 0;   // ינואר (0)

    const handlePrevMonth = () => {
        // מניעת חזרה לפני החודש הראשון
        if (selectedYear === minYear && selectedMonth === minMonth) return;
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleNextMonth = () => {
        // מניעת מעבר לחודש עתידי
        if (selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth)) return;
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    return (
        <div style={{maxWidth: 700, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 18, boxShadow: '0 2px 16px #e9e3f7', position: 'relative'}}>
            {showWelcome && user && (
                <>
                    {/* Overlay with blur */}
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(7px)',
                        WebkitBackdropFilter: 'blur(7px)',
                        zIndex: 1000,
                        transition: 'background 0.3s',
                    }} />
                    {/* Modal */}
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        minWidth: 340,
                        maxWidth: 420,
                        background: 'rgba(255,255,255,0.98)',
                        zIndex: 1001,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 18,
                        boxShadow: '0 2px 24px #e9e3f7',
                        padding: '32px 24px 24px 24px',
                        opacity: 1,
                        transition: 'opacity 0.7s cubic-bezier(.68,-0.55,.27,1.55), transform 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
                        animation: 'fadeInScale 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
                    }}>
                        <div style={{fontSize: 32, marginBottom: 8, animation: 'popEmoji 1.2s infinite alternate'}}>🎉</div>
                        <div style={{fontSize: 22, fontWeight: 800, color: '#7b2ff7', marginBottom: 6, textShadow: '0 2px 8px #e9e3f7'}}>
                            שלום {user?.first_name || user?.name || ''}!
                        </div>
                        <div style={{fontSize: 16, color: '#32243d', fontWeight: 700, marginBottom: 16, textAlign: 'center'}}>
                            זה הזמן לעקוב אחרי הניהול הפיננסי שלך<br/>
                            בהצלחה! 🚀
                        </div>
                        <button
                            style={{
                                fontSize: 16,
                                padding: '10px 24px',
                                borderRadius: 10,
                                background: 'linear-gradient(90deg,#7b2ff7 0%,#f357a8 100%)',
                                color: '#fff',
                                border: 'none',
                                fontWeight: 800,
                                cursor: 'pointer',
                                marginBottom: 0,
                                boxShadow: '0 2px 12px #e9e3f7',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                animation: 'bounceBtn 1.2s infinite alternate',
                            }}
                            onClick={() => {
                                setShowWelcome(false);
                                localStorage.setItem('welcomeShown', 'true');
                            }}
                        >
                            לניהול הפיננסי שלי
                            <span style={{fontSize: 22, marginLeft: 4, animation: 'pointDown 1.2s infinite alternate'}}>👇</span>
                        </button>
                        <style>{`
                            @keyframes fadeInScale {
                                0% { opacity: 0; transform: scale(0.8) translate(-50%, -50%); }
                                100% { opacity: 1; transform: scale(1) translate(-50%, -50%); }
                            }
                            @keyframes popEmoji {
                                0% { transform: scale(1); }
                                100% { transform: scale(1.18) rotate(-8deg); }
                            }
                            @keyframes bounceBtn {
                                0% { transform: translateY(0); }
                                100% { transform: translateY(8px); }
                            }
                            @keyframes pointDown {
                                0% { transform: translateY(0); }
                                100% { transform: translateY(8px) scale(1.2); }
                            }
                        `}</style>
                    </div>
                </>
            )}
            <h2 style={{textAlign: 'center', color: '#7b2ff7', fontWeight: 800, marginBottom: 18}}>
                סיכום חודשי
            </h2>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 24}}>
                <button
                    onClick={handlePrevMonth}
                    style={{
                        fontSize: 22,
                        background: 'none',
                        border: 'none',
                        cursor: (selectedYear === minYear && selectedMonth === minMonth) ? 'not-allowed' : 'pointer',
                        color: (selectedYear === minYear && selectedMonth === minMonth) ? '#d3cbe9' : '#7b2ff7',
                        opacity: (selectedYear === minYear && selectedMonth === minMonth) ? 0.5 : 1,
                    }}
                    aria-label="חודש קודם"
                    disabled={selectedYear === minYear && selectedMonth === minMonth}
                >
                    &#8592;
                </button>
                <span style={{fontSize: 20, fontWeight: 700}}>
                    {monthNames[selectedMonth]} {selectedYear}
                </span>
                <button
                    onClick={handleNextMonth}
                    style={{
                        fontSize: 22,
                        background: 'none',
                        border: 'none',
                        cursor: (selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth)) ? 'not-allowed' : 'pointer',
                        color: (selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth)) ? '#d3cbe9' : '#7b2ff7',
                        opacity: (selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth)) ? 0.5 : 1,
                    }}
                    aria-label="חודש הבא"
                    disabled={selectedYear > currentYear || (selectedYear === currentYear && selectedMonth >= currentMonth)}
                >
                    &#8594;
                </button>
            </div>
            {loading ? (
                <div style={{textAlign: 'center', color: '#7b2ff7', fontWeight: 700}}>טוען נתונים...</div>
            ) : error ? (
                <div style={{textAlign: 'center', color: '#f357a8', fontWeight: 700}}>{error}</div>
            ) : summary ? (
                (() => {
                    // חישוב נתוני הוצאות והכנסות אמיתיים לחודש הנבחר
                    const monthStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
                    const expensesData = summary
                        .filter((s:any) => s.summary_type === 'expense' && s.month === monthStr)
                        .map((s:any) => {
                            const src = expenseSources.find((cat:any) => cat.expense_source_id === s.source_id);
                            return {
                                name: src ? src.expense_source_name : `קטגוריה ${s.source_id}`,
                                value: Math.abs(Number(s.total_expenses || s.balance || 0))
                            };
                        })
                        .filter((s:any) => s.value > 0);
                    const incomesData = summary
                        .filter((s:any) => s.summary_type === 'income' && s.month === monthStr)
                        .map((s:any) => Math.abs(Number(s.total_income || s.balance || 0)))
                        .filter((v:number) => v > 0);
                    // סכומים כוללים
                    const totalIncome = summary
                        .filter((s:any) => s.summary_type === 'income' && s.month === monthStr)
                        .reduce((sum:number, s:any) => sum + Math.abs(Number(s.total_income || s.balance || 0)), 0);
                    const totalExpenses = summary
                        .filter((s:any) => s.summary_type === 'expense' && s.month === monthStr)
                        .reduce((sum:number, s:any) => sum + Math.abs(Number(s.total_expenses || s.balance || 0)), 0);
                    if (expensesData.length === 0 && incomesData.length === 0) {
                        return <div style={{textAlign: 'center', color: '#b3a6d9', fontWeight: 600}}>אין נתונים לתקציר החודש הנבחר</div>;
                    }
                    return <>
                        <div style={{minHeight: 400, background: '#f7f5fb', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 32, padding: '32px 0 16px 0'}}>
                            <ExpensesPieChart data={expensesData} showLabels={false} />
                            {/* מקרא צבעים עם שמות וסכומים - צבעים תואמים לעוגה */}
                            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 24, width: '100%'}}>
                                {/* צור מפת צבעים דינמית כמו בעוגה */}
                                {(() => {
                                    const getHSLColor = (idx: number, total: number) => {
                                        const hue = Math.round((360 * idx) / total);
                                        return `hsl(${hue}, 70%, 55%)`;
                                    };
                                    const categoryNames = expensesData.map((item:any) => item.name);
                                    const categoryColorMap: { [key: string]: string } = {};
                                    categoryNames.forEach((name: string, idx: number) => {
                                        categoryColorMap[name] = getHSLColor(idx, categoryNames.length);
                                    });
                                    return expensesData.map((cat:any) => {
                                        const color = categoryColorMap[cat.name];
                                        return (
                                            <div key={cat.name} style={{display: 'flex', alignItems: 'center', gap: 8, direction: 'rtl'}}>
                                                <span style={{display: 'inline-block', width: 18, height: 18, borderRadius: 4, background: color, border: '1.5px solid #e9e3f7'}}></span>
                                                <span style={{fontWeight: 700, color}}>{cat.name}:</span>
                                                <span style={{fontWeight: 700, color}}>{cat.value.toLocaleString()} ₪</span>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>
                        <div style={{minHeight: 400, background: '#f7f5fb', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#b3a6d9', fontSize: 20, fontWeight: 600, marginBottom: 32, padding: '32px 0 16px 0'}}>
                            <IncomeExpenseBar totalIncome={totalIncome} totalExpenses={totalExpenses} />
                            <div style={{display: 'flex', justifyContent: 'center', gap: 48, marginTop: 8}}>
                                <span style={{color: '#3778ff', fontWeight: 700}}>סה"כ הכנסות: {totalIncome.toLocaleString()} ₪</span>
                                <span style={{color: '#ff3c3c', fontWeight: 700}}>סה"כ הוצאות: {totalExpenses.toLocaleString()} ₪</span>
                            </div>
                            <br></br>
                            <div style={{marginTop: 16, fontSize: 20, fontWeight: 600, color: totalIncome - totalExpenses >= 0 ? '#28a745' : '#dc3545'}}>
                                {totalIncome - totalExpenses >= 0 ? `עודף של ${ (totalIncome - totalExpenses).toLocaleString() } ₪` : `גרעון של ${ Math.abs(totalIncome - totalExpenses).toLocaleString() } ₪`}
                            </div>
                        </div>
                    </>;
                })()
            ) : (
                <div style={{textAlign: 'center', color: '#b3a6d9', fontWeight: 600}}>אין נתונים לתקציר החודש הנבחר</div>
            )}
        </div>
    );
}