/* ============================================================================
   آداپتور رسمی «دفترچهٔ علائم من» — تنها نقطهٔ اتصال ماژول به دادهٔ سَمن
   ----------------------------------------------------------------------------
   طبق INTEGRATION.md §۳ و §۴:
     • ماژول هرگز چرخه را خودش محاسبه نمی‌کند؛ هفت تابع زیر را از سَمن می‌گیرد.
     • cyDb با let و JAL و CY با const تعریف شده‌اند (دامنهٔ واژگانی سراسری) — با نام
       ساده و از یک اسکریپت کلاسیکِ پس از app.js قابل دسترس‌اند؛ window.cyDb وجود ندارد.
     • مدل واقعی سَمن (cxModel) فیلد starts (آرایهٔ jdn شروع‌ها) ندارد؛ گزارش‌های
       دفترچه آن را می‌خواهند — همین‌جا با M.st ساخته و اضافه می‌شود (scoring.js دست‌نخورده).
     • دفترچه فقط فیلدهای خودش را می‌نویسد (flow/symptoms/mood/energy/sleep/note/
       sev/pain) و هرگز start/plen را تغییر نمی‌دهد؛ cyNormalizeDay هم آن‌ها را
       می‌شناسد، پس رکوردِ فقط-دفترچه‌ای پاک نمی‌شود.
   ============================================================================ */
(function () {
  "use strict";

  if (!window.SamanSymptomJournal) return; /* ماژول لود نشده؟ بی‌صدا خارج شو */

  /* مدل چرخهٔ سَمن + آرایهٔ starts برای گزارش‌های دفترچه */
  function journalModel() {
    const M = cxModel();
    M.starts = (M.st || []).map(function (s) { return s.jdn; });
    return M;
  }

  /* پس از هر ذخیره/حذف در دفترچه، تقویم و آمار سَمن همان لحظه به‌روز شوند —
     بدون از دست رفتن وضعیت دفترچه (sjRerender در app.js: جابه‌جایی، نه بازسازی) */
  function hostChanged() {
    try {
      if (typeof state !== "undefined" && state.view === "cycle" && typeof sjRerender === "function") sjRerender();
    } catch (e) { /* به‌روزرسانی فوری بحرانی نیست */ }
  }

  const journalAdapter = {
    today: function () { return cyTodayJdn(); },
    load: function () { return { days: cyDb.days, settings: cyDb.settings }; },
    saveDay: function (key, rec) {
      cyDb.days[key] = rec;
      cyNormalizeDay(key); /* همان قواعد مشترک تقویم: رکورد خالی حذف، pain/sev یتیم پاک */
      cySaveDb();
      hostChanged();
    },
    deleteDay: function (key) {
      delete cyDb.days[key];
      cySaveDb();
      hostChanged();
    },
    starts: function () { return cyStarts(); },
    model: journalModel,
    phaseOf: function (jdn) { return cxPhaseOf(journalModel(), jdn, cyTodayJdn()); }
  };

  /* نصب یک‌بار برای همیشه — گرهٔ پایدار بیرون #app (در index.html، کنار #app) */
  const mount = document.getElementById("symJournal");
  if (!mount) return;
  window.SamanSymptomJournal.init({
    mount: mount,
    adapter: journalAdapter,
    jal: JAL,                 /* تقویم جلالی خودِ سَمن — بدون منطق موازی */
    demo: false,              /* در پروژهٔ اصلی: بدون دادهٔ نمایشی و بدون نوار زرد */
    formOpen: false,
    startOpen: false,         /* با جلد بسته شروع می‌شود؛ کاربر خودش باز می‌کند */
    initialDate: (typeof CY !== "undefined" && CY.sel) ? JAL.keyToJdn(CY.sel) : null
  });
})();
