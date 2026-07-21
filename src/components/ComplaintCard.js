function ComplaintCard({ complaint, onSelect }) {
  const priority = complaint.priority || 'Normale';

  return (
    <button type="button" onClick={onSelect} className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{complaint.userName}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{complaint.subject}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${complaint.status === 'Traité' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
            {complaint.status}
          </span>
          {priority === 'Urgente' && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">Urgente</span>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{complaint.message}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{complaint.date}</p>
    </button>
  );
}

export default ComplaintCard;