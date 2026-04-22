# TaskFlow Pro

A modern, production-ready To-Do List web application built with Next.js 14+ (App Router). Features Google authentication, task prioritization, due dates, dark mode, and a premium SaaS-like dashboard UI.

![TaskFlow Pro](https://img.shields.io/badge/Next.js-14+-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38bdf8?style=flat&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-9+-ffca28?style=flat&logo=firebase&logoColor=black)

## Features

### Core Features
- **Google Authentication** - Sign in securely with your Gmail account
- **Task Management** - Create, edit, delete, and complete tasks
- **Priority Levels** - Set tasks as High, Medium, or Low priority
- **Due Dates** - Track deadlines with calendar support
- **Smart Filters** - Filter by All, Pending, or Completed
- **Quick Search** - Search through all tasks instantly
- **Profile Management** - Upload custom profile images

### UI/UX
- **Dark Mode** - Beautiful dark theme support
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Smooth Animations** - Powered by Framer Motion
- **Toast Notifications** - Instant feedback on actions
- **Loading States** - Skeleton loaders for better UX
- **Empty States** - Encouraging messages when no tasks

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js with Google Provider
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage (profile images)
- **Icons:** Heroicons
- **Animations:** Framer Motion
- **Toast:** React Hot Toast
- **Date Handling:** date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Account (for OAuth)
- Firebase Project

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/taskflow-pro.git
cd taskflow-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Now fill in your `.env.local` with the following credentials:

#### NextAuth Configuration
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key
```

Generate a secret key:
```bash
openssl rand -base64 32
```

#### Google OAuth (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to APIs & Services > OAuth consent screen
4. Create OAuth consent screen (External)
5. Add scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`
6. Add test users (for development)
7. Navigate to Credentials
8. Create OAuth client ID credentials
9. Set application type to Web application
10. Add authorized redirect URIs:
    - `http://localhost:3000/api/auth/callback/google`
    - (your-production-url)/api/auth/callback/google
11. Copy Client ID and Client Secret to `.env.local`

#### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database:
   - Create database > Start in test mode (or set rules appropriately)
4. Enable Storage:
   - Start in test mode (or set rules appropriately)
5. Project Settings > General
6. Copy your config values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
taskflow-pro/
├── app/                    # Next.js App Router
│   ├── api/              # API Routes
│   │   └── auth/         # NextAuth API
│   ├── dashboard/        # Dashboard page
│   ├── login/           # Login page
│   ├── profile/         # Profile page
│   ├── layout.tsx       # Root layout
│   ├── page.tsx        # Landing page
│   └── globals.css      # Global styles
├── components/
│   ├── layout/         # Navbar, Sidebar
│   ├── providers/    # Auth, Theme providers
│   ├── tasks/       # Task components
│   └── ui/          # Reusable UI components
├── hooks/
│   └── useTasks.ts    # Tasks custom hook
├── lib/
│   ├── auth.ts       # NextAuth config
│   └── firebase.ts   # Firebase config
└── types/
    └── index.ts     # TypeScript types
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Import your repository
4. Add your environment variables in Vercel project settings
5. Deploy!

Make sure to update your Google OAuth redirect URIs for production:
- `https://your-domain.com/api/auth/callback/google`

### Firebase Hosting

```bash
npm run build
firebase init hosting
firebase deploy
```

## Firestore Security Rules

For development (test mode):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production (restrict to authenticated users):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.email == userId;
      
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.token.email == userId;
      }
    }
  }
}
```

## Storage Security Rules

For development:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

For production:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-images/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == userId;
    }
  }
}
```

## License

MIT License - See [LICENSE](LICENSE) for details.

## Support

If you encounter any issues:
1. Check the [Issues](https://github.com/yourusername/taskflow-pro/issues) page
2. Create a new issue with details

---

Built with ❤️ using Next.js and Firebase