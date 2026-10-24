/* ============================================================
   scoring.js  —  موتورهای نمره‌دهی و منطق محاسباتی/پروفایل/طرح‌ورزی
   باید بعد از questions.js بارگذاری شود
   ============================================================ */

/* ================= Scoring engines (separate from UI) ================= */
const SCORERS = {};

SCORERS.endo = function (a) {
  const n = (id) => num(a[id]);
  const band = (v, bs) => {
    if (v == null) return 0;
    for (const b of bs) {
      if (v >= b[0] && v <= b[1]) return b[2];
    }
    return bs[bs.length - 1][2];
  };
  const painMen = band(n("endo_pain_men"), [
    [0, 3, 0],
    [4, 6, 1],
    [7, 8, 2],
    [9, 10, 3],
  ]);
  const dysp =
    a.endo_dysp === "yes"
      ? band(n("endo_dysp_sev"), [
          [0, 0, 0],
          [1, 3, 1],
          [4, 6, 2],
          [7, 10, 3],
        ])
      : 0;
  const pelvic =
    a.endo_pelvic === "yes"
      ? band(n("endo_pelvic_sev"), [
          [0, 0, 0],
          [1, 3, 1],
          [4, 6, 2],
          [7, 10, 3],
        ])
      : 0;
  const bowel = (() => {
    if (a.endo_bowel !== "yes") return 0;
    const s = a.endo_bowel_sev === "mild" ? 1 : 2;
    return s === 2 && a.endo_bowel_assoc === "yes" ? 3 : s;
  })();
  const urineP =
    a.endo_urine === "yes" ? 1 + (a.endo_urine_assoc === "yes" ? 1 : 0) : 0;
  const bleed = { low: 0, med: 0, high: 1, vhigh: 2 }[a.endo_bleed_amount] ?? 0;
  const reg = a.endo_regular === "irr" ? 1 : 0;
  const chg = a.endo_change6 === "yes" ? 1 : 0;
  const giVal = (k) =>
    a[k] === "yes" ? (a[k + "_assoc"] === "yes" ? 2 : 1) : 0;
  const gi = Math.max(
    giVal("endo_ibs_like"),
    giVal("endo_bloat"),
    giVal("endo_constip"),
    giVal("endo_diarr"),
  );
  const ibs = a.endo_ibs === "yes" ? 1 : 0;
  const urinary =
    a.endo_urinary_sym === "yes"
      ? a.endo_urinary_sym_assoc === "yes"
        ? 2
        : 1
      : 0;
  const fatigue = band(n("endo_fatigue"), [
    [0, 4, 0],
    [5, 7, 1],
    [8, 10, 2],
  ]);
  const infert = a.endo_infert === "yes" ? 2 : 0;
  const fam = a.endo_fam === "yes" ? 2 : 0;
  const score =
    painMen +
    dysp +
    pelvic +
    bowel +
    urineP +
    bleed +
    reg +
    chg +
    gi +
    ibs +
    urinary +
    fatigue +
    infert +
    fam;
  /* سقف واقعی قابل‌دست‌یابی = جمع سقف مؤلفه‌ها: درد ۱۴ + گوارشی/IBS ۳ + ادراری ۲ + خستگی ۲ + باروری ۲
     + خونریزی ۲ + نظم ۱ + تغییر ۱ + خانوادگی ۲ = ۲۹ (اصلاح‌شده در مرحلهٔ ۱ — قبلاً ۳۲ اعلام می‌شد) */
  const MAX = 29;
  const level =
    score <= 6
      ? { cls: "pos", label: "الگوی علائم پایین" }
      : score <= 14
        ? { cls: "warn", label: "الگوی علائم قابل‌توجه" }
        : { cls: "concern", label: "الگوی علائم بالا" };
  const F = [];
  if (painMen >= 2)
    F.push({
      icon: "act",
      cls: painMen >= 3 ? "concern" : "warn",
      title: "درد قاعدگی شدید",
      desc: `شدت گزارش‌شده: ${fa(n("endo_pain_men") ?? 0)} از ۱۰`,
    });
  if (dysp > 0)
    F.push({
      icon: "act",
      cls: "warn",
      title: "درد هنگام یا پس از رابطه جنسی",
      desc: `شدت گزارش‌شده: ${fa(n("endo_dysp_sev") ?? 0)} از ۱۰`,
    });
  if (pelvic > 0)
    F.push({
      icon: "act",
      cls: "warn",
      title: "درد لگنی خارج از قاعدگی",
      desc: `شدت گزارش‌شده: ${fa(n("endo_pelvic_sev") ?? 0)} از ۱۰`,
    });
  if (bowel > 0)
    F.push({
      icon: "act",
      cls: bowel >= 3 ? "concern" : "warn",
      title: "درد هنگام اجابت مزاج",
      desc:
        bowel >= 3
          ? "همراه با ارتباط مشخص با قاعدگی"
          : "بدون ارتباط مشخص با قاعدگی",
    });
  if (urineP > 0)
    F.push({
      icon: "act",
      cls: "warn",
      title: "درد هنگام ادرار",
      desc: a.endo_urine_assoc === "yes" ? "همراه با ارتباط با قاعدگی" : "",
    });
  if (gi >= 1)
    F.push({
      icon: "act",
      cls: gi === 2 ? "concern" : "warn",
      title: "علائم گوارشی",
      desc:
        gi === 2
          ? "همراه با ارتباط مشخص با قاعدگی"
          : "بدون ارتباط مشخص با قاعدگی",
    });
  if (urinary >= 1)
    F.push({
      icon: "flask",
      cls: "warn",
      title: "علائم ادراری",
      desc:
        urinary === 2
          ? "همراه با ارتباط مشخص با قاعدگی"
          : "بدون ارتباط مشخص با قاعدگی",
    });
  if (fatigue >= 1)
    F.push({
      icon: "act",
      cls: "warn",
      title: "خستگی",
      desc: `شدت گزارش‌شده: ${fa(n("endo_fatigue") ?? 0)} از ۱۰`,
    });
  if (bleed >= 1)
    F.push({
      icon: "cal",
      cls: "warn",
      title: "خونریزی سنگین قاعدگی",
      desc: "میزان خونریزی در محدوده زیاد یا خیلی زیاد گزارش شد.",
    });
  if (reg) F.push({ icon: "cal", cls: "info", title: "قاعدگی نامنظم" });
  if (infert)
    F.push({
      icon: "rings",
      cls: "warn",
      title: "سابقه ناباروری",
      desc: "تلاش برای بارداری ۱۲ ماه یا بیشتر، بدون بارداری.",
    });
  if (fam)
    F.push({
      icon: "user",
      cls: "warn",
      title: "سابقه خانوادگی اندومتریوز",
      desc: "در بستگان نزدیک گزارش شده است.",
    });
  if (!F.length)
    F.push({
      icon: "check",
      cls: "pos",
      title: "الگوی علائم محدود",
      desc: "علائم قابل‌توجهی در پاسخ‌های شما دیده نشد.",
    });
  const ctx = [];
  const b = bmiOf(a, "endo");
  if (b) ctx.push(["BMI", `${faDec(b.v)} · ${b.cat}`]);
  if (n("endo_age")) ctx.push(["سن", fa(n("endo_age")) + " سال"]);
  ctx.push(["دخانیات", optLabel("endo_smoke", a.endo_smoke)]);
  ctx.push(["فعالیت بدنی", optLabel("endo_activity", a.endo_activity)]);
  if (a.endo_interval)
    ctx.push(["فاصله سیکل", optLabel("endo_interval", a.endo_interval)]);
  ctx.push([
    "درمان هورمونی فعلی",
    a.endo_horm_now === "yes" ? "دارد" : "ندارد",
  ]);
  return {
    condKey: "endo",
    condTitle: "ارزیابی علائم اندومتریوز",
    score,
    max: MAX,
    scoreLabel: "امتیاز غربالگری اولیه",
    level,
    bands: [
      [0, 6, "پایین", "pos"],
      [7, 14, "قابل‌توجه", "warn"],
      [15, 29, "بالا", "concern"],
    ],
    message:
      level.cls === "pos"
        ? "در پاسخ‌های شما، الگوی علائم مرتبط با اندومتریوز پایین ارزیابی می‌شود؛ آگاهی از علائم و پایش آن‌ها ارزشمند است."
        : level.cls === "warn"
          ? "در پاسخ‌های شما چند علامت مرتبط با اندومتریوز دیده می‌شود؛ به‌ویژه در الگوی درد."
          : "الگوی علائم شما در محدوده بالایی قرار می‌گیرد و شایسته بررسی دقیق‌تر است.",
    next: "در صورت تداوم، شدت یا تأثیر علائم بر زندگی روزمره، ارزیابی پزشکی می‌تواند به بررسی دقیق‌تر کمک کند.",
    findings: F,
    specials: [],
    sections: [
      {
        title: "الگوی درد",
        type: "pain",
        items: [
          { label: "درد قاعدگی", v: painMen, max: 3 },
          { label: "درد لگنی (خارج از قاعدگی)", v: pelvic, max: 3 },
          { label: "درد هنگام رابطه", v: dysp, max: 3 },
          { label: "درد هنگام اجابت مزاج", v: bowel, max: 3 },
          { label: "درد هنگام ادرار", v: urineP, max: 2 },
        ],
      },
      {
        title: "حوزه‌های مرتبط با علائم",
        type: "bars",
        items: [
          { label: "علائم گوارشی (با سابقه IBS)", v: gi + ibs, max: 3 },
          { label: "علائم ادراری", v: urinary, max: 2 },
          { label: "خستگی", v: fatigue, max: 2 },
          { label: "باروری", v: infert, max: 2 },
        ],
      },
      { title: "زمینه بالینی شما", type: "chips", items: ctx },
    ],
  };
};

SCORERS.pcos = function (a) {
  const n = (id) => num(a[id]);
  const reg =
    { reg: 0, sometimes: 1, often: 2, very: 3, absent: 3 }[a.pcos_regular] ?? 0;
  const cl = { norm: 0, mid: 1, gt45: 2 }[a.pcos_cycle_len] ?? 0;
  const cy = { c10: 0, c8: 1, c6: 2, c5: 3 }[a.pcos_cycles_year] ?? 0;
  const hir = { none: 0, mild: 1, mod: 2, sev: 3 }[a.pcos_hirsut] ?? 0;
  const ac = { none: 0, mid: 1, sev: 1 }[a.pcos_acne] ?? 0;
  const hl = a.pcos_hairloss === "yes" ? 1 : 0;
  const acanth = a.pcos_acanth === "yes" ? 1 : 0;
  const wg = { none: 0, mid: 1, sev: 1 }[a.pcos_wgain] ?? 0;
  const conc = a.pcos_conceive === "yes" ? 1 : 0;
  const fam = a.pcos_fam === "yes" ? 1 : 0;
  const score = reg + cl + cy + hir + ac + hl + acanth + wg + conc + fam;
  /* سقف واقعی قابل‌دست‌یابی = ۳+۲+۳+۳+۱+۱+۱+۱+۱+۱ = ۱۷ (اصلاح‌شده در مرحلهٔ ۱ — قبلاً ۲۳ اعلام می‌شد) */
  const MAX = 17;
  const level =
    score <= 5
      ? { cls: "pos", label: "ریسک پایین" }
      : score <= 11
        ? { cls: "warn", label: "ریسک متوسط" }
        : { cls: "concern", label: "ریسک بالا" };
  const cycle = reg + cl + cy,
    andro = hir + ac + hl + acanth;
  const F = [];
  if (cycle >= 3)
    F.push({
      icon: "cal",
      cls: cycle >= 6 ? "concern" : "warn",
      title: "الگوی قاعدگی نامنظم",
      desc:
        reg === 3
          ? "قاعدگی قطع طولانی‌مدت گزارش شد."
          : "نظم یا تکرار قاعدگی خارج از محدوده معمول است.",
    });
  if (hir >= 2)
    F.push({
      icon: "act",
      cls: hir === 3 ? "concern" : "warn",
      title: "رشد موهای زائد",
      desc: "در محدوده متوسط تا شدید گزارش شد.",
    });
  else if (hir === 1)
    F.push({ icon: "act", cls: "info", title: "رشد خفیف موهای زائد" });
  if (a.pcos_acne && a.pcos_acne !== "none")
    F.push({
      icon: "act",
      cls: "info",
      title: "آکنه",
      desc: optLabel("pcos_acne", a.pcos_acne),
    });
  if (hl) F.push({ icon: "act", cls: "info", title: "ریزش مو با الگوی زنانه" });
  if (acanth)
    F.push({
      icon: "act",
      cls: "warn",
      title: "تغییرات پوستی",
      desc: "تیرگی یا ضخیم‌شدن پوست در مناطق مشخص.",
    });
  if (wg)
    F.push({
      icon: "act",
      cls: "info",
      title: "افزایش وزن اخیر",
      desc: optLabel("pcos_wgain", a.pcos_wgain),
    });
  if (conc) F.push({ icon: "rings", cls: "warn", title: "چالش در باردار شدن" });
  if (fam)
    F.push({
      icon: "user",
      cls: "info",
      title: "سابقه خانوادگی PCOS",
      desc: "در بستگان گزارش شده است.",
    });
  if (!F.length)
    F.push({
      icon: "check",
      cls: "pos",
      title: "ویژگی برجسته‌ای دیده نشد",
      desc: "در پاسخ‌های شما الگوی مشخصی از علائم مرتبط با PCOS دیده نشد.",
    });
  const ctx = [];
  const b = bmiOf(a, "pcos");
  if (b) ctx.push(["BMI", `${faDec(b.v)} · ${b.cat}`]);
  if (n("pcos_age")) ctx.push(["سن", fa(n("pcos_age")) + " سال"]);
  ctx.push(["کاهش وزن", optLabel("pcos_wloss", a.pcos_wloss)]);
  ctx.push(["فعالیت بدنی", optLabel("pcos_activity", a.pcos_activity)]);
  ctx.push(["الگوی غذایی", optLabel("pcos_diet", a.pcos_diet)]);
  if (a.pcos_preg)
    ctx.push([
      "سابقه بارداری",
      a.pcos_preg === "yes"
        ? optLabel("pcos_preg_out", a.pcos_preg_out)
        : "نداشته‌ام",
    ]);
  return {
    condKey: "pcos",
    condTitle: "ارزیابی علائم PCOS",
    score,
    max: MAX,
    scoreLabel: "امتیاز غربالگری اولیه",
    level,
    bands: [
      [0, 5, "پایین", "pos"],
      [6, 11, "متوسط", "warn"],
      [12, 17, "بالا", "concern"],
    ],
    message:
      level.cls === "pos"
        ? "در پاسخ‌های شما ویژگی‌های مرتبط با PCOS به‌شکل برجسته‌ای دیده نمی‌شود."
        : level.cls === "warn"
          ? "در پاسخ‌های شما چند ویژگی مرتبط با PCOS دیده می‌شود؛ پایش علائم می‌تواند مفید باشد."
          : "در پاسخ‌های شما چند ویژگی مرتبط با PCOS دیده می‌شود؛ به‌ویژه در الگوی قاعدگی و علائم مرتبط با افزایش آندروژن.",
    next: "در صورت تداوم علائم یا نگرانی درباره باروری، بررسی پزشکی می‌تواند مطرح باشد.",
    findings: F,
    specials: [],
    sections: [
      {
        title: "پروفایل حوزه‌های اصلی",
        type: "bars",
        items: [
          { label: "الگوی قاعدگی", v: cycle, max: 8 },
          { label: "علائم مرتبط با آندروژن", v: andro, max: 6 },
          { label: "باروری", v: conc, max: 1 },
          { label: "سابقه خانوادگی", v: fam, max: 1 },
          { label: "افزایش وزن اخیر", v: wg, max: 1 },
        ],
      },
      { title: "زمینه بالینی و سبک زندگی", type: "chips", items: ctx },
    ],
  };
};

