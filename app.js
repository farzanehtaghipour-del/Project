/* ============================================================
   app.js  —  وضعیت، مسیریابی، رندر، نماها (views) و رویدادها
   باید آخرین فایل (پس از config/questions/scoring) بارگذاری شود
   ============================================================ */

/* ================= State & routing ================= */
const state = {
  view: "home",
  stack: [],
  quiz: { cond: null, answers: {}, step: 0 },
  result: null,
};
function nav(v) {
  state.stack.push(state.view);
  state.view = v;
  render();
}
function reset(v) {
  state.stack = [];
  state.view = v;
  render();
}
function back() {
  state.view = state.stack.pop() || "home";
  render();
}
function finishQuiz() {
  state.view = "loading";
  render();
  setTimeout(() => {
    state.result = SCORERS[state.quiz.cond](state.quiz.answers);
    mhOnResult(state.quiz.cond); /* ثبت ورود به مسیر تخصصی ED/PE برای «تقویم سلامت مردان» (بدون ذخیرهٔ نمره) */
    state.view = "result";
    render();
  }, 1500);
}

/* ================= Step engine ================= */
const stepsCache = {};
function stepsOf(key) {
  if (!stepsCache[key]) {
    const steps = [];
    let i = 0;
    CONDS[key].sections.forEach((sec, si) =>
      sec.steps.forEach((qs) => steps.push({ i: i++, si, sec: sec.title, qs })),
    );
    stepsCache[key] = steps;
  }
  return stepsCache[key];
}
function visibleSteps() {
  const A = state.quiz.answers;
  return stepsOf(state.quiz.cond).filter((st) =>
    st.qs.some((q) => !q.showIf || q.showIf(A)),
  );
}

/* ================= Renderers ================= */
function how(n, icon, t, d) {
  return `
  <div class="card step-card">
    <div class="step-top"><span class="pr-ico">${I[icon]}</span><span class="step-n">قدم ${fa(n)}</span></div>
    <h4>${t}</h4><p>${d}</p>
  </div>`;
}
function pr(icon, t, d) {
  return `
  <div class="card step-card">
    <span class="pr-ico">${I[icon]}</span>
    <h4>${t}</h4><p>${d}</p>
  </div>`;
}
function vWomen() {
  const cards = [
    [
      "endo",
      "act",
      "ارزیابی علائم اندومتریوز",
      "بررسی الگوی درد، علائم قاعدگی، علائم گوارشی و ادراری و عوامل مرتبط با اندومتریوز.",
    ],
    [
      "pcos",
      "cal",
      "ارزیابی علائم PCOS",
      "بررسی الگوی قاعدگی، علائم مرتبط با آندروژن، وزن، باروری و عوامل خانوادگی.",
    ],
    [
      "poi",
      "clock",
      "ارزیابی علائم POI",
      "بررسی تغییرات قاعدگی، علائم کاهش استروژن و عوامل مرتبط با کاهش عملکرد تخمدان.",
    ],
  ];
  return shell(`
  <section class="page"><div class="container">
    <div class="page-head with-ico">
      <span class="head-ico ico-women">${I.flower}</span>
      <div><h1>سلامت زنان</h1>
      <p>با یک ارزیابی کوتاه، علائم و عوامل مرتبط با سلامت باروری خود را بهتر بشناسید.</p></div>
    </div>
    <div class="priv">${I.lock}<span>پاسخ‌های شما فقط برای نمایش نتیجه استفاده می‌شود و در این نسخه نمایشی ذخیره نمی‌شود.</span></div>
    <div class="cy-entry">
      <span class="cy-entry-ico">${I.cal}</span>
      <div class="cy-entry-b"><h3>تقویم چرخه قاعدگی</h3><p>چرخه‌ات را بهتر بشناس؛ روزها و علائم را ثبت کن و تخمین دوره بعدی را ببین.</p></div>
      <button class="btn btn-primary" data-nav="cycle">ورود به تقویم ${I.chevL}</button>
    </div>
    <div class="pp-entry ppc">
      <span class="pp-entry-ico">${I.heart}</span>
      <div class="pp-entry-b"><h3>همراه مادر پس از زایمان</h3><p>مراقبت و بهبودی پس از زایمان — در این مسیر، تو هم مهمی.</p></div>
      <button class="btn btn-primary" data-nav="pp">ورود ${I.chevL}</button>
    </div>
    <div class="as-grid">
      ${cards
        .map(
          (c) => `
      <div class="card as-card">
        <span class="cat-ico ico-women">${I[c[1]]}</span>
        <h3>${c[2]}</h3>
        <p>${c[3]}</p>
        <div class="as-meta">
          <span class="meta-chip">${I.clip} ${fa(CONDS[c[0]].sections.length)} بخش</span>
          <span class="meta-chip">${I.clock} ${CONDS[c[0]].time}</span>
        </div>
        <button class="btn btn-primary btn-block" data-start="${c[0]}">شروع ارزیابی ${I.chevL}</button>
      </div>`,
        )
        .join("")}
    </div>
    <div class="note">${I.info}<span>این ارزیابی‌ها برای شناخت الگوی علائم طراحی شده‌اند و ابزار تشخیص پزشکی نیستند.</span></div>

    <div class="fsa">
      <span class="fsa-kick">ارزیابی تمرکزشده جنسی</span>
      <h2 class="fsa-title">اختلال عملکرد جنسی زنان</h2>
      <p class="fsa-sub">مسیر تخصصی ارزیابی‌های استاندارد و شناخته‌شده بین‌المللی برای بررسی دقیق‌تر مسائل عملکرد جنسی زنان. این ابزارها غربالگری و آگاهی‌بخشی‌اند و جایگزین ویزیت پزشک نمی‌شوند.</p>
      <div class="fsa-grid">
        <div class="fsa-card">
          <div class="fsa-top"><span class="fsa-ico">✦</span><span class="badge b-soon">به‌زودی</span></div>
          <h3>پرسشنامه شاخص عملکرد جنسی زنان</h3>
          <p class="fsa-en">FSFI — Female Sexual Function Index · ۱۹ سؤال</p>
          <p class="fsa-desc">بررسی چندبُعدی میل، برانگیختگی، ارگاسم، رضایت و درد در بازه ۴ هفته گذشته.</p>
        </div>
        <div class="fsa-card">
          <div class="fsa-top"><span class="fsa-ico">♡</span><span class="badge b-soon">به‌زودی</span></div>
          <h3>پرسشنامه پریشانی جنسی زنان</h3>
          <p class="fsa-en">FSDS-R — Female Sexual Distress Scale · ۱۳ سؤال</p>
          <p class="fsa-desc">سنجش میزان پریشانی و آزار ناشی از مسائل جنسی در ۳۰ روز گذشته.</p>
        </div>
      </div>
      <div class="fsa-preview">
        <div class="fsa-preview-b">
          <b>پیش‌نمایش صفحهٔ نتایج هوشمند</b>
          <span>صفحهٔ گزارش نتایج این دو ابزار طراحی شده است: نمرهٔ کل FSFI، نمودار شش حوزه، نمرهٔ مستقل FSDS-R، برداشت اختصاصی از پاسخ‌ها و قدم بعدی. با داده‌های فرضی و برچسب «نمونهٔ نمایشی» می‌توانید آن را ببینید — هیچ نمره‌ای ثبت نمی‌شود.</span>
        </div>
        <button class="btn btn-secondary" data-fs="open">مشاهدهٔ پیش‌نمایش ${I.chevL}</button>
      </div>
      <div class="fsa-future">
        <b>ابزارهای تخصصی در نسخه‌های بعدی</b>
        <span>SIDI-F (میل جنسی) · PISQ-IR (بی‌کنترلی ادرار و عملکرد جنسی) · VSQ (رضایت جنسی)</span>
      </div>
    </div>
  </div></section>`);
}

function vProfile() {
  return shell(`
  <section class="page"><div class="container prof">
    <div class="card prof-card">
      <span class="avatar">${I.user}</span>
      <h2>کاربر مهمان</h2>
      <p>برای ذخیره تاریخچه ارزیابی‌ها و دریافت برنامه‌های شخصی، به‌زودی حساب کاربری فعال می‌شود.</p>
      <div class="prof-rows">
        <div class="prof-row">${I.clock}<div><b>تاریخچه ارزیابی‌ها</b><span>نتایج ارزیابی‌های شما در این نسخه نمایشی ذخیره نمی‌شود.</span></div><span class="badge b-soon">به‌زودی</span></div>
        <div class="prof-row">${I.user}<div><b>اطلاعات پزشکی پایه</b><span>پروفایل سلامت شخصی شما</span></div><span class="badge b-soon">به‌زودی</span></div>
        <div class="prof-row">${I.lock}<div><b>تنظیمات و حریم خصوصی</b><span>مدیریت داده‌ها و تنظیمات حساب</span></div><span class="badge b-soon">به‌زودی</span></div>
      </div>
      <button class="btn btn-secondary btn-block" data-nav="home">بازگشت به خانه</button>
    </div>
  </div></section>`);
}

/* ---------- Quiz blocks ---------- */
function bmiChipHtml() {
  return `<div class="bmi-chip" id="bmi-chip">${bmiChipInner()}</div>`;
}
function bmiChipInner() {
  const b = bmiOf(state.quiz.answers, state.quiz.cond);
  if (!b)
    return `${I.info}<span>برای محاسبه BMI، قد و وزن خود را وارد کنید.</span>`;
  return `${I.info}<span>BMI شما: <b>${faDec(b.v)}</b> · ${b.cat}</span>`;
}
function singleBlock(q, err) {
  const A = state.quiz.answers;
  return `<div class="qblock" data-block="${q.id}">
    <h3 class="qlabel">${q.label}</h3>
    ${q.help ? `<p class="qhelp">${q.help}</p>` : ""}
    <div class="opts">
      ${q.options.map((o) => `<button type="button" class="opt ${A[q.id] === o.v ? "sel" : ""}" data-q="${q.id}" data-v="${o.v}"><span class="radio"></span><span>${o.label}</span></button>`).join("")}
    </div>
    <div class="qerr" data-err="${q.id}">${err}</div>
  </div>`;
}
function scaleBlock(q, err) {
  const A = state.quiz.answers;
  return `<div class="qblock" data-block="${q.id}">
    <h3 class="qlabel">${q.label}</h3>
    ${q.help ? `<p class="qhelp">${q.help}</p>` : ""}
    <div class="scale">
      ${Array.from({ length: 11 }, (_, i) => `<button type="button" class="sbtn ${A[q.id] === String(i) ? "sel" : ""}" data-q="${q.id}" data-v="${i}">${fa(i)}</button>`).join("")}
    </div>
    <div class="scale-ends"><span>${q.minL || "۰"}</span><span>${q.maxL || "۱۰"}</span></div>
    <div class="qerr" data-err="${q.id}">${err}</div>
  </div>`;
}
function inputBlock(q, err) {
  const A = state.quiz.answers;
  return `<div class="qblock" data-block="${q.id}">
    <h3 class="qlabel">${q.label}</h3>
    ${q.help ? `<p class="qhelp">${q.help}</p>` : ""}
    <div class="field">
      <input type="text" inputmode="${q.type === "number" ? "decimal" : "text"}" data-q="${q.id}" value="${esc(A[q.id] || "")}" placeholder="${q.placeholder || ""}" autocomplete="off">
      ${q.unit ? `<span class="unit">${q.unit}</span>` : ""}
    </div>
    ${q.optional ? '<p class="qhelp">اختیاری</p>' : ""}
    <div class="qerr" data-err="${q.id}">${err}</div>
  </div>`;
}
function segBlock(q, err) {
  const A = state.quiz.answers;
  return `<div class="qblock symrow" data-block="${q.id}">
    <div class="symlabel">${q.label}</div>
    <div class="seg">
      ${q.options.map((o) => `<button type="button" class="segb ${A[q.id] === o.v ? "sel" : ""}" data-q="${q.id}" data-v="${o.v}">${o.label}</button>`).join("")}
    </div>
    <div class="qerr" data-err="${q.id}">${err}</div>
  </div>`;
}
function labBlock(q) {
  const A = state.quiz.answers;
  return `<div class="qblock" data-block="${q.id}">
    <h3 class="qlabel">${q.label}</h3>
    ${q.help ? `<p class="qhelp">${q.help}</p>` : ""}
    <div class="lab-wrap">
      ${q.labs
        .map(
          (l) => `
      <div class="lab-item">
        <div class="lab-t"><span>${l.name}</span><span class="mut">${l.unit}</span></div>
        <div class="lab-f">
          <div class="field"><input type="text" inputmode="decimal" data-q="${l.id}" value="${esc(A[l.id] || "")}" placeholder="مقدار" autocomplete="off"></div>
          <div class="field"><input type="text" data-q="${l.id}_date" value="${esc(A[l.id + "_date"] || "")}" placeholder="تاریخ" autocomplete="off"></div>
        </div>
      </div>`,
        )
        .join("")}
    </div>
  </div>`;
}
function block(q) {
  const A = state.quiz.answers;
  if (q.showIf && !q.showIf(A)) return "";
  const err =
    q.type === "number" || q.type === "text"
      ? "لطفاً یک مقدار معتبر وارد کنید."
      : "لطفاً یکی از گزینه‌ها را انتخاب کنید.";
  if (q.type === "bmi") return `<div class="qblock">${bmiChipHtml()}</div>`;
  if (q.type === "lab") return labBlock(q);
  if (q.type === "seg") return segBlock(q, err);
  if (q.type === "scale") return scaleBlock(q, err);
  if (q.type === "number" || q.type === "text") return inputBlock(q, err);
  return singleBlock(q, err);
}

let lastStepKey = "";
function vQuiz() {
  const cond = CONDS[state.quiz.cond];
  if (!cond) return vHome();
  const vis = visibleSteps();
  let pos = vis.findIndex((s) => s.i === state.quiz.step);
  if (pos < 0) {
    const nxt = vis.find((s) => s.i > state.quiz.step) || vis[vis.length - 1];
    state.quiz.step = nxt.i;
    pos = vis.findIndex((s) => s.i === state.quiz.step);
  }
  const st = vis[pos];
  const key = state.quiz.cond + ":" + state.quiz.step;
  const anim = key !== lastStepKey;
  lastStepKey = key;
  const pct = Math.round(((pos + 1) / vis.length) * 100);
  const isLast = pos === vis.length - 1;
  return `
  <div class="qtop"><div class="container">
    <div class="qtop-in">
      <button class="ibtn" data-act="quiz-prev" aria-label="بازگشت">${I.chevR}</button>
      <div class="qtop-meta">
        <div class="qtop-title">${cond.title}</div>
        <div class="qtop-prog">بخش ${fa(st.si + 1)} از ${fa(cond.sections.length)} · گام ${fa(pos + 1)} از ${fa(vis.length)}</div>
      </div>
      <button class="qtop-exit" data-act="quiz-exit">خروج</button>
    </div>
    <div class="qbar" role="progressbar" aria-label="پیشرفت ارزیابی"><i style="width:${pct}%"></i></div>
  </div></div>
  <div class="qwrap">
    <div class="qcard ${anim ? "anim" : ""}">
      <span class="sec-chip">${st.sec}</span>
      ${st.qs.map((q) => block(q)).join("")}
    </div>
  </div>
  <div class="qfoot-outer"><div class="qfoot">
    <button class="btn btn-secondary" data-act="quiz-prev">${I.chevR} بازگشت</button>
    <button class="btn btn-primary" data-act="quiz-next">${isLast ? "مشاهده نتیجه" : "ادامه"} ${I.chevL}</button>
  </div></div>`;
}

function vLoading() {
  return `<div class="load view"><div>
    <div class="spinner"></div>
    <h2>در حال جمع‌بندی پاسخ‌ها…</h2>
    <p>این کار فقط چند لحظه طول می‌کشد.</p>
  </div></div>`;
}

/* ---------- Result ---------- */
function meterHtml(r, pct) {
  const segs = r.bands.map((b) => ({
    w: ((b[1] - b[0] + 1) / r.max) * 100,
    cls: b[3],
    label: b[2],
  }));
  return `<div class="meter-w">
    <div class="meter">${segs.map((s) => `<i class="f-${s.cls}" style="width:${s.w}%"></i>`).join("")}</div>
    <span class="mdot ${r.level.cls}" style="right:${pct}%"></span>
    <div class="meter-l">${segs.map((s) => `<span style="width:${s.w}%">${s.label}</span>`).join("")}</div>
  </div>`;
}
function resSection(sec) {
  let body = "";
  if (sec.type === "bars") {
    body = `<div class="card dom-card">${sec.items
      .map((b) => {
        const w = Math.min(100, Math.round((b.v / b.max) * 100));
        const cls = lvlCls(b.v, b.max);
        return `<div class="dom-row">
        <div class="dom-top"><span>${b.label}</span><span class="dom-val ${cls === "pos" ? "" : "warn"}">${fa(b.v)} از ${fa(b.max)}</span></div>
        <div class="dom-bar"><i class="f-${cls}" data-w="${w}"></i></div>
      </div>`;
      })
      .join("")}</div>`;
  } else if (sec.type === "pain") {
    body = `<div class="pain-grid">${sec.items
      .map((p) => {
        const w = Math.min(100, Math.round((p.v / p.max) * 100));
        const cls = lvlCls(p.v, p.max);
        const sev =
          p.v === 0
            ? "ندارد"
            : p.v / p.max <= 0.34
              ? "خفیف"
              : p.v / p.max <= 0.67
                ? "متوسط"
                : "شدید";
        return `<div class="pain">
        <div class="pain-t"><span>${p.label}</span><span class="pain-sev sev-${cls}">${sev}</span></div>
        <div class="pain-bar"><i class="f-${cls}" data-w="${w}"></i></div>
      </div>`;
      })
      .join("")}</div>`;
  } else if (sec.type === "chips") {
    body = `<div class="ctx-chips">${sec.items.map((c) => `<span class="ctx">${c[0]}: <b>${c[1]}</b></span>`).join("")}</div>`;
  } else if (sec.type === "labs") {
    body = `<div class="card dom-card">${sec.items
      .map(
        (l) => `
      <div class="dom-row">
        <div class="dom-top"><span>${l.name} <span class="mut">(${l.unit})</span></span>
        <span class="dom-val ${l.hl ? "warn" : ""}">${l.val}${l.date ? ` · ${esc(l.date)}` : ""}</span></div>
      </div>`,
      )
      .join("")}
      <p class="lab-note">${I.info}<span>اطلاعات آزمایشگاهی به‌عنوان اطلاعات تکمیلی نمایش داده می‌شود و به‌تنهایی معنای تشخیصی ندارد.</span></p>
    </div>`;
  }
  return `<div class="res-sec"><h3 class="rs-t">${sec.title}</h3>${body}</div>`;
}
/* ================= Render & events ================= */
function render(scroll = true) {
  const app = document.getElementById("app");
  sjPark(); /* دفترچه پیش از پاک‌شدن #app به بدن پارک می‌شود — وضعیتش می‌ماند */
  ppPark(); /* همراه مادر هم همین‌طور: گرهٔ پایدار #ppHost پیش از بازسازی #app به بدن برمی‌گردد */
  let html = "";
  switch (state.view) {
    case "entry":
      html = vEntry();
      break;
    case "about":
      html = vAbout();
      break;
    case "profile":
      html = vProfile();
      break;
    case "women":
      html = vWomen();
      break;
    case "men":
      html = vMen();
      break;
    case "sexual":
      html = vSexual();
      break;
    case "cycle":
      html = vCycle();
      break;
    case "mhcal":
      html = vMhc();
      break;
    case "fsrep":
      html = FSREP.vFsrep();
      break;
    case "pp":
      html = vPp();
      break;
    case "quiz":
      html = vQuiz();
      break;
    case "loading":
      html = vLoading();
      break;
    case "result":
      html = vResult();
      break;
    default:
      html = vHome();
  }
  app.innerHTML = html;
  if (state.view === "cycle") { sjAttach(); cxaChartAfterRender(); } else { sjDetach(true); cxaChartTeardown(); }
  if (state.view === "pp") ppAttach(); else ppDetach(true);
  if (scroll) window.scrollTo(0, 0);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      document.querySelectorAll("[data-w]").forEach((el) => {
        el.style.width = el.dataset.w + "%";
      });
      const ring = document.getElementById("ring-fg");
      if (ring) ring.style.strokeDashoffset = ring.dataset.off;
      /* حلقهٔ «روز N از ۴۰» همراه مادر — انیمیشن به محض نمایش */
    }),
  );
}

/* ---------- دفترچهٔ علائم — گرهٔ پایدار بیرون از #app (INTEGRATION.md §۵) ----------
   render() هر بار #app را از نو می‌سازد؛ اگر دفترچه داخل زیردرخت رندر بود، با هر
   رندر نابود می‌شد. راه‌حل: #symJournal یک‌بار بیرون #app نصب و در هر رندر
   «جابه‌جا» می‌شود (appendChild) — نه بازسازی؛ شنونده‌ها و وضعیت داخلی می‌مانند. */
function sjNode() { return document.getElementById("symJournal"); }
function sjPark() {
  const n = sjNode();
  if (n && n.parentNode && n.parentNode !== document.body) {
    n.hidden = true;
    document.body.appendChild(n);
  }
}
function sjDetach(stopTimers) {
  const n = sjNode();
  if (n) n.hidden = true;
  if (stopTimers && window.SamanSymptomJournal) SamanSymptomJournal.stopTimers();
}
function sjAttach() {
  const n = sjNode(), slot = document.getElementById("sjSlot");
  if (!n || !slot || !window.SamanSymptomJournal) return;
  /* پنجرهٔ دفترچه باز است؟ گره عمداً در body می‌ماند (بالای همهٔ لایه‌ها) — دست نزن */
  if (n.classList && n.classList.contains("sj-inwin")) return;
  if (n.parentNode !== slot) slot.appendChild(n);
  n.hidden = false;
  SamanSymptomJournal.refresh();
  /* تغییر رفتار (درخواست کارفرما): کلیک روی روز تقویم دیگر دفترچهٔ علائم را
     خودکار باز نمی‌کند — شاید کاربر فقط بخواهد پریود را ثبت کند.
     دفترچه همیشه با انتخاب خود کاربر (دکمهٔ دفترچه) باز می‌شود. */
}
/* پس از ذخیره/حذف در دفترچه: تقویم و آمار همان لحظه به‌روز می‌شوند —
   گرهٔ دفترچه جابه‌جا می‌شود نه بازسازی، پس فوکوس و وضعیتش حفظ می‌شود. */
function sjRerender() {
  if (state.view !== "cycle") return;
  const ae = document.activeElement, n = sjNode();
  const keep = ae && n && n.contains(ae) ? ae : null;
  render(false);
  if (keep && keep.isConnected) { try { keep.focus({ preventScroll: true }); } catch (e) { /* فوکوس بحرانی نیست */ } }
}

function validateStep(st) {
  const A = state.quiz.answers;
  let ok = true,
    firstErr = null;
  for (const q of st.qs) {
    if (q.type === "bmi" || q.type === "lab" || q.optional) continue;
    if (q.showIf && !q.showIf(A)) continue;
    let bad = false;
    if (q.type === "single" || q.type === "seg" || q.type === "scale") {
      bad = A[q.id] == null;
    } else {
      const v = num(A[q.id]);
      bad =
        v == null ||
        (q.min != null && v < q.min) ||
        (q.max != null && v > q.max);
    }
    const el = document.querySelector(`[data-block="${q.id}"]`);
    if (bad) {
      ok = false;
      el?.classList.add("has-err");
      if (!firstErr) firstErr = el;
    } else el?.classList.remove("has-err");
  }
  if (!ok) firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
  return ok;
}

function handleNav(v) {
  v === "home" ? reset("home") : nav(v);
}
document.getElementById("app").addEventListener("click", (e) => {
  const opt = e.target.closest(".opt");
  if (opt) {
    state.quiz.answers[opt.dataset.q] = opt.dataset.v;
    render(false);
    return;
  }
  const sc = e.target.closest(".sbtn,.segb");
  if (sc) {
    state.quiz.answers[sc.dataset.q] = sc.dataset.v;
    render(false);
    return;
  }
  const st = e.target.closest("[data-start]");
  if (st && CONDS[st.dataset.start]) {
    startQuiz(st.dataset.start);
    return;
  }
  const nav = e.target.closest("[data-nav]");
  if (nav) {
    handleNav(nav.dataset.nav);
    return;
  }
  const act = e.target.closest("[data-act]");
  if (act) {
    handleAct(act.dataset.act);
    return;
  }
});
document.getElementById("app").addEventListener("input", (e) => {
  const q = e.target.dataset.q;
  if (!q || state.view !== "quiz") return;
  state.quiz.answers[q] = e.target.value;
  const chip = document.getElementById("bmi-chip");
  if (chip) chip.innerHTML = bmiChipInner();
});

function mv(a, id) {
  const x = num(a[id]);
  return x == null ? 0 : x;
}
function optOf(condKey, qid, v) {
  const cond = MEN_CONDS[condKey];
  for (const sec of cond.sections)
    for (const step of sec.steps)
      for (const q of step) {
        if (!q.options) continue;
        if (q.id !== qid) continue;
        const o = q.options.find((oo) => oo.v === String(v));
        if (o) return o.label;
      }
  return fa(v);
}

state.sw = swDefaultState();
function swLoad() {
  try {
    const raw = localStorage.getItem(SW_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || typeof s !== "object") return null;
    return s;
  } catch (e) { return null; }
}
function swSave() {
  try {
    const s = state.sw;
    const lite = {
      step: s.step, ctx: s.ctx, body: s.body, safety: s.safety,
      answers: s.answers, ci: s.ci, ad: s.ad, ai: s.ai,
      profile: s.profile, rc: s.rc, rci: s.rci, rcDone: s.rcDone,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(SW_KEY, JSON.stringify(lite));
  } catch (e) { /* private mode / disabled — degrade gracefully */ }
}
function swReset() {
  state.sw = swDefaultState();
  try { localStorage.removeItem(SW_KEY); } catch (e) {}
}

/* ---------- Sexual wellness views ---------- */
function swProgressHead(title, pct, onBack) {
  return `
  <div class="qtop"><div class="container">
    <div class="qtop-in">
      <button class="ibtn" ${onBack} aria-label="بازگشت">${I.chevR}</button>
      <div class="qtop-meta">
        <div class="qtop-title">${title}</div>
        <div class="qtop-prog">سلامت زناشویی · مسیر شخصی</div>
      </div>
      <button class="qtop-exit" data-sw="exit">خروج</button>
    </div>
    <div class="qbar" role="progressbar" aria-label="پیشرفت مسیر"><i style="width:${pct}%"></i></div>
  </div></div>`;
}

function swShell(inner) {
  return shell(inner);
}

function vSwLanding() {
  const s = state.sw;
  const saved = swLoad();
  const hasProgress = saved && saved.step && saved.step !== "landing" && !saved.profile;
  const hasProfile = !!(s.profile || (saved && saved.profile));
  return swShell(`
  <section class="page"><div class="container narrow">
    <div class="page-head with-ico">
      <span class="head-ico ico-sex">${I.rings}</span>
      <div><h1>سلامت زناشویی</h1>
      <p>${SW_LANDING.sub}</p></div>
    </div>
    <div class="card" style="padding:24px">
      <h3 style="margin-bottom:14px">ما کمک می‌کنیم به‌تدریج به این‌ها برسی:</h3>
      <div class="benefit-chips">
        ${SW_LANDING.benefits.map((b) => `<span class="benefit">${b[0]} ${b[1]}</span>`).join("")}
      </div>
    </div>
    <div class="promise-list" style="margin:18px 0">
      ${SW_LANDING.promise.map((p) => `<div class="promise"><span class="pr-ico">${I.check}</span><span>${p}</span></div>`).join("")}
    </div>
    <div class="pl-actions" style="flex-direction:column;align-items:stretch">
      ${hasProfile ? `<button class="btn btn-primary btn-lg" data-sw="see-profile">مشاهده پروفایل و برنامه من ${I.chevL}</button>` : ""}
      ${hasProgress ? `<button class="btn btn-primary btn-lg" data-sw="resume">ادامه مسیر من ${I.chevL}</button>` : ""}
      <button class="btn ${hasProfile || hasProgress ? "btn-secondary" : "btn-primary"} btn-lg" data-sw="start">${hasProfile || hasProgress ? "شروع دوباره" : "شروع مسیر من"} ${I.chevL}</button>
    </div>
    <div class="note">${I.lock}<span>${SW_LANDING.privacy}</span></div>
  </div></section>`);
}

function vSwContext() {
  return swShell(`
  ${swProgressHead("مسیر سلامت زناشویی", 8, 'data-sw="back-landing"')}
  <div class="qwrap"><div class="qcard anim">
    <span class="sec-chip">گام ۱ از ۴ — زمینه</span>
    <div class="qblock">
      <h3 class="qlabel">${SW_CTX_Q.label}</h3>
      <p class="qhelp">${SW_CTX_Q.hint}</p>
      <div class="opts">
        ${SW_CTX_Q.options.map((o) => `<button type="button" class="opt ${state.sw.ctx === o[0] ? "sel" : ""}" data-sw="ctx" data-v="${o[0]}"><span class="radio"></span><span>${o[1]}</span></button>`).join("")}
      </div>
    </div>
  </div></div>
  <div class="qfoot-outer"><div class="qfoot">
    <button class="btn btn-secondary" data-sw="back-landing">${I.chevR} بازگشت</button>
    <button class="btn btn-primary" data-sw="to-body" ${state.sw.ctx ? "" : "disabled"}>ادامه ${I.chevL}</button>
  </div></div>`);
}

function vSwBody() {
  return swShell(`
  ${swProgressHead("مسیر سلامت زناشویی", 16, 'data-sw="to-context"')}
  <div class="qwrap"><div class="qcard anim">
    <span class="sec-chip">گام ۲ از ۴ — شخصی‌سازی</span>
    <div class="qblock">
      <h3 class="qlabel">${SW_BODY_Q.label}</h3>
      <p class="qhelp">${SW_BODY_Q.hint}</p>
      <div class="opts">
        ${SW_BODY_Q.options.map((o) => `<button type="button" class="opt ${state.sw.body === o[0] ? "sel" : ""}" data-sw="body" data-v="${o[0]}"><span class="radio"></span><span>${o[1]}</span></button>`).join("")}
      </div>
    </div>
  </div></div>
  <div class="qfoot-outer"><div class="qfoot">
    <button class="btn btn-secondary" data-sw="to-context">${I.chevR} بازگشت</button>
    <button class="btn btn-primary" data-sw="to-safety">ادامه ${I.chevL}</button>
  </div></div>`);
}

function vSwSafety() {
  return swShell(`
  ${swProgressHead("مسیر سلامت زناشویی", 24, 'data-sw="to-body"')}
  <div class="qwrap"><div class="qcard anim">
    <span class="sec-chip">گام ۳ از ۴ — امنیت و راحتی</span>
    <div class="qblock">
      <h3 class="qlabel">${SW_SAFETY_Q.label}</h3>
      <p class="qhelp">${SW_SAFETY_Q.hint}</p>
      <div class="opts">
        ${SW_SAFETY_Q.options.map((o) => `<button type="button" class="opt ${state.sw.safety === o[0] ? "sel" : ""}" data-sw="safety" data-v="${o[0]}"><span class="radio"></span><span>${o[1]}</span></button>`).join("")}
      </div>
    </div>
  </div></div>
  <div class="qfoot-outer"><div class="qfoot">
    <button class="btn btn-secondary" data-sw="to-body">${I.chevR} بازگشت</button>
    <button class="btn btn-primary" data-sw="to-core" ${state.sw.safety ? "" : "disabled"}>ادامه ${I.chevL}</button>
  </div></div>`);
}

function vSwCore() {
  const s = state.sw;
  const list = s.ctx === "active" ? SW_CORE_ACTIVE : SW_CORE_REDUCED;
  const qid = list[s.ci];
  const [label, minL, maxL] = SW_Q[qid];
  const cur = s.answers[qid];
  const pct = 28 + Math.round(((s.ci + 1) / list.length) * 34);
  return swShell(`
  ${swProgressHead("چک‌این ۴ هفته گذشته", pct, `data-sw="core-back"`)}
  <div class="qwrap"><div class="qcard anim">
    <span class="sec-chip">سؤال ${fa(s.ci + 1)} از ${fa(list.length)}</span>
    <div class="qblock">
      <h3 class="qlabel">${label}</h3>
      <div class="sw-scale">
        ${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="${cur === n ? "sel" : ""}" data-sw="core" data-q="${qid}" data-v="${n}">${fa(n)}</button>`).join("")}
      </div>
      <div class="sw-ends"><span>${minL}</span><span>${maxL}</span></div>
    </div>
  </div></div>
  <div class="qfoot-outer"><div class="qfoot">
    <button class="btn btn-secondary" data-sw="core-back">${I.chevR} بازگشت</button>
    <button class="btn btn-primary" data-sw="core-next" ${cur ? "" : "disabled"}>${s.ci === list.length - 1 ? "ادامه" : "بعدی"} ${I.chevL}</button>
  </div></div>`);
}

function vSwAdaptive() {
  const s = state.sw;
  const qid = s.ad[s.ai];
  const q = SW_AD[qid];
  const cur = s.answers[qid];
  const list = s.ctx === "active" ? SW_CORE_ACTIVE : SW_CORE_REDUCED;
  const pct = 62 + Math.round(((s.ai + 1) / (s.ad.length + 1)) * 14);
  let bodyHtml = "";
  if (q.kind === "multi") {
    const sel = Array.isArray(cur) ? cur : [];
    bodyHtml = `
      <p class="qhelp">${q.hint || ""}</p>
      <div class="multi-grid">
        ${q.options.map((o) => `<button type="button" class="mopt ${sel.includes(o[0]) ? "sel" : ""}" data-sw="ad-multi" data-q="${qid}" data-v="${o[0]}">${o[1]}</button>`).join("")}
      </div>`;
  } else {
    bodyHtml = `
      ${q.hint ? `<p class="qhelp">${q.hint}</p>` : ""}
      <div class="opts">
        ${q.options.map((o) => `<button type="button" class="opt ${cur === o[0] ? "sel" : ""}" data-sw="ad-single" data-q="${qid}" data-v="${o[0]}"><span class="radio"></span><span>${o[1]}</span></button>`).join("")}
      </div>`;
  }
  return swShell(`
  ${swProgressHead("چند سؤال تکمیلی", pct, `data-sw="ad-back"`)}
  <div class="qwrap"><div class="qcard anim">
    <span class="sec-chip">سؤال تکمیلی ${fa(s.ai + 1)} از ${fa(s.ad.length)}</span>
    <div class="qblock">
      <h3 class="qlabel">${q.label}</h3>
      ${bodyHtml}
    </div>
  </div></div>
  <div class="qfoot-outer"><div class="qfoot">
    <button class="btn btn-secondary" data-sw="ad-back">${I.chevR} بازگشت</button>
    <button class="btn btn-primary" data-sw="ad-next" ${q.optional || cur ? "" : "disabled"}>${s.ai === s.ad.length - 1 ? "دیدن پروفایل من" : "بعدی"} ${I.chevL}</button>
  </div></div>`);
}

function vSwLoading() {
  return `<div class="load view"><div>
    <div class="spinner"></div>
    <h2>در حال ساختن پروفایل شخصی تو…</h2>
    <p>این کار فقط چند لحظه طول می‌کشد.</p>
  </div></div>`;
}

function vSwProfile() {
  const p = state.sw.profile;
  if (!p) return vSwLanding();
  const tier = p.safetyTier;
  const flags = p.flags;
  const bandCls = { strong: "pos", balanced: "bal", opportunity: "opp", not_assessed: "bal" };
  return swShell(`
  <section class="page"><div class="container narrow">
    <div class="page-head with-ico">
      <span class="head-ico ico-sex">${I.rings}</span>
      <div><h1>پروفایل سلامت زناشویی تو</h1>
      <p>این پروفایل یک تصویر از تجربه تو در ۴ هفته گذشته است؛ نه یک برچسب و نه یک نمره.</p></div>
    </div>
    ${tier === "pathway" ? `
    <div class="panel concern">
      <span class="p-ico">${I.shield}</span>
      <div><h4>امنیت تو اولویت است</h4><p>${SW_SAFETY_PATHWAY_MSG}</p></div>
    </div>` : ""}
    <div class="res-sec">
      <h3 class="rs-t">پروفایل حوزه‌ها</h3>
      <div class="dim-list">
        ${p.rows.map((r) => `
        <div class="dim-row">
          <span class="dim-emoji">${r.emoji}</span>
          <div class="grow"><h4>${r.label}</h4></div>
          <span class="wband ${bandCls[r.band]}">${r.bandLabel}</span>
        </div>`).join("")}
      </div>
      <div class="note">${I.info}<span>این عناوین، برداشت کلی از پاسخ‌های تو هستند و معیار تشخیص پزشکی نیستند.</span></div>
    </div>
    ${p.top.length ? `
    <div class="res-sec">
      <h3 class="rs-t">بیشترین فرصت برای بهتر شدن</h3>
      <div class="find-grid">
        ${p.top.map((r, i) => `
        <div class="card find">
          <span class="find-ico ic-accent">${I.bulb}</span>
          <div><h4>${r.emoji} ${r.label}</h4><p>${p.insights[i] || ""}</p></div>
        </div>`).join("")}
      </div>
    </div>` : ""}
    ${tier === "caution" ? `
    <div class="panel warn">
      <span class="p-ico">${I.shield}</span>
      <div><h4>یک نکته درباره تمرین‌ها</h4><p>${SW_SAFETY_CAUTION_NOTE}</p></div>
    </div>` : ""}
    ${tier === "pathway" ? `
    <div class="res-sec">
      <h3 class="rs-t">منابع حمایتی</h3>
      <div class="find-grid">
        ${SW_SAFETY_RESOURCES.map((r) => `
        <div class="card find">
          <span class="find-ico ic-info">${r[0]}</span>
          <div><h4>${r[1]}</h4><p>${r[2]}</p></div>
        </div>`).join("")}
      </div>
    </div>` : ""}
    ${flags.clinicalBridge ? `
    <div class="panel info">
      <span class="p-ico">${I.info}</span>
      <div><h4>ارزیابی تخصصی</h4>
      <p>به نظر می‌رسد بررسی دقیق‌تر این موضوع می‌تواند برایت مفید باشد. این پیشنهاد کاملاً اختیاری است؛ می‌توانی همین مسیر آرام را ادامه دهی.</p>
      <button class="btn btn-secondary" data-sw="bridge" style="margin-top:10px">${flags.bridgeTarget === "men" ? "رفتن به بخش سلامت مردان" : flags.bridgeTarget === "women" ? "رفتن به بخش سلامت زنان" : "مشاهده ارزیابی‌ها"} ${I.chevL}</button></div>
    </div>` : ""}
    <div class="pl-actions">
      <button class="btn btn-primary btn-lg" data-sw="to-plan">دیدن برنامه ۷ روز من ${I.chevL}</button>
    </div>
  </div></section>`);
}

function vSwPlan() {
  const p = state.sw.profile;
  if (!p) return vSwLanding();
  /* امضای برنامه برای کلید پیشرفت — برنامه‌ی تازه، پیشرفت تازه */
  const sig = (p.plan.length + "-" + p.plan.map(function (d) { return d.title; }).join("|")).length;
  const pk = "sw7:" + sig;
  const daysArr = EDU_S.days[pk] || [];
  const doneN = eduCount(daysArr);
  const total = p.plan.length;
  return swShell(`
  <section class="page"><div class="container narrow">
    <div class="page-head with-ico">
      <span class="head-ico ico-sex">${I.cal}</span>
      <div><h1>برنامه ۷ روز من</h1>
      <p>هر روز یک قدم کوچک؛ کوتاه، بدون فشار و متناسب با پروفایل تو.</p></div>
    </div>
    <div class="edu-prog" style="margin:0 0 14px" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${doneN}">
      <div class="edu-prog-bar"><i data-daybar="${pk}" style="width:${Math.round((doneN / total) * 100)}%"></i></div>
      <span class="edu-prog-lab" data-daylab="${pk}">${fa(doneN)} از ${fa(total)} روز</span>
    </div>
    <div class="plan-list">
      ${p.plan.map((d, i) => {
        const isDone = !!daysArr[i];
        return `
      <div class="plan-day ${d.kind === "recheck" ? "recheck" : ""}">
        <span class="plan-num">${fa(d.day)}</span>
        <div class="grow">
          <h4><span class="plan-emoji">${d.emoji}</span> ${d.title} ${d.dur && d.dur !== "—" ? `<span class="mut" style="font-weight:400;font-size:.82rem">· ${d.dur}</span>` : ""}</h4>
          <p>${d.desc}</p>
        </div>
        ${d.kind === "recheck"
          ? `<button class="btn btn-primary" data-sw="start-recheck">شروع بازبینی</button>`
          : `<button type="button" class="plan-ck ${isDone ? "on" : ""}" data-edu="plan-day" data-pkey="${pk}" data-i="${i}" data-total="${total}" aria-pressed="${isDone}" aria-label="ثبت انجام روز ${fa(d.day)}" title="انجامش دادم">${I.check}</button>`}
      </div>`;
      }).join("")}
    </div>
    <div class="note">${I.info}<span>تیک هر روز یعنی «امروز همین قدم را برداشتم» — نه نمره‌ی عملکرد. اگر روزی فرصت نکردی، اشکالی ندارد؛ از همان‌جا که راحتی ادامه بده.</span></div>
    <div class="pl-actions">
      <button class="btn btn-secondary" data-sw="to-profile">بازگشت به پروفایل</button>
    </div>
  </div></section>`);
}

function vSwRecheck() {
  const p = state.sw.profile;
  if (!p) return vSwLanding();
  const titles = p.plan.filter((d) => d.kind === "action" && d.recId).map((d) => d.title);
  const dims = p.rows.map((r) => `${r.emoji} ${r.label}`);
  const RQ = [
    { id: "helpful", kind: "multi", label: "کدام تمرین برایت مفیدتر بود؟", options: titles.concat(["چیز دیگری مفید بود"]) },
    { id: "difficult", kind: "multi", label: "کدام بخش سخت یا چالش‌برانگیز بود؟", options: titles.concat(["هیچ‌کدام — همه راحت بودند"]) },
    { id: "better", kind: "single", label: "کدام حوزه احساس می‌کنی بهتر شده است؟", options: dims.concat(["هنوز معلوم نیست"]) },
    { id: "attention", kind: "multi", label: "کدام حوزه هنوز به توجه بیشتری نیاز دارد؟", options: dims },
  ];
  const q = RQ[state.sw.rci];
  const cur = state.sw.rc[q.id];
  const sel = Array.isArray(cur) ? cur : cur ? [cur] : [];
  const isMulti = q.kind === "multi";
  return swShell(`
  ${swProgressHead("بازبینی ۷ روزه", 90, `data-sw="rc-back"`)}
  <div class="qwrap"><div class="qcard anim">
    <span class="sec-chip">سؤال ${fa(state.sw.rci + 1)} از ${fa(RQ.length)}</span>
    <div class="qblock">
      <h3 class="qlabel">${q.label}</h3>
      <p class="qhelp">فقط تجربه خودت مهم است، نه «نتیجه درست».</p>
      ${isMulti ? `
      <div class="multi-grid">
        ${q.options.map((o) => `<button type="button" class="mopt ${sel.includes(o) ? "sel" : ""}" data-sw="rc-multi" data-q="${q.id}" data-v="${esc(o)}">${o}</button>`).join("")}
      </div>` : `
      <div class="opts">
        ${q.options.map((o) => `<button type="button" class="opt ${sel[0] === o ? "sel" : ""}" data-sw="rc-single" data-q="${q.id}" data-v="${esc(o)}"><span class="radio"></span><span>${o}</span></button>`).join("")}
      </div>`}
    </div>
  </div></div>
  <div class="qfoot-outer"><div class="qfoot">
    <button class="btn btn-secondary" data-sw="rc-back">${I.chevR} بازگشت</button>
    <button class="btn btn-primary" data-sw="rc-next" ${isMulti || cur ? "" : "disabled"}>${state.sw.rci === RQ.length - 1 ? "پایان بازبینی" : "بعدی"} ${I.chevL}</button>
  </div></div>`);
}

function vSwDone() {
  const p = state.sw.profile;
  const better = state.sw.rc.better;
  const helpfulCount = Array.isArray(state.sw.rc.helpful) ? state.sw.rc.helpful.length : state.sw.rc.helpful ? 1 : 0;
  return swShell(`
  <section class="page"><div class="container narrow">
    <div class="card res-hero" style="flex-direction:column;text-align:center;gap:12px;padding:34px">
      <span class="head-ico ico-sex" style="width:64px;height:64px">${I.check}</span>
      <h2>آفرین! یک هفته قدم‌های کوچک برداشتی 👏</h2>
      <p class="res-msg">مسیر سلامت زناشویی یک مسیر تدریجی است. ${helpfulCount ? `${fa(helpfulCount)} تمرین برایت مفید بوده` : "تجربه این هفته همین حالا هم ارزشمند است"}${better ? ` و احساس می‌کنی «${better}» بهتر شده است` : ""}.</p>
      <p class="res-msg">می‌توانی هر هفته یک چک‌این کوتاه تکرار کنی و ببینی کدام بخش‌ها تغییر کرده‌اند.</p>
      <div class="pl-actions" style="width:100%;flex-direction:column">
        <button class="btn btn-primary btn-lg" data-sw="see-profile">مشاهده پروفایل و برنامه من</button>
        <button class="btn btn-secondary btn-lg" data-sw="restart">شروع دوباره مسیر</button>
        <button class="btn btn-ghost" data-nav="home">بازگشت به خانه</button>
      </div>
    </div>
  </div></section>`);
}

function vSexual() {
  const s = state.sw;
  switch (s.step) {
    case "context": return vSwContext();
    case "body": return vSwBody();
    case "safety": return vSwSafety();
    case "core": return vSwCore();
    case "adaptive": return vSwAdaptive();
    case "loading": return vSwLoading();
    case "profile": return vSwProfile();
    case "plan": return vSwPlan();
    case "recheck": return vSwRecheck();
    case "done": return vSwDone();
    default: return vSwLanding();
  }
}

/* ---------- Sexual wellness actions ---------- */
function handleSw(action, el) {
  const s = state.sw;
  const v = el.dataset.v;
  const q = el.dataset.q;
  switch (action) {
    case "start":
      state.sw = swDefaultState();
      state.sw.step = "context";
      swSave();
      render();
      break;
    case "resume": {
      const saved = swLoad();
      if (saved) {
        state.sw = Object.assign(swDefaultState(), saved);
        if (state.sw.profile) state.sw.step = "profile";
        render();
      }
      break;
    }
    case "see-profile":
      if (!s.profile) {
        const saved = swLoad();
        if (saved && saved.profile) state.sw.profile = saved.profile;
      }
      state.sw.step = s.profile ? "profile" : "landing";
      render();
      break;
    case "restart":
      swReset();
      render();
      break;
    case "back-landing":
      s.step = "landing";
      swSave();
      render();
      break;
    case "exit":
      swSave();
      reset("home");
      break;
    case "ctx":
      s.ctx = v;
      swSave();
      render(false);
      setTimeout(() => { if (state.sw.step === "context") { state.sw.step = "body"; swSave(); render(); } }, 260);
      break;
    case "to-body": s.step = "body"; swSave(); render(); break;
    case "to-context": s.step = "context"; swSave(); render(); break;
    case "body":
      s.body = v;
      swSave();
      render(false);
      setTimeout(() => { if (state.sw.step === "body") { state.sw.step = "safety"; swSave(); render(); } }, 260);
      break;
    case "to-safety": s.step = "safety"; swSave(); render(); break;
    case "safety":
      s.safety = v;
      swSave();
      render(false);
      setTimeout(() => { if (state.sw.step === "safety") { state.sw.step = "core"; swSave(); render(); } }, 260);
      break;
    case "to-core": s.step = "core"; swSave(); render(); break;
    case "core":
      s.answers[q] = Number(v);
      swSave();
      render(false);
      break;
    case "core-next": {
      const list = s.ctx === "active" ? SW_CORE_ACTIVE : SW_CORE_REDUCED;
      if (s.ci < list.length - 1) { s.ci++; swSave(); render(); }
      else {
        s.ad = swAdaptiveSteps(s.ctx, s.body, s.answers);
        s.ai = 0;
        s.step = s.ad.length ? "adaptive" : "loading";
        swSave();
        render();
        if (s.step === "loading") swFinishBuild();
      }
      break;
    }
    case "core-back":
      if (s.ci > 0) { s.ci--; swSave(); render(); }
      else { s.step = "safety"; swSave(); render(); }
      break;
    case "ad-single":
      s.answers[q] = v;
      swSave();
      render(false);
      break;
    case "ad-multi": {
      const cur = Array.isArray(s.answers[q]) ? s.answers[q].slice() : [];
      const ix = cur.indexOf(v);
      if (ix >= 0) cur.splice(ix, 1); else cur.push(v);
      s.answers[q] = cur;
      swSave();
      render(false);
      break;
    }
    case "ad-next":
      if (s.ai < s.ad.length - 1) { s.ai++; swSave(); render(); }
      else { s.step = "loading"; swSave(); render(); swFinishBuild(); }
      break;
    case "ad-back":
      if (s.ai > 0) { s.ai--; swSave(); render(); }
      else { s.step = "core"; s.ci = (s.ctx === "active" ? SW_CORE_ACTIVE : SW_CORE_REDUCED).length - 1; swSave(); render(); }
      break;
    case "to-plan": s.step = "plan"; swSave(); render(); break;
    case "to-profile": s.step = "profile"; swSave(); render(); break;
    case "start-recheck": s.step = "recheck"; s.rci = 0; swSave(); render(); break;
    case "rc-multi": {
      const cur = Array.isArray(s.rc[q]) ? s.rc[q].slice() : [];
      const ix = cur.indexOf(v);
      if (ix >= 0) cur.splice(ix, 1); else cur.push(v);
      s.rc[q] = cur;
      swSave();
      render(false);
      break;
    }
    case "rc-single":
      s.rc[q] = v;
      swSave();
      render(false);
      break;
    case "rc-next":
      if (s.rci < 3) { s.rci++; swSave(); render(); }
      else { s.rcDone = true; s.step = "done"; swSave(); render(); }
      break;
    case "rc-back":
      if (s.rci > 0) { s.rci--; swSave(); render(); }
      else { s.step = "plan"; swSave(); render(); }
      break;
    case "bridge": {
      const t = s.profile && s.profile.flags ? s.profile.flags.bridgeTarget : "entry";
      if (t === "men") reset("men");
      else if (t === "women") reset("women");
      else reset("entry");
      break;
    }
  }
}

function swFinishBuild() {
  const s = state.sw;
  setTimeout(() => {
    s.profile = swBuildProfile(s.ctx || "prefer_not", s.body || "prefer_not", s.safety, s.answers);
    s.step = "profile";
    swSave();
    render();
  }, 1400);
}

/* ============================================================
   نماها و کنترل‌های اصلی (زنان / مردان / زناشویی) — تعریف‌های فعال
   (در مرحلهٔ ۱ ممیزی، تعریف‌های تکراری و مردهٔ موج اول حذف شدند؛
   از هر تابع فقط همین یک تعریف باقی مانده است)
   ============================================================ */

function shell(inner) {
  return `
  <header class="site-head"><div class="container head-in">
    <button class="brand" data-nav="home" aria-label="سَمن — خانه"><span class="mark">${I.logo}</span><span class="brand-txt"><b>سَمن</b><i>Digital Health Intelligence</i></span></button>
    <nav class="head-links">
      <button data-nav="home">خانه</button>
      <button data-nav="cycle">تقویم چرخه قاعدگی</button>
      <button data-nav="mhcal">تقویم سلامت مردان</button>
      <button data-nav="about">آشنایی با پلتفرم</button>
    </nav>
    <div class="head-end"><button class="ibtn" data-nav="profile" aria-label="حساب کاربری">${I.user}</button></div>
  </div></header>
  <main class="view">${inner}</main>
  <footer class="foot"><div class="container">
    <div class="fb"><span class="mark sm">${I.logo}</span>سَمن</div>
    <p>ارزیابی‌های سَمن بر پایه الگوهای بالینی و علمی استوار است و جایگزین نظر تخصصی پزشک نمی‌شود. در صورت نگرانی درباره سلامت خود، با پزشک مشورت کنید.</p>
    <p class="ver">سَمن (Samn Health) © ۱۴۰۵ — نسخه نمایشی استارتاپی · سلامت زنان · سلامت مردان · سلامت زناشویی</p>
  </div></footer>`;
}

function vHome() {
  return shell(`
  <section class="hero ph-hero"><div class="container hero-grid">
    <div class="ph-hero-text">
      <span class="hero-badge">${I.flower} پلتفرم آگاهی و ارزیابی سلامت</span>
      <h1>سلامتی از آگاهی<br>شروع می‌شود</h1>
      <p class="sub">ارزیابی، آگاهی و برنامه‌های سلامت برای زنان، مردان و سلامت زناشویی — همراهِ تو در هر قدم.</p>
      <div class="hero-cta">
        <button class="btn btn-primary btn-lg" data-nav="entry">شروع ارزیابی ${I.chevL}</button>
      </div>
      <div class="ph-hero-stats">
        <div class="ph-stat"><b>${fa("۶")}</b><span>حوزه‌ی سلامت فعال</span></div>
        <div class="ph-stat"><b>${fa("۲۰+")}</b><span>ارزیابی استاندارد</span></div>
        <div class="ph-stat"><b>${fa("۱۰۰٪")}</b><span>محرمانه و محلی</span></div>
      </div>
    </div>
    <div class="hero-art ph-hero-art">
      <div class="ph-tile ph-tile-w" data-nav="women">
        <img src="hero-woman.png" alt="" loading="lazy"/>
        <span class="ph-tile-cap">سلامت زنان</span>
      </div>
      <div class="ph-tile ph-tile-m" data-nav="men">
        <img src="hero-man.png?v=3" alt="" loading="lazy"/>
        <span class="ph-tile-cap">سلامت مردان</span>
      </div>
      <div class="ph-tile ph-tile-c" data-nav="sexual">
        <img src="hero-couple.png" alt="" loading="lazy"/>
        <span class="ph-tile-cap">سلامت زناشویی</span>
      </div>
      <div class="ph-tile ph-tile-b" data-nav="pp">
        <img src="hero-mother.png?v=2" alt="" loading="lazy"/>
        <span class="ph-tile-cap">همراه مادر</span>
      </div>
      <div class="ph-orb ph-orb-1"></div>
      <div class="ph-orb ph-orb-2"></div>
    </div>
  </div></section>

  <section class="sec ph-domains"><div class="container">
    <div class="sec-head ph-sec-head">
      <span class="sec-chip">${I.rings} حوزه‌های سلامت</span>
      <h2>هر قدم، یک شناخت تازه از خودت</h2>
      <p>سه حوزه‌ی اصلی پلتفرم — هر سه بخش در این نسخه فعال هستند. مسیر خودت را انتخاب کن.</p>
    </div>
    <div class="cat-grid">
      <div class="card cat-card ph-card ph-card-w">
        <span class="cat-ico ico-women">${I.flower}</span>
        <h3>سلامت زنان <span class="badge b-pos">فعال</span></h3>
        <p>غربالگری و آگاهی درباره سلامت باروری زنان</p>
        <button class="btn btn-primary btn-block" data-nav="women">مشاهده بخش زنان ${I.chevL}</button>
      </div>
      <div class="card cat-card ph-card ph-card-m">
        <span class="cat-ico ico-men">${I.shield}</span>
        <h3>سلامت مردان <span class="badge b-pos">فعال</span></h3>
        <p>ارزیابی‌های استاندارد سلامت باروری، هورمون‌ها و سلامت جنسی مردان</p>
        <button class="btn btn-primary btn-block" data-nav="men">مشاهده بخش مردان ${I.chevL}</button>
      </div>
      <div class="card cat-card ph-card ph-card-s">
        <span class="cat-ico ico-sex">${I.rings}</span>
        <h3>سلامت زناشویی <span class="badge b-pos">فعال</span></h3>
        <p>مسیر شخصی افزایش سلامت، رضایت جنسی و کیفیت رابطه</p>
        <button class="btn btn-primary btn-block" data-nav="sexual">شروع مسیر ${I.chevL}</button>
      </div>
    </div>

    <div class="ph-tools">
      <div class="cy-quick ph-tool">
        <span class="cy-entry-ico">${I.cal}</span>
        <div class="cy-entry-b"><h3>تقویم چرخه قاعدگی</h3><p>پیگیری چرخه قاعدگی، ثبت روزانه علائم و مشاهده تخمین دوره بعدی — بخشی از حوزه سلامت زنان.</p></div>
        <button class="btn btn-secondary" data-nav="cycle">مشاهده تقویم ${I.chevL}</button>
      </div>
      <div class="mh-quick mhc ph-tool">
        <span class="mh-entry-ico">${I.shield}</span>
        <div class="mh-entry-b"><h3>تقویم سلامت مردان</h3><p>ثبت کوتاه روزانه حال خود، گزارش هفتگی پیشرفت و تمرین‌های شخصی — بخشی از حوزه سلامت مردان.</p></div>
        <button class="btn btn-secondary" data-nav="mhcal">مشاهده تقویم ${I.chevL}</button>
      </div>
      <div class="pp-quick ppc ph-tool">
        <span class="pp-entry-ico">${I.heart}</span>
        <div class="pp-entry-b"><h3>همراه مادر | مراقبت پس از زایمان</h3><p>بازیابی بدن، همراهی شیردهی، حال روحی و مسیر صمیمیت — همراهِ روزبه‌روزِ مادر در دورهٔ پس از زایمان.</p></div>
        <button class="btn btn-secondary" data-nav="pp">ورود به همراه مادر ${I.chevL}</button>
      </div>
    </div>
  </div></section>

  <section class="sec alt ph-how"><div class="container">
    <div class="sec-head ph-sec-head">
      <span class="sec-chip">${I.clip} مسیر ساده و روشن</span>
      <h2>چطور کار می‌کند؟</h2>
      <p>با پاسخ به چند سؤال، ابتدا وضعیت خود را بهتر بشناسید و سپس متناسب با نیازتان محتوای آموزشی و برنامه‌های سلامت را دریافت کنید.</p>
    </div>
    <div class="steps-grid">
      ${how("۱", "clip", "ارزیابی", "به چند سؤال کوتاه درباره علائم و سابقه خود پاسخ می‌دهید.")}
      ${how("۲", "bulb", "شناخت بهتر", "نتیجه به زبان ساده نشان می‌دهد الگوی علائم شما چه چیزی می‌گوید.")}
      ${how("۳", "flag", "اقدام مناسب", "قدم بعدی پیشنهادی، بدون القای نگرانی، در اختیار شما قرار می‌گیرد.")}
    </div>
  </div></section>

  <section class="sec ph-mol-sec"><div class="container">
    <div class="mol">
      <span class="mol-ico">${I.dna}</span>
      <div class="mol-body">
        <div class="mol-t"><h3>پروفایل مولکولی — به‌زودی</h3><span class="badge-en">COMING SOON</span></div>
        <p>نسل آینده ارزیابی سلامت با استفاده از نشانگرهای مولکولی و miRNA — این قابلیت در نسخه‌های آینده فعال می‌شود.</p>
      </div>
    </div>
  </div></section>`);
}

function vEntry() {
  return shell(`
  <section class="page"><div class="container narrow">
    <div class="page-head"><h1>از کجا شروع کنیم؟</h1><p>موضوع موردنظر خود را انتخاب کنید.</p></div>
    <div class="pick-list">
      <div class="pick active">
        <span class="pick-ico ico-women">${I.flower}</span>
        <div class="pick-b">
          <h3>سلامت زنان <span class="badge b-pos">فعال</span></h3>
          <p>ارزیابی علائم و عوامل مرتبط با سلامت باروری زنان</p>
          <p class="pick-tags">اندومتریوز · PCOS · POI</p>
        </div>
        <button class="btn btn-primary" data-nav="women">ورود به سلامت زنان ${I.chevL}</button>
      </div>
      <div class="pick active">
        <span class="pick-ico ico-men">${I.shield}</span>
        <div class="pick-b">
          <h3>سلامت مردان <span class="badge b-pos">فعال</span></h3>
          <p>ارزیابی‌های استاندارد سلامت باروری و جنسی مردان</p>
          <p class="pick-tags">PEDT · SHIM · NIH-CPSI · IPSS · ADAM</p>
        </div>
        <button class="btn btn-primary" data-nav="men">ورود به سلامت مردان ${I.chevL}</button>
      </div>
      <div class="pick active">
        <span class="pick-ico ico-sex">${I.rings}</span>
        <div class="pick-b">
          <h3>سلامت زناشویی <span class="badge b-pos">فعال</span></h3>
          <p>مسیر شخصی آموزش و ارزیابی سلامت زناشویی</p>
          <p class="pick-tags">پروفایل ۶ حوزه‌ای · برنامه ۷ روزه · بازبینی</p>
        </div>
        <button class="btn btn-primary" data-nav="sexual">ورود به سلامت زناشویی ${I.chevL}</button>
      </div>
    </div>
  </div></section>`);
}

function vMen() {
  return shell(`
  <section class="page"><div class="container men-wrap">
    <div class="backlink"><button data-nav="entry">← بازگشت به انتخاب بخش</button></div>
    <div class="mhero">
      <span class="mhero-kick">سلامت مردان</span>
      <h1>ارزیابی وضعیت سلامت جنسی، ادراری و هورمونی</h1>
      <p>یکی از ارزیابی‌های استاندارد زیر را انتخاب کنید. هر ابزار یک غربالگری و ابزار آگاهی‌بخشی است و نتیجه آن جایگزین تشخیص پزشکی نیست.</p>
    </div>
    <div class="mh-entry mhc">
      <span class="mh-entry-ico">${I.cal}</span>
      <div class="mh-entry-b"><h3>تقویم سلامت مردان</h3><p>حالت روزانه‌ات را زیر ۲۰ ثانیه ثبت کن و در طول زمان الگوهای خودت را بشناس — بدون قضاوت و بدون فشار.</p></div>
      <button class="btn btn-primary" data-nav="mhcal">ورود به تقویم ${I.chevL}</button>
    </div>
    <div class="mgrid">
      <article class="mcat mcat-sex">
        <span class="mcat-ico">◉</span>
        <h2>عملکرد جنسی</h2>
        <p>ارزیابی عملکرد نعوظ و بررسی علائم انزال زودرس</p>
        <div class="mcat-tools">
          <button data-start="shim"><span>ارزیابی عملکرد نعوظ</span><small>SHIM / IIEF-5 — ۵ سؤال</small></button>
          <button data-start="pedt"><span>بررسی علائم انزال زودرس</span><small>PEDT — ۵ سؤال</small></button>
        </div>
        <span class="mcat-count">۲ ابزار غربالگری استاندارد</span>
      </article>
      <article class="mcat mcat-ur">
        <span class="mcat-ico">◍</span>
        <h2>سلامت ادراری و پروستات</h2>
        <p>علائم ادراری و علائم درد لگنی و پروستات</p>
        <div class="mcat-tools">
          <button data-start="ipss"><span>ارزیابی علائم ادراری</span><small>IPSS — ۸ سؤال</small></button>
          <button data-start="cpsi"><span>علائم درد لگنی و پروستات</span><small>NIH-CPSI — ۹ سؤال</small></button>
        </div>
        <span class="mcat-count">۲ ابزار غربالگری استاندارد</span>
      </article>
      <article class="mcat mcat-ho">
        <span class="mcat-ico">◈</span>
        <h2>سلامت هورمونی</h2>
        <p>غربالگری علائم مرتبط با کمبود آندروژن</p>
        <div class="mcat-tools">
          <button data-start="adam"><span>غربالگری کمبود آندروژن</span><small>ADAM — ۱۰ سؤال</small></button>
        </div>
        <span class="mcat-count">۱ ابزار غربالگری استاندارد</span>
      </article>
    </div>
    <p class="mfoot">این ارزیابی‌ها ابزار غربالگری و آگاهی‌بخشی هستند و جایگزین ویزیت، آزمایش یا تشخیص پزشک نمی‌شوند.</p>
  </div></section>`);
}

function vAbout() {
  return shell(`
  <section class="page"><div class="container narrow">
    <div class="page-head"><h1>آشنایی با پلتفرم</h1>
    <p>این پلتفرم با هدف افزایش آگاهی، ارزیابی اولیه و ارائه محتوای متناسب با نیازهای سلامت طراحی شده است.</p></div>
    <div class="pr-grid">
      ${pr("bulb", "آگاهی", "درک بهتر بدن و علائم، اولین قدم برای سلامت است.")}
      ${pr("clip", "ارزیابی", "غربالگری اولیه علائم با پرسش‌های کوتاه و دقیق.")}
      ${pr("flag", "اقدام مناسب", "راهنمایی روشن برای قدم بعدی، بدون القای نگرانی.")}
    </div>
    <div class="note">${I.info}<span>در این نسخه، ارزیابی‌های هر سه بخش سلامت زنان، سلامت مردان و سلامت زناشویی فعال هستند. این پلتفرم ابزار تشخیص پزشکی نیست؛ پاسخ‌های بخش زناشویی فقط روی همین دستگاه ذخیره می‌شود.</span></div>
  </div></section>`);
}

function startQuiz(key) {
  state.quiz = { cond: key, answers: {}, step: 0 };
  state.stack = [MEN_CONDS[key] ? "men" : "women"];
  state.view = "quiz";
  render();
}

function vResult() {
  const r = state.result;
  const noScore = r.score == null || r.max == null;
  const pct = noScore ? 0 : Math.min(100, Math.round((r.score / r.max) * 100));
  const hasMeter = !noScore && Array.isArray(r.bands) && r.bands.length > 0;
  const heroInner = noScore
    ? `
      <div class="res-info">
        <span class="badge b-${r.level.cls}">${r.level.label}</span>
        <h2>نتیجه ارزیابی شما</h2>
        <p class="res-cond">${r.condTitle}</p>
        <p class="res-msg">${r.message}</p>
      </div>`
    : `
      <div class="ring-wrap">
        <div class="ring ${r.level.cls}">
          <svg viewBox="0 0 120 120">
            <circle class="ring-bg" cx="60" cy="60" r="52"/>
            <circle class="ring-fg" id="ring-fg" cx="60" cy="60" r="52" data-off="${(326.7 * (1 - Math.min(1, r.score / r.max))).toFixed(1)}" style="stroke-dasharray:326.7;stroke-dashoffset:326.7"/>
          </svg>
          <div class="ring-c"><div class="ring-score">${fa(r.score)}</div><div class="ring-max">از ${fa(r.max)}</div></div>
        </div>
        <div class="ring-lbl">${r.scoreLabel}</div>
      </div>
      <div class="res-info">
        <span class="badge b-${r.level.cls}">${r.level.label}</span>
        <h2>نتیجه ارزیابی شما</h2>
        <p class="res-cond">${r.condTitle}</p>
        <p class="res-msg">${r.message}</p>
        ${hasMeter ? meterHtml(r, pct) : ""}
      </div>`;
  return shell(`
  <section class="res view"><div class="container">
    <div class="card res-hero">${heroInner}</div>
    ${(r.specials || [])
      .map(
        (s) => `
    <div class="panel ${s.cls}">
      <span class="p-ico">${I[s.icon || "alert"]}</span>
      <div><h4>${s.title}</h4><p>${s.text}</p></div>
    </div>`,
      )
      .join("")}
    <div class="res-sec">
      <h3 class="rs-t">آنچه در پاسخ‌های شما دیده شد</h3>
      <div class="find-grid">
        ${r.findings
          .map(
            (f) => `
        <div class="card find">
          <span class="find-ico ic-${f.cls}">${I[f.icon] || I.act}</span>
          <div><h4>${f.title}</h4>${f.desc ? `<p>${f.desc}</p>` : ""}</div>
        </div>`,
          )
          .join("")}
      </div>
    </div>
    ${(r.sections || []).map((sec) => resSection(sec)).join("")}
    <div class="res-sec">
      <div class="card next-card">
        <div class="nx-h"><span class="nx-ico">${I.flag}</span><h3>قدم بعدی پیشنهادی</h3></div>
        <p>${r.next}</p>
      </div>
      <div class="note">${I.info}<span>این نتیجه یک ارزیابی اولیه بر اساس پاسخ‌های شماست و به‌تنهایی تشخیص پزشکی محسوب نمی‌شود.</span></div>
    </div>
    <div class="res-actions">
      <button class="btn btn-primary" data-act="res-back">${I.chevR} بازگشت به ${r.backLabel || "سلامت زنان"}</button>
      <button class="btn btn-secondary" data-act="res-home">بازگشت به خانه</button>
      <button class="btn btn-ghost" data-act="restart">ارزیابی مجدد</button>
    </div>
  </div></section>`);
}

function handleAct(act) {
  if (act === "quiz-next") {
    const vis = visibleSteps();
    const pos = vis.findIndex((s) => s.i === state.quiz.step);
    if (!validateStep(vis[pos])) return;
    if (pos === vis.length - 1) finishQuiz();
    else {
      state.quiz.step = vis[pos + 1].i;
      render();
    }
  } else if (act === "quiz-prev") {
    const vis = visibleSteps();
    const pos = vis.findIndex((s) => s.i === state.quiz.step);
    if (pos <= 0) back();
    else {
      state.quiz.step = vis[pos - 1].i;
      render();
    }
  } else if (act === "quiz-exit") {
    back();
  } else if (act === "res-back" || act === "res-women") {
    reset((state.result && state.result.backView) || "women");
  } else if (act === "res-home") {
    reset("home");
  } else if (act === "restart") {
    startQuiz(state.quiz.cond);
  }
}

/* Sexual wellness uses its own capture-phase listener so the
   generic quiz handlers never touch its buttons. */
document.getElementById("app").addEventListener(
  "click",
  (e) => {
    const swb = e.target.closest("[data-sw]");
    if (swb && swb.dataset.sw) {
      e.stopPropagation();
      handleSw(swb.dataset.sw, swb);
      return;
    }
  },
  true,
);

/* ============================================================
   تقویم چرخه قاعدگی (Menstrual Cycle Calendar) — standalone module
   ------------------------------------------------------------
   * JAL: موتور تقویم جلالی (config.js) — بدون وابستگی
   * store: localStorage (نسخهٔ نمایشی، فقط روی همین دستگاه)
   * منطق چرخه (فازها، تخمک‌گذاری، پنجرهٔ باروری، میانگین):
       توابع خالص cx* در scoring.js — قابل‌آزمون در node
   * views: vCycle + هیرو حلقه + تقویم ماهانه + ثبت روز +
       راهنمای مراحل + الگوی چرخه + کارت‌های دانش/منابع
   * سیم‌کشی با [data-cy] (الگوی capture، مانند بقیهٔ اپ)
   * قاعدهٔ محتوایی: تا وقتی داده کافی نیست، هیچ پیش‌بینی‌ای
     نمایش داده نمی‌شود؛ همیشه «تخمینی» صریح است.
   ============================================================ */

/* ---------- extra icons ---------- */
I.gear = SV('<path d="M4 7.2h8.2M16.6 7.2H20M4 16.8h3.4M11.8 16.8H20"/><circle cx="14.4" cy="7.2" r="2.5"/><circle cx="9.6" cy="16.8" r="2.5"/>');
I.trash = SV('<path d="M4.5 6.4h15M9.7 6.4V5a1.5 1.5 0 0 1 1.5-1.5h1.6A1.5 1.5 0 0 1 14.3 5v1.4M6.8 6.4l.8 12.3a1.9 1.9 0 0 0 1.9 1.8h5a1.9 1.9 0 0 0 1.9-1.8l.8-12.3"/><path d="M10.2 10.6v5.6M13.8 10.6v5.6"/>');
I.pen = SV('<path d="m14.8 5.2 4 4"/><path d="M4.4 19.6l1.1-4.1L16.6 4.4a1.9 1.9 0 0 1 2.7 0l.3.3a1.9 1.9 0 0 1 0 2.7L8.5 18.5l-4.1 1.1z"/>');
I.chevD = SV('<path d="m6.5 9.8 5.5 5.4 5.5-5.4"/>');
I.drop = SV('<path d="M12 3.4s6 6.4 6 10.6a6 6 0 0 1-12 0c0-4.2 6-10.6 6-10.6z"/>');
I.moon = SV('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>');
I.leaf = SV('<path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z"/><path d="M5 19 13 11"/>');
I.heart = SV('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>');
I.bowl = SV('<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0z"/><path d="M8 7.5c0-1.2 1-1.5 1-3M12 7.5c0-1.2 1-1.5 1-3M16 7.5c0-1.2 1-1.5 1-3"/>');
I.run = SV('<circle cx="14.5" cy="4.8" r="1.8"/><path d="m8 21 3-5.5-2.5-2 1.5-4.5 4 1.5 2.5 3M10 8.5 7 11"/>');
I.spark = SV('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>');
I.vital = SV('<path d="M3 12h4l2-5 4 10 2-5h6"/>');
I.stetho = SV('<path d="M6 3.5v4.7a4.3 4.3 0 0 0 8.6 0V3.5"/><path d="M10.3 12.5v2.7a5.2 5.2 0 0 0 10.4 0v-1.4"/><circle cx="20.7" cy="11.6" r="2"/>');

/* ---------- store (v2: فقط مدت پریود داخلی؛ طول چرخه همیشه خودکار از شروع‌ها
   محاسبه می‌شود و کاربر آن را وارد نمی‌کند — پس از چند ثبت به او گفته می‌شود) ---------- */
function cyEmptyDb() { return { v: 2, days: {}, settings: { periodLen: CX_DEFAULT_PERIOD } }; }
function cyLoadDb() {
  try {
    const raw = localStorage.getItem(CY_KEY);
    if (!raw) return cyEmptyDb();
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object" || !d.days) return cyEmptyDb();
    if (!d.settings || typeof d.settings !== "object") d.settings = {}; /* سازگاری v1 */
    /* طول چرخهٔ دستی از نسخه‌های قبل دیگر معتبر نیست — همیشه خودکار محاسبه می‌شود */
    delete d.settings.cycleLenOverride;
    return d;
  } catch (e) { return cyEmptyDb(); }
}
function cySaveDb() { try { localStorage.setItem(CY_KEY, JSON.stringify(cyDb)); } catch (e) {} }
let cyDb = cyLoadDb();

/* ---------- وضعیت UI ماژول ---------- */
const CY = {
  y: null, m: null,   /* ماه جلالی در حال مشاهده */
  sel: null,          /* روز انتخاب‌شده (کلید "jy-mm-dd") */
  tab: null,          /* تب فعال راهنمای مراحل */
  toast: null,
  setOpen: false,
  histWin: false,     /* پنجرهٔ جدا «تاریخچهٔ الگو» (درخواست کاربر: باز در یک پنجره، بستن با دکمه/پس‌زمینه/Esc) */
  knowTips: true,     /* باز/بستهٔ کارت «چند نکتهٔ معتبر» (پیش‌فرض باز، مانند طرح کاربر) */
  knowDoc: false,     /* باز/بستهٔ کارت «چه زمانی با پزشک یا ماما صحبت کنیم» */
  confReset: false, confMove: null,
};
function cyToast(msg) {
  CY.toast = msg;
  render(false);
  setTimeout(function () {
    CY.toast = null;
    const el = document.querySelector(".cx-toast");
    if (el) el.remove(); /* بدون رندر مجدد — تایپ در یادداشت پاک نمی‌شود */
  }, 2600);
}

/* ---------- کمک‌метرهای تاریخ ---------- */
function cxFmtShort(j) { return fa(j.jd) + " " + JAL.MONTHS[j.jm - 1]; }
function cxFmtFull(jdn) {
  const j = JAL.d2j(jdn);
  return JAL.WD[JAL.colOf(jdn)] + "، " + cxFmtShort(j) + " " + fa(j.jy);
}
function cyTodayJdn() { const t = JAL.today(); return JAL.j2d(t.jy, t.jm, t.jd); }

/* ---------- دسترسی به ثبت یک روز ---------- */
function cyRec(jKey) { if (!cyDb.days[jKey]) cyDb.days[jKey] = {}; return cyDb.days[jKey]; }
function cyNormalizeDay(jKey) {
  /* شدت درد فقط با علامت «درد شکم» معنا دارد؛ شدت بقیهٔ علائم (sev) هم فقط همراه همان علامت */
  const r = cyDb.days[jKey];
  if (!r) return;
  if (!((r.symptoms || []).indexOf("cramp") > -1)) delete r.pain;
  if (r.sev) {
    const syms = r.symptoms || [];
    Object.keys(r.sev).forEach(function (k) { if (syms.indexOf(k) < 0) delete r.sev[k]; });
    if (!Object.keys(r.sev).length) delete r.sev;
  }
  if (!cyRecHasContent(r)) delete cyDb.days[jKey];
}

/* ---------- مدل چرخه از دادهٔ ذخیره‌شده (تنها منبع محاسباتی صفحه) ---------- */
function cxModel() {
  /* cyStarts حالا {key, jdn, plen} می‌دهد — plen = مدت پریود همان چرخه (اسنپ‌شات) */
  return cxBuildModel(cyStarts(), cyDb.settings, cyTodayJdn());
}

/* ================= محتوای فازها ================= */
const CX_PH = {
  mens: { n: "قاعدگی", c: "cx-t-mens", col: "var(--cx-rose)",
    lead: "لایه داخلی رحم ریزش می‌کند و هورمون‌ها در پایین‌ترین سطح‌اند. انرژی‌ات کم‌تر از معمول است و این کاملاً طبیعی است.",
    hormone: "در شروع قاعدگی، سطح استروژن و پروژسترون پایین است. پروستاگلاندین‌ها باعث انقباض رحم می‌شوند و ممکن است گرفتگی ایجاد کنند.",
    mood: "ممکن است خسته‌تر، آرام‌تر یا درون‌گراتر باشی. نیاز به استراحت بیشتر برای بعضی افراد طبیعی است و تجربهٔ هر فرد می‌تواند متفاوت باشد.",
    food: "غذاهای حاوی آهن مثل گوشت قرمز، عدس و سبزی‌های برگ‌تیره را در برنامه‌ات بگنجان. همراه‌کردن منابع گیاهی آهن با ویتامین C، مانند لیمو، پرتقال یا فلفل دلمه‌ای، به جذب بهتر آهن کمک می‌کند. آب و نوشیدنی گرم هم می‌تواند حس راحتی بیشتری ایجاد کند.",
    move: "پیاده‌روی سبک، حرکات کششی و یوگای ملایم را امتحان کن. اگر احساس خوبی داری، ادامهٔ تمرین معمولت هم اشکالی ندارد.",
    care: "کیسهٔ آب گرم را با یک لایه پارچه روی شکمت بگذار و به خواب کافی اهمیت بده. اگر درد آن‌قدر شدید است که فعالیت‌های روزانه‌ات را مختل می‌کند، آن را با پزشک در میان بگذار.",
    msg: "بدنت در حال بازسازی است. استراحت و گرما کمک می‌کند." },
  foll: { n: "فولیکولی", c: "cx-t-foll", col: "var(--cx-sage)",
    lead: "با رشد فولیکول‌ها، سطح استروژن به‌تدریج افزایش می‌یابد. بعضی از خانم‌ها در این روزها احساس انرژی بیشتر، تمرکز بهتر یا سبکی بیشتری دارند.",
    hormone: "هورمون FSH رشد فولیکول‌های تخمدان را تحریک می‌کند. با رشد فولیکول غالب، استروژن افزایش می‌یابد و به بازسازی و ضخیم‌شدن پوشش داخلی رحم کمک می‌کند.",
    mood: "ممکن است انرژی، تمرکز یا خوش‌بینی بیشتری احساس کنی. اگر چنین تغییری را تجربه می‌کنی، می‌توانی از آن برای پیشبرد کارها و شروع فعالیت‌های تازه بهره ببری.",
    food: "پروتئین کافی، میوه و سبزی تازه و غلات کامل را در برنامه‌ات بگنجان. اگر خون‌ریزی قاعدگی‌ات زیاد بوده، به دریافت آهن کافی توجه کن.",
    move: "اگر انرژی و حال عمومی‌ات مناسب است، تمرین قدرتی یا ورزش‌های پرتحرک را امتحان کن. شدت تمرین را با آمادگی و احساس بدنت هماهنگ کن.",
    care: "به تغییرات انرژی و تمرکزت توجه کن و ببین در چرخه‌های مختلف چه الگویی برای خودت تکرار می‌شود. لازم نیست هر ماه احساس یا عملکرد یکسانی داشته باشی.",
    msg: "استروژن در حال بالا رفتن است. انرژی و تمرکز معمولاً بیشتر می‌شود." },
  ovul: { n: "تخمک‌گذاری", c: "cx-t-ovul", col: "var(--cx-gold)",
    lead: "در حوالی تخمک‌گذاری، افزایش ناگهانی هورمون LH به آزادشدن تخمک کمک می‌کند. پنجرهٔ باروری معمولاً از پنج روز پیش از تخمک‌گذاری تا حدود یک روز پس از آن در نظر گرفته می‌شود.",
    hormone: "استروژن پیش از تخمک‌گذاری به سطح بالایی می‌رسد و جهش هورمون LH فرایند آزادشدن تخمک را تحریک می‌کند. ترشحات دهانهٔ رحم ممکن است شفاف، لغزنده و کش‌دار شوند.",
    mood: "ممکن است انرژی، معاشرت‌پذیری یا میل جنسی بیشتری احساس کنی. بعضی افراد نیز درد خفیف و یک‌طرفه در پایین شکم را تجربه می‌کنند.",
    food: "آب کافی، سبزی‌های رنگارنگ، میوه‌ها و غذاهای سرشار از فیبر را در برنامه‌ات بگنجان. اگر بعضی غذاها باعث نفخ می‌شوند، مصرفشان را متناسب با تحمل بدنت تنظیم کن.",
    move: "اگر احساس خوبی داری، تمرین قدرتی یا ورزش پرتحرک را انجام بده. شدت تمرین را بر اساس آمادگی و احساس خودت تنظیم کن؛ لازم نیست در این مرحله حتماً شدیدتر ورزش کنی.",
    care: "زمان تخمک‌گذاری ممکن است از یک چرخه به چرخهٔ دیگر تغییر کند. تاریخ قاعدگی و تغییرات ترشحاتت را ثبت کن تا به‌مرور الگوی بدنت را بهتر بشناسی.",
    msg: "به تخمک‌گذاری نزدیکی. پنجره باروری باز است." },
  lut: { n: "لوتئال", c: "cx-t-lut", col: "var(--cx-lav)",
    lead: "پس از تخمک‌گذاری، پروژسترون افزایش می‌یابد و به آماده‌شدن پوشش داخلی رحم برای بارداری احتمالی کمک می‌کند. اگر بارداری رخ ندهد، سطح پروژسترون و استروژن در پایان چرخه کاهش می‌یابد و ممکن است علائم پیش از قاعدگی ظاهر شوند.",
    hormone: "پروژسترون در میانهٔ این مرحله به اوج می‌رسد. دمای پایهٔ بدن نیز پس از تخمک‌گذاری کمی افزایش می‌یابد. در صورت رخ‌ندادن بارداری، افت هورمون‌ها زمینه را برای شروع قاعدگی فراهم می‌کند.",
    mood: "ممکن است حساس‌تر، کم‌حوصله‌تر یا مضطرب‌تر شوی. این تغییرات برای بعضی افراد بخشی از علائم پیش از قاعدگی است و نشانهٔ ضعف نیست؛ تجربهٔ هر فرد متفاوت است.",
    food: "غلات کامل، میوه و سبزی، منابع کلسیم و غذاهای حاوی منیزیم مانند مغزها و سبزی‌های برگ‌دار را در برنامه‌ات بگنجان. اگر مصرف زیاد نمک یا کافئین علائمی مثل نفخ یا تپش قلبت را تشدید می‌کند، مقدار آن را کاهش بده.",
    move: "پیاده‌روی، شنا و یوگا را متناسب با حال و انرژی‌ات انتخاب کن. فعالیت بدنی منظم می‌تواند به کاهش برخی علائم پیش از قاعدگی کمک کند.",
    care: "علائم جسمی و تغییرات خلق‌وخویت را ثبت کن تا الگوی چرخه‌ات را بهتر بشناسی. خواب منظم و کافی می‌تواند به کاهش خستگی و نوسانات خلقی کمک کند. اگر افت خلق شدید و تکرارشونده، زندگی روزمره‌ات را مختل می‌کند، برای دریافت کمک مناسب با پزشک صحبت کن.",
    msg: "پروژسترون بالاست. اگر آرام‌تر یا حساس‌تری، طبیعی است.",
    msgLate: "پریودت از تخمین دیرتر شده. اگر شروع شد، روز اولش را ثبت کن تا تخمین‌ها به‌روز شوند." },
};
const CX_ORDER = ["mens", "foll", "ovul", "lut"];

/* ================= حلقهٔ SVG ================= */
function cxRingSvg(M, P) {
  const len = M.cycleLen, R = 100, C = 2 * Math.PI * R, cx = 120, gap = 9;
  /* مرز قطعه‌ها بر حسب شمارهٔ روز چرخه (واحد = روز−۱)؛ از همان مدل مشترک */
  const pl = M.periodLen;
  const ovDay = len - CX_OV_OFFSET;
  /* پنجرهٔ باروری از همان مدل مشترک می‌آید — با گسترش چرخه‌های نامنظم (بند ۳) */
  const wf = Math.max(1, ovDay - M.fertBefore), wt = ovDay + M.fertAfter;
  /* مرزهای حلقه باید یکنواخت و غیرهم‌پوشان بمانند؛ در چرخه کوتاه/خون‌ریزی بلند،
     بخش باروریِ حلقه فقط پس از پایان بخش قاعدگی رسم می‌شود. */
  const b1 = Math.min(pl, len);
  const b2 = Math.min(len, Math.max(b1, wf - 1));
  const b3 = Math.min(len, Math.max(b2, wt));
  const segs = [
    ["mens", 0, b1],
    ["foll", b1, b2],
    ["ovul", b2, b3],
    ["lut", b3, len],
  ];
  const cols = { mens: "#FF86AC", foll: "#79CDB2", ovul: "#2FB3A3", lut: "#B49BF5" };
  let out = "";
  segs.forEach(function (s) {
    const a = (s[1] / len) * C, l = ((s[2] - s[1]) / len) * C - gap;
    if (l < 2) return;
    out += '<circle cx="' + cx + '" cy="' + cx + '" r="' + R + '" fill="none" stroke="' + cols[s[0]] +
      '" stroke-width="15" stroke-linecap="round" stroke-dasharray="' + l.toFixed(2) + " " + (C - l).toFixed(2) +
      '" stroke-dashoffset="' + (-(a + gap / 2)).toFixed(2) + '" transform="rotate(-90 ' + cx + " " + cx +
      ')" opacity="' + (s[0] === P.p ? 1 : 0.45) + '"/>';
  });
  const pos = (Math.min(P.day - 0.5, len - 0.3) / len) * 2 * Math.PI - Math.PI / 2;
  const mx = cx + R * Math.cos(pos), my = cx + R * Math.sin(pos);
  out += '<circle cx="' + mx.toFixed(1) + '" cy="' + my.toFixed(1) + '" r="13" fill="rgba(255,255,255,.22)"/>' +
    '<circle cx="' + mx.toFixed(1) + '" cy="' + my.toFixed(1) + '" r="8.5" fill="#fff" stroke="' + cols[P.p] + '" stroke-width="4"/>';
  return '<svg viewBox="0 0 240 240" role="img" aria-label="حلقه چرخه: روز ' + fa(P.day) + " از حدود " + fa(len) + ' روز چرخه">' +
    '<circle cx="120" cy="120" r="100" fill="none" stroke="rgba(61,26,69,.08)" stroke-width="15"/>' + out +
    '<circle cx="120" cy="120" r="78" fill="rgba(255,255,255,.45)"/></svg>';
}

/* ---------- برچسب فارسی وضعیت یک روز (تنها از مدل) ---------- */
function cxPhaseName(P) {
  if (!P) return "";
  /* وقتی موعد پریود گذشته، فازهای بعد از موعد دیگر قابل اتکا نیستند. */
  if (P.lateUnknown) return "پیش‌بینی متوقف شده";
  /* در روزهای پریود، برچسب قاعدگی همیشه اولویت دارد؛ حتی اگر بازهٔ تخمینی هم‌پوشانی کند. */
  if (P.per) return CX_PH[P.p].n;
  if (P.ov) return "تخمک‌گذاری";
  if (P.p === "ovul") return "پنجرهٔ باروری";
  return CX_PH[P.p].n;
}

/* ---------- کنترل «مدت پریود» (سمت چپِ نوار شروع) ----------
   کاربر مدت پریود را در هر ثبت می‌تواند تغییر دهد — مثلاً یک بار ۵ روز، بار دیگر ۶ روز.
   عدد روی آخرین پریودِ ثبت‌شده اعمال می‌شود و به‌عنوان نقطهٔ شروع پریود بعدی هم می‌ماند؛
   تاریخ‌گذاری هر پریود جدا نگه داشته می‌شود (plen روی رکورد همان شروع). */
function cxPeriodTargetKey() {
  /* انتخابِ روز شروع، کنترل مدت را به همان پریود وصل می‌کند؛ در غیر این صورت آخرین پریود هدف است. */
  if (CY.sel && cyDb.days[CY.sel] && cyDb.days[CY.sel].start) return CY.sel;
  const st = cyStarts();
  return st.length ? st[st.length - 1].key : null;
}
function cxEffPeriodLen() {
  const key = cxPeriodTargetKey();
  if (key) {
    const r = cyDb.days[key] || {};
    const n = Math.round(Number(r.plen));
    if (Number.isFinite(n) && n >= CX_PERIOD_MIN) return Math.min(CX_PERIOD_MAX, n);
  }
  return cxNormSettings(cyDb.settings).periodLen;
}
function cxPeriodShift(delta) {
  const nv = Math.max(CX_PERIOD_MIN, Math.min(CX_PERIOD_MAX, cxEffPeriodLen() + delta));
  const key = cxPeriodTargetKey();
  if (key) cyRec(key).plen = nv;
  else cyDb.settings.periodLen = nv;
  cySaveDb();
}
function cxPeriodChipHtml(M) {
  if (!M) return "";
  const len = cxEffPeriodLen();
  const selectedStart = !!(CY.sel && cyDb.days[CY.sel] && cyDb.days[CY.sel].start);
  const targetHint = selectedStart ? "تنظیم برای پریود انتخاب‌شده" : "تنظیم برای آخرین پریود ثبت‌شده";
  return `
  <div class="cx-clchip" role="group" aria-label="مدت پریود">
    <small>مدت پریود</small>
    <div class="cx-clrow">
      <button type="button" data-cy="pd-dec" aria-label="کاهش مدت پریود"${len <= CX_PERIOD_MIN ? " disabled" : ""}>−</button>
      <b>${fa(len)} روز</b>
      <button type="button" data-cy="pd-inc" aria-label="افزایش مدت پریود"${len >= CX_PERIOD_MAX ? " disabled" : ""}>+</button>
    </div>
    <span>${targetHint}؛ برای تغییر هر پریود، روز اول آن را انتخاب کن</span>
  </div>`;
}

/* ================= ویوی اصلی ================= */
function vCycle() {
  const t = JAL.today();
  if (CY.y === null) { CY.y = t.jy; CY.m = t.jm; }
  if (CY.sel === null) CY.sel = JAL.keyOf(t.jy, t.jm, t.jd);
  const head = `
  <div class="backlink"><button data-nav="women">← بازگشت به سلامت زنان</button></div>
  <div class="cx-toprow">
    <div><h1>تقویم چرخه قاعدگی</h1><p>چرخه‌ات را بهتر بشناس — زیبا، آرام و علمی</p></div>
    <button class="cx-set-btn ${CY.setOpen ? "on" : ""}" data-cy="set" aria-label="تنظیمات و آمار تقویم" aria-expanded="${CY.setOpen ? "true" : "false"}">${I.gear}</button>
  </div>`;
  const M = cxModel();
  return shell(`
  <section class="page cx-scene"><div class="container cx-wrap">
    ${head}
    ${CY.setOpen ? cxSettingsHtml(M) : ""}
    ${cxHeroHtml(M)}
    ${cxCalHtml(M)}
    <!-- قفسهٔ دفترچه‌ها: دفترچهٔ علائم راست، دفترچه‌های تغذیه/دمنوش چپ (sj-shelf) -->
    <div id="sjSlot" class="sj-shelf"></div>
    <!-- ترتیب تازه (درخواست کاربر): الگوی چرخه بالاتر زیر دفترچه‌ها، مراحل چرخه پایین آن -->
    ${cxHistHtml(M)}
    ${cxGuideHtml(M)}
    ${cxKnowHtml()}
    <div class="note">${I.info}<span>در این نسخهٔ نمایشی، ثبت‌های تو فقط روی همین دستگاه (مرورگر خودت) ذخیره می‌شود.</span></div>
    ${CY.histWin ? cxHistWinHtml(M) : ""}
    ${CY.toast ? `<div class="cx-toast" role="status">${I.check}${esc(CY.toast)}</div>` : ""}
  </div></section>`);
}

/* ---------- هیرو ---------- */
function cxHeroHtml(M) {
  if (!M || !M.st.length) {
    return `
    <section class="cx-hero cx-hero-start" aria-label="شروع ثبت چرخه">
      <div class="cx-hs-txt">
        <div class="cx-kick">شروع کنیم</div>
        <h2>روز اول آخرین پریودت را ثبت کن</h2>
        <p class="cx-hero-msg">هر تاریخی را — حتی در ماه‌های گذشته — روی تقویم انتخاب کن. با ثبت یک تاریخ، پیش‌بینی‌ها با پیش‌فرض ۲۸ روزه ساخته می‌شود و با ثبت پریودهای بعدی خودش دقیق‌تر می‌شود.</p>
      </div>
      <div class="cx-hs-img" aria-hidden="true"><img src="img/cycle/start.jpg" alt="" loading="eager" decoding="async"></div>
    </section>`;
  }
  const tJdn = cyTodayJdn();
  const cur = M.cur;
  let P = cxPhaseOf(M, tJdn, tJdn);
  if (M.late) {
    /* دیرتر از تخمین: شمارش روز از شروعِ واقعیِ آخرین چرخه ادامه می‌یابد */
    P = { p: "lut", day: tJdn - cur.s + 1, c: cur, ov: false };
  } else if (!P) {
    P = { p: "lut", day: tJdn - cur.s + 1, c: cur, ov: false };
  }
  const pk = M.late ? "lut" : P.p;
  const info = CX_PH[pk];
  const phaseN = M.late ? "چرخه طولانی‌تر از تخمین" : cxPhaseName(P);
  const msg = (M.late && CX_PH.lut.msgLate) ? CX_PH.lut.msgLate : info.msg;
  const pillCls = pk === "mens" ? "cx-t-mens" : pk === "foll" ? "cx-t-foll" : pk === "ovul" ? "cx-t-ovul" : "cx-t-lut";
  /* آمار — همه از مدل مشترک؛ در چرخه‌های بسیار کوتاه، پنجره ممکن است در روز اول چرخه محدود شود. */
  const currentWindowDays = Math.max(0, cur.wt - cur.wf + 1);
  /* هم‌پوشانی واقعی پنجرهٔ محاسباتی با روزهای پریود — پنهان نمی‌شود، شفاف گفته می‌شود */
  const perOverlap = Math.max(0, Math.min(cur.wt, cur.pe) - Math.max(cur.wf, cur.s) + 1);
  const daysTo = M.nextStart - tJdn;
  const nextT = daysTo < 0 ? fa(-daysTo) + " روز دیرتر از تخمین"
    : daysTo === 0 ? "امروز (تخمینی)"
    : fa(daysTo) + " روز دیگر";
  const ovd = cur.ov - tJdn;
  const ovT = ovd > 0 ? fa(ovd) + " روز دیگر" : ovd === 0 ? "امروز" : "گذشته";
  /* در دیرکرد: تخمین تخمک‌گذاری و پنجرهٔ باروری به چرخهٔ قبلی تعلق دارد و اعتبارش
     تمام شده — به‌جای نمایش تاریخ‌های گذشته به‌عنوان «پنجرهٔ فعلی»، وضعیت نامشخص
     با توضیح شفاف نمایش داده می‌شود تا ثبت شروع پریود بعدی (درخواست کاربر). */
  const ovStat = M.late
    ? `<div class="cx-stat cx-stat-na"><small>تخمک‌گذاری</small><b>نامشخص</b><span>پیش‌بینی چرخهٔ جاری متوقف شده است</span></div>`
    : `<div class="cx-stat"><small>تخمک‌گذاری (تخمینی)</small><b>${ovT}</b><span>${cxFmtShort(JAL.d2j(cur.ov))}</span></div>`;
  const fertStat = M.late
    ? `<div class="cx-stat cx-stat-na"><small>پنجرهٔ باروری</small><b>نامشخص</b><span>تا ثبت شروع پریود بعدی</span></div>`
    : `<div class="cx-stat"><small>پنجرهٔ باروری (تخمینی)</small><b>${fa(currentWindowDays)} روز</b><span>${cxFmtShort(JAL.d2j(cur.wf))} تا ${cxFmtShort(JAL.d2j(cur.wt))}</span></div>`;
  const stats = `
    <div class="cx-stats">
      <div class="cx-stat"><small>پریود بعدی (تخمینی)</small><b>${nextT}</b><span>${cxFmtShort(JAL.d2j(M.nextStart))}</span></div>
      ${ovStat}
      ${fertStat}
    </div>`;
  const srcTxt = M.cycleLenSrc === "avg"
    ? "میانگین " + fa(M.used.length) + " چرخهٔ اخیر تو (" + fa(M.cycleLen) + " روز)"
    : (M.diffs.length > 0 && M.used.length === 0
      ? "پیش‌فرض " + fa(CX_DEFAULT_CYCLE) + " روزه — فاصلهٔ شروع‌های ثبت‌شدهٔ اخیر کمتر از ۱۵ روز بوده و در میانگین به‌کار نرفته است؛ اگر واقعی‌اند، بررسی پزشکی لازم است"
      : "پیش‌فرض " + fa(CX_DEFAULT_CYCLE) + " روزه — با ثبت پریود بعدی، خودکار دقیق‌تر می‌شود");
  /* در دیرکرد، یادداشت‌های «پنجرهٔ برآوردشده» (احتیاط/هم‌پوشانی) معنا ندارند —
     چون پنجره‌ای نمایش داده نمی‌شود؛ به‌جای آن توضیح شفاف دیرکرد می‌آید. */
  const fertNote = !M.late && M.fertExtra > 0
    ? (M.fertReason === "var"
      ? " چون چرخه‌های اخیر تو نوسان داشته‌اند، پنجرهٔ باروری با احتیاط بیشتری برآورد شده است."
      : " با اطلاعات فعلی، پنجرهٔ باروری با احتیاط بیشتری برآورد شده است.")
    : "";
  const ovNote = !M.late && perOverlap > 0
    ? " " + fa(perOverlap) + " روز از این پنجره با پریود هم‌پوشان است و روی تقویم با رنگ پریود دیده می‌شود."
    : "";
  const lateNote = M.late
    ? " موعد تخمینی پریود گذشته و پیش‌بینی چرخهٔ جاری متوقف شده است؛ تخمین تخمک‌گذاری و پنجرهٔ باروریِ مبتنی بر چرخهٔ قبلی معتبر نیست و به‌عنوان پنجرهٔ فعلی نمایش داده نمی‌شود. با ثبت شروع پریود بعدی، پیش‌بینی‌ها دوباره ساخته می‌شوند."
    : "";
  const shortNote = M.cycleLen < CX_ADULT_LO
    ? " چون طول تخمینی چرخه کمتر از ۲۱ روز است، برآورد تخمک‌گذاری و باروری بسیار نامطمئن است و نیاز به بررسی پزشکی دارد. پنجرهٔ باروری عمداً تا حداقل ۷ روز گسترش داده نمی‌شود؛ ممکن است کوتاه‌تر از معمول یا هم‌پوشان با پریود دیده شود."
    : "";
  /* چرخهٔ بلندتر از محدودهٔ ACOG (>۳۵ روز): هشدار خارج از محدوده + توضیح عدم قطعیت.
     هیچ تغییر خودکاری در طول چرخه یا محاسبات رخ نمی‌دهد — صرفاً شفاف‌سازی نمایشی. */
  const longNote = M.cycleLen > CX_ADULT_HI
    ? " چون طول تخمینی چرخه بیشتر از ۳۵ روز است، برآورد تخمک‌گذاری و باروری نامطمئن‌تر است؛ در چرخه‌های بلند، تخمک‌گذاری اغلب دیرتر از فرض استاندارد «حدود ۱۴ روز پیش از پریود بعدی» رخ می‌دهد و پنجرهٔ واقعی ممکن است جابه‌جا باشد. طول چرخهٔ تو عمداً به‌صورت خودکار تغییر داده نمی‌شود و تخمین‌ها از میانگین ثبت‌شدهٔ خودت استفاده می‌کنند؛ چرخه‌های بلندِ مداوم نیاز به بررسی پزشکی دارند."
    : "";
  const fine = "تخمین‌ها از " + srcTxt + " و مدت پریود " + fa(M.periodLen) + " روزه محاسبه شده است."
    + fertNote + ovNote + lateNote + shortNote + longNote;
  return `
  <section class="cx-hero" aria-label="خلاصه چرخه">
   <div class="cx-kick">چرخه جاری · از ${cxFmtShort(JAL.d2j(cur.s))}</div>
   <h2>${cxFmtShort(JAL.d2j(tJdn))} · ${JAL.WD[JAL.colOf(tJdn)]}</h2>
   <div class="cx-ringbox">${cxRingSvg(M, { p: pk, day: P.day })}
   <div class="cx-ring-c"><small>روز</small><div class="cx-big">${fa(P.day)}</div><small>از حدود ${fa(M.cycleLen)} روز چرخه</small>
   <span class="cx-pill ${pillCls} on-hero"><i></i>${phaseN}</span></div></div>
   <p class="cx-hero-msg">${msg}</p>
   ${stats}
   <p class="cx-fine">${fine}</p>
  </section>`;
}

/* ---------- تقویم ماهانه — بازطراحی آرتیفکت (cx-cycle-art) ----------
   فقط لایهٔ نمایش عوض شده؛ مدل و منطق (cxPhaseOf/cxModel/cyStarts) دست‌نخورده است.
   data-cyهای قدیمی حفظ شده‌اند: prevm/nextm/todaym/day/mark-start. */
function cxCalHtml(M) {
  const first = JAL.j2d(CY.y, CY.m, 1);
  const col0 = JAL.colOf(first);
  const n = JAL.monthLen(CY.y, CY.m);
  const gridStart = first - col0;
  const total = Math.ceil((col0 + n) / 7) * 7;
  const tJdn = cyTodayJdn();
  /* شروع‌های ثبت‌شده + لکه‌بینی + ثبت محتوا (رنگ‌ها فقط از مدل مشترک می‌آیند) */
  const startJdn = {}, spotJdn = {}, logJdn = {};
  cyStarts().forEach(function (s) { startJdn[s.jdn] = true; });
  Object.keys(cyDb.days).forEach(function (k) {
    const r = cyDb.days[k], j = JAL.keyToJdn(k);
    if (r.flow === "spotting") spotJdn[j] = true;
    if (cyRecHasContent(r)) logJdn[j] = true;
  });
  let cells = "";
  for (let i = 0; i < total; i++) {
    const j = gridStart + i;
    const jj = JAL.d2j(j);
    const inM = jj.jm === CY.m && jj.jy === CY.y;
    let cls = "cxa-day";
    const isStart = !!startJdn[j], isSpot = !!spotJdn[j];
    /* اولویت قطعی نمایش با پریود است: روی روزهای پریود هیچ نشان باروری/تخمک‌گذاری
       نمایش داده نمی‌شود؛ محاسبهٔ زیستیِ تخمینی (cxPhaseOf) دست‌نخورده می‌ماند.
       گارد P: اگر روز پیش از نخستین شروعِ ثبت‌شده باشد، cxPhaseOf مقدار null برمی‌گرداند؛
       بدون این گارد رندر کل تقویم با خطا متوقف می‌شد (باگ روزِ پیش از آغاز ثبت). */
    const P = M && M.st.length ? cxPhaseOf(M, j, tJdn) : null;
    if (P) {
      if (P.per && !P.perPred && !P.perCont) cls += " is-period";
      else if (P.perPred) cls += " is-pred";
      else if (P.perCont) cls += " is-cont";
      if (P.lite) cls += " is-lite";
      if (P.fert && !P.per) cls += " is-fertile";
      if (P.ov && !P.per) cls += " is-ov";
      /* روز شروع ثبت‌شده: رز عمیق (بدون آیکون اضافه — ظرافت آرتیفکت) */
      if (P.per && !P.perPred && !P.perCont && isStart) cls += " is-start";
    }
    if (isSpot && !(P && P.per)) cls += " is-spot";
    if (j === tJdn) cls += " is-today";
    if (JAL.keyOf(jj.jy, jj.jm, jj.jd) === CY.sel) cls += " is-selected";
    if (!inM) cls += " is-out";
    const stInfo = cxaDayState(M, j, tJdn, isStart, isSpot);
    const dot = logJdn[j] ? '<i class="cxa-log" aria-hidden="true"></i>' : "";
    cells += `<button type="button" class="${cls}" data-cy="day" data-k="${JAL.keyOf(jj.jy, jj.jm, jj.jd)}" aria-pressed="${JAL.keyOf(jj.jy, jj.jm, jj.jd) === CY.sel ? "true" : "false"}" aria-label="${JAL.WD[JAL.colOf(j)]} ${JAL.fmt(jj)}${stInfo.aria}${j === tJdn ? " — امروز" : ""}"><span class="cxa-n">${fa(jj.jd)}${dot}</span></button>`;
  }
  const wds = JAL.WDS.map(function (w, i) { return `<span${i === 6 ? ' class="is-fri"' : ""}>${w}</span>`; }).join("");
  const hasData = !!(M && M.st.length);
  /* چیپ وضعیت «پریود بعدی» — از همان منطق هیرو
     تغییر ۱: حالت میانیِ نرم — دیرکرد در حد تحمل (lateDays ≤ lateTol، از نیمِ پراکندگی
     چرخه‌ها، ۲ تا ۷ روز) هشدار «پریود دیر شده» نمی‌گیرد؛ فقط «موعد تخمینی پریود گذشته».
     منطق late/lateDays/nextStart دست‌نخورده — فقط لحنِ برچسب نرم شده است. */
  let statusHtml = "";
  if (hasData) {
    const daysTo = M.nextStart - tJdn;
    statusHtml = M.late
      ? ((M.lateDays || 0) <= (M.lateTol || 2)
        ? `<div class="cxa-status"><i class="cxa-pulse"></i>موعد تخمینی پریود گذشته<span class="cxa-sep"></span><b>${fa(M.lateDays)} روز</b></div>`
        : `<div class="cxa-status is-late"><i class="cxa-pulse"></i>پریود دیر شده<span class="cxa-sep"></span><b>${fa(-daysTo)} روز از موعد گذشته</b></div>`)
      : `<div class="cxa-status"><i class="cxa-pulse"></i>پریود بعدی <b>${cxFmtShort(JAL.d2j(M.nextStart))}</b><span class="cxa-sep"></span>${daysTo === 0 ? "امروز (تخمینی)" : fa(daysTo) + " روز"}</div>`;
  }
  /* حلقهٔ کوچک «طول چرخه» — پیشرفت امروز در چرخه */
  let ringP = 0, ringLen = "—";
  if (hasData) {
    const dayN = Math.max(1, tJdn - M.cur.s + 1);
    ringP = Math.min(100, Math.round((dayN / M.cycleLen) * 100));
    ringLen = fa(M.cycleLen) + " روز";
  }
  /* جزئیات روز انتخاب‌شده (ستون کنار در دسکتاپ) */
  const selJ = JAL.keyToJ(CY.sel);
  const selJdn = JAL.keyToJdn(CY.sel);
  const selInfo = cxaDayState(M, selJdn, tJdn, !!startJdn[selJdn], !!spotJdn[selJdn]);
  let cycDay = null;
  if (hasData && M.st[0].jdn <= selJdn) {
    for (let i = 0; i < M.st.length; i++) {
      if (M.st[i].jdn <= selJdn) cycDay = selJdn - M.st[i].jdn + 1; else break;
    }
  }
  const selSub = cycDay ? " · روز " + fa(cycDay) + " چرخه" : (hasData ? "" : " · پیش از آغاز ثبت");
  const already = cyStarts().some(function (s) { return s.jdn === selJdn; });
  const hintMain = already
    ? "برای تغییر یا حذف، همین دکمه را بزن تا ثبت برداشته شود؛ سپس روز درست را انتخاب و دوباره ثبت کن."
    : "روی هر روز از تقویم بزن — حتی روزهای چند ماه پیش — و دکمهٔ «ثبت شروع» را بزن تا آن روز، روز اول پریود ثبت شود.";
  /* درخواست کارفرما: راهنمای ثبت علائم (مثل لکه‌بینی) از طریق دفترچهٔ علائم */
  const hint = hintMain + " برای ثبت علائمی مانند لکه‌بینی می‌توانی از «دفترچهٔ علائم من» استفاده کنی.";
  return `
  <div class="cxa-scope">
  <section class="cxa-card cxa-cal-card" aria-label="تقویم ماهانه چرخه" style="margin-top:16px">
    <div class="cxa-cal-head">
      <div class="cxa-cal-id">
        <span class="cxa-kicker"><i></i>تقویم چرخه</span>
        <div class="cxa-month"><b>${JAL.MONTHS[CY.m - 1]}</b><span>${fa(CY.y)}</span></div>
        ${statusHtml}
      </div>
      <div class="cxa-tools">
        <button type="button" class="cxa-iconbtn" data-cy="prevm" aria-label="ماه قبل">${CXA_IC.chevR}</button>
        <button type="button" class="cxa-today" data-cy="todaym">امروز</button>
        <button type="button" class="cxa-iconbtn" data-cy="nextm" aria-label="ماه بعد">${CXA_IC.chevL}</button>
      </div>
    </div>
    <div class="cxa-cal-body">
      <div class="cxa-cal-main">
        <div class="cxa-week" aria-hidden="true">${wds}</div>
        <div class="cxa-grid${CY.gridAnim ? " is-in" : ""}" role="grid" aria-label="روزهای ماه">${cells}</div>
        <div class="cxa-cal-under" role="group" aria-label="ثبت شروع پریود و تنظیم چرخه">
          ${cxaStartBtnHtml(M)}
          <div class="cxa-cycle"><span class="cxa-ring" style="--p:${ringP}" aria-hidden="true"></span><span><small>طول چرخه</small><b>${ringLen}</b></span></div>
          ${cxPeriodChipHtml(M)}
        </div>
        <p class="cxa-startbar-hint">${hint}</p>
      </div>
      <aside class="cxa-cal-side">
        <div class="cxa-detail">
          <div class="cxa-detail-main">
            <div class="cxa-dd">
              <b>${fa(selJ.jd)} ${JAL.MONTHS[selJ.jm - 1]} ${fa(selJ.jy)}</b>
              <span>${JAL.WD[JAL.colOf(selJdn)]}${selSub}</span>
            </div>
            <span class="cxa-state ${selInfo.cls}"><i></i>${selInfo.txt}</span>
          </div>
        </div>
        <div class="cxa-side-legend">
          <span class="cxa-side-label">راهنمای نشانه‌ها</span>
          <div class="cxa-legend" aria-label="راهنمای نشانه‌ها">
            <span class="cxa-lg"><i class="cxa-sw cxa-sw-per"></i>پریود</span>
            <span class="cxa-lg"><i class="cxa-sw cxa-sw-start"></i>روز شروع</span>
            <span class="cxa-lg"><i class="cxa-sw cxa-sw-pred"></i>پیش‌بینی</span>
            <span class="cxa-lg"><i class="cxa-sw cxa-sw-cont"></i>ادامهٔ تخمینی</span>
            <span class="cxa-lg"><i class="cxa-sw cxa-sw-fertile"></i>باروری</span>
            <span class="cxa-lg"><i class="cxa-sw cxa-sw-ov"></i>تخمک‌گذاری</span>
            <span class="cxa-lg"><i class="cxa-sw cxa-sw-log"></i>ثبت روزانه</span>
          </div>
        </div>
      </aside>
    </div>
    ${M && M.st.length && M.fertExtra > 0 ? `<p class="cx-fert-note" role="note">${I.info}<span>${cxFertNoteTxt(M)}</span></p>` : ""}
    ${M && M.st.length && M.cycleLen < CX_ADULT_LO ? `<p class="cx-fert-note cx-short-note" role="note">${I.flag}<span>طول چرخهٔ تخمینی تو ${fa(M.cycleLen)} روز است — کمتر از محدودهٔ معمول بزرگسالان (۲۱ تا ۳۵ روز، ACOG). چرخه‌های کوتاهِ مداوم در بزرگسالان نیاز به بررسی پزشکی دارند؛ برآورد تخمک‌گذاری و روزهای باروری در این چرخه‌ها بسیار نامطمئن است و نباید مبنای تصمیم قطعی باشد. در چرخه‌های خیلی کوتاه، پنجرهٔ باروری ممکن است با پریود هم‌پوشان شود یا از ۷ روز معمول کوتاه‌تر باشد؛ این بازه عمداً برای رسیدن به حداقل ۷ روز گسترش داده نمی‌شود.</span></p>` : ""}
    ${M && M.st.length && M.cycleLen > CX_ADULT_HI ? `<p class="cx-fert-note cx-long-note" role="note">${I.flag}<span>طول چرخهٔ تخمینی تو ${fa(M.cycleLen)} روز است — بیشتر از محدودهٔ معمول بزرگسالان (۲۱ تا ۳۵ روز، ACOG). چرخه‌های بلندِ مداوم در بزرگسالان نیاز به بررسی پزشکی دارند؛ برآورد تخمک‌گذاری و روزهای باروری در این چرخه‌ها نامطمئن‌تر است، زیرا در چرخه‌های بلند تخمک‌گذاری اغلب دیرتر از فرض استاندارد «حدود ۱۴ روز پیش از پریود بعدی» رخ می‌دهد و پنجرهٔ واقعی ممکن است جابه‌جا باشد. این عدم‌قطعیت شفاف حفظ می‌شود: طول چرخهٔ تو به‌صورت خودکار کوتاه یا بلند نمی‌شود و تخمین‌ها از میانگین ثبت‌شدهٔ خودت استفاده می‌کنند — با ثبت پریودهای بعدی، دقت تخمین‌ها بیشتر می‌شود.</span></p>` : ""}
  </section>
  </div>`;
}

/* ---------- برچسب/کلاس وضعیت یک روز (از مدل مشترک — فقط نمایش) ----------
   خروجی: cls برای خانهٔ تقویم و قرص جزئیات، txt برچسب فارسی، aria برای برچسب دسترسی. */
function cxaDayState(M, j, tJdn, isStart, isSpot) {
  const P = M && M.st.length ? cxPhaseOf(M, j, tJdn) : null;
  if (!P) return { cls: "is-none", txt: "بدون داده", aria: "" };
  /* وقتی موعد پریود گذشته، فازهای بعد از موعد دیگر قابل اتکا نیستند. */
  if (P.lateUnknown) return { cls: "is-none", txt: "پیش‌بینی متوقف شده", aria: " — پیش‌بینی فاز چرخه متوقف شده؛ موعد تخمینی پریود گذشته" }; /* تغییر ۱: لحن نرم */
  if (P.perPred) return { cls: "is-pred", txt: "پریود پیش‌بینی‌شده", aria: " — پریود پیش‌بینی‌شده" };
  if (P.perCont) return { cls: "is-cont", txt: "ادامهٔ تخمینی پریود جاری", aria: " — ادامهٔ تخمینی پریود جاری" };
  if (P.per && isStart) return { cls: "is-start", txt: "روز شروع پریود", aria: " — روز شروع پریود" };
  if (P.per) return { cls: "is-period", txt: "پریود", aria: " — پریود" };
  if (isSpot) return { cls: "is-spot", txt: "لکه‌بینی", aria: " — لکه‌بینی" };
  if (P.ov) return { cls: "is-ov", txt: "تخمک‌گذاری (تخمینی)", aria: " — روز تخمک‌گذاری (تخمینی)" };
  if (P.fert) return { cls: "is-fertile", txt: "پنجرهٔ باروری (تخمینی)", aria: " — پنجرهٔ باروری (تخمینی)" };
  if (P.lite) return { cls: "is-lite", txt: "فاز فولیکولی (تخمینی)", aria: " — فاز فولیکولی (تخمینی)" };
  const phName = CX_PH[P.p] ? CX_PH[P.p].n : "";
  const phCls = P.p === "mens" ? "is-period" : P.p === "foll" ? "is-lite" : P.p === "ovul" ? "is-fertile" : "is-luteal";
  return { cls: phCls, txt: phName, aria: phName ? " — فاز " + phName : "" };
}

/* ---------- دکمهٔ «ثبت شروع» (ستون کنار تقویم — سه حالت، منطق قدیمی دست‌نخورده) ---------- */
function cxaStartBtnHtml(M) {
  const selJdn = JAL.keyToJdn(CY.sel);
  const already = cyStarts().some(function (s) { return s.jdn === selJdn; });
  /* جابه‌جایی شروعِ نزدیک (کمتر از ۱۰ روز) ثبت واقعی را حذف می‌کند — فقط با تأیید دومرحله‌ای */
  const mvNear = !already && selJdn <= cyTodayJdn()
    ? cyStarts().find(function (s) { return Math.abs(s.jdn - selJdn) < 10; }) : null;
  const mvArmed = mvNear && CY.confMove && CY.confMove.key === mvNear.key && CY.confMove.jdn === selJdn;
  if (mvArmed) {
    return `<button type="button" class="cxa-btn is-armed" data-cy="mark-start" aria-label="انتقال روز اول پریود از ${JAL.fmt(JAL.keyToJ(mvNear.key))} به این روز — برای انجام دوباره بزنید">${CXA_IC.drop}<span>انتقال روز اول از ${cxFmtShort(JAL.keyToJ(mvNear.key))} — مطمئنی؟ دوباره بزن</span></button>`;
  }
  if (already) {
    return `<button type="button" class="cxa-btn is-done" data-cy="mark-start" aria-pressed="true">${CXA_IC.check}<span>روز شروع ثبت شده — برداشتن</span></button>`;
  }
  if (selJdn > cyTodayJdn()) {
    return `<button type="button" class="cxa-btn" data-cy="mark-start" disabled aria-disabled="true">${CXA_IC.drop}<span>ثبت شروع — روزهای آینده قابل ثبت نیست</span></button>`;
  }
  return `<button type="button" class="cxa-btn" data-cy="mark-start">${CXA_IC.drop}<span>ثبت شروع از ${cxFmtShort(JAL.keyToJ(CY.sel))}</span></button>`;
}

/* ---------- یادداشت عدم قطعیت پنجرهٔ باروری (بند ۳) — نمایش شفاف به کاربر ---------- */
function cxFertNoteTxt(M) {
  if (M.late) return "موعد تخمینی پریود گذشته است. رنگ‌بندی روزهای قبل از موعد، برآورد قبلی چرخه است؛ از موعد گذشته به بعد، پیش‌بینی چرخهٔ بعدی تا ثبت شروع واقعی پریود نمایش داده نمی‌شود.";
  const n = M.cur ? Math.max(0, M.cur.wt - M.cur.wf + 1) : M.fertBefore + M.fertAfter + 1;
  if (M.fertReason === "none")
    return "هنوز اطلاعات کافی ثبت نشده است؛ پنجرهٔ باروری به‌صورت گسترده و احتیاطی (حدود " + fa(n) + " روز) نمایش داده می‌شود و با ثبت پریودهای بعدی دقیق‌تر می‌شود.";
  if (M.fertReason === "thin")
    return "چرخه‌های ثبت‌شده هنوز کم است؛ بنابراین، پیش‌بینی زمان تخمک‌گذاری و پنجرهٔ باروری با عدم‌قطعیت بیشتری همراه است.";
  return "چون چرخه‌های اخیر تو نوسان داشته‌اند، پنجرهٔ باروری پهن‌تر (حدود " + fa(n) + " روز) و با احتیاط بیشتری نمایش داده می‌شود.";
}

/* ---------- دفترچهٔ علائم — جایگزین پنل قبلی ثبت علائم ----------
   رابط ثبت علائم حالا ماژول مستقل «دفترچهٔ علائم من» است (symptom-journal.js).
   نصب: گرهٔ پایدار #symJournal بیرون از #app — با هر render() جابه‌جا می‌شود،
   نه بازسازی (وضعیت صفحه/فرم/متن نیمه‌نوشته حفظ می‌ماند). اتصال داده از طریق
   symjournal-adapter.js (آداپتور رسمی INTEGRATION.md §۴) به cyDb مشترک است. */
/* ---------- راهنمای مراحل چرخه — آرتیفکت سبز (هم‌خانوادهٔ تقویم و نمودار الگو) ----------
   همان زبان طراحی cxa: کارت کاغذی با هالهٔ سبز، kicker نقطه‌دار، تیتر ۱۹px،
   تب‌های ظریف با نقطهٔ رنگ فاز (قاعدگی رز / فولیکولی سبز / تخمک‌گذاری فیروزه‌ای /
   لوتئال آبی) و ردیف‌های نعنایی با آیکون مربع‌گرد. استایل در cx-cycle-art.css §راهنما. */
function cxGuideHtml(M) {
  const tJdn = cyTodayJdn();
  const curP = M ? cxPhaseOf(M, tJdn, tJdn) : null;
  const curKey = M && M.late ? null : (curP ? curP.p : null);
  if (!CY.tab) CY.tab = curKey || "foll";
  const d = CX_PH[CY.tab];
  const tabs = CX_ORDER.map(function (p) {
    const now = curKey === p ? '<em>اکنون</em>' : "<em>&nbsp;</em>";
    return `<button type="button" class="cxa-ph-tab" role="tab" data-p="${p}" data-cy="tab" data-v="${p}" aria-selected="${CY.tab === p ? "true" : "false"}">${CX_PH[p].n}${now}</button>`;
  }).join("");
  return `
  <div class="cxa-scope">
  <section class="cxa-card cxa-ph-card" aria-label="راهنمای مراحل چرخه" style="margin-top:16px">
    <div class="cxa-chart-head">
      <div class="cxa-chart-title">
        <span class="cxa-kicker"><i></i>مراحل چرخه</span>
        <h2>بدنت در هر مرحله چه می‌کند</h2>
        <p>هر چرخه را در چهار مرحله بررسی می‌کنیم: قاعدگی، فولیکولی، تخمک‌گذاری و لوتئال</p>
      </div>
    </div>
    <div class="cxa-ph-tabs" role="tablist">${tabs}</div>
    <p class="cxa-ph-lead">${d.lead}</p>
    <div class="cxa-ph-grid">
      <div class="cxa-ph-row"><span class="cxa-ph-ic" aria-hidden="true">${I.dna}</span><div><b>در بدن</b><p>${d.hormone}</p></div></div>
      <div class="cxa-ph-row"><span class="cxa-ph-ic" aria-hidden="true">${I.heart}</span><div><b>حال‌وهوا</b><p>${d.mood}</p></div></div>
      <div class="cxa-ph-row"><span class="cxa-ph-ic" aria-hidden="true">${I.bowl}</span><div><b>تغذیه</b><p>${d.food}</p></div></div>
      <div class="cxa-ph-row"><span class="cxa-ph-ic" aria-hidden="true">${I.run}</span><div><b>حرکت</b><p>${d.move}</p></div></div>
    </div>
    <div class="cxa-ph-care"><span class="cxa-ph-ic" aria-hidden="true">${I.spark}</span><div><b>مراقبت</b><p>${d.care}</p></div></div>
  </section>
  </div>`;
}

/* ============================================================
   الگوی چرخه — بازطراحی آرتیفکت (cx-cycle-art)
   ------------------------------------------------------------
   نمودار با طیف سبز → فیروزه‌ای → آبی (کوتاه‌تر سبزتر، بلندتر آبی‌تر).
   SVG پس از درج در DOM و با عرض واقعی ظرف ساخته می‌شود (cxaChartAfterRender).
   هر پاره‌خط گرادیان خودش را از رنگ دو سر می‌گیرد؛ ناحیهٔ زیر خط با ماسک محو
   می‌شود؛ تولتیپ شیشه‌ای تیره با hover/focus/لمس؛ رسم تدریجی فقط بار اول.
   فاصله‌های بیرون از بازهٔ ۱۵ تا ۹۰ روز: نقطهٔ توخالی خط‌چین + کنارگذاری از میانگین.
   ============================================================ */

/* ---------- آیکون‌های خطی ظریف نمودار (۱۲–۱۷px) ---------- */
const CXA_IC = {
  chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6.5 15.5 12l-6 5.5"/></svg>',
  chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 6.5 8.5 12l6 5.5"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.4c-3.1 4-6 6.9-6 10.2a6 6 0 0 0 12 0c0-3.3-2.9-6.2-6-10.2Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5.5 12.5 4.2 4.2 8.8-9.4"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 16.5 9 11l3.4 3.4L20 7"/><path d="M15 7h5v5"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="3"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/></svg>',
  wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 14c2.2 0 2.2-4 4.4-4s2.2 4 4.4 4 2.2-4 4.4-4 2.2 4 4.4 4"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4c.7 3.6 2.4 5.3 6 6-3.6.7-5.3 2.4-6 6-.7-3.6-2.4-5.3-6-6 3.6-.7 5.3-2.4 6-6Z"/></svg>',
  hist: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
};

/* ---------- طیف رنگ طول چرخه: کمتر از ۲۴ سبزترین، بیشتر از ۳۲ آبی‌ترین ---------- */
const CXA_STOPS = [
  [24, [52, 199, 127]],
  [26, [47, 201, 140]],
  [28, [47, 185, 206]],
  [30, [63, 146, 242]],
  [32, [95, 107, 234]]
];
const CXA_OUT_COL = "#a98ba0"; /* فاصلهٔ بیرون از بازهٔ ۱۵ تا ۹۰ روز — خاکستری آلویی خنثی */
function cxaColorFor(v) {
  if (v <= CXA_STOPS[0][0]) return "rgb(52,199,127)";
  if (v >= CXA_STOPS[CXA_STOPS.length - 1][0]) return "rgb(95,107,234)";
  for (let i = 0; i < CXA_STOPS.length - 1; i++) {
    const a = CXA_STOPS[i], b = CXA_STOPS[i + 1];
    if (v >= a[0] && v <= b[0]) {
      const t = (v - a[0]) / (b[0] - a[0]);
      const c = a[1].map(function (x, k) { return Math.round(x + (b[1][k] - x) * t); });
      return "rgb(" + c.join(",") + ")";
    }
  }
  return "rgb(47,184,206)";
}

/* ---------- منحنی نرم (Catmull-Rom → بزیه) ---------- */
function cxaSmooth(pts) {
  if (pts.length < 2) return "";
  let dStr = "M" + pts[0].x.toFixed(1) + " " + pts[0].y.toFixed(1);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    dStr += " C" + (p1.x + (p2.x - p0.x) / 6).toFixed(1) + " " + (p1.y + (p2.y - p0.y) / 6).toFixed(1) +
      " " + (p2.x - (p3.x - p1.x) / 6).toFixed(1) + " " + (p2.y - (p3.y - p1.y) / 6).toFixed(1) +
      " " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
  }
  return dStr;
}
function cxaSegPath(pts, i) {
  const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
  return "M" + p1.x.toFixed(1) + " " + p1.y.toFixed(1) +
    " C" + (p1.x + (p2.x - p0.x) / 6).toFixed(1) + " " + (p1.y + (p2.y - p0.y) / 6).toFixed(1) +
    " " + (p2.x - (p3.x - p1.x) / 6).toFixed(1) + " " + (p2.y - (p3.y - p1.y) / 6).toFixed(1) +
    " " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
}

/* ---------- دادهٔ نمودار (از مدل مشترک — بدون محاسبهٔ موازی) ---------- */
function cxaChartData(M) {
  const d = M.diffs.slice(-6);
  const st = M.st.slice(-(d.length + 1));
  const inR = function (v) { return v >= CX_MIN_IV && v <= CX_MAX_IV; };
  return {
    d: d, st: st, inR: inR, avg: M.cycleLen,
    pts: d.map(function (len, i) { return { len: len, from: st[i].jdn, to: st[i + 1].jdn, ok: inR(len), i: i }; }),
    valid: d.filter(inR)
  };
}
let cxaRO = null, cxaDrawn = false, cxaGeom = null;
function cxaChartTeardown() { if (cxaRO) { cxaRO.disconnect(); cxaRO = null; } }

/* ---------- هندسهٔ SVG — زمان از راست (قدیم‌ترین) به چپ (تازه‌ترین) ---------- */
function cxaChartSvg(W, data) {
  const pts = data.pts, n = pts.length;
  const H = W < 390 ? 218 : 258;
  const padR = 44, padL = 18, padT = 30, padB = 42;
  const plotR = W - padR, plotL = padL, plotB = H - padB, plotT = padT;
  /* محور روز: پایه ۲۰ تا ۳۶ (باند ۲۱–۳۵ داخلش دیده می‌شود)؛ با دادهٔ بزرگ‌تر تا ۴۶ گسترش
     می‌یابد و فاصله‌های بیرون از بازه روی سقف رسم و توخالی نشان داده می‌شوند. */
  const vMax = data.valid.length ? Math.max.apply(null, data.valid) : 0;
  const vMin = data.valid.length ? Math.min.apply(null, data.valid) : 28;
  const scaleMax = Math.max(36, Math.min(46, (vMax || 36) + 3));
  const yMin = Math.min(20, vMin - 2);
  const step = n > 1 ? (plotR - plotL) / (n - 1) : 0;
  const xOf = function (i) { return n > 1 ? plotR - i * step : (plotR + plotL) / 2; };
  const yOf = function (v) {
    const cv = Math.max(yMin, Math.min(scaleMax, v));
    return plotB - ((cv - yMin) / (scaleMax - yMin)) * (plotB - plotT);
  };
  const xy = pts.map(function (p, i) {
    return { x: xOf(i), y: yOf(p.len), len: p.len, i: i, ok: p.ok, from: p.from, to: p.to,
      color: p.ok ? cxaColorFor(p.len) : CXA_OUT_COL };
  });
  cxaGeom = { W: W, H: H, xs: xy.map(function (p) { return p.x; }), ys: xy.map(function (p) { return p.y; }) };

  /* شبکهٔ نقطه‌چین + محور روزها (سمت راست، هم‌سو با RTL) */
  let grid = "";
  [20, 24, 28, 32, 36, 40, 44].forEach(function (v) {
    if (v > scaleMax || v < yMin) return;
    const gy = yOf(v).toFixed(1);
    grid += '<line class="cxa-gridline" x1="' + plotL + '" y1="' + gy + '" x2="' + plotR + '" y2="' + gy + '"/>';
    grid += '<text class="cxa-axis' + (v === 28 ? " is-strong" : "") + '" x="' + (W - 6) + '" y="' + (yOf(v) + 3).toFixed(1) + '" text-anchor="end">' + fa(v) + "</text>";
  });
  grid += '<text class="cxa-axis is-strong" x="' + (W - 6) + '" y="12" text-anchor="end">روز</text>';

  /* نوار محدودهٔ معمول ACOG: ۲۱ تا ۳۵ روز */
  const bandTop = yOf(CX_ADULT_HI), bandBot = yOf(CX_ADULT_LO);
  const band = '<rect class="cxa-band" x="' + plotL + '" y="' + bandTop.toFixed(1) +
    '" width="' + (plotR - plotL) + '" height="' + (bandBot - bandTop).toFixed(1) + '" rx="9"/>' +
    '<line class="cxa-band-edge" x1="' + plotL + '" y1="' + bandTop.toFixed(1) + '" x2="' + plotR + '" y2="' + bandTop.toFixed(1) + '"/>' +
    '<line class="cxa-band-edge" x1="' + plotL + '" y1="' + bandBot.toFixed(1) + '" x2="' + plotR + '" y2="' + bandBot.toFixed(1) + '"/>';

  /* خط میانگین (خط‌چین) */
  const avgY = yOf(data.avg).toFixed(1);
  const avg = n > 1 ? '<line class="cxa-avgline" x1="' + plotL + '" y1="' + avgY + '" x2="' + plotR + '" y2="' + avgY + '"/>' : "";

  /* ناحیهٔ زیر خط — فقط قطعه‌های پیوستهٔ معتبر، با ماسک محو به پایین */
  let areaD = "", r = [];
  const flushArea = function () {
    if (r.length >= 2) areaD += cxaSmooth(r) + " L" + r[r.length - 1].x.toFixed(1) + " " + plotB + " L" + r[0].x.toFixed(1) + " " + plotB + " Z ";
    r = [];
  };
  xy.forEach(function (p) { if (p.ok) r.push(p); else flushArea(); });
  flushArea();

  /* خط و هاله — هر قطعه گرادیان خودش را از رنگ دو سر می‌گیرد */
  let defs = '<linearGradient id="cxaArea" x1="1" y1="0" x2="0" y2="0">' +
    '<stop offset="0" stop-color="#43cfaa" stop-opacity=".30"/>' +
    '<stop offset=".52" stop-color="#2fb8d8" stop-opacity=".22"/>' +
    '<stop offset="1" stop-color="#5b74e9" stop-opacity=".16"/></linearGradient>' +
    '<linearGradient id="cxaAreaFade" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#fff" stop-opacity="1"/>' +
    '<stop offset=".72" stop-color="#fff" stop-opacity=".28"/>' +
    '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<mask id="cxaAreaMask" maskUnits="userSpaceOnUse" x="' + plotL + '" y="' + plotT +
    '" width="' + (plotR - plotL) + '" height="' + (plotB - plotT) + '">' +
    '<rect x="' + plotL + '" y="' + plotT + '" width="' + (plotR - plotL) +
    '" height="' + (plotB - plotT) + '" fill="url(#cxaAreaFade)"/></mask>' +
    '<linearGradient id="cxaBand" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#43cfaa" stop-opacity=".075"/>' +
    '<stop offset="1" stop-color="#2fb8d8" stop-opacity=".045"/></linearGradient>';
  let halo = "", line = "", dashed = "";
  for (let i = 0; i < n - 1; i++) {
    if (xy[i].ok && xy[i + 1].ok) {
      defs += '<linearGradient id="cxaSeg' + i + '" gradientUnits="userSpaceOnUse" x1="' +
        xy[i].x.toFixed(1) + '" y1="0" x2="' + xy[i + 1].x.toFixed(1) + '" y2="0">' +
        '<stop offset="0" stop-color="' + xy[i].color + '"/>' +
        '<stop offset="1" stop-color="' + xy[i + 1].color + '"/></linearGradient>';
      const dd = cxaSegPath(xy, i);
      halo += '<path class="cxa-halo" d="' + dd + '" stroke="url(#cxaSeg' + i + ')" stroke-width="8"/>';
      line += '<path class="cxa-line" d="' + dd + '" stroke="url(#cxaSeg' + i + ')" stroke-width="2.8" pathLength="1"/>';
    } else {
      dashed += '<line x1="' + xy[i].x.toFixed(1) + '" y1="' + xy[i].y.toFixed(1) + '" x2="' +
        xy[i + 1].x.toFixed(1) + '" y2="' + xy[i + 1].y.toFixed(1) + '" stroke="#c3aec0" stroke-width="2" stroke-dasharray="4 5" stroke-linecap="round" opacity=".85"/>';
    }
  }

  /* نقطه‌ها + عدد طول هر چرخه */
  let dots = "", labels = "";
  xy.forEach(function (p) {
    const isLast = p.i === n - 1;
    const r2 = isLast ? 5.6 : 4.7;
    dots += '<g class="cxa-pt' + (p.ok ? "" : " cxa-pt-out") + '" data-i="' + p.i + '" tabindex="0" role="button" aria-label="' +
      esc("از " + JAL.fmt(JAL.d2j(p.from)) + " تا " + JAL.fmt(JAL.d2j(p.to)) + ": " + fa(p.len) + " روز" + (p.ok ? "" : " — بیرون از بازهٔ ۱۵ تا ۹۰ روز؛ در میانگین حساب نشده")) +
      '" style="--i:' + p.i + '">' +
      '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="13" fill="transparent"/>' +
      (p.ok ? '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="8.5" fill="' + p.color + '" opacity=".12"/>' : "") +
      (isLast && p.ok ? '<circle class="cxa-pulse-ring" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="8"/>' : "") +
      '<circle class="cxa-dot" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + r2 +
      '" fill="' + (p.ok ? p.color : "#ffffff") + '" stroke="' + (p.ok ? "#ffffff" : CXA_OUT_COL) +
      '" stroke-width="' + (p.ok ? 2 : 1.6) + '"' + (p.ok ? "" : ' stroke-dasharray="3 2.5"') + "/></g>";
    labels += '<text class="cxa-pt-label' + (isLast ? " is-last" : "") + (p.ok ? "" : " is-out") +
      '" x="' + p.x.toFixed(1) + '" y="' + (p.y - 12).toFixed(1) + '" text-anchor="middle">' + fa(p.len) + "</text>";
  });

  /* تاریخ شروع هر چرخه زیر نقطه */
  let xlabs = "";
  xy.forEach(function (p) {
    const j = JAL.d2j(p.from);
    xlabs += '<text class="cxa-xlabel' + (p.i === n - 1 ? " is-last" : "") + '" x="' + p.x.toFixed(1) +
      '" y="' + (plotB + 20) + '" text-anchor="middle">' + fa(j.jd) + " " + JAL.MONTHS[j.jm - 1] + "</text>";
  });

  const guide = '<line class="cxa-guide" x1="0" y1="' + plotT + '" x2="0" y2="' + plotB + '"/>';
  const areaHtml = areaD ? '<path class="cxa-area" d="' + areaD + '" fill="url(#cxaArea)" mask="url(#cxaAreaMask)"/>' : "";
  const outCnt = pts.filter(function (p) { return !p.ok; }).length;

  return '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H +
    '" role="img" aria-label="نمودار الگوی چرخه: طول ' + fa(n) + " چرخهٔ اخیر؛ رنگ هر نقطه از سبز (کوتاه‌تر) تا آبی (بلندتر)." +
    (outCnt ? " نقطه‌های توخالی بیرون از بازهٔ ۱۵ تا ۹۰ روزند و در میانگین حساب نمی‌شوند." : "") + '" ' +
    'class="' + (cxaDrawn ? "is-static" : "") + '">' +
    "<defs>" + defs + "</defs>" + band + grid + avg + areaHtml + guide + halo + line + dashed + dots + labels + xlabs + "</svg>";
}

/* ---------- تولتیپ شیشه‌ای + اتصال نقطه‌ها ---------- */
function cxaHideTip() {
  const tip = document.getElementById("cxaTip");
  if (tip) tip.classList.remove("is-on");
  document.querySelectorAll(".cxa-pt.is-active").forEach(function (g) { g.classList.remove("is-active"); });
  document.querySelectorAll(".cxa-guide.is-on").forEach(function (l) { l.classList.remove("is-on"); });
}
function cxaShowTip(host, i) {
  const tip = document.getElementById("cxaTip");
  if (!tip || !cxaGeom || !host) return;
  const data = host._cxaData;
  const p = data && data.pts[i];
  if (!p) return;
  const x = cxaGeom.xs[i], y = cxaGeom.ys[i];
  const prev = i > 0 ? data.pts[i - 1] : null;
  const diff = prev ? p.len - prev.len : null;
  const diffTxt = prev === null ? "نخستین چرخهٔ این بازه"
    : diff > 0 ? fa(diff) + " روز بیشتر از چرخهٔ قبل"
    : diff < 0 ? fa(-diff) + " روز کمتر از چرخهٔ قبل"
    : "هم‌اندازهٔ چرخهٔ قبل";
  const col = p.ok ? cxaColorFor(p.len) : CXA_OUT_COL;
  tip.innerHTML =
    '<span class="cxa-tip-dates">از ' + JAL.fmt(JAL.d2j(p.from)) + " تا " + JAL.fmt(JAL.d2j(p.to)) + "</span>" +
    '<span class="cxa-tip-main"><i class="cxa-tip-dot" style="background:' + col + '"></i><b>' + fa(p.len) + " روز</b></span>" +
    '<span class="cxa-tip-sub' + (p.ok ? "" : " is-warn") + '">' + (p.ok ? "" : "بیرون از بازهٔ ۱۵ تا ۹۰ روز؛ در میانگین حساب نشده — ") + diffTxt + "</span>";
  tip.style.left = x + "px";
  tip.style.top = y + "px";
  tip.classList.add("is-on");
  const act = host.querySelector(".cxa-pt.is-active");
  if (act) act.classList.remove("is-active");
  const g = host.querySelector('.cxa-pt[data-i="' + i + '"]');
  if (g) g.classList.add("is-active");
  const guide = host.querySelector(".cxa-guide");
  if (guide) {
    guide.setAttribute("x1", x.toFixed(1));
    guide.setAttribute("x2", x.toFixed(1));
    guide.classList.add("is-on");
  }
  requestAnimationFrame(function () {
    const tw = tip.offsetWidth || 150;
    const left = Math.min(Math.max(x, tw / 2 + 4), cxaGeom.W - tw / 2 - 4);
    tip.style.left = left + "px";
  });
}
function cxaBindPoints(host) {
  host.querySelectorAll(".cxa-pt").forEach(function (g) {
    const i = +g.getAttribute("data-i");
    const show = function () { cxaShowTip(host, i); };
    g.addEventListener("mouseenter", show);
    g.addEventListener("focus", show);
    g.addEventListener("mouseleave", cxaHideTip);
    g.addEventListener("blur", cxaHideTip);
    g.addEventListener("click", function (e) {
      e.preventDefault();
      if (g.classList.contains("is-active")) cxaHideTip(); else show();
    });
  });
}

/* ---------- ساخت نمودار پس از رندر (عرض واقعی ظرف) + ResizeObserver ---------- */
function cxaChartAfterRender() {
  cxaChartTeardown();
  const host = document.getElementById("cxaChart");
  if (!host) return;
  const M = cxModel();
  if (!M || M.diffs.length < 1) return;
  const data = cxaChartData(M);
  host._cxaData = data;
  const draw = function () {
    const W = Math.max(280, Math.round(host.clientWidth || 600));
    if (!W) return;
    host.innerHTML = cxaChartSvg(W, data);
    cxaBindPoints(host);
    cxaDrawn = true; /* رندرهای بعدی بدون انیمیشن رسم — کلاس is-static */
  };
  draw();
  if (window.ResizeObserver) {
    let lastW = Math.round(host.clientWidth || 0);
    cxaRO = new ResizeObserver(function (entries) {
      const w = Math.round(entries[0].contentRect.width);
      if (Math.abs(w - lastW) < 2) return;
      lastW = w;
      draw();
    });
    cxaRO.observe(host);
  }
}

function cxHistHtml(M) {
  const head = `
    <div class="cxa-chart-head">
      <div class="cxa-chart-title">
        <span class="cxa-kicker"><i class="is-blue"></i>الگوی چرخه</span>
        <h2>نوسان چرخه، در یک نگاه</h2>
        <p>طول هر چرخه از روز اول پریود تا روز اول پریود بعدی${M && M.diffs.length ? " · " + fa(Math.min(6, M.diffs.length)) + " چرخهٔ اخیر" : ""}</p>
      </div>
      ${M && M.diffs.length ? `<div class="cxa-avg"><span class="cxa-avg-ic" aria-hidden="true">${CXA_IC.trend}</span><span><small>میانگین</small><b>${fa(M.cycleLen)} روز</b></span></div>` : ""}
    </div>`;
  if (!M || M.diffs.length < 1) {
    return `
  <div class="cxa-scope">
  <section class="cxa-card cxa-chart-card" aria-label="الگوی چرخه" style="margin-top:16px">
    ${head}
    <div class="cxa-empty">بعد از ثبت دومین پریود، الگوی چرخه‌ات اینجا دیده می‌شود.</div>
  </section>
  </div>`;
  }
  const data = cxaChartData(M);
  const outIdx = [];
  data.pts.forEach(function (p) { if (!p.ok) outIdx.push(p.i); });
  const mn = data.valid.length ? Math.min.apply(null, data.valid) : null;
  const mx = data.valid.length ? Math.max.apply(null, data.valid) : null;
  const aria = `نمودار الگوی چرخه؛ طول هر چرخه از روز اول یک پریود تا روز اول پریود بعدی، از راست (قدیم‌ترین چرخه) به چپ (تازه‌ترین). رنگ هر نقطه به طول همان چرخه بستگی دارد: کوتاه‌تر سبزتر و بلندتر آبی‌تر. ${fa(data.d.length)} چرخهٔ اخیر رسم شده: ${data.d.map(function (v) { return fa(v) + " روز"; }).join("، ")}. ${outIdx.length ? "نقطه‌های توخالیِ خط‌چین بیرون از بازهٔ ۱۵ تا ۹۰ روز هستند و در میانگین حساب نمی‌شوند. " : ""}این نمودار تشخیص پزشکی نیست.`;
  const top = cxTopSymptoms(cyDb.days, 4);
  const outNote = outIdx.length
    ? outIdx.map(function (i) {
        return "فاصلهٔ " + fa(data.d[i]) + " روزه (از " + JAL.fmt(JAL.d2j(data.st[i].jdn)) + " تا " + JAL.fmt(JAL.d2j(data.st[i + 1].jdn)) + ")";
      }).join("؛ ")
      + " کمتر از ۱۵ یا بیشتر از ۹۰ روز است و در میانگین و نوسان معمول حساب نشده است."
      + (data.valid.length ? "" : " هیچ فاصلهٔ معتبری وجود ندارد؛ طول چرخه روی پیش‌فرض " + fa(CX_DEFAULT_CYCLE) + " روز است.")
    : "";
  const provTxt = M.cycleLenSrc === "manual"
    ? "طول چرخه به‌صورت دستی تنظیم شده است."
    : (M.cycleLenSrc === "default"
      ? "طول چرخه روی پیش‌فرض " + fa(CX_DEFAULT_CYCLE) + " روز است (فاصلهٔ معتبری برای میانگین وجود ندارد)."
      : "طول چرخه از میانگین " + fa(M.used.length) + " فاصلهٔ معتبر (۱۵ تا ۹۰ روز) محاسبه شده است.");
  /* آمار — «نوسان» فقط بین فاصله‌های ۱۵ تا ۹۰ روزه محاسبه می‌شود */
  const stats = [
    { icon: CXA_IC.trend, cls: "is-mint", label: "میانگین چرخه", value: fa(M.cycleLen), unit: "روز" },
    { icon: CXA_IC.cal, cls: "is-aqua", label: "کوتاه‌ترین", value: mn === null ? "—" : fa(mn), unit: mn === null ? "" : "روز" },
    { icon: CXA_IC.spark, cls: "is-sky", label: "بلندترین", value: mx === null ? "—" : fa(mx), unit: mx === null ? "" : "روز" },
    { icon: CXA_IC.wave, cls: "is-blue", label: "نوسان فاصله‌های معتبر", value: mn === null ? "—" : fa(mx - mn), unit: mn === null ? "" : "روز" }
  ];
  /* تاریخچهٔ کامل — حالا در یک پنجرهٔ جدا باز می‌شود (درخواست کاربر) */
  const histBtn = `<button type="button" class="cx-histbtn" data-cy="histall" aria-haspopup="dialog">${CXA_IC.hist}تاریخچهٔ الگو (${fa(M.diffs.length)} چرخه)</button>`;
  return `
  <div class="cxa-scope">
  <section class="cxa-card cxa-chart-card" aria-label="الگوی چرخه" style="margin-top:16px">
    ${head}
    <div class="cxa-chart-wrap">
      <div class="cxa-chart" id="cxaChart" role="img" aria-label="${esc(aria)}"></div>
      <div class="cxa-tip" id="cxaTip" role="status" aria-live="polite"></div>
    </div>
    <div class="cxa-chart-key">
      <span><i class="cxa-key" aria-hidden="true"></i>میانگین ${fa(M.cycleLen)} روز</span>
      <span><i class="cxa-key cxa-key-band" aria-hidden="true"></i>محدودهٔ معمول ${fa(CX_ADULT_LO)} تا ${fa(CX_ADULT_HI)}</span>
      <span>مدت پریود: ${fa(M.periodLen)} روز</span>
    </div>
    <div class="cxa-stats">${stats.map(function (s) {
      return '<div class="cxa-stat"><span class="cxa-stat-ic ' + s.cls + '">' + s.icon + "</span><span><small>" + s.label + "</small><b>" + s.value + (s.unit ? "<em>" + s.unit + "</em>" : "") + "</b></span></div>";
    }).join("")}</div>
    <div class="cxa-scale" aria-hidden="true"><span>بلندتر</span><i></i><span>کوتاه‌تر</span></div>
    <p class="cxa-hint">تاریخ‌ها، روز شروع هر چرخه‌اند. رنگ هر نقطه از سبز (کوتاه‌تر) تا آبی (بلندتر) تغییر می‌کند.${outIdx.length ? " نقاط توخالی خط‌چین بیرون از بازهٔ ۱۵ تا ۹۰ روزند و در میانگین حساب نمی‌شوند." : ""}</p>
    <p class="cxa-note">${CXA_IC.info}<span><b>محدودهٔ معمول:</b> ${fa(CX_ADULT_LO)} تا ${fa(CX_ADULT_HI)} روز بر اساس ACOG. نوسان چندروزه طبیعی است و این نمودار جای تشخیص پزشکی نیست.</span></p>
    <p class="cx-hint cx-prov">${provTxt} «نوسان» فقط بین فاصله‌های ۱۵ تا ۹۰ روزه محاسبه می‌شود.</p>
    ${outNote ? `<p class="cx-hint cx-outnote">${outNote}</p>` : ""}
    ${histBtn}
    ${top.length ? `<div class="cx-sympat"><b>علائمی که بیشتر ثبت کرده‌ای</b><div class="cx-chips">${top.map(function (s) {
      return `<span class="cx-tag cx-t-lut">${CY_SYMPTOM_L[s.k] || s.k} · ${fa(s.n)} بار</span>`;
    }).join("")}</div></div>` : ""}
  </section>
  </div>`;
}

/* ============================================================
   پنجرهٔ جدا «تاریخچهٔ الگو» (درخواست کاربر):
   دکمهٔ «تاریخچهٔ الگو» در کارت الگوی چرخه، یک پنجرهٔ مودال باز می‌کند؛
   بستن با دکمهٔ «بستن»، کلیک روی پس‌زمینه یا کلید Esc.
   ============================================================ */
function cxHistWinHtml(M) {
  if (!M || M.diffs.length < 1) return "";
  const data = cxaChartData(M);
  let rows = "";
  for (let i = M.diffs.length - 1; i >= 0; i -= 1) {
    const v = M.diffs[i], out = !data.inR(v);
    rows += `<div class="cxa-hwin-row${out ? " is-out" : ""}" role="listitem">
      <i style="background:${out ? "#c3aec0" : cxaColorFor(v)}" aria-hidden="true"></i>
      <span>از ${JAL.fmt(JAL.d2j(M.st[i].jdn))} تا ${JAL.fmt(JAL.d2j(M.st[i + 1].jdn))}</span>
      <b>${fa(v)} روز${out ? " · حساب‌نشده" : ""}</b>
    </div>`;
  }
  return `
  <div class="cxa-hwin" id="cx-hwin">
    <div class="cxa-hwin-back" data-cy="hwin-back" aria-hidden="true"></div>
    <div class="cxa-hwin-card" role="dialog" aria-modal="true" aria-label="تاریخچهٔ الگو">
      <div class="cxa-hwin-top">
        <button type="button" class="cxa-hwin-close" data-cy="hwin-close">بستن ${CXA_IC.x}</button>
        <div class="cxa-chart-title">
          <span class="cxa-kicker"><i class="is-blue"></i>الگوی چرخه</span>
          <h2>تاریخچهٔ الگو</h2>
          <p>همهٔ ${fa(M.diffs.length)} چرخهٔ ثبت‌شده — تازه‌ترین در بالا</p>
        </div>
      </div>
      <div class="cxa-hwin-list" role="list" aria-label="تاریخچهٔ کامل طول چرخه‌ها">${rows}</div>
      <p class="cxa-hwin-note">${CXA_IC.info}<span>فاصله‌های کمتر از ۱۵ یا بیشتر از ۹۰ روز در میانگین و نوسان حساب نمی‌شوند. تاریخ‌ها، روز شروع هر چرخه‌اند.</span></p>
    </div>
  </div>`;
}

/* ============================================================
   کارت‌های دانش — دو عنوانِ جمع‌شونده کنار هم (درخواست کاربر):
   «چند نکتهٔ معتبر» (راست) و «چه زمانی با پزشک یا ماما صحبت کنیم؟» (چپ).
   نکته‌ها: استخر مشترک، هر هفته ۴ نکته با چرخش قطعی آفلاین
   (week = floor(شمارهٔ روز ژولین / 7)) — در یک هفته ثابت، هفتهٔ بعد تازه.
   برای افزودن نکتهٔ تازه فقط یک شیء به CX_TIPS_POOL اضافه کن:
   { ph: "فاز یا علمی", cat: "دسته", t: "عنوان کوتاه", x: "متن نکته" }
   ============================================================ */
const CX_TIPS_POOL = [
  /* قاعدگی */
  { ph: "قاعدگی", cat: "در بدن", t: "افت هورمون‌ها و گرفتگی طبیعی است", x: "در شروع قاعدگی، سطح استروژن و پروژسترون پایین است. پروستاگلاندین‌ها باعث انقباض رحم می‌شوند و ممکن است گرفتگی ایجاد کنند." },
  { ph: "قاعدگی", cat: "حال‌وهوا", t: "استراحت بیشتر عادی است", x: "ممکن است خسته‌تر، آرام‌تر یا درون‌گراتر باشی. نیاز به استراحت بیشتر برای بعضی افراد طبیعی است و تجربهٔ هر فرد می‌تواند متفاوت باشد." },
  { ph: "قاعدگی", cat: "تغذیه", t: "آهن را با ویتامین C بخور", x: "غذاهای حاوی آهن مثل گوشت قرمز، عدس و سبزی‌های برگ‌تیره را در برنامه‌ات بگنجان. همراه‌کردن منابع گیاهی آهن با ویتامین C، مانند لیمو، پرتقال یا فلفل دلمه‌ای، به جذب بهتر آهن کمک می‌کند. آب و نوشیدنی گرم هم می‌تواند حس راحتی بیشتری ایجاد کند." },
  { ph: "قاعدگی", cat: "حرکت", t: "حرکت سبک، حال بهتر", x: "پیاده‌روی سبک، حرکات کششی و یوگای ملایم را امتحان کن. اگر احساس خوبی داری، ادامهٔ تمرین معمولت هم اشکالی ندارد." },
  { ph: "قاعدگی", cat: "مراقبت", t: "گرما و خواب کافی", x: "کیسهٔ آب گرم را با یک لایه پارچه روی شکمت بگذار و به خواب کافی اهمیت بده. اگر درد آن‌قدر شدید است که فعالیت‌های روزانه‌ات را مختل می‌کند، آن را با پزشک در میان بگذار." },
  /* فولیکولی */
  { ph: "فولیکولی", cat: "در بدن", t: "استروژن در حال بازگشت", x: "هورمون FSH رشد فولیکول‌های تخمدان را تحریک می‌کند. با رشد فولیکول غالب، استروژن افزایش می‌یابد و به بازسازی و ضخیم‌شدن پوشش داخلی رحم کمک می‌کند." },
  { ph: "فولیکولی", cat: "حال‌وهوا", t: "زمان کارهای تازه", x: "ممکن است انرژی، تمرکز یا خوش‌بینی بیشتری احساس کنی. اگر چنین تغییری را تجربه می‌کنی، می‌توانی از آن برای پیشبرد کارها و شروع فعالیت‌های تازه بهره ببری." },
  { ph: "فولیکولی", cat: "تغذیه", t: "ذخیرهٔ آهن را جدی بگیر", x: "پروتئین کافی، میوه و سبزی تازه و غلات کامل را در برنامه‌ات بگنجان. اگر خون‌ریزی قاعدگی‌ات زیاد بوده، به دریافت آهن کافی توجه کن." },
  { ph: "فولیکولی", cat: "حرکت", t: "تمرین قدرتی در اوج انرژی", x: "اگر انرژی و حال عمومی‌ات مناسب است، تمرین قدرتی یا ورزش‌های پرتحرک را امتحان کن. شدت تمرین را با آمادگی و احساس بدنت هماهنگ کن." },
  { ph: "فولیکولی", cat: "مراقبت", t: "الگوی انرژی‌ات را بشناس", x: "به تغییرات انرژی و تمرکزت توجه کن و ببین در چرخه‌های مختلف چه الگویی برای خودت تکرار می‌شود. لازم نیست هر ماه احساس یا عملکرد یکسانی داشته باشی." },
  /* تخمک‌گذاری */
  { ph: "تخمک‌گذاری", cat: "در بدن", t: "جهش LH و ترشحات کش‌دار", x: "استروژن پیش از تخمک‌گذاری به سطح بالایی می‌رسد و جهش هورمون LH فرایند آزادشدن تخمک را تحریک می‌کند. ترشحات دهانهٔ رحم ممکن است شفاف، لغزنده و کش‌دار شوند." },
  { ph: "تخمک‌گذاری", cat: "حال‌وهوا", t: "انرژی اجتماعی بیشتر", x: "ممکن است انرژی، معاشرت‌پذیری یا میل جنسی بیشتری احساس کنی. بعضی افراد نیز درد خفیف و یک‌طرفه در پایین شکم را تجربه می‌کنند." },
  { ph: "تخمک‌گذاری", cat: "تغذیه", t: "آب و فیبر فراموش نشود", x: "آب کافی، سبزی‌های رنگارنگ، میوه‌ها و غذاهای سرشار از فیبر را در برنامه‌ات بگنجان. اگر بعضی غذاها باعث نفخ می‌شوند، مصرفشان را متناسب با تحمل بدنت تنظیم کن." },
  { ph: "تخمک‌گذاری", cat: "حرکت", t: "شدت را با بدنت تنظیم کن", x: "اگر احساس خوبی داری، تمرین قدرتی یا ورزش پرتحرک را انجام بده. شدت تمرین را بر اساس آمادگی و احساس خودت تنظیم کن؛ لازم نیست در این مرحله حتماً شدیدتر ورزش کنی." },
  { ph: "تخمک‌گذاری", cat: "مراقبت", t: "زمان تخمک‌گذاری ثابت نیست", x: "زمان تخمک‌گذاری ممکن است از یک چرخه به چرخهٔ دیگر تغییر کند. تاریخ قاعدگی و تغییرات ترشحاتت را ثبت کن تا به‌مرور الگوی بدنت را بهتر بشناسی." },
  /* لوتئال */
  { ph: "لوتئال", cat: "در بدن", t: "اوج پروژسترون", x: "پروژسترون در میانهٔ این مرحله به اوج می‌رسد. دمای پایهٔ بدن نیز پس از تخمک‌گذاری کمی افزایش می‌یابد. در صورت رخ‌ندادن بارداری، افت هورمون‌ها زمینه را برای شروع قاعدگی فراهم می‌کند." },
  { ph: "لوتئال", cat: "حال‌وهوا", t: "حساسیت‌شدن، نشانهٔ ضعف نیست", x: "ممکن است حساس‌تر، کم‌حوصله‌تر یا مضطرب‌تر شوی. این تغییرات برای بعضی افراد بخشی از علائم پیش از قاعدگی است و نشانهٔ ضعف نیست؛ تجربهٔ هر فرد متفاوت است." },
  { ph: "لوتئال", cat: "تغذیه", t: "منیزیم و کلسیم فراموش نشود", x: "غلات کامل، میوه و سبزی، منابع کلسیم و غذاهای حاوی منیزیم مانند مغزها و سبزی‌های برگ‌دار را در برنامه‌ات بگنجان. اگر مصرف زیاد نمک یا کافئین علائمی مثل نفخ یا تپش قلبت را تشدید می‌کند، مقدار آن را کاهش بده." },
  { ph: "لوتئال", cat: "حرکت", t: "فعالیت منظم، علائم کمتر", x: "پیاده‌روی، شنا و یوگا را متناسب با حال و انرژی‌ات انتخاب کن. فعالیت بدنی منظم می‌تواند به کاهش برخی علائم پیش از قاعدگی کمک کند." },
  { ph: "لوتئال", cat: "مراقبت", t: "ثبت و خواب منظم", x: "علائم جسمی و تغییرات خلق‌وخویت را ثبت کن تا الگوی چرخه‌ات را بهتر بشناسی. خواب منظم و کافی می‌تواند به کاهش خستگی و نوسانات خلقی کمک کند. اگر افت خلق شدید و تکرارشونده، زندگی روزمره‌ات را مختل می‌کند، برای دریافت کمک مناسب با پزشک صحبت کن." },
  /* علمی — از منابع مرجع */
  { ph: "علمی", cat: "شواهد", t: "چرخه، علامت حیاتی است", x: "کالج متخصصان زنان آمریکا (ACOG) توصیه می‌کند منظم‌بودن و ویژگی‌های پریود مثل فشار خون و نبض جدی گرفته شود. در نوجوانی ۹۰٪ چرخه‌ها بین ۲۱ تا ۴۵ روز است و پریود معمولاً ۲ تا ۷ روز طول می‌کشد." },
  { ph: "علمی", cat: "شواهد", t: "تخمک‌گذاری همیشه روز ۱۴ نیست", x: "در یک مطالعه روی ۶۹۶ چرخه، فقط حدود ۱۰٪ زنان با چرخهٔ ۲۸ روزه دقیقاً ۱۴ روز قبل از پریود بعدی تخمک‌گذاری کردند. پنجرهٔ باروری معمولاً حدود ۶ روز توصیف می‌شود و زمان آن بین افراد و حتی چرخه‌های یک نفر فرق می‌کند." },
  { ph: "علمی", cat: "شواهد", t: "تغییر کوچک عادی است", x: "چند روز اختلاف بین چرخه‌ها در بیشتر زنان دیده می‌شود. استرس، بیماری، خواب و تغییر وزن می‌توانند چرخه را جابه‌جا کنند. ثبت چند ماهه به تو و پزشکت تصویر دقیق‌تری می‌دهد." }
];
/* هشدارهای پزشکی — به‌روزرسانی محتوای کاربر */
const CX_DOC_SIGNS = [
  "پریودت بیش از ۳ ماه قطع شده و باردار نیستی.",
  "چرخه‌هایت به‌طور مکرر کوتاه‌تر از ۲۱ روز یا طولانی‌تر از ۳۵ روز هستند.",
  "خون‌ریزی بیش از ۷ روز طول می‌کشد یا برای چند ساعت متوالی، هر ساعت یک نوار بهداشتی کاملاً خیس می‌شود.",
  "درد قاعدگی شدید است، با مسکن‌های معمول کنترل نمی‌شود یا فعالیت‌های روزمره‌ات را مختل می‌کند.",
  "بین دو پریود یا پس از رابطهٔ جنسی خون‌ریزی داری."
];
function cxWeekTips() {
  const n = CX_TIPS_POOL.length;
  const wk = Math.floor(cyTodayJdn() / 7);
  const s = (wk * 4) % n;
  return [0, 1, 2, 3].map(function (i) { return CX_TIPS_POOL[(s + i) % n]; });
}
function cxKnowHtml() {
  const tips = cxWeekTips();
  return `
  <section class="card cx-anim cxa-know" aria-label="نکته‌های معتبر و هشدارهای پزشکی" style="margin-top:16px">
    <div class="cxa-know-tabs">
      <button type="button" class="cxa-know-pill is-mint" data-cy="knowtips" aria-expanded="${CY.knowTips ? "true" : "false"}" aria-controls="cxa-know-tips">
        <span class="cxa-know-ic" aria-hidden="true">${CXA_IC.spark}</span>
        <span class="cxa-know-t">چند نکتهٔ معتبر</span>
        <span class="cxa-know-chev" aria-hidden="true">${I.chevD}</span>
      </button>
      <button type="button" class="cxa-know-pill is-rose" data-cy="knowdoc" aria-expanded="${CY.knowDoc ? "true" : "false"}" aria-controls="cxa-know-doc">
        <span class="cxa-know-ic" aria-hidden="true">${I.stetho}</span>
        <span class="cxa-know-t">چه زمانی با پزشک یا ماما صحبت کنیم؟</span>
        <span class="cxa-know-chev" aria-hidden="true">${I.chevD}</span>
      </button>
    </div>
    ${CY.knowTips ? `
    <div id="cxa-know-tips" role="region" aria-label="نکته‌های این هفته">
      <p class="cxa-know-cap">${CXA_IC.spark}<span>۴ نکتهٔ این هفته — هر هفته ۴ نکتهٔ تازه از میان نکات معتبر</span></p>
      <div class="cxa-know-grid">
        ${tips.map(function (tp) {
          return `<article class="cxa-know-tip">
            <small><i aria-hidden="true"></i>${tp.ph} · ${tp.cat}</small>
            <h3>${tp.t}</h3>
            <p>${tp.x}</p>
          </article>`;
        }).join("")}
      </div>
    </div>` : ""}
    ${CY.knowDoc ? `
    <ul class="cxa-know-doc" id="cxa-know-doc" role="region" aria-label="چه زمانی با پزشک یا ماما صحبت کنیم">
      ${CX_DOC_SIGNS.map(function (t) { return `<li>${I.flag}<span>${t}</span></li>`; }).join("")}
    </ul>` : ""}
  </section>
  <section class="card cx-priv cx-anim" aria-label="حریم خصوصی" style="margin-top:16px">
    ${I.lock}<div>
      <h3 style="font-weight:700;font-size:15px;color:var(--cx-ink)">اطلاعاتت فقط در همین مرورگر می‌ماند</h3>
      <p>این نسخه نمایشی، داده‌ها را روی دستگاه خودت ذخیره می‌کند، بدون حساب کاربری و بدون ارسال به سرور. بررسی Mozilla نشان داد اپ‌هایی که داده را روی دستگاه نگه می‌دارند و مجوز غیرضروری نمی‌خواهند، بالاترین امتیاز حریم خصوصی را می‌گیرند.</p>
    </div>
  </section>
  <section class="card cx-src cx-anim" aria-label="منابع" style="margin-top:16px">
    <b>منابع</b>
    <ol>
      <li><a href="https://www.mdedge.com/content/acog-think-menses-vital-sign-adolescents" target="_blank" rel="noopener">ACOG: چرخه قاعدگی به‌عنوان علامت حیاتی در نوجوانان</a></li>
      <li><a href="https://www.bmj.com/lookup/volpage/321/1259" target="_blank" rel="noopener">Wilcox و همکاران، BMJ: زمان‌بندی «پنجره باروری» در چرخه قاعدگی</a></li>
      <li><a href="https://cyberinsider.com/mozilla-study-ranks-euki-as-the-most-private-period-tracker/" target="_blank" rel="noopener">مرور حریم خصوصی اپ‌های ردیاب پریود (Mozilla)</a></li>
    </ol>
    <p style="margin-top:8px">بازهٔ مرجع این صفحه ۲۱ تا ۳۵ روز بر اساس ACOG است؛ رهنمود FIGO برای بزرگسالان بازهٔ ۲۴ تا ۳۸ روز را ذکر می‌کند — مرز دقیق «معمول» بین منابع کمی متفاوت است و همین صفحه از ACOG پیروی می‌کند. این صفحه جایگزین مشاوره پزشکی نیست.</p>
  </section>`;
}

/* ---------- تنظیمات و آمار ---------- */
function cxSettingsHtml(M) {
  const starts = cyStarts();
  const rows = starts.slice().reverse().map(function (s) {
    const sj = JAL.d2j(s.jdn);
    const key = JAL.keyOf(sj.jy, sj.jm, sj.jd);
    const pn = Math.round(Number(s.plen));
    const pTxt = Number.isFinite(pn) && pn >= 1 ? " · مدت " + fa(Math.min(pn, CX_PERIOD_MAX)) + " روز" : "";
    return `
    <div class="cx-set-row">
      <div class="grow"><b>${JAL.fmt(sj)}</b><span>روز شروع پریود${pTxt}</span></div>
      <button type="button" class="cx-goto" data-cy="goto" data-k="${key}">مشاهده و اصلاح</button>
    </div>`;
  }).join("");
  const lenTxt = M
    ? (M.cycleLenSrc === "avg" ? fa(M.cycleLen) + " روز"
      : fa(M.cycleLen) + " روز (پیش‌فرض)")
    : "—";
  return `
  <section class="card cx-anim" aria-label="تنظیمات و آمار تقویم" style="margin-top:16px">
    <div class="cx-set-h">${I.gear}<b>تنظیمات و آمار تقویم</b></div>
    <div class="cx-set-stats">
      <div><b>${fa(starts.length)}</b><span>پریود ثبت‌شده</span></div>
      <div><b>${lenTxt}</b><span>طول چرخه</span></div>
      <div><b>${M ? fa(M.periodLen) + " روز" : "—"}</b><span>مدت پریود</span></div>
    </div>
    ${rows ? `<div class="cx-set-list"><div class="cx-set-cap">شروع‌های ثبت‌شده</div>${rows}</div>` : '<p class="cx-sub" style="margin-top:12px">هنوز شروعی ثبت نشده است.</p>'}
    <div class="cx-set-foot">
      <p class="cx-sub">برای اصلاح یک تاریخ، روزش را در تقویم باز کن و ثبتش را ویرایش یا حذف کن.</p>
      <button type="button" class="cx-danger ${CY.confReset ? "armed" : ""}" data-cy="reset">${CY.confReset ? "مطمئنی؟ همه داده‌ها پاک شود" : "پاک کردن همه داده‌ها"}</button>
    </div>
  </section>`;
}

/* ---------- اقدام‌ها ---------- */
function cxAddStart(jdn) {
  if (jdn > cyTodayJdn()) { cyToast("ثبت روز اول پریود برای روزهای آینده ممکن نیست"); return false; }
  const starts = cyStarts();
  if (starts.some(function (s) { return s.jdn === jdn; })) return false;
  /* شروعِ نزدیک (کمتر از ۱۰ روز) یعنی کاربر همان شروع را اصلاح می‌کند —
     به‌جای رد کردن، همان شروع به روز انتخابی منتقل می‌شود */
  const nears = starts.filter(function (s) { return s.jdn !== jdn && Math.abs(s.jdn - jdn) < 10; });
  /* هنگام جابه‌جایی تاریخ شروع، مدت همان پریود را پیش از حذف رکورد نگه می‌داریم؛
     وگرنه بعد از حذف، مدت آخرین پریود دیگر به‌اشتباه جای آن می‌نشیند. */
  let movedPlen = null;
  if (nears.length > 1) {
    const guard = cxCanAddStart(starts.map(function (s) { return s.jdn; }), jdn);
    if (!guard.ok) { cyToast(guard.reason); return false; }
  }
  if (nears.length === 1) {
    const r = cyDb.days[nears[0].key];
    if (r) {
      const oldLen = Math.round(Number(r.plen));
      movedPlen = Number.isFinite(oldLen) && oldLen >= CX_PERIOD_MIN
        ? Math.min(CX_PERIOD_MAX, oldLen)
        : cxNormSettings(cyDb.settings).periodLen;
      delete r.start;
      cyNormalizeDay(nears[0].key);
    }
  }
  const j = JAL.d2j(jdn);
  /* اسنپ‌شات مدت پریود برای این چرخه: همان مدتِ آخرین پریودِ ثبت‌شده → وگرنه پیش‌فرض.
     بعداً کاربر با کنترل «مدت پریود» می‌تواند همین عدد را برای این پریود عوض کند */
  const prevs = cyStarts();
  let seed = movedPlen !== null ? movedPlen : cxNormSettings(cyDb.settings).periodLen;
  if (movedPlen === null && prevs.length) {
    const lr = cyDb.days[prevs[prevs.length - 1].key] || {};
    const n = Math.round(Number(lr.plen));
    if (Number.isFinite(n) && n >= CX_PERIOD_MIN) seed = Math.min(CX_PERIOD_MAX, n);
  }
  const rec = cyRec(JAL.keyOf(j.jy, j.jm, j.jd));
  rec.start = true;
  rec.plen = seed;
  return true;
}
/* پیام فاصلهٔ کوتاه ثبت‌شده (۱۰ تا ۱۴ روز) — این فاصله‌ها در محدودهٔ محاسباتی
   (۱۵ تا ۹۰ روز) نیستند و از میانگین کنار گذاشته می‌شوند؛ کاربر باید بداند */
function cxShortGapMsg(jdn) {
  const ds = cyStarts()
    .filter(function (s) { return s.jdn !== jdn; })
    .map(function (s) { return Math.abs(s.jdn - jdn); })
    .filter(function (d) { return d >= 10 && d <= 14; });
  if (!ds.length) return null;
  return "فاصلهٔ " + fa(Math.min.apply(null, ds)) + " روزهٔ این شروع با شروع دیگر در محدودهٔ محاسباتی (۱۵ تا ۹۰ روز) نیست و در میانگین و پیش‌بینی چرخه حساب نمی‌شود. اگر خون‌ریزی واقعی بوده، برای بررسی علت آن، پیگیری پزشکی مناسب است.";
}
function cxGoDay(jdn) {
  const o = JAL.d2j(jdn);
  CY.sel = JAL.keyOf(o.jy, o.jm, o.jd);
  CY.y = o.jy; CY.m = o.jm;
  CY.confMove = null; /* تغییر روز، تأیید انتقال شروع را منسوخ می‌کند */
}
function handleCy(act, el) {
  const tJdn = cyTodayJdn();
  switch (act) {
    case "set":
      CY.setOpen = !CY.setOpen;
      CY.confReset = false;
      render(false);
      break;
    case "prevm":
      CY.m--; if (CY.m < 1) { CY.m = 12; CY.y--; }
      CY.gridAnim = true; render(false); CY.gridAnim = false;
      break;
    case "nextm":
      CY.m++; if (CY.m > 12) { CY.m = 1; CY.y++; }
      CY.gridAnim = true; render(false); CY.gridAnim = false;
      break;
    case "todaym":
      { const t = JAL.today(); CY.y = t.jy; CY.m = t.jm; }
      CY.gridAnim = true; render(false); CY.gridAnim = false;
      break;
    case "day":
      cxGoDay(JAL.keyToJdn(el.dataset.k));
      render(false);
      break;
    case "start-today":
      if (cxAddStart(tJdn)) {
        const k = JAL.keyOf(JAL.d2j(tJdn).jy, JAL.d2j(tJdn).jm, JAL.d2j(tJdn).jd);
        const r = cyRec(k);
        if (!r.flow) r.flow = "light";
        cySaveDb();
        cxGoDay(tJdn);
        cyToast(cxShortGapMsg(tJdn) || "شروع پریود ثبت شد");
      }
      break;
    case "pick-past":
      CY.setOpen = false;
      render(false);
      { const cal = document.querySelector('[aria-label="تقویم ماهانه چرخه"]');
        if (cal && cal.scrollIntoView) cal.scrollIntoView({ behavior: "smooth", block: "start" }); }
      cyToast("روز اول پریودت را در تقویم انتخاب کن");
      break;
    case "toggle-start":
      {
        const jdn = JAL.keyToJdn(CY.sel);
        const starts = cyStarts();
        const mine = starts.find(function (s) { return s.jdn === jdn; });
        if (mine) {
          const r = cyDb.days[CY.sel];
          if (r) { delete r.start; cyNormalizeDay(CY.sel); }
          CY.confMove = null;
          cySaveDb();
          cyToast("شروع پریود برداشته شد");
        } else {
          /* جابه‌جایی شروعِ نزدیک (کمتر از ۱۰ روز) = حذف ثبت واقعی — فقط با تأیید کاربر */
          const near = starts.find(function (s) { return Math.abs(s.jdn - jdn) < 10; });
          const armed = near && CY.confMove && CY.confMove.key === near.key && CY.confMove.jdn === jdn;
          if (near && !armed) {
            CY.confMove = { key: near.key, jdn: jdn };
            cyToast("روز اولِ ثبت‌شده در " + JAL.fmt(JAL.keyToJ(near.key)) + " به این روز منتقل می‌شود. برای انجام، دکمه را دوباره بزن.");
          } else if (cxAddStart(jdn)) {
            CY.confMove = null;
            cySaveDb();
            const gap = cxShortGapMsg(jdn);
            cyToast(gap || (near ? "روز اول پریود به " + JAL.fmt(JAL.keyToJ(CY.sel)) + " منتقل شد" : "شروع پریود ثبت شد"));
          }
        }
        render(false);
      }
      break;
    case "mark-start":
      {
        const selJdn = JAL.keyToJdn(CY.sel);
        const mine = cyStarts().find(function (s) { return s.jdn === selJdn; });
        if (mine) {
          /* برداشتن ثبت — بعد از آن کاربر می‌تواند روز درست را ثبت کند */
          const r = cyDb.days[CY.sel];
          if (r) { delete r.start; cyNormalizeDay(CY.sel); }
          cySaveDb();
          cyToast("ثبتِ روز اول پریود از " + JAL.fmt(JAL.keyToJ(CY.sel)) + " برداشته شد");
          render(false);
          break;
        }
        /* جابه‌جایی شروعِ نزدیک (کمتر از ۱۰ روز) = حذف ثبت واقعی — فقط با تأیید کاربر */
        const near = cyStarts().find(function (s) { return Math.abs(s.jdn - selJdn) < 10; });
        const armed = near && CY.confMove && CY.confMove.key === near.key && CY.confMove.jdn === selJdn;
        if (near && !armed) {
          CY.confMove = { key: near.key, jdn: selJdn };
          cyToast("روز اولِ ثبت‌شده در " + JAL.fmt(JAL.keyToJ(near.key)) + " به این روز منتقل می‌شود. برای انجام، دکمه را دوباره بزن.");
          render(false);
          break;
        }
        if (cxAddStart(selJdn)) {
          CY.confMove = null;
          cySaveDb();
          const gap = cxShortGapMsg(selJdn);
          cyToast(near
            ? (gap || ("روز اول پریود به " + JAL.fmt(JAL.keyToJ(CY.sel)) + " منتقل شد"))
            : (gap || "روز اول پریود ثبت شد — چرخه از این روز شروع شد"));
          render(false);
        }
      }
      break;
    /* ---- کنترل «مدت پریود» (هر بار قابل تنظیم) ---- */
    case "pd-inc":
    case "pd-dec":
      cxPeriodShift(act === "pd-inc" ? 1 : -1);
      render(false);
      break;
    case "tab":
      CY.tab = el.dataset.v;
      render(false);
      break;
    case "histall":
      CY.histWin = true;
      render(false);
      {
        const c = document.querySelector('[data-cy="hwin-close"]');
        if (c) c.focus({ preventScroll: true }); /* فوکوس روی «بستن» — دسترس‌پذیری پنجرهٔ مودال */
      }
      break;
    case "hwin-close":
    case "hwin-back":
      CY.histWin = false;
      render(false);
      break;
    case "knowtips":
      CY.knowTips = !CY.knowTips;
      render(false);
      break;
    case "knowdoc":
      CY.knowDoc = !CY.knowDoc;
      render(false);
      break;
    case "goto":
      cxGoDay(JAL.keyToJdn(el.dataset.k));
      CY.setOpen = false;
      render();
      break;
    case "reset":
      if (!CY.confReset) { CY.confReset = true; render(false); }
      else {
        cyDb = cyEmptyDb();
        cySaveDb();
        CY.confReset = false;
        cyToast("همه داده‌های تقویم پاک شد");
      }
      break;
  }
}

/* ---------- رویدادها (الگوی capture، مانند بقیهٔ اپ) ---------- */
document.getElementById("app").addEventListener(
  "click",
  function (e) {
    const b = e.target.closest("[data-cy]");
    if (b && b.dataset.cy) {
      e.stopPropagation();
      handleCy(b.dataset.cy, b);
      return;
    }
  },
  true,
);

/* بستن تولتیپ نمودار الگو با کلیک بیرون از نمودار (مانند آرتیفکت) */
document.addEventListener("click", function (e) {
  if (!e.target || !e.target.closest || !e.target.closest(".cxa-chart-wrap")) cxaHideTip();
});

/* بستن پنجرهٔ «تاریخچهٔ الگو» با کلید Esc (دسترس‌پذیری پنجرهٔ مودال) */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && CY.histWin) {
    CY.histWin = false;
    render(false);
  }
});

/* بازنشانی وضعیت زیرمجموعه هنگام ورود تازه به تقویم */
document.getElementById("app").addEventListener(
  "click",
  function (e) {
    const nb = e.target.closest('[data-nav="cycle"]');
    if (nb) {
      CY.confReset = false;
      CY.setOpen = false;
      CY.confMove = null; /* دکمهٔ مسلح انتقال شروع در ورود مجدد منسوخ می‌شود */
      CY.histWin = false; /* پنجرهٔ تاریخچه در ورود مجدد بسته است */
    }
  },
  true,
);

/* ============================================================
   تقویم سلامت مردان — نسخهٔ بازطراحی‌شده
   ------------------------------------------------------------
   پیاده‌سازی کامل (داده، ذخیره‌سازی، مهاجرت، موتور گزارش هفتگی،
   موتور توصیه با جلوگیری از تکرار، نماها و رویدادها) در:
     mcal-data.js  → کتابخانهٔ محتوای ساخت‌یافته و ثابت‌ها
     mcal.js       → وضعیت، موتورها و نماها
   این فایل فقط نقطهٔ اتصال به مسیریاب اصلی اپ است.
   نتیجهٔ پرسش‌نامه‌های SHIM/PEDT از طریق mhOnResult (در scoring.js)
   به ماژول جدید منتقل می‌شود.
   ============================================================ */
function vMhc() {
  if (typeof mcalView === "function") return mcalView();
  return shell('<section class="page"><div class="container"><div class="note">بارگذاری تقویم با خطا مواجه شد؛ صفحه را دوباره بارگذاری کن.</div></div></section>');
}
/* ============================================================
   همراه مادر — میزبان ماژول مستقل (pp-companion.js + pp-adapter.js)
   ------------------------------------------------------------
   منطق و محتوای «همراه مادر» در ماژول مستقل است (بازطراحی «امروز اول»):
   هدر کوچک، کارت «امروز برای تو»، ثبت سریع ۳ لمسی، نوار هفتگی، نمودارها،
   «از همسرم کمک بخواه»، حداکثر ۳ راهنمای مرتبط + فهرست جست‌وجوپذیر و
   دکمهٔ ثابت «علائم خطر».
   این‌جا فقط نمای pp است: گرهٔ پایدار #ppHost بیرون #app (در index.html)
   با ppAttach()/ppDetach() «جابه‌جا» می‌شود — نه بازسازی — تا پیش‌نویس
   چک‌این و وضعیت ماژول بین ناوبری‌ها حفظ بماند (الگوی دفترچهٔ علائم).
   ============================================================ */

function ppHostNode() { return document.getElementById("ppHost"); }
function ppPark() {
  const n = ppHostNode();
  if (n && n.parentNode && n.parentNode !== document.body) {
    n.hidden = true;
    document.body.appendChild(n);
  }
}
function ppDetach() {
  const n = ppHostNode();
  if (n) n.hidden = true;
}
function ppAttach() {
  const n = ppHostNode(), slot = document.getElementById("ppSlot");
  if (!n || !slot || !window.SamanPostpartum) return;
  if (n.parentNode !== slot) slot.appendChild(n);
  n.hidden = false;
  SamanPostpartum.refresh();
}

function vPp() {
  return shell(`
  <section class="page pp-page"><div class="container">
    <div id="ppSlot"></div>
    <div class="note">${I.info}<span>همراه مادر، ماژولی مستقل است: همهٔ داده‌ها فقط در حافظهٔ همین مرورگر (localStorage) می‌مانند و به هیچ سرویس دیگری ارسال نمی‌شوند.</span></div>
  </div></section>`);
}

render();
