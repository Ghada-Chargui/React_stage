import { useState } from 'react';

function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (field) => (event) => {
    setCredentials((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const usersRaw = localStorage.getItem('confiSitUsers');
    const users = usersRaw ? JSON.parse(usersRaw) : {};
    const u = users[credentials.email];
    if (!u) {
      setError('Aucun compte trouvé pour cette adresse.');
      return;
    }
    if (u.password !== credentials.password) {
      setError('Mot de passe incorrect.');
      return;
    }

    // login
    if (onLogin) onLogin({ name: u.nom || u.name || 'Utilisateur', email: u.email, role: u.role });
  };

  return (
    <section className="py-10 lg:py-16">
      <div className="mx-auto max-w-3xl rounded-[36px] bg-white p-8 shadow-soft">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">Connexion</p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Se connecter à Confi&apos;Sit</h1>
          <p className="text-slate-600">Accédez à votre espace parent ou baby-sitter pour gérer vos recherches, demandes et profils en toute simplicité.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={handleChange('email')}
              required
              placeholder="exemple@mail.com"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Mot de passe</label>
            <input
              type="password"
              value={credentials.password}
              onChange={handleChange('password')}
              required
              placeholder="********"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <button type="submit" className="rounded-full bg-amber-500 px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-amber-600">
            Se connecter
          </button>
        </form>
        {error && <div className="mt-6 rounded-md bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="mt-8 rounded-3xl bg-slate-50 p-6 text-slate-600">
          <p className="text-sm font-semibold text-slate-900">Connexion factice</p>
          <p className="mt-2 text-sm">Cette page simule un accès utilisateur sans authentification réelle. Elle est prête à être connectée à un backend plus tard.</p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
