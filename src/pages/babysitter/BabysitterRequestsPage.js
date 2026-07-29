import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, CalendarDays } from 'lucide-react';
import { getReservations, saveReservations, STORAGE_CHANGE_EVENT_NAME } from '../../utils/storage';
import ReservationCalendar from '../../components/ReservationCalendar';

function BabysitterRequestsPage() {
  const { t } = useTranslation();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [allReservations, setAllReservations] = useState(() => getReservations());
  const [view, setView] = useState('list');

  useEffect(() => {
    const syncReservations = () => setAllReservations(getReservations());
    syncReservations();
    window.addEventListener(STORAGE_CHANGE_EVENT_NAME, syncReservations);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT_NAME, syncReservations);
  }, []);

  // Demandes reçues par CETTE babysitter, envoyées par les parents depuis leur espace réservation
  const requests = useMemo(
    () => allReservations.filter((item) => item.sitterEmail === currentUser?.email),
    [allReservations, currentUser]
  );

  const updateStatus = (id, status) => {
    const next = allReservations.map((item) => (item.id === id ? { ...item, status } : item));
    setAllReservations(next);
    saveReservations(next);
  };

  const statusBadgeClass = (status) => {
    if (status === 'terminée') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    if (status === 'acceptée' || status === 'confirmée') return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300';
    if (status === 'annulée' || status === 'refusée') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  };

  const statusLabel = (status) => t(`parentSpace.reservations.status.${status}`, status);
  const paymentLabel = (method) => (method === 'carte' ? t('parentSpace.reservations.paymentCard') : t('parentSpace.reservations.paymentOnSite'));

  const renderRequestCard = (request) => (
    <div key={request.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-extrabold text-slate-900 dark:text-slate-100">{request.parentName}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{request.date} • {request.hour} • {request.duration}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{request.address}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{paymentLabel(request.paymentMethod)}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusBadgeClass(request.status)}`}>{statusLabel(request.status)}</span>
      </div>
      {request.status === 'en attente' && (
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={() => updateStatus(request.id, 'confirmée')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">{t('babysitterSpace.requests.accept')}</button>
          <button type="button" onClick={() => updateStatus(request.id, 'refusée')} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">{t('babysitterSpace.requests.decline')}</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{t('babysitterSpace.requests.tag')}</p>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('babysitterSpace.requests.title')}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${view === 'list' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}
          >
            <List size={16} /> Liste
          </button>
          <button
            type="button"
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${view === 'calendar' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}
          >
            <CalendarDays size={16} /> Calendrier
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="mt-6 space-y-4">
          {requests.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('babysitterSpace.requests.empty')}</p>
          ) : requests.map((request) => renderRequestCard(request))}
        </div>
      ) : (
        <div className="mt-6">
          <ReservationCalendar
            reservations={requests}
            renderReservation={renderRequestCard}
            nameField="parentName"
          />
        </div>
      )}
    </div>
  );
}

export default BabysitterRequestsPage;