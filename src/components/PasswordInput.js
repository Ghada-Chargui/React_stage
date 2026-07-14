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
    <div className="space-y-3">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
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
          className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 pr-12 text-slate-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
        <button
          type="button"
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default PasswordInput;
