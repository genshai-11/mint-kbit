# CONTEXT.md

Canonical domain language for the clean KBIT React project.

## Product purpose
Launch a credible multilingual KBIT web platform with a real path to admin/content operations — without losing content fidelity.

## Stack language
- **Clean React project**: new implementation based on React + Vite, not Next.js.
- **Content transfer**: migration of data/seed/assets only.
- **Design references**: existing `stitch-frontend/` files preserved for later study, not migrated now.

## Core entities
- **Locale**: `en | vi | ko` for v1 unless Lucy expands scope.
- **Settings**: brand, offices, contact, meta, stats, hero content.
- **Page content**: static localized page copy.
- **Event**: event/workshop record with images and registration intent.
- **News article**: localized news/update content.
- **Partner**: partner logo/name/description.
- **Expert**: doctor/expert profile; currently a known content gap.
- **Membership tier**: offering/package data.
- **Center**: education/location data.
- **Content gap**: explicit missing input that must not be silently invented.
- **Asset manifest**: mapping of source assets to local files and future production hosting.

## Terms to avoid
- Do not call the old Next.js code “source of truth.”
- Do not call Stitch files production UI.
- Do not claim admin/content operations are complete before backend/auth/admin are designed.
