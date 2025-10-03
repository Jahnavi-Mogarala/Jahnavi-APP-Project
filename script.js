/* script.js - JP QuizBot
   Contains question banks, quiz runner, leaderboard, export, UI helpers
*/

/* -------------------------
   QUESTION BANKS (>=10 each)
   Each entry: { id, q, choices:[], answer: index, explanation }
---------------------------*/
const BANKS = {
  java: [
    {id: 'j1', q: "Which of these is NOT a primitive type in Java?", choices: ["int","boolean","String","double"], answer:2,
     explanation: "String is a reference type (class), not a primitive."},
    {id: 'j2', q: "Which keyword is used for inheritance?", choices:["implements","extends","inherits","uses"], answer:1,
     explanation: "'extends' is used to inherit classes; 'implements' is for interfaces."},
    {id: 'j3', q: "What is the entry point method signature?", choices:["public static void main(String[] args)","public void main()","static public main()","main(String[])"], answer:0,
     explanation: "The JVM looks for 'public static void main(String[] args)' as entry point."},
    {id: 'j4', q: "Which collection preserves insertion order and allows duplicates?", choices:["HashSet","ArrayList","TreeSet","PriorityQueue"], answer:1,
     explanation: "ArrayList preserves insertion order and allows duplicates."},
    {id: 'j5', q: "Which exception is checked (compile-time)?", choices:["NullPointerException","IOException","ArithmeticException","RuntimeException"], answer:1,
     explanation: "IOException is a checked exception and must be handled or declared."},
    {id: 'j6', q: "What does 'final' on a method mean?", choices:["Can be overridden","Cannot be overridden","Private method","Static method"], answer:1,
     explanation: "final prevents a method from being overridden in subclasses."},
    {id: 'j7', q: "Which JVM memory area stores class definitions?", choices:["Stack","Heap","Method Area / PermGen / Metaspace","Native"], answer:2,
     explanation: "The Method Area (Metaspace in modern JVMs) stores class metadata."},
    {id: 'j8', q: "What is autoboxing?", choices:["Converting object to primitive","Converting primitive to wrapper automatically","Casting numbers","Manual boxing"], answer:1,
     explanation: "Autoboxing converts primitives to their wrapper types automatically."},
    {id: 'j9', q: "Which keyword makes a member belong to class (not instance)?", choices:["this","static","final","volatile"], answer:1,
     explanation: "static members belong to the class itself."},
    {id: 'j10', q: "What does 'synchronized' ensure?", choices:["Faster execution","Memory allocation","Mutual exclusion for threads","Type safety"], answer:2,
     explanation: "synchronized serializes access to a block or method across threads."},
    {id: 'j11', q: "Which method is used to compare String contents?", choices:["==","equals()","compare()","same()"], answer:1,
     explanation: "Use equals() to compare String content; '==' compares references."}
  ],

  c: [
    {id:'c1', q:"Who developed the C language?", choices:["Bjarne Stroustrup","Dennis Ritchie","James Gosling","Ken Thompson"], answer:1,
     explanation:"Dennis Ritchie at Bell Labs created C."},
    {id:'c2', q:"What does 'sizeof(char)' return in C (on most systems)?", choices:["1","2","4","Depends"], answer:0,
     explanation:"By definition sizeof(char) == 1 (byte)."},
    {id:'c3', q:"Which header defines printf?", choices:["<io.h>","<stdio.h>","<iostream>","<print.h>"], answer:1,
     explanation:"printf is declared in stdio.h."},
    {id:'c4', q:"Which operator yields address of variable?", choices:["*","&","%","$"], answer:1,
     explanation:"& gives the address of a variable (pointer)."},
    {id:'c5', q:"Which memory is typically used for local variables?", choices:["Heap","Stack","BSS","Data segment"], answer:1,
     explanation:"Local (automatic) variables are stored on the stack."},
    {id:'c6', q:"What does 'malloc' return on failure?", choices:["NULL","0","-1","Error code"], answer:0,
     explanation:"malloc returns NULL when it fails to allocate memory."},
    {id:'c7', q:"Which function frees allocated memory?", choices:["free()","delete()","dispose()","release()"], answer:0,
     explanation:"free() releases memory allocated by malloc/calloc/realloc."},
    {id:'c8', q:"What is undefined behavior?", choices:["Guaranteed error","Compiler-specific behavior that is unpredictable","Portable code","Standard behavior"], answer:1,
     explanation:"Undefined behavior is unpredictable and can vary by compiler/platform."},
    {id:'c9', q:"Which loop runs at least once?", choices:["for","while","do-while","none"], answer:2,
     explanation:"do-while executes the body before checking condition."},
    {id:'c10', q:"Which is correct array declaration?", choices:["int a = new int[5];","int a[5];","int[] a = 5;","array<int> a;"], answer:1,
     explanation:"C arrays declared as int a[5];"}
  ],

  python: [
    {id:'p1', q:"Which keyword defines a function in Python?", choices:["def","function","fun","fn"], answer:0,
     explanation:"Use def to define functions."},
    {id:'p2', q:"What is the type of [] in Python?", choices:["list","tuple","dict","set"], answer:0,
     explanation:"[] creates a list."},
    {id:'p3', q:"Which symbol starts a comment?", choices:["//","#","/*","--"], answer:1,
     explanation:"# starts a single-line comment in Python."},
    {id:'p4', q:"Which method adds an item to end of list?", choices:["add()","append()","push()","insert()"], answer:1,
     explanation:"list.append(x) appends x at the end."},
    {id:'p5', q:"Which keyword creates an anonymous function?", choices:["lambda","anon","func","def"], answer:0,
     explanation:"lambda creates small anonymous functions."},
    {id:'p6', q:"What does 'len' return for a string?", choices:["characters count","bytes used","memory size","hash"], answer:0,
     explanation:"len(s) returns number of characters."},
    {id:'p7', q:"How do you handle exceptions?", choices:["try/except","catch/throw","trap/rescue","except only"], answer:0,
     explanation:"Use try/except blocks in Python."},
    {id:'p8', q:"What is a Python dictionary?", choices:["ordered sequence","hash map of key->value","list of lists","file"], answer:1,
     explanation:"A dict maps keys to values (hash map)."},
    {id:'p9', q:"Which statement imports a module?", choices:["require math","import math","include math","using math"], answer:1,
     explanation:"import math loads the math module."},
    {id:'p10', q:"Which is true about Python variables?", choices:["Static typed","Dynamically typed","Not typed","Compile-time typed"], answer:1,
     explanation:"Python is dynamically typed; types are checked at runtime."}
  ],

  webdev: [
    {id:'w1', q:"HTML stands for?", choices:["HyperText Markup Language","Home Tool Markup","Hyperlinks Text Markup","HighText Markup"], answer:0,
     explanation:"HTML = HyperText Markup Language."},
    {id:'w2', q:"Which tag for a paragraph?", choices:["<p>","<para>","<text>","<pgraph>"], answer:0,
     explanation:"<p> defines a paragraph."},
    {id:'w3', q:"CSS property to change text color?", choices:["color","text-color","font-color","fg"], answer:0,
     explanation:"Use 'color' to change font color in CSS."},
    {id:'w4', q:"Which is JS strict equality operator?", choices:["==","=","===","!=="], answer:2,
     explanation:"=== compares value and type."},
    {id:'w5', q:"DOM stands for?", choices:["Document Object Model","Digital Object Map","Data Object Model","Document Order Model"], answer:0,
     explanation:"The DOM is the Document Object Model."},
    {id:'w6', q:"Which tag for external JS file?", choices:["<script src='...'>","<js src='...'>","<include src='...'>","<link src='...'>"], answer:0,
     explanation:"Use <script src='file.js'></script> to include JS."},
    {id:'w7', q:"Which HTTP status means OK?", choices:["200","404","500","301"], answer:0,
     explanation:"200 is OK; 404 is Not Found, 500 server error."},
    {id:'w8', q:"Which attribute sets image source?", choices:["href","src","link","path"], answer:1,
     explanation:"Use src='...' for images."},
    {id:'w9', q:"Which CSS displays items in a flex row?", choices:["display:block","display:flex","display:grid","display:inline"], answer:1,
     explanation:"display:flex enables flex layout."},
    {id:'w10', q:"Which method adds a child node in JS DOM?", choices:["appendChild","addChild","pushChild","attachChild"], answer:0,
     explanation:"appendChild attaches a child node to an element."}
  ],

  gk: [
    {id:'g1', q:"Who proposed theory of relativity?", choices:["Newton","Einstein","Galileo","Maxwell"], answer:1,
     explanation:"Albert Einstein proposed the theory of relativity."},
    {id:'g2', q:"What is the capital of Japan?", choices:["Seoul","Tokyo","Kyoto","Osaka"], answer:1,
     explanation:"Tokyo is Japan's capital."},
    {id:'g3', q:"Which planet is known as Red Planet?", choices:["Venus","Mars","Jupiter","Saturn"], answer:1,
     explanation:"Mars is the Red Planet."},
    {id:'g4', q:"Who wrote 'Hamlet'?", choices:["Shakespeare","Dickens","Austen","Tolstoy"], answer:0,
     explanation:"William Shakespeare wrote Hamlet."},
    {id:'g5', q:"Which gas is most abundant in Earth's atmosphere?", choices:["Oxygen","Nitrogen","Carbon dioxide","Helium"], answer:1,
     explanation:"Nitrogen makes up ~78% of atmosphere."},
    {id:'g6', q:"Which ocean is largest?", choices:["Atlantic","Pacific","Indian","Arctic"], answer:1,
     explanation:"Pacific Ocean is the largest."},
    {id:'g7', q:"Which country gifted Statue of Liberty?", choices:["France","England","Spain","Germany"], answer:0,
     explanation:"France gifted it to the USA."},
    {id:'g8', q:"Which metal has highest conductivity?", choices:["Copper","Silver","Gold","Aluminium"], answer:1,
     explanation:"Silver has the highest electrical conductivity."},
    {id:'g9', q:"What year did WW2 end?", choices:["1945","1939","1918","1950"], answer:0,
     explanation:"World War II ended in 1945."},
    {id:'g10', q:"What is H2O?", choices:["Hydrogen peroxide","Water","Salt","Oxygen"], answer:1,
     explanation:"H2O is the chemical formula for water."}
  ]
};

