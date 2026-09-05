(() => {
  // Monster ability compatibility layer.
  // Keeps the main battle loop intact while giving every declared ability a real effect.
  const originalApply = window.applyPlayerCommand;
  if (typeof originalApply !== 'function') return;

  const abilityText = {
    guard:'防御', heal:'回復', bait:'さそい', switch:'シフト', mirror:'ミラー', breath:'ブレス', frost:'こおり', evasion:'回避', rage:'ラッシュ', just:'JUST'
  };

  function canTarget(a){
    return a && typeof a === 'object' && state && !state.gameOver && state.phase === 'player';
  }

  window.applyPlayerCommand = function(cmd, v){
    if (!canTarget(state?.monster)) return originalApply(cmd, v);
    const m = state.monster;

    // One-turn guard prepared by the monster. Defensive effects are consumed here.
    if (state.enemyGuard && (cmd?.name === '攻撃' || cmd?.name === '強攻撃')) {
      state.enemyGuard = Math.max(0, state.enemyGuard - 1);
      log(`あなた：${v} → ${cmd.name}（${abilityText[m.ability] || '防御'}！ ダメージ0）`);
      status(`${m.abilityName}！ ダメージを防がれた。`);
      if (typeof animatePlayer === 'function') animatePlayer(v === CORE ? 'special' : 'attack');
      if (typeof animateEnemy === 'function') animateEnemy('damage');
      return;
    }

    const before = state.enemyHP;
    originalApply(cmd, v);
    if (state.gameOver) return;

    // Extra effects happen after a successful player action so normal damage/combo rules remain intact.
    switch (m.ability) {
      case 'heal':
        if (cmd?.name === '回復') {
          state.enemyHP = Math.min(MAX_HP, state.enemyHP + 1);
          status(`${m.abilityName}！ モンスターのHPが1回復。`);
          render();
        }
        break;
      case 'bait':
        if (cmd?.name === '回復') {
          state.playerHP = Math.max(0, state.playerHP - 1);
          status(`${m.abilityName}！ 回復をねらったすきをつかれた。`);
          render();
        }
        break;
      case 'mirror':
        if (cmd?.just) {
          state.enemyGuard = Math.max(state.enemyGuard || 0, 1);
          status(`${m.abilityName}！ 次の攻撃を受け止める。`);
          render();
        }
        break;
      case 'evasion':
        if ((cmd?.name === '攻撃' || cmd?.name === '強攻撃') && before > state.enemyHP && Math.random() < 0.25) {
          state.enemyHP = Math.min(MAX_HP, state.enemyHP + 1);
          status(`${m.abilityName}！ モンスターが攻撃をかわした。`);
          render();
        }
        break;
      case 'rage':
        if (state.enemyHP <= Math.ceil(MAX_HP / 2)) state.playerGuard = Math.max(0, state.playerGuard - 1);
        break;
      case 'frost':
        if (cmd?.just) {
          state.enemyFrost = 2;
          status(`${m.abilityName}！ 次のターンが少し短くなる。`);
          render();
        }
        break;
      case 'switch':
        if (state.turns && state.turns % 3 === 0) {
          const ops = m.ops || ['+','-','*','/'];
          const narrowed = ops.filter(x => x !== '-');
          m.ops = narrowed.length >= 2 ? narrowed : ops;
          status(`${m.abilityName}！ 使える演算が変化。`);
          render();
        }
        break;
      case 'breath':
        if (cmd?.name === '攻撃' || cmd?.name === '強攻撃') {
          state.playerGuard = Math.max(0, state.playerGuard - 1);
        }
        break;
      case 'just':
        if (cmd?.just) {
          state.enemyGuard = Math.max(state.enemyGuard || 0, 1);
          status(`${m.abilityName}！ JUSTで身を守る。`);
          render();
        }
        break;
    }
  };
})();
