/* =========================================================
   AI Interview Chat — role selection (shown after sign-in)
   Saves the chosen role to sessionStorage, then continues.
   ========================================================= */
(function () {
  'use strict';

  const ROLES = {
    'Technology': ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Mobile Developer', 'DevOps / SRE Engineer', 'Cloud Engineer', 'Cybersecurity Analyst', 'QA / Test Engineer', 'IT Support Specialist', 'Systems Administrator', 'Network Engineer', 'Machine Learning Engineer', 'Data Scientist', 'Data Analyst', 'Data Engineer', 'Database Administrator'],
    'Product & Design': ['Product Manager', 'Project Manager', 'Program Manager', 'Scrum Master', 'Business Analyst', 'UX Designer', 'UI Designer', 'Product Designer', 'Graphic Designer', 'UX Researcher'],
    'Business & Finance': ['Management Consultant', 'Financial Analyst', 'Investment Banking Analyst', 'Accountant', 'Auditor', 'Operations Manager', 'Supply Chain Analyst', 'Business Development', 'Entrepreneur / Founder', 'Executive / General Manager'],
    'Sales & Marketing': ['Sales Representative', 'Account Executive', 'Account Manager', 'Customer Success Manager', 'Marketing Manager', 'Digital Marketer', 'Content Writer', 'Social Media Manager', 'Public Relations Specialist', 'Brand Manager'],
    'People & Admin': ['HR Generalist', 'Recruiter', 'Executive Assistant', 'Administrative Assistant', 'Customer Service Representative', 'Receptionist', 'Office Manager'],
    'Healthcare': ['Registered Nurse', 'Physician / Doctor', 'Pharmacist', 'Physical Therapist', 'Medical Assistant', 'Dentist', 'Mental Health Counselor', 'Healthcare Administrator', 'Medical Student (Residency)'],
    'Education & Public Service': ['Teacher', 'Professor / Lecturer', 'School Administrator', 'Social Worker', 'Government / Policy Analyst', 'Nonprofit Program Manager', 'Librarian', 'Police Officer', 'Firefighter', 'Military / Veteran Transition'],
    'Law, Engineering & Science': ['Lawyer / Attorney', 'Paralegal', 'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Chemical Engineer', 'Biomedical Engineer', 'Research Scientist', 'Lab Technician', 'Architect'],
    'Creative & Media': ['Video Editor', 'Journalist', 'Copywriter', 'Photographer', 'Game Designer', 'Animator'],
    'Hospitality, Retail & Trades': ['Retail Associate', 'Store Manager', 'Restaurant Server', 'Chef / Cook', 'Hotel Front Desk', 'Barista', 'Electrician', 'Plumber', 'Warehouse Associate', 'Delivery Driver', 'Construction Worker']
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
    try { sessionStorage.setItem('aiic_role', role); } catch (e) {}
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
