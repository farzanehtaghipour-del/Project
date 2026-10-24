/* ============================================================================
   همراه مادر | pp-companion.js — نسخهٔ بازطراحی‌شده (چیدمان «اول امروز»)
   ----------------------------------------------------------------------------
   طراحی بر پایهٔ بازبینی UX (قاعدهٔ «امروز اول»):
     ۱. هدر کوچک (روز N · فاز) — تنظیمات یک‌باره (تاریخ تولد/زایمان/تغذیه) جمع‌شده
     ۲. کارت «امروز برای تو» — یک نکتهٔ اصلی + حداکثر دو کار + «بیشتر بخوان»
     ۳. ثبت سریع ۳ لمسی (حال‌وهوا، درد، خون‌ریزی) — بقیه پشت «جزئیات بیشتر»
        (پرسش نوک سینه فقط وقتی درد شیردهی انتخاب شده باشد)
     ۴. نوار هفتگی جمع‌وجور — تقویم کامل هر وقت خواست، باز می‌شود
     ۵. نمودارها با دو تب (بهبود من / رشد نوزاد) — SVG خالص
     ۶. «از همسرم کمک بخواه» — یک لمس و کپی پیام
     ۷. حداکثر ۳ راهنمای مرتبط + «همه راهنماها» در فهرست فشردهٔ جست‌وجوپذیر
     ۸. دکمهٔ ثابت «علائم خطر» — همیشه در دسترس (شیت باز می‌کند)
   قاعدهٔ متن صفحهٔ اصلی: یک خط + حداکثر سه گام + «بیشتر بخوان».
   جدول WHO رسمی (وزن برای سن): هفتگی ۰ تا ۱۳ هفتگی + ماهانه ۰ تا ۱۲ ماه،
   استخراج مستقیم از فایل‌های رسمی who.int (z-scores).
   نسخهٔ ۲.۱ (artifact):
     • نمودارها به‌صورت کارت قاب‌دار ظریف (max-width ۵۴۰px، منحنی نرم بزیه،
       گرادیان، برچسب قرصی آخرین وزن) — دیگر کشیده و درشت نمی‌شوند.
     • غربالگری PHQ-2 تکرارشونده: تاریخ آخرین ثبت + یادآوری ۱۴ روز + ۳ نمرهٔ آخر.
     • «خلاصهٔ ویزیت»: برگهٔ چاپ‌شوندهٔ آفلاین (چک‌این‌ها، وزن‌ها، غربالگری).
     • شمارندهٔ پوشک خیس در جزئیات چک‌این + قاعدهٔ «۶ پوشک از روز ۵».
     • «فرستادن با پیام‌رسان» با Web Share API (fallback: کپی).
     • برچسب کوتاه چیپ‌های همسر (بدون بریدن وسط کلمه).
     • کارت «امروز» با پس‌زمینهٔ ملایم و متن تیره + نسخهٔ تیرهٔ حالت شب.
   نسخهٔ ۲.۲ (طلایی/لیمویی/یاسی/نقره‌ای — بازطراحی ظریف سَمن):
     • ورودی تصویری بخش: سه عکس «آغوش مامان» (Mom and kids)، «نینی و خرگوشک»
       (Nini 1) و «پروانه و مامان» (Mama 1) با قاب طلایی و چسب کاغذی.
     • پس‌زمینهٔ کل ماژول = تصویر ابریشمی Background (img/pp/background.jpg)
       با نقاب کرمی برای خوانایی + نسخهٔ شب.
     • چهار بخش تب‌شده (امروز / تقویم و نمودار / مراقبت من / راهنماها) —
       صفحهٔ بلند چند‌هزاری‌متری به چهار دسترسی کوتاه تبدیل شد.
     • کارت هشدار نرم بالای «امروز»: علائم فوری امروز + حال پایین دو روز
       پشت‌هم، با دکمهٔ تماس ۱۱۵ و میان‌بر PHQ-2.
     • پشتیبان‌گیری/بازیابی: دانلود JSON و بازیابی از فایل.
     • فونت و اندازه‌ها فشرده‌تر — هم‌خانوادهٔ ظرافت تقویم چرخه.
   نسخهٔ ۲.۳ (صورتی/آبی/نارنجی/یاسیِ پررنگ — شاد و زنده):
     • شش عکس کوچک و هم‌راستا در ورودی: سه عکس پیشین + «دست در دست عشق»
       (Love and kid)، «شروع داستان» (Mama Pregnant 1) و «پیمان قلب کوچولو» (Ninies).
     • زیر عکس‌ها: آرتیفکت مینی‌نمودار «بهبود من / رشد نوزاد» + خط دلگرمی
       روزانه (PP_CHEERS)؛ پیش از اولین داده → «الگوی معمول بهبودی» نمایشی.
     • تقویم = آرتیفکت قاب‌دار (pp-cal-art) با هدر تزئینی و خانه‌های رنگی.
     • پراکندگی زیبای عکس در بخش‌ها (عکس کوچک در «مراقبت من»).
   نسخهٔ ۲.۴ (انتقال «من هم مهمم» به «مراقبت من»):
     • محتوای حمایتی «من هم مهمم» (که توسط pp-support.js سوار می‌شد) از تب
       «امروز» به تب «مراقبت من» منتقل شد؛ ثبت روزانه، کارت امروز و بقیهٔ
       قابلیت‌های تب «امروز» سر جایشان هستند.
     • در تب «امروز» فقط یک پل کوتاه و ظریف مانده است: «امروز به کمی همراهی
       نیاز داری؟» با دکمهٔ «مراقبت از خودم» — مستقیم به تب «مراقبت من».
     • تب «مراقبت من»: صفحهٔ اصلی چهارورودیِ حمایت عاطفی (رندر pp-support.js)
       + بخش «از همسرم کمک بخواه» (رفتار و داده‌هایش دست‌نخورده).

   ماژول مستقل: بدون کتابخانه، بدون شبکه، همهٔ داده در همان دستگاه.
   ============================================================================ */
