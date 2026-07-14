import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SitterProfilePage from './pages/SitterProfilePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HowItWorksPage from './pages/HowItWorksPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RedirectIfAuth from './components/RedirectIfAuth';

function App() {
  const [user, setUser] = useState(null);
  const [homeMode, setHomeMode] = useState('hero');

  useEffect(() => {
    const storageUser = localStorage.getItem('confiSitUser');
    if (storageUser) {
      setUser(JSON.parse(storageUser));
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
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-slate-900">
        <Navbar user={user} setHomeMode={setHomeMode} onLogout={handleLogout} />
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
            <Route path="/mot-de-passe-oublie" element={<div className="mx-auto max-w-2xl rounded-[32px] bg-white p-6 shadow-soft sm:p-8"><h1 className="text-3xl font-semibold text-slate-900">Mot de passe oublié</h1><p className="mt-3 text-slate-600">Si un compte existe avec cet email, un lien de réinitialisation sera envoyé.</p><form className="mt-6 grid gap-4"><label htmlFor="forgot-email" className="text-sm font-semibold text-slate-700">Email</label><input id="forgot-email" type="email" placeholder="exemple@mail.com" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200" /><button type="button" className="w-full rounded-full bg-orange-600 px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-orange-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 sm:w-auto">Envoyer le lien</button></form></div>} />
            <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
