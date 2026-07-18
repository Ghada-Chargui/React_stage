import { Link } from 'react-router-dom';
import Logo from './Logo';

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-gradient-to-br from-white to-amber-50 py-16 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-2.5 shadow-[0_10px_30px_rgba(249,115,22,0.1)] dark:from-amber-900/30 dark:to-orange-900/30">
            <Logo size={44} />
          </div>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Confi&apos;Sit</p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">Un service tunisien de mise en relation entre parents et baby-sitters de confiance, pensé pour la sérénité de vos familles.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link to="/inscription" className="text-slate-700 font-semibold transition-all duration-300 hover:text-orange-700 hover:underline dark:text-slate-200 dark:hover:text-orange-400">S’inscrire</Link>
        </div>
      </div>
      <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        <span className="font-medium">© 2026 Confi&apos;Sit. Créé pour les familles tunisiennes avec soin.</span>
      </div>
    </footer>
  );
}

export default Footer;