(function (global) {
  "use strict";

  var D = global.PP_DATA;
  if (!D) throw new Error("SamanPostpartum: pp-content.js باید پیش از این فایل بارگذاری شود");

  /* ---------- آیکون‌ها ---------- */
  var IC = {
    drop: '<path d="M12 3.6s6 6.2 6 10.2a6 6 0 0 1-12 0c0-4 6-10.2 6-10.2z"/>',
    leaf: '<path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z"/><path d="M5 19 13 11"/>',
    heart: '<path d="M12 20.3S4.4 15.6 4.4 10a4.1 4.1 0 0 1 7.6-2.2A4.1 4.1 0 0 1 19.6 10c0 5.6-7.6 10.3-7.6 10.3z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8"/>',
    move: '<circle cx="14.2" cy="4.8" r="1.9"/><path d="m8 21 3-5.4-2.4-2L10 9l3.6 1.4L16 13.6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    bowl: '<path d="M3.5 11h17a8.5 8.5 0 0 1-17 0z"/><path d="M8 7.5c0-1.2 1-1.5 1-3M12 7.5c0-1.2 1-1.5 1-3M16 7.5c0-1.2 1-1.5 1-3"/>',
    baby: '<circle cx="12" cy="7.4" r="3.4"/><path d="M10.6 6.9h.01M13.4 6.9h.01M10.8 9c.7.6 1.7.6 2.4 0"/><path d="M5.6 20.4c.8-3.4 3.3-5.4 6.4-5.4s5.6 2 6.4 5.4"/>',
    feed: '<path d="M5 8h11v5.5a4.5 4.5 0 0 1-4.5 4.5H9.5A4.5 4.5 0 0 1 5 13.5z"/><path d="M16 9.5h1.8a2.2 2.2 0 0 1 0 4.4H16"/>',
    sleep: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
    heat: '<path d="M12 3.4s4.6 4.4 4.6 8.2a4.6 4.6 0 0 1-9.2 0C7.4 7.8 12 3.4 12 3.4z"/><path d="M12 16.6v4"/>',
    calm: '<circle cx="12" cy="12" r="3.2"/><path d="M12 3.6A8.4 8.4 0 0 1 20.4 12" opacity=".5"/><path d="M12 20.4A8.4 8.4 0 0 1 3.6 12" opacity=".5"/>',
    vital: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    flag: '<path d="M6 21V4.5h11l-1.6 4 1.6 4H6"/>',
    note: '<path d="M6 4.4h9.4L19 8v11.6H6z"/><path d="M9 10.6h6M9 14h6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3.5V6M16 3.5V6"/>',
    share: '<path d="M12 14.6V4.4M8.4 7.8 12 4.2l3.6 3.6"/><path d="M5 12.4v5.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5.4"/>',
    book: '<path d="M5 4.4h9.4L19 8v11.6H5z"/><path d="M14.4 4.4V8H19M8.4 12h7.2M8.4 15.4h5"/>',
    users: '<circle cx="8.4" cy="8" r="3"/><path d="M3 19c.6-2.9 2.8-4.6 5.4-4.6S13.2 16.1 13.8 19"/><circle cx="16.8" cy="8.8" r="2.5"/><path d="M15.7 14.4c2.4.2 4.3 1.7 4.9 4.1"/>',
    chev: '<path d="m6.5 9.8 5.5 5.4 5.5-5.4"/>',
    back: '<path d="m14 6-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    gear: '<circle cx="12" cy="12" r="3.1"/><path d="M12 2.8v2.5M12 18.7v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.8 12h2.5M18.7 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20.2 20.2-4-4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
    download: '<path d="M12 4v10.6M8.4 11.2l3.6 3.6 3.6-3.6"/><path d="M5 19.4h14"/>',
    upload: '<path d="M12 14.6V4M8.4 7.6 12 4l3.6 3.6"/><path d="M5 19.4h14"/>'
  };
  function ic(n, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[n] || "") + "</svg>";
  }

  /* ---------- تقویم جلالی (اگر میزبان JAL بدهد، همان استفاده می‌شود) ---------- */
  var JAL_FALLBACK = (function () {
    var div = function (a, b) { return ~~(a / b); };
    var mod = function (a, b) { return a - ~~(a / b) * b; };
    var BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
    function jalCal(jy) {
      var bl = BREAKS.length, gy = jy + 621, leapJ = -14, jp = BREAKS[0], jm, jump = 0, leap, leapG, march, n, i;
      for (i = 1; i < bl; i += 1) {
        jm = BREAKS[i]; jump = jm - jp;
        if (jy < jm) break;
        leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4); jp = jm;
      }
      n = jy - jp;
      leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
      if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
      leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
      march = 20 + leapJ - leapG;
      if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
      leap = mod(mod(n + 1, 33) - 1, 4); if (leap === -1) leap = 4;
      return { leap: leap, gy: gy, march: march };
    }
    function g2d(gy, gm, gd) {
      var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
      d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752; return d;
    }
    function d2g(jdn) {
      var j = 4 * jdn + 139361631;
      j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
      var i = div(mod(j, 1461), 4) * 5 + 308;
      var gd = div(mod(i, 153), 5) + 1, gm = mod(div(i, 153), 12) + 1;
      var gy = div(j, 1461) - 100100 + div(8 - gm, 6);
      return { gy: gy, gm: gm, gd: gd };
    }
    function j2d(jy, jm, jd) { var r = jalCal(jy); return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1; }
    function d2j(jdn) {
      var gy = d2g(jdn).gy, jy = gy - 621, r = jalCal(jy), jdn1f = g2d(gy, 3, r.march);
      var k = jdn - jdn1f, jm, jd;
      if (k >= 0) { if (k <= 185) { jm = 1 + div(k, 31); jd = mod(k, 31) + 1; return { jy: jy, jm: jm, jd: jd }; } k -= 186; }
      else { jy -= 1; k += 179; if (r.leap === 1) k += 1; }
      jm = 7 + div(k, 30); jd = mod(k, 30) + 1;
      return { jy: jy, jm: jm, jd: jd };
    }
    function isLeap(jy) { return jalCal(jy).leap === 0; }
    function monthLen(jy, jm) { return jm <= 6 ? 31 : jm <= 11 ? 30 : (isLeap(jy) ? 30 : 29); }
    function today() { var d = new Date(); return d2j(g2d(d.getFullYear(), d.getMonth() + 1, d.getDate())); }
    function keyOf(jy, jm, jd) { return jy + "-" + String(jm).padStart(2, "0") + "-" + String(jd).padStart(2, "0"); }
    function keyToJdn(k) { var p = k.split("-"); return j2d(+p[0], +p[1], +p[2]); }
    var MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    var WD = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
    var WDS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
    function colOf(jdn) { return (mod(jdn, 7) + 2) % 7; }
    return { j2d: j2d, d2j: d2j, monthLen: monthLen, today: today, keyOf: keyOf, keyToJdn: keyToJdn,
      MONTHS: MONTHS, WD: WD, WDS: WDS, colOf: colOf };
  })();

  var FA = "۰۱۲۳۴۵۶۷۸۹";
  function fa(n) { return String(n).replace(/\d/g, function (d) { return FA[+d]; }); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- وضعیت ---------- */
  var S = {
    opts: null, JAL: null, adapter: null, mounted: false,
    db: null,                 /* {v, profile, checkins, tasks, needs, screen, baby, weights, night} */
    ci: null,                 /* پیش‌نویس چک‌این */
    ciOpen: false,            /* «جزئیات بیشتر» چک‌این */
    calFull: false,           /* تقویم کامل باز است؟ */
    gAll: false,              /* «همه راهنماها» باز است؟ */
    gQuery: "",               /* جست‌وجوی راهنماها */
    guide: null,              /* راهنمای باز (شیت) */
    dayOpen: null,            /* شیت روز انتخاب‌شده */
    flagsOpen: false,         /* شیت علائم خطر */
    setupOpen: false,         /* پنل تنظیمات هدر */
    range: "d40", selCell: null, tab: "today",
    outs: [],                 /* توصیه‌های محاسبه‌شده */
    chartTab: "mom"
  };
  var STORE_KEY = "samn_pp_companion_v1";

  /* سه پرسش ثبت سریع (۳ لمس) و پرسش‌های جزئیات — طبق بازطراحی */
  var QUICK = ["mood", "pain", "bleed"];
  var DETAILS = ["fever", "sleep", "feed", "nipple", "energy"];

  /* ---------- ذخیره‌سازی ---------- */
  function emptyDb() {
    return { v: 1, profile: null, checkins: {}, tasks: {}, needs: [], screen: {}, seen: {}, baby: null, weights: {}, night: false };
  }
  function localAdapter(key) {
    function read() {
      try {
        var raw = global.localStorage.getItem(key);
        if (!raw) return emptyDb();
        var d = JSON.parse(raw);
        if (!d || typeof d !== "object") return emptyDb();
        d.profile = d.profile || null; d.checkins = d.checkins || {}; d.tasks = d.tasks || {};
        d.needs = d.needs || []; d.screen = d.screen || {}; d.seen = d.seen || {};
        d.baby = d.baby || null; d.weights = d.weights || {}; d.night = !!d.night;
        return d;
      } catch (e) { return emptyDb(); }
    }
    return {
      today: function () { var t = JAL_FALLBACK.today(); return JAL_FALLBACK.j2d(t.jy, t.jm, t.jd); },
      load: read,
      save: function (db) { try { global.localStorage.setItem(key, JSON.stringify(db)); } catch (e) {} },
      clear: function () { try { global.localStorage.removeItem(key); } catch (e) {} }
    };
  }
  function load() { S.db = S.adapter.load(); if (S.db.night) S.opts.mount.classList.add("pp-night"); }
  function save() { S.adapter.save(S.db); }

  /* ---------- کمک‌تابع‌های تاریخ ---------- */
  function todayJdn() { return S.adapter.today(); }
  function jdnToKey(jdn) { var j = S.JAL.d2j(jdn); return S.JAL.keyOf(j.jy, j.jm, j.jd); }
  function fmtJ(jdn) {
    var j = S.JAL.d2j(jdn);
    return fa(j.jd) + " " + S.JAL.MONTHS[j.jm - 1] + " " + fa(j.jy);
  }
  function deliveryJdn() {
    var p = S.db.profile;
    if (!p || !p.deliveryKey) return null;
    try { return S.JAL.keyToJdn(p.deliveryKey); } catch (e) { return null; }
  }
  /* شمارهٔ روز پس از زایمان: روز تولد = روز ۰، فردای آن = روز ۱ */
  function dayNumberOf(jdn) {
    var dj = deliveryJdn();
    if (dj === null) return null;
    return jdn - dj;
  }
  function todayDay() { return dayNumberOf(todayJdn()); }
  function phaseOfDay(n) {
    if (n === null) return null;
    if (n < 1) return null;
    for (var i = 0; i < D.PHASES.length; i++) {
      if (n >= D.PHASES[i].from && n <= D.PHASES[i].to) return D.PHASES[i];
    }
    return D.PHASES[D.PHASES.length - 1];
  }
  function rangeForDay(n) {
    if (n === null) return "d40";
    if (n <= 45) return "d40";
    if (n <= 190) return "m6";
    return "y1";
  }
  function checkinAt(dayN) {
    var jdn = deliveryJdn() + dayN;
    return S.db.checkins[jdnToKey(jdn)] || null;
  }

  /* ---------- محتوای روز ---------- */
  function cardsForDay(n) {
    var out = [];
    if (D.DAY_CARDS[n]) out = out.concat(D.DAY_CARDS[n]);
    var ph = phaseOfDay(n);
    if (ph) {
      var list = D.PHASE_CARDS[ph.id] || [];
      /* چرخش ثابت بر اساس روز، تا هر روز ترکیب تازه‌ای ببیند و تکراری نشود */
      var need = Math.max(0, 3 - out.length);
      for (var i = 0; i < list.length && need > 0; i++) {
        var pick = list[(i + n) % list.length];
        if (out.indexOf(pick) === -1) { out.push(pick); need--; }
      }
    }
    return out.slice(0, 4);
  }
  function tasksForDay(n) {
    var ph = phaseOfDay(n);
    var base = ph ? ph.tasks.slice() : [];
    if (D.DAY_CARDS[n]) {
      D.DAY_CARDS[n].forEach(function (c) { (c.actions || []).slice(0, 1).forEach(function (a) { base.push(a); }); });
    }
    return base.slice(0, 4);
  }
  /* هفتهٔ جاری برای نوار هفتگی — گروه‌بندی ثابت از روز ۱ */
  function weekCells(n) {
    if (n === null || n < 1) return null;
    var start = Math.floor((n - 1) / 7) * 7 + 1;
    var days = [];
    for (var d = start; d < start + 7; d++) days.push(d);
    return { index: Math.floor((n - 1) / 7) + 1, start: start, end: start + 6, days: days };
  }
  function weekName(n) {
    if (n === null || n < 1) return "";
    if (n <= 7) return "هفتهٔ اول";
    if (n <= 14) return "هفتهٔ دوم";
    if (n <= 21) return "هفتهٔ سوم";
    if (n <= 28) return "هفتهٔ چهارم";
    if (n <= 42) return "هفتهٔ پنجم و ششم";
    var ph = phaseOfDay(n);
    return ph ? ph.name : "";
  }

  /* ---------- موتور توصیه (خالص) ---------- */
  function rulesFor(ans) {
    var outs = [];
    D.RULES.forEach(function (r) {
      var hit = false;
      Object.keys(r.when).forEach(function (k) {
        var want = r.when[k];
        if (want.indexOf(ans[k]) > -1) hit = true;
      });
      if (hit) outs.push(r);
    });
    var order = { urgent: 0, care: 1, info: 2 };
    outs.sort(function (a, b) { return order[a.level] - order[b.level]; });
    return outs;
  }
  /* قاعدهٔ پوشک خیس — خالص برای آزمون: کمتر از ۶ پوشک، از روز ۵ تا ۲۸.
     ملاک «شیر کافی» پوشک و وزن است (Queensland Health) — سطح info، نه هشدار. */
  function diaperRuleFor(ans, dayN) {
    if (!ans || ans.diaper == null) return null;
    if (dayN == null || dayN < 5 || dayN > 28) return null;
    if (ans.diaper >= 6) return null;
    return {
      id: "r-diaper", level: "info",
      title: "پوشک‌های خیس امروز کمتر از ۶ تا است",
      body: "ملاک دریافت شیر کافی، پوشک و وزن است نه حجم شیر خورده‌شده. اگر تا امشب هم کم بود، با ماما یا پزشک نوزاد در میان بگذار.",
      actions: ["شمارش پوشک را فردا هم ادامه بده", "نوبت‌های شیردهی را کوتاه‌تر و پرتکرارتر کن", "اگر نوزاد خیلی خواب‌آلود و بی‌حال هم هست، زودتر تماس بگیر"],
      guide: "g-enough", src: null
    };
  }
  function computeOuts() {
    var ci = S.ci || {};
    var dayN = S.dayOpen !== null ? S.dayOpen : todayDay();
    var saved = dayN !== null ? (checkinAt(dayN) || {}) : {};
    var ans = Object.assign({}, saved, ci);
    S.outs = rulesFor(ans);
    var dRule = diaperRuleFor(ans, dayN);
    if (dRule) S.outs.push(dRule);
    return S.outs;
  }

  /* ---------- رندر: هدر کوچک ---------- */
  function opt(v, l, cur) { return '<option value="' + v + '"' + (cur === v ? " selected" : "") + ">" + l + "</option>"; }
  var BLANK = { jy: null, jm: null, jd: null };
  function yearOpts() {
    var t = S.JAL.today();
    var s = "";
    for (var y = t.jy; y >= t.jy - 2; y--) s += '<option value="' + y + '"' + ((BLANK.jy || t.jy) === y ? " selected" : "") + ">" + fa(y) + "</option>";
    return s;
  }
  function monthOpts() {
    var t = S.JAL.today(), s = "";
    for (var m = 1; m <= 12; m++) s += '<option value="' + m + '"' + ((BLANK.jm || t.jm) === m ? " selected" : "") + ">" + S.JAL.MONTHS[m - 1] + "</option>";
    return s;
  }
  function dayOpts() {
    var t = S.JAL.today(), s = "";
    for (var d = 1; d <= 31; d++) s += '<option value="' + d + '"' + ((BLANK.jd || t.jd) === d ? " selected" : "") + ">" + fa(d) + "</option>";
    return s;
  }
  function setupHtml() {
    var dj = deliveryJdn();
    if (dj === null) {
      return '<div class="pp-setup" id="ppSetup">' +
        "<b>تاریخ تولد نوزاد را وارد کن:</b>" +
        '<select data-pp-sel="by" aria-label="سال">' + yearOpts() + "</select>" +
        '<select data-pp-sel="bm" aria-label="ماه">' + monthOpts() + "</select>" +
        '<select data-pp-sel="bd" aria-label="روز">' + dayOpts() + "</select>" +
        '<button type="button" class="pp-btn pp-btn-main pp-btn-sm" data-pp="set-birth">' + ic("check") + "ثبت</button>" +
        '<span class="pp-setup-hint">با ثبت تاریخ تولد، روز جاری پس از زایمان، نکتهٔ امروز و چک‌این فعال می‌شود. این تنظیم یک‌باره است و بعداً از همین‌جا قابل تغییر است.</span>' +
        "</div>";
    }
    return '<div class="pp-setup" id="ppSetup">' +
      "<b>تولد نوزاد: " + fmtJ(dj) + "</b>" +
      '<select data-pp-sel="type" aria-label="نوع زایمان">' +
        opt("vaginal", "زایمان طبیعی", S.db.profile.type) +
        opt("csection", "سزارین", S.db.profile.type) +
      "</select>" +
      '<select data-pp-sel="feeding" aria-label="روش تغذیه">' +
        opt("breast", "شیر مادر", S.db.profile.feeding) +
        opt("mixed", "ترکیبی", S.db.profile.feeding) +
        opt("formula", "شیر خشک", S.db.profile.feeding) +
      "</select>" +
      '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-pp="edit-birth">' + ic("cal") + "تغییر تاریخ</button>" +
      "</div>";
  }
  /* ---------- ورودی بخش: شش عکس کوچک و هم‌راستا — Mom and kids / Nini 1 / Mama 1
     + Love and kid / Mama Pregnant 1 / Ninies ---------- */
  var PP_PHOTOS = [
    { src: "img/pp/mom-and-kids.jpg", cap: "آغوش مامان", alt: "مادر با دو کودک در آغوش — تصویر آبرنگی گرم" },
    { src: "img/pp/nini-1.jpg", cap: "نینی و خرگوشک", alt: "نوزاد خوابیده کنار عروسک خرگوش — تصویر لطیف" },
    { src: "img/pp/mama-1.jpg", cap: "پروانه و مامان", alt: "نیم‌تنهٔ مادر با پروانه — تصویر مینیمال صورتی" },
    { src: "img/pp/love-and-kid.jpg", cap: "دست در دست عشق", alt: "نوزاد با پستونک، دست مادر را گرفته — تصویر گرم آبرنگی" },
    { src: "img/pp/mama-pregnant-1.jpg", cap: "شروع داستان", alt: "مامان باردار با سونوگرافی و گل یاس — تصویر لطیف" },
    { src: "img/pp/ninies.jpg", cap: "پیمان قلب کوچولو", alt: "پنجه‌های دو نفر با قلب کوچک — تصویر صورتی و آبی" }
  ];
  function photoHtml(p, main) {
    return '<figure class="pp-photo' + (main ? " is-main" : "") + '">' +
      '<i class="pp-photo-tape" aria-hidden="true"></i>' +
      '<img src="' + p.src + '" alt="' + esc(p.alt) + '" loading="lazy">' +
      "<figcaption>" + esc(p.cap) + "</figcaption></figure>";
  }

  /* ---------- مینی‌نمودار ورودی: بهبود من / رشد نوزاد — زیر عکس‌ها ----------
     بدون داده: «الگوی معمول بهبودی» نمایشی (صریحاً نمایشی، جای ثبت واقعی نیست). */
  function momMiniSvg(ser) {
    var rows = ser.rows, n = todayDay(), start = ser.start;
    var span = Math.max(6, n - start);
    var W = 560, H = 150, L = 12, R = 12, T = 14, B = 22, pw = W - L - R, ph = H - T - B;
    function X(d) { return L + (1 - (d - start) / span) * pw; }
    function Y(v) { return T + (1 - v / 100) * ph; }
    var g = '<defs><linearGradient id="ppgMiniB" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="var(--pp-blue-d)" stop-opacity=".2"/>' +
      '<stop offset="1" stop-color="var(--pp-blue-d)" stop-opacity="0"/></linearGradient></defs>';
    [0, 50, 100].forEach(function (v) {
      g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) +
        '" stroke="var(--pp-line)" stroke-width="1" stroke-dasharray="1 5"/>';
    });
    var ptsB = rows.map(function (r) { return [X(r.day), Y(r.sb)]; });
    var ptsM = rows.map(function (r) { return [X(r.day), Y(r.sm)]; });
    var area = smoothPath(ptsB) + " L" + ptsB[ptsB.length - 1][0].toFixed(1) + " " + Y(0).toFixed(1) +
      " L" + ptsB[0][0].toFixed(1) + " " + Y(0).toFixed(1) + " Z";
    g += '<path d="' + area + '" fill="url(#ppgMiniB)"/>';
    g += '<path d="' + smoothPath(ptsM) + '" fill="none" stroke="var(--pp-pink)" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 5"/>';
    g += '<path d="' + smoothPath(ptsB) + '" fill="none" stroke="var(--pp-blue-d)" stroke-width="2.6" stroke-linecap="round"/>';
    var last = rows[rows.length - 1];
    g += '<circle cx="' + X(last.day).toFixed(1) + '" cy="' + Y(last.sb).toFixed(1) + '" r="4.6" fill="var(--pp-blue-d)" stroke="var(--pp-paper)" stroke-width="2.2"/>';
    g += '<text x="' + L + '" y="' + (H - 7) + '" style="fill:var(--pp-ink3)">روز ' + fa(start) + "</text>" +
      '<text x="' + (W - R) + '" y="' + (H - 7) + '" text-anchor="end" style="fill:var(--pp-blue-d);font-weight:700">امروز</text>';
    return g;
  }
  function patternSvg() {
    var W = 560, H = 150, L = 12, R = 12, T = 14, B = 22, pw = W - L - R, ph = H - T - B;
    var P = [[0, 58], [3, 44], [7, 52], [14, 66], [21, 76], [28, 83], [35, 88], [42, 92]];
    function X(d) { return L + (1 - d / 42) * pw; }
    function Y(v) { return T + (1 - v / 100) * ph; }
    var pts = P.map(function (p) { return [X(p[0]), Y(p[1])]; });
    var g = '<defs><linearGradient id="ppgPat" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="var(--pp-pink)" stop-opacity=".22"/>' +
      '<stop offset="1" stop-color="var(--pp-pink)" stop-opacity="0"/></linearGradient></defs>';
    [0, 50, 100].forEach(function (v) {
      g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) +
        '" stroke="var(--pp-line)" stroke-width="1" stroke-dasharray="1 5"/>';
    });
    var area = smoothPath(pts) + " L" + pts[pts.length - 1][0].toFixed(1) + " " + Y(0).toFixed(1) +
      " L" + pts[0][0].toFixed(1) + " " + Y(0).toFixed(1) + " Z";
    g += '<path d="' + area + '" fill="url(#ppgPat)"/>';
    g += '<path d="' + smoothPath(pts) + '" fill="none" stroke="var(--pp-pink)" stroke-width="2.8" stroke-linecap="round"/>';
    pts.forEach(function (p, i) {
      g += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (i === pts.length - 1 ? 4.6 : 3) +
        '" fill="' + (i === pts.length - 1 ? "var(--pp-pink-d)" : "var(--pp-paper)") + '" stroke="var(--pp-pink-d)" stroke-width="1.8"/>';
    });
    g += '<line x1="' + X(42).toFixed(1) + '" x2="' + X(42).toFixed(1) + '" y1="' + (T - 6) + '" y2="' + (H - B) +
      '" stroke="var(--pp-orange-d)" stroke-width="1.1" stroke-dasharray="2 4"/>' +
      '<text x="' + (X(42) - 6).toFixed(1) + '" y="' + (T - 1) + '" text-anchor="end" style="fill:var(--pp-orange-d);font-size:9.5px">ویزیت ۶ هفته‌ای</text>';
    g += '<text x="' + L + '" y="' + (H - 7) + '" style="fill:var(--pp-ink3)">روز ۱</text>' +
      '<text x="' + (W - R) + '" y="' + (H - 7) + '" text-anchor="end" style="fill:var(--pp-ink3)">روز ۴۲</text>';
    return g;
  }
  function babyMiniSvg(ws) {
    var b = S.db.baby, n = todayDay();
    var pts = [{ day: 0, kg: b.birthG / 1000 }].concat(ws.map(function (w) { return { day: w.day, kg: w.g / 1000 }; }));
    var xmax = Math.max(13, Math.min(52, Math.ceil(n / 7) + 1));
    var W = 560, H = 150, L = 12, R = 12, T = 14, B = 22, pw = W - L - R, ph = H - T - B;
    var steps = 30, band = [], i;
    for (i = 0; i <= steps; i++) {
      var wk = i / steps * xmax, r = whoAt(b.sex, wk * 7);
      band.push({ wk: wk, lo: r.lo, md: r.md, hi: r.hi });
    }
    var vals = [];
    band.forEach(function (p) { vals.push(p.lo, p.hi); });
    pts.forEach(function (p) { vals.push(p.kg); });
    var ymin = Math.floor(Math.min.apply(null, vals) - 0.4), ymax = Math.ceil(Math.max.apply(null, vals) + 0.4);
    if (ymax - ymin < 3) ymax = ymin + 3;
    function X(w) { return L + (1 - w / xmax) * pw; }
    function Y(k) { return T + (1 - (k - ymin) / (ymax - ymin)) * ph; }
    var hiPts = band.map(function (p) { return [X(p.wk), Y(p.hi)]; });
    var loPts = band.map(function (p) { return [X(p.wk), Y(p.lo)]; }).reverse();
    var g = '<defs><linearGradient id="ppgMiniL" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="var(--pp-lilac)" stop-opacity=".22"/>' +
      '<stop offset="1" stop-color="var(--pp-lilac)" stop-opacity=".07"/></linearGradient></defs>';
    g += '<path d="' + smoothPath(hiPts) + " " + smoothPath(loPts).replace(/^M/, "L") + ' Z" fill="url(#ppgMiniL)"/>';
    var mdPts = band.map(function (p) { return [X(p.wk), Y(p.md)]; });
    g += '<path d="' + smoothPath(mdPts) + '" fill="none" stroke="var(--pp-lilac)" stroke-opacity=".5" stroke-width="1.3" stroke-dasharray="2 4"/>';
    g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(b.birthG / 1000).toFixed(1) + '" y2="' + Y(b.birthG / 1000).toFixed(1) +
      '" stroke="var(--pp-ink3)" stroke-width="1.1" stroke-dasharray="6 4"/>';
    if (ws.length) {
      var linePts = pts.map(function (p) { return [X(p.day / 7), Y(p.kg)]; });
      g += '<path d="' + smoothPath(linePts) + '" fill="none" stroke="var(--pp-lilac-d)" stroke-width="2.6" stroke-linecap="round"/>';
      var lastP = pts[pts.length - 1];
      g += '<circle cx="' + X(lastP.day / 7).toFixed(1) + '" cy="' + Y(lastP.kg).toFixed(1) + '" r="4.6" fill="var(--pp-lilac-d)" stroke="var(--pp-paper)" stroke-width="2.2"/>';
    }
    g += '<text x="' + L + '" y="' + (H - 7) + '" style="fill:var(--pp-ink3)">تولد</text>' +
      '<text x="' + (W - R) + '" y="' + (H - 7) + '" text-anchor="end" style="fill:var(--pp-ink3)">هفتهٔ ' + fa(xmax) + "</text>";
    return g;
  }
  function momMiniHtml() {
    var ser = momSeries();
    if (ser.rows.length < 2) return patternHtml();
    return '<svg class="pp-ch pp-mini" viewBox="0 0 560 150" role="img" aria-label="نمای کوچک نمودار بهبود مادر">' + momMiniSvg(ser) + "</svg>" +
      '<p class="pp-mini-foot">نمای کوچکِ مسیر بهبود تو — نمودار کامل در بخش «تقویم و نمودار».</p>';
  }
  function patternHtml() {
    return '<svg class="pp-ch pp-mini" viewBox="0 0 560 150" role="img" aria-label="الگوی معمول بهبودی پس از زایمان — نمایشی">' + patternSvg() + "</svg>" +
      '<p class="pp-mini-foot">الگوی معمول بهبودی (نمایشی) — با اولین چک‌این‌ها، منحنی واقعی خودت جای آن را می‌گیرد.</p>';
  }
  function babyMiniHtml() {
    var b = S.db.baby;
    if (!b) {
      return '<p class="pp-mini-lead">برای دیدن منحنی رشد، جنسیت و وزن تولد نوزاد را یک‌بار ثبت کن.</p>' +
        '<div class="pp-mini-act"><button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-pp="tab" data-v="charts">ثبت در «تقویم و نمودار»</button></div>';
    }
    var ws = weightList();
    return '<svg class="pp-ch pp-mini" viewBox="0 0 560 150" role="img" aria-label="نمای کوچک نمودار رشد نوزاد">' + babyMiniSvg(ws) + "</svg>" +
      (ws.length
        ? '<p class="pp-mini-foot">آخرین وزن: ' + faKg(ws[ws.length - 1].g / 1000) + " کیلو در روز " + fa(ws[ws.length - 1].day) + " — نمودار کامل در «تقویم و نمودار».</p>"
        : '<p class="pp-mini-foot">نوار بنفش، محدودهٔ معمول WHO است؛ با ثبت وزن‌ها، منحنی نوزاد رسم می‌شود.</p>');
  }
  function entArtHtml() {
    var tab = S.chartTab || "mom";
    var n = todayDay();
    var cheer = (D.CHEERS && D.CHEERS.length) ? D.CHEERS[(n !== null && n >= 0 ? n : 0) % D.CHEERS.length] : "";
    return '<div class="pp-ent-art">' +
      '<div class="pp-ent-art-top"><b>' + ic("vital") + "یک نگاه، همین‌جا</b>" +
        '<span class="pp-ent-art-chips" role="tablist" aria-label="انتخاب نمودار ورودی">' +
          '<button type="button" data-pp="chart-tab" data-v="mom" aria-pressed="' + (tab === "mom") + '">بهبود من</button>' +
          '<button type="button" data-pp="chart-tab" data-v="baby" aria-pressed="' + (tab === "baby") + '">رشد نوزاد</button>' +
        "</span></div>" +
      (tab === "baby" ? babyMiniHtml() : momMiniHtml()) +
      (cheer ? '<div class="pp-cheer">' + ic("heart") + "<span>" + esc(cheer) + "</span></div>" : "") +
      "</div>";
  }
  function entranceHtml() {
    return '<section class="pp-entrance" aria-label="ورودی همراه مادر">' +
      '<div class="pp-ent-head"><b>سفر چهل‌و‌دو روزهٔ تو</b><span>آرام و قدم‌به‌قدم — بی‌قضاوت، فقط برای تو</span></div>' +
      '<div class="pp-ent-grid">' + PP_PHOTOS.map(function (p) { return photoHtml(p, false); }).join("") + "</div>" +
      entArtHtml() +
      "</section>";
  }

  /* ---------- چهار بخش تب‌شده — جای اسکرول چندمتری ---------- */
  var PP_TABS = [
    { v: "today", l: "امروز", ic: "sun" },
    { v: "charts", l: "تقویم و نمودار", ic: "vital" },
    { v: "care", l: "مراقبت من", ic: "users" },
    { v: "guides", l: "راهنماها", ic: "book" }
  ];
  function tabbarHtml() {
    var cur = S.tab || "today";
    return PP_TABS.map(function (tb) {
      return '<button type="button" class="pp-tab' + (cur === tb.v ? " on" : "") + '" role="tab" aria-selected="' + (cur === tb.v) + '" data-pp="tab" data-v="' + tb.v + '">' + ic(tb.ic) + "<span>" + tb.l + "</span></button>";
    }).join("");
  }

  /* ---------- کارت هشدار نرم بالای «امروز» — ایمنی همیشه دیده می‌شود ---------- */
  function todayAlertHtml() {
    var n = todayDay();
    if (n === null || n < 0) return "";
    var c = checkinAt(n);
    if (!c) return "";
    var urgent = c.bleed === "heavy" || c.fever === "yes" || c.pain === "severe";
    if (urgent) {
      return '<div class="pp-alert lv-urgent" role="alert">' +
        '<span class="pp-alert-ic">' + ic("flag") + "</span>" +
        "<div><b>امروز نشان‌هایی ثبت شده که نباید منتظر ویزیت بمانند.</b>" +
        "<p>فهرست «علائم خطر» را ببین و همین حالا با پزشک، ماما یا اورژانس تماس بگیر.</p>" +
        '<div class="pp-alert-acts"><button type="button" class="pp-btn pp-btn-sm pp-alert-btn" data-pp="flags">علائم خطر</button>' +
        '<a class="pp-btn pp-btn-sm pp-alert-btn" href="tel:115">تماس با اورژانس ۱۱۵</a></div></div></div>';
    }
    var prev = checkinAt(n - 1);
    if (c.mood === "rough" && prev && prev.mood === "rough") {
      return '<div class="pp-alert lv-care" role="status">' +
        '<span class="pp-alert-ic">' + ic("heart") + "</span>" +
        "<div><b>دو روز پشت‌هم حالت پایین بوده است.</b>" +
        "<p>تو تنها نیستی و این را جدی می‌گیریم. دو پرسش کوتاه بخش «تقویم و نمودار» را جواب بده و اگر خواستی با پزشک یا مامایت صحبت کن.</p>" +
        '<div class="pp-alert-acts"><button type="button" class="pp-btn pp-btn-sm pp-alert-btn" data-pp="tab" data-v="charts">دو پرسش PHQ-2</button>' +
        '<button type="button" class="pp-btn pp-btn-sm pp-btn-ghost pp-alert-btn" data-pp="guide" data-v="g-mood">راهنمای «حال من»</button></div></div></div>';
    }
    return "";
  }

  function headerHtml() {
    var n = todayDay();
    var ph = phaseOfDay(n);
    var acc = ph ? ph.accent : "#B08D57";
    var soft = ph ? ph.soft : "rgba(176,141,87,.12)";
    var hasProfile = deliveryJdn() !== null;
    return '<section class="pp-head" style="--pp-acc:' + acc + ";--pp-acc-soft:" + soft + '">' +
      '<div class="pp-head-row">' +
        '<span class="pp-head-day">' + ic("spark") +
          (hasProfile && n !== null && n >= 0
            ? "<b>روز " + (n === 0 ? "۰" : fa(n)) + "</b><i>·</i><span>" + (weekName(n) || (ph ? ph.name : "")) + "</span>"
            : "<span>همراه مادر</span>") +
        "</span>" +
        '<div class="pp-head-tools">' +
          '<button type="button" class="pp-tool' + (S.db.night ? " on" : "") + '" data-pp="night" aria-pressed="' + !!S.db.night + '" title="حالت شب برای شیردهی شبانه" aria-label="حالت شب">' + ic("moon") + "</button>" +
          '<button type="button" class="pp-tool" data-pp="backup" title="دانلود فایل پشتیبان از داده‌های من">' + ic("download") + "<span>پشتیبان</span></button>" +
          '<button type="button" class="pp-tool" data-pp="restore" title="بازیابی از فایل پشتیبان">' + ic("upload") + "<span>بازیابی</span></button>" +
          '<button type="button" class="pp-tool' + (S.setupOpen ? " on" : "") + '" data-pp="setup" aria-pressed="' + S.setupOpen + '" aria-expanded="' + S.setupOpen + '">' + ic("gear") + "<span>تنظیمات</span></button>" +
        "</div>" +
      "</div>" +
      (hasProfile && ph ? '<p class="pp-head-sub">' + esc(ph.name) + " — " + esc(ph.sub) + "</p>" : "") +
      (S.setupOpen || !hasProfile ? setupHtml() : "") +
      "</section>";
  }

  /* ---------- رندر: کارت «امروز برای تو» ---------- */
  function kindLabel(k) {
    return { body: "بدن و بهبودی", baby: "نوزاد", mind: "حال من", feed: "شیردهی", care: "مراقبت و پیگیری" }[k] || "";
  }
  function kindIcon(k) {
    return { body: "leaf", baby: "baby", mind: "heart", feed: "feed", care: "check" }[k] || "info";
  }
  function cardHtml(c) {
    return '<article class="pp-cc k-' + c.kind + '">' +
      '<div class="pp-cc-top"><span class="pp-cc-ic">' + ic(c.icon || kindIcon(c.kind)) + "</span>" +
        '<div><span class="pp-cc-kind">' + kindLabel(c.kind) + "</span><h3>" + esc(c.title) + "</h3></div></div>" +
      "<p>" + esc(c.body) + "</p>" +
      ((c.actions || []).length ? "<ul>" + c.actions.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" : "") +
      "</article>";
  }
  function todayHtml() {
    var n = todayDay();
    if (n === null || n < 0) return "";
    var cards = cardsForDay(n);
    var main = cards[0];
    var tasks = tasksForDay(n).slice(0, 2);   /* حداکثر دو کار در صفحهٔ اصلی */
    if (!main) return "";
    var jdn = deliveryJdn() + n;
    var taskState = (S.db.tasks[jdnToKey(jdn)] || {});
    var acts = (main.actions || []).slice(0, 3);
    var tasksHtml = tasks.map(function (t, i) {
      var done = !!taskState["t" + i];
      return '<button type="button" class="pp-task' + (done ? " done" : "") + '" data-pp="task" data-i="' + i + '" data-jdn="' + jdn + '" aria-pressed="' + done + '">' +
        '<span class="pp-box">' + (done ? ic("check") : "") + "</span><span>" + esc(t) + "</span></button>";
    }).join("");
    return '<section class="pp-sec pp-today-sec">' + todayAlertHtml() +
      '<div class="pp-card pp-today" style="--pp-acc:' + (phaseOfDay(n) ? phaseOfDay(n).accent : "#B08D57") + '">' +
        '<div class="pp-today-top">' +
          '<span class="pp-today-kick">' + ic("sun") + "امروز برای تو" + "</span>" +
          '<button type="button" class="pp-more" data-pp="day" data-day="' + n + '">بیشتر بخوان — محتوای کامل این روز' + ic("chev") + "</button>" +
        "</div>" +
        '<div class="pp-cc k-' + main.kind + ' pp-cc-main">' +
          '<div class="pp-cc-top"><span class="pp-cc-ic">' + ic(main.icon || kindIcon(main.kind)) + "</span>" +
            '<div><span class="pp-cc-kind">' + kindLabel(main.kind) + "</span><h3>" + esc(main.title) + "</h3></div></div>" +
          "<p>" + esc(main.body) + "</p>" +
          (acts.length ? "<ul>" + acts.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" : "") +
        "</div>" +
        (tasksHtml ? '<div class="pp-today-tasks">' + tasksHtml + "</div>" : "") +
      "</div></section>";
  }

  /* ---------- رندر: چک‌این (ثبت سریع + جزئیات) ---------- */
  function ciRowHtml(q, cur) {
    var btns = q.opts.map(function (o) {
      var danger = (q.danger || []).indexOf(o.v) > -1 ? " dang" : "";
      var face = q.type === "faces" ? faceSvg(o.v) : "";
      return '<button type="button" class="' + danger + '" data-pp="ci" data-k="' + q.k + '" data-v="' + o.v + '" ' +
        'aria-pressed="' + (cur === o.v) + '">' + face + esc(o.l) + "</button>";
    }).join("");
    return '<div class="pp-ci-row"><span class="pp-ci-lab">' + ic(q.icon) + esc(q.label) + "</span>" +
      '<div class="pp-seg' + (q.type === "faces" ? " pp-faces" : "") + '">' + btns + "</div></div>";
  }
  function faceSvg(v) {
    var m = {
      good: '<circle cx="12" cy="12" r="9"/><path d="M9 10.2v.1M15 10.2v.1"/><path d="M8.6 14.2c1 1.5 2.2 2.2 3.4 2.2s2.4-.7 3.4-2.2"/>',
      okay: '<circle cx="12" cy="12" r="9"/><path d="M9 10.2v.1M15 10.2v.1"/><path d="M9 14.6h6"/>',
      low: '<circle cx="12" cy="12" r="9"/><path d="M8.6 9.8 10.8 10.6M15.4 9.8 13.2 10.6"/><path d="M9 15.2h6"/>',
      rough: '<circle cx="12" cy="12" r="9"/><path d="M9 10.2v.1M15 10.2v.1"/><path d="M8.6 16c1-1.7 2.2-2.5 3.4-2.5s2.4.8 3.4 2.5"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (m[v] || m.okay) + "</svg>";
  }
  function qBy(k) { return D.CHECKIN.filter(function (q) { return q.k === k; })[0]; }
  function ciQuickHtml() {
    var ci = S.ci || {};
    return QUICK.map(function (k) { return ciRowHtml(qBy(k), ci[k]); }).join("");
  }
  /* پرسش نوک سینه فقط وقتی لازم است که درد شیردهی انتخاب شده باشد */
  function nippleNeeded(ans) { return ans.feed === "pain"; }
  function ciDetailsHtml() {
    var ci = S.ci || {};
    var saved = checkinAt(todayDay()) || {};
    var ans = Object.assign({}, saved, ci);
    var rows = DETAILS.map(function (k) {
      if (k === "nipple" && !nippleNeeded(ans)) return "";
      return ciRowHtml(qBy(k), ci[k]);
    }).join("");
    var dCur = (ci.diaper != null) ? ci.diaper : ((saved && saved.diaper != null) ? saved.diaper : 0);
    return rows +
      '<div class="pp-ci-row"><span class="pp-ci-lab">' + ic("baby") + "پوشک‌های خیس امروز</span>" +
        '<div class="pp-diaper">' +
          '<button type="button" data-pp="diaper" data-d="-1" aria-label="یکی کمتر">−</button>' +
          "<b>" + fa(dCur) + "</b>" +
          '<button type="button" data-pp="diaper" data-d="1" aria-label="یکی بیشتر">+</button>' +
        "</div>" +
        '<span class="pp-diaper-hint">از روز ۵ به بعد، ۶ پوشک خیس یا بیشتر در شبانه‌روز یعنی نوزاد شیر کافی می‌گیرد.</span>' +
      "</div>" +
      '<div class="pp-ci-row"><span class="pp-ci-lab">' + ic("note") + "یادداشت (اختیاری)</span>" +
        '<textarea class="pp-note" data-pp-in="note" rows="3" placeholder="مثلاً: امروز از عصر خیلی خسته بودم…">' + esc((S.ci && S.ci.note) || "") + "</textarea></div>";
  }
  function ciHtml() {
    if (deliveryJdn() === null) return "";
    var n = todayDay();
    var saved = checkinAt(n);
    var cnt = QUICK.length;
    return '<section class="pp-sec"><div class="pp-sec-head">' +
      '<span class="pp-ic">' + ic("check") + "</span><div><h2>ثبت سریع امروز</h2>" +
      '<div class="pp-sec-sub">فقط ' + fa(cnt) + " لمس؛ با هر تغییر، توصیه‌های متناسب پایین‌تر به‌روز می‌شود</div></div></div>" +
      '<div class="pp-card"><div class="pp-ci">' +
        '<div id="ppCiQuick">' + ciQuickHtml() + "</div>" +
        '<div class="pp-ci-details" id="ppCiDetails"' + (S.ciOpen ? "" : ' hidden="hidden"') + ">" + ciDetailsHtml() + "</div>" +
        '<div class="pp-ci-actions">' +
          '<button type="button" class="pp-btn pp-btn-main" data-pp="save-ci">' + ic("check") + "ذخیرهٔ ثبت امروز</button>" +
          '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-pp="ci-details" aria-expanded="' + S.ciOpen + '">' +
            (S.ciOpen ? ic("x") + "بستن جزئیات" : ic("plus") + "جزئیات بیشتر") + "</button>" +
          '<span class="pp-saved" id="ppSaved">' + (saved ? ic("check") + "امروز ثبت شده" : "") + "</span>" +
        "</div>" +
      "</div></div>" +
      '<div class="pp-outs" id="ppOuts"></div></section>';
  }
  function outsHtml() {
    var outs = S.outs;
    if (!outs.length) {
      var n = todayDay();
      var ph = phaseOfDay(n);
      return '<div class="pp-empty">' + ic("info") +
        "<span><b>با انتخاب موارد بالا، راهنمای متناسب با وضعیت امروزت همین‌جا ساخته می‌شود.</b>" +
        (ph ? " تا آن زمان، نکتهٔ فاز «" + ph.name + "» بالاتر را ببین." : "") + "</span></div>";
    }
    return outs.map(function (o) {
      var lv = "lv-" + o.level;
      var tag = o.level === "urgent" ? "نیاز به پیگیری فوری" : o.level === "care" ? "پیگیری لازم است" : "خودمراقبتی";
      return '<article class="pp-out ' + lv + '">' +
        '<div class="pp-out-t">' + ic(o.level === "urgent" ? "flag" : o.level === "care" ? "info" : "check") +
          "<span>" + esc(o.title) + "</span>" +
          '<span style="margin-inline-start:auto;font-size:10.5px;font-weight:700;opacity:.8">' + tag + "</span></div>" +
        "<p>" + esc(o.body) + "</p>" +
        ((o.actions || []).length ? "<ul>" + o.actions.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" : "") +
        (o.src ? '<p class="pp-out-src">منبع: <a href="' + o.src[1] + '" target="_blank" rel="noopener">' + esc(o.src[0]) + "</a></p>" : "") +
        (o.guide ? '<button type="button" class="pp-out-link" data-pp="guide" data-v="' + o.guide + '">راهنمای کامل این موضوع را ببین</button>' : "") +
        "</article>";
    }).join("");
  }

  /* ---------- رندر: نوار هفتگی + تقویم کامل (تاشو) ---------- */
  function calCellInner(d, isToday, ph, marks, extraCls) {
    var cls = "pp-day " + (extraCls || "") + (isToday ? "pp-today " : "") + (D.DAY_CARDS[d] ? "pp-milestone " : "") + (S.selCell === d ? "pp-sel" : "");
    var tint = ph && !isToday ? "background:" + ph.soft + ";color:" + ph.accent : "";
    return '<button type="button" class="' + cls + '" style="' + tint + '" data-pp="pick" data-day="' + d + '" ' +
      'aria-label="روز ' + fa(d) + '">' + "<b>" + fa(d) + "</b>" +
      (D.DAY_CARDS[d] ? "<small>ویژه</small>" : "") +
      (marks ? '<i class="pp-dotmark"' + (isToday ? ' style="background:#fff"' : "") + "></i>" : "") + "</button>";
  }
  function weekHtml() {
    if (deliveryJdn() === null) return "";
    var n = todayDay();
    var wk = weekCells(n);
    if (!wk) return "";
    var cells = "";
    wk.days.forEach(function (d) {
      var ph = phaseOfDay(d);
      var future = n !== null && d > n;
      var isToday = (n === d);
      var wd = S.JAL.WDS[S.JAL.colOf(deliveryJdn() + d)];
      var cls = "pp-day" + (isToday ? " pp-today " : " ") + (future ? "pp-future " : "") +
        (D.DAY_CARDS[d] ? "pp-milestone " : "") + (S.selCell === d ? "pp-sel" : "");
      var tint = ph && !isToday ? "background:" + ph.soft + ";color:" + ph.accent : "";
      cells += '<button type="button" class="' + cls + '" style="' + tint + '" data-pp="pick" data-day="' + d + '" ' +
        'aria-label="روز ' + fa(d) + '">' + "<b>" + fa(d) + "</b>" +
        "<small>" + wd + (D.DAY_CARDS[d] ? " · ویژه" : "") + "</small>" +
        (checkinAt(d) ? '<i class="pp-dotmark"' + (isToday ? ' style="background:#fff"' : "") + "></i>" : "") + "</button>";
    });
    var ph = phaseOfDay(n);
    return '<section class="pp-sec"><div class="pp-sec-head">' +
      '<span class="pp-ic">' + ic("cal") + "</span><div><h2>هفتهٔ " + fa(wk.index) + " از مسیر بهبودی</h2>" +
      '<div class="pp-sec-sub">روی هر روز بزن تا محتوای همان روز را ببینی؛ نقطهٔ رنگی یعنی چک‌این ثبت شده</div></div></div>' +
      '<div class="pp-cal-art" style="--pp-acc:' + (ph ? ph.accent : "#E0699A") + ";--pp-acc-soft:" + (ph ? ph.soft : "rgba(224,105,154,.15)") + '">' +
        '<div class="pp-cal-art-head">' +
          '<span class="pp-cal-phase"><i></i>' + (ph ? ph.name : "مسیر بهبودی") + "</span>" +
          '<span class="pp-cal-art-days">روز ' + fa(wk.start) + " تا " + fa(wk.end) + "</span>" +
        "</div>" +
        '<div class="pp-week">' + cells + "</div>" +
        '<div class="pp-cal-full" id="ppCalFull"' + (S.calFull ? "" : ' hidden="hidden"') + ">" +
          ribbonHtml() + gridHtml() +
          '<div class="pp-cal-top" style="margin-top:14px">' +
            '<span class="pp-cal-phase"><i></i>' + (ph ? ph.name + " — " + ph.sub : "") + "</span>" +
            '<div class="pp-cal-range" role="group" aria-label="بازهٔ تقویم">' +
              rangeBtn("d40", "۴۰ روز اول") + rangeBtn("m6", "تا ۶ ماه") + rangeBtn("y1", "تا یک سال") +
            "</div></div>" +
          '<p class="pp-cal-note">' + ic("info") + "<span>مراقبت پس از زایمان در روز ۴۰ تمام نمی‌شود؛ برای همین تقویم تا یک سال ادامه دارد. تقویم کامل برای مرور روزهاست — هر روز که خواستی، محتوایش با یک لمس باز می‌شود.</span></p>" +
          legendHtml() +
        "</div>" +
        '<button type="button" class="pp-cal-toggle" data-pp="cal-full" aria-expanded="' + S.calFull + '">' +
          (S.calFull ? ic("x") + "بستن تقویم کامل" : ic("cal") + "تقویم کامل (۴۰ روز اول / ۶ ماه / یک سال)") + "</button>" +
      "</div></section>";
  }
  function rangeBtn(v, l) {
    return '<button type="button" data-pp="range" data-v="' + v + '" aria-pressed="' + (S.range === v) + '">' + l + "</button>";
  }
  function legendHtml() {
    var items = D.PHASES.filter(function (p) { return p.id !== "after"; }).map(function (p) {
      return '<span><i style="background:' + p.accent + '"></i>' + p.name + "</span>";
    }).join("");
    return '<div class="pp-legend">' + items + "</div>";
  }
  function gridHtml() {
    var n = todayDay();
    var out = "";
    if (S.range === "d40") {
      var last = 42;
      S.JAL.WDS.forEach(function (w) { out += '<div class="pp-wd">' + w + "</div>"; });
      var dj = deliveryJdn();
      if (dj !== null) {
        var pad = S.JAL.colOf(dj + 1);
        for (var p = 0; p < pad; p++) out += "<div></div>";
      }
      for (var d = 1; d <= last; d++) {
        out += calCellInner(d, n === d, phaseOfDay(d), !!checkinAt(d), d > n ? "pp-future " : (d < n ? "pp-past " : ""));
      }
    } else if (S.range === "m6") {
      for (var w2 = 1; w2 <= 36; w2++) {
        var f = (w2 - 1) * 7 + 1, t2 = w2 * 7;
        var ph2 = phaseOfDay(f);
        var isNow = (n !== null && n >= f && n <= t2);
        var cls2 = (t2 < (n || 0) ? "pp-past " : "") + (isNow ? "pp-today " : "");
        var tint2 = ph2 && !isNow ? "background:" + ph2.soft + ";color:" + ph2.accent : "";
        out += '<button type="button" class="pp-day ' + cls2 + '" style="' + tint2 + '" data-pp="pick" data-day="' + f + '" ' +
          'aria-label="هفتهٔ ' + fa(w2) + '">' + "<b>" + fa(w2) + "</b><small>هفته</small>" +
          (hasCheckinInSpan(f, t2) ? '<i class="pp-dotmark"' + (isNow ? ' style="background:#fff"' : "") + "></i>" : "") + "</button>";
      }
    } else {
      for (var m = 1; m <= 12; m++) {
        var f2 = (m - 1) * 30 + 1, t3 = m * 30;
        var ph3 = phaseOfDay(f2);
        var isNow2 = (n !== null && n >= f2 && n <= t3);
        var cls3 = (t3 < (n || 0) ? "pp-past " : "") + (isNow2 ? "pp-today " : "");
        var tint3 = ph3 && !isNow2 ? "background:" + ph3.soft + ";color:" + ph3.accent : "";
        out += '<button type="button" class="pp-day ' + cls3 + '" style="' + tint3 + '" data-pp="pick" data-day="' + f2 + '" ' +
          'aria-label="ماه ' + fa(m) + '">' + "<b>" + fa(m) + "</b><small>ماه</small>" +
          (hasCheckinInSpan(f2, t3) ? '<i class="pp-dotmark"' + (isNow2 ? ' style="background:#fff"' : "") + "></i>" : "") + "</button>";
      }
    }
    var gridCls = "pp-grid" + (S.range === "m6" ? " pp-grid-weeks" : S.range === "y1" ? " pp-grid-months" : "");
    return '<div class="' + gridCls + '">' + out + "</div>";
  }
  function hasCheckinInSpan(fromDay, toDay) {
    for (var k in S.db.checkins) {
      var n = dayNumberOf(S.JAL.keyToJdn(k));
      if (n !== null && n >= fromDay && n <= toDay) return true;
    }
    return false;
  }
  function ribbonHtml() {
    var n = todayDay();
    var total = D.PHASES.reduce(function (a, p) {
      return a + (p.id === "after" ? 0 : Math.min(p.to, 365) - p.from + 1);
    }, 0) || 365;
    var segs = "";
    D.PHASES.forEach(function (p) {
      if (p.id === "after") return;
      var span = Math.min(p.to, 365) - p.from + 1;
      if (span <= 0) return;
      var w = (span / total) * 100;
      var on = (n !== null && n >= p.from && n <= p.to);
      segs += '<span class="' + (on ? "on" : "") + '" style="width:' + w.toFixed(2) + "%;background:" + p.accent + '" title="' + p.name + '"></span>';
    });
    return '<div class="pp-ribbon">' + segs + "</div>" +
      '<div class="pp-ribbon-lbl"><span>روز ۱</span><span>۴۰ روز</span><span>۶ ماه</span><span>یک سال</span></div>';
  }

  /* ---------- نمودارها: بهبود مادر + رشد نوزاد — artifact قاب‌دار (SVG خالص) ---------- */
  /* جدول رسمی WHO — وزن برای سن (کیلوگرم)، ستون‌های -۲SD / میانه / +۲SD.
     منبع مستقیم: WHO Child Growth Standards — weight-for-age (who.int)؛
     فایل‌های رسمی z-scores: هفتگی «Birth to 13 weeks» و ماهانه «Birth to 5 years».
     دقت: هفتگی تا روز ۹۷، پس از آن ماهانه. */
  var WHO = {
    wk: {
      boy:  { lo: [2.5, 2.6, 2.8, 3.1, 3.3, 3.5, 3.8, 4.0, 4.2, 4.4, 4.5, 4.7, 4.9, 5.0],
              md: [3.3, 3.5, 3.8, 4.1, 4.4, 4.7, 4.9, 5.2, 5.4, 5.6, 5.8, 6.0, 6.2, 6.4],
              hi: [4.4, 4.6, 4.9, 5.3, 5.7, 6.0, 6.3, 6.6, 6.9, 7.2, 7.4, 7.6, 7.8, 8.0] },
      girl: { lo: [2.4, 2.5, 2.7, 2.9, 3.1, 3.3, 3.5, 3.7, 3.8, 4.0, 4.1, 4.3, 4.4, 4.5],
              md: [3.2, 3.3, 3.6, 3.8, 4.1, 4.3, 4.6, 4.8, 5.0, 5.2, 5.4, 5.5, 5.7, 5.8],
              hi: [4.2, 4.4, 4.7, 5.0, 5.4, 5.7, 6.0, 6.2, 6.5, 6.7, 6.9, 7.1, 7.3, 7.5] }
    },
    mo: {
      boy:  { lo: [2.5, 3.4, 4.3, 5.0, 5.6, 6.0, 6.4, 6.7, 6.9, 7.1, 7.4, 7.6, 7.7],
              md: [3.3, 4.5, 5.6, 6.4, 7.0, 7.5, 7.9, 8.3, 8.6, 8.9, 9.2, 9.4, 9.6],
              hi: [4.4, 5.8, 7.1, 8.0, 8.7, 9.3, 9.8, 10.3, 10.7, 11.0, 11.4, 11.7, 12.0] },
      girl: { lo: [2.4, 3.2, 3.9, 4.5, 5.0, 5.4, 5.7, 6.0, 6.3, 6.5, 6.7, 6.9, 7.0],
              md: [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9],
              hi: [4.2, 5.5, 6.6, 7.5, 8.2, 8.8, 9.3, 9.8, 10.2, 10.5, 10.9, 11.2, 11.5] }
    }
  };
  function whoAt(sex, ageDays) {
    if (ageDays < 98) {           /* ۱۴ هفتگی اول: جدول هفتگی رسمی */
      var t = WHO.wk[sex] || WHO.wk.boy;
      var m = Math.max(0, Math.min(13, ageDays / 7));
      var i = Math.min(12, Math.floor(m)), f = m - i;
      function lw(a) { return a[i] + (a[i + 1] - a[i]) * f; }
      return { lo: lw(t.lo), md: lw(t.md), hi: lw(t.hi) };
    }
    var t2 = WHO.mo[sex] || WHO.mo.boy;
    var m2 = Math.max(0, Math.min(12, ageDays / 30.4375));
    var i2 = Math.min(11, Math.floor(m2)), f2 = m2 - i2;
    function lm(a) { return a[i2] + (a[i2 + 1] - a[i2]) * f2; }
    return { lo: lm(t2.lo), md: lm(t2.md), hi: lm(t2.hi) };
  }
  function parseNum(v) {
    if (v == null) return NaN;
    var x = String(v).replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); })
      .replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); })
      .replace(/[٫,،]/g, ".").trim();
    return parseFloat(x);
  }
  function faKg(v) { return fa((Math.round(v * 10) / 10).toString().replace(".", "٫")); }
  function weightList() {
    var dj = deliveryJdn(), out = [];
    if (dj === null) return out;
    Object.keys(S.db.weights || {}).forEach(function (k) {
      var day = S.JAL.keyToJdn(k) - dj;
      if (day >= 1 && day <= 365) out.push({ key: k, day: day, g: S.db.weights[k] });
    });
    out.sort(function (a, b) { return a.day - b.day; });
    return out;
  }

  /* پیام محتاط زیر نمودار — آستانه‌ها (افت ۱۰٪، بازگشت تا ۱۴ روزگی) از
     توصیهٔ رایج مراقبت نوزاد است و پیش از انتشار نهایی باید توسط
     پزشک/مراقب سلامت تأیید شود؛ خروجی تشخیص نیست. */
  function babyNoteFor(baby, ws, n) {
    if (!ws.length) return { lv: "info", t: "برای ساخته‌شدن نمودار، وزن نوزاد را در ویزیت‌ها یا هر بار وزن‌کردن ثبت کن." };
    var last = ws[ws.length - 1], ratio = last.g / baby.birthG;
    if (last.day <= 14) {
      if (ratio < 0.9) return { lv: "care", t: "وزن بیش از ۱۰٪ کمتر از وزن تولد است. همین امروز با پزشک یا مراقب سلامت تماس بگیر." };
      if (ratio < 1) return { lv: "info", t: "کمی افت وزن در روزهای اول معمول است. بیشتر نوزادها تا حدود ۱۰ تا ۱۴ روزگی به وزن تولد برمی‌گردند." };
      return { lv: "info", t: "نوزاد به وزن تولد رسیده است. خیلی خوب." };
    }
    if (ratio < 1) return { lv: "care", t: "وزن هنوز به وزن تولد نرسیده است. این را در اولین فرصت با پزشک یا مراقب سلامت در میان بگذار." };
    var ref = whoAt(baby.sex, last.day), kg = last.g / 1000;
    if (kg < ref.lo) return { lv: "care", t: "وزن پایین‌تر از محدودهٔ معمول نمودار است. این به‌تنهایی تشخیص نیست، ولی با پزشک یا مراقب سلامت مشورت کن." };
    if (kg > ref.hi) return { lv: "care", t: "وزن بالاتر از محدودهٔ معمول نمودار است. این به‌تنهایی تشخیص نیست، ولی در ویزیت بعدی بپرس." };
    return { lv: "info", t: "وزن در محدودهٔ معمول است." };
  }

  function babySvg(ws) {
    var b = S.db.baby, n = todayDay();
    var pts = [{ day: 0, kg: b.birthG / 1000 }].concat(ws.map(function (w) { return { day: w.day, kg: w.g / 1000 }; }));
    var xmax = Math.max(13, Math.min(52, Math.ceil(n / 7) + 1));
    var W = 560, H = 300, L = 18, R = 66, T = 34, B = 48, pw = W - L - R, ph = H - T - B;
    var steps = 40, band = [], i;
    for (i = 0; i <= steps; i++) {
      var wk = i / steps * xmax, r = whoAt(b.sex, wk * 7);
      band.push({ wk: wk, lo: r.lo, md: r.md, hi: r.hi });
    }
    var vals = [];
    band.forEach(function (p) { vals.push(p.lo, p.hi); });
    pts.forEach(function (p) { vals.push(p.kg); });
    var ymin = Math.floor(Math.min.apply(null, vals) - 0.4), ymax = Math.ceil(Math.max.apply(null, vals) + 0.4);
    if (ymax - ymin < 3) ymax = ymin + 3;
    var ystep = (ymax - ymin) > 8 ? 2 : 1;
    function X(w) { return L + (1 - w / xmax) * pw; }
    function Y(k) { return T + (1 - (k - ymin) / (ymax - ymin)) * ph; }
    var g = '<defs><linearGradient id="ppgBand" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="var(--pp-lilac)" stop-opacity=".16"/>' +
      '<stop offset="1" stop-color="var(--pp-lilac)" stop-opacity=".05"/></linearGradient></defs>';
    for (var y = ymin; y <= ymax; y += ystep) {
      g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(y).toFixed(1) + '" y2="' + Y(y).toFixed(1) +
        '" stroke="var(--pp-line)" stroke-width="1" stroke-dasharray="1 5"/>' +
        '<text x="' + (W - R + 8) + '" y="' + (Y(y) + 3.5).toFixed(1) + '" style="fill:var(--pp-ink3)">' + fa(y) + "</text>";
    }
    var xs = xmax <= 14 ? 2 : xmax <= 28 ? 4 : 8;
    for (var x = 0; x <= xmax; x += xs) {
      g += '<text x="' + X(x).toFixed(1) + '" y="' + (H - B + 20) + '" text-anchor="middle" style="fill:var(--pp-ink3)">' + fa(x) + "</text>";
    }
    var hiPts = band.map(function (p) { return [X(p.wk), Y(p.hi)]; });
    var loPts = band.map(function (p) { return [X(p.wk), Y(p.lo)]; }).reverse();
    var bandD = smoothPath(hiPts) + " " + smoothPath(loPts).replace(/^M/, "L") + " Z";
    var mdPts = band.map(function (p) { return [X(p.wk), Y(p.md)]; });
    var linePts = pts.map(function (p) { return [X(p.day / 7), Y(p.kg)]; });
    var by = Y(b.birthG / 1000).toFixed(1);
    var dots = pts.map(function (p, j) {
      var last = j === pts.length - 1 && j > 0, first = j === 0;
      return '<circle cx="' + X(p.day / 7).toFixed(1) + '" cy="' + Y(p.kg).toFixed(1) + '" r="' + (last ? 5.5 : 4) +
        '" fill="' + (first ? "var(--pp-paper)" : "var(--pp-lilac-d)") + '" stroke="' + (first ? "var(--pp-lilac-d)" : "var(--pp-paper)") + '" stroke-width="2.4"/>';
    }).join("");
    var lastP = pts[pts.length - 1];
    var lx = X(lastP.day / 7), ly = Y(lastP.kg);
    var label = faKg(lastP.kg), lw2 = label.length * 8 + 18;
    var pill = pts.length > 1
      ? '<g><rect x="' + Math.min(Math.max(lx - lw2 / 2, L), W - R - lw2).toFixed(1) + '" y="' + (ly - 36).toFixed(1) +
        '" width="' + lw2.toFixed(1) + '" height="22" rx="11" fill="var(--pp-lilac-d)"/>' +
        '<text x="' + lx.toFixed(1) + '" y="' + (ly - 21).toFixed(1) +
        '" text-anchor="middle" style="fill:#fff;font-weight:700;font-size:12px">' + label + "</text></g>"
      : "";
    var desc = "نمودار وزن نوزاد نسبت به محدودهٔ معمول WHO؛ آخرین وزن " + faKg(lastP.kg) + " کیلوگرم";
    return '<svg class="pp-ch" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + desc + '">' + g +
      '<path d="' + bandD + '" fill="url(#ppgBand)"/>' +
      '<path d="' + smoothPath(mdPts) + '" fill="none" stroke="var(--pp-lilac)" stroke-opacity=".45" stroke-width="1.4" stroke-dasharray="2 4"/>' +
      '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + by + '" y2="' + by + '" stroke="var(--pp-ink3)" stroke-width="1.2" stroke-dasharray="6 4"/>' +
      '<path d="' + smoothPath(linePts) + '" fill="none" stroke="var(--pp-lilac-d)" stroke-width="2.8" stroke-linecap="round"/>' + dots + pill +
      '<text x="' + (L + pw / 2) + '" y="' + (H - 10) + '" text-anchor="middle" style="fill:var(--pp-ink3)">سن نوزاد (هفته)</text>' +
      '<text x="' + (W - R + 8) + '" y="' + (T - 12) + '" style="fill:var(--pp-ink3)">کیلو</text></svg>';
  }

  function babyHtml() {
    var b = S.db.baby;
    if (!b) {
      var sx = S.draftSex || "boy";
      return '<p class="pp-ch-lead">برای رسم نمودار رشد، جنسیت و وزن تولد نوزاد را یک بار ثبت کن.</p>' +
        '<div class="pp-ch-form"><div class="pp-seg">' +
          '<button type="button" data-pp="baby-sex" data-v="boy" aria-pressed="' + (sx === "boy") + '">پسر</button>' +
          '<button type="button" data-pp="baby-sex" data-v="girl" aria-pressed="' + (sx === "girl") + '">دختر</button></div>' +
          '<input class="pp-ch-in" data-pp-in="bw0" inputmode="decimal" placeholder="وزن تولد (کیلو) مثلاً ۳٫۳" aria-label="وزن تولد به کیلوگرم">' +
          '<button type="button" class="pp-btn pp-btn-sm" data-pp="baby-save">ذخیره</button></div>';
    }
    var ws = weightList(), note = babyNoteFor(b, ws, todayDay());
    var wks = Math.max(13, Math.min(52, Math.ceil(todayDay() / 7) + 1));
    return chArt("رشد وزن نوزاد", "محدودهٔ معمول WHO · تا هفتهٔ " + fa(wks),
      '<div class="pp-ch-leg"><span><i class="pp-ch-sw" style="background:var(--pp-lilac-d)"></i>وزن نوزاد</span>' +
        '<span><i class="pp-ch-sw" style="background:var(--pp-lilac-s);border:1px solid var(--pp-lilac)"></i>محدودهٔ معمول</span>' +
        '<span><i class="pp-ch-dash"></i>وزن تولد (' + faKg(b.birthG / 1000) + ")</span></div>" +
        babySvg(ws) +
        '<div class="pp-ch-note lv-' + note.lv + '">' + esc(note.t) + "</div>" +
        '<div class="pp-ch-form"><input class="pp-ch-in" data-pp-in="w" inputmode="decimal" placeholder="وزن امروز (کیلو) مثلاً ۴٫۲" aria-label="وزن امروز به کیلوگرم">' +
          '<button type="button" class="pp-btn pp-btn-sm" data-pp="weight-add">ثبت وزن</button></div>' +
        (ws.length ? '<div class="pp-ch-list">' + ws.slice(-3).reverse().map(function (w) {
          return "<span>روز " + fa(w.day) + " · " + faKg(w.g / 1000) + ' کیلو <button type="button" data-pp="weight-del" data-k="' + w.key + '" aria-label="حذف این وزن">×</button></span>';
        }).join("") + "</div>" : "") +
        '<p class="pp-ch-foot">بر پایهٔ جدول رسمی رشد WHO (وزن برای سن، محدودهٔ ±۲ انحراف معیار). جایگزین ارزیابی پزشک نیست. <button type="button" class="pp-link" data-pp="baby-edit">ویرایش جنسیت و وزن تولد</button></p>');
  }

  var SC = {
    bleed: { none: 100, light: 85, period: 55, heavy: 0 },
    pain: { none: 100, mild: 75, moderate: 45, severe: 10 },
    energy: { good: 100, ok: 70, low: 40, empty: 10 },
    mood: { good: 100, okay: 70, low: 40, rough: 10 },
    sleep: { good: 100, ok: 70, bad: 40, none: 10 }
  };
  function mean(a) {
    var s = 0, c = 0;
    a.forEach(function (v) { if (v != null) { s += v; c++; } });
    return c ? s / c : null;
  }
  function momSeries() {
    var n = todayDay(), start = Math.max(0, n - 29), rows = [], d;
    for (d = start; d <= n; d++) {
      var c = checkinAt(d);
      if (!c) continue;
      rows.push({
        day: d,
        body: mean([SC.bleed[c.bleed], SC.pain[c.pain], SC.energy[c.energy]]),
        mind: mean([SC.mood[c.mood], SC.sleep[c.sleep]]),
        flag: c.bleed === "heavy" || c.fever === "yes" || c.pain === "severe"
      });
    }
    rows.forEach(function (r, i) {
      var near = rows.filter(function (q) { return q.day <= r.day && q.day >= r.day - 2; });
      r.sb = mean(near.map(function (q) { return q.body; }));
      r.sm = mean(near.map(function (q) { return q.mind; }));
    });
    /* محور از اولین روزِ داده‌دار شروع می‌شود تا نمودار خالی و لم‌زده دیده نشود */
    var first = rows.length ? rows[0].day : start;
    return { rows: rows, start: Math.max(0, first - 1) };
  }
  function momSummary() {
    var n = todayDay();
    function win(a, b) {
      var cs = [];
      for (var d = a; d <= b; d++) { var c = checkinAt(d); if (c) cs.push(c); }
      return cs;
    }
    var cur = win(n - 6, n), prev = win(n - 13, n - 7);
    if (cur.length < 2 || prev.length < 2) return "";
    function avg(cs, map, key) { return mean(cs.map(function (c) { return map[c[key]]; })); }
    var parts = [], defs = [
      ["pain", SC.pain, "درد کمتر", "درد بیشتر"],
      ["energy", SC.energy, "انرژی بیشتر", "انرژی کمتر"],
      ["sleep", SC.sleep, "خواب بهتر", "خواب سخت‌تر"],
      ["mood", SC.mood, "حال‌وهوا بهتر", "حال‌وهوا پایین‌تر"]
    ];
    defs.forEach(function (q) {
      var a = avg(cur, q[1], q[0]), b = avg(prev, q[1], q[0]);
      if (a == null || b == null) return;
      if (a - b >= 10) parts.push(q[2]); else if (b - a >= 10) parts.push(q[3]);
    });
    return "نسبت به هفتهٔ پیش: " + (parts.length ? parts.join("، ") : "تغییر مشخصی دیده نمی‌شود") + ".";
  }
  /* منحنی نرم: Catmull-Rom → بزیه مکعبی — برای ظاهر ظریف و طبیعی خط */
  function smoothPath(pts) {
    if (!pts.length) return "";
    if (pts.length < 3) return pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
        " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
        " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }
  /* قاب artifact: ردیف عنوان + چیپ بازه + بدنه */
  function chArt(title, period, bodyHtml) {
    return '<div class="pp-ch-art"><div class="pp-ch-art-top"><b>' + ic("vital") + esc(title) + "</b>" +
      "<span>" + esc(period) + "</span></div>" + bodyHtml + "</div>";
  }

  function momSvg(ser) {
    var rows = ser.rows, n = todayDay(), start = ser.start;
    var span = Math.max(6, n - start);
    var W = 560, H = 300, L = 18, R = 66, T = 34, B = 48, pw = W - L - R, ph = H - T - B;
    function X(d) { return L + (1 - (d - start) / span) * pw; }
    function Y(v) { return T + (1 - v / 100) * ph; }
    var g = '<defs><linearGradient id="ppgBody" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="var(--pp-blue-d)" stop-opacity=".2"/>' +
      '<stop offset="1" stop-color="var(--pp-blue-d)" stop-opacity="0"/></linearGradient></defs>';
    [0, 25, 50, 75, 100].forEach(function (v, i) {
      g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) +
        '" stroke="var(--pp-line)" stroke-width="1"' + (i === 0 || i === 4 ? "" : ' stroke-dasharray="1 5"') + "/>";
    });
    g += '<text x="' + (W - R + 8) + '" y="' + (Y(100) + 4) + '" style="fill:var(--pp-ink3)">بهتر</text>' +
      '<text x="' + (W - R + 8) + '" y="' + (Y(0) + 3) + '" style="fill:var(--pp-ink3)">سخت‌تر</text>';
    var xs = span <= 16 ? 2 : span <= 30 ? 5 : 10;
    for (var d = n; d >= start; d -= xs) {
      var isT = d === n;
      g += '<text x="' + X(d).toFixed(1) + '" y="' + (H - B + 20) + '" text-anchor="middle" ' +
        (isT ? 'style="fill:var(--pp-blue-d);font-weight:700;font-size:11.5px"' : 'style="fill:var(--pp-ink3)"') + ">" +
        (isT ? "امروز" : fa(d)) + "</text>";
    }
    if (42 >= start && 42 <= start + span) {
      g += '<line x1="' + X(42).toFixed(1) + '" x2="' + X(42).toFixed(1) + '" y1="' + (T - 8) + '" y2="' + (H - B) +
        '" stroke="var(--pp-orange-d)" stroke-width="1.2" stroke-dasharray="2 5"/>' +
        '<text x="' + X(42).toFixed(1) + '" y="' + (T - 14) + '" text-anchor="middle" style="fill:var(--pp-orange-d);font-size:10.5px">ویزیت ۶ هفته‌ای</text>';
    }
    var ptsB = rows.map(function (r) { return [X(r.day), Y(r.sb)]; });
    var ptsM = rows.map(function (r) { return [X(r.day), Y(r.sm)]; });
    var area = smoothPath(ptsB) + " L" + ptsB[ptsB.length - 1][0].toFixed(1) + " " + Y(0).toFixed(1) +
      " L" + ptsB[0][0].toFixed(1) + " " + Y(0).toFixed(1) + " Z";
    g += '<path d="' + area + '" fill="url(#ppgBody)"/>';
    function ln(pts, color, dash, w) {
      var dots = pts.map(function (p) {
        return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.7" fill="' + color + '" stroke="var(--pp-paper)" stroke-width="1.3"/>';
      }).join("");
      return '<path d="' + smoothPath(pts) + '" fill="none" stroke="' + color + '" stroke-width="' + w +
        '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="6 5"' : "") + "/>" + dots;
    }
    var flags = rows.filter(function (r) { return r.flag; }).map(function (r) {
      return '<path d="M' + X(r.day).toFixed(1) + " " + (H - B - 2) + " l-4.5 -8 h9 z" + '" fill="var(--pp-orange-d)"/>';
    }).join("");
    var desc = "نمودار بهبود از روز " + fa(start) + " تا امروز؛ دو خط بدن و ذهن";
    return '<svg class="pp-ch" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + desc + '">' + g +
      ln(ptsM, "var(--pp-pink)", true, 2.2) + ln(ptsB, "var(--pp-blue-d)", false, 2.8) + flags +
      '<text x="' + (L + pw / 2) + '" y="' + (H - 10) + '" text-anchor="middle" style="fill:var(--pp-ink3)">روز پس از زایمان</text></svg>';
  }
  function momHtml() {
    var ser = momSeries();
    if (ser.rows.length < 2) return '<p class="pp-ch-lead">با چند روز چک‌این، نمودار بهبودت ساخته می‌شود. هر بار فقط چند لمس.</p>';
    var hasFlag = ser.rows.some(function (r) { return r.flag; });
    var sum = momSummary();
    return chArt("مسیر بهبود تو", "۳۰ روز اخیر · میانگین ۳ روزه",
      '<div class="pp-ch-leg"><span><i class="pp-ch-ln" style="border-color:var(--pp-blue-d)"></i>بدن (خون‌ریزی، درد، انرژی)</span>' +
        '<span><i class="pp-ch-ln dash" style="border-color:var(--pp-pink)"></i>ذهن (حال‌وهوا، خواب)</span>' +
        (hasFlag ? '<span><i class="pp-ch-tri"></i>روز هشدار</span>' : "") + "</div>" +
        momSvg(ser) +
        (sum ? '<div class="pp-ch-note lv-info">' + esc(sum) + "</div>" : "") +
        '<p class="pp-ch-foot">میانگین ۳ روزهٔ چک‌این‌هایی که ثبت کرده‌ای. بالاتر یعنی راحت‌تر؛ نوسان در این دوره طبیعی است.</p>');
  }
  function chartsHtml() {
    var tab = S.chartTab || "mom";
    return '<div class="pp-cal-range pp-ch-tabs" role="tablist">' +
      '<button type="button" role="tab" data-pp="chart-tab" data-v="mom" aria-pressed="' + (tab === "mom") + '">بهبود من</button>' +
      '<button type="button" role="tab" data-pp="chart-tab" data-v="baby" aria-pressed="' + (tab === "baby") + '">رشد نوزاد</button></div>' +
      (tab === "baby" ? babyHtml() : momHtml());
  }
  function trendHtml() {
    if (deliveryJdn() === null) return "";
    var screen = S.db.screen || {};
    var screenScore = (screen.q1 || 0) + (screen.q2 || 0);
    return '<section class="pp-sec"><div class="pp-sec-head">' +
      '<span class="pp-ic">' + ic("vital") + "</span><div><h2>پیشرفت</h2>" +
      '<div class="pp-sec-sub">بهبود من و رشد نوزاد، یک‌نگاه</div></div></div>' +
      '<div class="pp-card">' + chartsHtml() +
      '<div class="pp-screen"><h4>' + ic("heart") + " دو پرسش کوتاه دربارهٔ حالت (" + esc(D.MOOD_SCREEN.tool) + ")</h4>" +
        '<p style="font-size:12.5px;color:var(--pp-ink2);margin-bottom:9px">' + esc(D.MOOD_SCREEN.note) + "</p>" +
        D.MOOD_SCREEN.qs.map(function (q, qi) {
          return '<div class="pp-ci-row" style="margin-bottom:10px"><span class="pp-ci-lab">' + esc(q) + "</span>" +
            '<div class="pp-seg">' + D.MOOD_SCREEN.opts.map(function (o) {
              return '<button type="button" data-pp="screen" data-q="' + (qi + 1) + '" data-v="' + o.v + '" aria-pressed="' + (screen["q" + (qi + 1)] === o.v) + '">' + o.l + "</button>";
            }).join("") + "</div></div>";
        }).join("") +
        screenHistoryHtml(screen) +
        (screenScore >= D.MOOD_SCREEN.cutoff
          ? '<div class="pp-out lv-care" style="margin-top:6px">' + '<div class="pp-out-t">' + ic("info") + "ارزش دارد با پزشک یا ماما صحبت کنی</div>" +
            "<p>نمرهٔ مجموع تو " + fa(screenScore) + " است. این یک غربالگری کوتاه است، نه تشخیص؛ ولی همین اندازه هم یعنی گفت‌وگو با پزشک می‌تواند کمک کند.</p>" +
            '<button type="button" class="pp-out-link" data-pp="guide" data-v="g-mood">راهنمای «حال من» را ببین</button></div>'
          : "") +
        '<p class="pp-ch-foot" style="margin-top:8px">منبع: ' +
        '<a href="' + D.MOOD_SCREEN.src[1] + '" target="_blank" rel="noopener">' + esc(D.MOOD_SCREEN.src[0]) + "</a></p>" +
      "</div></div>" +
      visitRowHtml() +
      "</section>";
  }

  /* ---------- غربالگری تکرارشونده (PHQ-2): تاریخ، یادآوری ۱۴ روز، تاریخچه ---------- */
  var SCREEN_RETEST_DAYS = 14;
  function screenInfoFor(screen, todayJ) {
    var log = (screen && screen.log) || [];
    var last = log.length ? log[log.length - 1] : null;
    var days = null;
    if (last && last.at) { try { days = todayJ - S.JAL.keyToJdn(last.at); } catch (e) { days = null; } }
    return {
      score: ((screen && screen.q1) || 0) + ((screen && screen.q2) || 0),
      answered: !!(screen && screen.q1 != null && screen.q2 != null),
      last: last, days: days, log: log,
      due: !!(last && days !== null && days >= SCREEN_RETEST_DAYS)
    };
  }
  function shortDate(key) {
    try {
      var j = S.JAL.d2j(S.JAL.keyToJdn(key));
      return fa(j.jd) + " " + S.JAL.MONTHS[j.jm - 1];
    } catch (e) { return String(key); }
  }
  function screenHistoryHtml(screen) {
    var info = screenInfoFor(screen, todayJdn());
    var cut = D.MOOD_SCREEN.cutoff;
    var out = "";
    if (info.log.length) {
      out += '<div class="pp-screen-hist"><span class="pp-screen-hist-t">' + ic("cal") + "نمره‌های قبلی:</span>" +
        info.log.slice(-3).reverse().map(function (e) {
          return '<span class="pp-hpill' + (e.s >= cut ? " hot" : "") + '">نمرهٔ ' + fa(e.s) + " · " + esc(shortDate(e.at)) + "</span>";
        }).join("") + "</div>";
    }
    if (info.due) {
      out += '<div class="pp-screen-due">' + ic("info") +
        "<span><b>" + fa(info.days) + " روز</b> از آخرین بررسی گذشته. غربالگری خلق تکرارشونده است — همین حالا دوباره جواب بده.</span></div>";
    } else if (info.last && info.answered) {
      out += '<div class="pp-screen-last">آخرین بررسی: ' + esc(shortDate(info.last.at)) + "</div>";
    }
    return out;
  }

  /* ---------- خلاصهٔ ویزیت: برگهٔ چاپ‌شوندهٔ آفلاین ---------- */
  function optLabel(k, v) {
    var q = qBy(k);
    if (!q) return v == null ? "—" : String(v);
    for (var i = 0; i < q.opts.length; i++) if (q.opts[i].v === v) return q.opts[i].l;
    return v == null ? "—" : String(v);
  }
  function visitData() {
    var dj = deliveryJdn(), days = [];
    if (dj !== null) {
      var keys = Object.keys(S.db.checkins);
      keys.sort(function (a, b) { return S.JAL.keyToJdn(a) - S.JAL.keyToJdn(b); });
      keys.forEach(function (k) {
        var c = S.db.checkins[k];
        var dn = dayNumberOf(S.JAL.keyToJdn(k));
        if (dn === null || dn < 0) return;
        days.push({
          day: dn, bleed: optLabel("bleed", c.bleed), pain: optLabel("pain", c.pain),
          fever: optLabel("fever", c.fever), mood: optLabel("mood", c.mood),
          sleep: optLabel("sleep", c.sleep), energy: optLabel("energy", c.energy),
          diaper: c.diaper != null ? fa(c.diaper) : "—",
          flag: c.bleed === "heavy" || c.fever === "yes" || c.pain === "severe"
        });
      });
      days.reverse(); /* تازه‌ترین اول */
      days = days.slice(0, 14);
    }
    var p = S.db.profile || {};
    return {
      day: todayDay(), birth: dj !== null ? fmtJ(dj) : "",
      type: p.type === "csection" ? "سزارین" : p.type === "vaginal" ? "طبیعی" : "—",
      feeding: p.feeding === "breast" ? "شیر مادر" : p.feeding === "mixed" ? "ترکیبی" : p.feeding === "formula" ? "شیر خشک" : "—",
      checkins: days,
      flagDays: days.filter(function (d) { return d.flag; }).length,
      baby: S.db.baby ? { sex: S.db.baby.sex === "girl" ? "دختر" : "پسر", birthKg: faKg(S.db.baby.birthG / 1000) } : null,
      weights: weightList().map(function (w) { return { day: w.day, kg: faKg(w.g / 1000) }; }),
      screen: screenInfoFor(S.db.screen || {}, todayJdn()),
      today: fmtJ(todayJdn())
    };
  }
  function visitSummaryHtml() {
    var vd = visitData(), cut = D.MOOD_SCREEN.cutoff;
    var rows = vd.checkins.map(function (c) {
      return "<tr" + (c.flag ? ' class="fl"' : "") + "><td>روز " + fa(c.day) + "</td><td>" + esc(c.bleed) + "</td><td>" +
        esc(c.pain) + "</td><td>" + esc(c.fever) + "</td><td>" + esc(c.mood) + "</td><td>" + esc(c.sleep) + "</td><td>" +
        esc(c.energy) + "</td><td>" + c.diaper + "</td></tr>";
    }).join("");
    var wrows = vd.weights.map(function (w) { return "<tr><td>روز " + fa(w.day) + "</td><td>" + w.kg + "</td></tr>"; }).join("");
    var scr = vd.screen;
    var scrTxt = scr.log.length
      ? ("آخرین نمره: " + fa(scr.last.s) + " در " + esc(shortDate(scr.last.at)) +
        (scr.log.length > 1 ? " — نمره‌های قبل‌تر: " + scr.log.slice(0, -1).slice(-3).reverse().map(function (e) { return fa(e.s); }).join("، ") : "") +
        (scr.last.s >= cut ? " (بالای نقطهٔ برش)" : ""))
      : "ثبت نشده";
    return '<div class="pp-print-head"><h1>خلاصهٔ ویزیت — همراه مادر</h1>' +
      "<p>سَمن · چاپ در " + esc(vd.today) + (vd.day !== null && vd.day >= 0 ? " · روز " + fa(vd.day) + " پس از زایمان" : "") + "</p></div>" +
      '<div class="pp-print-grid">' +
      "<div><h3>پروفایل</h3><p>تولد نوزاد: " + esc(vd.birth || "—") + "<br>نوع زایمان: " + esc(vd.type) + "<br>تغذیه: " + esc(vd.feeding) + "</p></div>" +
      "<div><h3>نوزاد</h3><p>" + (vd.baby ? "جنسیت: " + esc(vd.baby.sex) + "<br>وزن تولد: " + vd.baby.birthKg + " کیلو" : "ثبت نشده") + "</p></div>" +
      "<div><h3>غربالگری خلق (PHQ-2)</h3><p>" + scrTxt + "</p></div>" +
      "</div>" +
      (vd.weights.length ? "<h3>وزن‌های ثبت‌شدهٔ نوزاد</h3><table><thead><tr><th>روز</th><th>وزن (کیلو)</th></tr></thead><tbody>" + wrows + "</tbody></table>" : "") +
      (rows ? "<h3>چک‌این‌های اخیر (۱۴ ثبت آخر)</h3><table class=\"wide\"><thead><tr><th>روز</th><th>خون‌ریزی</th><th>درد</th><th>تب</th><th>حال</th><th>خواب</th><th>انرژی</th><th>پوشک خیس</th></tr></thead><tbody>" + rows + "</tbody></table>" : "<p>هنوز چک‌اینی ثبت نشده است.</p>") +
      (vd.flagDays ? '<p class="warn">روزهای دارای علامت هشدار (خون‌ریزی سنگین / تب / درد شدید): ' + fa(vd.flagDays) + " روز</p>" : "") +
      '<p class="disc">این برگه از یادداشت‌های خودِ مادر ساخته می‌شود و جای ارزیابی پزشکی را نمی‌گیرد. مبنا: ACOG، WHO Postnatal Care، CDC Hear Her و جدول رشد WHO.</p>';
  }
  /* گرهٔ چاپ بیرون از #ppHost می‌ماند تا @media print بتواند همهٔ چیز دیگر را پنهان کند */
  function ensurePrintNode() {
    if (!global.document || !global.document.body || !global.document.getElementById) return null;
    var n = global.document.getElementById("ppPrintWrap");
    if (!n) {
      n = global.document.createElement("div");
      n.id = "ppPrintWrap";
      n.className = "pp-printwrap";
      n.setAttribute("role", "dialog");
      n.setAttribute("aria-modal", "true");
      n.setAttribute("aria-label", "پیش‌نمایش خلاصهٔ ویزیت");
      n.innerHTML = '<div class="pp-print-back" data-pp="visit-close"></div><div class="pp-print-sheet"><div class="pp-print-actions">' +
        '<button type="button" class="pp-btn pp-btn-main" data-pp="visit-print">' + ic("share") + "چاپ / ذخیرهٔ PDF</button>" +
        '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-pp="visit-close">' + ic("x") + "بستن</button></div>" +
        '<div class="pp-print-body" id="ppPrintBody"></div></div>';
      global.document.body.appendChild(n);
      n.addEventListener("click", onClick);
    }
    return n;
  }
  function visitRowHtml() {
    if (deliveryJdn() === null) return "";
    return '<div class="pp-visit-row"><span>' + ic("note") +
      "<span><b>برای ویزیت پزشک آماده‌ای؟</b><br><i>چک‌این‌ها، وزن نوزاد و غربالگری خلق در یک برگهٔ چاپی</i></span></span>" +
      '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-pp="visit-open">' + ic("share") + "خلاصهٔ ویزیت</button></div>";
  }

  /* ---------- رندر: از همسرم کمک بخواه ---------- */
  function needLinesFor(c, needs, n) {
    var lines = ["نیازهای امروز من (روز " + fa(n) + " پس از زایمان):"];
    if (c.sleep === "none" || c.sleep === "bad") lines.push("• امروز خواب کافی نداشتم؛ یک نوبت بیداری شب را تو بمان.");
    if (c.energy === "empty" || c.energy === "low") lines.push("• انرژی‌ام کم است؛ یک کار خانه را کامل انجام بده.");
    if (c.pain === "moderate" || c.pain === "severe") lines.push("• درد دارم؛ کمک برای بلندکردن و جابه‌جایی نوزاد لازم دارم.");
    if (c.mood === "low" || c.mood === "rough") lines.push("• حالم خوب نیست؛ فقط کنارم بودن و گوش دادن کمک می‌کند، نه راه‌حل دادن.");
    if (c.feed === "pain" || c.feed === "latch") lines.push("• شیردهی سخت است؛ در آن ساعت‌ها کمک لازم دارم.");
    (needs || []).forEach(function (t) { lines.push("• " + t); });
    if (lines.length === 1) lines.push("• امروز فقط می‌خواهم کمی استراحت کنم و نیم‌ساعت زمان بدون مسئولیت داشته باشم.");
    lines.push("");
    lines.push("این متن را با یک پیام برای همسر یا نزدیکانت بفرست — کمک خواستن، کار تو را سبک‌تر می‌کند.");
    return lines;
  }
  function needText() {
    var n = todayDay();
    var c = checkinAt(n) || {};
    return needLinesFor(c, S.db.needs || [], n).join("\n");
  }
  function partnerHtml() {
    if (deliveryJdn() === null) return "";
    var cur = S.db.needs || [];
    return '<section class="pp-sec"><div class="pp-sec-head">' +
      '<span class="pp-ic">' + ic("users") + "</span><div><h2>از همسرم کمک بخواه</h2>" +
      '<div class="pp-sec-sub">انتخاب کن و متن آماده را کپی کن؛ چیزی خودکار ارسال نمی‌شود</div></div></div>' +
      '<div class="pp-card">' +
        '<div class="pp-care-flex">' +
          '<figure class="pp-photo pp-photo-embed">' +
            '<img src="img/pp/love-and-kid.jpg" alt="نوزاد با پستونک، دست مادر را گرفته — تصویر گرم" loading="lazy">' +
            "<figcaption>دست در دست عشق</figcaption></figure>" +
          '<div class="pp-care-main">' +
            '<div class="pp-chips">' + D.PARTNER_TASKS.map(function (t, i) {
              var short = (D.PARTNER_SHORT && D.PARTNER_SHORT[i]) || t;
              return '<button type="button" class="pp-chip" data-pp="need" data-i="' + i + '" aria-pressed="' + (cur.indexOf(t) > -1) + '" title="' + esc(t) + '">' + esc(short) + "</button>";
            }).join("") + "</div>" +
            '<div class="pp-need"><p id="ppNeedText">' + esc(needText()) + "</p></div>" +
            '<div class="pp-share">' +
              '<button type="button" class="pp-btn pp-btn-main pp-btn-sm" data-pp="share-send">' + ic("share") + "فرستادن با پیام‌رسان</button>" +
              '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-pp="share">' + ic("check") + "کپی متن</button>" +
              '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-pp="guide" data-v="g-intimacy">' + ic("book") + "راهنمای صمیمیت</button>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div></section>";
  }

  /* ---------- رندر: راهنماها (۳ مرتبط + فهرست کامل جست‌وجوپذیر) ---------- */
  function relatedTop(ph) {
    if (!ph) return [];
    return D.GUIDES.filter(function (g) { return g.phases.indexOf(ph.id) > -1; }).slice(0, 3);
  }
  function guideCardHtml(g, rel) {
    var art = g.img
      ? '<img src="' + g.img + '" alt="" loading="lazy">'
      : '<span class="pp-guide-noimg">' + ic("heart") + "</span>";
    return '<button type="button" class="pp-guide' + (rel ? " pp-related" : "") + '" data-pp="guide" data-v="' + g.id + '">' +
      art +
      '<span class="pp-guide-tag">' + esc(g.tag) + "</span>" +
      (rel ? '<span class="pp-guide-now">مرتبط با امروز</span>' : "") +
      '<span class="pp-guide-b"><h3>' + esc(g.title) + "</h3><p>" + esc(g.lead.slice(0, 74)) + (g.lead.length > 74 ? "…" : "") + "</p></span>" +
      "</button>";
  }
  function guideRowHtml(g) {
    var hay = (g.title + " " + g.tag + " " + g.lead).toLowerCase();
    var show = !S.gQuery || hay.indexOf(S.gQuery) > -1;
    return '<button type="button" class="pp-grow' + (show ? "" : " hid") + '" data-search="' + esc(hay) + '" data-pp="guide" data-v="' + g.id + '"' + (show ? "" : ' hidden="hidden"') + ">" +
      '<span class="pp-grow-ic">' + ic("book") + "</span>" +
      "<span class='pp-grow-b'><b>" + esc(g.title) + "</b><i>" + esc(g.lead.slice(0, 64)) + (g.lead.length > 64 ? "…" : "") + "</i></span>" +
      '<span class="pp-grow-tag">' + esc(g.tag) + "</span>" +
      "</button>";
  }
  function guidesHtml() {
    var n = todayDay();
    var ph = phaseOfDay(n);
    var top = relatedTop(ph);
    var relIds = top.map(function (g) { return g.id; });
    return '<section class="pp-sec"><div class="pp-sec-head">' +
      '<span class="pp-ic">' + ic("book") + "</span><div><h2>راهنمای موضوعی</h2>" +
      '<div class="pp-sec-sub">' + fa(D.GUIDES.length) + " راهنما · «مرتبط با امروز» حداکثر ۳ مورد؛ بقیه در فهرست کامل</div></div></div>" +
      '<div class="pp-guides pp-guides-top">' + top.map(function (g) { return guideCardHtml(g, true); }).join("") + "</div>" +
      '<div class="pp-gall" id="ppGAll"' + (S.gAll ? "" : ' hidden="hidden"') + ">" +
        '<div class="pp-search">' + ic("search") +
          '<input type="search" data-pp-in="gsearch" value="' + esc(S.gQuery) + '" placeholder="جست‌وجو در راهنماها… مثلاً خواب یا شیردهی" aria-label="جست‌وجو در راهنماها">' +
        "</div>" +
        '<div class="pp-growls" id="ppGRows">' + D.GUIDES.map(guideRowHtml).join("") + "</div>" +
      "</div>" +
      '<button type="button" class="pp-cal-toggle" data-pp="g-all" aria-expanded="' + S.gAll + '">' +
        (S.gAll ? ic("x") + "بستن همهٔ راهنماها" : ic("book") + "همه راهنماها (" + fa(D.GUIDES.length) + ")") + "</button>" +
      "</section>";
  }
  function guideSheetHtml() {
    if (!S.guide) return '<div class="pp-sheet" id="ppSheet"><div class="pp-sheet-in"></div></div>';
    var g = D.GUIDES.filter(function (x) { return x.id === S.guide; })[0];
    if (!g) return '<div class="pp-sheet" id="ppSheet"><div class="pp-sheet-in"></div></div>';
    function block(cls, title, icon, list) {
      if (!list || !list.length) return "";
      return '<div class="pp-g-block ' + cls + '"><h4>' + ic(icon) + title + "</h4><ul>" +
        list.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    }
    /* عکس خنثی: راهنماهای بدون عکس کاشی آیکونی می‌گیرند (صمیمیت و …) */
    var art = g.img
      ? '<img class="pp-sheet-img" src="' + g.img + '" alt="">'
      : '<div class="pp-sheet-icart">' + ic("heart") + "<span>" + esc(g.tag) + "</span></div>";
    return '<div class="pp-sheet" id="ppSheet"><div class="pp-sheet-in">' +
      '<div class="pp-sheet-top">' + ic("book") + "<h3>" + esc(g.title) + "</h3>" +
        '<button type="button" class="pp-x" data-pp="close-sheet" aria-label="بستن">' + ic("x") + "</button></div>" +
      '<div class="pp-sheet-body">' +
        art +
        '<p class="pp-g-lead">' + esc(g.lead) + "</p>" +
        block("g-normal", "چه چیزی معمول است", "info", g.normal) +
        block("g-help", "چه کمکی می‌کند", "check", g.help) +
        block("g-seek", "کِی کمک بگیر", "flag", g.seek) +
        (g.src ? '<p class="pp-g-src">منبع: <a href="' + g.src[1] + '" target="_blank" rel="noopener">' + esc(g.src[0]) + "</a></p>" : "") +
      "</div></div></div>";
  }

  /* ---------- شیت روز انتخاب‌شده ---------- */
  function daySheetHtml() {
    if (S.dayOpen === null) return '<div class="pp-sheet" id="ppDaySheet"><div class="pp-sheet-in"></div></div>';
    var n = S.dayOpen;
    var isToday = (n === todayDay());
    var ph = phaseOfDay(n);
    var cards = cardsForDay(n);
    var tasks = tasksForDay(n);
    var jdn = deliveryJdn() + n;
    var taskState = (S.db.tasks[jdnToKey(jdn)] || {});
    var cardsHtml = cards.map(cardHtml).join("");
    var tasksHtml = tasks.map(function (t, i) {
      var done = !!taskState["t" + i];
      return '<button type="button" class="pp-task' + (done ? " done" : "") + '" data-pp="task" data-i="' + i + '" data-jdn="' + jdn + '" aria-pressed="' + done + '">' +
        '<span class="pp-box">' + (done ? ic("check") : "") + "</span><span>" + esc(t) + "</span></button>";
    }).join("");
    return '<div class="pp-sheet" id="ppDaySheet"><div class="pp-sheet-in">' +
      '<div class="pp-sheet-top">' + ic("spark") + "<h3>" + (isToday ? "امروز · روز " + fa(n) : "روز " + fa(n) + " · " + fmtJ(jdn)) + "</h3>" +
        '<button type="button" class="pp-x" data-pp="close-day" aria-label="بستن">' + ic("x") + "</button></div>" +
      '<div class="pp-sheet-body">' +
        (ph ? '<p class="pp-g-lead"><b>' + esc(ph.name) + ":</b> " + esc(ph.body) + "</p>" : "") +
        '<div class="pp-cards">' + cardsHtml + "</div>" +
        (tasksHtml ? '<div class="pp-card" style="margin-top:13px"><div class="pp-sec-head" style="margin-bottom:10px">' +
          '<span class="pp-ic">' + ic("check") + '</span><div><h2 style="font-size:19px">کارهای این روز</h2>' +
          '<div class="pp-sec-sub">با زدن روی هر مورد، علامت انجام‌شد می‌خورد</div></div></div>' +
          '<div class="pp-tasks">' + tasksHtml + "</div></div>" : "") +
      "</div></div></div>";
  }

  /* ---------- علائم خطر: دکمهٔ ثابت + شیت ---------- */
  function flagsBtnHtml() {
    return '<button type="button" class="pp-danger-fab" data-pp="flags" aria-expanded="' + S.flagsOpen + '" aria-haspopup="dialog">' +
      ic("flag") + "<span>علائم خطر</span></button>";
  }
  function flagsSheetHtml() {
    var open = S.flagsOpen ? " open" : "";
    return '<div class="pp-sheet pp-flagsheet' + open + '" id="ppFlagSheet"><div class="pp-sheet-in">' +
      '<div class="pp-sheet-top pp-sheet-top-danger">' + ic("flag") + "<h3>علائم هشدار فوری پس از زایمان</h3>" +
        '<button type="button" class="pp-x" data-pp="close-flags" aria-label="بستن">' + ic("x") + "</button></div>" +
      '<div class="pp-sheet-body">' +
        '<p class="pp-flags-sub">اگر هر یک از این‌ها را داری، منتظر ویزیت نمان — همین حالا با پزشک، ماما یا اورژانس تماس بگیر.</p>' +
        D.RED_FLAGS.map(function (f) {
          return '<div class="pp-flag"><span class="pp-fi">' + ic("flag") + "</span><div><b>" + esc(f.t) + "</b><br><span>" + esc(f.d) + "</span></div></div>";
        }).join("") +
        '<div class="pp-disc">' + ic("info") +
        "<span>این فهرست بر پایهٔ کمپین «Hear Her» مرکز کنترل بیماری‌ها (CDC) است و جای ارزیابی پزشکی را نمی‌گیرد.</span></div>" +
      "</div></div></div>";
  }

  /* ---------- منابع ---------- */
  function sourcesHtml() {
    return '<section class="pp-sec"><details class="pp-src"><summary>' + ic("book") + "منابع علمی این بخش" + ic("chev") + "</summary><ol>" +
      D.SOURCES.map(function (s) { return '<li><a href="' + s[1] + '" target="_blank" rel="noopener">' + esc(s[0]) + "</a></li>"; }).join("") +
      "</ol></details>" +
      '<div class="pp-disc" style="margin-top:14px">' + ic("info") +
      "<span>همراه مادر برای آموزش و خودمراقبتی است و جای تشخیص یا درمان پزشکی را نمی‌گیرد. در هر نگرانی، مرجع تو پزشک یا مامای توست.</span></div></section>";
  }

  /* ---------- [۲٫۴] پل کوتاه «مراقبت من» در تب «امروز» ----------
     محتوای حمایتی «من هم مهمم» به تب «مراقبت من» منتقل شده (pp-support.js
     اکنون به پنِ care سوار می‌شود)؛ این‌جا فقط یک مسیر دسترسی ظریف می‌ماند —
     نه کارت بزرگ و نه محتوای تکراری. */
  function careBridgeHtml() {
    if (deliveryJdn() === null) return "";
    return '<button type="button" class="pp-carebridge" data-pp="tab" data-v="care" aria-label="رفتن به بخش مراقبت من">' +
      '<span class="pp-carebridge-ic">' + ic("heart") + "</span>" +
      '<span class="pp-carebridge-t"><b>امروز به کمی همراهی نیاز داری؟</b>' +
      '<i>جایی برای احساسات و نیازهای خودت، در بخش «مراقبت من»</i></span>' +
      '<span class="pp-carebridge-go">مراقبت از خودم' + ic("chev") + "</span>" +
      "</button>";
  }

  /* ---------- رندر کلی — چیدمان «امروز اول» ---------- */
  function shell(opts) {
    return '<div class="pp">' +
      '<div class="pp-wrap">' +
        (opts.demo ? '<div class="pp-demobar" role="note"><b>پیش‌نمایش با دادهٔ نمایشی.</b>' +
          "<span>این داده‌ها ساختگی‌اند و در کلید جداگانه‌ای ذخیره می‌شوند؛ ارتباطی با دادهٔ اصلی سَمن ندارند.</span>" +
          '<span class="pp-spacer"></span><label for="ppDemo">سناریو:</label>' +
          '<select id="ppDemo">' +
            '<option value="empty">بدون تاریخ تولد (شروع)</option>' +
            '<option value="d3">روز ۳</option>' +
            '<option value="d14">روز ۱۴</option>' +
            '<option value="d40">روز ۴۰</option>' +
            '<option value="d120">روز ۱۲۰</option>' +
          "</select>" +
          '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-pp="reset">پاک کردن دادهٔ نمایشی</button></div>' : "") +
        '<div id="ppHeader"></div>' +
        '<div id="ppEntrance"></div>' +
        '<div class="pp-tabbar" id="ppTabbar" role="tablist" aria-label="بخش‌های همراه مادر"></div>' +
        '<div class="pp-tabpanes" id="ppPanes">' +
          '<div class="pp-pane" data-pp-pane="today"><div id="ppToday"></div><div id="ppCi"></div><div id="ppCareBridge"></div></div>' +
          '<div class="pp-pane" data-pp-pane="charts"><div id="ppWeek"></div><div id="ppTrend"></div></div>' +
          '<div class="pp-pane" data-pp-pane="care"><div id="ppPartner"></div></div>' +
          '<div class="pp-pane" data-pp-pane="guides"><div id="ppGuides"></div><div id="ppSources"></div></div>' +
        "</div>" +
        '<p class="pp-foot">همراه مادر — داده‌ها فقط روی همین دستگاه می‌مانند.</p>' +
        '<div id="ppDangerBtn"></div>' +
        '<input type="file" id="ppRestoreFile" accept="application/json,.json" hidden>' +
      "</div>" +
      '<div class="pp-sheet" id="ppSheet"><div class="pp-sheet-in"></div></div>' +
      '<div class="pp-sheet" id="ppDaySheet"><div class="pp-sheet-in"></div></div>' +
      '<div class="pp-sheet pp-flagsheet" id="ppFlagSheet"><div class="pp-sheet-in"></div></div>' +
      '<div class="pp-toast" role="status" aria-live="polite">' + ic("check") + "<span></span></div>" +
      "</div>";
  }
  function el(s, r) { return (r || S.opts.mount).querySelector(s); }
  function render() {
    var m = S.opts.mount;
    el("#ppHeader", m).innerHTML = headerHtml();
    el("#ppEntrance", m).innerHTML = entranceHtml();
    var tb = el("#ppTabbar", m);
    if (tb) { tb.innerHTML = tabbarHtml(); tb.hidden = deliveryJdn() === null; }
    var panes = el("#ppPanes", m);
    if (panes) panes.setAttribute("data-active", S.tab || "today");
    el("#ppToday", m).innerHTML = todayHtml();
    el("#ppCi", m).innerHTML = ciHtml();
    el("#ppCareBridge", m).innerHTML = careBridgeHtml();
    el("#ppWeek", m).innerHTML = weekHtml();
    el("#ppTrend", m).innerHTML = trendHtml();
    el("#ppPartner", m).innerHTML = partnerHtml();
    el("#ppGuides", m).innerHTML = guidesHtml();
    el("#ppSources", m).innerHTML = sourcesHtml();
    el("#ppDangerBtn", m).innerHTML = flagsBtnHtml();
    el("#ppSheet", m).outerHTML = guideSheetHtml();
    el("#ppDaySheet", m).outerHTML = daySheetHtml();
    el("#ppFlagSheet", m).outerHTML = flagsSheetHtml();
    var o = el("#ppOuts", m);
    if (o) o.innerHTML = outsHtml();
  }
  function renderCiOnly() {
    var q = el("#ppCiQuick");
    if (q) q.innerHTML = ciQuickHtml();
    var det = el("#ppCiDetails");
    if (det) det.innerHTML = ciDetailsHtml();
    var o = el("#ppOuts");
    if (o) o.innerHTML = outsHtml();
    var sb = el('[data-pp="save-ci"]');
    if (sb) { /* وضعیت ذخیره بعد از ذخیرهٔ کامل رندر می‌شود */ }
  }
  function renderGuidesOnly() {
    var rows = el("#ppGRows");
    if (!rows) return;
    var needle = S.gQuery.trim().toLowerCase();
    rows.querySelectorAll(".pp-grow").forEach(function (r) {
      var show = !needle || (r.getAttribute("data-search") || "").indexOf(needle) > -1;
      r.hidden = !show;
    });
  }
  function toast(msg) {
    var t = el(".pp-toast");
    if (!t) return;
    t.querySelector("span").textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }

  /* ---------- رویدادها ---------- */
  function bind() {
    var m = S.opts.mount;
    m.addEventListener("click", onClick);
    m.addEventListener("change", onChange);
    m.addEventListener("input", onInput);
    /* Escape — بستن شیت باز (راهنما / روز / علائم خطر) */
    document.addEventListener("keydown", onKey);
  }
  function onKey(e) {
    if (e.key !== "Escape" || !S.mounted) return;
    var any = false;
    if (S.flagsOpen) { S.flagsOpen = false; any = true; }
    else if (S.dayOpen !== null) { S.dayOpen = null; any = true; }
    else if (S.guide) { S.guide = null; any = true; }
    else if (global.document && global.document.getElementById) {
      var pw = global.document.getElementById("ppPrintWrap");
      if (pw && pw.classList.contains("open")) { pw.classList.remove("open"); any = true; }
    }
    if (any) { render(); e.preventDefault(); }
  }
  function closeSheet(idAttr, then) {
    var s = el(idAttr);
    if (s) s.classList.remove("open");
    setTimeout(function () { then(); }, 250);
  }
  function onClick(e) {
    var t = e.target.closest("[data-pp]");
    if (!t) return;
    var a = t.getAttribute("data-pp");

    if (a === "set-birth" || a === "edit-birth") {
      if (a === "edit-birth") { S.db.profile = null; save(); S.setupOpen = true; render(); return; }
      var y = el('[data-pp-sel="by"]').value, mo = el('[data-pp-sel="bm"]').value, d = el('[data-pp-sel="bd"]').value;
      var jy = +y, jm = +mo, jd = +d;
      /* گارد اعتبارسنجی: اگر سلکت‌ها به هر دلیلی خالی/نامعتبر بودند (مثلاً rebuild یا autofill مرورگر)،
         تاریخ بی‌معنا ذخیره نشود — بازهٔ معتبر سال جلالی ۱۳۰۰ تا ۱۵۰۰ است. */
      if (!Number.isFinite(jy) || !Number.isFinite(jm) || !Number.isFinite(jd) || jy < 1300 || jy > 1500 || jm < 1 || jm > 12 || jd < 1 || jd > 31) {
        toast("لطفاً سال، ماه و روز تولد نوزاد را کامل انتخاب کنید");
        return;
      }
      var ml = S.JAL.monthLen(jy, jm);
      if (jd > ml) jd = ml;
      var jdn = S.JAL.j2d(jy, jm, jd);
      if (jdn > todayJdn()) { toast("تاریخ تولد نمی‌تواند در آینده باشد"); return; }
      S.db.profile = { deliveryKey: jdnToKey(jdn), type: "vaginal", feeding: "breast" };
      save();
      S.setupOpen = false;
      S.range = rangeForDay(todayDay());
      S.selCell = null;
      render(); toast("تاریخ تولد ثبت شد");
      return;
    }
    if (a === "night") {
      S.db.night = !S.db.night;
      save();
      S.opts.mount.classList.toggle("pp-night", S.db.night);
      var nb = el('[data-pp="night"]');
      if (nb) { nb.classList.toggle("on", S.db.night); nb.setAttribute("aria-pressed", String(S.db.night)); }
      toast(S.db.night ? "حالت شب روشن شد — نور کم برای شیردهی شبانه" : "حالت شب خاموش شد");
      return;
    }
    if (a === "setup") { S.setupOpen = !S.setupOpen; render(); return; }
    if (a === "tab") { S.tab = t.getAttribute("data-v") || "today"; render(); return; }
    if (a === "backup") {
      try {
        var payload = JSON.stringify({ saman: "mother-companion", v: 1, exportedAt: new Date().toISOString(), db: S.db }, null, 2);
        var blob = new Blob([payload], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        var tj = S.JAL.today();
        link.href = url;
        link.download = "saman-mother-backup-" + tj.jy + "-" + String(tj.jm).padStart(2, "0") + "-" + String(tj.jd).padStart(2, "0") + ".json";
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        toast("پشتیبان ساخته شد — فایل را جای امن نگه دار");
      } catch (err) { toast("ساخت پشتیبان ممکن نشد"); }
      return;
    }
    if (a === "restore") { var rf = el("#ppRestoreFile"); if (rf) rf.click(); return; }
    if (a === "range") { S.range = t.getAttribute("data-v"); render(); return; }
    if (a === "cal-full") { S.calFull = !S.calFull; render(); return; }
    if (a === "g-all") { S.gAll = !S.gAll; render(); return; }
    if (a === "pick") {
      var dn = +t.getAttribute("data-day");
      S.selCell = dn;
      S.dayOpen = dn;
      computeOuts();
      render();
      var sh = el("#ppDaySheet");
      if (sh) { void sh.offsetWidth; sh.classList.add("open"); }
      return;
    }
    if (a === "day") {
      S.dayOpen = +t.getAttribute("data-day");
      render();
      var sh2 = el("#ppDaySheet");
      if (sh2) { void sh2.offsetWidth; sh2.classList.add("open"); }
      return;
    }
    if (a === "close-day") {
      closeSheet("#ppDaySheet", function () { S.dayOpen = null; S.selCell = null; render(); });
      return;
    }
    if (a === "task") {
      var jdn2 = +t.getAttribute("data-jdn");
      var i = t.getAttribute("data-i");
      var key = jdnToKey(jdn2);
      S.db.tasks[key] = S.db.tasks[key] || {};
      if (S.db.tasks[key]["t" + i]) delete S.db.tasks[key]["t" + i]; else S.db.tasks[key]["t" + i] = true;
      save(); render(); return;
    }
    if (a === "ci") {
      S.ci = S.ci || {};
      var k = t.getAttribute("data-k"), v = t.getAttribute("data-v");
      S.ci[k] = (S.ci[k] === v) ? undefined : v;
      computeOuts();
      renderCiOnly();
      return;
    }
    if (a === "ci-details") { S.ciOpen = !S.ciOpen; render(); return; }
    if (a === "diaper") {
      var dd = +t.getAttribute("data-d");
      var nD = todayDay();
      var savedD = nD !== null ? checkinAt(nD) : null;
      var curD = (S.ci && S.ci.diaper != null) ? S.ci.diaper : ((savedD && savedD.diaper != null) ? savedD.diaper : 0);
      S.ci = S.ci || {};
      S.ci.diaper = Math.max(0, Math.min(24, curD + dd));
      computeOuts();
      renderCiOnly();
      return;
    }
    if (a === "save-ci") {
      var n = todayDay();
      if (n === null) { toast("اول تاریخ تولد نوزاد را ثبت کن"); return; }
      var key2 = jdnToKey(deliveryJdn() + n);
      var prev = S.db.checkins[key2] || {};
      var merged = Object.assign({}, prev, S.ci, { dateKey: key2, day: n, savedAt: new Date().toISOString() });
      Object.keys(merged).forEach(function (kk) { if (merged[kk] === undefined || merged[kk] === "") delete merged[kk]; });
      S.db.checkins[key2] = merged;
      save(); computeOuts(); render(); toast("ثبت امروز ذخیره شد");
      return;
    }
    if (a === "guide") {
      S.guide = t.getAttribute("data-v");
      render();
      var sh3 = el("#ppSheet");
      if (sh3) { void sh3.offsetWidth; sh3.classList.add("open"); }
      return;
    }
    if (a === "close-sheet") {
      closeSheet("#ppSheet", function () { S.guide = null; render(); });
      return;
    }
    if (a === "flags") {
      S.flagsOpen = true; render();
      var fs = el("#ppFlagSheet");
      if (fs) { void fs.offsetWidth; fs.classList.add("open"); }
      return;
    }
    if (a === "close-flags") {
      closeSheet("#ppFlagSheet", function () { S.flagsOpen = false; render(); });
      return;
    }
    if (a === "need") {
      var idx = +t.getAttribute("data-i");
      var item = D.PARTNER_TASKS[idx];
      var at = (S.db.needs || []).indexOf(item);
      S.db.needs = S.db.needs || [];
      if (at > -1) S.db.needs.splice(at, 1); else S.db.needs.push(item);
      save(); render(); return;
    }
    if (a === "screen") {
      var q = "q" + t.getAttribute("data-q"), vv = +t.getAttribute("data-v");
      S.db.screen = S.db.screen || {};
      S.db.screen[q] = (S.db.screen[q] === vv) ? undefined : vv;
      /* غربالگری تکرارشونده: با کامل‌شدن هر دو پرسش، نمره با تاریخ در تاریخچه می‌ماند */
      var sc = S.db.screen;
      if (sc.q1 != null && sc.q2 != null) {
        var at = jdnToKey(todayJdn()), s2 = (sc.q1 || 0) + (sc.q2 || 0);
        sc.at = at;
        sc.log = (sc.log || []).filter(function (e) { return e.at !== at; });
        sc.log.push({ at: at, s: s2 });
        if (sc.log.length > 6) sc.log = sc.log.slice(-6);
      }
      save(); render(); return;
    }
    if (a === "share") {
      var txt = needText();
      var done = function () { toast("متن کپی شد — می‌توانی برای همسرت بفرستی"); };
      if (global.navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt, done); });
      } else fallbackCopy(txt, done);
      return;
    }
    if (a === "share-send") {
      var txt2 = needText();
      if (global.navigator && typeof global.navigator.share === "function") {
        global.navigator.share({ title: "همراه مادر — نیازهای امروز من", text: txt2 }).then(function () {
          toast("پنجرهٔ ارسال باز شد");
        }, function () { /* کاربر لغو کرد */ });
      } else {
        fallbackCopy(txt2, function () { toast("اشتراک‌گذاری در این مرورگر نیست — متن کپی شد"); });
      }
      return;
    }
    if (a === "visit-open") {
      var pn = ensurePrintNode();
      if (pn) {
        var pb = pn.querySelector("#ppPrintBody");
        if (pb) pb.innerHTML = visitSummaryHtml();
        pn.classList.add("open");
        var xb = pn.querySelector('[data-pp="visit-close"]');
        if (xb && xb.focus) xb.focus();
      }
      return;
    }
    if (a === "visit-close") {
      var pc = (global.document && global.document.getElementById) ? global.document.getElementById("ppPrintWrap") : null;
      if (pc) pc.classList.remove("open");
      return;
    }
    if (a === "visit-print") {
      if (global.document && global.document.body) {
        global.document.body.classList.add("pp-printing");
        var doneP = function () { global.document.body.classList.remove("pp-printing"); };
        if (global.addEventListener) global.addEventListener("afterprint", doneP, { once: true });
        setTimeout(doneP, 2000); /* پشتیبان برای مرورگرهای بدون afterprint */
        global.print();
      }
      return;
    }
    if (a === "chart-tab") { S.chartTab = t.getAttribute("data-v"); render(); return; }
    if (a === "baby-sex") {
      S.draftSex = t.getAttribute("data-v");
      var sib = t.parentNode.querySelectorAll("button");
      for (var si = 0; si < sib.length; si++) sib[si].setAttribute("aria-pressed", String(sib[si] === t));
      return;
    }
    if (a === "baby-save") {
      var bw = parseNum((el('[data-pp-in="bw0"]') || {}).value);
      if (!(bw >= 1 && bw <= 6.5)) { toast("وزن تولد را به کیلوگرم بنویس (مثلاً ۳٫۳)"); return; }
      S.db.baby = { sex: S.draftSex || "boy", birthG: Math.round(bw * 1000) };
      S.chartTab = "baby"; save(); render(); toast("ثبت شد");
      return;
    }
    if (a === "baby-edit") {
      var ob = S.db.baby; S.draftSex = ob ? ob.sex : "boy";
      S.db.baby = null; save(); render(); return;
    }
    if (a === "weight-add") {
      var wk2 = parseNum((el('[data-pp-in="w"]') || {}).value);
      if (!(wk2 >= 1.5 && wk2 <= 20)) { toast("وزن را به کیلوگرم بنویس (مثلاً ۴٫۲)"); return; }
      S.db.weights = S.db.weights || {};
      S.db.weights[jdnToKey(todayJdn())] = Math.round(wk2 * 1000);
      S.chartTab = "baby"; save(); render(); toast("وزن امروز ثبت شد");
      return;
    }
    if (a === "weight-del") {
      delete (S.db.weights || {})[t.getAttribute("data-k")];
      save(); render(); toast("حذف شد");
      return;
    }
    if (a === "reset") {
      S.adapter.clear(); S.db = emptyDb(); S.ci = {}; S.dayOpen = null; S.selCell = null; S.range = "d40";
      S.opts.mount.classList.remove("pp-night");
      if (S.opts.demo) seed(S.opts.demoScenario || "d14");
      render(); toast("پاک شد"); return;
    }
  }
  function onChange(e) {
    var t = e.target;
    if (t && t.id === "ppRestoreFile") {
      var file = t.files && t.files[0];
      t.value = "";
      if (!file) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var parsed = JSON.parse(String(rd.result));
          var db = parsed && parsed.db ? parsed.db : parsed;
          if (!db || typeof db !== "object" || !db.checkins) { toast("این فایل پشتیبان معتبر نیست"); return; }
          S.db = db;
          S.tab = "today";
          save();
          S.opts.mount.classList.toggle("pp-night", !!S.db.night);
          computeOuts();
          render();
          toast("پشتیبان با موفقیت بازیابی شد");
        } catch (err) { toast("فایل پشتیبان خوانده نشد"); }
      };
      rd.readAsText(file);
      return;
    }
    var sel = t.getAttribute && t.getAttribute("data-pp-sel");
    if (sel === "type" || sel === "feeding") {
      S.db.profile = S.db.profile || {};
      S.db.profile[sel] = t.value;
      save();
      if (sel === "feeding") render();
      return;
    }
  }
  function onInput(e) {
    var t = e.target;
    var kind = t.getAttribute && t.getAttribute("data-pp-in");
    if (kind === "note") {
      S.ci = S.ci || {};
      S.ci.note = t.value;
    } else if (kind === "gsearch") {
      S.gQuery = t.value;
      renderGuidesOnly();
    }
  }
  function fallbackCopy(txt, done) {
    try {
      var ta = document.createElement("textarea");
      ta.value = txt; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); done();
    } catch (e) { toast("کپی نشد — متن را دستی انتخاب کن"); }
  }

  /* ---------- دادهٔ نمایشی ---------- */
  function seed(scenario) {
    var T = todayJdn();
    function dayKey(d) {
      /* روز d پس از زایمان، نسبت به امروز */
      var n = todayDay();
      return jdnToKey(T - (n - d));
    }
    var db = emptyDb();
    if (scenario === "empty") { S.db = db; S.adapter.save(db); S.setupOpen = true; S.range = "d40"; return; }
    var wantDay = { d3: 3, d14: 14, d40: 40, d120: 120 }[scenario] || 14;
    /* تاریخ تولد را طوری می‌گذاریم که «امروز» همان روز خواسته‌شده شود */
    var dj = T - wantDay;
    db.profile = { deliveryKey: jdnToKey(dj), type: scenario === "d3" || scenario === "d14" ? "vaginal" : "csection", feeding: "breast" };
    /* چند چک‌این نمونه در روزهای گذشته */
    var hist = {
      1: { bleed: "heavy", pain: "moderate", mood: "okay", sleep: "bad", feed: "pain", nipple: "sore", energy: "low" },
      3: { bleed: "period", pain: "moderate", mood: "low", sleep: "bad", feed: "pain", nipple: "sore", energy: "empty", note: "شب سختی بود." },
      7: { bleed: "light", pain: "mild", mood: "okay", sleep: "ok", feed: "easy", nipple: "ok", energy: "ok" },
      12: { bleed: "light", pain: "mild", mood: "low", sleep: "bad", feed: "latch", nipple: "sore", energy: "low" },
      18: { bleed: "none", pain: "none", mood: "good", sleep: "good", feed: "easy", nipple: "ok", energy: "good" },
      25: { bleed: "none", pain: "mild", mood: "okay", sleep: "ok", feed: "easy", nipple: "ok", energy: "ok" },
      33: { bleed: "none", pain: "none", mood: "low", sleep: "bad", feed: "easy", nipple: "ok", energy: "low", note: "کم‌حوصله بودم." },
      40: { bleed: "none", pain: "none", mood: "okay", sleep: "ok", feed: "easy", nipple: "ok", energy: "ok" },
      60: { bleed: "none", pain: "none", mood: "good", sleep: "ok", feed: "easy", nipple: "ok", energy: "good" },
      90: { bleed: "none", pain: "mild", mood: "okay", sleep: "bad", feed: "easy", nipple: "ok", energy: "ok" },
      110: { bleed: "none", pain: "none", mood: "good", sleep: "good", feed: "easy", nipple: "ok", energy: "good" }
    };
    Object.keys(hist).forEach(function (d) {
      var dd = +d;
      if (dd > wantDay) return;
      var kk = jdnToKey(dj + dd);
      db.checkins[kk] = Object.assign({ dateKey: kk, day: dd, savedAt: new Date().toISOString() }, hist[d]);
    });
    /* چک‌این امروز خالی بماند تا کاربر تجربهٔ انتخاب را ببیند، جز سناریوی روز ۳ */
    if (wantDay === 3) {
      var kt = jdnToKey(T);
      db.checkins[kt] = Object.assign({ dateKey: kt, day: 3, savedAt: new Date().toISOString() },
        { bleed: "period", pain: "moderate", mood: "low", sleep: "bad", feed: "pain", nipple: "sore", energy: "empty" });
    }
    /* نوزاد و وزن‌های نمونه */
    db.baby = { sex: "boy", birthG: 3300 };
    var wts = { 5: 3150, 10: 3320, 14: 3500, 28: 4200, 40: 4800, 60: 5600, 90: 6500, 110: 6950 };
    Object.keys(wts).forEach(function (d) {
      if (+d <= wantDay) db.weights[jdnToKey(dj + (+d))] = wts[d];
    });
    S.db = db;
    S.adapter.save(db);
    S.range = rangeForDay(wantDay);
    S.ci = {};
    /* چک‌این امروزِ ذخیره‌شده را در پیش‌نویس بریز تا توصیه‌ها فوراً دیده شوند */
    var savedToday = db.checkins[jdnToKey(T)];
    if (savedToday) {
      S.ci = {};
      Object.keys(savedToday).forEach(function (k) {
        if (["dateKey", "day", "savedAt"].indexOf(k) < 0) S.ci[k] = savedToday[k];
      });
    }
  }

  /* ---------- init ---------- */
  function init(opts) {
    opts = opts || {};
    if (!opts.mount) throw new Error("SamanPostpartum: opts.mount لازم است");
    S.opts = opts;
    S.JAL = opts.jal || JAL_FALLBACK;
    S.adapter = opts.adapter || localAdapter(opts.storeKey || STORE_KEY);
    S.opts.mount.classList.add("pp");
    S.opts.mount.innerHTML = shell(opts);
    bind();
    load();
    S.range = rangeForDay(todayDay());
    if (opts.demo) {
      var has = S.db.profile || Object.keys(S.db.checkins || {}).length;
      if (!has) seed(opts.demoScenario || "d14");
    }
    if (opts.deliveryDate) {
      S.db.profile = S.db.profile || { type: "vaginal", feeding: "breast" };
      S.db.profile.deliveryKey = opts.deliveryDate;
      save();
    }
    var sel = el("#ppDemo");
    if (sel) {
      if (opts.demoScenario) sel.value = opts.demoScenario;
      sel.addEventListener("change", function () {
        seed(sel.value); S.opts.demoScenario = sel.value; render();
        toast("سناریو عوض شد");
      });
    }
    computeOuts();
    render();
    S.mounted = true;
    return api;
  }

  var api = {
    version: "2.4.0",
    init: init,
    refresh: function () { if (!S.mounted) return; load(); computeOuts(); render(); },
    setDelivery: function (key) {
      S.db.profile = S.db.profile || { type: "vaginal", feeding: "breast" };
      S.db.profile.deliveryKey = key; save();
      S.range = rangeForDay(todayDay()); render();
    },
    todayDayNumber: function () { return todayDay(); },
    openGuide: function (id) {
      S.guide = id; render();
      var sh = el("#ppSheet");
      if (sh) { void sh.offsetWidth; sh.classList.add("open"); }
    },
    data: function () { return S.db; },
    /* قلاب‌های خالص برای آزمون‌های خودکار (منطق بی‌DOM) */
    _t: {
      WHO: WHO, whoAt: whoAt, rulesFor: rulesFor, babyNoteFor: babyNoteFor,
      cardsForDay: cardsForDay, tasksForDay: tasksForDay, phaseOfDay: phaseOfDay,
      dayNumberOf: dayNumberOf, rangeForDay: rangeForDay, weekCells: weekCells,
      weekName: weekName, relatedTop: relatedTop, needLinesFor: needLinesFor,
      nippleNeeded: nippleNeeded, QUICK: QUICK, DETAILS: DETAILS,
      diaperRuleFor: diaperRuleFor, screenInfoFor: screenInfoFor,
      optLabel: optLabel, visitData: visitData,
      SC: SC, parseNum: parseNum, faKg: faKg, D: D, emptyDb: emptyDb
    },
    _state: S,
    _jal: JAL_FALLBACK,
    _content: D
  };
  global.SamanPostpartum = api;
})(window);
