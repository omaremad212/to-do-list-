# To-Do List Pro - Specification Document

## 1. Project Overview

**Project Name:** TaskFlow Pro
**Type:** Full-stack Web Application (SaaS Dashboard)
**Core Functionality:** A premium to-do list management application with Google authentication, task prioritization, due dates, and profile management.
**Target Users:** Professionals and individuals seeking a polished, productivity-focused task management tool.

---

## 2. UI/UX Specification

### Layout Structure

#### Global Layout
- **Navbar (Fixed Top):** Height 64px, contains logo, search, dark mode toggle, user menu
- **Sidebar (Desktop only):** Width 280px, collapsible, contains navigation and filters
- **Main Content Area:** Fluid width, max-width 1400px, centered
- **Footer:** Minimal, contains copyright

#### Pages
1. **Landing Page (`/`):** Hero + features + CTA to login
2. **Dashboard (`/dashboard`):** Task list + filters + stats
3. **Profile (`/profile`):** User settings + profile image

### Visual Design

#### Color Palette
**Light Mode:**
- Background Primary: `#FAFAFA`
- Background Card: `#FFFFFF`
- Background Sidebar: `#F8FAFC`
- Text Primary: `#0F172A`
- Text Secondary: `#64748B`
- Accent Primary: `#6366F1` (Indigo 500)
- Accent Hover: `#4F46E5` (Indigo 600)
- Success: `#10B981`
- Warning: `#F59E0B`
- Danger: `#EF4444`
- Border: `#E2E8F0`

**Dark Mode:**
- Background Primary: `#0F172A`
- Background Card: `#1E293B`
- Background Sidebar: `#1E293B`
- Text Primary: `#F8FAFC`
- Text Secondary: `#94A3B8`
- Accent Primary: `#818CF8` (Indigo 400)
- Accent Hover: `#6366F1` (Indigo 500)
- Border: `#334155`

#### Priority Colors
- High: `#EF4444` (Red)
- Medium: `#F59E0B` (Amber)
- Low: `#10B981` (Emerald)

#### Typography
- **Font Family:** `"Plus Jakarta Sans", sans-serif` (Google Fonts)
- **Headings:**
  - H1: 32px, 700 weight
  - H2: 24px, 600 weight
  - H3: 20px, 600 weight
- **Body:** 14px, 400 weight
- **Small:** 12px, 400 weight

#### Spacing System
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

#### Visual Effects
- **Card Shadow (Light):** `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- **Card Shadow (Dark):** `0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)`
- **Hover Shadow:** `0 10px 40px rgba(99,102,241,0.15)`
- **Border Radius:** 8px (cards), 6px (buttons), 12px (modals)
- **Transitions:** 200ms ease-out

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Components

#### Buttons
- **Primary:** Indigo background, white text, hover darken
- **Secondary:** White background, indigo text, border
- **Ghost:** Transparent, text only
- **Danger:** Red variant for delete actions

#### Input Fields
- Height: 44px
- Border: 1px solid border color
- Focus: 2px indigo ring

#### Cards
- Background: card color
- Padding: 24px
- Border radius: 8px
- Shadow: card shadow

#### Task Item
- Checkbox (left)
- Title + description
- Priority badge
- Due date
- Actions (edit/delete) on hover
- Completed: strikethrough, muted color

#### Modal
- Centered, max-width 500px
- Backdrop blur
- Slide-up animation

---

## 3. Functionality Specification

### Authentication (NextAuth.js)
- Google Provider only
- Session stored in cookie
- User data persisted in Firestore on first login
- Protected routes redirect to login
- Sign out clears session

### User Profile
- Display name from Google account
- Display email
- Profile image from Google (default) or custom upload
- Upload to Firebase Storage
- Update in Firestore

### Tasks CRUD
- **Create:** Title (required), description (optional), priority (default: Medium), due date (optional)
- **Read:** List all tasks, filter by status
- **Update:** Edit any field
- **Delete:** Soft delete with confirmation
- **Toggle Complete:** checkbox toggle

### Task Filters
- All: Show all tasks
- Completed: Show only completed
- Pending: Show only incomplete
- Filter persists in URL query params

### Task Search
- Search by title and description
- Debounced input (300ms)
- Real-time filtering

### Priority System
- Visual badge with color
- Sort by priority option
- Filter by priority

### Due Dates
- Date picker
- Overdue warning (red text)
- "Today" / "Tomorrow" labels

### Toast Notifications
- Success: Task created/updated/deleted
- Error: Generic error message
- Auto-dismiss after 3 seconds

### Loading States
- Skeleton loaders for tasks
- Spinner for actions
- Suspense fallback

### Empty States
- Illustrated empty state
- Encouraging message
- CTA to add first task

### Dark Mode
- Toggle in navbar
- Persist in localStorage
- System preference default

---

## 4. Technical Architecture

### Folder Structure
```
/app
  /api/auth/[...nextauth]/route.ts
  /(auth)
    /login/page.tsx
  /(dashboard)
    /layout.tsx
    /dashboard/page.tsx
    /profile/page.tsx
  /layout.tsx
  /page.tsx
  /globals.css
/components
  /ui (Button, Input, Modal, Badge, Skeleton...)
  /tasks (TaskItem, TaskForm, TaskList, TaskFilters...)
  /layout (Navbar, Sidebar, Footer...)
  /providers (AuthProvider, ThemeProvider...)
/lib
  /firebase.ts
  /firestore.ts
  /auth.ts
/hooks
  /useTasks.ts
  /useTheme.ts
/services
  /taskService.ts
  /userService.ts
/types
  /task.ts
  /user.ts
```

### Database Schema (Firestore)

**users collection:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "image": "string (URL)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**tasks collection (subcollection of users):**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "completed": "boolean",
  "priority": "low | medium | high",
  "dueDate": "timestamp | null",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Environment Variables
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

---

## 5. Acceptance Criteria

### Authentication
- [ ] Google login button visible on landing page
- [ ] Successful login redirects to dashboard
- [ ] User name and image display in navbar
- [ ] Sign out returns to landing page

### Dashboard
- [ ] Task list displays with all fields
- [ ] Add task modal opens and creates task
- [ ] Edit task modal opens with pre-filled data
- [ ] Delete with confirmation dialog
- [ ] Checkbox toggles completion status
- [ ] Filter tabs work (All/Completed/Pending)
- [ ] Search filters tasks in real-time

### Profile
- [ ] User info displays correctly
- [ ] Image upload works
- [ ] Uploaded image appears in navbar

### UI/UX
- [ ] Dark mode toggle works
- [ ] Theme persists on reload
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations are smooth
- [ ] Loading states display
- [ ] Empty state shows when no tasks

### Deployment
- [ ] Builds without errors
- [ ] No server errors on Vercel
- [ ] Environment variables configured
- [ ] Firebase rules allow functionality