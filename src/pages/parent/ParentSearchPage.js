import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { getBabysitterProfiles, getFavoriteSitterIds, toggleFavoriteSitter, STORAGE_CHANGE_EVENT_NAME } from '../../utils/storage';

function ParentSearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);
  const [sitters, setSitters] = useState(() => getBabysitterProfiles());
  const [favorites, setFavorites] = useState(() => getFavoriteSitterIds(currentUser?.email));
  const [zone, setZone] = useState('');
  const [rate, setRate] = useState(80);
  const [minRating, setMinRating] = useState(4.5);
  const [availability, setAvailability] = useState('');

  const handleToggleFavorite = (sitterId) => {
    if (!currentUser?.email) return;
    setFavorites(toggleFavoriteSitter(currentUser.email, sitterId));
  };

  useEffect(() => {
    const syncSitters = () => setSitters(getBabysitterProfiles());
    syncSitters();
    window.addEventListener(STORAGE_CHANGE_EVENT_NAME, syncSitters);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT_NAME, syncSitters);
  }, []);

  const zones = useMemo(() => Array.from(new Set(sitters.map((sitter) => sitter.location).filter(Boolean))), [sitters]);
  const availabilities = useMemo(() => Array.from(new Set(sitters.flatMap((sitter) => sitter.availability || []))), [sitters]);

  const filteredSitters = useMemo(() => {
    return sitters.filter((sitter) => {
      const matchesZone = !zone || sitter.location === zone;
      const matchesRate = sitter.rate <= rate;
      const matchesRating = sitter.rating >= minRating;
      const matchesAvailability = !availability || (sitter.availability || []).includes(availability);
      return matchesZone && matchesRate && matchesRating && matchesAvailability;
    });
  }, [availability, rate, minRating, sitters, zone]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{t('parentSpace.search.tag')}</p>
        <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('parentSpace.search.title')}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.search.filters.zone')}
            <select value={zone} onChange={(event) => setZone(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option value="">{t('parentSpace.search.filters.all')}</option>
              {zones.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.search.filters.maxRate')}
            <input type="range" min="25" max="80" value={rate} onChange={(event) => setRate(Number(event.target.value))} className="mt-2 w-full accent-orange-500" />
            <span className="text-xs text-slate-500">{rate} TND/h</span>
          </label>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.search.filters.minRating')}
            <input type="range" min="4" max="5" step="0.1" value={minRating} onChange={(event) => setMinRating(Number(event.target.value))} className="mt-2 w-full accent-orange-500" />
            <span className="text-xs text-slate-500">{minRating.toFixed(1)}</span>
          </label>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('parentSpace.search.filters.availability')}
            <select value={availability} onChange={(event) => setAvailability(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option value="">{t('parentSpace.search.filters.all')}</option>
              {availabilities.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredSitters.map((sitter) => (
          <div key={sitter.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900">
            <div className="flex gap-4">
              <img src={sitter.image} alt={sitter.name} className="h-24 w-24 rounded-3xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-slate-100">{sitter.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sitter.location} • {sitter.rate} TND/h</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">★ {sitter.rating.toFixed(1)}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(sitter.id)}
                      aria-label={favorites.includes(sitter.id) ? t('parentSpace.search.removeFavorite') : t('parentSpace.search.addFavorite')}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${favorites.includes(sitter.id) ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-600/40 dark:bg-red-900/20 dark:text-red-400' : 'border-slate-200 bg-white text-slate-400 hover:text-red-500 dark:border-slate-700 dark:bg-slate-800'}`}
                    >
                      <Heart size={16} fill={favorites.includes(sitter.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{sitter.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sitter.availability.map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item}</span>
                  ))}
                </div>
                <button type="button" onClick={() => navigate(`/espace-parent/babysitter/${sitter.id}`)} className="mt-5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white">{t('parentSpace.search.viewProfile')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParentSearchPage;