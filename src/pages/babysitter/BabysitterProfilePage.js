import { useEffect, useState } from 'react';

function BabysitterProfilePage() {
  const [profile, setProfile] = useState({
    photo: '',
    bio: '',
    hourlyRate: '35',
    zone: 'Tunis',
    availability: 'Matin',
    experience: '3',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setProfile({
        photo: parsed.photo || '',
        bio: parsed.bio || '',
        hourlyRate: parsed.hourlyRate || '35',
        zone: parsed.zone || 'Tunis',
        availability: parsed.availability?.join(', ') || 'Matin',
        experience: parsed.experience || '3',
      });
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextUser = { ...JSON.parse(localStorage.getItem('confiSitUser') || '{}'), ...profile, availability: profile.availability.split(',').map((item) => item.trim()).filter(Boolean) };
    localStorage.setItem('confiSitUser', JSON.stringify(nextUser));
    window.location.reload();
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Profil babysitter</p>
      <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Mettez à jour votre profil</h2>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
          Illustration / photo
          <input value={profile.photo} onChange={(event) => setProfile({ ...profile, photo: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" placeholder="URL de l’image" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
          Bio
          <textarea rows="4" value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Tarif horaire (TND)
          <input type="number" value={profile.hourlyRate} onChange={(event) => setProfile({ ...profile, hourlyRate: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Zone couverte
          <input value={profile.zone} onChange={(event) => setProfile({ ...profile, zone: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Disponibilités
          <input value={profile.availability} onChange={(event) => setProfile({ ...profile, availability: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" placeholder="Matin, Soirée" />
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Expérience (années)
          <input type="number" value={profile.experience} onChange={(event) => setProfile({ ...profile, experience: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        </label>
        <div className="md:col-span-2">
          <button type="submit" className="rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-sm font-semibold text-white">Enregistrer le profil</button>
        </div>
      </form>
    </div>
  );
}

export default BabysitterProfilePage;
