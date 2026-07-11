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
    <section className="space-y-10 py-10 lg:py-16">
      <div className="rounded-[36px] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-600">Recherche de baby-sitters</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Trouvez la baby-sitter idéale près de chez vous.</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <Search size={18} /> Résultats : {filteredSitters.length}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6 rounded-[32px] border border-slate-200 bg-slate-50 p-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Filtres</p>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Quartier</label>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100">
                  <option value="">Tous les quartiers</option>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Disponibilité</label>
                <select value={selectedAvailability} onChange={(e) => setSelectedAvailability(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100">
                  <option value="">Toutes</option>
                  {availabilities.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Tarif maximum</label>
                <input type="range" min="20" max="80" value={maxRate} onChange={(e) => setMaxRate(Number(e.target.value))} className="w-full accent-amber-500" />
                <p className="text-sm text-slate-600">Jusqu&apos;à {maxRate} TND / h</p>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Expérience minimale</label>
                <input type="number" min="0" step="1" value={minExperience} onChange={(e) => setMinExperience(Number(e.target.value))} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Rapide</p>
                  <h2 className="text-2xl font-semibold text-slate-900">Une sélection prête à consulter</h2>
                </div>
                <div className="relative max-w-md">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400"><Search size={18} /></span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par nom ou spécialité"
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              {filteredSitters.length === 0 ? (
                <div className="rounded-[32px] border border-amber-200 bg-amber-50 p-8 text-center text-slate-700">
                  <p className="font-semibold">Aucun baby-sitter ne correspond aux critères.</p>
                  <p className="mt-2 text-sm text-slate-600">Essayez d&apos;élargir la recherche ou de réduire les filtres.</p>
                </div>
              ) : (
                filteredSitters.map((sitter) => <SitterCard key={sitter.id} sitter={sitter} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchPage;
