# Pine X School OS

Premium school operations SaaS foundation for administrators, teachers, finance teams, transport, aftercare staff, and parents.

Pine X School OS is built with Next.js App Router, TypeScript, Tailwind CSS, Supabase-ready data architecture, demo mode, role-aware navigation, and a polished mobile-first parent portal.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open the app:

```text
http://localhost:3000
```

5. Open the login page and use a demo role:

```text
http://localhost:3000/login
```

## Required Environment Variables

These are documented in `.env.example`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe browser variables used by the Supabase client.

`SUPABASE_SERVICE_ROLE_KEY` must only be used server-side in trusted code paths such as route handlers, server actions, background jobs, or migration scripts. Never expose it in client components or `NEXT_PUBLIC_*` variables.

`NEXT_PUBLIC_ENABLE_DEMO_MODE=true` keeps the app working with fictional demo data when Supabase keys are not configured.

`NEXT_PUBLIC_APP_URL` should be set to the final production URL on Vercel so metadata, robots, and sitemap output use the correct host.

## Demo Mode

Demo mode is designed for sales demos, internal QA, and UI review before a live Supabase project is connected.

- Fictional school: Hermanus Valley Academy.
- Fictional learners, guardians, staff, attendance, fees, notices, consent forms, events, documents, incidents, transport, aftercare, and notifications.
- Local demo actions update in browser state only.
- No real learner data, phone numbers, ID numbers, or payment processing is included.
- Demo mode remains available even when Supabase variables are empty.

## Supabase Setup

1. Create a new Supabase project.
2. Open the SQL editor in Supabase.
3. Run the schema in `supabase/schema.sql`.
4. Add authentication users through Supabase Auth.
5. Connect each auth user to the `users.auth_user_id` field.
6. Add school-specific rows for roles, learners, parents, teachers, classes, and operational modules.
7. Review every RLS policy before production launch.

The schema includes starter RLS policies and comments, but production policies must be reviewed against the school's POPIA, role, and data access requirements. Frontend role checks are for UX only; Supabase RLS must enforce the real security boundary.

## Vercel Deployment

1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose `Add New Project`.
3. Import the repository.
4. Keep the framework preset as `Next.js`.
5. Use the default install command:

```bash
npm install
```

6. Use the default build command:

```bash
npm run build
```

7. Add environment variables in Vercel Project Settings:

```bash
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
NEXT_PUBLIC_APP_URL=https://your-production-domain.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

8. For demo-only deployments, keep Supabase variables blank and set:

```bash
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

9. Deploy.
10. After the first deploy, update `NEXT_PUBLIC_APP_URL` to the final Vercel or custom domain and redeploy so metadata, sitemap, and robots output are accurate.

## Production Safety Notes

- Do not place service-role access in client components.
- Do not rely on frontend role checks as the only access control.
- Review RLS policies before onboarding any real school.
- Replace demo legal, indemnity, consent, POPIA, and policy wording with school-approved wording.
- Connect real file uploads to Supabase Storage with private buckets and signed URLs.
- Connect real messaging providers only after consent, opt-in, retry, unsubscribe, and audit rules are designed.
- Connect payment providers only after finance reconciliation and data retention rules are agreed.

## How To Run The Demo For A Client

1. Start the app with `npm run dev`, or open the Vercel preview deployment.
2. Go to `/login`.
3. Select `School Admin` under demo login.
4. Open `/dashboard`.
5. Click `Start Guided Demo`.
6. Walk through the guided steps:

```text
Dashboard overview
Learner profile
Attendance alert
Notice creation
Parent app notice
Fee balance
Consent form
Transport update
Aftercare pickup
```

7. Use the dashboard scenario buttons:

```text
Mark learner absent
Send urgent notice
Create outing consent form
Upload parent proof of payment
Delay transport route
Check learner into aftercare
```

8. After each scenario, point out what the parent would see.
9. Switch to the `Parent` demo login.
10. Open `/parent` on a mobile-width browser or phone.
11. Show notices, forms, fees, transport, documents, and messages.

## Manual Test Checklist

Run these checks before sharing a build with a school.

1. Landing page loads at `/`.
2. Login page loads at `/login`.
3. Demo login redirects correctly for each role.
4. Admin, principal, finance, transport, and aftercare demo users can access `/dashboard`.
5. Teacher demo user redirects to `/teacher`.
6. Parent demo user redirects to `/parent`.
7. Unauthorized roles cannot access unrelated portals.
8. Dashboard KPIs render without Supabase variables.
9. Guided demo opens and advances through all steps.
10. Each demo scenario updates visible demo state and shows a parent-facing preview.
11. Learners, parents, and classes pages search/filter correctly.
12. Attendance can be marked, bulk marked, saved, and previewed as parent alerts.
13. Notices can be created, previewed, and acknowledged from the parent portal.
14. Fees show balances, payment history, proof review, and parent upload placeholder.
15. Consent forms can be created and signed in demo mode.
16. Events and documents show relevant parent-facing views.
17. Incidents hide sensitive details unless marked parent-visible.
18. Transport status, route delay, and parent transport page render correctly.
19. Aftercare check-in/check-out flows render correctly.
20. Parent portal works well at mobile widths around 375px, 390px, and 430px.
21. Loading, not-found, and error fallback screens are present.
22. `npm run lint` passes.
23. `npx tsc --noEmit` passes.
24. `npm run build` passes.

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Legal Wording Warning

Consent and indemnity wording in this repository is placeholder/demo text only. Schools must replace it with their own approved legal, indemnity, POPIA, and policy wording before production use.
