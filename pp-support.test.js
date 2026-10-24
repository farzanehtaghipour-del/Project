/* ============================================================================
   pp-support.test.js — تست موتور «من هم مهمم» | نسخهٔ ۲٫۲ (بدون مرورگر)
   اجرا:  node pp-support.test.js
   منطق انتخاب محتوا، جلوگیری از تکرار، manualOnly، بررسی ایمنی دو سطحی
   (riskTier)، متن‌های بازبینی‌شده، کارت ایمنی/کارت نرم و شخصی‌سازی را
   می‌سنجد. فایل‌ها را از کنار خودش می‌خواند.
   ============================================================================ */
const fs = require("fs");
const path = require("path");
const base = path.join(__dirname, "/");
const files = ["pp-content.js", "pp-companion.js", "pp-support-content.js", "pp-support.js"];

const fakeLS = (function () { let m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; } }; })();
function FakeEl() {
  return { innerHTML:"", outerHTML:"", hidden:false, value:"", textContent:"", className:"",
    classList:{ add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    setAttribute(){}, getAttribute(){ return null; }, addEventListener(){}, removeEventListener(){},
    querySelector(){ return FakeEl(); }, querySelectorAll(){ return []; },
    appendChild(){}, insertBefore(){}, focus(){}, click(){}, isConnected:false };
}
/* [۲٫۲] عناصر ساخته‌شده با createElement نگه داشته می‌شوند تا کارت ایمنی/کارت نرم بررسی شوند */
const made = [];
const fakeDoc = {
  addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; },
  createElement(tag){ const el = FakeEl(); el.tag = tag; made.push(el); return el; }, body: FakeEl(), hidden: false
};
const fakeJAL = {
  keyToJdn(k){ const p = String(k).split("-"); return (+p[0]) * 10000 + (+p[1]) * 100 + (+p[2]); },
  d2j(jdn){ const y = Math.floor(jdn / 10000), r = jdn % 10000, m = Math.floor(r / 100), d = r % 100; return { jy: y, jm: m, jd: d }; },
  keyOf(jy, jm, jd){ return jy + "-" + String(jm).padStart(2, "0") + "-" + String(jd).padStart(2, "0"); },
  today(){ return { jy: 1405, jm: 7, jd: 25 }; },
  monthLen(jy, jm){ return jm <= 6 ? 31 : jm <= 11 ? 30 : 30; },
  MONTHS: ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"]
};

const win = {};
files.forEach(function (f) {
  new Function("window", "document", "localStorage", fs.readFileSync(base + f, "utf8"))(win, fakeDoc, fakeLS);
});
/* برای تست کارت‌ها: ماژول document را در زمان فراخوانی می‌خواند */
win.document = fakeDoc;

const TODAY = 14050725;
let db = null;
const adapter = {
  today(){ return TODAY; },
  load(){ if (!db) db = { v:1, profile:null, checkins:{}, tasks:{}, needs:[], screen:{}, seen:{}, baby:null, weights:{}, night:false }; return db; },
  save(d){ db = d; },
  clear(){ db = null; }
};

const api = win.SamanPostpartum.init({ mount: FakeEl(), adapter, jal: fakeJAL });
api._state.db.profile = { deliveryKey: "1405-07-05", type: "vaginal", feeding: "breast" }; /* روز ۲۰ */

const T = win.SamanSupport._t;
const C = T._content;
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : (fail++, console.log("  ✗ " + n + "  → " + (x !== undefined ? x : ""))); };
const bodyOf = it => [it.opening, it.explanation, it.reframe, it.smallAction, it.reflectionPrompt,
  it.levels && it.levels.self, it.levels && it.levels.follow, it.levels && it.levels.urgent,
  it.nextStep && it.nextStep.text].filter(Boolean).join(" ");
const item = id => C.ITEMS.filter(x => x.id === id)[0];

