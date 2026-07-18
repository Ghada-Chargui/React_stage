function UserDetailCard({ user, onEdit }) {
  if (!user) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-600">Profil</p>
          <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-100">{user.name}</h3>
        </div>
        <button type="button" onClick={onEdit} className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white">
          Modifier
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Coordonnées</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <li><span className="font-semibold">Email:</span> {user.email}</li>
            <li><span className="font-semibold">Téléphone:</span> {user.phone}</li>
            <li><span className="font-semibold">Adresse:</span> {user.address}</li>
            <li><span className="font-semibold">Date d’inscription:</span> {user.registeredAt}</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Infos spécifiques</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {user.role === 'parent' ? (
              <>
                <li><span className="font-semibold">Enfants:</span> {user.childrenCount}</li>
                <li><span className="font-semibold">Notes:</span> {user.notes}</li>
              </>
            ) : (
              <>
                <li><span className="font-semibold">Taux horaire:</span> {user.hourlyRate} TND</li>
                <li><span className="font-semibold">Expérience:</span> {user.experience} ans</li>
                <li><span className="font-semibold">Zone:</span> {user.zone}</li>
                <li><span className="font-semibold">Disponibilités:</span> {user.availability?.join(', ')}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserDetailCard;
