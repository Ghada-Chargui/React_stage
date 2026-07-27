// Assistant de rédaction de bio pour les babysitters.
//
// ⚠️ IMPORTANT — pourquoi ce n'est pas un vrai appel IA pour l'instant :
// Une vraie IA (Claude, OpenAI...) nécessite une clé API qui ne doit JAMAIS
// être exposée dans le code frontend (n'importe qui pourrait l'extraire et
// l'utiliser à tes frais). Il faut un backend qui fasse office de proxy :
// le frontend appelle ton serveur, qui lui seul connaît la clé API et
// interroge l'IA de son côté.
//
// En attendant que ton backend Spring Boot expose cet endpoint, la fonction
// ci-dessous utilise un générateur local à base de règles : elle analyse le
// texte tapé par la babysitter (mots-clés, expérience, zone) et le restructure
// en bio professionnelle. Le résultat n'est pas "de l'IA" à proprement parler,
// mais l'expérience utilisateur (bouton, chargement, suggestion, validation)
// est exactement la même, pour que le remplacement soit invisible plus tard.

// Passe à true une fois ton backend prêt à recevoir la requête.
const AI_BACKEND_ENABLED = false;
const AI_BACKEND_URL = 'http://localhost:8080/api/ai/enhance-bio';

const TRAIT_PATTERNS = [
  { pattern: /patien/i, phrase: 'patiente et à l’écoute' },
  { pattern: /douc/i, phrase: 'douce et bienveillante' },
  { pattern: /dynamiq/i, phrase: 'dynamique et pleine d’énergie' },
  { pattern: /ponctuel/i, phrase: 'ponctuelle et fiable' },
  { pattern: /cr[ée]ati/i, phrase: 'créative dans les activités proposées' },
  { pattern: /calme/i, phrase: 'calme et rassurante' },
  { pattern: /organis/i, phrase: 'organisée et rigoureuse' },
  { pattern: /souriant/i, phrase: 'souriante et chaleureuse' },
  { pattern: /s[ée]rieus/i, phrase: 'sérieuse et digne de confiance' },
];

const AGE_GROUP_PATTERNS = [
  { pattern: /(b[ée]b[ée]|nourrisson)/i, label: 'les tout-petits' },
  { pattern: /(enfant|petit)/i, label: 'les jeunes enfants' },
  { pattern: /(ado|adolescent)/i, label: 'les adolescents' },
];

const buildLocalBio = (rawText, context = {}) => {
  const source = rawText || '';
  const { experience, zone, languages } = context;

  const traits = TRAIT_PATTERNS.filter(({ pattern }) => pattern.test(source)).map((item) => item.phrase);
  const ageGroups = AGE_GROUP_PATTERNS.filter(({ pattern }) => pattern.test(source)).map((item) => item.label);

  const expMatch = source.match(/(\d+)\s*an/i);
  const experienceYears = expMatch ? expMatch[1] : experience;

  const traitText = traits.length ? traits.slice(0, 2).join(' et ') : 'passionnée et attentive';
  const sentence1 = `Babysitter ${traitText}${experienceYears ? `, avec ${experienceYears} ans d’expérience` : ''}${zone ? ` dans la région de ${zone}` : ''}.`;

  const sentence2 = ageGroups.length
    ? `Spécialisée dans l’accompagnement de ${ageGroups.join(', ')}, je m’adapte au rythme et aux besoins de chaque enfant.`
    : 'Je m’adapte au rythme et aux besoins de chaque enfant, avec beaucoup de patience et de bienveillance.';

  const sentence3 = languages?.length
    ? `Je parle ${languages.join(', ')} et propose des activités ludiques et éducatives adaptées à son âge.`
    : 'Je propose des activités ludiques et éducatives adaptées à l’âge de l’enfant.';

  return [sentence1, sentence2, sentence3].join(' ');
};

/**
 * Génère une version améliorée de la bio.
 * - Si AI_BACKEND_ENABLED est true, appelle ton backend (qui appelle l'IA).
 * - Sinon, utilise le générateur local à base de règles.
 */
export const enhanceBio = async (rawText, context = {}) => {
  if (AI_BACKEND_ENABLED) {
    try {
      const response = await fetch(AI_BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, context }),
      });
      if (!response.ok) throw new Error('Réponse du serveur invalide');
      const data = await response.json();
      return data.enhancedBio;
    } catch (error) {
      console.error('Échec de l’appel au backend IA, repli sur le générateur local :', error);
      return buildLocalBio(rawText, context);
    }
  }

  // Petit délai artificiel pour simuler un traitement, cohérent avec l'UX d'un vrai appel IA
  await new Promise((resolve) => setTimeout(resolve, 600));
  return buildLocalBio(rawText, context);
};