import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../Contexts/UserContext";
import styles from './Register.module.css';

export default function Register() {

    const { register, loading, error } = useUser();
    const navigate = useNavigate();
    const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ first_name?: string; last_name?: string; email?: string; password?: string; general?: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        if (typeof error === 'function') {
            error("");
        }
        setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // client-side validation
        const newErrors: typeof errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.first_name) newErrors.first_name = 'יש להכניס שם פרטי';
        if (!form.last_name) newErrors.last_name = 'יש להכניס שם משפחה';
        if (!form.email || !emailRegex.test(form.email)) newErrors.email = 'אנא הכנס אימייל תקין';
        if (!form.password || form.password.length < 4) newErrors.password = 'הסיסמה חייבת להיות לפחות 4 תווים';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            await register(form);
            navigate("/login");
        } catch (err: any) {
            console.error(err);
            setErrors({ general: err?.message || 'שגיאה בעת הרשמה' });
        }
    };

    return (
        <div className={styles['register-page']}>
            <div className={styles['register-card']}>
                <div className={styles['register-title']}>הרשמה</div>
                <form onSubmit={handleRegister} dir="rtl" noValidate>
                    <div className={styles['two-col']}>
                        <div className={styles['form-group']}>
                            <label className={styles.label} htmlFor="first_name">
                                <span className={styles.required}>*</span>שם פרטי
                            </label>
                            <input
                                className={`${styles.input} ${errors.first_name ? styles.invalid : ''}`}
                                dir="rtl"
                                type="text"
                                name="first_name"
                                id="first_name"
                                placeholder="שם פרטי"
                                value={form.first_name}
                                onChange={handleChange}
                                autoComplete="given-name"
                                required
                            />
                            {errors.first_name && <div className={styles['error-message']}>{errors.first_name}</div>}
                        </div>
                        <div className={styles['form-group']}>
                            <label className={styles.label} htmlFor="last_name">
                                <span className={styles.required}>*</span>שם משפחה
                            </label>
                            <input
                                className={`${styles.input} ${errors.last_name ? styles.invalid : ''}`}
                                dir="rtl"
                                type="text"
                                name="last_name"
                                id="last_name"
                                placeholder="שם משפחה"
                                value={form.last_name}
                                onChange={handleChange}
                                autoComplete="family-name"
                                required
                            />
                            {errors.last_name && <div className={styles['error-message']}>{errors.last_name}</div>}
                        </div>
                    </div>

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
                                autoComplete="new-password"
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

					<div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
						<Link to="/login" className={styles['link-btn']}>כבר יש לי חשבון</Link>
					</div>

					<button type="submit" className={styles['submit-btn']} disabled={loading}>
						{loading ? "בתהליך הרשמה..." : "הרשם"}
					</button>

                    {(errors.general || (typeof error === 'string' && error)) && <p className={styles['error-message']} style={{ textAlign: 'center', marginTop: 10 }}>{errors.general || error}</p>}
                </form>
            </div>
        </div>
    );

}
