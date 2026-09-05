(() => {
  const originalApply = applyPlayerCommand;
  if (typeof originalApply !== 'function') return;

  const abilityText = {
    guard:'次の攻撃を1回防ぐ', heal:'回復すると敵も少し回復', bait:'回復をねらうと反撃', switch:'使える演算が変化', mirror:'JUSTで次の攻撃を防ぐ', breath:'攻撃するとブレスで反撃', frost:'JUSTで次のターンを短くする', evasion:'攻撃をたまにかわす', rage:'HPが半分以下で反撃が強くなる', just:'JUSTで次の攻撃を防ぐ'
  };

  function active(){ return state && state.monster && !state.gameOver && state.phase === 'player'; }
  function attack(cmd){ return cmd?.name === '攻撃' || cmd?.name === '強攻撃'; }

  window.applyPlayerCommand = function(cmd, v){
    if (!active()) return originalApply(cmd, v);
    const m = state.monster;
    const beforeHP = state.enemyHP;
    const beforePlayerHP = state.playerHP;
    originalApply(cmd, v);
    if (state.gameOver) return;

    switch(m.ability){
      case 'guard':
        if (attack(cmd) && beforeHP > state.enemyHP) {
          state.enemyGuard = 1;
          status(`${m.abilityName}！ 次の攻撃を1回防ぐよ。`);
          render();
        }
        break;
      case 'heal':
        if (cmd?.name === '回復' && state.playerHP > beforePlayerHP) {
          state.enemyHP = Math.min(MAX_HP, state.enemyHP + 1);
          status(`${m.abilityName}！ モンスターもHPが1回復。`);
          render();
        }
        break;
      case 'bait':
        if (cmd?.name === '回復' && state.playerHP === beforePlayerHP) {
          state.playerHP = Math.max(0, state.playerHP - 1);
          status(`${m.abilityName}！ 回復をねらったすきをつかれた。`);
          render();
        }
        break;
      case 'mirror':
        if (cmd?.just) {
          state.enemyGuard = 1;
          status(`${m.abilityName}！ JUSTで次の攻撃を防ぐ。`);
          render();
        }
        break;
      case 'evasion':
        if (attack(cmd) && beforeHP > state.enemyHP && Math.random() < 0.25) {
          state.enemyHP = Math.min(MAX_HP, state.enemyHP + 1);
          status(`${m.abilityName}！ 攻撃をかわした。`);
          render();
        }
        break;
      case 'rage':
        if (state.enemyHP <= Math.ceil(MAX_HP / 2) && attack(cmd)) {
          state.playerHP = Math.max(0, state.playerHP - 1);
          status(`${m.abilityName}！ 怒りの反撃で1ダメージ。`);
          render();
        }
        break;
      case 'frost':
        if (cmd?.just) {
          state.enemyFrost = 1;
          status(`${m.abilityName}！ 次のターンに時間プレッシャー。`);
          render();
        }
        break;
      case 'switch':
        if (state.turns && state.turns % 3 === 0 && !state.operatorSwitched) {
          const ops = m.ops || ['+','-','*','/'];
          const narrowed = ops.filter(x => x !== '-');
          if (narrowed.length >= 2) m.ops = narrowed;
          state.operatorSwitched = true;
          status(`${m.abilityName}！ 使える演算が変化した。`);
          render();
        }
        break;
      case 'breath':
        if (attack(cmd) && beforeHP > state.enemyHP && Math.random() < 0.25) {
          state.playerHP = Math.max(0, state.playerHP - 1);
          status(`${m.abilityName}！ ブレスの反撃。1ダメージ。`);
          render();
        }
        break;
      case 'just':
        if (cmd?.just) {
          state.enemyGuard = 1;
          status(`${m.abilityName}！ JUSTを受けて身を守る。`);
          render();
        }
        break;
    }

    if (abilityText[m.ability]) {
      const el = document.getElementById('enemyAbility');
      if (el) el.title = abilityText[m.ability];
    }
  };
})();
