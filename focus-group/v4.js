(() => {
  "use strict";

  const cfg = window.MALLA_CONFIG || {};
  const api = window.MALLA_V4;
  if (!api) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const GUEST_KEY = "mallaPUCV_v4_guest";
  const LAST_VIEW_KEY = "mallaPUCV_v4_view";
  let supa = null;
  let user = null;
  let profile = null;
  let cloudApplying = false;
  let pushTimer = null;
  let cloudReady = false;

  const quotes = [
    "Great teachers plant seeds that grow forever.",
    "Little by little, ramo by ramo.",
    "Different minds. A kinder future.",
    "Education is a form of love.",
    "You are literally building your degree."
  ];

  function escapeHtml(v){return String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));}
  function normCode(v){return String(v||"").toUpperCase().replace(/\s+/g,"").trim();}
  function toast(t){api.toast?.(t);}

  function buildShell(){
    document.body.classList.add("v4-app");
    const sidebar = document.createElement("aside");
    sidebar.className = "v4-sidebar no-print";
    sidebar.innerHTML = `
      <div class="v4-logo"><div class="v4-logo-mark">✿</div><div><strong>Lingua Flores</strong><span>your degree garden</span></div></div>
      <nav class="v4-nav" aria-label="Secciones">
        ${navButton("home","⌂","Inicio")}
        ${navButton("curriculum","▤","Mi malla")}
        ${navButton("planner","▣","Planificación")}
        ${navButton("minor","✦","Minor & FOFUs")}
        ${navButton("progress","◒","Progreso")}
        ${navButton("backup","⇩","Respaldo")}
        ${navButton("settings","⚙","Ajustes")}
      </nav>
      <div class="v4-sidebar-bottom"><div class="v4-side-quote">“A kinder world speaks more than one language.”</div><div class="v4-user-mini"><div class="v4-avatar" data-avatar>O</div><div><strong data-user-name>Invitada</strong><span data-user-sub>Guardado local</span></div></div></div>`;
    document.body.prepend(sidebar);

    const topbar = document.createElement("div");
    topbar.className = "v4-topbar no-print";
    topbar.innerHTML = `
      <div class="v4-top-title"><small id="v4TopEyebrow">PUCV · DRA 49/2021</small><strong id="v4TopTitle">Pedagogía en Inglés</strong></div>
      <div class="v4-top-actions">
        <label class="v4-top-search">⌕<input id="v4GlobalSearch" type="search" placeholder="Buscar ramos, códigos…"></label>
        <button class="v4-icon-btn" id="v4ThemeBtn" type="button" aria-label="Cambiar tema">☼</button>
        <button class="v4-account-btn" id="v4AccountBtn" type="button"><div class="v4-avatar" data-avatar>O</div><span data-user-name>Invitada</span></button>
      </div>`;
    document.body.insertBefore(topbar, $("main"));

    const main = $("main");
    const hero = document.createElement("section");
    hero.className = "v4-home-hero";
    hero.innerHTML = `
      <div class="v4-hero-card"><p class="eyebrow">Tu espacio académico</p><h1>Pedagogía en Inglés</h1><p>same degree. a kinder way to survive it ♡</p></div>
      <div class="v4-quote-card"><span>❀</span><blockquote>“${quotes[Math.floor(Math.random()*quotes.length)]}”</blockquote><small>Mint Garden · v4.0</small></div>`;
    main.prepend(hero);

    const dash = $(".dashboard");
    const lower = document.createElement("section");
    lower.className = "v4-home-lower";
    lower.innerHTML = `
      <div class="v4-panel"><div class="v4-panel-head"><h2>Tu semana académica</h2><button type="button" data-jump="curriculum">Ver malla completa</button></div><div class="v4-mini-grid" id="v4HomeKpis"></div></div>
      <div class="v4-panel"><div class="v4-panel-head"><h2>Próximos pasos</h2><button type="button" data-jump="planner">Planificar</button></div><div class="v4-next-list" id="v4HomeNext"></div></div>`;
    dash.after(lower);

    const dynamic = document.createElement("section");
    dynamic.id = "v4DynamicPages";
    main.append(dynamic);

    const toolbar = $(".toolbar");
    const legend = document.createElement("div");
    legend.className = "v4-category-legend no-print";
    legend.innerHTML = `<strong>Categorías</strong>${[
      ["#D6E9ED","Inglés"],["#EFBFC2","Didáctica"],["#CCC3D1","Lingüística"],["#CB9095","Literatura"],["#E5E6B5","Pedagogía"],["#BBCA6F","Psicología"],["#C8DE9D","FOFU"],["#F9E7C7","Optativo"],["#F2CFBB","Otro"]
    ].map(([c,n])=>`<span class="v4-legend-item"><i class="v4-swatch" style="background:${c}"></i>${n}</span>`).join("")}`;
    toolbar.before(legend);

    $$("[data-jump]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.jump)));
    $$(".v4-nav button").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
    $("#v4ThemeBtn").addEventListener("click",()=>$("#temaBtn")?.click());
    $("#v4AccountBtn").addEventListener("click",()=>setView("settings"));
    $("#v4GlobalSearch").addEventListener("input",e=>{setView("curriculum");const q=$("#buscador");q.value=e.target.value;q.dispatchEvent(new Event("input",{bubbles:true}));});
  }

  function navButton(view,icon,label){return `<button type="button" data-view="${view}"><span class="v4-nav-icon">${icon}</span><span>${label}</span></button>`;}

  function buildAuth(){
    const auth = document.createElement("div");
    auth.className = "v4-auth";
    auth.id = "v4Auth";
    auth.innerHTML = `
      <div class="v4-auth-card">
        <div class="v4-auth-art"><div><div class="v4-brand-flower">✿</div><h1>Pedagogía en Inglés</h1><p>Tu carrera, un semestre a la vez.</p></div><div class="v4-auth-quote">Tu progreso puede quedarse solo en este dispositivo o sincronizarse con tu cuenta para abrirlo desde cualquier computador o teléfono.</div></div>
        <div class="v4-auth-form"><h2>Bienvenida</h2><p class="v4-auth-sub">Inicia sesión para sincronizar tu malla. También puedes seguir como invitada y guardar todo localmente.</p>
          <button class="v4-google-btn" id="v4GoogleLogin"><span class="v4-google-dot">G</span>Continuar con Google</button>
          <div class="v4-divider">o con correo</div>
          <label>Email<input id="v4Email" type="email" autocomplete="email" placeholder="tu@email.com"></label>
          <label>Contraseña<input id="v4Password" type="password" autocomplete="current-password" placeholder="mínimo 6 caracteres"></label>
          <div class="v4-auth-actions"><button class="v4-primary-btn" id="v4EmailLogin">Iniciar sesión</button><button class="v4-secondary-btn" id="v4EmailSignup">Crear cuenta</button></div>
          <div class="v4-auth-message" id="v4AuthMessage"></div>
          <button class="v4-guest-btn" id="v4Guest">Continuar como invitada</button>
        </div>
      </div>`;
    document.body.prepend(auth);
    document.body.classList.add("v4-locked");
    $("#v4GoogleLogin").addEventListener("click",loginGoogle);
    $("#v4EmailLogin").addEventListener("click",()=>emailAuth(false));
    $("#v4EmailSignup").addEventListener("click",()=>emailAuth(true));
    $("#v4Guest").addEventListener("click",()=>enterGuest(true));
  }

  function authMessage(t){const el=$("#v4AuthMessage");if(el)el.textContent=t||"";}
  function hideAuth(){const a=$("#v4Auth");if(a)a.hidden=true;document.body.classList.remove("v4-locked");}
  function showAuth(){const a=$("#v4Auth");if(a)a.hidden=false;document.body.classList.add("v4-locked");}

  async function initAuth(){
    if(cfg.supabaseUrl && cfg.supabasePublishableKey && window.supabase){
      supa = window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
      const {data:{session}} = await supa.auth.getSession();
      if(session?.user){await enterUser(session.user);}
      else if(localStorage.getItem(GUEST_KEY)==="1") enterGuest(false);
      else showAuth();
      supa.auth.onAuthStateChange(async(event,session)=>{
        if(session?.user && session.user.id!==user?.id) await enterUser(session.user);
        if(event==="SIGNED_OUT"){user=null;profile=null;cloudReady=false;updateIdentity();showAuth();}
      });
    }else{
      localStorage.setItem(GUEST_KEY,"1");enterGuest(false);
    }
  }

  async function loginGoogle(){
    if(!supa){authMessage("Supabase no está conectado.");return;}
    authMessage("Abriendo Google…");
    const redirectTo = `${location.origin}${location.pathname}`;
    const {error}=await supa.auth.signInWithOAuth({provider:"google",options:{redirectTo}});
    if(error)authMessage(error.message);
  }

  async function emailAuth(signup){
    if(!supa){authMessage("Supabase no está conectado.");return;}
    const email=$("#v4Email").value.trim(), password=$("#v4Password").value;
    if(!email||password.length<6){authMessage("Escribe un correo válido y una contraseña de al menos 6 caracteres.");return;}
    authMessage(signup?"Creando cuenta…":"Iniciando sesión…");
    const res=signup?await supa.auth.signUp({email,password,options:{emailRedirectTo:`${location.origin}${location.pathname}`}}):await supa.auth.signInWithPassword({email,password});
    if(res.error){authMessage(res.error.message);return;}
    if(signup && !res.data.session)authMessage("Cuenta creada. Revisa tu correo para confirmar el acceso.");
    else if(res.data.user)await enterUser(res.data.user);
  }

  function enterGuest(save){
    if(save)localStorage.setItem(GUEST_KEY,"1");
    user=null;profile=null;cloudReady=false;hideAuth();updateIdentity();renderCurrentView();
  }

  async function enterUser(u){
    user=u;localStorage.removeItem(GUEST_KEY);hideAuth();
    await loadProfile();
    await reconcileCloud();
    updateIdentity();renderCurrentView();
  }

  async function loadProfile(){
    if(!supa||!user)return;
    const {data:p}=await supa.from("profiles").select("*").eq("id",user.id).maybeSingle();
    profile=p||null;
  }

  function hasMeaningfulLocalData(){
    const d=api.getData();
    return Object.values(d.courses||{}).some(c=>c.state!=="none"||c.planned||c.grade||c.note) || (d.customCourses||[]).length>0 || Boolean(d.preferences?.minor);
  }

  async function reconcileCloud(){
    if(!supa||!user)return;
    const [{data:rows},{data:custom},{data:settings}] = await Promise.all([
      supa.from("course_progress").select("*"),
      supa.from("custom_courses").select("*"),
      supa.from("user_settings").select("settings").eq("user_id",user.id).maybeSingle()
    ]);
    const cloudHas=(rows?.length||0)>0||(custom?.length||0)>0||Boolean(profile?.selected_minor)||Boolean(settings?.settings&&Object.keys(settings.settings).length);
    if(cloudHas){
      applyCloud(rows||[],custom||[],settings?.settings||{});
      toast("Progreso sincronizado desde la nube");
    }else if(hasMeaningfulLocalData()){
      await pushCloud();
      toast("Tu progreso local se guardó en tu cuenta");
    }
    cloudReady=true;
  }

  function applyCloud(rows,custom,settings){
    cloudApplying=true;
    const d=api.defaultData();
    rows.forEach(r=>{
      const status=r.status;
      d.courses[r.course_id]={state:status==="approved"?"approved":status==="current"?"inprogress":"none",planned:status==="planned",grade:r.grade??"",note:r.note??""};
    });
    d.customCourses=custom.map(c=>{
      const uid=`custom-${normCode(c.code)}`;
      d.courses[uid]={state:c.status==="approved"?"approved":c.status==="current"?"inprogress":"none",planned:c.status==="planned",grade:c.grade??"",note:c.note??""};
      return {uid,code:c.code,name:c.name,credits:Number(c.credits||0),semester:String(c.semester),type:c.category==="optative"?"optativo":c.category==="fofu"?"fofu":"otro",slot:c.reference_slot||"",minorIds:Array.isArray(c.minor_names)?c.minor_names:[],source:c.source||"manual"};
    });
    d.preferences={...d.preferences,...settings};
    if(profile){
      if(profile.current_semester)d.preferences.currentSemester=String(profile.current_semester);
      if(profile.selected_minor!=null)d.preferences.minor=profile.selected_minor||"";
      if(profile.theme)d.preferences.theme=profile.theme;
      d.preferences.view=profile.compact_view?"compact":"normal";
    }
    api.importData(d);
    setTimeout(()=>{cloudApplying=false;},50);
  }

  function stateForDb(local){
    if(local?.state==="approved")return"approved";
    if(local?.state==="inprogress")return"current";
    if(local?.planned)return"planned";
    return"available";
  }

  async function pushCloud(){
    if(!supa||!user||cloudApplying)return;
    const d=api.getData();
    const baseIds=new Set($$(".ramo:not([data-custom='1'])").map(r=>r.dataset.id));
    const baseRows=[...baseIds].map(id=>{const c=d.courses?.[id]||{};return {user_id:user.id,course_id:id,status:stateForDb(c),grade:c.grade===""||c.grade==null?null:Number(c.grade),note:c.note||null};});
    const customRows=(d.customCourses||[]).map(c=>{const state=d.courses?.[c.uid]||{};return {user_id:user.id,code:c.code,name:c.name,credits:Number(c.credits||0),semester:Number(c.semester),category:c.type==="optativo"?"optative":c.type,status:stateForDb(state),grade:state.grade===""||state.grade==null?null:Number(state.grade),note:state.note||null,reference_slot:c.slot||null,source:c.source==="minor"?"minor":"manual",minor_names:c.minorIds||[]};});
    const pref=d.preferences||{};
    try{
      await supa.from("course_progress").upsert(baseRows,{onConflict:"user_id,course_id"});
      await supa.from("custom_courses").delete().eq("user_id",user.id);
      if(customRows.length)await supa.from("custom_courses").insert(customRows);
      await supa.from("profiles").update({current_semester:pref.currentSemester==="auto"?null:Number(pref.currentSemester),selected_minor:pref.minor||null,theme:pref.theme||"light",compact_view:pref.view==="compact"}).eq("id",user.id);
      await supa.from("user_settings").upsert({user_id:user.id,settings:pref},{onConflict:"user_id"});
      setSyncStatus(true);
    }catch(err){console.warn("Cloud sync error",err);setSyncStatus(false);}
  }

  function schedulePush(){if(!user||!cloudReady||cloudApplying)return;clearTimeout(pushTimer);pushTimer=setTimeout(pushCloud,700);setSyncStatus(null);}
  function setSyncStatus(ok){const el=$("#v4SyncStatus");if(!el)return;if(ok===true){el.className="v4-sync-pill";el.textContent="● Sincronizado";}else if(ok===false){el.className="v4-sync-pill offline";el.textContent="● Error de sync";}else{el.className="v4-sync-pill";el.textContent="● Guardando…";}}

  function updateIdentity(){
    const name=profile?.display_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Invitada";
    const sub=user?"Sincronización activa":"Guardado local";
    const avatarUrl=profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    $$('[data-user-name]').forEach(e=>e.textContent=name);
    $$('[data-user-sub]').forEach(e=>e.textContent=sub);
    $$('[data-avatar]').forEach(e=>{e.innerHTML="";if(avatarUrl){const img=document.createElement("img");img.src=avatarUrl;img.alt="";img.style.cssText="width:100%;height:100%;object-fit:cover";e.append(img);}else e.textContent=name.slice(0,1).toUpperCase();});
  }

  function setView(view){
    const allowed=["home","curriculum","planner","minor","progress","backup","settings"];
    if(!allowed.includes(view))view="home";
    document.body.dataset.v4View=view;localStorage.setItem(LAST_VIEW_KEY,view);
    $$(".v4-nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    const titles={home:["PUCV · DRA 49/2021","Pedagogía en Inglés"],curriculum:["Mapa académico","Mi malla curricular"],planner:["Próximo semestre","Planificación"],minor:["Formación complementaria","Minor & FOFUs"],progress:["Tu recorrido","Progreso académico"],backup:["Tus datos","Respaldo e impresión"],settings:["Preferencias","Ajustes"]};
    $("#v4TopEyebrow").textContent=titles[view][0];$("#v4TopTitle").textContent=titles[view][1];
    renderCurrentView();window.scrollTo({top:0,behavior:"smooth"});
  }

  function renderCurrentView(){
    const view=document.body.dataset.v4View||"home";
    renderHome();
    const root=$("#v4DynamicPages");if(!root)return;
    if(view==="planner")root.innerHTML=renderPlanner();
    else if(view==="minor")root.innerHTML=renderMinor();
    else if(view==="progress")root.innerHTML=renderProgress();
    else if(view==="backup")root.innerHTML=renderBackup();
    else if(view==="settings")root.innerHTML=renderSettings();
    else root.innerHTML="";
    bindDynamic(view);
  }

  function renderHome(){
    const d=api.getData(), cards=$$(".ramo"), base=cards.filter(r=>r.dataset.custom!=="1"), approved=base.filter(r=>r.classList.contains("aprobado")), current=cards.filter(r=>r.classList.contains("cursando")), planned=cards.filter(r=>r.classList.contains("planificado")&&!r.classList.contains("aprobado")), extras=cards.filter(r=>r.dataset.custom==="1");
    const k=$("#v4HomeKpis");if(k)k.innerHTML=`<div class="v4-mini-card"><strong>${approved.length}/${base.length}</strong><span>ramos base aprobados</span></div><div class="v4-mini-card"><strong>${current.length}</strong><span>ramos cursando ahora</span></div><div class="v4-mini-card"><strong>${planned.length}</strong><span>ramos planificados</span></div><div class="v4-mini-card"><strong>${extras.length}</strong><span>ramos complementarios</span></div>`;
    const n=$("#v4HomeNext");if(n){const available=base.filter(r=>!r.classList.contains("aprobado")&&!r.classList.contains("cursando")&&!r.classList.contains("bloqueado")).slice(0,4);n.innerHTML=available.length?available.map(r=>`<div class="v4-next-item"><div><strong>${r.dataset.id}</strong><div>${escapeHtml($(".nombre",r)?.textContent)}</div></div><em>${r.dataset.semestre}° sem.</em></div>`).join(""):`<div class="v4-empty">No hay ramos disponibles pendientes.</div>`;}
  }

  function pageHeader(ey,title,desc){return `<div class="v4-section-header"><div><p class="eyebrow">${ey}</p><h1>${title}</h1><p>${desc}</p></div></div>`;}

  function renderPlanner(){
    const cards=$$(".ramo"), planned=cards.filter(r=>r.classList.contains("planificado")&&!r.classList.contains("aprobado")), available=cards.filter(r=>!r.classList.contains("aprobado")&&!r.classList.contains("cursando")&&!r.classList.contains("bloqueado"));
    const cr=planned.reduce((s,r)=>s+Number(r.dataset.creditos||0),0);
    return `${pageHeader("Diseña tu carga","Planificación","Arma el próximo semestre sin perder de vista créditos ni prerrequisitos.")}<div class="v4-section-grid"><div class="v4-big-panel"><h2>Próximo semestre · ${cr} créditos</h2><div class="v4-course-list">${planned.length?planned.map(courseRow).join(""):`<div class="v4-empty">Todavía no has planificado ningún ramo. En Mi malla abre un ramo y presiona Planificar.</div>`}</div></div><div class="v4-big-panel"><h2>Disponibles ahora</h2><div class="v4-course-list">${available.slice(0,8).map(courseRow).join("")||`<div class="v4-empty">No hay ramos disponibles pendientes.</div>`}</div><div class="v4-actions" style="margin-top:14px"><button data-go="curriculum">Abrir mi malla</button><button data-click="#puedoTomarBtn">Ver todos</button></div></div></div>`;
  }

  function courseRow(r){return `<div class="v4-course-row"><div><strong>${escapeHtml(r.dataset.custom==="1"?r.dataset.codigo:r.dataset.id)} · ${escapeHtml($(".nombre",r)?.textContent)}</strong><small>${r.dataset.semestre}° semestre · ${r.dataset.creditos} créditos · ${escapeHtml(r.dataset.area)}</small></div><span class="v4-tag">${r.classList.contains("cursando")?"Cursando":r.classList.contains("planificado")?"Planificado":r.classList.contains("aprobado")?"Aprobado":"Disponible"}</span></div>`;}

  function renderMinor(){
    const d=api.getData(), minors=api.minors||[], current=d.preferences?.minor||"", m=minors.find(x=>x.id===current);
    const custom=d.customCourses||[];
    let approved=0;if(m){const codes=new Set(m.courses.map(c=>normCode(c.code)).filter(c=>!["IER010","IER020"].includes(c)));const done=new Set();custom.forEach(c=>{if(codes.has(normCode(c.code))&&d.courses?.[c.uid]?.state==="approved")done.add(normCode(c.code));});approved=Math.min(done.size,5);}
    return `${pageHeader("Formación complementaria","Minor & FOFUs","El semestre sugerido es solo referencial. Tú decides cuándo realmente cursaste cada FOFU u optativo.")}<div class="v4-section-grid"><div class="v4-big-panel"><select id="v4MinorSelect" class="v4-minor-selector"><option value="">No estoy siguiendo un Minor</option>${minors.map(x=>`<option value="${x.id}" ${x.id===current?"selected":""}>${escapeHtml(x.name)}</option>`).join("")}</select>${m?`<div class="v4-minor-header"><strong>${escapeHtml(m.name)}</strong><small>${approved} de 5 FOFUs aprobados · Antropología y Ética se revisan por separado</small></div><div class="v4-course-list">${m.courses.map(c=>{const found=custom.find(x=>normCode(x.code)===normCode(c.code));return `<div class="v4-minor-course"><div><strong>${escapeHtml(c.code)} · ${escapeHtml(c.name)}</strong><span>${c.unavailable?"Marcado como no programado en 2S-2026 · ":""}${found?"Ya está en tu malla":"Disponible para agregar"}</span></div>${found?`<span class="v4-tag">Agregado</span>`:`<button data-add-minor="${escapeHtml(c.code)}">Agregar</button>`}</div>`}).join("")}</div>`:`<div class="v4-empty">Elige un Minor para ver su catálogo y tu progreso.</div>`}</div><div class="v4-big-panel"><h2>Formación complementaria</h2><div class="v4-kpi-grid"><div class="v4-kpi"><strong>${custom.filter(c=>c.type==="fofu").length}</strong><span>FOFUs agregados</span></div><div class="v4-kpi"><strong>${custom.filter(c=>c.type==="optativo").length}</strong><span>Optativos agregados</span></div><div class="v4-kpi"><strong>${custom.filter(c=>c.type==="otro").length}</strong><span>Otros ramos</span></div></div><div class="v4-actions" style="margin-top:14px"><button data-click="#agregarRamoBtn">+ Agregar ramo</button></div></div></div>`;
  }

  function renderProgress(){
    const cards=$$(".ramo"), base=cards.filter(r=>r.dataset.custom!=="1"), approved=base.filter(r=>r.classList.contains("aprobado"));const areas=[...new Set(cards.map(r=>r.dataset.area))].sort();const d=api.getData();const grades=cards.map(r=>parseFloat(d.courses?.[r.dataset.id]?.grade)).filter(n=>Number.isFinite(n));const avg=grades.length?(grades.reduce((a,b)=>a+b,0)/grades.length).toFixed(2):"—";const credits=approved.reduce((s,r)=>s+Number(r.dataset.creditos||0),0),total=base.reduce((s,r)=>s+Number(r.dataset.creditos||0),0),pct=base.length?Math.round(approved.length/base.length*100):0;
    return `${pageHeader("Tu recorrido","Progreso académico","Una vista más limpia de cuánto llevas y en qué áreas estás avanzando.")}<div class="v4-big-panel" style="margin-bottom:16px"><div class="v4-kpi-grid"><div class="v4-kpi"><strong>${pct}%</strong><span>avance de la malla base</span></div><div class="v4-kpi"><strong>${approved.length}/${base.length}</strong><span>ramos base aprobados</span></div><div class="v4-kpi"><strong>${credits}/${total}</strong><span>créditos base aprobados</span></div><div class="v4-kpi"><strong>${avg}</strong><span>promedio registrado</span></div><div class="v4-kpi"><strong>${cards.filter(r=>r.classList.contains("cursando")).length}</strong><span>ramos cursando</span></div><div class="v4-kpi"><strong>${cards.filter(r=>r.dataset.custom==="1").length}</strong><span>complementarios</span></div></div></div><div class="v4-big-panel"><h2>Avance por categoría</h2><div class="v4-progress-group">${areas.map(a=>{const rs=cards.filter(r=>r.dataset.area===a),ap=rs.filter(r=>r.classList.contains("aprobado")),p=Math.round(ap.length/rs.length*100);return `<div class="v4-progress-row"><span>${escapeHtml(a)}</span><div class="bar"><i style="width:${p}%"></i></div><strong>${ap.length}/${rs.length}</strong></div>`}).join("")}</div></div>`;
  }

  function renderBackup(){return `${pageHeader("Tus datos","Respaldo e impresión","Exporta una copia, importa un respaldo o genera una versión imprimible de tu avance.")}<div class="v4-section-grid"><div class="v4-big-panel"><h2>Respaldo</h2><p style="font-size:9px;color:var(--v4-muted);line-height:1.6">El archivo JSON incluye progreso, notas, comentarios, Minor, FOFUs, optativos y preferencias.</p><div class="v4-actions"><button data-click="#datosBtn">Abrir herramientas de backup</button><button data-click="#compartirBtn">Compartir avance</button></div></div><div class="v4-big-panel"><h2>Impresión</h2><p style="font-size:9px;color:var(--v4-muted);line-height:1.6">Puedes imprimir la malla completa o un resumen académico. Los colores de categorías también se conservan.</p><div class="v4-actions"><button data-click="#imprimirBtn">Imprimir</button><button data-click="#tarjetaBtn">Crear tarjeta PNG</button></div></div></div>`;}

  function renderSettings(){const d=api.getData();return `${pageHeader("Preferencias","Ajustes","Personaliza la experiencia y revisa el estado de tu sincronización.")}<div class="v4-section-grid"><div class="v4-big-panel"><h2>Cuenta</h2><div class="v4-settings-list"><div class="v4-setting"><div><strong>${escapeHtml(profile?.display_name||user?.email||"Modo invitada")}</strong><small>${user?escapeHtml(user.email||"Cuenta conectada"):"Tus datos viven solo en este navegador"}</small></div><span id="v4SyncStatus" class="v4-sync-pill ${user?"":"offline"}">${user?"● Sincronizado":"● Local"}</span></div><div class="v4-setting"><div><strong>Sincronización entre dispositivos</strong><small>${user?"Tus cambios se guardan automáticamente en Supabase.":"Inicia sesión para usar la misma malla en otros dispositivos."}</small></div>${user?`<button class="btn secundario" data-sync-now>Sincronizar ahora</button>`:`<button class="btn" data-show-auth>Iniciar sesión</button>`}</div>${user?`<div class="v4-setting"><div><strong>Cerrar sesión</strong><small>Tu respaldo local queda en este dispositivo.</small></div><button class="btn peligro-suave" data-signout>Salir</button></div>`:""}</div></div><div class="v4-big-panel"><h2>Apariencia y uso</h2><div class="v4-settings-list"><div class="v4-setting"><div><strong>Tema</strong><small>Mint Garden claro u oscuro</small></div><button class="btn secundario" data-click="#temaBtn">Cambiar tema</button></div><div class="v4-setting"><div><strong>Vista de la malla</strong><small>Normal o compacta</small></div><button class="btn secundario" data-click="#vistaBtn">Cambiar vista</button></div><div class="v4-setting"><div><strong>Semestre actual</strong><small>${escapeHtml(String(d.preferences?.currentSemester||"auto"))}</small></div><button class="btn secundario" data-click="#editarSemestreBtn">Editar</button></div><div class="v4-setting"><div><strong>Cómo usar</strong><small>Tutorial de estados, FOFUs, Minor y respaldos</small></div><button class="btn secundario" data-click="#ayudaBtn">Ver tutorial</button></div></div></div></div>`;}

  function bindDynamic(view){
    $$('[data-go]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.go)));
    $$('[data-click]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.click)?.click()));
    $('[data-show-auth]')?.addEventListener('click',showAuth);
    $('[data-signout]')?.addEventListener('click',async()=>{await supa?.auth.signOut();localStorage.removeItem(GUEST_KEY);});
    $('[data-sync-now]')?.addEventListener('click',async()=>{await pushCloud();toast('Sincronización actualizada');});
    const ms=$('#v4MinorSelect');if(ms)ms.addEventListener('change',()=>{api.setMinor(ms.value);renderCurrentView();});
    $$('[data-add-minor]').forEach(b=>b.addEventListener('click',()=>{const m=(api.minors||[]).find(x=>x.id===api.getData().preferences.minor);const c=m?.courses.find(x=>x.code===b.dataset.addMinor);if(c)api.openAddCourse({type:'fofu',code:c.code,name:c.name,minorIds:[m.id],source:'minor'});}));
  }

  window.addEventListener("malla:datachange",()=>{schedulePush();renderHome();if(["planner","minor","progress","settings"].includes(document.body.dataset.v4View))renderCurrentView();});
  window.addEventListener("online",()=>{if(user)schedulePush();});

  buildShell();
  buildAuth();
  setView(localStorage.getItem(LAST_VIEW_KEY)||"home");
  updateIdentity();
  initAuth();
})();
