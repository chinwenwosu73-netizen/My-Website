# Your Name — Personal Website

A simple, clean personal website for a Product Manager — white UI with beige
accents. Modeled loosely on the layout of abdulmalikadebayo.com.

The home page is intentionally minimal — **just the hero section and the footer**.
All content (experience, products, values, education, contact) lives on its own
dedicated page, so nothing repeats on the home page:

| Page | File | Contents |
|------|------|----------|
| Home | `index.html` | Hero (headline, portrait, stats) + footer only |
| About | `about.html` | Bio, values, tools |
| Work (experience) | `work.html` | Full career timeline |
| Products (case studies) | `products.html` | Product cards with impact |
| Education | `education.html` | Degrees & certifications |
| Connect (contact) | `connect.html` | Contact form & links |

## Tech

- Plain HTML + CSS + a little vanilla JS — no build step, no dependencies.
- Fonts: Inter + Fraunces (Google Fonts, loaded via CDN).
- Motion: scroll-reveal, animated hero underline, floating chips, a skills
  marquee and hover transitions — all via CSS + `js/main.js`.
- Fully responsive with a mobile menu.
- `prefers-reduced-motion` is respected.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000
```

or use VS Code's **Live Server** extension.

## Photos

There are **no AI icons or graphics** in this site — every image is a styled
placeholder box labelled `📷 ...`. To add your own photos:

1. Drop your image files into the `images/` folder (create it if missing).
2. Replace any `.img-holder` placeholder, e.g.:

```html
<!-- Before (placeholder) -->
<div class="img-holder">
  <span class="ph-label">📷 Portrait photo</span>
</div>

<!-- After (your photo) -->
<div class="img-holder has-img">
  <img src="images/portrait.jpg" alt="Your Name">
</div>
```

Suggested photo spots: hero portrait (`index.html`), about portrait
(`about.html`), product card covers (`products.html`), and candid shots on the
home + education pages.

## Customize

- **Name / links**: search for `Your Name`, `hello@example.com`, `linkedin.com`,
  etc. across the HTML files and replace with your details.
- **Experience & products**: edit the timeline items in `work.html` and the cards
  in `products.html`.
- **Contact form**: the form on `connect.html` is a demo — wire it to
  [Formspree](https://formspree.io/) or your own backend.
- **Colors**: the whole palette lives in the CSS variables at the top of
  `css/style.css` (the beige pop color is `--beige-500`).

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo.
2. Go to **Settings → Pages** → Source: **Deploy from a branch** → branch `main` / root.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

> Note: because every page links to `index.html` etc. with relative paths, the
> whole site works from any subfolder — perfect for GitHub Pages.

## Structure

```
website/
├── index.html
├── about.html
├── work.html
├── products.html
├── education.html
├── connect.html
├── css/
│   └── style.css      # design system + all styles
├── js/
│   └── main.js        # nav, scroll-reveal, motion
└── images/            # your photos go here
```
