# GitHub Wrapped 🎁

Spotify Wrapped for your GitHub — see your year in code.

## Features
- Overview stats (commits, repos, stars, badges)
- Top languages with animated bars
- Commit streak heatmap (last 28 days)
- Peak coding hours chart
- Share card with one-click image download + LinkedIn post copy

## Tech Stack
- Next.js 14 (App Router)
- Framer Motion (slide animations)
- Tailwind CSS (dark theme)
- html2canvas (share image generation)
- GitHub Public REST API (no token required)

## Run locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel (2 minutes)

```bash
npm install -g vercel
vercel deploy
```

Or push to GitHub and connect at vercel.com — it auto-detects Next.js.

## LinkedIn post tip
> "Built GitHub Wrapped in a weekend — paste any username and see your year in code, Spotify-style. Live at [your-url] 🎁"
> Attach the downloaded share card image for maximum engagement.
