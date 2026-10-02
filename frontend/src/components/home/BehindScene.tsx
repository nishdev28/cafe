import Image from "@/components/ui/Image";
import heroGrind from "@/assets/illustrations/hero-grind.svg";

export default function BehindScene() {
  return (
    <div className="px-5 py-10 sm:px-8 md:px-10">
      <h4 className="text-gray mb-6 text-3xl md:text-4xl lg:text-5xl">
        Behind the Scenes
      </h4>
      <p className="text-gray max-w-5xl text-left text-base leading-relaxed  md:text-lg mb-4">
        Step into our kitchen and see where the magic happens. Every tiramisu
        jar begins with high-quality ingredients, layered by hand, and finished
        with precision.
        <br />
        Our video takes you behind the scenes, showing how passion and craft
        come together in every step. From mixing mascarpone to sealing each jar,
        we believe in creating desserts with honesty and care.
      </p>
      <Image
        src={heroGrind}
        className="h-full w-full rounded-3xl object-cover sm:h-[350px] md:h-[450px] lg:h-[500px] xl:h-[600px] mt-10"
      />
    </div>
  );
}
