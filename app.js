(() => {
  "use strict";

  const VERSION = "3.1.0";
  const STORAGE_KEY = "mallaPUCV_v3";
  const LEGACY_KEY = "mallaPUCV_aprobados";
  const TUTORIAL_KEY = "mallaPUCV_v3_tutorial";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const SUGERENCIAS = {
    fofu: { "FOFU 1": 5, "FOFU 2": 6, "FOFU 3": 9 },
    optativo: { "Optativo 1": 2, "Optativo 2": 5, "Optativo 3": 7, "Optativo 4": 9 }
  };

  const MINORS = [
    {
      id: "alimentos",
      name: "Alimentos: Ciencia, Tecnología y Salud",
      courses: [
        ["ALI012", "Alimentos, Nutrición y Salud"],
        ["ALI013", "Alimentos del Futuro"],
        ["ALI014", "Innovación en la Industria de Alimentos"],
        ["ALI015", "Cómo Leer un Etiquetado Nutricional", true],
        ["ALI016", "El Mundo de la Cerveza"],
        ["ALI017", "La Ciencia de los Alimentos"],
        ["ALI018", "Mitos y Verdades de los Aditivos Alimentarios"],
        ["ALI019", "Mitos y Verdades de los Alimentos Procesados"],
        ["ALI021", "Superalimentos y Dónde Encontrarlos"]
      ]
    },
    {
      id: "arte",
      name: "Arte y Cultura",
      courses: [
        ["ART022", "El Dibujo y la Mirada: Seminario-Taller"],
        ["ART031", "El Libro y sus Formas: Historia, Técnicas y Creación"],
        ["ART052", "La Mirada de la Pintura"],
        ["ART053", "Poesía en el Rock"],
        ["ART060", "Taller de Teatro Contemporáneo"],
        ["ART061", "Taller de Teatro: Actuación Inicial"],
        ["ART077", "Poesía Latinoamericana del Siglo XX", true],
        ["ART078", "Cine Latinoamericano"],
        ["ART085", "Creación Poética: Seminario Taller"],
        ["ART094", "Plástica Contemporánea"],
        ["ART095", "Vida y Poesía", true],
        ["DER053", "Derecho y Política a Través del Cine y la Literatura"],
        ["DER054", "El Derecho en Diálogo con el Arte"],
        ["LCL081", "Literatura y Cine: Intermedialidad y Tecnologías", true]
      ]
    },
    {
      id: "historia",
      name: "Historia, Territorio y Sociedad",
      courses: [
        ["GEO026", "Geografía Natural y Social de Chile: Interfaz para un Entendimiento Integral del Territorio"],
        ["GEO094", "Geografía del Gran Valparaíso", true],
        ["GEO097", "Geografía Ecológica de Chile", true],
        ["HIS013", "Problemas y Protagonistas de la Historia Política de Chile y Argentina Siglo XX y XXI", true],
        ["HIS015", "Historia de las Relaciones Internacionales"],
        ["HIS021", "Historia Moderna y Contemporánea del Este de Asia: China, Corea y Japón"],
        ["HIS023", "Multiculturalismo y Género"],
        ["HIS033", "Formación Ciudadana"],
        ["HIS034", "Introducción a la Historia de las Revoluciones Contemporáneas", true],
        ["HIS086", "Historia, Patrimonio y Paisaje: de la Ciudad que Fuimos a la Ciudad que Queremos Ser"],
        ["ICA030", "Política Exterior de Chile: Economía y Comercio"],
        ["ICA070", "¿Vamos Hacia un Nuevo Orden Mundial?: Crisis Geopolíticas e Impacto en América Latina"]
      ]
    },
    {
      id: "innovacion",
      name: "Innovación y Emprendimiento",
      courses: [
        ["EII020", "Iniciando mi Negocio como Profesional"],
        ["EII025", "Innovación para mi Profesión"],
        ["ICA014", "Economía Circular en el Emprendimiento"],
        ["ICA020", "Construye tu Marca Personal"],
        ["ICA025", "Enseñando Emprendo: Juegos y Dinámicas para Fomentar una Mentalidad Emprendedora"],
        ["ICA081", "Liderazgo y Emprendimiento Personal"],
        ["ICA082", "Creatividad para el Emprendimiento"],
        ["ICA083", "Innovación y Emprendimiento Social"],
        ["ICA084", "Inserción Laboral", true],
        ["INF055", "Innovación Basada en Inteligencia Artificial (I+IA)", true],
        ["VRA015", "Proyectos Innovadores: Formulación y Financiamiento", true],
        ["VRA030", "Creación Digital: de la Idea al Prototipo"],
        ["VRA035", "Emprender con Ciencia y Tecnología"],
        ["VRA040", "Pensamiento de Diseño y Estrategias Creativas", true],
        ["VRA050", "Ideas Protegidas: Propiedad Intelectual en Acción"]
      ]
    },
    {
      id: "diversidad",
      name: "Liderazgo para la Diversidad e Inclusión",
      courses: [
        ["DER012", "Las Normas y el Género"],
        ["DER014", "Discapacidad, su Proyección Interdisciplinaria en la Promoción, Respeto y Ejercicio de los Derechos de las Personas en Situación de Discapacidad", true],
        ["EFI075", "Actividades Motrices en la Naturaleza e Inclusión"],
        ["EFI085", "Juegos Mapuches (Araucanos) de Chile"],
        ["EII045", "Gestión para la Diversidad e Inclusión Social"],
        ["EPE060", "Diversidad e Inclusión: Oportunidades desde las Responsabilidades Profesionales"],
        ["HIS019", "Perspectivas en la Historia de la Mujer y Género"],
        ["HIS030", "Introducción a la Historia Mapuche"],
        ["ICC012", "Taller de Rap y Freestyle", true],
        ["LCL093", "Introducción a la Lengua de Señas"],
        ["LCL085", "Introducción a la Lengua de Señas 2"]
      ]
    },
    {
      id: "cristiana",
      name: "Persona y Sociedad desde la Visión Cristiana",
      courses: [
        ["ALI030", "Responsabilidad Prosocial: Desafío del Ejercicio Profesional"],
        ["IER010", "Antropología Cristiana"],
        ["IER020", "Ética Cristiana"],
        ["IER025", "La Religión Después de Freud"],
        ["IER032", "Sectas y Propuestas Preocupantes: el Auge de la Magia y el Esoterismo en la Sociedad Actual"],
        ["IER034", "Lectura de Profetas", true],
        ["IER080", "Taller de Bioética Medioambiental", true],
        ["IER099", "Bioética del Medioambiente"],
        ["TEO020", "Doctrina Social de la Iglesia: Ética Social para el Siglo XXI"]
      ]
    },
    {
      id: "sociedad-ciencia",
      name: "Sociedad, Ciencia y Tecnología",
      courses: [
        ["EPE073", "Cultura y Ciudadanía Digital"],
        ["EPE075", "Aprendizaje en un Mundo Digital"],
        ["QUI010", "Lógica y Argumentación Científica", true],
        ["ICA013", "Economía y Comercio en los Conflictos Internacionales"],
        ["ICA030", "Política Exterior de Chile: Economía y Comercio"],
        ["ICA070", "¿Vamos Hacia un Nuevo Orden Mundial?: Crisis Geopolíticas e Impacto en América Latina"]
      ]
    },
    {
      id: "sostenibilidad",
      name: "Sostenibilidad",
      courses: [
        ["AGR010", "Agricultura Urbana"],
        ["BIO035", "Botánica Cotidiana: Relación del Hombre con las Plantas"],
        ["EFI027", "Actividad Física, Salud y Sostenibilidad", true],
        ["EIB011", "Economía Circular y Sociedad"],
        ["EIB012", "Sustentabilidad y Desarrollo", true],
        ["GEO014", "Estudios Ambientales y Cambio Climático"],
        ["ICA015", "La Ciencia de la Economía Circular"],
        ["ICA079", "Gestión de Sostenibilidad"],
        ["ICC011", "Fundamentos de Sustentabilidad"],
        ["IER036", "Bioética Medioambiental: Paradigmas de Sostenibilidad en Chile"],
        ["OCE010", "Cambios en el Océano en el Antropoceno"],
        ["PER012", "Comunicación y Cambio Climático"],
        ["QUI011", "Medio Ambiente y Sostenibilidad", true],
        ["TSL020", "Geografía de la Pobreza y de la Desigualdad Social", true]
      ]
    },
    {
      id: "vida-saludable",
      name: "Vida Saludable y Bienestar Humano",
      courses: [
        ["ALI012", "Alimentos, Nutrición y Salud"],
        ["DER055", "Taller: Conflicto y Distintas Formas de Gestión y Resolución"],
        ["EFI023", "Autocuidado y Vida Saludable"],
        ["EFI027", "Actividad Física, Salud y Sostenibilidad", true],
        ["EFI050", "Lideraz-Go!"],
        ["EFI080", "El Hombre y los Juegos"],
        ["EFI085", "Juegos Mapuches (Araucanos) de Chile"],
        ["KIN030", "Mediación Corporal", true],
        ["KIN031", "Hábitos Saludables en el Ciclo Vital: una Mirada desde la Kinesiología"],
        ["KIN040", "La Salud: Responsabilidad Personal y Responsabilidad Social", true],
        ["MUS084", "Danzas Tradicionales de Chile"]
      ]
    }
  ].map(m => ({...m, courses: m.courses.map(([code,name,unavailable=false]) => ({code,name,unavailable}))}));

  const MINOR_BY_ID = new Map(MINORS.map(m => [m.id, m]));

  const el = {
    ramosAprobados: $("#ramosAprobados"), ramosTotales: $("#ramosTotales"),
    creditosAprobados: $("#creditosAprobados"), creditosTotales: $("#creditosTotales"),
    porcentaje: $("#porcentaje"), barra: $("#barraProgreso"), barraFondo: $("#barraFondo"),
    resumen: $("#resumenSemestre"), cursandoCantidad: $("#cursandoCantidad"), cursandoCreditos: $("#cursandoCreditos"),
    planCantidad: $("#planCantidad"), planCreditos: $("#planCreditos"), promedio: $("#promedioGeneral"),
    extrasCantidad: $("#extrasCantidad"), extrasCreditos: $("#extrasCreditos"), minorProgreso: $("#minorProgreso"), minorLabel: $("#minorLabel"),
    plannerResumen: $("#plannerResumen"), modalRamo: $("#modalRamo"), modalGeneral: $("#modalGeneral"),
    generalTitulo: $("#modalGeneralTitulo"), generalContenido: $("#modalGeneralContenido"), modalConfirm: $("#modalConfirm"),
    confirmTexto: $("#confirmTexto"), confirmAceptar: $("#confirmAceptar"), confirmCancelar: $("#confirmCancelar"),
    modalTutorial: $("#modalTutorial"), toast: $("#toastContainer"), importInput: $("#importInput"), printSummary: $("#printSummary")
  };

  let data = cargarDatos();
  let ramos = [];
  let baseRamos = [];
  let customRamos = [];
  let semestres = [];
  let cursosPorId = new Map();
  let reverseDeps = new Map();
  let cursoActivo = null;
  let deferredPrompt = null;
  let confirmResolver = null;
  const interacciones = new WeakMap();

  function defaultData(){
    return {
      version: VERSION,
      courses: {},
      customCourses: [],
      preferences: {theme:"light", view:"normal", currentSemester:"auto", minor:"", analytics:false}
    };
  }

  function normalizarCurso(c={}){
    return {state:["approved","inprogress","none"].includes(c.state)?c.state:"none", planned:Boolean(c.planned), grade:c.grade??"", note:c.note??""};
  }

  function normalizarCustom(c={}){
    return {
      uid: c.uid || `custom-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      code: normalizarCodigo(c.code || ""),
      name: String(c.name || "").trim(),
      credits: Math.max(0, Number(c.credits || 0)),
      semester: String(c.semester || "1"),
      type: ["fofu","optativo","otro"].includes(c.type) ? c.type : "otro",
      slot: c.slot || "",
      minorIds: Array.isArray(c.minorIds) ? [...new Set(c.minorIds)] : [],
      source: c.source || "manual"
    };
  }

  function cargarDatos(){
    let d = null;
    try{ d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }catch{}
    if(!d || typeof d !== "object") d = defaultData();
    d = {...defaultData(), ...d, preferences:{...defaultData().preferences, ...(d.preferences||{})}, courses:d.courses||{}, customCourses:Array.isArray(d.customCourses)?d.customCourses:[]};
    Object.keys(d.courses).forEach(k => d.courses[k] = normalizarCurso(d.courses[k]));
    d.customCourses = d.customCourses.map(normalizarCustom);
    if(!localStorage.getItem(STORAGE_KEY)){
      try{
        const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]");
        if(Array.isArray(legacy)) legacy.forEach(id => d.courses[id] = {...normalizarCurso(), state:"approved"});
      }catch{}
    }
    return d;
  }

  function guardarDatos({toast=false}={}){
    data.version = VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if(toast) mostrarToast("Progreso guardado");
  }

  function cursoData(id){
    if(!data.courses[id]) data.courses[id] = normalizarCurso();
    return data.courses[id];
  }

  function normalizarCodigo(code){ return String(code).toUpperCase().replace(/\s+/g, "").trim(); }
  function codigoVisible(code){ return normalizarCodigo(code).replace(/^([A-ZÁÉÍÓÚÑ]+)(\d)/, "$1 $2"); }
  function tipoLabel(t){ return ({fofu:"FOFU",optativo:"Optativo",otro:"Otro"})[t] || "Otro"; }

  function refreshCollections(){
    ramos = $$(".ramo");
    baseRamos = ramos.filter(r => r.dataset.custom !== "1");
    customRamos = ramos.filter(r => r.dataset.custom === "1");
    semestres = $$(".semestre");
    cursosPorId = new Map(ramos.map(r => [r.dataset.id, r]));
    reverseDeps = new Map();
    baseRamos.forEach(r => obtenerRequisitos(r).forEach(p => {
      if(!reverseDeps.has(p)) reverseDeps.set(p, []);
      reverseDeps.get(p).push(r.dataset.id);
    }));
  }

  function obtenerRequisitos(r){ return (r?.dataset.requisitos || "").split(",").map(x=>x.trim()).filter(Boolean); }
  function nombre(id){ return cursosPorId.get(id)?.querySelector(".nombre")?.textContent.trim() || id; }
  function creditos(idOrR){ const r = typeof idOrR === "string" ? cursosPorId.get(idOrR) : idOrR; return Number(r?.dataset.creditos || 0); }
  function estadoAprobado(id){ return cursoData(id).state === "approved"; }
  function bloqueado(r){ if(r?.dataset.custom === "1") return false; const req=obtenerRequisitos(r); return req.length>0 && !req.every(estadoAprobado); }
  function estadoVisual(r){ const d=cursoData(r.dataset.id); if(d.state==="approved")return"aprobado"; if(d.state==="inprogress")return"cursando"; if(d.planned)return"planificado"; if(bloqueado(r))return"bloqueado"; return"disponible"; }
  function etiquetaEstado(e){ return ({aprobado:"Aprobado",cursando:"Cursando",planificado:"Planificado",bloqueado:"Bloqueado",disponible:"Disponible"})[e]||e; }

  function minorIdsParaCodigo(code){
    const c = normalizarCodigo(code);
    return MINORS.filter(m => m.courses.some(x => normalizarCodigo(x.code) === c)).map(m => m.id);
  }

  function customPorUid(uid){ return data.customCourses.find(c => c.uid === uid); }
  function customPorCodigo(code){ const c=normalizarCodigo(code); return data.customCourses.find(x => normalizarCodigo(x.code)===c); }

  function renderCustomCourses(){
    $$(".ramo-personalizado").forEach(r => r.remove());
    data.customCourses.forEach(c => {
      const sem = $("#semestre-" + c.semester);
      if(!sem) return;
      const article = document.createElement("article");
      article.className = "ramo ramo-personalizado";
      article.dataset.id = c.uid;
      article.dataset.custom = "1";
      article.dataset.codigo = c.code;
      article.dataset.semestre = c.semester;
      article.dataset.creditos = String(c.credits);
      article.dataset.area = tipoLabel(c.type);
      article.dataset.tipo = c.type;
      article.tabIndex = 0;
      article.setAttribute("aria-label", c.name);
      article.innerHTML = `
        <button class="ramo-info-btn" type="button" aria-label="Ver detalles de ${escapeHtml(c.name)}" title="Ver detalles">i</button>
        <div class="codigo">${escapeHtml(codigoVisible(c.code))}</div>
        <div class="nombre">${escapeHtml(c.name)}</div>
        <div class="ramo-meta"><span class="creditos">${c.credits} créditos</span><span class="ramo-estado-badge"></span></div>
        <div class="personal-tags"><span>${escapeHtml(tipoLabel(c.type))}</span>${c.slot?`<span>${escapeHtml(c.slot)}</span>`:""}</div>`;
      sem.append(article);
    });
    refreshCollections();
  }

  function sincronizarUI(){
    ramos.forEach(r => {
      const d = cursoData(r.dataset.id), b = bloqueado(r);
      if(b && ["approved","inprogress"].includes(d.state)) d.state = "none";
      r.classList.toggle("aprobado", d.state === "approved");
      r.classList.toggle("cursando", d.state === "inprogress");
      r.classList.toggle("planificado", d.planned);
      r.classList.toggle("bloqueado", b);
      const badge = $(".ramo-estado-badge", r);
      if(badge) badge.textContent = etiquetaEstado(estadoVisual(r));
    });
    actualizarDashboard();
    actualizarSemestres();
    aplicarFiltros();
    actualizarModalActivo();
    guardarDatos();
  }

  function actualizarDashboard(){
    const aprob = baseRamos.filter(r=>cursoData(r.dataset.id).state==="approved");
    const curs = ramos.filter(r=>cursoData(r.dataset.id).state==="inprogress");
    const plan = ramos.filter(r=>cursoData(r.dataset.id).planned && cursoData(r.dataset.id).state!=="approved");
    const totCred = baseRamos.reduce((s,r)=>s+creditos(r),0);
    const aprCred = aprob.reduce((s,r)=>s+creditos(r),0);
    const curCred = curs.reduce((s,r)=>s+creditos(r),0);
    const planCred = plan.reduce((s,r)=>s+creditos(r),0);
    const pct = baseRamos.length ? Math.round(aprob.length/baseRamos.length*100) : 0;
    const extrasCr = customRamos.reduce((s,r)=>s+creditos(r),0);

    el.ramosAprobados.textContent = aprob.length;
    el.ramosTotales.textContent = baseRamos.length;
    el.creditosAprobados.textContent = aprCred;
    el.creditosTotales.textContent = totCred;
    el.porcentaje.textContent = `${pct}%`;
    el.barra.style.width = `${pct}%`;
    el.barraFondo.setAttribute("aria-valuenow", pct);
    el.cursandoCantidad.textContent = curs.length;
    el.cursandoCreditos.textContent = curCred;
    el.planCantidad.textContent = plan.length;
    el.planCreditos.textContent = planCred;
    el.plannerResumen.textContent = `${plan.length} ramos · ${planCred} créditos`;
    el.extrasCantidad.textContent = customRamos.length;
    el.extrasCreditos.textContent = extrasCr;

    const grades = ramos.map(r=>parseFloat(cursoData(r.dataset.id).grade)).filter(n=>Number.isFinite(n)&&n>=1&&n<=7);
    el.promedio.textContent = grades.length ? (grades.reduce((a,b)=>a+b,0)/grades.length).toFixed(2) : "—";

    const completados = semestres.filter(s => $$(".ramo:not([data-custom='1'])",s).every(r=>cursoData(r.dataset.id).state==="approved")).length;
    let semActual = data.preferences.currentSemester;
    if(semActual === "auto"){
      const p = semestres.find(s => !$$(".ramo:not([data-custom='1'])",s).every(r=>cursoData(r.dataset.id).state==="approved"));
      semActual = p ? p.dataset.semestre : "10";
    }
    el.resumen.textContent = aprob.length===baseRamos.length ? `Malla completada · 10 de 10 semestres completados` : `${semActual}° Semestre · ${completados} de 10 semestres completados`;
    actualizarMinorDashboard();
  }

  function actualizarMinorDashboard(){
    const minorId = data.preferences.minor;
    if(!minorId){ el.minorProgreso.textContent = "—"; el.minorLabel.textContent = "Minor"; return; }
    const minor = MINOR_BY_ID.get(minorId);
    const codes = new Set(minor.courses.map(c=>normalizarCodigo(c.code)).filter(c=>!["IER010","IER020"].includes(c)));
    const approvedCodes = new Set();
    data.customCourses.forEach(c => {
      if(codes.has(normalizarCodigo(c.code)) && cursoData(c.uid).state === "approved") approvedCodes.add(normalizarCodigo(c.code));
    });
    el.minorProgreso.textContent = `${Math.min(approvedCodes.size,5)}/5`;
    el.minorLabel.textContent = minor.name;
  }

  function actualizarSemestres(){
    semestres.forEach(s => {
      const base = $$(".ramo:not([data-custom='1'])", s);
      const extras = $$(".ramo[data-custom='1']", s);
      const apr = base.filter(r=>cursoData(r.dataset.id).state==="approved");
      const credT = base.reduce((a,r)=>a+creditos(r),0), credA = apr.reduce((a,r)=>a+creditos(r),0);
      const c = $(".semestre-progreso", s);
      c.textContent = `${apr.length}/${base.length} base · ${credA}/${credT} cr.${extras.length?` · ${extras.length} complementario${extras.length===1?"":"s"}`:""}`;
      s.classList.toggle("completado", base.length>0 && apr.length===base.length);
    });
  }

  async function cambiarEstado(r,nuevo){
    const id=r.dataset.id,d=cursoData(id);
    if(nuevo==="approved"&&bloqueado(r)){mostrarToast("Primero debes aprobar sus prerrequisitos");return;}
    if(nuevo==="inprogress"&&bloqueado(r)){mostrarToast("Este ramo todavía está bloqueado");return;}
    if(d.state==="approved"&&nuevo!=="approved"&&r.dataset.custom!=="1"){
      const afect=dependientesActivos(id);
      if(afect.length){
        const ok=await confirmar(`Desmarcar ${nombre(id)} afectará ${afect.length} ramo(s): ${afect.map(nombre).join(", ")}. Los que queden sin prerrequisitos se devolverán a Disponible. ¿Continuar?`);
        if(!ok)return;
      }
    }
    d.state=nuevo;
    if(nuevo==="approved") d.planned=false;
    cascadeInvalidos();
    sincronizarUI();
    mostrarToast(nuevo==="approved"?"Ramo marcado como aprobado":nuevo==="inprogress"?"Ramo marcado como cursando":"Estado actualizado");
  }

  function dependientesActivos(id){
    const seen=new Set(),out=[];
    function walk(x){(reverseDeps.get(x)||[]).forEach(dep=>{if(seen.has(dep))return;seen.add(dep);const d=cursoData(dep);if(["approved","inprogress"].includes(d.state))out.push(dep);walk(dep)});}
    walk(id);return out;
  }

  function cascadeInvalidos(){
    let cambio=true;
    while(cambio){
      cambio=false;
      baseRamos.forEach(r=>{const d=cursoData(r.dataset.id);if(bloqueado(r)&&["approved","inprogress"].includes(d.state)){d.state="none";cambio=true;}});
    }
  }

  function togglePlan(r){
    const d=cursoData(r.dataset.id);
    if(d.state==="approved"){mostrarToast("Un ramo aprobado no necesita planificación");return;}
    d.planned=!d.planned;sincronizarUI();mostrarToast(d.planned?"Agregado al próximo semestre":"Quitado de la planificación");
  }

  // Interacción por delegación: funciona también con ramos agregados manualmente.
  $("#malla").addEventListener("pointerup", e => {
    const r = e.target.closest?.(".ramo");
    if(!r || e.target.closest?.(".ramo-info-btn")) return;
    if(e.pointerType === "mouse" && e.button !== 0) return;
    const ahora = performance.now();
    const anterior = interacciones.get(r) || {ultimo:0,timer:null};
    const esDoble = ahora-anterior.ultimo <= 430;
    if(esDoble){ if(anterior.timer)clearTimeout(anterior.timer); interacciones.set(r,{ultimo:0,timer:null}); e.preventDefault(); abrirRamo(r); return; }
    const timer=setTimeout(()=>{const d=cursoData(r.dataset.id);cambiarEstado(r,d.state==="approved"?"none":"approved");interacciones.set(r,{ultimo:0,timer:null});},440);
    interacciones.set(r,{ultimo:ahora,timer});
  });

  $("#malla").addEventListener("dblclick", e => {
    const r=e.target.closest?.(".ramo"); if(!r||e.target.closest?.(".ramo-info-btn"))return;
    e.preventDefault();const anterior=interacciones.get(r);if(anterior?.timer)clearTimeout(anterior.timer);interacciones.set(r,{ultimo:0,timer:null});abrirRamo(r);
  });

  $("#malla").addEventListener("click", e => {
    const btn=e.target.closest?.(".ramo-info-btn"); if(!btn)return;
    e.preventDefault();e.stopPropagation();const r=btn.closest(".ramo");if(r)abrirRamo(r);
  });

  $("#malla").addEventListener("keydown", e => {
    if(e.target.closest?.(".ramo-info-btn"))return;
    const r=e.target.closest?.(".ramo"); if(!r)return;
    if(e.key==="Enter"||e.key===" "){e.preventDefault();abrirRamo(r);}
  });

  function abrirRamo(r){ cursoActivo=r; renderModalRamo(r); el.modalRamo.hidden=false; setTimeout(()=>$("#modalRamo [data-close-modal]")?.focus(),0); }
  function actualizarModalActivo(){ if(cursoActivo&&!el.modalRamo.hidden&&document.body.contains(cursoActivo))renderModalRamo(cursoActivo); }

  function renderModalRamo(r){
    const id=r.dataset.id,d=cursoData(id),est=estadoVisual(r),custom=r.dataset.custom==="1"?customPorUid(id):null;
    $("#detalleCodigo").textContent = custom ? codigoVisible(custom.code) : id;
    $("#detalleNombre").textContent = nombre(id);
    $("#detalleCreditos").textContent = `${creditos(r)} créditos`;
    $("#detalleArea").textContent = r.dataset.area;
    const tipoEl=$("#detalleTipo");tipoEl.hidden=!custom;tipoEl.textContent=custom?tipoLabel(custom.type):"";
    $("#detalleEstado").textContent = etiquetaEstado(est);
    $("#detalleNota").value = d.grade;
    $("#detalleComentario").value = d.note;

    $$("#estadoSelector [data-set-state]").forEach(b=>{b.classList.toggle("activo",b.dataset.setState===d.state);if(["approved","inprogress"].includes(b.dataset.setState))b.disabled=bloqueado(r);});
    const pb=$("#estadoSelector [data-toggle-plan]");pb.classList.toggle("activo",d.planned);pb.textContent=d.planned?"Planificado ✓":"Planificar";

    const req=obtenerRequisitos(r),reqC=$("#detalleRequisitos");reqC.replaceChildren();
    if(!req.length) reqC.innerHTML='<p class="detalle-faltantes">Este ramo no tiene prerrequisitos.</p>';
    else req.forEach(x=>{const item=document.createElement("div");item.className=`requisito-item ${estadoAprobado(x)?"cumplido":"faltante"}`;item.textContent=`${estadoAprobado(x)?"✓":"✗"} ${nombre(x)}`;reqC.append(item);});
    const falt=req.filter(x=>!estadoAprobado(x));
    $("#detalleFaltantes").textContent=falt.length?`Falta aprobar: ${falt.map(nombre).join(" · ")}`:req.length?"Todos los prerrequisitos están cumplidos.":"";

    const rutas=custom?[]:obtenerRutas(id),rc=$("#detalleRutas");rc.replaceChildren();
    if(!rutas.length)rc.innerHTML='<p class="detalle-faltantes">Sin cadena previa.</p>';else rutas.slice(0,8).forEach(path=>{const div=document.createElement("div");div.className="ruta";div.textContent=path.map(nombre).join(" → ");rc.append(div);});
    const desc=custom?[]:(reverseDeps.get(id)||[]),dc=$("#detalleDesbloquea");dc.replaceChildren();
    if(!desc.length)dc.innerHTML='<span class="chip">No desbloquea ramos directos</span>';else desc.forEach(x=>{const sp=document.createElement("span");sp.className="chip";sp.textContent=`${x} · ${nombre(x)}`;dc.append(sp);});

    const minorWrap=$("#detalleMinorWrap"),minorC=$("#detalleMinor");minorC.replaceChildren();
    const memberships=custom?.minorIds?.map(id=>MINOR_BY_ID.get(id)).filter(Boolean)||[];
    minorWrap.hidden=!memberships.length;
    memberships.forEach(m=>{const sp=document.createElement("span");sp.className="chip";sp.textContent=m.name;minorC.append(sp);});

    const actions=$("#customCourseActions");actions.hidden=!custom;
  }

  function obtenerRutas(id){
    const r=cursosPorId.get(id),req=obtenerRequisitos(r);if(!req.length)return[];const out=[];
    function walk(x,path,seen){if(seen.has(x))return;const nr=cursosPorId.get(x),pr=obtenerRequisitos(nr);if(!pr.length){out.push([...path,x]);return;}pr.forEach(p=>walk(p,[...path,x],new Set([...seen,x])));}
    req.forEach(p=>walk(p,[],new Set([id])));return out.map(p=>[...p,id]);
  }

  $("#estadoSelector").addEventListener("click",e=>{const st=e.target.closest("[data-set-state]")?.dataset.setState;if(st&&cursoActivo)cambiarEstado(cursoActivo,st);if(e.target.closest("[data-toggle-plan]")&&cursoActivo)togglePlan(cursoActivo);});
  $("#detalleNota").addEventListener("input",e=>{if(!cursoActivo)return;cursoData(cursoActivo.dataset.id).grade=e.target.value;guardarDatos();actualizarDashboard();});
  $("#detalleComentario").addEventListener("input",e=>{if(!cursoActivo)return;cursoData(cursoActivo.dataset.id).note=e.target.value;guardarDatos();});
  $("#editarCustomBtn").addEventListener("click",()=>{if(!cursoActivo||cursoActivo.dataset.custom!=="1")return;const c=customPorUid(cursoActivo.dataset.id);cerrarModal(el.modalRamo);abrirFormularioRamo(c);});
  $("#eliminarCustomBtn").addEventListener("click",async()=>{if(!cursoActivo||cursoActivo.dataset.custom!=="1")return;const c=customPorUid(cursoActivo.dataset.id);if(!(await confirmar(`¿Eliminar ${c.name} de tu malla personal?`)))return;delete data.courses[c.uid];data.customCourses=data.customCourses.filter(x=>x.uid!==c.uid);cerrarModal(el.modalRamo);renderCustomCourses();sincronizarUI();mostrarToast("Ramo eliminado");});

  // Filtros y navegación
  ["buscador","filtroEstado","filtroSemestre","filtroArea"].forEach(id=>$("#"+id).addEventListener(id==="buscador"?"input":"change",aplicarFiltros));
  function aplicarFiltros(){
    const q=$("#buscador").value.trim().toLowerCase(),est=$("#filtroEstado").value,sem=$("#filtroSemestre").value,area=$("#filtroArea").value;
    ramos.forEach(r=>{const code=r.dataset.custom==="1"?r.dataset.codigo:r.dataset.id;const okQ=!q||`${code} ${nombre(r.dataset.id)}`.toLowerCase().includes(q),okE=est==="todos"||estadoVisual(r)===est,okS=sem==="todos"||r.dataset.semestre===sem,okA=area==="todas"||r.dataset.area===area;r.classList.toggle("oculto",!(okQ&&okE&&okS&&okA));});
    semestres.forEach(s=>s.classList.toggle("sin-resultados",$$(".ramo:not(.oculto)",s).length===0));
  }
  $$(".semester-nav [data-go-sem]").forEach(b=>b.addEventListener("click",()=>$("#semestre-"+b.dataset.goSem)?.scrollIntoView({behavior:"smooth",inline:"start",block:"nearest"})));

  // Modal general
  function abrirGeneral(titulo,html){el.generalTitulo.textContent=titulo;el.generalContenido.innerHTML=html;el.modalGeneral.hidden=false;engancharGeneral();}
  function cerrarModal(m){m.hidden=true;if(m===el.modalRamo)cursoActivo=null;}
  document.addEventListener("click",e=>{const boton=e.target.closest?.("[data-close-modal]");if(!boton)return;e.preventDefault();e.stopPropagation();const modal=boton.closest(".modal-fondo");if(modal)cerrarModal(modal);});
  [el.modalRamo,el.modalGeneral].forEach(m=>m.addEventListener("click",e=>{if(e.target===m)cerrarModal(m);}));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){[el.modalRamo,el.modalGeneral,el.modalTutorial].forEach(m=>{if(!m.hidden)cerrarModal(m);});}});

  $("#puedoTomarBtn").addEventListener("click",()=>{const list=baseRamos.filter(r=>estadoVisual(r)==="disponible");abrirGeneral("¿Qué puedo tomar ahora?",list.length?`<div class="general-list">${list.map(r=>`<div class="general-item"><strong>${r.dataset.id} · ${escapeHtml(nombre(r.dataset.id))}</strong>${r.dataset.semestre}° semestre · ${creditos(r)} créditos · ${r.dataset.area}</div>`).join("")}</div>`:"<p>No hay ramos disponibles pendientes en este momento.</p>");});
  $("#verPlanBtn").addEventListener("click",()=>{const list=ramos.filter(r=>cursoData(r.dataset.id).planned&&cursoData(r.dataset.id).state!=="approved"),cr=list.reduce((a,r)=>a+creditos(r),0);abrirGeneral("Planificación del próximo semestre",`<p>${list.length} ramos · ${cr} créditos planificados</p>${list.length?`<div class="general-list">${list.map(r=>`<div class="general-item"><strong>${r.dataset.custom==="1"?codigoVisible(r.dataset.codigo):r.dataset.id} · ${escapeHtml(nombre(r.dataset.id))}</strong>${creditos(r)} créditos · ${bloqueado(r)?"Aún bloqueado":"Disponible para cursar"}</div>`).join("")}</div>`:"<p>Aún no has planificado ramos.</p>"}`);});
  $("#estadisticasBtn").addEventListener("click",()=>{const areas=[...new Set(ramos.map(r=>r.dataset.area))].sort();const rows=areas.map(a=>{const rs=ramos.filter(r=>r.dataset.area===a),ap=rs.filter(r=>cursoData(r.dataset.id).state==="approved"),pct=Math.round(ap.length/rs.length*100);return`<div class="area-stat"><span>${a}</span><div class="mini-bar"><i style="width:${pct}%"></i></div><strong>${ap.length}/${rs.length}</strong></div>`}).join("");abrirGeneral("Estadísticas por área",rows);});

  // Ramo manual
  $("#agregarRamoBtn").addEventListener("click",()=>abrirFormularioRamo());

  function opcionesSemestre(selected=""){
    return Array.from({length:10},(_,i)=>`<option value="${i+1}" ${String(i+1)===String(selected)?"selected":""}>${i+1}° semestre</option>`).join("");
  }

  function opcionesSlot(tipo,selected=""){
    const set=SUGERENCIAS[tipo]||{};
    return `<option value="">Sin cupo referencial</option>`+Object.keys(set).map(k=>`<option value="${k}" ${k===selected?"selected":""}>${k} · sugerido ${set[k]}° semestre</option>`).join("");
  }

  function abrirFormularioRamo(existing=null,prefill=null){
    const c=existing||{uid:"",code:prefill?.code||"",name:prefill?.name||"",credits:"",semester:data.preferences.currentSemester==="auto"?"1":data.preferences.currentSemester,type:prefill?.type||"fofu",slot:"",minorIds:prefill?.minorIds||[],source:prefill?.source||"manual"};
    const d=existing?cursoData(existing.uid):normalizarCurso();
    abrirGeneral(existing?"Editar ramo personal":"Agregar ramo a mi malla",`
      <form id="customCourseForm" class="custom-form">
        <div class="form-grid custom-form-grid">
          <label>Tipo<select id="customTipo"><option value="fofu">FOFU / Formación Fundamental</option><option value="optativo">Optativo</option><option value="otro">Otro</option></select></label>
          <label>Sigla<input id="customCodigo" required maxlength="16" placeholder="Ej. EPE075" value="${escapeHtml(c.code)}"></label>
          <label class="full">Nombre<input id="customNombre" required maxlength="140" placeholder="Nombre del ramo" value="${escapeHtml(c.name)}"></label>
          <label>Créditos<input id="customCreditos" required type="number" min="0" max="30" step="1" value="${escapeHtml(c.credits)}"></label>
          <label>Semestre real<select id="customSemestre">${opcionesSemestre(c.semester)}</select></label>
          <label class="full">Cupo referencial<select id="customSlot"></select><small id="customReferencia"></small></label>
          <label>Estado<select id="customEstado"><option value="none">Disponible</option><option value="inprogress">Cursando</option><option value="approved">Aprobado</option></select></label>
          <label>Nota final<input id="customNota" type="number" min="1" max="7" step="0.1" value="${escapeHtml(d.grade)}" placeholder="Opcional"></label>
          <label class="full">Comentario<textarea id="customComentario" rows="3" placeholder="Opcional">${escapeHtml(d.note)}</textarea></label>
        </div>
        <label class="check-row"><input id="customPlan" type="checkbox" ${d.planned?"checked":""}> Planificar para próximo semestre</label>
        <p class="detalle-faltantes">La ubicación por semestre es personal. Los cupos referenciales solo replican la distribución sugerida por la malla oficial.</p>
        <div class="modal-actions"><button class="btn secundario" type="button" data-close-modal>Cancelar</button><button class="btn" type="submit">Guardar ramo</button></div>
      </form>`);
    const tipo=$("#customTipo");tipo.value=c.type;
    const estado=$("#customEstado");estado.value=d.state;
    const slot=$("#customSlot");
    const actualizarSlots=()=>{slot.innerHTML=opcionesSlot(tipo.value,c.slot);const ref=$("#customReferencia");const sem=SUGERENCIAS[tipo.value]?.[slot.value];ref.textContent=sem?`Referencia oficial: este cupo aparece sugerido en ${sem}° semestre. Puedes cursarlo en otro semestre.`:"Sin referencia fija.";};
    tipo.addEventListener("change",actualizarSlots);slot.addEventListener("change",actualizarSlots);actualizarSlots();
    $("#customCourseForm").addEventListener("submit",e=>{e.preventDefault();guardarCustomDesdeForm(existing,prefill);});
  }

  function guardarCustomDesdeForm(existing,prefill){
    const code=normalizarCodigo($("#customCodigo").value),name=$("#customNombre").value.trim(),credits=Number($("#customCreditos").value),semester=$("#customSemestre").value,type=$("#customTipo").value,slot=$("#customSlot").value;
    if(!code||!name||!Number.isFinite(credits)){mostrarToast("Completa sigla, nombre y créditos");return;}
    const baseCollision=baseRamos.some(r=>normalizarCodigo(r.dataset.id)===code);
    const customCollision=data.customCourses.some(c=>c.uid!==existing?.uid&&normalizarCodigo(c.code)===code);
    if(baseCollision||customCollision){mostrarToast("Ya existe un ramo con esa sigla en tu malla");return;}
    const uid=existing?.uid||`custom-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const memberships=[...new Set([...(prefill?.minorIds||existing?.minorIds||[]),...minorIdsParaCodigo(code)])];
    const item=normalizarCustom({uid,code,name,credits,semester,type,slot,minorIds:memberships,source:prefill?.source||existing?.source||"manual"});
    if(existing)data.customCourses=data.customCourses.map(c=>c.uid===uid?item:c);else data.customCourses.push(item);
    data.courses[uid]=normalizarCurso({state:$("#customEstado").value,planned:$("#customPlan").checked,grade:$("#customNota").value,note:$("#customComentario").value});
    guardarDatos();cerrarModal(el.modalGeneral);renderCustomCourses();sincronizarUI();mostrarToast(existing?"Ramo actualizado":"Ramo agregado a tu malla");
  }

  // Minor / FOFUs
  $("#minorBtn").addEventListener("click",abrirMinor);
  function abrirMinor(){
    const current=data.preferences.minor;
    abrirGeneral("Minor y FOFUs",`
      <div class="minor-panel">
        <div class="settings-row"><div><label>Minor</label><small>Los Minors agrupan cursos de Formación Fundamental. Puedes cambiarlo cuando quieras.</small></div><select id="minorSelect"><option value="">No estoy siguiendo un Minor</option>${MINORS.map(m=>`<option value="${m.id}" ${m.id===current?"selected":""}>${escapeHtml(m.name)}</option>`).join("")}</select></div>
        <div id="minorContenido"></div>
      </div>`);
    const select=$("#minorSelect");select.addEventListener("change",()=>{data.preferences.minor=select.value;guardarDatos();actualizarMinorDashboard();renderMinorContenido();});renderMinorContenido();
  }

  function renderMinorContenido(){
    const c=$("#minorContenido");if(!c)return;const id=data.preferences.minor;if(!id){c.innerHTML='<p class="detalle-faltantes">Puedes seguir cursando FOFUs libremente sin seleccionar un Minor.</p>';return;}
    const minor=MINOR_BY_ID.get(id);
    const codesValidos=new Set(minor.courses.map(x=>normalizarCodigo(x.code)).filter(x=>!["IER010","IER020"].includes(x)));
    const aprob=new Set(data.customCourses.filter(x=>codesValidos.has(normalizarCodigo(x.code))&&cursoData(x.uid).state==="approved").map(x=>normalizarCodigo(x.code)));
    const ant=estadoAprobado("IER010"),eti=estadoAprobado("IER020");
    c.innerHTML=`
      <div class="minor-summary"><strong>${Math.min(aprob.size,5)}/5 FOFUs aprobados</strong><span>${ant?"✓":"○"} Antropología Cristiana · ${eti?"✓":"○"} Ética Cristiana</span><small>La certificación oficial requiere 5 asignaturas del Minor y las dos obligatorias.</small></div>
      <div class="minor-catalog">${minor.courses.map(course=>{const existing=customPorCodigo(course.code)||baseRamos.find(r=>normalizarCodigo(r.dataset.id)===normalizarCodigo(course.code));return`<div class="minor-course"><div><strong>${escapeHtml(codigoVisible(course.code))} · ${escapeHtml(course.name)}</strong>${course.unavailable?'<span class="availability-note">No programada 2S-2026</span>':''}</div>${existing?'<button class="btn secundario" disabled>En tu malla</button>':`<button class="btn" data-add-minor="${escapeHtml(course.code)}">Agregar</button>`}</div>`}).join("")}</div>`;
    $$('[data-add-minor]',c).forEach(b=>b.addEventListener('click',()=>{const course=minor.courses.find(x=>normalizarCodigo(x.code)===normalizarCodigo(b.dataset.addMinor));cerrarModal(el.modalGeneral);abrirFormularioRamo(null,{code:course.code,name:course.name,type:"fofu",minorIds:minorIdsParaCodigo(course.code),source:"minor"});}));
  }

  // Semestre actual / backup
  $("#editarSemestreBtn").addEventListener("click",()=>abrirGeneral("Semestre actual",`<div class="settings-grid"><div class="settings-row"><div><label>Semestre mostrado en el resumen</label><small>Puedes dejarlo automático o elegirlo tú.</small></div><select id="semestreActualSelect"><option value="auto">Automático</option>${Array.from({length:10},(_,i)=>`<option value="${i+1}">${i+1}° semestre</option>`).join("")}</select></div></div>`));
  $("#datosBtn").addEventListener("click",()=>abrirGeneral("Backup y datos",`<div class="general-list"><button class="btn" data-action="export">Exportar backup (.json)</button><button class="btn" data-action="copy">Copiar backup</button><button class="btn" data-action="import">Importar backup</button><button class="btn peligro-suave" data-action="clear-grades">Borrar solo notas finales</button></div><p class="detalle-faltantes">El backup incluye tu progreso, Minor, FOFUs, optativos, otros ramos, notas y comentarios.</p>`));

  function engancharGeneral(){
    const sel=$("#semestreActualSelect");if(sel){sel.value=data.preferences.currentSemester;sel.addEventListener("change",()=>{data.preferences.currentSemester=sel.value;guardarDatos();actualizarDashboard();mostrarToast("Semestre actual actualizado");});}
    $$('[data-action]',el.generalContenido).forEach(b=>b.addEventListener('click',()=>accionDatos(b.dataset.action)));
  }

  async function accionDatos(a){
    if(a==='export')exportarBackup();
    if(a==='copy'){await navigator.clipboard.writeText(JSON.stringify(data,null,2));mostrarToast('Backup copiado al portapapeles');}
    if(a==='import')el.importInput.click();
    if(a==='clear-grades'&&await confirmar('¿Borrar todas las notas finales registradas? El progreso de ramos no se tocará.')){Object.values(data.courses).forEach(c=>c.grade='');guardarDatos();actualizarDashboard();cerrarModal(el.modalGeneral);mostrarToast('Notas finales borradas');}
  }

  function exportarBackup(){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`malla-pucv-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);mostrarToast('Backup descargado');}

  el.importInput.addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const parsed=JSON.parse(await f.text());if(!parsed||typeof parsed!=='object'||!parsed.courses)throw new Error();if(!(await confirmar('Importar este backup reemplazará el progreso actual. ¿Continuar?')))return;data={...defaultData(),...parsed,preferences:{...defaultData().preferences,...(parsed.preferences||{})},customCourses:Array.isArray(parsed.customCourses)?parsed.customCourses.map(normalizarCustom):[]};Object.keys(data.courses||{}).forEach(k=>data.courses[k]=normalizarCurso(data.courses[k]));renderCustomCourses();aplicarPreferencias();sincronizarUI();cerrarModal(el.modalGeneral);mostrarToast('Backup importado correctamente');}catch{mostrarToast('No pude leer ese backup');}finally{e.target.value='';}});

  // Compartir / tarjeta
  $("#compartirBtn").addEventListener("click",async()=>{const t=resumenTexto();try{if(navigator.share)await navigator.share({title:'Mi avance · Pedagogía en Inglés PUCV',text:t,url:location.href});else{await navigator.clipboard.writeText(`${t}\n${location.href}`);mostrarToast('Resumen copiado');}}catch{}});
  function resumenTexto(){const ap=baseRamos.filter(r=>cursoData(r.dataset.id).state==='approved'),cr=ap.reduce((a,r)=>a+creditos(r),0),tot=baseRamos.reduce((a,r)=>a+creditos(r),0),pct=Math.round(ap.length/baseRamos.length*100),extraCr=customRamos.reduce((a,r)=>a+creditos(r),0);return`Pedagogía en Inglés PUCV · ${ap.length}/${baseRamos.length} ramos base · ${cr}/${tot} créditos · ${pct}% completado · ${customRamos.length} complementarios (${extraCr} cr.)`;}
  $("#tarjetaBtn").addEventListener("click",()=>{const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const c=canvas.getContext('2d');c.fillStyle='#fcf7d9';c.fillRect(0,0,1080,1350);c.fillStyle='#faece8';roundRect(c,80,90,920,1170,42);c.fill();c.strokeStyle='#604734';c.lineWidth=6;c.stroke();c.fillStyle='#604734';c.textAlign='center';c.font='italic 74px Georgia';c.fillText('Pedagogía en Inglés',540,220);c.font='700 34px Arial';c.fillText('PUCV',540,275);const ap=baseRamos.filter(r=>cursoData(r.dataset.id).state==='approved').length,pct=Math.round(ap/baseRamos.length*100),cr=baseRamos.filter(r=>cursoData(r.dataset.id).state==='approved').reduce((a,r)=>a+creditos(r),0),tot=baseRamos.reduce((a,r)=>a+creditos(r),0);c.font='700 170px Arial';c.fillText(`${pct}%`,540,570);c.font='600 38px Arial';c.fillText(`${ap} de ${baseRamos.length} ramos base`,540,680);c.fillText(`${cr} de ${tot} créditos`,540,745);c.font='500 28px Arial';c.fillText(`${customRamos.length} ramos complementarios`,540,805);c.fillStyle='#f0c5d4';roundRect(c,180,860,720,54,27);c.fill();c.fillStyle='#604734';roundRect(c,180,860,720*pct/100,54,27);c.fill();c.font='500 26px Arial';c.fillText('Mi avance académico',540,990);c.font='400 22px Arial';c.fillText('Malla interactiva no oficial',540,1055);c.fillText('unstablehoon.github.io/malla-pedagogia-ingles-pucv',540,1110);const a=document.createElement('a');a.download='mi-avance-pucv.png';a.href=canvas.toDataURL('image/png');a.click();mostrarToast('Tarjeta creada');});
  function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):ctx.rect(x,y,w,h);}

  // Impresión
  $("#imprimirBtn").addEventListener("click",()=>abrirGeneral('Imprimir',`<div class="general-list"><button class="btn" data-print="full">Malla completa</button><button class="btn" data-print="summary">Resumen de avance</button></div><p class="detalle-faltantes">Los FOFUs, optativos y otros ramos agregados aparecerán en el semestre real que elegiste. Para conservar colores, activa “gráficos/fondos” si tu navegador lo pide.</p>`));
  el.generalContenido.addEventListener('click',e=>{const mode=e.target.closest('[data-print]')?.dataset.print;if(!mode)return;cerrarModal(el.modalGeneral);prepararPrintSummary();document.body.classList.toggle('print-summary-mode',mode==='summary');setTimeout(()=>window.print(),60);});
  window.addEventListener('afterprint',()=>document.body.classList.remove('print-summary-mode'));
  function prepararPrintSummary(){const aprob=baseRamos.filter(r=>cursoData(r.dataset.id).state==='approved'),curs=ramos.filter(r=>cursoData(r.dataset.id).state==='inprogress'),plan=ramos.filter(r=>cursoData(r.dataset.id).planned&&cursoData(r.dataset.id).state!=='approved'),cr=aprob.reduce((a,r)=>a+creditos(r),0),tot=baseRamos.reduce((a,r)=>a+creditos(r),0),pct=Math.round(aprob.length/baseRamos.length*100),extraCr=customRamos.reduce((a,r)=>a+creditos(r),0);el.printSummary.innerHTML=`<h2>Resumen de avance · Pedagogía en Inglés PUCV</h2><div class="print-summary-grid"><div class="print-box"><strong>${pct}%</strong><span>completado</span></div><div class="print-box"><strong>${aprob.length}/${baseRamos.length}</strong><span>ramos base aprobados</span></div><div class="print-box"><strong>${cr}/${tot}</strong><span>créditos base</span></div><div class="print-box"><strong>${curs.length}</strong><span>ramos cursando</span></div><div class="print-box"><strong>${customRamos.length}</strong><span>complementarios · ${extraCr} cr.</span></div><div class="print-box"><strong>${el.promedio.textContent}</strong><span>promedio registrado</span></div></div><div class="print-list">${ramos.map(r=>`<div><strong>${r.dataset.custom==='1'?escapeHtml(codigoVisible(r.dataset.codigo)):r.dataset.id}</strong> · ${escapeHtml(nombre(r.dataset.id))} — ${etiquetaEstado(estadoVisual(r))}${r.dataset.custom==='1'?` · ${r.dataset.area}`:''}</div>`).join('')}</div><p class="print-footer">Herramienta no oficial · v${VERSION} · impreso el ${new Date().toLocaleDateString('es-CL')}</p>`;}

  // Tema / tutorial / cambios
  function aplicarPreferencias(){document.documentElement.dataset.theme=data.preferences.theme;document.body.classList.toggle('vista-compacta',data.preferences.view==='compact');$('#temaBtn').title=data.preferences.theme==='dark'?'Usar tema claro':'Usar tema oscuro';$('#vistaBtn').title=data.preferences.view==='compact'?'Usar vista normal':'Usar vista compacta';}
  $('#temaBtn').addEventListener('click',()=>{data.preferences.theme=data.preferences.theme==='dark'?'light':'dark';aplicarPreferencias();guardarDatos();});
  $('#vistaBtn').addEventListener('click',()=>{data.preferences.view=data.preferences.view==='compact'?'normal':'compact';aplicarPreferencias();guardarDatos();});
  $('#ayudaBtn').addEventListener('click',()=>el.modalTutorial.hidden=false);
  $('#tutorialCerrarBtn').addEventListener('click',()=>{localStorage.setItem(TUTORIAL_KEY,'1');cerrarModal(el.modalTutorial);});
  $('#changelogBtn').addEventListener('click',()=>abrirGeneral('Cambios · v3.1.0',`<div class="general-list"><div class="general-item"><strong>Malla personal</strong>Agrega FOFUs, optativos u otros ramos con sigla, créditos, semestre real, estado, nota y comentario.</div><div class="general-item"><strong>Minor</strong>Selecciona uno de los Minors oficiales PUCV y agrega FOFUs desde su catálogo.</div><div class="general-item"><strong>Referencia oficial</strong>FOFU 1/2/3 se sugieren en 5°/6°/9° y Optativos 1/2/3/4 en 2°/5°/7°/9°, pero puedes ubicarlos donde realmente los cursaste.</div><div class="general-item"><strong>Backup e impresión</strong>Los ramos personales y el Minor ahora viajan en el backup y aparecen en impresión.</div><div class="general-item"><strong>Interacción</strong>Se conserva doble clic, botón i y cierre de modales corregidos de v3.0.2.</div></div>`));

  // Confirmaciones/toast/reset
  function confirmar(texto){el.confirmTexto.textContent=texto;el.modalConfirm.hidden=false;return new Promise(resolve=>{confirmResolver=resolve;});}
  function cerrarConfirm(v){el.modalConfirm.hidden=true;if(confirmResolver){confirmResolver(v);confirmResolver=null;}}
  el.confirmAceptar.addEventListener('click',()=>cerrarConfirm(true));el.confirmCancelar.addEventListener('click',()=>cerrarConfirm(false));el.modalConfirm.addEventListener('click',e=>{if(e.target===el.modalConfirm)cerrarConfirm(false);});
  function mostrarToast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;el.toast.append(d);setTimeout(()=>{d.classList.add('salida');setTimeout(()=>d.remove(),220);},2400);}
  $('#reiniciarBtn').addEventListener('click',async()=>{if(!(await confirmar('¿Seguro que quieres reiniciar todo? Se borrarán estados, planificación, notas, comentarios, Minor y ramos personales.')))return;data=defaultData();guardarDatos();renderCustomCourses();aplicarPreferencias();sincronizarUI();mostrarToast('Progreso reiniciado');});

  // PWA / analytics
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#instalarBtn').hidden=false;});
  $('#instalarBtn').addEventListener('click',async()=>{if(!deferredPrompt){mostrarToast('En iPhone/iPad usa Compartir → Añadir a pantalla de inicio');return;}deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#instalarBtn').hidden=true;});
  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
  function iniciarAnalytics(){const cfg=window.MALLA_CONFIG||{};if(!cfg.analyticsEnabled||!cfg.plausibleDomain)return;const s=document.createElement('script');s.defer=true;s.dataset.domain=cfg.plausibleDomain;s.src='https://plausible.io/js/script.js';document.head.append(s);}
  function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

  // Inicio
  renderCustomCourses();
  aplicarPreferencias();
  sincronizarUI();
  iniciarAnalytics();
  if(!localStorage.getItem(TUTORIAL_KEY))setTimeout(()=>el.modalTutorial.hidden=false,350);
})();
