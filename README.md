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

### Microsoft sign-in (Company page)

The Company page (`company.html`) logs in with Microsoft. One-time setup:

1. In the [Azure portal](https://portal.azure.com): **Microsoft Entra ID → App registrations → New registration.** Choose "Accounts in any organizational directory and personal Microsoft accounts". Under **Redirect URI** pick *Web* and paste the redirect URL Firebase shows in step 3 below (it looks like `https://YOUR-PROJECT.firebaseapp.com/__/auth/handler`).
2. In that app, **Certificates & secrets → New client secret.** Copy the secret *value*. Also copy the **Application (client) ID** from the Overview page.
3. In Firebase: **Authentication → Sign-in method → Add new provider → Microsoft.** Paste the client ID and client secret, copy the redirect URL it shows into step 1 if you have not yet, and save.

The client secret goes only into the Firebase console, never into this repo.

### Company pre-assessments

After a Microsoft log in, `company-home.html` is the company dashboard:

- **New pre-assessment:** company name, title, role, a code (generated, or typed: 4–20 letters, numbers or dashes), the questions, and the candidate emails allowed to use the code. Questions can be written by the company, picked from the practice questions (`questions.js`, by role, plus general behavioral questions), or both. Up to 30 questions and 300 candidates.
- **Review sessions:** every invited candidate with their status (not started, in progress, completed), overall grade, AI summary, and each answer with its grade and feedback. **Let them retake** deletes a candidate's answers so they can start again.

Candidates open `pre-assessment.html`, type the invited email and the code, and click **Log in**. No account is created. The server (`/api/candidate-login`, needs `FIREBASE_SERVICE_ACCOUNT`) checks that the company listed that email for that code and signs the candidate in with a Firebase custom token that is valid for that one pre-assessment only. A wrong code and an email that was not invited look the same ("not found"), and each network address gets 60 attempts a day. Roland and Makenzie then ask exactly the company's questions (no extra AI follow-up questions). The candidate does not see grades; the session is saved for the company at `assessments/{CODE}/sessions/{uid}`. You can also send a link that fills in the code: `pre-assessment.html?code=ABCD-1234`.

Who can do what is enforced by `firestore.rules`, so **paste the updated rules into Firestore → Rules and publish them** whenever they change:

- Only Microsoft sign-ins can create pre-assessments, and only the company that created one can see, edit or delete it and its sessions.
- A candidate's token carries their invited email and the one code they may use, so they can only open that pre-assessment and only their own session.
- A finished session can be updated for 2 hours (so the AI grades can be saved) and is then locked.

Note: the email and code are the only proof, so anyone who knows both an invited email and its code can log in as that candidate (the email is not verified by sending a message to it). Keep codes private, send each candidate their own link, and use one code per hiring round.

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
   | `ADMIN_EMAILS` | optional: comma-separated admin emails for `admin.html` (default `rolandngoy0703@gmail.com`). The admin must sign in with Google, or a verified email, because the server only accepts verified emails. The admin page needs `FIREBASE_SERVICE_ACCOUNT` but not the Claude key. |

4. Push to `main`. The workflow deploys the `api/` folder with the site.

If the key is missing, the limit is reached, or the API is down, interviews carry on with the built-in questions.

**Characters:** the faces and voices are in `interviewers.js` and the personalities are in `api/src/personas.js`. Photos are in `images/` (full-size originals are kept locally in `images/originals/`, which git ignores).

**Grades and feedback:** when an interview ends, the browser sends the answers to `/api/feedback` a few at a time (the platform allows about 45 seconds per request) and then once for the overall summary. Each answer gets a grade from A (strong) to F (failing), feedback, one tip and an example of a stronger answer. Without the AI, the results page falls back to automatic scores. `interviewer` and `feedback` are separate Azure Functions in `api/src/functions/`.

**Tests:** `cd api && npm install && npm test`.
