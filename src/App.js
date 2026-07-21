import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SitterProfilePage from './pages/SitterProfilePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import ParentSearchPage from './pages/parent/ParentSearchPage';
import ParentReservationsPage from './pages/parent/ParentReservationsPage';
import ParentProfilePage from './pages/parent/ParentProfilePage';
import ParentBabysitterProfilePage from './pages/parent/ParentBabysitterProfilePage';
import ParentChildrenPage from './pages/parent/ParentChildrenPage';
import ParentHistoryPage from './pages/parent/ParentHistoryPage';
import ParentComplaintPage from './pages/parent/ParentComplaintPage';
import ParentFavoritesPage from './pages/parent/ParentFavoritesPage';
import BabysitterDashboardPage from './pages/babysitter/BabysitterDashboardPage';
import BabysitterProfilePage from './pages/babysitter/BabysitterProfilePage';
import BabysitterRequestsPage from './pages/babysitter/BabysitterRequestsPage';
import BabysitterReviewsPage from './pages/babysitter/BabysitterReviewsPage';
import BabysitterHistoryPage from './pages/babysitter/BabysitterHistoryPage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RedirectIfAuth from './components/RedirectIfAuth';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';
import { initializeAdminDemoData } from './data/adminMockData';
import { getStoredCurrentUser, getStoredUsers, normalizeRole, persistUserAccount, saveStoredCurrentUser } from './utils/storage';

