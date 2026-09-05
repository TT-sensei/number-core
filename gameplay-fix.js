// Number Core battle safety/ability layer.
// This file runs after script.js, so it can use the main game's lexical state and functions.
(() => {
  const original = applyPlayerCommand;
  if (typeof original !== 'function') return;

  const isAttack = cmd => cmd?.name === '攻撃' || cmd?.name === '強攻撃';
  const abilityText = {
    guard:'次の攻撃を1回防ぐ', heal:'回復すると敵も少し回復', bait:'回復をねらうと反撃',
    switch:'3ターンごとに使える演算が変化', mirror:'JUSTで次の攻撃を防ぐ', breath:'攻撃するとブレスで反撃',
    frost:'JUSTで次のターンを短くする', evasion:'攻撃をたまにかわす', rage:'HP半分以下で反撃', just:'JUSTで次の攻撃を防ぐ'
  };

  applyPlayerCommand = function(cmd, v) {
    if (!state || !state.monster || state.gameOver || state.phase !== 'player') return original(cmd, v);
    const m = state.monster;

    if (state.enemyGuard && isAttack(cmd)) {
      state.enemyGuard--;
      log(`あなた：${v} → ${cmd.name}（${m.abilityName}！ ダメージ0）`);
      status(`${m.abilityName}！ 攻撃を防がれた。`);
      animatePlayer(v === CORE ? 'special' : 'attack');
      animateEnemy('damage');
      render();
      return;
    }

    const beforeEnemy = state.enemyHP;
    const beforePlayer = state.playerHP;
    original(cmd, v);
    if (state.gameOver) return;

    switch (m.ability) {
      case 'guard':
        if (isAttack(cmd) && state.enemyHP < beforeEnemy) {
          state.enemyGuard = 1;
          status(`${m.abilityName}！ 次の攻撃を1回防ぐよ。`);
        }
        break;
      case 'heal':
        if (cmd.name === '回復') {
          state.enemyHP = Math.min(MAX_HP, state.enemyHP + 1);
          status(`${m.abilityName}！ モンスターもHP+1。`);
        }
        break;
      case 'bait':
        if (cmd.name === '回復') {
          state.playerHP = Math.max(0, state.playerHP - 1);
          status(`${m.abilityName}！ 回復をねらったすきをつかれた。`);
        }
        break;
      case 'mirror':
        if (cmd.just) {
          state.enemyGuard = 1;
          status(`${m.abilityName}！ JUSTで次の攻撃を防ぐ。`);
        }
        break;
      case 'evasion':
        if (isAttack(cmd) && state.enemyHP < beforeEnemy && Math.random() < 0.25) {
          const damage = beforeEnemy - state.enemyHP;
          state.enemyHP = Math.min(MAX_HP, state.enemyHP + damage);
          status(`${m.abilityName}！ 攻撃をかわした。`);
        }
        break;
      case 'rage':
        if (isAttack(cmd) && state.enemyHP <= Math.ceil(MAX_HP / 2)) {
          state.playerHP = Math.max(0, state.playerHP - 1);
          status(`${m.abilityName}！ 怒りの反撃。1ダメージ。`);
        }
        break;
      case 'frost':
        if (cmd.just) {
          state.enemyFrost = 1;
          status(`${m.abilityName}！ 次のターンは時間が3秒短い。`);
        }
        break;
      case 'switch':
        if (state.turns > 0 && state.turns % 3 === 0) {
          const ops = m.ops || ['+','-','*','/'];
          const next = ops.filter(x => x !== '-');
          if (next.length >= 2) m.ops = next;
          status(`${m.abilityName}！ 使える演算が変化した。`);
        }
        break;
      case 'breath':
        if (isAttack(cmd) && state.enemyHP < beforeEnemy && Math.random() < 0.25) {
          state.playerHP = Math.max(0, state.playerHP - 1);
          status(`${m.abilityName}！ ブレスの反撃。1ダメージ。`);
        }
        break;
      case 'just':
        if (cmd.just) {
          state.enemyGuard = 1;
          status(`${m.abilityName}！ JUSTを受けて身を守る。`);
        }
        break;
    }

    if (state.playerHP <= 0) {
      finishLose();
      return;
    }
    render();
  };

  // Keep the global hook in sync for effect/extension scripts.
  window.applyPlayerCommand = applyPlayerCommand;
  window.__numberCoreAbilityText = abilityText;
})();