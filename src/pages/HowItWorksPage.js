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
    <section className="space-y-12 py-16 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-amber-50 p-9 shadow-[0_25px_70px_rgba(249,115,22,0.08)] dark:from-slate-900 dark:to-amber-900/20 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
        <div aria-hidden className="pointer-events-none absolute -left-10 top-0 h-48 w-48 rounded-full bg-amber-100/40 blur-3xl dark:bg-amber-500/15" />
        <div className="relative">
          <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-amber-600 dark:text-amber-400">Comment ça marche</p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">Une expérience simple et rassurante pour les parents tunisiens.</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">Confi&apos;Sit structure la recherche de baby-sitter autour de la transparence, du confort et d’une prise en main mobile-first.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-9 shadow-[0_25px_70px_rgba(249,115,22,0.06)] dark:from-slate-900 dark:to-orange-900/20 dark:shadow-[0_25px_70px_rgba(0,0,0,0.3)]">
          <div aria-hidden className="pointer-events-none absolute -right-12 bottom-0 h-56 w-56 rounded-full bg-orange-100/40 blur-3xl dark:bg-orange-500/15" />
          <div className="relative space-y-7">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Pourquoi choisir Confi&apos;Sit ?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">Nous sélectionnons avec soin des baby-sitters de confiance, avec des profils clairs et une interface simple pour organiser vos gardes en toute tranquillité.</p>
            <ul className="space-y-4 text-slate-700 dark:text-slate-200">
              <li className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(15,23,42,0.10)] dark:bg-slate-900 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">Un réseau de baby-sitters couvrant l'ensemble des quartiers de Tunis et sa périphérie.</li>
              <li className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(15,23,42,0.10)] dark:bg-slate-900 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">Des critères de recherche précis pour identifier rapidement le profil adapté à vos besoins.</li>
              <li className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(15,23,42,0.10)] dark:bg-slate-900 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">Une plateforme moderne, sécurisée et accessible sur tous vos appareils.</li>
            </ul>
          </div>
        </div>
        <div className="grid gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_75px_rgba(15,23,42,0.10)] hover:scale-[1.01] dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <span className="text-sm font-extrabold uppercase tracking-[0.32em] text-amber-600 dark:text-amber-400">Étape {index + 1}</span>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-slate-100">{step.title}</h3>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default HowItWorksPage;
