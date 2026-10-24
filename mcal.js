/* ============================================================
   mcal.js — «تقویم سلامت مردان» | نسخهٔ بازطراحی‌شده
   ------------------------------------------------------------
   یک همراه شخصی برای شناخت بهتر خود: ثبت روزانهٔ کوتاه،
   تقویم شخصی، گزارش هفتگیِ تولیدشده از دادهٔ واقعی کاربر،
   موتور توصیهٔ محتوا با قواعد شفاف و جلوگیری واقعی از تکرار.
   ------------------------------------------------------------
   معماری:
   - داده و منطق جدا از نماها (همان الگوی ماژول‌های دیگر سَمن)
   - ذخیره‌سازی: localStorage — کلید samn_mcal_v1 — فقط همین دستگاه
   - مهاجرت خودکار از نسخهٔ قبلی (samn_mhcal_demo_v1) با تبدیل مقیاس ۳تایی به ۵تایی
   - دادهٔ نمایشی (demo) جدا و برچسب‌دار از دادهٔ واقعی کاربر
   - هیچ نمرهٔ ترکیبی «سلامت کلی» ساخته نمی‌شود؛ هیچ ادعای تشخیصی نیست
   ============================================================ */

/* ---------- icons (محلی، بدون دست‌کاری I سراسری) ---------- */
const MC_IC = {
  target: SV('<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none"/>'),
  sun: SV('<circle cx="12" cy="12" r="4"/><path d="M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6l-1.6 1.6"/>'),
  moon: SV('<path d="M20 14.5A8.3 8.3 0 0 1 9.5 4a8.3 8.3 0 1 0 10.5 10.5z"/>'),
  chart: SV('<path d="M4.4 19.6V4.4M4.4 19.6h15.2"/><path d="m7.6 15.2 3.4-4 2.6 2.4 4.4-5.6"/>'),
  book: SV('<path d="M4.8 5.6A2 2 0 0 1 6.8 3.6H19v14.8H6.8a2 2 0 0 0-2 2z"/><path d="M4.8 18.4a2 2 0 0 1 2-2H19"/>'),
  gear: SV('<circle cx="12" cy="12" r="3"/><path d="M12 4.2v2M12 17.8v2M4.2 12h2M17.8 12h2M6.4 6.4l1.4 1.4M16.2 16.2l1.4 1.4M17.6 6.4l-1.4 1.4M7.8 16.2 6.4 17.6"/>'),
  brain: SV('<path d="M9.4 4.4a3 3 0 0 0-3 3 2.6 2.6 0 0 0-1.6 4.6 2.8 2.8 0 0 0 1.2 4.8 2.8 2.8 0 0 0 3.4 2.8V4.4z"/><path d="M14.6 4.4a3 3 0 0 1 3 3 2.6 2.6 0 0 1 1.6 4.6 2.8 2.8 0 0 1-1.2 4.8 2.8 2.8 0 0 1-3.4 2.8V4.4z"/>'),
  body: SV('<circle cx="12" cy="5" r="2.2"/><path d="M12 7.6v5.2M8.4 9.4l3.6 1.2 3.6-1.2M12 12.8 9 19M12 12.8 15 19"/>'),
  shieldh: SV('<path d="M12 3.2 18.8 5.7v5.5c0 4.2-2.9 7.2-6.8 8.8-3.9-1.6-6.8-4.6-6.8-8.8V5.7z"/><path d="M12 8v5M9.6 10.4h4.8"/>'),
  spark: SV('<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z"/>'),
  list: SV('<path d="M8.4 6.4h11M8.4 12h11M8.4 17.6h11"/><path d="M4.6 6.4h.01M4.6 12h.01M4.6 17.6h.01"/>'),
  pen: SV('<path d="M14.4 5.2 18.8 9.6 9.2 19.2 4.4 19.6l.4-4.8z"/><path d="m13 6.6 4.4 4.4"/>'),
  trash: SV('<path d="M5 7h14M10 7V5.2a1.2 1.2 0 0 1 1.2-1.2h1.6A1.2 1.2 0 0 1 14 5.2V7M7 7l.8 12h8.4L17 7"/>'),
  clock: SV('<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3 2.2"/>'),
  info: SV('<circle cx="12" cy="12" r="8.4"/><path d="M12 11.2v4.6M12 8.2h.01"/>'),
  lock: SV('<rect x="5.8" y="10.4" width="12.4" height="9.4" rx="2.4"/><path d="M8.6 10.4V7.6a3.4 3.4 0 0 1 6.8 0v2.8"/>'),
  check: SV('<path d="m5 12.5 4.4 4.4L19 7.2"/>'),
  chevL: SV('<path d="m14 6-6 6 6 6"/>'),
  chevR: SV('<path d="m10 6 6 6-6 6"/>'),
  chevD: SV('<path d="m6.5 9.8 5.5 5.4 5.5-5.4"/>'),
  alert: SV('<path d="M10.4 4.4 3 17.4a1.6 1.6 0 0 0 1.4 2.4h15.2a1.6 1.6 0 0 0 1.4-2.4L13.6 4.4a1.8 1.8 0 0 0-3.2 0z"/><path d="M12 9.6v4M12 16.8h.01"/>'),
  cal: SV('<rect x="4.2" y="5.6" width="15.6" height="15" rx="2.4"/><path d="M8 3.6v3.6M16 3.6v3.6M4.2 10.4h15.6"/>'),
  bulb: SV('<path d="M9.6 17.8h4.8M10.4 20.6h3.2"/><path d="M12 3.2a5.8 5.8 0 0 0-3.6 10.3c.8.6 1.1 1.3 1.1 2.1v.4h5v-.4c0-.8.3-1.5 1.1-2.1A5.8 5.8 0 0 0 12 3.2z"/>'),
  heart: SV('<path d="M12 20.3S4.4 15.6 4.4 10a4.1 4.1 0 0 1 7.6-2.2A4.1 4.1 0 0 1 19.6 10c0 5.6-7.6 10.3-7.6 10.3z"/>'),
  flower: SV('<circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><circle cx="12" cy="6.2" r="2.4"/><circle cx="17.1" cy="9.9" r="2.4"/><circle cx="15.1" cy="16" r="2.4"/><circle cx="8.9" cy="16" r="2.4"/><circle cx="6.9" cy="9.9" r="2.4"/>'),
  clip: SV('<rect x="5.5" y="4.8" width="13" height="15.7" rx="2.4"/><rect x="9.2" y="2.8" width="5.6" height="3.6" rx="1.4"/><path d="m9.2 12.6 2 2 3.6-4"/>'),
};

/* ---------- store ---------- */
const MC_KEY = "samn_mcal_v1";
const MC_OLD_KEY = "samn_mhcal_demo_v1";

function mcEmptyDb() {
  return {
    v: 1,
    profile: { introDone: false, goals: [], libidoOn: true },
    entries: {},
    repCache: {},
    repFb: {},
    contentHist: {},
    angleHist: [],
    prog: { ed: null, pe: null },
    saveCount: 0,
  };
}
function mcValidKey(k) { return typeof k === "string" && /^\d{4}-\d{2}-\d{2}$/.test(k); }
function mcValidDb(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  if (raw.v !== 1) return null;
  const db = mcEmptyDb();
  if (!raw.profile || typeof raw.profile !== "object") return null;
  db.profile.introDone = !!raw.profile.introDone;
  db.profile.libidoOn = raw.profile.libidoOn !== false;
  db.profile.goals = Array.isArray(raw.profile.goals)
    ? raw.profile.goals.filter(function (g) { return typeof g === "string"; }).slice(0, 5)
    : [];
  if (raw.entries && typeof raw.entries === "object") {
    const clean = {};
    Object.keys(raw.entries).forEach(function (k) {
      const r = raw.entries[k];
      if (mcValidKey(k) && r && typeof r === "object" && !Array.isArray(r)) clean[k] = r;
    });
    db.entries = clean;
  }
  ["repCache", "repFb", "contentHist", "prog"].forEach(function (f) {
    if (raw[f] && typeof raw[f] === "object" && !Array.isArray(raw[f])) db[f] = raw[f];
  });
  if (Array.isArray(raw.angleHist)) db.angleHist = raw.angleHist.slice(-24);
  if (typeof raw.saveCount === "number") db.saveCount = raw.saveCount;
  return db;
}
function mcMigrateOld(raw) {
  /* مهاجرت از نسخهٔ قبلی: مقیاس ۰–۲ به ۰–۴، میل با نگاشت جدا، حفظ تمرین‌ها،
     پیشنهادهای نمایش‌داده‌شده و بازخوردها تا قواعد جلوگیری از تکرار معنا داشته باشند */
  if (!raw || typeof raw !== "object" || !raw.days) return null;
  const db = mcEmptyDb();
  db.profile.introDone = false; /* معرفی جدید یک‌بار دیده می‌شود؛ داده‌ها حفظ شده‌اند */
  Object.keys(raw.days).forEach(function (k) {
    const r = raw.days[k];
    if (!r || typeof r !== "object" || !mcValidKey(k)) return;
    const n = {};
    if (r.mo != null) n.mo = Math.max(0, Math.min(4, r.mo * 2));
    if (r.en != null) n.en = Math.max(0, Math.min(4, r.en * 2));
    if (r.st != null) n.st = Math.max(0, Math.min(4, r.st * 2));
    if (r.sl != null) n.sl = Math.max(0, Math.min(4, r.sl * 2));
    if (r.li != null) n.li = r.li === 3 ? 4 : Math.max(0, Math.min(2, r.li));
    if (Object.keys(n).length) db.entries[k] = n;
  });
  if (raw.prog) { db.prog.ed = raw.prog.ed || null; db.prog.pe = raw.prog.pe || null; }
  const hist = {};
  Object.keys(raw.ex || {}).forEach(function (id) {
    const st = raw.ex[id];
    if (!st || !st.done || !st.done.length) return;
    hist[id] = { shown: [], opened: [], done: st.done.slice(0, 60), fb: st.nofit ? { type: "down", week: null } : null, saved: false };
  });
  (raw.sug || []).forEach(function (s) {
    if (!s || !s.id || typeof s.w !== "number") return;
    const h = hist[s.id] || (hist[s.id] = { shown: [], opened: [], done: [], fb: null, saved: false });
    if (!h.shown.some(function (x) { return x.w === s.w; })) h.shown.push({ w: s.w, role: s.role || "main" });
  });
  Object.keys(raw.content || {}).forEach(function (id) {
    const w = raw.content[id];
    if (typeof w !== "number") return;
    const h = hist[id] || (hist[id] = { shown: [], opened: [], done: [], fb: null, saved: false });
    if (!h.shown.some(function (x) { return x.w === w; })) h.shown.push({ w: w, role: "comp" });
  });
  (raw.fb || []).forEach(function (f) {
    if (!f || !f.id) return;
    const h = hist[f.id] || (hist[f.id] = { shown: [], opened: [], done: [], fb: null, saved: false });
    h.fb = { type: f.f, week: f.w || null };
  });
  db.contentHist = hist;
  return db;
}
function mcLoad() {
  try {
    const raw = localStorage.getItem(MC_KEY);
    if (raw) {
      const db = mcValidDb(JSON.parse(raw));
      if (db) return db;
    }
    const oldRaw = localStorage.getItem(MC_OLD_KEY);
    if (oldRaw) {
      let old = null;
      try { old = JSON.parse(oldRaw); } catch (e) { old = null; }
      const mig = mcMigrateOld(old);
      if (mig) { try { localStorage.setItem(MC_KEY, JSON.stringify(mig)); } catch (e) {} return mig; }
    }
  } catch (e) {}
  return mcEmptyDb();
}
let mcDb = mcLoad();
function mcSave() {
  try { localStorage.setItem(MC_KEY, JSON.stringify(mcDb)); } catch (e) {}
}

/* ---------- metadata ---------- */
const MC_IND = {
  mo: { name: "حال کلی", short: "حال", opts: ["خیلی نامطلوب", "نامطلوب", "متوسط", "خوب", "خیلی خوب"], good: 4, color: "#1e5b50", q: "امروز در مجموع چه حالی داری؟" },
  en: { name: "انرژی و سرزندگی", short: "انرژی", opts: ["خیلی کم", "کم", "متوسط", "زیاد", "خیلی زیاد"], good: 4, color: "#527d57", q: "امروز چقدر احساس انرژی و سرزندگی می‌کنی؟" },
  st: { name: "فشار روانی", short: "فشار", opts: ["خیلی کم", "کم", "متوسط", "زیاد", "خیلی زیاد"], good: 0, color: "#b06e63", q: "امروز چقدر احساس فشار و استرس داشتی؟" },
  sl: { name: "خواب و استراحت", short: "خواب", opts: ["خیلی بد", "بد", "متوسط", "خوب", "خیلی خوب"], good: 4, color: "#2c5d7c", q: "خواب دیشبت را چطور ارزیابی می‌کنی؟" },
  li: { name: "میل جنسی", short: "میل", opts: ["کمتر از معمول", "تقریباً مثل همیشه", "بیشتر از معمول"], extra: ["مطمئن نیستم", "ترجیح می‌دهم ثبت نکنم"], color: "#7d6255", q: "میل جنسی امروزت، نسبت به حالت معمول خودت، چطور بود؟" },
};
const MC_CORE = ["mo", "en", "st", "sl"];
const MC_LI_SKIP = 3; /* مطمئن نیستم */
const MC_LI_PREF = 4; /* ترجیح می‌دهم ثبت نکنم */
const MC_TYPE_L = { action: "اقدام کوتاه", guide: "راهنمای مرحله‌ای", exercise: "تمرین", edu: "آگاهی کوتاه" };

function mcFactorLabel(id) {
  const f = MC_FACTORS.find(function (x) { return x.id === id; });
  return f ? f.label : id;
}

/* ---------- date / week helpers (هفتهٔ جلالی: شنبه تا جمعه) ---------- */
function mcTodayJdn() { const t = JAL.today(); return JAL.j2d(t.jy, t.jm, t.jd); }
function mcKeyOfJdn(jdn) { const j = JAL.d2j(jdn); return JAL.keyOf(j.jy, j.jm, j.jd); }
function mcWeekStart(jdn) { return jdn - JAL.colOf(jdn); }
function mcWeekLabel(w) {
  const a = JAL.d2j(w), b = JAL.d2j(w + 6);
  if (a.jy === b.jy && a.jm === b.jm) return fa(a.jd) + " تا " + fa(b.jd) + " " + JAL.MONTHS[a.jm - 1] + " " + fa(a.jy);
  if (a.jy === b.jy) return fa(a.jd) + " " + JAL.MONTHS[a.jm - 1] + " تا " + fa(b.jd) + " " + JAL.MONTHS[b.jm - 1] + " " + fa(a.jy);
  return JAL.fmt(a) + " تا " + JAL.fmt(b);
}
function mcDaysInRange(from, to) {
  const out = [];
  Object.keys(mcDb.entries).forEach(function (k) {
    const j = JAL.keyToJdn(k);
    if (j >= from && j <= to) out.push({ jdn: j, k: k, rec: mcDb.entries[k] });
  });
  out.sort(function (a, b) { return a.jdn - b.jdn; });
  return out;
}
function mcWeekDays(w) { return mcDaysInRange(w, w + 6); }
function mcLoggedCount(w) { return mcWeekDays(w).filter(function (d) { return mcIsLogged(d.rec); }).length; }
function mcConsistency(tJdn) {
  return mcDaysInRange(tJdn - 29, tJdn).filter(function (d) { return mcIsLogged(d.rec); }).length;
}

