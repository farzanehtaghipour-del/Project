/* ============================================================
   config.js  —  پیکربندی، راه‌کارها، آیکون‌ها، گزینه‌های مشترک و ثابت‌ها
   بخشی از پلتفرم سلامت سَمن (نسخه‌ی vanilla)  •  باید اول از همه بارگذاری شود
   ============================================================ */

/* ================= Helpers ================= */
const FA_D = "۰۱۲۳۴۵۶۷۸۹";
const fa = (s) => String(s).replace(/\d/g, (d) => FA_D[+d]);
const toEn = (s) =>
  String(s ?? "").replace(/[۰-۹]/g, (d) => String(FA_D.indexOf(d)));
const num = (v) => {
  const x = parseFloat(toEn(v).replace(/[^\d.\-]/g, ""));
  return Number.isFinite(x) ? x : null;
};
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const faDec = (v) => fa(Number(v).toFixed(1)).replace(".", "٫");
const faN = (v) => {
  const r = Math.round(Number(v) * 10) / 10;
  const s = Number.isInteger(r) ? String(r) : r.toFixed(1);
  return fa(s).replace(".", "٫");
};
const lvlCls = (v, max) => {
  if (!v) return "pos";
  const r = v / max;
  return r >= 0.7 ? "concern" : r >= 0.34 ? "warn" : "pos";
};

/* ================= Icons ================= */
const SV = (p) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I = {
  logo: SV(
    '<path d="M12 20.2S5 16.1 5 10.9a4.1 4.1 0 0 1 7-2.9l.4.3.4-.3a4.1 4.1 0 0 1 7 2.9c0 5.2-7 9.3-7 9.3z"/><path d="M7.6 11.3h2l1-1.9 2.4 4.4 1-2.1h2.4"/>',
  ),
  user: SV(
    '<circle cx="12" cy="8.2" r="3.5"/><path d="M5.5 19.5c.9-3.2 3.5-5 6.5-5s5.6 1.8 6.5 5"/>',
  ),
  flower: SV(
    '<circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><circle cx="12" cy="6.2" r="2.4"/><circle cx="17.1" cy="9.9" r="2.4"/><circle cx="15.1" cy="16" r="2.4"/><circle cx="8.9" cy="16" r="2.4"/><circle cx="6.9" cy="9.9" r="2.4"/>',
  ),
  shield: SV(
    '<path d="M12 3.2 18.8 5.7v5.5c0 4.2-2.9 7.2-6.8 8.8-3.9-1.6-6.8-4.6-6.8-8.8V5.7z"/><path d="M12 9.7v4.6M9.7 12h4.6"/>',
  ),
  rings: SV(
    '<circle cx="9.3" cy="12" r="4.5"/><circle cx="14.7" cy="12" r="4.5"/>',
  ),
  clip: SV(
    '<rect x="5.5" y="4.8" width="13" height="15.7" rx="2.4"/><rect x="9.2" y="2.8" width="5.6" height="3.6" rx="1.4"/><path d="m9.2 12.6 2 2 3.6-4"/>',
  ),
  bulb: SV(
    '<path d="M9.6 17.8h4.8M10.4 20.6h3.2"/><path d="M12 3.2a5.8 5.8 0 0 0-3.6 10.3c.8.6 1.1 1.3 1.1 2.1v.4h5v-.4c0-.8.3-1.5 1.1-2.1A5.8 5.8 0 0 0 12 3.2z"/>',
  ),
  flag: SV(
    '<path d="M6.2 20.8V4"/><path d="M6.2 4.2h11l-2.7 3.7 2.7 3.7h-11"/>',
  ),
  dna: SV(
    '<path d="M8.2 3c0 4.4 7.6 4.4 7.6 9s-7.6 4.6-7.6 9"/><path d="M15.8 3c0 4.4-7.6 4.4-7.6 9s7.6 4.6 7.6 9"/><path d="M9.3 7.4h5.4M9.3 16.6h5.4"/>',
  ),
  lock: SV(
    '<rect x="5.8" y="10.4" width="12.4" height="9.4" rx="2.4"/><path d="M8.6 10.4V7.6a3.4 3.4 0 0 1 6.8 0v2.8"/>',
  ),
  chevL: SV('<path d="m14 6-6 6 6 6"/>'),
  chevR: SV('<path d="m10 6 6 6-6 6"/>'),
  check: SV('<path d="m5 12.5 4.4 4.4L19 7.2"/>'),
  clock: SV('<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3 2.2"/>'),
  flask: SV(
    '<path d="M9.6 3h4.8M10.4 3v5.1l-4.8 8.5a2.1 2.1 0 0 0 1.9 3.1h9a2.1 2.1 0 0 0 1.9-3.1l-4.8-8.5V3"/><path d="M8 14.2h8"/>',
  ),
  info: SV(
    '<circle cx="12" cy="12" r="8.4"/><path d="M12 11.2v4.6M12 8.2h.01"/>',
  ),
  alert: SV(
    '<path d="M10.4 4.4 3 17.4a1.6 1.6 0 0 0 1.4 2.4h15.2a1.6 1.6 0 0 0 1.4-2.4L13.6 4.4a1.8 1.8 0 0 0-3.2 0z"/><path d="M12 9.6v4M12 16.8h.01"/>',
  ),
  act: SV('<path d="M3.5 12h3.6l2.2-5.4 4.6 10.8 2.2-5.4h4.4"/>'),
  cal: SV(
    '<rect x="4.2" y="5.6" width="15.6" height="15" rx="2.4"/><path d="M8 3.6v3.6M16 3.6v3.6M4.2 10.4h15.6"/>',
  ),
};

