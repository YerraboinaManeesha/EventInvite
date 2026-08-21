# EventInvite

A full-stack platform where anyone can sign up, pick an event type (Wedding, Birthday,
Engagement/Anniversary, Baby Shower/Naming, Corporate Event, Reunion), fill in their details,
and get their own live, shareable invitation website with a working RSVP form — no code, no
Framer credits, no design work needed on their end.

This is a real coded application (not a no-code builder export), built the same way as your
ComfortLearning and TaskFlow projects: Express + MongoDB backend, React frontend.

---

## How it works

**Creators** (people making an invitation):
1. Sign up for a free account
2. Pick an event type
3. Fill in a short form — names/title, date, location, schedule, venues, photos
4. Get a unique link like `yoursite.com/i/anaya-vikram-8f3k`
5. Manage it anytime from their Dashboard — edit details, swap photos, view RSVP responses, export as CSV

**Guests** (people receiving the invitation):
1. Open the shared link — no account needed
2. View the invitation (themed to match the event type)
3. Fill out and submit the RSVP form
4. Response is saved and shows up in the creator's dashboard instantly

---

## Project structure

```
eventinvite/
├── server/              Express + MongoDB backend
│   ├── models/          User, Invitation, Rsvp schemas
│   ├── routes/          auth.js, invitations.js
│   ├── middleware/       auth.js (session guard)
│   ├── eventTypes.js     Shared config: theme + form fields per event type
│   ├── db.js             MongoDB connection (in-memory or persistent)
│   └── server.js         App entry point
│
└── client/              React (Vite) frontend
    └── src/
        ├── pages/         Home, Signup, Login, Dashboard, Create/Edit, PublicInvitation
        ├── components/    Navbar, Reveal (scroll animation), form editors, PhotoUploader
        ├── context/       AuthContext
        └── api.js         Fetch helper for talking to the backend
```

---

## Running it locally

You'll need [Node.js](https://nodejs.org) installed (version 18 or higher).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm start
```

The server starts on `http://localhost:4000`. On first run, if you haven't set `MONGODB_URI`
in `.env`, it automatically downloads and starts a temporary local MongoDB instance for you —
this is zero-config but **data resets every time you restart the server**. This first download
can take a minute or two; it only happens once (cached after that).

For data that actually persists, create a free cluster at
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas), copy its connection string, and paste it
into `MONGODB_URI` in `server/.env`.

### 2. Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). The frontend automatically proxies
`/api` requests to your backend on port 4000 — no extra config needed for local dev.

---

## Deploying

This mirrors how you deployed ComfortLearning/TaskFlow on Render:

**Backend (Render Web Service):**
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI` (your Atlas connection string), `SESSION_SECRET` (any
  long random string), `CLIENT_ORIGIN` (your deployed frontend URL, once you have it)

**Frontend (Render Static Site, or served by the backend):**
- Option A — separate static site: Root directory `client`, build command `npm run build`,
  publish directory `dist`. Set `VITE_API_URL` to your backend's URL before building.
- Option B — single service: the backend (`server.js`) already serves `client/dist` as static
  files and handles client-side routing, so you can build the frontend and deploy just the
  backend as one service. Run `npm run build` inside `client/` before deploying, or add a
  build step that does both.

---

## Design system

Each event type has its own theme (colors + font pairing) defined once in
`server/eventTypes.js` and reused by the frontend — so all six event types share the same
page structure and components, just themed differently:

| Event | Palette | Typography |
|---|---|---|
| Wedding | Ivory / gold / wine | Cormorant Garamond + EB Garamond |
| Birthday | Cream / coral / teal | Fraunces + Space Grotesk |
| Engagement/Anniversary | Blush / dusty rose / plum | Cormorant Garamond + EB Garamond |
| Baby Shower/Naming | Mint / soft pink / sage | Fraunces + EB Garamond |
| Corporate | Steel blue / navy / white | Space Grotesk |
| Reunion | Amber / forest green / cream | Fraunces + EB Garamond |

Animations are intentionally restrained: a staggered fade-up on the hero, scroll-triggered
section reveals (Intersection Observer, no heavy library), and a spinner-to-checkmark state
on RSVP submit. No auto-playing carousels or parallax.

---

## Notes

- Photos are stored as base64 inside MongoDB documents for simplicity — fine for a personal
  project or small-scale use. If you later want faster loads at scale, swap `PhotoUploader.jsx`
  and the invitation model to upload to a service like Cloudinary or S3 instead.
- Auth uses `bcryptjs` + `express-session`, the same pattern as ComfortLearning.
- The RSVP form fields per event type are defined in `server/eventTypes.js` — edit that file
  to add, remove, or change fields for any event type.