/* ---------- entry helpers ---------- */
function mcIsLogged(rec) {
  if (!rec) return false;
  for (let i = 0; i < MC_CORE.length; i++) { const v = rec[MC_CORE[i]]; if (v !== undefined && v !== null) return true; }
  if (rec.li !== undefined && rec.li !== null) return true;
  if (rec.f && rec.f.length) return true;
  if (rec.note && String(rec.note).trim()) return true;
  return false;
}
function mcCountFields(rec) {
  if (!rec) return 0;
  let n = 0;
  MC_CORE.forEach(function (i) { if (rec[i] !== undefined && rec[i] !== null) n++; });
  if (rec.li !== undefined && rec.li !== null && rec.li !== MC_LI_PREF) n++;
  return n;
}
/* مقدار عددی قابل تحلیل؛ «مطمئن نیستم/ترجیح می‌دهم» در آمار وارد نمی‌شود */
function mcNum(ind, rec) {
  if (!rec) return null;
  const v = rec[ind];
  if (v === undefined || v === null) return null;
  if (ind === "li") return v >= 0 && v <= 2 ? v : null;
  return v >= 0 && v <= 4 ? v : null;
}
function mcAvgOf(days, ind) {
  let n = 0, s = 0;
  days.forEach(function (d) { const v = mcNum(ind, d.rec); if (v !== null) { s += v; n++; } });
  return n ? s / n : null;
}
function mcAvgN(days, ind) {
  let n = 0, s = 0;
  days.forEach(function (d) { const v = mcNum(ind, d.rec); if (v !== null) { s += v; n++; } });
  return { n: n, avg: n ? s / n : null };
}
function mcNeedDir(ind, v) { return MC_IND[ind].good === 4 ? v : 4 - v; } /* بالاتر = وضعیت بهتر */

/* ---------- content history (جلوگیری واقعی از تکرار) ---------- */
function mcH(id) {
  let h = mcDb.contentHist[id];
  if (!h) h = mcDb.contentHist[id] = { shown: [], opened: [], done: [], tips: [], fb: null, saved: false };
  return h;
}
function mcTrim(arr, max) { return arr.length > max ? arr.slice(-max) : arr; }
function mcMarkShown(id, w, role) {
  const h = mcH(id);
  if (!h.shown.some(function (x) { return x.w === w && x.role === role; })) {
    h.shown.push({ w: w, role: role });
    h.shown = mcTrim(h.shown, 40);
    mcSave();
  }
}
function mcLastShownWeek(id) {
  let w = null;
  mcH(id).shown.forEach(function (x) { if (w === null || x.w > w) w = x.w; });
  return w;
}
function mcLastMainInfo() {
  let best = null, bw = null;
  Object.keys(mcDb.contentHist).forEach(function (id) {
    mcDb.contentHist[id].shown.forEach(function (x) {
      if (x.role === "main" && (bw === null || x.w > bw)) { bw = x.w; best = id; }
    });
  });
  if (!best) return null;
  const c = mcContent(best);
  return c ? { id: c.id, type: c.type, cat: c.cat } : null;
}
function mcFbBlock(id, curW) {
  const fb = mcH(id).fb;
  if (!fb) return false;
  if (fb.type === "down") {
    if (fb.week === null) return true; /* مهاجرت‌شده؛ محتاطانه کنار می‌ماند */
    return (curW - fb.week) < 28;
  }
  if (fb.type === "knew") return fb.week !== null && (curW - fb.week) < 56;
  return false;
}
function mcSetFb(id, type) {
  const h = mcH(id);
  h.fb = { type: type, week: mcWeekStart(mcTodayJdn()) };
  mcSave();
}
function mcMarkOpened(id) {
  const h = mcH(id);
  const k = mcKeyOfJdn(mcTodayJdn());
  if (h.opened.indexOf(k) < 0) { h.opened.push(k); h.opened = mcTrim(h.opened, 30); mcSave(); }
}
function mcMarkDone(id) {
  const h = mcH(id);
  const k = mcKeyOfJdn(mcTodayJdn());
  if (h.done.indexOf(k) < 0) { h.done.push(k); h.done = mcTrim(h.done, 60); mcSave(); }
}
function mcToggleSaved(id) {
  const h = mcH(id);
  h.saved = !h.saved;
  mcSave();
  return h.saved;
}

/* ---------- conditions (تناسب شخصی، نه تشخیص) ---------- */
function mcCondOk(c) {
  if (c.cond === "ed") return !!mcDb.prog.ed;
  if (c.cond === "pe") return !!mcDb.prog.pe;
  if (c.cond === "libido") return !!mcDb.profile.libidoOn;
  return true;
}

/* ============================================================
   موتور گزارش هفتگی — زاویه‌ها، الگوها، بینش
   قاعده: هیچ ادعایی بدون دادهٔ کافی؛ هم‌زمانی ≠ علیت
   ============================================================ */
const MC_ANGLES = [
  { key: "stress", title: "فشار روانی و مدیریت آن", inds: ["st"] },
  { key: "sleep", title: "خواب و بازیابی", inds: ["sl"] },
  { key: "energy", title: "انرژی", inds: ["en"] },
  { key: "mood", title: "روند حال کلی", inds: ["mo"] },
  { key: "wow", title: "تغییر نسبت به هفتهٔ قبل", inds: ["mo", "en", "st", "sl"] },
  { key: "factors", title: "عوامل ثبت‌شده و حال", inds: [] },
  { key: "libido", title: "میل جنسی", inds: ["li"] },
  { key: "strengths", title: "نقاط قوت و ثبات‌ها", inds: ["mo"] },
  { key: "goal", title: "مسیر هدف تو", inds: [] },
];
function mcAngleBy(k) { return MC_ANGLES.find(function (a) { return a.key === k; }) || MC_ANGLES[3]; }

function mcWeekVar(days, ind) {
  const vs = days.map(function (d) { return mcNum(ind, d.rec); }).filter(function (v) { return v !== null; });
  if (vs.length < 3) return null;
  const avg = vs.reduce(function (s, v) { return s + v; }, 0) / vs.length;
  return vs.reduce(function (s, v) { return s + (v - avg) * (v - avg); }, 0) / vs.length;
}
function mcAngleNeeds(w) {
  const days = mcWeekDays(w).filter(function (d) { return mcIsLogged(d.rec); });
  const prev = mcWeekDays(w - 7).filter(function (d) { return mcIsLogged(d.rec); });
  const m = {};
  const avgOf = function (ind) { const a = mcAvgN(days, ind); return a.n >= 3 ? a.avg : null; };
  /* فشار: میانگین فشار بالا = نیاز بالا */
  const stAvg = avgOf("st");
  m.stress = stAvg !== null ? Math.max(0, (stAvg - 1)) * 2 : 0;
  /* خواب: بدبودن میانگین = نیاز */
  const slAvg = avgOf("sl");
  m.sleep = slAvg !== null ? Math.max(0, (3 - slAvg)) * 1.6 : 0;
  /* انرژی */
  const enAvg = avgOf("en");
  m.energy = enAvg !== null ? Math.max(0, (3 - enAvg)) * 1.4 : 0;
  /* حال: پرنوسان‌بودن */
  const moVar = mcWeekVar(days, "mo");
  m.mood = moVar !== null ? Math.min(3, moVar * 2.2) : 0;
  /* تغییر نسبت به هفتهٔ قبل */
  let wow = 0;
  MC_CORE.forEach(function (ind) {
    const a = mcAvgN(days, ind), b = mcAvgN(prev, ind);
    if (a.n >= 3 && b.n >= 3) wow = Math.max(wow, Math.abs(a.avg - b.avg));
  });
  m.wow = wow >= 0.5 ? Math.min(3, wow * 2) : 0;
  /* عوامل */
  let fNeed = 0;
  const hasFactor = {};
  days.forEach(function (d) { (d.rec.f || []).forEach(function (f) { hasFactor[f] = (hasFactor[f] || 0) + 1; }); });
  Object.keys(hasFactor).forEach(function (f) { if (hasFactor[f] >= 3) fNeed = Math.max(fNeed, 1.5); });
  m.factors = fNeed;
  /* میل */
  let liN = 0;
  days.forEach(function (d) { const v = mcNum("li", d.rec); if (v !== null) liN++; });
  m.libido = mcDb.profile.libidoOn && liN >= 3 ? 1 : 0;
  /* نقاط قوت */
  const moAvg = avgOf("mo");
  m.strengths = days.length >= 5 && moAvg !== null && moAvg >= 3 ? 1.4 : 0;
  /* هدف */
  m.goal = (mcDb.profile.goals || []).length ? 0.9 : 0;
  return m;
}
function mcPrevAngleOf(w) {
  /* زاویهٔ غالب «هفتهٔ قبل» — فقط از تاریخچهٔ هفته‌های قبل از w */
  let best = null, bw = null;
  mcDb.angleHist.forEach(function (x) {
    if (x.w < w && (bw === null || x.w > bw)) { bw = x.w; best = x.a; }
  });
  return best;
}
function mcPickAngle(w) {
  const needs = mcAngleNeeds(w);
  const prevAngle = mcPrevAngleOf(w);
  const prevFb = mcDb.repFb[w - 7];
  const forcedChange = prevFb === "irrelevant" || prevFb === "knew";
  /* اولویت ثابت برای تساوی + چرخش ملایم تا تنوع حفظ شود */
  const order = MC_ANGLES.slice();
  const rot = mcDb.angleHist.length % 3;
  for (let i = 0; i < rot; i++) order.push(order.shift());
  let best = null, bestNeed = 0;
  order.forEach(function (a) {
    const n = needs[a.key] || 0;
    if (n <= 0) return;
    if (a.key === prevAngle) return; /* زاویهٔ غالب هفتهٔ قبل تکرار نمی‌شود */
    if (n > bestNeed) { best = a; bestNeed = n; }
  });
  if (!best) best = mcAngleBy("goal");
  /* ثبت تاریخچهٔ زاویه — فقط برای هفتهٔ جاری (مرور هفته‌های گذشته ثبت نمی‌کند) */
  const curW = mcWeekStart(mcTodayJdn());
  if (w === curW && !mcDb.angleHist.some(function (x) { return x.w === w; })) {
    mcDb.angleHist.push({ w: w, a: best.key });
    mcDb.angleHist = mcTrim(mcDb.angleHist, 24);
    mcSave();
  }
  return best;
}

/* ---------- pattern rules (با آستانهٔ حداقل داده) ---------- */
function mcPatterns(w) {
  const out = [];
  const days = mcWeekDays(w).filter(function (d) { return mcIsLogged(d.rec); });
  function contrast(goodDays, badDays, ind, goodLbl, badLbl, key, tpl) {
    const g = mcAvgN(goodDays, ind), b = mcAvgN(badDays, ind);
    if (g.n >= 3 && b.n >= 3 && Math.abs(g.avg - b.avg) >= 0.7) {
      const higherGood = g.avg > b.avg;
      out.push({
        key: key,
        strength: Math.abs(g.avg - b.avg),
        text: tpl
          .replace("{good}", goodLbl)
          .replace("{bad}", badLbl)
          .replace("{dir}", higherGood ? "بالاتر" : "پایین‌تر"),
      });
    }
  }
  if (days.length >= 4) {
    const hiSt = days.filter(function (d) { return mcNum("st", d.rec) !== null && mcNum("st", d.rec) >= 3; });
    const loSt = days.filter(function (d) { return mcNum("st", d.rec) !== null && mcNum("st", d.rec) <= 1; });
    contrast(loSt, hiSt, "en", "فشار کمتر", "فشار بیشتر", "st-en",
      "در روزهایی با {good}، انرژی گزارش‌شده‌ات معمولاً {dir} بود؛ همراهی مشاهده‌شده در همین ثبت‌هاست، نه یک قانون.");
    const hiSl = days.filter(function (d) { return mcNum("sl", d.rec) !== null && mcNum("sl", d.rec) >= 3; });
    const loSl = days.filter(function (d) { return mcNum("sl", d.rec) !== null && mcNum("sl", d.rec) <= 1; });
    contrast(hiSl, loSl, "en", "خواب بهتر", "خواب کمتر", "sl-en",
      "روزهای {good} با انرژی {dir} همراه دیده شدند؛ مشاهدهٔ اولیه از ثبت‌های خودت.");
    contrast(hiSl, loSl, "mo", "خواب بهتر", "خواب کمتر", "sl-mo",
      "روزهای {good} با حال کلی {dir} همراه بودند؛ مشاهدهٔ اولیه از ثبت‌های خودت.");
    /* عوامل ثبت‌شده در برابر نبودشان — حداقل ۳ روز در هر گروه */
    const facCount = {};
    days.forEach(function (d) { (d.rec.f || []).forEach(function (f) { facCount[f] = (facCount[f] || 0) + 1; }); });
    Object.keys(facCount).forEach(function (f) {
      if (f === "positive") return; /* عامل مثبت جهت متفاوتی دارد */
      const withF = days.filter(function (d) { return (d.rec.f || []).indexOf(f) > -1; });
      const withoutF = days.filter(function (d) { return !(d.rec.f || []).length || (d.rec.f || []).indexOf(f) < 0; });
      const a = mcAvgN(withF, "mo"), b = mcAvgN(withoutF, "mo");
      if (a.n >= 3 && b.n >= 3 && Math.abs(a.avg - b.avg) >= 0.7) {
        out.push({
          key: "f-" + f,
          strength: Math.abs(a.avg - b.avg),
          text: "در روزهایی که «" + mcFactorLabel(f) + "» را ثبت کردی، حال کلی‌ات " + (a.avg < b.avg ? "پایین‌تر" : "بالاتر") + " از روزهای بدون این عامل بود؛ مشاهده‌ای اکتشافی از دادهٔ همین هفته است.",
        });
      }
    });
    /* پنجشنبه/جمعه در برابر بقیهٔ هفته */
    const wkd = days.filter(function (d) { return JAL.colOf(d.jdn) >= 5; });
    const rest = days.filter(function (d) { return JAL.colOf(d.jdn) < 5; });
    const e = mcAvgN(wkd, "en"), r = mcAvgN(rest, "en");
    if (e.n >= 2 && r.n >= 3 && Math.abs(e.avg - r.avg) >= 1) {
      out.push({
        key: "wd-en",
        strength: Math.abs(e.avg - r.avg),
        text: "بیشترین تغییر انرژی تو میان روزهای هفته و پایان هفته دیده می‌شود" + (e.avg > r.avg ? "؛ پایان هفته انرژی بیشتری داشتی." : "؛ روزهای میانی هفته انرژی بیشتری داشتی.") + " شاید مرور برنامهٔ خواب و فعالیتت مفید باشد.",
      });
    }
    /* میل در محدودهٔ معمول */
    if (mcDb.profile.libidoOn) {
      const lis = days.map(function (d) { return mcNum("li", d.rec); }).filter(function (v) { return v !== null; });
      if (lis.length >= 3) {
        const cnt = {};
        lis.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; });
        let mode = 1, mn = -1;
        Object.keys(cnt).forEach(function (v) { if (cnt[v] > mn) { mn = cnt[v]; mode = +v; } });
        if (mode === 1) {
          out.push({
            key: "li-usual",
            strength: 0.8,
            text: "در ثبت‌های این هفته، میل جنسی‌ات بیشتر در محدودهٔ معمول خودت بوده است؛ نوسان کوچک بالا و پایین آن هم طبیعی است.",
          });
        }
      }
    }
    /* نقاط قوت */
    const moA = mcAvgN(days, "mo");
    if (days.length >= 5 && moA.avg !== null && moA.avg >= 3) {
      out.push({
        key: "strong-mo",
        strength: 1.2,
        text: "حال کلی‌ات در این هفته عمدتاً در محدودهٔ خوب بوده است؛ این ثبات خودش یک نقطهٔ قوت است و ارزش می‌بیند بدانی چه چیزی پشتش بود.",
      });
    }
  }
  out.sort(function (a, b) { return b.strength - a.strength; });
  return out;
}
const MC_CONT_NEXT = {
  "st-en": "اگر این همراهی برایت آشناست، تمرین تنفس آرام در کتابخانه نقطهٔ شروع خوبی برای روزهای پرفشار است.",
  "sl-en": "قدم بعدی می‌تواند یک تنظیم کوچک در آیین شب باشد؛ نه تغییر بزرگ.",
  "sl-mo": "قدم بعدی می‌تواند یک تنظیم کوچک در آیین شب باشد؛ نه تغییر بزرگ.",
  "li-usual": "لازم نیست کاری کنی؛ همین ثبت مداوم تصویر واقعی‌تری به تو می‌دهد.",
  "wd-en": "می‌توانی هفتهٔ بعد، فقط یکی از روزهای کم‌انرژی را از نزدیک ببینی: چه فرقی کرد؟",
  "strong-mo": "یک قدم ساده: یادداشت کن این هفته چه تفاوتی با هفته‌های شلوغ‌تر داشت.",
};