/* ساختار کتابخانه — ۳۵ آیتم و ۳۵ موضوع یکتا (۲٫۲) */
ok("۴ کارت", T.supportCards().length === 4, T.supportCards().length);
ok("۵ حالت ورود سریع", T.supportStates().length === 5, T.supportStates().length);
ok("۱۴ پرامپت دفترچه", C.PROMPTS.length === 14, C.PROMPTS.length);
ok("۱۴ آیتم روزانه", C.DAILY.length === 14, C.DAILY.length);
ok("۳۵ آیتم محتوا", C.ITEMS.length === 35, C.ITEMS.length);
ok("۱۳ sad / ۱۱ doubt / ۱۱ body",
  C.ITEMS.filter(x => x.section === "sad").length === 13 &&
  C.ITEMS.filter(x => x.section === "doubt").length === 11 &&
  C.ITEMS.filter(x => x.section === "body").length === 11,
  C.ITEMS.filter(x => x.section === "sad").length + "/" +
  C.ITEMS.filter(x => x.section === "doubt").length + "/" +
  C.ITEMS.filter(x => x.section === "body").length);
ok("مسیر خودکار sad دقیقاً ۱۱ آیتم (بدون manualOnly)", T.supportItemsFor("sad").length === 11, T.supportItemsFor("sad").length);
ok("۱۳ موضوع sad", T.supportTopics("sad").length === 13, T.supportTopics("sad").length);
ok("هر موضوع ≥۱ آیتم", ["sad","doubt","body"].every(s => T.supportTopics(s).every(t => T.supportItemsFor(s, t.topic).length >= 1)));

/* کامل‌بودن داده */
ok("همه آیتم‌ها فیلدهای لازم دارند", C.ITEMS.every(x => x.id && x.title && x.opening && x.explanation && x.topicLabel && x.semanticGroup && x.supportType));
const ids = C.ITEMS.map(x => x.id);
ok("بدون شناسهٔ تکراری", ids.filter((v, i) => ids.indexOf(v) !== i).length === 0);
ok("۳۵ موضوع یکتا", new Set(C.ITEMS.map(x => x.section + ":" + x.topic)).size === 35);
ok("همه draft برای بازبینی", C.ITEMS.every(x => x.reviewStatus === "draft"));

/* حلقه‌های علمی افزوده‌شده */
["sad-blues","sad-panic","sad-intrusive","dbt-feeding-grief","dbt-culture","bdy-work","bdy-sleep","sad-nicu","sad-loss"].forEach(function (id) {
  ok("آیتم افزوده: " + id, !!T.supportItem(id));
});
ok("جدول بی‌بی‌بلوز/افسردگی", !!T.supportItem("sad-blues").table);
ok("آیتم‌های ایمنی سه سطح دارند", C.ITEMS.filter(x => x.safetyLevel !== "routine").every(x => x.levels && x.levels.self && x.levels.urgent));
ok("≥۲۰ آیتم با سه سطح", C.ITEMS.filter(x => x.levels).length >= 20, C.ITEMS.filter(x => x.levels).length);
ok("≥۸ آیتم با فهرست علائم", C.ITEMS.filter(x => x.bullets).length >= 8, C.ITEMS.filter(x => x.bullets).length);
ok("≥۸ آیتم با منبع", C.ITEMS.filter(x => x.src).length + C.DAILY.filter(x => x.src).length >= 8);
ok("اعداد معتبر موجود", !!C.PREVALENCE.ppd && !!C.PREVALENCE.ui);

/* فاز */
ok("فاز early", T.supportPhaseMatch({phase:"early"}, 3) === true && T.supportPhaseMatch({phase:"early"}, 20) === false);
ok("فاز any همیشه", T.supportPhaseMatch({phase:"any"}, 999) === true);

/* ============ بخش الف — متن‌های بازبینی‌شده، دقیقاً برابر پرامپت ============ */
ok("الف-۱ smallAction dbt-feeding-grief",
  item("dbt-feeding-grief").smallAction === "یک تصمیم را فقط با یک متخصص (ماما/مشاور شیردهی/پزشک نوزاد) بگیر؛ نه با مقایسه‌ها و توصیه‌های پراکنده.",
  item("dbt-feeding-grief").smallAction);
