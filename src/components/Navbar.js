import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const baseLinkClass = 'transition-colors duration-200 hover:text-amber-600';
  const activeLinkClass = 'font-semibold text-amber-600 hover:text-amber-700';
  const inactiveLinkClass = 'text-slate-600 hover:text-amber-600';

  const handleHowItWorksClick = (event) => {
    event.preventDefault();

    if (location.pathname === '/comment-ca-marche') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    navigate('/comment-ca-marche');
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-semibold text-slate-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-soft">
            <Logo size={28} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Confi&apos;Sit</p>
            <p className="text-base font-semibold text-slate-900">Baby-sitting confiance</p>
          </div>
        </Link>

        <button
          type="button"
          className="inline-flex items-center rounded-2xl border border-slate-200 p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <nav className={`${open ? 'block' : 'hidden'} md:flex md:items-center md:gap-4`}>
          <NavLink to="/" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Accueil</NavLink>
          <button
            type="button"
            onClick={handleHowItWorksClick}
            className={`${baseLinkClass} ${location.pathname === '/comment-ca-marche' ? activeLinkClass : inactiveLinkClass}`}
          >
            Comment ça marche
          </button>
          {!user && (
            <>
              <NavLink to="/connexion" className={({ isActive }) => `rounded-full px-4 py-2 transition ${isActive ? 'bg-amber-100 font-semibold text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700'}`}>Connexion</NavLink>
              <NavLink to="/inscription" className={({ isActive }) => `rounded-full px-4 py-2 transition ${isActive ? 'bg-amber-100 font-semibold text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700'}`}>Inscription</NavLink>
            </>
          )}
          {user && (
            <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-slate-700">
              <span className="text-sm font-semibold">Bonjour, {user.name}</span>
              <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
                <LogOut size={16} /> Déconnexion
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
