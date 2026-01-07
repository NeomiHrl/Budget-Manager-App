import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../Contexts/UserContext";
import styles from './Login.module.css';

export default function Login() {

    const { login, loading, error } = useUser();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        if (typeof error === 'function') {
            error("");
        }
        // clear individual field error
        setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // client-side validation
        const newErrors: typeof errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email || !emailRegex.test(form.email)) newErrors.email = 'אנא הכנס אימייל תקין';
        if (!form.password || form.password.length < 4) newErrors.password = 'הסיסמה חייבת להיות לפחות 4 תווים';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await login(form);
            navigate("/overview");
        } catch (err: any) {
            console.error(err);
            setErrors({ general: err?.message || 'שגיאה בעת התחברות' });
        }
    };

    return (
        <div className={styles['login-page']}>
            <form className={styles['login-card']} onSubmit={handleLogin} dir="rtl" noValidate>
                <div className={styles['login-title']}>התחברות</div>

                <div className={styles['form-group']}>
                    <label className={styles.label} htmlFor="email">
                        <span className={styles.required}>*</span>אימייל
                    </label>
                    <input
                        className={`${styles.input} ${errors.email ? styles.invalid : ''}`}
                        dir="rtl"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="אימייל"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />
                    {errors.email && <div className={styles['error-message']}>{errors.email}</div>}
                </div>

                <div className={styles['form-group']}>
                    <label className={styles.label} htmlFor="password">
                        <span className={styles.required}>*</span>סיסמה
                    </label>
                    <div className={styles['password-wrapper']}>
                        <input
                            className={`${styles.input} ${errors.password ? styles.invalid : ''}`}
                            dir="rtl"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="סיסמה"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                        <button type="button" className={styles['toggle-eye']} onClick={() => setShowPassword(!showPassword)} aria-label="הצג/הסתר סיסמה">
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            )}
                        </button>
                    </div>
                    {errors.password && <div className={styles['error-message']}>{errors.password}</div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
                    <Link to="/forgot-password" className={styles['link-btn']}>שכחתי סיסמה</Link>
                </div>

                <button type="submit" className={styles['submit-btn']} disabled={loading}>
                    {loading ? "מתחבר..." : "התחבר"}
                </button>

                <div className={styles['helper-row']}>
                    <span>אין לך חשבון?</span>
                    <Link to="/register" className={styles['link-btn']}>הרשם</Link>
                </div>

                {(errors.general || (typeof error === 'string' && error)) && (
                    <p className={styles['error-message']} style={{ textAlign: 'center', marginTop: 10 }}>{errors.general || error}</p>
                )}
            </form>
        </div>
    );

}
