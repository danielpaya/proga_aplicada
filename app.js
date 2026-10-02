// =====================================================================
//  BiciSabana · motor de la presentación
//  Teclas: ← / → (o espacio) navegar · N notas · F pantalla completa
//          Inicio / Fin primera y última diapositiva
// =====================================================================

const stage = document.getElementById("stage");
let current = 0;

// ---------- Utilidades ----------

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Mini markdown: **negrita** (el resto ya viene como HTML)
const md = (s) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

function bikeSVG(color = "#38bdf8", stroke = "#e8ecf8") {
  return `<svg viewBox="0 0 120 74" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="26" cy="50" r="20" stroke="${stroke}" stroke-width="4" opacity=".85"/>
    <circle cx="94" cy="50" r="20" stroke="${stroke}" stroke-width="4" opacity=".85"/>
    <path d="M26 50 L48 22 L80 22 L94 50 M48 22 L60 50 L80 22 M60 50 L26 50" stroke="${color}" stroke-width="5"/>
    <path d="M44 14 h12 M80 22 L76 10 h10" stroke="${stroke}" stroke-width="4"/>
    <circle cx="60" cy="50" r="4" fill="${stroke}"/>
  </svg>`;
}

// ---------- Resaltado de sintaxis Python ----------

const PY_KW = new Set(["class", "def", "if", "elif", "else", "for", "in", "while", "return", "not", "and", "or",
  "True", "False", "None", "import", "from", "as", "pass", "break", "continue"]);
const PY_BI = new Set(["print", "input", "len", "range", "str", "int", "float"]);

function highlightPy(line) {
  const re = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_áéíóúñÁÉÍÓÚÑ][\wáéíóúñÁÉÍÓÚÑ]*)|(\s+)|(.)/g;
  let out = "";
  let prevWord = "";
  let m;
  while ((m = re.exec(line)) !== null) {
    const [tok, com, str, num, id] = m;
    if (com) out += `<span class="tk-com">${esc(com)}</span>`;
    else if (str) out += `<span class="tk-str">${esc(str)}</span>`;
    else if (num) out += `<span class="tk-num">${num}</span>`;
    else if (id) {
      const rest = line.slice(re.lastIndex);
      let cls = "";
      if (prevWord === "def") cls = "tk-fn";
      else if (prevWord === "class") cls = "tk-cls";
      else if (PY_KW.has(id)) cls = "tk-kw";
      else if (id === "self") cls = "tk-self";
      else if (PY_BI.has(id)) cls = "tk-bi";
      else if (/^[A-Z]/.test(id)) cls = "tk-cls";
      else if (/^\s*\(/.test(rest)) cls = "tk-call";
      out += cls ? `<span class="${cls}">${esc(id)}</span>` : esc(id);
      prevWord = id;
      continue;
    } else out += esc(tok);
    if (!/^\s+$/.test(tok)) prevWord = "";
  }
  return out;
}

function renderCode(s) {
  const lines = s.code.split("\n");
  const [from, to] = s.focus || [1, lines.length];
  const hl = new Set(s.hl || []);
  const bad = new Set(s.bad || []);
  let html = "";
  for (let n = from; n <= to; n++) {
    const raw = lines[n - 1] ?? "";
    const cls = bad.has(n) ? "bad" : hl.has(n) ? "hl" : "";
    html += `<div class="ln ${cls}"><span class="no">${n}</span><span>${highlightPy(raw) || " "}</span></div>`;
  }
  const legend = `<div class="legend">
      ${hl.size ? `<span><b style="background:var(--hl-bar)"></b>clave</span>` : ""}
      ${bad.size ? `<span><b style="background:var(--bad)"></b>problema</span>` : ""}
    </div>`;
  const output = s.output ? `<div class="output">
      <div class="out-title">▶ Salida</div>
      ${s.output.map((o) => `<div class="out-line ${o.tone ? "tone-" + o.tone : ""}">${esc(o.t)}</div>`).join("")}
    </div>` : "";
  return `<div class="code-panel anim" style="--i:2">
      <div class="code-head"><i></i><i></i><i></i><span>${esc(s.file || "bicisabana.py")}</span>${legend}</div>
      <div class="code">${html}</div>
      ${output}
    </div>`;
}

// ---------- Ayudas visuales ----------

const V = {
  flow(v) {
    return `<div class="flow">${v.steps.map((st) => st.arrow !== undefined
      ? `<div class="arrow">➜<small>${esc(st.arrow)}</small></div>`
      : `<div class="step ${st.tone || ""}">
           ${st.icon ? `<div class="ic">${st.icon}</div>` : ""}
           <div class="t">${esc(st.t)}</div>
           ${st.s ? `<div class="s">${esc(st.s)}</div>` : ""}
         </div>`).join("")}</div>`;
  },

  compare(v) {
    const box = (b) => `<div class="cmp-box ${b.tone || ""}">
        <h4><span class="ic">${b.icon || ""}</span>${esc(b.title)}</h4>
        <ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
      </div>`;
    return `<div class="compare">${box(v.left)}<div class="vs">VS</div>${box(v.right)}</div>`;
  },

  objects(v) {
    return `<div class="bike-row">${v.items.map((o) => `
      <div class="obj-card ${o.was ? "changed" : ""}">
        <div class="var">${esc(o.name)}</div>
        ${bikeSVG(o.hex)}
        <div class="code-name">${esc(o.code)}</div>
        <div class="attr">color = "${esc(o.color)}"</div>
        ${o.was ? `<div class="was"><s>${esc(o.was)}</s> → ${esc(o.color)} 🎨</div>` : `<div class="was" style="color:var(--muted)">sin cambios</div>`}
      </div>`).join("")}</div>
      <div class="v-caption">Mismo molde, <strong>datos independientes</strong>: solo cambió <code>b2</code></div>`;
  },

  mold(v) {
    const o = v.objs[0];
    return `<div class="mold">
        <div class="blueprint">
          <div class="bp-h">CLASE · PLANO</div>
          <div class="bp-name">${esc(v.cls)}</div>
          ${v.attrs.map((a) => `<div>· ${esc(a)}</div>`).join("")}
          ${v.methods.map((m) => `<div class="m">· ${esc(m)}</div>`).join("")}
        </div>
        <div class="arrow">➜<small>${esc(v.call)}</small></div>
        <div class="obj-card" style="max-width:190px">
          <div class="var">${esc(o.name)}</div>
          ${bikeSVG(o.hex)}
          <div class="code-name">${esc(o.code)}</div>
          <div class="attr">color = "${esc(o.color)}"</div>
          <div class="attr">disponible = True</div>
        </div>
      </div>
      <div class="v-caption"><strong>1 clase</strong> → tantos <strong>objetos</strong> como queramos</div>`;
  },

  counter(v) {
    return `<div class="counter">
        <div class="big">${esc(v.big)}<small>${esc(v.label)}</small></div>
        <div class="rows">${v.rows.map((r) => `
          <div class="c-row ${r.tone || ""}"><span>${esc(r.t)}</span><span class="s">${esc(r.s)}</span></div>`).join("")}
        </div>
      </div>`;
  },

  cycle(v) {
    const st = (x) => `<div class="step ${x.tone}"><div class="ic">${x.icon}</div><div class="t">${esc(x.t)}</div><div class="s">disponible = ${esc(x.s)}</div></div>`;
    return `<div class="cycle">
        ${st(v.a)}
        <div class="mid">
          <div class="c-arrow top">${esc(v.top)}<span class="line">⟶</span></div>
          <div class="c-arrow bottom"><span class="line">⟵</span>${esc(v.bottom)}</div>
        </div>
        ${st(v.b)}
      </div>
      <div class="common">🤝 ${esc(v.common)}</div>`;
  },

  iter(v) {
    return `<div class="iter">${v.items.map((c, k) => `
        <div class="iter-cell" style="--k:${k}">
          <div class="ptr">${esc(v.varName)} =</div>
          ${bikeSVG(v.colors[k])}
          <div class="code-name">${esc(c)}</div>
          <div class="idx">[${k}] · vuelta ${k + 1}</div>
        </div>`).join("")}</div>
      <div class="v-caption">${v.caption}</div>`;
  },

  flag(v) {
    const idx = v.items.indexOf(v.target);
    const cells = v.items.map((c, k) => `
      <div class="flag-cell ${k === idx ? "match" : ""}">${esc(c)}
        <span class="cmp">${k === idx ? "== ✔" : "!= ✘"}</span></div>`).join("");
    const flags = v.items.map((c, k) => `
      <div class="flag-slot"><div class="flag-state ${k >= idx ? "up" : "down"}"><div class="pole"></div><div class="cloth"></div></div></div>`).join("");
    return `<div class="flag-track">${cells}</div>
      <div class="flag-states">${flags}</div>
      <div class="flag-legend">
        <span><i class="dot" style="background:#64748b"></i>encontrada = False</span>
        <span><i class="dot" style="background:var(--ok)"></i>encontrada = True</span>
      </div>
      <div class="v-caption">${v.caption}</div>`;
  },

  stats(v) {
    return `<div class="stats">${v.items.map((s) => `
        <div class="stat ${s.tone}"><div class="n">${esc(s.n)}</div>${s.l ? `<div class="l">${esc(s.l)}</div>` : ""}</div>`).join("")}
      </div>
      <div class="bar-wrap">
        <div class="bar-label"><span>${esc(v.bar.label)}</span><b>${v.bar.pct}%</b></div>
        <div class="bar"><div style="--pct:${v.bar.pct}%"></div></div>
      </div>`;
  },

  terminal(v) {
    return `<div class="term">
        <div class="term-head">⌨ ${esc(v.title)}</div>
        <div class="term-body">${v.lines.map((l) => `<div class="out-line ${l.tone ? "tone-" + l.tone : ""}">${esc(l.t)}</div>`).join("")}</div>
      </div>`;
  },

  grid(v) {
    const pres = new Set(v.prestadas.map(([r, c]) => r + "-" + c));
    let html = `<div class="grid" style="grid-template-columns: 34px repeat(${v.cols}, 44px)">`;
    html += `<div></div>` + Array.from({ length: v.cols }, (_, c) => `<div class="g-head">[${c}]</div>`).join("");
    let n = 1;
    for (let r = 0; r < v.rows; r++) {
      html += `<div class="g-head">[${r}]</div>`;
      for (let c = 0; c < v.cols; c++, n++) {
        const code = (n < 10 ? "B0" : "B") + n;
        const isP = pres.has(r + "-" + c);
        const isF = v.focus && v.focus[0] === r && v.focus[1] === c;
        const before = v.focus && !isF && r < v.focus[0];
        let cls = "g-cell";
        let txt = code;
        if (v.mode === "map") { cls += " map"; txt = isP ? "P" : "D"; }
        if (isP) cls += " p";
        if (isF) cls += " focus";
        else if (before) cls += " before";
        html += `<div class="${cls}" title="${code}">${txt}</div>`;
      }
    }
    html += `</div>`;
    return `<div class="grid-wrap">${html}</div><div class="v-caption">${v.caption}</div>`;
  },

  cards(v) {
    return `<div class="cards">${v.items.map((c) => `
        <div class="card"><div class="ic">${c.icon}</div><h4>${esc(c.title)}</h4><p>${esc(c.text)}</p></div>`).join("")}
      </div>`;
  },

  checks(v) {
    return `<table class="checks">${v.rows.map((r) => `
        <tr>
          <td>${esc(r.name)}</td>
          <td class="mono">${esc(r.code)}</td>
          <td class="why">${esc(r.why)}</td>
          <td class="${r.ok ? "ok" : "bad"}">${r.ok ? "✅ puede pedir" : "⛔ rechazado"}</td>
        </tr>`).join("")}
      </table>
      <div class="v-caption">Regla: <code>isdigit()</code> <strong>y</strong> <code>len(...) == 6</code></div>`;
  },

  loop(v) {
    const steps = [];
    v.steps.forEach((s, k) => { if (k) steps.push({ arrow: "" }); steps.push(s); });
    return `<div class="loop">
        ${V.flow({ steps })}
        <div class="loop-back"><div class="back">↺ ${esc(v.back)}</div><div class="exit">⏏ ${esc(v.exit)}</div></div>
      </div>`;
  },

  menu(v) {
    return `<div class="menu-box">
        <div class="mt">${esc(v.title)}</div>
        ${v.items.map((i) => `<div>${esc(i)}</div>`).join("")}
        <div class="added">${esc(v.added)}</div>
      </div>`;
  }
};

// ---------- Plantillas de diapositivas ----------

function renderQuestion(s) {
  const ex = EXERCISES[s.ex];
  const total = SLIDES.filter((x) => x.ex === s.ex).length;
  const dots = Array.from({ length: total }, (_, k) => `<span class="q-dot ${k + 1 === s.q ? "on" : ""}"></span>`).join("");
  return `
    <header class="q-head anim" style="--i:0">
      <span class="ex-chip">${ex.icon} Ejercicio ${s.ex}</span>
      <span class="ex-title">${esc(ex.title)}</span>
      <span class="req">${esc(ex.req)}</span>
      <span class="q-count">Pregunta ${s.q} de ${total} ${dots}</span>
    </header>
    <h2 class="q-title anim" style="--i:1"><span class="q-num">${s.ex}.${s.q}</span><span>${s.question}</span></h2>
    <div class="q-body">
      <div class="col-left">
        <ul class="answer anim" style="--i:2">${s.answer.map((a, k) => `<li data-n="${k + 1}">${md(a)}</li>`).join("")}</ul>
        <div class="keywords anim" style="--i:3"><span class="kw-label">🔑 Claves</span>${s.keywords.map((k) => `<span class="kw">${esc(k)}</span>`).join("")}</div>
        <div class="visual anim" style="--i:4">${V[s.visual.type](s.visual)}</div>
      </div>
      <div class="col-right">${renderCode(s)}</div>
    </div>`;
}

function renderTitle() {
  return `
    <div class="kicker anim" style="--i:0">Programación aplicada · Universidad de La Sabana</div>
    <h1 class="anim" style="--i:1">POO en Python<br><span>BiciSabana</span> 🚲</h1>
    <p class="sub anim" style="--i:2">Sistema de préstamos de bicicletas: clases, objetos, validaciones, listas y un menú que nunca se cae.</p>
    <div class="meta anim" style="--i:3">
      <span>👥 Grupo de Daniel Pallares</span>
      <span>🧩 10 ejercicios</span>
      <span>🗣️ ${SLIDES.filter((x) => x.ex).length} preguntas</span>
    </div>
    <div class="hero-bike anim" style="--i:4">${bikeSVG("#38bdf8")}</div>
    <div class="hint">Navega con <kbd>←</kbd><kbd>→</kbd> · <kbd>N</kbd> notas del expositor · <kbd>F</kbd> pantalla completa</div>`;
}

function renderAgenda() {
  const cards = Object.entries(EXERCISES).map(([n, ex], k) => {
    const qs = SLIDES.filter((x) => x.ex === Number(n)).length;
    return `<div class="ag-card anim" style="--i:${k + 2}" data-go="${SLIDES.findIndex((x) => x.ex === Number(n))}">
        <div class="ag-n">EJERCICIO ${n}</div>
        <div class="ag-ic">${ex.icon}</div>
        <div class="ag-t">${esc(ex.title)}</div>
        <div class="ag-q">${"<i></i>".repeat(qs)}</div>
        <div class="ag-r">${qs} preguntas · ${esc(ex.req)}</div>
      </div>`;
  }).join("");
  return `
    <div class="kicker anim" style="--i:0;color:var(--accent);font-weight:700;letter-spacing:.18em;font-size:14px">AGENDA</div>
    <h2 class="agenda-title anim" style="--i:0">De una clase a un sistema completo</h2>
    <p class="agenda-sub anim" style="--i:1">Cada diapositiva responde una pregunta de <em>«Explica tu código»</em> con el código que la sustenta. (Clic en un ejercicio para saltar.)</p>
    <div class="agenda-grid">${cards}</div>`;
}

function renderEnd() {
  const reqs = [
    ["rf", "RF-01", "Crear bicicletas"], ["rf", "RF-02", "Mostrar info"], ["rf", "RF-03 · 04", "Prestar sin duplicar"],
    ["rf", "RF-05", "Devolver"], ["rf", "RF-07", "Buscar por código"], ["rf", "RF-08", "Validar estudiante"],
    ["rf", "RF-09", "Totales"], ["rf", "RF-10", "Mapa de la estación"], ["rf", "RF-11", "Menú"],
    ["rnf", "RNF-01 · 03", "Nunca se cae"], ["rnf", "RNF-02", "Seguridad de datos"], ["next", "RF-06", "Siguiente sprint"]
  ];
  return `
    <div class="end-grid">
      <div>
        <h1 class="anim" style="--i:0">¡Gracias!<br><span>¿Preguntas?</span></h1>
        <p class="anim" style="--i:1">Del cuaderno de Laura a un sistema que <strong>presta, devuelve, busca, cuenta y valida</strong> bicicletas — sin detenerse nunca con error.</p>
      </div>
      <div class="anim" style="--i:2">
        <div class="label">REQUERIMIENTOS CUBIERTOS</div>
        <div class="req-cloud">${reqs.map(([c, r, d]) => `<span class="${c}">${r}<small>${d}</small></span>`).join("")}</div>
      </div>
    </div>`;
}

// ---------- Construcción y navegación ----------

function build() {
  stage.innerHTML = SLIDES.map((s, i) => {
    let inner, cls = "slide";
    if (s.type === "title") { inner = renderTitle(); cls += " cover"; }
    else if (s.type === "agenda") inner = renderAgenda();
    else if (s.type === "end") { inner = renderEnd(); cls += " end"; }
    else inner = renderQuestion(s);
    return `<section class="${cls}" data-i="${i}">${inner}</section>`;
  }).join("");

  stage.querySelectorAll("[data-go]").forEach((el) =>
    el.addEventListener("click", () => go(Number(el.dataset.go))));

  fitCode();
}

// Ajusta el tamaño de letra del código para que quepa sin scroll
function fitCode() {
  stage.querySelectorAll(".code").forEach((box) => {
    const lines = box.querySelectorAll(".ln");
    const maxLen = Math.max(...[...lines].map((l) => l.lastChild.textContent.length));
    const w = box.clientWidth - 60;
    const h = box.clientHeight - 20;
    const size = Math.max(10.5, Math.min(14.5, w / (maxLen * 0.61), h / (lines.length * 1.6)));
    box.style.setProperty("--code-size", size.toFixed(2) + "px");
  });
}

function go(i) {
  current = Math.max(0, Math.min(SLIDES.length - 1, i));
  stage.querySelectorAll(".slide").forEach((el, k) => {
    el.classList.toggle("active", k === current);
    el.classList.toggle("past", k < current);
  });
  document.getElementById("counter").textContent = `${current + 1} / ${SLIDES.length}`;
  document.getElementById("progressBar").style.width = `${(current / (SLIDES.length - 1)) * 100}%`;
  history.replaceState(null, "", "#" + (current + 1));
  renderNotes();
}

function renderNotes() {
  const s = SLIDES[current];
  const body = document.getElementById("notesBody");
  if (!s.ex) {
    body.innerHTML = s.type === "title"
      ? "Presentar al grupo y el caso: Laura maneja los préstamos de BiciSabana en un cuaderno y se pierden bicicletas. Nuestro objetivo: construir el sistema con POO."
      : s.type === "agenda"
        ? "10 ejercicios, cada uno suma una pieza: clase → objetos → prestar/devolver → listas → contar → buscar → validar → mapa 2D → menú."
        : "Cerrar mostrando qué requerimientos cubrimos y abrir preguntas.";
    return;
  }
  body.innerHTML = `
    <div class="nb-label">Respuesta del notebook</div>
    <div>${esc(s.notes)}</div>
    <div class="nb-label">Tip para exponer</div>
    <div class="nb-tip">💡 ${esc(s.tip)}</div>`;
}

function toggleNotes() {
  const n = document.getElementById("notes");
  n.hidden = !n.hidden;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function scaleStage() {
  const s = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
  stage.style.transform = `scale(${s})`;
}

document.addEventListener("keydown", (e) => {
  if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); go(current + 1); }
  else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); go(current - 1); }
  else if (e.key === "Home") go(0);
  else if (e.key === "End") go(SLIDES.length - 1);
  else if (e.key.toLowerCase() === "n") toggleNotes();
  else if (e.key.toLowerCase() === "f") toggleFullscreen();
});

document.getElementById("prev").onclick = () => go(current - 1);
document.getElementById("next").onclick = () => go(current + 1);
document.getElementById("notesBtn").onclick = toggleNotes;
document.getElementById("fsBtn").onclick = toggleFullscreen;

// Deslizar en pantallas táctiles
let touchX = null;
document.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
document.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

// Los controles se ocultan si el mouse no se mueve (no tapan la diapositiva)
let idleTimer;
function wake() {
  document.body.classList.remove("idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => document.body.classList.add("idle"), 2500);
}
document.addEventListener("mousemove", wake);
wake();

window.addEventListener("resize", scaleStage);

build();
scaleStage();
go(Math.max(0, (parseInt(location.hash.slice(1), 10) || 1) - 1));
document.fonts?.ready.then(fitCode);
