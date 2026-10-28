"use client";

/**
 * App-wide client state for the security dashboard (Zustand + localStorage persistence).
 * Replace the actions' bodies with API calls when wiring a real backend.
 *
 * Hydration: `skipHydration: true` keeps the first client render identical to SSR;
 * <StoreHydrator/> (in the root layout) rehydrates from localStorage after mount.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------- domain types ---------- */

export type Severity = "Critical" | "High" | "Medium" | "Low";
export const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];

export type AlertCategory = "Malware" | "Phishing" | "Intrusion" | "DDoS" | "Brute force" | "Data exfiltration";
export type AlertStatus = "Open" | "Investigating" | "Resolved";

/** A detection from one of the security sensors (threats page). */
export interface Alert {
  id: string;
  ref: string; // "ALR-20931"
  title: string;
  category: AlertCategory;
  severity: Severity;
  status: AlertStatus;
  source: "Firewall" | "EDR" | "Email gateway" | "WAF" | "IDS" | "SIEM";
  asset: string; // asset or device name
  ip: string; // source IP
  country: string;
  date: string; // ISO
}

export type AssetType = "Server" | "Database" | "Cloud" | "Network" | "Application";
export type AssetStatus = "Protected" | "At risk" | "Offline";

/** Infrastructure the customer has under protection (assets page). */
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  ip: string;
  environment: "Production" | "Staging" | "Development";
  owner: string;
  risk: number; // 0–100, higher = riskier
  status: AssetStatus;
  lastScan: string; // ISO
}

export type DeviceStatus = "Healthy" | "At risk" | "Isolated";

/** Employee endpoints running the agent (devices page). */
export interface Device {
  id: string;
  name: string; // hostname
  user: string;
  kind: "Laptop" | "Desktop" | "Mobile" | "Server";
  os: string;
  status: DeviceStatus;
  encrypted: boolean;
  agentVersion: string;
  threats: number; // detections in the last 30 days
  lastSeen: string; // ISO
}

export type VulnStatus = "Open" | "In progress" | "Patched";

export interface Vulnerability {
  id: string;
  cve: string;
  title: string;
  severity: Severity;
  cvss: number; // 0–10
  asset: string;
  status: VulnStatus;
  fixAvailable: boolean;
  discovered: string; // ISO
  patchedAt?: string; // ISO, set when status becomes "Patched"
}

export type IncidentStatus = "Open" | "Contained" | "Resolved";

export interface Incident {
  id: string;
  ref: string; // "INC-1042"
  title: string;
  severity: Severity;
  status: IncidentStatus;
  owner: string;
  affectedAssets: number;
  progress: number; // response playbook completion, 0–100
  opened: string; // ISO
  updated: string; // ISO
  summary: string;
}

export type Role = "Admin" | "Analyst" | "Responder" | "Viewer";
export const ROLES: Role[] = ["Admin", "Analyst", "Responder", "Viewer"];

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  mfa: boolean;
  status: "Active" | "Invited" | "Suspended";
  lastActive: string; // ISO
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string; // ISO
  read: boolean;
  kind: "threat" | "incident" | "vulnerability" | "device" | "security" | "info";
  href?: string;
}

export interface User {
  name: string;
  username: string;
  email: string;
  jobTitle: string;
  company: string;
  phone: string;
  city: string;
  country: string;
  avatar: string; // url or data URL
}

export interface Preferences {
  timeZone: string;
  alertThreshold: Severity; // lowest severity that triggers a notification
  notifyCritical: boolean;
  notifyWeeklyReport: boolean;
  notifyProductUpdates: boolean;
}

export interface Security {
  twoFactor: boolean;
  passwordUpdatedAt?: string;
}

/* ---------- seed data ---------- */

const uid = () => Math.random().toString(36).slice(2, 10);
const ago = (d: number, h = 10, m = 40) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, m, 0, 0);
  return t.toISOString();
};
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

const SEED_ALERTS: Alert[] = [
  { id: "a1", ref: "ALR-20931", title: "Ransomware behaviour blocked", category: "Malware", severity: "Critical", status: "Open", source: "EDR", asset: "FIN-LT-014", ip: "185.220.101.42", country: "Russia", date: minsAgo(12) },
  { id: "a2", ref: "ALR-20930", title: "Credential phishing email quarantined", category: "Phishing", severity: "High", status: "Investigating", source: "Email gateway", asset: "mail.bhishtam.tech", ip: "45.83.64.11", country: "Netherlands", date: minsAgo(48) },
  { id: "a3", ref: "ALR-20928", title: "SSH brute-force attempts", category: "Brute force", severity: "High", status: "Open", source: "IDS", asset: "prod-api-01", ip: "103.152.18.9", country: "China", date: minsAgo(95) },
  { id: "a4", ref: "ALR-20925", title: "SQL injection attempt on login form", category: "Intrusion", severity: "Medium", status: "Resolved", source: "WAF", asset: "customer-portal", ip: "91.240.118.3", country: "Ukraine", date: ago(0, 7, 15) },
  { id: "a5", ref: "ALR-20921", title: "Volumetric DDoS mitigated", category: "DDoS", severity: "Medium", status: "Resolved", source: "Firewall", asset: "edge-lb-02", ip: "multiple", country: "Global", date: ago(1, 22, 5) },
  { id: "a6", ref: "ALR-20917", title: "Large outbound transfer to unknown host", category: "Data exfiltration", severity: "Critical", status: "Investigating", source: "SIEM", asset: "db-cluster-01", ip: "198.51.100.77", country: "United States", date: ago(1, 16, 30) },
  { id: "a7", ref: "ALR-20912", title: "Suspicious PowerShell execution", category: "Malware", severity: "High", status: "Resolved", source: "EDR", asset: "HR-DT-003", ip: "10.0.4.23", country: "Internal", date: ago(2, 11, 2) },
  { id: "a8", ref: "ALR-20908", title: "Impossible-travel sign-in", category: "Intrusion", severity: "Medium", status: "Resolved", source: "SIEM", asset: "Microsoft 365", ip: "102.89.34.120", country: "Nigeria", date: ago(3, 9, 48) },
  { id: "a9", ref: "ALR-20901", title: "Port scan from external host", category: "Intrusion", severity: "Low", status: "Resolved", source: "Firewall", asset: "vpn-gw-01", ip: "162.142.125.8", country: "United States", date: ago(4, 4, 20) },
  { id: "a10", ref: "ALR-20897", title: "Spoofed CEO email blocked", category: "Phishing", severity: "Low", status: "Resolved", source: "Email gateway", asset: "mail.bhishtam.tech", ip: "77.91.124.55", country: "Germany", date: ago(5, 14, 0) },
  { id: "a11", ref: "ALR-20890", title: "Repeated failed MFA prompts", category: "Brute force", severity: "Medium", status: "Resolved", source: "SIEM", asset: "Okta", ip: "41.216.188.7", country: "South Africa", date: ago(6, 18, 33) },
  { id: "a12", ref: "ALR-20884", title: "Trojan detected in downloads folder", category: "Malware", severity: "High", status: "Resolved", source: "EDR", asset: "MKT-LT-021", ip: "10.0.7.88", country: "Internal", date: ago(8, 13, 10) },
];

const SEED_ASSETS: Asset[] = [
  { id: "as1", name: "prod-api-01", type: "Server", ip: "10.0.1.12", environment: "Production", owner: "Platform team", risk: 72, status: "At risk", lastScan: ago(0, 6, 0) },
  { id: "as2", name: "db-cluster-01", type: "Database", ip: "10.0.2.40", environment: "Production", owner: "Data team", risk: 81, status: "At risk", lastScan: ago(0, 6, 5) },
  { id: "as3", name: "customer-portal", type: "Application", ip: "52.14.88.120", environment: "Production", owner: "Web team", risk: 38, status: "Protected", lastScan: ago(1, 6, 0) },
  { id: "as4", name: "aws-prod-vpc", type: "Cloud", ip: "172.31.0.0/16", environment: "Production", owner: "Cloud ops", risk: 24, status: "Protected", lastScan: ago(0, 5, 30) },
  { id: "as5", name: "edge-lb-02", type: "Network", ip: "10.0.0.2", environment: "Production", owner: "Network team", risk: 15, status: "Protected", lastScan: ago(1, 5, 0) },
  { id: "as6", name: "vpn-gw-01", type: "Network", ip: "10.0.0.5", environment: "Production", owner: "Network team", risk: 33, status: "Protected", lastScan: ago(2, 5, 0) },
  { id: "as7", name: "staging-api", type: "Server", ip: "10.1.1.20", environment: "Staging", owner: "Platform team", risk: 46, status: "Protected", lastScan: ago(3, 6, 0) },
  { id: "as8", name: "legacy-ftp", type: "Server", ip: "10.0.9.3", environment: "Production", owner: "IT", risk: 64, status: "Offline", lastScan: ago(12, 6, 0) },
];

const SEED_DEVICES: Device[] = [
  { id: "d1", name: "FIN-LT-014", user: "Priya Nair", kind: "Laptop", os: "Windows 11", status: "At risk", encrypted: true, agentVersion: "4.2.1", threats: 3, lastSeen: minsAgo(4) },
  { id: "d2", name: "HR-DT-003", user: "Daniel Kim", kind: "Desktop", os: "Windows 10", status: "Healthy", encrypted: false, agentVersion: "4.1.8", threats: 1, lastSeen: minsAgo(25) },
  { id: "d3", name: "MKT-LT-021", user: "Sofia Alvarez", kind: "Laptop", os: "macOS 14", status: "Healthy", encrypted: true, agentVersion: "4.2.1", threats: 1, lastSeen: minsAgo(60) },
  { id: "d4", name: "ENG-LT-007", user: "Arjun Mehta", kind: "Laptop", os: "Ubuntu 22.04", status: "Healthy", encrypted: true, agentVersion: "4.2.1", threats: 0, lastSeen: minsAgo(2) },
  { id: "d5", name: "CEO-PH-001", user: "Rahul Sharma", kind: "Mobile", os: "iOS 17", status: "Healthy", encrypted: true, agentVersion: "2.9.0", threats: 0, lastSeen: minsAgo(15) },
  { id: "d6", name: "SALES-PH-012", user: "Emma Wilson", kind: "Mobile", os: "Android 14", status: "At risk", encrypted: false, agentVersion: "2.7.4", threats: 2, lastSeen: ago(1, 19, 0) },
  { id: "d7", name: "OPS-SRV-02", user: "Service account", kind: "Server", os: "Windows Server 2022", status: "Healthy", encrypted: true, agentVersion: "4.2.0", threats: 0, lastSeen: minsAgo(1) },
];

const SEED_VULNS: Vulnerability[] = [
  { id: "v1", cve: "CVE-2024-3400", title: "PAN-OS GlobalProtect command injection", severity: "Critical", cvss: 10, asset: "vpn-gw-01", status: "In progress", fixAvailable: true, discovered: ago(2) },
  { id: "v2", cve: "CVE-2024-6387", title: "OpenSSH regreSSHion remote code execution", severity: "High", cvss: 8.1, asset: "prod-api-01", status: "Open", fixAvailable: true, discovered: ago(3) },
  { id: "v3", cve: "CVE-2023-4966", title: "Citrix Bleed session token leak", severity: "Critical", cvss: 9.4, asset: "legacy-ftp", status: "Open", fixAvailable: true, discovered: ago(6) },
  { id: "v4", cve: "CVE-2024-21762", title: "FortiOS out-of-bounds write", severity: "Critical", cvss: 9.6, asset: "edge-lb-02", status: "Patched", fixAvailable: true, discovered: ago(14), patchedAt: ago(9) },
  { id: "v5", cve: "CVE-2023-44487", title: "HTTP/2 Rapid Reset DoS", severity: "High", cvss: 7.5, asset: "customer-portal", status: "Patched", fixAvailable: true, discovered: ago(20), patchedAt: ago(12) },
  { id: "v6", cve: "CVE-2024-1086", title: "Linux kernel nf_tables use-after-free", severity: "High", cvss: 7.8, asset: "staging-api", status: "Open", fixAvailable: true, discovered: ago(4) },
  { id: "v7", cve: "CVE-2023-38545", title: "curl SOCKS5 heap overflow", severity: "Medium", cvss: 6.5, asset: "db-cluster-01", status: "In progress", fixAvailable: true, discovered: ago(9) },
  { id: "v8", cve: "CVE-2024-0519", title: "Chrome V8 out-of-bounds memory access", severity: "Medium", cvss: 6.3, asset: "MKT-LT-021", status: "Patched", fixAvailable: true, discovered: ago(25), patchedAt: ago(21) },
  { id: "v9", cve: "CVE-2023-48795", title: "SSH Terrapin prefix truncation", severity: "Medium", cvss: 5.9, asset: "prod-api-01", status: "Open", fixAvailable: false, discovered: ago(11) },
  { id: "v10", cve: "CVE-2024-2961", title: "glibc iconv buffer overflow", severity: "Low", cvss: 3.7, asset: "staging-api", status: "Open", fixAvailable: true, discovered: ago(7) },
];

