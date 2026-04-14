export interface SovereigntyFactor {
  label: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface SovereigntyResult {
  total: number;
  grade: string;
  color: string;
  verdict: string;
  factors: SovereigntyFactor[];
}

// Countries with strong data surveillance / FVEY / cloud dominance
const LOW_SOVEREIGNTY_COUNTRIES: Record<string, number> = {
  US: 0,   // FVEY, Big Tech home
  GB: 5,   // FVEY
  AU: 8,   // FVEY
  CA: 8,   // FVEY
  NZ: 10,  // FVEY
  CN: 5,   // State surveillance
  RU: 10,  // State surveillance
};

const MEDIUM_SOVEREIGNTY_COUNTRIES: Record<string, number> = {
  DE: 25, // Strong GDPR, but EU
  FR: 22,
  NL: 20,
  SE: 22,
  FI: 25,
  NO: 25,
  CH: 28, // Swiss neutrality
  IS: 30, // Strong privacy laws
  JP: 18,
  SG: 15,
};

// Big Tech / hyperscaler orgs that indicate dependency
const BIG_TECH_ORGS = [
  { match: /amazon|aws|A2 Hosting/i, score: 0, label: "Amazon AWS" },
  { match: /google|gcp|alphabet/i, score: 0, label: "Google Cloud" },
  { match: /microsoft|azure/i, score: 2, label: "Microsoft Azure" },
  { match: /cloudflare/i, score: 5, label: "Cloudflare" },
  { match: /fastly/i, score: 5, label: "Fastly CDN" },
  { match: /akamai/i, score: 5, label: "Akamai" },
  { match: /meta|facebook/i, score: 0, label: "Meta" },
  { match: /digitalocean/i, score: 10, label: "DigitalOcean" },
  { match: /linode|akamai/i, score: 10, label: "Linode/Akamai" },
  { match: /hetzner/i, score: 22, label: "Hetzner (EU)" },
  { match: /ovh/i, score: 20, label: "OVHcloud (FR)" },
  { match: /alibaba/i, score: 3, label: "Alibaba Cloud" },
  { match: /tencent/i, score: 3, label: "Tencent Cloud" },
  { match: /oracle/i, score: 8, label: "Oracle Cloud" },
  { match: /vultr/i, score: 12, label: "Vultr" },
];

export function calcSovereigntyScore(
  serverCountry: string,
  org: string,
  userCountry: string = "SA" // default to Saudi Arabia (user's location)
): SovereigntyResult {
  const factors: SovereigntyFactor[] = [];

  // Factor 1: Server country (0–35 points)
  let countryScore = 20; // default mid
  const countryKey = serverCountry?.toUpperCase();
  if (LOW_SOVEREIGNTY_COUNTRIES[countryKey] !== undefined) {
    countryScore = LOW_SOVEREIGNTY_COUNTRIES[countryKey];
  } else if (MEDIUM_SOVEREIGNTY_COUNTRIES[countryKey] !== undefined) {
    countryScore = MEDIUM_SOVEREIGNTY_COUNTRIES[countryKey];
  } else if (countryKey === userCountry) {
    countryScore = 35; // local country = max
  } else {
    // Regional scoring: same region = higher
    countryScore = 18;
  }

  factors.push({
    label: "Server jurisdiction",
    score: countryScore,
    maxScore: 35,
    description: countryKey === userCountry
      ? `Server is in your country (${serverCountry})`
      : LOW_SOVEREIGNTY_COUNTRIES[countryKey] !== undefined
        ? `${serverCountry} is a surveillance-heavy or dominant tech jurisdiction`
        : `${serverCountry} has moderate data sovereignty protections`,
  });

  // Factor 2: Infrastructure owner (0–40 points)
  let infraScore = 25; // unknown = moderate
  let infraLabel = "Unknown/Independent";
  for (const tech of BIG_TECH_ORGS) {
    if (tech.match.test(org)) {
      infraScore = tech.score;
      infraLabel = tech.label;
      break;
    }
  }
  // If not matched to big tech, it's likely a local/regional ISP
  if (infraLabel === "Unknown/Independent") {
    infraScore = 32;
    infraLabel = "Local/Regional ISP";
  }

  factors.push({
    label: "Infrastructure owner",
    score: infraScore,
    maxScore: 40,
    description: infraScore <= 5
      ? `${infraLabel} — a dominant Western or Chinese cloud provider`
      : infraScore <= 15
        ? `${infraLabel} — large CDN/cloud, significant market concentration`
        : `${infraLabel} — more independent infrastructure`,
  });

  // Factor 3: Cross-border routing (0–25 points)
  let routingScore = 15;
  if (countryKey === userCountry) {
    routingScore = 25; // no border crossing
  } else if (LOW_SOVEREIGNTY_COUNTRIES[countryKey] !== undefined) {
    routingScore = 5; // crosses into surveillance jurisdiction
  } else {
    routingScore = 12;
  }

  factors.push({
    label: "Cross-border routing",
    score: routingScore,
    maxScore: 25,
    description: countryKey === userCountry
      ? "Traffic stays within your jurisdiction"
      : `Your data crosses borders into ${serverCountry}`,
  });

  const total = factors.reduce((sum, f) => sum + f.score, 0);

  let grade: string;
  let color: string;
  let verdict: string;

  if (total >= 75) {
    grade = "A";
    color = "#3ddc97";
    verdict = "High sovereignty — local or independent infrastructure";
  } else if (total >= 55) {
    grade = "B";
    color = "#c8963c";
    verdict = "Moderate sovereignty — some foreign dependency";
  } else if (total >= 35) {
    grade = "C";
    color = "#e07b39";
    verdict = "Low sovereignty — significant foreign infrastructure control";
  } else {
    grade = "D";
    color = "#b5432a";
    verdict = "Critical dependency — data routed through dominant tech jurisdictions";
  }

  return { total, grade, color, verdict, factors };
}

export function detectInfraOwner(org: string): string {
  for (const tech of BIG_TECH_ORGS) {
    if (tech.match.test(org)) return tech.label;
  }
  return org?.split(" ").slice(0, 3).join(" ") || "Unknown";
}