/* ============================================================
   موتور توصیه — قواعد شفاف، بدون یادگیری ماشین
   ============================================================ */
function mcPickMain(w, angle) {
  const curW = mcWeekStart(mcTodayJdn());
  const goals = mcDb.profile.goals || [];
  const lastMain = mcLastMainInfo();
  const cands = [];
  MC_CONTENT.forEach(function (c) {
    if (c.type === "edu") return; /* پیشنهاد اصلی = اقدام/تمرین/راهنما */
    if (!mcCondOk(c)) return;
    if (mcFbBlock(c.id, curW)) return;
    const lastW = mcLastShownWeek(c.id);
    if (lastW !== null && curW - lastW < 28) return; /* قاعدهٔ ۲۸ روز */
    let sc = 2;
    if (angle.inds.length && c.ind && c.ind.some(function (i) { return angle.inds.indexOf(i) > -1; })) sc += 3 + Math.min(3, (mcAngleNeedsCache[w] || 0)) * 0.5;
    if (goals.length && c.goal && c.goal.some(function (g) { return goals.indexOf(g) > -1; })) sc += 3;
    const fb = mcH(c.id).fb;
    if (fb && fb.type === "up") sc += 2.5;
    if (lastMain) {
      if (lastMain.type === c.type) sc -= 1.2; /* تنوع نوع محتوا */
      if (lastMain.cat === c.cat) sc -= 0.8; /* تنوع موضوع */
    }
    if (c.review === "ok") sc += 0.4;
    cands.push({ c: c, sc: sc });
  });
  if (!cands.length) return null;
  cands.sort(function (a, b) { return b.sc - a.sc || (a.c.id < b.c.id ? -1 : 1); });
  return cands[0].c;
}
function mcPickComps(w, angle, mainId) {
  const curW = mcWeekStart(mcTodayJdn());
  const goals = mcDb.profile.goals || [];
  const cands = [];
  MC_CONTENT.forEach(function (c) {
    if (c.type !== "edu") return;
    if (c.id === mainId) return;
    if (!mcCondOk(c)) return;
    if (mcFbBlock(c.id, curW)) return;
    const lastW = mcLastShownWeek(c.id);
    if (lastW !== null && curW - lastW < 28) return;
    let sc = 1.5;
    if (angle.inds.length && c.ind && c.ind.some(function (i) { return angle.inds.indexOf(i) > -1; })) sc += 2.5;
    if (!angle.inds.length && c.cat === "prevent") sc += 1;
    if (goals.length && c.goal && c.goal.some(function (g) { return goals.indexOf(g) > -1; })) sc += 2.5;
    const fb = mcH(c.id).fb;
    if (fb && fb.type === "up") sc += 2;
    if (c.review === "ok") sc += 0.4;
    cands.push({ c: c, sc: sc });
  });
  cands.sort(function (a, b) { return b.sc - a.sc || (a.c.id < b.c.id ? -1 : 1); });
  const out = [];
  const cats = {};
  cands.forEach(function (x) {
    if (out.length >= 2) return;
    if (cats[x.c.cat]) return; /* دو محتوای مکمل از یک دسته نمی‌آیند */
    cats[x.c.cat] = true;
    out.push(x.c);
  });
  return out;
}
var mcAngleNeedsCache = {};
function mcCommitPicks() {
  const w = mcWeekStart(mcTodayJdn());
  mcAngleNeedsCache = mcAngleNeeds(w);
  const angle = mcPickAngle(w);
  const main = mcPickMain(w, angle);
  const comps = main ? mcPickComps(w, angle, main.id) : [];
  let reason = "";
  if (main) {
    const stAvg = (function () { const a = mcAvgN(mcWeekDays(w), "st"); return a.n >= 3 ? a.avg : null; })();
    const slAvg = (function () { const a = mcAvgN(mcWeekDays(w), "sl"); return a.n >= 3 ? a.avg : null; })();
    if (main.ind && main.ind.indexOf("st") > -1 && stAvg !== null && stAvg >= 2.2)
      reason = "چون در ثبت‌های این هفته فشار روانی بالاتر از همیشگی دیده شد، این قدم کم‌فشار نقطهٔ شروع خوبی است.";
    else if (main.ind && main.ind.indexOf("sl") > -1 && slAvg !== null && slAvg <= 2.2)
      reason = "چون خواب این هفته‌ات پایین‌تر از حد معمولت ثبت شده، این قدم روی بازیابی تمرکز دارد.";
    else if ((mcDb.profile.goals || []).length && main.goal && main.goal.some(function (g) { return mcDb.profile.goals.indexOf(g) > -1; }))
      reason = "بر اساس هدفی که برای خودت انتخاب کردی؛ می‌توانی هر وقت خواستی از تنظیمات عوضش کنی.";
    else reason = "برای شروع یا ادامهٔ مسیر، قدمی کوچک، مشخص و واقع‌بینانه انتخاب شده است.";
  }
  MC.picks = { w: w, angle: angle.key, main: main ? main.id : null, comps: comps.map(function (c) { return c.id; }), reason: reason };
  if (main) mcMarkShown(main.id, w, "main");
  comps.forEach(function (c) { mcMarkShown(c.id, w, "comp"); });
  mcSave();
  return MC.picks;
}
function mcGetPicks() {
  const w = mcWeekStart(mcTodayJdn());
  if (MC.picks && MC.picks.w === w) return MC.picks;
  return mcCommitPicks();
}

/* ---------- ساخت گزارش هفته (با کش و بی‌اعتبارسازی روی تغییر داده) ---------- */
function mcInvalidateWeek(jdn) {
  const w = mcWeekStart(jdn);
  delete mcDb.repCache[w];
  MC.picks = null;
}
function mcBuildReport(w) {
  if (mcDb.repCache[w]) return mcDb.repCache[w];
  const curW = mcWeekStart(mcTodayJdn());
  const days = mcWeekDays(w).filter(function (d) { return mcIsLogged(d.rec); });
  const logged = days.length;
  const angle = logged >= 2 ? mcPickAngle(w) : mcAngleBy("goal");
  const pats = mcPatterns(w);
  /* بینش: قوی‌ترین الگو؛ اگر با هفتهٔ قبل یکی بود، به‌عنوان «ادامهٔ روند» معرفی می‌شود */
  const prevRep = mcDb.repCache[w - 7];
  const prevKey = prevRep && prevRep.insight ? prevRep.insight.key : null;
  let insight = null;
  if (pats.length) {
    const p = pats[0];
    const cont = p.key === prevKey;
    insight = {
      key: p.key,
      text: cont
        ? p.text + " این الگو از هفتهٔ گذشته هم دیده شد؛ یعنی پایدارتر است و شناختنش بیشتر به کارت می‌آید."
        : p.text,
      cont: cont,
      next: MC_CONT_NEXT[p.key] || null,
    };
  }
  /* روند شاخص‌ها */
  const trend = [];
  MC_CORE.forEach(function (ind) {
    const a = mcAvgN(days, ind), b = mcAvgN(mcWeekDays(w - 7), ind);
    let cmp = null, cmpLabel = null;
    if (a.n >= 3 && b.n >= 3) {
      const diff = (a.avg - b.avg) * (MC_IND[ind].good === 4 ? 1 : -1);
      if (diff >= 0.4) { cmp = "up"; cmpLabel = "بهتر از هفتهٔ قبل"; }
      else if (diff <= -0.4) { cmp = "down"; cmpLabel = "کم‌تر از هفتهٔ قبل"; }
      else { cmp = "flat"; cmpLabel = "تقریباً مثل هفتهٔ قبل"; }
    }
    trend.push({ ind: ind, n: a.n, avg: a.avg, cmp: cmp, cmpLabel: cmpLabel });
  });
  let liN = 0, liDist = {};
  days.forEach(function (d) {
    const v = d.rec.li;
    if (v === undefined || v === null) return;
    liN++;
    const lbl = v <= 2 ? MC_IND.li.opts[v] : MC_IND.li.extra[v - 3];
    liDist[lbl] = (liDist[lbl] || 0) + 1;
  });
  /* میانگین ساعت خواب اختیاری */
  let hN = 0, hS = 0;
  days.forEach(function (d) { const h = d.rec.slH; if (typeof h === "number" && h > 0 && h <= 16) { hS += h; hN++; } });
  /* پیشنهادها فقط برای هفتهٔ جاری تازه ساخته می‌شوند */
  let main = null, comps = [], reason = "";
  if (w === curW) {
    const picks = mcGetPicks();
    main = picks.main;
    comps = picks.comps;
    reason = picks.reason;
  } else if (mcDb.repCache[w] && mcDb.repCache[w].main) {
    main = mcDb.repCache[w].main;
    comps = mcDb.repCache[w].comps || [];
    reason = mcDb.repCache[w].reason || "";
  }
  const payload = {
    w: w,
    builtOn: mcKeyOfJdn(mcTodayJdn()),
    angleKey: angle ? angle.key : null,
    angleTitle: angle ? angle.title : "",
    logged: logged,
    trend: trend,
    liN: liN,
    liDist: liDist,
    hoursAvg: hN >= 2 ? hS / hN : null,
    patterns: pats.slice(0, 3),
    insight: insight,
    main: main,
    comps: comps,
    reason: reason,
    demo: days.some(function (d) { return !!d.rec.demo; }),
  };
  mcDb.repCache[w] = payload;
  mcSave();
  return payload;
}

/* ---------- پیام‌های پس از ثبت (متنوع و متناسب، نه کلیشه) ---------- */
function mcSaveMsg(f) {
  const allGood = MC_CORE.every(function (i) { return f[i] !== null && f[i] !== undefined && f[i] >= 3; });
  const stHigh = f.st !== null && f.st !== undefined && f.st >= 3;
  const slLow = f.sl !== null && f.sl !== undefined && f.sl <= 1;
  const enLow = f.en !== null && f.en !== undefined && f.en <= 1;
  const pos = (f.f || []).indexOf("positive") > -1;
  if (allGood) return "روز خوبی ثبت شد. این ثبت‌ها به‌مرور نشان می‌دهند چه چیزهایی حالت را بهتر می‌کنند.";
  if (stHigh) return "ثبت شد — مرسی که حتی در روز پرتنش هم چند ثانیه برای خودت وقت گذاشتی. دیدنِ این روزها بخشی از شناختت است.";
  if (slLow) return "ثبت شد. شبِ کم‌خواب روی کل روز اثر می‌گذارد؛ همین که دیدی‌اش، قدم اول را برداشته‌ای.";
  if (enLow) return "ثبت شد. روزهای کم‌انرژی هم بخشی از روند تو هستند، نه شکست مسیر.";
  if (pos) return "ثبت شد؛ اتفاق خوب امروز هم در روندت ثبت شد. این‌ها را به‌مرور می‌شود دید و بیشتر ساخت.";
  const generic = [
    "ثبت شد؛ همین دقایق توجه، روند شناخت خودت را می‌سازند.",
    "ذخیره شد. لازم نیست هیچ چیز را ثابت کنی؛ فقط داری خودت را بهتر می‌بینی.",
    "ثبت امروز کنار بقیهٔ ثبت‌هایت قرار گرفت؛ به‌مرور الگوها روشن‌تر می‌شوند.",
    "ذخیره شد. هر ثبت کوچک، گزارش هفتگی را هوشمندتر می‌کند.",
  ];
  return generic[mcDb.saveCount % generic.length];
}

/* ---------- دادهٔ نمایشی (جدا و برچسب‌دار) ---------- */
function mcDemoSeed(jdn) {
  let x = (jdn * 2654435761) % 4294967296;
  x = (x ^ (x >> 13)) % 100;
  return Math.abs(x);
}
function mcAddDemo() {
  const t = mcTodayJdn();
  for (let d = t - 21; d <= t - 1; d++) {
    const k = mcKeyOfJdn(d);
    if (mcDb.entries[k] && !mcDb.entries[k].demo) continue; /* دادهٔ واقعی دست نمی‌خورد */
    const r = mcDemoSeed(d);
    const col = JAL.colOf(d);
    const midweek = col === 2 || col === 3;
    const weekend = col >= 5;
    const e = { demo: true, f: [] };
    if (midweek) {
      e.st = 2 + (r % 3); e.en = 1 + (r % 2); e.sl = 1 + (r % 2); e.mo = 1 + (r % 2);
      e.slH = 6 + (r % 2); e.f.push("work"); if (r % 4 === 0) e.f.push("sleep");
    } else if (weekend) {
      e.st = r % 2; e.en = 3 + (r % 2); e.sl = 3 + (r % 2); e.mo = 3 + (r % 2);
      e.slH = 7.5; if (r % 3 === 0) e.f.push("activity"); if (r % 5 === 0) e.f.push("positive");
    } else {
      e.st = 1 + (r % 2); e.en = 2 + (r % 2); e.sl = 2 + (r % 2); e.mo = 2 + (r % 3);
      e.slH = 7 + (r % 2) * 0.5; if (r % 3 === 0) e.f.push("work"); if (r % 4 === 0) e.f.push("activity");
    }
    e.li = r % 7 === 0 ? 0 : r % 7 === 3 ? 2 : 1;
    if (r % 11 === 0) e.note = "روزی شلوغ بود؛ ولی شب زودتر از همیشه خوابیدم.";
    if (r % 13 === 0) e.note = "پیاده‌روی عصر حالم را بهتر کرد.";
    mcDb.entries[k] = e;
  }
  mcDb.repCache = {};
  MC.picks = null;
  mcSave();
}
function mcRemoveDemo() {
  Object.keys(mcDb.entries).forEach(function (k) {
    if (mcDb.entries[k] && mcDb.entries[k].demo) delete mcDb.entries[k];
  });
  mcDb.repCache = {};
  MC.picks = null;
  mcSave();
}
function mcHasDemo() {
  return Object.keys(mcDb.entries).some(function (k) { return mcDb.entries[k] && mcDb.entries[k].demo; });
}
function mcTotalLogged() {
  return Object.keys(mcDb.entries).filter(function (k) { return mcIsLogged(mcDb.entries[k]); }).length;
}

/* ============================================================
   وضعیت رابط کاربری
   ============================================================ */
const MC = {
  sub: "home", /* home | checkin | report | content:<id> | library | history | settings | about */
  from: "home",
  step: 0,
  form: null,
  formDay: null,
  calOpen: false,
  calTab: "week", /* week | month */
  woff: 0, wy: null, wm: null,
  sel: null,
  weekOff: 0,
  chartInd: "mo",
  curCat: "all",
  obGoals: [],
  confDel: false, confForm: false, confReset: false, confHdel: null,
  picks: null,
  toast: null, toastT: 0,
};
function mcToast(msg) {
  MC.toast = msg;
  render(false);
  clearTimeout(MC.toastT);
  MC.toastT = setTimeout(function () {
    if (MC.toast === msg) {
      MC.toast = null;
      if (state.view === "mhcal") render(false);
    }
  }, 2800);
}

/* ============================================================
   نماها
   ============================================================ */
function mcalView() {
  if (!mcDb.profile.introDone) return shell(mcIntroHtml(false));
  const sub = MC.sub;
  let body;
  if (sub === "checkin") body = mcCheckinHtml();
  else if (sub === "report") body = mcReportHtml();
  else if (sub === "library") body = mcLibraryHtml();
  else if (sub === "history") body = mcHistoryHtml();
  else if (sub === "settings") body = mcSettingsHtml();
  else if (sub === "about") body = mcIntroHtml(true);
  else if (sub.indexOf("content:") === 0) body = mcContentHtml(sub.slice(8));
  else body = mcHomeHtml();
  return shell(`
  <section class="page"><div class="container mc-wrap">
    ${body}
    ${MC.toast ? `<div class="cy-toast mc-toast" role="status">${I.check}${esc(MC.toast)}</div>` : ""}
  </div></section>`);
}

