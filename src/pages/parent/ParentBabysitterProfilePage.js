import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, DollarSign, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getBabysitterProfiles } from '../../utils/storage';

function ParentBabysitterProfilePage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const sitter = useMemo(
    () =>
      getBabysitterProfiles().find(
        (profile) => String(profile.id) === String(id)
      ),
    [id]
  );

  if (!sitter) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-sm dark:bg-slate-900">
        <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
          {t('sitterProfile.notFound.title')}
        </p>
        <Link
          to="/espace-parent/recherche"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={18} />
          {t('sitterProfile.notFound.cta')}
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <Link
        to="/espace-parent/recherche"
        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600"
      >
        <ArrowLeft size={18} />
        {t('sitterProfile.backToSearch')}
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <img
            src={sitter.image}
            alt={sitter.name}
            className="h-40 w-40 rounded-3xl object-cover"
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {sitter.name}
              </h1>
              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-extrabold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                ★ {sitter.rating.toFixed(1)}
              </span>
            </div>

            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              {sitter.bio}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">
                <MapPin size={17} /> {sitter.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">
                <DollarSign size={17} /> {sitter.rate} TND/h
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">
                <Clock3 size={17} /> {sitter.experience} ans
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {t('sitterProfile.availability')}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {sitter.availability.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              {t('sitterProfile.services')}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {sitter.specialties.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ParentBabysitterProfilePage;
