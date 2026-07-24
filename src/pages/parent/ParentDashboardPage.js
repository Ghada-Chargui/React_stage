import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Search, CalendarRange, UserCircle, Baby, History, MessageSquareWarning, Heart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getBabysitterProfiles, getFavoriteSitterIds, getReservations, STORAGE_CHANGE_EVENT_NAME } from '../../utils/storage';

function ParentDashboardPage({ user }) {
  const { t } = useTranslation();
  const location = useLocation();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    if (!storedUser) return user;
    return JSON.parse(storedUser);
  }, [user]);

  const [sitters, setSitters] = useState(() => getBabysitterProfiles());
  const [reservations, setReservations] = useState(() => getReservations());
  const [favorites, setFavorites] = useState(() => getFavoriteSitterIds(currentUser?.email));

  useEffect(() => {
    const syncData = () => {
      setSitters(getBabysitterProfiles());
      setReservations(getReservations());
      setFavorites(getFavoriteSitterIds(currentUser?.email));
    };
    syncData();
    window.addEventListener(STORAGE_CHANGE_EVENT_NAME, syncData);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT_NAME, syncData);
  }, [currentUser]);

  const myReservations = useMemo(
    () => reservations.filter((item) => item.parentEmail === currentUser?.email),
    [reservations, currentUser]
  );
  const inProgressCount = myReservations.filter((item) => ['en attente', 'confirmée'].includes(item.status)).length;
  const lastReservation = [...myReservations].sort((a, b) => `${b.date}${b.hour}`.localeCompare(`${a.date}${a.hour}`))[0];

  const recommendedSitters = useMemo(
    () => [...sitters].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)).slice(0, 2),
    [sitters]
  );

  const displayName = currentUser?.name || t('parentSpace.dashboard.defaultName');

  const stats = [
    { label: t('parentSpace.dashboard.stats.inProgress'), value: inProgressCount },
    { label: t('parentSpace.dashboard.stats.lastSitter'), value: lastReservation?.sitterName || '—' },
    { label: t('parentSpace.dashboard.stats.favorites'), value: favorites.length },
  ];

  const navItems = [
    { to: '/espace-parent', label: t('parentSpace.dashboard.nav.dashboard'), icon: Home },
    { to: '/espace-parent/recherche', label: t('parentSpace.dashboard.nav.search'), icon: Search },
    { to: '/espace-parent/favoris', label: t('parentSpace.dashboard.nav.favorites'), icon: Heart },
    { to: '/espace-parent/reservations', label: t('parentSpace.dashboard.nav.reservations'), icon: CalendarRange },
    { to: '/espace-parent/enfants', label: t('parentSpace.dashboard.nav.children'), icon: Baby },
    { to: '/espace-parent/historique', label: t('parentSpace.dashboard.nav.history'), icon: History },
    { to: '/espace-parent/reclamation', label: t('parentSpace.dashboard.nav.complaint'), icon: MessageSquareWarning },
    { to: '/espace-parent/profil', label: t('parentSpace.dashboard.nav.profile'), icon: UserCircle },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="space-y-2">
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{t('parentSpace.dashboard.tag')}</p>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('parentSpace.dashboard.greeting', { name: displayName })}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t('parentSpace.dashboard.subtitle')}</p>
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
          <p className="font-semibold">{t('parentSpace.dashboard.sidebarNote.title')}</p>
          <p className="mt-2">{t('parentSpace.dashboard.sidebarNote.text')}</p>
        </div>
      </aside>

      <div className="space-y-6">
        {location.pathname === '/espace-parent' ? (
          <section className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white shadow-[0_20px_60px_rgba(249,115,22,0.2)]">
              <p className="text-sm uppercase tracking-[0.3em]">{t('parentSpace.dashboard.welcome.tag')}</p>
              <h2 className="mt-3 text-3xl font-extrabold">{t('parentSpace.dashboard.greeting', { name: displayName })}</h2>
              <p className="mt-3 max-w-2xl text-sm text-orange-50">{t('parentSpace.dashboard.welcome.text')}</p>
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
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">{t('parentSpace.dashboard.nearby.tag')}</p>
                  <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-100">{t('parentSpace.dashboard.nearby.title')}</h3>
                </div>
                <Link to="/espace-parent/recherche" className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{t('parentSpace.dashboard.nearby.viewAll')}</Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {recommendedSitters.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 md:col-span-2">{t('parentSpace.dashboard.nearby.empty')}</p>
                ) : recommendedSitters.map((sitter) => (
                  <div key={sitter.id} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-slate-900 dark:text-slate-100">{sitter.name}</p>
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">★ {Number(sitter.rating).toFixed(1)}</span>
                    </div>
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