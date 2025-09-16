<script>
/* Minimal router: /, /alarch/, /alart/, /allog/, /alo/, ve /tr/... */
(function(){
  const path = window.location.pathname.replace(/\/+$/,'/') || '/';
  const segs = path.split('/').filter(Boolean); // ["tr","alarch"]
  let lang = 'en', section = 'alarch';
  if (segs.length===0){ lang='en'; section='alarch'; }
  else if (segs.length===1){ section = segs[0]; }
  else { lang = segs[0]; section = segs[1]; }

  // normalize
  if (section === 'alog') section = 'allog';
  const SECTIONS = ['alarch','alart','allog','alo'];
  if (!SECTIONS.includes(section)) section = 'alarch';
  if (!['en','tr'].includes(lang)) lang = 'en';

  // Fill links (right menu & language)
  function linkFor(sec){ return (lang==='tr'? '/tr':'') + '/' + sec + '/'; }
  function langLink(target){ return (target==='tr'? '/tr':'') + '/' + section + '/'; }

  // Fetch content.json (no-cache)
  fetch('assets/content.json?ts=' + Date.now())
    .then(r=>r.json()).then(data=>{
      // site-level
      const site = data._site || {};
      // brand/title/note
      setText('#js-brand', site.brand || 'AL');
      setText('#js-title', (data[lang]?.[section]?.title) || titleFallback(section, lang));
      toggleText('#js-sub', (data[lang]?.[section]?.subtitle) || '');
      setText('#js-note', lang==='tr' ? (site.note_tr||'') : (site.note_en||''));

      // quick links
      const ql = (site.quick_links||[]);
      const qWrap = qs('#js-quick'); qWrap.innerHTML = '';
      ql.forEach(it=>{
        const a = document.createElement('a'); a.href = it.href; a.target='_blank'; a.rel='noopener';
        a.textContent = it.label; qWrap.appendChild(a);
      });

      // language toggle
      const lwrap = qs('#js-lang'); lwrap.innerHTML='';
      ['en','tr'].forEach(L=>{
        const a = document.createElement('a'); a.href = langLink(L); a.textContent = L.toUpperCase();
        if (L===lang) a.classList.add('on'); lwrap.appendChild(a);
      });

      // right menu nav
      const nav = qs('#js-nav'); nav.innerHTML='';
      SECTIONS.forEach(sec=>{
        const a = document.createElement('a'); a.href = linkFor(sec); a.textContent = sec.toUpperCase();
        if (sec===section) a.classList.add('active'); nav.appendChild(a);
      });

      // body rich text
      const textHtml = (data[lang]?.[section]?.text)||'';
      const rt = qs('#js-rich'); rt.innerHTML = textHtml;
      rt.classList.toggle('hide', !textHtml);

      // gallery/projects (images/videos base64 allowed)
      const list = (data[lang]?.[section]?.projects) || (data[lang]?.[section]?.gallery) || [];
      const grid = qs('#js-grid'); grid.innerHTML = '';
      if (!list || list.length===0){ grid.classList.add('hide'); }
      else {
        grid.classList.remove('hide');
        list.forEach(item=>{
          const fig = document.createElement('figure'); fig.className='card';
          const box = document.createElement('div'); box.className='lb';
          let media;
          if ((item.type||'image')==='video'){
            media = document.createElement('video');
            media.src = item.src; media.autoplay=true; media.muted=true; media.loop=true;
            media.addEventListener('mouseover', ()=>media.pause());
            media.addEventListener('mouseout', ()=>media.play());
          } else {
            media = document.createElement('img'); media.src = item.src; media.alt = item.alt||'';
          }
          box.appendChild(media); fig.appendChild(box);
          if (item.caption){
            const c = document.createElement('figcaption'); c.className='cap'; c.textContent=item.caption; fig.appendChild(c);
          }
          grid.appendChild(fig);
        });
      }

      // optional ad
      const ad = site.ad && site.ad.enabled ? site.ad.html : '';
      const adBox = qs('#js-ad'); if (ad){ adBox.innerHTML = ad; adBox.classList.remove('hide'); } else { adBox.classList.add('hide'); }
    });

  function qs(s){ return document.querySelector(s); }
  function setText(sel, txt){ const n=qs(sel); if(!n) return; n.textContent=txt; }
  function toggleText(sel, txt){ const n=qs(sel); if(!n) return; if(!txt){n.classList.add('hide'); n.textContent='';} else {n.classList.remove('hide'); n.textContent=txt;} }
  function titleFallback(sec, lang){
    const map = {
      en:{alarch:'Architecture', alart:'Art', allog:'Log', alo:'Alo'},
      tr:{alarch:'Mimarlık', alart:'Sanat', allog:'Günlük', alo:'Alo'}
    };
    return (map[lang]||map.en)[sec] || sec.toUpperCase();
  }
})();
</script>
