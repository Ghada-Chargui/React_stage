import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthNotice from '../components/AuthNotice';
import PasswordInput from '../components/PasswordInput';

function LoginPage({ onLogin }) {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setCredentials((prev) => ({ ...prev, [field]: event.target.value }));
    if (error) setError(null);
    if (notice) setNotice(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);

    window.setTimeout(() => {
      const usersRaw = localStorage.getItem('confiSitUsers');
      const users = usersRaw ? JSON.parse(usersRaw) : {};
      const u = users[credentials.email];
      if (!u) {
        setError(t('auth.login.errorNoAccount'));
        setIsSubmitting(false);
        return;
      }
      if (u.password !== credentials.password) {
        setError(t('auth.login.errorWrongPassword'));
        setIsSubmitting(false);
        return;
      }

      const nextUser = { name: u.nom || u.name || 'Utilisateur', email: u.email, role: u.role };
      if (onLogin) onLogin(nextUser);
      setNotice(t('auth.login.success'));
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-9 shadow-[0_25px_70px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:bg-slate-900 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <div className="space-y-5">
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-700 dark:text-orange-400">{t('auth.login.tag')}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{t('auth.login.title')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">{t('auth.login.description')}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
          <div className="space-y-4">
            <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('auth.login.emailLabel')}</label>
            <input
              id="login-email"
              type="email"
              value={credentials.email}
              onChange={handleChange('email')}
              required
              placeholder={t('auth.login.emailPlaceholder')}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30"
            />
          </div>
          <PasswordInput
            id="login-password"
            name="password"
            label={t('auth.login.passwordLabel')}
            value={credentials.password}
            onChange={handleChange('password')}
            placeholder={t('auth.login.passwordPlaceholder')}
            autoComplete="current-password"
            required
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4.5 text-base font-semibold text-white shadow-[0_20px_50px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(249,115,22,0.35)] focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300 sm:w-auto"
            >
              {isSubmitting ? t('auth.login.loginLoading') : t('auth.login.loginButton')}
            </button>
            <Link to="/mot-de-passe-oublie" className="text-sm font-semibold text-orange-700 underline-offset-4 transition hover:text-orange-800 hover:underline dark:text-orange-400 dark:hover:text-orange-300">
              {t('auth.login.forgotPassword')}
            </Link>
          </div>
        </form>
        {error && <div className="mt-8"><AuthNotice type="error">{error}</AuthNotice></div>}
        {notice && <div className="mt-8"><AuthNotice type="success">{notice}</AuthNotice></div>}
      </div>
    </section>
  );
}

export default LoginPage;
