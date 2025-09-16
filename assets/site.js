(function(){
  // -------- helpers --------
  const qs = s => document.querySelector(s);
  const setText = (sel, txt) => { const n = qs(sel); if (n) n.textContent = txt; };
  const show = (sel, on) => { const n = qs(sel); if (n) n.classList.toggle('hide', !on); };

  const SECTIONS = ['alarch','alart','allog','alo'];

  // -------- path → lang/section --------
  const path = location.pathname.replace(/\/+$/,'/');        // /en/alo/ → "/en/alo/"
  const segs = path.split('/').filter(Boolean);              // ["en","alo"]
  let lang = 'en', section = 'alarch';

  if (segs.length === 0) { lang = 'en'; section = 'alarch'; }
  else if (segs.length === 1 && (segs[0]==='en' || segs[0]==='tr')) { lang = segs[0]; section = 'alarch'; }
  else if (segs.length >= 2) { lang = (segs[0]==='tr') ? 'tr' : 'en'; section = segs[1].toLowerCase(); }

  if (section === 'alog') section = 'allog';                 // eski linkleri koru
  if (!SECTIONS.includes(section)) section = 'alarch';
  if (!['en','tr'].includes(lang)) lang = 'en';

  function linkFor(sec){ return (lang==='tr'? '/tr' : '/en') + '/' + sec + '/'; }
  function langLink(target){ return (target==='tr'? '/tr' : '/en') + '/' + section + '/'; }

  function titleFallback(sec, L){
    const map = {
      en:{alarch:'Architecture', alart:'Art', allog:'Log', alo:'Alo'},
      tr:{alarch:'Mimarlık',     alart:'Sanat', allog:'Günlük', alo:'Alo'}
    };
    return (map[L]||map.en)[sec] || sec.toUpperCase();
  }

  // -------- UI chrome (menü, dil) --------
  function renderChrome(){
    const nav = qs('#js-nav');
    if (nav){
      nav.innerHTML = '';
      SECTIONS.forEach(sec=>{
        const a=document.createElement('a');
        a.href = linkFor(sec);
        a.textContent = (sec==='allog'?'ALOG':'').toString() || sec.toUpperCase();
        if (sec===section) a.classList.add('active');
        nav.appendChild(a);
      });
    }
    const lwrap = qs('#js-lang');
    if (lwrap){
      lwrap.innerHTML = '';
      ['en','tr'].forEach(L=>{
        const a=document.createElement('a');
        a.href = langLink(L);
        a.textContent = L.toUpperCase();
        if (L===lang) a.classList.add('on');
        lwrap.appendChild(a);
      });
    }
  }

  // -------- içerik yükle & çiz --------
  let CONTENT = null;
  function ensureContent(){
    if (CONTENT) return Promise.resolve(CONTENT);
    return fetch('assets/content.json?ts=' + Date.now())
      .then(r => r.ok ? r.json() : Promise.reject('content.json missing'))
      .then(j => (CONTENT=j));
  }

  function render(){
    if (!CONTENT) return;
    const site = CONTENT._site || {};
    setText('#js-brand', site.brand || 'AL');

    const block = (CONTENT[lang] && CONTENT[lang][section]) || {};
    setText('#js-title', block.title || titleFallback(section,lang));

    const sub = block.subtitle || '';
    setText('#js-sub', sub); show('#js-sub', !!sub);

    const rt = qs('#js-rich');
    if (rt){ rt.innerHTML = block.text || ''; show('#js-rich', !!block.text); }

    // quick links
    const ql = site.quick_links || [];
    const qWrap = qs('#js-quick');
    if (qWrap){
      qWrap.innerHTML = '';
      ql.forEach(it=>{
        const a=document.createElement('a'); a.href=it.href; a.target='_blank'; a.rel='noopener';
        a.textContent = it.label; qWrap.appendChild(a);
      });
    }

    // sol alt not
    setText('#js-note', lang==='tr' ? (site.note_tr||'') : (site.note_en||''));

    // galeri/projeler
    const list = block.projects || block.gallery || [];
    const grid = qs('#js-grid');
    if (grid){
      grid.innerHTML='';
      if (list.length){
        show('#js-grid', true);
        list.forEach(item=>{
          const fig=document.createElement('figure'); fig.className='card';
          const box=document.createElement('div'); box.className='lb';
          let media;
          if ((item.type||'image')==='video'){
            media=document.createElement('video');
            media.src=item.src; media.autoplay=true; media.muted=true; media.loop=true;
            media.addEventListener('mouseover', ()=>media.pause());
            media.addEventListener('mouseout', ()=>media.play());
          } else {
            media=document.createElement('img');
            media.src=item.src; media.alt=item.alt||'';
          }
          box.appendChild(media); fig.appendChild(box);
          if (item.caption){
            const c=document.createElement('figcaption'); c.className='cap'; c.textContent=item.caption;
            fig.appendChild(c);
          }
          grid.appendChild(fig);
        });
      } else {
        show('#js-grid', false);
      }
    }

    // opsiyonel reklam/duyuru
    const adBox = qs('#js-ad');
    if (adBox){
      const ad = site.ad && site.ad.enabled ? site.ad.html : '';
      if (ad){ adBox.innerHTML=ad; show('#js-ad', true); } else { show('#js-ad', false); }
    }
  }

  renderChrome();
  ensureContent().then(render).catch(err=>{
    console.warn(err);
    setText('#js-title', titleFallback(section,lang));
    const rt = qs('#js-rich');
    if (rt){ rt.innerHTML = '<p style="color:#888;font-size:12px">assets/content.json yüklenemedi.</p>'; show('#js-rich', true); }
  });
})();
