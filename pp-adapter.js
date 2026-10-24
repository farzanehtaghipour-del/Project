/* ============================================================================
   آداپتور رسمی «همراه مادر» — تنها نقطهٔ اتصال ماژول مستقل به سَمن
   ----------------------------------------------------------------------------
   بر پایهٔ INTEGRATION.md §۲ (راه سریع‌ترِ توصیه‌شده):
     • دادهٔ ماژول در کلید خودش (samn_pp_companion_v1) می‌ماند — profile،
       چک‌این‌ها، نوزاد و وزن‌ها هیچ‌کدام به ppDb قدیم نمی‌روند؛ پس پاک‌سازیِ
       فیلدبه‌فیلدِ نسخهٔ قدیم (ppSanitizeDb) در کار نیست و کلیدهای تازهٔ
       baby و weights به‌طور طبیعی سالم می‌مانند.
     • تقویم جلالیِ خودِ سَمن پاس داده می‌شود — بدون منطق موازی.
     • مهاجرت یک‌باره از نسخهٔ قدیم (samn_pp_demo_v1): تاریخ تولد، نوع زایمان
       و روش تغذیه + فیلدهای مشترک چک‌این (mood/energy/sleep/note).
     • ماژول در گرهٔ پایدار #ppHost (بیرون #app) نصب می‌شود؛ app.js آن را با
       ppAttach()/ppDetach() در نمای «همراه مادر» جابه‌جا می‌کند.
   ============================================================================ */
(function () {
  "use strict";

  if (!window.SamanPostpartum) return; /* ماژول لود نشده؟ بی‌صدا خارج شو */

  var COMPANION_KEY = "samn_pp_companion_v1";
  var OLD_KEY = "samn_pp_demo_v1";

  function readJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var d = JSON.parse(raw);
      return (d && typeof d === "object" && !Array.isArray(d)) ? d : null;
    } catch (e) { return null; }
  }

  /* مهاجرت یک‌باره: دادهٔ نسخهٔ قدیم → دادهٔ ماژول تازه (فیلدهای مشترک) */
  function migrate(old, db) {
    if (!old || db.profile) return false;
    var changed = false;
    if (old.profile && old.profile.deliveryKey) {
      db.profile = {
        deliveryKey: old.profile.deliveryKey,
        type: old.profile.birthType === "csection" ? "csection" : (old.profile.type === "csection" ? "csection" : "vaginal"),
        feeding: (old.profile.feeding === "formula" || old.profile.feeding === "mixed") ? old.profile.feeding : "breast"
      };
      changed = true;
    }
    var oldCi = old.checkins || {};
    Object.keys(oldCi).forEach(function (k) {
      var rec = oldCi[k];
      if (!rec || typeof rec !== "object" || !k || !/^\d{4}-\d{2}-\d{2}$/.test(k)) return;
      if (db.checkins[k]) return; /* روزِ موجود ماژول دست نمی‌خورد */
      var keep = {};
      ["mood", "energy", "sleep", "note"].forEach(function (f) {
        if (rec[f] != null) keep[f] = rec[f];
      });
      if (Object.keys(keep).length) {
        db.checkins[k] = Object.assign({ dateKey: k, migrated: true }, keep);
        changed = true;
      }
    });
    return changed;
  }

  var companionAdapter = {
    today: function () { return cyTodayJdn(); },
    load: function () {
      var db = readJSON(COMPANION_KEY);
      if (!db) {
        db = {
          v: 1, profile: null, checkins: {}, tasks: {}, needs: [],
          screen: {}, seen: {}, baby: null, weights: {}, night: false
        };
      }
      db.profile = db.profile || null; db.checkins = db.checkins || {}; db.tasks = db.tasks || {};
      db.needs = db.needs || []; db.screen = db.screen || {}; db.seen = db.seen || {};
      db.baby = db.baby || null; db.weights = db.weights || {}; db.night = !!db.night;
      if (!db.profile) {
        var old = readJSON(OLD_KEY);
        if (old && migrate(old, db)) this.save(db);
      }
      return db;
    },
    save: function (db) {
      try { localStorage.setItem(COMPANION_KEY, JSON.stringify(db)); } catch (e) { /* ذخیره بحرانی نیست */ }
    },
    clear: function () {
      try { localStorage.removeItem(COMPANION_KEY); } catch (e) { /* بحرانی نیست */ }
    }
  };

  /* نصب یک‌بار برای همیشه — گرهٔ پایدار بیرون #app (در index.html، کنار #app) */
  var mount = document.getElementById("ppHost");
  if (!mount) return;
  window.SamanPostpartum.init({
    mount: mount,
    adapter: companionAdapter,
    jal: JAL,                 /* تقویم جلالی خودِ سَمن — بدون منطق موازی */
    demo: false               /* در پروژهٔ اصلی: بدون دادهٔ نمایشی و بدون نوار زرد */
  });
})();
