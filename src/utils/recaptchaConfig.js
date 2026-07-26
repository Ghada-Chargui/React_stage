// Configuration Google reCAPTCHA — à remplir avec ta propre clé de site
// (créée gratuitement sur https://www.google.com/recaptcha/admin)
//
// Étapes :
// 1. Va sur https://www.google.com/recaptcha/admin/create
// 2. Choisis "reCAPTCHA v2" > "Cocher la case 'Je ne suis pas un robot'"
// 3. Ajoute "localhost" dans la liste des domaines (+ ton domaine réel plus tard)
// 4. Récupère la "Clé de site" (Site Key) — PAS la "Clé secrète" (celle-ci reste
//    côté serveur uniquement, ne jamais l'exposer dans le frontend)

export const RECAPTCHA_SITE_KEY = '6Lf902YtAAAAALx7zKxUrKo5h3He1b_fF_PSHFAc';

// Clé de test officielle fournie par Google (toujours valide, pratique en dev,
// mais accepte TOUJOURS la vérification — à remplacer par ta vraie clé avant
// toute vraie mise en production) :
// '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'