import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, MapPin, Clock3, MessageSquare, DollarSign } from 'lucide-react';
import { sitters } from '../data/mockSitters';

function SitterProfilePage() {
  const { id } = useParams();
  const sitter = useMemo(() => sitters.find((item) => item.id === id), [id]);

  if (!sitter) {
    return (
      <div className="rounded-[36px] bg-white p-10 shadow-soft text-center">
        <p className="text-lg font-semibold text-slate-900">Baby-sitter non trouvée</p>
        <Link to="/recherche" className="mt-6 inline-flex rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-amber-600">Retour à la recherche</Link>
      </div>
    );
  }

  return (
    <section className="space-y-10 py-10 lg:py-16">
      <div className="flex flex-col gap-6 rounded-[36px] bg-white p-8 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link to="/recherche" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-500">
            <ArrowLeft size={18} /> Retour à la recherche
          </Link>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <img src={sitter.image} alt={sitter.name} className="h-36 w-36 rounded-[30px] object-cover shadow-soft" />
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold text-slate-900">{sitter.name}</h1>
                <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">{sitter.rating.toFixed(1)} ★</span>
              </div>
              <p className="text-slate-600">{sitter.bio}</p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2"><MapPin size={16} /> {sitter.location}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2"><Clock3 size={16} /> {sitter.experience} ans d’expérience</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2"><DollarSign size={16} /> {sitter.rate} TND / h</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[32px] bg-amber-50 p-6 text-slate-700 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">Disponibilités</p>
          <div className="mt-4 grid gap-3">
            {sitter.availability.map((slot) => (
              <div key={slot} className="rounded-3xl bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm">{slot}</div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600">Contacter cette baby-sitter</button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8 rounded-[36px] bg-white p-8 shadow-soft">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">À propos</h2>
            <p className="text-slate-600">{sitter.bio}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-500">Langues</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700">
                {sitter.languages.map((language) => (
                  <span key={language} className="rounded-full bg-white px-3 py-2 shadow-sm">{language}</span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm font-semibold text-slate-500">Services</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {sitter.services.map((service) => (
                  <li key={service} className="flex items-center gap-2">• {service}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">Avis des parents</h3>
            <div className="space-y-4">
              {sitter.reviews.map((review) => (
                <div key={review.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{review.name}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">{review.stars} ★</span>
                  </div>
                  <p className="mt-3 text-slate-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-8 rounded-[36px] bg-white p-8 shadow-soft">
          <div className="rounded-3xl bg-slate-50 p-6">
            <div className="flex items-center gap-3 text-slate-700">
              <CalendarDays size={20} />
              <span className="font-semibold">Réservation simple</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">Choisissez une date, un créneau et échangez en toute transparence avec la baby-sitter.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <div className="flex items-center gap-3 text-slate-700">
              <MessageSquare size={20} />
              <span className="font-semibold">Questions courantes</span>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Profil vérifié et recommandations visibles.</li>
              <li>Pas de connexion externe nécessaire pour cette démo.</li>
              <li>La structure est prête pour intégrer un backend plus tard.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default SitterProfilePage;
