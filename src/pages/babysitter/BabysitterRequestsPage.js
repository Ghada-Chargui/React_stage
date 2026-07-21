import { useEffect, useMemo, useState } from 'react';
import { getReservations, saveReservations, STORAGE_CHANGE_EVENT_NAME } from '../../utils/storage';

function BabysitterRequestsPage() {
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [allReservations, setAllReservations] = useState(() => getReservations());

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

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Demandes reçues</p>
      <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Gérez les demandes de garde</h2>
      <div className="mt-6 space-y-4">
        {requests.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Aucune demande reçue pour le moment.</p>
        ) : requests.map((request) => (
          <div key={request.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-slate-100">{request.parentName}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{request.date} • {request.hour} • {request.duration}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{request.address}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{request.paymentMethod === 'carte' ? 'Paiement par carte' : 'Paiement sur place'}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusBadgeClass(request.status)}`}>{request.status}</span>
            </div>
            {request.status === 'en attente' && (
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => updateStatus(request.id, 'confirmée')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Accepter</button>
                <button type="button" onClick={() => updateStatus(request.id, 'refusée')} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Refuser</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BabysitterRequestsPage;