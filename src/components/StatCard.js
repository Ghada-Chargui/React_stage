import { ArrowUpRight } from 'lucide-react';

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
          {detail ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{detail}</p> : null}
        </div>
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-600">
        <ArrowUpRight size={16} />
        <span>Vue mise à jour</span>
      </div>
    </div>
  );
}

export default StatCard;
