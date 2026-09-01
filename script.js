const MAX_HP=10, HAND_SIZE=5, CORE=30;
const ranges=[
  {min:20,max:24,name:'防御',icon:'🛡️'},
  {min:25,max:29,name:'攻撃',icon:'⚔️'},
  {min:30,max:30,name:'JUST',icon:'🌟',just:true},
  {min:31,max:35,name:'強攻撃',icon:'💥'},
  {min:36,max:40,name:'特殊',icon:'✨'}
];
const emojis=['👾','👹','🤖','🐲','🧟','🦖','👻','🦂'];
let state;

const $=id=>document.getElementById(id);
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function makeDeck(){
  const cards=[];
  for(let n=0;n<=20;n++) for(let i=0;i<(n<=10?3:2);i++) cards.push(n);
  return shuffle(cards);
}
function reset(){
  state={deck:makeDeck(),discard:[],hand:[],selected:[],op:null,playerHP:MAX_HP,enemyHP:MAX_HP,changeUsed:false,turn:0,gameOver:false};
  $('enemyEmoji').textContent=emojis[Math.floor(Math.random()*emojis.length)];
  draw(HAND_SIZE); log('バトル開始！ コアナンバーは 30。');
  render();
}
function draw(n){for(let i=0;i<n;i++){if(!state.deck.length){state.deck=shuffle(state.discard);state.discard=[]}if(state.deck.length)state.hand.push(state.deck.pop())}}
function findCommand(value){return ranges.find(r=>value>=r.min&&value<=r.max)}
function render(){
  $('coreNumber').textContent=CORE;
  $('enemyHpText').textContent=`HP ${state.enemyHP} / ${MAX_HP}`;
  $('playerHpText').textContent=`HP ${state.playerHP} / ${MAX_HP}`;
  $('enemyHpBar').style.width=`${state.enemyHP/MAX_HP*100}%`;
  $('playerHpBar').style.width=`${state.playerHP/MAX_HP*100}%`;
  $('handCount').textContent=`(${state.hand.length}枚)`;
  $('hand').innerHTML='';
  state.hand.forEach((n,i)=>{const b=document.createElement('button');b.className='number-card'+(state.selected.includes(i)?' selected':'');b.textContent=n;b.onclick=()=>toggleCard(i);$('hand').appendChild(b)});
  $('commandCards').innerHTML=ranges.map(r=>`<div class="command ${r.just?'just':''}"><strong>${r.icon} ${r.name}</strong><small>${r.min===r.max?r.min:`${r.min}〜${r.max}`}</small></div>`).join('');
  $('rangeGuide').innerHTML=ranges.map(r=>`<span>${r.name} ${r.min===r.max?r.min:`${r.min}〜${r.max}`}</span>`).join('');
  $('changeBtn').disabled=state.changeUsed||state.gameOver;
  updateExpression();
}
function toggleCard(i){
  if(state.gameOver)return;
  const p=state.selected.indexOf(i);
  if(p>=0)state.selected.splice(p,1); else {if(state.selected.length>=4)return;state.selected.push(i)}
  updateExpression();render();
}
function calc(){
  if(state.selected.length<2||!state.op)return null;
  const nums=state.selected.map(i=>state.hand[i]);
  let value;
  if(state.op==='+') value=nums.reduce((a,b)=>a+b,0);
  else if(state.op==='-') value=nums.slice(1).reduce((a,b)=>a-b,nums[0]);
  else if(state.op==='*') value=nums.reduce((a,b)=>a*b,1);
  else {value=nums[0];for(let i=1;i<nums.length;i++){if(nums[i]===0)return null;value/=nums[i]}}
  if(!Number.isInteger(value)||value<0||value>1000)return null;
  return {nums,value};
}
function updateExpression(){
  const c=calc();
  $('expression').textContent=c?`${c.nums.join(` ${state.op} `)} ＝ ${c.value}`:'数字を2枚以上選択して、演算子を選んでください';
  $('executeBtn').disabled=!c||!findCommand(c.value)||state.gameOver;
  document.querySelectorAll('#operators button').forEach(b=>b.classList.toggle('active',b.dataset.op===state.op));
}
document.querySelectorAll('#operators button').forEach(b=>b.onclick=()=>{if(!state.gameOver){state.op=b.dataset.op;updateExpression()}});
$('executeBtn').onclick=playerExecute;
$('changeBtn').onclick=changeCard;
$('restartBtn').onclick=reset;
$('nextBtn').onclick=()=>{ $('overlay').classList.add('hidden'); reset(); };
function playerExecute(){
  const c=calc(),cmd=c&&findCommand(c.value);if(!c||!cmd)return;
  const used=state.selected.map(i=>state.hand[i]);
  [...state.selected].sort((a,b)=>b-a).forEach(i=>state.hand.splice(i,1));
  state.discard.push(...used);state.selected=[];state.op=null;
  applyCommand(cmd,'あなた',c.value);
  if(state.enemyHP<=0){finishWin();return}
  draw(HAND_SIZE-state.hand.length);state.changeUsed=false;render();
  setTimeout(cpuTurn,650);
}
function applyCommand(cmd,who,value){
  const just=value===CORE;
  let text=`${who}：${value} → ${cmd.icon}${cmd.name}`;
  if(cmd.name==='攻撃'){state.enemyHP=Math.max(0,state.enemyHP-1);text+='（1ダメージ）'}
  else if(cmd.name==='強攻撃'){state.enemyHP=Math.max(0,state.enemyHP-2);text+='（2ダメージ）'}
  else if(cmd.name==='防御'){state.playerGuard=1;text+='（次の攻撃を1軽減）'}
  else if(cmd.name==='特殊'){draw(1);text+='（カードを1枚ゲット）'}
  if(just){text+=' 🌟 JUST！';if(cmd.name==='攻撃'){state.enemyHP=Math.max(0,state.enemyHP-1);text+=' 追加1ダメージ！'}else if(cmd.name==='強攻撃'){state.playerGuard=(state.playerGuard||0)+1;text+=' さらに防御力+1！'}else if(cmd.name==='防御'){state.playerGuard=(state.playerGuard||0)+1;text+=' 防御力+1！'}else if(cmd.name==='特殊'){draw(1);text+=' さらに1枚ゲット！'}}
  log(text);status(text);
}
function cpuTurn(){
  if(state.gameOver)return;
  const choice=cpuChoose();
  if(!choice){log('CPU：今回はうまく数字を作れなかった！');draw(HAND_SIZE-state.hand.length);state.changeUsed=false;render();return}
  const {indices,op,value,cmd}=choice;
  const nums=indices.map(i=>state.hand[i]);
  [...indices].sort((a,b)=>b-a).forEach(i=>state.hand.splice(i,1));
  state.discard.push(...nums);applyCpuCommand(cmd,value);log(`CPU：${nums.join(` ${op} `)} ＝ ${value} → ${cmd.icon}${cmd.name}${value===CORE?' 🌟 JUST！':''}`);
  if(state.playerHP<=0){finishLose();return}
  draw(HAND_SIZE-state.hand.length);state.changeUsed=false;state.turn++;render();
}
function applyCpuCommand(cmd,value){
  if(cmd.name==='攻撃')state.playerHP=Math.max(0,state.playerHP-(state.playerGuard?0:1));
  if(cmd.name==='強攻撃')state.playerHP=Math.max(0,state.playerHP-(state.playerGuard?1:2));
  if(cmd.name==='特殊')draw(1);
  if(cmd.name==='防御')state.cpuGuard=1;
  if(value===CORE){
    if(cmd.name==='攻撃')state.playerHP=Math.max(0,state.playerHP-(state.playerGuard?0:1));
    if(cmd.name==='強攻撃')state.cpuGuard=1;
  }
  state.playerGuard=0;
}
function cpuChoose(){
  const candidates=[];const h=state.hand;
  for(let i=0;i<h.length;i++)for(let j=i+1;j<h.length;j++){
    const pairs=[[h[i]+h[j],'+'],[h[i]-h[j],'-'],[h[j]-h[i],'-'],[h[i]*h[j],'*']];
    if(h[i]!==0)pairs.push([h[j]/h[i],'/']);if(h[j]!==0)pairs.push([h[i]/h[j],'/']);
    for(const [value,op] of pairs)if(Number.isInteger(value)&&value>=0&&value<=1000){const cmd=findCommand(value);if(cmd)candidates.push({indices:[i,j],op,value,cmd})}
  }
  if(!candidates.length)return null;
  const just=candidates.filter(x=>x.value===CORE);
  const strong=candidates.filter(x=>x.cmd.name==='強攻撃');
  if(state.playerHP<=2&&just.length)return just[Math.floor(Math.random()*just.length)];
  if(state.enemyHP<=3&&strong.length)return strong[Math.floor(Math.random()*strong.length)];
  return candidates.sort((a,b)=>Math.abs(a.value-CORE)-Math.abs(b.value-CORE))[0];
}
function changeCard(){
  if(state.changeUsed||state.gameOver)return;
  const idx=state.selected[0]??0;if(state.hand.length===0)return;
  state.discard.push(state.hand.splice(idx,1)[0]);draw(1);state.selected=[];state.op=null;state.changeUsed=true;log('チェンジ！ 手札を1枚交換した。');status('カードを交換した！');render();
}
function finishWin(){state.gameOver=true;render();status('勝利！ モンスターを倒した！');setTimeout(catchChance,550)}
function finishLose(){state.gameOver=true;render();showResult('敗北…','😵','数字を組み合わせて、もう一度挑戦しよう！')}
function catchChance(){
  state.catchMode=true;state.gameOver=false;state.selected=[];state.op=null;
  state.hand=[];state.deck=makeDeck();draw(HAND_SIZE);render();
  status('ゲットチャンス！ コアナンバー30をピッタリ作れ！');
  $('executeBtn').disabled=true;$('changeBtn').disabled=true;
  const original=$('executeBtn').onclick;$('executeBtn').onclick=catchExecute;
  state.catchOriginal=original;
}
function catchExecute(){
  const c=calc();if(!c)return;
  if(c.value===CORE){state.catchMode=false;showResult('ゲット！','🎉','30 JUST！ モンスターを仲間にした！');$('executeBtn').onclick=state.catchOriginal;return}
  state.catchMode=false;showResult('逃げられた！','💨',`${c.value} だった！ コアナンバー30にピッタリ届かなかった。`);$('executeBtn').onclick=state.catchOriginal;
}
function showResult(title,emoji,text){$('resultTitle').textContent=title;$('resultEmoji').textContent=emoji;$('resultText').textContent=text;$('nextBtn').textContent='もう一度遊ぶ';$('overlay').classList.remove('hidden')}
function status(t){$('status').textContent=t}
function log(t){const p=document.createElement('p');p.textContent=t;$('log').prepend(p);while($('log').children.length>12)$('log').lastChild.remove()}
reset();