function mcHeadBtns() {
  return `
  <div class="mc-headbtns">
    <button type="button" class="ibtn" data-mc="go" data-to="history" aria-label="تاریخچه و پیشنهادهای من">${MC_IC.list}</button>
    <button type="button" class="ibtn" data-mc="go" data-to="settings" aria-label="تنظیمات و حریم خصوصی">${MC_IC.gear}</button>
  </div>`;
}
function mcTopHead(sub) {
  return `
  <div class="backlink"><button data-nav="men">← بازگشت به سلامت مردان</button></div>
  <div class="page-head with-ico mc-headrow">
    <span class="head-ico mc-ico">${MC_IC.cal}</span>
    <div><h1>تقویم سلامت مردان</h1><p>${sub || "همراه شخصی برای شناخت بهتر خودت — بدون قضاوت و بدون فشار."}</p></div>
    ${mcHeadBtns()}
  </div>`;
}

/* ---------- معرفی اولیه ---------- */
function mcIntroHtml(about) {
  const img = function (f, alt, cls) {
    return `<img class="mc-intro-img ${cls || ""}" src="img/${f}?v=1" alt="${alt}" loading="lazy"/>`;
  };
  const goals = MC.obGoals && MC.obGoals.length ? MC.obGoals : mcDb.profile.goals || [];
  return `
  ${about ? `<div class="backlink"><button data-mc="go" data-to="home">→ بازگشت به داشبورد</button></div>` : ""}
  <div class="mc-intro">
    <figure class="mc-intro-hero">${img("mcal-hero-self.png", "مردی کنار پنجره در نور صبح با فنجان چای، در لحظه‌ای آرام و متمرکز بر خود", "wide")}
      <figcaption class="mc-intro-cap">سَمن · تقویم سلامت مردان</figcaption>
    </figure>
    <div class="mc-intro-txt">
      <h2>میان شلوغی زندگی،<br>خودت را فراموش نکن.</h2>
      <p>کار، مسئولیت‌ها و فشارهای روزمره گاهی فرصت توجه به خودمان را از ما می‌گیرند. حال جسم، آرامش ذهن، سلامت جنسی و کیفیت روابطمان هم از این فشارها تأثیر می‌پذیرند.</p>
      <p>سَمن اینجاست تا کمک کند دوباره به خودت توجه کنی؛ حال و نیازهایت را بهتر بشناسی، الگوهای زندگی‌ات را پیدا کنی و با قدم‌های کوچک و کاربردی، به رضایت بیشتری از خودت، زندگی و روابطت نزدیک شوی.</p>
    </div>
    <div class="mc-concepts">
      <div class="mc-concept">
        <div class="mc-concept-b">
          <h3>توجه به خود</h3>
          <p>هر روز چند انتخاب یک‌لمسی — کمتر از یک دقیقه. بدون امتیاز، بدون رتبه، بدون قضاوت.</p>
        </div>
        <span class="mc-concept-ico">${MC_IC.heart}</span>
      </div>
      <div class="mc-concept">
        ${img("mcal-calm.png", "مردی در فضای سبز با شانه‌های رها و چشمان بسته، در حال نفس کشیدن آرام")}
        <div class="mc-concept-b">
          <h3>آرامش و تعادل</h3>
          <p>روندهای خلق، انرژی، استرس و خوابت را در طول زمان می‌بینی و الگوهای زندگی‌ات را پیدا می‌کنی.</p>
        </div>
      </div>
      <div class="mc-concept">
        ${img("mcal-relate.png", "دو نفر کنار هم در نور ملایم غروب، در لحظه‌ای صمیمانه و آرام")}
        <div class="mc-concept-b">
          <h3>رضایت از زندگی و روابط</h3>
          <p>محتوای متناسب با وضعیت و هدف‌هایت؛ هر هفته چیزی تازه برای یادگرفتن و یک قدم کوچک برای انجام‌دادن.</p>
        </div>
      </div>
    </div>
    ${
      !about
        ? `
    <div class="mc-intro-goals">
      <h3>دوست داری این مسیر بیشتر روی چه چیزی متمرکز باشد؟ <span class="mut">— اختیاری</span></h3>
      <div class="mc-goalgrid">
        ${MC_GOALS.map(function (g) {
          const sel = goals.indexOf(g.id) > -1;
          return `<button type="button" class="mc-goal ${sel ? "on" : ""}" data-mc="obgoal" data-g="${g.id}" aria-pressed="${sel}">
            <b>${g.label}</b><span>${g.hint}</span>${sel ? `<span class="mc-goal-ck">${MC_IC.check}</span>` : ""}
          </button>`;
        }).join("")}
      </div>
      <p class="mc-intro-note">${MC_IC.info}<span>این انتخاب‌ها فقط برای تنظیم بهتر محتوا هستند و تعبیر پزشکی ندارند؛ هر وقت بخواهی از تنظیمات قابل تغییر است.</span></p>
    </div>
    <div class="mc-intro-cta">
      <button class="btn btn-primary btn-lg" data-mc="obfinish">شروع مسیر من ${MC_IC.chevL}</button>
      <p class="mc-intro-note">${MC_IC.lock}<span>اطلاعات تو فقط روی همین دستگاه (مرورگر خودت) ذخیره می‌شود و به هیچ سرویسی ارسال نمی‌شود. میل جنسی شاخصی کاملاً اختیاری است و می‌توانی در تنظیمات غیرفعالش کنی.</span></p>
      ${mcTotalLogged() ? `<p class="mc-intro-note">${MC_IC.check}<span>ثبت‌های قبلی‌ات از نسخهٔ پیشین منتقل شده و محفوظ است.</span></p>` : ""}
    </div>`
        : `<div class="mc-intro-cta"><button class="btn btn-secondary btn-lg" data-mc="go" data-to="home">بازگشت به داشبورد ${MC_IC.chevL}</button></div>`
    }
  </div>`;
}

/* ---------- داشبورد روزانه ---------- */
function mcGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "شبت آرام";
  if (h < 12) return "صبحت بخیر";
  if (h < 17) return "بعدازظهرت بخیر";
  return "شبت بخیر";
}
function mcTodayStatusLine() {
  const t = JAL.today();
  const k = JAL.keyOf(t.jy, t.jm, t.jd);
  const logged = mcIsLogged(mcDb.entries[k]);
  return logged ? "امروز هم به خودت رسیدگی کردی — ثبت امروز انجام شده." : "امروز یک فرصت تازه برای توجه به خودت هست.";
}
function mcValLabel(ind, v) {
  if (ind === "li") return v <= 2 ? MC_IND.li.opts[v] : MC_IND.li.extra[v - 3];
  return MC_IND[ind].opts[v];
}
function mcMoodColor(v) {
  /* رنگ حال: نامطلوب → آجری، متوسط → خنثی، خوب → سبز مریم‌گلی */
  if (v === null || v === undefined) return "#cfc8ba";
  if (v <= 1) return "#b25850";
  if (v === 2) return "#b3873c";
  return v === 3 ? "#527d57" : "#1e5b50";
}
function mcCheckinCard() {
  const t = JAL.today();
  const k = JAL.keyOf(t.jy, t.jm, t.jd);
  const rec = mcDb.entries[k];
  const logged = mcIsLogged(rec);
  const demo = rec && rec.demo;
  if (!logged) {
    return `
    <div class="card mc-checkin" id="mc-checkin">
      <span class="mc-kick">امروز</span>
      <h3 class="mc-ci-title">امروز حالت چطور است؟</h3>
      <p class="mc-ci-sub">کمتر از یک دقیقه برای توجه به خودت — همهٔ شاخص‌ها اختیاری‌اند و هیچ پاسخ «غلطی» وجود ندارد.</p>
      <button class="btn btn-primary btn-lg mc-ci-cta" data-mc="open">ثبت حال امروز ${MC_IC.chevL}</button>
    </div>`;
  }
  const rows = MC_CORE.filter(function (i) { return rec[i] !== undefined && rec[i] !== null; })
    .map(function (i) {
      return `<span class="mc-chip" style="border-color:${MC_IND[i].color}33;color:${MC_IND[i].color}"><b>${MC_IND[i].short}:</b> ${mcValLabel(i, rec[i])}</span>`;
    }).join("");
  const fChips = (rec.f || []).map(function (f) { return `<span class="mc-chip mut">${mcFactorLabel(f)}</span>`; }).join("");
  return `
  <div class="card mc-checkin done" id="mc-checkin">
    <div class="mc-ci-top">
      <span class="mc-kick">امروز <span class="badge b-pos">ثبت شد</span>${demo ? ' <span class="badge b-soon">نمونهٔ نمایشی</span>' : ""}</span>
      <span class="mut">${JAL.WD[JAL.colOf(JAL.keyToJdn(k))] + "، " + JAL.fmt(t)}</span>
    </div>
    <h3 class="mc-ci-title sm">مرسی که امروز هم به خودت رسیدگی کردی.</h3>
    <div class="mc-chips">${rows}</div>
    ${fChips ? `<div class="mc-chips">${fChips}</div>` : ""}
    ${rec.slH ? `<p class="mc-ci-hint">خواب ثبت‌شده: حدود ${faN(rec.slH)} ساعت</p>` : ""}
    ${rec.note ? `<p class="mc-ci-note">${esc(rec.note)}</p>` : ""}
    <div class="mc-ci-actions">
      <button class="btn btn-secondary" data-mc="open">ویرایش ثبت امروز ${MC_IC.pen}</button>
      <button type="button" class="mc-del ${MC.confForm ? "armed" : ""}" data-mc="fdel">${MC_IC.trash}<span>${MC.confForm ? "مطمئنی؟ این ثبت حذف شود" : "حذف"}</span></button>
    </div>
  </div>`;
}
function mcTrendCard() {
  const w = mcWeekStart(mcTodayJdn());
  const days = mcWeekDays(w).filter(function (d) { return mcIsLogged(d.rec); });
  const n = days.length;
  const chart = n ? mcLineChart(w, "mo", true) : "";
  const chips = [];
  MC_CORE.forEach(function (ind) {
    const a = mcAvgN(days, ind);
    if (a.n < 2) return;
    const prev = mcAvgN(mcWeekDays(w - 7), ind);
    let cmp = "";
    if (a.n >= 3 && prev.n >= 3) {
      const diff = (a.avg - prev.avg) * (MC_IND[ind].good === 4 ? 1 : -1);
      cmp = diff >= 0.4 ? ' <i class="mc-up">▲</i>' : diff <= -0.4 ? ' <i class="mc-down">▼</i>' : "";
    }
    chips.push(`<span class="mc-chip" style="border-color:${MC_IND[ind].color}33;color:${MC_IND[ind].color}"><b>${MC_IND[ind].name}:</b> میانگین ${faN(a.avg)} از ۴${cmp}</span>`);
  });
  return `
  <div class="card mc-trendcard">
    <div class="mc-card-head">
      <span class="mc-kick">هفت روز گذشته</span>
      <button type="button" class="mc-linkbtn" data-mc="go" data-to="report">گزارش کامل هفته ${MC_IC.chevL}</button>
    </div>
    ${
      n === 0
        ? `<p class="mc-empty-line">این هفته هنوز ثبتی نداری. حتی یک ثبت کوتاه، نمودارها را زنده می‌کند.</p>`
        : chart + `<div class="mc-chips">${chips.join("")}</div><p class="mc-trend-note">${fa(n)} روز از ۷ روز ثبت شده${mcHasDemo() ? " — شامل دادهٔ نمونهٔ نمایشی" : ""}. روزهای بدون ثبت، صفر فرض نمی‌شوند.</p>`
    }
  </div>`;
}

/* نمودار خطی مینیمال SVG — روزهای بدون ثبت داده صفر فرض نمی‌شوند */
function mcLineChart(w, ind, compact) {
  const W = 560, H = compact ? 150 : 210, padT = compact ? 14 : 20, padB = compact ? 26 : 40;
  const y0 = H - padB, yTop = padT;
  const step = (W - 40) / 6;
  const xOf = function (i) { return W - 20 - i * step; }; /* RTL: شنبه راست */
  const yOf = function (v) { return y0 - v * ((y0 - yTop) / 4); };
  const vals = [];
  for (let i = 0; i < 7; i++) vals.push(mcNum(ind, mcDb.entries[mcKeyOfJdn(w + i)]));
  const col = MC_IND[ind].color;
  let segs = "", pts = "";
  let run = [];
  function flush() {
    if (run.length >= 2) {
      segs += `<polyline points="${run.map(function (p) { return p.x + "," + p.y; }).join(" ")}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>`;
    }
    run = [];
  }
  for (let i = 0; i < 7; i++) {
    if (vals[i] === null) { flush(); continue; }
    const p = { x: xOf(i), y: yOf(vals[i]), v: vals[i] };
    run.push(p);
    pts += `<circle cx="${p.x}" cy="${p.y}" r="4.2" fill="${col}"><title>${JAL.WD[JAL.colOf(w + i)]} ${JAL.fmt(JAL.d2j(w + i))}: ${mcValLabel(ind, p.v)}</title></circle>`;
  }
  flush();
  let grid = "";
  for (let v = 0; v <= 4; v++) {
    grid += `<line x1="14" y1="${yOf(v)}" x2="${W - 14}" y2="${yOf(v)}" stroke="#eae3d5" stroke-width="1" ${v === 0 ? '' : 'stroke-dasharray="2 6"'}/>`;
    grid += `<text x="${W - 4}" y="${yOf(v) + 4}" font-size="10" fill="#8b8477" text-anchor="start">${fa(v)}</text>`;
  }
  const wds = [];
  for (let i = 0; i < 7; i++) wds.push(`<text x="${xOf(i)}" y="${H - 8}" font-size="11" fill="#8b8477" text-anchor="middle">${JAL.WDS[i]}</text>`);
  const cap = compact ? "" : `<text x="14" y="${yTop - 4}" font-size="10.5" fill="#8b8477">مقیاس ۰ تا ۴ — ${MC_IND[ind].opts[0]} ← ${MC_IND[ind].opts[4]}</text>`;
  return `
  <div class="mc-chart" role="img" aria-label="نمودار روند ${MC_IND[ind].name} در هفته">
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${grid}${segs}${pts}${wds}${cap}</svg>
  </div>`;
}

