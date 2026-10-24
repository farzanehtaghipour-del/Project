/* ============================================================================
   pp-support.js — منطق و رابط «من هم مهمم» (فضای «مراقبت من») | نسخهٔ ۲٫۵
   ----------------------------------------------------------------------------
   بخش حمایت عاطفی مادر در «همراه مادر». محتوا در pp-support-content.js
   (window.PP_SUPPORT) است؛ این فایل فقط منطق، شخصی‌سازی و رندر است.

   تازه‌های نسخهٔ ۲ (DeepSeek):
     • ورود سریع با حال («الان چه حالی داری؟») → مستقیم به موضوع مرتبط
     • شخصی‌سازی از دادهٔ واقعی خودِ مادر (روز پس از زایمان، چک‌این‌ها، PHQ-2)
     • «یادش می‌ماند»: مرور هفته از ثبت‌ها و یادداشت‌های خودش
     • سه سطح ایمنی در هر محتوا (خودمراقبتی / پیگیری / اقدام فوری)
     • بررسی کلیدواژه‌ایِ قطعی روی یادداشت (بدون ادعای تشخیص) با مسیر اورژانس
     • خواندن صوتی محتوا (برای وقتی دست بند است)
     • فهرست علائم هشدار داخل متن (bullets)، جدول مقایسه‌ای و اعداد معتبر
     • شیت «چرا این‌جا، نه هر جای دیگر؟» — تمایز شفاف با جست‌وجو/چت‌بات

   ۲٫۱ — ادغام لایهٔ «همراه مهربان» نسخهٔ ۱٫۱ (که در نسخهٔ ۲ جا افتاده بود):
     • جملهٔ زمان‌آگاه (صبح/بعدازظهر/عصر/شب) بالای بخش
     • جملهٔ به رسمیت‌شناختن احساس (line) پیش از محتوا، وقتی از مسیر
       «الان چه حالی داری؟» وارد موضوع می‌شویم — الگوی «اول شنیدن، بعد راهنمایی»
     • تمرین تنفس «یک دقیقه تا آرامش» (دم ۴ / بازدم ۶) با دکمهٔ اختصاصی
     • قلبِ «به دلم نشست» روی کارت روزانه
     • جملهٔ به رسمیت‌شناختن چرخشی بعد از ذخیرهٔ هر یادداشت
     • پل نرم به «دو پرسش حالت» وقتی در ۷ روز گذشته ۳ روزِ متمایز موضوع‌های
       بخش غم باز شده باشد — بدون قضاوت
     • جملهٔ پایانی ثابت هر محتوا: «هر وقت خواستی، من همین‌جام.»

   دو اصلاح پایداری (بازگشت از درس‌های ۱٫۰٫۱ و ۱٫۰٫۲ که در نسخهٔ ۲ تکرار شده بود):
     • شنونده‌های click/input دوباره روی ریشهٔ میزبان (#ppHost) جاسازی می‌شوند،
       نه روی گرهٔ بخش — وگرنه دکمه‌های داخل شیت (که بیرون از گرهٔ بخش ساخته
       می‌شود) به هیچ‌وجه پاسخ نمی‌دهند.
     • کارت دفترچه و حالت «فقط می‌خوام بنویسم» مستقیم به شیت دفترچه می‌روند،
       نه فهرست موضوع‌های خالی.

   ۲٫۲ — بستهٔ اصلاح حمایت عاطفی:
     • manualOnly: فیلد اختیاری جدید روی آیتم‌ها؛ آیتم با manualOnly فقط وقتی
       برمی‌گردد که topicId صریحاً برابر موضوع همان آیتم باشد — در هر سه مسیر
       supportItemsFor (فیلتر اصلی، فالبک موضوع، فالبک بخش) مستثناست؛ در
       فهرست موضوع‌ها (supportTopics) دیده می‌شود ولی آخرِ فهرست می‌آید.
     • بررسی ایمنی دفترچه دو سطحی شد (riskTier): سطح ۱ کارت ایمنیِ قبلی،
       سطح ۲ (ترسِ آسیب‌زدن، یعنی فکر ناخواسته نه قصد) کارت نرم جدید با
       دکمهٔ «بیشتر دربارهٔ فکرهای ناخواسته بخوانم» (بازکردن sad-intrusive).
     • شماره‌های حمایتی رایگان (CRISIS_LINES از فایل محتوا) در کارت ایمنی
       سطح ۱؛ لینک آرام «اگر کمک فوری لازم داری» پایین دفترچه؛ متن خصوصی‌نوتی
       دفترچه هماهنگ با بررسی عبارت‌ها («این بررسی کامل نیست»).
     • safetyCheck برای سازگاری قبلی سرِ جایش است و معادل riskTier ≥ ۱ عمل می‌کند.

   ۲٫۳ — فلش‌کارت‌های «کارت برگردان»:
     • فهرست موضوع‌های سه بخش «وقتی دلم می‌گیره»، «وقتی به خودم شک می‌کنم» و
       «بدنم هم به زمان نیاز داره» از دکمه‌های ساده به فلش‌کارت‌های دو‌رویه
       تبدیل شد (طرح «کارت برگردان» طراحی اولیهٔ سَمن):
       روی کارت = تصویر full-bleed + چیپ موضوع + عنوان؛ پشت کارت = «شاید…»
       (نقل‌قول با خط رنگی)، «یه جور دیگه نگاهش کن» (باکس رنگی)،
       «یک قدم کوچک» (کادر خط‌چین) + دکمهٔ «متن کامل این موضوع».
     • تعامل: لمس کارت = چرخش سه‌بعدی rotateY با ۰٫۷s؛ کلید Enter/Space هم
       کارت را برمی‌گرداند (aria-expanded)؛ کلیک داخل بدنهٔ قابل‌اسکرولِ پشت
       کارت یا روی دکمه‌ها کارت را برنمی‌گرداند.
     • تصویر هر موضوع از PP_SUPPORT_CARD_IMG (فایل محتوا) می‌آید — فعلاً
       placeholder از img/pp؛ بدون تصویر، کارت با پس‌زمینهٔ رنگی بخش رندر می‌شود.
     • رنگ هر بخش از پالت خود اپ: غم = آبی، شک = یاسی، بدن = نارنجی.
     • openTopic/contentHtml پارامتر اختیاری itemId گرفتند تا متن کاملِ دقیقاً
       همان کارتی که برگردانده شده باز شود (هم‌خوانی پشت کارت با متن کامل).

   ۲٫۴ — بازطراحی جریان: فهرست ساده + بازشدن فلش‌کارت با انتخاب موضوع:
     • فهرست موضوع‌های هر بخش دوباره ساده شد: فقط متنِ موضوع‌ها (topicLabel)،
       بدون هیچ عکسی — با آیکون فلش‌کارت و نشانگر ورود، و رنگ هاور از پالت خود بخش.
     • با لمس هر موضوع، فلش‌کارت همان موضوع در شیت باز می‌شود (حالت تازهٔ
       «card»): روی کارت تصویر + چیپ موضوع + عنوان؛ با لمس/Enter برمی‌گردد و
       پشتش «شاید…»، نگاه تازه، یک قدم کوچک و دکمهٔ «متن کامل این موضوع» است.
     • مسیر کامل: بخش ← فهرست موضوع‌ها ← فلش‌کارت ← متن کامل؛ دکمهٔ
       «فهرست موضوع‌ها» بالای کارت و در متن کامل، به فهرست برمی‌گردد.

   ۲٫۵ — انتقال به «مراقبت من» + صفحهٔ اصلی چهارورودی:
     • کل بخش «من هم مهمم» از تب «امروز» به تب «مراقبت من» منتقل شد؛
       tryMount اکنون به [data-pp-pane="care"] سوار می‌شود. تب «امروز» فقط
       ثبت روزانه و کارت امروز را دارد و به‌جای محتوای حمایتی، فقط یک پل
       کوتاه («مراقبت از خودم») به این بخش می‌گذارد (در pp-companion.js).
     • صفحهٔ اصلی «مراقبت من» با چهار ورودی اصلی بازطراحی شد — به ترتیب:
       «وقتی دلم می‌گیره...»، «وقتی به خودم شک می‌کنم...»، «بدنم هم به زمان
       نیاز داره» و «حرف دلم رو بنویسم»؛ هر کارت با شمارندهٔ موضوع‌ها
       (دفترچه: شمار پرامپت‌های شروع) و رنگ خودِ بخش.
     • بقیهٔ اجزا (ورود سریع «الان چه حالی داری؟»، همراهی روزانه، تمرین تنفس،
       «یادش می‌ماند» و «چرا این‌جا») در همین صفحه، پیش/پسِ کارت‌ها ماندند.
     • ترتیب شیت‌ها، فلش‌کارت‌ها، دفترچه و ایمنی همان نسخهٔ ۲٫۴ است — هیچ
       مسیر دسترسی تغییر نکرده؛ فقط میزبانِ بخش عوض شده است.

   وابستگی‌ها (به همین ترتیب بارگذاری شوند):
     pp-content.js · pp-companion.js · pp-adapter.js · pp-support-content.js · pp-support.js
   خروجی: window.SamanSupport = { refresh, mount, _t, _state }
   ============================================================================ */