ok("الف-۱ «بگیرد» حذف شد", bodyOf(item("dbt-feeding-grief")).indexOf("بگیرد") === -1);
ok("الف-۲ nextStep sad-numb",
  item("sad-numb").nextStep.text === "اگر این حالت بیش از دو هفته ادامه دارد یا با غم و بی‌علاقگی همراه است، ارزیابی کمک می‌کند؛ گفتنش آن را سنگین‌تر نمی‌کند." &&
  item("sad-numb").nextStep.action === "guide:g-mood",
  item("sad-numb").nextStep.text);
ok("الف-۳ levels.follow bdy-constipation",
  item("bdy-constipation").levels.follow === "اگر چند روز ادامه دارد، دردناک است یا با خون همراه است، دربارهٔ نرم‌کنندهٔ مدفوع با پزشک یا ماما مشورت کن (به‌ویژه در شیردهی).",
  item("bdy-constipation").levels.follow);
ok("الف-۳ levels.self bdy-constipation بدون تغییر",
  item("bdy-constipation").levels.self === "مایعات، فیبر، حرکت ملایم، و پرهیز از عقب‌انداختن دفع.");
ok("الف-۳ levels.urgent bdy-constipation بدون تغییر",
  item("bdy-constipation").levels.urgent === "اگر درد شدید شکم، استفراغ یا ناتوانی در دفع گاز و مدفوع داری، فوراً ارزیابی شو.");
ok("الف-۳ nextStep تازهٔ bdy-constipation (الگوی bdy-wound)",
  item("bdy-constipation").nextStep.text === "اگر چند روز اجابت مزاج نداری، یا با درد شدید، استفراغ یا خون همراه است، دیر نکن و ارزیابی شو." &&
  item("bdy-constipation").nextStep.action === "flags",
  JSON.stringify(item("bdy-constipation").nextStep));
ok("الف-۴ smallAction bdy-sleep",
  item("bdy-sleep").smallAction === "اگر می‌شود، یک نوبت شبانه را کامل به فرد دیگری بسپار تا یک بازهٔ ۴ تا ۵ ساعتهٔ پیوسته بخوابی؛ خواب پیوسته اثر بیشتری از چند چرت کوتاه دارد. اگر شیر می‌دهی، برای آن نوبت از قبل شیر دوشیده‌شده یا شیر خشک آماده کن تا فرد دیگر بتواند نوزاد را سیر کند.",
  item("bdy-sleep").smallAction);
ok("الف-۵ smallAction dbt-culture",
  item("dbt-culture").smallAction === "با همسر یا یک نفر قابل‌اعتماد از نزدیکانت از قبل یک جملهٔ مشترک آماده کنید، مثل «این هفته استراحت لازم داریم»، تا پاسخش را او بدهد و فشار روی تو نباشد.",
  item("dbt-culture").smallAction);
ok("الف-۶ «چطوری» در sad-lonely", bodyOf(item("sad-lonely")).indexOf("چطوری") === -1 && bodyOf(item("sad-lonely")).indexOf("چگونه") > -1);
ok("الف-۶ «بتونی» در sad-confusion", bodyOf(item("sad-confusion")).indexOf("بتونی") === -1 && bodyOf(item("sad-confusion")).indexOf("بتوانی") > -1);
ok("الف-۶ «ممکنه» در sad-anhedonia", bodyOf(item("sad-anhedonia")).indexOf("ممکنه") === -1 && bodyOf(item("sad-anhedonia")).indexOf("ممکن است") > -1);
ok("الف-۶ «می‌شه» در dbt-guilt-help", bodyOf(item("dbt-guilt-help")).indexOf("می‌شه") === -1 && bodyOf(item("dbt-guilt-help")).indexOf("می‌شود") > -1);
ok("الف-۵ فراگیرسازی «همسر» تنها (bdy-sex.levels.self)", item("bdy-sex").levels.self.indexOf("همسر یا شریک زندگی") > -1, item("bdy-sex").levels.self);

