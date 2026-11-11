# AI Interview Chat — Landing Page

> Rehearse the room before you walk in.

The marketing site for **AI Interview Chat**, an AI interviewer that asks realistic questions for your target role, scores every answer on structure, clarity, impact and relevance, and saves your progress between sessions.

It's a static site with no build step and no dependencies: plain HTML, CSS and JavaScript.

## Files

| File | What it does |
|---|---|
| `index.html` | Page structure: nav, hero, problem, live demo, how it works, progress, call to action, footer |
| `styles.css` | All styling. Change `--accent` at the top to re-theme the whole page |
| `script.js` | Hero waveform, role marquee, interactive demo, scroll-reveal animations |
| `favicon.svg` | Browser tab icon |

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a **public** repository on GitHub named `ai-interview-chat`.
2. Upload these files to the root of the repo (drag and drop them on the repo page and click **Commit changes**), or push from the command line:

   ```bash
   git init
   git add .
   git commit -m "Add AI Interview Chat landing page"
   git branch -M main
   git remote add origin https://github.com/rolandngoy/ai-interview-chat.git
   git push -u origin main
   ```

3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose **main** and **/ (root)**, and click **Save**.
5. After a minute or two the site is live at:

   **https://rolandngoy.github.io/ai-interview-chat/**

Every time you push a change to `main`, the same URL updates automatically.

### Optional: custom domain

In **Settings → Pages → Custom domain**, enter your domain (for example `aiinterviewchat.com`), then add the DNS records GitHub shows you at your domain registrar. Tick **Enforce HTTPS** once it's available.

## Customizing

- **Accent color:** edit `--accent` in `styles.css` (alternatives that work well: `#6EE7D2`, `#C6F36D`, `#F2A86B`).
- **Demo questions:** edit the `DEMO` array in `script.js`. Each role has a question, a sample answer, four scores and a coaching tip.
- **Call-to-action links:** the buttons currently scroll to the demo. When the app has a live sign-up URL, change their `href` in `index.html`.

## Accessibility

- Semantic buttons, links and landmarks; visible keyboard focus.
- Respects `prefers-reduced-motion`: all animation turns off for users who ask for it.
- Responsive down to phone width.

---

Built by [Roland Ngoy](https://www.linkedin.com/in/roland-ngoy-5319532a7/).
