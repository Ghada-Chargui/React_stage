import { BadgeCheck } from 'lucide-react';

function UserTable({ users, selectedUserId, onSelect }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Rôle</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Vérifié</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={`cursor-pointer border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 ${selectedUserId === user.id ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`} onClick={() => onSelect(user)}>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{user.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.email}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.role}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.registeredAt}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{user.status}</span>
                </td>
                <td className="px-4 py-3">
                  {user.role === 'babysitter' ? (
                    user.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <BadgeCheck size={13} /> Vérifiée
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">Non vérifiée</span>
                    )
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTable;