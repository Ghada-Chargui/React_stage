import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Search, CalendarRange, UserCircle, LogOut } from 'lucide-react';
import { useMemo } from 'react';
import { sitters } from '../../data/mockSitters';

function ParentDashboardPage({ user }) {
  const location = useLocation();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    if (!storedUser) return user;
    return JSON.parse(storedUser);
  }, [user]);

  const stats = [
    { label: 'Réservations en cours', value: '2' },
    { label: 'Dernière babysitter', value: 'Solenne' },
    { label: 'Note moyenne', value: '4.9/5' },
  ];

  const navItems = [
    { to: '/espace-parent', label: 'Tableau de bord', icon: Home },
    { to: '/espace-parent/recherche', label: 'Recherche', icon: Search },
    { to: '/espace-parent/reservations', label: 'Réservations', icon: CalendarRange },
    { to: '/espace-parent/profil', label: 'Profil', icon: UserCircle },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="space-y-2">
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Espace parent</p>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Bonjour {currentUser?.name || 'parent'}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Gérez vos gardes, vos réservations et votre profil.</p>
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/espace-parent'}
              className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p className="font-semibold">À retenir</p>
          <p className="mt-2">Les réservations sont sauvegardées localement pour cette démo.</p>
        </div>
      </aside>

      <div className="space-y-6">
        {location.pathname === '/espace-parent' ? (
          <section className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white shadow-[0_20px_60px_rgba(249,115,22,0.2)]">
              <p className="text-sm uppercase tracking-[0.3em]">Bienvenue</p>
              <h2 className="mt-3 text-3xl font-extrabold">Bonjour {currentUser?.name || 'parent'}</h2>
              <p className="mt-3 max-w-2xl text-sm text-orange-50">Votre espace de garde est prêt. Consultez vos réservations et trouvez la bonne babysitter rapidement.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Babysitters à proximité</p>
                  <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-100">Quelques profils recommandés</h3>
                </div>
                <Link to="/espace-parent/recherche" className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Voir tout</Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {sitters.slice(0, 2).map((sitter) => (
                  <div key={sitter.id} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-700">
                    <p className="font-extrabold text-slate-900 dark:text-slate-100">{sitter.name}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{sitter.location} • {sitter.rate} TND/h</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{sitter.availability.join(', ')}</p>
                  </div>
                ))}
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

export default ParentDashboardPage;
