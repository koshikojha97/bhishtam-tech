import type { Metadata } from "next";
import { ServicesSection } from "@/components/site/features/services";
import { WhyUsSection } from "@/components/site/features/why-us";
import { AboutSection } from "@/components/site/features/about";

export const metadata: Metadata = {
  title: "Features",
  description: "We are security experts on all technologies & platforms — network protection, data security, malware prevention and cloud security.",
};

/** Figma "Features" frame (3:7537) — header/footer come from the (site) layout. */
export default function FeaturesPage() {
  return (
    <>
      <ServicesSection />
      <WhyUsSection />
      <AboutSection />
    </>
  );
}
