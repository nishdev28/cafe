import React, { useState, useEffect, useRef } from "react";
import Image from "../ui/Image";
import heroHearth from "@/assets/illustrations/hero-hearth.svg";
import heroGrind from "@/assets/illustrations/hero-grind.svg";
import heroJar from "@/assets/illustrations/hero-jar.svg";


interface Slide {
  id: number;
  text: string;
  caption: string;
  image?: string;
  images?: string[];
}

interface Props {
  dashes?: boolean;
}

const slides: Slide[] = [
  {
    id: 1,
    text: "Where the hearth meets the grind",
    caption: "Where the hearth meets the grind",
    image: heroHearth,
  },
  {
    id: 2,
    text: "Freshly ground, every morning",
    caption: "Freshly ground, every morning",
    image: heroGrind,
  },
  {
    id: 3,
    text: "Layered by hand, jar by jar",
    caption: "Layered by hand, jar by jar",
    image: heroJar,
  },
];

const HEIGHT_CLASSES =
  "h-[400px] w-full sm:h-[320px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[750px]";

const Carousel: React.FC<Props> = ({ dashes = false }) => {
  const [index, setIndex] = useState<number>(0);
  const [preloadedSlides, setPreloadedSlides] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delay = 4000;
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  // Preload ALL images aggressively on mount
  useEffect(() => {
    const preloadAllImages = async () => {
      const cache: Record<string, string> = {};
      
      const preloadSingleImage = (src: string) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => {
            cache[src] = src;
            resolve(true);
          };
          img.onerror = resolve; // Don't fail on error
        });
      };

      const promises: Promise<unknown>[] = [];
      
      // Preload all slide images
      slides.forEach(slide => {
        if (slide.image) {
          promises.push(preloadSingleImage(slide.image));
        }
        if (slide.images) {
          slide.images.forEach(img => {
            promises.push(preloadSingleImage(img));
          });
        }
      });

      await Promise.all(promises);
      setImageCache(cache);
    };

    preloadAllImages();
  }, []);

  // Detect mobile once on client side
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload next slide images more aggressively
  useEffect(() => {
    const preloadImage = (src: string) => {
      if (imageCache[src]) return; // Already cached
      
      const img = new window.Image();
      img.src = src;
      // Cache it
      setImageCache(prev => ({ ...prev, [src]: src }));
    };

    // Preload current, next, and previous slides
    const current = index;
    const next = (index + 1) % slides.length;
    const prev = index === 0 ? slides.length - 1 : index - 1;
    
    const slidesToPreload = [current, next, prev];
    
    slidesToPreload.forEach((slideIndex) => {
      if (!preloadedSlides.includes(slideIndex)) {
        const slide = slides[slideIndex];
        
        if (slide.image) {
          preloadImage(slide.image);
        }
        
        if (slide.images) {
          const imagesToPreload = isMobile ? slide.images.slice(0, 2) : slide.images;
          imagesToPreload.forEach(preloadImage);
        }
        
        setPreloadedSlides(prev => [...prev, slideIndex]);
      }
    });
  }, [index, preloadedSlides, isMobile, imageCache]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Auto-sliding
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, delay);

    return () => resetTimeout();
  }, [index]);

  return (
    <div className="group relative w-full overflow-hidden bg-slate-100 shadow-2xl">
      {/* Slider Container */}
      <div
        className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, slideIndex) => {
          const isCurrent = slideIndex === index;
          const isNext = slideIndex === (index + 1) % slides.length;
          const isPrev = slideIndex === (index === 0 ? slides.length - 1 : index - 1);
          
          // More aggressive loading: current, next, and previous slides get eager loading
          const loadPriority = (isCurrent || isNext || isPrev) ? "eager" : "lazy";
          const fetchPriority = isCurrent ? "high" : (isNext || isPrev) ? "auto" : "low";

          return (
            <div key={slide.id} className="w-full flex-shrink-0 relative">
              
              {/* Overlay Gradient */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent z-10 pointer-events-none"></div>

              {/* Caption */}
              <div className="absolute bottom-8 left-6 z-20 sm:bottom-10 sm:left-10">
                <p className="font-top-luxury text-xl  drop-shadow-md sm:text-3xl lg:text-4xl">
                  {slide.caption}
                </p>
              </div>

              {/* SINGLE IMAGE SLIDE */}
              {slide.image && (
                <Image
                  src={slide.image}
                  alt={slide.text}
                  loading={loadPriority}
                  fetchPriority={fetchPriority}
                  className={`${HEIGHT_CLASSES}`}
                  // Add decoding hint for better performance
                  decoding="async"
                />
              )}

              {/* MERGED IMAGE SLIDE */}
              {slide.images && (
                <div
                  className={`
                    grid grid-cols-2
                    md:grid-cols-4
                    gap-px
                    bg-slate-200
                    ${HEIGHT_CLASSES}
                  `}
                >
                  {slide.images.map((img, i) => (
                    <Image
                      key={i}
                      src={img}
                      alt={`${slide.text} ${i + 1}`}
                      // Aggressive loading for current and adjacent slides
                      loading={(isCurrent || isNext || isPrev) ? "eager" : "lazy"}
                      fetchPriority={isCurrent && i < 2 ? "high" : "auto"}
                      decoding="async"
                      className={`
                        w-full h-full object-cover
                        ${i >= 2 ? "hidden md:block" : ""}
                      `}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Dashes */}
      {dashes && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { resetTimeout(); setIndex(i); }}
              className={`group/dot relative h-1 transition-all duration-500 ease-out focus:outline-none ${
                index === i 
                ? "w-12 bg-white" 
                : "w-6 bg-white/40 hover:bg-white/60"
              } rounded-full`}
            >
             
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;