SCORERS.poi = function (a) {
  const n = (id) => num(a[id]);
  let score = 0;
  const flags = {};
  const age = n("poi_age");
  if (age != null) {
    if (age >= 40) flags.age40 = true;
    else if (age >= 35) score += 2;
    else if (age >= 30) score += 1;
  }
  let men = 0;
  if (a.poi_status === "stopped") men = 4;
  else {
    const py =
      { "10_12": 0, "8_9": 1, "6_7": 2, "4_5": 3, lt4: 3 }[a.poi_per_year] ?? 0;
    const iv = { "21_35": 0, "36_90": 2, gt90: 3, var: 2 }[a.poi_interval] ?? 0;
    const gp = { lt3: 0, "3_4": 3, "4_6": 4, gt6: 4, preg: 0 }[a.poi_gap] ?? 0;
    men = Math.max(py, iv, gp);
  }
  const chg = a.poi_change === "yes" ? 1 : 0;
  const amen = { no: 0, temp: 1, long: 2 }[a.poi_amen] ?? 0;
  const SYMS = ["fl", "ns", "sl", "dry", "dys", "lib", "mood", "foc", "fat"];
  const symCount = SYMS.filter((s) => {
    const v = a["poi_sym_" + s];
    return v === "freq" || v === "sev";
  }).length;
  const hypo = symCount === 0 ? 0 : symCount <= 2 ? 1 : symCount <= 4 ? 2 : 3;
  const fert = { no: 0, unev: 1, inf: 2 }[a.poi_conceive] ?? 0;
  const fam = Math.max(
    a.poi_fam_poi === "yes" ? 2 : 0,
    a.poi_fam_meno === "yes" ? 2 : 0,
    { no: 0, other: 3, fmr1: 4, turner: 4 }[a.poi_genetic] ?? 0,
  );
  const auto = Math.min(
    3,
    Math.max(
      a.poi_auto === "yes" ? 2 : 0,
      a.poi_thyroid === "yes" ? 1 : 0,
      a.poi_t1d === "yes" ? 2 : 0,
      a.poi_addison === "yes" ? 3 : 0,
    ),
  );
  const injItems = [];
  let inj = 0;
  const addInj = (cond, pts, txt) => {
    if (cond) {
      inj = Math.max(inj, pts);
      injItems.push(txt);
    }
  };
  addInj(a.poi_chemo === "yes", 4, "شیمی‌درمانی");
  addInj(a.poi_rt === "yes", 4, "رادیوتراپی لگن یا شکم");
  addInj(a.poi_uni_oo === "yes", 3, "برداشت یک تخمدان");
  addInj(a.poi_osurg === "yes", 2, "جراحی تخمدان");
  addInj(a.poi_cyst_surg === "yes", 2, "جراحی کیست یا اندومتریوما");
  if (a.poi_bi_oo === "yes") {
    flags.biOO = true;
    injItems.push("برداشت هر دو تخمدان");
  }
  score += men + chg + amen + hypo + fert + fam + auto + inj;
  const fshV = num(a.poi_lab_fsh);
  if (fshV != null && fshV > 25 && men >= 2) flags.labOverride = true;
  /* سقف واقعی قابل‌دست‌یابی = سن ۲ + قاعدگی ۴ + تغییر ۱ + آمنوره ۲ + علائم ۳ + باروری ۲
     + خانوادگی/ژنتیک ۴ + خودایمنی ۳ + آسیب تخمدان ۴ = ۲۵ (اصلاح‌شده در مرحلهٔ ۱ — قبلاً ۳۱ اعلام می‌شد) */
  const MAX = 25;
  const level =
    score <= 5
      ? { cls: "pos", label: "نگرانی پایین" }
      : score <= 10
        ? { cls: "warn", label: "نگرانی متوسط" }
        : score <= 17
          ? { cls: "accent", label: "نگرانی قابل‌توجه" }
          : { cls: "concern", label: "نگرانی بالا" };
  const F = [];
  if (men >= 2)
    F.push({
      icon: "cal",
      cls: men >= 4 ? "concern" : "warn",
      title: "اختلال الگوی قاعدگی",
      desc:
        a.poi_status === "stopped"
          ? "قاعدگی شما در حال حاضر قطع شده است."
          : "نظم یا تکرار قاعدگی شما خارج از محدوده معمول گزارش شد.",
    });
  if (chg)
    F.push({ icon: "cal", cls: "info", title: "تغییر اخیر در الگوی قاعدگی" });
  if (amen)
    F.push({
      icon: "cal",
      cls: amen === 2 ? "warn" : "info",
      title: "سابقه قطع قاعدگی",
      desc: optLabel("poi_amen", a.poi_amen),
    });
  if (symCount)
    F.push({
      icon: "act",
      cls: hypo >= 2 ? "concern" : "warn",
      title: "علائم مرتبط با کاهش استروژن",
      desc: `${fa(symCount)} علامت به‌صورت مکرر یا شدید گزارش شد.`,
    });
  if (fert)
    F.push({
      icon: "rings",
      cls: "warn",
      title: "چالش در بارداری",
      desc: optLabel("poi_conceive", a.poi_conceive),
    });
  if (fam)
    F.push({
      icon: "user",
      cls: fam >= 3 ? "concern" : "warn",
      title: "سابقه خانوادگی یا ژنتیکی",
      desc: fam >= 4 ? "شامل شرایط ژنتیکی مرتبط شناخته‌شده." : "",
    });
  if (auto)
    F.push({ icon: "act", cls: "warn", title: "بیماری خودایمنی یا غدد همراه" });
  if (inj && !flags.biOO)
    F.push({
      icon: "flask",
      cls: "concern",
      title: "عوامل مؤثر بر عملکرد تخمدان",
      desc: injItems.join("، "),
    });
  if (flags.biOO)
    F.push({
      icon: "flask",
      cls: "concern",
      title: "سابقه جراحی تخمدان",
      desc: "برداشت هر دو تخمدان گزارش شد.",
    });
  if (!F.length)
    F.push({
      icon: "check",
      cls: "pos",
      title: "الگوی محدود",
      desc: "موارد قابل‌توجهی در پاسخ‌های شما دیده نشد.",
    });
  const specials = [];
  if (flags.biOO)
    specials.push({
      cls: "concern",
      icon: "alert",
      title: "سابقه برداشت هر دو تخمدان",
      text: "این موضوع یک زمینه بالینی مهم است و تفسیر علائم و نتایج آزمایش نیازمند بررسی پزشکی است.",
    });
  if (flags.labOverride)
    specials.push({
      cls: "warn",
      icon: "alert",
      title: "الگوی بالینی و آزمایشگاهی قابل‌توجه",
      text: "الگوی بالینی و آزمایشگاهی قابل‌توجه از نظر کاهش عملکرد تخمدان مشاهده شده است؛ بررسی پزشکی تخصصی توصیه می‌شود.",
    });
  if (flags.age40)
    specials.push({
      cls: "info",
      icon: "info",
      title: "زمینه سنی",
      text: "با توجه به سن ۴۰ سال یا بیشتر، تغییرات قاعدگی می‌تواند در چارچوب نزدیک‌شدن به یائسگی طبیعی نیز بررسی شود؛ تفسیر این موضوع با پزشک انجام می‌شود.",
    });
  const ctx = [];
  const b = bmiOf(a, "poi");
  if (b) ctx.push(["BMI", `${faDec(b.v)} · ${b.cat}`]);
  if (age != null) ctx.push(["سن", fa(age) + " سال"]);
  ctx.push(["سیگار", optLabel("poi_smoke", a.poi_smoke)]);
  if (a.poi_intense === "yes") ctx.push(["فعالیت بدنی شدید", "دارد"]);
  if (a.poi_wloss === "yes") ctx.push(["کاهش وزن / محدودیت غذایی", "دارد"]);
  if (a.poi_preg_poss && a.poi_preg_poss !== "no")
    ctx.push(["احتمال بارداری", optLabel("poi_preg_poss", a.poi_preg_poss)]);
  if (a.poi_birth12 === "yes") ctx.push(["زایمان در ۱۲ ماه اخیر", "دارد"]);
  if (a.poi_bf === "yes") ctx.push(["شیردهی", "دارد"]);
  if (a.poi_horm && a.poi_horm !== "no")
    ctx.push(["درمان هورمونی فعلی", optLabel("poi_horm", a.poi_horm)]);
  if (a.poi_mother && a.poi_mother !== "dk")
    ctx.push(["سن یائسگی مادر", optLabel("poi_mother", a.poi_mother)]);
  const labDefs = [
    ["poi_lab_fsh", "FSH", "IU/L"],
    ["poi_lab_e2", "Estradiol (E2)", "pg/mL"],
    ["poi_lab_amh", "AMH", "ng/mL"],
    ["poi_lab_tsh", "TSH", "mIU/L"],
    ["poi_lab_prol", "Prolactin", "ng/mL"],
  ];
  const labItems = [];
  labDefs.forEach(([id, name, unit]) => {
    const v = num(a[id]);
    if (v == null) return;
    labItems.push({
      name,
      unit,
      val: faN(v),
      date: a[id + "_date"] || "",
      hl: id === "poi_lab_fsh" && flags.labOverride,
    });
  });
  return {
    condKey: "poi",
    condTitle: "ارزیابی علائم POI",
    score,
    max: MAX,
    scoreLabel: "امتیاز نگرانی (غربالگری اولیه)",
    level,
    bands: [
      [0, 5, "پایین", "pos"],
      [6, 10, "متوسط", "warn"],
      [11, 17, "قابل‌توجه", "accent"],
      [18, 25, "بالا", "concern"],
    ],
    message: flags.biOO
      ? "با توجه به سابقه جراحی تخمدان شما، تفسیر این ارزیابی نیازمند بررسی پزشکی است."
      : level.cls === "pos"
        ? "در پاسخ‌های شما الگوی نگرانی پایینی درباره عملکرد تخمدان دیده می‌شود."
        : level.cls === "warn"
          ? "در پاسخ‌های شما چند مورد قابل‌توجه وجود دارد که پیگیری و پایش آن‌ها مفید است."
          : level.cls === "accent"
            ? "الگوی پاسخ‌های شما قابل‌توجه است و شایسته بررسی بیشتر است."
            : "الگوی پاسخ‌های شما در محدوده بالایی قرار می‌گیرد و بررسی تخصصی می‌تواند کمک‌کننده باشد.",
    next: flags.labOverride
      ? "بررسی پزشکی تخصصی توصیه می‌شود؛ در صورت تداوم یا تشدید علائم، مشورت با پزشک متخصص زنان نیز می‌تواند به روشن‌تر شدن وضعیت کمک کند."
      : "در صورت تداوم یا تشدید علائم، مشورت با پزشک متخصص زنان می‌تواند به روشن‌تر شدن وضعیت کمک کند.",
    findings: F,
    specials,
    sections: [
      {
        title: "پروفایل حوزه‌های ارزیابی",
        type: "bars",
        items: [
          {
            label: "الگوی قاعدگی (شامل تغییر اخیر و سابقه آمنوره)",
            v: men + chg + amen,
            max: 7,
          },
          { label: "علائم مرتبط با کاهش استروژن", v: hypo, max: 3 },
          { label: "باروری", v: fert, max: 2 },
          { label: "سابقه خانوادگی و ژنتیک", v: fam, max: 4 },
          { label: "بیماری‌های خودایمنی", v: auto, max: 3 },
          { label: "آسیب تخمدان و درمان‌ها", v: inj, max: 4 },
        ],
      },
      { title: "زمینه و عوامل مؤثر بر تفسیر", type: "chips", items: ctx },
      ...(labItems.length
        ? [{ title: "اطلاعات آزمایشگاهی شما", type: "labs", items: labItems }]
        : []),
    ],
  };
};

