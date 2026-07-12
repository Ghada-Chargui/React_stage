import { useMemo } from 'react';

function AuthTabs({ mode, setMode }) {
  const tabs = useMemo(
    () => [
      { key: 'login', label: 'Connexion' },
      { key: 'signup', label: 'Inscription' },
    ],
    []
  );

  return (
    <div className="grid gap-2 rounded-full bg-slate-200 p-1 shadow-sm sm:inline-flex">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => setMode(tab.key)}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition ${mode === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AuthTabs;
