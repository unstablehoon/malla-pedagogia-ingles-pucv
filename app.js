(() => {
  "use strict";
  const VERSION="3.0.1", STORAGE_KEY="mallaPUCV_v3", LEGACY_KEY="mallaPUCV_aprobados", TUTORIAL_KEY="mallaPUCV_v3_tutorial";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const ramos=$$(".ramo"), semestres=$$(".semestre"), cursosPorId=new Map(ramos.map(r=>[r.dataset.id,r]));
  const reverseDeps=new Map(); ramos.forEach(r=>obtenerRequisitos(r).forEach(p=>{if(!reverseDeps.has(p))reverseDeps.set(p,[]);reverseDeps.get(p).push(r.dataset.id)}));
  const el={
    ramosAprobados:$("#ramosAprobados"),ramosTotales:$("#ramosTotales"),creditosAprobados:$("#creditosAprobados"),creditosTotales:$("#creditosTotales"),porcentaje:$("#porcentaje"),barra:$("#barraProgreso"),barraFondo:$("#barraFondo"),resumen:$("#resumenSemestre"),cursandoCantidad:$("#cursandoCantidad"),cursandoCreditos:$("#cursandoCreditos"),planCantidad:$("#planCantidad"),planCreditos:$("#planCreditos"),promedio:$("#promedioGeneral"),plannerResumen:$("#plannerResumen"),modalRamo:$("#modalRamo"),modalGeneral:$("#modalGeneral"),generalTitulo:$("#modalGeneralTitulo"),generalContenido:$("#modalGeneralContenido"),modalConfirm:$("#modalConfirm"),confirmTexto:$("#confirmTexto"),confirmAceptar:$("#confirmAceptar"),confirmCancelar:$("#confirmCancelar"),modalTutorial:$("#modalTutorial"),toast:$("#toastContainer"),importInput:$("#importInput"),printSummary:$("#printSummary")
  };
  let data=cargarDatos(), cursoActivo=null, deferredPrompt=null, confirmResolver=null;

  function defaultData(){return{version:VERSION,courses:{},preferences:{theme:"light",view:"normal",currentSemester:"auto",analytics:false}}}
  function normalizarCurso(c={}){return{state:["approved","inprogress","none"].includes(c.state)?c.state:"none",planned:Boolean(c.planned),grade:c.grade??"",note:c.note??""}}
  function cargarDatos(){
    let d=null; try{d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")}catch{}
    if(!d||typeof d!=="object")d=defaultData(); d={...defaultData(),...d,preferences:{...defaultData().preferences,...(d.preferences||{})},courses:d.courses||{}};
    Object.keys(d.courses).forEach(k=>d.courses[k]=normalizarCurso(d.courses[k]));
    if(!localStorage.getItem(STORAGE_KEY)){
      try{const legacy=JSON.parse(localStorage.getItem(LEGACY_KEY)||"[]"); if(Array.isArray(legacy))legacy.forEach(id=>d.courses[id]={...normalizarCurso(),state:"approved"})}catch{}
    }
    return d;
  }
  function guardarDatos({toast=false}={}){data.version=VERSION;localStorage.setItem(STORAGE_KEY,JSON.stringify(data));if(toast)mostrarToast("Progreso guardado")}
  function cursoData(id){if(!data.courses[id])data.courses[id]=normalizarCurso();return data.courses[id]}
  function obtenerRequisitos(r){return (r?.dataset.requisitos||"").split(",").map(x=>x.trim()).filter(Boolean)}
  function nombre(id){return cursosPorId.get(id)?.querySelector(".nombre")?.textContent.trim()||id}
  function creditos(idOrR){const r=typeof idOrR==="string"?cursosPorId.get(idOrR):idOrR;return Number(r?.dataset.creditos||0)}
  function estadoAprobado(id){return cursoData(id).state==="approved"}
  function bloqueado(r){const req=obtenerRequisitos(r);return req.length>0&&!req.every(estadoAprobado)}
  function estadoVisual(r){const d=cursoData(r.dataset.id);if(d.state==="approved")return"aprobado";if(d.state==="inprogress")return"cursando";if(d.planned)return"planificado";if(bloqueado(r))return"bloqueado";return"disponible"}

  function sincronizarUI(){
    ramos.forEach(r=>{const d=cursoData(r.dataset.id), b=bloqueado(r); if(b&&d.state==="approved")d.state="none"; if(b&&d.state==="inprogress")d.state="none"; r.classList.toggle("aprobado",d.state==="approved");r.classList.toggle("cursando",d.state==="inprogress");r.classList.toggle("planificado",d.planned);r.classList.toggle("bloqueado",bloqueado(r)); const badge=$(".ramo-estado-badge",r);if(badge)badge.textContent=etiquetaEstado(estadoVisual(r));});
    actualizarDashboard(); actualizarSemestres(); aplicarFiltros(); actualizarModalActivo(); guardarDatos();
  }
  function etiquetaEstado(e){return({aprobado:"Aprobado",cursando:"Cursando",planificado:"Planificado",bloqueado:"Bloqueado",disponible:"Disponible"})[e]||e}
  function actualizarDashboard(){
    const aprob=ramos.filter(r=>cursoData(r.dataset.id).state==="approved"), curs=ramos.filter(r=>cursoData(r.dataset.id).state==="inprogress"), plan=ramos.filter(r=>cursoData(r.dataset.id).planned&&cursoData(r.dataset.id).state!=="approved");
    const totCred=ramos.reduce((s,r)=>s+creditos(r),0), aprCred=aprob.reduce((s,r)=>s+creditos(r),0), curCred=curs.reduce((s,r)=>s+creditos(r),0), planCred=plan.reduce((s,r)=>s+creditos(r),0), pct=ramos.length?Math.round(aprob.length/ramos.length*100):0;
    el.ramosAprobados.textContent=aprob.length;el.ramosTotales.textContent=ramos.length;el.creditosAprobados.textContent=aprCred;el.creditosTotales.textContent=totCred;el.porcentaje.textContent=`${pct}%`;el.barra.style.width=`${pct}%`;el.barraFondo.setAttribute("aria-valuenow",pct);el.cursandoCantidad.textContent=curs.length;el.cursandoCreditos.textContent=curCred;el.planCantidad.textContent=plan.length;el.planCreditos.textContent=planCred;el.plannerResumen.textContent=`${plan.length} ramos · ${planCred} créditos`;
    const grades=ramos.map(r=>parseFloat(cursoData(r.dataset.id).grade)).filter(n=>Number.isFinite(n)&&n>=1&&n<=7);el.promedio.textContent=grades.length?(grades.reduce((a,b)=>a+b,0)/grades.length).toFixed(2):"—";
    const completados=semestres.filter(s=>$$('.ramo',s).every(r=>cursoData(r.dataset.id).state==="approved")).length; let semActual=data.preferences.currentSemester;
    if(semActual==="auto"){const p=semestres.find(s=>!$$('.ramo',s).every(r=>cursoData(r.dataset.id).state==="approved"));semActual=p?p.dataset.semestre:"10"}
    el.resumen.textContent=aprob.length===ramos.length?`Malla completada · 10 de 10 semestres completados`:`${semActual}° Semestre · ${completados} de 10 semestres completados`;
  }
  function actualizarSemestres(){semestres.forEach(s=>{const rs=$$('.ramo',s),apr=rs.filter(r=>cursoData(r.dataset.id).state==="approved"),credT=rs.reduce((a,r)=>a+creditos(r),0),credA=apr.reduce((a,r)=>a+creditos(r),0),c=$('.semestre-progreso',s);c.textContent=`${apr.length}/${rs.length} ramos · ${credA}/${credT} créditos`;s.classList.toggle('completado',apr.length===rs.length)})}

  async function cambiarEstado(r,nuevo){const id=r.dataset.id,d=cursoData(id); if(nuevo==="approved"&&bloqueado(r)){mostrarToast("Primero debes aprobar sus prerrequisitos");return} if(nuevo==="inprogress"&&bloqueado(r)){mostrarToast("Este ramo todavía está bloqueado");return}
    if(d.state==="approved"&&nuevo!=="approved"){const afect=dependientesActivos(id);if(afect.length){const ok=await confirmar(`Desmarcar ${nombre(id)} afectará ${afect.length} ramo(s): ${afect.map(nombre).join(", ")}. Los que queden sin prerrequisitos se devolverán a Disponible. ¿Continuar?`);if(!ok)return}}
    d.state=nuevo; if(nuevo==="approved")d.planned=false; cascadeInvalidos();sincronizarUI();mostrarToast(nuevo==="approved"?"Ramo marcado como aprobado":nuevo==="inprogress"?"Ramo marcado como cursando":"Estado actualizado")}
  function dependientesActivos(id){const seen=new Set(),out=[];function walk(x){(reverseDeps.get(x)||[]).forEach(dep=>{if(seen.has(dep))return;seen.add(dep);const d=cursoData(dep);if(["approved","inprogress"].includes(d.state))out.push(dep);walk(dep)})}walk(id);return out}
  function cascadeInvalidos(){let cambio=true;while(cambio){cambio=false;ramos.forEach(r=>{const d=cursoData(r.dataset.id);if(bloqueado(r)&&["approved","inprogress"].includes(d.state)){d.state="none";cambio=true}})}}
  function togglePlan(r){const d=cursoData(r.dataset.id);if(d.state==="approved"){mostrarToast("Un ramo aprobado no necesita planificación");return}d.planned=!d.planned;sincronizarUI();mostrarToast(d.planned?"Agregado al próximo semestre":"Quitado de la planificación")}

  // Interacción: 1 clic cambia aprobado; doble clic abre detalles sin cambiar el estado.
  // El pequeño retraso permite distinguir un clic simple de un doble clic.
  const clickTimers=new WeakMap();
  ramos.forEach(r=>{
    const infoBtn=$('.ramo-info-btn',r);

    r.addEventListener('click',e=>{
      if(e.target.closest?.('.ramo-info-btn'))return;
      const anterior=clickTimers.get(r);
      if(anterior)clearTimeout(anterior);
      const timer=setTimeout(()=>{
        clickTimers.delete(r);
        const d=cursoData(r.dataset.id);
        cambiarEstado(r,d.state==="approved"?"none":"approved");
      },240);
      clickTimers.set(r,timer);
    });

    r.addEventListener('dblclick',e=>{
      if(e.target.closest?.('.ramo-info-btn'))return;
      e.preventDefault();
      const timer=clickTimers.get(r);
      if(timer){clearTimeout(timer);clickTimers.delete(r)}
      abrirRamo(r);
    });

    r.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();abrirRamo(r)}
    });

    if(infoBtn){
      infoBtn.addEventListener('pointerdown',e=>e.stopPropagation());
      infoBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();abrirRamo(r)});
      infoBtn.addEventListener('dblclick',e=>{e.preventDefault();e.stopPropagation()});
    }
  });

  function abrirRamo(r){cursoActivo=r;renderModalRamo(r);el.modalRamo.hidden=false;setTimeout(()=>$('#modalRamo [data-close-modal]')?.focus(),0)}
  function actualizarModalActivo(){if(cursoActivo&&!el.modalRamo.hidden)renderModalRamo(cursoActivo)}
  function renderModalRamo(r){const id=r.dataset.id,d=cursoData(id),est=estadoVisual(r);$('#detalleCodigo').textContent=id;$('#detalleNombre').textContent=nombre(id);$('#detalleCreditos').textContent=`${creditos(r)} créditos`;$('#detalleArea').textContent=r.dataset.area;$('#detalleEstado').textContent=etiquetaEstado(est);$('#detalleNota').value=d.grade;$('#detalleComentario').value=d.note;
    $$('#estadoSelector [data-set-state]').forEach(b=>{b.classList.toggle('activo',b.dataset.setState===d.state);if(["approved","inprogress"].includes(b.dataset.setState))b.disabled=bloqueado(r)});const pb=$('#estadoSelector [data-toggle-plan]');pb.classList.toggle('activo',d.planned);pb.textContent=d.planned?'Planificado ✓':'Planificar';
    const req=obtenerRequisitos(r),reqC=$('#detalleRequisitos');reqC.replaceChildren();if(!req.length){reqC.innerHTML='<p class="detalle-faltantes">Este ramo no tiene prerrequisitos.</p>'}else req.forEach(x=>{const item=document.createElement('div');item.className=`requisito-item ${estadoAprobado(x)?'cumplido':'faltante'}`;item.textContent=`${estadoAprobado(x)?'✓':'✗'} ${nombre(x)}`;reqC.append(item)});const falt=req.filter(x=>!estadoAprobado(x));$('#detalleFaltantes').textContent=falt.length?`Falta aprobar: ${falt.map(nombre).join(' · ')}`:req.length?'Todos los prerrequisitos están cumplidos.':'';
    const rutas=obtenerRutas(id),rc=$('#detalleRutas');rc.replaceChildren();if(!rutas.length)rc.innerHTML='<p class="detalle-faltantes">Sin cadena previa.</p>';else rutas.slice(0,8).forEach(path=>{const div=document.createElement('div');div.className='ruta';div.textContent=path.map(nombre).join(' → ');rc.append(div)});
    const desc=reverseDeps.get(id)||[],dc=$('#detalleDesbloquea');dc.replaceChildren();if(!desc.length)dc.innerHTML='<span class="chip">No desbloquea ramos directos</span>';else desc.forEach(x=>{const sp=document.createElement('span');sp.className='chip';sp.textContent=`${x} · ${nombre(x)}`;dc.append(sp)});
  }
  function obtenerRutas(id){const r=cursosPorId.get(id),req=obtenerRequisitos(r);if(!req.length)return[];const out=[];function walk(x,path,seen){if(seen.has(x))return;const nr=cursosPorId.get(x),pr=obtenerRequisitos(nr);if(!pr.length){out.push([...path,x]);return}pr.forEach(p=>walk(p,[...path,x],new Set([...seen,x])))}req.forEach(p=>walk(p,[],new Set([id])));return out.map(p=>[...p,id])}
  $('#estadoSelector').addEventListener('click',e=>{const st=e.target.closest('[data-set-state]')?.dataset.setState;if(st&&cursoActivo)cambiarEstado(cursoActivo,st);if(e.target.closest('[data-toggle-plan]')&&cursoActivo)togglePlan(cursoActivo)});
  $('#detalleNota').addEventListener('input',e=>{if(!cursoActivo)return;const v=e.target.value;cursoData(cursoActivo.dataset.id).grade=v;guardarDatos();actualizarDashboard()});
  $('#detalleComentario').addEventListener('input',e=>{if(!cursoActivo)return;cursoData(cursoActivo.dataset.id).note=e.target.value;guardarDatos()});

  // Search/filters
  ['buscador','filtroEstado','filtroSemestre','filtroArea'].forEach(id=>$('#'+id).addEventListener(id==='buscador'?'input':'change',aplicarFiltros));
  function aplicarFiltros(){const q=$('#buscador').value.trim().toLowerCase(),est=$('#filtroEstado').value,sem=$('#filtroSemestre').value,area=$('#filtroArea').value;ramos.forEach(r=>{const okQ=!q||`${r.dataset.id} ${nombre(r.dataset.id)}`.toLowerCase().includes(q),okE=est==='todos'||estadoVisual(r)===est,okS=sem==='todos'||r.dataset.semestre===sem,okA=area==='todas'||r.dataset.area===area;r.classList.toggle('oculto',!(okQ&&okE&&okS&&okA))});semestres.forEach(s=>s.classList.toggle('sin-resultados',$$('.ramo:not(.oculto)',s).length===0))}
  $$('.semester-nav [data-go-sem]').forEach(b=>b.addEventListener('click',()=>$('#semestre-'+b.dataset.goSem)?.scrollIntoView({behavior:'smooth',inline:'start',block:'nearest'})));

  // General modal helpers
  function abrirGeneral(titulo,html){el.generalTitulo.textContent=titulo;el.generalContenido.innerHTML=html;el.modalGeneral.hidden=false;engancharGeneral()}
  function cerrarModal(m){m.hidden=true;if(m===el.modalRamo)cursoActivo=null}
  $$('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>cerrarModal(b.closest('.modal-fondo'))));[el.modalRamo,el.modalGeneral].forEach(m=>m.addEventListener('click',e=>{if(e.target===m)cerrarModal(m)}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){[el.modalRamo,el.modalGeneral,el.modalTutorial].forEach(m=>{if(!m.hidden)cerrarModal(m)})}})

  $('#puedoTomarBtn').addEventListener('click',()=>{const list=ramos.filter(r=>estadoVisual(r)==='disponible');abrirGeneral('¿Qué puedo tomar ahora?',list.length?`<div class="general-list">${list.map(r=>`<div class="general-item"><strong>${r.dataset.id} · ${escapeHtml(nombre(r.dataset.id))}</strong>${r.dataset.semestre}° semestre · ${creditos(r)} créditos · ${r.dataset.area}</div>`).join('')}</div>`:'<p>No hay ramos disponibles pendientes en este momento.</p>')});
  $('#verPlanBtn').addEventListener('click',()=>{const list=ramos.filter(r=>cursoData(r.dataset.id).planned&&cursoData(r.dataset.id).state!=='approved');const cr=list.reduce((a,r)=>a+creditos(r),0);abrirGeneral('Planificación del próximo semestre',`<p>${list.length} ramos · ${cr} créditos planificados</p>${list.length?`<div class="general-list">${list.map(r=>`<div class="general-item"><strong>${r.dataset.id} · ${escapeHtml(nombre(r.dataset.id))}</strong>${creditos(r)} créditos · ${bloqueado(r)?'Aún bloqueado':'Disponible para cursar'}</div>`).join('')}</div>`:'<p>Aún no has planificado ramos.</p>'}`)});
  $('#estadisticasBtn').addEventListener('click',()=>{const areas=[...new Set(ramos.map(r=>r.dataset.area))].sort();const rows=areas.map(a=>{const rs=ramos.filter(r=>r.dataset.area===a),ap=rs.filter(r=>cursoData(r.dataset.id).state==='approved'),pct=Math.round(ap.length/rs.length*100);return`<div class="area-stat"><span>${a}</span><div class="mini-bar"><i style="width:${pct}%"></i></div><strong>${ap.length}/${rs.length}</strong></div>`}).join('');abrirGeneral('Estadísticas por área',rows)});

  // Current semester/settings
  $('#editarSemestreBtn').addEventListener('click',()=>abrirGeneral('Semestre actual',`<div class="settings-grid"><div class="settings-row"><div><label>Semestre mostrado en el resumen</label><small>Puedes dejarlo automático o elegirlo tú.</small></div><select id="semestreActualSelect"><option value="auto">Automático</option>${Array.from({length:10},(_,i)=>`<option value="${i+1}">${i+1}° semestre</option>`).join('')}</select></div></div>`));

  // Backup/data
  $('#datosBtn').addEventListener('click',()=>abrirGeneral('Backup y datos',`<div class="general-list"><button class="btn" data-action="export">Exportar backup (.json)</button><button class="btn" data-action="copy">Copiar backup</button><button class="btn" data-action="import">Importar backup</button><button class="btn peligro-suave" data-action="clear-grades">Borrar solo notas finales</button></div><p class="detalle-faltantes">El progreso se guarda en este navegador. Exportar un backup es recomendable antes de cambiar de dispositivo o limpiar datos del navegador.</p>`));
  function engancharGeneral(){const sel=$('#semestreActualSelect');if(sel){sel.value=data.preferences.currentSemester;sel.addEventListener('change',()=>{data.preferences.currentSemester=sel.value;guardarDatos();actualizarDashboard();mostrarToast('Semestre actual actualizado')})}$$('[data-action]',el.generalContenido).forEach(b=>b.addEventListener('click',()=>accionDatos(b.dataset.action)))}
  async function accionDatos(a){if(a==='export')exportarBackup();if(a==='copy'){await navigator.clipboard.writeText(JSON.stringify(data,null,2));mostrarToast('Backup copiado al portapapeles')}if(a==='import')el.importInput.click();if(a==='clear-grades'){if(await confirmar('¿Borrar todas las notas finales registradas? El progreso de ramos no se tocará.')){Object.values(data.courses).forEach(c=>c.grade='');guardarDatos();actualizarDashboard();cerrarModal(el.modalGeneral);mostrarToast('Notas finales borradas')}}}
  function exportarBackup(){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`malla-pucv-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);mostrarToast('Backup descargado')}
  el.importInput.addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const parsed=JSON.parse(await f.text());if(!parsed||typeof parsed!=='object'||!parsed.courses)throw new Error();if(!(await confirmar('Importar este backup reemplazará el progreso actual. ¿Continuar?')))return;data={...defaultData(),...parsed,preferences:{...defaultData().preferences,...(parsed.preferences||{})}};Object.keys(data.courses||{}).forEach(k=>data.courses[k]=normalizarCurso(data.courses[k]));aplicarPreferencias();sincronizarUI();cerrarModal(el.modalGeneral);mostrarToast('Backup importado correctamente')}catch{mostrarToast('No pude leer ese backup')}finally{e.target.value=''}});

  // Share text/card
  $('#compartirBtn').addEventListener('click',async()=>{const t=resumenTexto();try{if(navigator.share)await navigator.share({title:'Mi avance · Pedagogía en Inglés PUCV',text:t,url:location.href});else{await navigator.clipboard.writeText(`${t}\n${location.href}`);mostrarToast('Resumen copiado')}}catch{}});
  function resumenTexto(){const ap=ramos.filter(r=>cursoData(r.dataset.id).state==='approved'),cr=ap.reduce((a,r)=>a+creditos(r),0),tot=ramos.reduce((a,r)=>a+creditos(r),0),pct=Math.round(ap.length/ramos.length*100);return`Pedagogía en Inglés PUCV · ${ap.length}/${ramos.length} ramos · ${cr}/${tot} créditos · ${pct}% completado`}
  $('#tarjetaBtn').addEventListener('click',()=>{const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const c=canvas.getContext('2d');c.fillStyle='#fcf7d9';c.fillRect(0,0,1080,1350);c.fillStyle='#faece8';roundRect(c,80,90,920,1170,42);c.fill();c.strokeStyle='#604734';c.lineWidth=6;c.stroke();c.fillStyle='#604734';c.textAlign='center';c.font='italic 74px Georgia';c.fillText('Pedagogía en Inglés',540,220);c.font='700 34px Arial';c.fillText('PUCV',540,275);const ap=ramos.filter(r=>cursoData(r.dataset.id).state==='approved').length,pct=Math.round(ap/ramos.length*100),cr=ramos.filter(r=>cursoData(r.dataset.id).state==='approved').reduce((a,r)=>a+creditos(r),0),tot=ramos.reduce((a,r)=>a+creditos(r),0);c.font='700 170px Arial';c.fillText(`${pct}%`,540,570);c.font='600 38px Arial';c.fillText(`${ap} de ${ramos.length} ramos aprobados`,540,680);c.fillText(`${cr} de ${tot} créditos`,540,745);c.fillStyle='#f0c5d4';roundRect(c,180,830,720,54,27);c.fill();c.fillStyle='#604734';roundRect(c,180,830,720*pct/100,54,27);c.fill();c.font='500 26px Arial';c.fillText('Mi avance académico',540,970);c.font='400 22px Arial';c.fillText('Malla interactiva no oficial',540,1040);c.fillText('unstablehoon.github.io/malla-pedagogia-ingles-pucv',540,1100);const a=document.createElement('a');a.download='mi-avance-pucv.png';a.href=canvas.toDataURL('image/png');a.click();mostrarToast('Tarjeta creada')});
  function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):(ctx.rect(x,y,w,h));}

  // Print
  $('#imprimirBtn').addEventListener('click',()=>abrirGeneral('Imprimir',`<div class="general-list"><button class="btn" data-print="full">Malla completa</button><button class="btn" data-print="summary">Resumen de avance</button></div><p class="detalle-faltantes">Para conservar los rosados, activa “gráficos/fondos” en las opciones de impresión si tu navegador lo pide.</p>`));
  el.generalContenido.addEventListener('click',e=>{const mode=e.target.closest('[data-print]')?.dataset.print;if(!mode)return;cerrarModal(el.modalGeneral);prepararPrintSummary();document.body.classList.toggle('print-summary-mode',mode==='summary');setTimeout(()=>window.print(),60)});window.addEventListener('afterprint',()=>document.body.classList.remove('print-summary-mode'));
  function prepararPrintSummary(){const aprob=ramos.filter(r=>cursoData(r.dataset.id).state==='approved'),curs=ramos.filter(r=>cursoData(r.dataset.id).state==='inprogress'),plan=ramos.filter(r=>cursoData(r.dataset.id).planned&&cursoData(r.dataset.id).state!=='approved'),cr=aprob.reduce((a,r)=>a+creditos(r),0),tot=ramos.reduce((a,r)=>a+creditos(r),0),pct=Math.round(aprob.length/ramos.length*100);el.printSummary.innerHTML=`<h2>Resumen de avance · Pedagogía en Inglés PUCV</h2><div class="print-summary-grid"><div class="print-box"><strong>${pct}%</strong><span>completado</span></div><div class="print-box"><strong>${aprob.length}/${ramos.length}</strong><span>ramos aprobados</span></div><div class="print-box"><strong>${cr}/${tot}</strong><span>créditos aprobados</span></div><div class="print-box"><strong>${curs.length}</strong><span>ramos cursando</span></div><div class="print-box"><strong>${plan.length}</strong><span>ramos planificados</span></div><div class="print-box"><strong>${el.promedio.textContent}</strong><span>promedio registrado</span></div></div><div class="print-list">${ramos.map(r=>`<div><strong>${r.dataset.id}</strong> · ${escapeHtml(nombre(r.dataset.id))} — ${etiquetaEstado(estadoVisual(r))}</div>`).join('')}</div><p class="print-footer">Herramienta no oficial · v${VERSION} · impreso el ${new Date().toLocaleDateString('es-CL')}</p>`}

  // Theme/view/tutorial/changelog
  function aplicarPreferencias(){document.documentElement.dataset.theme=data.preferences.theme;document.body.classList.toggle('vista-compacta',data.preferences.view==='compact');$('#temaBtn').title=data.preferences.theme==='dark'?'Usar tema claro':'Usar tema oscuro';$('#vistaBtn').title=data.preferences.view==='compact'?'Usar vista normal':'Usar vista compacta'}
  $('#temaBtn').addEventListener('click',()=>{data.preferences.theme=data.preferences.theme==='dark'?'light':'dark';aplicarPreferencias();guardarDatos()});$('#vistaBtn').addEventListener('click',()=>{data.preferences.view=data.preferences.view==='compact'?'normal':'compact';aplicarPreferencias();guardarDatos()});$('#ayudaBtn').addEventListener('click',()=>el.modalTutorial.hidden=false);$('#tutorialCerrarBtn').addEventListener('click',()=>{localStorage.setItem(TUTORIAL_KEY,'1');cerrarModal(el.modalTutorial)});$('#changelogBtn').addEventListener('click',()=>abrirGeneral('Cambios · v3.0.0',`<div class="general-list"><div class="general-item"><strong>Estados nuevos</strong>Cursando y planificación.</div><div class="general-item"><strong>Planner</strong>Carga tentativa y créditos.</div><div class="general-item"><strong>Notas</strong>Nota final, promedio y comentarios personales.</div><div class="general-item"><strong>Datos</strong>Backup, importar, compartir y tarjeta.</div><div class="general-item"><strong>Impresión</strong>Malla completa o resumen con colores.</div><div class="general-item"><strong>PWA</strong>Instalable y preparada para funcionar offline.</div></div>`));

  // Confirmation/toasts/reset
  function confirmar(texto){el.confirmTexto.textContent=texto;el.modalConfirm.hidden=false;return new Promise(resolve=>{confirmResolver=resolve})}function cerrarConfirm(v){el.modalConfirm.hidden=true;if(confirmResolver){confirmResolver(v);confirmResolver=null}}el.confirmAceptar.addEventListener('click',()=>cerrarConfirm(true));el.confirmCancelar.addEventListener('click',()=>cerrarConfirm(false));el.modalConfirm.addEventListener('click',e=>{if(e.target===el.modalConfirm)cerrarConfirm(false)});
  function mostrarToast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;el.toast.append(d);setTimeout(()=>{d.classList.add('salida');setTimeout(()=>d.remove(),220)},2400)}
  $('#reiniciarBtn').addEventListener('click',async()=>{if(!(await confirmar('¿Seguro que quieres reiniciar todo? Se borrarán estados, planificación, notas y comentarios.')))return;data=defaultData();guardarDatos();aplicarPreferencias();sincronizarUI();mostrarToast('Progreso reiniciado')});

  // Install/PWA
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#instalarBtn').hidden=false});$('#instalarBtn').addEventListener('click',async()=>{if(!deferredPrompt){mostrarToast('En iPhone/iPad usa Compartir → Añadir a pantalla de inicio');return}deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#instalarBtn').hidden=true});if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

  // Analytics optional via config
  function iniciarAnalytics(){const cfg=window.MALLA_CONFIG||{};if(!cfg.analyticsEnabled||!cfg.plausibleDomain)return;const s=document.createElement('script');s.defer=true;s.dataset.domain=cfg.plausibleDomain;s.src='https://plausible.io/js/script.js';document.head.append(s)}
  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

  aplicarPreferencias();sincronizarUI();iniciarAnalytics();if(!localStorage.getItem(TUTORIAL_KEY))setTimeout(()=>el.modalTutorial.hidden=false,350);
})();
