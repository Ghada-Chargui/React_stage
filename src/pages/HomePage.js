import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageCarousel from '../components/ImageCarousel';
import HowItWorksPage from './HowItWorksPage';
import heroImage from '../assets/logo.png';

function HomePage({ user, homeMode, setHomeMode }) {
  const { t } = useTranslation();

  if (user && homeMode === 'member') {
    return (
      <section className="space-y-8 py-20">
        <div className="rounded-3xl bg-white p-10 shadow-[0_25px_70px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:bg-slate-900 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{t('member.welcome', { name: user.name })}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{t('member.description')}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/recherche"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-base font-semibold text-white shadow-[0_20px_50px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(249,115,22,0.35)]"
            >
              {t('member.findSitter')}
            </Link>
            <button
              type="button"
              onClick={() => setHomeMode('hero')}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {t('member.backHome')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-16 pt-0 pb-12 sm:space-y-20 sm:pb-16 lg:space-y-24 lg:pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 shadow-[0_30px_80px_rgba(249,115,22,0.08)] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:p-8 lg:p-12">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-12 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/15" />
          <div className="absolute -right-24 top-48 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-500/15" />
          <div className="absolute left-1/2 -top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-100/30 blur-3xl dark:bg-amber-400/10" />
        </div>

        <div className="relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_440px] lg:items-center">
            <div className="space-y-8">
              <div className="mb-2 flex justify-center sm:justify-start">
                <img
                  src={heroImage}
                  alt="Confi'Sit"
                  className="h-40 w-auto max-w-full object-contain sm:h-56 lg:h-68"
                />
              </div>

              <h1 className="mt-1 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
                {t('hero.title')}
              </h1>

              <p className="max-w-2xl text-xl leading-9 text-slate-600 dark:text-slate-300">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/inscription"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-5 text-base font-semibold text-white shadow-[0_25px_60px_rgba(249,115,22,0.30)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(249,115,22,0.45)] hover:scale-[1.02]"
                >
                  {t('hero.ctaSignup')}
                  <ArrowRight size={20} className="ms-3" />
                </Link>
                <Link
                  to="/connexion"
                  className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-5 text-base font-semibold text-slate-700 shadow-[0_15px_40px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_20px_50px_rgba(15,23,42,0.10)] hover:border-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-amber-500/50"
                >
                  {t('hero.ctaLogin')}
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white/85 p-7 shadow-[0_25px_70px_rgba(249,115,22,0.18)] backdrop-blur-xl ring-1 ring-amber-100/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_35px_90px_rgba(249,115,22,0.28)] hover:scale-[1.01] dark:bg-slate-900/85 dark:ring-amber-500/20 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)] sm:p-8">
              <div className="rounded-3xl bg-gradient-to-br from-amber-100/80 to-white/95 p-7 shadow-inner ring-1 ring-amber-100/50 dark:from-amber-900/30 dark:to-slate-800/95 dark:ring-amber-500/20">
                <p className="text-sm font-extrabold uppercase tracking-[0.35em] text-amber-700 dark:text-amber-400">{t('hero.joinTitle')}</p>
                <p className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">{t('hero.joinSubtitle')}</p>
                <div className="mt-7">
                  <Link
                    to="/inscription"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(249,115,22,0.40)]"
                  >
                    {t('hero.joinCta')}
                  </Link>
                </div>
              </div>
              <div className="mt-7">
                <div className="transition-all duration-300 hover:scale-[1.03]">
                  <ImageCarousel />
                </div>
              </div>
            </div>
          </div>

          <div id="comment-ca-marche" className="scroll-mt-28">
            <HowItWorksPage />
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="space-y-7">
              <span className="inline-flex rounded-full bg-amber-100 px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.32em] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{t('whoWeAre.tag')}</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">{t('whoWeAre.title')}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-9">{t('whoWeAre.description1')}</p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-9">{t('whoWeAre.description2')}</p>
            </div>
            <div className="rounded-3xl bg-white p-7 shadow-[0_25px_70px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.12)] dark:bg-slate-900 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
              <img
                src="/images/baby.jpg"
                alt={t('whoWeAre.imageAlt')}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/baby.svg.png';
                }}
                className="h-full w-full rounded-3xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;

