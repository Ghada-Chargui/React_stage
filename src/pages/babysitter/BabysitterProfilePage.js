import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { deleteUserAccount, persistUserAccount } from '../../utils/storage';
import ConfirmModal from '../../components/ConfirmModal';

const AVAILABILITY_OPTIONS = ['Matin', 'Après-midi', 'Soirée', 'Weekends'];
const AVAILABILITY_KEYS = {
  'Matin': 'morning',
  'Après-midi': 'afternoon',
  'Soirée': 'evening',
  'Weekends': 'weekends',
};

function BabysitterProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    photo: '',
    bio: '',
    hourlyRate: '35',
    zone: 'Tunis',
    availability: ['Matin'],
    experience: '3',
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setProfile({
        photo: parsed.photo || '',
        bio: parsed.bio || '',
        hourlyRate: parsed.hourlyRate || '35',
        zone: parsed.zone || 'Tunis',
        availability: Array.isArray(parsed.availability) && parsed.availability.length ? parsed.availability : ['Matin'],
        experience: parsed.experience || '3',
      });
    }
  }, []);

  const toggleAvailability = (slot) => {
    setProfile((current) => ({
      ...current,
      availability: current.availability.includes(slot)
        ? current.availability.filter((item) => item !== slot)
        : [...current.availability, slot],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextUser = { ...JSON.parse(localStorage.getItem('confiSitUser') || '{}'), ...profile };
    persistUserAccount(nextUser, { persistSession: true });
    window.location.reload();
  };

  const handleDeleteAccount = () => {
    const storedUser = localStorage.getItem('confiSitUser');
    const email = storedUser ? JSON.parse(storedUser).email : null;
    deleteUserAccount(email);
    setIsConfirmOpen(false);
    navigate('/connexion');
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{t('babysitterSpace.profile.tag')}</p>
        <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('babysitterSpace.profile.title')}</h2>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
            {t('babysitterSpace.profile.fields.photo')}
            <input value={profile.photo} onChange={(event) => setProfile({ ...profile, photo: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" placeholder={t('babysitterSpace.profile.fields.photoPlaceholder')} />
          </label>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">
            {t('babysitterSpace.profile.fields.bio')}
            <textarea rows="4" value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('babysitterSpace.profile.fields.hourlyRate')}
            <input type="number" value={profile.hourlyRate} onChange={(event) => setProfile({ ...profile, hourlyRate: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('babysitterSpace.profile.fields.zone')}
            <input value={profile.zone} onChange={(event) => setProfile({ ...profile, zone: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('babysitterSpace.profile.fields.experience')}
            <input type="number" value={profile.experience} onChange={(event) => setProfile({ ...profile, experience: event.target.value })} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-sm font-semibold text-white">{t('babysitterSpace.profile.save')}</button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">{t('babysitterSpace.profile.availabilityTag')}</p>
        <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">{t('babysitterSpace.profile.availabilityTitle')}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('babysitterSpace.profile.availabilityNote')}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {AVAILABILITY_OPTIONS.map((slot) => {
            const checked = profile.availability.includes(slot);
            return (
              <label key={slot} className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${checked ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-900/20 dark:text-orange-300' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                <input type="checkbox" checked={checked} onChange={() => toggleAvailability(slot)} className="sr-only" />
                {t(`common.availability.${AVAILABILITY_KEYS[slot]}`)}
              </label>
            );
          })}
        </div>
        <button type="button" onClick={handleSubmit} className="mt-5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 text-sm font-semibold text-white">{t('babysitterSpace.profile.saveAvailability')}</button>
      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 dark:border-red-600/30 dark:bg-red-900/10">
        <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-red-600">{t('babysitterSpace.profile.dangerZone')}</p>
        <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">{t('babysitterSpace.profile.deleteTitle')}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t('babysitterSpace.profile.deleteWarning')}</p>
        <button type="button" onClick={() => setIsConfirmOpen(true)} className="mt-4 flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
          <Trash2 size={16} /> {t('babysitterSpace.profile.deleteButton')}
        </button>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={t('babysitterSpace.profile.confirmTitle')}
        message={t('babysitterSpace.profile.confirmMessage')}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}

export default BabysitterProfilePage;