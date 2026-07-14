import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthNotice from '../components/AuthNotice';
import PasswordInput from '../components/PasswordInput';

function LoginPage({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setCredentials((prev) => ({ ...prev, [field]: event.target.value }));
    if (error) setError(null);
    if (notice) setNotice(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);

    window.setTimeout(() => {
      const usersRaw = localStorage.getItem('confiSitUsers');
      const users = usersRaw ? JSON.parse(usersRaw) : {};
      const u = users[credentials.email];
      if (!u) {
        setError('Aucun compte trouvé pour cette adresse.');
        setIsSubmitting(false);
        return;
      }
      if (u.password !== credentials.password) {
        setError('Mot de passe incorrect.');
        setIsSubmitting(false);
        return;
      }

      const nextUser = { name: u.nom || u.name || 'Utilisateur', email: u.email, role: u.role };
      if (onLogin) onLogin(nextUser);
      setNotice('Connexion réussie, bienvenue !');
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <section className="py-8 sm:py-10 lg:py-16">
      <div className="mx-auto max-w-3xl rounded-[36px] bg-white p-5 shadow-soft sm:p-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-700">Connexion</p>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Se connecter à Confi&apos;Sit</h1>
          <p className="text-slate-600">Accédez à votre espace parent ou baby-sitter pour gérer vos recherches, demandes et profils en toute simplicité.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:mt-10 sm:gap-6">
          <div className="space-y-3">
            <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700">Email</label>
            <input
              id="login-email"
              type="email"
              value={credentials.email}
              onChange={handleChange('email')}
              required
              placeholder="exemple@mail.com"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <PasswordInput
            id="login-password"
            name="password"
            label="Mot de passe"
            value={credentials.password}
            onChange={handleChange('password')}
            placeholder="********"
            autoComplete="current-password"
            required
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-orange-600 px-6 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-orange-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300 sm:w-auto"
            >
              {isSubmitting ? 'Connexion…' : 'Se connecter'}
            </button>
            <Link to="/mot-de-passe-oublie" className="text-sm font-semibold text-orange-700 underline-offset-4 transition hover:text-orange-800 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
        {error && <div className="mt-6"><AuthNotice type="error">{error}</AuthNotice></div>}
        {notice && <div className="mt-6"><AuthNotice type="success">{notice}</AuthNotice></div>}

        <div className="mt-8 rounded-3xl bg-slate-50 p-5 text-slate-600 sm:p-6">
          <p className="text-sm font-semibold text-slate-900">Connexion factice</p>
          <p className="mt-2 text-sm">Cette page simule un accès utilisateur sans authentification réelle. Elle est prête à être connectée à un backend plus tard.</p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
