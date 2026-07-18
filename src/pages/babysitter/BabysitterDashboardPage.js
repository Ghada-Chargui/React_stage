import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, UserCircle2, Inbox, MessageSquareQuote } from 'lucide-react';
import { useMemo } from 'react';

function BabysitterDashboardPage({ user }) {
  const location = useLocation();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    if (!storedUser) return user;
    return JSON.parse(storedUser);
  }, [user]);

  const navItems = [
    { to: '/espace-babysitter', label: 'Tableau de bord', icon: Home },
    { to: '/espace-babysitter/profil', label: 'Profil', icon: UserCircle2 },
    { to: '/espace-babysitter/demandes', label: 'Demandes', icon: Inbox },
    { to: '/espace-babysitter/avis', label: 'Avis', icon: MessageSquareQuote },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="space-y-2">
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Espace babysitter</p>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Bonjour {currentUser?.name || 'babysitter'}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Suivez vos demandes, votre profil et vos avis.</p>
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/espace-babysitter'}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="space-y-6">
        {location.pathname === '/espace-babysitter' ? (
          <section className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white shadow-[0_20px_60px_rgba(249,115,22,0.2)]">
              <p className="text-sm uppercase tracking-[0.3em]">Bienvenue</p>
              <h2 className="mt-3 text-3xl font-extrabold">Bonjour {currentUser?.name || 'babysitter'}</h2>
              <p className="mt-3 max-w-2xl text-sm text-orange-50">Votre activité est bien organisée. Consultez vos nouvelles demandes et gardez votre profil à jour.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Demandes en attente</p>
                <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">3</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Prochaine garde</p>
                <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Samedi 09:00</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">Note moyenne</p>
                <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">4.9/5</p>
              </div>
            </div>
          </section>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

export default BabysitterDashboardPage;
