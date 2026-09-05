(() => {
  const KEY='numberCoreMonsters';
  const found=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  const all=()=>window.NUMBER_CORE_MONSTERS?.all||[];
  const saveFound=name=>{if(!name)return;const a=found();if(!a.includes(name)){a.push(name);localStorage.setItem(KEY,JSON.stringify(a));return true}return false};

  function inject(){
    if(document.getElementById('monsterCollectionStyle'))return;
    const s=document.createElement('style');s.id='monsterCollectionStyle';s.textContent=`
      .monster-book{margin:12px 0 0;padding:10px;border:1px solid #c3ddd0;border-radius:14px;background:#f9fcfa}.monster-book-toggle{width:100%;display:flex;justify-content:space-between;align-items:center;padding:11px 12px;border:1px solid #c8ddd1;border-radius:11px;background:#fff;color:#416c50;font-weight:950;font-size:13px}.monster-book-toggle small{font-size:9px;color:#789184}.monster-book-body{display:none;margin-top:9px}.monster-book.open .monster-book-body{display:block}.monster-book-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}.monster-book-item{aspect-ratio:1;border:1px solid #cbded3;border-radius:9px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3px;overflow:hidden}.monster-book-item img{width:72%;height:65%;object-fit:contain}.monster-book-item b{font-size:8px;line-height:1.1;text-align:center}.monster-book-item small{font-size:7px;color:#789184}.monster-book-item.locked img{filter:grayscale(1);opacity:.1}.monster-book-item.locked b{opacity:.35}.monster-book-item.rare{box-shadow:inset 0 0 0 2px #e7c66b}.monster-book-note{margin:7px 2px 0;font-size:9px;color:#789184}@media(max-width:900px){.monster-book-grid{grid-template-columns:repeat(6,minmax(0,1fr))}}@media(max-width:600px){.monster-book-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
    `;document.head.appendChild(s);
  }

  function ensure(){
    const monsters=all();if(!monsters.length)return;
    inject();
    const m=typeof state!=='undefined'?state?.monster:null;
    if(m?.name)saveFound(m.name);
    let book=document.getElementById('monsterBook');
    if(!book){const host=document.querySelector('.hand-area.card')||document.querySelector('.calculator.card');if(!host)return;book=document.createElement('section');book.id='monsterBook';book.className='monster-book';host.appendChild(book)}
    const f=new Set(found()),normal=monsters.filter(x=>!x.rare),rare=monsters.filter(x=>x.rare),fn=normal.filter(x=>f.has(x.name)).length,fr=rare.filter(x=>f.has(x.name)).length,open=book.classList.contains('open');
    book.innerHTML=`<button class="monster-book-toggle" type="button" aria-expanded="${open}"><span>📖 モンスター図鑑</span><small>${fn}/${normal.length} ＋ レア ${fr}/${rare.length}　${open?'▲':'▼'}</small></button><div class="monster-book-body"><div class="monster-book-grid">${monsters.map(x=>{const ok=f.has(x.name);return `<div class="monster-book-item ${ok?'':'locked'} ${x.rare?'rare':''}" title="${ok?x.name:'まだ出会っていない'}"><img src="${x.image}" alt="${ok?x.name:''}"><b>${ok?x.name:'？？？？'}</b><small>CORE ${x.core}</small></div>`}).join('')}</div><div class="monster-book-note">出会ったモンスターは図鑑に登録されるよ。</div></div>`;
    if(open)book.classList.add('open');
    book.querySelector('.monster-book-toggle').onclick=()=>{book.classList.toggle('open');const o=book.classList.contains('open'),b=book.querySelector('.monster-book-toggle');b.setAttribute('aria-expanded',o);b.querySelector('small').textContent=`${fn}/${normal.length} ＋ レア ${fr}/${rare.length}　${o?'▲':'▼'}`};
  }

  const boot=()=>{ensure();setInterval(ensure,700)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();