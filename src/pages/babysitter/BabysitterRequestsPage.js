import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { List, CalendarDays, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { STORAGE_CHANGE_EVENT_NAME } from '../../utils/storage';
import ReservationCalendar from '../../components/ReservationCalendar';
import ReservationChat from '../../components/ReservationChat';

const API_URL = 'http://localhost:8082/api/reservations';

function BabysitterRequestsPage() {
  const { t } = useTranslation();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }, []);

  const [allReservations, setAllReservations] = useState([]);
  const [view, setView] = useState('list');
  const [openChatId, setOpenChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const convertBackendStatus = useCallback((status) => {
    const normalized = String(status || '')
      .trim()
      .toLowerCase();

    switch (normalized) {
      case 'confirmée':
      case 'confirmee':
        return 'confirmée';
      case 'refusée':
      case 'refusee':
        return 'refusée';
      case 'annulée':
      case 'annulee':
        return 'annulée';
      case 'terminée':
      case 'terminee':
        return 'terminée';
      case 'en attente':
      case 'en_attente':
      case 'en-attente':
      default:
        return 'en attente';
    }
  }, []);

  const formatReservation = useCallback((reservation) => {
    const dateDebut = reservation.dateDebut ? new Date(reservation.dateDebut) : null;
    const dateFin = reservation.dateFin ? new Date(reservation.dateFin) : null;
    const validStart = dateDebut && !Number.isNaN(dateDebut.getTime());
    const validEnd = dateFin && !Number.isNaN(dateFin.getTime());

    let date = '';
    let hour = '';
    let duration = '';

    if (validStart) {
      date = dateDebut.toISOString().slice(0, 10);
      hour = dateDebut.toTimeString().slice(0, 5);
    }

    if (validStart && validEnd) {
      duration = `${(dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60)}h`;
    }

    return {
      id: String(reservation.id),
      parentId: reservation.parent?.id,
      parentName: reservation.parent
        ? `${reservation.parent.prenom || ''} ${reservation.parent.nom || ''}`.trim()
        : '',
      parentEmail: reservation.parent?.email || '',
      sitterId: reservation.babysitter?.id,
      sitterEmail: reservation.babysitter?.email || '',
      date,
      hour,
      duration,
      dateDebut: reservation.dateDebut,
      dateFin: reservation.dateFin,
      montant: reservation.montant,
      status: convertBackendStatus(reservation.statut),
      address: reservation.address || '',
      paymentMethod: reservation.paymentMethod || 'sur_place',
    };
  }, [convertBackendStatus]);

  const loadReservations = useCallback(async () => {
    const numericBabysitterId = Number(currentUser?.id);

    if (!Number.isInteger(numericBabysitterId) || numericBabysitterId <= 0) {
      setLoading(false);
      setError("L'identifiant du babysitter connecté est invalide.");
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/babysitter/${numericBabysitterId}`);
      const backendReservations = Array.isArray(response.data) ? response.data : [];
      setAllReservations(backendReservations.map(formatReservation));
    } catch (requestError) {
      console.error('Erreur lors du chargement des demandes :', requestError);
      setError(requestError.response?.data?.message || 'Impossible de charger les demandes.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, formatReservation]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  useEffect(() => {
    window.addEventListener(STORAGE_CHANGE_EVENT_NAME, loadReservations);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT_NAME, loadReservations);
  }, [loadReservations]);

  const requests = useMemo(
    () => allReservations,
    [allReservations]
  );

  const updateStatus = async (id, action) => {
    try {
      setError('');

      const response = await axios.patch(`${API_URL}/${id}/${action}`);
      const updatedReservation = formatReservation(response.data);

      setAllReservations((current) => current.map((item) => (
        String(item.id) === String(id) ? updatedReservation : item
      )));
    } catch (requestError) {
      console.error('Erreur lors de la mise à jour de la demande :', requestError);
      setError(requestError.response?.data?.message || 'Impossible de mettre à jour la demande.');
    }
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
          <button type="button" onClick={() => updateStatus(request.id, 'confirmer')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">{t('babysitterSpace.requests.accept')}</button>
          <button type="button" onClick={() => updateStatus(request.id, 'refuser')} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">{t('babysitterSpace.requests.decline')}</button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpenChatId((current) => (current === request.id ? null : request.id))}
        className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <MessageCircle size={14} /> {openChatId === request.id ? 'Fermer la discussion' : 'Discuter'}
      </button>
      {openChatId === request.id && (
        <ReservationChat
          reservationId={request.id}
          currentUser={currentUser}
          otherPartyName={request.parentName}
        />
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
          {loading ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Chargement des demandes...</p>
          ) : error ? (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          ) : requests.length === 0 ? (
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