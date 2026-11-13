/* =========================================================
   AI Interview Chat — the interview room
   2D puppet animation for the two interviewers: a mouth that opens and closes
   while they talk, plus breathing, sway, head nods and a listening nod.
   Driven by AIIC_STAGE.setSpeaking(id, on) and AIIC_STAGE.pulse(id).
   ========================================================= */
(function () {
  'use strict';

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seats = {};
  let caption = null, last = 0;

  function init() {
    caption = document.getElementById('stageCaption');
    document.querySelectorAll('[data-seat]').forEach(function (el) {
      seats[el.dataset.seat] = {
        el: el, fig: el.querySelector('.figure'), mouth: el.querySelector('.mouth'),
        speaking: false, open: 0, phase: Math.random() * 6, pulse: 0, seed: Math.random() * 100
      };
    });
    if (!reduce) requestAnimationFrame(loop);
  }

  function loop(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;
    const ids = Object.keys(seats);
    const anySpeaking = ids.some((id) => seats[id].speaking);
    ids.forEach(function (id) {
      const s = seats[id];

      // Mouth: a syllable-like rhythm with some irregularity, plus a bump on each spoken word.
      let target = 0;
      if (s.speaking) {
        s.phase += dt * (9 + 3 * Math.sin(t / 430 + s.seed));
        const syllable = Math.abs(Math.sin(s.phase));
        target = Math.min(1, 0.16 + 0.6 * syllable * (0.7 + 0.3 * Math.sin(t / 190 + s.seed * 2)) + s.pulse);
      }
      s.pulse = Math.max(0, s.pulse - dt * 4);
      s.open += (target - s.open) * Math.min(1, dt * 22);
      const o = s.open;
      s.mouth.style.opacity = o > 0.05 ? '1' : '0';
      s.mouth.style.transform = 'translate(-50%,-50%) rotate(' + (s.mouth.dataset.tilt || 0) + 'deg) scale(' + (1 + o * 0.1) + ',' + o.toFixed(3) + ')';

      // Body: breathing and a slow sway; a head bob while talking; a small nod while listening.
      const breathe = Math.sin(t / 1500 + s.seed), sway = Math.sin(t / 2600 + s.seed * 1.7);
      let ty = breathe * 1.6, rot = sway * 0.18;
      const scale = 1 + breathe * 0.0025;
      if (s.speaking) {
        ty += Math.sin(s.phase * 0.5) * 1.5 - o * 1.0;
        rot += Math.sin(s.phase * 0.35) * 0.45;
      } else if (anySpeaking) {
        rot += Math.sin(t / 900 + s.seed) * 0.22;
        ty += Math.max(0, Math.sin(t / 1300 + s.seed)) * 1.2;
      }
      s.fig.style.transform = 'translate3d(0,' + ty.toFixed(2) + 'px,0) rotate(' + rot.toFixed(3) + 'deg) scale(' + scale.toFixed(4) + ')';
    });
    requestAnimationFrame(loop);
  }

  window.AIIC_STAGE = {
    setSpeaking: function (id, on) {
      const s = seats[id];
      if (!s) return;
      s.speaking = on;
      s.el.classList.toggle('is-speaking', on);
      const tag = document.querySelector('[data-tag="' + id + '"]');
      if (tag) tag.classList.toggle('is-speaking', on);
      if (!on) s.pulse = 0;
    },
    pulse: function (id) { if (seats[id]) seats[id].pulse = 0.5; },
    setCaption: function (name, text) {
      if (!caption) return;
      caption.replaceChildren();
      if (!text) { caption.classList.add('hidden'); return; }
      const who = document.createElement('strong'); who.textContent = name + ': ';
      caption.append(who, document.createTextNode(text));
      caption.classList.remove('hidden');
    },
    startOverlay: function (visible) {
      const el = document.getElementById('stageStart');
      if (el) el.classList.toggle('hidden', !visible);
    }
  };
  init();
})();
