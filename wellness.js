/* Isolated interactions for Nutrition, Yoga & Wellness pages. */
(function(){
  "use strict";
  const storageKey="drMehtaWellnessDemoProfile";
  const readProfile=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||"{}")}catch(_){return {}}};
  const saveProfile=(value)=>{try{localStorage.setItem(storageKey,JSON.stringify(value))}catch(_){}};
  const onboarding=document.getElementById("wellnessOnboarding");
  if(onboarding){
    const profile=readProfile();
    Object.entries({wellName:"name",wellAge:"age",wellGender:"gender",wellActivity:"activity",wellWeight:"weight",wellTarget:"targetWeight",wellDiet:"diet",wellMeals:"meals",wellSleep:"sleep",wellLifestyle:"lifestyle"}).forEach(([id,key])=>{
      const el=document.getElementById(id);if(el&&profile[key]!==undefined)el.value=profile[key];
    });
    if(profile.yogaLevel){const radio=onboarding.querySelector(`input[name="yogaLevel"][value="${CSS.escape(profile.yogaLevel)}"]`);if(radio)radio.checked=true}
    (profile.goals||[]).forEach(goal=>{const box=[...onboarding.querySelectorAll('input[name="goals"]')].find(x=>x.value===goal);if(box)box.checked=true});
    onboarding.addEventListener("submit",event=>{
      event.preventDefault();
      if(!onboarding.reportValidity())return;
      const form=new FormData(onboarding),data={};
      for(const [key,value] of form.entries()){if(key==="goals"){(data.goals||(data.goals=[])).push(value)}else data[key]=value}
      saveProfile(data);
      window.location.href="wellness-dashboard.html";
    });
  }

  const dashName=document.getElementById("dashName");
  if(dashName){
    const p=readProfile();
    dashName.textContent=p.name?p.name.split(/\s+/)[0]:"there";
    const sleep=document.getElementById("sleepPreference");if(sleep&&p.sleep)sleep.textContent=p.sleep;
    let water=5;
    try{water=Math.max(0,Math.min(8,Number(sessionStorage.getItem("drMehtaDemoWater")||5)))}catch(_){}
    const count=document.getElementById("waterCount"),stat=document.getElementById("waterStat"),glasses=document.querySelectorAll("#waterGlasses button");
    const renderWater=()=>{if(count)count.textContent=water+"/8";if(stat)stat.innerHTML=water+' <span style="font:500 11px DM Sans;color:#879894">/ 8 glasses</span>';glasses.forEach((g,i)=>g.classList.toggle("filled",i<water))};
    renderWater();
    document.getElementById("addWater")?.addEventListener("click",()=>{water=Math.min(8,water+1);try{sessionStorage.setItem("drMehtaDemoWater",String(water))}catch(_){}renderWater()});
    glasses.forEach((g,i)=>g.addEventListener("click",()=>{water=i+1;try{sessionStorage.setItem("drMehtaDemoWater",String(water))}catch(_){}renderWater()}));
    document.querySelectorAll("[data-meal]").forEach(btn=>btn.addEventListener("click",()=>{const done=btn.classList.toggle("done");btn.textContent=done?"✓ Logged":"Mark eaten"}));
    const yogaBtn=document.getElementById("completeYoga");yogaBtn?.addEventListener("click",()=>{yogaBtn.classList.add("done");yogaBtn.textContent="✓ Session completed";const bar=document.getElementById("yogaProgress");if(bar)bar.style.width="70%";const msg=document.getElementById("yogaMessage");if(msg)msg.textContent="3 of 4 weekly sessions completed in this demo."});
  }

  const grid=document.getElementById("careTeamGrid");
  if(grid){
    let active="All";
    const search=document.getElementById("teamSearch");
    const applyFilters=()=>{
      const term=(search?.value||"").trim().toLowerCase();let shown=0;
      grid.querySelectorAll(".well-pro-card").forEach(card=>{
        const category=card.dataset.category||"",hay=(card.dataset.search||"")+" "+card.textContent.toLowerCase();
        const visible=(active==="All"||category===active)&&(!term||hay.toLowerCase().includes(term));
        card.hidden=!visible;if(visible)shown++;
      });
      let empty=grid.querySelector(".well-empty");
      if(!shown&&!empty){empty=document.createElement("div");empty.className="well-empty";empty.textContent="No professionals match your search. Try another name or category.";grid.appendChild(empty)}
      if(shown&&empty)empty.remove();
    };
    document.getElementById("teamFilters")?.addEventListener("click",event=>{
      const button=event.target.closest("[data-filter]");if(!button)return;
      active=button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===button));
      applyFilters();
    });
    search?.addEventListener("input",applyFilters);
    const modal=document.getElementById("teamModal"),title=document.getElementById("modalTitle"),text=document.getElementById("modalText");
    const close=()=>modal?.classList.remove("open");
    grid.addEventListener("click",event=>{
      const profile=event.target.closest("[data-profile]"),book=event.target.closest("[data-book]");
      if(!profile&&!book)return;
      const person=(profile||book).dataset.profile||(profile||book).dataset.book;
      title.textContent=book?"Consultation request · "+person:person;
      text.textContent=book?"This is a demonstration booking flow. The professional has been selected, but no real appointment is created or confirmed. In the live product this action can connect to availability, scheduling and confirmation.":"This is a sample professional profile for client review. Qualifications, experience and availability should be verified by the clinic before publishing.";
      modal?.classList.add("open");
    });
    document.getElementById("closeTeamModal")?.addEventListener("click",close);
    document.getElementById("modalOkay")?.addEventListener("click",close);
    modal?.addEventListener("click",event=>{if(event.target===modal)close()});
    document.addEventListener("keydown",event=>{if(event.key==="Escape")close()});
    applyFilters();
  }
})();