/* ================= Shared option sets ================= */
const YN = [
  { label: "بله", v: "yes" },
  { label: "خیر", v: "no" },
];
const YND = [
  { label: "بله", v: "yes" },
  { label: "خیر", v: "no" },
  { label: "نمی‌دانم", v: "dk" },
];
const ASSOC = [
  { label: "بله، با قاعدگی بدتر می‌شود", v: "yes" },
  { label: "خیر، ارتباطی ندارد", v: "no" },
];
const SEG = [
  { label: "هرگز", v: "never" },
  { label: "گاهی", v: "some" },
  { label: "مکرر", v: "freq" },
  { label: "شدید", v: "sev" },
];
const SMOKE = [
  { label: "هرگز مصرف نکرده‌ام", v: "never" },
  { label: "سابقه مصرف دارم", v: "past" },
  { label: "مصرف فعلی دارم", v: "current" },
];
const ACT = [
  { label: "کم — کمتر از ۲ روز در هفته", v: "low" },
  { label: "متوسط — ۲ تا ۴ روز", v: "mid" },
  { label: "زیاد — بیش از ۴ روز", v: "high" },
];

/* ================= Shared utilities ================= */
function bmiOf(a, p) {
  const h = num(a[p + "_height"]),
    w = num(a[p + "_weight"]);
  if (!h || !w || h < 80 || h > 230) return null;
  const v = w / (h / 100) ** 2;
  if (v < 10 || v > 80) return null;
  const cat =
    v < 18.5
      ? "کمتر از حد طبیعی"
      : v < 25
        ? "طبیعی"
        : v < 30
          ? "اضافه وزن"
          : "چاقی";
  return { v, cat };
}
function optLabel(qid, v) {
  for (const c of Object.values(CONDS))
    for (const sec of c.sections)
      for (const st of sec.steps)
        for (const q of st)
          if (q.id === qid && q.options) {
            const o = q.options.find((o) => o.v === v);
            if (o) return o.label;
          }
  return "—";
}

/* ============================================================
   سلامت مردان — data (engine format) + scorers
   Ported from src/data/samn/mensQuestions.ts + mensScoring.ts
   PEDT 0–20 | SHIM 5–25 (Q2–Q5 keep 0) | CPSI domains (no overall
   severity label) | IPSS 0–35 (Q8 out of total) | ADAM yes/no rule
   ============================================================ */

const FREQ05 = [
  { label: "اصلاً", v: "0" },
  { label: "کمتر از ۱ بار از هر ۵ بار", v: "1" },
  { label: "کمتر از نیمی از مواقع", v: "2" },
  { label: "حدود نیمی از مواقع", v: "3" },
  { label: "بیشتر از نیمی از مواقع", v: "4" },
  { label: "تقریباً همیشه", v: "5" },
];
const NOYES01 = [
  { label: "خیر", v: "0" },
  { label: "بله", v: "1" },
];
/* ============================================================
   سلامت زناشویی (Sexual Wellness) — 9-step journey
   Ported from src/data/samn/wellnessQuestions.ts + wellness libs.
   Product rules preserved:
   - Wellness journey, NOT a diagnostic assessment; the word
     «اختلال» (or any diagnostic framing) never appears here.
   - Context / body / safety answers branch only, never scored.
   - Q8/Q9 reverse-scored internally (6 − value), never exposed.
   - Profile shows band words only (خوب / متوسط / نیازمند توجه),
     never raw numbers; at most 2 opportunity areas.
   - Safety gate OVERRIDES recommendations: partner/intimacy
     exercises are filtered out when safety is a concern.
   ============================================================ */