function scorePedt(a) {
  let total = 0;
  PEDT_ITEMS.forEach(([k]) => (total += mv(a, k)));
  const level =
    total <= 8
      ? { cls: "pos", label: "احتمال پایین علائم انزال زودرس" }
      : total <= 10
        ? { cls: "warn", label: "احتمال مرزی — نیازمند بررسی بیشتر" }
        : { cls: "concern", label: "احتمال بالاتر علائم انزال زودرس" };
  const findings = [];
  PEDT_ITEMS.forEach(([k, topic]) => {
    const p = mv(a, k);
    if (p >= 3)
      findings.push({
        icon: "act",
        cls: p >= 4 ? "concern" : "warn",
        title: topic,
        desc: optOf("pedt", k, p),
      });
  });
  if (!findings.length)
    findings.push({
      icon: "check",
      cls: "pos",
      title: "الگوی محدود",
      desc: "هیچ‌یک از سؤالات، امتیاز قابل‌توجهی نشان نمی‌دهد.",
    });
  return {
    condKey: "pedt",
    condTitle: "غربالگری علائم انزال زودرس (PEDT)",
    backView: "men",
    backLabel: "سلامت مردان",
    score: total,
    max: 20,
    scoreLabel: "مجموع امتیاز PEDT",
    level,
    bands: [
      [0, 8, "پایین", "pos"],
      [9, 10, "مرزی", "warn"],
      [11, 20, "بالاتر", "concern"],
    ],
    message:
      total <= 8
        ? "پاسخ‌های شما نشانه قابل‌توجهی از مشکل کنترل انزال نشان نمی‌دهد."
        : total <= 10
          ? "برخی پاسخ‌های شما با علائم مرتبط با انزال زودرس همراه است. بررسی دقیق‌تر می‌تواند مفید باشد."
          : "پاسخ‌های شما با احتمال بالاتر علائم انزال زودرس همراه است. ارزیابی تخصصی می‌تواند به بررسی دقیق‌تر کمک کند.",
    findings,
    specials: [],
    sections: [
      {
        title: "امتیاز هر سؤال",
        type: "bars",
        items: PEDT_ITEMS.map(([k, topic]) => ({ label: topic, v: mv(a, k), max: 4 })),
      },
    ],
    next:
      total <= 8
        ? "در صورت تغییر علائم یا ایجاد نگرانی جدید، مشورت با پزشک می‌تواند کمک‌کننده باشد."
        : "برای بررسی دقیق‌تر، مشورت با پزشک متخصص اورولوژی توصیه می‌شود؛ این نتیجه به معنی تشخیص نیست.",
  };
}

function scoreShim(a) {
  let total = 0;
  SHIM_ITEMS.forEach(([k]) => (total += mv(a, k)));
  const noActivity = SHIM_NOACT_KEYS.some((k) => mv(a, k) === 0);
  const noActivityFlag =
    "در یک یا چند سؤال، گزینه «تلاشی برای رابطه جنسی انجام نشده» انتخاب شده است. این گزینه ۰ امتیاز محاسبه می‌شود و می‌تواند نمره کل را پایین‌تر از الگوی واقعی عملکرد نشان دهد.";
  const specials = noActivity
    ? [{ cls: "warn", icon: "info", title: "گزینه «تلاشی انجام نشده»", text: noActivityFlag }]
    : [];
  const findings = [];
  SHIM_ITEMS.forEach(([k, topic]) => {
    const p = mv(a, k);
    findings.push({
      icon: p >= 4 ? "check" : p >= 3 ? "info" : "act",
      cls: p >= 4 ? "pos" : p >= 3 ? "warn" : "concern",
      title: topic,
      desc: optOf("shim", k, p),
    });
  });
  /* اصلاح‌شده در مرحلهٔ ۱: با هر پاسخ «تلاشی انجام نشده» نمرهٔ کل طبق روش SHIM قابل تفسیر نیست —
     مستقل از مقدار سؤال ۱ و مستقل از جمع کل (قبلاً فقط total<5 این مسیر می‌رفت و با جمع ≥۵ برچسب
     «شدید» با هشدار «تلاشی انجام نشده» در تضاد بود) */
  if (noActivity) {
    return {
      condKey: "shim",
      condTitle: "ارزیابی عملکرد نعوظ (SHIM / IIEF-5)",
      backView: "men",
      backLabel: "سلامت مردان",
      /* بدون نمرهٔ نمایشی — چون نمره در این حالت معنا ندارد و UI بدون حلقهٔ امتیاز رندر می‌کند */
      score: null,
      max: null,
      scoreLabel: "مجموع امتیاز IIEF-5",
      level: { cls: "info", label: "قابل تفسیر با معیارهای معمول نیست" },
      bands: [],
      message:
        "چون در یک یا چند سؤال گزینه «تلاشی برای رابطه جنسی انجام نشده» انتخاب شده است، نمره کل با معیارهای معمول SHIM قابل تفسیر نیست. این نتیجه نشانه ضعف عملکرد نیست؛ ارزیابی در دوره‌ای که رابطه جنسی در جریان باشد معتبرتر است.",
      findings,
      specials,
      sections: [],
      next:
        "در دوره‌ای که رابطه جنسی در جریان است، پاسخ به این پرسشنامه معتبرتر خواهد بود. در صورت تداوم نگرانی، مشورت با پزشک مفید است.",
    };
  }
  const level =
    total >= 22
      ? { cls: "pos", label: "بدون شواهد قابل‌توجه از اختلال نعوظ" }
      : total >= 17
        ? { cls: "warn", label: "علائم در محدوده خفیف" }
        : total >= 12
          ? { cls: "warn", label: "علائم در محدوده خفیف تا متوسط" }
          : total >= 8
            ? { cls: "concern", label: "علائم در محدوده متوسط" }
            : { cls: "concern", label: "علائم در محدوده شدید" };
  return {
    condKey: "shim",
    condTitle: "ارزیابی عملکرد نعوظ (SHIM / IIEF-5)",
    backView: "men",
    backLabel: "سلامت مردان",
    score: total,
    max: 25,
    scoreLabel: "مجموع امتیاز IIEF-5",
    level,
    bands: [
      [5, 7, "شدید", "concern"],
      [8, 11, "متوسط", "concern"],
      [12, 16, "خفیف تا متوسط", "warn"],
      [17, 21, "خفیف", "warn"],
      [22, 25, "مطلوب", "pos"],
    ],
    message: `امتیاز شما نشان می‌دهد علائم مرتبط با عملکرد نعوظ در محدوده «${level.label.replace("علائم در محدوده ", "").replace("بدون شواهد قابل‌توجه از اختلال نعوظ", "مطلوب")}» قرار دارد.`,
    findings,
    specials,
    sections: [],
    next:
      total >= 22
        ? "حفظ سبک زندگی سالم به حفظ این وضعیت کمک می‌کند. در صورت تغییر، ارزیابی مجدد مفید است."
        : "در صورت تداوم نگرانی، مشورت با پزشک متخصص اورولوژی می‌تواند به روشن‌تر شدن وضعیت کمک کند.",
  };
}

function scoreCpsi(a) {
  let locationSum = 0;
  const locNames = [];
  CPSI_LOCS.forEach(([k, topic]) => {
    if (mv(a, k) === 1) {
      locationSum += 1;
      locNames.push(topic);
    }
  });
  const q2u = mv(a, "cpsi_q2_urination");
  const q2e = mv(a, "cpsi_q2_ejaculation");
  const freq = mv(a, "cpsi_q3");
  const sev = mv(a, "cpsi_q4");
  const pain = locationSum + q2u + q2e + freq + sev;
  const urinary = mv(a, "cpsi_q5") + mv(a, "cpsi_q6");
  const qol = mv(a, "cpsi_q7") + mv(a, "cpsi_q8") + mv(a, "cpsi_q9");
  const total = pain + urinary + qol;
  const burden = (r) => (r >= 0.67 ? "قابل‌توجه" : r >= 0.34 ? "متوسط" : "کم");
  const painLabel = `بار درد ${burden(pain / 21)}`;
  const urinaryLabel = `علائم ادراری ${burden(urinary / 10)}`;
  const qolLabel = `تأثیر بر کیفیت زندگی ${burden(qol / 12)}`;
  const findings = [];
  if (locNames.length)
    findings.push({
      icon: "act",
      cls: "warn",
      title: "نواحی درد اعلام‌شده",
      desc: locNames.join("، "),
    });
  if (q2u === 1)
    findings.push({ icon: "act", cls: "warn", title: "درد هنگام ادرار", desc: "در هفته گذشته گزارش شده است." });
  if (q2e === 1)
    findings.push({ icon: "act", cls: "warn", title: "درد هنگام یا پس از انزال", desc: "در هفته گذشته گزارش شده است." });
  if (freq >= 3)
    findings.push({ icon: "clock", cls: "warn", title: "تکرار نسبتاً بالا یا مداوم درد", desc: optOf("cpsi", "cpsi_q3", freq) });
  if (qol / 12 >= 0.5)
    findings.push({ icon: "alert", cls: "concern", title: "تأثیر قابل‌توجه بر کیفیت زندگی", desc: "علائم به‌طور محسوسی بر زندگی روزمره اثر گذاشته‌اند." });
  if (!findings.length)
    findings.push({ icon: "check", cls: "pos", title: "بار علائم کم", desc: "در سه دامنه ارزیابی، موارد قابل‌توجهی دیده نشد." });
  return {
    condKey: "cpsi",
    condTitle: "ارزیابی علائم پروستات و درد لگنی (NIH-CPSI)",
    backView: "men",
    backLabel: "سلامت مردان",
    score: total,
    max: 43,
    scoreLabel: "مجموع امتیاز NIH-CPSI",
    level: { cls: "info", label: "ارزیابی بر پایه سه دامنه علائم" },
    bands: [],
    message: `${painLabel} • ${urinaryLabel} • ${qolLabel}`,
    findings,
    specials: [],
    sections: [
      {
        title: "پروفایل سه دامنه",
        type: "bars",
        items: [
          { label: "درد", v: pain, max: 21 },
          { label: "علائم ادراری", v: urinary, max: 10 },
          { label: "کیفیت زندگی", v: qol, max: 12 },
        ],
      },
      {
        title: "جزئیات دامنه‌ها",
        type: "chips",
        items: [
          ["دامنه درد", `${fa(pain)} از ${fa(21)}`],
          ["دامنه ادراری", `${fa(urinary)} از ${fa(10)}`],
          ["کیفیت زندگی", `${fa(qol)} از ${fa(12)}`],
        ],
      },
    ],
    next:
      "این نتیجه به معنی تشخیص نیست. در صورت تداوم علائم یا ایجاد نگرانی، مشورت با پزشک متخصص اورولوژی توصیه می‌شود.",
  };
}

