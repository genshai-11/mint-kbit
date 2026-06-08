# 06 — Runbook

## Current state
No app runtime exists yet. This run created Project OS and transferred content/data/assets only.

## Future commands after scaffold
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- bundle analysis command TBD after tooling choice

## Release controls
Before production deploy:
1. commit and tag release candidate,
2. validate preview/canary,
3. document rollback,
4. verify restore path for hosting/data/assets.