/* -------------------------
   Leaderboard storage format in localStorage:
   qb_leaderboard = JSON.stringify( [ {user, displayName, category, score, total, timestamp} , ... ] )
-------------------------*/
const LB_KEY = 'qb_leaderboard_v1';

/* -------------------------
   UI helpers
-------------------------*/
function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }
function formatTime(seconds){
  const m = Math.floor(seconds/60).toString().padStart(2,'0');
  const s = (seconds%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

/* -------------------------
   Leaderboard functions
-------------------------*/
function loadLeaderboard(){ try{ return JSON.parse(localStorage.getItem(LB_KEY) || '[]'); } catch(e){ return []; } }
function saveLeaderboard(arr){ localStorage.setItem(LB_KEY, JSON.stringify(arr)); }
function pushScore(entry){
  const arr = loadLeaderboard();
  arr.push(entry);
  saveLeaderboard(arr);
}
function topForCategory(cat, limit=10){
  const arr = loadLeaderboard().filter(x => x.category === cat);
  arr.sort((a,b)=> b.score - a.score || (new Date(b.timestamp) - new Date(a.timestamp)));
  return arr.slice(0, limit);
}

/* -------------------------
   Welcome page: leaderboard modal
-------------------------*/
function showLeaderboardModal(){
  const modal = $('#leaderboardModal') || document.getElementById('leaderboardModal');
  if (!modal) return;
  const body = modal.querySelector('.modal-body') || document.getElementById('leaderboardBody');
  const arr = loadLeaderboard().sort((a,b)=> b.score - a.score);
  if (!body) return;
  if (arr.length===0){ body.innerHTML = '<div class="small muted">No leaderboard entries yet — take a quiz!</div>'; }
  else {
    let html = `<table style="width:100%;border-collapse:collapse"><thead><tr><th>User</th><th>Category</th><th>Score</th><th>Date</th></tr></thead><tbody>`;
    arr.slice(0,100).forEach(r=>{
      html += `<tr style="border-top:1px solid rgba(255,255,255,0.03)"><td>${escapeHtml(r.displayName||r.user)}</td><td>${escapeHtml(r.category)}</td><td>${r.score}/${r.total}</td><td class="muted small">${new Date(r.timestamp).toLocaleString()}</td></tr>`;
    });
    html += '</tbody></table>';
    body.innerHTML = html;
  }
  modal.classList.remove('hidden');
}
function hideLeaderboardModal(){ const m = $('#leaderboardModal'); if (m) m.classList.add('hidden'); }
function exportLeaderboardCSV(){
  const arr = loadLeaderboard();
  if (!arr.length) return alert('No leaderboard data to export.');
  const csv = ['user,displayName,category,score,total,timestamp'].concat(arr.map(r=>{
    return `${r.user},${r.displayName||''},${r.category},${r.score},${r.total},${r.timestamp}`;
  })).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'quiz_leaderboard.csv'; a.click(); URL.revokeObjectURL(url);
}

/* -------------------------
   Minimal escape
-------------------------*/
function escapeHtml(s){
  if (s == null) return '';
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

/* -------------------------
   Quiz page logic
-------------------------*/
let state = {
  category: 'java',
  pool: [],
  current: 0,
  answers: {}, // id -> chosenIndex
  timerSec: 0,
  timerInterval: null,
  started: false,
  totalQ: 10
};

function initQuizPage(){
  // called from quiz.html
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat') || 'java';
  state.category = (BANKS[cat]) ? cat : 'java';
  const title = (cat || 'Java').toUpperCase();
  $('#quizTitle').textContent = title + ' QUIZ';
  $('#catLabel').textContent = title;
  // prefill user label if present
  const user = sessionStorage.getItem('qb_displayName') || sessionStorage.getItem('qb_username') || 'Guest';
  if ($('#userLabel')) $('#userLabel').textContent = user;

  // bind UI
  $('#startBtn').addEventListener('click', startQuiz);
  $('#prevQ').addEventListener('click', ()=> changeQuestion(state.current - 1));
  $('#nextQ').addEventListener('click', ()=> changeQuestion(state.current + 1));
  $('#submitQuizBtn').addEventListener('click', submitQuizHandler);
  $('#numQ').value = '10';
  $('#numQ').addEventListener('change', ()=> { /* nothing until start */ });
  // mini leaderboard
  renderMiniLeader();
}

function startQuiz(){
  // build pool
  const want = Number($('#numQ').value) || 10;
  state.totalQ = want;
  let bank = BANKS[state.category] || [];
  const mixed = (state.category === 'misc');
  if (mixed){
    // choose random from all
    let combined = [];
    for (const k in BANKS) combined = combined.concat(BANKS[k]);
    bank = combined;
  }
  // shuffle and slice
  const pool = shuffle([...bank]).slice(0, want);
  // if fewer available, reuse with randomization
  while (pool.length < want){
    pool.push(...shuffle([...bank]).slice(0, want - pool.length));
  }
  state.pool = pool;
  state.current = 0;
  state.answers = {};
  state.started = true;

  // timer
  const timed = $('#timedToggle').checked;
  if (timed){
    // set timer: 45 sec per question
    state.timerSec = want * 45;
    startTimer();
  } else stopTimer();

  // show area
  $('#quizArea').classList.remove('hidden');
  $('#summaryArea').classList.add('hidden');
  renderQuestion();
  updateProgressUI();
  renderMiniLeader();
}

function renderQuestion(){
  const q = state.pool[state.current];
  if (!q) return;
  const container = $('#questionContainer');
  container.innerHTML = '';
  const qDiv = document.createElement('div'); qDiv.className='question';
  qDiv.innerHTML = `<div class="q-text">Q${state.current+1}. ${escapeHtml(q.q)}</div>`;
  const opts = document.createElement('div'); opts.className='options';
  q.choices.forEach((c,i)=>{
    const id = `opt_${q.id}_${i}`;
    const chosen = state.answers[q.id] === i;
    const opt = document.createElement('label');
    opt.className = 'option';
    opt.innerHTML = `<input type="radio" name="q_${q.id}" value="${i}" ${chosen?'checked':''}> <span>${String.fromCharCode(65+i)}. ${escapeHtml(c)}</span>`;
    opt.addEventListener('click', ()=>{
      state.answers[q.id] = i;
      updateStatsNumbers();
      // if explanation visible, update immediately
      renderQuestion(); // re-render to show selection highlight
    });
    opts.appendChild(opt);
  });
  qDiv.appendChild(opts);
  // optional code area
  if (q.code){
    const pre = document.createElement('pre'); pre.textContent = q.code; pre.style.marginTop='10px';
    qDiv.appendChild(pre);
  }
  // explanation placeholder (shown after submit)
  container.appendChild(qDiv);
  updateProgressUI();
  updateStatsNumbers();
}

/* Navigation */
function changeQuestion(i){
  if (i < 0 || i >= state.pool.length) return;
  state.current = i;
  renderQuestion();
}

/* Timer */
function startTimer(){
  stopTimer();
  updateTimerUI();
  state.timerInterval = setInterval(()=>{
    state.timerSec--;
    updateTimerUI();
    if (state.timerSec <= 0){
      stopTimer();
      alert('Time is up — submitting quiz');
      submitQuizHandler();
    }
  }, 1000);
}
function stopTimer(){ if (state.timerInterval){ clearInterval(state.timerInterval); state.timerInterval = null; } $('#timerText').textContent = ''; }
function updateTimerUI(){ if ($('#timerText')) $('#timerText').textContent = formatTime(state.timerSec); }

/* Submit & scoring */
function submitQuizHandler(){
  if (!confirm('Submit quiz and view results?')) return;
  stopTimer();
  // scoring
  const total = state.pool.length;
  let correct=0, wrong=0, unanswered=0;
  const details = [];
  state.pool.forEach((q)=>{
    const sel = state.answers[q.id];
    const ok = (typeof sel !== 'undefined' && sel === q.answer);
    if (typeof sel === 'undefined') unanswered++;
    else if (ok) correct++;
    else wrong++;
    details.push({q, selected: sel});
  });
  // add to leaderboard
  const userKey = sessionStorage.getItem('qb_username') || ('visitor_' + Date.now());
  const display = sessionStorage.getItem('qb_displayName') || userKey;
  const scoreVal = Math.round((correct/total)*100);
  pushScore({ user: userKey, displayName: display, category: state.category, score: scoreVal, total: total, timestamp: new Date().toISOString() });

  // show summary
  showSummary({total, correct, wrong, unanswered, details, scoreVal});
  renderMiniLeader();
}

function showSummary(res){
  $('#quizArea').classList.add('hidden');
  const s = $('#summaryArea');
  s.classList.remove('hidden');
  let html = `<h3>Summary — ${res.correct} / ${res.total} correct (${res.scoreVal}%)</h3>`;
  html += `<p class="muted small">Saved to leaderboard under your username.</p>`;
  html += '<div class="summary-list">';
  res.details.forEach((d, idx)=>{
    const q = d.q;
    const sel = d.selected;
    const right = q.answer;
    html += `<div class="summary-item">
      <div><strong>Q${idx+1}:</strong> ${escapeHtml(q.q)}</div>
      <div style="margin-top:6px;"><strong>Your answer:</strong> ${ (typeof sel==='undefined')?'<em>Unanswered</em>': String.fromCharCode(65+sel) + '. ' + escapeHtml(q.choices[sel]) }</div>
      <div style="margin-top:6px;"><strong>Correct:</strong> ${ String.fromCharCode(65+right) }. ${ escapeHtml(q.choices[right]) }</div>
      <div style="margin-top:8px;color:var(--muted)"><strong>Explanation:</strong> ${ escapeHtml(q.explanation) }</div>
    </div>`;
  });
  html += '</div>';
  html += `<div style="margin-top:12px;"><button class="btn" onclick="retake()">Retake</button> <a class="btn btn-ghost" href="welcome.html">Choose Another Category</a> <button class="btn" onclick="downloadSummary()">Export Results</button></div>`;
  s.innerHTML = html;
}

/* Retake */
function retake(){
  state.answers = {};
  state.current = 0;
  $('#quizArea').classList.remove('hidden');
  $('#summaryArea').classList.add('hidden');
  renderQuestion();
}

/* Download summary */
function downloadSummary(){
  const filename = `quiz_${state.category}_${Date.now()}.json`;
  const payload = { pool: state.pool, answers: state.answers, category: state.category, timestamp: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

/* Stats mini */
function updateStatsNumbers(){
  const total = state.pool.length || 0;
  let correct=0, wrong=0, unanswered=0;
  state.pool.forEach(q=>{
    const sel = state.answers[q.id];
    if (typeof sel === 'undefined') unanswered++;
    else if (sel === q.answer) correct++;
    else wrong++;
  });
  if ($('#statCorrect')) $('#statCorrect').textContent = correct;
  if ($('#statWrong')) $('#statWrong').textContent = wrong;
  if ($('#statUnanswered')) $('#statUnanswered').textContent = unanswered;
}

/* Mini leaderboard (aside) */
function renderMiniLeader(){
  const mini = $('#miniLeader');
  if (!mini) return;
  const top = topForCategory(state.category, 5);
  mini.innerHTML = '';
  if (!top.length){ mini.innerHTML = '<li class="small muted">No entries</li>'; return; }
  top.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${escapeHtml(r.displayName||r.user)}</strong> — ${r.score}% <span class="muted small">(${r.total} q)</span>`;
    mini.appendChild(li);
  });
}

/* Progress UI */
function updateProgressUI(){
  const p = $('#progressText');
  if (!p) return;
  p.textContent = `${(state.current+1)} / ${state.pool.length}`;
}

/* Utility shuffle */
function shuffle(arr){
  for (let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

/* -------------------------
   Global handlers for welcome leaderboard modal
-------------------------*/
if (typeof window !== 'undefined'){
  window.showLeaderboardModal = showLeaderboardModal;
  window.hideLeaderboardModal = hideLeaderboardModal;
  window.exportLeaderboardCSV = exportLeaderboardCSV;
  // quiz page functions:
  window.initQuizPage = initQuizPage;
  window.startQuiz = startQuiz;
  window.changeQuestion = changeQuestion;
  window.submitQuizHandler = submitQuizHandler;
  window.retake = retake;
  window.downloadSummary = downloadSummary;
}

/* -------------------------
   On load: precreate localStorage keys if needed
-------------------------*/
(function init(){
  if (!localStorage.getItem(LB_KEY)) localStorage.setItem(LB_KEY, JSON.stringify([]));
})();
