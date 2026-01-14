# Canvas – Web-App (Next.js)

Minimales Skelett für die KI-Weiterbildungsplattform.

## 🚀 Setup

```bash
npm install
npm run dev
```

## 📁 Struktur

```
src/
├── app/              # Next.js App Router (Pages & Routes)
│   ├── auth/         # Auth Callback
│   ├── login/        # Login-Seite (Magic Link)
│   └── page.tsx      # Startseite
└── lib/              # Shared Logic
    ├── supabase/     # Supabase Client Setup
    └── cn.ts         # Utility (className Helper)
```

## 🔧 Environment Variables

Kopiere `ENV.example` zu `.env.local` und fülle die Werte aus:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📦 Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, DB, Storage)

## 🎯 Status

Minimales Skelett – bereit für Step-by-Step Aufbau.
