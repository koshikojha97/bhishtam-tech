import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Bhishtam Tech wordmark (public/site/brand/logo.svg, 1170×300 — mark + name + tagline). */
export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Bhishtam Tech — home" className={cn("group flex shrink-0 items-center", className)}>
      <Image
        src="/site/brand/logo.svg"
        alt="Bhishtam Tech"
        width={1170}
        height={300}
        priority
        className="h-[40px] w-auto transition-opacity duration-300 group-hover:opacity-85 md:h-[48px]"
      />
    </Link>
  );
}