function scoreIpss(a) {
  let total = 0;
  IPSS_ITEMS.forEach(([k]) => (total += mv(a, k)));
  const q8 = mv(a, "ipss_q8");
  const level =
    total <= 7
      ? { cls: "pos", label: "علائم ادراری در محدوده خفیف" }
      : total <= 19
        ? { cls: "warn", label: "علائم ادراری در محدوده متوسط" }
        : { cls: "concern", label: "علائم ادراری در محدوده شدید" };
  const bandPersian = total <= 7 ? "خفیف" : total <= 19 ? "متوسط" : "شدید";
  return {
    condKey: "ipss",
    condTitle: "ارزیابی علائم ادراری و پروستات (IPSS)",
    backView: "men",
    backLabel: "سلامت مردان",
    score: total,
    max: 35,
    scoreLabel: "مجموع امتیاز IPSS (۷ سؤال)",
    level,
    bands: [
      [0, 7, "خفیف", "pos"],
      [8, 19, "متوسط", "warn"],
      [20, 35, "شدید", "concern"],
    ],
    message: `مجموع امتیاز علائم ادراری شما در محدوده ${bandPersian} قرار دارد.`,
    findings: IPSS_ITEMS.filter(([k]) => mv(a, k) >= 3).map(([k, topic]) => ({
      icon: "act",
      cls: mv(a, k) >= 4 ? "concern" : "warn",
      title: topic,
      desc: optOf("ipss", k, mv(a, k)),
    })).concat(
      IPSS_ITEMS.every(([k]) => mv(a, k) < 3)
        ? [{ icon: "check", cls: "pos", title: "علائم کم‌بروز", desc: "هیچ‌یک از علائم، تکرار قابل‌توجهی ندارد." }]
        : [],
    ),
    specials: [],
    sections: [
      {
        title: "امتیاز هر سؤال",
        type: "bars",
        items: IPSS_ITEMS.map(([k, topic]) => ({ label: topic, v: mv(a, k), max: 5 })),
      },
      {
        title: "کیفیت زندگی (جدا از امتیاز کل)",
        type: "chips",
        items: [["اثر علائم بر کیفیت زندگی", optOf("ipss", "ipss_q8", q8)]],
      },
    ],
    next:
      total <= 7
        ? "در صورت تغییر علائم، ارزیابی مجدد می‌تواند مفید باشد."
        : "در صورت تداوم یا آزاردهنده بودن علائم، مشورت با پزشک متخصص اورولوژی توصیه می‌شود.",
  };
}

function scoreAdam(a) {
  let yesCount = 0;
  ADAM_ITEMS.forEach(([k]) => (yesCount += mv(a, k) === 1 ? 1 : 0));
  const q1 = mv(a, "adam_q1");
  const q7 = mv(a, "adam_q7");
  const otherYes = ADAM_ITEMS.filter(([k]) => !ADAM_CORE.includes(k) && mv(a, k) === 1).length;
  const positive = q1 === 1 || q7 === 1 || otherYes >= 3;
  const drivers = ADAM_ITEMS.filter(([k]) => mv(a, k) === 1).map(([k, topic]) => ({
    icon: "act",
    cls: ADAM_CORE.includes(k) ? "concern" : "warn",
    title: topic,
    desc: "پاسخ «بله»",
  }));
  if (!drivers.length)
    drivers.push({
      icon: "check",
      cls: "pos",
      title: "الگوی واضحی دیده نشد",
      desc: "پاسخ «بله» به هیچ‌یک از سؤالات ثبت نشده است.",
    });
  return {
    condKey: "adam",
    condTitle: "غربالگری علائم کمبود آندروژن (ADAM)",
    backView: "men",
    backLabel: "سلامت مردان",
    score: null,
    max: null,
    scoreLabel: "نتیجه غربالگری",
    level: positive
      ? { cls: "concern", label: "غربالگری مثبت" }
      : { cls: "pos", label: "غربالگری منفی" },
    bands: [],
    message: positive
      ? "پاسخ‌های شما برخی علائم مرتبط با کمبود آندروژن را نشان می‌دهد. برای بررسی دقیق‌تر، ارزیابی بالینی و آزمایش‌های هورمونی می‌تواند مورد توجه قرار گیرد."
      : "پاسخ‌های شما در این غربالگری نشانه واضحی از الگوی مورد بررسی نشان نمی‌دهد.",
    findings: drivers,
    specials: [],
    sections: [
      {
        title: "خلاصه پاسخ‌ها",
        type: "chips",
        items: [
          ["تعداد پاسخ «بله»", `${fa(yesCount)} از ${fa(10)}`],
          ["پاسخ «بله» به ۸ سؤال دیگر", otherYes > 0 ? `${fa(otherYes)} از ${fa(8)}` : "ثبت نشده"],
        ],
      },
    ],
    next: positive
      ? "این نتیجه به معنی تشخیص کمبود هورمون نیست؛ ارزیابی بالینی و آزمایش‌های هورمونی ملاک تخصصی هستند. مشورت با پزشک توصیه می‌شود."
      : "در صورت تداوم یا ایجاد علائم جدید، مشورت با پزشک می‌تواند کمک‌کننده باشد.",
  };
}

const MEN_SCORERS = {
  pedt: scorePedt,
  shim: scoreShim,
  cpsi: scoreCpsi,
  ipss: scoreIpss,
  adam: scoreAdam,
};
Object.assign(SCORERS, MEN_SCORERS);

function swAdaptiveSteps(ctx, body, ans) {
  const steps = [];
  const q2 = ans.sw_q2, q3 = ans.sw_q3, q4 = ans.sw_q4, q9 = ans.sw_q9;
  const comfortTrig = ctx === "active" && typeof q4 === "number" && q4 <= 2;
  const desireTrig = typeof q2 === "number" && q2 <= 2;
  const responseTrig = ctx === "active" && typeof q3 === "number" && q3 <= 2;
  if (comfortTrig) {
    steps.push("sw_ad_comfort_type");
    if (ans.sw_ad_comfort_type === "pain") steps.push("sw_ad_pain_severity");
    if (body === "female") { steps.push("sw_ad_pelvic"); steps.push("sw_ad_life_stage"); }
  }
  if (desireTrig) steps.push("sw_ad_desire_factors");
  if (responseTrig) steps.push("sw_ad_response_factors");
  if (body === "male" && ((typeof q3 === "number" && q3 <= 2) || (typeof q9 === "number" && q9 >= 4)))
    steps.push("sw_ad_male_persistent");
  return steps;
}

/* ---------- Safety (overrides recommendations) ---------- */
function swSafetyTier(safety) {
  if (safety === "not_always") return "pathway";
  if (safety === "sometimes" || safety === "prefer_not") return "caution";
  return "ok";
}
function swClinicalFlags(ans, body) {
  const painSeverity = ans.sw_ad_pain_severity;
  const pelvic = ans.sw_ad_pelvic;
  const malePers = ans.sw_ad_male_persistent;
  const comfortType = ans.sw_ad_comfort_type;
  const painSevere = painSeverity === "severe";
  const painMild = !painSevere && (painSeverity === "mild" || painSeverity === "unsure" || comfortType === "pain");
  const pelvicRecurrent = pelvic === "often";
  const malePersistent = malePers === "persistent";
  const clinicalBridge = painSevere || pelvicRecurrent || malePersistent;
  return {
    painSevere, painMild, pelvicRecurrent, malePersistent,
    lifeStageContext: ans.sw_ad_life_stage === "yes",
    clinicalBridge,
    bridgeTarget: malePersistent && body === "male" ? "men" : body === "male" ? "men" : body === "female" ? "women" : "entry",
  };
}

/* ---------- Recommendation knowledge base ---------- */
function swRound1(v) { return Math.round(v * 10) / 10; }
function swAvg(arr) { return arr.length ? swRound1(arr.reduce((s, v) => s + v, 0) / arr.length) : null; }
function swBand(score) { return score >= 4 ? "strong" : score >= 3 ? "balanced" : "opportunity"; }
function swRow(id, emoji, label, score) {
  if (score == null) return { id, emoji, label, score: null, band: "not_assessed", bandLabel: "—" };
  const band = swBand(score);
  return { id, emoji, label, score, band, bandLabel: { strong: "خوب", balanced: "متوسط", opportunity: "نیازمند توجه" }[band] };
}

function swProfileRows(ans, ctx) {
  const g = (id) => {
    const v = Math.round(Number(ans[id]));
    return Number.isFinite(v) && v >= 1 && v <= 5 ? v : null;
  };
  const rev = (v) => 6 - v;
  const q1 = g("sw_q1"), q2 = g("sw_q2"), q3 = g("sw_q3"), q4 = g("sw_q4"),
    q5 = g("sw_q5"), q6 = g("sw_q6"), q7 = g("sw_q7"), q8 = g("sw_q8"), q9 = g("sw_q9");
  const act = ctx === "active";
  const rows = [];
  rows.push(swRow("desire", "💗", "میل", q2));
  if (act) {
    rows.push(swRow("response", "✨", "پاسخ و برانگیختگی", q3));
    rows.push(swRow("comfort", "🩷", "راحتی", q4));
  }
  const pleasure = act ? swAvg([q1, q5].filter((v) => v !== null)) : q1;
  rows.push(swRow(act ? "pleasure" : "satisfaction", "😊", act ? "رضایت و لذت" : "رضایت کلی", pleasure));
  if (act) rows.push(swRow("intimacy", "🤍", "صمیمیت", q6));
  rows.push(swRow("communication", "💬", "ارتباط", q7));
  const mb = q8 !== null && q9 !== null ? swAvg([rev(q8), rev(q9)]) : null;
  rows.push(swRow("mindBody", "🌿", "آرامش و تعادل ذهن و بدن", mb));
  return rows;
}

function swDetectPatterns(rows, ans, ctx, flags) {
  const by = (id) => rows.find((r) => r.id === id);
  const isOpp = (r) => r && r.band === "opportunity";
  const q9 = typeof ans.sw_q9 === "number" ? ans.sw_q9 : 0;
  const out = [];
  if (flags.painSevere)
    out.push({ ...SW_PATTERNS.comfort_low, insight: "راحتی تو اولویت است؛ در این شرایط، مسیر درست، بررسی تخصصی‌تر است نه تمرین‌های معمول.", recs: ["comf_signals", "comf_selfcare", "comf_education"] });
  else if (flags.pelvicRecurrent) out.push(SW_PATTERNS.pelvic_floor);
  else if (isOpp(by("comfort"))) out.push(SW_PATTERNS.comfort_low);
  if (isOpp(by("communication"))) out.push(SW_PATTERNS.communication_low);
  if (isOpp(by("intimacy"))) out.push(SW_PATTERNS.connection_low);
  if (q9 >= 4) out.push(SW_PATTERNS.pressure_high);
  if (isOpp(by("mindBody"))) out.push(SW_PATTERNS.mindbody_stress);
  const df = Array.isArray(ans.sw_ad_desire_factors) ? ans.sw_ad_desire_factors : [];
  const rf = Array.isArray(ans.sw_ad_response_factors) ? ans.sw_ad_response_factors : [];
  if (df.includes("sleep") || df.includes("fatigue") || rf.includes("stress")) out.push(SW_PATTERNS.sleep_fatigue);
  if (isOpp(by("response"))) out.push(SW_PATTERNS.response_low);
  if (isOpp(by("desire"))) out.push(SW_PATTERNS.desire_low);
  const pleas = by("pleasure") || by("satisfaction");
  if (isOpp(pleas)) {
    const rel = ["intimacy", "communication", "comfort", "mindBody"]
      .map((id) => by(id))
      .filter((r) => r && r.score !== null)
      .sort((x, y) => x.score - y.score)[0];
    const map = { intimacy: SW_PATTERNS.connection_low, communication: SW_PATTERNS.communication_low, comfort: SW_PATTERNS.comfort_low, mindBody: SW_PATTERNS.mindbody_stress };
    const sat = rel ? map[rel.id] : null;
    if (sat && !out.some((p) => p.id === sat.id)) out.push(sat);
  }
  const seen = new Set();
  return out.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
}

function swRecAllowed(recId, ctx, tier, flags) {
  const r = SW_RECS[recId];
  if (!r) return false;
  if (r[4] && (ctx !== "active" || tier !== "ok")) return false;
  if (r[5] && flags.painSevere) return false;
  if (r[5] && flags.pelvicRecurrent) return false;
  return true;
}

function swPickRecs(pattern, ctx, tier, flags, used) {
  return pattern.recs
    .filter((id) => swRecAllowed(id, ctx, tier, flags))
    .filter((id) => !used.has(id));
}

