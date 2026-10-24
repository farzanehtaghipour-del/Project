/* ============================================================
   edu.js — موتور محتوای آموزشی سَمن
   ارائه‌ی محتوای آموزشی به‌صورت مقاله‌های تصویریِ تعاملی با
   وضعیت‌های هدفمند (به‌جای دکمه‌ی عمومی «خواندم»):
     · راهنمای مرحله‌ای → گام‌های قابل‌علامت‌زدن + ادامه از آخرین گام
     · چک‌لیست          → ثبت موارد انجام‌شده (قابل ویرایش)
     · برنامه چندروزه   → ثبت پیشرفت هر روز
     · آموزش مستقل/مرجع → ذخیره‌کردن + اعلام مفید بودن
   ذخیره‌سازی: localStorage — کلید samn_edu_v1 — فقط روی همین دستگاه.
   باید پس از config/questions/scoring و پیش از app.js بارگذاری شود.
   ============================================================ */

/* ---------- store ---------- */
const EDU_KEY = "samn_edu_v1";
let EDU_S = (function () {
  try {
    const raw = JSON.parse(localStorage.getItem(EDU_KEY) || "{}");
    return {
      saved: raw.saved || {},
      helpful: raw.helpful || {},
      steps: raw.steps || {},
      days: raw.days || {},
    };
  } catch (e) { return { saved: {}, helpful: {}, steps: {}, days: {} }; }
})();
function eduPersist() {
  try { localStorage.setItem(EDU_KEY, JSON.stringify(EDU_S)); } catch (e) {}
}
function eduToggleArr(obj, key, i, max) {
  const arr = Array.isArray(obj[key]) ? obj[key].slice() : new Array(max).fill(0);
  arr[i] = arr[i] ? 0 : 1;
  obj[key] = arr;
  return arr;
}
function eduCount(arr) { return (arr || []).filter(Boolean).length; }

/* ---------- تصویرسازی‌های آموزشی (سبک Soft Editorial) ---------- */
const EDU_IMG = {
  "edu-feed-hero":     { src: "img/edu-feed-hero.png",     alt: "مادری در صندلی کنار پنجره با نور ملایم صبح، نوزادش را در آغوش گرفته و شیر می‌دهد" },
  "edu-feed-latch":    { src: "img/edu-feed-latch.png",    alt: "نمای کنار مادر نشسته با پشتی و بالش شیردهی که نوزاد را در وضعیت گهواره‌ای روی پاهایش نشانده است" },
  "edu-feed-nipple":   { src: "img/edu-feed-nipple.png",   alt: "مادری خسته اما امیدوار که نوزاد را روی شانه‌اش آغوش گرفته؛ کنارش چای گیاهی است" },
  "edu-feed-engorged": { src: "img/edu-feed-engorged.png", alt: "مادر آرام روی مبل با کمپرس ملایم و کاسه آب گرم روی میز کناری" },
  "edu-feed-supply":   { src: "img/edu-feed-supply.png",   alt: "نوزادی که در پتوی کرم‌رنگ در آغوش مادر به‌آرامی خوابیده است" },
  "edu-feed-express":  { src: "img/edu-feed-express.png",  alt: "میز چوبی با شیردوش، شیشه شیر تمیز و لیوان آب در نور ملایم صبح" },
  "edu-feed-mixed":    { src: "img/edu-feed-mixed.png",    alt: "مادر در صندلی راکینگ با ملایمت با شیشه شیر به نوزادش شیر می‌دهد" },
  "edu-feed-help":     { src: "img/edu-feed-help.png",     alt: "مشاور شیردهی در اتاقی روشن و دوستانه، روبه‌روی مادرِ نوزادبه‌بغل نشسته و توضیح می‌دهد" },
  "edu-pp-recovery":   { src: "img/edu-pp-recovery.png",   alt: "مادر در اتاقی روشن استراحت می‌کند و نوزاد در گهواره کنار تخت خوابیده است" },
  "edu-pp-mood":       { src: "img/edu-pp-mood.png",       alt: "زنی با فنجان چای گرم کنار پنجره در نور آرام صبح، لحظه‌ای برای خودش" },
  "edu-pp-dailylife":  { src: "img/edu-pp-dailylife.png",  alt: "مادر در اتاق نوزادِ مرتب، لباس‌های کوچک را در سبد حصیری مرتب می‌کند" },
  "edu-pp-pelvic":     { src: "img/edu-pp-pelvic.png",     alt: "زنی حرکت کششی خیلی ملایم کنار پنجره انجام می‌دهد؛ حس بازگشت تدریجی به حرکت" },
  "edu-pp-intimacy":   { src: "img/edu-pp-intimacy.png",   alt: "زوج در نور آرام عصر کنار هم روی مبل نشسته‌اند؛ دست‌ها به‌آرامی به هم می‌رسند" },
  "edu-pp-support":    { src: "img/edu-pp-support.png",    alt: "پدر کنار پنجره نوزاد را در آغوش دارد و مادر روی مبل استراحت می‌کند" },
  "edu-men-calm":      { src: "img/edu-men-calm.png",      alt: "مردی در سکوت صبح کنار تخت نشسته و تمرین تنفس آرام انجام می‌دهد" },
};

function eduImg(id, opts) {
  const m = EDU_IMG[id];
  if (!m) return "";
  const o = opts || {};
  const cap = o.cap ? `<figcaption>${o.cap}</figcaption>` : "";
  return `<figure class="edu-figure ${o.sq ? "sq" : ""}"><img src="${m.src}" alt="${m.alt}" loading="lazy"/>${cap}</figure>`;
}
function eduHero(id, cap) {
  const m = EDU_IMG[id];
  if (!m) return "";
  return `<div class="edu-hero"><img src="${m.src}" alt="${m.alt}" loading="eager"/>${cap ? `<span class="edu-hero-cap">${cap}</span>` : ""}</div>`;
}

/* ---------- اجزای مشترک مقاله ---------- */
function eduLearn(items) {
  if (!items || !items.length) return "";
  return `<ul class="edu-learn edu-reveal">${items.map(function (t) {
    return `<li>${I.check}${t}</li>`;
  }).join("")}</ul>`;
}
function eduKey(title, text) {
  if (!text) return "";
  return `<div class="edu-key edu-reveal">${I.bulb}<div><b>${title}</b><p>${text}</p></div></div>`;
}
function eduSteps(key, steps, opts) {
  const o = opts || {};
  const done = EDU_S.steps[key] || [];
  const n = eduCount(done);
  const pct = steps.length ? Math.round((n / steps.length) * 100) : 0;
  let nextIdx = done.findIndex(function (v) { return !v; });
  const checkable = o.checkable !== false;
  return `
  <div class="edu-block edu-reveal" data-edusteps="${key}">
    <span class="edu-kicker">${I.flag}${o.title || "گام‌به‌گام"}</span>
    ${checkable ? `
    <div class="edu-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${steps.length}" aria-valuenow="${n}">
      <div class="edu-prog-bar"><i style="width:${pct}%"></i></div>
      <span class="edu-prog-lab" data-proglab="${key}">${fa(n)} از ${fa(steps.length)} گام</span>
    </div>` : ""}
    <ol class="edu-steps ${checkable ? "checkable" : ""}">
      ${steps.map(function (s, i) {
        const isDone = !!done[i];
        const isNext = checkable && i === nextIdx;
        return `
        <li class="${isDone ? "done" : ""} ${isNext ? "next-up" : ""}" ${checkable ? `data-edu="step" data-key="${key}" data-i="${i}" role="button" tabindex="0" aria-pressed="${isDone}" aria-label="گام ${fa(i + 1)}: ${esc(s)}"` : ""}>
          ${checkable ? `<span class="step-ck">${I.check}</span>` : ""}
          <span>${s}</span>
        </li>`;
      }).join("")}
    </ol>
  </div>`;
}
function eduAvoid(title, items) {
  if (!items || !items.length) return "";
  return `
  <details class="edu-details edu-reveal">
    <summary>${I.alert}${esc(title || "اشتباه‌های رایج — چه چیزهایی کمک نمی‌کند")}<span class="chev">${I.chevD}</span></summary>
    <div class="edu-details-in">
      <ul class="edu-list">
        ${items.map(function (s) { return `<li><i class="dot warn"></i><span>${s}</span></li>`; }).join("")}
      </ul>
    </div>
  </details>`;
}
function eduSeek(items, note) {
  if (!items || !items.length) return "";
  return `
  <div class="edu-seek edu-reveal">
    <span class="edu-kicker">${I.alert}چه زمانی کمک حرفه‌ای لازم است؟</span>
    <ul class="edu-list">
      ${items.map(function (s) { return `<li><i class="dot warn"></i><span>${s}</span></li>`; }).join("")}
    </ul>
    ${note ? `<p style="margin:8px 0 0;font-size:.78rem;color:#8a5a52">${note}</p>` : ""}
  </div>`;
}
function eduStates(key, opts) {
  const o = opts || {};
  const isSaved = !!EDU_S.saved[key];
  const voted = !!EDU_S.helpful[key];
  return `
  <div class="edu-states">
    <button type="button" class="edu-st ${isSaved ? "on" : ""}" data-edu="save" data-key="${key}" aria-pressed="${isSaved}">
      ${I.clip}<span data-savelab>${isSaved ? "ذخیره شد" : "ذخیره برای مرور"}</span>
    </button>
    <button type="button" class="edu-st ${voted ? "on" : ""}" data-edu="helpful" data-key="${key}" ${voted ? "disabled" : ""} aria-pressed="${voted}">
      ${I.flower}<span>${voted ? "ممنون از بازخوردت" : "برایم مفید بود"}</span>
    </button>
  </div>`;
}
function eduSrc(source, review) {
  if (!source && !review) return "";
  return `<div class="edu-src">
    ${source ? `<span>منبع: ${source}</span>` : ""}
    ${review ? `<span>${review}</span>` : ""}
  </div>`;
}
function eduSum(items, nextHtml) {
  if ((!items || !items.length) && !nextHtml) return "";
  return `
  <div class="edu-sum edu-reveal">
    <span class="edu-kicker">${I.check}خلاصه</span>
    ${items && items.length ? `<ul>${items.map(function (s) { return `<li>${I.check}<span>${s}</span></li>`; }).join("")}</ul>` : ""}
    ${nextHtml ? `<div class="edu-next">${nextHtml}</div>` : ""}
  </div>`;
}
function eduNextBtn(label, to, ghost) {
  return `<button type="button" class="nx ${ghost ? "ghost" : ""}" data-edu="nav" data-to="${to}">${label} ${I.chevL}</button>`;
}

/* ============================================================
   راهنمای تصویری شیردهی — نمونه‌ی مرجع سیستم آموزشی
   محتوای علمی از کارت‌های «همراه شیردهی» همان پلتفرم نقل شده
   (WHO 2022 · NHS · CDC) — بدون تحریف؛ بازآرایی برای یادگیری.
   ============================================================ */

const EDU_FEED_ORDER = ["tg-start", "tg-supply", "tg-nipple", "tg-engorge", "tg-express", "tg-mixed", "tg-help"];

