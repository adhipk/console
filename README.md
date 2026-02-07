# Console - Color E-Ink Dashboard

A beautiful dashboard for the **Pimoroni Inky Impression 5.7"** (600x448, 7-color) e-ink display, built on the [TRMNL BYOS](https://github.com/usetrmnl/byos_next) ecosystem.

## Architecture

```
┌────────────────────────────────────────┐
│  server/ (Next.js BYOS)               │
│  React → Takumi → Color PNG (600x448) │
│  Served via /api/display               │
└──────────────┬─────────────────────────┘
               │ HTTP
┌──────────────▼─────────────────────────┐
│  display/ (trmnl-display, Go)          │
│  Fetches PNG → pushes to Inky via SPI  │
└────────────────────────────────────────┘
```

## Screens

Four custom recipe screens, designed for the 7-color e-ink palette (black, white, red, green, blue, yellow, orange):

| Screen | Description |
|--------|-------------|
| **Color Dashboard** | Composite: date/time header, weather, calendar events, daily quote |
| **Color Weather** | Detailed weather with hourly forecast, 4-day outlook, sunrise/sunset |
| **Daily Agenda** | Color-coded schedule (morning/afternoon/evening) with task checklist |
| **Daily Quote** | Minimalist quote of the day with category-based accent colors |

All screens use live data from Open-Meteo (no API key required).

## Quick Start

### 1. Server (run on any machine or on the Pi)

```bash
cd server
cp .env.example .env.local  # or just create it
echo "AUTH_ENABLED=false" > .env.local
pnpm install
pnpm dev
```

The server runs at `http://localhost:3000`. Preview screens at `/recipes`.

### 2. Display Client (run on the Raspberry Pi)

```bash
cd display
./build.sh
# Select option 4: Pimoroni Inky Impression 5.7"
```

Configure the client to point at your server:

```bash
mkdir -p ~/.config/trmnl
cat > ~/.config/trmnl/config.json << 'EOF'
{
  "device_id": "AA:BB:CC:DD:EE:FF",
  "base_url": "http://<server-ip>:3000"
}
EOF
```

Replace `<server-ip>` with your server's IP address (use `localhost` if running on the same Pi).

Start the display:

```bash
./trmnl-display
```

### 3. Run on Boot (optional)

```bash
crontab -e
# Add:
@reboot sleep 15 && nohup /path/to/display/trmnl-display > ~/.config/trmnl/logfile.log 2>&1 &
```

## Configuration

### Change Weather Location

Visit `http://<server-ip>:3000/recipes/color-dashboard` and change the Location parameter, or edit the recipe's default props.

### Change Default Screen

Edit `server/app/api/display/route.ts`:

```typescript
export const DEFAULT_SCREEN = "color-dashboard"; // or "color-weather", "daily-agenda", "daily-quote"
```

### Set Up a Playlist (requires database)

With a Postgres database connected, you can create playlists that rotate between screens on a timer using the web UI at `/playlists`.

## Display Specs

- **Model**: Pimoroni Inky Impression 5.7"
- **Resolution**: 600 x 448 pixels
- **Colors**: 7 (black, white, red, green, blue, yellow, orange)
- **Refresh**: ~30 seconds per update
- **Default interval**: 15 minutes

## Tech Stack

- **Server**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Takumi renderer
- **Display**: Go, bb_epaper (SPI driver)
- **Weather**: Open-Meteo API (free, no key needed)