/* ---------- 7-day plan builder ---------- */
function swBuildPlan(ctx, tier, flags, patterns) {
  const used = new Set();
  const plan = [];
  const mk = (day, id, kind) => {
    const r = SW_RECS[id];
    plan.push({ day, emoji: r[0], title: r[1], desc: r[2], dur: r[3], kind: kind || "action", recId: id });
    used.add(id);
  };
  const partnerOk = ctx === "active" && tier === "ok";
  const A = patterns[0], B = patterns[1];
  const comm = patterns.find((p) => p.id === "communication_low");
  const conn = patterns.find((p) => p.id === "connection_low");
  mk(1, "breath_4_8");
  const nxt = (pat) => {
    if (!pat) return null;
    const r = swPickRecs(pat, ctx, tier, flags, used);
    return r.length ? r[0] : null;
  };
  const d2 = nxt(A);
  if (d2) mk(2, d2); else mk(2, "self_checkin");
  if (partnerOk && comm) {
    const cr = swPickRecs(comm, ctx, tier, flags, used);
    const pick = cr.includes("comm_i_statement") ? "comm_i_statement" : cr[0];
    if (pick) mk(3, pick); else mk(3, "solo_need_note");
  } else mk(3, "solo_need_note");
  if (partnerOk && conn && !used.has("conn_walk")) mk(4, "conn_walk");
  if (plan.length < 4) mk(4, "walk_solo");
  if (partnerOk && conn && !used.has("conn_affection")) mk(5, "conn_affection");
  else {
    const d5 = nxt(B);
    if (d5) mk(5, d5); else mk(5, "body_kindness");
  }
  plan.push({ day: 6, emoji: "🔁", title: "تکرار تمرینی که برایت مفیدتر بود", desc: "از تمرین‌های این هفته، همان که بیشترین آرامش یا راحتی را برایت داشت، امروز تکرار کن.", dur: "", kind: "action" });
  plan.push({ day: 7, emoji: "🔄", title: "بازبینی ۷ روزه", desc: "چند سؤال کوتاه: چه چیزی مفید بود، چه چیزی سخت، و کدام حوزه بهتر شده است.", dur: "", kind: "recheck" });
  return plan;
}

/* ---------- Full profile build ---------- */
function swBuildProfile(ctx, body, safety, ans) {
  const tier = swSafetyTier(safety);
  const flags = swClinicalFlags(ans, body);
  const rows = swProfileRows(ans, ctx);
  const patterns = swDetectPatterns(rows, ans, ctx, flags);
  const prio = { opportunity: 0, balanced: 1, strong: 2, not_assessed: 9 };
  const assessed = rows
    .map((row, i) => ({ row, i }))
    .filter((e) => e.row.score !== null && e.row.band !== "not_assessed")
    .sort((a, b) => prio[a.row.band] - prio[b.row.band] || a.row.score - b.row.score || a.i - b.i);
  const top = assessed.slice(0, 2).map((e) => e.row);
  const insights = top.map((row) => {
    const m = patterns.find((p) => p.rowId === row.id);
    return (m && m.insight) || "این بخش می‌تواند فرصت خوبی برای بهتر شدن باشد.";
  });
  const plan = swBuildPlan(ctx, tier, flags, patterns);
  return { context: ctx, body, safety, safetyTier: tier, flags, rows, top, insights, patterns, plan, createdAt: new Date().toISOString() };
}

/* ---------- State & persistence ---------- */
function swDefaultState() {
  return { step: "landing", ctx: null, body: null, safety: null, answers: {}, ci: 0, ad: [], ai: 0, profile: null, rc: {}, rci: 0, rcDone: false };
}
/* initial journey state (state itself is declared in the base script) */
function cyRecHasContent(r) {
  if (!r) return false;
  return !!(
    r.flow || r.start || r.end ||
    (r.symptoms && r.symptoms.length) ||
    (r.mood && r.mood.length) ||
    r.pain || r.energy || r.sleep ||
    (r.note && String(r.note).trim()) ||
    (r.extra && String(r.extra).trim())
  );
}

/* ---------- cycle math (pure functions over cyDb) ---------- */
function cyStarts() {
  return Object.keys(cyDb.days)
    .filter(function (k) { return cyDb.days[k].start; })
    .sort()
    .map(function (k) { return { key: k, jdn: JAL.keyToJdn(k), plen: cyDb.days[k].plen }; });
}

/* ============================================================
   موتور چرخه — «تقویم چرخه قاعدگی» (توابع خالص و قابل‌آزمون)
   ------------------------------------------------------------
   قواعد محاسبه — منبعِ واحد برای همهٔ رنگ‌ها/تاریخ‌ها/برچسب‌ها:
   * طول چرخه: تنظیم دستی کاربر → وگرنه میانگین فواصل معتبر
     (۱۵..۹۰ روز) آخرین ۶ شروع → وگرنه پیش‌فرض ۲۸ روز.
   * مدت پریود: هر شروع می‌تواند مدتِ خودش را داشته باشد (plen — اسنپ‌شات هنگام ثبت،
     قابل تغییر با کنترل «مدت پریود»)؛ نبودِ plen → تنظیم کاربر؛ پیش‌فرض ۶ روز متوالی.
     طول چرخه هرگز از مدت خون‌ریزی محاسبه نمی‌شود.
   * تخمک‌گذاری تخمینی: روزِ (طول چرخه − ۱۴) از شروع چرخه؛
     چرخهٔ ۲۸روزه → روز ۱۴، چرخهٔ ۲۴روزه → روز ۱۰.
   * پنجرهٔ باروری: پیوسته و عادی دقیقاً ۷ روز — از ۵ روز قبل تا ۱ روز پس از
     تخمک‌گذاری با احتساب دو سر (۲۸روزه → روزهای ۹ تا ۱۵).
     در کمبود اطلاعات (فاصلهٔ معتبر ۰ یا کم) یا نوسان زیاد چرخه‌ها، پنجره متناسب با
     عدم قطعیت گسترش می‌یابد تا حداکثر ~۱۴ روز — و این عدم قطعیت به کاربر نشان داده
     می‌شود (fertReason + یادداشت UI). روز تخمک‌گذاری با گسترش جابه‌جا نمی‌شود.
     روزهای پنجره پشت‌سرهم رنگ می‌گیرند و هم‌پوشانی با پریود حفظ می‌شود
     (رنگ پریود هیچ روز باروری را حذف نمی‌کند).
     پایان پریود و مدت پریود هیچ نقشی در محاسبهٔ پنجرهٔ باروری ندارند.
   * پریود بعدی: آخرین شروعِ ثبت‌شده + طول چرخه (۳+ چرخهٔ آینده).
   * همهٔ تاریخ‌ها jdn (شمارهٔ روز مطلق) هستند — بدون خطای یک‌روزه
     در مرز ماه/سال و سال کبیسه (موتور JAL).
   ============================================================ */
const CX_DEFAULT_CYCLE = 28;               /* پیش‌فرض وقتی دادهٔ کافی نیست */
const CX_DEFAULT_PERIOD = 6;               /* پیش‌فرض مدت پریود: ۶ روز متوالی */
const CX_OV_OFFSET = 14;                   /* تخمک‌گذاری = طول چرخه − ۱۴ */
/* پنجرهٔ باروری — عادی: دقیقاً ۷ روز متوالی (۵ روز قبل تا ۱ روز بعد از تخمک‌گذاری،
   با احتساب هر دو سر). با عدم قطعیت (کمبود اطلاعات یا نوسان چرخه‌ها) متناسب گسترش
   می‌یابد تا حداکثر ~۱۴ روز؛ گسترش بیشتر سمتِ قبل از تخمک‌گذاری است چون فاز لوتئال
   (~۱۴ روز) پایدارتر است. مدت پریود هیچ نقشی در این محاسبه ندارد. */
const CX_FERT_LEVELS = [
  { b: 5, a: 1 },  /* سطح ۰ — عادی: ۷ روز */
  { b: 6, a: 2 },  /* سطح ۱ — ۹ روز */
  { b: 8, a: 2 },  /* سطح ۲ — ۱۱ روز */
  { b: 11, a: 2 }, /* سطح ۳ — حداکثر: ۱۴ روز */
];
const CX_PROJ_CYCLES = 8;                  /* چرخه‌های آینده برای تقویم */
const CX_MIN_IV = 15, CX_MAX_IV = 90, CX_RECENT = 6; /* فیلتر فواصل برای میانگین */
const CX_CYCLE_MIN = 15, CX_CYCLE_MAX = 60;   /* محدودهٔ مجاز تنظیم دستی طول چرخه */
const CX_PERIOD_MIN = 1, CX_PERIOD_MAX = 14;  /* محدودهٔ مجاز مدت پریود */
const CX_ADULT_LO = 21, CX_ADULT_HI = 35;  /* محدودهٔ معمول چرخهٔ بزرگسالان طبق ACOG */
const CX_LATE_TOL_MIN = 2, CX_LATE_TOL_MAX = 7; /* تحمل نرم برچسب دیرکرد (روز) — تأخیر ۱–۲ روزه در چرخهٔ نامنظم طبیعی است */

/* نرمال‌سازی تنظیمات کاربر (مقادیر نامعتبر → پیش‌فرض)
   نکتهٔ مهم: null/undefined/"" هرگز نباید به صفر و سپس به کفِ مجاز
   (۱۵ روز) بچسبد — null در cycleLenOverride یعنی «دستی نیست» و
   باید میانگین/پیش‌فرض اعمال شود، نه چرخهٔ ۱۵ روزه! */
function cxNormSettings(s) {
  s = s || {};
  let p = Math.round(Number(s.periodLen));
  if (!Number.isFinite(p) || p <= 0) p = CX_DEFAULT_PERIOD; /* null/خالی → پیش‌فرض ۶ */
  p = Math.max(CX_PERIOD_MIN, Math.min(CX_PERIOD_MAX, p));
  let c = Math.round(Number(s.cycleLenOverride));
  c = (Number.isFinite(c) && c > 0) ? Math.max(CX_CYCLE_MIN, Math.min(CX_CYCLE_MAX, c)) : null; /* null/صفر → دستی نیست */
  return { periodLen: p, cycleLenOverride: c };
}

/* مدل کامل چرخه — تنها ورودیِ تقویم، پنل روز و برچسب‌های پیش‌بینی
   startsJdn: آرایهٔ jdn شروع‌ها؛ settings: {periodLen, cycleLenOverride}؛ todayJdn
   lateTol: آستانهٔ تحمل برای «لحنِ» برچسب دیرکرد — از نیمِ پراکندگی چرخه‌ها (۲ تا ۷ روز).
     فقط نمایشی است؛ محاسبهٔ late/lateDays/nextStart و cxPhaseOf دست‌نخورده می‌ماند. */
