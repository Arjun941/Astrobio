# AstroBio Engine 🚀🧬

**Your space biology knowledge engine.** AstroBio Engine is an AI-powered research companion for exploring 600+ scientific publications on how life responds to space environments — built for researchers, students, and mission planners who need fast, reliable insight into space biology literature.

🔗 **Live app:** [astrobio-kappa.vercel.app](https://astrobio-kappa.vercel.app)

---

## What it does

AstroBio Engine turns a library of space biology research papers into something you can actually talk to, learn from, and explore visually. Browse the publication catalog, open any paper, and use AI tools to understand it faster:

- 📖 **AI Research Summaries** — Clear, digestible summaries of space biology experiments and their relevance to human exploration.
- 🧠 **Interactive Knowledge Maps** — Visual mind maps showing how concepts and findings in a paper connect to each other.
- 🎧 **Audio Narration** — Gemini-generated text-to-speech narration so you can listen to papers on the go, with selectable voices.
- 💬 **Space Biology Chatbot** — A contextual chatbot that answers questions about a specific paper, grounded in its content.
- ❓ **Knowledge Quizzes** — AI-generated quizzes to test understanding of a paper's key concepts.
- 📎 **AI Reference & Cross-Referencing** — Upload your own research PDF and discover related papers, citations, and cross-references from the catalog.
- ⭐ **Starred Papers & Search** — Save papers for later and search the catalog by title, content, or author.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) + TypeScript |
| AI / LLM | [Google Genkit](https://firebase.google.com/docs/genkit) + [Gemini 2.5 Flash](https://ai.google.dev/) via `@google/genai` |
| Auth & Database | [Firebase](https://firebase.google.com/) (Auth, Firestore) |
| Hosting | [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) / [Vercel](https://vercel.com/) |
| UI | Tailwind CSS, Radix UI, shadcn-style components, Framer Motion |
| Data viz | Recharts, React Flow (mind maps) |
| Data source | Google Sheets–hosted CSV of space biology publications (PMC), parsed with PapaParse |

## Project structure

```
src/
├── ai/
│   ├── genkit.ts              # Genkit + Gemini configuration
│   └── flows/                 # AI flows: summaries, quizzes, chatbot,
│                               # mind maps, audio narration, PDF cross-reference
├── app/
│   ├── page.tsx                # Landing page
│   ├── login/, onboarding/      # Auth & onboarding
│   ├── papers/                  # Paper catalog, search, and detail view
│   ├── starred/                 # Saved papers
│   ├── upload/                  # PDF upload & cross-reference
│   ├── settings/, team/         # Settings and team pages
│   └── api/audio-narration/     # Audio narration API route
├── components/                  # UI components, feature views, layout
├── context/, hooks/             # Auth context & custom hooks
├── firebase/                    # Firebase client setup, Firestore helpers
└── lib/                         # Papers data fetching/parsing, utilities
```

## Getting started

### Prerequisites

- Node.js 18+
- A Firebase project (Auth + Firestore enabled)
- A Google AI (Gemini) API key

### Installation

```bash
git clone https://github.com/Arjun941/Astrobio.git
cd Astrobio
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google AI / Gemini
GEMINI_API_KEY=
```

### Run locally

```bash
npm run dev
```

The app runs on [http://localhost:9002](http://localhost:9002).

### Other useful scripts

```bash
npm run build        # Production build
npm run start         # Start production server
npm run lint           # Lint the codebase
npm run typecheck       # TypeScript type checking
npm run genkit:dev       # Start Genkit dev server for AI flows
npm run genkit:watch     # Genkit dev server with watch mode
```

## Deployment

The project is configured for both **Firebase App Hosting** (`apphosting.yaml`, `firebase.json`) and **Vercel** — the live deployment runs on Vercel.

## Team

Built by **Arjun TK**, **Aleena Darvin**, **Vaishakh VS**, and **Hithesh G**. See the [Team page](https://astrobio-kappa.vercel.app/team) for more.

## License

No license has been specified for this repository. All rights reserved by the author unless stated otherwise.
