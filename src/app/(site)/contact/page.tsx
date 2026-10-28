import type { Metadata } from "next";
import { ContactHero } from "@/components/site/contact/hero";
import { ContactFormSection } from "@/components/site/contact/contact-form";
import { FaqSection } from "@/components/site/misc/faq-accordion";
import { A } from "@/components/site/ui";

export const metadata: Metadata = { title: "Contact" };

/** Copy for the first four questions is the template's own FAQ (About 3:7509). */
const FAQ = [
  {
    q: "How can I get in touch with your cyber security experts?",
    a: "Lorem ipsum dolor sit amet consectetur. Sem rhoncus ut nam vitae at et. Cursus donec at urna cras fermentum tempus pharetra vel tempus. Etiam commodo turpis elementum massa id quis.",
  },
  {
    q: "What types of cyber security services do you offer?",
    a: "Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit. Network protection, data security, malware prevention and cloud security.",
  },
  {
    q: "What geographic regions do you serve?",
    a: "Lorem ipsum dolor sit amet consectetur. Nisl commodo erat quam metus. Cursus donec at urna cras fermentum tempus pharetra vel tempus.",
  },
  {
    q: "Is there a specific department I should address my inquiry to?",
    a: "Lorem ipsum dolor sit amet consectetur. Sem rhoncus ut nam vitae at et. Choose the closest service in the form and we will route your message to the right team.",
  },
];

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <div className="h-px w-full bg-cx-line" />
      <FaqSection
        id="faq"
        title={
          <>
            Have a <A>question?</A>
          </>
        }
        intro="Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit."
        items={FAQ}
      />
    </>
  );
}
