/* ============================================================================
   دفترچه‌های تغذیه و دمنوش‌های سَمن  |  sj-books.js (v6)
   v4: سوپ جوجه، عکس‌های کارفرما و دو عکس کنار هم
   v5: صفحهٔ تمیز — جملهٔ کوتاه «چرا خوبه»، همهٔ توضیحات در بازشدنیِ «توضیحات»، بازشدن از صفحهٔ اول
   v6: جلدهای جدید با عکس‌های کارفرما («Healthy Soup Skin» برای تغذیه و «Herbal Tea Skin»
       برای دمنوش) در قفسهٔ دفترچه‌ها — دو جلد سمت چپ دفترچهٔ علائم، یکی بالاتر و یکی
       پایین‌تر (استایل قفسه و تم سبز جلدها در sj-books.css v6).
   ----------------------------------------------------------------------------
   ماژول مستقل و فقط-افزودنی:
     • دو جلد دفترچه زیر «دفترچهٔ ثبت علائم» — با هر جابه‌جایی/نمایشِ دفترچهٔ علائم
       هم‌قدم می‌شود (MutationObserver؛ هیچ کد موجودی تغییر نمی‌کند).
     • محتوای صفحات از همان دادهٔ موتور توصیه (window.SamanSymptomJournal.RECS)
       می‌آید تا متن‌ها یک منبع واحد داشته باشند؛ «خواص» و «کاربرد» افزودنیِ همین
       ماژول‌اند. کارت‌های توصیهٔ بخش ثبت علائم دست‌نخورده باقی می‌مانند.
     • ورق‌زدن سه‌بعدی RTL — جلو و عقب هر دو با انیمیشن واقعی برگ.
     • صدای کاغذ (v2): چهار فایل WAV از پیش رندرشدهٔ محلی (assets/paper-flip-*.wav،
       ساختهٔ scripts/gen-paper-sound.mjs — سویش + لرزش ورق + کرِینکل + فرود) که با
       گردش تصادفی و گام‌سرعت کمی متفاوت پخش می‌شوند تا هر ورق طبیعی باشد؛ اگر فایل
       در دسترس نبود، سنتز WebAudio (سویش + کرِینکل) جایگزین می‌شود — کاملاً آفلاین.
       صدا فقط هنگام ورق‌زدن است، نه باز/بسته‌شدن؛ با یک دکمه قطع/وصل می‌شود و در
       localStorage می‌ماند. با هر بازشدن، دفترچه از صفحهٔ اول آغاز می‌شود (v5).
   ============================================================================ */
