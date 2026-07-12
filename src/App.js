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
            <Route path="/inscription" element={<SignupPage onSignup={handleLogin} />} />
            <Route path="/connexion" element={<LoginPage onLogin={handleLogin} />} />
            
            <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
