import { useMemo } from 'react';
import { getReservations } from '../utils/storage';
import { getAdminComplaints } from '../data/adminMockData';

function UserDetailCard({ user, onEdit }) {
  const reservations = useMemo(() => {
    if (!user) return [];
    const all = getReservations();
    return all.filter((item) => item.parentEmail === user.email || item.sitterEmail === user.email);
  }, [user]);

  const complaints = useMemo(() => {
    if (!user) return [];
    return getAdminComplaints().filter((item) => item.userName === user.name);
  }, [user]);

  if (!user) return null;

  const isBabysitter = user.role === 'babysitter';

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          {user.photo ? (
            <img src={user.photo} alt={user.name} className="h-16 w-16 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-xl font-extrabold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-600">Consulter le profil</p>
            <h3 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-slate-100">{user.name}</h3>
            <span className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{user.role}</span>
          </div>
        </div>
        <button type="button" onClick={onEdit} className="shrink-0 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white">
          Modifier
        </button>
      </div>

      {isBabysitter && user.bio && (
        <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">{user.bio}</p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Coordonnées</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <li><span className="font-semibold">Email:</span> {user.email}</li>
            <li><span className="font-semibold">Téléphone:</span> {user.phone}</li>
            <li><span className="font-semibold">Adresse:</span> {user.address}</li>
            <li><span className="font-semibold">Date d’inscription:</span> {user.registeredAt}</li>
            <li><span className="font-semibold">Statut:</span> {user.status}</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Infos spécifiques</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {user.role === 'parent' ? (
              <>
                <li><span className="font-semibold">Enfants:</span> {user.childrenCount}</li>
                <li><span className="font-semibold">Notes:</span> {user.notes || '—'}</li>
              </>
            ) : isBabysitter ? (
              <>
                <li><span className="font-semibold">Taux horaire:</span> {user.hourlyRate} TND</li>
                <li><span className="font-semibold">Expérience:</span> {user.experience} ans</li>
                <li><span className="font-semibold">Zone:</span> {user.zone}</li>
                <li><span className="font-semibold">Disponibilités:</span> {user.availability?.join(', ') || '—'}</li>
                <li><span className="font-semibold">Note moyenne:</span> ★ {user.rating || '—'} ({user.reviews?.length || 0} avis)</li>
              </>
            ) : (
              <li className="text-slate-500 dark:text-slate-400">Compte administrateur.</li>
            )}
          </ul>
        </div>
      </div>

      {isBabysitter && user.reviews?.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Derniers avis reçus</p>
          <div className="mt-3 space-y-2">
            {user.reviews.slice(-3).reverse().map((review, index) => (
              <div key={`${review.name}-${index}`} className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{review.name}</span>
                  <span className="font-semibold text-amber-700">★ {review.stars}</span>
                </div>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Réservations ({reservations.length})</p>
        {reservations.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Aucune réservation liée à ce compte.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {reservations.slice(0, 4).map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
                <span className="text-slate-700 dark:text-slate-200">
                  {user.role === 'parent' ? reservation.sitterName : reservation.parentName} • {reservation.date} {reservation.hour}
                </span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.15em] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{reservation.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {complaints.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Réclamations déposées ({complaints.length})</p>
          <div className="mt-3 space-y-2">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{complaint.subject}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.15em] ${complaint.status === 'Traité' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{complaint.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetailCard;