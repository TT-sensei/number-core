(() => {
  const style=document.createElement('style');style.textContent=`
    .result-monster{width:150px;height:150px;object-fit:contain;display:block;margin:4px auto 8px;filter:drop-shadow(0 10px 10px #0002);animation:resultMonsterIn .5s cubic-bezier(.2,1.4,.4,1)}
    .result-badge{display:inline-block;margin-bottom:6px;padding:4px 10px;border-radius:99px;background:#e4f3e8;border:1px solid #b7d6c1;font-size:10px;font-weight:950;color:#4d795b}
    .result-get{background:#fff8df;border-color:#e5cb75;color:#876b20}.result-new{background:#e8f5e8}
    .result-card-pop{animation:resultCardPop .35s ease}
    @keyframes resultMonsterIn{0%{opacity:0;transform:translateY(18px) scale(.65) rotate(-5deg)}100%{opacity:1;transform:none}}
    @keyframes resultCardPop{0%{transform:scale(.96)}100%{transform:scale(1)}}
  `;document.head.appendChild(style);
  let last='';
  function update(){
    const overlay=document.getElementById('overlay'),card=overlay?.querySelector('.overlay-card'),title=document.getElementById('resultTitle');
    if(!overlay||overlay.classList.contains('hidden')||!card||!title)return;
    const key=title.textContent+'|'+(typeof state!=='undefined'&&state?.monster?.name||'');if(key===last)return;last=key;
    card.classList.remove('result-card-pop');void card.offsetWidth;card.classList.add('result-card-pop');
    card.querySelector('.result-monster')?.remove();card.querySelector('.result-badge')?.remove();
    if(typeof state==='undefined'||!state?.monster)return;
    const img=document.createElement('img');img.className='result-monster';img.src=state.monster.image;img.alt=state.monster.name;const extra=document.getElementById('resultExtra');
    if(extra)card.insertBefore(img,extra);
    const badge=document.createElement('div');badge.className='result-badge '+(title.textContent==='GET！'?'result-get':'result-new');badge.textContent=title.textContent==='GET！'?'✨ モンスターを発見！':'⚔️ バトル結果';card.insertBefore(badge,img);
  }
  setInterval(update,180);
})();