const EDU_FEED = {
  "tg-start": {
    title: "شروع درست: جای گرفتن و وضعیت بدن",
    tag: "پایه‌ای‌ترین مهارت — همان که بقیه را آسان می‌کند",
    img: "edu-feed-latch",
    lead: "در روزهای اول شاید نشاندن نوزاد به‌راحتی پیش نرود؛ دست‌ها ناشی‌اند و نوزاد بی‌قرار — این حالت برای تقریباً همه‌ی مادرها آشناست. شیردهی یک مهارت یادگرفتنی برای تو و نوزاد است، نه آزمایشی که قبول یا رد شود. وقتی جای گرفتن درست باشد، شیردهی بیشتر «حس فشار ملایم» می‌دهد تا درد.",
    learn: ["آماده‌سازی راحت بدن خودت", "خطِ گوش، شانه و لگن نوزاد", "نشانه‌های گرفتن درست سینه", "جداسازی بی‌درد هنگام نیاز"],
    key: "جای نشستن نامناسب، رایج‌ترین علت ناراحتی در شیردهی است؛ قبل از هر تغییر دیگری، وضعیت را اصلاح کن.",
    stepsTitle: "۵ گامِ گرفتن درست سینه",
    steps: [
      "اول خودت راحت بنشین؛ پشتت حمایت داشته باشد، آب و چیز لازم کنار دستت باشد.",
      "تمام بدن نوزاد را رو به خودت نزدیک کن؛ گوش، شانه و لگن در یک خط باشد.",
      "نوک سینه را مقابل بینی نوزاد بگیر تا با باز شدن دهان، سینه را بگیرد؛ چانه‌اش به سینه بچسبد.",
      "نشانه‌ی خوب گرفتن را چک کن: دهان باز بزرگ، لب‌های برگشته به بیرون، چانه چسبیده و صدای بلع منظم.",
      "اگر درد داشتی، با انگشت کوچک لبه‌ی دهان نوزاد را باز کن و دوباره شروع کن؛ تلاش مکرر طبیعی است."
    ],
    avoid: [
      "تنها سر نوزاد را نگیر؛ بدنش باید هم حمایت شود.",
      "درد مداوم را جزو «شرایط شیردهی» فرض نکن.",
      "با گرسنه و بی‌قرار بودنِ شدید نوزاد شروع به تمرین نکن؛ اول آرامش‌بخش باشد."
    ],
    seek: [
      "اگر در هر بار شیردهی درد شدید داری یا نوک سینه آسیب می‌بیند، با ماما یا مشاور شیردهی تماس بگیر؛ علت اغلب قابل اصلاح است.",
      "اگر نوزاد به‌طور مداوم سینه را نمی‌گیرد، ارزیابی حضوری بسیار کمک می‌کند.",
      "نگرانی درباره‌ی وزن‌گیری نوزاد را با پزشک کودکان در میان بگذار."
    ],
    sum: [
      "راحتی تو، شرط شروعِ یک شیردهی خوب است.",
      "نشانه‌ی موفقیت «حس فشار ملایم» است، نه درد.",
      "تمرین مکرر بین تو و نوزاد عادی و لازم است."
    ],
    source: "WHO 2022 · NHS Breastfeeding Positions",
    review: "پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."
  },

  "tg-supply": {
    title: "آیا شیرم کافی است؟ سنجه‌های واقعی",
    tag: "به‌جای حدس و نگرانی، معیارهای قابل‌اتکا را بشناس",
    img: "edu-feed-supply",
    lead: "«شاید شیرم کافی نباشد» یکی از رایج‌ترین نگرانی‌های مادرهاست؛ سینه‌های نرم‌تر از هفته‌ی اول، فاصله‌ی شیرها یا بی‌قراری نوزاد، همه حس نگرانی می‌سازند. اما حس، سنجه نیست. بدن پس از هفته‌های اول با نیاز واقعی نوزاد تنظیم می‌شود و بی‌قراری نوزاد اغلب جهش رشد یا نیاز به نوازش است، نه گرسنگی.",
    learn: ["سه سنجه‌ی قابل‌اتکای کافی بودن شیر", "شمارش ساده‌ی پوشک‌ها", "چطور تولید با تقاضا تنظیم می‌شود", "مرز میان نگرانی و هشدار واقعی"],
    key: "سینه‌ی نرم، معیار کمبود شیر نیست؛ یعنی بدن تنظیم شده. سنجه‌ی واقعی پوشک، وزن و بلع است.",
    stepsTitle: "۴ گام برای اطمینان پیدا کردن",
    steps: [
      "به‌جای حدس، چند روز شمارش پوشک‌های خیس و مدفوع مناسب سن را یادداشت کن.",
      "شیردهی را به اقتضای نوزاد افزایش بده؛ شیردهی مکرر به بدن پیام «بیشتر تولید کن» می‌دهد.",
      "تماس پوست‌به‌پوست، استراحت ممکن، آب و غذای کافی را جدی بگیر.",
      "وزن نوزاد را در نوبت‌های پیش‌بینی‌شده‌ی پزشک پیگیری کن؛ اگر دلت آرام نشد، یک مشورت با ماما یا مشاور شیردهی بگیر."
    ],
    info: {
      type: "table",
      title: "اینفوگرافیک: تقریبِ پوشک‌های خیس در روزهای اول",
      note: "راهنمای عمومی برای آرامش خاطر است؛ مرجع دقیق ارزیابی، پزشک نوزاد است.",
      head: ["سن نوزاد", "پوشک خیس در شبانه‌روز"],
      rows: [
        ["روز اول", "۱ تا ۲"],
        ["روز دوم", "۲ تا ۳"],
        ["روز سوم", "۳ تا ۵"],
        ["روز چهارم به بعد", "۴ تا ۶ یا بیشتر، سنگین‌تر"]
      ]
    },
    compare: {
      title: "مقایسه: نشانه‌های نرمال یا هشدار",
      good: { t: "نشانه‌های آسوده‌کننده", items: ["بیدار شدن برای شیر و مکیدن قوی", "صدای بلع منظم هنگام شیر خوردن", "پوشک‌های خیس مطابق تقویم بالا", "آرامش و خواب کافی بعد از شیر"] },
      bad: { t: "نشانه‌های نیازمند بررسی", items: ["پوشک خیس کمتر از حد جدول", "بی‌حالی یا خواب‌آلودگی دائم", "نوزادی که بعد از شیر مدام بی‌قرار است", "عدم وزن‌گیری در کنترل پزشک"] }
    },
    avoid: [
      "از روی احساس نگرانی، بدون مشورت، شیر خشک اضافه نکن؛ گاهی مشکل جای گرفتن یا برنامه‌ی شیردهی است.",
      "خودت را ملامت نکن؛ کم بودن شیر یک «قصور مادری» نیست.",
      "مقدار پمپاژ را معیار سنجش تولید ندان؛ مقدار پمپ با نیاز نوزاد تفاوت دارد."
    ],
    seek: [
      "پوشک‌های خیس کمتر از حد طبیعی، بی‌حالی نوزاد یا عدم وزن‌گیری؛ با پزشک کودکان تماس بگیر.",
      "نوزادی که بعد از شیر مدام بی‌قرار است و وزن نمی‌گیرد، باید ارزیابی حضوری شود.",
      "درد یا ترشح نوک سینه که مانع شیردهی مؤثر است، قابل کمک گرفتن است."
    ],
    sum: [
      "حس نگرانی طبیعی است ولی سنجه نیست.",
      "پوشک، وزن و بلع؛ سه معیار واقعی.",
      "تولید شیر با تقاضا تنظیم می‌شود، نه با نگرانی."
    ],
    source: "WHO 2022 · CDC Milk Supply",
    review: "پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."
  },

  "tg-nipple": {
    title: "درد و آسیب نوک سینه",
    tag: "رایج‌ترین دشواری هفته‌های اول — با علتِ قابل‌رفع",
    img: "edu-feed-nipple",
    lead: "حساسیت ملایم در روزهای نخست رایج است، اما درد شدید، سوزش در کل زمان شیردهی، ترک یا خون‌ریزی طبیعی محسوب نمی‌شود و نباید تحملش کنی. خبر خوب: این درد معمولاً علت قابل‌رفع دارد و شایع‌ترین علتش، جای گرفتن نامناسب نوزاد است.",
    learn: ["تشخیص «حساسیت طبیعی» از «دردِ مشکل‌دار»", "مراقبت ساده‌ی نوک سینه در خانه", "چیزهایی که بهبود را کند می‌کنند", "چه زمانی معاینه لازم است"],
    key: "ادامه‌ی درد یعنی مشکل حل نشده است؛ تحمل نکن — با اصلاح جای گرفتن، اغلب چند روزه بهتر می‌شود.",
    stepsTitle: "۵ گامِ مراقبت و تسکین",
    steps: [
      "قبل از هر چیز، جای گرفتن نوزاد را دوباره بررسی کن؛ اغلب با اصلاح آن، درد کم می‌شود.",
      "بعد از شیردهی، چند قطره شیر مادر را روی نوک بمال و بگذار در هوا خشک شود؛ برخی مادرها این کار را آرامش‌دهنده می‌دانند.",
      "از کرم‌های محافظ مناسب شیردهی یا پد هیدروژل می‌توان استفاده کرد؛ نوع مناسب را از ماما یا داروخانه بپرس.",
      "پدهای شیردهی را مرتب عوض کن تا ناحیه خشک بماند.",
      "برای آرامش موقت، کمپرس سرد کوتاه بعد از شیردهی کمک می‌کند؛ اگر درد یک وعده بیش از حد شد، از سینه‌ی کم‌دردتر شروع کن."
    ],
    avoid: [
      "نوک سینه را با صابون یا الکل نشوی؛ لایه‌ی محافظ پوست از بین می‌رود.",
      "درد را تحمل نکن و «سخت نگیر»؛ این کار مشکل را بدتر و شیردهی را کوتاه‌تر می‌کند.",
      "شروع یا قطع شیردهی را بدون مشورت حرفه‌ای و فقط به‌خاطر درد تصمیم نگیر؛ راه‌های میانی هست."
    ],
    seek: [
      "دردی که در طول شیردهی ادامه دارد یا با آسیب همراه است، باید توسط ماما یا مشاور شیردهی بررسی شود.",
      "سفیدی دردناک نوک سینه یا درد تیز عمقی می‌تواند نشانه‌ی قارچ یا اسپاسم عروقی باشد و درمان دارد.",
      "تب همراه با درد سینه نیازمند بررسی سریع است."
    ],
    sum: [
      "حساسیت ملایم اول عادی است؛ دردِ مداوم نه.",
      "اول جای گرفتن را اصلاح کن، بعد مراقبت موضعی.",
      "صابون و الکل ممنوع؛ شیر مادر و خشک نگه‌داشتن کمک‌کننده است."
    ],
    source: "WHO 2022 · NHS Sore Nipples",
    review: "پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."
  },

  "tg-engorge": {
    title: "پُری، احتقان و سختی سینه",
    tag: "روزهای ۲ تا ۵ — با تنظیم شیر کم می‌شود",
    img: "edu-feed-engorged",
    lead: "در روزهای دو تا پنج، با رسیدن شیر، سینه‌ها بزرگ، سفت، گرم و حساس می‌شوند؛ نوک سینه ممکن است صاف و کشیده شود و گرفتن برای نوزاد سخت‌تر شود. علت: خون و شیر همزمان به سینه‌ها هجوم می‌آورند تا تولید تنظیم شود — بدن هنوز در حال «هم‌فهم شدن» با نیاز نوزاد است. این پُری با تنظیم شدن شیر، در چند روز کاهش پیدا می‌کند.",
    learn: ["چرا پُری اتفاق می‌افتد و کِی تمام می‌شود", "تخلیه‌ی مؤثر؛ مهم‌ترین راهکار", "کمپرس سرد یا گرم؟ هر کدام کِی", "علامت‌های التهاب که نباید نادیده بمانند"],
    key: "کمپرس گرم فقط کوتاه و قبل از شیردهی کمک می‌کند؛ گرمای طولانی بدون تخلیه، تورم را بدتر می‌کند.",
    stepsTitle: "۵ گامِ کاهش پُری و درد",
    steps: [
      "به‌طور منظم و به اقتضای نوزاد شیر بده؛ تخلیه‌ی مؤثر مهم‌ترین عامل آرامش است.",
      "قبل از شیردهی، با چند قطره‌ی دستی شیر را کمی بگیر تا هاله نرم شود و نوزاد راحت‌تر بگیرد.",
      "بین شیردهی‌ها کمپرس سرد (پوشانده، چند دقیقه) ناراحتی را کم می‌کند؛ بعد از وعده هم آرامش‌دهنده است.",
      "لباس و سوتین راحت و غیرفشاری بپوش.",
      "کمپرس گرم کوتاه فقط قبل از شیردهی یا تخلیه کمک می‌کند، نه طولانی‌مدت."
    ],
    avoid: [
      "پمپاژ طولانی و زیاد برای «خالی کردن کامل» تولید را بیشتر می‌کند.",
      "سینه را ساعتی‌ها رها نکن؛ اگر نوزاد نمی‌خورد، مقدار کمی شیر بگیر تا راحت شوی.",
      "سوتین تنگ یا سیم‌دارِ فشاری نپوش.",
      "سفت کردن و ماساژ شدید ناحیه‌ی ملتهب فشار را بیشتر می‌کند."
    ],
    seek: [
      "قرمزی موضعی مثل گُوه، درد شدید یک نقطه، تب و حالت آنفلوآنزایی می‌تواند نشانه‌ی التهاب پستان باشد؛ سریع با پزشک تماس بگیر.",
      "توده‌ای که با تخلیه بهتر نمی‌شود را بررسی کن.",
      "اگر پُری و درد چند روز پیوسته بدتر شد، کمک تخصصی بگیر."
    ],
    sum: [
      "پُری روزهای ۲ تا ۵ موقتی است؛ تخلیه‌ی منظم سریع‌ترش می‌کند.",
      "سردِ کوتاه بین وعده‌ها، گرمِ کوتاه قبل وعده.",
      "قرمزی گوه‌مانند و تب یعنی تماس سریع با پزشک."
    ],
    source: "WHO 2022 · NHS Breast Engorgement",
    review: "پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."
  },

  "tg-express": {
    title: "شیردوشی و نگهداری شیر مادر",
    tag: "آزادی بیشتر با چند قاعده‌ی ساده",
    img: "edu-feed-express",
    lead: "شاید برای استراحت، مراجعه یا کار بخواهی شیر بگیری؛ در شروع ممکن است مقدار کم باشد و این طبیعی است. شیر مادر در شرایط تمیز و دمای مناسب زنده می‌ماند؛ شناخت این قواعد چند دقیقه بیشتر نمی‌گیرد و به تو آزادی و آرامش می‌دهد بدون اینکه کیفیت شیر به خطر بیفتد.",
    learn: ["بهدا‌شتی و برچسب زدن ظرف", "قاعده‌ی عمومی دماها: اتاق، یخچال، فریزر", "یخ‌زدایی درست (و ممنوعیت مایکروویو)", "شروع با شیردوشی دستی"],
    key: "روی هر ظرف تاریخ بزن و از درِ یخچال استفاده نکن؛ نوسان دما دوستِ شیر مادر نیست.",
    stepsTitle: "۵ گامِ شیردوشی و نگهداری امن",
    steps: [
      "دست‌ها را بشو و از ظرف تمیز و درب‌دار استفاده کن؛ روی ظرف تاریخ بزن.",
      "قاعده‌ی عمومی: دمای اتاق چند ساعت، یخچال چند روز (در عمق یخچال) و فریزر چند ماه؛ راهنمای دقیق را از ماما یا منابع معتبر بگیر.",
      "برای یخ‌زدایی، ظرف را در یخچال یا آب ولرم بگذار؛ مایکروویو برای گرم کردن شیر مادر مناسب نیست.",
      "شیر یخ‌زدایی‌شده را دوباره فریز نکن و باقی‌مانده‌ی شیر یک وعده را نگه ندار.",
      "با شیردوشی دستی شروع کن؛ برخی مادرها آن را راحت‌تر و بی‌هزینه می‌یابند."
    ],
    info: {
      type: "timeline",
      title: "خط زمانی نگهداری (قاعده‌ی عمومی)",
      note: "این تقریبِ عمومی است؛ راهنمای دقیق و شرایط خانه‌ی تو را از ماما یا منابع معتبر بپرس.",
      items: [
        ["دمای اتاق", "چند ساعت — دور از نور و گرما"],
        ["یخچال", "چند روز — در عمق یخچال، نه درِ آن"],
        ["فریزر", "چند ماه — ظرف درب‌دار و برچسب‌دار"]
      ]
    },
    avoid: [
      "از ظرف‌های غیربهداشتی یا شسته‌نشده استفاده نکن.",
      "شیر را در درِ یخچال نگذار؛ دما نوسان دارد.",
      "اگر شیر بوی نامعمول یا ظاهر عجیب داشت، محتاط باش و از منبع معتبر بپرس."
    ],
    seek: [
      "اگر شیردوشی دردناک یا بی‌نتیجه است، اندازه‌ی فنجان شیردوش و تکنیک قابل تنظیم است؛ از مشاور شیردهی کمک بگیر.",
      "برای بازگشت به کار و برنامه‌ی شیردهی، مشورت زودهنگام کمک می‌کند.",
      "سؤال درباره‌ی مقدار و وعده‌ها را با پزشک نوزاد در میان بگذار."
    ],
    sum: [
      "تمیزی + دمای درست + تاریخ = نگهداری امن.",
      "مایکروویو برای گرم‌کردن شیر مادر هرگز.",
      "مقدار کم در شروع طبیعی است."
    ],
    source: "NHS Expressing & Storing · CDC Milk Storage",
    review: "پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."
  },

  "tg-mixed": {
    title: "تغذیه‌ی ترکیبی و شیر خشک — بدون قضاوت",
    tag: "انتخابِ آگاه و آرام، مالِ تو و خانواده‌ات",
    img: "edu-feed-mixed",
    lead: "شاید شرایط جسمی، روحی یا زندگی، تغذیه‌ی ترکیبی یا شیر خشک را برایت آسان‌تر یا ضروری کند؛ شاید هم از ملاک‌های اطرافیان دلت گرفته باشد. هر انتخابی که با شناخت و آرامش انجام شود، برای نوزاد و برای تو ارزشمند است. تغذیه فقط یکی از ده‌ها راهی است که مادر با نوزادش پیوند و مراقبت می‌سازد.",
    learn: ["چیدن ترتیب وعده‌ها (اگر حفظ شیر مادر هدفت است)", "روش شیشه‌ی پاسخگو (آهسته)", "بهداشت شیشه‌ها", "مرزبندی در برابر نصیحت‌ها"],
    key: "سلامت تو هم بخشی از سلامت نوزاد است؛ احساس گناه معیار تصمیم تغذیه نیست.",
    stepsTitle: "۵ گامِ تغذیه‌ی ترکیبیِ آگاهانه",
    steps: [
      "برای انتخاب نوع و مقدار شیر خشک و طرز تهیه‌ی اصولی، با پزشک نوزاد مشورت کن.",
      "در تغذیه‌ی ترکیبی، ترتیب و زمان‌بندی را با یک مشاور شیردهی بچین تا شیر مادر حفظ شود (اگر این هدف توست) — مثلاً شیر مادر بیشتر در شب.",
      "شیشه‌ها را طبق راهنمای بهداشتی تمیز و ضدعفونی کن؛ روش شیشه‌ی پاسخگو (آهسته) کمک می‌کند نوزاد زیاده‌روی نکند.",
      "هنگام شیر دادن، نوزاد را نزدیک نگه دار و تماس چشمی داشته باش؛ پیوند همین‌جا ساخته می‌شود.",
      "مرزهای خودت را تعیین کن: می‌توانی بگویی «برای انتخاب تغذیه، نظر پزشک برای ما کافی است»."
    ],
    avoid: [
      "به خودت نگوی «مادرِ ناقص»؛ روش تغذیه معیار محبت و توانمندی تو نیست.",
      "به فشار اطرافیان بی‌گفت‌وگو تن نده؛ انتخاب تغذیه مال تو و خانواده‌ی توست.",
      "مقدار شیر خشک را بدون مشورت پزشک کم و زیاد نکن.",
      "به نصیحت‌های قطعیِ بی‌منبع اعتماد نکن."
    ],
    seek: [
      "برای هر تغییر در برنامه‌ی تغذیه، پزشک نوزاد منبع درست تصمیم است.",
      "اگر احساس گناه یا ناراحتی شدید درباره‌ی تغذیه داری، گفتگو با متخصص سلامت روان ارزشمند است.",
      "نگرانی وزن یا رشد نوزاد را با پزشک پیگیری کن."
    ],
    sum: [
      "ترکیبی یک انتخاب مشروع و رایج است.",
      "برنامه‌ریزی با مشورت، نه با فشار اطراف.",
      "پیوند مادری به روش تغذیه وابسته نیست."
    ],
    source: "WHO 2022 · NHS Formula Feeding",
    review: "پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."
  },

  "tg-help": {
    title: "کِی کمک تخصصی بگیرم؟",
    tag: "نقشه‌ی راهنما: چه کسی، برای چه چیزی، کِی",
    img: "edu-feed-help",
    lead: "درخواست کمک نشانه‌ی ضعف نیست؛ بخشی از مراقبت حرفه‌ای از تو و نوزاد است. خیلی از دشواری‌های شیردهی با یک ارزیابی حضوری ساده حل می‌شوند — به‌خصوص وقتی زود انجام شود. این صفحه نقشه‌ی «چه کسی برای چه کاری» و فهرست نشانه‌هایی است که نباید منتظر «بهتر شدن خودش» بمانند.",
    learn: ["تفاوت نقش ماما، مشاور شیردهی و پزشک کودکان", "نشانه‌های «همین امروز» برای تماس", "در تماس چه بگویی", "اینکه کمک‌گرفتن چطور شیردهی را نجات می‌دهد"],
    key: "تب بالا، قرمزی گوه‌مانند سینه، پوشک خیس بسیار کم یا بی‌حالی نوزاد؛ این‌ها «فردا می‌پرسم» نیستند.",
    stepsTitle: "۳ گامِ گرفتن کمک مؤثر",
    steps: [
      "قبل از تماس، چند نکته را یادداشت کن: از کِی شروع شده، چند بار شیر خورده، چند پوشک خیس — همین‌ها تصمیم‌گیری را دقیق می‌کند.",
      "همین امروز تماس بگیر اگر یکی از نشانه‌های هشدار را می‌بینی؛ برای بقیه‌ی سؤال‌ها، نوبت بعدی ویزیت یا خط مشاوره کافی است.",
      "اگر توصیه شد حضوری برو، نرو — ارزیابی چشمیِ جای گرفتن و مکیدن، چیزی است که از راه دور ممکن نیست."
    ],
    who: {
      title: "چه کسی برای چه کاری؟",
      items: [
        ["ماما یا مشاور شیردهی", "جای گرفتن، درد نوک سینه، برنامه‌ی شیردهی و شیردوشی"],
        ["پزشک کودکان", "وزن، پوشک، سلامت و رشد نوزاد، نوع و مقدار شیر خشک"],
        ["پزشک یا مای خودت", "درد، تب، التهاب سینه و حال روحی تو"]
      ]
    },
    avoid: [
      "منتظر «خودش بهتر شدن» نشین اگر نشانه‌ی هشدار داری.",
      "درد شدید را با تحمل مدیریت نکن؛ علتش قابل پیدا شدن است.",
      "تصمیم‌های بزرگ (قطع شیردهی، تغییر کامل تغذیه) را وسط بحران و تنها نگیر."
    ],
    seek: [
      "تب بالاتر از ۳۸ درجه، لرز و بدن‌درد همراه با قرمزی دردناک سینه.",
      "پوشک خیس بسیار کم، بی‌حالی یا وزن نگرفتن نوزاد.",
      "دردی که با اصلاح جای گرفتن چند روز بهتر نشد، ترک، خون‌ریزی یا سفیدی دردناک نوک سینه.",
      "خستگی‌ای که به ناامیدی رسیده یا اصلاً خوابت نمی‌برد؛ این‌ها با پزشک قابل گفتگو و درمان‌اند."
    ],
    sum: [
      "کمک زودهنگام، شیردهی را نجات می‌دهد.",
      "یادداشت ساده قبل از تماس، دقیق‌تر شدن کمک.",
      "برای هر موضوع، یک مرجع درست وجود دارد."
    ],
    source: "WHO 2022 · NHS When to get help",
    review: "پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."
  }
};