function cxBuildModel(startsJdn, settings, todayJdn) {
  /* ورودی شروع‌ها: عدد jdn یا شیء {jdn, plen} — plen = مدت پریود همان چرخه (اسنپ‌شات) */
  const st = (startsJdn || [])
    .map(function (x) { return (x && typeof x === "object") ? x : { jdn: x }; })
    .filter(function (x) { return Number.isFinite(x.jdn) && x.jdn <= todayJdn; })
    .sort(function (a, b) { return a.jdn - b.jdn; });
  const S = cxNormSettings(settings);
  /* طول چرخه: دستی → میانگین فواصل معتبر → پیش‌فرض ۲۸ */
  const diffs = [];
  for (let i = 1; i < st.length; i++) diffs.push(st[i].jdn - st[i - 1].jdn);
  const used = diffs.slice(-CX_RECENT).filter(function (d) { return d >= CX_MIN_IV && d <= CX_MAX_IV; });
  let cycleLen, cycleLenSrc;
  if (S.cycleLenOverride) {
    cycleLen = S.cycleLenOverride; cycleLenSrc = "manual";
  } else if (used.length) {
    cycleLen = Math.round(used.reduce(function (s, v) { return s + v; }, 0) / used.length);
    cycleLenSrc = "avg";
  } else {
    cycleLen = CX_DEFAULT_CYCLE; cycleLenSrc = "default";
  }
  /* مدت پریود هر چرخه: اسنپ‌شاتِ همان شروع (plen) → وگرنه تنظیم کاربر.
     کاربر می‌تواند مدت پریود را در هر ثبت تغییر دهد (۵ روز یک بار، ۶ روز بار دیگر) */
  function plenOf(i) {
    const n = Math.round(Number(st[i] && st[i].plen));
    return (Number.isFinite(n) && n >= CX_PERIOD_MIN) ? Math.min(CX_PERIOD_MAX, n) : S.periodLen;
  }
  /* پنجرهٔ باروری — سطح عدم قطعیت (بند ۳ مشخصه):
     عادی (≥۳ فاصلهٔ منظم): دقیقاً ۷ روز = ۵ روز قبل تا ۱ روز بعد از تخمک‌گذاری.
     کمبود اطلاعات یا نوسان (بیشترین−کمترینِ فاصله‌های معتبر) → گسترش متناسب تا ~۱۴ روز:
       نوسان ۴–۶ روز → سطح ۱ (۹ روز)      نوسان ۷–۹ روز → سطح ۲ (۱۱ روز)
       نوسان ۱۰+ یا نبود فاصلهٔ معتبر → سطح ۳ (۱۴ روز)؛ تنها ۱–۲ فاصله → حداقل سطح ۱
     گسترش عمدتاً سمت قبل از تخمک‌گذاری است (فاز لوتئال پایدار است)؛
     مدت پریود هیچ نقشی در این محاسبه ندارد و روز تخمک‌گذاری جابه‌جا نمی‌شود. */
  let spread = 0;
  if (used.length >= 2) {
    let mn = used[0], mx = used[0];
    for (let i = 1; i < used.length; i++) {
      if (used[i] < mn) mn = used[i];
      if (used[i] > mx) mx = used[i];
    }
    spread = mx - mn;
  }
  let fertExtra = 0, fertReason = null; /* none | thin | var — برای نمایش عدم قطعیت به کاربر */
  if (used.length === 0) {
    fertExtra = 3; fertReason = "none";            /* هیچ فاصلهٔ معتبر — پیش‌فرض ۲۸ با ابهام کامل */
  } else if (used.length < 3) {
    fertExtra = Math.max(1, spread >= 10 ? 3 : spread >= 7 ? 2 : spread >= 4 ? 1 : 0);
    fertReason = spread >= 4 ? "var" : "thin";     /* ۱–۲ فاصله = دادهٔ کم */
  } else {
    fertExtra = spread >= 10 ? 3 : spread >= 7 ? 2 : spread >= 4 ? 1 : 0;
    if (fertExtra > 0) fertReason = "var";
  }
  const LV = CX_FERT_LEVELS[Math.min(fertExtra, CX_FERT_LEVELS.length - 1)];
  const fertBefore = LV.b;                         /* ۵ تا ۱۱ روز قبل از تخمک‌گذاری */
  const fertAfter = LV.a;                          /* ۱ تا ۲ روز بعد — پنجره همیشه ≥ ۷ روز */
  const periodLen = st.length ? plenOf(st.length - 1) : S.periodLen; /* مدت مؤثر فعلی */
  /* چرخه‌های واقعی (شروع ثبت‌شده تا شروع بعدی) + چرخه‌های پیش‌بینی‌شده */
  const cycles = [];
  for (let i = 0; i < st.length; i++) {
    const hasNext = i + 1 < st.length;
    const observedLen = hasNext ? st[i + 1].jdn - st[i].jdn : null;
    cycles.push({
      s: st[i].jdn,
      e: hasNext ? st[i + 1].jdn : st[i].jdn + cycleLen,
      proj: false,
      plen: plenOf(i),
      /* برای چرخه‌های تاریخی از فاصلهٔ واقعیِ دو شروع استفاده می‌شود؛
         چرخهٔ فعلی و آینده‌ها بر اساس طول چرخهٔ برآوردشده محاسبه می‌شوند. */
      estimateLen: hasNext && observedLen >= CX_MIN_IV && observedLen <= CX_MAX_IV ? observedLen : cycleLen,
    });
  }
  let lastStart = st.length ? st[st.length - 1].jdn : null;
  if (lastStart !== null) {
    let ns = lastStart + cycleLen;
    for (let k = 0; k < CX_PROJ_CYCLES; k++) {
      cycles.push({ s: ns, e: ns + cycleLen, proj: true, plen: periodLen, estimateLen: cycleLen });
      ns += cycleLen;
    }
  }
  /* برای هر چرخه: تخمک‌گذاری، پنجرهٔ باروری و آخرین روز پریود — همه jdn.
     چرخه‌های تاریخی از طول واقعی ثبت‌شده و چرخهٔ فعلی/آینده از میانگین استفاده می‌کنند.
     بازهٔ محاسباتی ممکن است با پریود هم‌پوشانی داشته باشد؛ لایهٔ نمایش در تقویم
     در این حالت رنگ و برچسب پریود را در اولویت می‌گذارد. */
  cycles.forEach(function (c) {
    const ovDay = c.estimateLen - CX_OV_OFFSET;       /* شمارهٔ روز تخمک‌گذاری */
    c.ov = c.s + ovDay - 1;                           /* jdn تخمک‌گذاری */
    c.wf = Math.max(c.s, c.ov - fertBefore);          /* شروع پنجره (پهن‌تر با عدم قطعیت) */
    c.wt = c.ov + fertAfter;                          /* پایان پنجره — پیوسته، بدون گپ */
    c.pe = c.s + c.plen - 1;                          /* آخرین روز پریود با مدتِ همان چرخه */
  });
  const cur = lastStart !== null ? cycles[st.length - 1] : null;
  const late = cur ? todayJdn > lastStart + cycleLen : false;
  /* تغییر ۱: آستانهٔ نرم برچسب دیرکرد — فقط خواندنی برای لایهٔ نمایش (app.js) */
  const lateTol = Math.min(CX_LATE_TOL_MAX, Math.max(CX_LATE_TOL_MIN, Math.ceil(spread / 2)));
  return {
    st: st, diffs: diffs, used: used,
    cycleLen: cycleLen, cycleLenSrc: cycleLenSrc,
    periodLen: periodLen, settings: S,
    fertExtra: fertExtra, fertReason: fertReason, fertBefore: fertBefore, fertAfter: fertAfter,
    cycles: cycles, cur: cur, lastStart: lastStart,
    late: late, lateDays: late ? todayJdn - (lastStart + cycleLen) : 0,
    nextStart: lastStart !== null ? lastStart + cycleLen : null,
    lateTol: lateTol,
  };
}

/* دسته‌بندی یک روز از مدل — تنها راه رنگ و برچسب‌زدن روزها
   خروجی: {p, day, ov, fert, per, perPred, perCont, lite, proj, c} یا null
   p: mens | foll | ovul (پنجرهٔ باروری) | lut
   lite: روزهای «بعد از پایان پریود تا شروع پنجرهٔ باروری» — آبی خیلی روشن
         پیوسته؛ همراه با خود پنجره، ناحیهٔ آبی بی‌وقفه را می‌سازند.
   perCont: روزهای آیندهٔ چرخهٔ جاری که فقط بر اساس مدت پریود «ادامهٔ تخمینی
         پریود جاری» حساب می‌شوند — ثبت واقعی برای آن‌ها وجود ندارد. */
function cxPhaseOf(M, jdn, todayJdn) {
  if (!M || !M.cycles.length) return null;
  /* پس از عبور از موعد پریود، چرخه‌های فرضیِ مبتنی بر شروع پیش‌بینی‌شده
     نمایش داده نمی‌شوند؛ فاز/تخمک‌گذاری تا ثبت شروع واقعی بعدی نامشخص است. */
  if (M.late && M.cur && M.nextStart !== null && jdn >= M.nextStart) {
    return {
      p: "lut", day: jdn - M.cur.s + 1,
      ov: false, fert: false, per: false, perPred: false, perCont: false, lite: false,
      proj: jdn > todayJdn, lateUnknown: true, c: M.cur
    };
  }
  let c = null;
  for (let i = 0; i < M.cycles.length; i++) {
    const cy = M.cycles[i];
    if (jdn >= cy.s && jdn < cy.e) { c = cy; break; }
  }
  if (!c) return null;
  const per = jdn <= c.pe;                        /* در بازهٔ مدت پریود */
  const fert = jdn >= c.wf && jdn <= c.wt;        /* در پنجرهٔ باروری */
  const ov = jdn === c.ov;                        /* روز تخمک‌گذاری */
  const lite = !per && jdn < c.wf;                /* فاصلهٔ پایان پریود تا پنجره (اگر موجود باشد) */
  let p;
  if (per) p = "mens";
  else if (fert) p = "ovul";
  else if (jdn < c.wf) p = "foll";
  else p = "lut";
  const proj = !!c.proj || jdn > todayJdn;
  /* ادامهٔ تخمینی پریود جاری: روز پریودِ آینده در چرخهٔ جاری (بدون ثبت واقعی) —
     فقط برای نمایش؛ در چرخه‌های پیش‌بینی‌شده perPred به‌کار می‌رود. */
  const perCont = per && !c.proj && jdn > todayJdn;
  return { p: p, day: jdn - c.s + 1, ov: ov, fert: fert, per: per, perPred: per && c.proj, perCont: perCont, lite: lite, proj: proj, c: c };
}

/* پذیرش شروع جدید — کمتر از ۱۰ روز با هر شروع دیگر پذیرفته نمی‌شود */
function cxCanAddStart(existingStartsJdn, jdn) {
  const near = (existingStartsJdn || []).some(function (s) { return Math.abs(s - jdn) < 10; });
  return near ? { ok: false, reason: "کمتر از ۱۰ روز از یک شروع پریود دیگر گذشته است" } : { ok: true };
}

/* علائم پرتکرار از ثبت‌های روز — خروجی: [{k, n}] مرتب نزولی، حداکثر topN */
function cxTopSymptoms(daysObj, topN) {
  const cnt = {};
  Object.keys(daysObj || {}).forEach(function (k) {
    const r = daysObj[k];
    (r && r.symptoms || []).forEach(function (s) { cnt[s] = (cnt[s] || 0) + 1; });
  });
  return Object.keys(cnt)
    .sort(function (a, b) { return cnt[b] - cnt[a] || (a < b ? -1 : 1); })
    .slice(0, topN || 4)
    .map(function (k) { return { k: k, n: cnt[k] }; });
}

/* ---------- تقویم سلامت مردان (delegation) ----------
   ورود به مسیر تخصصی ED/PE از نتایج SHIM/PEDT به ماژول جدید منتقل می‌شود.
   بقیهٔ منطق نسخهٔ قبلی حذف شده و در mcal.js پیاده‌سازی شده است. */
function mhOnResult(cond) {
  if (typeof mcalOnQuizResult === "function") {
    mcalOnQuizResult(cond);
    return;
  }
}
/* ---------- module state ---------- */
function ppSectionMeta(id) {
  return PP_SECTIONS.find(function (s) { return s.id === id; }) || PP_SECTIONS[0];
}
function ppCardsOf(section) {
  return PP_CARDS.filter(function (c) { return c.section === section; });
}
function ppCardById(id) {
  return PP_CARDS.find(function (c) { return c.id === id; });
}
function ppSymptomLabel(id) {
  const s = PP_SYMPTOMS.find(function (x) { return x.id === id; });
  return s ? s.label : id;
}
function ppSymptomUrgent(id) {
  const s = PP_SYMPTOMS.find(function (x) { return x.id === id; });
  return Boolean(s && s.urgent);
}
function ppSymptomOptions() {
  return PP_SYMPTOMS.map(function (s) {
    return { id: s.id, label: s.label, urgent: Boolean(s.urgent) };
  });
}
function ppMoodLabel(id) {
  const m = PP_MOODS.find(function (x) { return x.id === id; });
  return m ? m.label : id;
}
function ppEnergyLabel(id) {
  const m = PP_ENERGIES.find(function (x) { return x.id === id; });
  return m ? m.label : id;
}
function ppSleepLabel(id) {
  const m = PP_SLEEPS.find(function (x) { return x.id === id; });
  return m ? m.label : id;
}

/* ---------- store (localStorage — demo only, stays on device) ---------- */
function ppRotate(list, seed) {
  if (!list.length) throw new Error("ppRotate() on empty list");
  return list[((seed % list.length) + list.length) % list.length];
}

function ppDayInfo(deliveryJdn, todayJdn) {
  const day = Math.max(1, todayJdn - deliveryJdn + 1);
  const week = Math.min(52, Math.floor((day - 1) / 7) + 1);
  let stage = "beyond", stageLabel = "ماه‌های بعد";
  if (day <= 6) { stage = "early"; stageLabel = "روزهای اول"; }
  else if (day <= 13) { stage = "blues"; stageLabel = "هفته‌های ۱ و ۲"; }
  else if (day <= 35) { stage = "rebuilding"; stageLabel = "هفته‌های ۳ تا ۵"; }
  else if (day <= 84) { stage = "checkup"; stageLabel = "تا هفتهٔ ۱۲"; }
  return { day: day, week: week, stage: stage, stageLabel: stageLabel };
}

function ppStageInsight(info, seed) { return ppRotate(PP_STAGE_INSIGHTS[info.stage], seed); }

function ppTodayJdn() {
  const t = JAL.today();
  return JAL.j2d(t.jy, t.jm, t.jd);
}
function ppTodayKey() {
  const t = JAL.today();
  return JAL.keyOf(t.jy, t.jm, t.jd);
}
function ppCiof(db, jdn) {
  /* today's check-in record by JDN */
  return Object.keys(db.checkins)
    .map(function (k) { return db.checkins[k]; })
    .find(function (c) { return JAL.keyToJdn(c.dateKey) === jdn; });
}
function ppCheckinHasContent(c) {
  if (!c) return false;
  return Boolean(
    c.mood || c.energy || c.sleep ||
    (c.symptoms && c.symptoms.length > 0) ||
    c.feedingConcern || c.supportNeed ||
    (c.note && c.note.trim()) ||
    /* فیلدهای عددی نسخهٔ ۲ هم «ثبت» به حساب می‌آیند */
    c.sleepHours != null || c.longestSleepStretch != null || c.walkMinutes != null
  );
}
function ppUrgentOf(c) {
  if (!c) return [];
  return (c.symptoms || []).filter(function (s) { return ppSymptomUrgent(s); });
}

