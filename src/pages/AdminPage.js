import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, LayoutGrid, PieChart, ShieldAlert, Users, MessageSquareWarning, LogOut, Wallet, BadgeCheck, Activity, UserPlus, CalendarPlus, Clock, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import ChartWidget from '../components/ChartWidget';
import UserTable from '../components/UserTable';
import UserDetailCard from '../components/UserDetailCard';
import ConfirmModal from '../components/ConfirmModal';
import ComplaintCard from '../components/ComplaintCard';
import { getAdminComplaints, saveAdminComplaints, initializeAdminDemoData } from '../data/adminMockData';
import { getRegisteredUsers, saveRegisteredUsers, getReservations, toggleUserVerification } from '../utils/storage';

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

const relativeDate = (dateStr) => {
  if (!dateStr) return '';
  const diffDays = Math.round((new Date().setHours(0, 0, 0, 0) - new Date(dateStr).setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays <= 0) return 'Aujourd’hui';
  if (diffDays === 1) return 'Hier';
  return `Il y a ${diffDays} jours`;
};

function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('');
  const [minRatingFilter, setMinRatingFilter] = useState('0');
  const [accountStatusFilter, setAccountStatusFilter] = useState('all');
  const [period, setPeriod] = useState('30');
  const [complaintFilter, setComplaintFilter] = useState('all');
  const [draftStatus, setDraftStatus] = useState('En attente');
  const [draftPriority, setDraftPriority] = useState('Normale');
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    initializeAdminDemoData();
    const syncData = () => {
      const storedUsers = getRegisteredUsers();
      const storedComplaints = getAdminComplaints();
      const storedReservations = getReservations();
      setUsers(storedUsers);
      setComplaints(storedComplaints);
      setReservations(storedReservations);
      setSelectedUser((current) => current || storedUsers[0] || null);
      setSelectedComplaint((current) => current || storedComplaints[0] || null);
    };

    syncData();
    window.addEventListener('storage', syncData);
    window.addEventListener('confiSitDataChanged', syncData);
    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('confiSitDataChanged', syncData);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/espace-admin/profils' && location.state?.focusEmail && users.length) {
      const match = users.find((user) => user.email === location.state.focusEmail);
      if (match) setSelectedUser(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, users]);

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
      const matchesZone = !zoneFilter || (user.zone || user.address || '').toLowerCase().includes(zoneFilter.toLowerCase());
      const matchesRating = Number(user.rating || 0) >= Number(minRatingFilter);
      const matchesStatus = accountStatusFilter === 'all' || user.status === accountStatusFilter;
      return matchesRole && matchesSearch && matchesZone && matchesRating && matchesStatus;
    });
  }, [users, roleFilter, searchTerm, zoneFilter, minRatingFilter, accountStatusFilter]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => complaintFilter === 'all' || complaint.status === complaintFilter);
  }, [complaints, complaintFilter]);

  const babysitters = useMemo(() => users.filter((user) => user.role === 'babysitter'), [users]);

  const topBabysitters = useMemo(() => {
    return babysitters
      .map((sitter) => ({
        ...sitter,
        reservationCount: reservations.filter((item) => item.sitterEmail === sitter.email).length,
      }))
      .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0) || b.reservationCount - a.reservationCount)
      .slice(0, 5);
  }, [babysitters, reservations]);

  const acceptanceStats = useMemo(() => {
    return babysitters
      .map((sitter) => {
        const answered = reservations.filter((item) => item.sitterEmail === sitter.email && ['confirmée', 'refusée', 'terminée'].includes(item.status));
        const accepted = answered.filter((item) => item.status !== 'refusée').length;
        const rate = answered.length ? Math.round((accepted / answered.length) * 100) : null;
        return { ...sitter, answered: answered.length, accepted, rate };
      })
      .filter((sitter) => sitter.answered > 0)
      .sort((a, b) => (b.rate || 0) - (a.rate || 0));
  }, [babysitters, reservations]);

  const simulatedRevenue = useMemo(() => {
    return reservations
      .filter((item) => item.status === 'terminée')
      .reduce((sum, item) => {
        const sitter = users.find((user) => user.email === item.sitterEmail);
        const rate = Number(sitter?.hourlyRate) || 35;
        const hours = parseInt(item.duration, 10) || 1;
        return sum + rate * hours * 0.1;
      }, 0);
  }, [reservations, users]);

  const pendingVerificationCount = useMemo(() => babysitters.filter((sitter) => !sitter.verified).length, [babysitters]);

  const complaintResponseTime = useMemo(() => {
    const resolved = complaints.filter((item) => item.resolvedAt && item.date);
    if (!resolved.length) return null;
    const totalDays = resolved.reduce((sum, item) => sum + Math.max(0, (new Date(item.resolvedAt) - new Date(item.date)) / 86400000), 0);
    return (totalDays / resolved.length).toFixed(1);
  }, [complaints]);

  const recentActivity = useMemo(() => {
    const items = [
      ...users.map((user) => ({ type: 'inscription', label: `${user.name} s’est inscrit(e) en tant que ${user.role}`, date: user.registeredAt, icon: UserPlus })),
      ...complaints.map((item) => ({ type: 'reclamation', label: `Réclamation reçue : "${item.subject}" (${item.userName})`, date: item.date, icon: MessageSquareWarning })),
      ...reservations.map((item) => ({ type: 'reservation', label: `${item.parentName || 'Un parent'} a réservé ${item.sitterName || 'une babysitter'}`, date: item.date, icon: CalendarPlus })),
    ];
    return items
      .filter((item) => item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [users, complaints, reservations]);

  const summaryCards = [
    { label: 'Total parents', value: users.filter((user) => user.role === 'parent').length, icon: Users, detail: 'Comptes actifs et en attente' },
    { label: 'Total babysitters', value: users.filter((user) => user.role === 'babysitter').length, icon: ShieldAlert, detail: 'Profils disponibles' },
    { label: 'Réservations', value: reservations.length, icon: BarChart3, detail: 'Toutes périodes confondues' },
    { label: 'Réclamations en attente', value: complaints.filter((item) => item.status === 'En attente').length, icon: MessageSquareWarning, detail: 'À traiter rapidement' },
    { label: 'Revenu simulé (10%)', value: `${simulatedRevenue.toFixed(0)} TND`, icon: Wallet, detail: 'Sur les gardes terminées' },
    { label: 'Babysitters à vérifier', value: pendingVerificationCount, icon: BadgeCheck, detail: 'Profils en attente de validation' },
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

  const handleToggleVerify = (user) => {
    const updated = toggleUserVerification(user.email);
    if (!updated) return;
    const nextUsers = users.map((item) => (item.email === user.email ? updated : item));
    setUsers(nextUsers);
    setSelectedUser(updated);
  };

  const handleSaveComplaint = (event) => {
    event.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const nextMessages = replyText.trim()
      ? [...(selectedComplaint.messages || []), { author: 'Support', text: replyText.trim(), date: today }]
      : (selectedComplaint.messages || []);

    const nextComplaints = complaints.map((item) => {
      if (item.id !== selectedComplaint.id) return item;
      return {
        ...item,
        status: draftStatus,
        priority: draftPriority,
        messages: nextMessages,
        resolvedAt: draftStatus === 'Traité' ? (item.resolvedAt || today) : (draftStatus === 'En attente' ? null : item.resolvedAt),
      };
    });
    setComplaints(nextComplaints);
    saveAdminComplaints(nextComplaints);
    setSelectedComplaint(nextComplaints.find((item) => item.id === selectedComplaint.id));
    setReplyText('');
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
    setDraftStatus(complaint.status);
    setDraftPriority(complaint.priority || 'Normale');
    setReplyText('');
  };

  const handleViewComplaintProfile = () => {
    const matchedUser = users.find((user) => user.name === selectedComplaint?.userName);
    if (matchedUser) {
      navigate('/espace-admin/profils', { state: { focusEmail: matchedUser.email } });
    }
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

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  <Activity size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Activité récente</p>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Ce qui vient de se passer</h3>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Aucune activité récente.</p>
                ) : recentActivity.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={`${item.type}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                          <Icon size={14} />
                        </span>
                        <p className="text-sm text-slate-700 dark:text-slate-200">{item.label}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{relativeDate(item.date)}</span>
                    </div>
                  );
                })}
              </div>
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

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"><TrendingUp size={18} /></span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Classement</p>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Top babysitters</h3>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {topBabysitters.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Aucune babysitter enregistrée.</p>
                  ) : topBabysitters.map((sitter, index) => (
                    <div key={sitter.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-extrabold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">#{index + 1}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{sitter.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{sitter.reservationCount} réservation(s)</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-amber-700">★ {sitter.rating || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"><ShieldAlert size={18} /></span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Fiabilité</p>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Taux d’acceptation des demandes</h3>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {acceptanceStats.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Aucune demande traitée pour le moment.</p>
                  ) : acceptanceStats.map((sitter) => (
                    <div key={sitter.id} className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{sitter.name}</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{sitter.accepted}/{sitter.answered} ({sitter.rate}%)</span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className={`h-full rounded-full ${sitter.rate >= 70 ? 'bg-emerald-500' : sitter.rate >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${sitter.rate}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"><Clock size={18} /></span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Support</p>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Délai moyen de traitement</h3>
                  </div>
                </div>
                <p className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{complaintResponseTime !== null ? `${complaintResponseTime} j` : '—'}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Entre le dépôt d’une réclamation et son passage à "Traité".</p>
              </div>
              <ChartWidget title="Réclamations" description="État des signalements">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={complaintDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
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

        {location.pathname === '/espace-admin/profils' ? (
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-600">Gestion des profils</p>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Liste des utilisateurs</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Rechercher nom ou email" className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
                  <input value={zoneFilter} onChange={(event) => setZoneFilter(event.target.value)} placeholder="Zone géographique" className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
                  <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                    <option value="all">Tous les rôles</option>
                    <option value="parent">Parent</option>
                    <option value="babysitter">Babysitter</option>
                    <option value="admin">Admin</option>
                  </select>
                  <select value={minRatingFilter} onChange={(event) => setMinRatingFilter(event.target.value)} className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                    <option value="0">Toutes les notes</option>
                    <option value="3">★ 3 et plus</option>
                    <option value="4">★ 4 et plus</option>
                    <option value="4.5">★ 4.5 et plus</option>
                  </select>
                  <select value={accountStatusFilter} onChange={(event) => setAccountStatusFilter(event.target.value)} className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                    <option value="all">Tous les statuts</option>
                    <option value="Actif">Actif</option>
                    <option value="En attente">En attente</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <UserTable users={filteredUsers} selectedUserId={selectedUser?.id} onSelect={handleSelectUser} />
              <div className="space-y-6">
                <UserDetailCard user={selectedUser} onEdit={() => setEditingUser(selectedUser)} onToggleVerify={handleToggleVerify} />
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
                <select value={complaintFilter} onChange={(event) => setComplaintFilter(event.target.value)} className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
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
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-orange-600">Détail</p>
                        <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-100">{selectedComplaint.subject}</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Déposée par {selectedComplaint.userName} le {selectedComplaint.date}</p>
                      </div>
                      <button type="button" onClick={handleViewComplaintProfile} className="shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
                        Voir le profil
                      </button>
                    </div>

                    <div className="space-y-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Fil de discussion</p>
                      {(selectedComplaint.messages || []).map((msg, index) => (
                        <div key={index} className={`rounded-2xl p-3 text-sm ${msg.author === 'Support' ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-slate-900'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">{msg.author}</span>
                            <span className="text-xs text-slate-400">{msg.date}</span>
                          </div>
                          <p className="mt-1 text-slate-600 dark:text-slate-300">{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSaveComplaint} className="space-y-4">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        Répondre
                        <textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} rows="3" placeholder="Votre réponse au parent ou à la babysitter..." className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800" />
                      </label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Statut
                          <select value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                            <option value="En attente">En attente</option>
                            <option value="Traité">Traité</option>
                          </select>
                        </label>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Priorité
                          <select value={draftPriority} onChange={(event) => setDraftPriority(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                            <option value="Normale">Normale</option>
                            <option value="Urgente">Urgente</option>
                          </select>
                        </label>
                      </div>
                      <button type="submit" className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white">Enregistrer</button>
                    </form>
                  </div>
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