/* ---------- صفحه‌ی خانه‌ی راهنمای شیردهی ---------- */
function eduTopicProgress(id) {
  const t = EDU_FEED[id];
  if (!t || !t.steps) return { n: 0, total: 0 };
  const arr = EDU_S.steps["edu-feed:" + id] || [];
  return { n: eduCount(arr), total: t.steps.length };
}

function eduGuideHtml() {
  const savedCount = EDU_FEED_ORDER.filter(function (id) { return EDU_S.saved["edu-feed:" + id]; }).length;
  const cards = EDU_FEED_ORDER.map(function (id) {
    const t = EDU_FEED[id];
    const pr = eduTopicProgress(id);
    const isSaved = !!EDU_S.saved["edu-feed:" + id];
    return `
    <button type="button" class="edu-topic edu-reveal" data-edu="topic" data-id="${id}">
      <img src="${EDU_IMG[t.img].src}" alt="${EDU_IMG[t.img].alt}" loading="lazy"/>
      ${pr.n ? `<span class="tp-badge">${I.check} ${fa(pr.n)}/${fa(pr.total)}</span>` : (isSaved ? `<span class="tp-badge">ذخیره‌شده</span>` : "")}
      <span class="edu-topic-b">
        <b>${t.title}</b>
        <i>${t.tag}</i>
        <span class="edu-topic-f">${I.clip}${fa(t.steps.length)} گام عملی ${I.chevL}</span>
      </span>
    </button>`;
  }).join("");

  return `
  ${ppBackBtn("بازگشت به همراه شیردهی", "section:feeding")}
  <div class="edu-wrap">
  <article class="edu-article">
    ${eduHero("edu-feed-hero", "راهنمای تصویری شیردهی")}
    <div class="edu-head">
      <span class="edu-kick">${I.flower} همراه شیردهی · راهنمای تصویری</span>
      <h1 class="edu-h1">شیردهی با آرامش — از اولین قدم</h1>
      <p class="edu-lead">شیردهی یک مهارت مشترک بین تو و نوزاد است؛ با تمرین و آرامش جا می‌افتد. این راهنما را کوتاه و تصویری ساختیم تا همان چیزی را ببینی که امروز لازم داری — بدون متن‌های طولانی و بدون قضاوت.</p>
    </div>
    ${eduLearn([
      "گرفتن درست سینه، قدم‌به‌قدم",
      "سنجه‌های واقعیِ کافی بودن شیر",
      "مدیریت درد و پُری با روش‌های امن",
      "دانستن اینکه کِی و از چه کسی کمک بگیری"
    ])}
    <div class="edu-body" style="padding-top:8px">
      <div class="edu-seek" style="margin-bottom:14px">
        <span class="edu-kicker">${I.alert}اگر همین حالا یکی از این‌ها را می‌بینی، مستقیم برو «کِی کمک بگیرم»</span>
        <p style="margin:0;font-size:.84rem;line-height:1.95;color:#6d4038">تب و لرز با قرمزی دردناک سینه · پوشک خیس بسیار کم یا بی‌حالی نوزاد · درد شدیدی که مانع هر شیردهی شده است</p>
      </div>
      <div class="edu-topics">${cards}</div>
      ${savedCount ? `<p class="pp-mini-p" style="margin-top:12px">${fa(savedCount)} موضوع برای مرور ذخیره کرده‌ای — در همین کارت‌ها نشان «ذخیره‌شده» می‌بینی.</p>` : ""}
    </div>
    <div class="edu-src">
      <span>منابع این راهنما: WHO 2022 · NHS Breastfeeding · CDC Milk Storage — محتوای علمی از کارت‌های «همراه شیردهی» سَمن.</span>
      <span>${EDU_FEED["tg-start"].review}</span>
    </div>
    <div class="edu-states">
      <button type="button" class="edu-st" data-edu="nav" data-to="section:feeding">${I.clip}همه‌ی موضوع‌های سریع شیردهی</button>
    </div>
  </article>
  </div>`;
}

