(() => {
  const BASE = 'https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/';
  const ZAKO = BASE + 'web/fantasy/monsters/zako/';
  const BOSS = BASE + 'web/fantasy/monsters/boss/';

  const EXPANDED_MONSTERS = [
    {name:'ぷるんスライム',core:20,personality:'かんたん',abilityName:'ぷるぷるガード',ability:'guard',ops:['+','-'],image:ZAKO+'forest-puru.webp'},
    {name:'どんぐりリーフ',core:20,personality:'おだやか',abilityName:'リーフヒール',ability:'heal',ops:['+','-'],image:ZAKO+'acorn-leafy.webp'},
    {name:'ベリーリーフ',core:20,personality:'しんちょう',abilityName:'ちいさな守り',ability:'guard',ops:['+','-','*'],image:ZAKO+'berry-leafy.webp'},
    {name:'キャンディコーラル',core:20,personality:'いたずら',abilityName:'あまいさそい',ability:'bait',ops:['+','-','*'],image:ZAKO+'candy-coral-slug.webp'},
    {name:'こもりんバット',core:30,personality:'JUSTねらい',abilityName:'JUSTハンター',ability:'just',ops:['+','-','*','/'],image:ZAKO+'komorin-little-night-bat.webp'},
    {name:'きのこっこ',core:30,personality:'回復型',abilityName:'きのこ胞子',ability:'heal',ops:['+','-','*'],image:ZAKO+'kinoko-apple-mushroom.webp'},
    {name:'はっぱリス',core:30,personality:'しんちょう',abilityName:'リーフシールド',ability:'guard',ops:['+','-'],image:ZAKO+'happa-squirrel-leafy.webp'},
    {name:'コグホイールビートル',core:30,personality:'計算型',abilityName:'ギアチェンジ',ability:'switch',ops:['+','-','*','/'],image:ZAKO+'cogwheel-beetle.webp'},
    {name:'ホローハット',core:30,personality:'ゆっくり型',abilityName:'あやしい帽子',ability:'switch',ops:['+','-','*'],image:ZAKO+'hollow-hat-scarecrow.webp'},
    {name:'バブルフィン',core:50,personality:'ゆらゆら型',abilityName:'バブルミラー',ability:'mirror',ops:['+','-','*'],image:ZAKO+'bubblefin-frog.webp'},
    {name:'もふウルフ',core:50,personality:'攻撃型',abilityName:'フロストブレス',ability:'breath',ops:['+','-','*','/'],image:ZAKO+'mofu-wolf-frost-pup.webp'},
    {name:'フロストファング',core:50,personality:'時間型',abilityName:'こおりの圧力',ability:'frost',ops:['+','-','*','/'],image:ZAKO+'frostfang-weasel.webp'},
    {name:'クラウドラビット',core:50,personality:'回避型',abilityName:'雨雲ステップ',ability:'evasion',ops:['+','-','*'],image:ZAKO+'cloud-rain-rabbit.webp'},
    {name:'コバルトカマキリ',core:50,personality:'一撃型',abilityName:'ブレードラッシュ',ability:'rage',ops:['+','-','*','/'],image:ZAKO+'cobalt-blade-mantis.webp'},
    {name:'きらめきトカゲ',core:50,personality:'バランス型',abilityName:'オーロラシェル',ability:'guard',ops:['+','-','*','/'],image:ZAKO+'aurora-shell-lizard.webp'},
    {name:'ミズタマカッパ',core:50,personality:'いたずら',abilityName:'みずしぶき',ability:'bait',ops:['+','-','*','/'],image:ZAKO+'mizutama-kappa.webp'},
    {name:'ハニードロップベア',core:50,personality:'おおらか',abilityName:'ハニーリカバー',ability:'heal',ops:['+','-','*'],image:ZAKO+'honeydrop-bear.webp'},
    {name:'アイアンリーフパンサー',core:100,personality:'強敵',abilityName:'アイアンガード',ability:'guard',ops:['+','-','*','/'],image:ZAKO+'ironleaf-panther.webp'},
    {name:'エンバーウィング',core:100,personality:'攻撃型',abilityName:'フレイムラッシュ',ability:'rage',ops:['+','-','*','/'],image:ZAKO+'emberwing-raven.webp'},
    {name:'ランタンアイモス',core:100,personality:'JUSTねらい',abilityName:'ランタンハント',ability:'just',ops:['+','-','*','/'],image:ZAKO+'lantern-eye-moth.webp'},
    {name:'ムーンリットウィスプ',core:100,personality:'不思議型',abilityName:'ムーンシフト',ability:'switch',ops:['+','-','*','/'],image:ZAKO+'moonlit-wisp.webp'},
    {name:'ナイトスノーパフ',core:100,personality:'防御型',abilityName:'スノーウォール',ability:'guard',ops:['+','-','*'],image:ZAKO+'night-snow-puff.webp'},
    {name:'ペーパークレイン',core:100,personality:'工夫型',abilityName:'おりがみ返し',ability:'mirror',ops:['+','-','*','/'],image:ZAKO+'paper-crane-spirit.webp'},
    {name:'クローバーマンドラゴラ',core:100,personality:'回復型',abilityName:'四つ葉の願い',ability:'heal',ops:['+','-','*'],image:ZAKO+'clover-mandragora.webp'},
    {name:'ダスクフェザーオウル',core:100,personality:'観察型',abilityName:'ナイトアイ',ability:'just',ops:['+','-','*','/'],image:ZAKO+'dusk-feather-owl.webp'},
    {name:'エンバーランタン',core:100,personality:'時間型',abilityName:'ほのお時計',ability:'frost',ops:['+','-','*','/'],image:ZAKO+'ember-lantern-salamander.webp'}
  ];

  const RARE_MONSTERS = [
    {name:'アクアスライムキング',core:100,personality:'ボス級',abilityName:'大海の守り',ability:'guard',ops:['+','-','*','/'],image:BOSS+'aqua-slime-king.webp',rare:true},
    {name:'クリムゾンインフェルノドラゴン',core:100,personality:'ボス級',abilityName:'インフェルノ',ability:'rage',ops:['+','-','*','/'],image:BOSS+'crimson-inferno-dragon.webp',rare:true},
    {name:'アビサルミラーレヴィアタン',core:50,personality:'ボス級',abilityName:'ミラーウェーブ',ability:'mirror',ops:['+','-','*','/'],image:BOSS+'abyssal-mirror-leviathan.webp',rare:true},
    {name:'アズールスカイドラゴン',core:30,personality:'ボス級',abilityName:'スカイブレス',ability:'breath',ops:['+','-','*','/'],image:BOSS+'azure-sky-dragon.webp',rare:true}
  ];

  const pick = a => a[Math.floor(Math.random() * a.length)];
  const originalMonsterForCore = window.monsterForCore;
  const originalReset = window.reset;

  window.monsterForCore = function(core) {
    const candidates = EXPANDED_MONSTERS.filter(m => m.core === core);
    if (!candidates.length) return originalMonsterForCore ? originalMonsterForCore(core) : EXPANDED_MONSTERS[0];
    const rarePool = RARE_MONSTERS.filter(m => m.core === core);
    if (rarePool.length && Math.random() < (core === 100 ? 0.06 : 0.035)) return {...pick(rarePool)};
    return {...pick(candidates)};
  };

  window.reset = function() {
    originalReset.apply(this, arguments);
    if (typeof state !== 'undefined' && state?.monster) {
      state.monster = window.monsterForCore(CORE);
      if (typeof render === 'function') render();
    }
  };

  const current = typeof state !== 'undefined' ? state : null;
  if (current?.monster) {
    current.monster = window.monsterForCore(CORE);
    if (typeof render === 'function') render();
  }

  const restart = document.getElementById('restartBtn');
  const next = document.getElementById('nextBtn');
  if (restart) restart.onclick = () => window.reset();
  if (next) next.onclick = () => window.reset();

  window.NUMBER_CORE_MONSTERS = {all:[...EXPANDED_MONSTERS,...RARE_MONSTERS],expanded:EXPANDED_MONSTERS,rare:RARE_MONSTERS};
})();