/* ---------- تقویم (بازشدنی) ---------- */
function mcCalendarCard() {
  const t = JAL.today();
  if (!MC.calOpen) {
    const strip = mcWeekStrip(mcWeekStart(mcTodayJdn()));
    return `
    <div class="card mc-calcard">
      <div class="mc-card-head">
        <span class="mc-kick">تقویم شخصی</span>
        <span class="mut">استمرار ۳۰ روز اخیر: ${fa(mcConsistency(mcTodayJdn()))} روز</span>
      </div>
      ${strip}
      <button type="button" class="mc-cal-open" data-mc="calopen">بازکردن تقویم کامل ${MC_IC.chevD}</button>
    </div>`;
  }
  const grid = MC.calTab === "week" ? mcWeekGrid() : mcMonthGrid();
  const tabs = `
  <div class="mc-caltabs" role="tablist">
    <button type="button" role="tab" aria-selected="${MC.calTab === "week"}" class="mc-caltab ${MC.calTab === "week" ? "on" : ""}" data-mc="caltab" data-t="week">هفتگی</button>
    <button type="button" role="tab" aria-selected="${MC.calTab === "month"}" class="mc-caltab ${MC.calTab === "month" ? "on" : ""}" data-mc="caltab" data-t="month">ماهانه</button>
  </div>`;
  return `
  <div class="card mc-calcard open">
    <div class="mc-card-head">
      <span class="mc-kick">تقویم شخصی</span>
      ${tabs}
    </div>
    ${grid}
    ${mcDayDetail()}
    <p class="mc-cal-note">ثبت‌نشدن یک روز هیچ معنایی جز «یک روز بدون ثبت» ندارد — نه امتیاز منفی، نه مسیرِ از دست رفته.</p>
  </div>`;
}
function mcWeekStrip(w) {
  let cells = "";
  for (let i = 0; i < 7; i++) {
    const jdn = w + i;
    const rec = mcDb.entries[mcKeyOfJdn(jdn)];
    const logged = mcIsLogged(rec);
    const isToday = jdn === mcTodayJdn();
    const col = logged ? mcMoodColor(rec && rec.mo !== undefined && rec.mo !== null ? rec.mo : null) : null;
    cells += `
    <button type="button" class="mc-strip-day ${isToday ? "today" : ""}" data-mc="calsel" data-k="${mcKeyOfJdn(jdn)}" aria-label="${JAL.WD[i]} — ${logged ? "ثبت‌شده" : "بدون ثبت"}">
      <span>${JAL.WDS[i]}</span>
      <i style="${logged ? "background:" + col : ""}"></i>
    </button>`;
  }
  return `<div class="mc-strip" role="group" aria-label="روند روزهای این هفته">${cells}</div>`;
}
function mcWeekGrid() {
  const w = mcWeekStart(mcTodayJdn()) + MC.woff * 7;
  let rows = "";
  for (let i = 0; i < 7; i++) {
    const jdn = w + i;
    const k = mcKeyOfJdn(jdn);
    const rec = mcDb.entries[k];
    const logged = mcIsLogged(rec);
    const isToday = jdn === mcTodayJdn();
    const sel = MC.sel === k;
    const nF = mcCountFields(rec);
    rows += `
    <button type="button" class="mc-wrow ${sel ? "sel" : ""} ${isToday ? "today" : ""}" data-mc="calsel" data-k="${k}" aria-label="${JAL.WD[i]} ${JAL.fmt(JAL.d2j(jdn))}">
      <span class="mc-wrow-d"><b>${JAL.WD[i]}</b><span>${JAL.fmt(JAL.d2j(jdn))}</span></span>
      <span class="mc-wrow-s">${isToday ? '<span class="badge b-info">امروز</span>' : ""}
        ${logged ? `<i class="mc-dot" style="background:${mcMoodColor(rec && rec.mo !== undefined && rec.mo !== null ? rec.mo : null)}"></i><span class="mut">${fa(nF)} شاخص</span>` : '<span class="mut faint">بدون ثبت</span>'}
      </span>
    </button>`;
  }
  return `
  <div class="mc-wnav">
    <button type="button" class="mh-mbtn" data-mc="woff" data-d="-1" aria-label="هفتهٔ قبل">${MC_IC.chevR}</button>
    <b>${mcWeekLabel(w)}</b>
    <button type="button" class="mh-mbtn" data-mc="woff" data-d="1" aria-label="هفتهٔ بعد" ${MC.woff >= 0 ? "disabled" : ""}>${MC_IC.chevL}</button>
    ${MC.woff !== 0 ? '<button type="button" class="mh-today-btn" data-mc="wtoday">امروز</button>' : ""}
  </div>
  <div class="mc-wrows">${rows}</div>`;
}
function mcMonthGrid() {
  if (MC.wy === null) { const t = JAL.today(); MC.wy = t.jy; MC.wm = t.jm; }
  const first = JAL.j2d(MC.wy, MC.wm, 1);
  const gridStart = first - JAL.colOf(first);
  const tJdn = mcTodayJdn();
  let cells = "";
  for (let i = 0; i < 42; i++) {
    const j = gridStart + i;
    const jj = JAL.d2j(j);
    const k = JAL.keyOf(jj.jy, jj.jm, jj.jd);
    const dim = jj.jm !== MC.wm || jj.jy !== MC.wy;
    const rec = mcDb.entries[k];
    const logged = mcIsLogged(rec);
    let cls = "mh-cell";
    if (dim) cls += " dim";
    if (logged) cls += " hasrec";
    if (j === tJdn) cls += " today";
    if (k === MC.sel) cls += " sel";
    const col = logged && rec.mo !== undefined && rec.mo !== null ? mcMoodColor(rec.mo) : null;
    cells += `<button type="button" class="${cls}" data-mc="calsel" data-k="${k}" aria-label="${JAL.WD[JAL.colOf(j)]} ${JAL.fmt(jj)}${j === tJdn ? " — امروز" : ""}"><span>${fa(jj.jd)}</span>${logged ? `<i class="mc-dot" style="${col ? "background:" + col : ""}"></i>` : ""}</button>`;
  }
  const wds = JAL.WDS.map(function (x) { return `<span class="mh-wd">${x}</span>`; }).join("");
  return `
  <div class="mh-mbar">
    <button type="button" class="mh-mbtn" data-mc="mprev" aria-label="ماه قبل">${MC_IC.chevR}</button>
    <div class="mh-mtitle"><b>${JAL.MONTHS[MC.wm - 1]} ${fa(MC.wy)}</b><button type="button" class="mh-today-btn" data-mc="wtoday">امروز</button></div>
    <button type="button" class="mh-mbtn" data-mc="mnext" aria-label="ماه بعد">${MC_IC.chevL}</button>
  </div>
  <div class="mh-grid mh-wds">${wds}</div>
  <div class="mh-grid">${cells}</div>
  <div class="mh-legend"><span class="mh-lg"><i class="i-full"></i>روز دارای ثبت</span><span class="mh-lg">رنگ نقطه = حال کلی</span><span class="mh-lg"><i class="i-today"></i>امروز</span></div>`;
}
function mcDayDetail() {
  if (!MC.sel) return "";
  const k = MC.sel;
  const jdn = JAL.keyToJdn(k);
  const j = JAL.keyToJ(k);
  const isToday = jdn === mcTodayJdn();
  const rec = mcDb.entries[k];
  const head = `<div class="mc-day-h"><b>${JAL.WD[JAL.colOf(jdn)]}، ${JAL.fmt(j)}</b>${isToday ? '<span class="badge b-info">امروز</span>' : ""}${rec && rec.demo ? '<span class="badge b-soon">نمونهٔ نمایشی</span>' : ""}</div>`;
  if (!mcIsLogged(rec)) {
    return `
    <div class="mc-daydetail empty">
      ${head}
      <p>برای این روز چیزی ثبت نشده است — و همین کافی است. اگر خواستی، همین حالا چند انتخاب کوتاه انجام بده.</p>
      <button type="button" class="btn btn-secondary" data-mc="openk" data-k="${k}">ثبت برای این روز ${MC_IC.chevL}</button>
    </div>`;
  }
  const rows = MC_CORE.filter(function (i) { return rec[i] !== undefined && rec[i] !== null; })
    .map(function (i) { return `<div class="mh-row"><b style="color:${MC_IND[i].color}">${MC_IND[i].name}</b><div>${mcValLabel(i, rec[i])}</div></div>`; })
    .join("");
  const liRow = rec.li !== undefined && rec.li !== null
    ? `<div class="mh-row"><b style="color:${MC_IND.li.color}">${MC_IND.li.name}</b><div>${mcValLabel("li", rec.li)}</div></div>`
    : "";
  const fRow = (rec.f || []).length ? `<div class="mh-row"><b>عوامل</b><div>${(rec.f || []).map(mcFactorLabel).join("، ")}</div></div>` : "";
  const hRow = rec.slH ? `<div class="mh-row"><b>مدت خواب</b><div>حدود ${faN(rec.slH)} ساعت</div></div>` : "";
  const noteRow = rec.note ? `<div class="mh-row note"><b>یادداشت</b><div>${esc(rec.note)}</div></div>` : "";
  return `
  <div class="mc-daydetail">
    ${head}
    <div class="mh-rows">${rows}${liRow}${fRow}${hRow}${noteRow}</div>
    <div class="mh-actions">
      <button type="button" class="btn btn-secondary" data-mc="openk" data-k="${k}">${MC_IC.pen} ویرایش ثبت این روز</button>
      <button type="button" class="mc-del ${MC.confDel === k ? "armed" : ""}" data-mc="delk" data-k="${k}">${MC_IC.trash}<span>${MC.confDel === k ? "مطمئنی؟ این ثبت حذف شود" : "حذف ثبت"}</span></button>
    </div>
  </div>`;
}

/* ---------- پیشنهاد امروز ---------- */
function mcContentRow(c, opts) {
  const o = opts || {};
  const cat = MC_CATS[c.cat];
  const h = mcDb.contentHist[c.id] || {};
  /* نشان وضعیت بازبینی فقط برای محتوای «در انتظار بازبینی» نمایش داده می‌شود —
     شفافیت بدون نویز؛ صفحهٔ جزئیات همیشه وضعیت کامل را نشان می‌دهد (اصلاح مرحلهٔ ۱:
     قبلاً این متغیر محاسبه می‌شد ولی هرگز در ردیف رندر نمی‌شد — متغیر مرده) */
  const review = c.review === "ok"
    ? ""
    : '<span class="badge b-warn">در انتظار بازبینی</span>';
  return `
  <div class="mc-crec ${o.role || ""}">
    <div class="mc-crec-top">
      <span class="mc-catpill" style="background:${cat.soft};color:${cat.color}">${cat.name}</span>
      <span class="mc-tag">${MC_IC.clock} ${c.dur}</span>
      ${review}
    </div>
    <h4>${c.title}${o.saved ? ' <span class="badge b-info">ذخیره‌شده</span>' : ""}${h.done && h.done.length ? ` <span class="mh-done-badge">${fa(h.done.length)}× انجام شد</span>` : ""}</h4>
    <p>${c.sum}</p>
    <div class="mc-crec-foot">
      <button type="button" class="btn btn-secondary" data-mc="opencontent" data-id="${c.id}">${o.review ? "مرور مجدد" : "باز کردن"} ${MC_IC.chevL}</button>
    </div>
  </div>`;
}
function mcFbRow(id) {
  const h = mcDb.contentHist[id] || {};
  if (h.fb && (h.fb.type === "up" || h.fb.type === "down")) {
    return `<div class="mc-fb done">${h.fb.type === "up" ? "بازخوردت ثبت شد — از پیشنهادهای مشابه ادامه می‌دهیم." : "ثبت شد؛ موارد مشابه دیگر پیشنهاد نمی‌شوند."}</div>`;
  }
  return `
  <div class="mc-fb">
    <button type="button" data-mc="cfb" data-id="${id}" data-f="up">${MC_IC.check} مفید بود</button>
    <button type="button" data-mc="cfb" data-id="${id}" data-f="down">${MC_IC.alert} مرتبط نبود</button>
    <button type="button" data-mc="csave" data-id="${id}" ${h.saved ? 'class="on"' : ""}>${MC_IC.clip} ${h.saved ? "ذخیره شد" : "ذخیره"}</button>
  </div>`;
}
function mcSuggestionCard() {
  const picks = mcGetPicks();
  if (!picks.main) {
    return `
    <div class="card mc-sugcard">
      <div class="mc-card-head"><span class="mc-kick">پیشنهاد امروز</span></div>
      <p class="mc-empty-line">همهٔ قدم‌های مناسبِ این هفته را دیده‌ای. از کتابخانهٔ محتوا هر موردی را که می‌خواهی دوباره مرور کن — بازدید مجدد، «توصیهٔ جدید» حساب نمی‌شود.</p>
      <button type="button" class="btn btn-secondary" data-mc="go" data-to="library">کتابخانهٔ محتوا ${MC_IC.chevL}</button>
    </div>`;
  }
  const main = mcContent(picks.main);
  const comps = picks.comps.map(function (id) { return mcContent(id); }).filter(Boolean);
  return `
  <div class="card mc-sugcard">
    <div class="mc-card-head"><span class="mc-kick">پیشنهاد امروز</span><span class="mut">یک قدم اصلی + حداکثر دو مطالعهٔ تکمیلی</span></div>
    ${mcContentRow(main, { role: "main" })}
    <p class="mc-sug-why">${MC_IC.bulb}<span>${esc(picks.reason)}</span></p>
    ${mcFbRow(main.id)}
    ${comps.length ? `<div class="mc-comps">${comps.map(function (c) { return mcContentRow(c, { role: "comp" }); }).join("")}</div>` : ""}
    <button type="button" class="mc-linkbtn wide" data-mc="go" data-to="library">همهٔ مطالب و تمرین‌ها ${MC_IC.chevL}</button>
  </div>`;
}

/* ---------- کارت گزارش هفتگی + محتوای هدف‌محور (ستون کنار) ---------- */
function mcTeaserCard() {
  const w = mcWeekStart(mcTodayJdn());
  const rep = mcBuildReport(w);
  const n = rep.logged;
  let line;
  if (rep.insight) line = rep.insight.text.length > 130 ? rep.insight.text.slice(0, 128) + "…" : rep.insight.text;
  else if (n === 0) line = "این هفته هنوز گزارشی ساخته نشده؛ با اولین ثبت، گزارش زنده ساخته می‌شود.";
  else line = "گزارش این هفته آماده است؛ روند شاخص‌ها و پیشنهاد هفتهٔ بعد داخل است.";
  return `
  <div class="card mc-teaser">
    <span class="mc-kick">گزارش و بینش هفتگی</span>
    <p class="mc-teaser-line">${line}</p>
    <button type="button" class="btn btn-primary" data-mc="go" data-to="report">مشاهدهٔ گزارش ${MC_IC.chevL}</button>
  </div>`;
}
function mcGoalCard() {
  const goals = mcDb.profile.goals || [];
  const curW = mcWeekStart(mcTodayJdn());
  const cands = [];
  MC_CONTENT.forEach(function (c) {
    if (c.type !== "edu") return;
    if (!mcCondOk(c)) return;
    if (!goals.length) return;
    if (!(c.goal || []).some(function (g) { return goals.indexOf(g) > -1; })) return;
    const lastW = mcLastShownWeek(c.id);
    let sc = 1;
    if (lastW === null) sc += 3;
    else sc += Math.min(2.5, (curW - lastW) / 7);
    if (c.review === "ok") sc += 0.4;
    cands.push({ c: c, sc: sc });
  });
  cands.sort(function (a, b) { return b.sc - a.sc; });
  const items = cands.slice(0, 2);
  return `
  <div class="card mc-goalcard">
    <span class="mc-kick">متناسب با هدف تو</span>
    ${
      items.length
        ? items.map(function (x) { return mcContentRow(x.c, {}); }).join("")
        : `<p class="mc-empty-line">${
            goals.length
              ? "فعلاً مطلب تازه‌ای برای این هدف نداریم؛ کتابخانه را مرور کن."
              : "هنوز هدفی انتخاب نکرده‌ای (اختیاری). با انتخاب هدف، محتوای این بخش متناسب‌تر می‌شود."
          }</p>${goals.length ? "" : '<button type="button" class="btn btn-secondary" data-mc="go" data-to="settings">انتخاب هدف</button>'}`
    }
  </div>`;
}
function mcHomeHtml() {
  const t = JAL.today();
  return `
  ${mcTopHead()}
  <p class="mc-date-line"><b>${JAL.WD[JAL.colOf(JAL.j2d(t.jy, t.jm, t.jd))]}</b>، ${JAL.fmt(t)} · ${mcGreeting()} — ${mcTodayStatusLine()}</p>
  <div class="mc-hgrid">
    <div class="mc-a-checkin">${mcCheckinCard()}</div>
    <div class="mc-a-trend">${mcTrendCard()}</div>
    <div class="mc-a-cal">${mcCalendarCard()}</div>
    <div class="mc-a-sug">${mcSuggestionCard()}</div>
    <div class="mc-a-aside">
      ${mcTeaserCard()}
      ${mcGoalCard()}
      <div class="note">${MC_IC.lock}<span>هیچ شاخصی در این بخش معیار مردانگی یا تشخیص پزشکی نیست. داده‌ها فقط روی همین دستگاه ذخیره می‌شود؛ شاخص میل جنسی کاملاً اختیاری است و در تنظیمات قابل غیرفعال‌کردن است.</span></div>
    </div>
  </div>`;
}

