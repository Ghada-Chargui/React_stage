import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { History } from 'lucide-react';

function ParentHistoryPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('confiSitParentReservations');
    if (stored) {
      setReservations(JSON.parse(stored));
    }
  }, []);

  const pastReservations = useMemo(
    () => reservations.filter((item) => item.status === 'terminée' || item.status === 'annulée'),
    [reservations]
  );

  const paymentLabel = (method) => {
    if (method === 'carte') return 'Paiement par carte';
    if (method === 'sur_place') return 'Paiement sur place';
    return 'Non renseigné';
  };

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
        {pastReservations.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Aucune garde terminée ou annulée pour le moment.</p>
        ) : pastReservations.map((reservation) => (
          <div key={reservation.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-slate-100">{reservation.sitterName}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reservation.date} • {reservation.hour} • {reservation.duration}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{reservation.address}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{paymentLabel(reservation.paymentMethod)}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${reservation.status === 'terminée' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                {reservation.status}
              </span>
            </div>
            {reservation.review && (
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Votre avis : ★ {reservation.review.stars} — {reservation.review.comment}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <p>Un souci avec l’une de ces gardes ? <Link to="/espace-parent/reclamation" className="font-semibold text-orange-700 underline-offset-4 hover:underline dark:text-orange-400">Passer une réclamation</Link></p>
      </div>
    </div>
  );
}

export default ParentHistoryPage;