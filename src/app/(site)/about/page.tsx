import type { Metadata } from "next";
import { AboutHero } from "@/components/site/about/hero";
import { AboutEdge } from "@/components/site/about/edge";
import { AboutTeam } from "@/components/site/about/team";
import { AboutPositions } from "@/components/site/about/positions";
import { AboutFaq } from "@/components/site/about/faq";

export const metadata: Metadata = {
  title: "About",
  description: "Our mission: protecting your digital frontier. Meet the Bhishtam Tech team, our values and open positions.",
};

/** Figma "About" frame 3:6643 (1440 × 5981). Header + footer come from the (site) layout. */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutEdge />
      <AboutTeam />
      <AboutPositions />
      <AboutFaq />
    </>
  );
}
