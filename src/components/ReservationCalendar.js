import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES_FR, WEEKDAY_NAMES_FR, buildMonthGrid, toDateKey, todayKey } from '../utils/calendarUtils';

const STATUS_DOT_COLOR = {
  'en attente': 'bg-amber-500',
  'confirmée': 'bg-sky-500',
  'refusée': 'bg-red-500',
  'terminée': 'bg-emerald-500',
  'annulée': 'bg-slate-400',
};

/**
 * Affiche un calendrier mensuel avec un point coloré par réservation
 * présente ce jour-là (couleur selon le statut). Cliquer sur un jour
 * affiche le détail des réservations de ce jour dans le panneau de droite.
 *
 * Props :
 * - reservations : liste d'objets avec au moins { date: 'YYYY-MM-DD', status }
 * - renderReservation(reservation) : fonction de rendu pour une réservation
 *   sélectionnée (permet de réutiliser les mêmes cartes que la vue liste)
 * - nameField : 'sitterName' (côté parent) ou 'parentName' (côté babysitter),
 *   utilisé uniquement pour l'infobulle du point
 */
function ReservationCalendar({ reservations, renderReservation, nameField = 'sitterName' }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState(todayKey());

  const days = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor]);

  const reservationsByDay = useMemo(() => {
    const map = {};
    reservations.forEach((reservation) => {
      if (!reservation.date) return;
      if (!map[reservation.date]) map[reservation.date] = [];
      map[reservation.date].push(reservation);
    });
    return map;
  }, [reservations]);

  const selectedReservations = reservationsByDay[selectedDay] || [];

  const goToPrevMonth = () => {
    setCursor((current) => {
      const month = current.month === 0 ? 11 : current.month - 1;
      const year = current.month === 0 ? current.year - 1 : current.year;
      return { year, month };
    });
  };

  const goToNextMonth = () => {
    setCursor((current) => {
      const month = current.month === 11 ? 0 : current.month + 1;
      const year = current.month === 11 ? current.year + 1 : current.year;
      return { year, month };
    });
  };

  const goToToday = () => {
    const now = new Date();
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedDay(todayKey());
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {MONTH_NAMES_FR[cursor.month]} {cursor.year}
          </h3>
          <div className="flex items-center gap-2">
            <button type="button" onClick={goToToday} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Aujourd’hui
            </button>
            <button type="button" onClick={goToPrevMonth} aria-label="Mois précédent" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              <ChevronLeft size={16} />
            </button>
            <button type="button" onClick={goToNextMonth} aria-label="Mois suivant" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          {WEEKDAY_NAMES_FR.map((day) => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map(({ date, key, isCurrentMonth }) => {
            const dayReservations = reservationsByDay[key] || [];
            const isToday = key === todayKey();
            const isSelected = key === selectedDay;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(key)}
                className={`flex min-h-[64px] flex-col items-start gap-1 rounded-2xl border p-2 text-left transition ${
                  isSelected
                    ? 'border-orange-400 bg-orange-50 dark:border-orange-500/50 dark:bg-orange-900/20'
                    : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                } ${!isCurrentMonth ? 'opacity-40' : ''}`}
              >
                <span className={`text-sm font-semibold ${isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                  {date.getDate()}
                </span>
                {dayReservations.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {dayReservations.slice(0, 4).map((reservation) => (
                      <span
                        key={reservation.id}
                        title={reservation[nameField]}
                        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_COLOR[reservation.status] || 'bg-slate-400'}`}
                      />
                    ))}
                    {dayReservations.length > 4 && (
                      <span className="text-[10px] font-semibold text-slate-400">+{dayReservations.length - 4}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {Object.entries({
            'en attente': 'En attente',
            'confirmée': 'Confirmée',
            'refusée': 'Refusée',
            'terminée': 'Terminée',
            'annulée': 'Annulée',
          }).map(([status, label]) => (
            <span key={status} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${STATUS_DOT_COLOR[status]}`} /> {label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">
          {new Date(selectedDay).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <div className="mt-4 space-y-3">
          {selectedReservations.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Aucune réservation ce jour-là.</p>
          ) : (
            selectedReservations.map((reservation) => renderReservation(reservation))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservationCalendar;