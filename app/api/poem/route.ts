import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { domain, country, city, org, asn, infraOwner, sovereigntyScore, sovereigntyVerdict } = body;

  if (!domain) {
    return NextResponse.json({ error: "Domain required" }, { status: 400 });
  }

  const prompt = `You are a decolonial poet writing about the hidden geographies of the internet.

A user from Saudi Arabia just scanned the domain: ${domain}

Here is what the scan revealed:
- Server location: ${city}, ${country}
- Infrastructure owner: ${infraOwner} (org: ${org})
- Autonomous System: ${asn}
- Digital Sovereignty Score: ${sovereigntyScore}/100
- Verdict: ${sovereigntyVerdict}

Write a short poem (8–14 lines) in a decolonial voice about where this data travels, who owns the wires, and what it means for the person whose click just crossed borders. The poem should:
- Be specific to the actual geography (mention ${country}, ${city} if fitting)
- Name the infrastructure owner (${infraOwner}) if it is a big tech company
- Be lyrical but grounded — not sentimental
- Speak to power, distance, and the invisible architecture of the internet
- Use line breaks for rhythm, not rhyme schemes
- Not use the words "decolonial" or "sovereignty" explicitly

Return ONLY the poem, no title, no explanation.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const poem = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    return NextResponse.json({ poem });
  } catch (err) {
    console.error("Poem generation error:", err);
    return NextResponse.json({ error: "Poem generation failed" }, { status: 500 });
  }
}
