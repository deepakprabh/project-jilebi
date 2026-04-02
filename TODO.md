# Jilebi Website — TODO

Track implementation progress. Full plan: `docs/superpowers/plans/2026-04-01-jilebi-website.md`

## Setup (Before You Code)

- [ ] Create a Supabase project at https://supabase.com and copy the URL + keys into `.env.local`
- [ ] Create a Resend account at https://resend.com, get an API key, verify your sending domain
- [ ] Run the database migration: `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor
- [ ] Add real photos to `public/gallery/` (see `src/data/gallery.ts` for expected filenames)
- [ ] Add a hero photo at `public/hero.jpg` and an about photo at `public/about.jpg`
- [ ] Update the real restaurant address in `src/components/sections/Footer.tsx` and the legal pages
- [ ] Update the Google Maps embed URL in `Footer.tsx` with the actual restaurant coordinates
- [ ] Update Instagram and Facebook URLs in `Footer.tsx`
- [ ] Set a strong `ADMIN_PASSWORD` in `.env.local`

## Implementation Tasks

| # | Task | Status |
|---|------|--------|
| 1 | Project Scaffold | ✅ Done |
| 2 | Design System Tokens | ✅ Done |
| 3 | next-intl Setup (i18n routing) | ⬜ Pending |
| 4 | Supabase Schema & Client | ⬜ Pending |
| 5 | API — Availability Route | ⬜ Pending |
| 6 | API — Reservations Route | ⬜ Pending |
| 7 | API — Admin Routes | ⬜ Pending |
| 8 | Resend Email Templates | ⬜ Pending |
| 9 | Static Data Files (menu + gallery) | ⬜ Pending |
| 10 | Nav Component | ⬜ Pending |
| 11 | GoldenRule UI Component | ⬜ Pending |
| 12 | Hero Section | ⬜ Pending |
| 13 | About Section | ⬜ Pending |
| 14 | Menu Section (Speisekarte) | ⬜ Pending |
| 15 | TimeSlotPicker UI Component | ⬜ Pending |
| 16 | Reservation Section | ⬜ Pending |
| 17 | Gallery Section + Lightbox | ⬜ Pending |
| 18 | Footer | ⬜ Pending |
| 19 | Admin Dashboard | ⬜ Pending |
| 20 | German Legal Pages (Impressum + Datenschutz) | ⬜ Pending |
| 21 | Deploy to Vercel | ⬜ Pending |

## Content To Fill In

- [ ] Write the "About / Über uns" story text in `src/messages/de.json` and `src/messages/en.json`
- [ ] Finalize menu items, prices and descriptions in `src/data/menu.ts`
- [ ] Set actual opening hours in `src/components/sections/Footer.tsx`
- [ ] Fill in Impressum owner name and address in `src/app/[locale]/impressum/page.tsx`

## Pre-Launch Checklist

- [ ] Test full booking flow end-to-end (date → slot → form → email received)
- [ ] Test admin dashboard (login, confirm, cancel bookings)
- [ ] Test language switcher (DE ↔ EN, all strings update)
- [ ] Test on mobile (nav, reservation form, gallery)
- [ ] Verify Impressum and Datenschutz pages are reachable from footer
- [ ] Verify Google Maps embed loads correctly
- [ ] Run `npm test` — all tests pass
- [ ] Run `npm run build` — no TypeScript errors
