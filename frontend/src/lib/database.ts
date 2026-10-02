import boxImg from "@/assets/illustrations/products/box.svg";
import classicImg from "@/assets/illustrations/products/classic.svg";
import pistachioImg from "@/assets/illustrations/products/pistachio.svg";
import lotusImg from "@/assets/illustrations/products/lotus-biscoff.svg";
import ferreroImg from "@/assets/illustrations/products/ferrero-rocher.svg";
import dateQahwaImg from "@/assets/illustrations/products/date-qahwa.svg";
import casseroleImg from "@/assets/illustrations/products/casserole.svg";
import minisImg from "@/assets/illustrations/products/minis.svg";

export const data = [
  {
    name: "Box of Orginal Jars (250 ml x 5)",
    price: 200,
    images: [boxImg, boxImg, boxImg],
    slug: "box-of-orginal-jars",
    weight: "250 ml X 5",
    type: "box",
    description:
      "A perfect indulgence set featuring five signature flavors: Lotus Biscoff, Ferrero Rocher, Date & Qahwa, Classic, and Pistachio Tiramisu, each rich, layered, and irresistible.",
    reviews: 4.5,
  },
  {
    name: "Box of Pettie Jars (150 ml x 5)",
    price: 180,
    images: [boxImg, boxImg, boxImg],
    slug: "box-of-pistachio-jars",
    weight: "150 ml X 9",
    type: "box",
    description:
      "A delightful tasting box of nine petite jars with all five tiramisu flavors, crafted for sharing, gifting, or enjoying guilt-free moments of bliss.",
    reviews: 4.2,
  },
  {
    name: "Classic Tiramisu",
    price: 40,
    images: [classicImg, classicImg, classicImg],
    slug: "classic-tiramisu-250ml",
    weight: "250 ml",
    type: "large",
    description:
      "Enjoy the timeless harmony of bold coffee and smooth mascarpone crafted into a truly elegant classic.",
    reviews: 4.5,
  },
  {
    name: "Pistachio Tiramisu",
    price: 40,
    images: [pistachioImg, pistachioImg, pistachioImg],
    slug: "pistachio-tiramisu-250ml",
    weight: "250 ml",
    type: "large",
    description: "Delight in premium pistachios folded into creamy layers for a refined, nutty experience.",
    reviews: 4.2,
  },
  {
    name: "Lotus Biscoff Tiramisu",
    price: 40,
    images: [lotusImg, lotusImg, lotusImg],
    slug: "lotus-biscoff-tiramisu-250ml",
    weight: "250 ml",
    type: "large",
    description:  "Savor the comfort of Lotus with its warm, caramel notes blended into silky, irresistible layers.",
    reviews: 4.2,
  },
  {
    name: "Ferrero Rocher Tiramisu",
    price: 40,
    images: [ferreroImg, ferreroImg, ferreroImg],
    slug: "ferrero-rocher-tiramisu-250ml",
    weight: "250 ml",
    type: "large",
    description: "Indulge in rich hazelnut and velvety chocolate that come together in every decadent spoonful.",
    reviews: 4.2,
  },
  {
    name: "Date & Qahwa Tiramisu",
    price: 40,
    images: [dateQahwaImg, dateQahwaImg, dateQahwaImg],
    slug: "date-qahwa-tiramisu-250ml",
    weight: "250 ml",
    type: "large",
    description: "Experience the magic of premium dates and aromatic Arabic coffee in every luxurious layer.",
    reviews: 4.2,
  },
  {
    name: "Classic Tiramisu",
    price: 25,
    images: [classicImg, classicImg, classicImg],
    slug: "classic-tiramisu-150ml",
    weight: "150 ml",
    type: "small",
    description:
      "Enjoy the timeless harmony of bold coffee and smooth mascarpone crafted into a truly elegant classic.",
    reviews: 4.5,
  },
  {
    name: "Pistachio Tiramisu",
    price: 25,
    images: [pistachioImg, pistachioImg, pistachioImg],
    slug: "pistachio-tiramisu-150ml",
    weight: "150 ml",
    type: "small",
    description: "Delight in premium pistachios folded into creamy layers for a refined, nutty experience.",
    reviews: 4.2,
  },

  {
    name: "Lotus Biscoff Tiramisu",
    price: 25,
    images: [lotusImg, lotusImg, lotusImg],
    slug: "lotus-biscoff-tiramisu-150ml",
    weight: "150 ml",
    type: "small",
    description: "Savor the comfort of Lotus with its warm, caramel notes blended into silky, irresistible layers.",
    reviews: 4.2
  },  
  {
    name: "Ferrero Rocher Tiramisu",
    price: 25,
    images: [ferreroImg, ferreroImg, ferreroImg],
    slug: "ferrero-rocher-tiramisu-150ml",
    weight: "150 ml",
    type: "small",
    description: "Indulge in rich hazelnut and velvety chocolate that come together in every decadent spoonful.",
    reviews: 4.2,
  },
  {
    name: "Date & Qahwa Tiramisu",
    price: 25,
    images: [dateQahwaImg, dateQahwaImg, dateQahwaImg],
    slug: "date-qahwa-tiramisu-150ml",
    weight: "150 ml",
    type: "small",
    description: "Experience the magic of premium dates and aromatic Arabic coffee in every luxurious layer.",
    reviews: 4.2,
  },

  // CASSEROLES (Party Orders)
{
  name: "Classic Tiramisu Casserole (8–10 people)",
  price: 250,
  images: [casseroleImg, casseroleImg, casseroleImg, casseroleImg],
  slug: "classic-tiramisu-casserole-8-10",
  weight: "for 8–10 people",
  type: "casserole",
  description:
    "Your favourite Tiramisu flavour in party size, delivered in a convenient and elegant glass casserole. Pre-order at least 24 hours in advance.",
  reviews: 4.5,
},
{
  name: "Classic Tiramisu Casserole (12–14 people)",
  price: 350,
  images: [casseroleImg, casseroleImg, casseroleImg, casseroleImg],
  slug: "classic-tiramisu-casserole-12-14",
  weight: "for 12–14 people",
  type: "casserole",
  description:
    "Your favourite Tiramisu flavour in party size, delivered in a convenient and elegant glass casserole. Pre-order at least 24 hours in advance.",
  reviews: 4.5,
},
{
  name: "Minis (Set of 12 Jars)",
  price: 120,
  images: [minisImg, minisImg, minisImg, minisImg],
  slug: "minis-12",
  weight: "12 minis",
  type: "minis",
  description:
    "A delightful selection of our signature Tiramisu flavours in bite-sized mini jars, ideal for parties and gatherings. Sold as sets of 12. Pre-order at least 24 hours in advance",
  reviews: 4.5,
},
{
  name: "Minis (Set of 24 Jars)",
  price: 240,
  images: [minisImg, minisImg, minisImg, minisImg],
  slug: "minis-24",
  weight: "24 minis",
  type: "minis",
  description:
    "A delightful selection of our signature Tiramisu flavours in bite-sized mini jars, ideal for parties and gatherings. Sold as sets of 24. Pre-order at least 24 hours in advance",
  reviews: 4.5,
},

];
