import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

function Navbar({ user, onLogout, theme, toggleTheme, changeLanguage, currentLng }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const baseLinkClass = 'transition-colors duration-200 hover:text-amber-600 dark:hover:text-amber-400';
  const activeLinkClass = 'font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300';
  const inactiveLinkClass = 'text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400';
  const isArabic = (currentLng || i18n.language || 'fr') === 'ar';

  const handleHowItWorksClick = (event) => {
    event.preventDefault();

    if (location.pathname === '/comment-ca-marche') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    navigate('/comment-ca-marche');
  };

  const getAccueilClass = ({ isActive }) => {
    return `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;
  };

  const getConnexionClass = ({ isActive }) => {
    if (isActive) {
      return 'rounded-full px-5 py-2.5 transition-all duration-300 font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50';
    }
    return 'rounded-full px-5 py-2.5 transition-all duration-300 font-semibold bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-900/30 dark:hover:text-amber-300';
  };

  const getInscriptionClass = ({ isActive }) => {
    if (isActive) {
      return 'rounded-full px-5 py-2.5 transition-all duration-300 font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50';
    }
    return 'rounded-full px-5 py-2.5 transition-all duration-300 font-semibold bg-gradient-to-r from-amber-600 to-orange-600 text-white';
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-extrabold text-slate-900 dark:text-slate-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-400">
            <Logo size={30} />
          </div>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Confi&apos;Sit</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">{t('nav.brandSubtitle')}</p>
          </div>
        </Link>

        <button
          type="button"
          className="inline-flex items-center rounded-3xl border border-slate-200 p-2.5 text-slate-700 md:hidden transition-all duration-300 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => setOpen((value) => !value)}
          aria-label={t('nav.toggleNavigation')}
        >
          <Menu size={22} />
        </button>

        <nav className={`${open ? 'block' : 'hidden'} md:flex md:items-center md:gap-4`}>
          {!user && <NavLink to="/" className={getAccueilClass}>{t('nav.home')}</NavLink>}
          {user && (
            <NavLink to={user.role === 'babysitter' ? '/espace-babysitter' : user.role === 'admin' ? '/espace-admin' : '/espace-parent'} className={getAccueilClass}>
              {user.role === 'babysitter' ? 'Espace babysitter' : user.role === 'admin' ? 'Espace admin' : 'Espace parent'}
            </NavLink>
          )}
          <button
            type="button"
            onClick={handleHowItWorksClick}
            className={`${baseLinkClass} ${location.pathname === '/comment-ca-marche' ? activeLinkClass : inactiveLinkClass}`}
          >
            {t('nav.howItWorks')}
          </button>

          <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span>{t('nav.language')}</span>
            <select
              value={currentLng || 'fr'}
              onChange={(event) => changeLanguage(event.target.value)}
              className="bg-transparent outline-none"
              aria-label={t('nav.languageLabel')}
            >
              <option value="fr">{t('nav.languages.fr')}</option>
              <option value="en">{t('nav.languages.en')}</option>
              <option value="ar">{t('nav.languages.ar')}</option>
            </select>
          </label>

          <button
            onClick={toggleTheme}
            className="rounded-full p-2.5 text-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={t('nav.toggleTheme')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {!user && (
            <>
              <NavLink to="/connexion" className={getConnexionClass}>{t('nav.login')}</NavLink>
              <NavLink to="/inscription" className={getInscriptionClass}>{t('nav.signup')}</NavLink>
            </>
          )}
          {user && (
            <div className="flex items-center gap-3 rounded-full bg-slate-100 px-5 py-2.5 text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200 dark:shadow-slate-900/30">
              <span className="text-sm font-semibold">{t('nav.greeting', { name: user.name })}</span>
              <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100 hover:shadow-sm dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                <LogOut size={18} className={isArabic ? 'rotate-180' : ''} /> {t('nav.logout')}
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
