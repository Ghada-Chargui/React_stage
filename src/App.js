import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SitterProfilePage from './pages/SitterProfilePage';
import SignupPage from './pages/SignupPage';
import HowItWorksPage from './pages/HowItWorksPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recherche" element={<SearchPage />} />
            <Route path="/profil/:id" element={<SitterProfilePage />} />
            <Route path="/inscription" element={<SignupPage />} />
            <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
