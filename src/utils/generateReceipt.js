import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const paymentLabel = (method) => (method === 'carte' ? 'Carte bancaire' : 'Sur place (espèces)');

/**
 * Génère et télécharge un reçu PDF pour une réservation terminée.
 * Tout se passe côté navigateur, aucun serveur requis.
 */
export const generateReservationReceipt = (reservation, sitter) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  const hourlyRate = Number(sitter?.hourlyRate) || 35;
  const durationHours = parseInt(reservation.duration, 10) || 1;
  const totalAmount = hourlyRate * durationHours;
  const receiptNumber = `CS-${String(reservation.id || reservation._id || '').slice(-8).toUpperCase()}`;
  const issuedDate = new Date().toLocaleDateString('fr-FR');

  // --- En-tête ---
  doc.setFillColor(234, 88, 12); // orange-600
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Confi\u2019Sit', 14, 17);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Baby-sitting confiance', 14, 23);

  // --- Titre et méta ---
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Reçu de réservation', 14, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Numéro de reçu : ${receiptNumber}`, 14, 47);
  doc.text(`Émis le : ${issuedDate}`, 14, 52);

  // --- Détails de la garde ---
  autoTable(doc, {
    startY: 60,
    theme: 'grid',
    headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 3 },
    head: [['Détail', 'Information']],
    body: [
      ['Parent', reservation.parentName || '—'],
      ['Babysitter', reservation.sitterName || '—'],
      ['Date de la garde', reservation.date || '—'],
      ['Heure', reservation.hour || '—'],
      ['Durée', `${durationHours} heure(s)`],
      ['Adresse', reservation.address || '—'],
      ['Mode de paiement', paymentLabel(reservation.paymentMethod)],
      ['Statut', 'Terminée'],
    ],
  });

  // --- Montant total ---
  const afterTableY = doc.lastAutoTable.finalY + 10;
  doc.setFillColor(255, 247, 237); // amber-50
  doc.roundedRect(14, afterTableY, pageWidth - 28, 20, 3, 3, 'F');
  doc.setTextColor(180, 83, 9); // amber-700
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Montant total', 20, afterTableY + 8);
  doc.setFontSize(15);
  doc.text(`${totalAmount} TND`, 20, afterTableY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 90, 30);
  doc.text(`(${hourlyRate} TND/h \u00d7 ${durationHours}h)`, pageWidth - 20, afterTableY + 8, { align: 'right' });

  // --- Avis laissé, s'il existe ---
  let currentY = afterTableY + 32;
  if (reservation.review) {
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Avis laissé par le parent', 14, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(`\u2605 ${reservation.review.stars}/5 \u2014 ${reservation.review.comment}`, 14, currentY + 6, {
      maxWidth: pageWidth - 28,
    });
    currentY += 18;
  }

  // --- Pied de page ---
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Ce reçu est généré automatiquement par Confi\u2019Sit et sert de justificatif de réservation.',
    14,
    doc.internal.pageSize.getHeight() - 15
  );
  doc.text('Confi\u2019Sit \u2014 Plateforme de babysitting de confiance en Tunisie', 14, doc.internal.pageSize.getHeight() - 10);

  doc.save(`recu-confisit-${receiptNumber}.pdf`);
};