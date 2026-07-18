import { useEffect, useState } from 'react';

const mockRequests = [
  { id: '1', parentName: 'Nadia', date: '2026-07-20', hour: '09:00', address: 'La Marsa', status: 'en attente' },
  { id: '2', parentName: 'Karim', date: '2026-07-21', hour: '16:00', address: 'Ariana', status: 'en attente' },
];

function BabysitterRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('confiSitBabysitterRequests');
    if (stored) {
      setRequests(JSON.parse(stored));
    } else {
      setRequests(mockRequests);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('confiSitBabysitterRequests', JSON.stringify(requests));
  }, [requests]);

  const updateStatus = (id, status) => {
    setRequests((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Demandes reçues</p>
      <h2 className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">Gérez les demandes de garde</h2>
      <div className="mt-6 space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-slate-100">{request.parentName}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{request.date} • {request.hour}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{request.address}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{request.status}</span>
            </div>
            {request.status === 'en attente' && (
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => updateStatus(request.id, 'acceptée')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Accepter</button>
                <button type="button" onClick={() => updateStatus(request.id, 'refusée')} className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white">Refuser</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BabysitterRequestsPage;
