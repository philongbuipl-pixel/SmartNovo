# SmartNovo — Marketing Website

Static, multi-page site. No build step. Open `index.html` or serve the folder.

## Pages
- `index.html` — Home (video hero, problem, how it works, theft & fall CV, industries teaser, partners)
- `product.html` — Product & Technology (the unit, AI brain, CV theft/fall, tech pillars, platform)
- `industries.html` — Industries gallery (convenience, pharmacy, beach, campus, forecourt, more)
- `partners.html` — Partner ecosystem
- `contact.html` — Book a pilot form

## Assets
- `assets/img/` — store renders, cutaway diagram, video poster frames, favicon
- `assets/video/` — hero + CV + industry clips (muted, looping, autoplay, play-in-view)
- `css/style.css` — full design system (Navy/Obsidian/Teal/Paper, 8px grid)
- `js/main.js` — mobile nav, scroll reveal, play-video-in-view

## Run locally
```
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Swapping media
Drop a new file into `assets/video/` or `assets/img/` and keep the same filename,
or update the `<source>` / `<img src>` path in the relevant HTML.

## Contact form
`contact.html` has a demo handler. Point the `<form>` at Formspree or your backend to receive enquiries.
