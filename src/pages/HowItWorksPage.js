function HowItWorksPage() {
  const steps = [
    {
      title: '1. Découvrez des profils fiables',
      description: 'Parcourez des baby-sitters disponibles avec avis, tarifs et compétences détaillées.',
    },
    {
      title: '2. Filtrez selon vos besoins',
      description: 'Choisissez par quartier, disponibilité, tarif ou expérience en quelques clics.',
    },
    {
      title: '3. Contactez et confirmez',
      description: 'Envoyez une demande directement depuis le profil et organisez la garde en toute confiance.',
    },
    {
      title: '4. Partagez votre retour',
      description: 'Laissez un avis pour aider d’autres parents à choisir la bonne baby-sitter.',
    },
  ];

  return (
    <section className="space-y-10 py-10 lg:py-16">
      <div className="rounded-[36px] bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">Comment ça marche</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Une expérience simple et rassurante pour les parents tunisiens.</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Confi&apos;Sit structure la recherche de baby-sitter autour de la transparence, du confort et d’une prise en main mobile-first.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[36px] bg-amber-50 p-8 shadow-soft">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900">Pourquoi choisir Confi&apos;Sit ?</h2>
            <p className="text-slate-600">Nous mettons en avant des baby-sitters sélectionnées avec soin, des profils clairs, et une interface simple pour gérer la garde en toute tranquillité.</p>
            <ul className="space-y-4 text-slate-700">
              <li className="rounded-3xl bg-white p-5 shadow-sm">Profils locaux et adaptés aux quartiers de Tunis et banlieue.</li>
              <li className="rounded-3xl bg-white p-5 shadow-sm">Filtres utiles pour trouver la personne idéale rapidement.</li>
              <li className="rounded-3xl bg-white p-5 shadow-sm">Design moderne, sérieux et accessible depuis mobile.</li>
            </ul>
          </div>
        </div>
        <div className="grid gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-[32px] bg-white p-8 shadow-soft">
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-600">Étape {index + 1}</span>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-3 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[36px] bg-white p-8 shadow-soft">
        <h2 className="text-2xl font-semibold text-slate-900">Une application prête à évoluer</h2>
        <p className="mt-4 text-slate-600">Ce template frontend utilise des données mockées en local. Il est conçu pour être connecté facilement à un backend plus tard, grâce à des composants réutilisables et une structure claire.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900">Composants réutilisables</h3>
            <p className="mt-3 text-sm text-slate-600">Navbar, listes, cartes de profils et formulaires sont prêts pour une intégration backend.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900">Données mockées</h3>
            <p className="mt-3 text-sm text-slate-600">Les profils, les filtres et les avis sont stockés en local dans un fichier JS simple et extensible.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksPage;
