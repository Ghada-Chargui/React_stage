import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthNotice from '../components/AuthNotice';
import PasswordInput from '../components/PasswordInput';
import { persistUserAccount, getStoredUsers } from '../utils/storage';

function SignupPage({ onSignup }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [step, setStep] = useState('choose');
  const [form, setForm] = useState({ nom: '', email: '', phone: '', quartier: '', zone: '', experience: '', hourlyRate: '', languages: [], availability: [], password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep('form');
  };

  const handleBack = () => {
    setStep('choose');
    setRole(null);
  };

  const handleChange = (field) => (event) => {
    if (field === 'languages' || field === 'availability') {
      const value = event.target.value;
      setForm((current) => ({ ...current, [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value] }));
      if (errors[field]) {
        setErrors((current) => ({ ...current, [field]: null }));
      }
      return;
    }

    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: null }));
    }
    if (errors.email) {
      setErrors((current) => ({ ...current, email: null }));
    }
    if (notice) setNotice(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const e = {};
    const users = getStoredUsers();

    if (!form.password || form.password.length < 8) e.password = t('auth.signup.fields.passwordError');
    if (form.password !== form.passwordConfirm) e.passwordConfirm = t('auth.signup.fields.passwordConfirmError');
    if (users[form.email]) e.email = t('auth.signup.fields.emailError');
    if (role === 'babysitter') {
      if (!form.zone) e.zone = 'La zone est requise';
      if (!form.hourlyRate) e.hourlyRate = 'Le tarif horaire est requis';
      if (!form.experience) e.experience = 'L’expérience est requise';
      if (!form.availability.length) e.availability = 'Sélectionnez au moins une disponibilité';
      if (!form.languages.length) e.languages = 'Sélectionnez au moins une langue';
      if (!form.photo) e.photo = 'Une photo est requise';
    }
    setErrors(e);
    if (Object.keys(e).length) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      const account = {
        name: form.nom,
        nom: form.nom,
        email: form.email,
        phone: form.phone,
        quartier: form.quartier,
        address: role === 'babysitter' ? form.zone : form.quartier,
        zone: role === 'babysitter' ? form.zone : 'Tunis',
        experience: form.experience,
        hourlyRate: form.hourlyRate,
        availability: role === 'babysitter' ? form.availability : ['Matin'],
        languages: role === 'babysitter' ? form.languages : ['Français'],
        photo: form.photo || '',
        password: form.password,
        role,
      };
      const savedAccount = persistUserAccount(account, { persistSession: false });

      if (onSignup) onSignup({ name: savedAccount.name, email: savedAccount.email, role: savedAccount.role });
      setNotice(t('auth.notice.success'));
      setIsSubmitting(false);
      navigate('/connexion');
    }, 800);
  };

  return (
    <section className="space-y-12 py-16 sm:space-y-16 sm:py-20 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-white p-9 shadow-[0_25px_70px_rgba(15,23,42,0.08)] dark:bg-slate-900 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <div aria-hidden className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-amber-100/40 blur-3xl dark:bg-amber-500/15" />
        <div className="relative">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-700 dark:text-orange-400">{t('auth.signup.tag')}</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{t('auth.signup.title')}</h1>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{t('auth.signup.subtitle')}</p>
            </div>
            <div className="rounded-full bg-slate-100 px-5 py-2.5 text-sm text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400">
              {t('auth.signup.roleLabel')} <span className="font-extrabold text-slate-900 dark:text-slate-100">{role ? t(`auth.signup.role${role === 'parent' ? 'Parent' : 'Babysitter'}`) : t('auth.signup.roleChoose')}</span>
            </div>
          </div>

          {step === 'choose' && (
            <div className="mt-10 grid gap-7 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('parent')}
                className="group rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-[0_20px_60px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.08)] hover:border-amber-100 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:hover:border-amber-500/30"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src="/images/parent.jpg"
                    alt="Parent avec bébé"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mt-6">
                  <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-700 dark:text-orange-400">{t('auth.signup.roleParent')}</p>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('auth.signup.roleParentDescription')}</h2>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{t('auth.signup.roleParentHelp')}</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('babysitter')}
                className="group rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-[0_20px_60px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.08)] hover:border-amber-100 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] dark:hover:border-amber-500/30"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src="/images/babysitter.jpg"
                    alt="Baby-sitter souriante"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mt-6">
                  <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-700 dark:text-orange-400">{t('auth.signup.roleBabysitter')}</p>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t('auth.signup.roleBabysitterDescription')}</h2>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{t('auth.signup.roleBabysitterHelp')}</p>
                </div>
              </button>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmit} className="mt-10 grid gap-6 rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:gap-7 sm:p-8 md:grid-cols-2 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="md:col-span-2 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7 dark:from-orange-900/30 dark:to-amber-900/30">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-700 dark:text-orange-400">{t('auth.signup.tagStep', { role: role === 'parent' ? t('auth.signup.roleParent') : t('auth.signup.roleBabysitter') })}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('auth.signup.formDescription')}</p>
                </div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-amber-500/30"
                >
                  {t('auth.signup.backButton')}
                </button>
              </div>
              <div className="space-y-5">
                <label htmlFor="signup-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('auth.signup.fields.name')}</label>
                <input id="signup-name" value={form.nom} onChange={handleChange('nom')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder={t('auth.signup.fields.namePlaceholder')} required />
              </div>
              <div className="space-y-5">
                <label htmlFor="signup-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('auth.signup.fields.email')}</label>
                <input id="signup-email" value={form.email} onChange={handleChange('email')} type="email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder={t('auth.signup.fields.emailPlaceholder')} required />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <PasswordInput
                id="signup-password"
                name="password"
                label={t('auth.signup.fields.password')}
                value={form.password}
                onChange={handleChange('password')}
                placeholder={t('auth.signup.fields.passwordPlaceholder')}
                autoComplete="new-password"
                required
                error={errors.password}
              />
              <PasswordInput
                id="signup-password-confirm"
                name="passwordConfirm"
                label={t('auth.signup.fields.passwordConfirm')}
                value={form.passwordConfirm}
                onChange={handleChange('passwordConfirm')}
                placeholder={t('auth.signup.fields.passwordConfirmPlaceholder')}
                autoComplete="new-password"
                required
                error={errors.passwordConfirm}
              />
              <div className="space-y-5">
                <label htmlFor="signup-phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('auth.signup.fields.phone')}</label>
                <input id="signup-phone" value={form.phone} onChange={handleChange('phone')} type="tel" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder={t('auth.signup.fields.phonePlaceholder')} required />
              </div>
              <div className="space-y-5">
                <label htmlFor="signup-quartier" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('auth.signup.fields.neighborhood')}</label>
                <input id="signup-quartier" value={form.quartier} onChange={handleChange('quartier')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder={t('auth.signup.fields.neighborhoodPlaceholder')} required />
              </div>
              {role === 'babysitter' && (
                <div className="space-y-5">
                  <label htmlFor="signup-zone" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Adresse / zone géographique</label>
                  <input id="signup-zone" value={form.zone} onChange={handleChange('zone')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder="Ex. Carthage, La Soukra" required />
                  {errors.zone && <p className="mt-1 text-sm text-red-600">{errors.zone}</p>}
                </div>
              )}
              {role === 'babysitter' && (
                <>
                  <div className="space-y-5">
                    <label htmlFor="signup-photo" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Photo de profil</label>
                    <input id="signup-photo" type="file" accept="image/*" onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setForm((current) => ({ ...current, photo: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" required />
                    {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
                  </div>
                  <div className="space-y-5">
                    <label htmlFor="signup-hourly-rate" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Tarif horaire (TND/h)</label>
                    <input id="signup-hourly-rate" value={form.hourlyRate} onChange={handleChange('hourlyRate')} type="number" min="0" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder="35" required />
                    {errors.hourlyRate && <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>}
                  </div>
                  <div className="space-y-5">
                    <label htmlFor="signup-experience" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('auth.signup.fields.experience')}</label>
                    <input id="signup-experience" value={form.experience} onChange={handleChange('experience')} type="number" min="0" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder={t('auth.signup.fields.experiencePlaceholder')} required />
                    {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                  </div>
                  <div className="space-y-5 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Disponibilités</label>
                    <div className="flex flex-wrap gap-3">
                      {['Matin', 'Après-midi', 'Soirée', 'Weekends'].map((slot) => {
                        const checked = form.availability.includes(slot);
                        return (
                          <label key={slot} className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${checked ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-900/20 dark:text-orange-300' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                            <input type="checkbox" value={slot} checked={checked} onChange={handleChange('availability')} className="sr-only" />
                            <span>{slot}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.availability && <p className="mt-1 text-sm text-red-600">{errors.availability}</p>}
                  </div>
                  <div className="space-y-5 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Langues parlées</label>
                    <div className="flex flex-wrap gap-3">
                      {['Français', 'Arabe', 'Anglais', 'Italien', 'Espagnol'].map((language) => {
                        const checked = form.languages.includes(language);
                        return (
                          <label key={language} className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${checked ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-900/20 dark:text-orange-300' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
                            <input type="checkbox" value={language} checked={checked} onChange={handleChange('languages')} className="sr-only" />
                            <span>{language}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.languages && <p className="mt-1 text-sm text-red-600">{errors.languages}</p>}
                  </div>
                </>
              )}
              {notice && <div className="md:col-span-2"><AuthNotice type="success">{notice}</AuthNotice></div>}
              <div className="md:col-span-2">
                <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4.5 text-base font-semibold text-white shadow-[0_20px_50px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(249,115,22,0.35)] focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300">
                  {isSubmitting ? t('auth.signup.submitLoading') : t('auth.signup.submitButton')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default SignupPage;