/* گیت خلق پایینِ پایدار: ≥۳ روز از ۷ روز اخیر با خلق «روز سخت/کمی ناراحت» —
   فقط برای باز کردن مسیر حرفه‌ای، هرگز برای برچسب یا نمره */
function ppPersistentLowMood(db, todayJdn) {
  let hits = 0;
  for (let i = 0; i < 7; i += 1) {
    const rec = ppCiof(db, todayJdn - i);
    if (rec && (rec.mood === "rough" || rec.mood === "low")) hits += 1;
  }
  return hits >= 3;
}

/* ---------- context-sensitive supportive messages ---------- */
function ppPickMessage(db, todayJdn) {
  const c = ppCiof(db, todayJdn);
  if (c && c.mood === "rough") return ppRotate(PP_MSG_ROUGH, todayJdn);
  if (c && c.mood === "low") return ppRotate(PP_MSG_LOW, todayJdn);
  if (c && c.energy === "empty") return PP_MSG_ENERGY[0];
  if (c && (c.symptoms || []).indexOf("body_distress") >= 0) return PP_MSG_BODY[0];
  if (c && c.mood === "good") return ppRotate(PP_MSG_POS, todayJdn);
  return ppRotate(PP_MSG_DEFAULT, todayJdn);
}

/* یک اقدام شدنی برای امروز — فهرست کار نیست */
function ppPickAction(db, todayJdn) {
  const c = ppCiof(db, todayJdn);
  if (c && c.supportNeed) {
    const need = PP_HELP_NEEDS.find(function (h) { return h.id === c.supportNeed; });
    if (need) return { text: need.action, target: need.target || "help" };
  }
  if (c && (c.energy === "empty" || c.energy === "low")) {
    return { text: "یک لیوان آب بنوش و اگر شدنی است ۱۰ دقیقه دراز بکش؛ همین یک اقدام، امروز کافی است." };
  }
  if (c && (c.mood === "rough" || c.mood === "low")) {
    return { text: "دو دقیقه تمرین آرامش «آرامش روزانه» را امتحان کن — بدون هیچ انتظاری از خودت.", target: "breathing" };
  }
  if (c && (c.symptoms || []).indexOf("body_distress") >= 0) {
    return { text: "یک جملهٔ دلسوزانه به بدنت بگو و اگر دلت خواست، کارت «تغییرات بدن» را بخوان.", target: "card:rec-body" };
  }
  if (c && (c.sleep === "poor" || (c.symptoms || []).indexOf("little_sleep") >= 0)) {
    return { text: "برای امروز یک «بازهٔ استراحت محافظت‌شده» از یک نفر بخواه؛ حتی ۲۰ دقیقه.", target: "section:dailylife" };
  }
  if (c && c.feedingConcern) {
    const topic = PP_BREAST_TOPICS.find(function (t) { return t.id === c.feedingConcern; });
    if (topic) {
      return { text: "راهنمای متمرکز «" + topic.label + "» را ببین؛ یکی از قدم‌هایش را برای امروز انتخاب کن.", target: "section:feeding" };
    }
  }
  return ppRotate([
    { text: "یک لیوان آب در وعدهٔ بعدی شیردهی کنار دستت بگذار.", target: "section:dailylife" },
    { text: "یک افتخار کوچک امروز را در دفترت بنویس.", target: "pride" },
    { text: "چند دقیقه پیاده‌روی کوتاه یا کشش گردن و شانه.", target: "section:pelvic" }
  ], todayJdn);
}

function ppDailyGuidance(db, deliveryJdn, todayJdn) {
  const info = ppDayInfo(deliveryJdn, todayJdn);
  const c = ppCiof(db, todayJdn);
  const msg = ppPickMessage(db, todayJdn);
  return {
    message: msg,
    action: ppPickAction(db, todayJdn),
    insight: ppStageInsight(info, todayJdn),
    urgent: ppUrgentOf(c)
  };
}

/* چرخش محتوای هر بخش — بدون تکرار آخرین کارت؛ کارت سزارین فقط برای سزارین */
function ppPickCardId(section, db) {
  const birth = db.profile ? db.profile.birthType : undefined;
  const pool = PP_CARDS.filter(function (c) {
    return c.section === section && (!c.tags || !birth || c.tags.indexOf(birth) >= 0);
  });
  const list = pool.length ? pool : PP_CARDS.filter(function (c) { return c.section === section; });
  if (!list.length) return "";
  const last = db.lastContent[section];
  const rest = list.filter(function (c) { return c.id !== last; });
  const seed = Object.keys(db.checkins).length;
  return (rest.length ? rest : list)[seed % (rest.length || list.length)].id;
}

/* ---------- partner share builder — «چطور امروز می‌توانی کنارم باشی؟» ---------- */
function ppBuildShare(db, prefs, todayJdn) {
  const c = ppCiof(db, todayJdn);
  const sentences = [];
  if (prefs.mood && c && c.mood && PP_MOOD_SHARE[c.mood]) sentences.push(PP_MOOD_SHARE[c.mood] + ".");
  if (prefs.energy && c && c.energy && PP_ENERGY_SHARE[c.energy]) sentences.push(PP_ENERGY_SHARE[c.energy] + ".");
  if (prefs.symptoms && c && (c.symptoms || []).length) {
    const labels = c.symptoms
      .filter(function (s) { return !ppSymptomUrgent(s); })
      .slice(0, 3)
      .map(function (s) { return "«" + ppSymptomLabel(s) + "»"; });
    if (labels.length) sentences.push("امروز این‌ها را بیشتر حس کرده‌ام: " + labels.join("، ") + ".");
  }
  if (prefs.helpTopic && c && c.supportNeed && PP_NEED_SHARE[c.supportNeed]) sentences.push(PP_NEED_SHARE[c.supportNeed] + ".");
  if (prefs.request && c && c.note && c.note.trim()) sentences.push("یادداشت من: " + c.note.trim());
  if (prefs.activity) {
    const act = db.activities.find(function (a) { return JAL.keyToJdn(a.dateKey) === todayJdn; });
    if (act) {
      sentences.push("امروز «" + (act.label || "فعالیت بدنی ملایم") + "» را انجام دادم؛ اگر دوست داری، کنار هم تکرارش کنیم.");
    } else {
      sentences.push("اگر فرصت داشتیم، دوست دارم تمرین آرامش دونفره را با هم امتحان کنیم.");
    }
  }
  const items = sentences.length;
  if (items === 0) {
    return {
      title: "چطور امروز می‌توانی کنارم باشی؟",
      body: "امروز هنوز چیزی انتخاب نکرده‌ام. دوست دارم همین که کنار هم بنشینیم و حرف بزنیم.",
      items: 0
    };
  }
  const defaultClose = "\n\nلازم نیست برای حل همه‌چیز راه‌حل داشته باشی. گاهی فقط گوش دادن و همراه بودن کمک بزرگی است.";
  const close = prefs.message.trim() ? "\n\n" + prefs.message.trim() : defaultClose;
  return { title: "چطور امروز می‌توانی کنارم باشی؟", body: sentences.join(" ") + close, items: items };
}

/* خلاصهٔ ۱۴ روزه برای ویزیت — ثبت شخصی، نه گزارش پزشکی؛ علامت هشدار پنهان نمی‌شود */
function ppSymptomSummary(db, todayJdn, jdnToDateLabel) {
  const lines = ["خلاصهٔ ثبت‌های خودم از دو هفتهٔ گذشته:", ""];
  const days = [];
  for (let i = 13; i >= 0; i -= 1) {
    const jdn = todayJdn - i;
    const c = ppCiof(db, jdn);
    if (c) days.push({ label: jdnToDateLabel(jdn), c: c });
  }
  if (!days.length) {
    return lines.concat(["در این بازه ثبت روزانه‌ای وجود ندارد.", "", "این خلاصه صرفاً ثبت شخصی من است و گزارش پزشکی نیست."]).join("\n");
  }
  lines.push("تعداد روزهای ثبت‌شده: " + fa(days.length));
  lines.push("");
  days.forEach(function (d) {
    const parts = [];
    if (d.c.mood) parts.push("خلق: " + ppMoodLabel(d.c.mood));
    if (d.c.energy) {
      const en = { empty: "بسیار کم", low: "کم", okay: "متوسط", good: "خوب" };
      parts.push("انرژی: " + en[d.c.energy]);
    }
    if ((d.c.symptoms || []).length) {
      parts.push("علائم: " + d.c.symptoms.map(ppSymptomLabel).join("، "));
    }
    if (d.c.supportNeed) {
      const need = PP_HELP_NEEDS.find(function (h) { return h.id === d.c.supportNeed; });
      if (need) parts.push("نیاز حمایت: " + need.label);
    }
    if (d.c.note && d.c.note.trim()) parts.push("یادداشت: " + d.c.note.trim());
    lines.push(parts.length ? d.label + " — " + parts.join(" | ") : d.label + " — ثبت خالی");
  });
  const urgentDays = days.filter(function (d) { return ppUrgentOf(d.c).length > 0; });
  if (urgentDays.length) {
    lines.push("");
    lines.push("⚠ روزهای دارای علامت هشدار (نیازمند گفتگو با پزشک):");
    urgentDays.forEach(function (d) {
      lines.push("- " + d.label + ": " + ppUrgentOf(d.c).map(ppSymptomLabel).join("، "));
    });
  }
  lines.push("");
  lines.push("این خلاصه صرفاً ثبت شخصی من است و گزارش پزشکی نیست.");
  return lines.join("\n");
}

/* ============================================================
   همراه مادر — موتور روزانهٔ نسخهٔ ۲ (منطق خالق؛ بدون DOM و بدون سرور)
   ------------------------------------------------------------
   همهٔ توابع این بخش خالق‌اند تا با node آزمون شوند:
     - سری‌های داده (چک‌این، خواب عددی، پیاده‌روی، نوزاد)
     - خلاصهٔ شب گذشته
     - حلقهٔ پیاده‌روی هفته (هدف نرم ۱۲۰ دقیقه — CSEP 2025)
     - کارت الگوی قاعده‌مند (بدون هوش مصنوعی)
     - سطح ایمنی سه‌رنگ (سبز/زرد/قرمز)
   هیچ عدد پزشکی جدیدی بدون منبع/TODO-کارشناس معرفی نمی‌شود.
   ============================================================ */

function ppNum(v) {
  const x = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(x) ? x : null;
}

/* ---------- سری‌های داده ---------- */
/* روزهای اخیر، از قدیم به نو. هر عضو: { jdn, key, rec } — rec می‌تواند null باشد */
function ppRecentDays(db, todayJdn, days) {
  const out = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const jdn = todayJdn - i;
    out.push({ jdn: jdn, key: JAL.keyOf.apply(null, (function (j) { return [j.jy, j.jm, j.jd]; })(JAL.d2j(jdn))), rec: ppCiof(db, jdn) || null });
  }
  return out;
}

/* نگاشت کیفیت‌ها به مقیاس ۱ تا ۴ — فقط برای رسم خط، هرگز به‌عنوان «نمره» نمایش داده نمی‌شود */
function ppMoodScore(mood) { return { good: 4, okay: 3, low: 2, rough: 1 }[mood] || null; }
function ppEnergyScore(energy) { return { good: 4, okay: 3, low: 2, empty: 1 }[energy] || null; }

/* آستانهٔ نمایشی گروه‌های علامت در نقشهٔ حرارتی — فقط علائم غیرهشداری؛
   علامت اورژانسی هرگز وارد نمودار نمی‌شود (نوار هشدار جای آن است) */
const PP_SYMPTOM_GROUPS = [
  { id: "pain", label: "درد بخیه/سزارین", ids: ["perineal_pain", "cs_pain"] },
  { id: "breast", label: "سفتی یا درد سینه", ids: ["breast_pain"] },
  { id: "fatigue", label: "خستگی و کم‌خوابی", ids: ["fatigue", "little_sleep"] },
  { id: "pelvic", label: "سنگینی لگن", ids: ["pelvic_pressure"] },
  { id: "leak", label: "نشت ادرار", ids: ["urine_leak"] },
  { id: "constipation", label: "یبوست", ids: ["constipation"] },
  { id: "body", label: "حس ناخوشایند بدن", ids: ["body_distress"] }
];

/* ماتریس علائم × روز برای نقشهٔ حرارتی: { rows:[{id,label,cells:[bool]}], dayKeys } */
function ppSymptomMatrix(db, todayJdn, days) {
  const series = ppRecentDays(db, todayJdn, days);
  const rows = PP_SYMPTOM_GROUPS.map(function (g) {
    const cells = series.map(function (d) {
      const s = d.rec && d.rec.symptoms ? d.rec.symptoms : [];
      return g.ids.some(function (id) { return s.indexOf(id) >= 0; });
    });
    return { id: g.id, label: g.label, cells: cells, hits: cells.filter(Boolean).length };
  });
  return { days: series, rows: rows };
}

