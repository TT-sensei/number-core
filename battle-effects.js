(() => {
  let lastCombo = 0;
  let lastPower = false;
  let lastEnemyHp = null;
  let lastPlayerHp = null;
  let busy = false;

  function root() { return document.body; }
  function battle() { return document.querySelector('.battle'); }

  function moment(title, sub = '') {
    if (busy) return;
    busy = true;
    const el = document.createElement('div');
    el.className = 'battle-moment';
    el.innerHTML = `<strong>${title}</strong>${sub ? `<span>${sub}</span>` : ''}`;
    (battle() || root()).appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => { el.remove(); busy = false; }, 180); }, 760);
  }

  function pulse(kind) {
    const b = battle();
    if (!b) return;
    b.classList.remove('moment-just', 'moment-power', 'moment-special', 'moment-hit');
    void b.offsetWidth;
    b.classList.add(kind);
    setTimeout(() => b.classList.remove(kind), 620);
  }

  function floatText(text, kind = '') {
    const b = battle();
    if (!b) return;
    const el = document.createElement('div');
    el.className = `battle-float ${kind}`.trim();
    el.textContent = text;
    b.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => el.remove(), 760);
  }

  function inspect() {
    if (!window.state) return;
    const s = window.state;
    const combo = Number(s.combo || 0);
    const power = !!s.corePower;
    const enemyHp = Number(s.enemyHP);
    const playerHp = Number(s.playerHP);

    if (lastEnemyHp !== null && enemyHp < lastEnemyHp) {
      pulse('moment-hit');
    }
    if (combo > lastCombo) {
      if (combo === 1) {
        floatText('JUST!', 'just-text');
        pulse('moment-just');
      } else if (combo === 3 || combo === 5) {
        floatText(`${combo} COMBO!`, 'combo-text');
      } else if (combo > 5 && combo % 5 === 0) {
        floatText(`${combo} COMBO!`, 'combo-text');
      }
    }
    if (power && !lastPower) {
      pulse('moment-power');
      moment('CORE POWER!', '次の攻撃が ×3！');
      floatText('×3', 'power-text');
    }
    if (lastPower && !power && combo >= 10) {
      pulse('moment-special');
      moment('SPECIAL!', 'ナビキャラの必殺技！');
    }
    if (lastPlayerHp !== null && playerHp < lastPlayerHp) floatText('−1', 'damage-text');

    lastCombo = combo;
    lastPower = power;
    lastEnemyHp = enemyHp;
    lastPlayerHp = playerHp;
  }

  function watch() {
    inspect();
    setTimeout(watch, 120);
  }

  const style = document.createElement('style');
  style.textContent = `
    .battle-moment{position:absolute;inset:0;display:grid;place-content:center;text-align:center;z-index:12;pointer-events:none;opacity:0;transform:scale(.78)}
    .battle-moment strong{font-size:clamp(34px,6vw,64px);font-weight:1000;letter-spacing:.02em;text-shadow:0 4px 0 #ffffff,0 7px 18px #315b4244}
    .battle-moment span{display:block;margin-top:5px;font-size:13px;font-weight:950}
    .battle-moment.show{opacity:1;transform:scale(1);transition:opacity .12s,transform .18s cubic-bezier(.2,1.5,.4,1)}
    .battle-float{position:absolute;left:50%;top:48%;z-index:13;pointer-events:none;font-size:25px;font-weight:1000;opacity:0;transform:translate(-50%,10px) scale(.8);text-shadow:0 3px 0 #fff,0 5px 12px #315b4244}
    .battle-float.show{opacity:1;transform:translate(-50%,-45px) scale(1);transition:opacity .1s,transform .45s cubic-bezier(.2,1.4,.4,1)}
    .battle-float.combo-text{font-size:21px}.battle-float.power-text{font-size:48px}.battle-float.damage-text{font-size:24px}
    .battle.moment-just{animation:coreJust .55s ease}.battle.moment-power{animation:corePower .65s ease}.battle.moment-special{animation:coreSpecial .7s ease}.battle.moment-hit{animation:coreHit .25s ease}
    @keyframes coreJust{0%,100%{transform:translateZ(0)}35%{transform:scale(1.018);filter:brightness(1.08)}}
    @keyframes corePower{0%{box-shadow:0 0 0 #fff0}45%{box-shadow:0 0 45px #8bc89d88}100%{box-shadow:0 0 0 #fff0}}
    @keyframes coreSpecial{0%{transform:scale(1)}20%{transform:scale(1.025);filter:brightness(1.15)}45%{transform:scale(.99)}70%{transform:scale(1.015)}100%{transform:scale(1)}}
    @keyframes coreHit{0%,100%{transform:translateX(0)}30%{transform:translateX(-4px)}70%{transform:translateX(4px)}}
  `;
  document.head.appendChild(style);
  setTimeout(watch, 300);
})();
