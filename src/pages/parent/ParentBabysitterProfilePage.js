import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getBabysitterProfiles, getFavoriteSitterIds, toggleFavoriteSitter } from '../../utils/storage';

function ParentBabysitterProfilePage() {
  const { id } = useParams();
  const sitter = useMemo(() => getBabysitterProfiles().find((item) => item.id === id), [id]);
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);
  const [favorites, setFavorites] = useState(() => getFavoriteSitterIds(currentUser?.email));

  const handleToggleFavorite = () => {
    if (!currentUser?.email || !sitter) return;
    setFavorites(toggleFavoriteSitter(currentUser.email, sitter.id));
  };

  if (!sitter) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Babysitter introuvable</p>
        <Link to="/espace-parent/recherche" className="mt-4 inline-flex rounded-full bg-amber-100 px-5 py-2.5 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Retour à la recherche</Link>
      </div>
    );
  }

  const isFavorite = favorites.includes(sitter.id);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img src={sitter.image} alt={sitter.name} className="h-32 w-32 rounded-3xl object-cover" />
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Profil détaillé</p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{sitter.name}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{sitter.location} • {sitter.rate} TND/h • {sitter.experience} ans d’expérience</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sitter.languages.map((language) => <span key={language} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">{language}</span>)}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`flex shrink-0 items-center gap-2 self-start rounded-full border px-5 py-2.5 text-sm font-semibold transition md:self-center ${isFavorite ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-600/40 dark:bg-red-900/20 dark:text-red-400' : 'border-slate-200 bg-white text-slate-700 hover:text-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
          >
            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'Dans vos favoris' : 'Ajouter aux favoris'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">À propos</h3>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{sitter.bio}</p>
          <div className="mt-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-slate-500">Services</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sitter.services.map((service) => <span key={service} className="rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">{service}</span>)}
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Avis</h3>
          <div className="mt-4 space-y-3">
            {sitter.reviews.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Aucun avis pour le moment.</p>
            ) : sitter.reviews.map((review, index) => (
              <div key={`${review.name}-${index}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{review.name}</p>
                  <span className="text-sm font-semibold text-amber-700">★ {review.stars}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
              </div>
            ))}
          </div>
          <Link to="/espace-parent/reservations" className="mt-6 block w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-3 text-center text-sm font-semibold text-white">Réserver</Link>
        </div>
      </div>
    </div>
  );
}

export default ParentBabysitterProfilePage;