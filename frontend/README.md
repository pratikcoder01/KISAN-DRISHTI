# KISAN-DRISHTI — Frontend Website

A **frontend-only** multi-page website for the KISAN-DRISHTI agricultural platform. No backend or server required.

## How to open

1. **From file system:** Open `index.html` in your browser (double-click or drag into browser).
2. **With a local server (recommended):** From the `website` folder run:
   - **Python 3:** `python -m http.server 8080` then visit http://localhost:8080
   - **Node (npx):** `npx serve .` then use the URL shown

## Structure

```
website/
├── index.html              ← Start here (role selection)
├── css/
│   └── style.css           ← Shared styles (gradients, cards, forms, nav, etc.)
├── js/
│   └── main.js             ← Tailwind config & shared script (load before Tailwind CDN)
├── farmer/
│   ├── onboarding.html
│   ├── dashboard.html
│   ├── market-prices.html
│   ├── profit-calculator.html
│   ├── mandi-locator.html
│   └── profile.html
└── official/
    ├── login.html
    ├── dashboard.html
    ├── analytics.html
    └── support.html
```

## Flow

- **Home** (`index.html`): Choose “Farmer” or “Market Official”.
- **Farmer:** Onboarding → Dashboard (market prices, weather, alerts) → Prices / Profit / Mandi / Profile.
- **Official:** Login → Dashboard (price management) → Analytics / Support.

All links are relative; navigation is consistent across pages. Styling uses Tailwind CSS (CDN) and a single primary green theme.