/* ============ بخش ب — دو آیتم تازهٔ manualOnly ============ */
ok("ب manualOnly فقط روی دو آیتم تازه", C.ITEMS.filter(x => x.manualOnly).map(x => x.id).join(",") === "sad-nicu,sad-loss", C.ITEMS.filter(x => x.manualOnly).map(x => x.id).join(","));
ok("ب-۱ شناسه/موضوع/برچسب sad-nicu", item("sad-nicu").topic === "nicu" && item("sad-nicu").topicLabel === "کوچولوم در بیمارستان بستریه" && item("sad-nicu").section === "sad");
ok("ب-۲ شناسه/موضوع/برچسب sad-loss", item("sad-loss").topic === "loss" && item("sad-loss").topicLabel === "نوزادم رو از دست دادم" && item("sad-loss").section === "sad");
ok("ب-۳ supportItemsFor(sad,null) هرگز manualOnly برنمی‌گرداند",
  T.supportItemsFor("sad", null).every(x => !x.manualOnly) && T.supportItemsFor("sad").every(x => !x.manualOnly));
ok("ب-۳ supportPick(sad,null) هرگز manualOnly برنمی‌گرداند",
  T.supportPick("sad", null) && !T.supportPick("sad", null).manualOnly, T.supportPick("sad", null) && T.supportPick("sad", null).id);
ok("ب-۳ فالبک بخش هم manualOnly را مستثنا می‌کند",
  T.supportItemsFor("sad", "topic-نیست").every(x => !x.manualOnly));
ok("ب-۳ supportItemsFor(sad,loss) فقط sad-loss",
  T.supportItemsFor("sad", "loss").length === 1 && T.supportItemsFor("sad", "loss")[0].id === "sad-loss",
  JSON.stringify(T.supportItemsFor("sad", "loss").map(x => x.id)));
ok("ب-۳ supportItemsFor(sad,nicu) فقط sad-nicu",
  T.supportItemsFor("sad", "nicu").length === 1 && T.supportItemsFor("sad", "nicu")[0].id === "sad-nicu");
ok("ب-۳ supportTopics(sad): هر دو در انتهای فهرست",
  (function (tp) { return tp.length >= 2 && tp[tp.length - 2].topic === "nicu" && tp[tp.length - 1].topic === "loss"; })(T.supportTopics("sad")),
  JSON.stringify(T.supportTopics("sad").slice(-2).map(t => t.topic)));
ok("ب-۳ supportPick با انتخاب صریح همان آیتم را می‌دهد",
  T.supportPick("sad", "loss").id === "sad-loss" && T.supportPick("sad", "nicu").id === "sad-nicu");
ok("ب-۳ DAILY دست‌نخورده (d1..d14)",
  C.DAILY.length === 14 && C.DAILY.every((d, i) => d.id === "d" + (i + 1)));
ok("ب-۳ PROMPTS دست‌نخورده (p1..p14)",
  C.PROMPTS.length === 14 && C.PROMPTS.every((p, i) => p.id === "p" + (i + 1)));
ok("ب-۳ DAILY و PROMPTS بدون manualOnly", C.DAILY.every(x => !x.manualOnly) && C.PROMPTS.every(x => !x.manualOnly));

/* انتخاب و عدم تکرار */
const p1 = T.supportPick("sad", null);
ok("pick1 از sad", p1 && p1.section === "sad", p1 && p1.id);
T.supportRecordSeen(p1.id);
const p2 = T.supportPick("sad", null);
ok("pick2 ≠ pick1", p2 && p2.id !== p1.id, p2 && p2.id);
ok("گروه معنایی متفاوت", p2 && p2.semanticGroup !== p1.semanticGroup, (p1 && p1.semanticGroup) + "→" + (p2 && p2.semanticGroup));

/* انتخاب دستی موضوع */
const b1 = T.supportPick("doubt", "bonding");
ok("موضوع bonding", b1 && b1.topic === "bonding", b1 && b1.id);

