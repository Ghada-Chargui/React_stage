// Détecte automatiquement si une réclamation semble urgente, à partir de
// mots-clés dans le sujet et le message. Même logique que pour l'assistant
// de bio : un vrai modèle IA pourrait faire mieux, mais ceci fonctionne
// immédiatement, sans clé API, et donne déjà une vraie valeur métier.

const URGENT_KEYWORDS = [
  // Sécurité / danger physique
  'danger', 'dangereux', 'dangereuse', 'blessé', 'blessée', 'blessure',
  'violence', 'maltraitance', 'agressi', 'peur', 'inquiet', 'inquiète',
  'sécurité', 'securite', 'urgence', 'urgent', 'immédiat', 'immediat', 'grave',

  // Argent / fraude
  'non payé', 'non paye', 'impayé', 'impaye', 'vol', 'volé', 'volée', 'fraude',
  'arnaque', 'escroquerie',

  // Absence / abandon
  'disparu', 'injoignable', 'abandonné', 'abandon',
];

/**
 * Analyse le sujet + message d'une réclamation et retourne 'Urgente'
 * si au moins un signal d'alerte est détecté, sinon 'Normale'.
 */
export const detectComplaintPriority = (subject = '', message = '') => {
  const text = `${subject} ${message}`.toLowerCase();
  const matchedKeyword = URGENT_KEYWORDS.find((keyword) => text.includes(keyword));
  return {
    priority: matchedKeyword ? 'Urgente' : 'Normale',
    matchedKeyword: matchedKeyword || null,
  };
};