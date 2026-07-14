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
            <p className="text-slate-600">Nous sélectionnons avec soin des baby-sitters de confiance, avec des profils clairs et une interface simple pour organiser vos gardes en toute tranquillité.</p>
            <ul className="space-y-4 text-slate-700">
              <li className="rounded-3xl bg-white p-5 shadow-sm">Un réseau de baby-sitters couvrant l'ensemble des quartiers de Tunis et sa périphérie.</li>
              <li className="rounded-3xl bg-white p-5 shadow-sm">Des critères de recherche précis pour identifier rapidement le profil adapté à vos besoins.</li>
              <li className="rounded-3xl bg-white p-5 shadow-sm">Une plateforme moderne, sécurisée et accessible sur tous vos appareils.</li>
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

    </section>
  );
}

export default HowItWorksPage;
