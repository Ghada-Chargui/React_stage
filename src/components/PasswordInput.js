import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 pr-14 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-500/30"
        />
        <button
          type="button"
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-all duration-300 hover:bg-slate-100 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:hover:bg-slate-700 dark:hover:text-orange-400 dark:text-slate-400"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default PasswordInput;
