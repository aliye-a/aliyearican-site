/* Dil anahtarı: bulunduğun dizine göre diğer dile götürür */
(function(){
  const seg = (location.pathname.split('/')[1]||'en').toLowerCase();
  const other = seg === 'en' ? 'tr' : 'en';
  document.querySelectorAll('[data-lang-switch]').forEach(a=>{
    a.textContent = other.toUpperCase();
    a.href = `/${other}/`;
  });
})();

/* Scroll reveal */
(function(){
  const els = document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in')); return; }
  const io = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.15});
  els.forEach(e=>io.observe(e));
})();

/* Basit parallax: data-parallax="0.6" gibi */
// istek: parallax gücü biraz daha yüksek (56→60 ~= 0.6)
(function(){
  const nodes = Array.from(document.querySelectorAll('[data-parallax]'));
  if(!nodes.length) return;
  const speed = el => Number(el.getAttribute('data-parallax')||'0.6');
  const run = ()=>{
    const sy = window.scrollY;
    nodes.forEach(el=>{
      const rect = el.getBoundingClientRect();
      const amt = (sy + rect.top) * -0.08 * speed(el);
      el.style.transform = `translateY(${amt.toFixed(1)}px)`;
    });
  };
  run(); window.addEventListener('scroll', run, {passive:true});
})();
