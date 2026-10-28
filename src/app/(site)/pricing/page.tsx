import type { Metadata } from "next";
import { PricingPlans } from "@/components/site/pricing/plans";
import { PricingCompare } from "@/components/site/pricing/compare";
import { PricingCta } from "@/components/site/pricing/cta";
import { FaqSection } from "@/components/site/misc/faq-accordion";
import { A } from "@/components/site/ui";
import { PRICING_FAQ } from "@/components/site/pricing/data";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <PricingPlans />
      <div className="h-px w-full bg-cx-line" />
      <PricingCompare />
      <FaqSection
        id="faq"
        title={
          <>
            Have a <A>question?</A>
          </>
        }
        intro="Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit."
        items={PRICING_FAQ}
      />
      <PricingCta />
    </>
  );
}
