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
      .monster-book{margin-top:12px;padding:14px;border:1px solid rgba(0,0,0,.1);border-radius:18px;background:rgba(255,255,255,.72)}
      .monster-book-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}
      .monster-book-head strong{font-size:15px}.monster-book-count{font-weight:800;font-size:13px}
      .monster-book-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
      .monster-book-item{min-width:0;aspect-ratio:1;border:1px solid rgba(0,0,0,.1);border-radius:12px;background:#fff;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5px}
      .monster-book-item img{width:72%;height:72%;object-fit:contain}.monster-book-item b{font-size:9px;line-height:1.15;text-align:center}.monster-book-item small{font-size:8px;opacity:.65}
      .monster-book-item.locked img{filter:grayscale(1);opacity:.12}.monster-book-item.locked b{opacity:.35}.monster-book-item.rare{box-shadow:0 0 0 2px rgba(255,180,40,.35) inset}
      @media(max-width:800px){.monster-book-grid{grid-template-columns:repeat(5,minmax(0,1fr))}.monster-book-item b{font-size:8px}}
      @media(max-width:600px){.monster-book-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
    `;
    document.head.appendChild(s);
  }

  function ensureBook(){
    if(!document.body || !monsters().length) return;
    injectStyle();
    let book=document.getElementById('monsterBook');
    if(!book){
      const host=document.querySelector('.strategy.card') || document.querySelector('.strategy-panel');
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
    book.innerHTML=`<div class="monster-book-head"><strong>モンスター図鑑</strong><span class="monster-book-count">${foundNormal}/${normal.length} ＋ レア ${foundRare}/${rare.length}</span></div><div class="monster-book-grid">${all.map(m=>{const ok=found.has(m.name);return `<div class="monster-book-item ${ok?'':'locked'} ${m.rare?'rare':''}" title="${ok?m.name:'まだ出会っていない'}">${ok?`<img src="${m.image}" alt="${m.name}">`:'<img src="'+m.image+'" alt="">'}<b>${ok?m.name:'？？？？'}</b><small>CORE ${m.core}</small></div>`}).join('')}</div>`;
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