/* مجموع پیاده‌روی هفتهٔ جلالی جاری (شنبه تا جمعه) — هدف نرم؛ نبودِ آن شکست نیست */
function ppWeekWalkMinutes(db, todayJdn) {
  const start = todayJdn - JAL.colOf(todayJdn);
  let sum = 0;
  for (let jdn = start; jdn <= todayJdn; jdn += 1) {
    const c = ppCiof(db, jdn);
    const m = c ? ppNum(c.walkMinutes) : null;
    if (m && m > 0) sum += Math.min(m, 240); /* سقف نمایشی روزانه؛ ثبت اشتباه نمودار را نمی‌شکند */
  }
  return sum;
}

/* خلاصهٔ شب گذشته از ثبت امروز (چک‌این «شب چطور گذشت؟» دربارهٔ شب قبل است) */
function ppNightSummary(db, todayJdn) {
  const c = ppCiof(db, todayJdn);
  const total = c ? ppNum(c.sleepHours) : null;
  const longest = c ? ppNum(c.longestSleepStretch) : null;
  return {
    hasRec: Boolean(c),
    quality: c && c.sleep ? ppSleepLabel(c.sleep) : null,
    total: total && total > 0 ? total : null,
    longest: longest && longest > 0 ? longest : null
  };
}

/* ---------- نوزاد ---------- */
function ppBabyDay(db, key) {
  const b = db.baby && db.baby[key];
  if (!b) return { feeds: null, sleeps: null, diapers: null, weightKg: null };
  const w = ppNum(b.weightKg);
  return {
    feeds: Number.isInteger(b.feeds) && b.feeds >= 0 ? b.feeds : null,
    sleeps: Number.isInteger(b.sleeps) && b.sleeps >= 0 ? b.sleeps : null,
    diapers: Number.isInteger(b.diapers) && b.diapers >= 0 ? b.diapers : null,
    weightKg: w && w >= 0.5 && w <= 15 ? w : null
  };
}
function ppBabySeries(db, todayJdn, days) {
  return ppRecentDays(db, todayJdn, days).map(function (d) {
    return { jdn: d.jdn, key: d.key, day: ppBabyDay(db, d.key) };
  });
}
/* سری وزن نوزاد: فقط ثبت‌های عددی معتبر، مرتب از قدیم به نو */
function ppWeightSeries(db) {
  const out = [];
  const baby = db.baby || {};
  Object.keys(baby).forEach(function (k) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return;
    const w = ppNum(baby[k] && baby[k].weightKg);
    if (w && w >= 0.5 && w <= 15) out.push({ jdn: JAL.keyToJdn(k), kg: w });
  });
  out.sort(function (a, b) { return a.jdn - b.jdn; });
  return out;
}

/* ---------- کارت الگوی قاعده‌مند (بدون هوش مصنوعی، بدون سرور) ----------
   هر قاعده یک تابع خالق: (db, todayJdn) → null | card
   card: { id, level:'green'|'yellow', title, body, action:{text,target}, expertReview? } */

/* دردِ ترمیم‌محور (غیرهشداری) در روزهای قدیمی‌ترِ ۵ روز اخیر و نبودش در دو روز آخر */
function ppPainDay(c) {
  if (!c || !c.symptoms) return false;
  const painIds = ["perineal_pain", "cs_pain", "breast_pain", "pelvic_pressure"];
  return painIds.some(function (id) { return c.symptoms.indexOf(id) >= 0; });
}
function ppRulePainEasing(db, todayJdn) {
  const s = ppRecentDays(db, todayJdn, 5);
  const older = s.slice(0, 3), newer = s.slice(3);
  const olderLogged = older.filter(function (d) { return d.rec && ppCheckinHasContent(d.rec); }).length;
  const newerLogged = newer.filter(function (d) { return d.rec && ppCheckinHasContent(d.rec); }).length;
  if (olderLogged < 2 || newerLogged < 2) return null;
  const painBefore = older.filter(function (d) { return ppPainDay(d.rec); }).length;
  const painNow = newer.filter(function (d) { return ppPainDay(d.rec); }).length;
  if (painBefore < 2 || painNow !== 0) return null;
  return {
    id: "pain-easing",
    level: "green",
    title: "بدنت دارد جمع می‌شود",
    body: "در چند روز گذشته، دردهای ترمیم کمتر شده‌اند. همین آهنگِ آرام، همان آهنگِ بهبودی است.",
    action: { text: "پیاده‌روی ۱۰ دقیقه‌ای آرام — اگر بدنت اجازه داد", target: "guide" }
  };
}

/* خستگی روز و بیداری‌های شب: انرژی کم در ۳ از ۴ روزِ ثبت‌شده + خواب تکه‌تکه/کم */
function ppRuleTiredNights(db, todayJdn) {
  const s = ppRecentDays(db, todayJdn, 4).filter(function (d) { return d.rec && ppCheckinHasContent(d.rec); });
  if (s.length < 3) return null;
  const lowEnergy = s.filter(function (d) { return d.rec.energy === "low" || d.rec.energy === "empty"; }).length;
  if (lowEnergy < 3) return null;
  const brokenNights = s.filter(function (d) {
    const l = ppNum(d.rec.longestSleepStretch);
    return d.rec.sleep === "poor" || d.rec.sleep === "broken" || (l !== null && l < 2);
  }).length;
  if (brokenNights < 2) return null;
  return {
    id: "tired-nights",
    level: "green",
    title: "خستگی‌ات با بیداری‌های شب گره خورده",
    body: "در روزهای اخیر، انرژی کم با خواب تکه‌تکه همراه بوده است. این خستگی واقعی است — و بخشی از آن قابل جابه‌جایی است.",
    action: { text: "یک بلوک خواب محافظت‌شده با همسر یا یک نفر نزدیک بچین", target: "guide" }
  };
}

/* حال سنگین سه روز پشت‌سرهم — کارت حمایتی ملایم؛ هرگز برچسب تشخیصی ندارد */
function ppRuleHeavyMood(db, todayJdn) {
  let run = 0;
  for (let i = 0; i < 3; i += 1) {
    const c = ppCiof(db, todayJdn - i);
    if (c && (c.mood === "rough" || c.mood === "low")) run += 1; else break;
  }
  if (run < 3) return null;
  return {
    id: "heavy-mood",
    level: "green",
    title: "این روزها سنگین گذشت",
    body: "سه روز پیاپی حال سنگین ثبت کرده‌ای. این نشانهٔ «مادر بد بودن» نیست — نشانهٔ این است که شایستهٔ حمایت هستی، همین حالا.",
    action: { text: "۵ دقیقه تنفس آرام + یک جمله در دفتر شعله‌ها + تماس با یک آدم نزدیک", target: "breathing" }
  };
}

/* شیردهی کمتر از حد ثبت‌شده — فقط با نشان «در انتظار بازبینی کارشناس»؛
   آستانهٔ ۸ در شبانه‌روز TODO-کارشناس است و بدون آن نشان نمایش داده نمی‌شود */
function ppRuleFeedLow(db, todayJdn, dayAfterBirth) {
  if (!db.profile) return null;
  const f = db.profile.feeding;
  if (f !== "breast" && f !== "mixed") return null;
  if (!(dayAfterBirth >= 1 && dayAfterBirth <= 42)) return null;
  const key = JAL.keyOf.apply(null, (function (j) { return [j.jy, j.jm, j.jd]; })(JAL.d2j(todayJdn)));
  const b = ppBabyDay(db, key);
  if (b.feeds === null) return null;
  const min = PP_V2.feedDayMin;
  if (!(b.feeds < min)) return null;
  return {
    id: "feed-low",
    level: "yellow",
    expertReview: true,
    title: "شیرهای ثبت‌شدهٔ امروز کم است",
    body: "شمار شیردهی‌های امروز کمتر از عدد رایج برای هفته‌های اول ثبت شده است. این خودش تشخیص نیست — بویژه اگر نوزاد آرام است و پوشک خیس دارد؛ اما پرسیدنش از مشاور شیردهی یا ماما ارزش دارد.",
    action: { text: "تماس با مشاور شیردهی یا ماما همان روز + راهنمای شیردهی", target: "section:feeding" }
  };
}

/* کم‌داده: پیشنهاد مهربان ثبت کوتاه — الگو به داده نیاز دارد */
function ppRuleHint(db, todayJdn) {
  let n = 0;
  for (let i = 0; i < 7; i += 1) {
    const c = ppCiof(db, todayJdn - i);
    if (c && ppCheckinHasContent(c)) n += 1;
  }
  if (n >= 3) return null;
  return {
    id: "few-logs",
    level: "green",
    title: "الگوها با چند ثبت کوتاه جان می‌گیرند",
    body: "در هفتهٔ گذشته " + fa(n) + " روز ثبت داشتی. حتی حالِ یک‌خطی هم برای دیدن روند کافی است — بدون هیچ فشاری.",
    action: { text: "ثبت ۶۰ ثانیه‌ای حال امروز", target: "quicklog" }
  };
}

/* کارت الگوی امروز: اولویت ثابت؛ فقط یک کارت در هر روز */
function ppPatternCard(db, todayJdn, dayAfterBirth) {
  return ppRuleHeavyMood(db, todayJdn)
    || ppRuleTiredNights(db, todayJdn)
    || ppRuleFeedLow(db, todayJdn, dayAfterBirth)
    || ppRulePainEasing(db, todayJdn)
    || ppRuleHint(db, todayJdn);
}

/* ---------- سطح ایمنی سه‌رنگ ----------
   قرمز: هر علامت هشدارِ ثبت‌شدهٔ امروز (مسیر فوری؛ بدون محتوای انگیزشی)
   زرد: الگوی ماندگار (خلق پایین ۳ از ۷ روز، یا کارت شیردهیِ در انتظار بازبینی)
   سبز: بقیهٔ حال‌ها — همراهی معمول */
function ppSafetyLevel(db, todayJdn, dayAfterBirth) {
  const today = ppCiof(db, todayJdn);
  const urgent = ppUrgentOf(today);
  if (urgent.length) {
    return { level: "red", reasons: urgent.map(ppSymptomLabel) };
  }
  const reasons = [];
  if (ppPersistentLowMood(db, todayJdn)) reasons.push("خلق سنگین در چند روز اخیر");
  const feedLow = ppRuleFeedLow(db, todayJdn, typeof dayAfterBirth === "number" ? dayAfterBirth : -1);
  if (feedLow) reasons.push("شیردهی کمتر از حد ثبت‌شدهٔ امروز");
  if (reasons.length) return { level: "yellow", reasons: reasons };
  return { level: "green", reasons: [] };
}

/* ---------- خلاصهٔ ویزیت: افزودن دادهٔ عددی خواب/پیاده‌روی و نوزاد ----------
   به نسخهٔ قبلی سازگار است؛ خطوط جدید فقط وقتی دادهٔ واقعی وجود دارد اضافه می‌شوند */
function ppVisitSummaryText(db, todayJdn, jdnToDateLabel) {
  const base = ppSymptomSummary(db, todayJdn, jdnToDateLabel);
  const extra = [];
  let babyRows = 0, numRows = 0;
  for (let i = 13; i >= 0; i -= 1) {
    const jdn = todayJdn - i;
    const c = ppCiof(db, jdn);
    const key = JAL.keyOf.apply(null, (function (j) { return [j.jy, j.jm, j.jd]; })(JAL.d2j(jdn)));
    const b = ppBabyDay(db, key);
    const parts = [];
    if (c) {
      const t = ppNum(c.sleepHours), l = ppNum(c.longestSleepStretch), w = ppNum(c.walkMinutes);
      if (t) parts.push("مجموع خواب " + faN(t) + " ساعت");
      if (l) parts.push("بلندترین خواب پیوسته " + faN(l) + " ساعت");
      if (w) parts.push("پیاده‌روی " + faN(w) + " دقیقه");
    }
    if (b.feeds !== null || b.diapers !== null) {
      const bp = [];
      if (b.feeds !== null) bp.push("شیر " + fa(b.feeds));
      if (b.sleeps !== null) bp.push("خواب " + fa(b.sleeps));
      if (b.diapers !== null) bp.push("پوشک " + fa(b.diapers));
      if (b.weightKg) bp.push("وزن " + faN(b.weightKg) + " کیلوگرم");
      parts.push("نوزاد: " + bp.join("، "));
      babyRows += 1;
    }
    if (parts.length) { extra.push(jdnToDateLabel(jdn) + " — " + parts.join(" | ")); numRows += 1; }
  }
  if (!numRows) return base;
  return base + "\n\nثبت‌های عددی و نوزاد (همین بازه):\n" + extra.join("\n");
}

