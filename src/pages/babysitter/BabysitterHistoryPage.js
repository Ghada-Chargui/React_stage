import { useEffect, useMemo, useState } from 'react';
import { History } from 'lucide-react';
import { getReservations, STORAGE_CHANGE_EVENT_NAME } from '../../utils/storage';

function BabysitterHistoryPage() {
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [reservations, setReservations] = useState(() => getReservations());

  useEffect(() => {
    const syncReservations = () => setReservations(getReservations());
    syncReservations();
    window.addEventListener(STORAGE_CHANGE_EVENT_NAME, syncReservations);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT_NAME, syncReservations);
  }, []);

  const pastRequests = useMemo(
    () => reservations.filter((item) => item.sitterEmail === currentUser?.email && ['terminée', 'annulée', 'refusée'].includes(item.status)),
    [reservations, currentUser]
  );

  const statusBadgeClass = (status) => {
    if (status === 'terminée') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
  };

  const paymentLabel = (method) => (method === 'carte' ? 'Paiement par carte' : 'Paiement sur place');

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          <History size={20} />
        </span>
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Historique</p>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Vos gardes passées</h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {pastRequests.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Aucune garde terminée, annulée ou refusée pour le moment.</p>
        ) : pastRequests.map((request) => (
          <div key={request.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-slate-100">{request.parentName}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{request.date} • {request.hour} • {request.duration}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{request.address}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{paymentLabel(request.paymentMethod)}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusBadgeClass(request.status)}`}>{request.status}</span>
            </div>
            {request.review && (
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Avis reçu : ★ {request.review.stars} — {request.review.comment}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BabysitterHistoryPage;