/* روزانه پایدار */
const d1 = T.supportDailyPick(), d2 = T.supportDailyPick();
ok("روزانه پایدار در روز", d1 && d2 && d1.id === d2.id);

/* دفترچه جدا از seen */
ok("journal خالی اول", T.journalEntries().length === 0);
api._state.db.support = api._state.db.support || {};
api._state.db.support.journal = { jA: { text: "یادداشت خصوصی", ts: Date.now(), promptId: null } };
ok("journalEntries ۱ مورد", T.journalEntries().length === 1 && T.journalEntries()[0].text === "یادداشت خصوصی");
ok("متن یادداشت در seen نیست", Object.keys(api._state.db.support.seen).every(k => k.indexOf("یادداشت") < 0));

/* ============ بخش ج — بررسی ایمنی دو سطحی (riskTier) ============ */
const TIER1_SENTENCES = [
  "می‌خوام خودمو بکشم", "دلم می‌خواد خودکشی کنم", "فکر می‌کنم به بچه آسیب بزنم",
  "کاش می‌مردم و راحت می‌شدم", "دیگه نمی‌خوام زنده باشم", "بهتره من نباشم تا بچه راحت باشه",
  "می‌خوام بمیرم", "می‌خوام خودم رو بکشم", "از زندگی خسته شدم و می‌خوام تمومش کنم",
  "صداهایی می‌شنوم که می‌گن به بچه آسیب بزن", "دلم می‌خواد خودمو بکشم", "خودکشی",
  "بچه‌م رو خفه کنم", "نمیخوام ادامه بدم", "به خودم صدمه بزنم", "به بچه ام آسیب بزنم",
  "خودمو آویزون کنم", "قرص بخورم و تمومش کنم", "می‌خوام خودم را بکشم",
  "نمی‌خوام دیگه زنده بمونم", "کاش نبودم", "ای کاش همین الان بمیرم"
];
const TIER2_SENTENCES = ["می‌ترسم بچه رو از پنجره پرت کنم"];
const TIER0_SENTENCES = [
  "دارم می‌میرم از خستگی", "از خواب بیدار شدم و حس می‌کردم می‌خوام بمیرم از بی‌خوابی",
  "خسته‌ام اما حالم خوبه", "امروز چای خوردم", "بچه امروز خوب خوابید",
  "می‌خوام این کار تموم بشه", "نمی‌خوام ادامه بدم این رژیم رو", "بچه رو توی تخت گذاشتم",
  "از خنده داشتم می‌مردم", "دلم می‌خواد یه چرت بزنم", "نمی‌تونم زنده بمونم بدون قهوه",
  "شوهرم می‌گه بچه رو بندازم تو کالسکه"
];
TIER1_SENTENCES.forEach(function (s) { ok("riskTier=1: " + s, T.riskTier(s) === 1, T.riskTier(s)); });
TIER2_SENTENCES.forEach(function (s) { ok("riskTier=2: " + s, T.riskTier(s) === 2, T.riskTier(s)); });
TIER0_SENTENCES.forEach(function (s) { ok("riskTier=0: " + s, T.riskTier(s) === 0, T.riskTier(s)); });
ok("پوشش ۲۳ از ۲۳ جملهٔ پرخطر", TIER1_SENTENCES.concat(TIER2_SENTENCES).every(s => T.riskTier(s) >= 1));
ok("متن عادی مثبت کاذب ندارد", T.riskTier("امروز خیلی خسته بودم و گریه کردم") === 0);
ok("متن خالی", T.riskTier("") === 0 && T.riskTier(null) === 0);
/* سازگاری API قبلی: safetyCheck = riskTier ≥ ۱ */
ok("شناسایی جملهٔ خطر (safetyCheck سازگاری)", T.safetyCheck("دیگه نمیخوام زنده بمونم") === true);
ok("شناسایی آسیب به نوزاد (safetyCheck سازگاری)", T.safetyCheck("میترسم به نوزاد آسیب بزنم") === true);
ok("متن عادی مثبت کاذب ندارد (safetyCheck سازگاری)", T.safetyCheck("امروز خیلی خسته بودم و گریه کردم") === false);
ok("متن خالی (safetyCheck سازگاری)", T.safetyCheck("") === false);

