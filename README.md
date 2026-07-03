# Strompreis-Visualisierung

Interaktive Scrollytelling-Anwendung zur Klimaneutralität des deutschen Stromsystems 2015–2025.

**Technologie-Stack:** Nuxt 4, Vue 3, D3.js, SQLite (better-sqlite3)

## Setup

```bash
# Dependencies installieren
bun install

# JSON-Daten in SQLite-Datenbank importieren (einmalig)
node scripts/import-to-sqlite.js
```

Die Datenbank wird unter `data/energy.db` angelegt und über Nuxt-Server-Routen bereitgestellt (`/api/hour`, `/api/day`, `/api/week`, `/api/year`).

## Entwicklung

```bash
bun run dev     # Dev-Server auf http://localhost:3000
```

## Datenbank

| Tabelle | Zeilen | Inhalt | API-Route |
|---------|--------|--------|-----------|
| `hour`  | ~89.000 | Stündliche Stromerzeugung, Preise, CO₂ | `GET /api/hour` |
| `day`   | ~3.800  | Tagesaggregation | `GET /api/day` |
| `week`  | ~550    | Wochenaggregation | `GET /api/week` |
| `year`  | 11      | Jahresaggregation | `GET /api/year` |

**Indizes:** `timestamp`, `date`, `year` auf allen Tabellen.

**Optionale Filter:** `?year=2024` oder `?year=2024&month=5` (nur hour).

### Migration von JSON zu SQLite

Die Original-JSON-Daten liegen unverändert in `public/data/`. Das Skript `scripts/import-to-sqlite.js` importiert sie einmalig in SQLite. Die API-Routen in `server/api/` lesen aus der Datenbank und geben identische Datenstrukturen zurück wie zuvor die JSON-Dateien.

```bash
node scripts/import-to-sqlite.js
```

## Datenquellen

- **SMARD** (Bundesnetzagentur) – Stromerzeugung und -last
- **ENTSO-E** – Day-Ahead-Börsenstrompreise
- **Umweltbundesamt** – CO₂-Emissionsfaktoren

## Produktion

```bash
bun run build
bun run preview

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
