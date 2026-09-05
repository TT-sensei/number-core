// Small safety layer kept separate from the main game loop.
// It preserves the existing battle system while making enemy defense meaningful.
const _numberCoreApplyPlayerCommand=applyPlayerCommand;
applyPlayerCommand=function(cmd,v){
  if(state && state.enemyGuard && (cmd.name==='攻撃'||cmd.name==='強攻撃')){
    const blocked=state.enemyGuard;
    state.enemyGuard=0;
    const label=blocked>1?'ぷるぷるガード！':'防御！';
    log(`あなた：${v} → ${cmd.name}（${label} ダメージ0）`);
    status(`${label}！ モンスターの防御で攻撃を防がれた。`);
    animatePlayer(v===CORE?'special':'attack');
    animateEnemy('damage');
    return;
  }
  _numberCoreApplyPlayerCommand(cmd,v);
};
