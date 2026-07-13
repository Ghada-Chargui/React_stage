import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import slidePlay from '../assets/slide-babysitter-play.jpg';
import slideDropoff from '../assets/slide-parent-dropoff.jpg';
import slideReading from '../assets/slide-reading-time.jpg';
import slideArt from '../assets/slide-art-activity.jpg';
import slideStory from '../assets/slide-evening-story.jpg';

const slides = [
  {
    src: slidePlay,
    alt: 'Baby-sitter et enfant jouent ensemble',
    title: 'Jeux et rires partagés',
    description: 'Une baby-sitter attentive qui accompagne les petits moments de jeu.',
  },
  {
    src: slideDropoff,
    alt: 'Parent confiant qui dépose son enfant',
    title: 'Départ serein des parents',
    description: 'Confiance et sourire pour chaque garde, dès le premier contact.',
  },
  {
    src: slideReading,
    alt: 'Lecture d\'une histoire avec un enfant',
    title: 'Lecture douce et réconfort',
    description: 'Des instants calmes où l\'enfant se sent bien et écouté.',
  },
  {
    src: slideArt,
    alt: 'Temps d\'activité créative avec coloriage',
    title: 'Activités créatives',
    description: 'Peinture, coloriage et imagination pour une garde inspirante.',
  },
  {
    src: slideStory,
    alt: 'Veillée conte avant le coucher',
    title: 'Moments apaisés avant le coucher',
    description: 'Une ambiance douce pour finir la journée en confiance.',
  },
];

function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div
      className="group relative overflow-hidden rounded-[28px] bg-slate-50 shadow-soft transition-shadow duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[320px] sm:h-[360px] md:h-[400px]">
        {slides.map((slide, index) => (
          <div
            key={slide.alt}
            className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'} `}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="max-h-full w-full object-contain object-center"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/50 to-transparent px-5 py-5 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-200">Confi&apos;Sit</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{slide.title}</h3>
              <p className="mt-2 max-w-xl text-sm text-slate-100 sm:text-base">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Afficher la diapositive ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-amber-500 shadow-soft' : 'bg-white/80 ring-1 ring-slate-200 hover:bg-white'}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={goPrevious}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-950/20 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-slate-950/30 sm:left-4"
        aria-label="Image précédente"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-slate-950/20 p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-slate-950/30 sm:right-4"
        aria-label="Image suivante"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}

export default ImageCarousel;
