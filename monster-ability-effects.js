(() => {
  const abilityMap = {
    'ぷるぷるガード': { key:'guard', icon:'🛡️', label:'GUARD!' },
    'JUSTハンター': { key:'just', icon:'👁️', label:'JUST HUNTER!' },
    'フロストブレス': { key:'breath', icon:'❄️', label:'BREATH!' },
    'コアイーター': { key:'eater', icon:'💠', label:'CORE EATER!' },
    '回復のきのこ': { key:'heal', icon:'🍄', label:'HEAL!' },
    'はんげきバイト': { key:'bait', icon:'🦷', label:'COUNTER!' },
    '演算スイッチ': { key:'switch', icon:'🔀', label:'SWITCH!' },
    'ミラーバリア': { key:'mirror', icon:'🪞', label:'MIRROR!' },
    'フロスト': { key:'frost', icon:'❄️', label:'FROST!' },
    'いかりの力': { key:'rage', icon:'🔥', label:'RAGE!' },
    'よける': { key:'evasion', icon:'💨', label:'EVADE!' }
  };
  let lastAbility='', lastStatus='', lastEnemy='';
  const battle=()=>document.querySelector('.battle');
  const info=()=>abilityMap[document.getElementById('enemyAbility')?.textContent?.trim()]||null;
  function flash(a, detail){
    const b=battle(); if(!b||!a)return;
    b.classList.remove('ability-'+a.key); void b.offsetWidth; b.classList.add('ability-'+a.key);
    const el=document.createElement('div'); el.className='ability-moment';
    el.innerHTML=`<b>${a.icon} ${a.label}</b>${detail?`<small>${detail}</small>`:''}`;
    b.appendChild(el); requestAnimationFrame(()=>el.classList.add('show'));
    setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),180)},650);
  }
  const style=document.createElement('style'); style.textContent=`
    .enemy-ability{transition:transform .18s,box-shadow .18s,background .18s}.ability-moment{position:absolute;left:50%;top:34%;z-index:14;pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:3px;opacity:0;transform:translate(-50%,12px) scale(.72);font-weight:1000;text-shadow:0 3px 0 #fff,0 5px 12px #29473644}.ability-moment b{font-size:clamp(20px,3.4vw,34px)}.ability-moment small{font-size:10px}.ability-moment.show{opacity:1;transform:translate(-50%,-18px) scale(1);transition:opacity .1s,transform .25s cubic-bezier(.2,1.5,.4,1)}
    .battle[class*="ability-"] .enemy-ability{transform:scale(1.12);box-shadow:0 0 18px #8bc89d88}
    .battle.ability-guard .enemy-ability,.battle.ability-mirror .enemy-ability{background:#e6f0ff}.battle.ability-breath .enemy-ability,.battle.ability-frost .enemy-ability{background:#e7f5ff}.battle.ability-rage .enemy-ability{background:#fff0df}.battle.ability-heal .enemy-ability{background:#edf8e9}.battle.ability-switch .enemy-ability{background:#f1edff}
  `; document.head.appendChild(style);
  function watch(){
    const a=info(), s=document.getElementById('status')?.textContent?.trim()||'', enemy=document.getElementById('enemyName')?.textContent?.trim()||'';
    if(enemy!==lastEnemy){lastEnemy=enemy;lastAbility='';lastStatus='';}
    if(a&&a.key!==lastAbility){lastAbility=a.key; const el=document.getElementById('enemyAbility');if(el)el.dataset.ability=a.key;}
    if(a&&s&&s!==lastStatus){
      const activeWords=['ガード！','防がれた','回復。','反撃','かわした','変化した','ブレス','時間プレッシャー','怒りの反撃','身を守る'];
      if(activeWords.some(w=>s.includes(w))) flash(a,s);
    }
    lastStatus=s;
    setTimeout(watch,140);
  }
  setTimeout(watch,500);
})();
