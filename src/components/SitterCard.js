import { Link } from 'react-router-dom';
import { MapPin, Star, Clock3, DollarSign } from 'lucide-react';

function SitterCard({ sitter }) {
  return (
    <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {sitter.image ? (
          <img src={sitter.image} alt={sitter.name} className="h-32 w-32 flex-none rounded-3xl object-cover" />
        ) : (
          <div className="flex h-32 w-32 flex-none items-center justify-center rounded-3xl bg-amber-50">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="22" r="10" fill="#FFDCA8" />
              <path d="M12 52c6-8 20-10 20-10s14 2 20 10c-8 8-20 8-20 8s-12 0-20-8z" fill="#BFEAEA" />
            </svg>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{sitter.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{sitter.location}</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">{sitter.rating.toFixed(1)} ★</span>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div className="flex items-center gap-2"><MapPin size={16} /> {sitter.location}</div>
            <div className="flex items-center gap-2"><DollarSign size={16} /> {sitter.rate} TND / h</div>
            <div className="flex items-center gap-2"><Clock3 size={16} /> {sitter.experience} ans d’expérience</div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
        {sitter.specialties.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1">{tag}</span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          to={`/profil/${sitter.id}`}
          className="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-amber-200 transition hover:bg-amber-600"
        >
          Voir le profil
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <Star size={16} className="text-amber-500" /> {sitter.reviews.length} avis
        </div>
      </div>
    </article>
  );
}

export default SitterCard;
