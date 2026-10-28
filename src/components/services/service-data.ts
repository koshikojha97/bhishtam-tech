import { Cloud, GraduationCap, Laptop, Mail, Radar, ScanSearch, type LucideIcon } from "lucide-react";
import type { ServiceId } from "@/lib/store";

export interface ServiceInfo {
  id: ServiceId;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  price: number; // USD / month
  sla: string;
}

/** Catalogue of managed security services (mirrors the marketing site's services). */
export const SERVICES: ServiceInfo[] = [
  {
    id: "soc",
    title: "24/7 SOC monitoring",
    tagline: "Network protection",
    description: "Analysts watch your network, cloud and identity signals around the clock and respond before threats spread.",
    features: ["Round-the-clock threat triage", "SIEM log correlation", "Monthly threat briefing"],
    icon: Radar,
    price: 1490,
    sla: "15 min response",
  },
  {
    id: "pentest",
    title: "Penetration testing",
    tagline: "Offensive security",
    description: "Certified ethical hackers probe your apps, APIs and infrastructure the way a real attacker would.",
    features: ["Quarterly external + internal test", "OWASP Top 10 web coverage", "Retest after remediation"],
    icon: ScanSearch,
    price: 990,
    sla: "Report in 5 days",
  },
  {
    id: "cloud",
    title: "Cloud security posture",
    tagline: "Cloud security",
    description: "Continuous checks of AWS, Azure and GCP for misconfigurations, exposed storage and risky permissions.",
    features: ["CIS benchmark scanning", "IAM risk analysis", "Auto-remediation playbooks"],
    icon: Cloud,
    price: 690,
    sla: "Daily scans",
  },
  {
    id: "email",
    title: "Email & phishing protection",
    tagline: "Data security",
    description: "Blocks credential phishing, spoofed executives and malicious attachments before they reach inboxes.",
    features: ["AI phishing detection", "Attachment sandboxing", "One-click message purge"],
    icon: Mail,
    price: 390,
    sla: "Real-time filtering",
  },
  {
    id: "endpoint",
    title: "Endpoint detection & response",
    tagline: "Malware prevention",
    description: "Lightweight agent that stops ransomware and malware on laptops, desktops and servers, with remote isolation.",
    features: ["Behavioural ransomware blocking", "Remote device isolation", "Rollback of encrypted files"],
    icon: Laptop,
    price: 790,
    sla: "Instant isolation",
  },
  {
    id: "training",
    title: "Security awareness training",
    tagline: "Human firewall",
    description: "Short, engaging lessons and simulated phishing campaigns that turn employees into your first line of defence.",
    features: ["Monthly phishing simulations", "Bite-size video lessons", "Department risk scores"],
    icon: GraduationCap,
    price: 290,
    sla: "Monthly campaigns",
  },
];

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
