import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Dashboard logo: the full wordmark (logo.svg), cross-fading to the square mark (logo-mark.svg,
 * the same file cropped to its 300×300 mark) when the sidebar collapses to 80px.
 */
export function Logo({ className, collapsed = false }: { className?: string; collapsed?: boolean }) {
  return (
    <Link href="/dashboard" aria-label="Bhishtam Tech — dashboard" className={cn("group relative flex h-[46px] items-center", className)}>
      <Image
        src="/site/brand/logo.svg"
        alt="Bhishtam Tech"
        width={1170}
        height={300}
        priority
        className={cn("h-[44px] w-auto max-w-none transition-opacity duration-300 xl:h-[46px]", collapsed && "opacity-0")}
      />
      <Image
        src="/site/brand/logo-mark.svg"
        alt=""
        width={300}
        height={300}
        className={cn("absolute top-1/2 left-0 size-[36px] -translate-y-1/2 transition-opacity duration-300", collapsed ? "opacity-100" : "opacity-0")}
      />
    </Link>
  );
}
