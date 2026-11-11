const tabs=[...document.querySelectorAll('.tab')];
const screens=[...document.querySelectorAll('.screen')];
function showScreen(id){
  screens.forEach(s=>s.classList.toggle('active',s.id===id));
  tabs.forEach(t=>t.classList.toggle('active',t.dataset.screen===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
tabs.forEach(t=>t.addEventListener('click',()=>showScreen(t.dataset.screen)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.go)));
document.querySelectorAll('.care-tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.care-tab').forEach(t=>t.classList.toggle('selected',t===tab));
  document.querySelectorAll('.plan-panel').forEach(p=>p.classList.toggle('plan-active',p.id===tab.dataset.tab));
}));


// Demo-only interactions. These do not connect to real devices, patient records or messaging services.
const demoModal=document.getElementById('demoModal');
function openDemo(title,text,kicker='DEMO PREVIEW'){
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalText').textContent=text;
  document.getElementById('modalKicker').textContent=kicker;
  demoModal.classList.add('open');demoModal.setAttribute('aria-hidden','false');
}
function closeDemo(){demoModal.classList.remove('open');demoModal.setAttribute('aria-hidden','true')}
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeDemo));
document.getElementById('syncDevice')?.addEventListener('click',()=>openDemo('Wearable sync preview','Your smartwatch or fitness band connection will be configured here. This prototype is showing sample activity values only.','DEVICE INTEGRATION'));
document.getElementById('connectWearable')?.addEventListener('click',()=>openDemo('Connect your wearable','In the live app, patients can securely connect supported Apple Health, Google Fit or wearable services after granting permissions. No device is connected in this demo.','DEVICE INTEGRATION'));
document.getElementById('viewReport')?.addEventListener('click',()=>openDemo('Monthly health report','A live report can summarize weight, BMI, blood pressure, heart rate, activity and sleep trends for discussion with your care team. The figures in this preview are fictional.','PROGRESS REPORT'));
document.getElementById('messageTeam')?.addEventListener('click',()=>openDemo('Message your care team','Secure patient-to-team messaging, replies and attachments can be added in the production version. This preview does not send messages.','PATIENT ENGAGEMENT'));
document.getElementById('logMeal')?.addEventListener('click',()=>openDemo('Log a meal','Meal logging can capture food items, portions, calories and nutritional breakdown. This is a visual prototype; entries are not saved.','NUTRITION TRACKING'));
document.querySelector('.bell')?.addEventListener('click',()=>openDemo('Your reminders','Upcoming demo reminders: Nutrition follow-up · 14 Nov, Yoga practice · Friday 7:00 AM, Daily wellness check-in · 8:00 PM.','NOTIFICATIONS'));
