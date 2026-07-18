import { useEffect, useMemo, useState } from 'react';
import { sitters } from '../../data/mockSitters';

function ParentReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({ sitterId: sitters[0]?.id || '', date: '', hour: '', duration: '3', address: '' });

  useEffect(() => {
    const stored = localStorage.getItem('confiSitParentReservations');
    if (stored) {
      setReservations(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('confiSitParentReservations', JSON.stringify(reservations));
  }, [reservations]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const sitter = sitters.find((item) => item.id === form.sitterId);
    const nextReservation = {
      id: Date.now().toString(),
      sitterName: sitter?.name || 'Babysitter',
      date: form.date,
      hour: form.hour,
      duration: `${form.duration}h`,
      address: form.address,
      status: 'en attente',
    };
    setReservations((current) => [nextReservation, ...current]);
    setForm({ ...form, date: '', hour: '', duration: '3', address: '' });
  };

  const cancelReservation = (id) => {
    setReservations((current) => current.filter((item) => item.id !== id));
  };

  const pendingReservations = useMemo(() => reservations.filter((item) => item.status === 'en attente'), [reservations]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Réservations</p>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Votre planning de garde</h2>
          <div className="mt-6 space-y-4">
            {reservations.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Aucune réservation pour le moment.</p>
            ) : reservations.map((reservation) => (
              <div key={reservation.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-slate-100">{reservation.sitterName}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reservation.date} • {reservation.hour} • {reservation.duration}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{reservation.address}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{reservation.status}</span>
                </div>
                {reservation.status === 'en attente' && (
                  <button type="button" onClick={() => cancelReservation(reservation.id)} className="mt-4 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-600/40 dark:hover:bg-red-900/20">Annuler</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Nouvelle réservation</p>
        <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">Planifier une garde</h3>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Babysitter
            <select value={form.sitterId} onChange={(event) => setForm({ ...form, sitterId: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              {sitters.map((sitter) => <option key={sitter.id} value={sitter.id}>{sitter.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Date
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Heure
            <input type="time" value={form.hour} onChange={(event) => setForm({ ...form, hour: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Durée (heures)
            <input type="number" min="1" max="8" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Adresse
            <input type="text" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
          </label>
          <button type="submit" className="w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-3 text-sm font-semibold text-white">Enregistrer la réservation</button>
        </form>
        <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p className="font-semibold">En attente : {pendingReservations.length}</p>
          <p className="mt-2">Les réservations sont stockées dans le navigateur pour cette démo.</p>
        </div>
      </div>
    </div>
  );
}

export default ParentReservationsPage;
