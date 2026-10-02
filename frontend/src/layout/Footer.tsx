import { Link } from "react-router";
import logo from "@/assets/illustrations/logo.svg";

const socials = [
  {
    title: "instagram",
    href: "https://www.instagram.com/hearthandgrinduae",
  },
  {
    title: "facebook",
    href: "https://www.facebook.com/HearthAndGrindUAE",
  },
  {
    title: "tiktok",
    href: "https://www.tiktok.com/@hearthandgrind",
  },
  {
    title: "snapchat",
    href: "https://www.snapchat.com/add/hearthandgrind",
  },
];

export default function Footer() {
  return (
    <footer className="flex-col] flex w-full flex-col items-center justify-between border-t border-gray-200  px-5 py-10 sm:flex-row sm:px-8">
      <Link to="/" className="shrink-0">
        <img src={logo} alt="Hearth & Grind" className="h-auto w-40" />
      </Link>

      <div className="w-full">
        <div className="flex justify-center space-x-6 text-base sm:justify-end md:text-lg">
          {socials.map((s) => (
            <Link
              target="_blank"
              to={s.href}
              key={s.title}
              className="hover:text-purple transition-all duration-300"
            >
              {s.title}
            </Link>
          ))}
        </div>

        <hr className="mx-4 my-4 w-full border-gray-500 md:mx-8" />

        <div className="container mx-auto px-4 py-2 text-center text-sm sm:text-right">
          © 2026 HEARTH &amp; GRIND. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
