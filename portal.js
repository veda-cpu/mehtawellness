const navButtons = [...document.querySelectorAll('.nav-item')];
const overview = document.getElementById('overviewView');
const other = document.getElementById('otherView');
const labels = {
  overview:['Overview','Good morning, Dr. Mehta','Here’s what’s happening across your care team today.','▦','Your care at a glance','A connected overview of patient activity, appointments and team updates.'],
  patients:['Patients','Patient directory','Find and review patient profiles from one place.','♙','Patient information','Search patients by their unique ID and open their complete care history.'],
  records:['Medical records','Medical records','Reports, consultation notes and health history in one place.','▤','Centralized health records','A secure records area for reports, history and clinician notes.'],
  nutrition:['Nutrition plans','Nutrition & diet plans','Personalized nutrition plans and follow-up updates.','◒','Nutrition workspace','Review meal plans, habits, nutrition notes and follow-up progress.'],
  yoga:['Yoga progress','Yoga & movement','Session attendance and progress notes from your yoga team.','✺','Yoga practice tracker','Keep session attendance, practice observations and progress together.'],
  meditation:['Meditation','Mindfulness & meditation','Support mindful routines and track personal practice.','☼','Mindfulness journey','A dedicated place for guided sessions, check-ins and reflection notes.'],
  timeline:['Care timeline','Patient care timeline','A chronological view of consultations and team updates.','◷','A connected care story','See consultations, reports, nutrition updates and wellness milestones in order.'],
  team:['Team access','Care team & permissions','Coordinate access for every role in the patient journey.','⌘','Team permissions','Manage doctors, nutritionists, yoga instructors and administrators with role-specific access.']
};
function showView(key){
  const d=labels[key]||labels.overview;
  navButtons.forEach(b=>b.classList.toggle('active',b.dataset.view===key));
  document.getElementById('crumbTitle').textContent=d[0];
  document.getElementById('pageTitle').innerHTML=d[1]+' <span>✦</span>';
  document.getElementById('pageSubtitle').textContent=d[2];
  overview.classList.toggle('active-view',key==='overview');
  other.classList.toggle('active-view',key!=='overview');
  document.getElementById('otherIcon').textContent=d[3];
  document.getElementById('otherTitle').textContent=d[4];
  document.getElementById('otherDescription').textContent=d[5];
  document.getElementById('otherCardTitle').textContent=d[4];
  document.getElementById('pageTitle').scrollIntoView({block:'nearest'});
}
navButtons.forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.jump)));
const roleSelect=document.getElementById('roleSelect');
roleSelect.addEventListener('change',()=>{
  const names={admin:'Administrator',doctor:'Doctor',nutritionist:'Nutritionist',yoga:'Yoga instructor'};
  document.getElementById('roleName').textContent=names[roleSelect.value];
  const roleViews={admin:['overview','patients','records','nutrition','yoga','meditation','timeline','team'],doctor:['overview','patients','records','timeline'],nutritionist:['overview','patients','nutrition','timeline'],yoga:['overview','patients','yoga','meditation','timeline']};
  const allowed=roleViews[roleSelect.value];
  navButtons.forEach(b=>{b.hidden=!allowed.includes(b.dataset.view)});
  if(!allowed.includes(document.querySelector('.nav-item.active')?.dataset.view))showView('overview');
});
const search=document.getElementById('patientSearch');
search?.addEventListener('input',()=>{
  const q=search.value.toLowerCase();
  document.querySelectorAll('#patientRows tr').forEach(row=>row.style.display=row.textContent.toLowerCase().includes(q)?'':'none');
});
const modal=document.getElementById('modal');
document.getElementById('addPatient').addEventListener('click',()=>modal.classList.add('open'));
document.getElementById('closeModal').addEventListener('click',()=>modal.classList.remove('open'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
document.getElementById('savePatient').addEventListener('click',()=>{
  const name=document.getElementById('newName').value.trim();
  const id=document.getElementById('newId').value.trim();
  const email=document.getElementById('newEmail').value.trim();
  if(!name||!id){alert('Please enter a patient name and unique ID.');return}
  const initials=name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
  const tr=document.createElement('tr');
  tr.innerHTML=`<td><div class="person"><span class="person-avatar sage">${initials}</span><span><b></b><small></small></span></div></td><td></td><td><span class="pill pending">New</span></td><td>Just added</td><td><button class="more" aria-label="Open patient">↗</button></td>`;
  tr.querySelector('.person b').textContent=name;
  tr.querySelector('.person small').textContent=email||'No email added';
  tr.children[1].textContent=id;
  document.getElementById('patientRows').prepend(tr);
  ['newName','newId','newEmail'].forEach(x=>document.getElementById(x).value='');
  modal.classList.remove('open');
  showView('patients');
});
