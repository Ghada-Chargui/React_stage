import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getBabysitterProfiles, getFavoriteSitterIds, toggleFavoriteSitter, STORAGE_CHANGE_EVENT_NAME } from '../../utils/storage';

function ParentFavoritesPage() {
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  const [sitters, setSitters] = useState(() => getBabysitterProfiles());
  const [favorites, setFavorites] = useState(() => getFavoriteSitterIds(currentUser?.email));

  useEffect(() => {
    const syncSitters = () => setSitters(getBabysitterProfiles());
    syncSitters();
    window.addEventListener(STORAGE_CHANGE_EVENT_NAME, syncSitters);
    return () => window.removeEventListener(STORAGE_CHANGE_EVENT_NAME, syncSitters);
  }, []);

  const favoriteSitters = useMemo(
    () => sitters.filter((sitter) => favorites.includes(sitter.id)),
    [sitters, favorites]
  );

  const handleRemoveFavorite = (sitterId) => {
    if (!currentUser?.email) return;
    setFavorites(toggleFavoriteSitter(currentUser.email, sitterId));
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <Heart size={20} fill="currentColor" />
        </span>
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Favoris</p>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Vos babysitters préférées</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {favoriteSitters.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Vous n’avez pas encore de favoris. Ajoutez-en depuis la <Link to="/espace-parent/recherche" className="font-semibold text-orange-700 underline-offset-4 hover:underline dark:text-orange-400">recherche</Link>.
          </p>
        ) : favoriteSitters.map((sitter) => (
          <div key={sitter.id} className="rounded-3xl border border-slate-200 p-5 dark:border-slate-700">
            <div className="flex gap-4">
              <img src={sitter.image} alt={sitter.name} className="h-20 w-20 rounded-3xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-slate-100">{sitter.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sitter.location} • {sitter.rate} TND/h</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">★ {sitter.rating.toFixed(1)}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to={`/espace-parent/babysitter/${sitter.id}`} className="rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-2 text-sm font-semibold text-white">Voir le profil</Link>
                  <button type="button" onClick={() => handleRemoveFavorite(sitter.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-600/40 dark:hover:bg-red-900/20">Retirer</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParentFavoritesPage;