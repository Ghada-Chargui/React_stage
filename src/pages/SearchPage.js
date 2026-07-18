import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import SitterCard from '../components/SitterCard';
import { availabilities, neighborhoods, sitters } from '../data/mockSitters';

function SearchPage() {
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxRate, setMaxRate] = useState(60);
  const [minExperience, setMinExperience] = useState(0);
  const [search, setSearch] = useState('');

  const filteredSitters = useMemo(() => {
    return sitters.filter((sitter) => {
      const matchesAvailability = selectedAvailability ? sitter.availability.includes(selectedAvailability) : true;
      const matchesLocation = selectedLocation ? sitter.location === selectedLocation : true;
      const matchesRate = sitter.rate <= maxRate;
      const matchesExperience = sitter.experience >= minExperience;
      const matchesSearch = search ? sitter.name.toLowerCase().includes(search.toLowerCase()) || sitter.specialties.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) : true;
      return matchesAvailability && matchesLocation && matchesRate && matchesExperience && matchesSearch;
    });
  }, [selectedAvailability, selectedLocation, maxRate, minExperience, search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <section className="space-y-12 py-16 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-amber-50 p-9 shadow-[0_25px_70px_rgba(249,115,22,0.08)] dark:from-slate-900 dark:to-amber-900/20 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <div aria-hidden className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-amber-100/40 blur-3xl dark:bg-amber-500/15" />
        <div className="relative">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-amber-600 dark:text-amber-400">Recherche de baby-sitters</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">Trouvez la baby-sitter idéale près de chez vous.</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200">
              <Search size={18} /> Résultats : {filteredSitters.length}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">
            <div className="space-y-7 rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="space-y-4">
                <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Filtres</p>
                <div className="space-y-5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Quartier</label>
                  <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-amber-500/30">
                    <option value="">Tous les quartiers</option>
                    {neighborhoods.map((neighborhood) => (
                      <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Disponibilité</label>
                  <select value={selectedAvailability} onChange={(e) => setSelectedAvailability(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-amber-500/30">
                    <option value="">Toutes</option>
                    {availabilities.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Tarif maximum</label>
                  <input type="range" min="20" max="80" value={maxRate} onChange={(e) => setMaxRate(Number(e.target.value))} className="w-full accent-amber-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Jusqu'à {maxRate} TND / h</p>
                </div>
                <div className="space-y-5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Expérience minimale</label>
                  <input type="number" min="0" step="1" value={minExperience} onChange={(e) => setMinExperience(Number(e.target.value))} className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3.5 text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-amber-500/30" />
                </div>
              </div>
            </div>

            <div className="space-y-7">
              <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Rapide</p>
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Une sélection prête à consulter</h2>
                  </div>
                  <div className="relative max-w-md">
                    <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-slate-400 dark:text-slate-500"><Search size={18} /></span>
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher par nom ou spécialité"
                      className="w-full rounded-full border border-slate-200 bg-slate-50 py-3.5 pl-14 pr-5 text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-amber-500/30"
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-7">
                {filteredSitters.length === 0 ? (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-9 text-center text-slate-700 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-slate-200">
                    <p className="font-extrabold">Aucun baby-sitter ne correspond aux critères.</p>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Essayez d'élargir la recherche ou de réduire les filtres.</p>
                  </div>
                ) : (
                  filteredSitters.map((sitter) => <SitterCard key={sitter.id} sitter={sitter} />)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchPage;