/* ---------- فرم ثبت روزانه (گام‌به‌گام، آرام) ---------- */
function mcOpenForm(k) {
  const r = mcDb.entries[k] || {};
  MC.form = { mo: null, en: null, st: null, sl: null, slH: null, f: [], li: null, note: "" };
  MC_CORE.forEach(function (i) { if (r[i] !== undefined && r[i] !== null) MC.form[i] = r[i]; });
  if (r.li !== undefined && r.li !== null) MC.form.li = r.li;
  if (r.slH) MC.form.slH = r.slH;
  if (r.f) MC.form.f = r.f.slice();
  if (r.note) MC.form.note = r.note;
  MC.formDay = k;
  MC.step = 0;
  MC.confForm = false;
  MC.sub = "checkin";
  render();
}
function mcCheckinSteps() {
  const steps = ["mo", "en", "st", "sl", "fn"];
  if (mcDb.profile.libidoOn) steps.push("li");
  return steps;
}
function mcScaleHtml(ind, val) {
  const m = MC_IND[ind];
  const goodDir = m.good === 4;
  return `
  <div class="mc-scale" role="radiogroup" aria-label="${m.name}">
    ${m.opts.map(function (o, i) {
      const sel = val === i;
      const col = goodDir ? mcMoodColor(i) : mcMoodColor(4 - i);
      return `<button type="button" class="mc-scale-opt ${sel ? "sel" : ""}" role="radio" aria-checked="${sel}" data-mc="fsel" data-i="${ind}" data-v="${i}" style="--c:${col}">
        <i style="width:${8 + i * 4}px;height:${8 + i * 4}px"></i><span>${o}</span>
      </button>`;
    }).join("")}
  </div>`;
}
function mcLiScaleHtml(val) {
  const all = [0, 1, 2, MC_LI_SKIP, MC_LI_PREF];
  return `
  <div class="mc-scale li" role="radiogroup" aria-label="${MC_IND.li.name}">
    ${all.map(function (i) {
      const sel = val === i;
      const lbl = i <= 2 ? MC_IND.li.opts[i] : MC_IND.li.extra[i - 3];
      return `<button type="button" class="mc-scale-opt li ${sel ? "sel" : ""}" role="radio" aria-checked="${sel}" data-mc="fsel" data-i="li" data-v="${i}">
        <span>${lbl}</span>
      </button>`;
    }).join("")}
  </div>`;
}
function mcCheckinHtml() {
  const steps = mcCheckinSteps();
  if (MC.step === 99) {
    /* صفحهٔ پس از ثبت */
    const msg = MC._saveMsg || "ثبت شد.";
    return `
    ${mcTopHead("یک قدم کوچک، هر بار")}
    <div class="card mc-donecard">
      <span class="mc-done-ico">${MC_IC.check}</span>
      <h3>${esc(msg)}</h3>
      <p class="mc-done-tip">${MC._tip || ""}</p>
      <div class="mc-ci-actions center">
        <button class="btn btn-primary" data-mc="godone">بازگشت به داشبورد ${MC_IC.chevL}</button>
      </div>
    </div>`;
  }
  if (MC.step >= steps.length) MC.step = steps.length - 1;
  const key = steps[MC.step];
  const f = MC.form;
  const j = JAL.keyToJ(MC.formDay);
  const isToday = MC.formDay === mcKeyOfJdn(mcTodayJdn());
  const existing = mcIsLogged(mcDb.entries[MC.formDay]);
  const dots = steps.map(function (s, i) { return `<span class="mc-dotstep ${i === MC.step ? "on" : ""} ${i < MC.step ? "past" : ""}"></span>`; }).join("");
  let body = "", footNext = true;
  if (key === "mo" || key === "en" || key === "st" || key === "sl") {
    const m = MC_IND[key];
    const sub = key === "sl" ? `<p class="mc-f-sub">ارقام دقیق مهم نیستند؛ حس کلی دیشب کافی است. ثبت مدت خواب اختیاری است.</p>` : "";
    body = `
    <div class="mc-f-q"><h3>${m.q}</h3>${sub}</div>
    ${mcScaleHtml(key, f[key])}
    ${key === "sl" ? `<label class="mc-hours">مدت خواب دیشب (اختیاری): <input type="number" inputmode="decimal" min="0" max="16" step="0.5" value="${f.slH != null ? f.slH : ""}" data-mch="slH" aria-label="مدت خواب به ساعت"/> <span>ساعت</span></label>` : ""}`;
  } else if (key === "fn") {
    body = `
    <div class="mc-f-q"><h3>چه عواملی روی حال امروزت اثر گذاشت؟ <span class="mut">— اختیاری</span></h3></div>
    <div class="mc-fchips">
      ${MC_FACTORS.map(function (x) {
        const sel = f.f.indexOf(x.id) > -1;
        return `<button type="button" class="mc-chip ${sel ? "sel" : ""}" data-mc="fsel" data-i="f" data-v="${x.id}" aria-pressed="${sel}">${x.label}</button>`;
      }).join("")}
    </div>
    <label class="mc-notelab">یادداشت کوتاه برای خودت (اختیاری):
      <textarea rows="3" maxlength="300" data-mch="note" placeholder="مثلاً: روز فشرده‌ای بود، ولی عصر کمی پیاده‌روی کردم…">${esc(f.note || "")}</textarea>
    </label>`;
  } else if (key === "li") {
    footNext = false;
    body = `
    <div class="mc-f-q private">
      <h3>${MC_IND.li.q}</h3>
      <p class="mc-f-sub">${MC_IC.lock} این شاخص کاملاً اختیاری است و با عملکرد جنسی، تعداد روابط یا رضایت از رابطه یکی محسوب نمی‌شود؛ کاهش یا افزایش میل به‌تنهایی نشانهٔ بیماری نیست. پاسخ «ترجیح می‌دهم ثبت نکنم» با «کمتر از معمول» و با «بدون ثبت» کاملاً متفاوت ذخیره می‌شود.</p>
    </div>
    ${mcLiScaleHtml(f.li)}
    <button type="button" class="mc-linkbtn" data-mc="libidooff">این شاخص را در ثبت روزانه غیرفعال کن (در تنظیمات هم هست)</button>`;
  }
  const canSave = (function () {
    let any = false;
    MC_CORE.forEach(function (i) { if (f[i] !== null && f[i] !== undefined) any = true; });
    if (f.li !== null && f.li !== undefined) any = true;
    if (f.f.length) any = true;
    return any;
  })();
  return `
  ${mcTopHead(isToday ? "ثبت حال امروز" : "ویرایش ثبت")}
  <div class="card mc-formcard">
    <div class="mc-form-head">
      <span class="mc-kick">${isToday ? "ثبت جدید" : "ویرایش ثبت"} — ${JAL.WD[JAL.colOf(JAL.keyToJdn(MC.formDay))]} ${JAL.fmt(j)}</span>
      <div class="mc-dotsteps" aria-hidden="true">${dots}</div>
    </div>
    ${body}
    <div class="mc-form-foot">
      ${MC.step > 0 ? '<button type="button" class="btn btn-ghost" data-mc="fprev">قبلی</button>' : '<button type="button" class="btn btn-ghost" data-mc="fclose">انصراف</button>'}
      ${MC.step < steps.length - 1 ? `<button type="button" class="btn btn-secondary" data-mc="fskip">فعلاً نه</button>` : ""}
      ${
        footNext && MC.step < steps.length - 1
          ? `<button type="button" class="btn btn-primary" data-mc="fnext">بعدی ${MC_IC.chevL}</button>`
          : `<button type="button" class="btn btn-primary" data-mc="fsave" ${canSave ? "" : "disabled"}>${existing ? "ذخیرهٔ تغییرها" : "ذخیرهٔ وضعیت امروز"}</button>`
      }
    </div>
    ${MC.step > 0 && canSave && footNext && MC.step < steps.length - 1 ? '<button type="button" class="mc-linkbtn wide" data-mc="fsave">همین‌ها کافی است — ذخیره کن</button>' : ""}
    ${existing && MC.step === 0 ? `<button type="button" class="mc-del ${MC.confForm ? "armed" : ""}" data-mc="fdel">${MC_IC.trash}<span>${MC.confForm ? "مطمئنی؟ این ثبت حذف شود" : "حذف ثبت این روز"}</span></button>` : ""}
    <p class="mc-f-priv">${MC_IC.lock}<span>هر شاخص اختیاری است؛ با انتخاب دوباره، انتخاب قبلی برداشته می‌شود. این اطلاعات فقط روی همین دستگاه ذخیره می‌شود و به هیچ سرویسی ارسال نمی‌شود.</span></p>
  </div>`;
}

/* ---------- گزارش هفتگی ---------- */
function mcReportHtml() {
  const curW = mcWeekStart(mcTodayJdn());
  const w = curW + MC.weekOff * 7;
  const isCurrent = MC.weekOff === 0;
  const rep = mcBuildReport(w);
  const nav = `
  <div class="mc-wnav big">
    <button type="button" class="mh-mbtn" data-mc="repw" data-d="-1" aria-label="هفتهٔ قبل" ${MC.weekOff <= -13 ? "disabled" : ""}>${MC_IC.chevR}</button>
    <div class="mc-wtitle"><b>گزارش هفتهٔ ${mcWeekLabel(w)}</b>${isCurrent ? '<span class="badge b-info">هفتهٔ جاری</span>' : ""}${rep.demo ? '<span class="badge b-soon">شامل دادهٔ نمایشی</span>' : ""}</div>
    <button type="button" class="mh-mbtn" data-mc="repw" data-d="1" aria-label="هفتهٔ بعد" ${isCurrent ? "disabled" : ""}>${MC_IC.chevL}</button>
  </div>`;
  if (rep.logged === 0 && isCurrent) {
    return nav + `
    <div class="card mc-rep-sec">
      <h3 class="mc-rep-h">هنوز برای این هفته گزارشی نیست — و این طبیعی است.</h3>
      <p>گزارش هفتگی از ثبت‌های واقعی خودت ساخته می‌شود؛ نه از دادهٔ ساختگی. با اولین ثبت، همین گزارش به‌صورت زنده ساخته می‌شود.</p>
      <button type="button" class="btn btn-primary" data-mc="open">ثبت حال امروز ${MC_IC.chevL}</button>
    </div>`;
  }
  /* کارت ۱ — تصویر کلی هفته */
  const n = rep.logged;
  const ach =
    n === 0
      ? "این هفته ثبت متوالی نداشتی. هر زمان آماده بودی می‌توانی دوباره شروع کنی؛ مسیر از همان‌جا ادامه پیدا می‌کند."
      : n === 1
        ? "این هفته یک روز را ثبت کردی؛ همین شروع کوچک ارزشمند است."
        : n <= 4
          ? `این هفته ${fa(n)} روز از ۷ روز را ثبت کردی. داری عادتی می‌سازی که روندت را قابل‌دیدن می‌کند.`
          : `این هفته ${fa(n)} روز از ۷ روز را ثبت کردی؛ استمراری که پایهٔ یک روند واقعی است.`;
  const trendChips = rep.trend
    .filter(function (t) { return t.n > 0; })
    .map(function (t) {
      const cmp = t.cmp ? ` <i class="${t.cmp === "up" ? "mc-up" : t.cmp === "down" ? "mc-down" : "mc-flat"}">${t.cmp === "up" ? "▲" : t.cmp === "down" ? "▼" : "•"}</i>` : "";
      return `<span class="mc-chip" style="border-color:${MC_IND[t.ind].color}33;color:${MC_IND[t.ind].color}"><b>${MC_IND[t.ind].short}:</b> میانگین ${faN(t.avg)} از ۴${cmp}</span>`;
    }).join("");
  const liDistHtml = rep.liN
    ? `<div class="mc-chips"><span class="mc-chip mut"><b>میل جنسی:</b> ${Object.keys(rep.liDist).map(function (l) { return l + " ×" + fa(rep.liDist[l]); }).join("، ")}</span></div>`
    : "";
  const keyObs = rep.patterns.length
    ? rep.patterns[0].text
    : n >= 3
      ? "در ثبت‌های این هفته الگوی مشخصی دیده نشد؛ با ادامهٔ ثبت، مشاهده‌های شخصی‌تر شکل می‌گیرند."
      : "با تعداد ثبت‌های فعلی، هنوز برای مشاهدهٔ الگو زود است.";
  const hoursHtml = rep.hoursAvg ? `<p class="mc-hoursline">میانگین خواب ثبت‌شده‌ات این هفته: حدود ${faN(rep.hoursAvg)} ساعت در شبانه‌روز</p>` : "";
  const card1 = `
  <div class="card mc-rep-sec">
    <span class="mc-kick">تصویر کلی هفته</span>
    <p class="mc-ach">${ach}</p>
    ${trendChips ? `<div class="mc-chips">${trendChips}</div>` : ""}
    ${liDistHtml}
    ${hoursHtml}
    <p class="mc-keyobs"><b>مهم‌ترین مشاهدهٔ هفته:</b> ${keyObs}</p>
    ${!isCurrent ? "" : n < 7 ? '<p class="mc-midnote">گزارش میان‌هفته است و با ثبت‌های بعدی به‌روز می‌شود.</p>' : ""}
  </div>`;
  /* کارت ۲ — نمودار روند با تب شاخص‌ها */
  const tabs = ["mo", "en", "st", "sl"].concat(mcDb.profile.libidoOn ? ["li"] : []);
  const chart = mcLineChart(w, MC.chartInd, false);
  const tabBtns = tabs.map(function (ind) {
    return `<button type="button" class="mc-caltab ${MC.chartInd === ind ? "on" : ""}" data-mc="chartind" data-i="${ind}" aria-pressed="${MC.chartInd === ind}">${MC_IND[ind].short}</button>`;
  }).join("");
  const card2 = `
  <div class="card mc-rep-sec">
    <span class="mc-kick">روند هفته</span>
    <div class="mc-caltabs inline">${tabBtns}</div>
    ${chart}
    <p class="mc-chart-cap">نمودار «${MC_IND[MC.chartInd].name}» در ۷ روز — روزهای بدون ثبت داده صفر فرض نمی‌شوند و در خط نمایش داده نمی‌شوند. ${MC.chartInd === "st" ? "برای فشار روانی عدد بالاتر یعنی فشار بیشتر." : "عدد بالاتر یعنی وضعیت بهتر."}${mcDb.profile.libidoOn && MC.chartInd === "li" ? " میل مقیاس توصیفی دارد و «بهتر/بدتر» ندارد." : ""}</p>
  </div>`;
  /* کارت ۳ — الگوها */
  const patsHtml = rep.patterns.length
    ? rep.patterns.map(function (p) { return `<div class="mc-pattern">${MC_IC.spark}<p>${p.text}</p></div>`; }).join("") + '<p class="mc-midnote">این‌ها مشاهده‌های اکتشافی از دادهٔ خودت است؛ هم‌زمانی دو چیز به معنی علت‌ومعلولی آن‌ها نیست. برای مقایسهٔ عوامل، حداقل ۳ روز در هر گروه لازم است و دادهٔ طولانی‌تر نتیجهٔ پایدارتر می‌دهد.</p>'
    : `<p>با دادهٔ فعلی، الگوی قابل‌اعتمادی شناسایی نشد. مشاهدهٔ الگوها معمولاً از هفته‌ای با ۴–۵ ثبت شروع می‌شود.</p>`;
  const card3 = `
  <div class="card mc-rep-sec">
    <span class="mc-kick">چه الگوهایی دیده می‌شود؟</span>
    ${patsHtml}
  </div>`;
  /* کارت ۴ — بینش ویژه */
  const card4 = `
  <div class="card mc-rep-sec insight">
    <span class="mc-kick">چیزی که این هفته دربارهٔ خودت یاد گرفتی</span>
    ${
      rep.insight
        ? `${rep.insight.cont ? '<span class="badge b-info">ادامهٔ روند هفتهٔ گذشته</span>' : '<span class="badge b-pos">بینش تازه</span>'}
           <p class="mc-insight-txt">${rep.insight.text}</p>
           ${rep.insight.next ? `<p class="mc-insight-next">${rep.insight.next}</p>` : ""}`
        : `<p class="mc-insight-txt">این هفته الگوی متمایز تازه‌ای مشخص نشد — و ساخت یک یافتهٔ غیرواقعی به‌دردت نمی‌خورد. تمرکز هفتهٔ بعد روی یک اقدام مفید است.</p>`
    }
  </div>`;
  /* کارت ۵ — پیشنهاد هفتهٔ بعد (فقط هفتهٔ جاری تازه است) */
  let card5;
  if (!isCurrent) {
    card5 = `
    <div class="card mc-rep-sec">
      <span class="mc-kick">پیشنهاد همان هفته (مرور)</span>
      ${rep.main ? mcContentRow(mcContent(rep.main), { role: "main", review: true }) : '<p>برای این هفته پیشنهادی ثبت نشده است.</p>'}
      ${rep.reason ? `<p class="mc-sug-why">${MC_IC.bulb}<span>${esc(rep.reason)}</span></p>` : ""}
      ${(rep.comps || []).map(function (id) { return mcContentRow(mcContent(id), { role: "comp", review: true }); }).join("")}
    </div>`;
  } else {
    card5 = `
    <div class="card mc-rep-sec">
      <span class="mc-kick">اقدام پیشنهادی هفتهٔ بعد</span>
      ${rep.main ? mcContentRow(mcContent(rep.main), { role: "main" }) : '<p>همهٔ قدم‌های مناسب این هفته را دیده‌ای؛ از کتابخانه انتخاب کن.</p>'}
      ${rep.reason ? `<p class="mc-sug-why">${MC_IC.bulb}<span>${esc(rep.reason)}</span></p>` : ""}
      ${(rep.comps || []).map(function (id) { return mcContentRow(mcContent(id), { role: "comp" }); }).join("")}
      <p class="mc-midnote">پیشنهادها از ثبت‌های تو، هدف‌هایت و سابقهٔ بازخوردت ساخته می‌شوند؛ هر محتوا تا ۲۸ روز به‌عنوان پیشنهاد تازه تکرار نمی‌شود.</p>
    </div>`;
  }
  /* کارت ۶ — بازخورد */
  const fb = mcDb.repFb[w];
  const card6 = `
  <div class="card mc-rep-sec">
    <span class="mc-kick">بازخورد تو</span>
    <p>این گزارش چقدر برایت مفید بود؟</p>
    ${
      fb
        ? `<div class="mc-fb done">ثبت شد — انتخاب گزارش‌ها و پیشنهادهای بعدی با همین بازخوردها تنظیم می‌شود.</div>`
        : `<div class="mc-fb repfb">
        <button type="button" data-mc="repfb" data-f="useful">مفید بود</button>
        <button type="button" data-mc="repfb" data-f="partial">تا حدی مفید بود</button>
        <button type="button" data-mc="repfb" data-f="irrelevant">مرتبط نبود</button>
        <button type="button" data-mc="repfb" data-f="knew">این موضوع را قبلاً می‌دانستم</button>
      </div>`
    }
  </div>`;
  return nav + card1 + card2 + card3 + card4 + card5 + card6;
}

