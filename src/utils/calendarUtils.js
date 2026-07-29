export const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export const WEEKDAY_NAMES_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

/**
 * Formate une Date en chaîne "YYYY-MM-DD" (même format que celui déjà
 * utilisé partout dans l'app pour les champs reservation.date).
 */
export const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayKey = () => toDateKey(new Date());

/**
 * Construit une grille de 6 semaines (42 jours) pour un mois donné,
 * en commençant le lundi, avec les jours des mois précédent/suivant
 * en complément (grisés dans l'affichage).
 */
export const buildMonthGrid = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  // getDay() : 0 = dimanche ... 6 = samedi -> on décale pour commencer lundi
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;

  const gridStart = new Date(year, month, 1 - firstWeekday);

  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    days.push({
      date,
      key: toDateKey(date),
      isCurrentMonth: date.getMonth() === month,
    });
  }
  return days;
};