import { useCallback, useEffect, useState } from 'react';
import { Bell, Check, Clock, X } from 'lucide-react';
import apiServiceNotification from '../services/apiServiceNotification';

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getAdminId = () => {
    try {
      const storedUser = localStorage.getItem('confiSitUser');

      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);

      if (!user?.id) {
        return null;
      }

      return Number(user.id);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de l’administrateur :',
        error
      );

      return null;
    }
  };

  const loadNotifications = useCallback(async () => {
    const adminId = getAdminId();

    if (!adminId) {
      return;
    }

    try {
      setLoading(true);

      const data =
        await apiServiceNotification.getNotifications(adminId);

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        'Erreur lors du chargement des notifications :',
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    /*
     * Vérification périodique pour récupérer
     * les nouvelles notifications.
     */
    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

  const unreadCount = notifications.filter(
    (notification) => !notification.lu
  ).length;

  const handleMarkAsRead = async (notification) => {
    if (notification.lu) {
      return;
    }

    try {
      await apiServiceNotification.marquerCommeLue(
        notification.id
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? { ...item, lu: true }
            : item
        )
      );
    } catch (error) {
      console.error(
        'Erreur lors du marquage de la notification :',
        error
      );
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return '';
    }

    try {
      return new Date(date).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          <Bell size={18} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </span>

        <span>Notifications</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[340px] max-w-[calc(100vw-2rem)] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-orange-600">
                Centre
              </p>

              <h3 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Notifications
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Chargement...
              </p>
            ) : notifications.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-center dark:bg-slate-800">
                <Bell
                  size={25}
                  className="mx-auto text-slate-400"
                />

                <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Aucune notification
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() =>
                    handleMarkAsRead(notification)
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    notification.lu
                      ? 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                      : 'border-orange-200 bg-orange-50 dark:border-orange-900/40 dark:bg-orange-900/10'
                  }`}
                >
                  <div className="flex gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        notification.lu
                          ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300'
                      }`}
                    >
                      {notification.lu ? (
                        <Check size={17} />
                      ) : (
                        <Bell size={17} />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {notification.message}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>
                          {formatDate(notification.dateEnvoi)}
                        </span>
                      </div>

                      {!notification.lu && (
                        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.15em] text-orange-600">
                          Nouvelle notification
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;