import type { Metadata } from "next";
import { HomeHero } from "@/components/site/home/hero";
import { HomeServices } from "@/components/site/home/services";
import { HomeAbout } from "@/components/site/home/about";
import { HomeCaseStudies } from "@/components/site/home/case-studies";
import { HomeCta, HomeProcess, HomeTestimonials } from "@/components/site/home/bottom";

// absolute: a layout's title.template doesn't apply to the page in its own segment
export const metadata: Metadata = { title: { absolute: "Home · Bhishtam Tech" } };

/** Figma "Home V3" (3:783). Top half: hero → services → about → case studies; bottom half from ./bottom (blog section removed). */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeAbout />
      <HomeCaseStudies />
      <HomeCta />
      <HomeProcess />
      <HomeTestimonials />
    </>
  );
}