const SEED_INCIDENTS: Incident[] = [
  { id: "i1", ref: "INC-1047", title: "Ransomware on finance laptop", severity: "Critical", status: "Open", owner: "Charlene Reed", affectedAssets: 1, progress: 35, opened: minsAgo(40), updated: minsAgo(10), summary: "EDR blocked encryption behaviour on FIN-LT-014. Device should be isolated and the user's credentials rotated." },
  { id: "i2", ref: "INC-1046", title: "Possible data exfiltration from database", severity: "Critical", status: "Contained", owner: "Arjun Mehta", affectedAssets: 2, progress: 70, opened: ago(1, 16, 45), updated: ago(0, 8, 20), summary: "Unusual 4.2 GB outbound transfer from db-cluster-01. Egress blocked; forensic review in progress." },
  { id: "i3", ref: "INC-1045", title: "Targeted phishing campaign", severity: "High", status: "Contained", owner: "Sofia Alvarez", affectedAssets: 14, progress: 85, opened: ago(2, 9, 0), updated: ago(1, 12, 0), summary: "Credential-harvesting emails sent to 14 staff. Messages purged, two passwords reset." },
  { id: "i4", ref: "INC-1041", title: "SSH brute force against API servers", severity: "Medium", status: "Resolved", owner: "Daniel Kim", affectedAssets: 3, progress: 100, opened: ago(6, 3, 0), updated: ago(5, 15, 0), summary: "Source ranges blocked at the firewall, key-only auth enforced." },
  { id: "i5", ref: "INC-1038", title: "Malicious browser extension", severity: "Low", status: "Resolved", owner: "Priya Nair", affectedAssets: 5, progress: 100, opened: ago(12, 10, 0), updated: ago(11, 17, 0), summary: "Extension removed from 5 endpoints and added to the blocklist." },
];

const SEED_MEMBERS: Member[] = [
  { id: "m1", name: "Charlene Reed", email: "charlene@bhishtam.tech", role: "Admin", mfa: true, status: "Active", lastActive: minsAgo(1), avatar: "/images/avatars/settings-profile.png" },
  { id: "m2", name: "Arjun Mehta", email: "arjun@bhishtam.tech", role: "Responder", mfa: true, status: "Active", lastActive: minsAgo(18) },
  { id: "m3", name: "Sofia Alvarez", email: "sofia@bhishtam.tech", role: "Analyst", mfa: true, status: "Active", lastActive: ago(0, 9, 30) },
  { id: "m4", name: "Daniel Kim", email: "daniel@bhishtam.tech", role: "Analyst", mfa: false, status: "Active", lastActive: ago(1, 17, 0) },
  { id: "m5", name: "Priya Nair", email: "priya@bhishtam.tech", role: "Viewer", mfa: true, status: "Active", lastActive: ago(2, 11, 0) },
  { id: "m6", name: "Emma Wilson", email: "emma@bhishtam.tech", role: "Viewer", mfa: false, status: "Invited", lastActive: ago(3) },
];

const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Critical threat detected", body: "Ransomware behaviour blocked on FIN-LT-014", date: minsAgo(12), read: false, kind: "threat", href: "/dashboard/threats" },
  { id: "n2", title: "Incident INC-1047 opened", body: "Assigned to you — ransomware on finance laptop", date: minsAgo(40), read: false, kind: "incident", href: "/dashboard/incidents" },
  { id: "n3", title: "New critical vulnerability", body: "CVE-2024-3400 found on vpn-gw-01", date: ago(2), read: false, kind: "vulnerability", href: "/dashboard/vulnerabilities" },
  { id: "n4", title: "New sign-in", body: "Your account was accessed from Chrome on Windows", date: ago(2, 7, 3), read: true, kind: "security", href: "/dashboard/settings?tab=security" },
  { id: "n5", title: "Weekly security report ready", body: "Your score improved by 4 points this week", date: ago(4), read: true, kind: "info", href: "/dashboard" },
];

