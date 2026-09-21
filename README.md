# Harikrishnan K — Portfolio (Pure HTML + CSS version)

This is a converted version of your portfolio. The **design, layout, colors,
fonts, and animations are all unchanged**. What changed is *how* the content
gets on the page:

- **Before:** every section's text was built by JavaScript at runtime
  (`js/sections/*.js` + `js/data/portfolio.js`) and injected into empty
  `<section>` tags. To edit your name, skills, or projects you had to dig
  through JS template strings.
- **Now:** every section is plain, readable HTML already sitting in
  `index.html`. There is no data file and no template-building JS to
  understand — what you see in the file is exactly what renders on the page.

## What's in this folder

```
portfolio-static/
├── index.html        ← Everything: text, structure, images, links — all plain HTML
├── css/               ← Same 5 stylesheets as before, untouched
│   ├── variables.css  ← Colors, fonts, spacing tokens
│   ├── base.css
│   ├── components.css
│   ├── animations.css
│   └── sections.css
├── js/
│   └── script.js      ← ONLY behavior: smooth scroll, mobile menu, typing
│                         effect, scroll-reveal, skill bar animation,
│                         scroll progress bar, active nav highlight.
│                         It builds NO content — nothing here writes text
│                         to the page.
└── me.jpeg            ← Your photo file (currently unused — see note below)
```

## How to edit content now

Just open `index.html` in any text editor and change the text directly.
For example, to change your email, search for `harikrishnan.tech.1@gmail.com`
— it appears as plain text in a couple of spots (contact section, footer)
and you can edit it right there. Same for skills, certificates, projects,
etc. — search for the heading (e.g. `Python`, `AWS Cloud Practitioner`) and
edit the surrounding HTML.

## How to run

Just open `index.html` in a browser — no build step, no server required.
Optional local server:
```bash
python3 -m http.server 8000
```

## A couple of small notes

- **Photo:** the hero section currently uses a stock photo URL (a Pexels
  image), same as the original file. There's a `me.jpeg` in this folder
  that isn't wired in yet — if that's your real photo, replace the `src`
  of the image in the hero section (search for `zoom-img` near the top of
  `index.html`) with `me.jpeg`.
- **Hero stat numbers:** the original project computed a small "Projects /
  Certifications / Technologies" counter row but never actually inserted it
  into the page (a leftover bug in the original code), so it never
  displayed. I kept the same visible result to avoid changing your design,
  but let me know if you'd like that stat row added back in — it's a quick
  addition.
- **JavaScript remaining:** a *little* JavaScript still remains
  (`js/script.js`), but only for animation/interaction — the typewriter
  effect, scroll-triggered fade-ins, the mobile hamburger menu, and the
  skill bar fill animation. None of these can be done with content-editing
  in mind; they're pure visual behavior, and removing them would change the
  look and feel of the site. All actual page *content* is now plain HTML.
