import { useState } from 'react';

function SignupPage() {
  const [role, setRole] = useState('parent');
  const [form, setForm] = useState({ nom: '', email: '', phone: '', quartier: '', experience: '', bio: '' });

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Inscription ${role} enregistrée : ${form.nom}`);
  };

  return (
    <section className="space-y-10 py-10 lg:py-16">
      <div className="rounded-[36px] bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">Inscription</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Rejoignez Confi&apos;Sit en tant que parent ou baby-sitter.</h1>
          </div>
          <div className="rounded-full bg-slate-100 p-2 text-sm text-slate-500 shadow-sm">Role : <span className="font-semibold text-slate-900">{role}</span></div>
        </div>

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setRole('parent')}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${role === 'parent' ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
            >
              Parent
            </button>
            <button
              type="button"
              onClick={() => setRole('baby-sitter')}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition ${role === 'baby-sitter' ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
            >
              Baby-sitter
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 rounded-[32px] bg-white p-8 shadow-soft md:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Nom complet</label>
            <input value={form.nom} onChange={handleChange('nom')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Votre nom" required />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input value={form.email} onChange={handleChange('email')} type="email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="exemple@mail.com" required />
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
              <textarea value={form.bio} onChange={handleChange('bio')} rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="Décrivez votre besoin et votre contexte familial." required />
            </div>
          )}
          <div className="md:col-span-2">
            <button type="submit" className="w-full rounded-full bg-amber-500 px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-amber-600">Envoyer ma demande</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SignupPage;
