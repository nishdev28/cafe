import BehindScene from "@/components/home/BehindScene";
import Carousel from "@/components/home/Carousel";
import Reviews from "@/components/home/Reviews";
import Shop from "@/components/home/Shop";
export default function Home() {
  return (
    <>
      <Carousel />
      <Shop />
      <BehindScene />
      <Reviews />
    </>
  );
}
