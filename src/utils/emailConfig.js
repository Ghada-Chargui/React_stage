// Configuration EmailJS — à remplir avec tes propres identifiants
// (créés gratuitement sur https://www.emailjs.com)
//
// Étapes :
// 1. Crée un compte sur emailjs.com
// 2. Ajoute un "Email Service" (ex: Gmail) → tu obtiens un SERVICE_ID
// 3. Crée 3 templates (un par notification) → chacun te donne un TEMPLATE_ID
// 4. Récupère ta clé publique dans Account > General → PUBLIC_KEY
//
// Voir le README_EMAILJS.md fourni pour le détail exact des variables
// à utiliser dans chaque template.

export const EMAILJS_PUBLIC_KEY = 'hbeDOoHoD1S92bPGK';
export const EMAILJS_SERVICE_ID = 'service_abc1234';

export const EMAILJS_TEMPLATES = {
  complaintReceived: 'template_gcnnidr',
  complaintAdminAlert: 'template_rr8ygue',
};

// Adresse de l'administrateur Confi'Sit — reçoit une alerte à chaque
// nouvelle réclamation déposée par un parent ou une babysitter.
export const ADMIN_EMAIL = 'ghada.chargui4@gmail.com';

// Passe à true une fois les identifiants ci-dessus renseignés.
// Tant que c'est false, les emails sont simplement loggés dans la
// console (mode démo) au lieu d'être réellement envoyés — pratique
// pour développer sans consommer ton quota gratuit EmailJS.
export const EMAILJS_ENABLED = true ;