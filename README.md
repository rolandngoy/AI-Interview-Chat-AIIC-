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

## Accounts and history (Firebase)

Accounts and practice history are stored in Firebase so they follow users across devices.

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. **Build → Authentication → Get started.** Enable the **Email/Password** and **Google** providers.
3. **Authentication → Settings → Authorized domains:** add your live site's domain (for example `your-app.azurestaticapps.net`). `localhost` is already allowed.
4. **Build → Firestore Database → Create database.** Then open the **Rules** tab and paste the contents of `firestore.rules`.
5. **Project settings → Your apps → Web (`</>`).** Register an app and copy the config values into `config.js`.

The values in `config.js` are public by design; the Firestore rules are what keep each user's history private.

## AI interviewers (OpenAI or Claude)

Two AI interviewers, Makenzie and Roland, react to each answer in character and sometimes ask a follow-up question. The browser calls `/api/interviewer`, a small Azure Function in `api/` that is deployed with the site. The AI key (OpenAI or Anthropic) is stored only in Azure's server settings and never reaches the browser or this repo.

**One-time setup**

1. Create an API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) (or [console.anthropic.com](https://console.anthropic.com) for Claude), and set a monthly **budget limit** there. Never put the key in a file in this repo.
2. In Firebase: **Project settings → Service accounts → Generate new private key.** This downloads a JSON file.
3. In the Azure portal, open your Static Web App → **Settings → Environment variables** and add:

   | Name | Value |
   |---|---|
   | `OPENAI_API_KEY` | your OpenAI API key. When set, OpenAI is used. |
   | `OPENAI_MODEL` | optional: defaults to `gpt-4.1-mini` |
   | `OPENAI_FEEDBACK_MODEL` | optional: model for grades and feedback. Defaults to `OPENAI_MODEL`. |
   | `ANTHROPIC_API_KEY` | only if you use Claude instead of OpenAI |
   | `FIREBASE_SERVICE_ACCOUNT` | the full contents of the service account JSON |
   | `DAILY_AI_REPLIES` | optional: interviewer replies per user per day (default `60`, about 4 interviews) |
   | `AI_MODEL` | optional: defaults to `claude-opus-5-5`. `claude-haiku-5-5` is much cheaper and faster. |
   | `AI_FEEDBACK_MODEL` | optional: model for the end-of-interview grades and feedback. Defaults to `AI_MODEL`, then `claude-opus-5-5`. |
   | `DAILY_AI_FEEDBACK_CALLS` | optional: grading requests per user per day (default `60`, about 6 interviews; one interview uses about 7). |

4. Push to `main`. The workflow deploys the `api/` folder with the site.

If the key is missing, the limit is reached, or the API is down, interviews carry on with the built-in questions.

**Characters:** the faces and voices are in `interviewers.js` and the personalities are in `api/src/personas.js`. Photos are in `images/` (full-size originals are kept locally in `images/originals/`, which git ignores).

**Grades and feedback:** when an interview ends, the browser sends the answers to `/api/feedback` a few at a time (the platform allows about 45 seconds per request) and then once for the overall summary. Each answer gets a grade from A (strong) to F (failing), feedback, one tip and an example of a stronger answer. Without the AI, the results page falls back to automatic scores. `interviewer` and `feedback` are separate Azure Functions in `api/src/functions/`.

**Tests:** `cd api && npm install && npm test`.
