const $ = (id) => document.getElementById(id);
const glow = $("cursorGlow");
window.addEventListener("pointermove", e => { if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";} });
const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

$("menuBtn").addEventListener("click",()=>document.querySelector(".topbar nav").classList.toggle("open"));
document.querySelectorAll(".topbar nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".topbar nav").classList.remove("open")));

const rules = [
  {name:"OTP / one-time password",re:/\b(otp|one.time.password)\b/i,why:"A message involving an OTP deserves caution. Never disclose an OTP to anyone."},
  {name:"PIN / password request",re:/\b(upi\s*pin|pin|password|passcode|cvv)\b/i,why:"Never share your UPI PIN, password, passcode or card security code."},
  {name:"Urgency or threat",re:/\b(urgent|immediately|right now|account.{0,25}(blocked|suspended|closed))\b/i,why:"Pressure and threats can rush people into unsafe decisions."},
  {name:"Unexpected reward",re:/\b(prize|lottery|winner|won a|reward|cashback)\b/i,why:"Unexpected rewards can be used to lure people into paying fees or sharing details."},
  {name:"Payment demand",re:/\b(send money|pay (now|a fee|to claim)|release fee|processing fee)\b/i,why:"Unexpected payment requests should be verified independently."},
  {name:"Suspicious link / verification",re:/\b(click here|verify (your )?account|update (your )?(kyc|account)|link below)\b/i,why:"Unverified links and account-verification prompts can lead to credential theft."},
  {name:"Remote access request",re:/\b(remote access|screen.?share|anydesk|teamviewer)\b/i,why:"Remote-access requests can expose private information and device activity."}
];
$("scanBtn").addEventListener("click",()=>{
  const msg=$("messageInput").value.trim();
  const out=$("scanResult");
  if(!msg){out.innerHTML='<div class="result-placeholder"><p>Please enter a message to analyse.</p></div>';return;}
  const found=rules.filter(r=>r.re.test(msg));
  const score=Math.min(100,found.length*25);
  const title=score>=60?"HIGH CAUTION — MULTIPLE SIGNALS":score>=25?"CAUTION — VERIFY FIRST":"NO LISTED WARNING SIGNALS";
  const color=score>=60?"#f0a16f":"#5ce5ca";
  out.innerHTML=`<div class="result-head"><div><div class="result-title">${title}</div><small style="color:#8195a5;font-size:9px">Pattern-based demo indicator · not a probability</small></div><div class="result-score" style="color:${color}">${score}<small style="font-size:11px;color:#8195a5">/100</small></div></div>
  <div class="signal-list">${found.length?found.map(x=>`<span class="signal-chip">${x.name}</span>`).join(""):'<span class="signal-chip" style="color:#7ddfc8">No listed pattern matched</span>'}</div>
  <div class="signal-reasons">${found.length?found.map(x=>`• ${x.why}`).join("<br>"):"No listed warning pattern was found. This does not prove the message is safe."}</div>
  <p style="font-size:9px;color:#e9b47d;margin:12px 0 0">Never share OTPs, UPI PINs or passwords. Verify independently through official channels.</p>`;
});

const sample = [
  {name:"Food",amount:730,color:"#55dfc4"},
  {name:"Education",amount:750,color:"#5b9ec2"},
  {name:"Shopping",amount:700,color:"#e4ac70"},
  {name:"Bills",amount:600,color:"#8b83c7"},
  {name:"Travel",amount:140,color:"#34495b"}
];
function renderSpend(){
  const total=sample.reduce((a,b)=>a+b.amount,0);
  $("totalSpend").textContent="₹"+total.toLocaleString("en-IN");
  let start=0;const parts=sample.map(x=>{const p=x.amount/total*100;const seg=`${x.color} ${start}% ${start+p}%`;start+=p;return seg;});
  $("donut").style.background=`conic-gradient(${parts.join(",")})`;
  $("legend").innerHTML=sample.map(x=>`<div><i style="background:${x.color}"></i>${x.name}</div>`).join("");
  $("categoryRows").innerHTML=sample.map(x=>`<div class="category-row"><span>${x.name}</span><strong>₹${x.amount.toLocaleString("en-IN")}</strong><span>${Math.round(x.amount/total*100)}%</span></div>`).join("");
}
$("resetData").addEventListener("click",renderSpend);renderSpend();

const quiz=[
 {q:"A caller claiming to be from your bank asks you to share an OTP to stop a payment. What do you do?",opts:["Share it if they know my name","End the call and contact the bank through an official channel","Send a screenshot of the message"],correct:1,why:"Correct. Never disclose an OTP. Contact your bank independently using its official app, website or number."},
 {q:"A stranger says you have won a prize but must pay a release fee first. What is safest?",opts:["Pay quickly before the offer expires","Share your UPI PIN to receive the prize","Do not pay; verify the offer independently"],correct:2,why:"Correct. Unexpected prize fees are a warning sign. Never share credentials or pay to claim an unverified reward."},
 {q:"A caller asks you to install remote-access software to fix a UPI issue. What should you do?",opts:["Install it and follow the caller's instructions","Decline and contact official support yourself","Share your screen and PIN"],correct:1,why:"Correct. Remote access can expose private information. Use official support and never disclose your PIN."}
];
let qi=0,done=new Set(),chosen=null;
function showQuiz(){
 const q=quiz[qi];$("quizNumber").textContent=`SCENARIO 0${qi+1} / 03`;$("quizQuestion").textContent=q.q;
 $("quizOptions").innerHTML=q.opts.map((o,i)=>`<button class="quiz-option" data-index="${i}">${String.fromCharCode(65+i)}. &nbsp; ${o}</button>`).join("");
 $("quizFeedback").textContent="";$("nextQuestion").disabled=true;$("nextQuestion").textContent=qi===2?"Finish practice ✓":"Next scenario →";chosen=null;
 $("quizOptions").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>selectAnswer(Number(btn.dataset.index))));
}
function selectAnswer(i){
 if(chosen!==null)return;chosen=i;const q=quiz[qi],correct=i===q.correct;
 document.querySelectorAll(".quiz-option").forEach((b,j)=>{b.disabled=true;if(j===q.correct)b.classList.add("correct");else if(j===i)b.classList.add("wrong");});
 $("quizFeedback").textContent=(correct?"✓ ":"↗ ")+q.why;done.add(qi);
 $("quizProgress").textContent=`${done.size} / 3 COMPLETED`;$("progressFill").style.width=(done.size/3*100)+"%";$("nextQuestion").disabled=false;
}
$("nextQuestion").addEventListener("click",()=>{if(qi<2){qi++;showQuiz();}else{qi=0;showQuiz();$("quizFeedback").textContent="Practice complete. Keep pausing, verifying and protecting."; $("nextQuestion").textContent="Practise again ↻";}});
showQuiz();


// LINK LENS — transparent local heuristics; no network lookup is performed.
const urlCheckBtn=$('urlCheck');
if(urlCheckBtn) urlCheckBtn.addEventListener('click',()=>{
 const raw=$('urlInput').value.trim(), box=$('urlResult');
 if(!raw){box.textContent='Enter a URL first.';return;}
 let u; try{u=new URL(raw.includes('://')?raw:'https://'+raw);}catch(e){box.textContent='This does not look like a valid web address. Check the spelling.';return;}
 const host=u.hostname.toLowerCase(), signals=[];
 if(u.protocol!=='https:') signals.push('The address does not use HTTPS. Avoid entering sensitive information.');
 if(/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) signals.push('The link uses a raw IP address instead of a recognisable domain.');
 if(host.includes('xn--')) signals.push('The domain contains encoded characters that can be used in lookalike domains.');
 if((host.match(/\./g)||[]).length>=4) signals.push('The domain has an unusually long chain of subdomains.');
 if(/(bit\.ly|tinyurl\.com|t\.co|goo\.gl|rb\.gy)$/i.test(host)) signals.push('This appears to use a URL-shortening service, which hides the final destination.');
 if(/(login|verify|kyc|update|secure|claim|reward|wallet|bank)/i.test(u.href)) signals.push('The URL contains login, verification, reward or finance-related wording. Check the domain carefully.');
 if(/\.(zip|mov)$/i.test(host)) signals.push('This domain uses a file-like top-level ending that deserves extra scrutiny.');
 const level=signals.length>=3?'HIGH CAUTION':signals.length?'CHECK BEFORE OPENING':'NO COMMON RED FLAGS FOUND';
 box.innerHTML=`<div class="url-verdict">${level}</div><div class="url-domain">${escapeHTML(host)}</div><ul>${(signals.length?signals:['No listed heuristic was triggered. This is not proof that the website is trustworthy.']).map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul><small>Local heuristic only · no threat-intelligence database was queried</small>`;
});
function escapeHTML(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

// Budget lab — calculations use only values entered by the visitor.
function calculateBudget(){
 const vals=['incomeInput','needsInput','wantsInput','savingsInput'].map(id=>Math.max(0,Number($(id).value)||0));
 const [income,needs,wants,savings]=vals, spent=needs+wants+savings, remaining=income-spent;
 const pct=n=>income?Math.min(100,n/income*100):0;
 $('needsBar').style.width=pct(needs)+'%';$('wantsBar').style.width=pct(wants)+'%';$('savingsBar').style.width=pct(savings)+'%';
 $('budgetRemaining').innerHTML=`₹${Math.abs(remaining).toLocaleString('en-IN')} <small>${remaining<0?'over budget':'unallocated'}</small>`;
 $('budgetStatus').textContent=remaining<0?'PLAN EXCEEDS INCOME':remaining===0?'EVERY RUPEE HAS A ROLE':'MONTHLY PLAN SUMMARY';
 $('budgetStatus').style.color=remaining<0?'#f0a16f':'#5ce5ca';
 $('budgetAdvice').textContent=income===0?'Add a monthly income or allowance to calculate your plan.':remaining<0?`Your planned allocations exceed income by ₹${Math.abs(remaining).toLocaleString('en-IN')}. Review flexible spending or savings targets; protect essentials first.`:`You have ₹${remaining.toLocaleString('en-IN')} unallocated. Consider keeping a buffer for unexpected expenses.`;
 window.currentBudget={income,needs,wants,savings,remaining};
}
$('budgetCalc')?.addEventListener('click',calculateBudget);
$('downloadPlan')?.addEventListener('click',()=>{const b=window.currentBudget||{income:8000,needs:4200,wants:2200,savings:1000,remaining:600};const content=`ARTHA GUARD — MONTHLY BUDGET PLAN\nIncome: ₹${b.income}\nEssentials: ₹${b.needs}\nFlexible spending: ₹${b.wants}\nSavings goal: ₹${b.savings}\n${b.remaining>=0?'Unallocated':'Over budget'}: ₹${Math.abs(b.remaining)}\n\nIllustrative personal planning tool. Not financial advice.`;const blob=new Blob([content],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='artha-guard-budget-plan.txt';a.click();URL.revokeObjectURL(a.href);});
calculateBudget();


/* ARTHA MONEY OS — local demo features */
(()=>{
 const $=id=>document.getElementById(id), ru=n=>'₹'+Math.round(Number(n)||0).toLocaleString('en-IN');
 const get=(id)=>Math.max(0,Number($(id)?.value)||0);
 const store={read(k,d){try{return JSON.parse(localStorage.getItem('ag_'+k))??d}catch{return d}},write(k,v){try{localStorage.setItem('ag_'+k,JSON.stringify(v))}catch{}}};
 // Financial health score: transparent weighted heuristic, not a credit score.
 function calcHealth(){let inc=get('hsIncome'),exp=get('hsExpense'),debt=get('hsDebt'),fund=get('hsFund');let save=inc?Math.max(0,(inc-exp)/inc):0,expense=inc?exp/inc:1,debtRatio=inc?debt/inc:1,months=exp?fund/exp:0;let score=Math.round(Math.max(0,Math.min(100,save*35+Math.max(0,1-expense)*25+Math.max(0,1-debtRatio)*15+Math.min(months/6,1)*25)));$('healthScore').textContent=score;$('healthArc').style.strokeDashoffset=298.5-(298.5*score/100);$('healthLabel').textContent=score>=80?'STRONG HABITS':score>=60?'BUILDING MOMENTUM':score>=40?'ROOM TO IMPROVE':'START WITH SMALL STEPS';$('scoreSavings').textContent=Math.round(save*100)+'%';$('scoreExpense').textContent=Math.round(expense*100)+'%';$('scoreDebt').textContent=Math.round(debtRatio*100)+'%';$('scoreFund').textContent=months.toFixed(1)+' mo';}
 $('healthCalc')?.addEventListener('click',calcHealth);calcHealth();
 const challenges=['Review one recurring expense and decide whether you still need it.','Check yesterday’s spending and label each purchase.','Move a small amount into your savings goal if affordable.','Compare prices before one planned purchase.','Learn one way to recognise a payment scam.'];$('dailyChallenge').textContent=challenges[new Date().getDate()%challenges.length];
 let challenge=store.read('daily',{days:[],streak:0,last:''});function drawChallenge(){let n=challenge.days.length;$('streakCount').textContent=challenge.streak;$('badgeCount').textContent=(n>=1?1:0)+(challenge.streak>=7?1:0)+(challenge.streak>=14?1:0);$('levelName').textContent=challenge.streak>=30?'Finance Master':challenge.streak>=14?'Investor':challenge.streak>=7?'Saver':'Beginner';$('badgeShelf').innerHTML=[n>=1?'🏅 First check-in':'🔒 First check-in',challenge.streak>=7?'🔥 7-day streak':'🔒 7-day streak',challenge.streak>=14?'🌟 Investor level':'🔒 Investor level'].map(x=>'<span>'+x+'</span>').join('');}drawChallenge();$('challengeDone')?.addEventListener('click',()=>{let d=new Date().toISOString().slice(0,10);if(challenge.last===d){$('dailyChallenge').textContent='Today’s check-in is already complete. Come back tomorrow!';return;}let y=new Date();y.setDate(y.getDate()-1);challenge.streak=challenge.last===y.toISOString().slice(0,10)?challenge.streak+1:1;challenge.last=d;challenge.days.push(d);store.write('daily',challenge);drawChallenge();$('dailyChallenge').textContent='Challenge completed. Small consistent actions add up!';});
 // Heatmap calendar: last 35 days, user-entered values only.
 let heat=store.read('heat',{});function drawHeat(){let today=new Date(),days=[];for(let i=34;i>=0;i--){let d=new Date(today);d.setDate(today.getDate()-i);let key=d.toISOString().slice(0,10);days.push({key,amt:heat[key]||0});}let max=Math.max(1,...days.map(x=>x.amt));$('heatmap').innerHTML=days.map(x=>`<div class="heat-cell" data-level="${x.amt?Math.min(4,Math.ceil(x.amt/max*4)):0}" title="${x.key}: ${ru(x.amt)}"><small>${Number(x.key.slice(-2))}</small></div>`).join('');let total=Object.values(heat).reduce((a,b)=>a+b,0);$('heatSummary').textContent=`${Object.keys(heat).length} days logged · Total tracked: ${ru(total)} · Highest day: ${ru(Math.max(0,...Object.values(heat)))}`;}$('heatDate').value=new Date().toISOString().slice(0,10);drawHeat();$('addHeat')?.addEventListener('click',()=>{let d=$('heatDate').value,a=get('heatAmount');if(!d||!a)return;heat[d]=(heat[d]||0)+a;store.write('heat',heat);$('heatAmount').value='';drawHeat();});
 // Time machine / compound monthly contribution illustration.
 function fv(pmt,annual,years){let r=annual/1200,n=years*12;return r? pmt*((Math.pow(1+r,n)-1)/r)*(1+r):pmt*n;}
 function drawTime(){let p=get('investAmount'),y=get('investYears'),r=get('investRate'),f=fv(p,r,y),invested=p*y*12;$('investAmountLabel').textContent=ru(p);$('investYearsLabel').textContent=y+' years';$('investRateLabel').textContent=r+'%';$('futureValue').textContent=ru(f);$('investedTotal').textContent=ru(invested);$('growthTotal').textContent=ru(Math.max(0,f-invested));let c=$('timeChart'),ctx=c.getContext('2d'),w=c.width=c.clientWidth*2,h=c.height=230;ctx.clearRect(0,0,w,h);let points=[];for(let yr=0;yr<=y;yr++)points.push(fv(p,r,yr));let max=Math.max(1,...points);ctx.lineWidth=4;ctx.strokeStyle='#5ce5ca';ctx.beginPath();points.forEach((v,i)=>{let x=15+i/(points.length-1||1)*(w-30),yy=h-15-v/max*(h-35);i?ctx.lineTo(x,yy):ctx.moveTo(x,yy)});ctx.stroke();ctx.lineTo(w-15,h-15);ctx.lineTo(15,h-15);ctx.closePath();ctx.fillStyle='rgba(92,229,202,.10)';ctx.fill();}
 ['investAmount','investYears','investRate'].forEach(id=>$(id)?.addEventListener('input',drawTime));drawTime();
 // 50/30/20 auto budget
 function autoBudget(){let n=get('autoIncome'),a=[n*.5,n*.3,n*.2],names=['Needs · 50%','Wants · 30%','Savings · 20%'],cols=['#55dfc4','#e4ac70','#719be0'];$('allocation').innerHTML=a.map((v,i)=>`<div class="alloc-row"><span>${names[i]}</span><div class="alloc-track"><i style="width:${[50,30,20][i]}%;background:${cols[i]}"></i></div><strong>${ru(v)}</strong></div>`).join('');} $('autoIncome')?.addEventListener('input',autoBudget);autoBudget();
 // Goal jar
 function goal(){let target=Math.max(1,get('goalTarget')),saved=get('goalSaved'),monthly=Math.max(1,get('goalMonthly')),pct=Math.min(100,saved/target*100),months=Math.max(0,Math.ceil((target-saved)/monthly));$('jarFill').style.height=pct+'%';$('goalPercent').textContent=Math.round(pct)+'%';$('goalResult').textContent=saved>=target?'Goal reached — congratulations!':`${months} months estimated to reach “${$('goalName').value||'your goal'}” at ${ru(monthly)} per month.`;}['goalTarget','goalSaved','goalMonthly','goalName'].forEach(id=>$(id)?.addEventListener('input',goal));$('goalUpdate')?.addEventListener('click',goal);goal();
 // Subscriptions
 let subs=store.read('subs',[]);function drawSubs(){let total=subs.reduce((a,x)=>a+x.cost,0);$('subList').innerHTML=subs.length?subs.map((x,i)=>`<div class="simple-item"><span>${x.name} · ${x.date||'date not set'}</span><b>${ru(x.cost)}</b><button data-del-sub="${i}">Remove</button></div>`).join(''):'<div class="n-note">No subscriptions added yet.</div>';$('subTotal').textContent='Monthly recurring total: '+ru(total);$('subList').querySelectorAll('[data-del-sub]').forEach(b=>b.onclick=()=>{subs.splice(+b.dataset.delSub,1);store.write('subs',subs);drawSubs();});} $('addSub')?.addEventListener('click',()=>{let name=$('subName').value.trim(),cost=get('subCost');if(!name||!cost)return;subs.push({name,cost,date:$('subDate').value});store.write('subs',subs);$('subName').value='';$('subCost').value='';drawSubs();});drawSubs();
 // Split bill
 $('splitCalc')?.addEventListener('click',()=>{let people=Math.max(1,Math.floor(get('billPeople'))),each=(get('billTotal')+get('billExtra'))/people;$('splitOutput').textContent=`Each of ${people} people pays ${ru(each)} (${each.toFixed(2)} exact).`;});
 // EMI + SIP estimators
 $('emiCalc')?.addEventListener('click',()=>{let p=get('emiPrincipal'),r=get('emiRate')/1200,n=Math.max(1,get('emiYears')*12),emi=r?p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):p/n;$('emiOutput').textContent=`Estimated monthly EMI: ${ru(emi)} · Total repayment: ${ru(emi*n)} · Interest: ${ru(emi*n-p)}.`;});
 $('sipCalc')?.addEventListener('click',()=>{let p=get('sipAmount'),r=get('sipRate'),y=get('sipYears'),f=fv(p,r,y),invested=p*y*12;$('sipOutput').textContent=`Hypothetical future value: ${ru(f)} · Contributions: ${ru(invested)} · Illustrative growth: ${ru(Math.max(0,f-invested))}.`;});
 // Category donut and city
 let spends=store.read('spends',[]),palette=['#55dfc4','#719be0','#e4ac70','#8b83c7','#e47d75','#62b3c5','#b7c879'];function drawSpend(){let map={};spends.forEach(x=>map[x.cat]=(map[x.cat]||0)+x.amt);let entries=Object.entries(map),total=entries.reduce((a,x)=>a+x[1],0),pos=0,grad=entries.map(([k,v],i)=>{let a=pos;pos+=total?v/total*100:0;return `${palette[i%palette.length]} ${a}% ${pos}%`});$('categoryDonut').style.background=total?`conic-gradient(${grad.join(',')})`:'#203542';$('spendBreakdown').innerHTML=entries.length?entries.map(([k,v],i)=>`<div class="simple-item"><span><i style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${palette[i%palette.length]};margin-right:6px"></i>${k}</span><b>${ru(v)}</b></div>`).join(''):'<div class="n-note">Add expenses to see the breakdown.</div>';let city=[...document.querySelectorAll('.city-building')],vals=['Food','Travel','Shopping','Bills','Education'].map(k=>map[k]||0),mx=Math.max(1,...vals);city.forEach((el,i)=>el.style.setProperty('--h',(55+vals[i]/mx*105)+'px'));} $('addSpend')?.addEventListener('click',()=>{let amt=get('spendAmount');if(!amt)return;spends.push({cat:$('spendCategory').value,amt});store.write('spends',spends);$('spendAmount').value='';drawSpend();});drawSpend();
 // 30-day gentle no-spend challenge
 let quest=store.read('quest',[]);function drawQuest(){let n=quest.length;$('questDays').innerHTML=Array.from({length:30},(_,i)=>`<div class="quest-day ${i<n?'done':''}" title="Day ${i+1}">${i+1}</div>`).join('');$('questCount').textContent=n+' / 30';$('questLevel').textContent=n>=30?'Finance Master':n>=14?'Investor':n>=7?'Saver':'Beginner';$('questBadges').textContent=(n>=1?1:0)+(n>=7?1:0)+(n>=30?1:0);}drawQuest();$('questCheck')?.addEventListener('click',()=>{let d=new Date().toISOString().slice(0,10);if(quest.includes(d)){$('questMessage').textContent='You have already checked in today.';return;}quest.push(d);quest=quest.slice(-30);store.write('quest',quest);drawQuest();$('questMessage').textContent='Check-in saved. Essentials are always allowed — this is about mindful choices, not deprivation.';});
 // Desktop city pointer tilt, reduced motion respected.
 const city=$('moneyCity');city?.addEventListener('mousemove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;let r=city.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;city.style.transform=`rotateX(${y*-5}deg) rotateY(${x*7}deg)`;});city?.addEventListener('mouseleave',()=>city.style.transform='');
})();