(function (global) {
  "use strict";

  var MUTE_KEY = "samn_sjbooks_mute_v1";
  var FLIP_MS = 640;
  var SND_SRCS = ["assets/paper-flip-1.wav", "assets/paper-flip-2.wav",
                  "assets/paper-flip-3.wav", "assets/paper-flip-4.wav"];
  var FA = "۰۱۲۳۴۵۶۷۸۹";
  function fa(n) { return String(n).replace(/\d/g, function (d) { return FA[+d]; }); }
  function esc(s) { return String(s == null ? "" : s); }

  /* ---------- برچسب‌های شرایط (فقط نمایش) ---------- */
  var LABEL = {
    cramp: "درد قاعدگی یا گرفتگی", headache: "سردرد", bloat: "نفخ", breast: "حساسیت پستان",
    acne: "آکنه", tired: "خستگی", gi: "علائم گوارشی",
    anx: "اضطراب", low: "کلافگی", sad: "غمگینی", sens: "حساسیت خلقی"
  };
  var PHASE_LABEL = { mens: "قاعدگی", foll: "فولیکولی", ovul: "پنجرهٔ باروری", lut: "لوته‌آل" };

  /* ---------- صفحات و محتوای مخصوص دفترچه‌ها (خواص/کاربرد) ---------- */
  var BOOKS = {
    food: {
      key: "food", title: "دفترچهٔ تغذیه", sub: "خوراکی‌های همراه چرخه — از عدسی تا ارده",
      hint: "۱۲ خوراکیِ دوست‌داشتنی", cover: "assets/healthy-soup-skin.jpg",
      pages: [
        { id: "food-iron", img: "img/sjbook/food-iron.jpg", props: ["آهن گیاهی و پروتئین برای جبران روزهای خون‌ریزی", "ویتامین C آب‌لیمو جذب آهن را بهتر می‌کند", "گرم، سبک و سیرکننده"], use: "بهترین همراه روزهای پریود؛ مخصوصاً وقتی خون‌ریزی زیاد است یا احساس ضعف داری." },
        { id: "food-nakhodab", img: "img/sjbook/food-nakhodab.jpg", props: ["آهن، فولات و پروتئین گیاهی برای خون‌سازی", "فیبر فراوان و انرژی پایدار؛ سیرکننده", "گرم و مقوی؛ کلسیم و فسفر برای استخوان‌ها"], use: "برای ناهار یا شام در همهٔ فازها، مخصوصاً روزهای خون‌ریزی و افت انرژی؛ با آب‌لیمو بخور تا جذب آهن بهتر شود. اگر نفخ داری، فعلاً کنارش بگذار." },
        { id: "food-chickensoup", img: "img/sjbook/food-chickensoup.jpg", props: ["پروتئین کامل، ویتامین B12 و آهن برای خون‌سازی و بازسازی انرژی", "کم‌آب و غلیظ؛ در هر قاشق مواد مغذی و سیریِ بیشتر", "گرم و زودهضم؛ مناسب روزهای خون‌ریزی و خستگی"], use: "با ران مرغِ پخته و آبِ غلیظ سوپ، برای ناهار یا شام روزهای قاعدگی و روزهای کم‌انرژی؛ ساده بپز تا سبک بماند." },
        { id: "food-qavout", img: "img/sjbook/food-qavout.jpg", props: ["خوراکی سنتی و پرقوّت", "ترکیب تخم خرفه و کنجد برای حمایت از کم‌خونی", "انرژی آرام برای میانهٔ روز"], use: "میان‌وعده‌ای برای همهٔ فازهای چرخه؛ مخصوصاً در روزهای خون‌ریزی زیاد." },
        { id: "food-syrups", props: ["قند طبیعی و انرژی سریع", "منبع خوب آهن؛ شیرهٔ انگور کنار مکمل آهن مفید است", "جایگزین بهتر شیرینی‌های معمولی"], use: "با نان گرم در صبحانه؛ برای صبح‌های کم‌انرژی و روزهای خون‌ریزی زیاد." },
        { id: "food-egg", img: "img/sjbook/food-egg.jpg", props: ["پروتئین کامل با همهٔ اسیدهای آمینهٔ ضروری", "آهن، B12، ویتامین D و کولین برای رفع خستگی", "سیرکننده با انرژی آرام و ماندگار"], use: "صبحانه یا میان‌وعده؛ آب‌پز یا نیم‌رو بهترین انتخاب است. در روزهای خسته یک تا دو تخم‌مرغ با نان کامل و سبزی، وعده‌ای سریع و مقوی می‌سازد." },
        { id: "food-ardeh-date", imgs: ["img/sjbook/food-ardeh-date.jpg", "img/sjbook/food-date.jpg"], props: ["ترکیب انرژی‌زا و آهن‌دار", "شیرینی طبیعی بدون قند افزوده", "مفید برای کم‌خونی"], use: "صبحانه یا میان‌وعدهٔ روزهای خسته و کم‌انرژی؛ در همهٔ فازها جای دارد." },
        { id: "food-halva", img: "img/sjbook/food-halva.jpg", props: ["انرژی بالا در اندازهٔ کوچک", "گرم و مناسب فصول سرد", "حال‌وهوای نوستالژیک و دلنشین"], use: "یک تکهٔ کوچک به‌عنوان دسر یا میان‌وعده؛ به‌خصوص در روزهای سرد سال." },
        { id: "food-nuts", imgs: ["img/sjbook/food-nuts.jpg", "img/sjbook/food-nuts-2.jpg"], props: ["منیزیم و چربی‌های مفید", "پروتئین گیاهی برای سیری", "کمک به آرام‌ترگذراندن روزهای پیش از پریود"], use: "یک مشت کوچک پیش یا حین پریود؛ هنگام گرسنگی ناگهانی یا افت انرژی." },
        { id: "food-omega", img: "img/sjbook/food-omega.jpg", props: ["کاهش التهاب و کمک به کاهش شدت درد قاعدگی", "چربی مفید برای قلب و خلق‌وخو", "منابع: ماهی چرب، گردو، دانهٔ کتان"], use: "دو تا سه بار در هفته در وعده‌ها؛ در روزهای درد و حساسیت پستان کمک‌کننده است." },
        { id: "food-mg", img: "img/sjbook/food-mg.jpg", props: ["کمک به کاهش گرفتگی و درد", "آرام‌کننده برای خواب بهتر", "منابع: سبزیجات برگ‌سبز، دانهٔ کدو، کنجد، شکلات تلخ"], use: "در روزهای درد و بی‌خوابی؛ شکلات تلخ را در حد یک تکهٔ کوچک نگه دار." },
        { id: "food-b6", img: "img/sjbook/food-b6.jpg", props: ["کاهش علائم روانی پیش از قاعدگی", "B6 از موز، حبوبات، مرغ و سیب‌زمینی شیرین", "کلسیم و روی از کنجد، بادام و سبزیجات برگ‌سبز"], use: "در فاز لوته‌آل — روزهای پیش از پریود — برای حال‌وهوای آرام‌تر." }
      ]
    },
    tea: {
      key: "tea", title: "دفترچهٔ دمنوش‌ها", sub: "دمنوش‌های گرم و آرام‌بخش — فنجانی از آرامش",
      hint: "۶ دمنوشِ گرم", cover: "assets/herbal-tea-skin.jpg",
      pages: [
        { id: "ginger-tea", props: ["ضدالتهاب و ضدتهوع طبیعی", "گرم‌کنندهٔ بدن و بهبود گردش خون", "بیشتر از ۲ گرم در روز لازم نیست"], use: "در روزهای درد و نفخ؛ گرم و جرعه‌جرعه با کمی عسل." },
        { id: "tea-cinnamon", props: ["گرم و آرام‌کنندهٔ گرفتگی", "کمک به تعادل قند خون", "عطر نوستالژیک روزهای سرد"], use: "یک تا دو فنجان در روزهای گرفتگی؛ مصرف روزانهٔ مداوم را با پزشک هماهنگ کن." },
        { id: "tea-zenian", props: ["ضدنفخ و ضداسپاسم", "گرم با طبیعت سنتی", "به شکل دمنوش یا کپسول"], use: "بعد از غذاهای نفاخ و در روزهای گرفتگی؛ بیشتر از دوز روی بسته نرو." },
        { id: "teacalm-anx", props: ["آرام‌بخش و ضداضطراب", "کمک به خواب راحت", "گزینه‌های سنتی همراه: بهارنارنج و گل‌گاوزبان"], use: "عصرها و پیش از خواب؛ در روزهای مضطرب و دل‌شوره." },
        { id: "tea-badrang", props: ["کاهش استرس و تنش", "بهبود خلق‌وخو", "دم‌کردهٔ سبک با عطر لیمویی"], use: "هنگام استرس و تنش؛ عصر و پیش از خواب بهترین زمانش است." },
        { id: "tea-bloat", props: ["ضدنفخ و کمک به گوارش", "خنک و ملایم", "رازیانه در طب سنتی برای سنگینی شکم"], use: "بعد از غذا و گرم بنوش؛ با خوردن آرام و خوب جویدن همراهی کن." }
      ]
    }
  };

  /* ---------- آیکون‌های کوچک ---------- */
  var IC = {
    chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14.5 6.5-5.5 5.5 5.5 5.5"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9.5 6.5 5.5 5.5-5.5 5.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18 6.8a7.6 7.6 0 0 1 0 10.4"/></svg>',
    volOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="m16 9.8 4.4 4.4M20.4 9.8 16 14.2"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4.4h9.4L19 8v11.6H5z"/><path d="M14.4 4.4V8H19"/><path d="M8.4 12h7.2M8.4 15.4h5"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19c8 1 14-4.5 14-14-8-1-14 4.5-14 14z"/><path d="M5 19c3-4.5 6.5-7.5 11-9.5"/></svg>',
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.6s6 6.2 6 10.2a6 6 0 0 1-12 0c0-4 6-10.2 6-10.2z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/></svg>',
    chevDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6.5 9.8 5.5 5.4 5.5-5.4"/></svg>'
  };

  /* ---------- وضعیت ---------- */
  var S = {
    mount: null, overlay: null, built: false,
    open: null,          /* "food" | "tea" | null */
    page: 0, turning: false,
    muted: false, ac: null,
    snd: { pool: [], idx: 0 },
    lastFocus: null
  };

  function store(k) { try { return global.localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { global.localStorage.setItem(k, v); } catch (e) {} }
  function recOf(id) {
    var J = global.SamanSymptomJournal;
    var recs = J && J.RECS;
    if (!recs) return null;
    for (var i = 0; i < recs.length; i++) if (recs[i].id === id) return recs[i];
    return null;
  }
  function bookOf(key) { return BOOKS[key] || null; }
  function listify(v) { return v == null ? [] : (typeof v === "string" ? [v] : v); }

  /* ==========================================================================
     صدای ورق‌خوردن کاغذ — v2: WAV رندرشدهٔ محلی + پشتیبان سنتز WebAudio
     فقط هنگام ورق‌زدن صدا می‌شود؛ باز/بسته‌شدن دفترچه بی‌صداست.
     ========================================================================== */
  function buildSounds() {
    var pool = [], i, k, a;
    for (i = 0; i < SND_SRCS.length; i++) {
      for (k = 0; k < 2; k++) {           /* دو گره از هر نسخه برای ورق‌های پشت‌سرهم */
        try {
          a = new global.Audio(SND_SRCS[i]);
          a.preload = "auto";
          a.addEventListener("error", function () { this._bad = true; });
          pool.push(a);
        } catch (e) { /* صدا هرگز نباید مسیر را بشکند */ }
      }
    }
    S.snd.pool = pool;
  }
  function playWav() {
    var p = S.snd.pool, n, tries, pr;
    if (!p.length) return false;
    for (tries = 0; tries < p.length; tries++) {
      n = p[S.snd.idx % p.length];
      S.snd.idx++;
      if (n._bad) continue;
      try {
        n.pause();
        try { n.currentTime = 0; } catch (e) {}
        n.playbackRate = 0.9 + Math.random() * 0.2;      /* هر ورق کمی متفاوت */
        n.volume = 0.72 + Math.random() * 0.16;          /* کاغذ ملایم است */
        pr = n.play();
        if (pr && pr.catch) pr.catch(function () { synthFlip(); });
        return true;
      } catch (e) { /* گرهٔ بعدی */ }
    }
    return false;
  }
  function playFlip() {
    if (S.muted) return;
    if (playWav()) return;
    synthFlip();
  }
  function synthFlip() {
    if (S.muted) return;
    try {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return;
      if (!S.ac) S.ac = new AC();
      var ac = S.ac;
      if (ac.state === "suspended" && ac.resume) ac.resume();
      var t0 = ac.currentTime, dur = 0.42 + Math.random() * 0.1, sr = ac.sampleRate;
      /* سویش: نویز با پوش قوسی کج + دو لرزش دامنه */
      var buf = ac.createBuffer(1, Math.floor(sr * dur), sr), ch = buf.getChannelData(0), i;
      var fA = 26 + Math.random() * 18, phA = Math.random() * 6.28, dA = 0.4;
      var fB = 6 + Math.random() * 5, phB = Math.random() * 6.28, dB = 0.25;
      var pk = 0.35 + Math.random() * 0.15;
      for (i = 0; i < ch.length; i++) {
        var t = i / ch.length;
        var env = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.85)), 1.1);
        var fl = 1 - dA * (0.5 + 0.5 * Math.sin(2 * Math.PI * fA * t * dur + phA))
                     - dB * (0.5 + 0.5 * Math.sin(2 * Math.PI * fB * t * dur + phB));
        ch[i] = (Math.random() * 2 - 1) * env * Math.max(0.15, fl);
      }
      var src = ac.createBufferSource(); src.buffer = buf;
      var bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 0.9;
      bp.frequency.setValueAtTime(650, t0);
      bp.frequency.exponentialRampToValueAtTime(2600, t0 + dur * pk);
      bp.frequency.exponentialRampToValueAtTime(950, t0 + dur);
      var g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.24, t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(bp); bp.connect(g); g.connect(ac.destination);
      src.start(t0); src.stop(t0 + dur + 0.02);
      /* کرِینکل: دانه‌های ریز پُربسامد — برق‌برق تارهای کاغذ */
      var nG = 26 + Math.floor(Math.random() * 14);
      for (var gi = 0; gi < nG; gi++) {
        var u = Math.pow(Math.random(), 0.8);
        var st = t0 + u * dur, len = 0.002 + Math.random() * 0.005;
        var gb = ac.createBuffer(1, Math.max(8, Math.floor(sr * len)), sr), gc = gb.getChannelData(0);
        for (i = 0; i < gc.length; i++) {
          var p = i / gc.length;
          gc[i] = (Math.random() * 2 - 1) * (p < 0.25 ? p / 0.25 : 1 - (p - 0.25) / 0.75);
        }
        var gs = ac.createBufferSource(); gs.buffer = gb;
        var hp = ac.createBiquadFilter(); hp.type = "highpass";
        hp.frequency.value = 1600 + Math.random() * 5200;
        var gg = ac.createGain();
        gg.gain.value = 0.04 + Math.random() * 0.08;
        gs.connect(hp); hp.connect(gg); gg.connect(ac.destination);
        gs.start(st);
      }
    } catch (e) { /* صدا هرگز نباید مسیر را بشکند */ }
  }

  /* ==========================================================================
     ساخت HTML یک صفحه
     ========================================================================== */
  function condChips(r) {
    var out = [], w = r.when || {}, i;
    if (w.always) out.push("همیشه پیشنهاد می‌شود");
    listify(w.phase).forEach(function (p) { out.push("فاز " + (PHASE_LABEL[p] || p)); });
    listify(w.sym).forEach(function (s) { out.push(LABEL[s] || s); });
    listify(w.flow).forEach(function (f) { if (f === "heavy") out.push("خون‌ریزی زیاد"); });
    listify(w.energy).forEach(function (e) { if (e === "low") out.push("انرژی کم"); });
    return out;
  }
  function pageHtml(book, idx) {
    var it = book.pages[idx], r = recOf(it.id);
    var title = r ? r.title : it.id, kind = r ? r.kind : "";
    var acts = r ? r.acts.slice(0, 3) : [], why = r ? r.why : "";
    var notSyms = r ? listify(r.when && r.when.notSym) : [];
    var pic = it.img || ("img/sjbook/" + it.id + ".png");
    /* v4: دو عکسِ کنار هم (imgs) یا تک‌عکس (img یا تصویرسازی) */
    var fig = '<figure class="sjb-fig' + (it.imgs && it.imgs.length > 1 ? " sjb-fig2" : "") + '"><span class="sjb-tape"></span>' +
      (it.imgs && it.imgs.length > 1
        ? it.imgs.map(function (p, i) { return '<img src="' + p + '" alt="عکس ' + esc(title) + ' — ' + fa(i + 1) + '" decoding="async">'; }).join("")
        : '<img src="' + pic + '" alt="عکس ' + esc(title) + '" decoding="async">') +
      "</figure>";   /* عکس کارفرما یا تصویرسازی */
    var chips = '<span class="sjb-chip">' + esc(kind) + "</span>";
    if (r && r.opt) chips += '<span class="sjb-chip gold">پیشنهاد اختیاری</span>';
    if (r && r.iron) chips += '<span class="sjb-chip rose">آهن‌دار</span>';
    var conds = r ? condChips(r) : [];
    var condHtml = conds.length
      ? conds.map(function (c) { return '<span class="sjb-cond">' + esc(c) + "</span>"; }).join("")
      : '<span class="sjb-cond">همهٔ روزهای چرخه</span>';
    /* v5: صفحهٔ تمیز — جملهٔ کوتاه «چرا خوبه» بالای صفحه و همهٔ توضیحات در یک بازشدنیِ «توضیحات» */
    var details = '<details class="sjb-more"><summary>' + IC.info + "توضیحات" +
      '<span class="sjb-chevwrap">' + IC.chevDown + "</span></summary>" +
      '<div class="sjb-more-body">' +
      '<div class="sjb-sec"><b>' + IC.spark + "خواص</b>" +
        '<ul class="sjb-props">' + it.props.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="sjb-sec"><b>' + IC.drop + "کاربرد</b><p class=\"sjb-use\">" + esc(it.use) + "</p></div>" +
      '<div class="sjb-sec"><b>' + IC.book + "چه زمانی مناسب است؟</b>" +
        '<div class="sjb-conds">' + condHtml + "</div>" +
        (notSyms.length ? '<p class="sjb-caution">اگر «' + notSyms.map(function (s) { return LABEL[s] || s; }).join("» یا «") +
          "» ثبت کرده باشی، این پیشنهاد در توصیه‌های همان روز نمایش داده نمی‌شود.</p>" : "") +
      "</div>" +
      (acts.length ? '<div class="sjb-sec"><b>' + IC.leaf + "راه اجرا</b>" +
        '<ul class="sjb-acts">' + acts.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul></div>" : "") +
      "</div></details>";
    return '<div class="sjb-page">' +
      fig +
      '<div class="sjb-chips">' + chips + "</div>" +
      "<h3 class=\"sjb-title\">" + esc(title) + "</h3>" +
      (why ? '<p class="sjb-lead">' + IC.spark + esc(why) + "</p>" : "") +
      details +
      '<p class="sjb-pageno">صفحهٔ ' + fa(idx + 1) + " از " + fa(book.pages.length) + " · " + esc(book.title) + "</p>" +
      "</div>";
  }

  /* ==========================================================================
     ورق‌زدن — برگ سه‌بعدی با عطف راست (کتاب فارسی) + صدای کاغذ
     ========================================================================== */
  function stageEl() { return S.overlay.querySelector(".sjb-stage"); }
  function renderUnder(book, idx) { stageEl().querySelector(".sjb-under").innerHTML = pageHtml(book, idx); }
  function renderDots(book) {
    var box = S.overlay.querySelector(".sjb-dots"), html = "", i;
    for (i = 0; i < book.pages.length; i++) {
      html += '<button type="button" class="sjb-dot' + (i === S.page ? " on" : "") + '" data-sjb-dot="' + i +
        '" aria-label="صفحهٔ ' + fa(i + 1) + '"></button>';
    }
    box.innerHTML = html;
  }
  function renderHead(book) {
    S.overlay.querySelector(".sjb-head-title").innerHTML =
      "<b>" + esc(book.title) + "</b><span>صفحهٔ " + fa(S.page + 1) + " از " + fa(book.pages.length) + "</span>";
  }
  function renderNav(book) {
    S.overlay.querySelector('[data-sjb="prev"]').disabled = S.page === 0;
    S.overlay.querySelector('[data-sjb="next"]').disabled = S.page === book.pages.length - 1;
  }
  function refresh(book) {
    renderUnder(book, S.page); renderDots(book); renderHead(book); renderNav(book);
  }
  function flip(book, target, dir) {
    if (S.turning || target === S.page || target < 0 || target >= book.pages.length) return;
    var stage = stageEl();
    var srcHtml = stage.querySelector(".sjb-under").innerHTML;
    var dstHtml = pageHtml(book, target);
    var leaf = document.createElement("div");
    leaf.className = "sjb-leaf is-set";
    /* v2: برگِ برگشتی از حالتِ واقعیِ جمع‌شده روی عطف شروع می‌شود (انیمیشنِ برگشت) */
    if (dir < 0) leaf.style.transform = "rotateY(166deg)";
    /* رفت: برگِ فعلی به سمت عطف راست جمع می‌شود — آمد: برگ مقصد از همان‌جا باز می‌گردد */
    leaf.innerHTML = '<div class="sjb-face"><div class="sjb-under">' + (dir > 0 ? srcHtml : dstHtml) + "</div></div>" +
      '<div class="sjb-face sjb-face-back" aria-hidden="true"></div>';
    stage.appendChild(leaf);
    renderUnder(book, target);
    playFlip();                       /* صدا فقط همین‌جا — هنگام ورق‌زدن */
    S.turning = true;
    stage.classList.add("turning");
    void leaf.offsetWidth;            /* رندر اولیهٔ برگ بدون ترنزیشن */
    requestAnimationFrame(function () {
      leaf.classList.remove("is-set");
      leaf.style.transform = "";
      leaf.classList.add(dir > 0 ? "is-turn-fwd" : "is-turn-back");
    });
    var settled = false;
    function done() {
      if (settled) return; settled = true;
      if (dir < 0) renderUnder(book, target);
      if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
      stage.classList.remove("turning");
      S.turning = false;
    }
    leaf.addEventListener("transitionend", function (e) {
      if (e.target === leaf) done();
    });
    setTimeout(done, FLIP_MS + 90);
    S.page = target;
    renderDots(book); renderHead(book); renderNav(book);
  }
  function flipBy(book, delta) { flip(book, S.page + delta, delta); }

  /* ==========================================================================
     باز و بستن — بدون صدا
     ========================================================================== */
  function open(key) {
    var book = bookOf(key);
    if (!book || !S.overlay) return;
    S.lastFocus = document.activeElement;
    S.open = key;
    S.page = 0;   /* v5: هر بازشدن از صفحهٔ اول آغاز می‌شود */
    refresh(book);
    S.overlay.hidden = false;
    try { document.documentElement.style.overflow = "hidden"; } catch (e) {}
    var c = S.overlay.querySelector(".sjb-close");
    if (c) c.focus();
  }
  function close() {
    if (!S.overlay || !S.open) return;
    S.overlay.hidden = true;
    S.open = null;
    try { document.documentElement.style.overflow = ""; } catch (e) {}
    if (S.lastFocus && S.lastFocus.focus) { try { S.lastFocus.focus(); } catch (e) {} }
  }

  /* ==========================================================================
     رویدادها
     ========================================================================== */
  function bindOverlay() {
    S.overlay.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest("[data-sjb='close']")) { close(); return; }
      if (t.closest("[data-sjb='mute']")) { toggleMute(); return; }
      if (t.closest("[data-sjb='prev']")) { flipBy(bookOf(S.open), -1); return; }
      if (t.closest("[data-sjb='next']")) { flipBy(bookOf(S.open), 1); return; }
      var dot = t.closest("[data-sjb-dot]");
      if (dot) { var i = +dot.getAttribute("data-sjb-dot"); flip(bookOf(S.open), i, i > S.page ? 1 : -1); return; }
      if (t.classList.contains("sjb-overlay")) close();   /* کلیک روی پس‌زمینه */
    });
    document.addEventListener("keydown", function (e) {
      if (!S.open) return;
      var book = bookOf(S.open);
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); flipBy(book, 1); }   /* ورقِ رو به جلو */
      else if (e.key === "ArrowLeft") { e.preventDefault(); flipBy(book, -1); }
      else if (e.key === "Tab") {          /* محبوس‌کردن فوکوس داخل دفترچه */
        var f = S.overlay.querySelectorAll("button, [href], summary, [tabindex]:not([tabindex='-1'])");
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    /* کشیدن انگشت — ورق طبیعی: راست‌کشیدن = رو به جلو */
    var tx = 0, ty = 0, on = false;
    stageEl().addEventListener("touchstart", function (e) {
      if (!S.open || S.turning) return;
      on = true; tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    }, { passive: true });
    stageEl().addEventListener("touchend", function (e) {
      if (!on || !S.open) return; on = false;
      var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.2) flipBy(bookOf(S.open), dx > 0 ? 1 : -1);
    }, { passive: true });
  }

  function toggleMute() {
    S.muted = !S.muted;
    storeSet(MUTE_KEY, S.muted ? "1" : "0");
    paintMute();
  }
  function paintMute() {
    var b = S.overlay && S.overlay.querySelector("[data-sjb='mute']");
    if (!b) return;
    b.innerHTML = S.muted ? IC.volOff : IC.vol;
    b.classList.toggle("is-off", S.muted);
    b.setAttribute("aria-pressed", S.muted ? "true" : "false");
    b.setAttribute("aria-label", S.muted ? "وصل‌کردن صدای ورق‌زدن" : "قطع‌کردن صدای ورق‌زدن");
  }

  /* ==========================================================================
     جلدها زیر دفترچهٔ علائم + هم‌قدمی دیداری
     ========================================================================== */
  function renderCovers() {
    var html = '<div class="sjb-covers-head"><b>دفترچه‌های من</b><span>کنار دفترچهٔ علائم — برای ورق زدن و انتخاب آزاد</span></div><div class="sjb-covers-grid">';
    ["food", "tea"].forEach(function (k) {
      var b = BOOKS[k];
      html += '<button type="button" class="sjb-cover" data-sjb-book="' + k + '" aria-label="باز کردن ' + b.title + '">' +
        '<span class="sjb-cover-tape" aria-hidden="true"></span>' +
        '<img class="sjb-cover-img" src="' + b.cover + '" alt="عکس جلد ' + b.title + '">' +
        '<span class="sjb-cover-title">' + IC.book + b.title + "</span>" +
        '<span class="sjb-cover-sub">' + b.hint + " · " + b.sub + "</span>" +
        '<span class="sjb-cover-open">ورق بزن و بخوان</span>' +
        "</button>";
    });
    html += "</div>";
    S.mount.innerHTML = html;
  }
  function buildOverlay() {
    var ov = document.createElement("div");
    ov.className = "sjb-overlay"; ov.hidden = true;
    ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
    ov.innerHTML = '<span class="sjb-mote" style="width:120px;height:120px;top:12%;inset-inline-start:14%"></span>' +
      '<span class="sjb-mote" style="width:70px;height:70px;top:62%;inset-inline-start:8%"></span>' +
      '<span class="sjb-mote" style="width:96px;height:96px;top:24%;inset-inline-end:10%"></span>' +
      '<div class="sjb-book">' +
        '<div class="sjb-head">' +
          '<div class="sjb-head-title"><b></b><span></span></div>' +
          '<button type="button" class="sjb-btn" data-sjb="mute"></button>' +
          '<button type="button" class="sjb-btn sjb-close" data-sjb="close" aria-label="بستن دفترچه">' + IC.close + "</button>" +
        "</div>" +
        '<div class="sjb-stage"><div class="sjb-sheet"><div class="sjb-under"></div></div></div>' +
        '<div class="sjb-nav">' +
          '<button type="button" class="sjb-nav-btn" data-sjb="prev">' + IC.chevR + "قبلی</button>" +
          '<div class="sjb-dots"></div>' +
          '<button type="button" class="sjb-nav-btn" data-sjb="next">بعدی' + IC.chevL + "</button>" +
        "</div>" +
      "</div>";
    document.body.appendChild(ov);
    S.overlay = ov;
    paintMute();
    bindOverlay();
  }

  /* دفترچه‌ها همیشه کنار دفترچهٔ علائم می‌مانند — در هر جای بدن که باشد */
  function syncVis() {
    var j = document.getElementById("symJournal"), m = S.mount;
    if (!j || !m) return;
    /* دفترچه پارک شده یا پنجره‌اش باز است (گره در body) — مونت دست نمی‌خورد */
    if (j.parentNode === document.body) return;
    var hide = j.hidden || !j.parentNode;
    if (m.hidden !== hide) m.hidden = hide;
    if (!hide && j.parentNode && j.nextSibling !== m) j.parentNode.insertBefore(m, j.nextSibling);
  }

  function init(mount) {
    if (!mount) return;
    S.mount = mount;
    S.muted = store(MUTE_KEY) === "1";
    buildSounds();
    renderCovers();
    buildOverlay();
    syncVis();
    var mo = new MutationObserver(syncVis);
    mo.observe(document.body, { attributes: true, attributeFilter: ["hidden", "style", "class"], childList: true, subtree: true });
    S.mount.addEventListener("click", function (e) {
      var c = e.target.closest("[data-sjb-book]");
      if (c) open(c.getAttribute("data-sjb-book"));
    });
  }
  function boot() {
    var m = document.getElementById("sjBooks");
    if (!m) {
      var j = document.getElementById("symJournal");
      if (!j) return;
      m = document.createElement("div");
      m.id = "sjBooks"; m.hidden = true;
      j.parentNode.insertBefore(m, j.nextSibling);
    }
    init(m);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  var api = {
    open: open, close: close, toggleMute: toggleMute,
    isOpen: function () { return !!S.open; },
    /* برای آزمون و اشکال‌زدایی */
    _state: S, _books: BOOKS
  };
  global.SamanSJBooks = api;
})(window);