/* ---------- صفحه‌ی یک موضوع ---------- */
function eduFeedTopicHtml(id) {
  const t = EDU_FEED[id];
  if (!t) return eduGuideHtml();
  const key = "edu-feed:" + id;
  const done = EDU_S.steps[key] || [];
  const n = eduCount(done);
  const total = t.steps.length;
  const idxInOrder = EDU_FEED_ORDER.indexOf(id);
  const nextId = idxInOrder >= 0 ? EDU_FEED_ORDER[idxInOrder + 1] : null;
  const nextT = nextId ? EDU_FEED[nextId] : null;

  let infoHtml = "";
  if (t.info && t.info.type === "table") {
    infoHtml = `
    <div class="edu-info edu-reveal">
      <p class="edu-info-t">${I.info}${t.info.title}</p>
      <table class="edu-table">
        <thead><tr>${t.info.head.map(function (h) { return `<th>${h}</th>`; }).join("")}</tr></thead>
        <tbody>${t.info.rows.map(function (r) {
          return `<tr>${r.map(function (c, i) { return i === 0 ? `<td class="rowh">${c}</td>` : `<td>${c}</td>`; }).join("")}</tr>`;
        }).join("")}</tbody>
      </table>
      <p style="margin:10px 0 0;font-size:.74rem;color:var(--edu-muted)">${t.info.note}</p>
    </div>`;
  } else if (t.info && t.info.type === "timeline") {
    infoHtml = `
    <div class="edu-info edu-reveal">
      <p class="edu-info-t">${I.clock}${t.info.title}</p>
      <ul class="edu-tline">${t.info.items.map(function (it) {
        return `<li><b>${it[0]}</b><span>${it[1]}</span></li>`;
      }).join("")}</ul>
      <p style="margin:4px 0 0;font-size:.74rem;color:var(--edu-muted)">${t.info.note}</p>
    </div>`;
  }
  let whoHtml = "";
  if (t.who) {
    whoHtml = `
    <div class="edu-info edu-reveal">
      <p class="edu-info-t">${I.user}${t.who.title}</p>
      <ul class="edu-list">
        ${t.who.items.map(function (it) { return `<li><i class="dot ok"></i><span><b style="color:var(--edu-ink)">${it[0]}:</b> ${it[1]}</span></li>`; }).join("")}
      </ul>
    </div>`;
  }
  let compareHtml = "";
  if (t.compare) {
    compareHtml = `
    <div class="edu-info edu-reveal">
      <p class="edu-info-t">${I.info}${t.compare.title}</p>
      <div class="edu-compare">
        <div class="cmp good"><h5>${I.check}${t.compare.good.t}</h5><ul>${t.compare.good.items.map(function (s) { return `<li>${I.check}<span>${s}</span></li>`; }).join("")}</ul></div>
        <div class="cmp bad"><h5>${I.alert}${t.compare.bad.t}</h5><ul>${t.compare.bad.items.map(function (s) { return `<li>${I.alert}<span>${s}</span></li>`; }).join("")}</ul></div>
      </div>
    </div>`;
  }

  const nextHtml =
    (nextT ? eduNextBtn("قدم بعدی: " + nextT.title, "edu-feed:" + nextId) : "") +
    eduNextBtn("بازگشت به فهرست راهنما", "edu-feed", true);

  return `
  ${ppBackBtn("بازگشت به راهنمای شیردهی", "edu-feed")}
  <div class="edu-wrap">
  <article class="edu-article">
    ${eduHero(t.img, "راهنمای شیردهی · " + t.title)}
    <div class="edu-head">
      <span class="edu-kick">${I.flower} راهنمای شیردهی</span>
      <h1 class="edu-h1">${t.title}</h1>
      <p class="edu-lead">${t.lead}</p>
    </div>
    ${eduLearn(t.learn)}
    <div class="edu-body" style="padding-top:8px">
      ${eduKey("نکته‌ی کلیدی", t.key)}
      ${eduSteps(key, t.steps, { title: t.stepsTitle })}
      ${n > 0 && n < total ? `<p class="pp-mini-p" style="margin:-8px 0 16px">${fa(n)} گام را انجام دادی — هر وقت برگردی از همین‌جا ادامه می‌دهی.</p>` : ""}
      ${infoHtml}
      ${compareHtml}
      ${whoHtml}
      ${eduAvoid("اشتباه‌های رایج — چه چیزهایی کمک نمی‌کند", t.avoid)}
      ${eduSeek(t.seek)}
      ${eduSum(t.sum, nextHtml)}
    </div>
    ${eduSrc(t.source, t.review)}
    ${eduStates(key)}
  </article>
  </div>`;
}

