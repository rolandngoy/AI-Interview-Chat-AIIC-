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

// Hands-on or calculation questions. These are best typed, so voice answers are off for them.
window.AIIC_PRACTICAL = [
  `How would you design a URL shortener that handles millions of requests a day?`,
  `Walk me through how you would test a login page.`,
  `Which SQL techniques do you use most, and how would you find duplicate records?`,
  `How would you estimate the size of the market for electric scooters in a large city?`,
  `If depreciation increases by $10, what happens to the three financial statements?`
];

/* ---------- Additional roles ---------- */
Object.assign(window.AIIC_ROLE_QUESTIONS, {
  /* Technology */
  'Solutions Architect': [
    `Walk me through how you would design a solution for a customer with unclear requirements.`,
    `How do you balance cost, performance, security and time to market in an architecture?`,
    `Tell me about a time you had to explain a technical design to a non-technical executive.`,
    `How do you decide between a monolith and microservices?`,
    `Describe a design that failed in practice and what you learned.`,
    `How do you keep an architecture from drifting after it is built?`
  ],
  'Technical Support Engineer': [
    `Walk me through how you troubleshoot a customer problem you can't reproduce.`,
    `Tell me about a technical issue you solved that required help from engineering.`,
    `How do you explain a complex fix to a customer who isn't technical?`,
    `How do you handle an angry customer during a major outage?`,
    `How do you decide when to escalate a ticket?`,
    `How do you turn repeated tickets into documentation or product fixes?`
  ],
  'Embedded Systems Engineer': [
    `Walk me through how you would bring up a new board for the first time.`,
    `How do you debug a problem that only happens intermittently on hardware?`,
    `How do you manage limited memory and power on a small device?`,
    `Tell me about a time you worked with both hardware and software teams.`,
    `Explain how interrupts work and the risks of using them.`,
    `How do you test firmware before it ships?`
  ],
  'Game Developer': [
    `Walk me through a game system you built and the problems you hit.`,
    `How do you find and fix performance problems like low frame rates?`,
    `How do you work with designers who keep changing the requirements?`,
    `Tell me about a bug that was hard to reproduce and how you found it.`,
    `How do you structure game code so features stay easy to change?`,
    `Which engines have you used, and what are the tradeoffs between them?`
  ],
  'AI Engineer': [
    `How do you build a feature on top of a large language model and make it reliable?`,
    `How do you evaluate whether an AI feature is actually working well?`,
    `Tell me about a time a model gave wrong or unsafe output. What did you do?`,
    `How do you manage cost and latency when you use AI models in production?`,
    `How do you handle private or sensitive data in an AI system?`,
    `How do you explain the limits of AI to a stakeholder who expects it to be perfect?`
  ],
  'Penetration Tester': [
    `Walk me through how you would test a web application from start to finish.`,
    `How do you decide what is in scope and what isn't?`,
    `Tell me about the most serious vulnerability you found and how you reported it.`,
    `How do you write a report that both engineers and executives can act on?`,
    `How do you stay within legal and ethical limits during an engagement?`,
    `How do you keep your skills and tools current?`
  ],
  'Technical Writer': [
    `How do you learn a complex product well enough to document it?`,
    `Walk me through how you plan and structure a set of documentation.`,
    `How do you get busy engineers to review your work?`,
    `Tell me about a document you improved after user feedback.`,
    `How do you decide how much detail the reader needs?`,
    `Which documentation tools and formats have you used?`
  ],
  'Business Intelligence Analyst': [
    `Walk me through building a dashboard that leadership will actually use.`,
    `How do you make sure the numbers in a report can be trusted?`,
    `Tell me about an insight from your data that changed a decision.`,
    `How do you handle two teams who define the same metric differently?`,
    `Which BI tools and SQL techniques do you use most?`,
    `How do you explain data to people who aren't comfortable with numbers?`
  ],
  'IT Manager': [
    `How do you plan your IT budget and decide what to invest in?`,
    `Tell me about a major outage or security incident you managed.`,
    `How do you balance keeping systems stable with introducing new technology?`,
    `How do you manage vendors and contracts?`,
    `How do you lead a team that is always handling urgent requests?`,
    `How do you align IT priorities with what the business needs?`
  ],
  'Engineering Manager': [
    `How do you balance delivery speed with code quality and team health?`,
    `Tell me about a time you managed an underperforming engineer.`,
    `How do you decide what to build in-house and what to buy?`,
    `How do you grow and promote engineers on your team?`,
    `How do you handle a project that is going to miss its deadline?`,
    `How do you stay technical enough to make good decisions?`
  ],

  /* Product & Design */
  'Technical Program Manager': [
    `How do you drive a program that depends on several engineering teams?`,
    `Tell me about a technical risk you spotted early and how you handled it.`,
    `How do you communicate status to both engineers and executives?`,
    `How do you resolve a disagreement between two teams about an interface or deadline?`,
    `How do you decide what to cut when a launch date can't move?`,
    `How do you run a good launch readiness review?`
  ],
  'Product Owner': [
    `How do you write and prioritize a backlog?`,
    `How do you decide whether a story is ready for the team?`,
    `Tell me about a time you pushed back on a stakeholder request.`,
    `How do you work with the team when requirements change mid-sprint?`,
    `How do you measure whether what you delivered created value?`,
    `How do you gather input from users and customers?`
  ],
  'Motion Designer': [
    `Walk me through how you take a project from storyboard to final animation.`,
    `How do you use motion to help users understand an interface?`,
    `Tell me about a project with tight deadlines and many revisions.`,
    `Which tools do you use, and how do you hand off animations to developers?`,
    `How do you keep file sizes and performance in check?`,
    `How do you take feedback from a client or art director?`
  ],

  /* Business & Finance */
  'Financial Advisor': [
    `A client is 40 years old with $50,000 saved and wants to retire at 65. How would you start building their plan?`,
    `How do you find out a client's real goals and tolerance for risk?`,
    `Tell me about a time a client wanted to make a bad financial decision.`,
    `How do you explain complex products in plain language?`,
    `How do you build a client base from scratch?`,
    `How do you keep up with regulations and your duty to act in a client's interest?`
  ],
  'Risk Analyst': [
    `How do you identify and rank the risks a business faces?`,
    `Walk me through how you would build a risk model and test its assumptions.`,
    `Tell me about a risk you flagged that others ignored.`,
    `How do you explain a risk to leaders who want to move fast?`,
    `How do you tell the difference between a risk you accept and one you must reduce?`,
    `Which tools and data sources do you use to monitor risk?`
  ],
  'Compliance Analyst': [
    `How do you keep up with changing regulations and apply them to daily work?`,
    `Tell me about a compliance issue you found and how you handled it.`,
    `How do you get busy employees to follow compliance procedures?`,
    `Walk me through how you would run a compliance review of a process.`,
    `What would you do if a senior leader wanted to skip a required control?`,
    `How do you document your work for auditors?`
  ],
  'Bank Teller': [
    `How do you make sure cash transactions are accurate?`,
    `How do you handle a customer who is upset about a hold or a fee?`,
    `What would you do if you suspected a transaction was fraud?`,
    `How do you suggest products to customers without being pushy?`,
    `How do you stay accurate and friendly during a busy line?`,
    `How do you handle confidential customer information?`
  ],
  'Loan Officer': [
    `Walk me through how you decide whether to approve a loan application.`,
    `How do you explain a denial to an applicant?`,
    `How do you find and keep new borrowers?`,
    `How do you spot signs of fraud or misrepresentation in an application?`,
    `Tell me about a difficult loan you got across the line.`,
    `How do you stay compliant with lending regulations?`
  ],
  'Insurance Agent': [
    `How do you work out what coverage a client really needs?`,
    `How do you explain a policy's exclusions so there are no surprises?`,
    `Tell me about a time you helped a client through a claim.`,
    `How do you find new clients and build referrals?`,
    `How do you handle a client who says insurance is too expensive?`,
    `How do you keep up with licensing and product changes?`
  ],
  'Real Estate Agent': [
    `How do you price a home and explain it to a seller?`,
    `Tell me about a deal that nearly fell apart and how you saved it.`,
    `How do you find and win new clients?`,
    `How do you handle negotiations when a buyer and seller are far apart?`,
    `How do you manage several clients and showings at once?`,
    `How do you stay on top of the local market?`
  ],
  'Procurement Specialist': [
    `How do you choose a supplier and compare bids?`,
    `Tell me about a negotiation that saved your company money.`,
    `How do you handle a supplier who misses deliveries?`,
    `How do you balance cost against quality and reliability?`,
    `How do you make sure purchases follow company policy?`,
    `How do you build good long-term relationships with vendors?`
  ],
  'Bookkeeper': [
    `How do you reconcile a bank statement that doesn't match your books?`,
    `How do you keep accurate records when receipts and paperwork are messy?`,
    `Tell me about an error you found and how you fixed it.`,
    `Which accounting software do you use?`,
    `How do you handle month-end and year-end deadlines?`,
    `How do you protect sensitive financial information?`
  ],
  'Logistics Coordinator': [
    `How do you plan shipments and keep them on schedule?`,
    `Tell me about a delay or disruption you managed.`,
    `How do you work with carriers, warehouses and customers at once?`,
    `How do you track shipments and report problems early?`,
    `How do you reduce shipping costs without hurting service?`,
    `How do you handle customs or documentation errors?`
  ],

  /* Sales & Marketing */
  'Sales Development Representative': [
    `How do you research a prospect before you reach out?`,
    `Walk me through your approach to a cold call.`,
    `How do you handle getting rejected many times in a row?`,
    `How do you decide whether a lead is ready to pass to an account executive?`,
    `Tell me about your best outreach message and why it worked.`,
    `How do you manage your day to hit activity and meeting targets?`
  ],
  'Product Marketing Manager': [
    `How do you position a new product against competitors?`,
    `Walk me through a product launch you led.`,
    `How do you learn what customers care about?`,
    `How do you work with product, sales and design teams on messaging?`,
    `How do you measure whether a launch succeeded?`,
    `How do you train sales teams on a new product?`
  ],
  'SEO Specialist': [
    `How do you do keyword research for a new website?`,
    `Tell me about a time you grew a site's organic traffic.`,
    `How do you respond to a sudden drop in search rankings?`,
    `How do you balance technical SEO with content work?`,
    `Which SEO tools do you use and how do you report results?`,
    `How do you stay current with search engine changes?`
  ],
  'Event Planner': [
    `Walk me through how you plan an event from request to follow-up.`,
    `How do you stay on budget when costs keep going up?`,
    `Tell me about a time something went wrong at an event.`,
    `How do you manage vendors and a lot of last-minute changes?`,
    `How do you work with a client who is hard to please?`,
    `How do you measure whether an event was a success?`
  ],
  'Market Research Analyst': [
    `How do you design a survey that gives reliable answers?`,
    `Walk me through a research project from question to recommendation.`,
    `How do you decide between qualitative and quantitative methods?`,
    `How do you present findings so a team acts on them?`,
    `Tell me about research that contradicted what the team believed.`,
    `Which tools do you use to analyze data?`
  ],

  /* People & Admin */
  'Training and Development Specialist': [
    `How do you find out what training a team needs?`,
    `Walk me through designing a training program from scratch.`,
    `How do you measure whether training worked?`,
    `How do you keep adult learners engaged?`,
    `Tell me about a training session that didn't go well and what you changed.`,
    `How do you make training fit a tight budget?`
  ],
  'Payroll Specialist': [
    `How do you make sure payroll is accurate every cycle?`,
    `What would you do if you found an error after payroll was paid?`,
    `How do you keep up with tax and wage laws?`,
    `How do you handle a frustrated employee whose pay is wrong?`,
    `Which payroll systems have you used?`,
    `How do you protect confidential employee information?`
  ],
  'Project Coordinator': [
    `How do you keep many tasks and deadlines organized?`,
    `Tell me about a time you helped a project get back on track.`,
    `How do you follow up with people who don't respond?`,
    `Which project tools do you use for tracking and reporting?`,
    `How do you prepare for and follow up after meetings?`,
    `How do you handle a request from a manager that conflicts with the plan?`
  ],

  /* Healthcare */
  'Nurse Practitioner': [
    `How do you decide when to treat a patient yourself and when to refer?`,
    `Tell me about a hard diagnosis you made.`,
    `How do you work with physicians when you see a case differently?`,
    `How do you teach patients about managing a long-term condition?`,
    `How do you manage a full schedule while giving each patient enough time?`,
    `How do you stay current with changing guidelines?`
  ],
  'Occupational Therapist': [
    `How do you build a plan around a patient's daily goals?`,
    `Tell me about a patient whose progress was slow and how you adapted.`,
    `How do you involve families and caregivers?`,
    `How do you document progress for insurers?`,
    `How do you adapt activities for different ages and abilities?`,
    `How do you motivate a patient who feels discouraged?`
  ],
  'Speech-Language Pathologist': [
    `How do you assess a new patient's speech or language needs?`,
    `Tell me about a patient whose communication improved the most.`,
    `How do you keep therapy engaging for children?`,
    `How do you work with teachers, doctors and families?`,
    `How do you decide when a patient is ready to be discharged?`,
    `How do you handle a family with unrealistic expectations?`
  ],
  'Veterinarian': [
    `How do you talk with an owner about an expensive treatment they can't afford?`,
    `Walk me through how you diagnose an animal that can't tell you what is wrong.`,
    `Tell me about a difficult case or a loss and how you handled it.`,
    `How do you handle an owner who disagrees with your advice?`,
    `How do you manage stress and compassion fatigue?`,
    `How do you keep up with new treatments?`
  ],
  'Veterinary Technician': [
    `How do you keep an animal calm during a procedure?`,
    `How do you prepare equipment and a patient for surgery?`,
    `Tell me about a time you noticed something wrong with a patient.`,
    `How do you explain home care to an anxious owner?`,
    `How do you stay safe around frightened or aggressive animals?`,
    `How do you stay organized in a busy clinic?`
  ],
  'Nursing Assistant (CNA)': [
    `How do you help a patient who is embarrassed or resistant to care?`,
    `What do you do if a patient's condition looks different from earlier in your shift?`,
    `How do you manage your time with many patients to care for?`,
    `Tell me about a time you comforted a patient or family member.`,
    `How do you work with nurses and report changes quickly?`,
    `How do you protect patient dignity and privacy?`
  ],
  'Paramedic / EMT': [
    `Walk me through how you assess a patient at an emergency scene.`,
    `How do you stay calm and think clearly under extreme pressure?`,
    `Tell me about a call that was especially hard and how you coped.`,
    `How do you communicate with frightened patients and families?`,
    `How do you work with a partner when you disagree on treatment?`,
    `How do you take care of your mental health in this job?`
  ],
  'Dental Hygienist': [
    `How do you help an anxious patient feel at ease?`,
    `How do you teach patients to improve their home care?`,
    `Tell me about a time you spotted a problem the dentist needed to see.`,
    `How do you stay on schedule while giving thorough care?`,
    `How do you follow infection control procedures?`,
    `How do you talk with a patient who avoids the dentist?`
  ],
  'Radiologic Technologist': [
    `How do you position a patient who is in pain or can't hold still?`,
    `How do you keep radiation exposure as low as possible for patients and yourself?`,
    `Tell me about a time you had to repeat or correct an image.`,
    `How do you explain a procedure to a nervous patient?`,
    `How do you prioritize when emergency scans come in?`,
    `How do you work with radiologists and nurses?`
  ],
  'Medical Coder / Biller': [
    `How do you make sure codes match the documentation?`,
    `How do you handle a doctor's note that is unclear?`,
    `Tell me about a billing error you found and fixed.`,
    `How do you keep up with changing codes and payer rules?`,
    `How do you work on denied claims?`,
    `How do you protect patient privacy in your work?`
  ],

  /* Education & Public Service */
  'School Counselor': [
    `How do you build trust with a student who doesn't want to talk?`,
    `What do you do when a student tells you something that worries you?`,
    `How do you support students with college and career planning?`,
    `How do you work with parents and teachers on a student's needs?`,
    `Tell me about a student you helped through a hard time.`,
    `How do you handle a large caseload?`
  ],
  'Teaching Assistant': [
    `How do you support a student who is struggling without taking over?`,
    `How do you work with a teacher whose style is different from yours?`,
    `How do you handle a student who is disruptive?`,
    `Tell me about a time you helped a student make a breakthrough.`,
    `How do you stay flexible when the plan changes?`,
    `How do you support students with special needs?`
  ],
  'Instructional Designer': [
    `How do you start designing a course for a new audience?`,
    `How do you write clear learning objectives and measure them?`,
    `How do you work with subject matter experts who are short on time?`,
    `Tell me about a course you improved using learner feedback.`,
    `Which authoring tools and learning theories do you use?`,
    `How do you make online learning engaging?`
  ],
  'Early Childhood Educator': [
    `How do you plan activities for young children with short attention spans?`,
    `How do you handle a child who is having a tantrum?`,
    `How do you talk with parents about their child's development?`,
    `How do you keep a classroom safe and calm?`,
    `Tell me about a time you helped a shy or struggling child.`,
    `How do you encourage learning through play?`
  ],
  'Tutor': [
    `How do you find out where a student is struggling?`,
    `How do you explain a concept in a different way when the first one doesn't work?`,
    `How do you keep a discouraged student motivated?`,
    `Tell me about a student whose results improved with your help.`,
    `How do you work with parents and teachers?`,
    `How do you plan a session so time is used well?`
  ],
  'Case Manager': [
    `How do you manage a large caseload with many urgent needs?`,
    `How do you build a plan with a client who is reluctant to engage?`,
    `Tell me about a time you connected a client to the right resources.`,
    `How do you keep accurate and confidential records?`,
    `How do you handle a situation involving risk or safety?`,
    `How do you work with other agencies and providers?`
  ],
  'Fundraising Coordinator': [
    `How do you plan a fundraising campaign and set a goal?`,
    `How do you build relationships with donors?`,
    `Tell me about a campaign you ran and what it raised.`,
    `How do you thank and keep donors involved over time?`,
    `How do you write a grant proposal that stands out?`,
    `How do you handle a donor who is unhappy?`
  ],

  /* Law, Engineering & Science */
  'Industrial Engineer': [
    `How do you find waste in a process and decide what to fix first?`,
    `Tell me about a process you improved and how you measured the result.`,
    `Walk me through a time-and-motion or layout study you did.`,
    `How do you get workers on the floor to accept changes?`,
    `Which methods, such as Lean or Six Sigma, have you used?`,
    `How do you balance cost, quality and safety?`
  ],
  'Environmental Engineer': [
    `Walk me through how you would assess a contaminated site.`,
    `How do you make sure a project meets environmental regulations?`,
    `Tell me about a project that reduced environmental impact.`,
    `How do you work with regulators and the community?`,
    `How do you balance cost against environmental goals?`,
    `Which modeling and sampling methods have you used?`
  ],
  'Aerospace Engineer': [
    `Walk me through a design problem where weight, cost and safety competed.`,
    `How do you verify and test a design before flight?`,
    `Tell me about a failure or anomaly and how it was investigated.`,
    `How do you work with strict safety and certification requirements?`,
    `Which simulation and analysis tools have you used?`,
    `How do you document your work for review?`
  ],
  'Manufacturing Engineer': [
    `How do you improve a production line that is slow or makes defects?`,
    `Tell me about a time you brought a new product into production.`,
    `How do you work with operators who resist changes?`,
    `How do you use data to find the cause of a quality problem?`,
    `How do you reduce downtime and scrap?`,
    `How do you make sure changes are safe?`
  ],
  'Biologist': [
    `Walk me through a research project you ran, from question to results.`,
    `How do you design experiments with good controls?`,
    `Tell me about an experiment that failed and what you did next.`,
    `How do you analyze and present your data?`,
    `How do you follow lab safety and ethics rules?`,
    `How do you explain your research to non-scientists?`
  ],
  'Chemist': [
    `How do you plan an experiment and choose methods and instruments?`,
    `Tell me about an unexpected result and how you investigated it.`,
    `How do you keep accurate records and follow safety rules?`,
    `Which analytical techniques are you strongest in?`,
    `How do you validate a method so the results can be trusted?`,
    `How do you handle a result that doesn't meet specifications?`
  ],
  'Environmental Scientist': [
    `How do you design a field study and collect reliable data?`,
    `Tell me about a project where your findings influenced a decision.`,
    `How do you explain scientific findings to the public or policymakers?`,
    `How do you stay objective when stakeholders have strong interests?`,
    `Which software and statistical methods do you use?`,
    `How do you work with regulators and community groups?`
  ],
  'Quality Control Inspector': [
    `How do you inspect a product and decide whether it passes?`,
    `What do you do when you find a defect that others think is minor?`,
    `Tell me about a time you caught a problem before it shipped.`,
    `Which measuring tools and standards have you used?`,
    `How do you document and report your findings?`,
    `How do you work with production staff when you reject their work?`
  ],

  /* Creative & Media */
  'Art Director': [
    `How do you turn a brief into a creative concept for a team?`,
    `How do you give feedback to a designer so the work improves?`,
    `Tell me about a campaign you led and its results.`,
    `How do you keep a strong vision while working with client constraints?`,
    `How do you manage a budget and a deadline on a creative project?`,
    `How do you present ideas to a client who is hard to please?`
  ],
  'Illustrator': [
    `Walk me through your process from brief to final artwork.`,
    `How do you develop a style while meeting a client's needs?`,
    `How do you handle revisions and feedback?`,
    `How do you manage deadlines on several projects at once?`,
    `Which tools and media do you use?`,
    `How do you find new clients and build a portfolio?`
  ],
  'Interior Designer': [
    `How do you find out what a client really wants for a space?`,
    `How do you work within a budget and a client's changing ideas?`,
    `Tell me about a challenging space you transformed.`,
    `How do you coordinate contractors and vendors?`,
    `How do you consider safety, codes and accessibility?`,
    `How do you present a design concept to a client?`
  ],
  'Fashion Designer': [
    `Walk me through how you take a collection from concept to production.`,
    `How do you research trends without copying others?`,
    `How do you balance creativity with cost and manufacturing limits?`,
    `Tell me about a design that didn't work and what you changed.`,
    `How do you work with pattern makers, suppliers and factories?`,
    `How do you take feedback on your designs?`
  ],
  'Podcast Producer': [
    `How do you plan an episode from idea to release?`,
    `How do you prepare a guest and get a good conversation?`,
    `Tell me about how you edit audio to improve pacing and quality.`,
    `How do you grow and keep an audience?`,
    `How do you handle a recording that has technical problems?`,
    `Which tools and platforms do you use?`
  ],
  'Translator / Interpreter': [
    `How do you handle a phrase that doesn't translate directly?`,
    `How do you prepare for a job in an unfamiliar subject?`,
    `How do you stay accurate and neutral under time pressure?`,
    `Tell me about a difficult or sensitive translation or interpreting job.`,
    `How do you handle confidential material?`,
    `Which tools do you use, and how do you keep your language skills sharp?`
  ],

  /* Hospitality, Retail & Trades */
  'Bartender': [
    `How do you handle a customer who has had too much to drink?`,
    `How do you stay accurate and fast during a busy rush?`,
    `Tell me about a time you turned around a bad customer experience.`,
    `How do you check ID and follow alcohol laws?`,
    `How do you keep your bar clean, stocked and organized?`,
    `How do you recommend drinks to someone who can't decide?`
  ],
  'Flight Attendant': [
    `How do you handle a passenger who is upset or breaking the rules?`,
    `How do you stay calm during turbulence or an emergency?`,
    `Tell me about a time you worked as part of a team under pressure.`,
    `How do you deal with long hours, time zones and irregular schedules?`,
    `How do you make nervous passengers feel safe?`,
    `Why do you want this job?`
  ],
  'Cashier': [
    `A customer hands you $20 for a $13.47 purchase. How much change do you give back?`,
    `How do you stay accurate and friendly when the line is long?`,
    `What do you do if your drawer doesn't balance at the end of a shift?`,
    `How do you handle a customer who disputes a price?`,
    `How do you handle a suspected fake bill or stolen card?`,
    `Tell me about a time you helped a customer solve a problem.`
  ],
  'Hair Stylist': [
    `How do you find out what a client wants when they can't describe it?`,
    `How do you handle a client who is unhappy with their cut or color?`,
    `How do you build a loyal client base?`,
    `How do you keep up with trends and new techniques?`,
    `How do you keep your station clean and safe?`,
    `How do you manage your schedule when appointments run long?`
  ],
  'Personal Trainer': [
    `How do you design a plan for a new client with a specific goal?`,
    `How do you motivate a client who has stopped making progress?`,
    `How do you work with a client who has an injury or health condition?`,
    `How do you make sure exercises are done safely?`,
    `How do you track progress and adjust the plan?`,
    `How do you find and keep clients?`
  ],
  'Auto Mechanic': [
    `Walk me through how you diagnose a car that makes a noise you can't place.`,
    `How do you explain a repair and its cost to a customer?`,
    `Tell me about a hard repair and how you solved it.`,
    `How do you stay safe working in a shop?`,
    `How do you keep up with new vehicle technology?`,
    `How do you handle a customer who doesn't want to pay for a necessary repair?`
  ],
  'HVAC Technician': [
    `Walk me through how you diagnose a system that isn't cooling.`,
    `How do you stay safe working with electrical systems and refrigerants?`,
    `How do you explain a repair versus a replacement to a customer?`,
    `Tell me about a difficult service call.`,
    `How do you handle an emergency call in extreme weather?`,
    `How do you keep your certifications and skills up to date?`
  ],
  'Welder': [
    `How do you prepare metal and choose a welding process for a job?`,
    `How do you stay safe from fumes, heat and electrical hazards?`,
    `How do you read blueprints and weld symbols?`,
    `Tell me about a weld that failed inspection and what you did.`,
    `Which processes, such as MIG, TIG and stick, are you qualified in?`,
    `How do you keep quality consistent over a long shift?`
  ],
  'Carpenter': [
    `How do you read plans and plan a job before cutting any wood?`,
    `How do you make sure your measurements and cuts are accurate?`,
    `Tell me about a difficult project and how you solved the problems.`,
    `How do you stay safe with power tools?`,
    `How do you work with other trades on a job site?`,
    `How do you handle a client who changes the plan midway?`
  ],
  'Security Guard': [
    `What would you do if you saw someone acting suspiciously?`,
    `How do you handle a confrontation while staying calm?`,
    `How do you write a clear incident report?`,
    `How do you stay alert during long, quiet shifts?`,
    `When do you call the police or emergency services?`,
    `How do you treat visitors politely while enforcing the rules?`
  ],
  'Truck Driver': [
    `How do you plan a long route and stay within hours-of-service rules?`,
    `How do you do a pre-trip inspection?`,
    `Tell me about a time you faced bad weather or a breakdown on the road.`,
    `How do you stay alert and manage fatigue?`,
    `How do you handle a delivery delay and communicate with dispatch?`,
    `How do you keep your safety record clean?`
  ],
  'Physician Assistant': [
    `Walk me through how you would evaluate a patient who comes in with chest pain, from the first minute to your plan.`,
    `How do you decide when to treat a patient yourself and when to bring in the supervising physician?`,
    `Tell me about a time you caught something others missed, or a diagnosis that was not what it first looked like.`,
    `How do you explain a diagnosis and a treatment plan to a patient who is anxious or has little medical background?`,
    `How do you prioritize when several patients need you at once in a busy clinic or emergency department?`,
    `How do you stay current on new guidelines and medications, and how do you handle a disagreement with a physician about care?`
  ],
  'Landscaper': [
    `How do you plan and price a landscaping job?`,
    `How do you work safely with mowers, trimmers and chemicals?`,
    `Tell me about a project you are proud of.`,
    `How do you handle a client who is unhappy with the result?`,
    `How do you work in hot or wet weather?`,
    `How do you know which plants and materials suit a site?`
  ]
});

