(function () {
  // ----- Helpers -----
  const qs = (s) => document.querySelector(s);
  const setText = (sel, txt) => { const n = qs(sel); if (n) n.textContent = txt; };
  const show = (sel, on) => { const n = qs(sel); if (n) n.classList.toggle("hide", !on); };

  const SECTIONS = ["alarch", "alart", "allog", "alo"];

  // Dil tespiti: /tr/... ise TR; aksi halde EN
  const segs = location.pathname.replace(/\/+$/,'/').split('/').filter(Boolean);
  let lang = (segs[0] === 'tr') ? 'tr' : 'en';

  // Bölüm tespiti: öncelik hash (#alarch). Yoksa varsayılan alarch.
  function readSection() {
    let s = (location.hash || '#alarch').slice(1).toLowerCase();
    if (s === 'alog') s = 'allog';
    if (!SECTIONS.includes(s)) s = 'alarch';
    return s;
  }
  let section = readSection();

  // Link üreticiler: hash tabanlı (fiziksel klasör gerekmez)
  const linkFor = (sec) => `#${sec}`;
  const langLink = (target) => {
    const h = location.hash || `#${section}`;
    return (target === 'tr' ? '/tr/' : '/en/') + h;
  };

  // Başlık yedeği
  function titleFallback(sec, L) {
    const map = {
      en: { alarch: "Architecture", alart: "Art", allog: "Log", alo: "Alo" },
      tr: { alarch: "Mimarlık",     alart: "Sanat", allog: "Günlük", alo: "Alo" }
    };
    return (map[L] || map.en)[sec] || sec.toUpperCase();
  }

  // İçeriği yükle (tek sefer)
  let CONTENT = null;
  function ensureContent() {
    if (CONTENT) return Promise.resolve(CONTENT);
    return fetch('assets/content.json?ts=' + Date.now())
      .then(r => r.ok ? r.json() : Promise.reject(new Error('content.json not found')))
      .then(j => (CONTENT = j));
  }

  // UI kurulum (nav/dil)
  function renderChrome() {
    const nav = qs('#js-nav'); if (nav) {
      nav.innerHTML = '';
      SECTIONS.forEach(sec => {
        const a = document.createElement('a');
        a.href = linkFor(sec);
        a.textContent = sec.toUpperCase();
        if (sec === section) a.classList.add('active');
        nav.appendChild(a);
      });
    }
    const lw = qs('#js-lang'); if (lw) {
      lw.innerHTML = '';
      ["en","tr"].forEach(L=>{
        const a = document.createElement('a');
        a.href = langLink(L);
        a.textContent = L.toUpperCase();
        if (L === lang) a.classList.add('on');
        lw.appendChild(a);
      });
    }
  }

  // İçerik çiz
  function renderContent() {
    if (!CONTENT) return;
    const site = CONTENT._site || {};
    setText('#js-brand', site.brand || 'AL');

    const data = (CONTENT[lang] && CONTENT[lang][section]) || {};
    setText('#js-title', data.title || titleFallback(section, lang));

    const sub = data.subtitle || '';
    setText('#js-sub', sub); show('#js-sub', !!sub);

    const rt = qs('#js-rich');
    if (rt) { rt.innerHTML = data.text || ''; show('#js-rich', !!data.text); }

    // Quick links
    const ql = site.quick_links || [];
    const qWrap = qs('#js-quick');
    if (qWrap) {
      qWrap.innerHTML = '';
      ql.forEach(it => {
        const a = document.createElement('a');
        a.href = it.href; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = it.label;
        qWrap.appendChild(a);
      });
    }

    // Sol alt not
    setText('#js-note', lang === 'tr' ? (site.note_tr || '') : (site.note_en || ''));

    // Galeri / projeler
    const list = data.projects || data.gallery || [];
    const grid = qs('#js-grid');
    if (grid) {
      grid.innerHTML = '';
      if (list.length) {
        show('#js-grid', true);
        list.forEach(item => {
          const fig = document.createElement('figure'); fig.className = 'card';
          const box = document.createElement('div'); box.className = 'lb';
          let media;
          if ((item.type || 'image') === 'video') {
            media = document.createElement('video');
            media.src = item.src; media.autoplay = true; media.muted = true; media.loop = true;
            media.addEventListener('mouseover', () => media.pause());
            media.addEventListener('mouseout', () => media.play());
          } else {
            media = document.createElement('img');
            media.src = item.src; media.alt = item.alt || '';
          }
          box.appendChild(media); fig.appendChild(box);
          if (item.caption) {
            const c = document.createElement('figcaption'); c.className = 'cap'; c.textContent = item.caption;
            fig.appendChild(c);
          }
          grid.appendChild(fig);
        });
      } else {
        show('#js-grid', false);
      }
    }

    // Reklam/duyuru (isteğe bağlı)
    const adBox = qs('#js-ad');
    if (adBox) {
      const ad = site.ad && site.ad.enabled ? site.ad.html : '';
      if (ad) { adBox.innerHTML = ad; show('#js-ad', true); } else { show('#js-ad', false); }
    }
  }

  // İlk kurulum
  renderChrome();
  ensureContent()
    .then(() => renderContent())
    .catch(err => {
      console.warn(err);
      setText('#js-title', titleFallback(section, lang));
      const rt = qs('#js-rich');
      if (rt) { rt.innerHTML = '<p style="color:#888;font-size:12px">assets/content.json yüklenemedi.</p>'; show('#js-rich', true); }
    });

  // Hash değişince bölüm değişsin
  window.addEventListener('hashchange', () => {
    section = readSection();
    renderChrome();
    renderContent();
  });

})();
