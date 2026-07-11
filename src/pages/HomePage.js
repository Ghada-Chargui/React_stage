import { Link } from 'react-router-dom';
import { Clock3, ShieldCheck, Smile, Sparkles } from 'lucide-react';

function HomePage() {
  return (
    <section className="space-y-16 py-10 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Babysitting en Tunisie</span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Confi&apos;Sit, la plateforme de baby-sitters fiable pour les parents tunisiens.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Trouvez rapidement une baby-sitter expérimentée, locale et disponible, avec des profils clairs, des avis vérifiés et un accompagnement bienveillant.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link to="/recherche" className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-amber-600">
              Rechercher une baby-sitter
            </Link>
            <Link to="/comment-ca-marche" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-amber-300 hover:text-slate-900">
              Comment ça marche ?
            </Link>
          </div>
        </div>
        <div className="rounded-[40px] bg-gradient-to-br from-amber-100 via-white to-slate-100 p-8 shadow-soft">
          <div className="rounded-[36px] bg-white p-8 shadow-md">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Confi&apos;Sit en chiffres</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6 text-center">
                <p className="text-3xl font-semibold text-amber-600">96%</p>
                <p className="mt-2 text-sm text-slate-600">Parents satisfaits</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6 text-center">
                <p className="text-3xl font-semibold text-slate-600">120+</p>
                <p className="mt-2 text-sm text-slate-600">Baby-sitters vérifiées</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6 text-center">
                <p className="text-3xl font-semibold text-slate-600">24h</p>
                <p className="mt-2 text-sm text-slate-600">Mise en relation rapide</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6 text-center">
                <p className="text-3xl font-semibold text-amber-600">100%</p>
                <p className="mt-2 text-sm text-slate-600">Profils complets et transparents</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-base font-semibold uppercase tracking-[0.28em] text-amber-600">Pourquoi Confi&apos;Sit ?</p>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Des profils sécurisés, un service pensé pour les parents.</h2>
          <p className="max-w-xl text-slate-600">Chaque baby-sitter passe par une sélection rigoureuse et affiche des avis, des tarifs et des disponibilités clairs. Idéal pour organiser des gardes sereines à Tunis, La Marsa, Sidi Bou Saïd et partout en Tunisie.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-100 text-amber-600">
                <ShieldCheck size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Sécurité renforcée</h3>
              <p className="mt-2 text-sm text-slate-600">Profils validés et informations de garde transparentes.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-100 text-amber-600">
                <Clock3 size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Réservation flexible</h3>
              <p className="mt-2 text-sm text-slate-600">Filtres par disponibilité, quartier, tarif et expérience.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-100 text-amber-600">
                <Smile size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Relation de confiance</h3>
              <p className="mt-2 text-sm text-slate-600">Une plateforme pensée pour les familles exigeantes et rassurantes.</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-100 text-amber-600">
                <Sparkles size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Expérience chaleureuse</h3>
              <p className="mt-2 text-sm text-slate-600">Une interface apaisante et facile à utiliser sur mobile.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="aspect-[4/5] rounded-[36px] bg-gradient-to-br from-amber-100 to-white p-4 shadow-soft">
            <div className="h-full rounded-[32px] bg-white p-4 shadow-inner" />
          </div>
          <div className="aspect-[4/5] rounded-[36px] bg-gradient-to-br from-slate-100 via-white to-amber-100 p-4 shadow-soft">
            <div className="h-full rounded-[32px] bg-white p-4 shadow-inner" />
          </div>
          <div className="aspect-[4/5] rounded-[36px] bg-white p-4 shadow-soft">
            <div className="h-full rounded-[32px] bg-gradient-to-br from-amber-100 to-white" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
