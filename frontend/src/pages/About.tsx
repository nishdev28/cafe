import Subscribe from "@/components/about/Subscribe";
import Team from "@/components/about/Team";
// import StatsCircles from "@/components/StatsCircles";
import Image from "@/components/ui/Image";
import Head from "@/layout/Head";
import MaxContainer from "@/layout/MaxContainer";
import heroHearth from "@/assets/illustrations/hero-hearth.svg";
import heroGrind from "@/assets/illustrations/hero-grind.svg";
import heroJar from "@/assets/illustrations/hero-jar.svg";
import classicImg from "@/assets/illustrations/products/classic.svg";
import lotusImg from "@/assets/illustrations/products/lotus-biscoff.svg";
import boxImg from "@/assets/illustrations/products/box.svg";

export default function About() {
  return (
    <>
      <Head title="About Us | Hearth & Grind - Desserts & Beyond" />
      <Image
        src={heroHearth}
        className="h-full w-full object-cover sm:h-[350px] md:h-[450px] lg:h-[500px] xl:h-[600px]"
      />

      <MaxContainer className="px-5 py-12 sm:px-8 md:px-10">
        <h2 className="text-gray mb-6 text-3xl md:text-4xl lg:text-5xl">
          About Us
        </h2>
        <p className="text-gray max-w-5xl text-left text-base leading-relaxed  md:text-lg ">
          At Hearth & Grind, our mission is to turn every jar into a small work of
          art layered with flavor, passion, and precision. Inspired by Italian
          traditions and reimagined for Dubai’s dessert lovers, we craft
          tiramisu in a cloud kitchen that guarantees freshness, consistency,
          and care in every batch.
          <br />
          Using premium ingredients and creative combinations, we bring you
          unique flavors like Date and Qahwa, Lotus Biscoff, Ferrero Rocher and
          Pistachio, all handcrafted with love. Each jar reflects our commitment
          to quality and indulgence, made for those who appreciate the finer
          things in life.
        </p>

        <div className="relative mx-auto mt-10">
          <div className="mx-auto grid max-w-4xl grid-cols-4 sm:h-[350px]">
            <Image src={heroGrind} />
            <p className="absolute top-3 left-10 bg-[#EFD9BE] p-1 text-center sm:left-60 sm:w-40 sm:p-3">
              Pure indulgence
            </p>
            <Image src={classicImg} className="mt-5" />
            <div className="-z-20 -mt-5 h-[200px] bg-[#EFD9BE] sm:h-[350px] sm:p-5">
              <Image src={heroJar} className="h-full" />
            </div>
            <div className="-ml-10 flex h-fit flex-col bg-[#C98A3B] p-3 text-center text-xs sm:mt-40 sm:-ml-5 sm:h-40 sm:p-8 sm:text-xl">
              <span>Our High</span>
              <span>Quality</span>
              <span>Production</span>
              <span>Process</span>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-4 sm:h-[350px]">
            <p className="-mt-10 flex flex-col bg-[#EFD9BE] p-1 text-center text-xs sm:h-full sm:w-52 sm:p-5 sm:text-base">
              Nothing less than perfection in every jar
            </p>
            <Image src={boxImg} />
            <Image src={lotusImg} className="-z-10" />
            <div className="relative">
              <Image src={heroHearth} className="-z-10 -mt-10" />
              <div className="absolute bottom-2 left-5 -ml-20 w-40 bg-[#C98A3B] p-1 text-xs sm:ml-0 sm:p-5">
                Flavors built to impress
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-4xl">
          Using the best ingredients for every product and ensuring the best
          quality in every bite. Before being served, products go through strict
          inspection to ensure quality standards. Every step in production is
          carefully monitored to achieve the perfect texture and taste.
        </p>
      </MaxContainer>

      <section className="rounded-t-4xl  bg-[#EFD9BE] px-5 py-10 sm:px-8 md:px-10">
        <MaxContainer>
          <h4 className="text-gray mb-6 text-3xl md:text-4xl lg:text-5xl">
            Why Choose Us
          </h4>
          <p>
          We are committed to creating tiramisu that stands apart, beginning with high-quality ingredients sourced for their freshness and flavor. Every jar is carefully handcrafted by our skilled team, bringing together smooth mascarpone, bold coffee, and signature twists like pistachio, qahwa, Ferrero Rocher and Lotus Biscoff for a selection of truly unique flavors. Our cloud-kitchen model ensures each order is prepared with precision and delivered quickly, so you enjoy your dessert at its freshest. From thoughtful recipes to dependable service, we go the extra mile to make every bite memorable.
          </p>
          {/* <MaxContainer className="my-10 flex max-w-2xl flex-col items-center justify-center text-center sm:flex-row sm:justify-between">
            {[
              {
                value: "87%",
                label: "Satisfied Customers",
                animation: "animate-bounce",
              },
              {
                value: "93%",
                label: "Organic Customers",
                animation: "animate-pulse",
              },
              {
                value: "83%",
                label: "Skilled Staff",
                animation: "animate-bounce",
              },
            ].map((item, idx) => (
              <div key={idx} className="mb-4">
                <div
                  className={`border-purple text-purple flex flex-col items-center justify-center rounded-full border ${idx !== 1
                    ? "h-[150px] w-[150px] text-xl"
                    : "h-[180px] w-[180px] text-xl"
                    }`}
                >
                  <span
                    className={`${idx !== 1 ? "text-3xl" : "text-4xl"} ${item.animation} `}
                  >
                    {item.value}
                  </span>
                  <span>{item.label}</span>
                </div>
              </div>
            ))}
          </MaxContainer> */}
          {/* <div className="py-4">
            <StatsCircles />
          </div> */}
        </MaxContainer>

        <Team />

        <MaxContainer className="py-10">
          <Subscribe />
        </MaxContainer>
      </section>
    </>
  );
}