/* ---------- صفحهٔ محتوا ---------- */
const MC_IMG = {
  "rec-breath": { f: "mcal-c-breath.png", alt: "مردی در حال تمرین تنفس آرام روی فرش، با دست‌ها روی سینه و شکم" },
  "rec-sleep-routine": { f: "mcal-c-sleep.png", alt: "اتاق‌خواب آرام شبانه با چراغ کم‌نور، تخت مرتب و کتاب کنار تخت" },
  "rec-sleep-wind": { f: "mcal-c-sleep.png", alt: "اتاق‌خواب آرام شبانه با چراغ کم‌نور، تخت مرتب و کتاب کنار تخت" },
  "rec-walkplan": { f: "mcal-c-walk.png", alt: "مردی با شانه‌های رها در مسیری سبز در حال پیاده‌روی آسان" },
  "rec-walk": { f: "mcal-c-walk.png", alt: "مردی با شانه‌های رها در مسیری سبز در حال پیاده‌روی آسان" },
};
function mcBodyBlocks(c) {
  return c.body.map(function (b) {
    if (b.p) return `<p class="mc-bp">${b.p}</p>`;
    if (b.steps) return eduSteps("mc:" + c.id, b.steps, { title: "قدم‌به‌قدم" });
    if (b.tip) return `<div class="edu-key edu-reveal">${MC_IC.bulb}<div><b>نکته</b><p>${b.tip}</p></div></div>`;
    if (b.warn) return `<div class="edu-seek edu-reveal"><span class="edu-kicker">${MC_IC.alert}توجه</span><p>${b.warn}</p></div>`;
    return "";
  }).join("");
}
function mcContentHtml(id) {
  const c = mcContent(id);
  if (!c) return `<p class="mc-empty-line">این محتوا پیدا نشد.</p>`;
  mcMarkOpened(id);
  const cat = MC_CATS[c.cat];
  const img = MC_IMG[c.id];
  const h = mcDb.contentHist[id] || {};
  const isDone = c.type === "exercise" && h.done && h.done.length && h.done.indexOf(mcKeyOfJdn(mcTodayJdn())) > -1;
  const review = c.review === "ok" ? "بازبینی‌شده برای نسخهٔ نمایشی" : "در انتظار بازبینی تخصصی";
  const locked = !mcCondOk(c);
  const condMsg = c.cond === "ed"
    ? "این تمرین بعد از انجام ارزیابی SHIM فعال می‌شود تا واقعاً به درد تو بخورد؛ همهٔ تمرین‌ها برای همهٔ مردان یکسان نیستند."
    : c.cond === "pe"
      ? "این تمرین بعد از انجام ارزیابی PEDT فعال می‌شود تا واقعاً به درد تو بخورد."
      : "";
  const head = `
  <div class="backlink"><button data-mc="goback">→ بازگشت</button></div>
  <div class="mc-content-head">
    <div class="mc-crec-top">
      <span class="mc-catpill" style="background:${cat.soft};color:${cat.color}">${cat.name}</span>
      <span class="mc-tag">${MC_IC.clock} ${c.dur}</span>
      <span class="mc-tag">${MC_TYPE_L[c.type]}</span>
    </div>
    <h1>${c.title}</h1>
    <p class="mc-content-sum">${c.sum}</p>
  </div>`;
  if (locked) {
    return head + `
    <div class="card mc-lockcard">
      <span class="mc-lock-ico">${MC_IC.lock}</span>
      <p>${condMsg}</p>
      <button type="button" class="btn btn-primary" data-nav="men">رفتن به ارزیابی‌های سلامت مردان ${MC_IC.chevL}</button>
    </div>`;
  }
  return head + `
  <div class="mc-article">
    ${img ? `<div class="edu-hero"><img src="img/${img.f}?v=1" alt="${img.alt}"/></div>` : ""}
    ${mcBodyBlocks(c)}
    ${
      c.link
        ? `<button type="button" class="btn btn-secondary mc-relbtn" data-nav="${c.link.nav}">${c.link.label} ${MC_IC.chevL}</button>`
        : ""
    }
    ${eduSrc(c.src, review)}
    <div class="edu-states">
      <button type="button" class="edu-st ${h.saved ? "on" : ""}" data-mc="csave" data-id="${c.id}" aria-pressed="${!!h.saved}">${MC_IC.clip}<span>${h.saved ? "ذخیره شد" : "ذخیره برای مرور"}</span></button>
      ${
        c.type === "exercise"
          ? `<button type="button" class="edu-st ${isDone ? "on" : ""}" data-mc="cdone" data-id="${c.id}" ${isDone ? "disabled" : ""}>${MC_IC.check}<span>${isDone ? "امروز انجام شد" : "انجام شد"}</span></button>`
          : `<button type="button" class="edu-st ${h.fb && h.fb.type === "up" ? "on" : ""}" data-mc="cfb" data-id="${c.id}" data-f="up" ${h.fb && (h.fb.type === "up" || h.fb.type === "down") ? "disabled" : ""}>${MC_IC.flower}<span>${h.fb && h.fb.type === "up" ? "ممنون از بازخوردت" : "برایم مفید بود"}</span></button>`
      }
      ${h.fb && h.fb.type === "down" ? '<span class="mut">بازخوردت ثبت شد؛ موارد مشابه پیشنهاد نمی‌شوند.</span>' : ""}
      ${!h.fb || (h.fb.type !== "up" && h.fb.type !== "down") ? `<button type="button" class="edu-st" data-mc="cfb" data-id="${c.id}" data-f="down">${MC_IC.alert}<span>مرتبط نبود</span></button>` : ""}
    </div>
    ${
      h.done && h.done.length
        ? `<p class="mc-donehist">${MC_IC.check} این تمرین ${fa(h.done.length)} بار انجام شده؛ آخرین بار ${JAL.fmt(JAL.keyToJ(h.done[h.done.length - 1]))}.</p>`
        : ""
    }
  </div>`;
}

/* ---------- کتابخانهٔ محتوا ---------- */
function mcLibraryHtml() {
  const cats = Object.keys(MC_CATS).filter(function (id) {
    if (id === "libido" && !mcDb.profile.libidoOn) return false;
    return true;
  });
  const chips = `<div class="mc-fchips cats">
    <button type="button" class="mc-chip ${MC.curCat === "all" ? "sel" : ""}" data-mc="cat" data-c="all">همه</button>
    ${cats.map(function (id) {
      return `<button type="button" class="mc-chip ${MC.curCat === id ? "sel" : ""}" data-mc="cat" data-c="${id}">${MC_CATS[id].name}</button>`;
    }).join("")}
  </div>`;
  const shownCats = MC.curCat === "all" ? cats : [MC.curCat];
  const groups = shownCats.map(function (id) {
    const items = mcItemsOf(id).filter(function (c) { return mcCondOk(c) || c.cond === "ed" || c.cond === "pe"; });
    const rows = items.map(function (c) {
      const ok = mcCondOk(c);
      if (ok) return mcContentRow(c, {});
      return `
      <div class="mc-crec locked">
        <div class="mc-crec-top"><span class="mc-catpill" style="background:${MC_CATS[id].soft};color:${MC_CATS[id].color}">${MC_TYPE_L[c.type]}</span></div>
        <h4>${c.title}</h4>
        <p>${c.cond === "ed" ? "بعد از ارزیابی SHIM فعال می‌شود." : "بعد از ارزیابی PEDT فعال می‌شود."} همهٔ تمرین‌ها برای همهٔ مردان یکسان نیستند.</p>
        <div class="mc-crec-foot"><button type="button" class="btn btn-secondary" data-nav="men">رفتن به ارزیابی‌ها ${MC_IC.chevL}</button></div>
      </div>`;
    }).join("");
    return `<div class="mc-libcat"><h3 style="color:${MC_CATS[id].color}">${MC_CATS[id].name}</h3>${rows}</div>`;
  }).join("");
  return `
  <div class="backlink"><button data-mc="goback">→ بازگشت</button></div>
  <div class="page-head with-ico mc-headrow">
    <span class="head-ico mc-ico" style="background:#efece4;color:#5d574c">${MC_IC.book}</span>
    <div><h1>کتابخانهٔ محتوا</h1><p>مطالب، تمرین‌ها و راهنماها — هر وقت بخواهی بازشان کن؛ مرور مجدد، «توصیهٔ جدید» حساب نمی‌شود.</p></div>
  </div>
  ${chips}
  ${groups}
  ${!mcDb.profile.libidoOn ? '<p class="mc-midnote">آیتم‌های مرتبط با میل جنسی به‌دلیل غیرفعال‌بودن این شاخص پنهان‌اند (قابل تغییر در تنظیمات).</p>' : ""}`;
}

/* ---------- تاریخچه و پیشنهادهای من ---------- */
function mcHistoryHtml() {
  const tJdn = mcTodayJdn();
  const totalDays = mcTotalLogged();
  const doneTotal = Object.keys(mcDb.contentHist).reduce(function (s, id) {
    return s + (mcDb.contentHist[id].done || []).length;
  }, 0);
  const stats = `
  <div class="mh-stats">
    <div><b>${fa(totalDays)}</b><span>روز ثبت‌شده</span></div>
    <div><b>${fa(doneTotal)}</b><span>تمرین انجام‌شده</span></div>
    <div><b>${fa(mcConsistency(tJdn))}</b><span>روز در ۳۰ روز اخیر</span></div>
  </div>`;
  /* آرشیو گزارش‌ها */
  const weeks = Object.keys(mcDb.repCache).map(Number).sort(function (a, b) { return b - a; });
  const repRows = weeks.length
    ? weeks.map(function (w) {
        const rep = mcDb.repCache[w];
        const fbL = { useful: "مفید بود", partial: "تا حدی مفید", irrelevant: "مرتبط نبود", knew: "قبلاً می‌دانستم" };
        return `<div class="mc-hrow"><div class="grow"><b>هفتهٔ ${mcWeekLabel(w)}</b><span>${rep.angleTitle || "—"}${rep.demo ? " · شامل دادهٔ نمایشی" : ""}</span></div>
        ${mcDb.repFb[w] ? `<span class="badge b-pos">${fbL[mcDb.repFb[w]] || ""}</span>` : ""}
        <button type="button" class="mh-goto" data-mc="openrep" data-w="${w}">مشاهده</button></div>`;
      }).join("")
    : '<p class="mc-rep-note">هنوز گزارشی ساخته نشده است؛ با چند ثبت روزانه، گزارش هفتگی همین‌جا آرشیو می‌شود.</p>';
  /* سابقهٔ محتوا */
  const shownIds = Object.keys(mcDb.contentHist).filter(function (id) {
    return mcDb.contentHist[id].shown.length && mcContent(id);
  }).sort(function (a, b) {
    return (mcLastShownWeek(b) || 0) - (mcLastShownWeek(a) || 0);
  });
  const cntRows = shownIds.slice(0, 14).map(function (id) {
    const c = mcContent(id);
    const h = mcDb.contentHist[id];
    const badges = [];
    if (h.opened && h.opened.length) badges.push('<span class="badge b-info">باز شده</span>');
    if (h.done && h.done.length) badges.push(`<span class="mh-done-badge">${fa(h.done.length)}× انجام شد</span>`);
    if (h.fb) badges.push(h.fb.type === "up" ? '<span class="badge b-pos">مفید بود</span>' : h.fb.type === "down" ? '<span class="badge b-concern">مرتبط نبود</span>' : "");
    if (h.saved) badges.push('<span class="badge b-warn">ذخیره‌شده</span>');
    const ls = mcLastShownWeek(id);
    return `<div class="mc-hrow"><div class="grow"><b>${c.title}</b><span>${ls ? "آخرین پیشنهاد: هفتهٔ " + mcWeekLabel(ls) : ""}</span></div><div class="mc-badges">${badges.join("")}</div><button type="button" class="mh-goto" data-mc="opencontent" data-id="${id}">مرور مجدد</button></div>`;
  }).join("");
  const savedIds = Object.keys(mcDb.contentHist).filter(function (id) {
    return mcDb.contentHist[id].saved && mcContent(id);
  });
  const savedRows = savedIds.length
    ? savedIds.map(function (id) {
        const c = mcContent(id);
        return `<div class="mc-hrow"><div class="grow"><b>${c.title}</b><span>${MC_CATS[c.cat].name}</span></div><button type="button" class="mh-goto" data-mc="opencontent" data-id="${id}">باز کردن</button></div>`;
      }).join("")
    : '<p class="mc-rep-note">هنوز چیزی ذخیره نکرده‌ای؛ در هر محتوا دکمهٔ «ذخیره برای مرور» هست.</p>';
  return `
  <div class="backlink"><button data-mc="go" data-to="home">→ بازگشت به داشبورد</button></div>
  <div class="page-head with-ico mc-headrow">
    <span class="head-ico mc-ico" style="background:#e6eff5;color:#2c5d7c">${MC_IC.list}</span>
    <div><h1>تاریخچه و پیشنهادهای من</h1><p>گزارش‌های هفته‌ها، محتوای پیشنهادشده و ذخیره‌شده‌ها — همه در همین دستگاه.</p></div>
  </div>
  <div class="card mc-hist">
    ${stats}
    <div class="mh-hcap">گزارش‌های هفتگی</div>
    ${repRows}
    <div class="mh-hcap">محتوای پیشنهادشده</div>
    ${cntRows || '<p class="mc-rep-note">هنوز محتوایی پیشنهاد داده نشده است.</p>'}
    <div class="mh-hcap">ذخیره‌شده‌ها</div>
    ${savedRows}
    <div class="mh-priv">${MC_IC.lock}<span>تمام داده‌های این بخش فقط در حافظهٔ مرورگر همین دستگاه (localStorage) ذخیره می‌شود و به هیچ سرویس خارجی ارسال نمی‌شود. این ذخیره‌سازی رمزگذاری‌شده نیست و جایگزین حفاظت امن در محصول واقعی نیست.</span></div>
  </div>`;
}