/* ============================================================
   بازطراحی کارت‌های آموزشی «همراه مادر» با همین سیستم
   (تغذیه از PP_DATA — بدون تغییر علمی)
   ============================================================ */
const EDU_SECTION_IMG = {
  recovery: "edu-pp-recovery",
  mood: "edu-pp-mood",
  dailylife: "edu-pp-dailylife",
  pelvic: "edu-pp-pelvic",
  intimacy: "edu-pp-intimacy",
  support: "edu-pp-support",
  feeding: "edu-feed-hero"
};
const EDU_CARD_IMG = {
  "fee-attachment": "edu-feed-latch",
  "fee-nipple": "edu-feed-nipple",
  "fee-engorgement": "edu-feed-engorged",
  "fee-supply": "edu-feed-supply",
  "fee-express": "edu-feed-express",
  "fee-mixed": "edu-feed-mixed"
};

function eduArticleHtml(card, opts) {
  const o = opts || {};
  const key = "pp:" + card.id;
  const imgId = EDU_CARD_IMG[card.id] || EDU_SECTION_IMG[card.section] || "edu-pp-recovery";
  const done = EDU_S.steps[key] || [];
  const n = eduCount(done);
  const total = (card.steps || []).length;
  return `
  <div class="edu-wrap">
  <article class="edu-article">
    ${eduHero(imgId, card.title)}
    <div class="edu-head">
      <span class="edu-kick" ${o.kickColor ? `style="background:${o.kickColor}14;color:${o.kickColor}"` : ""}>${I.flower}${o.kick || "راهنمای همراه مادر"}</span>
      <h1 class="edu-h1">${card.title}</h1>
      <p class="edu-lead">${card.experience}</p>
    </div>
    ${eduLearn([
      "آنچه ممکن است تجربه کنی",
      "دلیلِ معمولِ این وضعیت",
      "کارهایی که واقعاً کمک می‌کنند",
      "مرزهای ایمنی و زمانِ کمک حرفه‌ای"
    ])}
    <div class="edu-body" style="padding-top:8px">
      <div class="edu-block edu-reveal">
        <span class="edu-kicker">${I.bulb}چرا این اتفاق می‌افتد؟</span>
        <p>${card.why}</p>
      </div>
      ${total ? eduSteps(key, card.steps, { title: "گام‌به‌گام: کارهایی که ممکن است کمک کنند" }) : ""}
      ${n > 0 && n < total ? `<p class="pp-mini-p" style="margin:-8px 0 16px">${fa(n)} گام را انجام دادی — ادامه از همین‌جا.</p>` : ""}
      ${eduAvoid("چه کارهایی بهتر است نکنی", card.avoid)}
      ${eduSeek(card.seekHelp)}
      ${eduSum([
        "تجربه‌ی تو عادی و قابل درک است.",
        "گام‌های کوچک همین راهنما برای شروع کافی‌اند.",
        "اگر نشانه‌های بالا را دیدی، منتظر نمان و کمک بگیر."
      ], o.nextHtml || "")}
    </div>
    ${eduSrc(card.source, card.review)}
    ${eduStates(key)}
  </article>
  </div>`;
}

