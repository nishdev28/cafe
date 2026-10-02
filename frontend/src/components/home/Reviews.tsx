import MaxContainer from "@/layout/MaxContainer";
import { useEffect, useRef, useState } from "react";
import Image from "../ui/Image";
import { getAllTestimonials } from "@/api/testimonals";
import type { Testimonial } from "@/types/products";
import quoteMark from "@/assets/illustrations/quote-mark.svg";

export default function Reviews() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delay = 3000; // 3 seconds

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getAllTestimonials();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);

  const resetTimeout = (): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Automatic slide effect
  useEffect(() => {
    if (reviews.length === 0) return;
    
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setIndex((prevIndex) =>
        prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
      );
    }, delay);

    return () => resetTimeout();
  }, [index, reviews.length]);

  if (loading) {
    return (
      <section className="px-5 py-16 sm:px-8 md:px-10">
        <MaxContainer>
          <h4 className="text-gray mb-6 text-3xl md:text-4xl lg:text-5xl">
            Reviews
          </h4>
          <div className="flex justify-center py-12">
            <div className="text-gray-500">Loading reviews...</div>
          </div>
        </MaxContainer>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="px-5 py-16 sm:px-8 md:px-10">
        <MaxContainer>
          <h4 className="text-gray mb-6 text-3xl md:text-4xl lg:text-5xl">
            Reviews
          </h4>
          <div className="flex justify-center py-12">
            <div className="text-gray-500">No reviews yet.</div>
          </div>
        </MaxContainer>
      </section>
    );
  }

  return (
    <section className="px-5 py-16 sm:px-8 md:px-10">
      <MaxContainer>
        <h4 className="text-gray mb-6 text-3xl md:text-4xl lg:text-5xl">
          Reviews
        </h4>

        <div className="relative">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <Image
                src={quoteMark}
                className="h-auto w-20 object-contain sm:w-28"
              />
            </div>

            <div className="flex-1">
              <p className="mb-8 text-lg tracking-widest leading-relaxed normal-case">
                {reviews[index].content}
              </p>

              <div className="flex items-center justify-end gap-6">
                <span className="font-serif text-lg sm:text-2xl">
                  {reviews[index].name}
                </span>

                <div className="flex-shrink-0 rotate-180">
                  <Image
                    src={quoteMark}
                    className="h-auto w-20 object-contain sm:w-28"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-4">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`h-1 cursor-pointer transition-all duration-300 ${
                  index === idx
                    ? "w-16 bg-purple-600"
                    : "w-12 bg-stone-400"
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </MaxContainer>
    </section>
  );
}