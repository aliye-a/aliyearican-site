// === Reveal ===
const io = new IntersectionObserver((entries)=>{
  for (const e of entries){
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  }
},{ threshold:.15 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// === Basit parallax ===
// data-parallax="60" gibi bir değer ver (T01: 60)
function onScroll(){
  const y = window.scrollY;
  document.querySelectorAll('[data-parallax]').forEach(el=>{
    const speed = +el.getAttribute('data-parallax') || 0;       // 0–100
    const travel = (y * speed) / 1000;                          // hissiyat ayarı
    el.style.transform = `translateY(${travel}rem)`;
  });
}
addEventListener('scroll', onScroll, {passive:true});
onScroll();
