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
    <section className="space-y-8 py-8 sm:space-y-10 sm:py-10 lg:py-16">
      <div className="rounded-[36px] bg-white p-5 shadow-soft sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-700">Inscription</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Rejoignez Confi&apos;Sit en tant que parent ou baby-sitter.</h1>
            <p className="mt-3 text-sm text-slate-600">Choisissez votre profil pour afficher le bon formulaire.</p>
          </div>
          <div className="rounded-full bg-slate-100 p-2 text-sm text-slate-500 shadow-sm">
            Role : <span className="font-semibold text-slate-900">{role ?? 'À choisir'}</span>
          </div>
        </div>

        {step === 'choose' && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('parent')}
              className="group rounded-[32px] border border-slate-200 bg-white p-4 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 sm:p-6"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-slate-100">
                <img
                  src="/images/parent.jpg"
                  alt="Parent avec bébé"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-5">
                <p className="text-sm uppercase tracking-[0.28em] text-orange-700">Parent</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Je cherche une baby-sitter</h2>
                <p className="mt-3 text-slate-600">Créez un compte pour publier vos demandes et consulter des profils fiables.</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('baby-sitter')}
              className="group rounded-[32px] border border-slate-200 bg-white p-4 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 sm:p-6"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-slate-100">
                <img
                  src="/images/babysitter.jpg"
                  alt="Baby-sitter souriante"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-5">
                <p className="text-sm uppercase tracking-[0.28em] text-orange-700">Baby-sitter</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Je propose mes services</h2>
                <p className="mt-3 text-slate-600">Rejoignez la communauté et trouvez des familles près de chez vous.</p>
              </div>
            </button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 rounded-[32px] bg-white p-4 shadow-soft sm:gap-6 sm:p-8 md:grid-cols-2">
            <div className="md:col-span-2 flex flex-col gap-4 rounded-[28px] bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-700">Inscription {role === 'parent' ? 'Parent' : 'Baby-sitter'}</p>
                <p className="mt-2 text-sm text-slate-600">Complétez le formulaire pour finaliser votre compte.</p>
              </div>
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Retour
              </button>
            </div>
            <div className="space-y-4">
              <label htmlFor="signup-name" className="block text-sm font-semibold text-slate-700">Nom complet</label>
              <input id="signup-name" value={form.nom} onChange={handleChange('nom')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="Votre nom" required />
            </div>
            <div className="space-y-4">
              <label htmlFor="signup-email" className="block text-sm font-semibold text-slate-700">Email</label>
              <input id="signup-email" value={form.email} onChange={handleChange('email')} type="email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="exemple@mail.com" required />
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
            <div className="space-y-4">
              <label htmlFor="signup-phone" className="block text-sm font-semibold text-slate-700">Téléphone</label>
              <input id="signup-phone" value={form.phone} onChange={handleChange('phone')} type="tel" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="+216 9x xxx xxx" required />
            </div>
            <div className="space-y-4">
              <label htmlFor="signup-quartier" className="block text-sm font-semibold text-slate-700">Quartier</label>
              <input id="signup-quartier" value={form.quartier} onChange={handleChange('quartier')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="Ex : La Marsa" required />
            </div>
            {role === 'baby-sitter' && (
              <>
                <div className="space-y-4">
                  <label htmlFor="signup-experience" className="block text-sm font-semibold text-slate-700">Années d’expérience</label>
                  <input id="signup-experience" value={form.experience} onChange={handleChange('experience')} type="number" min="0" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="Ex : 4" required />
                </div>
                <div className="space-y-4">
                  <label htmlFor="signup-bio" className="block text-sm font-semibold text-slate-700">Votre proposition</label>
                  <textarea id="signup-bio" value={form.bio} onChange={handleChange('bio')} rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="Présentez-vous et votre approche." required />
                </div>
              </>
            )}
            {role === 'parent' && (
              <div className="md:col-span-2 space-y-4">
                <label htmlFor="signup-parent-message" className="block text-sm font-semibold text-slate-700">Message</label>
                <textarea id="signup-parent-message" value={form.bio} onChange={handleChange('bio')} rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200" placeholder="Décrivez brièvement votre besoin (facultatif)." />
              </div>
            )}
            {notice && <div className="md:col-span-2"><AuthNotice type="success">{notice}</AuthNotice></div>}
            <div className="md:col-span-2">
              <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-orange-600 px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-orange-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300">
                {isSubmitting ? 'Création du compte…' : 'Envoyer ma demande'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default SignupPage;
