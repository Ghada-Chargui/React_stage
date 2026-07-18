import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, Clock3, DollarSign } from 'lucide-react';

function SitterCard({ sitter }) {
  const { t } = useTranslation();
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(249,115,22,0.12)] hover:scale-[1.01] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {sitter.image ? (
          <img src={sitter.image} alt={sitter.name} className="h-36 w-36 flex-none rounded-3xl object-cover" />
        ) : (
          <div className="flex h-36 w-36 flex-none items-center justify-center rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <svg width="68" height="68" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="22" r="10" fill="#FFDCA8" />
              <path d="M12 52c6-8 20-10 20-10s14 2 20 10c-8 8-20 8-20 8s-12 0-20-8z" fill="#BFEAEA" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{sitter.name}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sitter.location}</p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-1.5 text-sm font-extrabold text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300">{sitter.rating.toFixed(1)} ★</span>
          </div>
          <div className="mt-5 grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <div className="flex items-center gap-2"><MapPin size={18} /> {sitter.location}</div>
            <div className="flex items-center gap-2"><DollarSign size={18} /> {t('search.sitterCard.rate', { rate: sitter.rate })}</div>
            <div className="flex items-center gap-2"><Clock3 size={18} /> {t('search.sitterCard.experience', { experience: sitter.experience })}</div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2.5 text-xs text-slate-600 dark:text-slate-400">
        {sitter.specialties.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-4 py-1.5 font-medium dark:bg-slate-800">{tag}</span>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/profil/${sitter.id}`}
          className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(249,115,22,0.35)]"
        >
          {t('search.sitterCard.viewProfile')}
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2.5 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <Star size={18} className="text-amber-500" /> {t('search.sitterCard.reviews', { count: sitter.reviews.length })}
        </div>
      </div>
    </article>
  );
}

export default SitterCard;
