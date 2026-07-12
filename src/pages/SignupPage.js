import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage({ onSignup }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [step, setStep] = useState('choose');
  const [form, setForm] = useState({ nom: '', email: '', phone: '', quartier: '', experience: '', bio: '', password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});

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
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // client-side validation
    const e = {};
    if (!form.password || form.password.length < 8) e.password = 'Le mot de passe doit contenir au moins 8 caractères.';
    if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Les mots de passe ne correspondent pas.';
    setErrors(e);
    if (Object.keys(e).length) return;

    const user = { nom: form.nom, email: form.email, phone: form.phone, quartier: form.quartier, experience: form.experience, bio: form.bio, password: form.password, role };

    // persist in users map
    const usersRaw = localStorage.getItem('confiSitUsers');
    const users = usersRaw ? JSON.parse(usersRaw) : {};
    users[user.email] = user;
    localStorage.setItem('confiSitUsers', JSON.stringify(users));

    // optional: set as current user
    // localStorage.setItem('confiSitUser', JSON.stringify(user));

    // call parent onSignup to update app state if provided
    if (onSignup) onSignup({ name: user.nom, email: user.email, role: user.role });

    // redirect to connexion
    navigate('/connexion');
  };

  return (
    <section className="space-y-10 py-10 lg:py-16">
      <div className="rounded-[36px] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">Inscription</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Rejoignez Confi&apos;Sit en tant que parent ou baby-sitter.</h1>
            <p className="mt-3 text-sm text-slate-600">Choisissez votre profil pour afficher le bon formulaire.</p>
          </div>
          <div className="rounded-full bg-slate-100 p-2 text-sm text-slate-500 shadow-sm">
            Role : <span className="font-semibold text-slate-900">{role ?? 'À choisir'}</span>
          </div>
        </div>

        {step === 'choose' && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('parent')}
              className="group rounded-[32px] border border-slate-200 bg-white p-6 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src="/images/parent.jpg"
                alt="Parent avec bébé"
                className="h-64 w-full rounded-3xl object-cover"
              />
              <div className="mt-5">
                <p className="text-sm uppercase tracking-[0.28em] text-amber-600">Parent</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Je cherche une baby-sitter</h2>
                <p className="mt-3 text-slate-600">Créez un compte pour publier vos demandes et consulter des profils fiables.</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('baby-sitter')}
              className="group rounded-[32px] border border-slate-200 bg-white p-6 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src="/images/babysitter.jpg"
                alt="Baby-sitter souriante"
                className="h-64 w-full rounded-3xl object-cover"
              />
              <div className="mt-5">
                <p className="text-sm uppercase tracking-[0.28em] text-amber-600">Baby-sitter</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Je propose mes services</h2>
                <p className="mt-3 text-slate-600">Rejoignez la communauté et trouvez des familles près de chez vous.</p>
              </div>
            </button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="mt-8 grid gap-6 rounded-[32px] bg-white p-8 shadow-soft md:grid-cols-2">
            <div className="md:col-span-2 flex items-center justify-between gap-4 rounded-[28px] bg-amber-50 p-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">Inscription {role === 'parent' ? 'Parent' : 'Baby-sitter'}</p>
                <p className="mt-2 text-sm text-slate-600">Complétez le formulaire pour finaliser votre compte.</p>
              </div>
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Retour
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Nom complet</label>
              <input value={form.nom} onChange={handleChange('nom')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Votre nom" required />
            </div>
            <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input value={form.email} onChange={handleChange('email')} type="email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="exemple@mail.com" required />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Mot de passe</label>
            <input value={form.password} onChange={handleChange('password')} type="password" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Au moins 8 caractères" required />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Confirmation du mot de passe</label>
            <input value={form.passwordConfirm} onChange={handleChange('passwordConfirm')} type="password" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Confirmez le mot de passe" required />
            {errors.passwordConfirm && <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>}
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Téléphone</label>
            <input value={form.phone} onChange={handleChange('phone')} type="tel" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="+216 9x xxx xxx" required />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Quartier</label>
            <input value={form.quartier} onChange={handleChange('quartier')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Ex : La Marsa" required />
          </div>
          {role === 'baby-sitter' && (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Années d’expérience</label>
                <input value={form.experience} onChange={handleChange('experience')} type="number" min="0" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Ex : 4" required />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Votre proposition</label>
                <textarea value={form.bio} onChange={handleChange('bio')} rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Présentez-vous et votre approche." required />
              </div>
            </>
          )}
          {role === 'parent' && (
            <div className="md:col-span-2 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Message</label>
              <textarea value={form.bio} onChange={handleChange('bio')} rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Décrivez brièvement votre besoin (facultatif)." />
            </div>
          )}
          <div className="md:col-span-2">
            <button type="submit" className="w-full rounded-full bg-amber-500 px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-amber-600">Envoyer ma demande</button>
          </div>
        </form>
        )}
      </div>

    </section>
  );
}

export default SignupPage;