/* ---------- تنظیمات و حریم خصوصی ---------- */
function mcSettingsHtml() {
  const goals = mcDb.profile.goals || [];
  return `
  <div class="backlink"><button data-mc="go" data-to="home">→ بازگشت به داشبورد</button></div>
  <div class="page-head with-ico mc-headrow">
    <span class="head-ico mc-ico" style="background:#f6eedb;color:#b3873c">${MC_IC.gear}</span>
    <div><h1>تنظیمات و حریم خصوصی</h1><p>کنترل شاخص‌ها، هدف‌ها و داده‌هایت — همه‌چیز واقعی و قابل برگشت.</p></div>
  </div>
  <div class="card mc-setcard">
    <h3>شاخص میل جنسی</h3>
    <p class="mc-set-p">این شاخص کاملاً اختیاری است. با غیرفعال‌کردن، از فرم ثبت، نمودارها و گزارش‌ها پنهان می‌شود؛ داده‌های قبلی‌ات حذف نمی‌شوند و با فعال‌کردن دوباره برمی‌گردند. میل جنسی با عملکرد جنسی، تعداد روابط یا رضایت از رابطه یکی نیست.</p>
    <button type="button" class="mc-toggle ${mcDb.profile.libidoOn ? "on" : ""}" data-mc="libidotoggle" role="switch" aria-checked="${mcDb.profile.libidoOn}">
      <i></i><span>${mcDb.profile.libidoOn ? "فعال" : "غیرفعال"}</span>
    </button>
  </div>
  <div class="card mc-setcard">
    <h3>هدف‌های من <span class="mut">— اختیاری</span></h3>
    <p class="mc-set-p">این انتخاب‌ها فقط برای تنظیم بهتر محتوای پیشنهادی هستند و تعبیر پزشکی ندارند.</p>
    <div class="mc-goalgrid small">
      ${MC_GOALS.map(function (g) {
        const sel = goals.indexOf(g.id) > -1;
        return `<button type="button" class="mc-goal ${sel ? "on" : ""}" data-mc="setgoal" data-g="${g.id}" aria-pressed="${sel}">
          <b>${g.label}</b><span>${g.hint}</span>${sel ? `<span class="mc-goal-ck">${MC_IC.check}</span>` : ""}
        </button>`;
      }).join("")}
    </div>
  </div>
  <div class="card mc-setcard">
    <h3>دادهٔ نمونهٔ نمایشی</h3>
    <p class="mc-set-p">${mcHasDemo() ? "الان دادهٔ نمایشی در ثبت‌هایت هست و همه‌جا با برچسب «نمونهٔ نمایشی» مشخص است. هر زمان بخواهی حذفش کن؛ دادهٔ واقعی‌ات دست نمی‌خورد." : "اگر می‌خواهی نمودارها و گزارش‌ها را با داده ببینی، می‌توانی یک مجموعهٔ نمایشی سه‌هفته‌ای اضافه کنی؛ کاملاً برچسب‌دار و قابل حذف."}</p>
    ${mcHasDemo()
      ? `<button type="button" class="btn btn-secondary" data-mc="demorm">حذف دادهٔ نمایشی</button>`
      : `<button type="button" class="btn btn-secondary" data-mc="demoadd">افزودن دادهٔ نمایشی</button>`}
  </div>
  <div class="card mc-setcard">
    <h3>دربارهٔ این بخش</h3>
    <p class="mc-set-p">معرفی «تقویم سلامت مردان» را دوباره ببین، یا همهٔ داده‌های این بخش را از همین دستگاه پاک کن.</p>
    <div class="mc-ci-actions">
      <button type="button" class="btn btn-secondary" data-mc="go" data-to="about">دیدن معرفی</button>
      <button type="button" class="mc-danger ${MC.confReset ? "armed" : ""}" data-mc="reset">${MC.confReset ? "مطمئنی؟ همهٔ داده‌های این بخش حذف شود" : "پاک‌کردن همهٔ داده‌های این بخش"}</button>
    </div>
  </div>
  <div class="note">${MC_IC.lock}<span>داده‌ها فقط در localStorage همین مرورگر ذخیره می‌شوند و به هیچ سرویسی ارسال نمی‌شوند. هیچ ادعای رمزگذاری یا همگام‌سازی امنی وجود ندارد؛ این رفتار برای نسخهٔ نمایشی است.</span></div>`;
}

/* ============================================================
   کنترلر رویدادها
   ============================================================ */
function mcalHandle(act, el) {
  const d = el.dataset;
  switch (act) {
    /* ناوبری داخلی */
    case "go": {
      MC.sub = d.to;
      if (d.to === "report") { MC.weekOff = 0; MC.chartInd = "mo"; }
      if (d.to === "library") MC.curCat = "all";
      render();
      break;
    }
    case "goback":
      MC.sub = MC.from === "library" ? "library" : "home";
      render();
      break;
    /* معرفی اولیه */
    case "obgoal": {
      const g = d.g;
      const arr = MC.obGoals = (MC.obGoals && MC.obGoals.length ? MC.obGoals.slice() : (mcDb.profile.goals || []).slice());
      const i = arr.indexOf(g);
      if (i > -1) arr.splice(i, 1); else arr.push(g);
      render(false);
      break;
    }
    case "obfinish":
      if (MC.obGoals && MC.obGoals.length) mcDb.profile.goals = MC.obGoals.slice();
      mcDb.profile.introDone = true;
      mcSave();
      MC.obGoals = [];
      MC.sub = "home";
      render();
      break;
    /* ثبت روزانه */
    case "open": mcOpenForm(mcKeyOfJdn(mcTodayJdn())); break;
    case "openk": MC.from = MC.sub === "home" ? "home" : MC.from; mcOpenForm(d.k); break;
    case "fclose":
      MC.sub = "home"; MC.form = null; MC.formDay = null; MC.confForm = false; MC.step = 0;
      render();
      break;
    case "fnext": MC.step++; render(); break;
    case "fprev": MC.step = Math.max(0, MC.step - 1); render(); break;
    case "fskip": MC.step++; render(); break;
    case "fsel": {
      const i = d.i;
      if (i === "f") {
        const idx = MC.form.f.indexOf(d.v);
        if (idx > -1) MC.form.f.splice(idx, 1); else MC.form.f.push(d.v);
      } else {
        const v = +d.v;
        MC.form[i] = MC.form[i] === v ? null : v;
      }
      render(false);
      break;
    }
    case "fsave": mcSaveEntry(); break;
    case "fdel":
      if (!MC.confForm) { MC.confForm = true; render(false); }
      else {
        delete mcDb.entries[MC.formDay];
        mcInvalidateWeek(JAL.keyToJdn(MC.formDay));
        mcSave();
        MC.sub = "home"; MC.form = null; MC.formDay = null; MC.confForm = false; MC.step = 0;
        mcToast("ثبت این روز حذف شد");
      }
      break;
    case "godone":
      MC.sub = "home"; MC.step = 0; MC.form = null; MC.formDay = null;
      render();
      break;
    case "libidooff":
      mcDb.profile.libidoOn = false;
      mcSave();
      MC.picks = null;
      mcToast("شاخص میل جنسی غیرفعال شد؛ هر وقت خواستی از تنظیمات فعالش کن");
      break;
    /* تقویم */
    case "calopen": MC.calOpen = true; render(false); break;
    case "caltab": MC.calTab = d.t; render(false); break;
    case "calsel": MC.sel = d.k; MC.confDel = false; render(false); break;
    case "woff": MC.woff = Math.min(0, MC.woff + +d.d); render(false); break;
    case "wtoday": {
      MC.woff = 0;
      const t = JAL.today();
      MC.wy = t.jy; MC.wm = t.jm; MC.sel = JAL.keyOf(t.jy, t.jm, t.jd);
      render(false);
      break;
    }
    case "mprev": MC.wm--; if (MC.wm < 1) { MC.wm = 12; MC.wy--; } render(false); break;
    case "mnext": MC.wm++; if (MC.wm > 12) { MC.wm = 1; MC.wy++; } render(false); break;
    case "delk":
      if (MC.confDel !== d.k) { MC.confDel = d.k; render(false); }
      else {
        delete mcDb.entries[d.k];
        mcInvalidateWeek(JAL.keyToJdn(d.k));
        mcSave();
        MC.confDel = null;
        mcToast("این ثبت حذف شد");
      }
      break;
    /* گزارش */
    case "repw": MC.weekOff = Math.max(-13, Math.min(0, MC.weekOff + +d.d)); render(false); break;
    case "chartind": MC.chartInd = d.i; render(false); break;
    case "repfb": {
      const w = mcWeekStart(mcTodayJdn()) + MC.weekOff * 7;
      mcDb.repFb[w] = d.f; /* زاویهٔ غالب هفتهٔ بعد متفاوت انتخاب می‌شود */
      mcSave();
      mcToast("ممنون از بازخوردت؛ در گزارش‌ها و پیشنهادهای بعدی لحاظ می‌شود");
      break;
    }
    case "openrep":
      MC.sub = "report";
      MC.weekOff = Math.max(-13, Math.round((+d.w - mcWeekStart(mcTodayJdn())) / 7));
      render();
      break;
    /* محتوا */
    case "opencontent":
      MC.from = MC.sub === "home" ? "home" : MC.sub === "library" ? "library" : MC.from;
      MC.sub = "content:" + d.id;
      render();
      break;
    case "cfb": {
      const id = d.id;
      mcSetFb(id, d.f);
      MC.picks = null;
      delete mcDb.repCache[mcWeekStart(mcTodayJdn())]; /* پیشنهاد همین هفته فوراً تعویض می‌شود */
      mcSave();
      if (MC.sub === "content:" + id) render(false); else mcToast(d.f === "up" ? "ممنون؛ موارد مشابه بیشتری خواهی دید" : "ثبت شد؛ موارد مشابه دیگر پیشنهاد نمی‌شوند");
      break;
    }
    case "csave": {
      const on = mcToggleSaved(d.id);
      mcToast(on ? "برای مرور ذخیره شد" : "از ذخیره‌شده‌ها برداشته شد");
      break;
    }
    case "cdone":
      mcMarkDone(d.id);
      mcToast("انجام شد — ثبت شد در تاریخچهٔ تمرین‌هایت");
      break;
    /* کتابخانه */
    case "cat": MC.curCat = d.c; render(false); break;
    /* تنظیمات */
    case "libidotoggle":
      mcDb.profile.libidoOn = !mcDb.profile.libidoOn;
      MC.picks = null;
      mcSave();
      mcToast(mcDb.profile.libidoOn ? "شاخص میل جنسی فعال شد" : "شاخص میل جنسی غیرفعال شد؛ داده‌های قبلی محفوظ ماندند");
      break;
    case "setgoal": {
      const g = d.g;
      const arr = mcDb.profile.goals || [];
      const i = arr.indexOf(g);
      if (i > -1) arr.splice(i, 1); else arr.push(g);
      mcDb.profile.goals = arr;
      MC.picks = null;
      mcSave();
      render(false);
      break;
    }
    case "demoadd": mcAddDemo(); mcToast("دادهٔ نمایشی اضافه شد — همه‌جا با برچسب «نمونهٔ نمایشی»"); break;
    case "demorm": mcRemoveDemo(); mcToast("دادهٔ نمایشی حذف شد"); break;
    case "reset":
      if (!MC.confReset) { MC.confReset = true; render(false); }
      else {
        mcDb = mcEmptyDb();
        mcDb.profile.introDone = true;
        mcSave();
        MC.confReset = false; MC.picks = null; MC.sub = "home"; MC.calOpen = false;
        mcToast("همهٔ داده‌های این بخش پاک شد");
      }
      break;
  }
}
function mcSaveEntry() {
  const f = MC.form;
  const k = MC.formDay;
  let any = false;
  MC_CORE.forEach(function (i) { if (f[i] !== null && f[i] !== undefined) any = true; });
  if (f.li !== null && f.li !== undefined) any = true;
  if (f.f.length) any = true;
  if (!any) { mcToast("اول حداقل یکی از شاخص‌ها یا عوامل را انتخاب کن"); return; }
  const rec = {};
  MC_CORE.forEach(function (i) {
    if (f[i] !== null && f[i] !== undefined) rec[i] = Math.max(0, Math.min(4, +f[i]));
  });
  if (f.li !== null && f.li !== undefined) rec.li = Math.max(0, Math.min(MC_LI_PREF, +f.li));
  if (f.slH !== null && f.slH !== undefined && f.slH !== "") {
    const h = parseFloat(String(f.slH).replace(/[^\d.]/g, ""));
    if (h > 0 && h <= 16) rec.slH = Math.round(h * 2) / 2;
  }
  if (f.f.length) rec.f = f.f.slice(0, 7);
  const note = String(f.note || "").trim();
  if (note) rec.note = note.slice(0, 300);
  rec.ts = Date.now();
  mcDb.entries[k] = rec;
  mcDb.saveCount = (mcDb.saveCount || 0) + 1;
  mcInvalidateWeek(JAL.keyToJdn(k));
  mcSave();
  MC._saveMsg = mcSaveMsg(f);
  MC._tip = mcQuickTipText(f);
  MC.step = 99;
  render();
}
function mcQuickTipText(f) {
  if (f.st !== null && f.st !== undefined && f.st >= 3) return "اگر دو دقیقه وقت داری، چند نفس آهسته و طولانی به بدن کمک می‌کند از حالت آماده‌باش خارج شود.";
  if (f.sl !== null && f.sl !== undefined && f.sl <= 1) return "امشب فقط یک چیز را امتحان کن: صفحه‌ها را نیم‌ساعت زودتر کنار بگذار.";
  if (f.en !== null && f.en !== undefined && f.en <= 1) return "ده دقیقه پیاده‌روی سبک، معمولاً بیش از چیزی که انتظار داری انرژی برمی‌گرداند.";
  if (f.mo !== null && f.mo !== undefined && f.mo <= 1) return "یک تماس کوتاه با یکی از نزدیکانت، از اهرم‌های شناخته‌شدهٔ خلق است.";
  if ((f.f || []).indexOf("positive") > -1) return "اتفاق‌های خوب را دیدن، مهارتی است که با تکرار قوی‌تر می‌شود — امروز آن را دیدی.";
  return "روزی که ثبت می‌شود، روزی است که الگوهایت را نشان می‌دهد.";
}

/* ثبت ورود از نتایج پرسش‌نامه‌ها (SHIM/PEDT) — بدون ذخیرهٔ نمره */
function mcalOnQuizResult(cond) {
  if (cond !== "shim" && cond !== "pedt") return;
  const k = mcKeyOfJdn(mcTodayJdn());
  if (cond === "shim" && mcDb.prog.ed !== k) { mcDb.prog.ed = k; mcSave(); }
  if (cond === "pedt" && mcDb.prog.pe !== k) { mcDb.prog.pe = k; mcSave(); }
}

/* ---------- listeners ---------- */
document.getElementById("app").addEventListener(
  "click",
  function (e) {
    const b = e.target.closest("[data-mc]");
    if (b && b.dataset.mc) {
      e.stopPropagation();
      mcalHandle(b.dataset.mc, b);
      return;
    }
  },
  true,
);
/* ورود مجدد به بخش: بازنشانی وضعیت زیرنما (نه داده‌ها) */
document.getElementById("app").addEventListener(
  "click",
  function (e) {
    const nb = e.target.closest('[data-nav="mhcal"]');
    if (nb) {
      MC.sub = "home";
      MC.step = 0;
      MC.form = null;
      MC.formDay = null;
      MC.calOpen = false;
      MC.weekOff = 0;
      MC.woff = 0;
      MC.confDel = false;
      MC.confForm = false;
      MC.confReset = false;
      MC.picks = null;
      MC.chartInd = "mo";
    }
  },
  true,
);
/* ورودی‌های متنی بدون رندر مجدد (حفظ فوکوس) */
document.getElementById("app").addEventListener("input", function (e) {
  const f = e.target.dataset.mch;
  if (!f || state.view !== "mhcal" || !MC.form) return;
  if (f === "note") MC.form.note = e.target.value;
  if (f === "slH") MC.form.slH = e.target.value;
});
