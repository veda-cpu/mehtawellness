# Dr Mehta Wellness – Nutrition, Yoga & Wellness Extension

## What's included
- `nutrition-wellness.html` – Nutrition and Yoga & Wellness landing page.
- `wellness-onboarding.html` – wellness profile/onboarding form.
- `wellness-dashboard.html` – interactive demo dashboard for nutrition, hydration, yoga and progress.
- `care-team.html` – searchable/filterable demo care-team directory with profile and booking-preview modals.
- `wellness.css` and `wellness.js` – isolated styles and interactions for the new pages.
- Existing homepage, medical-guidance page, role dashboards and assets are retained.

## Homepage entry points
- Personalized nutrition → `nutrition-wellness.html#nutrition`
- Yoga & wellness → `nutrition-wellness.html#yoga`
- Start your wellness journey → `wellness-onboarding.html`
- Meet your care team → `care-team.html`
- Existing Medical guidance link remains unchanged.

## Run locally
From this folder, run:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000/index.html`.

## Demo behaviour
- Onboarding saves the profile in browser localStorage and opens the wellness dashboard.
- Hydration buttons, meal logging and yoga completion update the demo UI.
- Care team search and category filters work. View Profile and Book Consultation open a demo modal.
- No live booking, clinical recommendations, backend API or real authentication is connected.
- Dashboard numbers, meal details, availability, professional biographies and non-verified credentials are illustrative sample content. Confirm all professional information before production launch.
