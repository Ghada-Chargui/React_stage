import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquareWarning } from 'lucide-react';
import apiServiceReclamation from '../../services/apiServiceReclamation';
import { notifyComplaintReceived, notifyAdminOfComplaint } from '../../utils/emailNotifications';
import { detectComplaintPriority } from '../../utils/complaintPriority';

function BabysitterComplaintPage() {
  const { t } = useTranslation();

  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Erreur lors de la lecture de confiSitUser :', error);
      return null;
    }
  }, []);

  const [form, setForm] = useState({
    subject: '',
    message: '',
  });

  const [myComplaints, setMyComplaints] = useState([]);
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  /*
   * Transformation backend -> frontend
   */
  const formatComplaint = (complaint) => {
    return {
      id: complaint.id,
      userId: complaint.user?.id,
      userName:
        `${complaint.user?.prenom || ''} ${complaint.user?.nom || ''}`.trim() ||
        currentUser?.name ||
        'Babysitter',
      subject: complaint.sujet,
      message: complaint.description,
      date: complaint.dateCreation,
      status: complaint.statut,
      priority: complaint.urgence ? 'Urgente' : 'Normale',
      note: '',
      messages: [],
      resolvedAt: complaint.statut === 'Traité' ? complaint.dateCreation : null,
    };
  };

  /*
   * Récupération des réclamations de la babysitter
   */
  const loadComplaints = async () => {
    if (!currentUser?.id) {
      console.error('Utilisateur connecté introuvable.');
      return;
    }

    try {
      setLoading(true);

      const data = await apiServiceReclamation.listerPourUtilisateur(
        currentUser.id
      );

      const formattedComplaints = Array.isArray(data)
        ? data.map(formatComplaint)
        : [];

      setMyComplaints(formattedComplaints);
    } catch (error) {
      console.error(
        'Erreur lors du chargement des réclamations :',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [currentUser?.id]);

  const livePriority = useMemo(
    () => detectComplaintPriority(form.subject, form.message),
    [form.subject, form.message]
  );

  /*
   * Création de la réclamation dans MySQL
   * via Spring Boot.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.subject.trim() || !form.message.trim()) {
      return;
    }

    if (!currentUser?.id) {
      console.error(
        'Impossible d’envoyer la réclamation : utilisateur non connecté.'
      );
      return;
    }

    try {
      setLoading(true);
      setConfirmation(null);

      const createdComplaint =
        await apiServiceReclamation.envoyerReclamation(
          currentUser.id,
          form.subject.trim(),
          form.message.trim()
        );

      const formattedComplaint =
        formatComplaint(createdComplaint);

      setMyComplaints((previous) => [
        formattedComplaint,
        ...previous,
      ]);

      setConfirmation(
        t('parentSpace.complaint.confirmation')
      );

      setForm({
        subject: '',
        message: '',
      });

      /*
       * Notifications email
       */
      notifyComplaintReceived(
        formattedComplaint,
        currentUser?.email
      );

      notifyAdminOfComplaint(formattedComplaint);
    } catch (error) {
      console.error(
        'Erreur lors de la création de la réclamation :',
        error
      );

      setConfirmation(
        'Une erreur est survenue lors de l’envoi de votre réclamation.'
      );
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status) =>
    status === 'Traité'
      ? t('parentSpace.complaint.status.done')
      : t('parentSpace.complaint.status.pending');

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">

      {/* =========================
          FORMULAIRE
      ========================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <div className="flex items-center gap-3">

          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            <MessageSquareWarning size={20} />
          </span>

          <div>

            <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">
              {t('parentSpace.complaint.tag')}
            </p>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('parentSpace.complaint.title')}
            </h2>

          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          {t('babysitterSpace.complaint.description')}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">

            {t('parentSpace.complaint.fields.subject')}

            <input
              value={form.subject}
              onChange={(event) =>
                setForm({
                  ...form,
                  subject: event.target.value,
                })
              }
              placeholder={t(
                'babysitterSpace.complaint.subjectPlaceholder'
              )}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              required
            />

          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">

            {t('parentSpace.complaint.fields.message')}

            <textarea
              value={form.message}
              onChange={(event) =>
                setForm({
                  ...form,
                  message: event.target.value,
                })
              }
              rows="5"
              placeholder={t(
                'parentSpace.complaint.fields.messagePlaceholder'
              )}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800"
              required
            />

          </label>

          {livePriority.priority === 'Urgente' &&
            (form.subject || form.message) && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-900/20 dark:text-red-300">
                ⚠️ Votre réclamation a été identifiée comme urgente et sera traitée en priorité.
              </div>
            )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? 'Envoi en cours...'
              : t('parentSpace.complaint.send')}
          </button>

        </form>

        {confirmation && (
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            {confirmation}
          </div>
        )}

      </div>

      {/* =========================
          HISTORIQUE
      ========================== */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">

        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">
          {t('parentSpace.complaint.historyTag')}
        </p>

        <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">
          {t('parentSpace.complaint.historyTitle')}
        </h3>

        <div className="mt-6 space-y-4">

          {loading && myComplaints.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chargement...
            </p>
          ) : myComplaints.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('parentSpace.complaint.empty')}
            </p>
          ) : (
            myComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="font-extrabold text-slate-900 dark:text-slate-100">
                      {complaint.subject}
                    </p>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {complaint.message}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {complaint.date}
                    </p>

                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        complaint.status === 'Traité'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}
                    >
                      {statusLabel(complaint.status)}
                    </span>

                    {complaint.priority === 'Urgente' && (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        Urgente
                      </span>
                    )}

                  </div>

                </div>

                {(complaint.messages || [])
                  .filter((msg) => msg.author === 'Support')
                  .map((msg, index) => (
                    <p
                      key={index}
                      className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {t('parentSpace.complaint.supportReply')} :{' '}
                      {msg.text}
                    </p>
                  ))}

              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}

export default BabysitterComplaintPage;