import { Link } from 'react-router-dom';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 p-2">
            <Logo size={40} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Confi&apos;Sit</p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Un service tunisien de mise en relation entre parents et baby-sitters de confiance, pensé pour la sérénité de vos familles.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link to="/recherche" className="text-slate-700 hover:text-slate-900">Trouver</Link>
          <Link to="/inscription" className="text-slate-700 hover:text-slate-900">S’inscrire</Link>
          <Link to="/comment-ca-marche" className="text-slate-700 hover:text-slate-900">Comment ça marche</Link>
        </div>
      </div>
      <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
        <span>© 2026 Confi&apos;Sit. Créé pour les familles tunisiennes avec soin.</span>
      </div>
    </footer>
  );
}

export default Footer;
