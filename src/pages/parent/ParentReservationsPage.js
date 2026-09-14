import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, List, CalendarDays, MessageCircle } from 'lucide-react';
import axios from 'axios';

import {
  getBabysitterProfiles,
  addBabysitterReview,
} from '../../utils/storage';

import { generateReservationReceipt } from '../../utils/generateReceipt';
import ReservationCalendar from '../../components/ReservationCalendar';
import ReservationChat from '../../components/ReservationChat';

const API_URL = 'http://localhost:8082/api/reservations';

function ParentReservationsPage() {
  const { t } = useTranslation();

  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }, []);

  const [allReservations, setAllReservations] = useState([]);
  const [sitters, setSitters] = useState(() => getBabysitterProfiles());

  const [form, setForm] = useState({
    sitterId: '',
    date: '',
    hour: '',
    duration: '3',
    address: '',
    paymentMethod: 'sur_place',
  });

  const [reviewDrafts, setReviewDrafts] = useState({});
  const [view, setView] = useState('list');
  const [openChatId, setOpenChatId] = useState(null);
  const [, setLoading] = useState(true);
  const [, setSubmitting] = useState(false);
  const [, setError] = useState('');

  const convertBackendStatus = useCallback((status) => {
    if (!status) return 'en attente';

    const normalized = String(status)
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
    const dateDebut = reservation.dateDebut
      ? new Date(reservation.dateDebut)
      : null;

    const dateFin = reservation.dateFin
      ? new Date(reservation.dateFin)
      : null;

    let date = '';
    let hour = '';
    let duration = '';

    if (
      dateDebut &&
      !Number.isNaN(dateDebut.getTime())
    ) {
      date = dateDebut.toISOString().slice(0, 10);
      hour = dateDebut.toTimeString().slice(0, 5);
    }

    if (
      dateDebut &&
      dateFin &&
      !Number.isNaN(dateDebut.getTime()) &&
      !Number.isNaN(dateFin.getTime())
    ) {
      const durationMs =
        dateFin.getTime() - dateDebut.getTime();

      const durationHours =
        durationMs / (1000 * 60 * 60);

      duration = `${durationHours}h`;
    }

    return {
      id: String(reservation.id),

      parentId: reservation.parent?.id,

      parentName: reservation.parent
        ? `${reservation.parent.prenom || ''} ${
            reservation.parent.nom || ''
          }`.trim()
        : '',

      parentEmail: reservation.parent?.email || '',

      sitterId: reservation.babysitter?.id,

      sitterName: reservation.babysitter
        ? `${reservation.babysitter.prenom || ''} ${
            reservation.babysitter.nom || ''
          }`.trim()
        : '',

      sitterEmail: reservation.babysitter?.email || '',

      date,
      hour,
      duration,

      dateDebut: reservation.dateDebut,
      dateFin: reservation.dateFin,

      address: reservation.adresse || '',

      paymentMethod:
        reservation.paymentMethod || 'sur_place',

      montant: reservation.montant,

      status: convertBackendStatus(
        reservation.statut
      ),

      review: reservation.review || null,
    };
  }, [convertBackendStatus]);

  /*
   * =========================================================
   * CHARGEMENT DES RESERVATIONS
   * =========================================================
   */

  const loadReservations = useCallback(async () => {
    if (!currentUser?.id) {
      setLoading(false);
      setError(
        "Impossible de récupérer l'identifiant du parent connecté."
      );
      return;
    }

    const numericParentId = Number(currentUser.id);

    if (
      !Number.isInteger(numericParentId) ||
      numericParentId <= 0
    ) {
      console.error(
        '❌ ID parent invalide :',
        currentUser.id
      );

      setLoading(false);
      setError(
        "L'identifiant du parent connecté est invalide."
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${API_URL}/parent/${numericParentId}`
      );

      const backendReservations =
        Array.isArray(response.data)
          ? response.data
          : [];

      const formattedReservations =
        backendReservations.map(formatReservation);

      setAllReservations(formattedReservations);

    } catch (err) {
      console.error(
        'Erreur lors du chargement des réservations :',
        err
      );

      const message =
        err.response?.data?.message ||
        'Impossible de charger les réservations.';

      setError(message);

    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, formatReservation]);

  /*
   * =========================================================
   * CHARGEMENT INITIAL
   * =========================================================
   */

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  /*
   * =========================================================
   * CHARGEMENT DES BABYSITTERS
   * =========================================================
   */

  useEffect(() => {
    setSitters(getBabysitterProfiles());
  }, []);

  /*
   * =========================================================
   * BABYSITTER PAR DEFAUT
   * =========================================================
   */

  useEffect(() => {
    if (!form.sitterId && sitters[0]?.id) {
      setForm((current) => ({
        ...current,
        sitterId: String(sitters[0].id),
      }));
    }
  }, [form.sitterId, sitters]);

  /*
   * =========================================================
   * RESERVATIONS DU PARENT CONNECTE
   * =========================================================
   */

  const reservations = useMemo(() => {
    if (!currentUser?.id) {
      return [];
    }

    return allReservations.filter(
      (item) =>
        String(item.parentId) ===
        String(currentUser.id)
    );
  }, [allReservations, currentUser]);

  /*
   * =========================================================
   * CREATION RESERVATION
   * =========================================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser?.id) {
      setError(
        "Impossible de créer la réservation : parent non connecté."
      );
      return;
    }

    const numericParentId =
      Number(currentUser.id);

    if (
      !Number.isInteger(numericParentId) ||
      numericParentId <= 0
    ) {
      setError(
        "L'identifiant du parent connecté est invalide."
      );
      return;
    }

    if (!form.sitterId) {
      setError(
        'Veuillez sélectionner un babysitter.'
      );
      return;
    }

    if (!form.date || !form.hour) {
      setError(
        'Veuillez sélectionner une date et une heure.'
      );
      return;
    }

    if (!form.address.trim()) {
      setError(
        "Veuillez saisir l'adresse de garde."
      );
      return;
    }

    if (!form.paymentMethod) {
      setError(
        'Veuillez sélectionner un moyen de paiement.'
      );
      return;
    }

    const sitter = sitters.find(
      (item) =>
        String(item.id) ===
        String(form.sitterId)
    );

    if (!sitter) {
      setError('Babysitter introuvable.');
      return;
    }

    const numericBabysitterId =
      Number(sitter.id);

    if (
      !Number.isInteger(numericBabysitterId) ||
      numericBabysitterId <= 0
    ) {
      setError(
        "L'identifiant du babysitter est invalide."
      );

      console.error(
        '❌ ID babysitter invalide :',
        sitter.id
      );

      return;
    }

    const duration = Number(form.duration);

    if (!duration || duration <= 0) {
      setError(
        'La durée doit être supérieure à 0.'
      );
      return;
    }

    const dateDebut =
      `${form.date}T${form.hour}:00`;

    const startDate = new Date(dateDebut);

    if (
      Number.isNaN(startDate.getTime())
    ) {
      setError(
        'Date ou heure invalide.'
      );
      return;
    }

    const endDate = new Date(
      startDate.getTime() +
        duration *
          60 *
          60 *
          1000
    );

    const pad = (value) =>
      String(value).padStart(2, '0');

    const dateFin =
      `${endDate.getFullYear()}-${pad(
        endDate.getMonth() + 1
      )}-${pad(endDate.getDate())}` +
      `T${pad(
        endDate.getHours()
      )}:${pad(
        endDate.getMinutes()
      )}:00`;

    const hourlyRate = Number(
      sitter.hourlyRate ??
        sitter.tarifHoraire ??
        35
    );

    const montant =
      hourlyRate * duration;

    /*
     * =======================================================
     * DONNEES ENVOYEES AU BACKEND
     * =======================================================
     *
     * Les noms correspondent aux attributs de Reservation.java
     * et de DemandeReservationRequest.java :
     *
     * parentId
     * babysitterId
     * dateDebut
     * dateFin
     * montant
     * adresse
     * paymentMethod
     */

    const requestData = {
      parentId: numericParentId,
      babysitterId: numericBabysitterId,
      dateDebut,
      dateFin,
      montant,
      adresse: form.address.trim(),
      paymentMethod: form.paymentMethod,
    };

    console.log(
      '📤 Réservation envoyée au backend :',
      requestData
    );

    try {
      setSubmitting(true);
      setError('');

      const response = await axios.post(
        API_URL,
        requestData,
        {
          headers: {
            'Content-Type':
              'application/json',
          },
        }
      );

      console.log(
        '✅ Réservation créée :',
        response.data
      );

      const createdReservation =
        formatReservation(
          response.data
        );

      setAllReservations(
        (current) => [
          createdReservation,
          ...current,
        ]
      );

      setForm((current) => ({
        ...current,
        date: '',
        hour: '',
        duration: '3',
        address: '',
        paymentMethod: 'sur_place',
      }));

      await loadReservations();

    } catch (err) {
      console.error(
        'Erreur création réservation :',
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Erreur lors de la création de la réservation.";

      setError(message);

    } finally {
      setSubmitting(false);
    }
  };

  /*
   * =========================================================
   * ANNULATION
   * =========================================================
   */

  const cancelReservation = async (id) => {
    try {
      setError('');

      const response =
        await axios.patch(
          `${API_URL}/${id}/annuler`
        );

      const updatedReservation =
        formatReservation(
          response.data
        );

      setAllReservations(
        (current) =>
          current.map((item) =>
            String(item.id) ===
            String(id)
              ? updatedReservation
              : item
          )
      );

    } catch (err) {
      console.error(
        'Erreur annulation réservation :',
        err
      );

      setError(
        err.response?.data?.message ||
          "Impossible d'annuler la réservation."
      );
    }
  };

  /*
   * =========================================================
   * TERMINER
   * =========================================================
   */

  const completeReservation = async (id) => {
    try {
      setError('');

      const response =
        await axios.patch(
          `${API_URL}/${id}/terminer`
        );

      const updatedReservation =
        formatReservation(
          response.data
        );

      setAllReservations(
        (current) =>
          current.map((item) =>
            String(item.id) ===
            String(id)
              ? updatedReservation
              : item
          )
      );

    } catch (err) {
      console.error(
        'Erreur terminaison réservation :',
        err
      );

      setError(
        err.response?.data?.message ||
          "Impossible de terminer la réservation."
      );
    }
  };

  /*
   * =========================================================
   * TELECHARGEMENT DU RECU
   * =========================================================
   */

  const handleDownloadReceipt = (
    reservation
  ) => {
    const sitter = sitters.find(
      (item) =>
        String(item.id) ===
          String(
            reservation.sitterId
          ) ||
        item.email ===
          reservation.sitterEmail
    );

    generateReservationReceipt(
      reservation,
      sitter
    );
  };

  /*
   * =========================================================
   * AVIS
   * =========================================================
   */

  const updateReviewDraft = (
    id,
    field,
    value
  ) => {
    setReviewDrafts(
      (current) => ({
        ...current,
        [id]: {
          ...(current[id] || {
            stars: 5,
            comment: '',
          }),
          [field]: value,
        },
      })
    );
  };

  const submitReview = (
    reservation
  ) => {
    const draft =
      reviewDrafts[
        reservation.id
      ] || {
        stars: 5,
        comment: '',
      };

    if (!draft.comment.trim()) {
      return;
    }

    const review = {
      name:
        currentUser?.name ||
        'Parent',

      stars:
        Number(draft.stars) || 5,

      comment:
        draft.comment.trim(),

      date:
        new Date()
          .toISOString()
          .slice(0, 10),
    };

    addBabysitterReview(
      reservation.sitterEmail,
      review
    );

    setAllReservations(
      (current) =>
        current.map((item) =>
          String(item.id) ===
          String(reservation.id)
            ? {
                ...item,
                review,
              }
            : item
        )
    );

    setReviewDrafts(
      (current) => {
        const next = {
          ...current,
        };

        delete next[
          reservation.id
        ];

        return next;
      }
    );
  };

  /*
   * =========================================================
   * RESERVATIONS EN ATTENTE
   * =========================================================
   */

  const pendingReservations =
    useMemo(
      () =>
        reservations.filter(
          (item) =>
            item.status ===
            'en attente'
        ),
      [reservations]
    );

  const statusBadgeClass = (status) => {
    if (status === 'terminée') {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    }

    if (status === 'confirmée') {
      return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300';
    }

    if (
      status === 'annulée' ||
      status === 'refusée'
    ) {
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    }

    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  };

  const statusLabel = (status) =>
    t(
      `parentSpace.reservations.status.${status}`,
      status
    );

  const renderReservationCard = (
    reservation
  ) => (
    <div
      key={reservation.id}
      className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-extrabold text-slate-900 dark:text-slate-100">
            {reservation.sitterName}
          </p>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {reservation.date} ·{' '}
            {reservation.hour} ·{' '}
            {reservation.duration}
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {reservation.address}
          </p>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {reservation.paymentMethod ===
            'carte'
              ? t(
                  'parentSpace.reservations.paymentCard'
                )
              : t(
                  'parentSpace.reservations.paymentOnSite'
                )}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusBadgeClass(
            reservation.status
          )}`}
        >
          {statusLabel(
            reservation.status
          )}
        </span>
      </div>

      {reservation.status ===
        'en attente' && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t(
              'parentSpace.reservations.waitingConfirmation'
            )}
          </p>

          <button
            type="button"
            onClick={() =>
              cancelReservation(
                reservation.id
              )
            }
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-600/40 dark:hover:bg-red-900/20"
          >
            {t(
              'parentSpace.reservations.cancel'
            )}
          </button>
        </div>
      )}

      {reservation.status ===
        'confirmée' && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              completeReservation(
                reservation.id
              )
            }
            className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600/40 dark:hover:bg-emerald-900/20"
          >
            {t(
              'parentSpace.reservations.markComplete'
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              cancelReservation(
                reservation.id
              )
            }
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-600/40 dark:hover:bg-red-900/20"
          >
            {t(
              'parentSpace.reservations.cancel'
            )}
          </button>
        </div>
      )}

      {reservation.status ===
        'refusée' && (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          {t(
            'parentSpace.reservations.refused'
          )}
        </p>
      )}

      {reservation.status ===
        'terminée' &&
        !reservation.review && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t(
                'parentSpace.reservations.leaveReview',
                {
                  name:
                    reservation.sitterName,
                }
              )}
            </p>

            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      updateReviewDraft(
                        reservation.id,
                        'stars',
                        star
                      )
                    }
                    className={`text-xl ${
                      (reviewDrafts[
                        reservation.id
                      ]?.stars || 5) >=
                      star
                        ? 'text-amber-500'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    ★
                  </button>
                )
              )}
            </div>

            <textarea
              value={
                reviewDrafts[
                  reservation.id
                ]?.comment || ''
              }
              onChange={(event) =>
                updateReviewDraft(
                  reservation.id,
                  'comment',
                  event.target.value
                )
              }
              rows="2"
              placeholder={t(
                'parentSpace.reservations.reviewPlaceholder'
              )}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            />

            <button
              type="button"
              onClick={() =>
                submitReview(
                  reservation
                )
              }
              className="mt-2 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-2 text-sm font-semibold text-white"
            >
              {t(
                'parentSpace.reservations.sendReview'
              )}
            </button>
          </div>
        )}

      {reservation.review && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {t(
            'parentSpace.reservations.yourReview'
          )}{' '}
          : ★ {reservation.review.stars} —{' '}
          {reservation.review.comment}
        </div>
      )}

      {reservation.status ===
        'terminée' && (
        <button
          type="button"
          onClick={() =>
            handleDownloadReceipt(
              reservation
            )
          }
          className="mt-3 flex items-center gap-2 rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 dark:border-amber-600/40 dark:text-amber-300 dark:hover:bg-amber-900/20"
        >
          <Download size={14} /> Télécharger
          le reçu (PDF)
        </button>
      )}

      <button
        type="button"
        onClick={() =>
          setOpenChatId(
            (current) =>
              current === reservation.id
                ? null
                : reservation.id
          )
        }
        className="mt-3 ml-2 flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <MessageCircle size={14} />{' '}
        {openChatId === reservation.id
          ? 'Fermer la discussion'
          : 'Discuter'}
      </button>

      {openChatId === reservation.id && (
        <ReservationChat
          reservationId={
            reservation.id
          }
          currentUser={currentUser}
          otherPartyName={
            reservation.sitterName
          }
        />
      )}
    </div>
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">
                {t(
                  'parentSpace.reservations.tag'
                )}
              </p>

              <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {t(
                  'parentSpace.reservations.title'
                )}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setView('list')
                }
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  view === 'list'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <List size={16} /> Liste
              </button>

              <button
                type="button"
                onClick={() =>
                  setView('calendar')
                }
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  view === 'calendar'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <CalendarDays size={16} />{' '}
                Calendrier
              </button>
            </div>
          </div>

          {view === 'list' ? (
            <div className="mt-6 space-y-4">
              {reservations.length ===
              0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t(
                    'parentSpace.reservations.empty'
                  )}
                </p>
              ) : (
                reservations.map(
                  (reservation) =>
                    renderReservationCard(
                      reservation
                    )
                )
              )}
            </div>
          ) : (
            <div className="mt-6">
              <ReservationCalendar
                reservations={
                  reservations
                }
                renderReservation={
                  renderReservationCard
                }
                nameField="sitterName"
              />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">
          {t(
            'parentSpace.reservations.newTag'
          )}
        </p>

        <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">
          {t(
            'parentSpace.reservations.newTitle'
          )}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t(
              'parentSpace.reservations.fields.sitter'
            )}

            <select
              value={form.sitterId}
              onChange={(event) =>
                setForm({
                  ...form,
                  sitterId:
                    event.target.value,
                })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
            >
              {sitters.map(
                (sitter) => (
                  <option
                    key={sitter.id}
                    value={sitter.id}
                  >
                    {sitter.name}
                  </option>
                )
              )}
            </select>
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t(
              'parentSpace.reservations.fields.date'
            )}

            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm({
                  ...form,
                  date: event.target.value,
                })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t(
              'parentSpace.reservations.fields.hour'
            )}

            <input
              type="time"
              value={form.hour}
              onChange={(event) =>
                setForm({
                  ...form,
                  hour: event.target.value,
                })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t(
              'parentSpace.reservations.fields.duration'
            )}

            <input
              type="number"
              min="1"
              max="8"
              value={form.duration}
              onChange={(event) =>
                setForm({
                  ...form,
                  duration:
                    event.target.value,
                })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t(
              'parentSpace.reservations.fields.address'
            )}

            <input
              type="text"
              value={form.address}
              onChange={(event) =>
                setForm({
                  ...form,
                  address:
                    event.target.value,
                })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              required
            />
          </label>

          <div className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t(
              'parentSpace.reservations.fields.payment'
            )}

            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                {
                  value: 'sur_place',
                  label: t(
                    'parentSpace.reservations.paymentOnSite'
                  ),
                },
                {
                  value: 'carte',
                  label: t(
                    'parentSpace.reservations.paymentCard'
                  ),
                },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    form.paymentMethod ===
                    option.value
                      ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-900/20 dark:text-orange-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={
                      option.value
                    }
                    checked={
                      form.paymentMethod ===
                      option.value
                    }
                    onChange={(event) =>
                      setForm({
                        ...form,
                        paymentMethod:
                          event.target
                            .value,
                      })
                    }
                    className="sr-only"
                  />

                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-3 text-sm font-semibold text-white"
          >
            {t(
              'parentSpace.reservations.save'
            )}
          </button>
        </form>

        <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p className="font-semibold">
            {t(
              'parentSpace.reservations.pendingCount',
              {
                count:
                  pendingReservations.length,
              }
            )}
          </p>

          <p className="mt-2">
            {t(
              'parentSpace.reservations.pendingNote'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ParentReservationsPage;