function AppContent() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
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
  const [currentLanguage, setCurrentLanguage] = useState(() => localStorage.getItem('confiSitLanguage') || 'fr');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeLanguage = (lng) => {
    localStorage.setItem('confiSitLanguage', lng);
    setCurrentLanguage(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const storedLng = localStorage.getItem('confiSitLanguage');
    const initialLng = storedLng || i18n.resolvedLanguage || i18n.language || 'fr';

    if (i18n.language !== initialLng) {
      i18n.changeLanguage(initialLng);
    } else {
      setCurrentLanguage(initialLng);
    }
  }, [i18n]);

  useEffect(() => {
    localStorage.setItem('confiSitTheme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      const currentLng = lng || i18n.language || 'fr';
      setCurrentLanguage(currentLng);
      if (currentLng === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
        document.documentElement.classList.add('font-arabic');
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = currentLng;
        document.documentElement.classList.remove('font-arabic');
      }
    };

    handleLanguageChange(i18n.language);
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    initializeAdminDemoData();
    const storedUser = getStoredCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setHomeMode('member');
    }
  }, []);

  const handleLogin = (credentials) => {
    const normalizedRole = normalizeRole(credentials?.role);
    // On relit le compte déjà enregistré (avec son vrai mot de passe) pour ne
    // jamais l'écraser avec un objet partiel qui ne contiendrait pas ce champ.
    const existingUsers = getStoredUsers();
    const existingAccount = credentials?.email ? existingUsers[credentials.email] : null;

    const nextUser = {
      name: credentials.name || existingAccount?.name || 'Utilisateur',
      email: credentials.email,
      role: normalizedRole,
      phone: credentials.phone || existingAccount?.phone || '',
      address: credentials.address || existingAccount?.address || '',
      childrenCount: credentials.childrenCount || existingAccount?.childrenCount || 1,
      bio: credentials.bio || existingAccount?.bio || '',
      hourlyRate: credentials.hourlyRate || existingAccount?.hourlyRate || 35,
      zone: credentials.zone || existingAccount?.zone || 'Tunis',
      availability: credentials.availability || existingAccount?.availability || ['Matin'],
      experience: credentials.experience || existingAccount?.experience || 3,
      photo: credentials.photo || existingAccount?.photo || '',
      // Ne jamais réécrire un mot de passe vide : on garde celui déjà stocké
      // si l'appelant n'en transmet pas (ex: signup qui ne passe que name/email/role).
      password: credentials.password || existingAccount?.password || '',
    };
    persistUserAccount(nextUser, { persistSession: true });
    setUser(nextUser);
    setHomeMode('member');

    if (nextUser.role === 'admin') {
      navigate('/espace-admin');
    } else if (nextUser.role === 'babysitter') {
      navigate('/espace-babysitter');
    } else {
      navigate('/espace-parent');
    }
  };

  const handleLogout = () => {
    saveStoredCurrentUser(null);
    setUser(null);
    setHomeMode('hero');
  };

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-slate-900 dark:bg-slate-950 dark:text-slate-100 dark:selection:bg-amber-500/30">
        <Navbar
          user={user}
          setHomeMode={setHomeMode}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
          changeLanguage={changeLanguage}
          currentLng={currentLanguage}
        />
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
            <Route path="/inscription" element={<RedirectIfAuth><SignupPage /></RedirectIfAuth>} />
            <Route path="/connexion" element={<RedirectIfAuth><LoginPage onLogin={handleLogin} /></RedirectIfAuth>} />
            <Route
              path="/mot-de-passe-oublie"
              element={
                <div className="mx-auto max-w-2xl rounded-3xl bg-white p-9 shadow-[0_25px_70px_rgba(15,23,42,0.08)] dark:bg-slate-900 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{t('auth.forgotPassword.title')}</h1>
                  <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{t('auth.forgotPassword.description')}</p>
                  <form className="mt-8 grid gap-6">
                    <label htmlFor="forgot-email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('auth.forgotPassword.emailLabel')}</label>
                    <input id="forgot-email" type="email" placeholder={t('auth.forgotPassword.emailPlaceholder')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-700 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" />
                    <button type="button" className="w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4.5 text-base font-semibold text-white shadow-[0_20px_50px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(249,115,22,0.35)] focus:outline-none focus:ring-2 focus:ring-orange-400 sm:w-auto">{t('auth.forgotPassword.cta')}</button>
                  </form>
                </div>
              }
            />
            <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
            <Route path="/espace-admin" element={<PrivateRoute requiredRole="admin"><AdminPage user={user} /></PrivateRoute>}>
              <Route index element={<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"><p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Tableau de bord</p><h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Bienvenue dans l’espace admin</h2></div>} />
              <Route path="statistiques" element={<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"><p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Statistiques</p><h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Analyse détaillée de la plateforme</h2></div>} />
              <Route path="profils" element={<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"><p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Profils</p><h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Gérez les utilisateurs et leurs profils</h2></div>} />
              <Route path="reclamations" element={<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"><p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Réclamations</p><h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Traitez les signalements du support</h2></div>} />
            </Route>
            <Route path="/espace-parent" element={<PrivateRoute requiredRole="parent"><ParentDashboardPage user={user} /></PrivateRoute>}>
              <Route index element={<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"><p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Tableau de bord</p><h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Bienvenue dans votre espace parent</h2></div>} />
              <Route path="recherche" element={<ParentSearchPage />} />
              <Route path="reservations" element={<ParentReservationsPage />} />
              <Route path="profil" element={<ParentProfilePage />} />
              <Route path="babysitter/:id" element={<ParentBabysitterProfilePage />} />
              <Route path="enfants" element={<ParentChildrenPage />} />
              <Route path="favoris" element={<ParentFavoritesPage />} />
              <Route path="historique" element={<ParentHistoryPage />} />
              <Route path="reclamation" element={<ParentComplaintPage />} />
            </Route>
            <Route path="/espace-babysitter" element={<PrivateRoute requiredRole="babysitter"><BabysitterDashboardPage user={user} /></PrivateRoute>}>
              <Route index element={<div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900"><p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Tableau de bord</p><h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Bienvenue dans votre espace babysitter</h2></div>} />
              <Route path="profil" element={<BabysitterProfilePage />} />
              <Route path="demandes" element={<BabysitterRequestsPage />} />
              <Route path="avis" element={<BabysitterReviewsPage />} />
              <Route path="historique" element={<BabysitterHistoryPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;