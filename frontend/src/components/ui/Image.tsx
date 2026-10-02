import { cn } from "@/lib/utils";
import { type ImgHTMLAttributes } from "react";

type ImageProps = {
  className?: string;
  src: string;
  dynamic?: boolean;
} & ImgHTMLAttributes<HTMLImageElement>;

export default function Image({
  className,
  src,
  dynamic = false,
  loading = "lazy",
  ...props
}: ImageProps) {
  return (
    <img
      className={cn("object-cover", className)}
      alt=""
      loading={loading}
      src={dynamic ? import.meta.env.VITE_API_BASE_URL + "/" + src : src}
      {...props}
    />
  );
}
