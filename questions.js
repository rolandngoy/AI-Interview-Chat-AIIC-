/* =========================================================
   AI Interview Chat — role-specific interview questions
   Keys match the role names on the role selection page.
   ========================================================= */
window.AIIC_ROLE_QUESTIONS = {
  /* ---------- Technology ---------- */
  'Software Engineer': [
    `Walk me through the architecture of a system you built and the key tradeoffs you made.`,
    `How do you approach code reviews, both giving and receiving feedback?`,
    `Tell me about a production bug that was hard to track down. How did you find the root cause?`,
    `How would you design a URL shortener that handles millions of requests a day?`,
    `How do you decide when to refactor code versus ship a feature as is?`,
    `How do you make sure your code is well tested, and what do you test first?`
  ],
  'Frontend Developer': [
    `How do you keep a web page fast, and what do you look at first when it feels slow?`,
    `How would you make a complex form usable with a keyboard and a screen reader?`,
    `How do you manage state in a large front-end application?`,
    `Tell me about a browser compatibility issue you had to solve.`,
    `How would you build a responsive layout that works from phones to wide monitors?`,
    `How do you work with designers when a mockup is hard to implement?`
  ],
  'Backend Developer': [
    `How do you design an API so it stays easy to change over time?`,
    `Walk me through how you would find and fix a slow database query.`,
    `How do you handle authentication and authorization in a service you build?`,
    `Tell me about a time you had to scale a service. What was the bottleneck?`,
    `How do you deal with failures in downstream services, such as retries and timeouts?`,
    `How do you run database migrations without downtime?`
  ],
  'Full-Stack Developer': [
    `Walk me through how you would build a feature end to end, from the database to the UI.`,
    `How do you decide what logic belongs on the client versus the server?`,
    `Tell me about a problem that crossed the front end and back end. How did you trace it?`,
    `How do you keep API contracts in sync between the front end and back end?`,
    `How do you protect a web app against common attacks like XSS and SQL injection?`,
    `How do you choose between building something yourself and using a library?`
  ],
  'Mobile Developer': [
    `How do you handle spotty network connections and offline use in a mobile app?`,
    `Tell me about a time you improved an app's startup time, battery use or memory use.`,
    `How do you support many screen sizes and OS versions?`,
    `Walk me through your release process and how you handle a bad release.`,
    `How do you decide between a native build and a cross-platform framework?`,
    `How do you deal with app store review rejections or policy changes?`
  ],
  'DevOps / SRE Engineer': [
    `Walk me through how you would set up a CI/CD pipeline for a new service.`,
    `Tell me about an outage you responded to. What was your role and what changed afterward?`,
    `How do you decide what to monitor, and how do you avoid alert fatigue?`,
    `What does infrastructure as code give a team, and which tools have you used?`,
    `How do you define and use SLOs and error budgets?`,
    `How would you reduce deployment risk for a service that has to stay up 24/7?`
  ],
  'Cloud Engineer': [
    `How do you design a cloud architecture for high availability and disaster recovery?`,
    `How do you keep cloud costs under control?`,
    `Walk me through how you would migrate an on-premises application to the cloud.`,
    `How do you manage identity and access permissions in a cloud environment?`,
    `Tell me about a time you debugged a networking problem in the cloud.`,
    `How do you secure data both in transit and at rest?`
  ],
  'Cybersecurity Analyst': [
    `Walk me through how you would respond to a suspected phishing compromise.`,
    `How do you prioritize vulnerabilities when you have hundreds to fix?`,
    `Tell me about a security incident you investigated and what you learned.`,
    `How would you explain a security risk to an executive who doesn't want to slow the business down?`,
    `Which logs and signals would you look at to detect an attacker moving through a network?`,
    `How do you stay current with new threats and techniques?`
  ],
  'QA / Test Engineer': [
    `How do you decide what to automate and what to test manually?`,
    `Walk me through how you would test a login page.`,
    `Tell me about a serious bug you caught before release. How did you find it?`,
    `How do you handle a flaky automated test?`,
    `What do you do when you and a developer disagree on whether something is a bug?`,
    `How do you write a good bug report?`
  ],
  'IT Support Specialist': [
    `A user says their computer is slow and they have a deadline. How do you handle it?`,
    `Walk me through how you would troubleshoot a user who can't connect to Wi-Fi.`,
    `How do you explain a technical fix to someone who isn't technical?`,
    `Tell me about a time you handled several urgent tickets at once.`,
    `How do you document solutions so others can reuse them?`,
    `What would you do if you suspected a user's account had been compromised?`
  ],
  'Systems Administrator': [
    `How do you manage patching and updates across many servers without causing downtime?`,
    `Walk me through how you would restore a critical server after a failure.`,
    `How do you manage user accounts and permissions when people join, move or leave?`,
    `What do you automate, and which scripts or tools have you written?`,
    `Tell me about a time you diagnosed a performance problem on a server.`,
    `How do you plan backups, and how do you check that they actually work?`
  ],
  'Network Engineer': [
    `Walk me through what happens when you type a URL into a browser, from a network perspective.`,
    `How do you troubleshoot intermittent packet loss?`,
    `Explain the difference between routing and switching, and when you would use VLANs.`,
    `How do you design a network to be both secure and resilient?`,
    `Tell me about a network change you planned and how you reduced the risk.`,
    `How do you monitor network performance and capacity?`
  ],
  'Machine Learning Engineer': [
    `Walk me through taking a model from experiment to production.`,
    `How do you choose evaluation metrics, and what can go wrong with accuracy alone?`,
    `How do you detect and handle data drift or model degradation after deployment?`,
    `Tell me about a time a model performed well offline but poorly in production.`,
    `How do you deal with imbalanced or noisy training data?`,
    `How do you explain a model's predictions to non-technical stakeholders?`
  ],
  'Data Scientist': [
    `Tell me about an analysis that changed a business decision.`,
    `How do you decide whether a result is statistically meaningful?`,
    `Walk me through how you would design an A/B test and avoid common mistakes.`,
    `How do you handle missing or messy data?`,
    `How do you choose between a simple model and a complex one?`,
    `How do you present uncertainty to people who want a single answer?`
  ],
  'Data Analyst': [
    `Walk me through an analysis from the initial question to the final recommendation.`,
    `How do you validate your numbers before sharing them?`,
    `Which SQL techniques do you use most, and how would you find duplicate records?`,
    `Tell me about a dashboard you built and how people used it.`,
    `How do you handle a stakeholder who keeps changing the question?`,
    `How do you decide which chart best fits the data you are showing?`
  ],
  'Data Engineer': [
    `How do you design a data pipeline that is reliable and easy to monitor?`,
    `How do you handle late-arriving or bad data in a pipeline?`,
    `Explain the difference between batch and streaming, and when you would use each.`,
    `Tell me about a time a pipeline broke in production. How did you fix it?`,
    `How do you model data in a warehouse so analysts can use it easily?`,
    `How do you keep costs and run times down as data grows?`
  ],
  'Database Administrator': [
    `How do you plan backups and recovery, and how do you verify them?`,
    `Walk me through tuning a slow query or a slow database.`,
    `How do you manage database security and access?`,
    `Tell me about a time you carried out a major migration or upgrade.`,
    `How do you monitor database health and capacity?`,
    `How do you handle replication and failover?`
  ],

  /* ---------- Product & Design ---------- */
  'Product Manager': [
    `How do you decide what goes on the roadmap and what doesn't?`,
    `Tell me about a product you launched. How did you define and measure success?`,
    `How do you work with engineers when the schedule is slipping?`,
    `A key metric dropped 15% this week. What do you do?`,
    `How do you gather and prioritize customer feedback?`,
    `How do you say no to a senior stakeholder's feature request?`
  ],
  'Project Manager': [
    `How do you plan a project and build a realistic schedule?`,
    `Tell me about a project that went off track. How did you recover?`,
    `How do you manage scope creep?`,
    `How do you keep stakeholders informed without overwhelming them?`,
    `How do you identify and manage risks before they become problems?`,
    `How do you handle a team member who keeps missing deadlines?`
  ],
  'Program Manager': [
    `How do you coordinate work across several teams with different priorities?`,
    `Tell me about a dependency that put a program at risk.`,
    `How do you track progress and report status to leadership?`,
    `How do you build alignment when teams disagree about priorities?`,
    `How do you decide which projects belong in a program?`,
    `Tell me about a time you had to change plans in the middle of a program.`
  ],
  'Scrum Master': [
    `How do you run a retrospective that leads to real change?`,
    `What do you do when a team keeps missing its sprint goals?`,
    `How do you handle a product owner who keeps adding work mid-sprint?`,
    `How do you coach a team that is new to agile?`,
    `Tell me about an impediment you removed for a team.`,
    `Which agile metrics do you use, and which do you ignore?`
  ],
  'Business Analyst': [
    `How do you gather requirements from stakeholders who disagree?`,
    `Tell me about a time requirements changed late in a project.`,
    `How do you document requirements so developers and business teams both understand them?`,
    `Walk me through how you would map and improve a business process.`,
    `How do you confirm that a delivered solution meets the need?`,
    `How do you prioritize requirements when time is limited?`
  ],
  'UX Designer': [
    `Walk me through your design process on a recent project.`,
    `How do you use research to make design decisions?`,
    `Tell me about a time user testing proved your design wrong.`,
    `How do you handle stakeholder feedback you disagree with?`,
    `How do you design for accessibility?`,
    `How do you work with developers to keep the final build true to your design?`
  ],
  'UI Designer': [
    `How do you build and maintain a consistent design system?`,
    `Walk me through how you choose typography, color and spacing for a new product.`,
    `Tell me about a design you iterated on after feedback.`,
    `How do you balance visual polish with usability?`,
    `How do you design for different screen sizes and interface states?`,
    `How do you hand off designs to developers?`
  ],
  'Product Designer': [
    `Tell me about a product you designed from problem definition to launch.`,
    `How do you decide what to design first when you have limited time?`,
    `How do you measure whether a design worked after release?`,
    `How do you collaborate with product managers and engineers on tradeoffs?`,
    `Describe a time you simplified a complicated experience.`,
    `How do you present your design decisions to executives?`
  ],
  'Graphic Designer': [
    `Walk me through how you handle a project from creative brief to final files.`,
    `How do you interpret a vague brief from a client?`,
    `Tell me about a time you had to revise a design many times. How did you handle it?`,
    `How do you make sure your work stays on brand?`,
    `How do you prepare files for print versus digital use?`,
    `Which design tools do you use, and how do you stay current with trends?`
  ],
  'UX Researcher': [
    `How do you choose between qualitative and quantitative research methods?`,
    `Walk me through a study you designed and what you did with the findings.`,
    `How do you get stakeholders to act on research?`,
    `How do you recruit participants and reduce bias in interviews?`,
    `Tell me about research that surprised you or your team.`,
    `How do you do research when there is little time or budget?`
  ],

  /* ---------- Business & Finance ---------- */
  'Management Consultant': [
    `A client's profits dropped 20% over two years. How would you structure the problem?`,
    `Tell me about a time you delivered a recommendation with incomplete data.`,
    `How do you handle a client who rejects your findings?`,
    `How would you estimate the size of the market for electric scooters in a large city?`,
    `Tell me about working long hours on a team under pressure.`,
    `How do you build trust quickly with senior clients?`
  ],
  'Financial Analyst': [
    `Walk me through how you would build a financial model for a new product.`,
    `How would you value a company, and which methods do you prefer?`,
    `Tell me about a forecast you built and how accurate it turned out to be.`,
    `How do you explain a budget variance to a non-finance manager?`,
    `Walk me through the three financial statements and how they connect.`,
    `How do you check a model for errors?`
  ],
  'Investment Banking Analyst': [
    `Walk me through a discounted cash flow analysis.`,
    `Explain the difference between enterprise value and equity value.`,
    `If depreciation increases by $10, what happens to the three financial statements?`,
    `Tell me about a time you worked late to deliver accurate work under a tight deadline.`,
    `Pitch me a company or stock you find interesting right now.`,
    `How do you stay on top of markets and deal news?`
  ],
  'Accountant': [
    `How do you make sure the books are accurate when closing at month end?`,
    `Tell me about a discrepancy you found and how you resolved it.`,
    `How do you stay up to date with accounting standards and tax changes?`,
    `Walk me through how you would reconcile an account that doesn't balance.`,
    `How do you handle conflicting priorities during busy season?`,
    `What would you do if a manager asked you to record something you believed was wrong?`
  ],
  'Auditor': [
    `How do you plan an audit and decide where to focus your testing?`,
    `Tell me about a time you found a control weakness. How did you report it?`,
    `How do you handle a client who is slow or uncooperative with documents?`,
    `How do you maintain independence and professional skepticism?`,
    `Walk me through how you would test revenue recognition.`,
    `How do you communicate negative findings diplomatically?`
  ],
  'Operations Manager': [
    `How do you find and remove bottlenecks in a process?`,
    `Tell me about a process you improved and the results.`,
    `How do you set and track operational KPIs?`,
    `How do you manage your team during a sudden spike in demand?`,
    `Walk me through how you would cut costs without hurting quality.`,
    `How do you handle an underperforming employee?`
  ],
  'Supply Chain Analyst': [
    `How do you forecast demand, and what do you do when the forecast is wrong?`,
    `Tell me about a supply disruption you helped manage.`,
    `How do you balance inventory costs against the risk of stockouts?`,
    `Which metrics do you use to evaluate supplier performance?`,
    `Walk me through how you would reduce shipping costs.`,
    `How do you use data to find inefficiencies in a supply chain?`
  ],
  'Business Development': [
    `How do you identify and qualify new partnership or growth opportunities?`,
    `Walk me through how you would structure a deal with a new partner.`,
    `Tell me about a deal you closed and your role in it.`,
    `How do you build a pipeline when you start with no leads?`,
    `How do you handle a prospect who goes quiet?`,
    `How do you work with legal, product and finance teams to close a deal?`
  ],
  'Entrepreneur / Founder': [
    `How did you validate your idea before investing heavily in it?`,
    `How have you made decisions with very little money or time?`,
    `Tell me about a major setback in your venture and how you responded.`,
    `How do you decide what to do yourself and when to hire?`,
    `How did you find and keep your first customers?`,
    `What would you do if your main product failed six months from now?`
  ],
  'Executive / General Manager': [
    `How do you set strategy and make sure the organization follows it?`,
    `Tell me about a difficult decision, such as a layoff or budget cut, and how you handled it.`,
    `How do you develop and retain senior leaders?`,
    `How do you read a P&L, and which numbers do you watch most closely?`,
    `Tell me about a time you led an organization through major change.`,
    `How do you balance short-term results with long-term goals?`
  ],

  /* ---------- Sales & Marketing ---------- */
  'Sales Representative': [
    `Walk me through your sales process from first contact to close.`,
    `Tell me about your biggest deal and how you won it.`,
    `How do you handle the objection that your price is too high?`,
    `How do you prospect for new customers and manage your time?`,
    `How do you approach a cold call or cold email?`,
    `Tell me about a deal you lost and what you learned.`
  ],
  'Account Executive': [
    `How do you qualify an opportunity so you don't waste time?`,
    `Walk me through managing a long sales cycle with several decision makers.`,
    `How do you build a business case for a buyer?`,
    `Tell me about a time you saved a deal that looked lost.`,
    `How do you forecast your pipeline accurately?`,
    `How do you work with sales engineers or customer success after the close?`
  ],
  'Account Manager': [
    `How do you build and maintain strong relationships with existing clients?`,
    `Tell me about a time you grew an account.`,
    `How do you handle a client who is thinking about leaving?`,
    `How do you prioritize across many accounts?`,
    `How do you deliver bad news to a client?`,
    `How do you spot upsell opportunities without being pushy?`
  ],
  'Customer Success Manager': [
    `How do you measure whether a customer is healthy or at risk of churning?`,
    `Tell me about a time you turned around an at-risk customer.`,
    `How do you onboard a new customer so they see value quickly?`,
    `How do you respond when a customer asks for a feature you can't build?`,
    `How do you balance the needs of customers with your company's goals?`,
    `How do you run a good quarterly business review?`
  ],
  'Marketing Manager': [
    `How do you build a marketing plan and set goals for it?`,
    `Tell me about a campaign you ran, its results and what you would change.`,
    `How do you decide how to split budget across channels?`,
    `How do you measure marketing's impact on revenue?`,
    `How do you work with sales to improve lead quality?`,
    `How do you research and position a product against competitors?`
  ],
  'Digital Marketer': [
    `Which metrics do you watch to judge a paid campaign, and when do you shut one down?`,
    `Walk me through how you would improve a landing page with a low conversion rate.`,
    `How would you approach SEO for a brand new website?`,
    `Tell me about a campaign that underperformed and how you fixed it.`,
    `How do you use A/B testing in your work?`,
    `Which tools do you use for analytics and marketing automation?`
  ],
  'Content Writer': [
    `How do you research a topic you don't know much about?`,
    `How do you adapt your writing for different audiences and channels?`,
    `Tell me about a piece you are proud of and how it performed.`,
    `How do you take edits and feedback on your writing?`,
    `How do you plan content that supports SEO and business goals?`,
    `How do you keep a consistent brand voice?`
  ],
  'Social Media Manager': [
    `How do you plan a content calendar and decide what to post?`,
    `Tell me about a post or campaign that took off or flopped.`,
    `How do you handle a negative comment or a public crisis on social media?`,
    `Which social media metrics matter most, and why?`,
    `How do you keep up with trends without losing the brand's voice?`,
    `How do you grow an audience organically?`
  ],
  'Public Relations Specialist': [
    `How do you build relationships with journalists?`,
    `Walk me through how you would handle a PR crisis.`,
    `Tell me about a successful campaign and how you measured it.`,
    `How do you write a press release that gets noticed?`,
    `How do you manage messaging when the facts are still unclear?`,
    `How do you prepare executives who will speak to the media?`
  ],
  'Brand Manager': [
    `How do you define and protect a brand's positioning?`,
    `Tell me about a brand campaign you led and its results.`,
    `How do you use consumer research to guide brand decisions?`,
    `How do you keep a brand consistent across many teams and channels?`,
    `How would you refresh an aging brand without alienating current customers?`,
    `How do you measure brand health?`
  ],

  /* ---------- People & Admin ---------- */
  'HR Generalist': [
    `How do you handle an employee complaint about their manager?`,
    `Walk me through how you would investigate a harassment claim.`,
    `How do you keep up with employment laws and make sure the company complies?`,
    `Tell me about a time you helped resolve a conflict between employees.`,
    `How do you coach a manager who struggles with performance conversations?`,
    `What do you do when a manager pressures you to share confidential information?`
  ],
  'Recruiter': [
    `Walk me through how you fill a role from the intake meeting to the signed offer.`,
    `How do you find strong candidates who aren't actively applying?`,
    `Tell me about a hard-to-fill role and how you succeeded.`,
    `How do you manage a hiring manager with unrealistic expectations?`,
    `How do you create a good candidate experience?`,
    `How do you reduce bias in your hiring process?`
  ],
  'Executive Assistant': [
    `How do you manage a busy executive's calendar when priorities conflict?`,
    `Tell me about a time you anticipated a need before being asked.`,
    `How do you handle confidential information?`,
    `How do you push back when an executive makes an unrealistic request?`,
    `Walk me through how you would plan a complex multi-city trip or an offsite.`,
    `How do you decide what to escalate and what to handle yourself?`
  ],
  'Administrative Assistant': [
    `How do you prioritize when several people give you urgent tasks?`,
    `Which software do you use for scheduling, documents and spreadsheets?`,
    `Tell me about a time you fixed a disorganized process.`,
    `How do you handle a frustrated visitor or caller?`,
    `How do you keep accurate records and files?`,
    `How do you stay organized when interruptions are constant?`
  ],
  'Customer Service Representative': [
    `A customer is angry about a late order and demands a refund. What do you do?`,
    `How do you stay calm and professional with a rude customer?`,
    `Tell me about a time you went above and beyond for a customer.`,
    `How do you handle a request that is against company policy?`,
    `How do you balance speed with quality on each call or chat?`,
    `What do you do when you don't know the answer to a customer's question?`
  ],
  'Receptionist': [
    `How do you handle a busy front desk with phones ringing and visitors arriving?`,
    `How do you deal with an upset or difficult visitor?`,
    `How do you handle confidential or sensitive information?`,
    `Tell me about a time you stayed calm in an unexpected situation.`,
    `What would you do if you had to cover several tasks at once?`,
    `How do you make a good first impression for the company?`
  ],
  'Office Manager': [
    `How do you keep an office running smoothly day to day?`,
    `How do you manage supplies, vendors and budgets?`,
    `Tell me about a time you improved office efficiency or saved money.`,
    `How do you handle a conflict between coworkers?`,
    `How would you prepare the office for an unexpected emergency or outage?`,
    `How do you balance administrative tasks with bigger projects?`
  ],

  /* ---------- Healthcare ---------- */
  'Registered Nurse': [
    `A patient's condition suddenly worsens. Walk me through what you do.`,
    `How do you prioritize when several patients all need you at once?`,
    `Tell me about a time you advocated for a patient.`,
    `How do you handle a medication error or a near miss?`,
    `How do you communicate with a family member who is upset?`,
    `How do you prevent burnout in a demanding unit?`
  ],
  'Physician / Doctor': [
    `Walk me through how you approach a patient with an unclear diagnosis.`,
    `Tell me about a difficult conversation you had with a patient or family.`,
    `How do you handle a disagreement with a colleague about treatment?`,
    `How do you stay current with changing medical evidence?`,
    `Tell me about a mistake or complication and what you did.`,
    `How do you manage a heavy workload while keeping the quality of care high?`
  ],
  'Pharmacist': [
    `What do you do when a prescription looks wrong or unsafe?`,
    `How do you counsel a patient who is confused about their medications?`,
    `Tell me about a time you caught an error before it reached a patient.`,
    `How do you handle a long line and a complicated insurance problem?`,
    `How do you stay current on drug interactions and new medications?`,
    `How do you work with prescribers when you disagree with an order?`
  ],
  'Physical Therapist': [
    `How do you build a treatment plan for a new patient?`,
    `How do you motivate a patient who isn't doing their exercises?`,
    `Tell me about a patient whose recovery was challenging.`,
    `How do you track and document progress?`,
    `How do you adapt treatment for different ages and conditions?`,
    `How do you work with doctors and other providers on a care plan?`
  ],
  'Medical Assistant': [
    `How do you prepare a patient and the room for a visit?`,
    `How do you stay calm and accurate when the clinic is busy?`,
    `Tell me about a time you handled a nervous or upset patient.`,
    `How do you protect patient privacy in your daily work?`,
    `What would you do if you noticed a patient's vital signs were abnormal?`,
    `How do you handle the mix of clinical and administrative tasks?`
  ],
  'Dentist': [
    `How do you help an anxious patient feel comfortable?`,
    `How do you explain treatment options and costs to patients?`,
    `Tell me about a complicated case and how you handled it.`,
    `How do you manage your schedule and your team during a busy day?`,
    `How do you stay current with new techniques and technology?`,
    `How do you handle a patient who disagrees with your recommendation?`
  ],
  'Mental Health Counselor': [
    `How do you build trust with a new client?`,
    `How do you handle a client who is in crisis or at risk of harming themselves?`,
    `Tell me about your counseling approach and the methods you use.`,
    `How do you maintain boundaries and confidentiality?`,
    `How do you take care of your own wellbeing in this work?`,
    `How do you work with a client who is resistant to change?`
  ],
  'Healthcare Administrator': [
    `How do you balance budget limits with quality of patient care?`,
    `Tell me about a process you improved in a healthcare setting.`,
    `How do you make sure your facility stays compliant with regulations like HIPAA?`,
    `How do you handle conflict between clinical and administrative staff?`,
    `How do you handle staffing shortages?`,
    `Which metrics do you use to judge a department's performance?`
  ],
  'Medical Student (Residency)': [
    `Why did you choose this specialty?`,
    `Tell me about a patient who had a big impact on you.`,
    `Describe a time you received critical feedback on a rotation and what you did with it.`,
    `How do you handle long hours and stress?`,
    `Tell me about a time you worked as part of a team during a difficult case.`,
    `How would you handle realizing you made a mistake in front of a patient?`
  ],

  /* ---------- Education & Public Service ---------- */
  'Teacher': [
    `How do you plan a lesson and know whether students learned it?`,
    `How do you handle a disruptive student?`,
    `How do you support students who are struggling or far ahead?`,
    `How do you communicate with parents, including in difficult conversations?`,
    `Tell me about a lesson that went badly and what you changed.`,
    `How do you use technology in your classroom?`
  ],
  'Professor / Lecturer': [
    `How do you design a course and decide what students should learn?`,
    `How do you balance teaching, research and service?`,
    `Tell me about your research agenda and where it is going.`,
    `How do you engage students in a large lecture?`,
    `How do you mentor students or junior researchers?`,
    `How do you handle academic integrity issues?`
  ],
  'School Administrator': [
    `How do you support teachers and improve instruction across a school?`,
    `How do you handle a conflict between a parent and a teacher?`,
    `Tell me about a policy or program you introduced and its results.`,
    `How do you make budget decisions with limited funds?`,
    `How do you build a positive school culture?`,
    `How do you respond to a serious safety or behavior incident?`
  ],
  'Social Worker': [
    `How do you build rapport with a client who is distrustful?`,
    `Walk me through how you would assess a family in crisis.`,
    `Tell me about a case that was emotionally difficult. How did you cope?`,
    `How do you balance a client's wishes with safety concerns?`,
    `How do you coordinate services across agencies?`,
    `How do you manage a large caseload and its documentation?`
  ],
  'Government / Policy Analyst': [
    `Walk me through how you would analyze a policy and recommend an option.`,
    `How do you explain a complex policy issue to a decision maker in one page?`,
    `Tell me about research you did that influenced a decision.`,
    `How do you stay objective when a topic is politically charged?`,
    `How do you work with stakeholders who have opposing views?`,
    `How do you evaluate whether a program is working?`
  ],
  'Nonprofit Program Manager': [
    `How do you design a program and measure its impact?`,
    `Tell me about managing a program on a tight budget.`,
    `How do you manage and motivate volunteers?`,
    `How do you work with funders and meet grant requirements?`,
    `Tell me about a program that didn't meet its goals and what you changed.`,
    `How do you build partnerships with other organizations?`
  ],
  'Librarian': [
    `How do you help someone who isn't sure what they need?`,
    `How do you decide which materials or resources to add to a collection?`,
    `Tell me about a program or service you started.`,
    `How do you handle a patron conflict in a public space?`,
    `How do you teach people to find and evaluate information?`,
    `How do you keep up with changing technology and formats?`
  ],
  'Police Officer': [
    `How would you handle a tense situation with an upset member of the public?`,
    `Tell me about a time you had to make a quick decision under pressure.`,
    `How do you build trust with the community you serve?`,
    `What would you do if you saw a fellow officer act inappropriately?`,
    `How do you make sure your reports are accurate and complete?`,
    `How do you manage stress and stay physically and mentally ready?`
  ],
  'Firefighter': [
    `Tell me about a time you worked as part of a team under pressure.`,
    `How do you stay calm and follow orders in an emergency?`,
    `Why do you want to be a firefighter?`,
    `How do you keep up your fitness and training?`,
    `How would you handle a mistake by a teammate during an incident?`,
    `How would you help someone who is frightened or in shock at the scene?`
  ],
  'Military / Veteran Transition': [
    `How do your military skills translate to the civilian role you want?`,
    `Tell me about a time you led a team. How did you get results?`,
    `How do you handle ambiguity when you don't have clear orders?`,
    `How would you adapt to a civilian workplace that has less structure?`,
    `Tell me about a time you had to learn a new skill fast.`,
    `How do you explain your military experience without relying on jargon?`
  ],

  /* ---------- Law, Engineering & Science ---------- */
  'Lawyer / Attorney': [
    `Walk me through how you would handle a case or matter from intake to resolution.`,
    `Tell me about a time you had to argue a position you didn't personally agree with.`,
    `How do you manage a heavy workload with competing deadlines?`,
    `How do you explain legal risk to a client who isn't a lawyer?`,
    `Tell me about a mistake in a filing or negotiation and what you did about it.`,
    `How do you approach legal research on an unfamiliar issue?`
  ],
  'Paralegal': [
    `How do you prepare and organize documents for a case or filing?`,
    `How do you keep confidential information secure?`,
    `Tell me about a time you caught an error that others missed.`,
    `How do you manage deadlines for multiple attorneys?`,
    `Which legal research tools have you used?`,
    `How do you respond when a client is stressed and asks you for legal advice?`
  ],
  'Mechanical Engineer': [
    `Walk me through a design project from requirements to prototype.`,
    `How do you choose materials for a new component?`,
    `Tell me about a design failure and what you learned.`,
    `How do you balance cost, performance and manufacturability?`,
    `Which CAD and simulation tools do you use, and how do you validate the results?`,
    `How do you work with manufacturing teams on a design problem?`
  ],
  'Electrical Engineer': [
    `Walk me through how you would design and debug a circuit that doesn't work.`,
    `How do you handle noise and signal integrity problems?`,
    `Tell me about a project you were responsible for from specs to testing.`,
    `How do you decide between an analog and a digital approach?`,
    `Which tools do you use for schematics, simulation and testing?`,
    `How do you make sure designs meet safety and compliance standards?`
  ],
  'Civil Engineer': [
    `Walk me through how you would approach designing a structure or site plan.`,
    `How do you handle building codes and permitting requirements?`,
    `Tell me about a project where conditions on site differed from the plans.`,
    `How do you manage costs and schedules on a construction project?`,
    `How do you prioritize safety in your designs?`,
    `How do you coordinate with contractors, clients and regulators?`
  ],
  'Chemical Engineer': [
    `Walk me through how you would scale a process from the lab to production.`,
    `How do you identify and manage process safety hazards?`,
    `Tell me about a process you optimized and the results.`,
    `How do you troubleshoot a process that drifts out of spec?`,
    `How do you work with operators and plant staff?`,
    `How do you handle environmental and regulatory requirements?`
  ],
  'Biomedical Engineer': [
    `Walk me through the development of a medical device from concept to approval.`,
    `How do you design with patient safety and FDA regulations in mind?`,
    `Tell me about a technical problem you solved in a device or system.`,
    `How do you work with clinicians to understand what they need?`,
    `How do you document your design work for regulatory review?`,
    `How do you test and verify a device before release?`
  ],
  'Research Scientist': [
    `Walk me through a research project you led, from question to results.`,
    `How do you design an experiment and decide what controls you need?`,
    `Tell me about an experiment that failed and what you did next.`,
    `How do you handle conflicting or unexpected data?`,
    `How do you communicate your findings to non-specialists?`,
    `How do you decide which research directions to pursue?`
  ],
  'Lab Technician': [
    `How do you make sure your measurements and records are accurate?`,
    `Walk me through how you follow safety procedures when working with hazardous materials.`,
    `Tell me about a time an instrument or test gave unexpected results.`,
    `How do you keep a lab organized and its equipment calibrated?`,
    `How do you handle multiple samples with tight deadlines?`,
    `What would you do if you realized you made an error in a test?`
  ],
  'Architect': [
    `Walk me through a project from client brief to construction documents.`,
    `How do you balance a client's vision with budget and code requirements?`,
    `Tell me about a design challenge on a difficult site.`,
    `How do you coordinate with engineers and contractors?`,
    `How do you incorporate sustainability into your designs?`,
    `Which design software do you use, and how do you present ideas to clients?`
  ],

  /* ---------- Creative & Media ---------- */
  'Video Editor': [
    `Walk me through how you edit a project from raw footage to final cut.`,
    `How do you decide what to cut when the video is too long?`,
    `Tell me about a project with a tight deadline and heavy revisions.`,
    `Which editing software and tools are you most comfortable with?`,
    `How do you handle feedback from a director or client you disagree with?`,
    `How do you manage large files and keep your projects organized?`
  ],
  'Journalist': [
    `Walk me through how you would report a story on a tight deadline.`,
    `How do you verify information and handle a source who may not be reliable?`,
    `Tell me about a story you are proud of and how you found it.`,
    `How do you handle sensitive subjects and protect your sources?`,
    `How do you handle being wrong or having to issue a correction?`,
    `How do you find and pitch story ideas?`
  ],
  'Copywriter': [
    `How do you approach a brief and find the core message?`,
    `Tell me about a piece of copy that drove results.`,
    `How do you adapt your tone for different brands?`,
    `How do you handle heavy edits from clients?`,
    `How do you write headlines that get attention?`,
    `How do you test or measure whether copy works?`
  ],
  'Photographer': [
    `How do you prepare for a shoot and plan the shots you need?`,
    `How do you handle difficult lighting or a tight shooting window?`,
    `Tell me about a shoot where things went wrong and how you adapted.`,
    `Walk me through your editing and delivery workflow.`,
    `How do you make clients or subjects comfortable in front of the camera?`,
    `How do you develop a consistent style while serving a client's vision?`
  ],
  'Game Designer': [
    `Walk me through how you would design a core gameplay loop.`,
    `How do you balance a game's difficulty and progression?`,
    `Tell me about a feature you designed and how playtesting changed it.`,
    `How do you document design ideas so a team can build them?`,
    `How do you handle feedback from programmers or artists about feasibility?`,
    `Which games inspire you, and what would you change about one of them?`
  ],
  'Animator': [
    `Walk me through your process from storyboard to final animation.`,
    `How do you make a character's movement feel believable?`,
    `Tell me about a project with a tight deadline.`,
    `Which animation software and techniques do you use?`,
    `How do you take direction and revisions on your work?`,
    `How do you work with sound designers, writers and other artists?`
  ],

  /* ---------- Hospitality, Retail & Trades ---------- */
  'Retail Associate': [
    `A customer is upset about a return that is outside your policy. What do you do?`,
    `How do you approach a customer who looks like they need help?`,
    `Tell me about a time you made a sale or helped a customer find the right product.`,
    `How do you stay productive during a slow shift?`,
    `How do you handle a busy rush with a long line?`,
    `What would you do if you saw someone shoplifting?`
  ],
  'Store Manager': [
    `How do you motivate and schedule a team during busy and slow periods?`,
    `Tell me about a time you improved sales or reduced costs.`,
    `How do you handle an employee who is late or underperforming?`,
    `How do you manage inventory and prevent shrinkage?`,
    `How do you resolve a customer complaint that escalates to you?`,
    `Which metrics do you review to run your store?`
  ],
  'Restaurant Server': [
    `How do you handle a table that is upset about long wait times?`,
    `How do you manage several tables at once during a rush?`,
    `How do you handle a guest with a food allergy?`,
    `Tell me about a time you turned around a bad dining experience.`,
    `How do you work with the kitchen and the rest of the team?`,
    `How do you suggest dishes or upsell without being pushy?`
  ],
  'Chef / Cook': [
    `How do you keep a station organized and clean during a rush?`,
    `How do you maintain food safety and prevent cross-contamination?`,
    `Tell me about a time something went wrong in service and how you fixed it.`,
    `How do you handle a last-minute menu change or a missing ingredient?`,
    `How do you manage food costs and waste?`,
    `How do you take feedback from a head chef?`
  ],
  'Hotel Front Desk': [
    `How do you handle a guest who arrives to find their room isn't ready or their reservation is missing?`,
    `How do you handle a guest complaint about noise or cleanliness?`,
    `Tell me about a time you went the extra mile for a guest.`,
    `How do you manage check-ins when the lobby is crowded?`,
    `How do you handle cash, payments and sensitive guest information?`,
    `How would you handle an emergency during your shift?`
  ],
  'Barista': [
    `How do you stay accurate and fast during a morning rush?`,
    `A customer says their drink is wrong. What do you do?`,
    `Tell me about a time you built a connection with a regular customer.`,
    `How do you keep your station clean and stocked?`,
    `How do you handle a coworker who isn't pulling their weight during a rush?`,
    `How do you learn and remember a large drink menu and its customizations?`
  ],
  'Electrician': [
    `Walk me through how you would troubleshoot a circuit that keeps tripping a breaker.`,
    `How do you stay safe working around live power, and which procedures do you follow?`,
    `Tell me about a complex wiring job and how you planned it.`,
    `How do you make sure your work meets electrical code?`,
    `How do you read blueprints and plan a job?`,
    `How do you respond to a client who wants a shortcut that isn't safe?`
  ],
  'Plumber': [
    `Walk me through how you would diagnose a leak you can't see.`,
    `How do you handle a plumbing emergency like a burst pipe at night?`,
    `Tell me about a difficult repair and how you solved it.`,
    `How do you explain a repair cost and the options to a customer?`,
    `How do you make sure your work meets code?`,
    `How do you plan a job so you have the right parts and tools?`
  ],
  'Warehouse Associate': [
    `How do you stay accurate and fast when picking and packing orders?`,
    `How do you follow safety rules when using equipment like forklifts or pallet jacks?`,
    `Tell me about a time you spotted a problem with inventory or an order.`,
    `How do you handle heavy physical work for a full shift?`,
    `How do you work with a team to meet a tight shipping deadline?`,
    `What would you do if you saw a coworker doing something unsafe?`
  ],
  'Delivery Driver': [
    `How do you plan your route and stay on schedule when there is traffic or a delay?`,
    `How do you handle a customer who is upset about a late or damaged delivery?`,
    `How do you keep yourself and your vehicle safe on the road?`,
    `Tell me about a time you solved a problem on your own during a delivery.`,
    `How do you handle a package that can't be delivered?`,
    `How do you stay focused and alert on long shifts?`
  ],
  'Construction Worker': [
    `How do you follow safety procedures and use protective equipment on a job site?`,
    `Tell me about a time you worked with a team to finish a project on a deadline.`,
    `How do you read plans and follow instructions from a supervisor?`,
    `What would you do if you saw a hazard on the job site?`,
    `Which tools and equipment are you trained to use?`,
    `How do you handle physically demanding work in hot or cold weather?`
  ]
};
