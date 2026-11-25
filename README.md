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

### Microsoft sign-in (Company page, Entra External ID)

The Company page (`company.html`) logs in with Microsoft Entra External ID (through an OpenID Connect provider in Firebase) or Google. Google is already enabled; Microsoft needs this one-time setup:

1. **Upgrade Firebase Authentication to Identity Platform** (Firebase console → Authentication → *Upgrade*). OpenID Connect providers need it.
2. In the [Microsoft Entra admin center](https://entra.microsoft.com), use your external tenant (Entra External ID). **App registrations → New registration**, with **Redirect URI** (Web) `https://ai-interview-chat-52c57.firebaseapp.com/__/auth/handler`. Copy the **Application (client) ID**, then **Certificates & secrets → New client secret** and copy the secret *value*.
3. Under **User flows**, create a sign-up and sign-in flow and add this app to it.
4. In Firebase: **Authentication → Sign-in method → Add new provider → OpenID Connect.** Choose the *code flow*, set the **Provider ID** to `entra` (it becomes `oidc.entra`, which is what `config.js` expects), paste the client ID and secret, and for **Issuer** use `https://<tenant-subdomain>.ciamlogin.com/<tenant-id>/v2.0`. Save.

The client secret goes only into the Firebase console, never into this repo. If you choose a different Provider ID, change `entraProviderId` in `config.js`.

### Company pre-assessments

After a Microsoft or Google log in, `/company-home` is the company dashboard, laid out like `images/companyview.jpg`: a dark top bar and sidebar (Overview, Create Interview, My Interviews, Participants, Results & Reviews) around a light work area. Overview shows four numbers for a chosen time range (Total Participants, Completed Interviews, Avg. Score, Avg. Interview Time, each compared with the period before it), the latest interviews, **Create with AI** / **Create Manually**, **Send Interview to Participant** (pick an interview, enter an email, and a personal code is made; copy the code and send it, since the site does not send email) and a searchable, filterable **Participant Results** table with a Review button per person. The score is the average of the answers' letter grades (A about 95, B 85, C 75, D 65, F 45). Analytics and Settings are shown as "Soon". **Create with AI** asks the AI (`/api/interviewer`, `mode: generate`, counts toward `DAILY_AI_REPLIES`) for questions from a role, skills or job description. The interview actions:

- **New pre-assessment:** company name, title, role, the questions, and the candidate emails. There is no shared code: each candidate email gets its own personal code (like `ABCD-EFGH`) when the assessment is saved, shown next to that candidate on the dashboard with a Copy button. Existing assessments made with the old shared code need one **Edit → Save** to create personal codes. Questions can be written by the company, picked from the practice questions (`questions.js`, by role, plus general behavioral questions), or both. Up to 30 questions and 300 candidates. The company also sets how long a candidate has to answer: one time for every question (30 seconds up to 10 minutes, or no limit) and, if wanted, a different time for any single question.
- **Review sessions:** every invited candidate with their status (not started, in progress, completed), overall grade, AI summary, and each answer with its grade and feedback. **Let them retake** deletes a candidate's answers so they can start again.

Candidates open `pre-assessment.html`, type the invited email and their personal code, and click **Log in**. No account is created. The server (`/api/candidate-login`, needs `FIREBASE_SERVICE_ACCOUNT`) checks that the code was made for that email (`candidateCodes/{CODE}`, readable only by the company) and signs the candidate in with a Firebase custom token that is valid for that one pre-assessment only. A wrong code and an email that was not invited look the same ("not found"), and each network address gets 60 attempts a day. Roland and Makenzie then ask exactly the company's questions (no extra AI follow-up questions). When a question has a time limit, the interviewer says how long the candidate has, a countdown shows on screen, and when it reaches zero the answer given so far is sent automatically (or "no answer" if nothing was said). The candidate does not see grades; the session is saved for the company at `assessments/{id}/sessions/{uid}`. You can also send each candidate a link that fills in their code: `/pre-assessment?code=ABCD-1234`.

Who can do what is enforced by `firestore.rules`, so **paste the updated rules into Firestore → Rules and publish them** whenever they change:

- Only Microsoft and Google sign-ins can create pre-assessments (email/password accounts and candidates cannot), and only the company that created one can see, edit or delete it and its sessions.
- A candidate's token carries their invited email and the one pre-assessment (internal id) their code belongs to, so they can only open that pre-assessment and only their own session.
- A finished session can be updated for 2 hours (so the AI grades can be saved) and is then locked.

Note: the email and code are the only proof, so anyone who knows both an invited email and that email's own code can log in as that candidate (the email is not verified by sending a message to it). Send each candidate only their own code. Taking an email off the list removes its code.

The values in `config.js` are public by design; the Firestore rules are what keep each user's history private.

## AI interviewers (OpenAI or Claude)

Two AI interviewers, Makenzie and Roland, hold a real conversation in practice interviews. Roland opens with small talk ("How are you doing today?"), and after every answer the AI replies to what the candidate actually said, including personal things ("I'm not having a good day" gets a caring reply, and up to 3 short check-ins), then asks the next question in its own words, or a follow-up when the answer calls for one. A planned list of topics still guides the interview so it covers the role and ends at 15 questions; only real interview questions are graded, small talk is not. If the AI is unavailable, the interview falls back to the planned questions with simple reactions. Company pre-assessments are not changed: they still ask exactly the company's questions. The browser calls `/api/interviewer`, a small Azure Function in `api/` that is deployed with the site. The AI key (OpenAI or Anthropic) is stored only in Azure's server settings and never reaches the browser or this repo.

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
