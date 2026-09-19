# Empower Solution FK

A static marketing website for **Empower Solution FK**, an impact windows and doors company serving Florida homeowners.

## Overview

This is a responsive, single-page site built with plain HTML, CSS, and vanilla JavaScript — no build step or dependencies required.

Sections included:
- Hero with company value proposition
- Trust/certification bar (code compliance, licensing, financing)
- Services (impact windows, impact doors, sliding doors, storefront/commercial, installation, consultations)
- "Why Impact Products" benefits (hurricane protection, energy savings, noise reduction, security, UV protection, home value)
- Product styles gallery
- Step-by-step process
- Customer testimonials
- FAQ
- Contact form with lead-capture fields

## Project structure

```
index.html      Main page markup
css/style.css   Styling (responsive, custom properties, mobile nav)
js/script.js    Mobile nav toggle, scroll effects, contact form validation
```

## Running locally

No build tools are required. Just serve the folder statically, for example:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Customizing

- Update contact details (phone, email, service area) in `index.html`.
- Replace placeholder testimonials, stats, and product copy with real company data.
- The `js/script.js` contact form currently validates and confirms client-side only — wire the `contact-form` submit handler to your backend or a form service (e.g. email API, CRM) to receive real leads.