window.AIIC_PRACTICAL.push(
  `A client is 40 years old with $50,000 saved and wants to retire at 65. How would you start building their plan?`,
  `A customer hands you $20 for a $13.47 purchase. How much change do you give back?`
);

/* ---------- Internships ----------
   For people with little or no work experience: questions are about interest, knowledge, how they would
   approach things and what they would do in a situation, never about past jobs or real-life experience. */
Object.assign(window.AIIC_ROLE_QUESTIONS, {
  'Software Engineering Intern': [
    `How would you approach debugging a program that crashes with an error message you do not recognize?`,
    `What is the difference between a list and a dictionary in Python, and when would you use each?`,
    `What is version control, and why do software teams use tools like Git?`,
    `If you were asked to add a small feature to a codebase you had never seen, how would you get started?`,
    `What makes code easy for other people to read and maintain?`,
    `How would you test a function that sorts a list of numbers?`
  ],
  'Data Science Intern': [
    `What is the difference between supervised and unsupervised learning, with a simple example of each?`,
    `If a dataset has many missing values, what options would you consider and what are the tradeoffs?`,
    `How would you explain what a model's accuracy means to someone who is not technical?`,
    `Why might a model do well on training data but poorly on new data?`,
    `How would you decide which chart best shows a trend over time?`,
    `If you were asked to predict which customers will cancel a subscription, what data would you want?`
  ],
  'Data Analyst Intern': [
    `How would you check a dataset for errors before you start analyzing it?`,
    `What is the difference between a mean and a median, and when does it matter?`,
    `What does a SQL JOIN do, and why would you use one?`,
    `If your analysis showed something your manager did not expect, how would you present it?`,
    `What makes a dashboard useful rather than cluttered?`,
    `How would you find which product is selling best from a table of sales records?`
  ],
  'Machine Learning Intern': [
    `Explain overfitting in plain language and one way to reduce it.`,
    `How would you decide whether a problem needs machine learning or a simple rule would do?`,
    `Why do we split data into training and test sets?`,
    `If a model's results looked too good to be true, what would you check?`,
    `What do precision and recall measure, and when might you care more about one of them?`,
    `How would you go about learning a new machine learning library quickly?`
  ],
  'Cybersecurity Intern': [
    `What is phishing, and how would you teach a coworker to spot it?`,
    `What is the difference between authentication and authorization?`,
    `If you noticed a coworker's account logging in from another country, what would you do?`,
    `Why are software updates important for security?`,
    `What makes a strong password policy, and what are its limits?`,
    `How would you explain the risk of public Wi-Fi to someone who is not technical?`
  ],
  'IT Intern': [
    `A coworker says their computer is very slow. What steps would you take to find the cause?`,
    `How would you explain what the cloud is to someone who has never used it?`,
    `What would you do if you could not solve a user's problem after trying everything you knew?`,
    `Why is writing down a fix important on an IT team?`,
    `If three people asked for help at the same time, how would you decide who to help first?`,
    `How can you tell whether a problem comes from hardware or from software?`
  ],
  'Product Management Intern': [
    `What do you think a product manager does day to day?`,
    `If you could improve one feature of an app you use, what would it be and why?`,
    `How would you decide which of two features to build first?`,
    `How would you find out what users actually want?`,
    `What numbers might show that a new feature is working?`,
    `If two teammates wanted to build different things, how would you help them decide?`
  ],
  'UX Design Intern': [
    `What is the difference between UX and UI design?`,
    `How would you test whether a new app screen is easy to use?`,
    `Pick an app or website that frustrates you. How would you fix it?`,
    `Why does accessibility matter in design, and what is one way to improve it?`,
    `How would you respond if a teammate disliked your design?`,
    `What would you do to understand users before you design anything?`
  ],
  'Graphic Design Intern': [
    `What makes a logo effective?`,
    `How would you approach a design brief that is vague or unclear?`,
    `Why do consistent colors and fonts matter for a brand?`,
    `How would you handle feedback asking you to change a design you were proud of?`,
    `What is the difference between designing for print and designing for screens?`,
    `Which brand do you think has strong design, and why?`
  ],
  'Marketing Intern': [
    `What makes a marketing campaign successful?`,
    `How would you promote a new product to college students on a small budget?`,
    `What is a target audience, and why does it matter?`,
    `Which brand's marketing do you admire, and why?`,
    `How would you measure whether a social media post worked?`,
    `How would you come up with campaign ideas when you feel stuck?`
  ],
  'Social Media Intern': [
    `What kind of content do you think does well on social media, and why?`,
    `How would you respond to a negative comment on a brand's post?`,
    `How would you plan a week of posts for a new company?`,
    `Which social media numbers matter most, and why?`,
    `If a scheduled post had a mistake after it went live, what would you do?`,
    `How would you keep a brand's voice consistent across different platforms?`
  ],
  'Sales Intern': [
    `What do you think makes someone good at sales?`,
    `How would you respond to a customer who says your product is too expensive?`,
    `How would you prepare before a call with a potential customer?`,
    `What would you do if a lead stopped responding?`,
    `Why is listening important in sales?`,
    `How would you stay motivated after hearing "no" many times in a row?`
  ],
  'Business Analyst Intern': [
    `What is the role of a business analyst on a project team?`,
    `How would you gather requirements from stakeholders who disagree with each other?`,
    `How would you explain a complicated process to someone new to it?`,
    `What would you do if requirements changed halfway through a project?`,
    `How would you decide which problem to solve first?`,
    `What tools, like spreadsheets or diagrams, would you use to map out a process?`
  ],
  'Finance Intern': [
    `If a company's revenue is $100 and grows 10% each year, what is it after three years?`,
    `What is the difference between revenue and profit?`,
    `Why do companies care so much about cash flow?`,
    `How would you explain what a balance sheet shows?`,
    `What would you do if you found an error in a spreadsheet your manager was already using?`,
    `What is happening in the markets or the economy right now that interests you?`
  ],
  'Investment Banking Intern': [
    `What is the difference between enterprise value and equity value?`,
    `Walk me through the basic steps of valuing a company.`,
    `Why might one company want to acquire another?`,
    `How would you handle a task due the next morning when you also have classes and other work?`,
    `Pitch me a company you think is a good investment, and why.`,
    `If you were unsure about a number in a model that was due soon, what would you do?`
  ],
  'Accounting Intern': [
    `If a company has $500 in assets and $200 in liabilities, what is its equity?`,
    `What is the difference between a debit and a credit?`,
    `Why is accuracy so important in accounting?`,
    `If the numbers in two reports did not match, what would you do?`,
    `How would you keep confidential financial information safe?`,
    `What interests you about accounting compared with other areas of business?`
  ],
  'Consulting Intern': [
    `A client's sales have dropped. How would you structure the problem?`,
    `How would you estimate how many coffee shops there are in a large city?`,
    `What would you do if you were given a task with very little guidance?`,
    `How would you present a recommendation to a senior client?`,
    `What makes someone a good team member on a consulting project?`,
    `How would you handle a long week with tight deadlines?`
  ],
  'Human Resources Intern': [
    `Why is confidentiality so important in HR?`,
    `How would you help a new hire feel welcome on their first day?`,
    `What would you do if an employee privately shared a complaint with you?`,
    `What makes a job posting attractive to candidates?`,
    `How would you handle a large pile of resumes for one open role?`,
    `Why do you think company culture matters?`
  ],
  'Operations Intern': [
    `How would you find the bottleneck in a process?`,
    `What would you do if a process were slow and nobody knew why?`,
    `How would you prioritize several urgent tasks?`,
    `Why is writing down a process helpful?`,
    `How would you track whether a change actually made things better?`,
    `What would you do if a supplier's delivery was going to be late?`
  ],
  'Supply Chain Intern': [
    `What is a supply chain, in your own words?`,
    `What might cause a shipment to be delayed, and how could a team plan for it?`,
    `How would you decide how much inventory to keep on hand?`,
    `What data would you look at to find ways to lower shipping costs?`,
    `How would you tell a customer about a delay?`,
    `Why is working with suppliers about more than just price?`
  ],
  'Public Relations Intern': [
    `How would you write a short announcement for a new product?`,
    `What would you do if a company made a mistake and people were upset online?`,
    `Why does trust matter so much in PR?`,
    `How would you build a media list for a small company?`,
    `What makes a story interesting to a journalist?`,
    `How would you measure whether PR work was successful?`
  ],
  'Journalism Intern': [
    `How would you check whether a source or a fact is reliable?`,
    `How would you find a story idea in your own community?`,
    `What would you do if someone refused to talk to you?`,
    `If you discovered an error in a published story, how would you handle it?`,
    `Why does accuracy matter more than being first?`,
    `What makes a headline fair and clear?`
  ],
  'Content Writing Intern': [
    `How would you adapt the same message for a blog post and for a short social post?`,
    `How would you research a topic you know nothing about?`,
    `What makes writing clear and easy to read?`,
    `How would you handle edits that change a lot of your writing?`,
    `How would you come up with article ideas for a new audience?`,
    `What does a consistent brand voice mean?`
  ],
  'Mechanical Engineering Intern': [
    `How would you approach designing a part that has to be strong but light?`,
    `What is the difference between stress and strain?`,
    `If a prototype failed a test, what steps would you take next?`,
    `Why is safety important when designing a product?`,
    `How would you explain a technical drawing to someone new?`,
    `What would you do if the budget were too small for the best material?`
  ],
  'Electrical Engineering Intern': [
    `How would you troubleshoot a circuit that does not work?`,
    `Explain Ohm's law in simple terms.`,
    `What is the difference between AC and DC?`,
    `How would you check a design for safety before building it?`,
    `What would you do if your measurements did not match your calculations?`,
    `Why is documentation important when working on a design?`
  ],
  'Civil Engineering Intern': [
    `What would you think about when planning a small bridge?`,
    `Why are building codes important?`,
    `How would you check that a site is safe before work begins?`,
    `What would you do if conditions on site were different from the plans?`,
    `How would you go about reading a set of plans for the first time?`,
    `Why is working well with contractors and inspectors important?`
  ],
  'Laboratory Research Intern': [
    `How would you design a simple experiment to test a hypothesis?`,
    `Why are control groups important?`,
    `What would you do if your results were not what you expected?`,
    `Why is it important to record every step in a lab notebook?`,
    `How would you follow safety rules when working with chemicals?`,
    `How would you explain your research question to someone outside your field?`
  ],
  'Healthcare Intern': [
    `Why is patient privacy so important?`,
    `How would you help a worried patient or family member feel at ease?`,
    `What would you do if you noticed a patient needed help and no one was nearby?`,
    `Why is teamwork important in a hospital?`,
    `How would you handle seeing something upsetting in a clinical setting?`,
    `What do you hope to learn from watching healthcare professionals at work?`
  ],
  'Legal Intern': [
    `Why is confidentiality important in a law office?`,
    `How would you research a legal question you had never seen before?`,
    `What would you do if you could not find the answer in your research?`,
    `How would you organize the documents for a case?`,
    `Why is attention to detail so important in legal work?`,
    `How would you handle a deadline that moved up unexpectedly?`
  ],
  'Government and Policy Intern': [
    `How would you explain a complex policy to someone with no background in it?`,
    `How would you look for reliable data on a public issue?`,
    `How would you stay neutral on a topic you feel strongly about?`,
    `Why do you think people should trust public institutions, or not?`,
    `What would you do if a member of the public were upset with an office?`,
    `How would you balance competing views when writing a summary?`
  ],
  'Nonprofit Intern': [
    `Why does the mission matter more than profit in a nonprofit?`,
    `How would you help an organization raise awareness on a small budget?`,
    `Why are volunteers important, and how would you thank them?`,
    `What would you do if you saw a way to make a program run better?`,
    `How would you handle working with very limited resources?`,
    `What cause matters most to you, and why?`
  ],
  'Hospitality Management Intern': [
    `How would you handle a guest who is upset about their room?`,
    `What makes a great guest experience?`,
    `How would you prioritize on a busy weekend with a short-staffed team?`,
    `How would you keep standards high when you are tired?`,
    `What would you do if you saw a coworker break a safety rule?`,
    `Why is attention to small details so important in hospitality?`
  ],
  'Retail Management Intern': [
    `How would you handle a customer who wants a refund outside the store policy?`,
    `What makes a store well organized and welcoming?`,
    `How would you motivate a team on a slow day?`,
    `What would you do if inventory counts did not match?`,
    `How would you decide what to put near the front of a store?`,
    `Why is customer loyalty valuable to a retailer?`
  ],
  'Architecture Intern': [
    `What makes a building comfortable to be in?`,
    `How would you balance beauty with budget and safety?`,
    `How would you present a design idea to a client who disagrees with it?`,
    `Why is sustainability becoming more important in architecture?`,
    `What would you do if a client changed the plan late in the design?`,
    `Which building do you admire, and why?`
  ],
  'Video Production Intern': [
    `What would you do to prepare for a shoot?`,
    `How would you handle equipment that stopped working during filming?`,
    `Why is audio so important in video?`,
    `What would you do if you had too much footage and not enough time to edit it?`,
    `How would you take notes from a director you disagreed with?`,
    `What kinds of stories do you enjoy telling on video?`
  ],
  'Event Planning Intern': [
    `What would you do first when planning an event for 100 people?`,
    `How would you handle a vendor who did not show up?`,
    `Why is a backup plan important?`,
    `How would you stay organized with many tasks at once?`,
    `How would you stay on budget when costs go up?`,
    `How would you measure whether an event was a success?`
  ],
  'Game Design Intern': [
    `What makes a game fun to play?`,
    `How would you design a simple tutorial level?`,
    `How would you balance a game that is too easy or too hard?`,
    `What would you do if playtesters did not enjoy a feature you love?`,
    `Which game do you think is well designed, and why?`,
    `How would you describe a game idea to your team in one minute?`
  ],
  'Customer Success Intern': [
    `How would you help a customer who is struggling to use a product?`,
    `Why is listening so important when supporting customers?`,
    `How would you handle a customer who is upset?`,
    `What would you do if you did not know the answer to a customer's question?`,
    `How would you tell a customer about a feature they have not tried?`,
    `What makes a customer likely to stay with a company?`
  ]
});

// Hands-on or calculation questions for interns (typed, no voice).
window.AIIC_PRACTICAL.push(
  `If a company's revenue is $100 and grows 10% each year, what is it after three years?`,
  `If a company has $500 in assets and $200 in liabilities, what is its equity?`,
  `How would you estimate how many coffee shops there are in a large city?`
);