const SEED_USER: User = {
  name: "Charlene Reed",
  username: "charlene.reed",
  email: "charlene@bhishtam.tech",
  jobTitle: "Security Operations Lead",
  company: "Bhishtam Tech",
  phone: "+1 (123) 456 7890",
  city: "San Jose",
  country: "USA",
  avatar: "/images/avatars/settings-profile.png",
};

/** Security services the customer can subscribe to (services page). Static catalogue; subscriptions live in the store. */
export const SERVICE_IDS = ["soc", "pentest", "cloud", "email", "endpoint", "training"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

/* ---------- store ---------- */

interface AppState {
  user: User;
  preferences: Preferences;
  security: Security;
  alerts: Alert[];
  assets: Asset[];
  devices: Device[];
  vulnerabilities: Vulnerability[];
  incidents: Incident[];
  members: Member[];
  services: ServiceId[]; // active subscriptions
  notifications: Notification[];
  sidebarCollapsed: boolean;

  toggleSidebar: () => void;
  updateUser: (patch: Partial<User>) => void;
  updatePreferences: (patch: Partial<Preferences>) => void;
  updateSecurity: (patch: Partial<Security>) => void;

  updateAlert: (id: string, patch: Partial<Alert>) => void;

  addAsset: (a: Omit<Asset, "id" | "risk" | "status" | "lastScan"> & Partial<Asset>) => Asset;
  updateAsset: (id: string, patch: Partial<Asset>) => void;
  removeAsset: (id: string) => void;

  addDevice: (d: Omit<Device, "id" | "status" | "threats" | "lastSeen" | "agentVersion"> & Partial<Device>) => Device;
  updateDevice: (id: string, patch: Partial<Device>) => void;
  removeDevice: (id: string) => void;

  updateVulnerability: (id: string, patch: Partial<Vulnerability>) => void;

  addIncident: (i: Omit<Incident, "id" | "ref" | "status" | "progress" | "opened" | "updated"> & Partial<Incident>) => Incident;
  updateIncident: (id: string, patch: Partial<Incident>) => void;

  inviteMember: (m: Pick<Member, "name" | "email" | "role">) => Member;
  updateMember: (id: string, patch: Partial<Member>) => void;
  removeMember: (id: string) => void;

  toggleService: (id: ServiceId) => void;

  notify: (n: Omit<Notification, "id" | "date" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  reset: () => void;
}

const seed = () => ({
  user: SEED_USER,
  preferences: {
    timeZone: "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    alertThreshold: "High" as Severity,
    notifyCritical: true,
    notifyWeeklyReport: true,
    notifyProductUpdates: false,
  },
  security: { twoFactor: true },
  alerts: SEED_ALERTS,
  assets: SEED_ASSETS,
  devices: SEED_DEVICES,
  vulnerabilities: SEED_VULNS,
  incidents: SEED_INCIDENTS,
  members: SEED_MEMBERS,
  services: ["soc", "endpoint", "email"] as ServiceId[],
  notifications: SEED_NOTIFICATIONS,
});

const patchById = <T extends { id: string }>(list: T[], id: string, patch: Partial<T>) => list.map((x) => (x.id === id ? { ...x, ...patch } : x));

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...seed(),
      sidebarCollapsed: false,

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      updateUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),
      updatePreferences: (patch) => set((s) => ({ preferences: { ...s.preferences, ...patch } })),
      updateSecurity: (patch) => set((s) => ({ security: { ...s.security, ...patch } })),

      updateAlert: (id, patch) => set((s) => ({ alerts: patchById(s.alerts, id, patch) })),

      addAsset: (a) => {
        const asset: Asset = { risk: 20, status: "Protected", lastScan: new Date().toISOString(), ...a, id: uid() };
        set((s) => ({ assets: [asset, ...s.assets] }));
        get().notify({ title: "Asset added", body: `${asset.name} is now monitored`, kind: "info", href: "/dashboard/assets" });
        return asset;
      },
      updateAsset: (id, patch) => set((s) => ({ assets: patchById(s.assets, id, patch) })),
      removeAsset: (id) => set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),

      addDevice: (d) => {
        const device: Device = { status: "Healthy", threats: 0, lastSeen: new Date().toISOString(), agentVersion: "4.2.1", ...d, id: uid() };
        set((s) => ({ devices: [device, ...s.devices] }));
        get().notify({ title: "Device enrolled", body: `${device.name} (${device.user}) is now protected`, kind: "device", href: "/dashboard/devices" });
        return device;
      },
      updateDevice: (id, patch) => set((s) => ({ devices: patchById(s.devices, id, patch) })),
      removeDevice: (id) => set((s) => ({ devices: s.devices.filter((d) => d.id !== id) })),

      updateVulnerability: (id, patch) =>
        set((s) => ({
          vulnerabilities: patchById(s.vulnerabilities, id, {
            ...patch,
            ...(patch.status && { patchedAt: patch.status === "Patched" ? new Date().toISOString() : undefined }),
          }),
        })),

      addIncident: (i) => {
        const now = new Date().toISOString();
        const next = Math.max(1000, ...get().incidents.map((x) => Number(x.ref.slice(4)) || 0)) + 1;
        const incident: Incident = { status: "Open", progress: 0, opened: now, updated: now, ...i, id: uid(), ref: `INC-${next}` };
        set((s) => ({ incidents: [incident, ...s.incidents] }));
        get().notify({ title: `Incident ${incident.ref} opened`, body: incident.title, kind: "incident", href: "/dashboard/incidents" });
        return incident;
      },
      updateIncident: (id, patch) =>
        set((s) => ({ incidents: patchById(s.incidents, id, { ...patch, updated: new Date().toISOString() }) })),

      inviteMember: (m) => {
        const member: Member = { ...m, id: uid(), mfa: false, status: "Invited", lastActive: new Date().toISOString() };
        set((s) => ({ members: [...s.members, member] }));
        return member;
      },
      updateMember: (id, patch) => set((s) => ({ members: patchById(s.members, id, patch) })),
      removeMember: (id) => set((s) => ({ members: s.members.filter((m) => m.id !== id) })),

      toggleService: (id) =>
        set((s) => ({ services: s.services.includes(id) ? s.services.filter((x) => x !== id) : [...s.services, id] })),

      notify: (n) => set((s) => ({ notifications: [{ ...n, id: uid(), date: new Date().toISOString(), read: false }, ...s.notifications] })),
      markRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      removeNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      clearNotifications: () => set({ notifications: [] }),

      reset: () => set(seed()),
    }),
    // new storage key: old "bankdash-store" data has a different shape
    { name: "bhishtam-store", version: 1, skipHydration: true },
  ),
);

