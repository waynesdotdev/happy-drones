# Happy Drones — link page (v2)

## Folder layout
```
happy-drones/
├── index.html
├── styles.css
├── script.js
├── netlify.toml
└── assets/
    ├── logo.png      ← your HD logo (cropped, transparent background)
    ├── favicon.png   ← browser tab icon (drone mark from your logo)
    └── scene.svg     ← drones-on-the-desk background
```

## Run it locally (VS Code)
Install the "Live Server" extension, right-click `index.html` → "Open with Live Server".

## Settings — all in the CONFIG block at the top of script.js
- `theme`: "light" (white), "dark" (black) or "auto" (follows the visitor's phone).
- `video`: paste any YouTube link (watch, youtu.be or Shorts) or just the ID.
  Set it to `null` to hide the video section.
- `videoTitle`: the heading above the video.
- `email`, `phone`, and your four social links. Set any to "" to hide that button.
- `bookingUrl`: optional booking page instead of email.
- `area` and `credentials`: the small lines under your name and in the footer.

## Brand colors
Primary #003366 and secondary #FF6B35 are set at the top of styles.css.

## Deploy on Netlify
Drag the whole folder onto app.netlify.com/drop, or connect a GitHub repo. No build step needed.
