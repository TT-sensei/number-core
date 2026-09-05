(() => {
  const KEY = 'numberCoreMonsters';
  const getFound = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  };
  const monsters = () => window.NUMBER_CORE_MONSTERS?.all || [];

  function injectStyle(){
    if(document.getElementById('monsterCollectionStyle')) return;
    const s=document.createElement('style');
    s.id='monsterCollectionStyle';
    s.textContent=`
      .monster-book{margin:12px 0 0;padding:12px;border:1px solid rgba(0,0,0,.1);border-radius:18px;background:rgba(255,255,255,.82)}
      .monster-book-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;border:0;border-radius:14px;padding:12px 14px;background:#fff;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.05)}
      .monster-book-toggle small{font-weight:700;opacity:.65}
      .monster-book-body{display:none;margin-top:10px}.monster-book.open .monster-book-body{display:block}
      .monster-book-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:7px}
      .monster-book-item{min-width:0;aspect-ratio:1;border:1px solid rgba(0,0,0,.1);border-radius:12px;background:#fff;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px}
      .monster-book-item img{width:74%;height:68%;object-fit:contain}.monster-book-item b{font-size:9px;line-height:1.1;text-align:center}.monster-book-item small{font-size:8px;opacity:.6}
      .monster-book-item.locked img{filter:grayscale(1);opacity:.12}.monster-book-item.locked b{opacity:.35}.monster-book-item.rare{box-shadow:0 0 0 2px rgba(255,180,40,.4) inset}
      .monster-book-note{margin:8px 2px 0;font-size:11px;opacity:.65}
      @media(max-width:900px){.monster-book-grid{grid-template-columns:repeat(6,minmax(0,1fr))}}
      @media(max-width:600px){.monster-book-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
    `;
    document.head.appendChild(s);
  }

  function ensureBook(){
    if(!document.body || !monsters().length) return;
    injectStyle();
    let book=document.getElementById('monsterBook');
    if(!book){
      const host=document.querySelector('.hand-area.card') || document.querySelector('.calculator.card');
      if(!host) return;
      book=document.createElement('section');
      book.id='monsterBook';
      book.className='monster-book';
      host.appendChild(book);
    }
    const found=new Set(getFound());
    const all=monsters();
    const normal=all.filter(m=>!m.rare), rare=all.filter(m=>m.rare);
    const foundNormal=normal.filter(m=>found.has(m.name)).length;
    const foundRare=rare.filter(m=>found.has(m.name)).length;
    const wasOpen=book.classList.contains('open');
    book.innerHTML=`
      <button class="monster-book-toggle" type="button" aria-expanded="${wasOpen}">
        <span>📖 モンスター図鑑</span>
        <small>${foundNormal}/${normal.length} ＋ レア ${foundRare}/${rare.length}　${wasOpen?'▲':'▼'}</small>
      </button>
      <div class="monster-book-body">
        <div class="monster-book-grid">${all.map(m=>{
          const ok=found.has(m.name);
          return `<div class="monster-book-item ${ok?'':'locked'} ${m.rare?'rare':''}" title="${ok?m.name:'まだ出会っていない'}">
            <img src="${m.image}" alt="${ok?m.name:''}">
            <b>${ok?m.name:'？？？？'}</b><small>CORE ${m.core}</small>
          </div>`;
        }).join('')}</div>
        <div class="monster-book-note">バトルで出会ったモンスターが図鑑に登録されるよ。</div>
      </div>`;
    if(wasOpen) book.classList.add('open');
    book.querySelector('.monster-book-toggle').onclick=()=>{
      book.classList.toggle('open');
      const btn=book.querySelector('.monster-book-toggle');
      const open=book.classList.contains('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
      btn.querySelector('small').textContent=`${foundNormal}/${normal.length} ＋ レア ${foundRare}/${rare.length}　${open?'▲':'▼'}`;
    };
  }

  const originalRender=window.render;
  if(typeof originalRender==='function'){
    window.render=function(){
      originalRender.apply(this,arguments);
      const m=state?.monster;
      if(m?.name){
        const found=getFound();
        if(!found.includes(m.name)){
          found.push(m.name);
          localStorage.setItem(KEY,JSON.stringify(found));
        }
      }
      ensureBook();
    };
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(ensureBook,0));
  setTimeout(ensureBook,0);
})();