/* ---------- derived values & formatting helpers ---------- */

/** Overall posture 0–100: starts at 100 and loses points for open risk. */
export function securityScore(s: Pick<AppState, "alerts" | "vulnerabilities" | "incidents" | "devices">) {
  const W: Record<Severity, number> = { Critical: 6, High: 3, Medium: 1.5, Low: 0.5 };
  let penalty = 0;
  for (const a of s.alerts) if (a.status !== "Resolved") penalty += W[a.severity];
  for (const v of s.vulnerabilities) if (v.status !== "Patched") penalty += W[v.severity] * 0.6;
  for (const i of s.incidents) if (i.status !== "Resolved") penalty += W[i.severity] * 0.8;
  for (const d of s.devices) if (d.status === "At risk") penalty += 1.5;
  return Math.max(0, Math.min(100, Math.round(100 - penalty)));
}

export const scoreLabel = (n: number) => (n >= 85 ? "Excellent" : n >= 70 ? "Good" : n >= 50 ? "Fair" : "Poor");

export function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/* ---------- session (demo auth) ---------- */
export const SESSION_COOKIE = "bd_session";
export function setSession(email: string, remember: boolean) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : undefined;
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(email)}; path=/; SameSite=Lax${maxAge ? `; max-age=${maxAge}` : ""}`;
}
export function clearSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}
