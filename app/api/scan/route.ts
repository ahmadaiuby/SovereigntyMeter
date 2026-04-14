import { NextRequest, NextResponse } from "next/server";
import { calcSovereigntyScore, detectInfraOwner } from "@/lib/sovereignty";
import { getCablesForRoute, getCablesForCountry } from "@/lib/cables";
import dns from "dns";
import { promisify } from "util";

const resolve4 = promisify(dns.resolve4);

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain")?.toLowerCase().trim();

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  // Clean domain
  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "");

  try {
    // 1. Resolve IP
    let ip: string;
    try {
      const addresses = await resolve4(cleanDomain);
      ip = addresses[0];
    } catch {
      return NextResponse.json({ error: `Could not resolve domain: ${cleanDomain}` }, { status: 422 });
    }

    // 2. Query IPInfo
    const token = process.env.IPINFO_TOKEN;
    const ipinfoUrl = token
      ? `https://ipinfo.io/${ip}/json?token=${token}`
      : `https://ipinfo.io/${ip}/json`;

    const ipRes = await fetch(ipinfoUrl);
    if (!ipRes.ok) {
      return NextResponse.json({ error: "IPInfo lookup failed" }, { status: 502 });
    }
    const ipData = await ipRes.json();

    const serverCountry = ipData.country || "XX";
    const org = ipData.org || "Unknown";
    const city = ipData.city || "Unknown";
    const region = ipData.region || "";
    const asn = ipData.org?.split(" ")[0] || "Unknown";
    const coords = ipData.loc ? ipData.loc.split(",").map(Number) : [0, 0];

    // 3. Sovereignty score (user assumed to be in SA — Saudi Arabia)
    const sovereignty = calcSovereigntyScore(serverCountry, org, "SA");
    const infraOwner = detectInfraOwner(org);

    // 4. Cables
    const cables = getCablesForRoute("SA", serverCountry);
    const fallbackCables = cables.length === 0 ? getCablesForCountry(serverCountry) : cables;

    return NextResponse.json({
      domain: cleanDomain,
      ip,
      city,
      region,
      country: serverCountry,
      org,
      asn,
      coords,
      infraOwner,
      sovereignty,
      cables: fallbackCables,
    });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json({ error: "Scan failed. Please try again." }, { status: 500 });
  }
}
