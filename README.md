# HappyB.Pvt.Ltd — Uniform Management System

A school uniform shop management app built with React, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- Worker & Owner roles with separate dashboards
- Billing with invoice generation and WhatsApp notification
- Stock management with Excel bulk upload
- Attendance tracking
- Returns & exchange processing
- Daily report via email (EmailJS)
- Owner analytics dashboard

## Setup

1. Copy `.env.example` to `.env` and fill in your Supabase and EmailJS keys
2. Run `npm install`
3. Run `npm run dev`

## Known Security Notes

**xlsx package — prototype pollution vulnerability**

The `xlsx` (SheetJS) npm package has known prototype pollution vulnerabilities ([GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6), [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9)) with no upstream fix available on the npm version.

**Risk is low because:**
- Used only for internal owner/worker Excel upload (`EnterStock` page) and planning tool (`OwnerPlanning` page)
- Not exposed to public/unauthenticated users
- Input files are uploaded by trusted staff only, not end customers

**Mitigation plan:** Monitor for a maintained alternative (e.g. [`exceljs`](https://github.com/exceljs/exceljs)) and migrate when stable.

## Security Headers

Security headers are configured in `vercel.json` (for Vercel deployments) and in both HTML files via `<meta>` tags:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- Referrer-Policy
- Permissions-Policy
