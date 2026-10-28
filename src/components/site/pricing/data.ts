export type Billing = "monthly" | "yearly";

export type Plan = {
  id: "basic" | "professional" | "enterprise";
  name: string;
  tagline: string;
  monthly: number;
  yearly: number; // per month, billed yearly
  art: { src: string; w: number; h: number };
  featured?: boolean;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin.",
    monthly: 29,
    yearly: 23,
    art: { src: "/site/misc/server-box.webp", w: 173, h: 129.5 },
    features: ["Network protection", "Malware prevention", "Up to 10 users", "Monthly security reports", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Lorem ipsum dolor sit amet consectetur. Nisl commodo erat quam metus.",
    monthly: 79,
    yearly: 63,
    art: { src: "/site/misc/padlock.webp", w: 81, h: 144 },
    featured: true,
    features: ["Everything in Basic", "Cloud security", "24/7 monitoring", "Threat intelligence feeds", "Up to 50 users", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Lorem ipsum dolor sit amet consectetur. Tellus blandit morbi sed in.",
    monthly: 199,
    yearly: 159,
    art: { src: "/site/misc/cloud-fingerprint.webp", w: 115, h: 134.5 },
    features: ["Everything in Professional", "Zero-trust access", "1h incident response SLA", "Unlimited users", "Dedicated security manager"],
  },
];

/** Comparison table — `true` = included, `false` = not included, string = value. */
export type Cell = boolean | string;
export const COMPARE: { group: string; rows: { feature: string; values: [Cell, Cell, Cell] }[] }[] = [
  {
    group: "Security",
    rows: [
      { feature: "Network protection", values: [true, true, true] },
      { feature: "Malware prevention", values: [true, true, true] },
      { feature: "Data encryption", values: ["AES-128", "AES-256", "AES-256 + HSM"] },
      { feature: "Cloud security", values: [false, true, true] },
      { feature: "Zero-trust access", values: [false, false, true] },
    ],
  },
  {
    group: "Monitoring",
    rows: [
      { feature: "Threat monitoring", values: ["Business hours", "24/7", "24/7"] },
      { feature: "Threat intelligence feeds", values: [false, true, true] },
      { feature: "Incident response SLA", values: ["48h", "12h", "1h"] },
      { feature: "Security reports", values: ["Monthly", "Weekly", "Real-time"] },
    ],
  },
  {
    group: "Support",
    rows: [
      { feature: "Team members", values: ["Up to 10", "Up to 50", "Unlimited"] },
      { feature: "Onboarding", values: ["Self-serve", "Guided", "White-glove"] },
      { feature: "Dedicated security manager", values: [false, false, true] },
      { feature: "Support channel", values: ["Email", "Priority email & chat", "Phone, email & chat"] },
    ],
  },
];

export const PRICING_FAQ = [
  {
    q: "Can I switch plans at any time?",
    a: "Lorem ipsum dolor sit amet consectetur. Sem rhoncus ut nam vitae at et. Cursus donec at urna cras fermentum tempus pharetra vel tempus. Etiam commodo turpis elementum massa id quis.",
  },
  {
    q: "Is there a discount for yearly billing?",
    a: "Lorem ipsum dolor sit amet consectetur. Yearly plans save 20% compared to monthly billing. Cursus donec at urna cras fermentum tempus pharetra vel tempus.",
  },
  {
    q: "Do you offer a free trial for your services?",
    a: "Lorem ipsum dolor sit amet consectetur. Lacus id turpis ut nulla dui proin nunc dui tellus blandit. Etiam commodo turpis elementum massa id quis.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Lorem ipsum dolor sit amet consectetur. Nisl commodo erat quam metus. Sem rhoncus ut nam vitae at et cursus donec at urna cras fermentum.",
  },
];