const SW_KEY = "samn_sw_demo_v1";

const JAL = (function () {
  const div = (a, b) => ~~(a / b);
  const mod = (a, b) => a - ~~(a / b) * b;
  const BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  function jalCal(jy) {
    let bl = BREAKS.length, gy = jy + 621, leapJ = -14, jp = BREAKS[0], jm, jump = 0, leap, leapG, march, n, i;
    for (i = 1; i < bl; i += 1) {
      jm = BREAKS[i]; jump = jm - jp;
      if (jy < jm) break;
      leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
      jp = jm;
    }
    n = jy - jp;
    leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
    if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
    leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
    march = 20 + leapJ - leapG;
    if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
    leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) leap = 4;
    return { leap: leap, gy: gy, march: march };
  }
  function g2d(gy, gm, gd) {
    let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
  }
  function d2g(jdn) {
    let j = 4 * jdn + 139361631;
    j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    const i = div(mod(j, 1461), 4) * 5 + 308;
    const gd = div(mod(i, 153), 5) + 1;
    const gm = mod(div(i, 153), 12) + 1;
    const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
    return { gy: gy, gm: gm, gd: gd };
  }
  function j2d(jy, jm, jd) {
    const r = jalCal(jy);
    return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
  }
  function d2j(jdn) {
    const gy = d2g(jdn).gy;
    let jy = gy - 621;
    const r = jalCal(jy);
    const jdn1f = g2d(gy, 3, r.march);
    let k = jdn - jdn1f, jm, jd;
    if (k >= 0) {
      if (k <= 185) { jm = 1 + div(k, 31); jd = mod(k, 31) + 1; return { jy: jy, jm: jm, jd: jd }; }
      k -= 186;
    } else {
      jy -= 1; k += 179;
      if (r.leap === 1) k += 1;
    }
    jm = 7 + div(k, 30); jd = mod(k, 30) + 1;
    return { jy: jy, jm: jm, jd: jd };
  }
  function isLeap(jy) { return jalCal(jy).leap === 0; }
  function monthLen(jy, jm) { return jm <= 6 ? 31 : jm <= 11 ? 30 : (isLeap(jy) ? 30 : 29); }
  function today() {
    const d = new Date();
    return d2j(g2d(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  }
  function keyOf(jy, jm, jd) { return jy + "-" + String(jm).padStart(2, "0") + "-" + String(jd).padStart(2, "0"); }
  function keyToJ(k) { const p = k.split("-"); return { jy: +p[0], jm: +p[1], jd: +p[2] }; }
  function keyToJdn(k) { const p = k.split("-"); return j2d(+p[0], +p[1], +p[2]); }
  const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
  const WD = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
  const WDS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  /* column in a Saturday-first grid: 0=شنبه … 6=جمعه */
  function colOf(jdn) { return (mod(jdn, 7) + 2) % 7; }
  function fmt(j) { return fa(j.jd) + " " + MONTHS[j.jm - 1] + " " + fa(j.jy); }
  return { jalCal: jalCal, g2d: g2d, d2g: d2g, j2d: j2d, d2j: d2j, isLeap: isLeap, monthLen: monthLen, today: today, keyOf: keyOf, keyToJ: keyToJ, keyToJdn: keyToJdn, MONTHS: MONTHS, WD: WD, WDS: WDS, colOf: colOf, fmt: fmt };
})();

/* ---------- store (localStorage — demo only, stays on this device) ---------- */
const CY_KEY = "samn_cycle_demo_v1";
/* ================= Men's health calendar (تقویم سلامت مردان) =================
   ماژول مستقل — همان الگوی «تقویم چرخه قاعدگی»: منطق خالص قابل‌تست + ویو + capture listener.
   ذخیره‌سازی دمو در localStorage — کلید samn_mhcal_demo_v1 — بدون ارسال به هیچ سرویسی. */

/* ---------- store ---------- */
const MH_KEY = "samn_mhcal_demo_v1";
/* کلیدهای «همراه مادر» به config قدیم برنمی‌گردند: ماژول مستقل تازه
   (pp-content.js + pp-companion.js) داده‌اش را در کلید خودش
   (samn_pp_companion_v1 — آداپتور: pp-adapter.js) نگه می‌دارد و
   محتوایش را از pp-content.js می‌خواند. */

