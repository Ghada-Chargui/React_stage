import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, LayoutGrid, PieChart, ShieldAlert, Users, MessageSquareWarning, LogOut } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import ChartWidget from '../components/ChartWidget';
import UserTable from '../components/UserTable';
import UserDetailCard from '../components/UserDetailCard';
import ConfirmModal from '../components/ConfirmModal';
import ComplaintCard from '../components/ComplaintCard';
import { getAdminComplaints, saveAdminComplaints, initializeAdminDemoData } from '../data/adminMockData';
import { getRegisteredUsers, saveRegisteredUsers } from '../utils/storage';

const COLORS = ['#f59e0b', '#3b82f6', '#14b8a6', '#a855f7'];
const ROLE_COLORS = {
  Parents: '#f59e0b',
  Babysitters: '#3b82f6',
  Admin: '#14b8a6',
};
const COMPLAINT_COLORS = {
  'En attente': '#f59e0b',
  Traité: '#10b981',
};

function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [period, setPeriod] = useState('30');
  const [complaintStatus, setComplaintStatus] = useState('all');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    initializeAdminDemoData();
    const syncUsers = () => {
      const storedUsers = getRegisteredUsers();
      const storedComplaints = getAdminComplaints();
      setUsers(storedUsers);
      setComplaints(storedComplaints);
      if (storedUsers[0]) setSelectedUser(storedUsers[0]);
      if (storedComplaints[0]) setSelectedComplaint(storedComplaints[0]);
    };

    syncUsers();
    window.addEventListener('storage', syncUsers);
    window.addEventListener('confiSitDataChanged', syncUsers);
    return () => {
      window.removeEventListener('storage', syncUsers);
      window.removeEventListener('confiSitDataChanged', syncUsers);
    };
  }, []);

  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem('confiSitUser');
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const haystack = `${user.name} ${user.email}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [users, roleFilter, searchTerm]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => complaintStatus === 'all' || complaint.status === complaintStatus);
  }, [complaints, complaintStatus]);

  const summaryCards = [
    { label: 'Total parents', value: users.filter((user) => user.role === 'parent').length, icon: Users, detail: 'Comptes actifs et en attente' },
    { label: 'Total babysitters', value: users.filter((user) => user.role === 'babysitter').length, icon: ShieldAlert, detail: 'Profils disponibles' },
    { label: 'Réservations', value: '24', icon: BarChart3, detail: 'Sur la période sélectionnée' },
    { label: 'Réclamations en attente', value: complaints.filter((item) => item.status === 'En attente').length, icon: MessageSquareWarning, detail: 'À traiter rapidement' },
  ];

  const insightData = useMemo(() => {
    const months = [
      { month: 'Jan', parents: 4, sitters: 2, reservations: 5, complaints: 1 },
      { month: 'Fév', parents: 5, sitters: 3, reservations: 7, complaints: 2 },
      { month: 'Mar', parents: 7, sitters: 4, reservations: 8, complaints: 2 },
      { month: 'Avr', parents: 8, sitters: 4, reservations: 9, complaints: 1 },
      { month: 'Mai', parents: 9, sitters: 5, reservations: 10, complaints: 2 },
      { month: 'Jun', parents: 10, sitters: 6, reservations: 12, complaints: 2 },
    ];

    if (period === '7') return months.slice(-3);
    if (period === '365') return months;
    return months.slice(-4);
  }, [period]);

  const roleDistribution = [
    { name: 'Parents', value: users.filter((user) => user.role === 'parent').length },
    { name: 'Babysitters', value: users.filter((user) => user.role === 'babysitter').length },
    { name: 'Admin', value: users.filter((user) => user.role === 'admin').length },
  ];

  const complaintDistribution = [
    { name: 'En attente', value: complaints.filter((item) => item.status === 'En attente').length },
    { name: 'Traité', value: complaints.filter((item) => item.status === 'Traité').length },
  ];

  const handleSaveUser = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextUser = {
      ...editingUser,
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      status: formData.get('status'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      notes: formData.get('notes') || '',
      hourlyRate: formData.get('hourlyRate') || editingUser.hourlyRate,
      experience: formData.get('experience') || editingUser.experience,
      zone: formData.get('zone') || editingUser.zone,
      availability: formData.get('availability')?.split(',').map((item) => item.trim()).filter(Boolean) || editingUser.availability,
      childrenCount: formData.get('childrenCount') || editingUser.childrenCount,
      bio: formData.get('bio') || editingUser.bio,
    };

    const updatedUsers = users.map((user) => (user.id === nextUser.id ? nextUser : user));
    setUsers(updatedUsers);
    saveRegisteredUsers(updatedUsers);
    setEditingUser(null);
    setSelectedUser(nextUser);
  };

  const handleDeleteUser = () => {
    const remaining = users.filter((user) => user.id !== selectedUser.id);
    setUsers(remaining);
    saveRegisteredUsers(remaining);
    setSelectedUser(remaining[0] || null);
    setEditingUser(null);
    setIsConfirmOpen(false);
  };

  const handleSaveComplaint = (event) => {
    event.preventDefault();
    const nextComplaints = complaints.map((item) => (item.id === selectedComplaint.id ? { ...item, status: complaintStatus, note: feedback || item.note } : item));
    setComplaints(nextComplaints);
    saveAdminComplaints(nextComplaints);
  };

  const handleLogout = () => {
    localStorage.removeItem('confiSitUser');
    navigate('/connexion');
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setEditingUser(null);
  };

  const handleSelectComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setComplaintStatus(complaint.status);
    setFeedback(complaint.note || '');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="space-y-2">
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Administration</p>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Bonjour {currentUser?.name || 'Admin'}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Supervision des utilisateurs et des réclamations.</p>
        </div>
        <nav className="mt-8 space-y-2">
          {[
            { to: '/espace-admin', label: 'Tableau de bord', icon: LayoutGrid },
            { to: '/espace-admin/statistiques', label: 'Statistiques', icon: PieChart },
            { to: '/espace-admin/profils', label: 'Profils', icon: Users },
            { to: '/espace-admin/reclamations', label: 'Réclamations', icon: ShieldAlert },
          ].map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/espace-admin'} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={handleLogout} className="mt-8 flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      <div className="space-y-6">
        {location.pathname === '/espace-admin' ? (
          <section className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-8 text-white shadow-[0_20px_60px_rgba(249,115,22,0.2)]">
              <p className="text-sm uppercase tracking-[0.3em]">Bienvenue</p>
              <h2 className="mt-3 text-3xl font-extrabold">Tableau de bord admin</h2>
              <p className="mt-3 max-w-2xl text-sm text-orange-50">Surveillez la santé globale de la plateforme, les profils et les incidents de façon centralisée.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <StatCard key={card.label} icon={card.icon} label={card.label} value={card.value} detail={card.detail} />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
              <ChartWidget title="Évolution des inscriptions" description="Parents vs babysitters">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={insightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="parents" stroke="#f59e0b" strokeWidth={3} />
                      <Line type="monotone" dataKey="sitters" stroke="#fb923c" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartWidget>

              <ChartWidget title="Répartition des rôles" description="Parents, babysitters et administrateurs">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={roleDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                        {roleDistribution.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={ROLE_COLORS[entry.name] || COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </ChartWidget>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
              <ChartWidget title="Réservations par mois" description="Volume mensuel de réservations">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Bar dataKey="reservations" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartWidget>

              <ChartWidget title="Réclamations" description="État des signalements">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={complaintDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                        {complaintDistribution.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={COMPLAINT_COLORS[entry.name] || COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </ChartWidget>
            </div>
          </section>
        ) : null}

        {location.pathname === '/espace-admin/statistiques' ? (
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-600">Statistiques détaillées</p>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Analyse de la plateforme</h2>
                </div>
                <div className="flex gap-2">
                  {['7', '30', '365'].map((value) => (
                    <button key={value} type="button" onClick={() => setPeriod(value)} className={`rounded-full px-4 py-2 text-sm font-semibold ${period === value ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {value === '7' ? '7 jours' : value === '30' ? '30 jours' : 'Année'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <ChartWidget title="Inscriptions mensuelles" description="Parents et babysitters">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={insightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="parents" stroke="#f59e0b" />
                      <Line type="monotone" dataKey="sitters" stroke="#fb923c" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartWidget>
              <ChartWidget title="Réservations par mois" description="Volume mensuel">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Bar dataKey="reservations" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartWidget>
            </div>
          </section>
        ) : null}

        {location.pathname === '/espace-admin/profils' ? (
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-600">Gestion des profils</p>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Liste des utilisateurs</h2>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Rechercher nom ou email" className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
                  <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                    <option value="all">Tous les rôles</option>
                    <option value="parent">Parent</option>
                    <option value="babysitter">Babysitter</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <UserTable users={filteredUsers} selectedUserId={selectedUser?.id} onSelect={handleSelectUser} />
              <div className="space-y-6">
                <UserDetailCard user={selectedUser} onEdit={() => setEditingUser(selectedUser)} />
                {editingUser ? (
                  <form onSubmit={handleSaveUser} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nom<input name="name" defaultValue={editingUser.name} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email<input name="email" defaultValue={editingUser.email} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Rôle<select name="role" defaultValue={editingUser.role} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"><option value="parent">Parent</option><option value="babysitter">Babysitter</option><option value="admin">Admin</option></select></label>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Statut<select name="status" defaultValue={editingUser.status} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"><option value="Actif">Actif</option><option value="En attente">En attente</option><option value="Suspendu">Suspendu</option></select></label>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Téléphone<input name="phone" defaultValue={editingUser.phone} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Adresse<input name="address" defaultValue={editingUser.address} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                      {editingUser.role === 'parent' ? (
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Enfants<input name="childrenCount" defaultValue={editingUser.childrenCount} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                      ) : (
                        <>
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Taux horaire<input name="hourlyRate" defaultValue={editingUser.hourlyRate} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Expérience<input name="experience" defaultValue={editingUser.experience} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Zone<input name="zone" defaultValue={editingUser.zone} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Disponibilités<input name="availability" defaultValue={editingUser.availability?.join(', ')} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                        </>
                      )}
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">Notes<textarea name="notes" defaultValue={editingUser.notes || ''} className="mt-2 min-h-20 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 md:col-span-2">Bio<textarea name="bio" defaultValue={editingUser.bio || ''} className="mt-2 min-h-20 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button type="submit" className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white">Sauvegarder</button>
                      <button type="button" onClick={() => setEditingUser(null)} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-300">Annuler</button>
                      <button type="button" onClick={() => setIsConfirmOpen(true)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Supprimer</button>
                    </div>
                  </form>
                ) : null}
              </div>
            </div>
            <ConfirmModal isOpen={isConfirmOpen} title="Confirmer la suppression" message="Cette action supprimera définitivement le profil du stockage local." onCancel={() => setIsConfirmOpen(false)} onConfirm={handleDeleteUser} />
          </section>
        ) : null}

        {location.pathname === '/espace-admin/reclamations' ? (
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-600">Gestion des réclamations</p>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Liste des signalements</h2>
                </div>
                <select value={complaintStatus} onChange={(event) => setComplaintStatus(event.target.value)} className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <option value="all">Tous les statuts</option>
                  <option value="En attente">En attente</option>
                  <option value="Traité">Traité</option>
                </select>
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} onSelect={() => handleSelectComplaint(complaint)} />)}
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                {selectedComplaint ? (
                  <form onSubmit={handleSaveComplaint} className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-600">Détail</p>
                      <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-100">{selectedComplaint.subject}</h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedComplaint.message}</p>
                    </div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Statut<select value={complaintStatus} onChange={(event) => setComplaintStatus(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800"><option value="En attente">En attente</option><option value="Traité">Traité</option></select></label>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Note interne<textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" /></label>
                    <button type="submit" className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white">Sauvegarder</button>
                  </form>
                ) : <p className="text-sm text-slate-500">Sélectionnez une réclamation.</p>}
              </div>
            </div>
          </section>
        ) : null}

        <Outlet />
      </div>
    </div>
  );
}

export default AdminPage;
