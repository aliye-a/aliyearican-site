/* Aliye — Visual portfolio site helpers (V7.1 clean) */

/* basit yardımcılar */
const $ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

/* Scroll-reveal */
(() => {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if (e.isIntersecting) {
      e.target.classList.add('in'); io.unobserve(e.target);
    }});
  }, {rootMargin:'0px 0px -10% 0px', threshold:0.15});
  $('.rv').forEach(el => io.observe(el));
})();

/* Parallax (hafif) */
(() => {
  const els = $('[data-parallax]');
  if (!els.length) return;
  const loop = () => {
    const h = window.innerHeight;
    els.forEach(el=>{
      const k = Number(el.dataset.parallax || 0.6); /* 0.6 default */
      const r = el.getBoundingClientRect();
      const y = (r.top - h*0.5) * (k*0.15);          /* yumuşak */
      el.style.transform = `translateY(${y.toFixed(1)}px)`;
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();

/* Dil anahtarı: /en/ <-> /tr/ */
(() => {
  const a = document.querySelector('[data-lang-switch]');
  if (!a) return;
  const p = location.pathname;
  const isTR = p.startsWith('/tr/');
  a.textContent = isTR ? 'EN' : 'TR';
  a.href = isTR ? p.replace('/tr/','/en/') : p.replace('/en/','/tr/');
  a.addEventListener('click', e => {
    e.preventDefault();
    location.href = a.href;
  });
})();
