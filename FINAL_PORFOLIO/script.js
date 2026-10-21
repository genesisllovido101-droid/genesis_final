(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var ash = document.getElementById('ash'), fx = document.getElementById('fx');
  var actx = ash.getContext('2d'), fctx = fx.getContext('2d');
  var W = 0, H = 0, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    [ash, fx].forEach(function (c) {
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      c.style.width = W + 'px'; c.style.height = H + 'px';
    });
    actx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  /* falling petals and ash */
  var count = W < 600 ? 26 : 52;
  var petals = [];
  function mkPetal(initial) {
    var red = Math.random() < 0.55;
    return {
      x: Math.random() * W, y: initial ? Math.random() * H : -20,
      r: red ? 7 + Math.random() * 9 : 1.5 + Math.random() * 2.5,
      vy: 0.35 + Math.random() * 0.9, sway: 20 + Math.random() * 40, ph: Math.random() * 6.28,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.02, red: red, a: 0.25 + Math.random() * 0.45
    };
  }
  for (var i = 0; i < count; i++) petals.push(mkPetal(true));

  function drawPetals(t) {
    actx.clearRect(0, 0, W, H);
    petals.forEach(function (p) {
      var x = p.x + Math.sin(t / 1400 + p.ph) * p.sway;
      actx.save();
      actx.translate(x, p.y); actx.rotate(p.rot);
      actx.globalAlpha = p.a;
      if (p.red) {
        actx.fillStyle = '#c1121f';
        actx.beginPath();
        actx.moveTo(0, -p.r);
        actx.quadraticCurveTo(p.r * 0.55, 0, 0, p.r);
        actx.quadraticCurveTo(-p.r * 0.55, 0, 0, -p.r);
        actx.fill();
      } else {
        actx.fillStyle = '#9a97a1';
        actx.beginPath(); actx.arc(0, 0, p.r, 0, 6.283); actx.fill();
      }
      actx.restore();
    });
  }
  function stepPetals() {
    petals.forEach(function (p, i) {
      p.y += p.vy; p.rot += p.vr;
      if (p.y > H + 24) petals[i] = mkPetal(false);
    });
  }

  /* cursor, drops, splatter */
  var eye = document.getElementById('eye'), iris = document.getElementById('iris');
  var drops = [];
  var mx = -100, my = -100, ex = -100, ey = -100, lastDrop = { x: 0, y: 0 }, seen = false;

  if (fine) {
    document.documentElement.classList.add('gc');
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      mx = e.clientX; my = e.clientY;
      if (!seen) { seen = true; ex = mx; ey = my; eye.classList.add('on'); lastDrop = { x: mx, y: my }; }
      var dx = mx - lastDrop.x, dy = my - lastDrop.y;
      if (!reduce && dx * dx + dy * dy > 220) {
        lastDrop = { x: mx, y: my };
        drops.push({ x: mx + (Math.random() - 0.5) * 6, y: my + 8, vx: (Math.random() - 0.5) * 0.8, vy: Math.random() * 0.6, life: 1, r: 1.5 + Math.random() * 2.2 });
      }
      var t = e.target;
      eye.classList.toggle('hot', !!(t && t.closest && t.closest('a, button, input, textarea, label, [data-hot]')));
    });
    document.addEventListener('mouseleave', function () { eye.classList.remove('on'); });
    document.addEventListener('mouseenter', function () { if (seen) eye.classList.add('on'); });
    window.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      eye.classList.remove('blink'); void eye.offsetWidth; eye.classList.add('blink');
      if (reduce) return;
      for (var i = 0; i < 18; i++) {
        var a = Math.random() * 6.283, s = 2 + Math.random() * 5;
        drops.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 1, r: 1.5 + Math.random() * 3 });
      }
    });
  }

  function stepFx() {
    fctx.clearRect(0, 0, W, H);
    for (var i = drops.length - 1; i >= 0; i--) {
      var d = drops[i];
      d.vy += 0.22; d.vx *= 0.98; d.x += d.vx; d.y += d.vy; d.life -= 0.018;
      if (d.life <= 0 || d.y > H + 10) { drops.splice(i, 1); continue; }
      fctx.globalAlpha = Math.max(d.life, 0);
      fctx.fillStyle = '#c1121f';
      fctx.beginPath(); fctx.arc(d.x, d.y, d.r * (0.6 + d.life * 0.4), 0, 6.283); fctx.fill();
    }
    fctx.globalAlpha = 1;
    if (fine && seen) {
      ex += (mx - ex) * 0.25; ey += (my - ey) * 0.25;
      eye.style.transform = 'translate(' + ex + 'px,' + ey + 'px) translate(-50%,-50%)';
      var ox = Math.max(-5, Math.min(5, (mx - ex) * 0.5)), oy = Math.max(-3, Math.min(3, (my - ey) * 0.5));
      iris.setAttribute('transform', 'translate(' + ox.toFixed(2) + ' ' + oy.toFixed(2) + ')');
    }
  }

  if (reduce) {
    drawPetals(0);
  }
  function loop(t) {
    if (!reduce) { stepPetals(); drawPetals(t); }
    stepFx();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* typed roles */
  var roles = ['web developer', 'gym grinder', 'night runner', 'anime fan', 'future ghoul slayer'];
  var typed = document.getElementById('typed');
  if (!reduce) {
    var ri = 0, ci = roles[0].length, del = true;
    (function tick() {
      var word = roles[ri], wait = 70;
      if (del) {
        ci--; wait = 40;
        if (ci <= 0) { del = false; ri = (ri + 1) % roles.length; ci = 0; wait = 300; }
      } else {
        ci++;
        if (ci >= roles[ri].length) { del = true; wait = 1700; }
      }
      typed.textContent = roles[ri].slice(0, ci);
      setTimeout(tick, wait);
    })();
  }

  /* reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* nav highlight */
  var links = document.querySelectorAll('[data-spy]');
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section').forEach(function (s) { so.observe(s); });
  }

  /* photo preview */
  var photo = document.getElementById('photo'), img = document.getElementById('avatarImg'), art = document.getElementById('avatarArt');
  document.getElementById('photoBtn').addEventListener('click', function () { photo.click(); });
  photo.addEventListener('change', function () {
    var f = photo.files && photo.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () { img.src = r.result; img.hidden = false; art.hidden = true; };
    r.readAsDataURL(f);
  });

  /* project viewer */
  var data = {
    lora: {
      kind: 'Hardware + Software',
      title: 'LoRa Professor Indoor Location Tracking and Classroom Monitoring System',
      intro: 'A radio frequency system that tracks where a professor is inside the building and lets staff monitor the classroom from one app.',
      flow: ['Login', 'Main', 'Attendance', 'Monitoring', 'History'],
      points: ['Indoor location tracking of the professor using LoRa radio frequency', 'Classroom monitoring page for live status', 'Attendance page for recording who is present', 'History page with tables for past records'],
      tags: ['LoRa', 'RF', 'Attendance', 'Monitoring']
    },
    portfolio: {
      kind: 'Web',
      title: 'Tokyo Ghoul Portfolio',
      intro: 'This personal site, built with plain HTML, CSS and JavaScript and themed around Tokyo Ghoul.',
      flow: ['Home', 'About', 'Skills', 'Projects', 'Contact'],
      points: ['Kakugan eye cursor that follows the mouse, drips blood and splatters on click', 'Glitching title, typing roles and a drifting petal canvas', 'Scroll reveals, animated skill bars and hover effects', 'Responsive layout that works on phones'],
      tags: ['HTML', 'CSS', 'JavaScript', 'Canvas']
    }
  };
  var modal = document.getElementById('modal'), pBody = document.getElementById('pBody'), pClose = document.getElementById('pClose');
  var lastFocus = null;
  function li(items, cls) {
    return items.map(function (t) { return '<li>' + t + '</li>'; }).join('');
  }
  function openProject(id) {
    var p = data[id]; if (!p) return;
    lastFocus = document.activeElement;
    document.getElementById('pKind').textContent = p.kind;
    document.getElementById('pTitle').textContent = p.title;
    pBody.innerHTML = '<p>' + p.intro + '</p>' +
      '<h4>' + (id === 'lora' ? 'App flow' : 'Page flow') + '</h4><ol class="flow">' + li(p.flow) + '</ol>' +
      '<h4>What it does</h4><ul class="pts">' + li(p.points) + '</ul>' +
      '<ul class="tags">' + li(p.tags) + '</ul>';
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    pClose.focus();
  }
  function closeProject() {
    modal.hidden = true;
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('.project.viewable').forEach(function (card) {
    card.addEventListener('click', function () { openProject(card.getAttribute('data-project')); });
  });
  pClose.addEventListener('click', closeProject);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeProject(); });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeProject();
    if (e.key === 'Tab') { e.preventDefault(); pClose.focus(); }
  });

  /* contact */
  var note = document.getElementById('copyNote');
  document.getElementById('copyMail').addEventListener('click', function () {
    var el = document.getElementById('mailText'), txt = el.textContent;
    function fallback() {
      var s = window.getSelection(), rg = document.createRange();
      rg.selectNodeContents(el); s.removeAllRanges(); s.addRange(rg);
      note.textContent = 'Address selected. Copy it with your keyboard.';
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { note.textContent = 'Email copied.'; }, fallback);
    } else { fallback(); }
  });
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var st = document.getElementById('status');
    var n = document.getElementById('name'), m = document.getElementById('email'), g = document.getElementById('msg');
    if (!n.value.trim() || !m.value.trim() || !g.value.trim()) { st.textContent = 'Fill in your name, email and message first.'; return; }
    if (!/^\S+@\S+\.\S+$/.test(m.value.trim())) { st.textContent = 'That email address does not look right.'; return; }
    st.textContent = 'Form preview only. It is not connected to an inbox yet, so nothing was sent.';
  });
})();