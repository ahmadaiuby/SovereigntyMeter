# SovereigntyMeter — Digital Sovereignty Meter

Reveal the hidden geography of any website: who owns the infrastructure, where your data travels, and what it means — with a decolonial poem generated fresh for each scan.

## What it does

For any domain you enter, Territorial shows:

- **Server location** — city, country, coordinates
- **Infrastructure owner** — AWS, Google, Cloudflare, local ISP, etc.
- **Autonomous System / ASN** — the routing network behind the IP
- **Sovereignty Score (0–100)** — based on server jurisdiction, infrastructure owner, and cross-border routing
- **Signal journey map** — animated SVG arc showing your data crossing borders
- **Likely undersea cables** — physical cables your traffic probably traverses
- **Generated poem** — written by Claude AI in a decolonial voice, unique to each scan

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get your API keys

- **IPInfo** (free): https://ipinfo.io/signup — 50,000 requests/month free
- **Anthropic** (paid): https://console.anthropic.com

### 3. Create `.env.local`

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
IPINFO_TOKEN=your_ipinfo_token_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> Note: The app works without `IPINFO_TOKEN` (uses free unauthenticated IPInfo tier, rate-limited). The poem requires `ANTHROPIC_API_KEY`.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How the Sovereignty Score works

The score (0–100) is calculated across three factors:

| Factor | Max Points | Logic |
|--------|-----------|-------|
| Server jurisdiction | 35 | US/CN = 0, FVEY = low, EU = medium, local = max |
| Infrastructure owner | 40 | AWS/Google = 0, Cloudflare = 5, OVH = 20, local ISP = 32 |
| Cross-border routing | 25 | Same country = 25, surveillance jurisdiction = 5 |

**Grades:**
- A (75–100): High sovereignty
- B (55–74): Moderate dependency
- C (35–54): Significant foreign control
- D (0–34): Critical dependency

> This is an interpretive framework, not a legal assessment.

## Tech stack

- **Next.js 15** (App Router) — API routes keep keys server-side
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — animations
- **IPInfo.io** — IP geolocation and ASN data
- **Anthropic Claude API** — poem generation
- **TeleGeography** — undersea cable reference data (hardcoded dataset)

## Project structure

```
territorial/
├── app/
│   ├── page.tsx              # Main UI
│   ├── globals.css           # Design tokens, fonts
│   └── api/
│       ├── scan/route.ts     # DNS + IPInfo + scoring
│       └── poem/route.ts     # Claude poem generation
├── components/
│   ├── SignalMap.tsx          # Animated SVG journey map
│   ├── SovereigntyMeter.tsx   # Score display with factor breakdown
│   └── PoemDisplay.tsx        # Typewriter poem reveal
└── lib/
    ├── sovereignty.ts         # Scoring logic
    └── cables.ts              # 25+ undersea cables dataset
```

## Extending

**Add more cables:** Edit `lib/cables.ts` — each cable has name, length, countries (ISO codes), owners, and readyForService year.

**Adjust scoring:** Edit `lib/sovereignty.ts` — modify `LOW_SOVEREIGNTY_COUNTRIES`, `MEDIUM_SOVEREIGNTY_COUNTRIES`, or `BIG_TECH_ORGS` to reflect your scoring philosophy.

**Change the poem style:** Edit the prompt in `app/api/poem/route.ts`.

## Notes

- Domains behind Cloudflare or other CDNs will show the CDN's infrastructure, not the origin server — this is accurate, as that *is* who handles your request
- IP geolocation is approximate; data center locations may vary
- The sovereignty score reflects a particular political perspective on internet infrastructure — it is intentionally opinionated

---

Built with Claude · Data from IPinfo.io · Cable data from TeleGeography
