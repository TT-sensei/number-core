(() => {
  let lastCombo = 0, lastPower = false, lastEnemyHp = null, lastPlayerHp = null, busy = false;
  const battle=()=>document.querySelector('.battle');
  const playerImages=()=>[document.getElementById('playerFantasyImage'),document.getElementById('playerFantasyImageScene')].filter(Boolean);

  function moment(title,sub=''){if(busy)return;busy=true;const el=document.createElement('div');el.className='battle-moment';el.innerHTML=`<strong>${title}</strong>${sub?`<span>${sub}</span>`:''}`;(battle()||document.body).appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>{el.classList.remove('show');setTimeout(()=>{el.remove();busy=false},180)},760)}
  function pulse(kind){const b=battle();if(!b)return;b.classList.remove('moment-just','moment-power','moment-special','moment-hit');void b.offsetWidth;b.classList.add(kind);setTimeout(()=>b.classList.remove(kind),620)}
  function floatText(text,kind=''){const b=battle();if(!b)return;const el=document.createElement('div');el.className=`battle-float ${kind}`.trim();el.textContent=text;b.appendChild(el);requestAnimationFrame(()=>el.classList.add('show'));setTimeout(()=>el.remove(),760)}

  function playerAction(kind){
    const imgs=playerImages();if(!imgs.length)return;
    imgs.forEach(img=>{
      const stand=img.dataset.standSrc||img.getAttribute('src');
      if(!stand)return;
      img.dataset.standSrc=stand;
      const match=stand.match(/\/fantasy\/([^/]+)\.png$/);if(!match)return;
      const name=match[1];
      const next=kind==='special'
        ? stand.replace(`/fantasy/${name}.png`,`/fantasy/special/${name}-special.png`)
        : stand.replace(`/fantasy/${name}.png`,`/fantasy/attack/${name}-attack.png`);
      img.src=next;img.classList.remove('navi-action-attack','navi-action-special');void img.offsetWidth;img.classList.add(kind==='special'?'navi-action-special':'navi-action-attack');
      setTimeout(()=>{img.src=img.dataset.standSrc;img.classList.remove('navi-action-attack','navi-action-special')},kind==='special'?900:620);
    });
    const b=battle();if(b){b.classList.remove('navi-strike','navi-special');void b.offsetWidth;b.classList.add(kind==='special'?'navi-special':'navi-strike');setTimeout(()=>b.classList.remove('navi-strike','navi-special'),700)}
  }

  function enemyImpact(){const img=document.getElementById('enemyImage');if(!img)return;img.classList.remove('enemy-impact');void img.offsetWidth;img.classList.add('enemy-impact');setTimeout(()=>img.classList.remove('enemy-impact'),360)}

  function inspect(){
    const comboEl=document.getElementById('comboCount'),powerEl=document.getElementById('powerState'),enemyText=document.getElementById('enemyHpText'),playerText=document.getElementById('playerHpText');if(!comboEl||!powerEl)return;
    const combo=Number(comboEl.textContent)||0,power=/READY/.test(powerEl.textContent),enemyHp=Number((enemyText?.textContent||'').match(/\d+/)?.[0]),playerHp=Number((playerText?.textContent||'').match(/\d+/)?.[0]);
    if(Number.isFinite(enemyHp)&&lastEnemyHp!==null&&enemyHp<lastEnemyHp){pulse('moment-hit');enemyImpact()}
    if(combo>lastCombo){if(combo===1){floatText('JUST!','just-text');pulse('moment-just');playerAction('attack')}else if(combo===3||combo===5||(combo>5&&combo%5===0))floatText(`${combo} COMBO!`,'combo-text')}
    if(power&&!lastPower){pulse('moment-power');moment('CORE POWER!','次の攻撃が ×3！');floatText('×3','power-text');playerAction('special')}
    if(lastPower&&!power&&combo>=10){pulse('moment-special');moment('SPECIAL!','ナビキャラの必殺技！');playerAction('special')}
    if(Number.isFinite(playerHp)&&lastPlayerHp!==null&&playerHp<lastPlayerHp)floatText('−1','damage-text');
    lastCombo=combo;lastPower=power;if(Number.isFinite(enemyHp))lastEnemyHp=enemyHp;if(Number.isFinite(playerHp))lastPlayerHp=playerHp;
  }

  const style=document.createElement('style');style.textContent=`
.battle-moment{position:absolute;inset:0;display:grid;place-content:center;text-align:center;z-index:12;pointer-events:none;opacity:0;transform:scale(.78)}
.battle-moment strong{font-size:clamp(34px,6vw,64px);font-weight:1000;text-shadow:0 4px 0 #fff,0 7px 18px #315b4244}.battle-moment span{display:block;margin-top:5px;font-size:13px;font-weight:950}.battle-moment.show{opacity:1;transform:scale(1);transition:opacity .12s,transform .18s cubic-bezier(.2,1.5,.4,1)}
.battle-float{position:absolute;left:50%;top:48%;z-index:13;pointer-events:none;font-size:25px;font-weight:1000;opacity:0;transform:translate(-50%,10px) scale(.8);text-shadow:0 3px 0 #fff,0 5px 12px #315b4244}.battle-float.show{opacity:1;transform:translate(-50%,-45px) scale(1);transition:opacity .1s,transform .45s cubic-bezier(.2,1.4,.4,1)}.battle-float.combo-text{font-size:21px}.battle-float.power-text{font-size:48px}.battle-float.damage-text{font-size:24px}
.battle.moment-just{animation:coreJust .55s ease}.battle.moment-power{animation:corePower .65s ease}.battle.moment-special{animation:coreSpecial .7s ease}.battle.moment-hit{animation:coreHit .25s ease}.battle.navi-strike{animation:naviStrike .52s cubic-bezier(.2,.9,.3,1)}.battle.navi-special{animation:naviSpecial .7s cubic-bezier(.2,.9,.3,1)}
.navi-action-attack{animation:naviImageAttack .62s cubic-bezier(.2,.9,.3,1)}.navi-action-special{animation:naviImageSpecial .9s cubic-bezier(.15,.9,.25,1)}.enemy-impact{animation:enemyImpact .36s ease}
@keyframes coreJust{0%,100%{transform:translateZ(0)}35%{transform:scale(1.018);filter:brightness(1.08)}}@keyframes corePower{0%{box-shadow:0 0 0 #fff0}45%{box-shadow:0 0 45px #8bc89d88}100%{box-shadow:0 0 0 #fff0}}@keyframes coreSpecial{0%{transform:scale(1)}20%{transform:scale(1.025);filter:brightness(1.15)}45%{transform:scale(.99)}70%{transform:scale(1.015)}100%{transform:scale(1)}}@keyframes coreHit{0%,100%{transform:translateX(0)}30%{transform:translateX(-4px)}70%{transform:translateX(4px)}}
@keyframes naviStrike{0%{transform:translateX(0)}22%{transform:translateX(7px) scale(1.01)}55%{transform:translateX(-4px)}100%{transform:translateX(0)}}@keyframes naviSpecial{0%{transform:scale(1)}20%{transform:scale(1.025)}45%{transform:scale(.99)}70%{transform:scale(1.018)}100%{transform:scale(1)}}
@keyframes naviImageAttack{0%{transform:translateX(0) scale(1)}28%{transform:translateX(18px) scale(1.06)}55%{transform:translateX(-5px) scale(.98)}100%{transform:translateX(0) scale(1)}}@keyframes naviImageSpecial{0%{transform:translateY(0) scale(1)}22%{transform:translateY(-10px) scale(1.08)}45%{transform:translateY(4px) scale(.97)}70%{transform:translateY(-3px) scale(1.04)}100%{transform:translateY(0) scale(1)}}@keyframes enemyImpact{0%,100%{transform:translateX(0);filter:drop-shadow(0 8px 8px #0003)}25%{transform:translateX(-10px) rotate(-2deg);filter:brightness(1.25)}65%{transform:translateX(8px) rotate(2deg);filter:brightness(.88)}}
`;document.head.appendChild(style);setTimeout(function watch(){inspect();setTimeout(watch,120)},300);
})();
