/* ============================================================
   fslib.js — «گزارش سلامت جنسی زنان» | صفحهٔ نتایج هوشمند
   تبدیل نتایج دو ابزار استاندارد به گزارش قابل‌فهم:
     ۱) FSFI   — شاخص عملکرد جنسی زنان (۱۹ سؤال، ۶ حوزه، نمرهٔ کل ۲ تا ۳۶)
     ۲) FSDS-R — مقیاس پریشانی جنسی زنان (۱۳ سؤال، نمرهٔ کل ۰ تا ۵۲)
   ------------------------------------------------------------
   معماری (همان الگوی ماژول‌های سَمن — منطق خالص جدا از نماها):
   - پیکربندی متمرکز آستانه‌ها و قواعد: FS_CONFIG (نسخه‌دار، تک‌منبع)
   - محاسبهٔ خالص قابل‌آزمون: fsComputeFsfi / fsComputeFsds
   - موتور تفسیر قانون‌محور: fsBuildInterpretation (۵ الگو)
   - دادهٔ واقعی: localStorage — کلید samn_fsrep_v1 — فقط نمره‌ها،
     بدون پاسخ خام، بدون ارسال به هیچ سرویسی
   - دادهٔ نمایشی: ۶ سناریو که همه از «همان» موتور محاسبه عبور می‌کنند
   - هیچ نمرهٔ ترکیبی FSFI+FSDS-R ساخته نمی‌شود؛ هیچ ادعای تشخیصی نیست
   - اتصال آینده: fsSaveResult(tool, answers) نقطهٔ اتصال پرسش‌نامه‌هاست
   ============================================================ */
const FSREP = (function () {
  "use strict";

  /* ============================================================
     ۱) پیکربندی متمرکز — تک‌منبع آستانه‌ها، نسخه‌ها و قواعد
     هیچ عددی از این آبجکت در نماها یا منطق تکرار نمی‌شود.
     ============================================================ */
  const FS_CONFIG = {
    version: "fs-config-1",
    fsfi: {
      tool: "FSFI",
      faName: "پرسش‌نامهٔ شاخص عملکرد جنسی زنان",
      itemTotal: 19,
      domainMax: 6,
      totalMin: 2,
      totalMax: 36,
      /* آستانهٔ غربالگری: مقدار پیش‌فرض مرجع این محصول.
         وضعیت «تأییدنشده» است و نباید به‌عنوان مرز تشخیص یا آستانهٔ جهان‌شمول
         معرفی شود؛ فقط برای انتخاب لحن گزارش استفاده می‌شود. */
      cutoff: 28,
      cutoffStatus: "unconfirmed",
      cutoffLabel: "آستانهٔ مرجع این محصول (۲۸) — تأییدنشده",
      citation: "نسخهٔ فارسی اعتبارسنجی‌شده: Fakhri و همکاران، ۲۰۱۲ — The Journal of Sexual Medicine · DOI: 10.1111/j.1743-6109.2011.02553.x",
    },
    fsds: {
      tool: "FSDS-R",
      faName: "مقیاس پریشانی جنسی زنان (نسخهٔ بازنگری‌شده)",
      itemTotal: 13,
      totalMin: 0,
      totalMax: 52,
      /* آستانهٔ دسته‌بندی پریشانی برای نسخهٔ فارسی هنوز انتخاب و تأیید نشده
         است؛ بنابراین هیچ برچسبی (خفیف/متوسط/شدید/طبیعی) تولید نمی‌شود. */
      cutoff: null,
      cutoffStatus: "none",
      cutoffLabel: "بدون آستانهٔ تأییدشده برای نسخهٔ فارسی",
      citation: "نسخهٔ فارسی اعتبارسنجی‌شده: Azimi Nekoo و همکاران، ۲۰۱۴ — The Journal of Sexual Medicine · DOI: 10.1111/jsm.12449",
    },
    rules: {
      /* قاعدهٔ «تفاوت نسبی حوزه‌ها»: اگر اختلاف نسبتِ نمره (نمره ÷ ۶) بین
         بالاترین و پایین‌ترین حوزه از این مقدار بیشتر باشد، مشاهدهٔ نسبی
         در گزارش می‌آید — قاعدهٔ از پیش تعریف‌شده و شفاف. */
      relativeGap: 0.35,
      /* قاعدهٔ انتخاب متن پریشانی: میانگین پاسخ‌های ۰–۴ ≥ ۲ یعنی پریشانی
         «گزارش‌شده» — این قاعده فقط لحنِ متن را انتخاب می‌کند و هیچ
         دسته‌بندی تشخیصی یا برچسب شدت به کاربر نمی‌دهد. */
      distressMean: 2,
    },
  };

  /* ============================================================
     ۲) ساختار ابزارها — فقط متادیتای امتیازدهی (بدون متن سؤال‌ها)
     متن پرسش‌نامه‌های مجاز در پروژه موجود نیست؛ بنابراین متن سؤال‌ها
     از حافظه بازنویسی نمی‌شود و سؤال‌ها فقط با شناسهٔ ساختاری آمده‌اند.
     ============================================================ */
  /* صفر در سؤال‌های ۳ تا ۱۴ و ۱۷ تا ۱۹ پاسخ معتبر است («فعالیت جنسی در
     ۴ هفتهٔ گذشته نداشتم») و هرگز با پاسخ خالی یکسان گرفته نمی‌شود. */
  const FSFI_ITEMS = [
    { id: "q1", domain: "desire", min: 1, max: 5 },
    { id: "q2", domain: "desire", min: 1, max: 5 },
    { id: "q3", domain: "arousal", min: 0, max: 5 },
    { id: "q4", domain: "arousal", min: 0, max: 5 },
    { id: "q5", domain: "arousal", min: 0, max: 5 },
    { id: "q6", domain: "arousal", min: 0, max: 5 },
    { id: "q7", domain: "lubrication", min: 0, max: 5 },
    { id: "q8", domain: "lubrication", min: 0, max: 5 },
    { id: "q9", domain: "lubrication", min: 0, max: 5 },
    { id: "q10", domain: "lubrication", min: 0, max: 5 },
    { id: "q11", domain: "orgasm", min: 0, max: 5 },
    { id: "q12", domain: "orgasm", min: 0, max: 5 },
    { id: "q13", domain: "orgasm", min: 0, max: 5 },
    { id: "q14", domain: "satisfaction", min: 0, max: 5 },
    { id: "q15", domain: "satisfaction", min: 1, max: 5 },
    { id: "q16", domain: "satisfaction", min: 1, max: 5 },
    { id: "q17", domain: "pain", min: 0, max: 5 },
    { id: "q18", domain: "pain", min: 0, max: 5 },
    { id: "q19", domain: "pain", min: 0, max: 5 },
  ];
  const FSFI_DOMAINS = [
    { id: "desire", fa: "میل جنسی", en: "Desire", mult: 0.6 },
    { id: "arousal", fa: "برانگیختگی", en: "Arousal", mult: 0.3 },
    { id: "lubrication", fa: "روان‌سازی", en: "Lubrication", mult: 0.3 },
    { id: "orgasm", fa: "ارگاسم", en: "Orgasm", mult: 0.4 },
    { id: "satisfaction", fa: "رضایت", en: "Satisfaction", mult: 0.4 },
    { id: "pain", fa: "درد", en: "Pain", mult: 0.4 },
  ];
  const FSDS_ITEMS = Array.from({ length: 13 }, (_, i) => ({ id: "d" + (i + 1), min: 0, max: 4 }));

  /* ============================================================
     ۳) کمکی‌های مستقل از مرورگر (برای آزمون‌پذیری در Node/Bun)
     ============================================================ */
  function fsNum(raw) {
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    if (typeof raw !== "string") return null;
    const s = raw.trim();
    if (!s) return null;
    const faD = "۰۱۲۳۴۵۶۷۸۹";
    const en = s.replace(/[۰-۹]/g, (d) => String(faD.indexOf(d)));
    if (/^-?\d+(\.\d+)?$/.test(en)) return parseFloat(en);
    return null;
  }
  function fsRound2(x) {
    return Math.round(x * 100) / 100;
  }
  /* قالب‌بندی محافظت‌شدهٔ اعداد فارسی — در مرورگر از fa/faN سراسری
     (config.js) استفاده می‌شود و در محیط آزمونِ خالص (بدون config.js)
     به رقم لاتین برمی‌گردد؛ منطق محاسبه هرگز به این‌ها وابسته نیست. */
  function fsFa(x) {
    if (typeof fa === "function") return fa(x);
    return String(x);
  }
  function fsFaN(x) {
    if (typeof faN === "function") return faN(x);
    const r = Math.round(Number(x) * 10) / 10;
    return Number.isInteger(r) ? String(r) : r.toFixed(1);
  }
  /* نمایش دو رقم اعشار فارسی (مثلاً ۰٫۳۵) — فقط در نماها استفاده می‌شود */
  function fsDec2(x) {
    return fsFa((Math.round(x * 100) / 100).toFixed(2)).replace(".", "٫");
  }
  function fsValOf(answers, item) {
    const raw = answers ? answers[item.id] : undefined;
    if (raw === undefined || raw === null || raw === "") return { state: "missing", v: null };
    const x = fsNum(raw);
    if (x === null || x < item.min || x > item.max || Math.floor(x) !== x) {
      return { state: "invalid", v: x };
    }
    return { state: "ok", v: x };
  }

  /* ============================================================
     ۴) موتور محاسبهٔ FSFI — تک‌منبع نمره‌ها برای کل صفحه
     قواعد مرجع (Rosen 2000 / Wiegel 2009 / نسخهٔ ایرانی Fakhri 2012):
     - نمرهٔ هر حوزه = (جمع پاسخ‌های همان حوزه) × ضریب رسمی حوزه
     - نمرهٔ کل = مجموع شش نمرهٔ حوزه (دامنهٔ استاندارد ۲ تا ۳۶)
     - حوزه فقط وقتی محاسبه می‌شود که همهٔ سؤال‌هایش معتبر باشند
     - پاسخ خالی هرگز صفر فرض نمی‌شود؛ صفرِ معتبر جدا شمرده می‌شود
     ============================================================ */
  function fsComputeFsfi(answers) {
    const missing = [], invalid = [], zero = [];
    let answered = 0;
    const itemState = {};
    FSFI_ITEMS.forEach(function (it) {
      const r = fsValOf(answers, it);
      itemState[it.id] = r;
      if (r.state === "ok") {
        answered += 1;
        if (r.v === 0) zero.push(it.id);
      } else if (r.state === "missing") {
        missing.push(it.id);
      } else {
        invalid.push(it.id);
      }
    });
    const domains = FSFI_DOMAINS.map(function (d) {
      const its = FSFI_ITEMS.filter(function (x) { return x.domain === d.id; });
      const bad = its.filter(function (x) { return itemState[x.id].state !== "ok"; });
      const computed = bad.length === 0;
      const rawSum = computed ? its.reduce(function (s, x) { return s + itemState[x.id].v; }, 0) : null;
      return {
        id: d.id, fa: d.fa, en: d.en, mult: d.mult,
        items: its.map(function (x) { return x.id; }),
        computed: computed,
        rawSum: rawSum,
        rawMax: its.reduce(function (s, x) { return s + x.max; }, 0),
        score: computed ? fsRound2(rawSum * d.mult) : null,
        max: FS_CONFIG.fsfi.domainMax,
        ratio: computed ? fsRound2((rawSum * d.mult) / FS_CONFIG.fsfi.domainMax) : null,
        /* همهٔ پاسخ‌های حوزه صفر: یعنی «فعالیت مربوطه رخ نداشته»، نه بدترین حالت */
        zeroAll: computed && rawSum === 0,
      };
    });
    const complete = domains.every(function (d) { return d.computed; });
    const total = complete ? fsRound2(domains.reduce(function (s, d) { return s + d.score; }, 0)) : null;
    const cutoff = FS_CONFIG.fsfi.cutoff;
    const isBelow = complete && cutoff != null ? total < cutoff : null;
    return {
      tool: "fsfi",
      complete: complete,
      ok: complete && invalid.length === 0,
      missing: missing,
      invalid: invalid,
      zeroItems: zero,
      answered: answered,
      itemTotal: FS_CONFIG.fsfi.itemTotal,
      domains: domains,
      total: total,
      totalMax: FS_CONFIG.fsfi.totalMax,
      cutoffUsed: cutoff,
      cutoffStatus: FS_CONFIG.fsfi.cutoffStatus,
      isBelow: isBelow,
    };
  }

  /* ============================================================
     ۵) موتور محاسبهٔ FSDS-R — مستقل از FSFI، هرگز با آن جمع نمی‌شود
     ۱۳ سؤال، هر سؤال ۰ تا ۴، نمرهٔ کل ۰ تا ۵۲؛ بالاتر = پریشانی بیشتر
     ============================================================ */
  function fsComputeFsds(answers) {
    const missing = [], invalid = [];
    let answered = 0, sum = 0, allOk = true;
    const itemState = {};
    FSDS_ITEMS.forEach(function (it) {
      const r = fsValOf(answers, it);
      itemState[it.id] = r;
      if (r.state === "ok") {
        answered += 1; sum += r.v;
      } else if (r.state === "missing") {
        missing.push(it.id); allOk = false;
      } else {
        invalid.push(it.id); allOk = false;
      }
    });
    const complete = answered === FSDS_ITEMS.length && invalid.length === 0;
    const total = complete ? fsRound2(sum) : null;
    const meanItem = complete ? fsRound2(sum / FSDS_ITEMS.length) : null;
    return {
      tool: "fsds",
      complete: complete,
      ok: complete && invalid.length === 0,
      missing: missing,
      invalid: invalid,
      answered: answered,
      itemTotal: FSDS_ITEMS.length,
      total: total,
      totalMax: FS_CONFIG.fsds.totalMax,
      meanItem: meanItem,
      /* قاعدهٔ انتخاب متن (نه تشخیص، نه برچسب شدت) */
      distressReported: complete && meanItem >= FS_CONFIG.rules.distressMean,
    };
  }

  /* ============================================================
     ۶) موتور تفسیر قانون‌محور — ۵ الگوی متن از قواعد شفاف
     هر جمله به یک ویژگی واقعی پاسخ‌ها وابسته است؛ بدون علت‌یابی
     بدون شواهد، بدون تشخیص، بدون القای شرم یا غیرطبیعی‌بودن.
     ============================================================ */
  function fsBuildInterpretation(fsfi, fsds) {
    const blocks = [];
    const flags = { below: null, distress: null, pattern4: false, incomplete: false, zeroDomains: [] };
    const cfg = FS_CONFIG;

    if (!fsfi) {
      flags.incomplete = true;
      if (fsds && fsds.complete) {
        blocks.push({
          kind: "base",
          icon: "info",
          text: "در این گزارش فقط نمرهٔ پریشانی موجود است و ابزار عملکرد (FSFI) تکمیل نشده است. برای برداشت کامل، هر دو ابزار لازم‌اند؛ تا آن زمان دربارهٔ عملکرد جنسی نتیجه‌ای نمایش داده نمی‌شود.",
        });
      }
      return { blocks: blocks, flags: flags };
    }

    /* ---- دادهٔ ناسازگار ذخیره‌شده: هیچ تفسیری تولید نمی‌شود ---- */
    if (fsfi.integrityError) {
      flags.incomplete = true;
      blocks.push({
        kind: "base",
        icon: "alert",
        text: "دادهٔ ذخیره‌شدهٔ ابزار عملکرد با قواعد امتیازدهی سازگار نیست و برای جلوگیری از نتیجهٔ گمراه‌کننده، تفسیری از آن تولید نمی‌شود." +
          (fsds && fsds.complete ? " نمرهٔ پریشانی شما سالم است و در کارت خودش نمایش داده می‌شود." : "") +
          " برای دیدن گزارش کامل، دادهٔ ناسازگار را پاک کنید و ارزیابی را دوباره تکمیل کنید.",
      });
      return { blocks: blocks, flags: flags };
    }

    /* ---- اطلاعات ناقص (الگوی ۵) ---- */
    if (!fsfi.complete || fsfi.invalid.length) {
      flags.incomplete = true;
      const names = [];
      fsfi.missing.forEach(function (id) {
        const d = FSFI_DOMAINS.find(function (x) { return x.id === (FSFI_ITEMS.find(function (y) { return y.id === id; }) || {}).domain; });
        if (d && names.indexOf(d.fa) < 0) names.push(d.fa);
      });
      fsfi.invalid.forEach(function (id) {
        if (names.indexOf("پاسخ‌های نامعتبر") < 0) names.push("پاسخ‌های نامعتبر");
      });
      blocks.push({
        kind: "base",
        icon: "info",
        text: "پاسخ‌های این ارزیابی برای تفسیر دقیق کامل نیست" + (names.length ? " — بخش‌های ناقص: " + names.join("، ") + "." : ".") +
          " تا زمانی که همهٔ سؤال‌های معتبر تکمیل نشوند، گزارش عمداً از تولید نمرهٔ کل و نتیجهٔ قطعی خودداری می‌کند. با تکمیل ارزیابی، برداشت کامل‌تری ساخته می‌شود.",
      });
      return { blocks: blocks, flags: flags };
    }

    /* ---- الگوهای پایه ۱ تا ۳ بر پایهٔ نمرهٔ کل و پریشانی ---- */
    const below = fsfi.isBelow;
    flags.below = below;
    const distress = fsds && fsds.complete ? fsds.distressReported : null;
    flags.distress = distress;
    const cut = cfg.fsfi.cutoff;
    let base = null;
    if (below && distress === true) {
      base = "در پاسخ‌های این ارزیابی، نمرهٔ کل عملکرد جنسی از آستانهٔ مرجع (" + fsFa(cut) + ") پایین‌تر بوده و در ابزار پریشانی نیز سطح بالایی از ناراحتی گزارش شده است. این ترکیب معمولاً یعنی بعضی جنبه‌های تجربهٔ جنسی در این دوره برای شما آزاردهنده بوده‌اند و شناخت دقیق‌ترشان می‌تواند مفید باشد. این نتیجه غربالگری است و تشخیص نیست؛ «اختلال» فقط با ارزیابی تخصصی و گفتگو دربارهٔ تاریخچه و شرایط زندگی شما قابل بررسی است.";
    } else if (below && distress === false) {
      base = "نمرهٔ کل عملکرد در این ارزیابی از آستانهٔ مرجع (" + fsFa(cut) + ") پایین‌تر است؛ اما در ابزار پریشانی، سطح بالایی از ناراحتی گزارش نشده است. نمرهٔ یک پرسش‌نامه به‌تنهایی به معنی وجود مشکلی آزاردهنده برای فرد نیست — تجربه و احساس شخصی شما معیار مهم‌تری است. اگر موضوعی در زندگی شما اهمیت دارد یا آزار می‌دهد، همان موضوع شایستهٔ توجه است، چه نمره‌ها بالای آستانه باشند و چه نباشند.";
    } else if (below && distress === null) {
      base = "نمرهٔ کل عملکرد در این ارزیابی از آستانهٔ مرجع (" + fsFa(cut) + ") پایین‌تر است. چون ابزار پریشانی تکمیل نشده، دربارهٔ میزان ناراحتی شخصی نتیجه‌ای گرفته نمی‌شود؛ نمرهٔ پایین‌تر از آستانه فقط یک نشانهٔ «برای بررسی بیشتر» است، نه برچسب. اگر خودتان تجربه‌ای آزاردهنده دارید، همان تجربه مهم‌تر از عدد است.";
    } else if (!below && distress === true) {
      base = "نمرهٔ کل عملکرد در این ارزیابی از آستانهٔ مرجع (" + fsFa(cut) + ") بالاتر است؛ با این حال پاسخ‌های ابزار پریشانی نشان می‌دهد موضوع جنسی برای شما ناراحتی واقعی ایجاد کرده است. ناراحتی شخصی مستقل از عدد عملکرد اهمیت دارد؛ عبور نمره از آستانه به معنی بی‌اهمیتی این احساس نیست. اگر این ناراحتی پایدار یا آزاردهنده است، گفتگو با متخصص می‌تواند نقطهٔ شروع خوبی باشد.";
    } else if (!below && distress === false) {
      base = "نمرهٔ کل عملکرد در این ارزیابی از آستانهٔ مرجع (" + fsFa(cut) + ") بالاتر است و در ابزار پریشانی نیز سطح بالایی از ناراحتی گزارش نشده است. این نتیجه به معنی کامل یا بی‌نقص‌بودن تجربهٔ جنسی نیست — هیچ نمره‌ای چنین ادعایی نمی‌کند. اگر حوزهٔ خاصی برایتان اهمیت دارد یا در آینده تغییر کرد، همین گزارش می‌تواند نقطهٔ مقایسه باشد.";
    } else {
      base = "نمرهٔ کل عملکرد در این ارزیابی از آستانهٔ مرجع (" + fsFa(cut) + ") بالاتر است. چون ابزار پریشانی تکمیل نشده، دربارهٔ میزان ناراحتی شخصی نتیجه‌ای گرفته نمی‌شود. اگر موضوعی برایتان اهمیت دارد، همان موضوع معیار توجه است — نه عدد نمره.";
    }
    blocks.push({ kind: "base", icon: "heart", text: base });

    /* ---- الگوی ۴: تفاوت نسبی حوزه‌ها (قاعدهٔ شفاف، نه برچسب) ---- */
    const comp = fsfi.domains.filter(function (d) { return d.computed; });
    if (comp.length === fsfi.domains.length) {
      let hi = comp[0], lo = comp[0];
      comp.forEach(function (d) {
        if (d.ratio > hi.ratio) hi = d;
        if (d.ratio < lo.ratio) lo = d;
      });
      if (hi.ratio - lo.ratio >= cfg.rules.relativeGap && hi.id !== lo.id) {
        flags.pattern4 = true;
        let t = "در نگاه نسبی به حوزه‌ها، «" + hi.fa + "» بالاترین و «" + lo.fa + "» پایین‌ترین نسبت نمره را در پاسخ‌های شما داشته‌اند (" + fsFaN(hi.score) + " از " + fsFa(hi.max) + " در برابر " + fsFaN(lo.score) + " از " + fsFa(lo.max) + "). این تفاوت می‌تواند نشانهٔ آن باشد که تجربهٔ شما در این دوره در حوزه‌های مختلف یکسان نبوده است.";
        if (lo.id === "pain") {
          t += " توجه: در ساختار FSFI نمرهٔ بالاتر در حوزهٔ درد یعنی درد کمتر؛ پس نسبت پایین‌تر این حوزه یعنی درد یا ناراحتی بیشتر در دورهٔ ارزیابی گزارش شده است.";
        } else if (hi.id === "pain") {
          t += " نسبت بالاتر در حوزهٔ درد معمولاً یعنی درد کمتری گزارش کرده‌اید.";
        }
        t += " این یک مشاهدهٔ آماری از پاسخ‌های خودِ شماست، نه برچسبی دربارهٔ شما.";
        blocks.push({ kind: "domains", icon: "chart", text: t });
      }
    }

    /* ---- یادداشت حوزه‌های «صفرِ معتبر» ---- */
    fsfi.domains.forEach(function (d) {
      if (d.zeroAll) {
        flags.zeroDomains.push(d.id);
        blocks.push({
          kind: "zero",
          icon: "info",
          text: "در حوزهٔ «" + d.fa + "» همهٔ پاسخ‌ها صفر بوده است — در ساختار FSFI صفر در این سؤال‌ها پاسخ معتبر است و یعنی فعالیت مربوط به این حوزه در چهار هفتهٔ گذشته رخ نداشته است؛ صفر به معنی «بدترین حالت» یا «قطعی‌بودن مشکل» نیست.",
        });
      }
    });

    return { blocks: blocks, flags: flags };
  }

  /* ============================================================
     ۷) «قدم بعدی شما» — مسیرهای متناسب با نتیجه
     ساختار ارجاع ماژولار برای ابزارهای آینده (SIDI-F، PISQ-IR، VSQ):
     هر ارجاع با status:"active" و target معتبر فقط آن‌وقت نمایش داده
     می‌شود؛ در این نسخه هیچ‌کدام فعال نیستند و چیزی جعل نمی‌شود.
     ============================================================ */
  const FS_REFERRALS = [
    { id: "sidi-f", fa: "ارزیابی تخصصی میل جنسی (SIDI-F)", status: "planned", target: null },
    { id: "pisq-ir", fa: "ارزیابی بی‌کنترلی ادرار و عملکرد جنسی (PISQ-IR)", status: "planned", target: null },
    { id: "vsq", fa: "ارزیابی رضایت جنسی (VSQ)", status: "planned", target: null },
  ];

  function fsBuildNextSteps(fsfi, fsds, interp) {
    const steps = [];
    const distress = !!(fsds && fsds.complete && fsds.distressReported);
    const below = fsfi && fsfi.complete && fsfi.isBelow === true;
    const painLowWithDistress = distress && fsfi && fsfi.complete && (function () {
      const p = fsfi.domains.find(function (d) { return d.id === "pain"; });
      return p && p.computed && p.ratio !== null && p.ratio <= 0.4;
    })();

    /* ۱) آموزش و آگاهی — مقصد هنوز در پروژه پیاده نشده؛ دکمهٔ خیالی نمی‌سازیم */
    const lowDomains = (function () {
      if (!fsfi || !fsfi.complete) return "";
      const comp = fsfi.domains.filter(function (d) { return d.computed; });
      if (!comp.length) return "";
      const lo = comp.reduce(function (a, b) { return a.ratio < b.ratio ? a : b; });
      return lo.fa;
    })();
    steps.push({
      id: "learn", icon: "book", soon: true,
      title: "مسیر آموزش و آگاهی",
      text: "محتوای آموزشی مرتبط با حوزه‌های مورد توجه شما" + (lowDomains ? " — از جمله «" + lowDomains + "»" : "") + " در نسخه‌های بعدی سَمن اضافه می‌شود؛ از شناخت بدن و چرخهٔ میل تا ارتباط با همسر.",
    });

    /* ۲) شناخت بیشتر — دکمه‌های واقعی و کاری */
    steps.push({
      id: "understand", icon: "bulb", soon: false,
      title: "مسیر شناخت بیشتر",
      text: "می‌توانید نتیجه را دوباره مرور کنید و ببینید هر عدد از کدام پاسخ‌ها آمده است.",
      actions: [
        { label: "مرور نمودار حوزه‌ها", act: "to-chart" },
        { label: "بازگشت به سلامت زنان", act: "nav-women" },
      ],
    });

    /* ۳) دریافت کمک تخصصی — متناظر با نتیجه، بدون توصیهٔ دارویی/درمانی */
    if (below && distress) {
      steps.push({
        id: "pro", icon: "shieldh", soon: false, emphasized: true,
        title: "مسیر دریافت کمک تخصصی",
        text: "پاسخ‌های شما ترکیبی است که بررسی تخصصی می‌تواند برایش مفید باشد: نمرهٔ عملکرد پایین‌تر از آستانهٔ مرجع همراه با پریشانی گزارش‌شده. اگر این موضوع پایدار یا آزاردهنده است، پزشک یا متخصص سلامت جنسی می‌تواند با گفتگو و بررسی دقیق‌تر مسیر مناسبی پیشنهاد دهد. این تصمیم مال خود شماست و عجله‌ای در آن نیست.",
      });
    } else if (painLowWithDistress) {
      steps.push({
        id: "pro", icon: "shieldh", soon: false, emphasized: true,
        title: "مسیر دریافت کمک تخصصی",
        text: "در پاسخ‌های شما درد بیشتر همراه با پریشانی گزارش‌شده دیده می‌شود. درد در تجربهٔ جنسی موضوعی شایع و قابل بررسی است؛ اگر تکرار می‌شود یا آزار می‌دهد، گفتگو با پزشک متخصص می‌تواند نقطهٔ شروع مطمئنی باشد. سَمن جایگزین ویزیت و تشخیص نمی‌شود.",
      });
    } else if (distress) {
      steps.push({
        id: "pro", icon: "shieldh", soon: false,
        title: "مسیر دریافت کمک تخصصی",
        text: "چون پریشانی گزارش‌شده‌ای در پاسخ‌ها دیده می‌شود، اگر این احساس پایدار بود یا به زندگی روزمره فشار می‌آورد، گفتگو با مشاور یا متخصص سلامت جنسی می‌تواند مفید باشد — حتی وقتی نمرهٔ عملکرد بالا است.",
      });
    } else {
      steps.push({
        id: "pro", icon: "shieldh", soon: false,
        title: "مسیر دریافت کمک تخصصی",
        text: "اگر در آینده نگرانی پایدار شد یا علائم جسمی مثل درد اضافه شد، گفتگو با پزشک متخصص نقطهٔ شروع مطمئنی است. سَمن ابزار غربالگری و آگاهی است و جایگزین ویزیت نمی‌شود.",
      });
    }
    return steps;
  }

  /* ============================================================
     ۸) ذخیره‌سازی دادهٔ واقعی — فقط همین دستگاه، فقط نمره‌ها
     نقطهٔ اتصال پرسش‌نامه‌های آینده: fsSaveResult(tool, answers)
     پاسخ خام ذخیره نمی‌شود؛ سازگاری دادهٔ ذخیره‌شده هنگام خواندن
     بررسی می‌شود تا نمرهٔ خراب هرگز نمایش داده نشود.
     ============================================================ */
  const FS_KEY = "samn_fsrep_v1";
  function fsStoreAvailable() {
    try {
      return typeof localStorage !== "undefined" && !!localStorage;
    } catch (e) { return false; }
  }
  function fsLoadStore() {
    if (!fsStoreAvailable()) return null;
    try {
      const raw = localStorage.getItem(FS_KEY);
      if (!raw) return null;
      return fsSanitizeDb(JSON.parse(raw));
    } catch (e) { return fsSanitizeDb(null); }
  }
  function fsWriteStore(db) {
    if (!fsStoreAvailable()) return false;
    try {
      localStorage.setItem(FS_KEY, JSON.stringify(db));
      return true;
    } catch (e) { return false; }
  }
  function fsSaveResult(tool, answers) {
    if (tool !== "fsfi" && tool !== "fsds") return null;
    const res = tool === "fsfi" ? fsComputeFsfi(answers) : fsComputeFsds(answers);
    const db = fsLoadStore() || { v: 1, fsfi: null, fsds: null };
    if (tool === "fsfi") {
      const dmap = {};
      res.domains.forEach(function (d) {
        dmap[d.id] = { computed: d.computed, score: d.score, rawSum: d.rawSum, ratio: d.ratio, zeroAll: d.zeroAll };
      });
      db.fsfi = {
        total: res.total, complete: res.complete, answered: res.answered,
        domains: dmap, completedAt: new Date().toISOString(),
        cutoffUsed: res.cutoffUsed, cutoffStatus: res.cutoffStatus, isBelow: res.isBelow,
      };
    } else {
      db.fsds = {
        total: res.total, complete: res.complete, answered: res.answered,
        meanItem: res.meanItem, distressReported: res.distressReported,
        completedAt: new Date().toISOString(),
      };
    }
    fsWriteStore(db);
    return fsLoadStore();
  }
  function fsClearStore() {
    if (!fsStoreAvailable()) return;
    try { localStorage.removeItem(FS_KEY); } catch (e) {}
  }
  /* راستی‌آزمایی سازگاری دادهٔ ذخیره‌شده: نمرهٔ کل ≡ مجموع حوزه‌ها */
  function fsSanitizeDb(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw) || raw.v !== 1) {
      return { ok: false, integrityError: true, fsfi: null, fsds: null };
    }
    const out = { ok: true, integrityError: false, fsfi: null, fsds: null };
    const EPS = 0.02;
    if (raw.fsfi && typeof raw.fsfi === "object") {
      const f = raw.fsfi;
      let bad = false;
      const dmap = {};
      if (f.domains && typeof f.domains === "object") {
        FSFI_DOMAINS.forEach(function (d) {
          const x = f.domains[d.id];
          if (!x || typeof x !== "object" || x.computed === undefined) {
            dmap[d.id] = { computed: false, score: null, ratio: null, zeroAll: false };
            return;
          }
          if (x.computed) {
            if (typeof x.score !== "number" || x.score < -EPS || x.score > FS_CONFIG.fsfi.domainMax + EPS || typeof x.ratio !== "number") {
              bad = true;
            }
          }
          dmap[d.id] = x;
        });
      } else if (f.complete) { bad = true; }
      const complete = f.complete === true;
      if (typeof f.total !== "number" || f.total < FS_CONFIG.fsfi.totalMin - EPS || f.total > FS_CONFIG.fsfi.totalMax + EPS) {
        if (complete) bad = true;
      }
      if (complete && !bad) {
        const sum = FSFI_DOMAINS.reduce(function (s, d) {
          const x = dmap[d.id];
          return s + (x && x.computed && typeof x.score === "number" ? x.score : 0);
        }, 0);
        if (Math.abs(sum - f.total) > 0.05) bad = true; /* نمرهٔ کل با حوزه‌ها نمی‌خواند */
      }
      if (complete && (typeof f.answered !== "number" || f.answered !== FS_CONFIG.fsfi.itemTotal)) bad = true;
      out.fsfi = bad ? { integrityError: true } : {
        integrityError: false, total: f.total, complete: complete,
        answered: f.answered, domains: dmap, completedAt: f.completedAt || null,
        cutoffUsed: f.cutoffUsed, cutoffStatus: f.cutoffStatus, isBelow: complete ? f.total < (f.cutoffUsed != null ? f.cutoffUsed : FS_CONFIG.fsfi.cutoff) : null,
      };
    }
    if (raw.fsds && typeof raw.fsds === "object") {
      const s = raw.fsds;
      let bad = false;
      const complete = s.complete === true;
      if (typeof s.total !== "number" || s.total < FS_CONFIG.fsds.totalMin - EPS || s.total > FS_CONFIG.fsds.totalMax + EPS) {
        if (complete) bad = true;
      }
      if (complete && (typeof s.answered !== "number" || s.answered !== FSDS_ITEMS.length)) bad = true;
      out.fsds = bad ? { integrityError: true } : {
        integrityError: false, total: s.total, complete: complete,
        answered: s.answered, meanItem: s.meanItem,
        distressReported: complete && typeof s.meanItem === "number" && s.meanItem >= FS_CONFIG.rules.distressMean,
        completedAt: s.completedAt || null,
      };
    }
    return out;
  }

  /* ============================================================
     ۹) دادهٔ نمایشی — ۶ سناریو، همه از همان موتور محاسبه عبور می‌کنند
     هیچ سناریویی ذخیره نمی‌شود و هرگز با دادهٔ واقعی مخلوط نمی‌شود.
     سناریوها: A نمرهٔ پایین + پریشانی | B نمرهٔ پایین بدون پریشانی |
     C عملکرد بالاتر + پریشانی | D پاسخ ناقص | E فقط پریشانی | F فقط عملکرد
     ============================================================ */
  const FS_DEMO_SCENARIOS = {
    A: {
      label: "نمرهٔ پایین‌تر + پریشانی گزارش‌شده",
      fsfi: { q1: 3, q2: 3, q3: 3, q4: 2, q5: 2, q6: 3, q7: 3, q8: 3, q9: 2, q10: 2, q11: 2, q12: 2, q13: 3, q14: 3, q15: 3, q16: 3, q17: 3, q18: 2, q19: 2 },
      fsds: { d1: 3, d2: 3, d3: 2, d4: 3, d5: 2, d6: 3, d7: 2, d8: 2, d9: 3, d10: 2, d11: 2, d12: 3, d13: 2 },
    },
    B: {
      label: "نمرهٔ پایین‌تر، بدون پریشانی",
      fsfi: { q1: 5, q2: 4, q3: 4, q4: 4, q5: 3, q6: 4, q7: 4, q8: 3, q9: 3, q10: 4, q11: 3, q12: 3, q13: 4, q14: 4, q15: 4, q16: 4, q17: 2, q18: 2, q19: 2 },
      fsds: { d1: 1, d2: 0, d3: 1, d4: 0, d5: 1, d6: 0, d7: 1, d8: 1, d9: 0, d10: 1, d11: 1, d12: 0, d13: 1 },
    },
    C: {
      label: "عملکرد بالاتر + پریشانی گزارش‌شده",
      fsfi: { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4, q6: 4, q7: 4, q8: 4, q9: 4, q10: 5, q11: 4, q12: 4, q13: 4, q14: 4, q15: 4, q16: 5, q17: 4, q18: 4, q19: 4 },
      fsds: { d1: 2, d2: 3, d3: 2, d4: 2, d5: 3, d6: 2, d7: 2, d8: 2, d9: 3, d10: 2, d11: 2, d12: 2, d13: 2 },
    },
    D: {
      label: "پاسخ‌های ناقص",
      fsfi: { q1: 3, q2: 3, q3: 3, q4: 2, q5: 2, q6: 3, q7: 3, q8: 3, q9: 2, q10: 2, q11: 2, q12: 2, q13: 3, q14: 3, q15: 3, q16: 3 },
      fsds: { d1: 1, d2: 2, d3: 1, d4: 1, d5: 2, d6: 1, d7: 2, d8: 1, d9: 1, d10: 2, d11: 1, d12: 1, d13: 2 },
    },
    E: {
      label: "فقط ابزار پریشانی",
      fsfi: null,
      fsds: { d1: 2, d2: 3, d3: 2, d4: 2, d5: 3, d6: 2, d7: 2, d8: 2, d9: 3, d10: 2, d11: 2, d12: 2, d13: 3 },
    },
    F: {
      label: "فقط ابزار عملکرد",
      fsfi: { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4, q6: 4, q7: 4, q8: 4, q9: 4, q10: 5, q11: 4, q12: 4, q13: 4, q14: 4, q15: 4, q16: 5, q17: 4, q18: 4, q19: 4 },
      fsds: null,
    },
  };
  function fsBuildDemoResult(scenarioId) {
    const s = FS_DEMO_SCENARIOS[scenarioId] || FS_DEMO_SCENARIOS.A;
    const fsfi = s.fsfi ? fsComputeFsfi(s.fsfi) : null;
    const fsds = s.fsds ? fsComputeFsds(s.fsds) : null;
    const now = Date.now() - 2 * 86400000; /* تاریخ فرضی: دو روز پیش */
    return {
      demo: true, scenario: FS_DEMO_SCENARIOS[scenarioId] ? scenarioId : "A",
      label: s.label,
      fsfi: fsfi, fsds: fsds,
      fsfiDate: s.fsfi ? new Date(now).toISOString() : null,
      fsdsDate: s.fsds ? new Date(now).toISOString() : null,
    };
  }

  /* ============================================================
     ۱۰) آیکون‌های محلی (بدون دست‌کاری I سراسری)
     ============================================================ */
  const FS_IC = (typeof SV === "function") ? {
    heart: SV('<path d="M12 20.3S4.4 15.6 4.4 10a4.1 4.1 0 0 1 7.6-2.2A4.1 4.1 0 0 1 19.6 10c0 5.6-7.6 10.3-7.6 10.3z"/>'),
    chart: SV('<path d="M4.4 19.6V4.4M4.4 19.6h15.2"/><path d="m7.6 15.2 3.4-4 2.6 2.4 4.4-5.6"/>'),
    book: SV('<path d="M4.8 5.6A2 2 0 0 1 6.8 3.6H19v14.8H6.8a2 2 0 0 0-2 2z"/><path d="M4.8 18.4a2 2 0 0 1 2-2H19"/>'),
    bulb: SV('<path d="M9.6 17.8h4.8M10.4 20.6h3.2"/><path d="M12 3.2a5.8 5.8 0 0 0-3.6 10.3c.8.6 1.1 1.3 1.1 2.1v.4h5v-.4c0-.8.3-1.5 1.1-2.1A5.8 5.8 0 0 0 12 3.2z"/>'),
    shieldh: SV('<path d="M12 3.2 18.8 5.7v5.5c0 4.2-2.9 7.2-6.8 8.8-3.9-1.6-6.8-4.6-6.8-8.8V5.7z"/><path d="M12 8v5M9.6 10.4h4.8"/>'),
    info: SV('<circle cx="12" cy="12" r="8.4"/><path d="M12 11.2v4.6M12 8.2h.01"/>'),
    alert: SV('<path d="M10.4 4.4 3 17.4a1.6 1.6 0 0 0 1.4 2.4h15.2a1.6 1.6 0 0 0 1.4-2.4L13.6 4.4a1.8 1.8 0 0 0-3.2 0z"/><path d="M12 9.6v4M12 16.8h.01"/>'),
    check: SV('<path d="m5 12.5 4.4 4.4L19 7.2"/>'),
    lock: SV('<rect x="5.8" y="10.4" width="12.4" height="9.4" rx="2.4"/><path d="M8.6 10.4V7.6a3.4 3.4 0 0 1 6.8 0v2.8"/>'),
    clock: SV('<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3 2.2"/>'),
    minus: SV('<path d="M6 12h12"/>'),
    chevD: SV('<path d="m6.5 9.8 5.5 5.4 5.5-5.4"/>'),
    chevU: SV('<path d="m6.5 14.2 5.5-5.4 5.5 5.4"/>'),
    chevL: SV('<path d="m14 6-6 6 6 6"/>'),
    chevR: SV('<path d="m10 6 6 6-6 6"/>'),
    drop: SV('<path d="M12 3.4s5.8 6.1 5.8 10a5.8 5.8 0 0 1-11.6 0c0-3.9 5.8-10 5.8-10z"/>'),
    trash: SV('<path d="M5 7h14M10 7V5.2a1.2 1.2 0 0 1 1.2-1.2h1.6A1.2 1.2 0 0 1 14 5.2V7M7 7l.8 12h8.4L17 7"/>'),
    eye: SV('<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.6"/>'),
    clip: SV('<rect x="5.5" y="4.8" width="13" height="15.7" rx="2.4"/><rect x="9.2" y="2.8" width="5.6" height="3.6" rx="1.4"/><path d="m9.2 12.6 2 2 3.6-4"/>'),
    flag: SV('<path d="M6.2 20.8V4"/><path d="M6.2 4.2h11l-2.7 3.7 2.7 3.7h-11"/>'),
  } : {};

  /* ============================================================
     ۱۱) وضعیت ماژول و نماهای صفحه
     ============================================================ */
  const FS = { mode: null, scenario: "A", openDetail: null, clearArmed: false };

  function fsJalFromISO(iso) {
    if (typeof JAL === "undefined" || !iso) return "";
    try {
      const d = new Date(iso);
      const jdn = JAL.g2d(d.getFullYear(), d.getMonth() + 1, d.getDate());
      return JAL.fmt(JAL.d2j(jdn));
    } catch (e) { return ""; }
  }

  function resolveEntry() {
    /* ورود به صفحه: اگر دادهٔ واقعی سازگار موجود باشد → گزارش واقعی؛ وگرنه نمونهٔ نمایشی */
    if (FS.mode) return;
    const db = fsLoadStore();
    const hasReal = db && !db.integrityError && ((db.fsfi && !db.fsfi.integrityError) || (db.fsds && !db.fsds.integrityError));
    FS.mode = hasReal ? "real" : "demo";
    if (!hasReal) FS.scenario = FS.scenario || "A";
  }

  function statusChipHtml(name, tool, dateIso) {
    if (!tool) {
      return '<span class="fs-mchip"><span class="fs-mico dim">' + FS_IC.minus + '</span>' + name + ' · تکمیل‌نشده</span>';
    }
    if (tool.integrityError) {
      return '<span class="fs-mchip warn"><span class="fs-mico">' + FS_IC.alert + '</span>' + name + ' · دادهٔ ناسازگار</span>';
    }
    if (!tool.complete) {
      return '<span class="fs-mchip warn"><span class="fs-mico">' + FS_IC.alert + '</span>' + name + ' · ناقص (' + fsFa(tool.answered) + ' از ' + fsFa(tool.itemTotal) + ' سؤال)</span>';
    }
    const dt = dateIso ? " · " + fsJalFromISO(dateIso) : "";
    return '<span class="fs-mchip ok"><span class="fs-mico">' + FS_IC.check + '</span>' + name + ' · تکمیل‌شده' + dt + '</span>';
  }

  function fsHeadHtml(res) {
    const isDemo = res.demo;
    return `
    <div class="fs-head card">
      <span class="fs-kick">${FS_IC.heart} گزارش شخصی شما</span>
      <h1>گزارش سلامت جنسی شما</h1>
      <p class="fs-sub">نگاهی شخصی به عملکرد جنسی، احساسات و زمینه‌های قابل توجه در تجربه شما</p>
      <div class="fs-mchips">
        ${statusChipHtml("FSFI", res.fsfi, res.fsfiDate)}
        ${statusChipHtml("FSDS-R", res.fsds, res.fsdsDate)}
        <span class="fs-mchip ${isDemo ? "warn" : "ok"}"><span class="fs-mico">${isDemo ? FS_IC.eye : FS_IC.lock}</span>${isDemo ? "داده‌های فرضی — ذخیره نمی‌شود" : "پاسخ‌ها فقط روی همین دستگاه می‌مانند"}</span>
      </div>
      <p class="fs-disclaimer">این گزارش برای شناخت بهتر تجربهٔ خودتان طراحی شده است و جایگزین معاینه، تشخیص و نظر پزشک نیست. اگر نگرانی پایدار یا آزاردهنده دارید، مشورت با متخصص نقطهٔ شروع مطمئنی است.</p>
    </div>`;
  }

  function fsDemoBarHtml(res) {
    const db = fsLoadStore();
    const hasReal = db && !db.integrityError && ((db.fsfi && !db.fsfi.integrityError) || (db.fsds && !db.fsds.integrityError));
    return `
    <div class="fs-demo-bar">
      <div class="fs-demo-t">
        <span class="fs-demo-badge">${FS_IC.eye}</span>
        <div>
          <b>نمونهٔ نمایشی — داده‌ها فرضی هستند</b>
          <span>هیچ‌کدام از این نمره‌ها ذخیره یا ثبت نمی‌شود؛ فقط برای دیدن طراحی و روایت گزارش است. نمره‌ها از همان موتور محاسبهٔ واقعی ساخته شده‌اند.</span>
        </div>
      </div>
      <div class="fs-demo-chips" role="group" aria-label="انتخاب سناریوی نمایشی">
        ${Object.keys(FS_DEMO_SCENARIOS).map(function (k) {
          return `<button type="button" class="fs-chip ${res.scenario === k ? "sel" : ""}" data-fs="sc:${k}" aria-pressed="${res.scenario === k ? "true" : "false"}">${fsFa(Object.keys(FS_DEMO_SCENARIOS).indexOf(k) + 1)} · ${FS_DEMO_SCENARIOS[k].label}</button>`;
        }).join("")}
        ${hasReal ? '<button type="button" class="fs-chip real" data-fs="mode-real">گزارش واقعی من</button>' : ""}
      </div>
    </div>`;
  }

  /* ---------- کارت FSFI ---------- */
  function fsFsfiCardHtml(res) {
    const f = res.fsfi;
    const cfg = FS_CONFIG.fsfi;
    if (!f || f.integrityError) {
      return `
      <div class="card fs-toolcard" id="fs-fsfi">
        <div class="fs-tool-kick">${FS_IC.drop} ابزار ۱ · ${cfg.faName} <span class="badge-en">FSFI</span></div>
        <h2>عملکرد جنسی</h2>
        <div class="fs-absent">${FS_IC.info}<span>${f && f.integrityError
          ? "دادهٔ ذخیره‌شدهٔ این ابزار با قواعد امتیازدهی سازگار نیست و برای جلوگیری از نتیجهٔ گمراه‌کننده نمایش داده نشد. می‌توانید دادهٔ ناسازگار را از پایین صفحه پاک کنید."
          : "این ابزار در این گزارش تکمیل نشده است. پس از تکمیل پرسش‌نامهٔ FSFI، نمرهٔ کل و شش حوزهٔ عملکرد همین‌جا نمایش داده می‌شود."}</span></div>
      </div>`;
    }
    const dateStr = res.fsfiDate ? fsJalFromISO(res.fsfiDate) : "";
    let screening = "";
    if (f.complete && cfg.cutoff != null) {
      const un = f.cutoffStatus === "unconfirmed" || cfg.cutoffStatus === "unconfirmed";
      if (f.isBelow) {
        screening = `
        <div class="fs-screen warn">
          <div class="fs-screen-h">${FS_IC.info}<b>پایین‌تر از آستانهٔ مرجع</b></div>
          <p>نمرهٔ شما از ${un ? "آستانهٔ مرجع این محصول (" + fsFa(cfg.cutoff) + ") — که تأییدنشده است" : "آستانهٔ غربالگری (" + fsFa(cfg.cutoff) + ")"} پایین‌تر است. این فقط یک نشانهٔ «برای بررسی بیشتر» است، نه مرز تشخیص و نه برچسب؛ نمرهٔ پایین‌تر به‌تنهایی به معنی وجود اختلال نیست.</p>
        </div>`;
      } else {
        screening = `
        <div class="fs-screen ok">
          <div class="fs-screen-h">${FS_IC.check}<b>بدون علامت غربالگری بر پایهٔ آستانهٔ مرجع</b></div>
          <p>نمرهٔ شما از ${un ? "آستانهٔ مرجع این محصول (" + fsFa(cfg.cutoff) + ") — که تأییدنشده است" : "آستانهٔ غربالگری (" + fsFa(cfg.cutoff) + ")"} بالاتر است. این به معنی ردشدن همهٔ نگرانی‌های ممکن نیست؛ اگر تجربه‌ای نگران‌کننده دارید، همان تجربه معیار توجه است.</p>
        </div>`;
      }
    }
    return `
    <div class="card fs-toolcard" id="fs-fsfi">
      <div class="fs-tool-kick">${FS_IC.drop} ابزار ۱ · ${cfg.faName} <span class="badge-en">FSFI</span></div>
      <div class="fs-score-row">
        <div class="fs-score-main">
          <h2>عملکرد جنسی</h2>
          <p class="fs-score-desc">تصویر کلی از شش حوزهٔ تجربهٔ جنسی در چهار هفتهٔ گذشته — بر پایهٔ پاسخ‌های خودِ شما.</p>
          <div class="fs-score-meta">
            ${dateStr ? `<span>${FS_IC.clock} تاریخ تکمیل: ${dateStr}</span>` : ""}
            <span>${FS_IC.clip} ${f.complete ? "پاسخ‌های کامل: " + fsFa(f.answered) + " از " + fsFa(f.itemTotal) : "پاسخ‌ها: " + fsFa(f.answered) + " از " + fsFa(f.itemTotal) + " (ناقص)"}</span>
          </div>
        </div>
        <div class="fs-score-box">
          ${f.complete
            ? `<span class="fs-score-num">${fsFaN(f.total)}</span><span class="fs-score-of">از ${fsFa(f.totalMax)}</span><span class="fs-score-range">دامنهٔ استاندارد ابزار: ${fsFa(cfg.totalMin)} تا ${fsFa(cfg.totalMax)}</span>`
            : `<span class="fs-score-num na">—</span><span class="fs-score-of">نمرهٔ کل قابل تفسیر نیست</span><span class="fs-score-range">پاسخ‌های لازم برای محاسبهٔ معتبر در دسترس نیست</span>`}
        </div>
      </div>
      ${screening}
      <p class="fs-cite">${cfg.citation}</p>
    </div>`;
  }

  /* ---------- نمودار شش حوزه ---------- */
  function fsDomainRow(d) {
    const open = FS.openDetail === d.id;
    const pct = d.computed ? Math.max(0, Math.min(100, (d.ratio || 0) * 100)) : 0;
    const numTxt = d.computed ? fsFaN(d.score) + " از " + fsFa(d.max) : "محاسبه‌نشده";
    return `
    <li class="fs-drow ${open ? "open" : ""}">
      <button type="button" class="fs-dbtn" id="fs-dbtn-${d.id}" data-fs="detail:${d.id}" aria-expanded="${open ? "true" : "false"}" aria-controls="fs-ddet-${d.id}">
        <span class="fs-dlabel">${d.fa}<i class="fs-den">${d.en}</i></span>
        <span class="fs-bar" aria-hidden="true">
          ${d.computed
            ? `<i class="fs-bar-fill ${d.zeroAll ? "zero" : ""}" data-w="${pct.toFixed(1)}"></i>`
            : `<span class="fs-bar-none"></span>`}
        </span>
        <span class="fs-dnum">${numTxt}${d.computed ? FS_IC.chevD : ""}</span>
      </button>
      <div class="fs-ddet" id="fs-ddet-${d.id}" ${open ? "" : "hidden"}>
        ${d.computed
          ? `<span>جمع خام پاسخ‌های این حوزه: <b>${fsFaN(d.rawSum)}</b> از ${fsFa(d.rawMax)}</span>
             <span>ضریب رسمی حوزه: <b>${fsFaN(d.mult)}</b> — نمره = جمع خام × ضریب</span>
             <span>تعداد سؤال‌های این حوزه: <b>${fsFa(d.items.length)}</b></span>
             ${d.zeroAll ? '<span class="fs-ddet-warn">همهٔ پاسخ‌های این حوزه صفر است؛ در ساختار FSFI صفر یعنی فعالیت مربوطه در ۴ هفتهٔ گذشته رخ نداشته است — نه بدترین حالت.</span>' : ""}`
          : `<span>به‌دلیل نبود پاسخ معتبر در همهٔ سؤال‌های این حوزه، نمره محاسبه نشده است. پاسخ خالی هرگز صفر فرض نمی‌شود.</span>`}
      </div>
    </li>`;
  }
  function fsChartHtml(res) {
    const f = res.fsfi;
    if (!f || f.integrityError) {
      return `
      <div class="card fs-chartcard" id="fs-domains">
        <h2>نگاهی دقیق‌تر به حوزه‌های عملکرد جنسی</h2>
        <p class="fs-chart-sub">نمودار حوزه‌ها پس از تکمیل و تأیید دادهٔ FSFI ساخته می‌شود.</p>
      </div>`;
    }
    return `
    <div class="card fs-chartcard" id="fs-domains">
      <h2>نگاهی دقیق‌تر به حوزه‌های عملکرد جنسی</h2>
      <p class="fs-chart-sub">نمرهٔ هر حوزه از ${fsFa(FS_CONFIG.fsfi.domainMax)} است و مستقیماً از پاسخ‌های همان حوزه با ضریب رسمی ابزار محاسبه می‌شود. برای دیدن جزئیات هر حوزه، روی آن بزنید.</p>
      ${f.complete ? "" : `<p class="fs-chart-warn">${FS_IC.alert}<span>چون همهٔ سؤال‌ها تکمیل نیستند، بعضی حوزه‌ها محاسبه نشده‌اند و نمرهٔ کل تولید نمی‌شود — این صادقانه بودن گزارش است، نه خطا.</span></p>`}
      <ul class="fs-dlist">
        ${f.domains.map(fsDomainRow).join("")}
      </ul>
      <p class="fs-pain-note">${FS_IC.info}<span>یادداشت مهم دربارهٔ حوزهٔ درد: در ساختار استاندارد FSFI، نمرهٔ بالاتر در حوزهٔ درد معمولاً یعنی درد کمتر گزارش‌شده است. پس نمرهٔ بالا در این حوزه خبر خوب است، نه علامت درد.</span></p>
    </div>`;
  }

  /* ---------- کارت FSDS-R ---------- */
  function fsFsdsCardHtml(res) {
    const s = res.fsds;
    const cfg = FS_CONFIG.fsds;
    if (!s || s.integrityError) {
      return `
      <div class="card fs-toolcard fs-fsds" id="fs-fsds">
        <div class="fs-tool-kick">${FS_IC.heart} ابزار ۲ · ${cfg.faName} <span class="badge-en">FSDS-R</span></div>
        <h2>تجربه احساسی و میزان پریشانی جنسی</h2>
        <div class="fs-absent">${FS_IC.info}<span>${s && s.integrityError
          ? "دادهٔ ذخیره‌شدهٔ این ابزار با قواعد امتیازدهی سازگار نیست و نمایش داده نشد."
          : "این ابزار در این گزارش تکمیل نشده است. نتایج عملکرد (FSFI) به‌تنهایی تفسیر می‌شوند و دربارهٔ میزان ناراحتی شخصی هیچ نتیجه‌ای گرفته نمی‌شود."}</span></div>
        <p class="fs-cite">${cfg.citation}</p>
      </div>`;
    }
    const dateStr = res.fsdsDate ? fsJalFromISO(res.fsdsDate) : "";
    let body;
    if (!s.complete) {
      body = `
      <div class="fs-absent">${FS_IC.info}<span>پاسخ‌های این ابزار کامل نیست (${fsFa(s.answered)} از ${fsFa(s.itemTotal)} سؤال). تا تکمیل همهٔ سؤال‌ها، فقط تعداد پاسخ‌ها نمایش داده می‌شود و نمرهٔ کل قابل تفسیر نیست.</span></div>
      <div class="fs-score-box small"><span class="fs-score-num na">—</span><span class="fs-score-of">نمرهٔ کل محاسبه نمی‌شود</span></div>`;
    } else {
      const distText = s.distressReported
        ? "پاسخ‌های شما نشان می‌دهد پریشانی مرتبط با مسائل جنسی بخشی از تجربهٔ ماه گذشتهٔ شما بوده است. این احساس شایع است و به‌خودی‌خود به معنی «مشکل بودن» شما نیست — ولی جدی گرفته می‌شود."
        : "در پاسخ‌های شما، آزار و پریشانی مرتبط با مسائل جنسی در سطح بالایی گزارش نشده است.";
      body = `
      <div class="fs-score-row">
        <div class="fs-score-main">
          <p class="fs-score-desc">این ابزار جدا از عملکرد، میزان ناراحتی و آزار شخصیِ مرتبط با مسائل جنسی را در ۳۰ روز گذشته می‌سنجد؛ نمرهٔ بالاتر یعنی پریشانی گزارش‌شدهٔ بیشتر.</p>
          <p class="fs-fsds-read">${distText}</p>
          <div class="fs-score-meta">
            ${dateStr ? `<span>${FS_IC.clock} تاریخ تکمیل: ${dateStr}</span>` : ""}
            <span>${FS_IC.clip} پاسخ‌های کامل: ${fsFa(s.answered)} از ${fsFa(s.itemTotal)}</span>
          </div>
        </div>
        <div class="fs-score-box purple">
          <span class="fs-score-num">${fsFaN(s.total)}</span><span class="fs-score-of">از ${fsFa(s.totalMax)}</span>
          <span class="fs-score-range">هر سؤال ۰ تا ۴ · نمرهٔ کل = جمع ۱۳ سؤال</span>
        </div>
      </div>
      <div class="fs-diff-note">${FS_IC.info}<span>نمرهٔ عملکرد و نمرهٔ پریشانی دو چیز جدا هستند و در این گزارش عمداً با هم جمع یا ترکیب نمی‌شوند؛ ممکن است عملکرد در پرسش‌نامه خوب باشد ولی تجربه پریشان‌کننده باشد، یا برعکس.</span></div>
      <p class="fs-cite">${cfg.citation} · ${cfg.cutoffLabel} — بنابراین فقط نمرهٔ واقعی نمایش داده می‌شود و از برچسب‌هایی مثل «خفیف»، «متوسط»، «شدید» یا «طبیعی» استفاده نمی‌کنیم.</p>`;
    }
    return `
    <div class="card fs-toolcard fs-fsds" id="fs-fsds">
      <div class="fs-tool-kick">${FS_IC.heart} ابزار ۲ · ${cfg.faName} <span class="badge-en">FSDS-R</span></div>
      <h2>تجربه احساسی و میزان پریشانی جنسی</h2>
      ${body}
    </div>`;
  }

  /* ---------- برداشت اختصاصی ---------- */
  function fsInterpHtml(res, interp) {
    return `
    <div class="card fs-interp" id="fs-interp">
      <div class="fs-tool-kick">${FS_IC.bulb} برداشت اختصاصی</div>
      <h2>برداشت اختصاصی از پاسخ‌های شما</h2>
      <p class="fs-chart-sub">این متن به‌صورت خودکار و از قواعد شفاف روی پاسخ‌های همین ارزیابی ساخته شده است — نه یک متن ثابت برای همه.</p>
      <div class="fs-interp-list">
        ${interp.blocks.map(function (b) {
          return `<div class="fs-ib b-${b.kind}"><span class="fs-ib-ico">${FS_IC[b.icon] || FS_IC.info}</span><p>${b.text}</p></div>`;
        }).join("")}
      </div>
    </div>`;
  }

  /* ---------- قدم بعدی شما ---------- */
  function fsNextHtml(res, steps) {
    return `
    <div class="card fs-next" id="fs-next">
      <div class="fs-tool-kick">${FS_IC.flag} اقدام</div>
      <h2>قدم بعدی شما</h2>
      <p class="fs-chart-sub">بر اساس همین نتیجه — نه همه کاربران یک مسیر واحد نمی‌روند.</p>
      <div class="fs-next-grid">
        ${steps.map(function (st) {
          return `
          <div class="fs-stepcard ${st.emphasized ? "emph" : ""}">
            <div class="fs-step-h"><span class="fs-step-ico">${FS_IC[st.icon] || FS_IC.info}</span><h3>${st.title}${st.soon ? ' <span class="badge b-soon">به‌زودی</span>' : ""}</h3></div>
            <p>${st.text}</p>
            ${(st.actions || []).length ? `<div class="fs-step-actions">${st.actions.map(function (a) {
              return `<button type="button" class="btn btn-secondary btn-sm" data-fs="${a.act}">${a.label}</button>`;
            }).join("")}</div>` : ""}
          </div>`;
        }).join("")}
      </div>
      <p class="fs-ref-note">سامانهٔ ارجاع ماژولار به ابزارهای تخصصی دیگر (SIDI-F · PISQ-IR · VSQ) در نسخه‌های بعدی، فقط برای مسیرهایی که واقعاً فعال شوند اضافه می‌شود.</p>
    </div>`;
  }

  /* ---------- شفافیت گزارش ---------- */
  function fsTransparencyHtml() {
    const cfg = FS_CONFIG;
    return `
    <details class="fs-trans">
      <summary><span>شفافیت گزارش — قواعد و آستانه‌ها</span>${FS_IC.chevD}</summary>
      <ul>
        <li>آستانهٔ غربالگری FSFI: مقدار پیش‌فرض مرجع <b>${fsFa(cfg.fsfi.cutoff)}</b> — وضعیت: <b>تأییدنشده</b> (پیکربندی نسخهٔ ${cfg.version}؛ فقط برای انتخاب لحن گزارش، نه تشخیص).</li>
        <li>قاعدهٔ پریشانی: میانگین پاسخ‌های FSDS-R <b>${fsFa(cfg.rules.distressMean)}</b> از ۴ یا بیشتر → «پریشانی گزارش‌شده» — قاعدهٔ انتخاب متن است و هیچ برچسب شدت نمی‌دهد.</li>
        <li>قاعدهٔ تفاوت نسبی حوزه‌ها: اختلاف نسبت نمره ≥ <b>${fsDec2(cfg.rules.relativeGap)}</b> → نمایش مشاهدهٔ نسبی.</li>
        <li>نمرهٔ هر حوزه = جمع خام سؤال‌های آن × ضریب رسمی (میل ۰٫۶ · برانگیختگی ۰٫۳ · روان‌سازی ۰٫۳ · ارگاسم ۰٫۴ · رضایت ۰٫۴ · درد ۰٫۴).</li>
        <li>پاسخ خالی هرگز صفر فرض نمی‌شود؛ صفرِ معتبر ابزار جداگانه شناخته و تفسیر می‌شود.</li>
        <li>نمرهٔ FSFI و FSDS-R هرگز با هم جمع یا ترکیب نمی‌شوند.</li>
      </ul>
    </details>`;
  }

  /* ---------- حالت خالی (بدون دادهٔ واقعی) ---------- */
  function fsEmptyHtml() {
    return `
    <div class="card fs-empty">
      <span class="fs-empty-ico">${FS_IC.eye}</span>
      <h2>هنوز نتیجه‌ای ثبت نشده است</h2>
      <p>پرسش‌نامه‌های FSFI و FSDS-R به‌زودی در بخش سلامت زنان فعال می‌شوند. پس از تکمیل آن‌ها، گزارش شخصی شما دقیقاً همین‌جا ساخته می‌شود — از همان پاسخ‌های خودتان، بدون هیچ عدد ساختگی.</p>
      <button type="button" class="btn btn-secondary" data-fs="demo">مشاهدهٔ نمونهٔ نمایشی ${FS_IC.chevL}</button>
    </div>`;
  }

  /* ---------- نمای اصلی ---------- */
  function buildResult() {
    if (FS.mode === "demo") return fsBuildDemoResult(FS.scenario);
    const db = fsLoadStore();
    if (!db || db.integrityError || (!db.fsfi && !db.fsds)) return null;
    return {
      demo: false,
      fsfi: db.fsfi ? fsStoredToResultFsfi(db.fsfi) : null,
      fsds: db.fsds ? fsStoredToResultFsds(db.fsds) : null,
      fsfiDate: db.fsfi ? db.fsfi.completedAt : null,
      fsdsDate: db.fsds ? db.fsds.completedAt : null,
    };
  }
  /* دادهٔ ذخیره‌شدهٔ واقعی را به همان شکل «نتیجهٔ محاسبه» درمی‌آوریم تا
     نماها فقط یک شکل داده ببینند (یک منبع حقیقت برای همهٔ بخش‌ها). */
  function fsStoredToResultFsfi(f) {
    if (f.integrityError) return f;
    const domains = FSFI_DOMAINS.map(function (d) {
      const x = (f.domains || {})[d.id] || {};
      return {
        id: d.id, fa: d.fa, en: d.en, mult: d.mult,
        computed: !!x.computed, score: typeof x.score === "number" ? x.score : null,
        rawSum: typeof x.rawSum === "number" ? x.rawSum : null,
        max: FS_CONFIG.fsfi.domainMax,
        ratio: typeof x.ratio === "number" ? x.ratio : null,
        zeroAll: !!x.zeroAll,
        items: [], rawMax: null,
      };
    });
    return {
      tool: "fsfi", complete: !!f.complete, ok: !!f.complete,
      missing: [], invalid: [], zeroItems: [],
      answered: f.answered, itemTotal: FS_CONFIG.fsfi.itemTotal,
      domains: domains, total: f.total, totalMax: FS_CONFIG.fsfi.totalMax,
      cutoffUsed: f.cutoffUsed, cutoffStatus: f.cutoffStatus,
      isBelow: f.complete && f.total != null ? f.total < (f.cutoffUsed != null ? f.cutoffUsed : FS_CONFIG.fsfi.cutoff) : null,
    };
  }
  function fsStoredToResultFsds(s) {
    if (s.integrityError) return s;
    return {
      tool: "fsds", complete: !!s.complete, ok: !!s.complete,
      missing: [], invalid: [], answered: s.answered, itemTotal: FSDS_ITEMS.length,
      total: s.total, totalMax: FS_CONFIG.fsds.totalMax, meanItem: s.meanItem,
      distressReported: !!s.distressReported,
    };
  }

  function vFsrep() {
    resolveEntry();
    if (FS.mode === "real") {
      const res = buildResult();
      if (!res) {
        /* داده‌ای نیست — حالت خالی صادقانه */
        return shell(`
        <section class="page"><div class="container fsrep">
          ${fsEmptyHtml()}
        </div></section>`);
      }
      const interp = fsBuildInterpretation(res.fsfi, res.fsds);
      const steps = fsBuildNextSteps(res.fsfi, res.fsds, interp);
      const anyBad = (res.fsfi && res.fsfi.integrityError) || (res.fsds && res.fsds.integrityError);
      return shell(`
      <section class="page"><div class="container fsrep">
        ${fsHeadHtml(res)}
        ${anyBad ? `<div class="fs-integrity">${FS_IC.alert}<span>بعضی داده‌های ذخیره‌شده با قواعد امتیازدهی سازگار نیستند و نمایش داده نشده‌اند. هیچ نمرهٔ جایگزینی ساخته نمی‌شود.</span><button type="button" class="fs-delbtn ${FS.clearArmed ? "armed" : ""}" data-fs="clear">${FS.clearArmed ? "تأیید پاک‌کردن" : "پاک‌کردن دادهٔ ناسازگار"}</button></div>` : ""}
        ${fsFsfiCardHtml(res)}
        ${fsChartHtml(res)}
        ${fsFsdsCardHtml(res)}
        ${fsInterpHtml(res, interp)}
        ${fsNextHtml(res, steps)}
        ${fsTransparencyHtml()}
        <div class="fs-footactions">
          <button class="btn btn-primary" data-nav="women">${FS_IC.chevR} بازگشت به سلامت زنان</button>
          <button class="btn btn-secondary" data-nav="home">بازگشت به خانه</button>
        </div>
      </div></section>`);
    }
    /* ---------- نمونهٔ نمایشی ---------- */
    const res = fsBuildDemoResult(FS.scenario);
    const interp = fsBuildInterpretation(res.fsfi, res.fsds);
    const steps = fsBuildNextSteps(res.fsfi, res.fsds, interp);
    return shell(`
    <section class="page"><div class="container fsrep">
      ${fsDemoBarHtml(res)}
      ${fsHeadHtml(res)}
      ${fsFsfiCardHtml(res)}
      ${fsChartHtml(res)}
      ${fsFsdsCardHtml(res)}
      ${fsInterpHtml(res, interp)}
      ${fsNextHtml(res, steps)}
      ${fsTransparencyHtml()}
      <div class="fs-footactions">
        <button class="btn btn-primary" data-nav="women">${FS_IC.chevR} بازگشت به سلامت زنان</button>
        <button class="btn btn-secondary" data-nav="home">بازگشت به خانه</button>
      </div>
    </div></section>`);
  }

  /* ============================================================
     ۱۲) رویدادها — الگوی capture مستقل ماژول‌ها (data-fs)
     ============================================================ */
  function fsHandle(act, el) {
    if (act === "open") {
      FS.mode = null; /* ورود تازه: واقعی اگر داده باشد، وگرنه نمایشی */
      FS.clearArmed = false;
      nav("fsrep");
      return;
    }
    if (act === "demo") {
      FS.mode = "demo";
      FS.clearArmed = false;
      nav("fsrep");
      return;
    }
    if (act === "mode-real") {
      FS.mode = "real";
      render();
      return;
    }
    if (act.indexOf("sc:") === 0) {
      FS.scenario = act.slice(3);
      FS.openDetail = null;
      render();
      return;
    }
    if (act.indexOf("detail:") === 0) {
      const id = act.slice(7);
      FS.openDetail = FS.openDetail === id ? null : id;
      render(false);
      const btn = document.getElementById("fs-dbtn-" + id);
      if (btn) btn.focus();
      return;
    }
    if (act === "to-chart") {
      const t = document.getElementById("fs-domains");
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (act === "nav-women") {
      reset("women");
      return;
    }
    if (act === "clear") {
      if (!FS.clearArmed) { FS.clearArmed = true; render(false); return; }
      fsClearStore();
      FS.clearArmed = false;
      FS.mode = null;
      resolveEntry();
      render();
      return;
    }
  }

  if (typeof document !== "undefined" && document.getElementById("app")) {
    document.getElementById("app").addEventListener(
      "click",
      function (e) {
        const b = e.target.closest("[data-fs]");
        if (b && b.dataset.fs) {
          e.stopPropagation();
          fsHandle(b.dataset.fs, b);
          return;
        }
      },
      true,
    );
  }

  /* ============================================================
     ۱۳) خروجی ماژول — منطق برای آزمون، نماها برای app.js
     ============================================================ */
  const API = {
    FS_CONFIG: FS_CONFIG,
    FSFI_ITEMS: FSFI_ITEMS,
    FSFI_DOMAINS: FSFI_DOMAINS,
    FSDS_ITEMS: FSDS_ITEMS,
    FS_DEMO_SCENARIOS: FS_DEMO_SCENARIOS,
    FS_REFERRALS: FS_REFERRALS,
    fsComputeFsfi: fsComputeFsfi,
    fsComputeFsds: fsComputeFsds,
    fsBuildInterpretation: fsBuildInterpretation,
    fsBuildNextSteps: fsBuildNextSteps,
    fsSanitizeDb: fsSanitizeDb,
    fsSaveResult: fsSaveResult,
    fsLoadStore: fsLoadStore,
    fsClearStore: fsClearStore,
    fsBuildDemoResult: fsBuildDemoResult,
    vFsrep: vFsrep,
  };
  return API;
})();
if (typeof module !== "undefined" && module.exports) {
  module.exports = FSREP;
}
