// Hardcoded reference dataset based on TeleGeography public cable data
// https://www.submarinecablemap.com/

export interface Cable {
  name: string;
  length: string;
  countries: string[];
  readyForService?: string;
  owners?: string[];
}

// Country code to cable mapping
export const CABLE_BY_COUNTRY_PAIR: Record<string, Cable[]> = {};

export const CABLES: Cable[] = [
  {
    name: "2Africa",
    length: "45,000 km",
    countries: ["GB", "PT", "FR", "ES", "MA", "MR", "SN", "CV", "GN", "CI", "GH", "NG", "CM", "GA", "AO", "ZA", "MZ", "TZ", "KE", "SO", "DJ", "ET", "EG", "SA", "IN", "PK"],
    readyForService: "2024",
    owners: ["Meta", "MTN", "Orange", "Vodafone", "telecom egypt"]
  },
  {
    name: "FALCON",
    length: "8,000 km",
    countries: ["AE", "BH", "KW", "OM", "QA", "SA", "DJ", "YE", "PK", "IN"],
    readyForService: "2008",
    owners: ["FLAG Telecom"]
  },
  {
    name: "SEA-ME-WE 4",
    length: "20,000 km",
    countries: ["FR", "IT", "TN", "EG", "SA", "DJ", "IN", "LK", "MY", "TH", "SG"],
    readyForService: "2005",
    owners: ["Orange", "Telecom Italia", "SingTel"]
  },
  {
    name: "SEA-ME-WE 5",
    length: "20,000 km",
    countries: ["FR", "IT", "TR", "EG", "SA", "UAE", "PK", "IN", "LK", "MY", "SG", "CN"],
    readyForService: "2016",
    owners: ["Orange", "SingTel", "Telecom Italia"]
  },
  {
    name: "SEA-ME-WE 6",
    length: "19,200 km",
    countries: ["FR", "EG", "SA", "IN", "MY", "SG"],
    readyForService: "2025",
    owners: ["SubCom"]
  },
  {
    name: "IMEWE",
    length: "13,000 km",
    countries: ["FR", "IT", "EG", "SA", "IN", "SG"],
    readyForService: "2010",
    owners: ["STC", "Orange", "Telecom Italia"]
  },
  {
    name: "EIG (Europe India Gateway)",
    length: "15,000 km",
    countries: ["GB", "PT", "MA", "MR", "SN", "CV", "GH", "NG", "AO", "ZA", "EG", "IN"],
    readyForService: "2010",
    owners: ["BT", "Etisalat", "BSNL"]
  },
  {
    name: "AAE-1 (Asia Africa Europe 1)",
    length: "25,000 km",
    countries: ["HK", "VN", "TH", "MY", "SG", "LK", "IN", "PK", "OM", "AE", "QA", "YE", "DJ", "EG", "GR", "IT", "FR"],
    readyForService: "2017",
    owners: ["Ooredoo", "STC", "Etisalat", "du"]
  },
  {
    name: "PEACE Cable",
    length: "15,000 km",
    countries: ["CN", "PK", "KE", "EG", "FR"],
    readyForService: "2022",
    owners: ["PEACE Cable International Network"]
  },
  {
    name: "Transatlantic (TAT-14)",
    length: "15,428 km",
    countries: ["US", "GB", "NL", "DK", "DE", "FR"],
    readyForService: "2001",
    owners: ["AT&T", "Deutsche Telekom", "France Telecom"]
  },
  {
    name: "AEConnect",
    length: "14,000 km",
    countries: ["US", "IE", "GB"],
    readyForService: "2016",
    owners: ["Aqua Comms"]
  },
  {
    name: "MAREA",
    length: "6,600 km",
    countries: ["US", "ES"],
    readyForService: "2017",
    owners: ["Microsoft", "Meta"]
  },
  {
    name: "Dunant",
    length: "6,600 km",
    countries: ["US", "FR"],
    readyForService: "2021",
    owners: ["Google"]
  },
  {
    name: "Grace Hopper",
    length: "6,300 km",
    countries: ["US", "GB", "ES"],
    readyForService: "2022",
    owners: ["Google"]
  },
  {
    name: "Amitié",
    length: "6,800 km",
    countries: ["US", "FR", "GB"],
    readyForService: "2024",
    owners: ["Meta", "Microsoft", "Aqua Comms"]
  },
  {
    name: "TPE (Trans-Pacific Express)",
    length: "17,700 km",
    countries: ["US", "JP", "CN", "KR", "TW"],
    readyForService: "2008",
    owners: ["AT&T", "China Telecom", "KT"]
  },
  {
    name: "FASTER",
    length: "9,000 km",
    countries: ["US", "JP"],
    readyForService: "2016",
    owners: ["Google", "SoftBank", "China Mobile"]
  },
  {
    name: "UNITY",
    length: "10,000 km",
    countries: ["US", "JP"],
    readyForService: "2010",
    owners: ["Google", "Bharti Airtel", "KDDI"]
  },
  {
    name: "Jupiter",
    length: "14,000 km",
    countries: ["US", "JP", "PH"],
    readyForService: "2020",
    owners: ["Amazon", "SoftBank", "PLDT"]
  },
  {
    name: "Pacific Light Cable Network (PLCN)",
    length: "12,900 km",
    countries: ["US", "PH", "HK", "TW"],
    readyForService: "2022",
    owners: ["Google", "Meta"]
  },
  {
    name: "Bay to Bay Express (BtoBE)",
    length: "900 km",
    countries: ["US", "MX"],
    readyForService: "2023",
    owners: ["Google"]
  },
  {
    name: "ALBA-1",
    length: "2,000 km",
    countries: ["SA", "EG"],
    readyForService: "2021",
    owners: ["STC", "Telecom Egypt"]
  },
  {
    name: "Medusa",
    length: "8,400 km",
    countries: ["PT", "ES", "FR", "IT", "GR", "TR", "EG", "MA", "DZ", "TN", "LY"],
    readyForService: "2024",
    owners: ["Orange", "Telecom Italia"]
  },
  {
    name: "Hawaiki",
    length: "14,000 km",
    countries: ["US", "AU", "NZ"],
    readyForService: "2018",
    owners: ["Hawaiki Submarine Cable"]
  },
  {
    name: "Southern Cross NEXT",
    length: "13,700 km",
    countries: ["US", "AU", "NZ", "FJ"],
    readyForService: "2022",
    owners: ["Southern Cross"]
  },
  {
    name: "INDIGO",
    length: "9,000 km",
    countries: ["AU", "SG", "ID"],
    readyForService: "2019",
    owners: ["Google", "Telstra", "SubPartners"]
  },
  {
    name: "Africa-1",
    length: "8,000 km",
    countries: ["SA", "DJ", "KE", "TZ", "MZ", "ZA"],
    readyForService: "2023",
    owners: ["STC", "Telecom Egypt", "Djibouti Telecom"]
  },
  {
    name: "EAST (Eastern Africa Submarine System)",
    length: "10,000 km",
    countries: ["ZA", "MZ", "TZ", "KE", "SO", "DJ"],
    readyForService: "2010",
    owners: ["TEAMS", "SEACOM"]
  },
];

export function getCablesForRoute(originCountry: string, destCountry: string): Cable[] {
  if (!originCountry || !destCountry || originCountry === destCountry) return [];

  const matchingCables = CABLES.filter(cable =>
    cable.countries.includes(originCountry) && cable.countries.includes(destCountry)
  );

  // If no direct match, find cables that include at least the destination
  if (matchingCables.length === 0) {
    return CABLES.filter(cable => cable.countries.includes(destCountry)).slice(0, 2);
  }

  return matchingCables.slice(0, 3);
}

export function getCablesForCountry(country: string): Cable[] {
  return CABLES.filter(c => c.countries.includes(country)).slice(0, 4);
}