(function (global) {
  "use strict";

  var SUP = global.PP_SUPPORT;
  if (!SUP) return;

  var COOLDOWN = (SUP.COOLDOWN_DAYS || 14) * 24 * 3600 * 1000;

  /* ---------- آیکون‌ها ---------- */
  var IC = {
    heart: '<path d="M12 20.3S4.4 15.6 4.4 10a4.1 4.1 0 0 1 7.6-2.2A4.1 4.1 0 0 1 19.6 10c0 5.6-7.6 10.3-7.6 10.3z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    note: '<path d="M6 4.4h9.4L19 8v11.6H6z"/><path d="M9 10.6h6M9 14h6"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    flag: '<path d="M6 21V4.5h11l-1.6 4 1.6 4H6"/>',
    book: '<path d="M5 4.4h9.4L19 8v11.6H5z"/><path d="M14.4 4.4V8H19M8.4 12h7.2M8.4 15.4h5"/>',
    chev: '<path d="m6.5 9.8 5.5 5.4 5.5-5.4"/>',
    back: '<path d="m14 6-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    lock: '<rect x="5.5" y="10.5" width="13" height="9" rx="2.6"/><path d="M8.4 10.5V8a3.6 3.6 0 0 1 7.2 0v2.5"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    pen: '<path d="M5 19.4l1-4L16.6 4.8a2 2 0 0 1 2.8 2.8L8.8 18.2z"/><path d="M13.8 7.4l3 3"/>',
    cloud: '<path d="M7.2 17.6a4.4 4.4 0 0 1-.7-8.75A5.4 5.4 0 0 1 17 6a3.9 3.9 0 0 1 1.1 7.6"/>',
    shield: '<path d="M12 3.4 5 6.2v5.7c0 4.4 2.9 7.4 7 8.7 4.1-1.3 7-4.3 7-8.7V6.2z"/>',
    body: '<circle cx="12" cy="4.7" r="2"/><path d="M12 7.3v7.2M7.6 10.6h8.8M12 14.5l-2.8 6M12 14.5l2.8 6"/>',
    trash: '<path d="M4.5 7h15M9.2 7V4.6h5.6V7M6.6 7l.8 12.8h9.2L17.4 7M10 11v5.4M14 11v5.4"/>',
    edit: '<path d="M5 19.4h4L18.9 9.5a2.1 2.1 0 0 0-3-3L6.1 16.3z"/><path d="M13.4 7.6l3 3"/>',
    arrow: '<path d="M4.6 12h14.8M14 7.2l5 4.8-5 4.8"/>',
    wave: '<path d="M2.5 12.5c1.8-4 2.8-4 4.6 0s2.8 4 4.6 0 2.8-4 4.6 0 2.8 4 4.6 0"/>',
    chart: '<path d="M4 19V5M4 19h16"/><path d="M8 15l4-5 3 3 4-6"/>',
    phone: '<path d="M7.4 4.6h3l1.4 3.4-2 1.4a9.4 9.4 0 0 0 5.2 5.2l1.4-2 3.4 1.4v3a2 2 0 0 1-2.2 2A15.4 15.4 0 0 1 5.4 6.8a2 2 0 0 1 2-2.2z"/>',
    play: '<path d="M8 5.2 19 12 8 18.8z"/>',
    pause: '<path d="M9 5v14M15.5 5v14"/>',
    users: '<circle cx="8.4" cy="8" r="3"/><path d="M3 19c.6-2.9 2.8-4.6 5.4-4.6S13.2 16.1 13.8 19"/><circle cx="16.8" cy="8.8" r="2.5"/><path d="M15.7 14.4c2.4.2 4.3 1.7 4.9 4.1"/>',
    wind: '<path d="M3.5 8.5h9.2a2.9 2.9 0 1 0-2.9-2.9M2.5 12.5h14.7a2.9 2.9 0 1 1-2.9 2.9M4 16.5h6.8a2.4 2.4 0 1 1-2.4 2.4"/>',
    flip: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/>'
  };
  function ic(n) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[n] || "") + "</svg>";
  }
  var FA = "۰۱۲۳۴۵۶۷۸۹";
  function fa(n) { return String(n).replace(/\d/g, function (d) { return FA[+d]; }); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- وضعیت ---------- */
  var M = { node: null, sheet: null, toast: null, open: null, draft: null, mounted: false, speaking: false, bound: false, calmT: null, ack: null, ackN: 0, toastT: null };

  /* ---------- [۲٫۱] جملهٔ زمان‌آگاه (صبح/بعدازظهر/عصر/شب) ---------- */
  function timeLine() {
    var h = (global.Date ? new global.Date().getHours() : 12) || 0;
    var lines = SUP.TIME_LINES || [];
    for (var i = 0; i < lines.length; i++) if (h >= lines[i].from && h < lines[i].to) return lines[i].text;
    return lines.length ? lines[0].text : "";
  }
  /* ---------- [۲٫۱] شمار روزهای متمایزی که در ۷ روز گذشته موضوع‌های بخش غم باز شده‌اند ---------- */
  function supportSadDays() {
    var sp = supportStore(); if (!sp) return 0;
    var now = Date.now(), days = {};
    Object.keys(sp.seen).forEach(function (id) {
      if (String(id).indexOf("sad-") !== 0) return;
      var ts = sp.seen[id];
      if (!ts || now - ts > 7 * 864e5) return;
      try { days[epochToJdn(new Date(ts))] = true; } catch (e) {}
    });
    return Object.keys(days).length;
  }

  /* ---------- دسترسی به میزبان ---------- */
  function host() { return global.SamanPostpartum || null; }
  function getS() { var h = host(); return h ? h._state : null; }
  function hostJAL() { var S = getS(); return S ? S.JAL : null; }
  function hostSave() { var S = getS(); if (S && S.adapter && S.db) { try { S.adapter.save(S.db); } catch (e) {} } }
  function todayJdn() {
    var S = getS();
    if (S && S.adapter && typeof S.adapter.today === "function") { try { return S.adapter.today(); } catch (e) { return null; } }
    return null;
  }
  function deliveryJdn() {
    var S = getS();
    if (!S || !S.db || !S.db.profile || !S.db.profile.deliveryKey) return null;
    var J = hostJAL(); if (!J) return null;
    try { return J.keyToJdn(S.db.profile.deliveryKey); } catch (e) { return null; }
  }
  function todayDay() { var d = deliveryJdn(), t = todayJdn(); return (d === null || t === null) ? null : (t - d); }
  function keyOfJdn(jdn) {
    var J = hostJAL(); if (!J || !J.d2j) return null;
    try { var j = J.d2j(jdn); return J.keyOf(j.jy, j.jm, j.jd); } catch (e) { return null; }
  }
  function checkinAt(jdn) {
    var S = getS(); if (!S || !S.db || !S.db.checkins) return null;
    var k = keyOfJdn(jdn); if (!k) return null;
    return S.db.checkins[k] || null;
  }
  function supportStore() {
    var S = getS(); if (!S || !S.db) return null;
    if (!S.db.support || typeof S.db.support !== "object") S.db.support = { journal: {}, seen: {}, daily: {} };
    var sp = S.db.support;
    if (!sp.journal || typeof sp.journal !== "object") sp.journal = {};
    if (!sp.seen || typeof sp.seen !== "object") sp.seen = {};
    if (!sp.daily || typeof sp.daily !== "object") sp.daily = {};
    return sp;
  }

  /* ---------- موتور انتخاب محتوا (خالص) ---------- */
  function supportItem(id) { for (var i = 0; i < SUP.ITEMS.length; i++) if (SUP.ITEMS[i].id === id) return SUP.ITEMS[i]; return null; }
  function supportCard(section) { for (var i = 0; i < SUP.CARDS.length; i++) if (SUP.CARDS[i].id === section) return SUP.CARDS[i]; return null; }
  function supportStates() { return SUP.STATES || []; }
  function supportPhaseMatch(it, n) {
    var ph = it.phase || "any";
    if (ph === "any") return true;
    if (n === null || n === undefined) return false;
    if (ph === "early") return n <= 14;
    if (ph === "mid") return n >= 15 && n <= 84;
    if (ph === "late") return n >= 85;
    return true;
  }
  function supportItemsFor(section, topicId) {
    var n = todayDay();
    /* [۲٫۲] manualOnly: آیتم فقط با انتخاب صریح موضوع همان آیتم برمی‌گردد؛
       در هیچ مسیر خودکاری (پیشنهاد، فالبک موضوع، فالبک بخش) نمی‌آید. */
    function manualOK(it) { return !it.manualOnly || topicId === it.topic; }
    var base = SUP.ITEMS.filter(function (it) {
      if (it.section !== section) return false;
      if (!manualOK(it)) return false;
      if (topicId && it.topic !== topicId) return false;
      return supportPhaseMatch(it, n);
    });
    if (!base.length && topicId) base = SUP.ITEMS.filter(function (it) { return it.section === section && it.topic === topicId; });
    if (!base.length) base = SUP.ITEMS.filter(function (it) { return it.section === section && !it.manualOnly; });
    return base;
  }
  function supportTopics(section) {
    var seen = {}, out = [], late = [];
    SUP.ITEMS.forEach(function (it) {
      if (it.section !== section || seen[it.topic]) return;
      seen[it.topic] = true;
      /* [۲٫۲] موضوع‌های manualOnly دیده می‌شوند، اما آخرِ فهرست می‌آیند */
      (it.manualOnly ? late : out).push({ topic: it.topic, label: it.topicLabel });
    });
    return out.concat(late);
  }
  function supportRecordSeen(id) {
    var sp = supportStore(); if (!sp) return;
    sp.seen[id] = Date.now();
    var keys = Object.keys(sp.seen);
    if (keys.length > 300) {
      keys.map(function (k) { return { k: k, t: sp.seen[k] }; }).sort(function (a, b) { return a.t - b.t; })
        .slice(0, keys.length - 200).forEach(function (e) { delete sp.seen[e.k]; });
    }
    hostSave();
  }
  function supportLastOfSection(sp, section) {
    var best = null, bestTs = -1;
    SUP.ITEMS.forEach(function (it) {
      if (it.section !== section) return;
      var ts = sp.seen[it.id];
      if (ts && ts > bestTs) { best = it; bestTs = ts; }
    });
    return best;
  }
  function supportPick(section, topicId, nowMs) {
    var sp = supportStore(); if (!sp) return null;
    var list = supportItemsFor(section, topicId);
    if (!list.length) return null;
    var now = nowMs || Date.now();
    var recent = {};
    Object.keys(sp.seen).forEach(function (id) { if (now - sp.seen[id] < COOLDOWN) recent[id] = true; });
    var last = supportLastOfSection(sp, section);
    var scored = list.map(function (it) {
      var pen = 0;
      if (recent[it.id]) pen += 10000;
      if (last && it.semanticGroup === last.semanticGroup) pen += 500;
      if (last && it.supportType === last.supportType) pen += 250;
      return { it: it, pen: pen, seen: sp.seen[it.id] || 0 };
    });
    scored.sort(function (a, b) {
      if (a.pen !== b.pen) return a.pen - b.pen;
      if (a.seen !== b.seen) return a.seen - b.seen;
      return a.it.id < b.it.id ? -1 : a.it.id > b.it.id ? 1 : 0;
    });
    return scored[0].it;
  }
  function supportDailyPick() {
    var sp = supportStore(); if (!sp) return null;
    var day = todayJdn();
    if (day !== null && sp.daily.day === day && sp.daily.id && supportItem(sp.daily.id)) return supportItem(sp.daily.id);
    var list = SUP.DAILY.slice();
    var now = Date.now();
    var recent = {};
    Object.keys(sp.seen).forEach(function (id) { if (now - sp.seen[id] < COOLDOWN) recent[id] = true; });
    var last = null;
    list.forEach(function (it) { var ts = sp.seen[it.id]; if (ts && (!last || ts > sp.seen[last.id])) last = it; });
    var scored = list.map(function (it) {
      var pen = 0;
      if (recent[it.id]) pen += 10000;
      if (last && it.semanticGroup === last.semanticGroup) pen += 500;
      if (last && it.supportType === last.supportType) pen += 250;
      return { it: it, pen: pen, seen: sp.seen[it.id] || 0 };
    });
    scored.sort(function (a, b) {
      if (a.pen !== b.pen) return a.pen - b.pen;
      if (a.seen !== b.seen) return a.seen - b.seen;
      return a.it.id < b.it.id ? -1 : a.it.id > b.it.id ? 1 : 0;
    });
    var pick = scored[0].it;
    sp.daily.day = day;
    sp.daily.id = pick.id;
    hostSave();
    return pick;
  }
  function journalEntries() {
    var sp = supportStore(); if (!sp) return [];
    return Object.keys(sp.journal).map(function (k) {
      return { key: k, text: sp.journal[k].text || "", ts: sp.journal[k].ts || 0, promptId: sp.journal[k].promptId || null };
    }).sort(function (a, b) { return b.ts - a.ts; });
  }
  function draftInit() { if (!M.draft) M.draft = { key: null, text: "", promptId: null }; return M.draft; }

  /* ---------- تاریخ ---------- */
  function epochToJdn(d) {
    var div = function (a, b) { return ~~(a / b); }, mod = function (a, b) { return a - ~~(a / b) * b; };
    var gy = d.getFullYear(), gm = d.getMonth() + 1, gd = d.getDate();
    var j = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
    return j - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  }
  function supportFmtTs(ts) {
    var J = hostJAL(); if (!J || !J.d2j) return "";
    try { var j = J.d2j(epochToJdn(new Date(ts))); return fa(j.jd) + " " + J.MONTHS[j.jm - 1] + " " + fa(j.jy); } catch (e) { return ""; }
  }
  function daysAgo(ts) { return Math.max(0, Math.floor((Date.now() - ts) / 86400000)); }

  /* ---------- شخصی‌سازی از دادهٔ خودِ مادر ---------- */
  function personalLine() {
    var n = todayDay();
    var S = getS();
    var out = { title: "این را برای تو می‌نویسم", text: "", cta: null };
    if (n === null) {
      out.text = "تاریخ تولد نوزادت را ثبت کن تا این بخش با روزِ خودت هماهنگ شود.";
      return out;
    }
    if (n <= 3) out.text = "روز " + fa(n) + ". در این روزها احساس شکنندگی و گریهٔ بی‌دلیل شایع است؛ اگر اتفاق افتاد، چیز عجیبی نیست.";
    else if (n <= 10) out.text = "روز " + fa(n) + ". شیر در حال تنظیم است و بدنت هم. خستگیِ زیاد در این هفته طبیعی است، نه نشانهٔ کم‌آوردن تو.";
    else if (n <= 14) out.text = "روز " + fa(n) + ". برای بیشتر مادرها، احساس شکنندگی روزهای اول تا همین حالا کم‌کم آرام می‌شود.";
    else if (n <= 42) out.text = "روز " + fa(n) + ". شش هفتهٔ اول، دورهٔ سازگاری است؛ هنوز لازم نیست «به حالت قبل» برگشته باشی.";
    else out.text = "روز " + fa(n) + ". مراقبت از خودت به چهل روز ختم نمی‌شود؛ هر وقت لازم داشتی، همین‌جاست.";

    var y1 = n >= 2 ? checkinAt(todayJdn() - 1) : null;
    if (y1 && y1.mood === "rough") { out.text += " دیروز حالت پایین بود؛ امروز چطور است؟"; out.cta = { label: "چند لحظه دربارهٔ امروز", kind: "journal" }; }
    if (S && S.db && S.db.screen && S.db.screen.q1 != null && S.db.screen.q2 != null) {
      var sc = (S.db.screen.q1 || 0) + (S.db.screen.q2 || 0);
      if (sc >= 3) out.text += " نمرهٔ غربالگری خلق تو " + fa(sc) + " از ۶ بود؛ یک قدم کوچک برای پیگیری، همین امروز کافی است.";
    }
    var ents = journalEntries();
    if (ents.length) {
      var d = daysAgo(ents[0].ts);
      if (d <= 7) out.text += " آخرین یادداشتت " + (d === 0 ? "امروز" : fa(d) + " روز پیش") + " بود.";
    }
    return out;
  }

  /* ---------- «یادش می‌ماند»: مرور هفته از دادهٔ خودش ---------- */
  function continuityHtml() {
    var n = todayDay(); if (n === null) return "";
    var t = todayJdn(), days = 0, moods = {}, journalWeek = 0;
    for (var i = 0; i < 7; i++) {
      var c = checkinAt(t - i);
      if (c) { days++; if (c.mood) moods[c.mood] = (moods[c.mood] || 0) + 1; }
    }
    var label = { good: "خوب", okay: "معمولی", low: "پایین", rough: "سخت" };
    var best = null, bn = 0;
    Object.keys(moods).forEach(function (k) { if (moods[k] > bn) { best = k; bn = moods[k]; } });
    journalEntries().forEach(function (e) { if (daysAgo(e.ts) < 7) journalWeek++; });
    if (!days && !journalWeek) return "";
    var parts = [];
    if (days) parts.push("این هفته " + fa(days) + " روز حالت را ثبت کردی");
    if (best) parts.push("بیشتر «" + (label[best] || best) + "»");
    if (journalWeek) parts.push(fa(journalWeek) + " یادداشت نوشتی");
    return '<div class="pp-sup-memo" role="note">' +
      '<div class="pp-sup-memo-head"><span class="pp-sup-memo-ic">' + ic("chart") + "</span>" +
      "<b>یادش می‌ماند</b></div>" +
      "<p>" + esc(parts.join(" · ")) + ". الگوی هفتهٔ بعد با همین ثبت‌ها دقیق‌تر می‌شود؛ لازم نیست هر روز کامل باشد.</p></div>";
  }

  /* ---------- [۲٫۱] قلبِ «به دلم نشست» روی کارت روزانه ---------- */
  function dailyHeartOn() {
    var sp = supportStore(); if (!sp || sp.react == null) return false;
    var day = todayJdn(); if (day === null) return false;
    return !!sp.react[String(day)];
  }

  /* ---------- [۲٫۱] ابزارها: تمرین تنفس + پل نرم به دو پرسش حالت ---------- */
  var CALM = SUP.CALM || {};
  function toolsHtml() {
    var calmBtn = '<button type="button" class="pp-sup-calm-btn" data-ss="calm">' + ic("wind") +
      '<span><b>یک دقیقه تا آرامش</b><i>تمرین تنفس کوتاه — دم ۴، بازدم ۶</i></span>' + ic("chev") + "</button>";
    var bridge = "";
    if (supportSadDays() >= 3) {
      bridge = '<div class="pp-sup-bridge" role="note">' +
        "<b>این روزها چند بار سراغ حرف‌های دلت آمده‌ای — و این خوب است که به احساست رسیدگی می‌کنی.</b>" +
        "<p>اگر دوست داشتی تصویر دقیق‌تری از حال خودت داشته باشی، «دو پرسش کوتاه دربارهٔ حالت» در تب «تقویم و نمودار» منتظرت است — کوتاه، بدون قضاوت، و فقط برای خودت. این یک آزمون نیست؛ فقط یک آینهٔ کوچک.</p>" +
        '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="phq">' + ic("flag") + "رفتن به دو پرسش حالت</button></div>";
    }
    return '<div class="pp-sup-tools">' + calmBtn + bridge + "</div>";
  }
  function calmShellHtml() {
    return '<p class="pp-sup-lead">فقط یک دقیقه با خودت؛ دم ۴ ثانیه، بازدم ۶ ثانیه — بازدمِ بلندتر به بدن پیام آرامش می‌دهد.</p>' +
      '<div class="pp-sup-calm">' +
        '<div class="pp-sup-calm-stage"><div class="pp-sup-calm-circle"></div><span class="pp-sup-calm-count"></span></div>' +
        '<p class="pp-sup-calm-label"></p>' +
        '<div class="pp-sup-calm-meta"></div>' +
        '<div class="pp-sup-acts"><button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="calm">' + ic("wind") + "از نو</button>" +
        '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="close">' + ic("x") + "پایان</button></div>" +
      "</div>" +
      '<p class="pp-sup-privacy">' + ic("info") + "<span>" + esc(CALM.stopNote || "") + "</span></p>";
  }
  function stopCalm() {
    if (M.calmT) { clearTimeout(M.calmT); M.calmT = null; }
  }
  function calmStep(seq, i) {
    var s = ensureSheet(); if (!s) return;
    var box = s.querySelector(".pp-sup-calm");
    if (!box || !box.isConnected) { stopCalm(); return; }
    var lab = s.querySelector(".pp-sup-calm-label");
    var circ = s.querySelector(".pp-sup-calm-circle");
    var cnt = s.querySelector(".pp-sup-calm-count");
    var meta = s.querySelector(".pp-sup-calm-meta");
    if (i >= seq.length) {
      if (lab) lab.textContent = CALM.done || "تمام شد — آفرین که وقت گذاشتی.";
      if (meta) meta.textContent = "";
      if (cnt) cnt.textContent = "";
      if (circ) { circ.style.transitionDuration = "1.2s"; circ.style.transform = "scale(1)"; }
      M.calmT = null;
      return;
    }
    var st = seq[i];
    if (lab) lab.textContent = st.label;
    if (meta) meta.textContent = st.cycle ? "دورهٔ " + fa(st.cycle) + " از " + fa(CALM.cycles || 4) : "";
    if (cnt) cnt.textContent = fa(st.sec);
    if (circ) {
      if (st.kind === "in") { circ.style.transitionDuration = st.sec + "s"; circ.style.transform = "scale(1.4)"; }
      else if (st.kind === "out") { circ.style.transitionDuration = st.sec + "s"; circ.style.transform = "scale(.72)"; }
      else { circ.style.transitionDuration = ".8s"; circ.style.transform = "scale(1)"; }
    }
    var left = st.sec;
    M.calmT = setTimeout(function tick() {
      left--;
      if (left > 0) {
        var s2 = ensureSheet(); var c2 = s2 ? s2.querySelector(".pp-sup-calm-count") : null;
        if (!c2 || !c2.isConnected) { stopCalm(); return; }
        c2.textContent = fa(left);
        M.calmT = setTimeout(tick, 1000);
      } else calmStep(seq, i + 1);
    }, 1000);
  }
  function startCalm() {
    stopCalm();
    var seq = [];
    if (CALM.prep) seq.push({ kind: "idle", label: CALM.prep.label, sec: CALM.prep.sec || 3 });
    var cyc = CALM.cycles || 4;
    for (var c = 1; c <= cyc; c++) {
      seq.push({ kind: "in", label: (CALM.inhale || {}).label || "دم…", sec: (CALM.inhale || {}).sec || 4, cycle: c });
      seq.push({ kind: "out", label: (CALM.exhale || {}).label || "بازدم…", sec: (CALM.exhale || {}).sec || 6, cycle: c });
    }
    calmStep(seq, 0);
  }

  /* ---------- بررسی کلیدواژه‌ای ایمنی (قطعی، بدون ادعای تشخیص) ----------
     [۲٫۲] دو سطحی:
       ۱ = عبارتِ پرخطر صریح → کارت ایمنی (showSafetyCard)
       ۲ = ترسِ آسیب‌زدن به نوزاد (فکر ناخواسته، نه قصد) → کارت نرم (showSoftCard)
       ۰ = بدون هشدار. پوشش روی متنِ نرمال‌شده (نیم‌فاصله، ی/ک عربی، اعراب،
       نشانه‌گذاری) تا شکل‌های مختلف نوشتن یک جمله یکسان گرفته شوند. */
  function normFa(s) {
    return String(s || "")
      .replace(/[\u064B-\u065F\u0640]/g, "")
      .replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/ۀ/g, "ه")
      .replace(/[\u200c\u200f\u200e]/g, " ")
      .replace(/[.,،؛:!؟?"'«»()\-–—_]/g, " ")
      .replace(/\s+/g, " ").trim().toLowerCase();
  }
  var WANT = "(?:می ?خوام|میخوام|می ?خواهم|دلم می ?خواد|دلم میخواد|دوست دارم|کاش|ای کاش)";
  var TIER1 = [
    /خودکشی/,
    /خود(?:م|ام)?(?: ?(?:را|رو)|و)? ?بکش/,
    /خود(?:م|ام)?(?: ?(?:را|رو)|و)? ?(?:آویزون|حلق آویز|پرت|از بین)/,
    new RegExp(WANT + " (?:که )?(?:همین الان )?(?:بمیرم|می ?مردم|میمردم|نبودم|نباشم|مرده بودم)(?! از)"),
    /(?:نمی ?خوام|نمیخوام|نمی ?خواهم) (?:دیگه |دیگر )?(?:زنده|زندگی)/,
    /(?:نمی ?خوام|نمیخوام|نمی ?خواهم) (?:دیگه |دیگر )?ادامه بدم(?! ?(?:این|اون|آن|رژیم|کار|تمرین|درس|دوره))/,
    /به خود(?:م|ام)? (?:آسیب|صدمه|ضرر) (?:بزنم|برسونم|برسانم)/,
    /(?:بچه|نوزاد|کوچولو|فرزند)(?:\S* ){0,4}(?:پنجره|بالکن|پشت ?بام)(?: \S+){0,3} (?:پرت|بندازم|بیندازم)/,
    /زنده نمون/,
    /بهتره (?:که )?من نباشم|بدون من (?:بهتر|راحت)/,
    /(?:زندگی|خودم|قرص|سم|زنده).*تمومش کن|زندگی ?م? ?(?:رو|را)? ?تموم کن/,
    /به (?:بچه|نوزاد|کوچولو|فرزند|نی نی)(?: ?(?:م|ام|مو))? ?(?:آسیب|صدمه|ضرر) ?(?:بزنم|برسونم|برسانم)/,
    /(?:بچه|نوزاد|کوچولو|فرزند|نی نی)(?: ?(?:م|ام))?(?: \S+){0,3} (?:خفه|بکشم|پرت)/,
    /صدا(?:ی|هایی|ها)? ?(?:می ?شنوم|میشنوم)/
  ];
  var TIER2 = [ /(?:می ?ترسم|میترسم|نکنه|ذهنم میاد|فکرش میاد|تصویر).{0,40}(?:بچه|نوزاد|کوچولو|فرزند).{0,40}(?:آسیب|خفه|پرت|بکشم|بندازم)/ ];
  function riskTier(text) {   /* 0 = بدون هشدار، 1 = کارت ایمنی، 2 = کارت نرم */
    var s = normFa(text);
    if (TIER2.some(function (r) { return r.test(s); })) return 2;
    if (TIER1.some(function (r) { return r.test(s); })) return 1;
    return 0;
  }
  /* سازگاری با نسخه‌های قبل: «خطرناک» یعنی سطح ۱ یا ۲ */
  function safetyCheck(text) { return riskTier(text) >= 1; }

  /* ---------- خواندن صوتی ---------- */
  function canSpeak() { return !!(global.speechSynthesis && global.SpeechSynthesisUtterance); }
  function speak(text) {
    if (!canSpeak()) return;
    try {
      global.speechSynthesis.cancel();
      if (M.speaking) { M.speaking = false; return; }
      var u = new global.SpeechSynthesisUtterance(text);
      u.lang = "fa-IR";
      u.rate = 0.95;
      u.onend = function () { M.speaking = false; };
      u.onerror = function () { M.speaking = false; };
      M.speaking = true;
      global.speechSynthesis.speak(u);
    } catch (e) { M.speaking = false; }
  }

  /* ---------- رندر بخش ---------- */
  function stateChipsHtml() {
    var st = supportStates();
    if (!st.length) return "";
    return '<div class="pp-sup-states" role="group" aria-label="الان چه حالی داری؟">' +
      '<p class="pp-sup-states-q">الان چه حالی داری؟</p>' +
      '<div class="pp-sup-states-row">' + st.map(function (s) {
        return '<button type="button" class="pp-sup-state" data-ss="state" data-v="' + s.id + '" data-section="' + s.section + '" data-topic="' + (s.topic || "") + '">' +
          '<span class="pp-sup-state-ic">' + ic(s.icon) + "</span>" + esc(s.label) + "</button>";
      }).join("") + "</div></div>";
  }
  function dailyHtml() {
    var it = supportDailyPick();
    if (!it) return "";
    supportRecordSeen(it.id);
    var kindIc = { empathy: "heart", fact: "info", action: "check", reminder: "spark", prompt: "note" }[it.supportType] || "heart";
    var kindLabel = { empathy: "همراهی", fact: "دانستنی", action: "قدم کوچک", reminder: "یادآوری", prompt: "تأمل" }[it.supportType] || "";
    return '<div class="pp-sup-daily" role="note">' +
      '<div class="pp-sup-daily-head"><span class="pp-sup-daily-ic">' + ic(kindIc) + "</span>" +
        "<div><b>یک همراهی کوچک برای امروز</b><i>" + esc(kindLabel) + "</i></div></div>" +
      '<p>' + esc(it.text) + "</p>" +
      (it.src ? '<p class="pp-sup-daily-src">منبع: <a href="' + it.src[1] + '" target="_blank" rel="noopener">' + esc(it.src[0]) + "</a></p>" : "") +
      (it.section && supportCard(it.section)
        ? '<button type="button" class="pp-sup-daily-link" data-ss="open" data-v="' + it.section + '">همراهی بیشتر دربارهٔ این موضوع' + ic("arrow") + "</button>"
        : "") +
      '<div class="pp-sup-daily-foot"><button type="button" class="pp-sup-heart' + (dailyHeartOn() ? " on" : "") + '" data-ss="heart" aria-pressed="' + dailyHeartOn() + '">' + ic("heart") + "<span>" + (dailyHeartOn() ? "برای تو ثبت شد" : "به دلم نشست") + "</span></button></div>" +
      "</div>";
  }
  function whyLinkHtml() {
    return '<button type="button" class="pp-sup-why" data-ss="why">' + ic("info") + "چرا این‌جا، نه هر جای دیگر؟</button>";
  }
  /* ---------- [۲٫۵] چهار ورودی اصلی «مراقبت من» ----------
     ترتیب صفحهٔ اصلی طبق طراحی کارفرما: غم ← شک ← بدن ← دفترچه.
     هر کارت: آیکون + عنوان + توضیح کوتاه (از CARDS) + شمارندهٔ محتوا. */
  function careCardsHtml() {
    var order = ["sad", "doubt", "body", "journal"];
    var meta = {
      sad: fa(supportTopics("sad").length) + " موضوع",
      doubt: fa(supportTopics("doubt").length) + " موضوع",
      body: fa(supportTopics("body").length) + " موضوع",
      journal: fa((SUP.PROMPTS || []).length) + " پیشنهاد برای شروع"
    };
    return '<div class="pp-sup-grid">' + order.map(function (id) {
      var c = supportCard(id);
      if (!c) return "";
      return '<button type="button" class="pp-sup-card pp-sup-hub sup-' + (c.tone || "pink") + '" data-ss="open" data-v="' + c.id + '" aria-haspopup="dialog">' +
        '<span class="pp-sup-card-top">' +
          '<span class="pp-sup-card-ic">' + ic(c.icon) + "</span>" +
          '<span class="pp-sup-card-arrow">' + ic("chev") + "</span>" +
        "</span>" +
        '<span class="pp-sup-card-b"><b>' + esc(c.title) + "</b><i>" + esc(c.sub) + "</i></span>" +
        '<span class="pp-sup-hub-meta">' + esc(meta[c.id] || "") + "</span>" +
        "</button>";
    }).join("") + "</div>";
  }
  function supportHtml() {
    /* [۲٫۵] صفحهٔ اصلی «مراقبت من» — میزبان تازهٔ «من هم مهمم» */
    var p = personalLine();
    var tl = timeLine();
    return '<section class="pp-sec pp-support">' +
      '<div class="pp-sec-head">' +
        '<span class="pp-ic">' + ic("heart") + "</span>" +
        '<div><h2>مراقبت من</h2>' +
        '<div class="pp-sec-sub">من هم مهمم — جایی برای احساسات و نیازهای خودت، نه فقط مراقبت از نوزاد</div></div>' +
      "</div>" +
      (tl ? '<p class="pp-sup-timeline">' + esc(tl) + "</p>" : "") +
      '<div class="pp-sup-personal" role="note">' +
        '<span class="pp-sup-personal-ic">' + ic("spark") + "</span>" +
        "<div><b>" + esc(p.title) + "</b><p>" + esc(p.text) + "</p>" +
          (p.cta ? '<button type="button" class="pp-sup-daily-link" data-ss="open" data-v="' + p.cta.kind + '">' + esc(p.cta.label) + ic("arrow") + "</button>" : "") +
        "</div></div>" +
      stateChipsHtml() +
      careCardsHtml() +
      dailyHtml() +
      toolsHtml() +
      continuityHtml() +
      whyLinkHtml() +
      "</section>";
  }

  /* ---------- رندر شیت ---------- */
  function block(label, icon, html, cls) {
    if (!html) return "";
    return '<div class="pp-sup-block ' + (cls || "") + '"><h4>' + ic(icon) + label + "</h4><p>" + html + "</p></div>";
  }
  function bulletsHtml(b) {
    if (!b || !b.items || !b.items.length) return "";
    return '<div class="pp-sup-block sup-warn"><h4>' + ic("flag") + esc(b.title) + "</h4><ul>" +
      b.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
  }
  function tableHtml(t) {
    if (!t) return "";
    return '<div class="pp-sup-table"><table role="table"><thead><tr>' +
      t.head.map(function (h) { return "<th>" + esc(h) + "</th>"; }).join("") +
      "</tr></thead><tbody>" + t.rows.map(function (r) {
        return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }
  function levelsHtml(l) {
    if (!l) return "";
    var rows = [
      { k: "self", t: "خودمراقبتی", ic: "check", cls: "sup-lv-self" },
      { k: "follow", t: "پیگیری", ic: "info", cls: "sup-lv-follow" },
      { k: "urgent", t: "اقدام فوری", ic: "flag", cls: "sup-lv-urgent" }
    ].filter(function (r) { return l[r.k]; });
    if (!rows.length) return "";
    return '<div class="pp-sup-levels"><h4>' + ic("shield") + "کِی کمک بگیرم؟</h4>" +
      rows.map(function (r) {
        return '<div class="pp-sup-level ' + r.cls + '"><span>' + ic(r.ic) + "</span><div><b>" + r.t + "</b><p>" + esc(l[r.k]) + "</p></div></div>";
      }).join("") + "</div>";
  }
  function prevalenceHtml(p) {
    if (!p) return "";
    return '<p class="pp-sup-prev">' + ic("chart") + "<span>" + esc(p) + "</span></p>";
  }
  function srcHtml(s) {
    if (!s) return "";
    return '<p class="pp-sup-src">منبع: <a href="' + s[1] + '" target="_blank" rel="noopener">' + esc(s[0]) + "</a></p>";
  }
  function audioBtnHtml(text) {
    if (!canSpeak()) return "";
    return '<button type="button" class="pp-sup-audio" data-ss="audio" data-text="' + esc(text) + '">' +
      ic(M.speaking ? "pause" : "play") + (M.speaking ? "توقف خواندن" : "بخوان برایم") + "</button>";
  }
  /* ---------- [۲٫۳/۲٫۴] فلش‌کارت‌های «کارت برگردان» ----------
     [۲٫۴] کارت دیگر در فهرست رندر نمی‌شود؛ فهرست متن ساده است و کارت با
     انتخاب موضوع به‌صورت تکی (pp-flip-solo) باز می‌شود. */
  function cardImg(section, topic) {
    var m = SUP.CARD_IMG || {};
    return (m[section] && m[section][topic]) || null;
  }
  function flipCardHtml(section, tp) {
    var it = supportItemsFor(section, tp.topic)[0];
    if (!it) return "";
    var img = cardImg(section, tp.topic);
    var label = tp.label || it.topicLabel;
    var frontImg = img
      ? '<img src="' + esc(img) + '" alt="" loading="lazy">'
      : '<div class="pp-flip-noimg" aria-hidden="true">' + ic("heart") + "</div>";
    var thumb = img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : "";
    return '<div class="pp-flip" role="listitem">' +
      '<div class="pp-flip-card" role="button" tabindex="0" aria-expanded="false"' +
        ' aria-label="کارت «' + esc(label) + '» — برای خواندن، کارت را برگردان">' +
        '<div class="pp-flip-face pp-flip-front">' + frontImg +
          '<div class="pp-flip-shade" aria-hidden="true"></div>' +
          '<div class="pp-flip-cap">' +
            '<span class="pp-flip-chip">' + esc(label) + "</span>" +
            '<h4 class="pp-flip-ttl">' + esc(it.title) + "</h4>" +
            '<span class="pp-flip-hint" aria-hidden="true"><i>' + ic("flip") + "</i>برای خواندن، کارت را برگردان</span>" +
          "</div>" +
        "</div>" +
        '<div class="pp-flip-face pp-flip-back">' +
          '<div class="pp-flip-head">' + thumb +
            "<div><span class=\"pp-flip-chip\">" + esc(label) + "</span>" +
            '<h4 class="pp-flip-ttl-sm">' + esc(it.title) + "</h4></div>" +
          "</div>" +
          '<div class="pp-flip-back-body">' +
            '<div><div class="pp-flip-lbl">شاید…</div><blockquote>' + esc(it.opening) + "</blockquote></div>" +
            '<div><div class="pp-flip-lbl">یه جور دیگه نگاهش کن</div><div class="pp-flip-reframe">' + esc(it.reframe) + "</div></div>" +
            '<div class="pp-flip-act"><div class="pp-flip-lbl">یک قدم کوچک</div><p>' + esc(it.smallAction) + "</p></div>" +
            '<button type="button" class="pp-flip-read" data-ss="topic" data-section="' + esc(section) + '" data-topic="' + esc(tp.topic) + '" data-item="' + esc(it.id) + '">' +
              ic("book") + "متن کامل این موضوع" + ic("arrow") +
            "</button>" +
          "</div>" +
        "</div>" +
      "</div></div>";
  }
  function topicListHtml(section) {
    /* [۲٫۴] فهرست متن ساده بدون عکس؛ کارت با انتخاب موضوع باز می‌شود */
    var card = supportCard(section);
    var topics = supportTopics(section);
    if (!card) return '<div class="pp-empty">' + ic("info") + "<span>این بخش هنوز محتوایی ندارد.</span></div>";
    var rows = topics.map(function (tp) {
      var lbl = tp.label || "";
      return '<button type="button" class="pp-sup-topic" data-ss="card" data-section="' + esc(section) + '" data-topic="' + esc(tp.topic) + '" aria-haspopup="dialog">' +
        ic("flip") + "<b>" + esc(lbl) + "</b>" + ic("arrow") + "</button>";
    }).join("");
    return '<p class="pp-sup-lead">' + esc(card.sub) + "</p>" +
      '<p class="pp-sup-hint">روی هر موضوع بزن تا فلش‌کارتش باز شود؛ پشت کارت «شاید…»، یک نگاه تازه و یک قدم کوچک منتظر توست.</p>' +
      '<div class="pp-sup-topics" data-tone="' + esc(section) + '">' + rows + "</div>";
  }
  function cardSoloHtml(section, topic) {
    /* [۲٫۴] فلش‌کارت تکیِ موضوع انتخاب‌شده */
    var card = supportCard(section);
    var it = supportItemsFor(section, topic)[0];
    if (!card || !it) return '<div class="pp-empty">' + ic("info") + "<span>این موضوع هنوز محتوایی ندارد.</span></div>";
    return '<button type="button" class="pp-sup-back" data-ss="back" data-section="' + esc(section) + '">' + ic("back") + "فهرست موضوع‌ها</button>" +
      '<div class="pp-flip-solo" data-tone="' + esc(section) + '">' +
        flipCardHtml(section, { topic: it.topic, label: it.topicLabel }) +
      "</div>" +
      '<p class="pp-sup-hint pp-flip-solo-hint">برای خواندن، روی کارت بزن تا برگردد؛ با لمس دوباره به روی کارت برمی‌گردد.</p>';
  }
  function toggleFlip(card) {
    if (!card) return;
    var on = !card.classList.contains("flipped");
    card.classList.toggle("flipped", on);
    if (card.setAttribute) card.setAttribute("aria-expanded", on ? "true" : "false");
  }
  function flipFromClick(e) {
    var el = e.target;
    if (!el || !el.closest) return;
    var card = el.closest(".pp-flip-card");
    if (!card) return;
    /* داخل بدنهٔ قابل‌اسکرولِ پشت کارت، کلیک برای خواندن و انتخاب متن است */
    var body = el.closest(".pp-flip-back-body");
    if (body && body.scrollHeight > body.clientHeight + 2) return;
    toggleFlip(card);
  }
  function onFlipKey(e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var t = e.target;
    if (!t || !t.closest || t !== t.closest(".pp-flip-card")) return;
    e.preventDefault();
    toggleFlip(t);
  }
  function contentHtml(section, topic, via, itemId) {
    /* [۲٫۳] اگر از پشت فلش‌کارت آمده باشیم، دقیقاً همان آیتمِ کارت باز می‌شود */
    var it = (itemId && supportItem(itemId)) || supportPick(section, topic);
    if (!it) return '<div class="pp-empty">' + ic("info") + "<span>محتوای تازه‌ای برای این موضوع پیدا نشد.</span></div>";
    supportRecordSeen(it.id);
    /* [۲٫۱] جملهٔ به رسمیت‌شناختنِ احساس (وقتی از مسیر «الان چه حالی داری؟» آمده) */
    var viaLine = "";
    if (via) {
      var st = supportStates(), fl = null;
      for (var si = 0; si < st.length; si++) if (st[si].id === via) { fl = st[si]; break; }
      if (fl && fl.line) viaLine = '<p class="pp-sup-via">' + esc(fl.line) + "</p>";
    }
    var nextBtn = "";
    if (it.nextStep && it.nextStep.action === "flags") {
      nextBtn = '<div class="pp-sup-acts"><button type="button" class="pp-btn pp-btn-sm pp-alert-btn" data-ss="flags">' + ic("flag") + "علائم خطر</button></div>";
    } else if (it.nextStep && it.nextStep.action === "phq") {
      nextBtn = '<div class="pp-sup-acts"><button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="phq">' + ic("info") + "دو پرسش کوتاه خلق</button></div>";
    } else if (it.nextStep && it.nextStep.action && String(it.nextStep.action).indexOf("guide:") === 0) {
      nextBtn = '<div class="pp-sup-acts"><button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="guide" data-v="' + String(it.nextStep.action).slice(6) + '">' + ic("book") + "راهنمای «حال من»</button></div>";
    }
    var speakTxt = it.title + ". " + it.opening + " " + it.explanation;
    return '<button type="button" class="pp-sup-back" data-ss="back" data-section="' + section + '">' + ic("back") + "فهرست موضوع‌ها</button>" +
      viaLine +
      '<h3 class="pp-sup-title">' + esc(it.title) + "</h3>" +
      audioBtnHtml(speakTxt) +
      '<p class="pp-sup-lead">' + esc(it.opening) + "</p>" +
      supportBlockText(it) +
      block("از زاویه‌ای دیگر", "spark", esc(it.reframe), "sup-reframe") +
      block("یک قدم کوچک و اختیاری", "check", esc(it.smallAction), "sup-action") +
      bulletsHtml(it.bullets) +
      (it.table ? '<div class="pp-sup-block sup-exp"><h4>' + ic("info") + "تفاوت را ببین</h4>" + tableHtml(it.table) + "</div>" : "") +
      block("سؤالی برای فکرکردن", "note", esc(it.reflectionPrompt), "sup-reflect") +
      prevalenceHtml(it.prevalence) +
      (it.nextStep ? '<div class="pp-sup-block sup-next"><h4>' + ic("flag") + "مسیر حمایتی بعدی</h4><p>" + esc(it.nextStep.text) + "</p>" + nextBtn + "</div>" : "") +
      levelsHtml(it.levels) +
      srcHtml(it.src) +
      '<p class="pp-sup-note">' + ic("info") + "این متن آموزشی و حمایتی است، نه تشخیص یا تجویز درمان.</p>" +
      '<p class="pp-sup-closer">' + ic("heart") + "هر وقت خواستی، من همین‌جام — بی‌قضاوت و بی‌عجله.</p>";
  }
  function supportBlockText(it) {
    return '<div class="pp-sup-block sup-exp"><h4>' + ic("info") + "چه چیزی این‌جا جریان دارد</h4><p>" + esc(it.explanation) + "</p></div>";
  }
  function journalHtml() {
    var d = draftInit();
    var entries = journalEntries();
    var selPrompt = SUP.PROMPTS.filter(function (p) { return p.id === d.promptId; })[0];
    var ack = "";
    if (M.ack) ack = '<div class="pp-sup-ack" role="status">' + ic("heart") + "<span>" + esc(M.ack) + "</span></div>";
    return '<p class="pp-sup-lead">' + (selPrompt ? "بر اساس پیشنهاد: «" + esc(selPrompt.text) + "»" : "هرچه دلت می‌خواهد بنویس؛ بدون قضاوت و بدون اجبار.") + "</p>" +
      ack +
      '<div class="pp-sup-prompts">' + SUP.PROMPTS.map(function (p) {
        var on = d.promptId === p.id;
        return '<button type="button" class="pp-chip" data-ss="jprompt" data-v="' + p.id + '" aria-pressed="' + on + '" title="' + esc(p.text) + '">' + esc(p.text) + "</button>";
      }).join("") + "</div>" +
      '<textarea class="pp-sup-textarea" data-ss-in="journal" rows="5" placeholder="اینجا فقط برای خودت بنویس…">' + esc(d.text) + "</textarea>" +
      '<div class="pp-sup-acts">' +
        '<button type="button" class="pp-btn pp-btn-main pp-btn-sm" data-ss="jsave">' + ic("check") + (d.key ? "ذخیرهٔ تغییرات" : "ذخیرهٔ یادداشت") + "</button>" +
        (d.key ? '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="jnew">' + ic("plus") + "یادداشت تازه" + "</button>" : "") +
      "</div>" +
      (entries.length
        ? '<div class="pp-sup-jlist">' + entries.map(function (e) {
            var pr = SUP.PROMPTS.filter(function (p) { return p.id === e.promptId; })[0];
            return '<div class="pp-sup-jitem">' +
              '<div class="pp-sup-jitem-top"><span>' + (pr ? "«" + esc(pr.text) + "»" : "یادداشت آزاد") + "</span>" +
              "<time>" + supportFmtTs(e.ts) + "</time></div>" +
              "<p>" + esc(e.text) + "</p>" +
              '<div class="pp-sup-jitem-acts">' +
                '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="jedit" data-k="' + e.key + '">' + ic("edit") + "ویرایش</button>" +
                '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm pp-sup-del" data-ss="jdel" data-k="' + e.key + '">' + ic("trash") + "حذف</button>" +
              "</div></div>";
          }).join("") + "</div>"
        : '<div class="pp-empty">' + ic("info") + "<span>هنوز یادداشتی ننوشته‌ای. نوشتنِ اولین جمله سخت‌ترین قدم است.</span></div>") +
      '<p class="pp-sup-privacy">' + ic("lock") + "<span>یادداشت‌هایت فقط روی همین دستگاه می‌مانند. اگر عبارتی نشانهٔ خطر باشد، کنارت می‌مانم و مسیر کمک را نشان می‌دهم؛ این بررسی کامل نیست.</span></p>" +
      '<button type="button" class="pp-sup-crisis-link" data-ss="crisis">' + ic("phone") + "اگر کمک فوری لازم داری</button>";
  }
  function whyHtml() {
    return '<div class="pp-sup-why-body">' +
      '<p class="pp-sup-lead">اطلاعات عمومی را هر کسی می‌تواند پیدا کند. این‌جا چند کار هست که جست‌وجو و چت‌بات نمی‌توانند برایت بکنند:</p>' +
      '<div class="pp-sup-why-list">' +
        '<div class="pp-sup-why-item"><span>' + ic("spark") + "</span><div><b>تو را می‌شناسد</b><p>روز چندم پس از زایمانی، چه ثبت کرده‌ای، نمرهٔ غربالگری‌ات چه بود — و متناسب با همان حرف می‌زند.</p></div></div>" +
        '<div class="pp-sup-why-item"><span>' + ic("chart") + "</span><div><b>یادش می‌ماند</b><p>یادداشت‌ها و ثبت‌هایت را کنار هم می‌گذارد و الگوی هفتهٔ تو را نشان می‌دهد.</p></div></div>" +
        '<div class="pp-sup-why-item"><span>' + ic("shield") + "</span><div><b>ایمنی‌اش قابل بازرسی است</b><p>مسیر «کِی کمک بگیرم» با قاعده‌های ثابت و شمارهٔ اورژانس کار می‌کند، نه با حدس.</p></div></div>" +
        '<div class="pp-sup-why-item"><span>' + ic("book") + "</span><div><b>کاری می‌کند که چت نمی‌کند</b><p>برگهٔ ویزیت، درخواست کمک از همسر، نمودار رشد و تقویم — همه از دل همین ثبت‌ها.</p></div></div>" +
        '<div class="pp-sup-why-item"><span>' + ic("lock") + "</span><div><b>خصوصی است</b><p>نوشته‌هایت روی همین دستگاه می‌ماند و برای تحلیل جایی فرستاده نمی‌شود.</p></div></div>" +
      "</div>" +
      '<div class="pp-sup-block sup-warn"><h4>' + ic("info") + "این‌جا چه چیزی نیست</h4><p>تشخیص پزشکی، درمان، روان‌درمانگر یا دستیار هوش مصنوعی نیست. اگر وضعیتت اورژانسی است، این متن جای تماس با اورژانس (۱۱۵) را نمی‌گیرد.</p></div>" +
      '<p class="pp-sup-src">مبنای محتوا: ' + SUP.SOURCES.slice(0, 4).map(function (s) {
        return '<a href="' + s[1] + '" target="_blank" rel="noopener">' + esc(s[0].split("—")[0].trim()) + "</a>";
      }).join(" · ") + "</p></div>";
  }
  function sheetBodyHtml() {
    var o = M.open;
    if (!o) return "";
    if (o.mode === "why") return whyHtml();
    if (o.mode === "journal") return journalHtml();
    if (o.mode === "calm") return calmShellHtml();
    if (o.mode === "topic") return contentHtml(o.section, o.topic, o.via, o.item);
    if (o.mode === "card") return cardSoloHtml(o.section, o.topic); /* [۲٫۴] فلش‌کارت تکی */
    return topicListHtml(o.section);
  }
  function sheetTitle() {
    var o = M.open; if (!o) return "من هم مهمم";
    if (o.mode === "why") return "چرا این‌جا، نه هر جای دیگر؟";
    if (o.mode === "journal") return "حرف دلم رو بنویسم";
    if (o.mode === "calm") return "یک دقیقه تا آرامش";
    if (o.mode === "topic") { var c = supportCard(o.section); return c ? c.title : "همراهی عاطفی"; }
    var c2 = supportCard(o.section); return c2 ? c2.title : "من هم مهمم";
  }

  /* ---------- شیت و توست ---------- */
  function hostRoot() { return (global.document && global.document.getElementById) ? (global.document.getElementById("ppHost") || global.document.body) : null; }
  function ensureSheet() {
    if (M.sheet && M.sheet.isConnected) return M.sheet;
    var root = hostRoot(); if (!root || !global.document) return null;
    var s = global.document.createElement("div");
    s.className = "pp-sheet pp-supsheet";
    s.innerHTML = '<div class="pp-sheet-in"><div class="pp-sheet-top"><span class="pp-sup-sheet-ic">' + ic("heart") + '</span><h3></h3><button type="button" class="pp-x" data-ss="close" aria-label="بستن">' + ic("x") + "</button></div><div class=\"pp-sheet-body\"></div></div>";
    root.appendChild(s);
    M.sheet = s;
    return s;
  }
  function ensureToast() {
    if (M.toast && M.toast.isConnected) return M.toast;
    var root = hostRoot(); if (!root || !global.document) return null;
    var t = global.document.createElement("div");
    t.className = "pp-toast";
    t.setAttribute("role", "status");
    t.setAttribute("aria-live", "polite");
    t.innerHTML = ic("check") + "<span></span>";
    root.appendChild(t);
    M.toast = t;
    return t;
  }
  function toast(msg) {
    var t = ensureToast(); if (!t) return;
    t.querySelector("span").textContent = msg;
    t.classList.add("show");
    clearTimeout(M.toastT);
    M.toastT = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  function syncSheet() {
    stopCalm();
    var s = ensureSheet(); if (!s) return;
    s.querySelector(".pp-sheet-top h3").textContent = sheetTitle();
    s.querySelector(".pp-sheet-body").innerHTML = sheetBodyHtml();
    if (M.open) {
      s.classList.add("open");
      if (M.open.mode === "calm") startCalm();
    }
  }
  function renderSheetBody() {
    stopCalm();
    var s = ensureSheet(); if (!s) return;
    s.querySelector(".pp-sheet-body").innerHTML = sheetBodyHtml();
    if (M.open && M.open.mode === "calm") startCalm();
  }
  function render() { if (M.node) M.node.innerHTML = supportHtml(); }

  /* ---------- [۲٫۵] نصب داخل تب «مراقبت من» ----------
     بخش «من هم مهمم» دیگر در تب «امروز» نیست؛ به پنِ «مراقبت من» سوار
     می‌شود — پیش از بخش «از همسرم کمک بخواه» (ppPartner).
     [۲٫۱] رویدادها یک‌بار روی ریشهٔ میزبان (#ppHost) جاسازی می‌شوند، نه روی گرهٔ بخش؛
     چون شیت (و دکمه‌های داخلش) و توست بیرون از گرهٔ بخش ساخته می‌شوند و اگر
     شنونده فقط روی گرهٔ بخش بود، هیچ دکمه‌ای داخل شیت کار نمی‌کرد. */
  function bindRoot() {
    if (M.bound || !global.document) return;
    var root = hostRoot(); if (!root || !root.addEventListener) return;
    root.addEventListener("click", onClick);
    root.addEventListener("input", onInput);
    root.addEventListener("keydown", onFlipKey); /* [۲٫۳] برگرداندن کارت با کیبورد */
    M.bound = true;
  }
  function tryMount() {
    if (!global.document || !host() || !getS()) return false;
    var pane = global.document.querySelector("#ppHost [data-pp-pane=\"care\"]");
    if (!pane) return false;
    var node = global.document.getElementById("ppSupportNode");
    if (!node) {
      node = global.document.createElement("div");
      node.id = "ppSupportNode";
      node.setAttribute("data-ss-root", "1");
    }
    if (pane.firstElementChild !== node) pane.insertBefore(node, pane.firstElementChild);
    bindRoot();
    if (M.node !== node) {
      M.node = node;
      render();
    }
    return true;
  }
  function autoMount() {
    if (tryMount()) return;
    var h = global.document && global.document.getElementById ? global.document.getElementById("ppHost") : null;
    if (h && global.MutationObserver) {
      var obs = new global.MutationObserver(function () { if (tryMount()) obs.disconnect(); });
      obs.observe(h, { childList: true, subtree: true });
    } else { setTimeout(autoMount, 800); }
  }

  /* ---------- رویدادها ---------- */
  function openJournal() {
    stopCalm();
    M.draft = { key: null, text: "", promptId: null };
    M.ack = null;
    M.open = { mode: "journal" };
    syncSheet();
  }
  function openSection(section) {
    if (section === "journal") { openJournal(); return; } /* [۲٫۱] کارت دفترچه مستقیم به شیت دفترچه */
    M.open = { mode: "list", section: section };
    syncSheet();
  }
  function openTopic(section, topic, via, itemId) {
    if (!section) return;
    if (section === "journal") { openJournal(); return; } /* [۲٫۱] حالت «فقط می‌خوام بنویسم» */
    M.open = { mode: "topic", section: section, topic: topic || null, via: via || null, item: itemId || null }; /* [۲٫۳] itemId */
    syncSheet();
  }
  function closeSheet() {
    stopCalm();
    var s = ensureSheet(); if (s) s.classList.remove("open");
    M.open = null;
    if (canSpeak()) { try { global.speechSynthesis.cancel(); } catch (e0) {} M.speaking = false; }
  }
  function onClick(e) {
    var t = e.target && e.target.closest ? e.target.closest("[data-ss]") : null;
    if (!t) { flipFromClick(e); return; } /* [۲٫۳] کلیک روی خود کارت (نه دکمه‌ها) = برگرداندن */
    /* [۲٫۱] شیت و توست بیرون از گرهٔ بخش ساخته می‌شوند؛ کافی است رویداد داخل ریشهٔ میزبان باشد */
    var root = hostRoot();
    if (root && root.contains && !root.contains(t)) return;
    var a = t.getAttribute("data-ss");
    if (a === "open") { openSection(t.getAttribute("data-v")); return; }
    if (a === "state") {
      /* [۲٫۱] مسیریاب احساس لحظه‌ای: هر حالت به موضوع خودش با جملهٔ به رسمیت‌شناختن */
      openTopic(t.getAttribute("data-section"), t.getAttribute("data-topic"), t.getAttribute("data-v"));
      return;
    }
    if (a === "topic") { openTopic(t.getAttribute("data-section"), t.getAttribute("data-topic"), null, t.getAttribute("data-item")); return; }
    if (a === "card") { /* [۲٫۴] بازکردن فلش‌کارت تکی موضوع انتخاب‌شده */
      M.open = { mode: "card", section: t.getAttribute("data-section"), topic: t.getAttribute("data-topic") };
      syncSheet(); return;
    }
    if (a === "calm") { M.open = { mode: "calm" }; syncSheet(); return; }
    if (a === "heart") {
      var sph = supportStore(); if (!sph) return;
      var day = todayJdn(); if (day === null) return;
      sph.react = sph.react || {};
      var hk = String(day);
      if (sph.react[hk]) { delete sph.react[hk]; }
      else { sph.react[hk] = Date.now(); toast("ثبت شد — از خودت مراقبت کن"); }
      hostSave();
      render();
      return;
    }
    if (a === "back") { M.open = { mode: "list", section: t.getAttribute("data-section") }; syncSheet(); return; }
    if (a === "why") { M.open = { mode: "why" }; syncSheet(); return; }
    if (a === "crisis") { showSafetyCard(false); return; } /* [۲٫۲] لینک پایین دفترچه، بدون تشخیص خودکار */
    if (a === "close") { closeSheet(); return; }
    if (a === "audio") { speak(t.getAttribute("data-text") || ""); renderSheetBody(); return; }
    if (a === "phq") {
      var h0 = host();
      if (h0) { var S0 = h0._state; if (S0) S0.tab = "charts"; if (h0.refresh) { try { h0.refresh(); } catch (e1) {} } }
      if (ensureSheet()) ensureSheet().classList.remove("open");
      M.open = null;
      return;
    }
    if (a === "flags") {
      var S = getS(); if (S) S.flagsOpen = true;
      var h = host(); if (h && h.refresh) { try { h.refresh(); } catch (e2) {} }
      if (ensureSheet()) ensureSheet().classList.remove("open");
      M.open = null;
      return;
    }
    if (a === "guide") {
      var h2 = host();
      if (h2 && h2.openGuide) { h2.openGuide(t.getAttribute("data-v")); if (ensureSheet()) ensureSheet().classList.remove("open"); M.open = null; }
      return;
    }
    if (a === "jprompt") {
      draftInit();
      var pv = t.getAttribute("data-v");
      M.draft.promptId = (M.draft.promptId === pv) ? null : pv;
      renderSheetBody(); return;
    }
    if (a === "jsave") {
      draftInit();
      var jt = (M.draft.text || "").trim();
      if (!jt) { toast("چیزی برای ذخیره نوشته نشده"); return; }
      /* [۲٫۲] بررسی ایمنی دو سطحی: ۱ کارت ایمنی، ۲ کارت نرم، ۰ بدون هشدار */
      var tier = riskTier(jt);
      var sp = supportStore(); if (!sp) return;
      var jk = M.draft.key || ("j" + Date.now().toString(36));
      sp.journal[jk] = { text: jt, ts: Date.now(), promptId: M.draft.promptId || null };
      hostSave();
      M.draft = { key: null, text: "", promptId: null };
      M.open = { mode: "journal" };
      /* [۲٫۱] جملهٔ به رسمیت‌شناختن (چرخشی، بدون تکرار پشت‌سرهم) */
      if (SUP.ACKS && SUP.ACKS.length) {
        M.ackN = ((M.ackN || 0) + 1);
        M.ack = SUP.ACKS[(M.ackN - 1) % SUP.ACKS.length];
      }
      syncSheet();
      if (tier === 1) { showSafetyCard(true); }
      else if (tier === 2) { showSoftCard(); }
      else { toast("یادداشت ذخیره شد"); }
      return;
    }
    if (a === "jnew") { M.draft = { key: null, text: "", promptId: null }; M.ack = null; renderSheetBody(); return; }
    if (a === "jedit") {
      var sp2 = supportStore(); if (!sp2) return;
      var rec = sp2.journal[t.getAttribute("data-k")];
      if (rec) {
        M.draft = { key: t.getAttribute("data-k"), text: rec.text || "", promptId: rec.promptId || null };
        M.ack = null;
        renderSheetBody();
        var s2 = ensureSheet();
        if (s2) { var ta2 = s2.querySelector("textarea"); if (ta2 && ta2.focus) ta2.focus(); }
      }
      return;
    }
    if (a === "jdel") {
      var sp3 = supportStore(); if (!sp3) return;
      var kk = t.getAttribute("data-k");
      delete sp3.journal[kk];
      hostSave();
      if (M.draft && M.draft.key === kk) M.draft = { key: null, text: "", promptId: null };
      renderSheetBody(); toast("یادداشت حذف شد");
      return;
    }
  }
  /* [۲٫۲] کارت ایمنی (سطح ۱): عبارتِ پرخطر صریح؛ شماره‌های حمایتی رایگان
     از CRISIS_LINES (فایل محتوا) می‌آیند تا برای کشورهای دیگر قابل تغییر باشند. */
  function showSafetyCard(withToast) {
    var s = ensureSheet(); if (!s) return;
    var body = s.querySelector(".pp-sheet-body");
    var crisis = (SUP.CRISIS_LINES || []).map(function (c) { return c.num + " (" + c.label + ")"; }).join(" یا ");
    var card = global.document.createElement("div");
    card.className = "pp-sup-safety";
    card.setAttribute("role", "alert");
    card.innerHTML = '<h4>' + ic("heart") + "یک جملهٔ مهم</h4>" +
      "<p>چیزی نوشتی که برایم مهم است. <b>این یک تشخیص نیست</b> و نمی‌خواهم بترسانمت؛ فقط نمی‌خواهم تنها بمانی. اگر همین حالا فکر آسیب‌زدن به خودت یا نوزادت را داری، با اورژانس (۱۱۵) تماس بگیر یا از یک فرد قابل‌اعتماد بخواه کنارت بماند.</p>" +
      (crisis ? '<p class="pp-sup-crisis">اگر نیاز داری همین حالا با کسی صحبت کنی: ' + esc(crisis) + ".</p>" : "") +
      '<div class="pp-sup-acts">' +
        '<a class="pp-btn pp-btn-sm pp-alert-btn" href="tel:115">' + ic("phone") + "تماس با ۱۱۵</a>" +
        '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="flags">' + ic("flag") + "علائم خطر</button>" +
        '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="jnew">' + ic("x") + "بستن</button>" +
      "</div>";
    body.insertBefore(card, body.firstChild);
    if (withToast !== false) toast("یادداشت ذخیره شد");
  }
  /* [۲٫۲] کارت نرم (سطح ۲): ترسِ آسیب‌زدن = فکر ناخواسته، نه قصد؛
     دو دکمه: خواندن sad-intrusive و علائم خطر. */
  function showSoftCard() {
    var s = ensureSheet(); if (!s) return;
    var body = s.querySelector(".pp-sheet-body");
    var card = global.document.createElement("div");
    card.className = "pp-sup-safety pp-sup-soft";
    card.setAttribute("role", "alert");
    card.innerHTML = '<h4>' + ic("cloud") + "یک جملهٔ مهم</h4>" +
      "<p>چیزی نوشتی که برایم مهم است. فکرهای ناخواسته دربارهٔ آسیب به نوزاد در مادرها شایع‌اند و به‌معنی قصد آسیب نیستند. اگر این فکرها تکرار می‌شوند یا می‌ترسی نتوانی خودت را کنترل کنی، با پزشک یا متخصص سلامت روان صحبت کن؛ اگر همین حالا احساس خطر می‌کنی، با اورژانس (۱۱۵) تماس بگیر.</p>" +
      '<div class="pp-sup-acts">' +
        '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="topic" data-section="sad" data-topic="intrusive">' + ic("book") + "بیشتر دربارهٔ فکرهای ناخواسته بخوانم</button>" +
        '<button type="button" class="pp-btn pp-btn-ghost pp-btn-sm" data-ss="flags">' + ic("flag") + "علائم خطر</button>" +
      "</div>";
    body.insertBefore(card, body.firstChild);
    toast("یادداشت ذخیره شد");
  }
  function onInput(e) {
    var t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-ss-in") === "journal") { draftInit(); M.draft.text = t.value; }
  }
  function onKey(e) {
    if (e.key !== "Escape") return;
    if (M.open) { stopCalm(); var s = ensureSheet(); if (s) s.classList.remove("open"); M.open = null; }
    if (canSpeak()) { try { global.speechSynthesis.cancel(); } catch (err) {} M.speaking = false; }
  }

  /* ---------- init ---------- */
  function init() {
    if (M.mounted) return;
    M.mounted = true;
    if (global.document) {
      global.document.addEventListener("keydown", onKey);
      global.document.addEventListener("visibilitychange", function () {
        if (!global.document.hidden && todayDay() !== null) render();
      });
      autoMount();
    }
  }

  var api = {
    version: "2.5.0",
    refresh: function () { bindRoot(); tryMount(); if (M.node) render(); },
    mount: function (container) {
      if (!container) return;
      M.node = container;
      bindRoot();
      render();
    },
    _t: {
      supportCards: function () { return SUP.CARDS; },
      supportStates: supportStates,
      supportItem: supportItem,
      supportItemsFor: supportItemsFor,
      supportTopics: supportTopics,
      supportPhaseMatch: supportPhaseMatch,
      supportPick: supportPick,
      supportDailyPick: supportDailyPick,
      supportRecordSeen: supportRecordSeen,
      journalEntries: journalEntries,
      personalLine: personalLine,
      safetyCheck: safetyCheck,
      riskTier: riskTier,
      showSafetyCard: showSafetyCard,
      showSoftCard: showSoftCard,
      timeLine: timeLine,
      supportSadDays: supportSadDays,
      canSpeak: canSpeak,
      _content: SUP
    },
    _state: M
  };
  global.SamanSupport = api;

  init();
})(window);
