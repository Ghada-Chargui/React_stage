import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthNotice from '../components/AuthNotice';
import PasswordInput from '../components/PasswordInput';

function SignupPage({ onSignup }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [step, setStep] = useState('choose');
  const [form, setForm] = useState({ nom: '', email: '', phone: '', quartier: '', experience: '', bio: '', password: '', passwordConfirm: '' });
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
    const usersRaw = localStorage.getItem('confiSitUsers');
    const users = usersRaw ? JSON.parse(usersRaw) : {};

    if (!form.password || form.password.length < 8) e.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Les mots de passe ne correspondent pas.';
    if (users[form.email]) e.email = 'Cet email est déjà utilisé, connectez-vous ou utilisez un autre email.';
    setErrors(e);
    if (Object.keys(e).length) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      const user = { nom: form.nom, email: form.email, phone: form.phone, quartier: form.quartier, experience: form.experience, bio: form.bio, password: form.password, role };
      users[user.email] = user;
      localStorage.setItem('confiSitUsers', JSON.stringify(users));

      if (onSignup) onSignup({ name: user.nom, email: user.email, role: user.role });
      setNotice('Compte créé avec succès !');
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
              <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-700 dark:text-orange-400">Inscription</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Rejoignez Confi'Sit en tant que parent ou baby-sitter.</h1>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Choisissez votre profil pour afficher le bon formulaire.</p>
            </div>
            <div className="rounded-full bg-slate-100 px-5 py-2.5 text-sm text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400">
              Role : <span className="font-extrabold text-slate-900 dark:text-slate-100">{role ?? 'À choisir'}</span>
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
                  <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-700 dark:text-orange-400">Parent</p>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Je cherche une baby-sitter</h2>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">Créez un compte pour publier vos demandes et consulter des profils fiables.</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('baby-sitter')}
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
                  <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-700 dark:text-orange-400">Baby-sitter</p>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Je propose mes services</h2>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">Rejoignez la communauté et trouvez des familles près de chez vous.</p>
                </div>
              </button>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmit} className="mt-10 grid gap-6 rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:gap-7 sm:p-8 md:grid-cols-2 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="md:col-span-2 flex flex-col gap-5 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7 dark:from-orange-900/30 dark:to-amber-900/30">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-700 dark:text-orange-400">Inscription {role === 'parent' ? 'Parent' : 'Baby-sitter'}</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Complétez le formulaire pour finaliser votre compte.</p>
                </div>
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-amber-500/30"
                >
                  Retour
                </button>
              </div>
              <div className="space-y-5">
                <label htmlFor="signup-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Nom complet</label>
                <input id="signup-name" value={form.nom} onChange={handleChange('nom')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder="Votre nom" required />
              </div>
              <div className="space-y-5">
                <label htmlFor="signup-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label>
                <input id="signup-email" value={form.email} onChange={handleChange('email')} type="email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder="exemple@mail.com" required />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <PasswordInput
                id="signup-password"
                name="password"
                label="Mot de passe"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Au moins 8 caractères"
                autoComplete="new-password"
                required
                error={errors.password}
              />
              <PasswordInput
                id="signup-password-confirm"
                name="passwordConfirm"
                label="Confirmation du mot de passe"
                value={form.passwordConfirm}
                onChange={handleChange('passwordConfirm')}
                placeholder="Confirmez le mot de passe"
                autoComplete="new-password"
                required
                error={errors.passwordConfirm}
              />
              <div className="space-y-5">
                <label htmlFor="signup-phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Téléphone</label>
                <input id="signup-phone" value={form.phone} onChange={handleChange('phone')} type="tel" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder="+216 9x xxx xxx" required />
              </div>
              <div className="space-y-5">
                <label htmlFor="signup-quartier" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Quartier</label>
                <input id="signup-quartier" value={form.quartier} onChange={handleChange('quartier')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder="Ex : La Marsa" required />
              </div>
              {role === 'baby-sitter' && (
                <>
                  <div className="space-y-5">
                    <label htmlFor="signup-experience" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Années d'expérience</label>
                    <input id="signup-experience" value={form.experience} onChange={handleChange('experience')} type="number" min="0" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder="Ex : 4" required />
                  </div>
                  <div className="space-y-5">
                    <label htmlFor="signup-bio" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Votre proposition</label>
                    <textarea id="signup-bio" value={form.bio} onChange={handleChange('bio')} rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder="Présentez-vous et votre approche." required />
                  </div>
                </>
              )}
              {role === 'parent' && (
                <div className="md:col-span-2 space-y-5">
                  <label htmlFor="signup-parent-message" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Message</label>
                  <textarea id="signup-parent-message" value={form.bio} onChange={handleChange('bio')} rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30" placeholder="Décrivez brièvement votre besoin (facultatif)." />
                </div>
              )}
              {notice && <div className="md:col-span-2"><AuthNotice type="success">{notice}</AuthNotice></div>}
              <div className="md:col-span-2">
                <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-4.5 text-base font-semibold text-white shadow-[0_20px_50px_rgba(249,115,22,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(249,115,22,0.35)] focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300">
                  {isSubmitting ? 'Création du compte…' : 'Envoyer ma demande'}
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
