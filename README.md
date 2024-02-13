# Strava Report Generator

## Motivation

The purpose of Strava Report Generator or SRG, is to fill a niche that the native strava app fails to address which is performance. Where the native strava app is more used as a social media platform, with users completing exercise activities and that those activities are shared with the users friends, SRG aims to show the user a ranked list of their top activities in order based on various ranking metrics- but namely speed.

## npm Commands

- `npm run dev` starts local development server
- `npm run build` for production
- `npm run start` for production
- `npm run test:client` for local testing
- `npm run test:silent:client` for CI/CD Testing, runs tests in silent mode
- `npm run test:server` runs proxy server tests (to be implemented)

## Environment Variables

- Provision the following environment variables in the root of this project, in a `.env.local` file:
- CLIENT_ID=\<Strava Client ID\>
- REDIRECT_URI_HOST=http://localhost:8000
- DATA_BASE_URL=http://127.0.0.1:5000
  OR
- DATA_BASE_URL=https://data.stravareportgenerator.com
- MAPBOX_ACCESS_TOKEN=\<mapbox access token\>
