import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SitterProfilePage from './pages/SitterProfilePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HowItWorksPage from './pages/HowItWorksPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RedirectIfAuth from './components/RedirectIfAuth';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [homeMode, setHomeMode] = useState('hero');
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('confiSitTheme');
    if (stored) {
      return stored;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => prev === 'light' ? 'dark' : 'light');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    localStorage.setItem('confiSitTheme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleLanguageChange = () => {
      const currentLng = i18n.language;
      if (currentLng === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.classList.add('font-arabic');
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.classList.remove('font-arabic');
      }
    };
    handleLanguageChange();
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    try {
      const storageUser = localStorage.getItem('confiSitUser');
      if (storageUser) {
        const parsed = JSON.parse(storageUser);
        // Guard against malformed storage
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
          setHomeMode('member');
        }
      }
    } catch {
      // If storage is corrupted, clear it
      localStorage.removeItem('confiSitUser');
    }
  }, []);


  const handleLogin = (credentials) => {
    const nextUser = {
      name: credentials.name || 'Utilisateur',
      email: credentials.email,
      role: credentials.role || 'parent',
    };
    localStorage.setItem('confiSitUser', JSON.stringify(nextUser));
    setUser(nextUser);
    setHomeMode('member');
  };

  const handleLogout = () => {
    localStorage.removeItem('confiSitUser');
    setUser(null);
    setHomeMode('hero');
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-amber-500/30">
        <Navbar user={user} setHomeMode={setHomeMode} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  user={user}
                  homeMode={homeMode}
                  setHomeMode={setHomeMode}
                  onLogin={handleLogin}
                  onSignup={handleLogin}
                />
              }
            />
            <Route path="/recherche" element={<SearchPage />} />
            <Route path="/profil/:id" element={<SitterProfilePage />} />
            <Route path="/inscription" element={<RedirectIfAuth><SignupPage onSignup={handleLogin} /></RedirectIfAuth>} />
            <Route path="/connexion" element={<RedirectIfAuth><LoginPage onLogin={handleLogin} /></RedirectIfAuth>} />
            <Route path="/mot-de-passe-oublie" element={<div className="mx-auto max-w-2xl rounded-3xl bg-white p-9 shadow-[0_25px_70px_rgba(15,23,42,0.08)] dark:bg-slate-900 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]"><h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Mot de passe oublié</h1><p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Si un compte existe avec cet email, un lien de réinitialisation sera envoyé.</p><form className="mt-8 grid gap-6"><label htmlFor="forgot-email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label><input id="forgot-email" type="email" placeholder="exemple@mail.com" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" /><button type="button" className="w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4.5 text-base font-semibold text-white shadow-[0_20px_50px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(249,115,22,0.35)] focus:outline-none focus:ring-2 focus:ring-orange-400 sm:w-auto">Envoyer le lien</button></form></div>} />
            <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
