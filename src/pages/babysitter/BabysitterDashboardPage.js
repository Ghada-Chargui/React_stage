import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, UserCircle2, Inbox, MessageSquareQuote, History, MessageSquareWarning } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getReservations, getStoredUsers, STORAGE_CHANGE_EVENT_NAME } from '../../utils/storage';

function BabysitterDashboardPage({ user }) {
  const { t } = useTranslation();
  const location = useLocation();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    if (!storedUser) return user;
    return JSON.parse(storedUser);
  }, [user]);

  const [reservations, setReservations] = useState(() => getReservations());
  const [users, setUsers] = useState(() => getStoredUsers());

  useEffect(() => {
    const syncData = () => {
      setReservations(getReservations());
      setUsers(getStoredUsers());
    };
    syncData();
    window.addEventListener(STORAGE_CHANGE_EVENT_NAME, syncData);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT_NAME, syncData);
  }, []);

  const myRequests = useMemo(
    () => reservations.filter((item) => item.sitterEmail === currentUser?.email),
    [reservations, currentUser]
  );
  const pendingCount = myRequests.filter((item) => item.status === 'en attente').length;
  const nextConfirmed = myRequests
    .filter((item) => item.status === 'confirmée')
    .sort((a, b) => `${a.date}${a.hour}`.localeCompare(`${b.date}${b.hour}`))[0];

  const myAccount = currentUser?.email ? users[currentUser.email] : null;
  const averageRating = myAccount?.rating ? Number(myAccount.rating).toFixed(1) : '—';

  const displayName = currentUser?.name || t('babysitterSpace.dashboard.defaultName');

  const navItems = [
    { to: '/espace-babysitter', label: t('babysitterSpace.dashboard.nav.dashboard'), icon: Home },
    { to: '/espace-babysitter/profil', label: t('babysitterSpace.dashboard.nav.profile'), icon: UserCircle2 },
    { to: '/espace-babysitter/demandes', label: t('babysitterSpace.dashboard.nav.requests'), icon: Inbox },
    { to: '/espace-babysitter/avis', label: t('babysitterSpace.dashboard.nav.reviews'), icon: MessageSquareQuote },
    { to: '/espace-babysitter/historique', label: t('babysitterSpace.dashboard.nav.history'), icon: History },
    { to: '/espace-babysitter/reclamation', label: t('babysitterSpace.dashboard.nav.complaint'), icon: MessageSquareWarning },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="space-y-2">
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{t('babysitterSpace.dashboard.tag')}</p>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('babysitterSpace.dashboard.greeting', { name: displayName })}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t('babysitterSpace.dashboard.subtitle')}</p>
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
              <p className="text-sm uppercase tracking-[0.3em]">{t('babysitterSpace.dashboard.welcome')}</p>
              <h2 className="mt-3 text-3xl font-extrabold">{t('babysitterSpace.dashboard.greeting', { name: displayName })}</h2>
              <p className="mt-3 max-w-2xl text-sm text-orange-50">{t('babysitterSpace.dashboard.welcomeText')}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('babysitterSpace.dashboard.stats.pending')}</p>
                <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{pendingCount}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('babysitterSpace.dashboard.stats.nextBooking')}</p>
                <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{nextConfirmed ? `${nextConfirmed.date} ${nextConfirmed.hour}` : '—'}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('babysitterSpace.dashboard.stats.averageRating')}</p>
                <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{averageRating !== '—' ? `${averageRating}/5` : '—'}</p>
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