/* کارت ورود به راهنمای تصویری شیردهی (در بخش شیردهی و پیشخوان) */
function eduFeedEntryCard(compact) {
  return `
  <button type="button" class="edu-entry" data-edu="topic-home" style="width:100%;text-align:start;cursor:pointer;font:inherit">
    <span class="edu-entry-ico"><img src="${EDU_IMG["edu-feed-hero"].src}" alt="${EDU_IMG["edu-feed-hero"].alt}" loading="lazy"/></span>
    <span class="edu-entry-b">
      <b>راهنمای تصویری شیردهی</b>
      <i>${compact ? "گام‌به‌گام، تصویری و کوتاه — از گرفتن سینه تا کِی کمک بگیری." : "هفت موضوع کاربردی با تصویر و گام‌های قابل‌علامت‌زدن: گرفتن سینه، سنجه‌های شیر کافی، درد و پُری، شیردوشی، تغذیه‌ی ترکیبی و زمان کمک تخصصی."}</i>
    </span>
    <span class="btn btn-pp pp-sm" style="pointer-events:none">باز کردن ${I.chevL}</span>
  </button>`;
}

/* ---------- اینفوگرافیک تمرین‌ها (سلامت مردان) ---------- */
function eduExerciseSteps(key, steps) {
  return eduSteps(key, steps, { title: "چطور انجامش بدهم — گام‌به‌گام" });
}

