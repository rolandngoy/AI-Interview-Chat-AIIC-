/* =========================================================
   AI Interview Chat — the interview room
   2D puppet animation for the two interviewers: a mouth that opens and closes
   while they talk, plus breathing, sway, head nods and a listening nod.
   Driven by AIIC_STAGE.setSpeaking(id, on) and AIIC_STAGE.pulse(id).
   Roland's mouth is a shape drawn over his lips. Makenzie already smiles with teeth, so her lower
   lip and teeth are warped downward on a canvas, with a dark gap opening between the teeth rows.
   ========================================================= */
(function () {
  'use strict';

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const JAW_DROP = 8;                         // how far the lower jaw drops at full open, in source pixels
  const seats = {};
  let caption = null, last = 0;

  const smooth = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };

  function init() {
    caption = document.getElementById('stageCaption');
    document.querySelectorAll('[data-seat]').forEach(function (el) {
      const s = {
        el: el, fig: el.querySelector('.figure'), mouth: el.querySelector('.mouth'), jawCanvas: el.querySelector('.jaw-canvas'),
        speaking: false, open: 0, phase: Math.random() * 6, pulse: 0, seed: Math.random() * 100, jaw: null
      };
      seats[el.dataset.seat] = s;
      if (s.jawCanvas) loadJaw(s);
    });
    if (!reduce) requestAnimationFrame(loop);
  }

  // Copies the mouth area of the picture so it can be re-drawn with the lower jaw moved.
  function loadJaw(s) {
    const c = s.jawCanvas, img = new Image();
    img.onload = function () {
      try {
        const w = c.width, h = c.height, x0 = +c.dataset.x, y0 = +c.dataset.y;
        const off = document.createElement('canvas'); off.width = w; off.height = h;
        const octx = off.getContext('2d');
        octx.drawImage(img, x0, y0, w, h, 0, 0, w, h);
        // The bottom edge of the upper teeth, as points left to right. Above it nothing moves; below it the jaw does.
        const pts = c.dataset.edge.trim().split(/\s+/).map((p) => p.split(',').map(Number));
        const edgeY = new Float32Array(w);
        for (let xx = 0; xx < w; xx++) {
          const X = x0 + xx;
          let k = 0;
          while (k < pts.length - 2 && X > pts[k + 1][0]) k++;
          const a = pts[k], b = pts[k + 1], u = Math.max(0, Math.min(1, (X - a[0]) / (b[0] - a[0])));
          edgeY[xx] = a[1] + (b[1] - a[1]) * u;
        }
        s.jaw = {
          w: w, h: h, x0: x0, y0: y0, src: octx.getImageData(0, 0, w, h), ctx: c.getContext('2d'),
          out: c.getContext('2d').createImageData(w, h), edgeY: edgeY, lx: pts[0][0], rx: pts[pts.length - 1][0]
        };
      } catch (e) { s.jaw = null; }
    };
    img.src = c.dataset.src;
  }

  // Everything above the line between the upper and lower teeth stays put. Below it the picture slides down,
  // most near the line and fading to nothing by the chin, and the space this opens up is a dark mouth interior.
  function drawJaw(s, open) {
    const j = s.jaw;
    if (!j) return;
    const src = j.src.data, out = j.out.data, w = j.w, h = j.h;
    const shift = open * JAW_DROP;
    for (let yy = 0; yy < h; yy++) {
      const Y = j.y0 + yy;
      for (let xx = 0; xx < w; xx++) {
        const X = j.x0 + xx, o = (yy * w + xx) * 4;
        const yline = j.edgeY[xx], t = Y - yline;
        let sy = Y, gap = 0;
        if (t >= 0) {
          const wx = smooth((X - j.lx + 6) / 22) * smooth((j.rx + 6 - X) / 22);      // corners of the mouth barely move
          const wy = t <= 14 ? 1 : 1 - smooth((t - 14) / 34);                          // fades out toward the chin
          sy = Y - shift * wx * wy;
          if (sy < yline) gap = yline - sy;       // how far the jaw has pulled away from the upper teeth
        }
        {
          const fy = sy - j.y0, y1 = Math.max(0, Math.min(h - 1, Math.floor(fy))), y2 = Math.min(h - 1, y1 + 1), f = Math.max(0, Math.min(1, fy - y1));
          const a = (y1 * w + xx) * 4, b = (y2 * w + xx) * 4;
          out[o] = src[a] + (src[b] - src[a]) * f; out[o + 1] = src[a + 1] + (src[b + 1] - src[a + 1]) * f;
          out[o + 2] = src[a + 2] + (src[b + 2] - src[a + 2]) * f; out[o + 3] = 255;
          if (gap > 0) {                                  // fill the opening with a dark mouth interior, soft at the edges
            const k = Math.min(1, gap / 1.5), depth = Math.min(1, gap / 8);
            out[o] += (62 - 30 * depth - out[o]) * k; out[o + 1] += (17 - 8 * depth - out[o + 1]) * k; out[o + 2] += (21 - 10 * depth - out[o + 2]) * k;
          }
        }
      }
    }
    j.ctx.putImageData(j.out, 0, 0);
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
      if (s.mouth) {
        s.mouth.style.opacity = o > 0.05 ? '1' : '0';
        s.mouth.style.transform = 'translate(-50%,-50%) rotate(' + (s.mouth.dataset.tilt || 0) + 'deg) scale(' + (1 + o * 0.1) + ',' + o.toFixed(3) + ')';
      }
      if (s.jawCanvas && s.jaw) {
        const show = o > 0.03;
        s.jawCanvas.style.opacity = show ? '1' : '0';          // closed: the picture underneath shows
        if (show) drawJaw(s, o);
      }

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
