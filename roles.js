/* =========================================================
   AI Interview Chat — role selection (shown after sign-in)
   Saves the chosen role to sessionStorage, then continues.
   ========================================================= */
(function () {
  'use strict';

  const ROLES = {
    'Technology': ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Mobile Developer', 'DevOps / SRE Engineer', 'Cloud Engineer', 'Cybersecurity Analyst', 'QA / Test Engineer', 'IT Support Specialist', 'Systems Administrator', 'Network Engineer', 'Machine Learning Engineer', 'Data Scientist', 'Data Analyst', 'Data Engineer', 'Database Administrator', 'Solutions Architect', 'Technical Support Engineer', 'Embedded Systems Engineer', 'Game Developer', 'AI Engineer', 'Penetration Tester', 'Technical Writer', 'Business Intelligence Analyst', 'IT Manager', 'Engineering Manager'],
    'Product & Design': ['Product Manager', 'Project Manager', 'Program Manager', 'Scrum Master', 'Business Analyst', 'UX Designer', 'UI Designer', 'Product Designer', 'Graphic Designer', 'UX Researcher', 'Technical Program Manager', 'Product Owner', 'Motion Designer'],
    'Business & Finance': ['Management Consultant', 'Financial Analyst', 'Investment Banking Analyst', 'Accountant', 'Auditor', 'Operations Manager', 'Supply Chain Analyst', 'Business Development', 'Entrepreneur / Founder', 'Executive / General Manager', 'Financial Advisor', 'Risk Analyst', 'Compliance Analyst', 'Bank Teller', 'Loan Officer', 'Insurance Agent', 'Real Estate Agent', 'Procurement Specialist', 'Bookkeeper', 'Logistics Coordinator'],
    'Sales & Marketing': ['Sales Representative', 'Account Executive', 'Account Manager', 'Customer Success Manager', 'Marketing Manager', 'Digital Marketer', 'Content Writer', 'Social Media Manager', 'Public Relations Specialist', 'Brand Manager', 'Sales Development Representative', 'Product Marketing Manager', 'SEO Specialist', 'Event Planner', 'Market Research Analyst'],
    'People & Admin': ['HR Generalist', 'Recruiter', 'Executive Assistant', 'Administrative Assistant', 'Customer Service Representative', 'Receptionist', 'Office Manager', 'Training and Development Specialist', 'Payroll Specialist', 'Project Coordinator'],
    'Healthcare': ['Registered Nurse', 'Physician / Doctor', 'Pharmacist', 'Physical Therapist', 'Medical Assistant', 'Dentist', 'Mental Health Counselor', 'Healthcare Administrator', 'Medical Student (Residency)', 'Nurse Practitioner', 'Occupational Therapist', 'Speech-Language Pathologist', 'Veterinarian', 'Veterinary Technician', 'Nursing Assistant (CNA)', 'Paramedic / EMT', 'Dental Hygienist', 'Radiologic Technologist', 'Medical Coder / Biller', 'Physician Assistant'],
    'Education & Public Service': ['Teacher', 'Professor / Lecturer', 'School Administrator', 'Social Worker', 'Government / Policy Analyst', 'Nonprofit Program Manager', 'Librarian', 'Police Officer', 'Firefighter', 'Military / Veteran Transition', 'School Counselor', 'Teaching Assistant', 'Instructional Designer', 'Early Childhood Educator', 'Tutor', 'Case Manager', 'Fundraising Coordinator'],
    'Law, Engineering & Science': ['Lawyer / Attorney', 'Paralegal', 'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Chemical Engineer', 'Biomedical Engineer', 'Research Scientist', 'Lab Technician', 'Architect', 'Industrial Engineer', 'Environmental Engineer', 'Aerospace Engineer', 'Manufacturing Engineer', 'Biologist', 'Chemist', 'Environmental Scientist', 'Quality Control Inspector'],
    'Creative & Media': ['Video Editor', 'Journalist', 'Copywriter', 'Photographer', 'Game Designer', 'Animator', 'Art Director', 'Illustrator', 'Interior Designer', 'Fashion Designer', 'Podcast Producer', 'Translator / Interpreter'],
    'Hospitality, Retail & Trades': ['Retail Associate', 'Store Manager', 'Restaurant Server', 'Chef / Cook', 'Hotel Front Desk', 'Barista', 'Electrician', 'Plumber', 'Warehouse Associate', 'Delivery Driver', 'Construction Worker', 'Bartender', 'Flight Attendant', 'Cashier', 'Hair Stylist', 'Personal Trainer', 'Auto Mechanic', 'HVAC Technician', 'Welder', 'Carpenter', 'Security Guard', 'Truck Driver', 'Landscaper'],
    'Internships': ['Software Engineering Intern', 'Data Science Intern', 'Data Analyst Intern', 'Machine Learning Intern', 'Cybersecurity Intern', 'IT Intern', 'Product Management Intern', 'UX Design Intern', 'Graphic Design Intern', 'Marketing Intern', 'Social Media Intern', 'Sales Intern', 'Business Analyst Intern', 'Finance Intern', 'Investment Banking Intern', 'Accounting Intern', 'Consulting Intern', 'Human Resources Intern', 'Operations Intern', 'Supply Chain Intern', 'Public Relations Intern', 'Journalism Intern', 'Content Writing Intern', 'Mechanical Engineering Intern', 'Electrical Engineering Intern', 'Civil Engineering Intern', 'Laboratory Research Intern', 'Healthcare Intern', 'Legal Intern', 'Government and Policy Intern', 'Nonprofit Intern', 'Hospitality Management Intern', 'Retail Management Intern', 'Architecture Intern', 'Video Production Intern', 'Event Planning Intern', 'Game Design Intern', 'Customer Success Intern', 'Web Development Intern', 'Mobile App Development Intern', 'Cloud Computing Intern', 'Quality Assurance Intern', 'AI Research Intern', 'Robotics Intern', 'Hardware Engineering Intern', 'Aerospace Engineering Intern', 'Chemical Engineering Intern', 'Biomedical Engineering Intern', 'Industrial Engineering Intern', 'Environmental Science Intern', 'Chemistry Intern', 'Biomedical Research Intern', 'Pharmacy Intern', 'Nursing Intern', 'Physical Therapy Intern', 'Public Health Intern', 'Veterinary Intern', 'Psychology Research Intern', 'Teaching Intern', 'Social Work Intern', 'Museum Intern', 'Fashion Design Intern', 'Interior Design Intern', 'Photography Intern', 'Podcast and Radio Intern', 'Sports Management Intern', 'Real Estate Intern', 'Insurance Intern', 'Banking Intern', 'Risk and Compliance Intern', 'Financial Planning Intern', 'Audit and Tax Intern', 'Recruiting Intern', 'Brand Management Intern', 'Market Research Intern', 'Digital Marketing Intern', 'E-commerce Intern', 'Communications Intern', 'Fundraising Intern', 'Political Campaign Intern', 'Urban Planning Intern', 'Sustainability Intern', 'Agriculture Intern', 'Logistics Intern', 'Procurement Intern', 'Animation Intern', 'UX Research Intern', 'Technical Writing Intern']
  };

  let user = null;
  try { user = JSON.parse(localStorage.getItem('aiic_user')); } catch (e) {}
  if (!user) { window.location.replace('login.html'); return; }

  const hi = document.getElementById('roleHello');
  if (hi) hi.textContent = 'Hi ' + String(user.name || user.email || '').split(' ')[0] + ' — ';
  const lastEl = document.getElementById('roleLast');
  AIIC_STORE.getHistory(user).then(function (list) {
    const last = list.sort((a, b) => b.date - a.date)[0];
    if (last && lastEl) {
      lastEl.textContent = 'Last practiced: ' + last.role;
      lastEl.classList.remove('hidden');
    }
  });

  const grid = document.getElementById('roleGrid');
  const search = document.getElementById('roleSearch');
  const empty = document.getElementById('roleEmpty');
  const otherForm = document.getElementById('otherForm');
  const otherInput = document.getElementById('otherInput');

  function choose(role) {
    try { sessionStorage.setItem('aiic_role', role); sessionStorage.removeItem('aiic_assessment'); } catch (e) {}
    window.location.href = 'interview.html';
  }

  Object.keys(ROLES).forEach(function (cat) {
    const sec = document.createElement('section');
    sec.className = 'role-cat';
    const h = document.createElement('h2');
    h.className = 'role-cat-title mono small';
    h.textContent = cat;
    const list = document.createElement('div');
    list.className = 'role-list';
    ROLES[cat].forEach(function (r) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'role-chip';
      b.textContent = r;
      b.addEventListener('click', function () { choose(r); });
      list.appendChild(b);
    });
    sec.append(h, list);
    grid.appendChild(sec);
  });

  search.addEventListener('input', function () {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    grid.querySelectorAll('.role-cat').forEach(function (sec) {
      let any = false;
      sec.querySelectorAll('.role-chip').forEach(function (c) {
        const m = !q || c.textContent.toLowerCase().indexOf(q) !== -1;
        c.classList.toggle('hidden', !m);
        if (m) { any = true; shown++; }
      });
      sec.classList.toggle('hidden', !any);
    });
    empty.classList.toggle('hidden', shown > 0);
  });

  otherForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const v = otherInput.value.trim();
    if (v) choose(v);
  });
})();