/* ============ بخش ج — رندر کارت ایمنی و کارت نرم بدون خطا ============ */
made.length = 0;
T.showSoftCard();
const softCard = made.filter(e => e.className === "pp-sup-safety pp-sup-soft").pop();
ok("سطح ۲ کارت نرم ساخته می‌شود", !!softCard);
ok("سطح ۲ متن فکر ناخواسته", softCard && softCard.innerHTML.indexOf("فکرهای ناخواسته دربارهٔ آسیب به نوزاد در مادرها شایع‌اند") > -1);
ok("سطح ۲ دکمهٔ خواندن sad-intrusive", softCard && softCard.innerHTML.indexOf('data-ss="topic" data-section="sad" data-topic="intrusive"') > -1 && softCard.innerHTML.indexOf("بیشتر دربارهٔ فکرهای ناخواسته بخوانم") > -1);
ok("سطح ۲ دکمهٔ علائم خطر", softCard && softCard.innerHTML.indexOf('data-ss="flags"') > -1 && softCard.innerHTML.indexOf("علائم خطر") > -1);
ok("سطح ۲ دقیقاً دو دکمه دارد", softCard && (softCard.innerHTML.match(/data-ss="(topic|flags)"/g) || []).length === 2);
ok("دکمهٔ کارت نرم به آیتم درست می‌رود", T.supportPick("sad", "intrusive").id === "sad-intrusive");
made.length = 0;
T.showSafetyCard(true);
const safeCard = made.filter(e => e.className === "pp-sup-safety" && e.className.indexOf("soft") === -1).pop();
ok("سطح ۱ کارت ایمنی ساخته می‌شود", !!safeCard);
ok("سطح ۱ متن تشخیص نیست + ۱۱۵", safeCard && safeCard.innerHTML.indexOf("این یک تشخیص نیست") > -1 && safeCard.innerHTML.indexOf("tel:115") > -1);
ok("سطح ۱ خط شماره‌های حمایتی (CRISIS_LINES)", safeCard && safeCard.innerHTML.indexOf("اگر نیاز داری همین حالا با کسی صحبت کنی: ۱۲۳ (اورژانس اجتماعی، رایگان) یا ۱۴۸۰ (مشاورهٔ تلفنی رایگان بهزیستی).") > -1);
ok("سطح ۱ بدون واژهٔ خشونت", safeCard && safeCard.innerHTML.indexOf("خشونت") === -1);
ok("سطح ۱ دکمهٔ علائم خطر مثل قبل", safeCard && safeCard.innerHTML.indexOf('data-ss="flags"') > -1);
made.length = 0;
T.showSafetyCard(false); /* مسیر لینک دفترچه: بدون توست «ذخیره شد» */
ok("فراخوانی بدون توست هم بی‌خطاست", made.filter(e => e.className === "pp-sup-safety").length >= 1);
ok("CRISIS_LINES جدا و قابل‌تغییر است", C.CRISIS_LINES && C.CRISIS_LINES.length === 2 && C.CRISIS_LINES[0].num === "۱۲۳" && C.CRISIS_LINES[1].num === "۱۴۸۰");

/* شخصی‌سازی */
const pl = T.personalLine();
ok("خط شخصی ساخته می‌شود", pl && typeof pl.text === "string" && pl.text.length > 10, pl && pl.text);
ok("خط شخصی روز را ذکر می‌کند", pl.text.indexOf("۲۰") > -1 || pl.text.indexOf("روز") > -1);

/* صدا (در Node در دسترس نیست → باید false باشد، بدون خطا) */
ok("canSpeak در Node امن است", T.canSpeak() === false);

console.log("\nنتیجه: " + pass + " موفق، " + fail + " ناموفق");
process.exit(fail ? 1 : 0);
