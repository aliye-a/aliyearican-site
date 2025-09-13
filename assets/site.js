/* helpers */
const $ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* Scroll-reveal */
(() => {
  const io = new IntersectionObserver((es)=>{
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }});
  }, {rootMargin:'0px 0px -10% 0px', threshold:0.15});
  $('.rv').forEach(el => io.observe(el));
})();

/* Parallax (hafif) */
(() => {
  const els = $('[data-parallax]');
  if (!els.length) return;
  const loop = () => {
    const h = innerHeight;
    els.forEach(el=>{
      const k = Number(el.dataset.parallax || 0.6);
      const r = el.getBoundingClientRect();
      const y = (r.top - h*0.5) * (k*0.15);
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
  const target = isTR ? p.replace('/tr/','/en/') : p.replace('/en/','/tr/');
  a.href = target;
})();

/* Menü aktif durumu */
(() => {
  const p = location.pathname.replace(/\/$/,'');
  $('.menu a[data-page]').forEach(a=>{
    const key = a.dataset.page;
    if (p === key || p.startsWith(key+'/')) a.classList.add('active');
  });
})();
