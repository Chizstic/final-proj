# Guys & Gals Salon

This project is a salon booking system built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It is deployed on **Vercel**.

Live website: [https://guys-gals-salon.vercel.app](https://guys-gals-salon.vercel.app)

## Features

- client login and signup
- service browsing and selection
- appointment booking form
- user profile and booking history
- admin dashboard for staff and booking management
- API routes for bookings, profiles, staff, payments, and users

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

[http://localhost:3000](http://localhost:3000)

## Main Pages

- `pages/index.tsx` - app entry and redirect logic
- `pages/homepage.tsx` - client homepage
- `pages/bookingform.tsx` - booking page
- `pages/user.tsx` - user profile and booking history
- `pages/admin.tsx` - admin dashboard
- `pages/login.tsx` - login page
- `pages/signup.tsx` - signup page

## API Routes

All files inside `pages/api` are API endpoints.

Examples:

- `pages/api/booking.ts` - booking create, read, update, delete
- `pages/api/profile.ts` - user profile create, read, update
- `pages/api/staff.ts` - staff management
- `pages/api/payment.ts` - payment flow
- `pages/api/users.ts` - login/auth-related user lookup
- `pages/api/register.ts` - client account registration

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Vercel Postgres
- PayMongo

## Deployment

This app is deployed on Vercel:

[https://guys-gals-salon.vercel.app](https://guys-gals-salon.vercel.app)

## Learn More

- Next.js Docs: [https://nextjs.org/docs](https://nextjs.org/docs)
- Next.js Learn: [https://nextjs.org/learn](https://nextjs.org/learn)
