/* Kruise scent quiz — reads JSON from #kruise-quiz-data, renders the question flow,
   the match panel and the all-scents grid. mode:"shopify" adds to the real cart,
   mode:"demo" just counts (used by the design reference render). */
(function(){
var dataNode=document.getElementById('kruise-quiz-data');if(!dataNode)return;
var data=JSON.parse(dataNode.textContent);
var mode=data.mode||'demo',keys=[],scents={};
data.scents.forEach(function(s){scents[s.key]=s;keys.push(s.key)});
var questions=data.questions||[],idx=0,picks=[],cart=0;
function el(id){return document.getElementById(id)}
var steps=el('quizSteps'),count=el('quizCount'),qT=el('quizQ'),qH=el('quizHint'),opts=el('quizOpts'),back=el('quizBack'),card=el('quizCard'),result=el('quizResult'),grid=el('scentGrid'),cartCount=el('cartCount');
function pad(n){return n<10?'0'+n:''+n}
function tags(s){return (s.notes||[]).map(function(n){return '<span class="tag tag--'+s.flavor+'">'+n+'</span>'}).join('')}
function renderQ(){
 var q=questions[idx];if(!q)return;
 steps.innerHTML=questions.map(function(_,i){return '<div class="kq-step'+(i<idx||picks[i]!=null?' is-done':'')+'"></div>'}).join('');
 count.textContent='Question '+pad(idx+1)+' / '+pad(questions.length);
 qT.textContent=q.q;qH.textContent=q.hint||'';
 opts.innerHTML=q.opts.map(function(o,i){
  return '<button class="kq-opt'+(picks[idx]===i?' is-picked':'')+'" data-i="'+i+'"><span class="kq-dot" style="background:var(--'+o.flavor+')"></span><span><b>'+o.label+'</b><span>'+(o.sub||'')+'</span></span></button>';
 }).join('');
 back.disabled=idx===0;
}
function tally(){
 var t={};keys.forEach(function(k){t[k]=0});
 picks.forEach(function(p,i){var s=(questions[i].opts[p]||{}).score||{};Object.keys(s).forEach(function(k){if(t[k]!=null)t[k]+=s[k]})});
 return keys.slice().sort(function(a,b){return t[b]-t[a]});
}
function bump(n){cart+=n;if(cartCount)cartCount.textContent=cart}
function addToCart(list){
 if(mode==='shopify'){
  var items=list.filter(function(k){return scents[k]&&scents[k].variantId}).map(function(k){return {id:scents[k].variantId,quantity:1}});
  if(!items.length)return;
  fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:items})})
   .then(function(r){return r.json()}).then(function(){return fetch('/cart.js')})
   .then(function(r){return r.json()}).then(function(c){if(cartCount)cartCount.textContent=c.item_count})
   .catch(function(){bump(items.length)});
 }else{bump(list.length)}
}
function finish(){
 var order=tally(),w=scents[order[0]],r1=scents[order[1]],r2=scents[order[2]];
 card.hidden=true;result.hidden=false;
 var trio=order.slice(0,3);
 result.innerHTML='<div class="kq-win">'
 +'<div class="kq-win__top" style="background:var(--'+w.flavor+'-100)"><span class="kq-win__badge">Your match</span>'
 +'<img class="kq-win__pack" src="'+w.image+'" alt="'+w.name+' vent clip pack"></div>'
 +'<div class="kq-win__body"><h2 class="kq-win__name">'+w.name+'</h2>'
 +'<div class="kq-tags">'+tags(w)+'</div>'
 +'<p class="kq-win__blurb">'+w.blurb+'</p>'
 +'<div class="kq-buy"><span class="kq-price">'+w.price+'</span>'
 +'<button class="kbtn kbtn--'+w.flavor+' kbtn--lg" data-add="'+w.key+'">Add to cart</button>'
 +'<button class="kbtn kbtn--outline kbtn--lg" data-add="'+trio.join(',')+'">Build my 3-pack</button></div>'
 +'<button class="kq-text" id="quizRetake" style="justify-self:start">↺ Retake the quiz</button></div></div>'
 +'<div class="kq-runners"><h3 class="kq-runners__h">Also worth a sniff</h3><div class="kq-runners__grid">'
 +[r1,r2].map(function(s){return '<div class="kq-mini"><img src="'+s.image+'" alt="'+s.name+' pack"><span><b>'+s.name+'</b><span>'+s.mood+' · '+(s.notes||[]).join(' + ')+'</span></span></div>'}).join('')
 +'</div></div>';
 el('quizRetake').addEventListener('click',function(){idx=0;picks=[];result.hidden=true;card.hidden=false;renderQ()});
 if(window.lucide)window.lucide.createIcons();
}
opts.addEventListener('click',function(e){
 var b=e.target.closest('.kq-opt');if(!b)return;
 picks[idx]=+b.dataset.i;
 Array.prototype.forEach.call(opts.children,function(c){c.classList.remove('is-picked')});
 b.classList.add('is-picked');
 setTimeout(function(){if(idx<questions.length-1){idx++;renderQ()}else{finish()}},260);
});
back.addEventListener('click',function(){if(idx>0){idx--;renderQ()}});
result.addEventListener('click',function(e){var b=e.target.closest('[data-add]');if(b)addToCart(b.dataset.add.split(','))});
if(grid){
 grid.innerHTML=keys.map(function(k){
  var s=scents[k];
  return '<article class="kq-scent"><div class="kq-scent__top" style="background:var(--'+s.flavor+'-100)">'
  +'<img src="'+s.image+'" alt="'+s.name+' vent clip pack"></div>'
  +'<div class="kq-scent__body"><div><div class="kq-scent__mood">'+s.mood+'</div><h3 class="kq-scent__name">'+s.name+'</h3></div>'
  +'<div class="kq-tags">'+tags(s)+'</div>'
  +'<p class="kq-scent__blurb">'+s.blurb+'</p>'
  +'<div class="kq-meter">Sweetness<i>'+[1,2,3,4,5].map(function(n){return '<u style="background:'+(n<=s.sweet?'var(--'+s.flavor+')':'var(--white)')+'"></u>'}).join('')+'</i></div>'
  +'<div class="kq-scent__foot"><span class="kq-scent__price">'+s.price+'</span><button class="kbtn kbtn--'+s.flavor+' kbtn--sm" data-add="'+s.key+'">Add</button></div></div></article>';
 }).join('');
 grid.addEventListener('click',function(e){var b=e.target.closest('[data-add]');if(b)addToCart(b.dataset.add.split(','))});
}
renderQ();
if(window.lucide)window.lucide.createIcons();
})();
