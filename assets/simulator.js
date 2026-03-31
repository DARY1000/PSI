/* Wadagni Simulateur — Logique de navigation et affichage
 * Mainteneur : Armel Kouandi DARI — iCODE Cotonou
 */

let selProfil=null,selRegion=null,selConcerns=[],step=1;

function selectProfil(c){document.querySelectorAll('.profil-card').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');selProfil=c.dataset.profil;setTimeout(()=>{step=2;upd();document.getElementById('step1').style.display='none';document.getElementById('step2').style.display='block';document.getElementById('step2').scrollIntoView({behavior:'smooth',block:'start'})},300)}

function selectRegion(c){document.querySelectorAll('.region-card').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');selRegion=c.dataset.region;setTimeout(()=>{step=3;upd();document.getElementById('step2').style.display='none';document.getElementById('step3').style.display='block';document.getElementById('step3').scrollIntoView({behavior:'smooth',block:'start'})},300)}

function toggleConcern(c){if(c.classList.contains('selected')){c.classList.remove('selected');selConcerns=selConcerns.filter(x=>x!==c.textContent)}else{if(selConcerns.length>=3)return;c.classList.add('selected');selConcerns.push(c.textContent)}document.getElementById('genBtn').disabled=selConcerns.length===0}

function upd(){document.querySelectorAll('.step-item').forEach((el,i)=>{el.classList.remove('active','done');if(i+1===step)el.classList.add('active');if(i+1<step)el.classList.add('done')});if(step===4)document.querySelectorAll('.step-item').forEach(el=>{el.classList.remove('active');el.classList.add('done')})}

function generateResult(){document.getElementById('formZone').style.display='none';document.getElementById('loadingZone').style.display='block';step=4;upd();setTimeout(showResult,2000)}

function showResult(){
  document.getElementById('loadingZone').style.display='none';
  const d=D[selProfil];
  document.getElementById('resultBadge').textContent=`${d.emoji} ${d.label} · ${selRegion}`;
  document.getElementById('resultRegionTag').textContent=`Pôle ${selRegion} · Programme officiel 2026–2033`;
  document.getElementById('quoteText').textContent=d.quote;
  const bs=document.getElementById('bilanStrip');bs.innerHTML='';
  d.bilan.forEach(b=>{const c=document.createElement('div');c.className='bilan-chip';c.innerHTML=`<span class="val">${b.val}</span><div class="lbl">${b.lbl}</div>`;bs.appendChild(c)});
  const ml=document.getElementById('measureList');ml.innerHTML='';
  d.measures.forEach(m=>{const li=document.createElement('li');li.className='measure-item';li.innerHTML=`<div class="measure-icon">${m.icon}</div><div><div class="measure-title">${m.title}</div><div class="measure-desc">${m.desc}</div></div>`;ml.appendChild(li)});
  document.getElementById('resultZone').style.display='block';
  document.getElementById('resultZone').scrollIntoView({behavior:'smooth',block:'start'})
}

function shareWhatsApp(){
  const d=D[selProfil];
  const t=`🇧🇯 *Ce que Wadagni change pour moi* — ${d.label} · ${selRegion}\n\n`+d.measures.slice(0,3).map(m=>`✅ *${m.title}*`).join('\n')+`\n\n💬 ${d.quote}\n\n👉 Testez votre profil !\n#PlusLoinEnsemble #Wadagni2026 #Bénin`;
  window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank')
}

function restart(){
  selProfil=null;selRegion=null;selConcerns=[];step=1;upd();
  document.getElementById('resultZone').style.display='none';
  document.getElementById('formZone').style.display='block';
  document.getElementById('step1').style.display='block';
  document.getElementById('step2').style.display='none';
  document.getElementById('step3').style.display='none';
  document.querySelectorAll('.profil-card,.region-card,.concern-chip').forEach(c=>c.classList.remove('selected'));
  document.getElementById('genBtn').disabled=true;
  window.scrollTo({top:0,behavior:'smooth'})
}

function goToStep(n){
  // On ne peut aller qu'aux étapes déjà visitées ou l'étape courante
  if(n>step)return;
  // Cacher résultat si visible
  document.getElementById('resultZone').style.display='none';
  document.getElementById('formZone').style.display='block';
  // Cacher toutes les étapes
  ['step1','step2','step3'].forEach(id=>document.getElementById(id).style.display='none');
  // Montrer l'étape cible
  if(n===1){
    document.getElementById('step1').style.display='block';
    // Reset sélections suivantes
    selProfil=null;selRegion=null;selConcerns=[];
    document.querySelectorAll('.profil-card,.region-card,.concern-chip').forEach(c=>c.classList.remove('selected'));
    document.getElementById('genBtn').disabled=true;
  } else if(n===2 && selProfil){
    document.getElementById('step2').style.display='block';
    selRegion=null;selConcerns=[];
    document.querySelectorAll('.region-card,.concern-chip').forEach(c=>c.classList.remove('selected'));
    document.getElementById('genBtn').disabled=true;
  } else if(n===3 && selProfil && selRegion){
    document.getElementById('step3').style.display='block';
    selConcerns=[];
    document.querySelectorAll('.concern-chip').forEach(c=>c.classList.remove('selected'));
    document.getElementById('genBtn').disabled=true;
  } else if(n===4){
    if(document.getElementById('resultZone').innerHTML.trim().length>100){
      document.getElementById('resultZone').style.display='block';
      document.getElementById('formZone').style.display='none';
    }
    return;
  }
  step=n; upd();
  window.scrollTo({top:0,behavior:'smooth'});
}