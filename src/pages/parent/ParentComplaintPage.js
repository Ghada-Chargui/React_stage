import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquareWarning } from 'lucide-react';
import { getAdminComplaints, saveAdminComplaints } from '../../data/adminMockData';

function ParentComplaintPage() {
  const { t } = useTranslation();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [form, setForm] = useState({ subject: '', message: '' });
  const [myComplaints, setMyComplaints] = useState([]);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const all = getAdminComplaints();
    setMyComplaints(all.filter((item) => item.userName === currentUser?.name));
  }, [currentUser]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.subject || !form.message) return;

    const all = getAdminComplaints();
    const nextComplaint = {
      id: `complaint-${Date.now()}`,
      userName: currentUser?.name || 'Parent',
      subject: form.subject,
      message: form.message,
      date: new Date().toISOString().slice(0, 10),
      status: 'En attente',
      priority: 'Normale',
      note: '',
      messages: [{ author: currentUser?.name || 'Parent', text: form.message, date: new Date().toISOString().slice(0, 10) }],
      resolvedAt: null,
    };
    const nextAll = [nextComplaint, ...all];
    saveAdminComplaints(nextAll);
    setMyComplaints(nextAll.filter((item) => item.userName === currentUser?.name));
    setConfirmation(t('parentSpace.complaint.confirmation'));
    setForm({ subject: '', message: '' });
  };

  const statusLabel = (status) => (status === 'Traité' ? t('parentSpace.complaint.status.done') : t('parentSpace.complaint.status.pending'));

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            <MessageSquareWarning size={20} />
          </span>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{t('parentSpace.complaint.tag')}</p>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('parentSpace.complaint.title')}</h2>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{t('parentSpace.complaint.description')}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.complaint.fields.subject')}
            <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder={t('parentSpace.complaint.fields.subjectPlaceholder')} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.complaint.fields.message')}
            <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} rows="5" placeholder={t('parentSpace.complaint.fields.messagePlaceholder')} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
          </label>
          <button type="submit" className="w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-sm font-semibold text-white">{t('parentSpace.complaint.send')}</button>
        </form>
        {confirmation && (
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">{confirmation}</div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{t('parentSpace.complaint.historyTag')}</p>
        <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">{t('parentSpace.complaint.historyTitle')}</h3>
        <div className="mt-6 space-y-4">
          {myComplaints.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('parentSpace.complaint.empty')}</p>
          ) : myComplaints.map((complaint) => (
            <div key={complaint.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-slate-100">{complaint.subject}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{complaint.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{complaint.date}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${complaint.status === 'Traité' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                  {statusLabel(complaint.status)}
                </span>
              </div>
              {complaint.note && <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t('parentSpace.complaint.supportReply')} : {complaint.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ParentComplaintPage;