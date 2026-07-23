import { useEffect, useState } from 'react';
import { persistUserAccount } from '../../utils/storage';

function ParentProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    childrenCount: '1',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setProfile({
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        address: parsed.address || '',
        childrenCount: parsed.childrenCount || '1',
      });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextUser = { ...JSON.parse(localStorage.getItem('confiSitUser') || '{}'), ...profile };
    persistUserAccount(nextUser, { persistSession: true });
    window.location.reload();
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Profil parent</p>
      <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Vos informations</h2>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Nom
          <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Email
          <input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" required />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Téléphone
          <input type="tel" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Adresse
          <input value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Nombre d’enfants
          <input type="number" min="1" value={profile.childrenCount} onChange={(event) => setProfile({ ...profile, childrenCount: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-sm font-semibold text-white">Enregistrer les changements</button>
        </div>
      </form>
    </div>
  );
}

export default ParentProfilePage;