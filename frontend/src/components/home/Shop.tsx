import MaxContainer from "@/layout/MaxContainer";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import ferreroImg from "@/assets/illustrations/products/ferrero-rocher.svg";
import pistachioImg from "@/assets/illustrations/products/pistachio.svg";
import boxImg from "@/assets/illustrations/products/box.svg";
import casseroleImg from "@/assets/illustrations/products/casserole.svg";
import minisImg from "@/assets/illustrations/products/minis.svg";

const dummyImages = [
  { img: ferreroImg, page: "/products/1", label: "Original Jars (250ml)" },
  { img: pistachioImg, page: "/products/2", label: "Petite Jars (150ml)" },
  { img: boxImg, page: "/products/3", label: "Combo Boxes" },
  {
    img: casseroleImg,
    page: "/products/4",
    label: "Casserole",
  },
  {
    img: minisImg,
    page: "/products/5",
    label: "Minis",
  },
];

const marqueeItems = [...dummyImages, ...dummyImages, ...dummyImages, ...dummyImages]; // Duplicate for smooth infinite effect

export default function Shop() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!marqueeRef.current) return;
    marqueeRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <MaxContainer className="px-5 py-10 sm:px-8 md:px-10">
      <h4 className="text-gray mb-6 text-3xl md:text-4xl lg:text-5xl">
        Shop Online
      </h4>

      <p className="text-gray max-w-5xl text-left text-base leading-relaxed md:text-lg">
        Discover indulgence at your fingertips !
        <br />
        Explore our curated collection, select your favourites, and have our
        signature delights delivered fresh to your door.
      </p>

      {/* --- MARQUEE WITH ARROWS & INFINITE SCROLL --- */}
      <div className="relative mt-12">
        {/* Marquee animation CSS */}
        <style>{`
          @keyframes scrollShop {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-shop-marquee {
            animation: scrollShop 40s linear infinite;
          }
          .animate-shop-marquee:hover {
            animation-play-state: paused;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2
                     rounded-full bg-white/80 p-2 shadow-md
                     hover:bg-white transition"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2
                     rounded-full bg-white/80 p-2 shadow-md
                     hover:bg-white transition"
        >
          <ChevronRight size={28} />
        </button>

        {/* Marquee container */}
        <div
          ref={marqueeRef}
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="flex w-max gap-8 animate-shop-marquee px-14">
            {marqueeItems.map((item, index) => (
              <div className="w-[260px] shrink-0 text-center" key={index}>
                <Link to={item.page} className="group block">
                  <div
                    className="relative mb-3 w-full overflow-hidden rounded-2xl"
                    style={{ paddingBottom: "100%" }}
                  >
                    <img
                      src={item.img}
                      alt={item.label}
                      className="absolute inset-0 h-full w-full object-cover
                                 transition-transform duration-500
                                 group-hover:scale-110"
                    />

                    <div className="absolute bottom-0 left-0 w-full
                                    bg-yellow-800/85 py-2
                                     font-semibold
                                    opacity-0 transition-opacity
                                    duration-300 group-hover:opacity-100">
                      {item.label}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
      <div className="mt-12 flex justify-center">
        <Link 
          to="/products/1" 
          className="bg-yellow hover:bg-yellow-800/75  font-medium 
                     rounded-3xl px-10 py-3 text-xl transition-colors 
                     duration-300 shadow-lg hover:shadow-xl"
        >
          Shop Now
        </Link>
      </div>
    </MaxContainer>
  );
}