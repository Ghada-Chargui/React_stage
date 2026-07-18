import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Clock3, MessageSquare, DollarSign } from 'lucide-react';
import { sitters } from '../data/mockSitters';

function SitterProfilePage() {
  const { id } = useParams();
  const sitter = useMemo(() => sitters.find((item) => item.id === id), [id]);

  if (!sitter) {
    return (
      <div className="rounded-3xl bg-white p-12 shadow-[0_25px_70px_rgba(15,23,42,0.08)] text-center dark:bg-slate-900 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Baby-sitter non trouvée</p>
        <Link to="/recherche" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(249,115,22,0.35)]">
          <ArrowLeft size={18} /> Retour à la recherche
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-12 py-16 lg:py-24">
      <div className="flex flex-col gap-8 rounded-3xl bg-gradient-to-br from-white to-amber-50 p-9 shadow-[0_25px_70px_rgba(249,115,22,0.08)] lg:flex-row lg:items-center lg:justify-between dark:from-slate-900 dark:to-amber-900/20 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <div>
          <Link to="/recherche" className="inline-flex items-center gap-2 text-sm font-extrabold text-amber-600 transition-all duration-300 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
            <ArrowLeft size={20} /> Retour à la recherche
          </Link>
          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
            <img src={sitter.image} alt={sitter.name} className="h-40 w-40 rounded-3xl object-cover shadow-[0_15px_40px_rgba(15,23,42,0.1)]" />
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{sitter.name}</h1>
                <span className="rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-5 py-2.5 text-sm font-extrabold text-amber-700 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-300">{sitter.rating.toFixed(1)} ★</span>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300">{sitter.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 shadow-sm dark:bg-slate-800"><MapPin size={18} /> {sitter.location}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 shadow-sm dark:bg-slate-800"><Clock3 size={18} /> {sitter.experience} ans d’expérience</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 shadow-sm dark:bg-slate-800"><DollarSign size={18} /> {sitter.rate} TND / h</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-7 text-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.05)] dark:bg-slate-900 dark:text-slate-200 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-amber-600 dark:text-amber-400">Disponibilités</p>
          <div className="mt-5 grid gap-4">
            {sitter.availability.map((slot) => (
              <div key={slot} className="rounded-3xl bg-slate-50 px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-300 hover:bg-amber-50 hover:shadow-md dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-900/30">{slot}</div>
            ))}
          </div>
          <button className="mt-7 w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(249,115,22,0.35)]">Contacter cette baby-sitter</button>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10 rounded-3xl bg-white p-9 shadow-[0_25px_70px_rgba(15,23,42,0.08)] dark:bg-slate-900 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
          <div className="space-y-5">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">À propos</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">{sitter.bio}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-amber-50 p-7 dark:from-slate-800 dark:to-amber-900/20">
              <p className="text-sm font-extrabold text-slate-500 dark:text-slate-400">Langues</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700 dark:text-slate-200">
                {sitter.languages.map((language) => (
                  <span key={language} className="rounded-full bg-white px-4 py-2.5 shadow-sm font-medium dark:bg-slate-800">{language}</span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-amber-50 p-7 dark:from-slate-800 dark:to-amber-900/20">
              <p className="text-sm font-extrabold text-slate-500 dark:text-slate-400">Services</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                {sitter.services.map((service) => (
                  <li key={service} className="flex items-center gap-2 font-medium">• {service}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-5">
            <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Avis des parents</h3>
            <div className="space-y-5">
              {sitter.reviews.map((review) => (
                <div key={review.name} className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-extrabold text-slate-900 dark:text-slate-100">{review.name}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-extrabold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{review.stars} ★</span>
                  </div>
                  <p className="mt-4 text-slate-600 dark:text-slate-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-8 rounded-3xl bg-white p-9 shadow-[0_25px_70px_rgba(15,23,42,0.08)] dark:bg-slate-900 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
          <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-amber-50 p-7 dark:from-slate-800 dark:to-amber-900/20">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <CalendarDays size={22} />
              <span className="font-extrabold">Réservation simple</span>
            </div>
            <p className="mt-5 text-sm text-slate-600 dark:text-slate-400">Choisissez une date, un créneau et échangez en toute transparence avec la baby-sitter.</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-amber-50 p-7 dark:from-slate-800 dark:to-amber-900/20">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
              <MessageSquare size={22} />
              <span className="font-extrabold">Questions courantes</span>
            </div>
            <ul className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="font-medium">Profil vérifié et recommandations visibles.</li>
              <li className="font-medium">Pas de connexion externe nécessaire pour cette démo.</li>
              <li className="font-medium">La structure est prête pour intégrer un backend plus tard.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default SitterProfilePage;