/* ============================================================
   رویدادها — [data-edu]
   ============================================================ */
function eduUpdateProgressUI(scope, key, total) {
  const block = scope.closest(".edu-article") || document;
  const arr = EDU_S.steps[key] || [];
  const n = eduCount(arr);
  const bar = block.querySelector(`[data-proglab="${key}"]`);
  if (bar) {
    const wrap = bar.closest(".edu-prog");
    const fill = wrap ? wrap.querySelector(".edu-prog-bar i") : null;
    if (fill) fill.style.width = Math.round((n / total) * 100) + "%";
    bar.textContent = fa(n) + " از " + fa(total) + " گام";
    if (wrap) wrap.setAttribute("aria-valuenow", String(n));
  }
}
function eduMarkNextUp(scope, key, total) {
  const list = scope.closest(".edu-article") || document;
  const lis = list.querySelectorAll(`[data-edu="step"][data-key="${key}"]`);
  let nextIdx = -1;
  const arr = EDU_S.steps[key] || [];
  for (let i = 0; i < total; i++) if (!arr[i]) { nextIdx = i; break; }
  lis.forEach(function (li, i) {
    li.classList.toggle("next-up", i === nextIdx);
  });
}
function handleEdu(act, el, e) {
  const key = el.dataset.key;
  switch (act) {
    case "nav":
    case "topic-home": {
      const to = el.dataset.to || "edu-feed";
      if (to.indexOf("edu-feed:") === 0) ppGo(to);
      else if (to === "edu-feed") ppGo("edu-feed");
      else ppGo(to);
      break;
    }
    case "topic":
      ppGo("edu-feed:" + el.dataset.id);
      break;
    case "step": {
      const li = el;
      const i = +el.dataset.i;
      const total = li.parentElement.querySelectorAll('[data-edu="step"]').length;
      const arr = eduToggleArr(EDU_S.steps, key, i, total);
      eduPersist();
      li.classList.toggle("done", !!arr[i]);
      li.setAttribute("aria-pressed", arr[i] ? "true" : "false");
      eduUpdateProgressUI(li, key, total);
      eduMarkNextUp(li, key, total);
      break;
    }
    case "save": {
      const on = !EDU_S.saved[key];
      EDU_S.saved[key] = on ? 1 : 0;
      if (!on) delete EDU_S.saved[key];
      eduPersist();
      el.classList.toggle("on", on);
      el.setAttribute("aria-pressed", on ? "true" : "false");
      const lab = el.querySelector("[data-savelab]");
      if (lab) lab.textContent = on ? "ذخیره شد" : "ذخیره برای مرور";
      if (typeof ppToast === "function") ppToast(on ? "برای مرور ذخیره شد ✓" : "از ذخیره‌شده‌ها برداشته شد");
      break;
    }
    case "helpful": {
      if (EDU_S.helpful[key]) break;
      EDU_S.helpful[key] = 1;
      eduPersist();
      el.classList.add("on");
      el.disabled = true;
      const lab = el.querySelector("span");
      if (lab) lab.textContent = "ممنون از بازخوردت";
      if (typeof ppToast === "function") ppToast("ممنون؛ این بازخورد به بهتر شدن راهنماها کمک می‌کند 🌿");
      break;
    }
    case "plan-day": {
      const pk = el.dataset.pkey;
      const i = +el.dataset.i;
      const total = +el.dataset.total || 7;
      const arr = eduToggleArr(EDU_S.days, pk, i, total);
      eduPersist();
      el.classList.toggle("on", !!arr[i]);
      el.setAttribute("aria-pressed", arr[i] ? "true" : "false");
      const lab = document.querySelector(`[data-daylab="${pk}"]`);
      if (lab) lab.textContent = fa(eduCount(arr)) + " از " + fa(total) + " روز";
      const bar = document.querySelector(`[data-daybar="${pk}"]`);
      if (bar) bar.style.width = Math.round((eduCount(arr) / total) * 100) + "%";
      break;
    }
  }
}

document.addEventListener("click", function (e) {
  const el = e.target.closest("[data-edu]");
  if (!el) return;
  handleEdu(el.dataset.edu, el, e);
});
document.addEventListener("keydown", function (e) {
  if (e.key !== "Enter" && e.key !== " ") return;
  const el = e.target.closest && e.target.closest('[data-edu="step"]');
  if (!el) return;
  e.preventDefault();
  handleEdu("step", el, e);
});
