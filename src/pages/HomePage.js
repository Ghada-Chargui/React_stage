import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

function HomePage({ user, homeMode, setHomeMode }) {

  if (user && homeMode === 'member') {
    return (
      <section className="space-y-8 py-16">
        <div className="rounded-[36px] bg-white p-10 shadow-soft">
          <h1 className="text-4xl font-semibold text-slate-900">Bienvenue, {user.name} !</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Votre espace Confi&apos;Sit est prêt. Découvrez les baby-sitters de confiance et gérez vos demandes depuis votre tableau de bord.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link to="/recherche" className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-amber-600">
              Trouver une baby-sitter
            </Link>
            <button
              type="button"
              onClick={() => setHomeMode('hero')}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-16 py-10 lg:py-16">
      <div className="rounded-[36px] bg-gradient-to-br from-amber-50 via-white to-slate-100 p-8 shadow-soft lg:p-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Confi&apos;Sit</span>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Confiez vos enfants en toute sérénité, où que vous soyez en Tunisie.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Confi&apos;Sit met en relation parents et baby-sitters de confiance avec des profils clairs, des avis transparents et une expérience mobile-first.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/inscription" className="inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-amber-600">
                Commencer l&apos;inscription
                <ArrowRight size={18} className="ml-3" />
              </Link>
              <Link
                to="/connexion"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Se connecter
              </Link>
            </div>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-soft sm:p-8">
            <div className="rounded-[28px] bg-gradient-to-br from-amber-100 to-white p-6 shadow-inner">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Rejoignez-nous</p>
              <p className="mt-4 text-lg font-semibold text-slate-900">Des gardes fiables, proches et sereines.</p>
              <div className="mt-6">
                <Link
                  to="/inscription"
                  className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-amber-600"
                >
                  S&apos;inscrire maintenant
                </Link>
              </div>
            </div>
            <div className="mt-6">
              <ImageCarousel />
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Qui sommes-nous</span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Notre mission : connecter les familles avec des baby-sitters de confiance.</h2>
            <p className="text-slate-600 leading-8">
              Confi'Sit accompagne parents et baby-sitters avec une approche centrée sur la sécurité, la simplicité et la proximité. Nous proposons un service moderne et rassurant pour organiser des gardes sereines, partout en Tunisie.
Notre vision : bâtir une communauté locale où chaque parent trouve l'accompagnement idéal pour son enfant, et où chaque baby-sitter construit une relation de confiance durable avec les familles qu'elle accompagne.


            </p>
            <p className="text-slate-600 leading-8">
              Notre vision est de créer une communauté locale où chaque parent trouve le bon accompagnement pour son enfant et chaque baby-sitter développe une relation de confiance avec les familles.
            </p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <img
              src="/images/baby.jpg"
              alt="Bébé souriant"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/baby.svg.png'; }}
              className="h-full w-full rounded-[28px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
