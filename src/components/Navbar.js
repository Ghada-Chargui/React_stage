import { Link, NavLink } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

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
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-amber-600 font-semibold' : 'text-slate-600 hover:text-slate-900'}>Accueil</NavLink>
          {!user && (
            <>
              <NavLink to="/connexion" className={({ isActive }) => isActive ? 'rounded-full bg-amber-100 px-4 py-2 text-amber-700 font-semibold' : 'rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-amber-100'}>Connexion</NavLink>
              <NavLink to="/inscription" className={({ isActive }) => isActive ? 'rounded-full bg-amber-100 px-4 py-2 text-amber-700 font-semibold' : 'rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-amber-100'}>Inscription</NavLink>
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
