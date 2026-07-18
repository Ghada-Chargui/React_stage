const reviews = [
  { id: '1', parentName: 'Leila', stars: 5, comment: 'Très à l’écoute et très rassurante.' },
  { id: '2', parentName: 'Sami', stars: 4, comment: 'Ponctuelle et bienveillante avec les enfants.' },
];

function BabysitterReviewsPage() {
  const average = (reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length).toFixed(1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-extrabold uppercase tracking-[0.32em] text-orange-600">Avis reçus</p>
      <div className="mt-4 flex items-center justify-between rounded-3xl bg-amber-50 p-5 dark:bg-amber-900/20">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Note moyenne</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Vos parents vous apprécient.</p>
        </div>
        <div className="text-3xl font-extrabold text-amber-700">{average}/5</div>
      </div>
      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className="font-extrabold text-slate-900 dark:text-slate-100">{review.parentName}</p>
              <span className="font-semibold text-amber-700">★ {review.stars}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BabysitterReviewsPage;
