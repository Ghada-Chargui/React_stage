import { useEffect, useMemo, useState } from 'react';
import { getBabysitterProfiles, addBabysitterReview, STORAGE_CHANGE_EVENT_NAME } from '../../utils/storage';

function ParentReservationsPage() {
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [reservations, setReservations] = useState([]);
  const [sitters, setSitters] = useState(() => getBabysitterProfiles());
  const [form, setForm] = useState({ sitterId: '', date: '', hour: '', duration: '3', address: '', paymentMethod: 'sur_place' });
  const [reviewDrafts, setReviewDrafts] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('confiSitParentReservations');
    if (stored) {
      setReservations(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const syncSitters = () => setSitters(getBabysitterProfiles());
    syncSitters();
    window.addEventListener(STORAGE_CHANGE_EVENT_NAME, syncSitters);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT_NAME, syncSitters);
  }, []);

  useEffect(() => {
    if (!form.sitterId && sitters[0]?.id) {
      setForm((current) => ({ ...current, sitterId: sitters[0].id }));
    }
  }, [form.sitterId, sitters]);

  useEffect(() => {
    localStorage.setItem('confiSitParentReservations', JSON.stringify(reservations));
  }, [reservations]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const sitter = sitters.find((item) => item.id === form.sitterId);
    const nextReservation = {
      id: Date.now().toString(),
      sitterId: sitter?.id,
      sitterName: sitter?.name || 'Babysitter',
      sitterEmail: sitter?.email || '',
      date: form.date,
      hour: form.hour,
      duration: `${form.duration}h`,
      address: form.address,
      paymentMethod: form.paymentMethod,
      status: 'en attente',
    };
    setReservations((current) => [nextReservation, ...current]);
    setForm({ ...form, date: '', hour: '', duration: '3', address: '' });
  };

  const cancelReservation = (id) => {
    setReservations((current) => current.map((item) => (item.id === id ? { ...item, status: 'annulée' } : item)));
  };

  const completeReservation = (id) => {
    setReservations((current) => current.map((item) => (item.id === id ? { ...item, status: 'terminée' } : item)));
  };

  const updateReviewDraft = (id, field, value) => {
    setReviewDrafts((current) => ({ ...current, [id]: { ...(current[id] || { stars: 5, comment: '' }), [field]: value } }));
  };

  const submitReview = (reservation) => {
    const draft = reviewDrafts[reservation.id] || { stars: 5, comment: '' };
    if (!draft.comment.trim()) return;

    const review = {
      name: currentUser?.name || 'Parent',
      stars: Number(draft.stars) || 5,
      comment: draft.comment.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    addBabysitterReview(reservation.sitterEmail, review);
    setReservations((current) => current.map((item) => (item.id === reservation.id ? { ...item, review } : item)));
    setReviewDrafts((current) => {
      const next = { ...current };
      delete next[reservation.id];
      return next;
    });
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
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{reservation.paymentMethod === 'carte' ? 'Paiement par carte' : 'Paiement sur place'}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                    reservation.status === 'terminée' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : reservation.status === 'annulée' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}>{reservation.status}</span>
                </div>
                {reservation.status === 'en attente' && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" onClick={() => completeReservation(reservation.id)} className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600/40 dark:hover:bg-emerald-900/20">Marquer comme terminée</button>
                    <button type="button" onClick={() => cancelReservation(reservation.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-600/40 dark:hover:bg-red-900/20">Annuler</button>
                  </div>
                )}
                {reservation.status === 'terminée' && !reservation.review && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Donner un avis sur {reservation.sitterName}</p>
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => updateReviewDraft(reservation.id, 'stars', star)} className={`text-xl ${(reviewDrafts[reservation.id]?.stars || 5) >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}>★</button>
                      ))}
                    </div>
                    <textarea
                      value={reviewDrafts[reservation.id]?.comment || ''}
                      onChange={(event) => updateReviewDraft(reservation.id, 'comment', event.target.value)}
                      rows="2"
                      placeholder="Votre expérience avec cette babysitter..."
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                    />
                    <button type="button" onClick={() => submitReview(reservation)} className="mt-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-2 text-sm font-semibold text-white">Envoyer mon avis</button>
                  </div>
                )}
                {reservation.review && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Votre avis : ★ {reservation.review.stars} — {reservation.review.comment}
                  </div>
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
          <div className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Mode de paiement
            <div className="mt-2 grid grid-cols-2 gap-3">
              {[{ value: 'sur_place', label: 'Sur place' }, { value: 'carte', label: 'Par carte' }].map((option) => (
                <label key={option.value} className={`flex cursor-pointer items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold ${form.paymentMethod === option.value ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-900/20 dark:text-orange-300' : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                  <input type="radio" name="paymentMethod" value={option.value} checked={form.paymentMethod === option.value} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })} className="sr-only" />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
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