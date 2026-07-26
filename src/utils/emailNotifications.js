import emailjs from '@emailjs/browser';
import { ADMIN_EMAIL, EMAILJS_ENABLED, EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATES } from './emailConfig';

let initialized = false;

export const initEmailNotifications = () => {
  if (!EMAILJS_ENABLED || initialized) return;
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  initialized = true;
};

const sendEmail = async (templateId, templateParams, label) => {
  if (!EMAILJS_ENABLED) {
    // Mode démo : pas d'envoi réel tant que emailConfig.js n'est pas rempli.
    console.info(`[EmailJS - démo, non envoyé] ${label}`, templateParams);
    return { demo: true };
  }
  try {
    return await emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams);
  } catch (error) {
    // Un échec d'envoi d'email ne doit jamais casser le flux de l'app.
    console.error(`[EmailJS] Échec de l'envoi (${label}) :`, error);
    return null;
  }
};

/**
 * Confirme à la personne qui vient de déposer une réclamation
 * (parent ou babysitter) que celle-ci a bien été reçue.
 */
export const notifyComplaintReceived = (complaint, submitterEmail) => {
  if (!submitterEmail) return;

  return sendEmail(
    EMAILJS_TEMPLATES.complaintReceived,
    {
      to_email: submitterEmail,
      to_name: complaint.userName || 'Utilisateur',
      subject: complaint.subject,
      message: complaint.message,
      date: complaint.date,
    },
    `Réclamation reçue → ${submitterEmail}`
  );
};

/**
 * Alerte l'administrateur Confi'Sit qu'une nouvelle réclamation vient
 * d'être déposée (par un parent ou une babysitter), pour qu'il puisse
 * la traiter rapidement.
 */
export const notifyAdminOfComplaint = (complaint) => {
  return sendEmail(
    EMAILJS_TEMPLATES.complaintAdminAlert,
    {
      to_email: ADMIN_EMAIL,
      to_name: 'Admin Confi\u2019Sit',
      from_name: complaint.userName || 'Utilisateur',
      subject: complaint.subject,
      message: complaint.message,
      date: complaint.date,
    },
    `Alerte admin réclamation → ${ADMIN_EMAIL}`
  );
};