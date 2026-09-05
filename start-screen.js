(() => {
  const BASE='https://raw.githubusercontent.com/TT-sensei/navi-character-/main/assets/';
  const chars=[
    ['かい・魔導士','kai-mage.png'],['そら・剣士','sora-swordsman.png'],['りく・忍者','riku-ninja.png'],
    ['つき・アーチャー','tsuki-archer.png'],['なみ・守護騎士','nami-guardian-knight.png'],['さく・僧侶','saku-cleric-healer.png']
  ];
  const getFound=()=>{try{return JSON.parse(localStorage.getItem('numberCoreMonsters')||'[]')}catch{return[]}};
  const getAll=()=>window.NUMBER_CORE_MONSTERS?.all||[];
  const style=document.createElement('style');
  style.textContent=`
  body.start-open .game-shell,body.start-open .combo-hud,body.start-open .status,body.start-open .skill-label,body.start-open .log{visibility:hidden;pointer-events:none}
  .start-screen{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;background:linear-gradient(180deg,#eef8f1 0%,#dcefe4 100%);overflow:auto}
  .start-screen.hidden{display:none}
  .start-wrap{width:min(1080px,100%);min-height:min(680px,calc(100vh - 48px));display:grid;grid-template-columns:1.15fr .85fr;gap:18px;align-items:stretch}
  .start-main,.start-side{border:1px solid #bfd8c8;border-radius:28px;background:#ffffffee;box-shadow:0 18px 55px #37664a20}
  .start-main{position:relative;overflow:hidden;padding:44px 46px;display:flex;flex-direction:column;justify-content:center}
  .start-main:before{content:"";position:absolute;width:360px;height:360px;border-radius:50%;right:-150px;top:-150px;background:#e3f2e8}
  .start-kicker{position:relative;font-size:13px;font-weight:900;letter-spacing:.12em;color:#5c8a6d;margin-bottom:10px}
  .start-title{position:relative;margin:0;color:#315c42;font-size:clamp(34px,5vw,62px);line-height:1.05;font-weight:1000;letter-spacing:-.04em}
  .start-title b{display:block;color:#6d9b79}
  .start-copy{position:relative;margin:18px 0 24px;color:#547061;font-size:16px;font-weight:800;line-height:1.8}
  .start-actions{position:relative;display:grid;gap:10px;max-width:520px}
  .start-btn{border:0;border-radius:16px;padding:16px 20px;font-size:16px;font-weight:1000;cursor:pointer;box-shadow:0 6px 0 #b7cfbf;background:#eaf5ed;color:#3f6d50}
  .start-btn:active{transform:translateY(3px);box-shadow:0 3px 0 #b7cfbf}
  .start-btn.primary{background:#6f9f7c;color:#fff;box-shadow:0 6px 0 #50795c;font-size:19px}
  .start-sub{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .start-side{padding:22px;display:flex;flex-direction:column;justify-content:space-between;min-height:420px;overflow:hidden}
  .start-scene{position:relative;flex:1;min-height:350px;border-radius:20px;background-image:url("${BASE}fantasy/backgrounds/forest.webp");background-size:cover;background-position:center;overflow:hidden;display:flex;align-items:end;justify-content:center}
  .start-scene:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#16332366,transparent 55%)}
  .start-character{position:relative;z-index:1;width:min(78%,360px);height:min(78%,360px);object-fit:contain;filter:drop-shadow(0 14px 12px #16332355);animation:startFloat 3s ease-in-out infinite}
  .start-tip{padding:12px 4px 0;text-align:center;color:#668174;font-size:12px;font-weight:800}
  @keyframes startFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
  .book-modal{position:fixed;inset:0;z-index:10001;display:none;align-items:center;justify-content:center;padding:18px;background:#17342488}
  .book-modal.open{display:flex}.book-panel{width:min(1100px,100%);max-height:92vh;overflow:auto;background:#f8fcf9;border:1px solid #c2dccb;border-radius:24px;padding:20px;box-shadow:0 25px 80px #17342455}
  .book-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.book-head h2{margin:0;color:#315c42}.book-head small{color:#668174;font-weight:900}.book-close{border:1px solid #c2dccb;background:#fff;border-radius:12px;padding:9px 13px;font-weight:900;color:#4d735c}
  .book-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:9px}.book-item{min-height:135px;border:1px solid #cbded3;border-radius:14px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:7px;text-align:center}.book-item img{width:80px;height:80px;object-fit:contain}.book-item b{font-size:11px;color:#3e604c}.book-item small{font-size:9px;color:#81958a}.book-item.locked img{filter:grayscale(1);opacity:.08}.book-item.locked b{color:#a5b2aa}.book-item.rare{box-shadow:inset 0 0 0 2px #e3c56d}
  @media(max-width:800px){.start-wrap{grid-template-columns:1fr}.start-main{padding:34px 28px}.start-side{display:none}.book-grid{grid-template-columns:repeat(4,1fr)}}
  @media(max-width:520px){.start-screen{padding:12px}.start-wrap{min-height:calc(100vh - 24px)}.start-main{border-radius:22px;padding:30px 20px}.start-title{font-size:40px}.start-sub{grid-template-columns:1fr}.book-grid{grid-template-columns:repeat(3,1fr)}.book-item{min-height:105px}.book-item img{width:62px;height:62px}}
  `;
  document.head.appendChild(style);
  function makeBook(){
    const modal=document.createElement('div');modal.className='book-modal';modal.innerHTML='<div class="book-panel"><div class="book-head"><div><h2>📖 モンスター図鑑</h2><small id="startBookCount"></small></div><button class="book-close">とじる</button></div><div id="startBookGrid" class="book-grid"></div></div>';
    document.body.appendChild(modal);modal.querySelector('.book-close').onclick=()=>modal.classList.remove('open');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};return modal;
  }
  function refreshBook(modal){
    const all=getAll(),found=new Set(getFound()),grid=modal.querySelector('#startBookGrid');
    if(!all.length){grid.innerHTML='<p>図鑑データを読み込み中…</p>';return}
    const normal=all.filter(x=>!x.rare),rare=all.filter(x=>x.rare),n=normal.filter(x=>found.has(x.name)).length,r=rare.filter(x=>found.has(x.name)).length;
    modal.querySelector('#startBookCount').textContent=`${n}/${normal.length} 発見 ＋ ⭐レア ${r}/${rare.length}`;
    grid.innerHTML=all.map(x=>{const ok=found.has(x.name);return `<div class="book-item ${ok?'':'locked'} ${x.rare?'rare':''}"><img src="${x.image}" alt=""><b>${ok?x.name:'？？？？'}</b><small>CORE ${x.core}${x.rare?'　⭐レア':''}</small></div>`}).join('');
  }
  function boot(){
    document.body.classList.add('start-open');
    const screen=document.createElement('div');screen.className='start-screen';screen.innerHTML=`<div class="start-wrap"><section class="start-main"><div class="start-kicker">NUMBER CORE ADVENTURE</div><h1 class="start-title">数覚バトル<b>ナンバーコア！</b></h1><p class="start-copy">数字を組み合わせて、COREをねらえ！<br>JUSTを決めて、モンスターを仲間にしよう。</p><div class="start-actions"><button class="start-btn primary" id="startBattle">⚔️ ぼうけんをはじめる</button><div class="start-sub"><button class="start-btn" id="openBook">📖 モンスター図鑑</button><button class="start-btn" id="startHelp">💡 あそびかた</button></div></div></section><aside class="start-side"><div class="start-scene"><img id="startCharacter" class="start-character" alt="ナビキャラ"></div><div class="start-tip">ナビキャラといっしょに、数字の力を見つけよう！</div></aside></div>`;
    document.body.appendChild(screen);
    const c=chars[Math.floor(Math.random()*chars.length)];document.getElementById('startCharacter').src=BASE+'fantasy/'+c[1];
    const modal=makeBook();
    document.getElementById('openBook').onclick=()=>{refreshBook(modal);modal.classList.add('open')};
    document.getElementById('startHelp').onclick=()=>alert('① 手札から数字を2〜3枚選ぶ\n② ＋・−・×・÷で式をつくる\n③ COREに近づけよう！\n④ COREぴったりのJUSTでコンボをねらおう！');
    document.getElementById('startBattle').onclick=()=>{
      screen.classList.add('hidden');document.body.classList.remove('start-open');
      if(typeof window.startNumberCore==='function')window.startNumberCore();
      else {const restart=document.getElementById('restartBtn');if(restart)restart.click();}
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();