/* ============================================================
   questions.js  —  بانک پرسش‌ها و داده‌های پرسش‌نامه‌ها
   (سلامت زنان، سلامت مردان، سلامت زناشویی، چرخه، تقویم مردان، پس از زایمان)
   باید بعد از config.js بارگذاری شود
   ============================================================ */

/* ================= Questionnaire data (data-driven) ================= */
const CONDS = {
  endo: {
    key: "endo",
    name: "اندومتریوز",
    title: "ارزیابی علائم اندومتریوز",
    time: "حدود ۷ دقیقه",
    sections: [
      {
        title: "اطلاعات عمومی",
        steps: [
          [
            {
              id: "endo_age",
              type: "number",
              label: "سن شما چند سال است؟",
              unit: "سال",
              min: 12,
              max: 90,
              placeholder: "مثلاً ۳۲",
            },
          ],
          [
            {
              id: "endo_height",
              type: "number",
              label: "قد شما",
              unit: "سانتی‌متر",
              min: 120,
              max: 220,
              placeholder: "مثلاً ۱۶۵",
            },
            {
              id: "endo_weight",
              type: "number",
              label: "وزن شما",
              unit: "کیلوگرم",
              min: 35,
              max: 200,
              placeholder: "مثلاً ۶۰",
            },
            { type: "bmi" },
          ],
          [
            {
              id: "endo_smoke",
              type: "single",
              label: "وضعیت مصرف دخانیات شما چیست؟",
              options: SMOKE,
            },
          ],
          [
            {
              id: "endo_activity",
              type: "single",
              label: "میزان فعالیت بدنی شما در هفته چقدر است؟",
              options: ACT,
            },
          ],
        ],
      },
      {
        title: "الگوی قاعدگی",
        steps: [
          [
            {
              id: "endo_menarche",
              type: "number",
              label: "سن اولین قاعدگی شما چند سال بود؟",
              unit: "سال",
              min: 8,
              max: 18,
              placeholder: "مثلاً ۱۳",
            },
          ],
          [
            {
              id: "endo_regular",
              type: "single",
              label: "قاعدگی شما منظم است؟",
              help: "منظم یعنی فاصله بین قاعدگی‌ها تقریباً یکسان باشد.",
              options: [
                { label: "منظم", v: "reg" },
                { label: "نامنظم", v: "irr" },
              ],
            },
          ],
          [
            {
              id: "endo_interval",
              type: "single",
              label: "فاصله بین شروع دو قاعدگی معمولاً چقدر است؟",
              options: [
                { label: "کمتر از ۲۱ روز", v: "lt21" },
                { label: "۲۱ تا ۳۵ روز", v: "21_35" },
                { label: "۳۶ تا ۴۵ روز", v: "36_45" },
                { label: "بیش از ۴۵ روز", v: "gt45" },
                { label: "بسیار متغیر و غیرقابل پیش‌بینی", v: "var" },
              ],
            },
          ],
          [
            {
              id: "endo_bleed_days",
              type: "single",
              label: "مدت خونریزی معمولاً چند روز است؟",
              options: [
                { label: "۳ روز یا کمتر", v: "lt3" },
                { label: "۴ تا ۵ روز", v: "4_5" },
                { label: "۶ تا ۷ روز", v: "6_7" },
                { label: "۸ روز یا بیشتر", v: "gt8" },
              ],
            },
          ],
          [
            {
              id: "endo_bleed_amount",
              type: "single",
              label: "میزان خونریزی قاعدگی معمولاً چگونه است؟",
              help: "اگر نیاز به تعویض مکرر نوار یا نپکین دارید، «زیاد» یا «خیلی زیاد» را انتخاب کنید.",
              options: [
                { label: "کم", v: "low" },
                { label: "متوسط", v: "med" },
                { label: "زیاد", v: "high" },
                { label: "خیلی زیاد", v: "vhigh" },
              ],
            },
          ],
          [
            {
              id: "endo_change6",
              type: "single",
              label:
                "آیا در ۶ ماه اخیر تغییر قابل‌توجهی در الگوی قاعدگی داشته‌اید؟",
              options: YN,
            },
          ],
          [
            {
              id: "endo_change_type",
              type: "single",
              label: "این تغییر بیشتر چه بوده است؟",
              showIf: (a) => a.endo_change6 === "yes",
              options: [
                { label: "خونریزی شدیدتر شده", v: "heavier" },
                { label: "درد بیشتر شده", v: "pain" },
                { label: "نامنظم‌تر شده", v: "irr" },
                { label: "طولانی‌تر شده", v: "longer" },
                { label: "ترکیبی از چند مورد", v: "mix" },
              ],
            },
          ],
        ],
      },
      {
        title: "الگوی درد",
        steps: [
          [
            {
              id: "endo_pain_men",
              type: "scale",
              label: "شدت درد قاعدگی را از ۰ تا ۱۰ مشخص کنید",
              help: "۰ یعنی بدون درد و ۱۰ یعنی بدترین دردی که قابل تصور است.",
              minL: "بدون درد",
              maxL: "خیلی شدید",
            },
          ],
          [
            {
              id: "endo_dysp",
              type: "single",
              label: "آیا هنگام یا پس از رابطه جنسی درد دارید؟",
              options: [
                { label: "خیر", v: "no" },
                { label: "بله", v: "yes" },
                { label: "رابطه جنسی نداشته‌ام", v: "na" },
              ],
            },
          ],
          [
            {
              id: "endo_dysp_sev",
              type: "scale",
              label: "شدت این درد را از ۰ تا ۱۰ مشخص کنید",
              showIf: (a) => a.endo_dysp === "yes",
              minL: "بدون درد",
              maxL: "خیلی شدید",
            },
          ],
          [
            {
              id: "endo_pelvic",
              type: "single",
              label: "آیا درد لگنی دارید که به قاعدگی مربوط نباشد؟",
              options: YN,
            },
          ],
          [
            {
              id: "endo_pelvic_sev",
              type: "scale",
              label: "شدت این درد را از ۰ تا ۱۰ مشخص کنید",
              showIf: (a) => a.endo_pelvic === "yes",
              minL: "بدون درد",
              maxL: "خیلی شدید",
            },
          ],
          [
            {
              id: "endo_bowel",
              type: "single",
              label: "آیا هنگام اجابت مزاج درد دارید؟",
              options: YN,
            },
          ],
          [
            {
              id: "endo_bowel_sev",
              type: "single",
              label: "شدت این درد چقدر است؟",
              showIf: (a) => a.endo_bowel === "yes",
              options: [
                { label: "خفیف", v: "mild" },
                { label: "متوسط", v: "mod" },
                { label: "شدید", v: "sev" },
              ],
            },
            {
              id: "endo_bowel_assoc",
              type: "single",
              label: "آیا این درد با قاعدگی شما مرتبط است؟",
              help: "مثلاً فقط نزدیک دوره‌های قاعدگی یا حین آن رخ می‌دهد.",
              showIf: (a) => a.endo_bowel === "yes",
              options: ASSOC,
            },
          ],
          [
            {
              id: "endo_urine",
              type: "single",
              label: "آیا هنگام ادرار درد دارید؟",
              options: YN,
            },
          ],
          [
            {
              id: "endo_urine_sev",
              type: "single",
              label: "شدت این درد چقدر است؟",
              showIf: (a) => a.endo_urine === "yes",
              options: [
                { label: "خفیف", v: "mild" },
                { label: "متوسط", v: "mod" },
                { label: "شدید", v: "sev" },
              ],
            },
            {
              id: "endo_urine_assoc",
              type: "single",
              label: "آیا این درد با قاعدگی شما مرتبط است؟",
              showIf: (a) => a.endo_urine === "yes",
              options: ASSOC,
            },
          ],
        ],
      },
      {
        title: "علائم گوارشی، ادراری و عمومی",
        steps: [
          [
            {
              id: "endo_ibs",
              type: "single",
              label:
                "آیا تاکنون تشخیص IBS (روده تحریک‌پذیر) برای شما ثبت شده است؟",
              options: YN,
            },
          ],
          [
            {
              id: "endo_ibs_like",
              type: "single",
              label: "آیا علائمی شبیه IBS دارید؟",
              help: "مانند درد شکم، نفخ یا تغییر عادات روده.",
              options: YN,
            },
          ],
          [
            {
              id: "endo_ibs_like_assoc",
              type: "single",
              label: "آیا این علائم با قاعدگی شما مرتبط است؟",
              showIf: (a) => a.endo_ibs_like === "yes",
              options: ASSOC,
            },
          ],
          [
            {
              id: "endo_bloat",
              type: "single",
              label: "آیا نفخ یا اتساع شکم دارید؟",
              options: YN,
            },
          ],
          [
            {
              id: "endo_bloat_assoc",
              type: "single",
              label: "آیا این علامت با قاعدگی شما مرتبط است؟",
              showIf: (a) => a.endo_bloat === "yes",
              options: ASSOC,
            },
          ],
          [
            {
              id: "endo_constip",
              type: "single",
              label: "آیا یبوست دارید؟",
              options: YN,
            },
          ],
          [
            {
              id: "endo_constip_assoc",
              type: "single",
              label: "آیا این علامت با قاعدگی شما مرتبط است؟",
              showIf: (a) => a.endo_constip === "yes",
              options: ASSOC,
            },
          ],
          [
            {
              id: "endo_diarr",
              type: "single",
              label: "آیا اسهال دارید؟",
              options: YN,
            },
          ],
          [
            {
              id: "endo_diarr_assoc",
              type: "single",
              label: "آیا این علامت با قاعدگی شما مرتبط است؟",
              showIf: (a) => a.endo_diarr === "yes",
              options: ASSOC,
            },
          ],
          [
            {
              id: "endo_urinary_sym",
              type: "single",
              label: "آیا علائم ادراری دارید؟",
              help: "مانند سوزش، تکرر ادرار یا فوریت ادرار.",
              options: YN,
            },
          ],
          [
            {
              id: "endo_urinary_sym_assoc",
              type: "single",
              label: "آیا این علائم با قاعدگی شما مرتبط است؟",
              showIf: (a) => a.endo_urinary_sym === "yes",
              options: ASSOC,
            },
          ],
          [
            {
              id: "endo_fatigue",
              type: "scale",
              label: "میزان خستگی روزانه شما چقدر است؟",
              minL: "بدون خستگی",
              maxL: "خیلی شدید",
            },
          ],
        ],
      },
      {
        title: "باروری و بارداری",
        steps: [
          [
            {
              id: "endo_infert",
              type: "single",
              label:
                "آیا به مدت ۱۲ ماه یا بیشتر برای بارداری تلاش کرده‌اید، بدون آنکه باردار شوید؟",
              options: [
                { label: "خیر", v: "no" },
                { label: "بله", v: "yes" },
                { label: "تلاش برای بارداری نداشته‌ام", v: "na" },
              ],
            },
          ],
          [
            {
              id: "endo_infert_dur",
              type: "single",
              label: "این مدت چقدر بوده است؟",
              showIf: (a) => a.endo_infert === "yes",
              options: [
                { label: "۱۲ تا ۲۴ ماه", v: "12_24" },
                { label: "۲ تا ۳ سال", v: "2_3y" },
                { label: "بیش از ۳ سال", v: "gt3y" },
              ],
            },
          ],
          [
            {
              id: "endo_preg_total",
              type: "number",
              label: "تعداد کل بارداری‌ها",
              help: "اگر موردی را نداشته‌اید، عدد ۰ را وارد کنید.",
              unit: "مورد",
              min: 0,
              max: 20,
              placeholder: "۰",
            },
            {
              id: "endo_births",
              type: "number",
              label: "تعداد بارداری‌های منجر به زایمان",
              unit: "مورد",
              min: 0,
              max: 20,
              placeholder: "۰",
            },
            {
              id: "endo_vaginal",
              type: "number",
              label: "تعداد زایمان طبیعی",
              unit: "مورد",
              min: 0,
              max: 20,
              placeholder: "۰",
            },
            {
              id: "endo_cesarean",
              type: "number",
              label: "تعداد سزارین",
              unit: "مورد",
              min: 0,
              max: 20,
              placeholder: "۰",
            },
          ],
          [
            {
              id: "endo_misc",
              type: "single",
              label: "آیا سقط بارداری داشته‌اید؟",
              options: YN,
            },
          ],
          [
            {
              id: "endo_misc_count",
              type: "number",
              label: "تعداد سقط‌ها",
              unit: "مورد",
              min: 1,
              max: 20,
              placeholder: "مثلاً ۱",
              showIf: (a) => a.endo_misc === "yes",
            },
          ],
          [
            {
              id: "endo_misc_age",
              type: "number",
              label: "سن بارداری در زمان سقط، در صورت اطلاع",
              unit: "هفته",
              optional: true,
              placeholder: "مثلاً ۸",
              showIf: (a) => a.endo_misc === "yes",
            },
          ],
        ],
      },
      {
        title: "سابقه خانوادگی و پزشکی",
        steps: [
          [
            {
              id: "endo_fam",
              type: "single",
              label:
                "آیا در خانواده نزدیک شما (مادر، خواهر، خاله یا عمه) اندومتریوز تشخیص داده شده است؟",
              options: YND,
            },
          ],
          [
            {
              id: "endo_chronic",
              type: "single",
              label: "آیا بیماری مزمنی دارید؟",
              options: [
                { label: "هیچ‌کدام", v: "none" },
                { label: "بیماری تیروئید", v: "thyroid" },
                { label: "بیماری خودایمنی", v: "auto" },
                { label: "سایر", v: "other" },
              ],
            },
          ],
          [
            {
              id: "endo_horm_now",
              type: "single",
              label: "آیا در حال حاضر دارو یا روش هورمونی مصرف می‌کنید؟",
              help: "مانند قرص ضدبارداری یا هورمون‌درمانی.",
              options: YN,
            },
          ],
          [
            {
              id: "endo_horm_12m",
              type: "single",
              label: "آیا در ۱۲ ماه گذشته داروی هورمونی مصرف کرده‌اید؟",
              options: YN,
            },
          ],
        ],
      },
    ],
  },
  pcos: {
    key: "pcos",
    name: "PCOS",
    title: "ارزیابی علائم PCOS",
    time: "حدود ۴ دقیقه",
    sections: [
      {
        title: "اطلاعات عمومی",
        steps: [
          [
            {
              id: "pcos_age",
              type: "number",
              label: "سن شما چند سال است؟",
              unit: "سال",
              min: 12,
              max: 90,
              placeholder: "مثلاً ۲۸",
            },
          ],
          [
            {
              id: "pcos_height",
              type: "number",
              label: "قد شما",
              unit: "سانتی‌متر",
              min: 120,
              max: 220,
              placeholder: "مثلاً ۱۶۰",
            },
            {
              id: "pcos_weight",
              type: "number",
              label: "وزن شما",
              unit: "کیلوگرم",
              min: 35,
              max: 200,
              placeholder: "مثلاً ۶۵",
            },
            { type: "bmi" },
          ],
          [
            {
              id: "pcos_wgain",
              type: "single",
              label: "در ۱۲ ماه گذشته چقدر افزایش وزن داشته‌اید؟",
              options: [
                { label: "بدون تغییر یا کمتر از ۵ کیلوگرم", v: "none" },
                { label: "۵ تا ۱۰ کیلوگرم", v: "mid" },
                { label: "بیش از ۱۰ کیلوگرم", v: "sev" },
              ],
            },
          ],
          [
            {
              id: "pcos_wloss",
              type: "single",
              label: "آیا کاهش وزن برای شما دشوار است؟",
              options: [
                { label: "خیر", v: "no" },
                { label: "تا حدی", v: "some" },
                { label: "بله، بسیار دشوار", v: "yes" },
              ],
            },
          ],
        ],
      },
      {
        title: "الگوی قاعدگی",
        steps: [
          [
            {
              id: "pcos_regular",
              type: "single",
              label: "قاعدگی شما چقدر منظم است؟",
              options: [
                { label: "کاملاً منظم", v: "reg" },
                { label: "گاهی نامنظم", v: "sometimes" },
                { label: "اغلب نامنظم", v: "often" },
                { label: "بسیار نامنظم", v: "very" },
                { label: "قطع طولانی‌مدت (چند ماه)", v: "absent" },
              ],
            },
          ],
          [
            {
              id: "pcos_cycle_len",
              type: "single",
              label: "طول سیکل قاعدگی شما",
              help: "از اولین روز خونریزی تا شروع خونریزی بعدی.",
              showIf: (a) => a.pcos_regular !== "absent",
              options: [
                { label: "۲۵ تا ۳۵ روز", v: "norm" },
                { label: "۲۱ تا ۲۴ یا ۳۶ تا ۴۵ روز", v: "mid" },
                {
                  label: "بیش از ۴۵ روز یا کاملاً غیرقابل پیش‌بینی",
                  v: "gt45",
                },
              ],
            },
          ],
          [
            {
              id: "pcos_cycles_year",
              type: "single",
              label: "در یک سال تقریباً چند بار قاعدگی دارید؟",
              showIf: (a) => a.pcos_regular !== "absent",
              options: [
                { label: "۱۰ بار یا بیشتر", v: "c10" },
                { label: "۸ تا ۹ بار", v: "c8" },
                { label: "۶ تا ۷ بار", v: "c6" },
                { label: "۵ بار یا کمتر", v: "c5" },
              ],
            },
          ],
        ],
      },
      {
        title: "علائم مرتبط با آندروژن",
        steps: [
          [
            {
              id: "pcos_hirsut",
              type: "single",
              label: "رشد موهای زائد",
              help: "در مناطقی مانند صورت، پشت شکم یا سینه.",
              options: [
                { label: "ندارم", v: "none" },
                { label: "خفیف", v: "mild" },
                { label: "متوسط", v: "mod" },
                { label: "شدید", v: "sev" },
              ],
            },
          ],
          [
            {
              id: "pcos_acne",
              type: "single",
              label: "آکنه (جوش) پوستی",
              options: [
                { label: "ندارم یا گاهی خفیف", v: "none" },
                { label: "متوسط یا مکرر", v: "mid" },
                { label: "شدید یا مقاوم به درمان", v: "sev" },
              ],
            },
          ],
          [
            {
              id: "pcos_hairloss",
              type: "single",
              label: "ریزش مو با الگوی زنانه",
              help: "کم‌پشتی مو در جلوی سر و فرق سر.",
              options: [
                { label: "ندارم", v: "no" },
                { label: "دارم، از خفیف تا شدید", v: "yes" },
              ],
            },
          ],
          [
            {
              id: "pcos_acanth",
              type: "single",
              label: "آیا تیرگی یا ضخیم‌شدن پوست دارید؟",
              help: "معمولاً در گردن، زیربغل یا کشاله ران.",
              options: YN,
            },
          ],
        ],
      },
      {
        title: "باروری و سابقه خانوادگی",
        steps: [
          [
            {
              id: "pcos_conceive",
              type: "single",
              label: "آیا در باردار شدن مشکلی داشته‌اید؟",
              options: [
                { label: "خیر", v: "no" },
                { label: "بله", v: "yes" },
                {
                  label: "هنوز تلاش نکرده‌ام یا موضوع بارداری مطرح نیست",
                  v: "na",
                },
              ],
            },
          ],
          [
            {
              id: "pcos_fam",
              type: "single",
              label: "آیا در خانواده شما PCOS تشخیص داده شده است؟",
              options: YND,
            },
          ],
          [
            {
              id: "pcos_preg",
              type: "single",
              label: "آیا تاکنون باردار شده‌اید؟",
              options: YN,
            },
          ],
          [
            {
              id: "pcos_preg_out",
              type: "single",
              label: "نتیجه بارداری یا بارداری‌های شما چه بوده است؟",
              showIf: (a) => a.pcos_preg === "yes",
              options: [
                { label: "زایمان زنده", v: "live" },
                { label: "سقط بارداری", v: "misc" },
                { label: "هر دو", v: "both" },
              ],
            },
          ],
        ],
      },
      {
        title: "سبک زندگی",
        steps: [
          [
            {
              id: "pcos_activity",
              type: "single",
              label: "میزان فعالیت بدنی شما در هفته چقدر است؟",
              options: ACT,
            },
          ],
          [
            {
              id: "pcos_diet",
              type: "single",
              label: "الگوی غذایی شما بیشتر شبیه چیست؟",
              options: [
                { label: "متنوع و متعادل", v: "good" },
                { label: "ترکیبی و گاهی نامنظم", v: "mix" },
                { label: "پر از فست‌فود، قند و غذاهای فرآوری‌شده", v: "fast" },
              ],
            },
          ],
        ],
      },
    ],
  },
  poi: {
    key: "poi",
    name: "POI",
    title: "ارزیابی علائم POI",
    time: "حدود ۱۰ دقیقه",
    sections: [
      {
        title: "اطلاعات پایه",
        steps: [
          [
            {
              id: "poi_age",
              type: "number",
              label: "سن شما چند سال است؟",
              unit: "سال",
              min: 12,
              max: 90,
              placeholder: "مثلاً ۳۳",
            },
          ],
          [
            {
              id: "poi_height",
              type: "number",
              label: "قد شما",
              unit: "سانتی‌متر",
              min: 120,
              max: 220,
              placeholder: "مثلاً ۱۶۵",
            },
            {
              id: "poi_weight",
              type: "number",
              label: "وزن شما",
              unit: "کیلوگرم",
              min: 35,
              max: 200,
              placeholder: "مثلاً ۵۸",
            },
            { type: "bmi" },
          ],
          [
            {
              id: "poi_menarche",
              type: "number",
              label: "سن اولین قاعدگی شما چند سال بود؟",
              unit: "سال",
              min: 8,
              max: 18,
              placeholder: "مثلاً ۱۲",
            },
          ],
        ],
      },
      {
        title: "الگوی قاعدگی",
        steps: [
          [
            {
              id: "poi_status",
              type: "single",
              label: "وضعیت فعلی قاعدگی شما چیست؟",
              options: [
                { label: "منظم", v: "reg" },
                { label: "کمی نامنظم", v: "slight" },
                { label: "نامنظم", v: "irr" },
                { label: "قطع شده است", v: "stopped" },
              ],
            },
          ],
          [
            {
              id: "poi_interval",
              type: "single",
              label: "فاصله معمول بین دو قاعدگی چقدر است؟",
              showIf: (a) => a.poi_status !== "stopped",
              options: [
                { label: "۲۱ تا ۳۵ روز", v: "21_35" },
                { label: "۳۶ تا ۹۰ روز", v: "36_90" },
                { label: "بیش از ۹۰ روز", v: "gt90" },
                { label: "بسیار متغیر", v: "var" },
              ],
            },
          ],
          [
            {
              id: "poi_per_year",
              type: "single",
              label: "در ۱۲ ماه گذشته چند بار قاعدگی داشته‌اید؟",
              showIf: (a) => a.poi_status !== "stopped",
              options: [
                { label: "۱۰ تا ۱۲ بار", v: "10_12" },
                { label: "۸ تا ۹ بار", v: "8_9" },
                { label: "۶ تا ۷ بار", v: "6_7" },
                { label: "۴ تا ۵ بار", v: "4_5" },
                { label: "کمتر از ۴ بار", v: "lt4" },
              ],
            },
          ],
          [
            {
              id: "poi_gap",
              type: "single",
              label: "طولانی‌ترین فاصله بدون قاعدگی چقدر بوده است؟",
              help: "بدون احتساب دوره‌های بارداری.",
              showIf: (a) => a.poi_status !== "stopped",
              options: [
                { label: "کمتر از ۳ ماه", v: "lt3" },
                { label: "۳ تا ۴ ماه", v: "3_4" },
                { label: "۴ تا ۶ ماه", v: "4_6" },
                { label: "بیش از ۶ ماه", v: "gt6" },
                { label: "عمدتاً به دلیل بارداری بوده است", v: "preg" },
              ],
            },
          ],
          [
            {
              id: "poi_change",
              type: "single",
              label:
                "آیا در ۶ تا ۱۲ ماه اخیر تغییر واضحی در الگوی قاعدگی داشته‌اید؟",
              options: YN,
            },
          ],
          [
            {
              id: "poi_change_age",
              type: "number",
              label: "این تغییر از چه سنی شروع شد؟",
              unit: "سال",
              optional: true,
              showIf: (a) => a.poi_change === "yes",
              placeholder: "مثلاً ۳۵",
            },
          ],
          [
            {
              id: "poi_amen",
              type: "single",
              label: "آیا سابقه قطع قاعدگی (آمنوره) داشته‌اید؟",
              options: [
                { label: "خیر", v: "no" },
                { label: "بله، موقت (چند ماه)", v: "temp" },
                { label: "بله، طولانی‌مدت (بیش از یک سال)", v: "long" },
              ],
            },
          ],
        ],
      },
      {
        title: "باروری",
        steps: [
          [
            {
              id: "poi_conceive",
              type: "single",
              label: "آیا در باردار شدن مشکلی دارید؟",
              options: [
                { label: "خیر", v: "no" },
                { label: "بله، اما هنوز بررسی نشده است", v: "unev" },
                {
                  label: "بله، سابقه ناباروری یا درمان ناباروری دارم",
                  v: "inf",
                },
              ],
            },
          ],
          [
            {
              id: "poi_infert_dur",
              type: "single",
              label: "مدت این چالش چقدر بوده است؟",
              showIf: (a) => a.poi_conceive !== "no",
              options: [
                { label: "کمتر از ۱۲ ماه", v: "lt12" },
                { label: "۱ تا ۲ سال", v: "1_2" },
                { label: "بیش از ۲ سال", v: "gt2" },
              ],
            },
          ],
        ],
      },
      {
        title: "علائم مرتبط با کاهش استروژن",
        steps: [
          [
            { id: "poi_sym_fl", type: "seg", label: "گرگرفتگی", options: SEG },
            {
              id: "poi_sym_ns",
              type: "seg",
              label: "تعریق شبانه",
              options: SEG,
            },
            {
              id: "poi_sym_sl",
              type: "seg",
              label: "اختلال خواب",
              options: SEG,
            },
          ],
          [
            {
              id: "poi_sym_dry",
              type: "seg",
              label: "خشکی یا ناراحتی واژن",
              options: SEG,
            },
            {
              id: "poi_sym_dys",
              type: "seg",
              label: "درد یا ناراحتی هنگام رابطه جنسی",
              options: SEG,
            },
            {
              id: "poi_sym_lib",
              type: "seg",
              label: "کاهش میل جنسی",
              options: SEG,
            },
          ],
          [
            {
              id: "poi_sym_mood",
              type: "seg",
              label: "تغییرات خلقی",
              options: SEG,
            },
            {
              id: "poi_sym_foc",
              type: "seg",
              label: "مشکل جدید در تمرکز یا حافظه",
              options: SEG,
            },
            {
              id: "poi_sym_fat",
              type: "seg",
              label: "خستگی یا کاهش انرژی",
              options: SEG,
            },
          ],
        ],
      },
      {
        title: "سابقه خانوادگی و ژنتیک",
        steps: [
          [
            {
              id: "poi_fam_poi",
              type: "single",
              label: "آیا سابقه POI در خانواده شما وجود دارد؟",
              options: YND,
            },
          ],
          [
            {
              id: "poi_fam_meno",
              type: "single",
              label: "آیا در خانواده شما یائسگی قبل از ۴۰ سالگی رخ داده است؟",
              options: YND,
            },
          ],
          [
            {
              id: "poi_mother",
              type: "single",
              label: "سن یائسگی مادر شما چند سال بود؟",
              options: [
                { label: "نمی‌دانم", v: "dk" },
                { label: "کمتر از ۴۰ سال", v: "lt40" },
                { label: "۴۰ تا ۴۵ سال", v: "40_45" },
                { label: "۴۵ تا ۵۰ سال", v: "45_50" },
                { label: "بیش از ۵۰ سال", v: "gt50" },
              ],
            },
          ],
          [
            {
              id: "poi_genetic",
              type: "single",
              label:
                "آیا بیماری ژنتیکی یا کروموزومی مرتبط شناخته‌شده‌ای دارید؟",
              options: [
                { label: "خیر", v: "no" },
                { label: "بله، سایر شرایط مرتبط", v: "other" },
                { label: "بله، FMR1 premutation", v: "fmr1" },
                { label: "بله، سندرم ترنر", v: "turner" },
              ],
            },
          ],
        ],
      },
      {
        title: "بیماری‌های خودایمنی و همراه",
        steps: [
          [
            {
              id: "poi_auto",
              type: "single",
              label: "آیا بیماری خودایمنی دارید؟",
              options: YN,
            },
            {
              id: "poi_thyroid",
              type: "single",
              label: "آیا بیماری تیروئید دارید؟",
              options: YN,
            },
          ],
          [
            {
              id: "poi_t1d",
              type: "single",
              label: "آیا دیابت نوع ۱ دارید؟",
              options: YN,
            },
            {
              id: "poi_addison",
              type: "single",
              label: "آیا بیماری آدرنال مانند Addison دارید؟",
              options: YN,
            },
            {
              id: "poi_chronic",
              type: "single",
              label: "آیا بیماری مزمن مهم دیگری دارید؟",
              options: YN,
            },
          ],
        ],
      },
      {
        title: "سابقه تخمدان و زنان",
        steps: [
          [
            {
              id: "poi_h_endo",
              type: "single",
              label: "آیا اندومتریوز دارید یا برای شما مطرح شده است؟",
              options: YN,
            },
            {
              id: "poi_h_pcos",
              type: "single",
              label: "آیا PCOS دارید یا برای شما مطرح شده است؟",
              options: YN,
            },
          ],
          [
            {
              id: "poi_h_ovar",
              type: "single",
              label:
                "آیا بیماری، آسیب یا کاهش عملکرد تخمدان برای شما مطرح شده است؟",
              options: YN,
            },
            {
              id: "poi_h_cyst",
              type: "single",
              label: "آیا کیست تخمدان داشته‌اید؟",
              options: YN,
            },
          ],
          [
            {
              id: "poi_h_endoma",
              type: "single",
              label: "آیا اندومتریوما (کیست اندومتریوز) داشته‌اید؟",
              options: YN,
            },
          ],
        ],
      },
      {
        title: "آسیب تخمدان و درمان سرطان",
        steps: [
          [
            {
              id: "poi_cancer",
              type: "single",
              label: "آیا سابقه سرطان یا درمان سرطان دارید؟",
              options: YN,
            },
          ],
          [
            {
              id: "poi_chemo",
              type: "single",
              label: "آیا شیمی‌درمانی دریافت کرده‌اید؟",
              showIf: (a) => a.poi_cancer === "yes",
              options: YN,
            },
            {
              id: "poi_rt",
              type: "single",
              label: "آیا رادیوتراپی ناحیه لگن یا شکم دریافت کرده‌اید؟",
              showIf: (a) => a.poi_cancer === "yes",
              options: YN,
            },
          ],
          [
            {
              id: "poi_chemo_type",
              type: "text",
              label: "نوع داروهای شیمی‌درمانی",
              optional: true,
              showIf: (a) => a.poi_chemo === "yes",
              placeholder: "در صورت اطلاع، بنویسید",
            },
            {
              id: "poi_chemo_cycles",
              type: "number",
              label: "تعداد دوره‌های شیمی‌درمانی",
              unit: "دور",
              optional: true,
              showIf: (a) => a.poi_chemo === "yes",
              placeholder: "مثلاً ۶",
            },
          ],
          [
            {
              id: "poi_osurg",
              type: "single",
              label: "آیا جراحی تخمدان داشته‌اید؟",
              options: YN,
            },
            {
              id: "poi_cyst_surg",
              type: "single",
              label: "آیا جراحی کیست تخمدان یا اندومتریوما داشته‌اید؟",
              options: YN,
            },
          ],
          [
            {
              id: "poi_uni_oo",
              type: "single",
              label: "آیا یک تخمدان شما برداشته شده است؟",
              options: YN,
            },
            {
              id: "poi_bi_oo",
              type: "single",
              label: "آیا هر دو تخمدان شما برداشته شده است؟",
              options: YN,
            },
          ],
          [
            {
              id: "poi_pelvic_surg",
              type: "single",
              label: "آیا جراحی مهم دیگری در ناحیه لگن داشته‌اید؟",
              options: YN,
            },
          ],
        ],
      },
      {
        title: "درمان‌های هورمونی",
        steps: [
          [
            {
              id: "poi_horm",
              type: "single",
              label: "آیا در حال حاضر درمان یا روش هورمونی استفاده می‌کنید؟",
              options: [
                { label: "خیر", v: "no" },
                { label: "قرص ضدبارداری", v: "ocp" },
                { label: "هورمون‌درمانی", v: "hrt" },
                { label: "آی‌یو‌دی هورمونی", v: "iud" },
                { label: "سایر", v: "other" },
              ],
            },
          ],
          [
            {
              id: "poi_horm_dur",
              type: "single",
              label: "مدت استفاده از آن چقدر بوده است؟",
              showIf: (a) => a.poi_horm && a.poi_horm !== "no",
              options: [
                { label: "کمتر از ۶ ماه", v: "lt6" },
                { label: "۶ تا ۱۲ ماه", v: "6_12" },
                { label: "بیش از یک سال", v: "gt1y" },
              ],
            },
          ],
          [
            {
              id: "poi_meds",
              type: "single",
              label: "آیا داروی دیگری مصرف می‌کنید که بر قاعدگی اثر بگذارد؟",
              options: YN,
            },
          ],
        ],
      },
      {
        title: "سبک زندگی",
        steps: [
          [
            {
              id: "poi_smoke",
              type: "single",
              label: "وضعیت مصرف سیگار شما چیست؟",
              options: SMOKE,
            },
          ],
          [
            {
              id: "poi_intense",
              type: "single",
              label: "آیا فعالیت بدنی بسیار شدید و طولانی انجام می‌دهید؟",
              help: "مانند ورزش حرفه‌ای یا تمرینات طولانی روزانه.",
              options: YN,
            },
            {
              id: "poi_wloss",
              type: "single",
              label: "آیا کاهش وزن قابل‌توجه یا محدودیت غذایی شدید داشته‌اید؟",
              options: YN,
            },
          ],
        ],
      },
      {
        title: "زمینه مرتبط با قاعدگی",
        steps: [
          [
            {
              id: "poi_preg_poss",
              type: "single",
              label: "آیا در حال حاضر امکان بارداری وجود دارد؟",
              options: [
                { label: "خیر", v: "no" },
                { label: "بله", v: "yes" },
                { label: "نمی‌دانم", v: "dk" },
              ],
            },
            {
              id: "poi_birth12",
              type: "single",
              label: "آیا در ۱۲ ماه گذشته زایمان داشته‌اید؟",
              options: YN,
            },
          ],
          [
            {
              id: "poi_bf",
              type: "single",
              label: "آیا در حال حاضر شیردهی دارید؟",
              options: YN,
            },
          ],
        ],
      },
      {
        title: "اطلاعات آزمایشگاهی (اختیاری)",
        steps: [
          [
            {
              id: "poi_labs",
              type: "lab",
              label: "در صورت داشتن نتایج آزمایش، می‌توانید آن‌ها را وارد کنید",
              help: "این موارد کاملاً اختیاری هستند و برای دریافت نتیجه ارزیابی الزامی نیستند.",
              labs: [
                { name: "FSH", unit: "IU/L", id: "poi_lab_fsh" },
                { name: "Estradiol (E2)", unit: "pg/mL", id: "poi_lab_e2" },
                { name: "AMH", unit: "ng/mL", id: "poi_lab_amh" },
                { name: "TSH", unit: "mIU/L", id: "poi_lab_tsh" },
                { name: "Prolactin", unit: "ng/mL", id: "poi_lab_prol" },
              ],
            },
          ],
        ],
      },
    ],
  },
};

const SHIM_NOACT = [
  { label: "تلاشی برای رابطه جنسی انجام نشده", v: "0" },
  { label: "تقریباً هرگز / هرگز", v: "1" },
  { label: "چند بار، بسیار کمتر از نیمی از مواقع", v: "2" },
  { label: "گاهی، حدود نیمی از مواقع", v: "3" },
  { label: "بیشتر مواقع", v: "4" },
  { label: "تقریباً همیشه / همیشه", v: "5" },
];

const MEN_CONDS = {
  pedt: {
    key: "pedt",
    name: "PEDT",
    cat: "men",
    title: "غربالگری علائم انزال زودرس (PEDT)",
    desc: "پرسشنامه استاندارد و کوتاه غربالگری درباره الگوی کنترل و زمان انزال.",
    tag: "۵ سؤال · استاندارد",
    time: "حدود ۲ دقیقه",
    note: "نتیجه این پرسشنامه به معنی تشخیص نیست؛ در صورت تداوم نگرانی، ارزیابی تخصصی می‌تواند مفید باشد.",
    sections: [
      {
        title: "سؤالات غربالگری",
        steps: [
          [
            { id: "pedt_q1", type: "single", label: "چقدر برای شما دشوار است که انزال را به تأخیر بیندازید؟", options: [
              { label: "اصلاً دشوار نیست", v: "0" }, { label: "تا حدی دشوار است", v: "1" }, { label: "نسبتاً دشوار است", v: "2" }, { label: "بسیار دشوار است", v: "3" }, { label: "فوق‌العاده دشوار است", v: "4" },
            ] },
            { id: "pedt_q2", type: "single", label: "چند وقت یک‌بار، انزال شما زودتر از زمانی که خودتان مایل هستید اتفاق می‌افتد؟", options: [
              { label: "تقریباً هرگز / هرگز", v: "0" }, { label: "کمتر از نیمی از مواقع", v: "1" }, { label: "حدود نیمی از مواقع", v: "2" }, { label: "بیشتر از نیمی از مواقع", v: "3" }, { label: "تقریباً همیشه / همیشه", v: "4" },
            ] },
            { id: "pedt_q3", type: "single", label: "چند وقت یک‌بار، با تحریک بسیار کم، انزال اتفاق می‌افتد؟", options: [
              { label: "تقریباً هرگز / هرگز", v: "0" }, { label: "کمتر از نیمی از مواقع", v: "1" }, { label: "حدود نیمی از مواقع", v: "2" }, { label: "بیشتر از نیمی از مواقع", v: "3" }, { label: "تقریباً همیشه / همیشه", v: "4" },
            ] },
          ],
          [
            { id: "pedt_q4", type: "single", label: "به دلیل اینکه زودتر از زمانی که مایل هستید انزال می‌شوید، چقدر احساس ناکامی یا ناراحتی می‌کنید؟", options: [
              { label: "اصلاً", v: "0" }, { label: "کمی", v: "1" }, { label: "متوسط", v: "2" }, { label: "زیاد", v: "3" }, { label: "بسیار زیاد", v: "4" },
            ] },
            { id: "pedt_q5", type: "single", label: "چقدر نگران هستید که زمان انزال شما باعث شود شریک جنسی‌تان رضایت کافی نداشته باشد؟", options: [
              { label: "اصلاً نگران نیستم", v: "0" }, { label: "کمی", v: "1" }, { label: "متوسط", v: "2" }, { label: "زیاد", v: "3" }, { label: "بسیار زیاد", v: "4" },
            ] },
          ],
        ],
      },
    ],
  },
  shim: {
    key: "shim",
    name: "SHIM / IIEF-5",
    cat: "men",
    title: "ارزیابی عملکرد نعوظ (SHIM / IIEF-5)",
    desc: "شاخص استاندارد سلامت جنسی مردان — همه سؤالات مربوط به ۶ ماه گذشته است.",
    tag: "۵ سؤال · ۶ ماه گذشته",
    time: "حدود ۲ دقیقه",
    note: "در برخی سؤالات گزینه «تلاشی برای رابطه جنسی انجام نشده» ۰ امتیاز محاسبه می‌شود و تفسیر نمره کل را متفاوت می‌کند.",
    sections: [
      {
        title: "سؤالات غربالگری — ۶ ماه گذشته",
        steps: [
          [
            { id: "shim_q1", type: "single", label: "اعتماد شما به توانایی ایجاد و حفظ نعوظ چقدر است؟", options: [
              { label: "بسیار کم", v: "1" }, { label: "کم", v: "2" }, { label: "متوسط", v: "3" }, { label: "زیاد", v: "4" }, { label: "بسیار زیاد", v: "5" },
            ] },
            { id: "shim_q2", type: "single", label: "هنگام تحریک جنسی، چند وقت یک‌بار نعوظ شما به اندازه کافی سفت بوده که امکان دخول وجود داشته باشد؟", options: SHIM_NOACT },
          ],
          [
            { id: "shim_q3", type: "single", label: "پس از دخول، چند وقت یک‌بار توانسته‌اید نعوظ خود را حفظ کنید؟", options: SHIM_NOACT },
            { id: "shim_q4", type: "single", label: "حفظ نعوظ تا پایان رابطه جنسی چقدر برای شما دشوار بوده است؟", options: SHIM_NOACT },
            { id: "shim_q5", type: "single", label: "هنگامی که برای رابطه جنسی تلاش کرده‌اید، چند وقت یک‌بار رابطه برای شما رضایت‌بخش بوده است؟", options: SHIM_NOACT },
          ],
        ],
      },
    ],
  },
  cpsi: {
    key: "cpsi",
    name: "NIH-CPSI",
    cat: "men",
    title: "ارزیابی علائم پروستات و درد لگنی (NIH-CPSI)",
    desc: "شاخص استاندارد NIH برای بررسی درد لگنی، علائم ادراری و کیفیت زندگی — همه سؤالات مربوط به هفته گذشته است.",
    tag: "۹ سؤال · ۳ دامنه",
    time: "حدود ۴ دقیقه",
    note: "نتیجه در سه دامنه جداگانه نمایش داده می‌شود و شامل یک برچسب کلی شدت نیست.",
    sections: [
      {
        title: "دامنه درد — هفته گذشته",
        steps: [
          [
            { id: "cpsi_q1_perineum", type: "single", label: "در هفته گذشته، درد یا ناراحتی در ناحیه بین مقعد و بیضه‌ها (پرینه) داشتید؟", options: NOYES01 },
            { id: "cpsi_q1_testicles", type: "single", label: "در هفته گذشته، درد یا ناراحتی در بیضه‌ها داشتید؟", options: NOYES01 },
            { id: "cpsi_q1_tip", type: "single", label: "در هفته گذشته، درد یا ناراحتی در نوک آلت (مستقل از ادرار) داشتید؟", options: NOYES01 },
            { id: "cpsi_q1_lower_abdomen", type: "single", label: "در هفته گذشته، درد یا ناراحتی در زیر شکم، ناحیه شرمگاهی (بالای مثانه) داشتید؟", options: NOYES01 },
          ],
          [
            { id: "cpsi_q2_urination", type: "single", label: "در هفته گذشته، درد یا سوزش هنگام ادرار را تجربه کردید؟", options: NOYES01 },
            { id: "cpsi_q2_ejaculation", type: "single", label: "در هفته گذشته، درد یا ناراحتی هنگام یا پس از انزال را تجربه کردید؟", options: NOYES01 },
            { id: "cpsi_q3", type: "single", label: "در هفته گذشته، درد یا ناراحتی مورد اشاره با چه میزانی تکرار شده است؟", options: [
              { label: "هرگز", v: "0" }, { label: "به‌ندرت", v: "1" }, { label: "گاهی", v: "2" }, { label: "اغلب", v: "3" }, { label: "معمولاً", v: "4" }, { label: "همیشه", v: "5" },
            ] },
          ],
          [
            { id: "cpsi_q4", type: "scale", label: "در روزهایی که درد داشتید، شدت متوسط درد شما چقدر بوده است؟", minL: "بدون درد", maxL: "شدیدترین درد قابل تصور" },
          ],
        ],
      },
      {
        title: "دامنه علائم ادراری — هفته گذشته",
        steps: [
          [
            { id: "cpsi_q5", type: "single", label: "در هفته گذشته، چند وقت یک‌بار احساس کرده‌اید مثانه بعد از ادرار کاملاً تخلیه نشده است؟", options: FREQ05 },
            { id: "cpsi_q6", type: "single", label: "در هفته گذشته، چند وقت یک‌بار کمتر از دو ساعت بعد از ادرار مجبور شده‌اید دوباره ادرار کنید؟", options: FREQ05 },
          ],
        ],
      },
      {
        title: "دامنه کیفیت زندگی — هفته گذشته",
        steps: [
          [
            { id: "cpsi_q7", type: "single", label: "در هفته گذشته، علائم شما چقدر مانع انجام فعالیت‌های معمولتان شده‌اند؟", options: [
              { label: "اصلاً", v: "0" }, { label: "فقط کمی", v: "1" }, { label: "تا حدی", v: "2" }, { label: "زیاد", v: "3" },
            ] },
            { id: "cpsi_q8", type: "single", label: "در هفته گذشته چقدر ذهن شما درگیر علائم بوده است؟", options: [
              { label: "اصلاً", v: "0" }, { label: "فقط کمی", v: "1" }, { label: "تا حدی", v: "2" }, { label: "زیاد", v: "3" },
            ] },
            { id: "cpsi_q9", type: "single", label: "اگر قرار باشد علائم شما همین‌طور برای همیشه ادامه پیدا کند، چه احساسی خواهید داشت؟", options: [
              { label: "بسیار راضی / بسیار خوشحال", v: "0" }, { label: "راضی", v: "1" }, { label: "عمدتاً راضی", v: "2" }, { label: "ترکیبی (راضی و ناراضی)", v: "3" }, { label: "عمدتاً ناراضی", v: "4" }, { label: "ناراضی", v: "5" }, { label: "بسیار بد / وحشتناک", v: "6" },
            ] },
          ],
        ],
      },
    ],
  },
  ipss: {
    key: "ipss",
    name: "IPSS",
    cat: "men",
    title: "ارزیابی علائم ادراری و پروستات (IPSS)",
    desc: "مجموعه امتیاز استاندارد علائم ادراری تحتانی — همه سؤالات مربوط به ماه گذشته است.",
    tag: "۷ سؤال + ۱ سؤال جداگانه",
    time: "حدود ۳ دقیقه",
    note: "سؤال آخر (کیفیت زندگی) در امتیاز کل محاسبه نمی‌شود و جداگانه نمایش داده می‌شود.",
    sections: [
      {
        title: "علائم ادراری — ماه گذشته",
        steps: [
          [
            { id: "ipss_q1", type: "single", label: "در ماه گذشته چند وقت یک‌بار احساس کرده‌اید بعد از ادرار، مثانه کاملاً تخلیه نشده است؟", options: FREQ05 },
            { id: "ipss_q2", type: "single", label: "در ماه گذشته چند وقت یک‌بار کمتر از دو ساعت بعد از ادرار مجبور شده‌اید دوباره ادرار کنید؟", options: FREQ05 },
            { id: "ipss_q3", type: "single", label: "در ماه گذشته چند وقت یک‌بار جریان ادرار چند بار قطع و دوباره شروع شده است؟", options: FREQ05 },
          ],
          [
            { id: "ipss_q4", type: "single", label: "در ماه گذشته چند وقت یک‌بار به تعویق انداختن ادرار برایتان دشوار بوده است؟", options: FREQ05 },
            { id: "ipss_q5", type: "single", label: "در ماه گذشته چند وقت یک‌بار جریان ادرار ضعیف بوده است؟", options: FREQ05 },
            { id: "ipss_q6", type: "single", label: "در ماه گذشته چند وقت یک‌بار برای شروع ادرار مجبور شده‌اید زور بزنید؟", options: FREQ05 },
          ],
          [
            { id: "ipss_q7", type: "single", label: "در ماه گذشته معمولاً چند بار در طول شب از خواب بیدار شده‌اید تا ادرار کنید؟", options: [
              { label: "هیچ‌بار", v: "0" }, { label: "۱ بار", v: "1" }, { label: "۲ بار", v: "2" }, { label: "۳ بار", v: "3" }, { label: "۴ بار", v: "4" }, { label: "۵ بار یا بیشتر", v: "5" },
            ] },
            { id: "ipss_q8", type: "single", label: "اگر قرار باشد وضعیت ادراری فعلی‌تان تا پایان عمر همین‌طور باقی بماند، چه احساسی خواهید داشت؟", help: "این سؤال جداگانه است و در امتیاز کل محاسبه نمی‌شود.", options: [
              { label: "بسیار راضی", v: "0" }, { label: "راضی", v: "1" }, { label: "عمدتاً راضی", v: "2" }, { label: "ترکیبی (راضی و ناراضی)", v: "3" }, { label: "عمدتاً ناراضی", v: "4" }, { label: "ناراضی", v: "5" }, { label: "بسیار بد", v: "6" },
            ] },
          ],
        ],
      },
    ],
  },
  adam: {
    key: "adam",
    name: "ADAM",
    cat: "men",
    title: "غربالگری علائم کمبود آندروژن (ADAM)",
    desc: "پرسشنامه استاندارد غربالگری کمبود آندروژن در مردان میان‌سال — بدون نمره شدت.",
    tag: "۱۰ سؤال · بله / خیر",
    time: "حدود ۲ دقیقه",
    note: "این پرسشنامه نمره عددی شدت ندارد؛ نتیجه به‌صورت «مثبت» یا «منفی» نمایش داده می‌شود و جایگزین آزمایش هورمونی نیست.",
    sections: [
      {
        title: "سؤالات غربالگری",
        steps: [
          [
            { id: "adam_q1", type: "single", label: "آیا کاهش میل جنسی دارید؟", options: NOYES01 },
            { id: "adam_q2", type: "single", label: "آیا احساس کمبود انرژی دارید؟", options: NOYES01 },
            { id: "adam_q3", type: "single", label: "آیا قدرت یا استقامت عضلانی شما کاهش یافته است؟", options: NOYES01 },
            { id: "adam_q4", type: "single", label: "آیا نسبت به قبل کاهش قد داشته‌اید؟", options: NOYES01 },
            { id: "adam_q5", type: "single", label: "آیا لذت شما از زندگی کاهش یافته است؟", options: NOYES01 },
          ],
          [
            { id: "adam_q6", type: "single", label: "آیا بیشتر احساس غمگینی یا تحریک‌پذیری می‌کنید؟", options: NOYES01 },
            { id: "adam_q7", type: "single", label: "آیا کیفیت یا قدرت نعوظ شما کاهش یافته است؟", options: NOYES01 },
            { id: "adam_q8", type: "single", label: "آیا توانایی شما برای انجام فعالیت‌های ورزشی نسبت به قبل کاهش یافته است؟", options: NOYES01 },
            { id: "adam_q9", type: "single", label: "آیا معمولاً بعد از شام احساس خواب‌آلودگی شدید پیدا می‌کنید؟", options: NOYES01 },
          ],
          [
            { id: "adam_q10", type: "single", label: "آیا عملکرد کاری شما اخیراً افت کرده است؟", options: NOYES01 },
          ],
        ],
      },
    ],
  },
};

/* ---------------- scorers ---------------- */

const PEDT_ITEMS = [
  ["pedt_q1", "کنترل انزال"],
  ["pedt_q2", "زمان وقوع انزال"],
  ["pedt_q3", "میزان تحریک مورد نیاز"],
  ["pedt_q4", "میزان ناراحتی"],
  ["pedt_q5", "نگرانی درباره رضایت شریک"],
];

const SHIM_ITEMS = [
  ["shim_q1", "اعتماد به نعوظ"],
  ["shim_q2", "سفتی کافی برای دخول"],
  ["shim_q3", "حفظ نعوظ پس از دخول"],
  ["shim_q4", "حفظ نعوظ تا پایان رابطه"],
  ["shim_q5", "رضایت از رابطه"],
];
const SHIM_NOACT_KEYS = ["shim_q2", "shim_q3", "shim_q4", "shim_q5"];

const CPSI_LOCS = [
  ["cpsi_q1_perineum", "ناحیه پرینه (بین مقعد و بیضه‌ها)"],
  ["cpsi_q1_testicles", "بیضه‌ها"],
  ["cpsi_q1_tip", "نوک آلت (مستقل از ادرار)"],
  ["cpsi_q1_lower_abdomen", "زیر شکم / ناحیه شرمگاهی"],
];

const IPSS_ITEMS = [
  ["ipss_q1", "احساس تخلیه نشدن کامل مثانه"],
  ["ipss_q2", "تکرار ادرار کمتر از دو ساعت"],
  ["ipss_q3", "قطع و وصل شدن جریان ادرار"],
  ["ipss_q4", "دشواری در نگه داشتن ادرار"],
  ["ipss_q5", "ضعف جریان ادرار"],
  ["ipss_q6", "نیاز به زور زدن برای شروع ادرار"],
  ["ipss_q7", "بیدار شدن در شب برای ادرار"],
];

const ADAM_ITEMS = [
  ["adam_q1", "کاهش میل جنسی"],
  ["adam_q2", "کمبود انرژی"],
  ["adam_q3", "کاهش قدرت یا استقامت عضلانی"],
  ["adam_q4", "کاهش قد نسبت به قبل"],
  ["adam_q5", "کاهش لذت از زندگی"],
  ["adam_q6", "غمگینی یا تحریک‌پذیری بیشتر"],
  ["adam_q7", "کاهش کیفیت یا قدرت نعوظ"],
  ["adam_q8", "کاهش توانایی فعالیت‌های ورزشی"],
  ["adam_q9", "خواب‌آلودگی شدید بعد از شام"],
  ["adam_q10", "افت عملکرد کاری"],
];
const ADAM_CORE = ["adam_q1", "adam_q7"];

Object.assign(CONDS, MEN_CONDS);
const SW_LANDING = {
  eyebrow: "سلامت زناشویی",
  headline: "زندگی جنسی بهتر، از شناخت بهتر خودت شروع می‌شود.",
  sub: "اینجا قرار نیست دنبال «مشکل» بگردیم. با چند سؤال کوتاه، کمک می‌کنیم بفهمی کدام بخش‌های زندگی جنسی‌ات می‌توانند بهتر و رضایت‌بخش‌تر شوند.",
  benefits: [
    ["💗", "میل بیشتر"], ["🌿", "آرامش بیشتر"], ["🤍", "صمیمیت بیشتر"],
    ["💬", "ارتباط بهتر"], ["✨", "رضایت بیشتر"], ["🩷", "راحتی بیشتر"],
  ],
  promise: [
    "بدون قضاوت — اینجا چیزی «غیرطبیعی» یا «ناقص» نیست.",
    "کاربردی — به‌جای برچسب، قدم‌های کوچک و واقعی پیشنهاد می‌شود.",
    "محرمانه — پاسخ‌های تو در پروفایل عمومی یا داشبورد نمایش داده نمی‌شود.",
  ],
  privacy: "اطلاعات این بخش شخصی و خصوصی است و فقط روی همین دستگاه ذخیره می‌شود.",
};

const SW_CTX_Q = {
  id: "sw_context",
  label: "در حال حاضر کدام وضعیت به تو نزدیک‌تر است؟",
  hint: "این سؤال فقط مسیر سؤال‌های بعدی را مشخص می‌کند.",
  options: [
    ["active", "رابطه/فعالیت جنسی دارم"],
    ["inactive", "فعلاً فعالیت جنسی ندارم"],
    ["prefer_not", "ترجیح می‌دهم پاسخ ندهم"],
  ],
};
const SW_BODY_Q = {
  id: "sw_body",
  label: "برای شخصی‌سازی مسیر، کدام گزینه به تجربه بدنی تو نزدیک‌تر است؟",
  hint: "اختیاری — اگر پاسخ ندی، فقط سؤال‌های مشترک را می‌بینی.",
  options: [
    ["female", "بدن زن"],
    ["male", "بدن مرد"],
    ["prefer_not", "ترجیح می‌دهم نگویم"],
  ],
};
const SW_SAFETY_Q = {
  id: "sw_safety",
  label: "در موقعیت‌های صمیمی یا جنسی، آیا احساس امنیت و آزادی برای گفتن «نه» یا تغییر دادن نظرت داری؟",
  hint: "پاسخ تو جدی گرفته می‌شود و مسیر پیشنهادها را تنظیم می‌کند.",
  options: [
    ["always", "همیشه"],
    ["usually", "بیشتر اوقات"],
    ["sometimes", "گاهی"],
    ["not_always", "نه همیشه"],
    ["prefer_not", "ترجیح می‌دهم پاسخ ندهم"],
  ],
};

/* Core check-in (۴ هفته گذشته, 1–5). Q8/Q9 reverse-scored internally. */
const SW_Q = {
  sw_q1: ["در مجموع، چقدر از کیفیت زندگی جنسی‌ات راضی بوده‌ای؟", "اصلاً راضی نیستم", "کاملاً راضی"],
  sw_q2: ["در ۴ هفته گذشته، چقدر میل و علاقه‌ات به صمیمیت جنسی با چیزی که خودت می‌خواستی هماهنگ بوده است؟", "خیلی کم هماهنگ", "کاملاً هماهنگ"],
  sw_q3: ["وقتی خودت تمایل به صمیمیت داری، چقدر ذهن و بدنت می‌توانند با این میل همراه شوند؟", "اصلاً همراه نمی‌شوند", "کاملاً همراه می‌شوند"],
  sw_q4: ["در تجربه‌های جنسی، چقدر احساس راحتی جسمی داری؟", "اصلاً راحت نیستم", "کاملاً راحت"],
  sw_q5: ["تجربه‌های جنسی‌ات تا چه اندازه برایت لذت‌بخش هستند؟", "اصلاً لذت‌بخش نیستند", "خیلی لذت‌بخش‌اند"],
  sw_q6: ["در زمان صمیمیت، چقدر احساس نزدیکی و ارتباط واقعی می‌کنی؟", "خیلی کم", "خیلی زیاد"],
  sw_q7: ["چقدر راحت می‌توانی خواسته‌ها، مرزها و چیزهایی را که باعث راحتی یا لذتت می‌شوند بیان کنی؟", "اصلاً راحت نیستم", "کاملاً راحت"],
  sw_q8: ["در این مدت، استرس، خستگی یا کم‌خوابی چقدر روی میل یا کیفیت تجربه جنسی‌ات اثر گذاشته‌اند؟", "خیلی کم", "خیلی زیاد"],
  sw_q9: ["چقدر احساس می‌کنی در زندگی جنسی‌ات تحت فشار، عجله یا توقع برای «خوب عمل کردن» هستی؟", "خیلی کم", "خیلی زیاد"],
};
const SW_CORE_ACTIVE = ["sw_q1", "sw_q2", "sw_q3", "sw_q4", "sw_q5", "sw_q6", "sw_q7", "sw_q8", "sw_q9"];
const SW_CORE_REDUCED = ["sw_q1", "sw_q2", "sw_q7", "sw_q8", "sw_q9"];

/* Adaptive follow-ups (branching only) */
const SW_AD = {
  sw_ad_comfort_type: { kind: "single", label: "کدام مورد بیشتر باعث ناراحتی می‌شود؟", options: [
    ["pain", "درد"], ["dryness", "خشکی یا اصطکاک"], ["irritation", "حساسیت، سوزش یا تحریک"],
    ["after_pain", "ناراحتی هنگام یا بعد از رابطه"], ["other", "مورد دیگری"], ["unsure", "مطمئن نیستم"],
  ] },
  sw_ad_pain_severity: { kind: "single", label: "این ناراحتی چقدر شدید یا مکرر است؟", hint: "پاسخ صادقانه به تو کمک می‌کند مسیر مناسب‌تری دریافت کنی.", options: [
    ["severe", "شدید است یا مکرر تکرار می‌شود"], ["mild", "خفیف است و گاه‌به‌گاه اتفاق می‌افتد"], ["unsure", "مطمئن نیستم"],
  ] },
  sw_ad_desire_factors: { kind: "multi", optional: true, label: "در این مدت، کدام موارد بیشتر روی میل و انرژی تو اثر گذاشته‌اند؟", hint: "می‌توانی چند مورد را انتخاب کنی یا بدون انتخاب ادامه دهی.", options: [
    ["stress", "استرس"], ["fatigue", "خستگی"], ["sleep", "خواب"], ["relationship", "رابطه و ارتباط"],
    ["body_changes", "تغییرات جسمی یا مرحله زندگی"], ["health", "داروها یا شرایط سلامت"], ["unsure", "مطمئن نیستم"],
  ] },
  sw_ad_response_factors: { kind: "multi", optional: true, label: "در این مدت، کدام موارد بیشتر در همراه‌نشوندن ذهن و بدنت نقش داشته‌اند؟", hint: "می‌توانی چند مورد را انتخاب کنی یا بدون انتخاب ادامه دهی.", options: [
    ["stress", "استرس"], ["distraction", "حواس‌پرتی"], ["pressure", "فشار برای «خوب عمل کردن»"],
    ["relaxation", "آرامش ناکافی"], ["relationship", "زمینه رابطه"], ["comfort", "راحتی جسمی"],
  ] },
  sw_ad_pelvic: { kind: "single", label: "در ۴ هفته گذشته، آیا علائمی مثل سفتی یا فشار مداوم در ناحیه لگن، دشواری در شل‌شدن عضلات لگن، یا نشت ادرار هنگام فعالیت داشته‌ای؟", options: [
    ["no", "خیر"], ["sometimes", "گاهی"], ["often", "بله، به‌طور مکرر"], ["prefer_not", "ترجیح می‌دهم پاسخ ندهم"],
  ] },
  sw_ad_male_persistent: { kind: "single", label: "در ۴ هفته گذشته، آیا نگرانی مداومی درباره نعوظ یا انزال داشته‌ای؟", options: [
    ["no", "خیر"], ["sometimes", "گاهی، اما نگران‌کننده نبوده"], ["persistent", "بله، نگرانی مداوم است"], ["prefer_not", "ترجیح می‌دهم پاسخ ندهم"],
  ] },
  sw_ad_life_stage: { kind: "single", label: "آیا در دوره‌ای مثل یائسگی، شیردهی یا تغییرات هورمونی خاص قرار داری؟", hint: "این اطلاعات فقط برای پیشنهادهای مرتبط با راحتی بدن استفاده می‌شود.", options: [
    ["no", "خیر"], ["yes", "بله"], ["unsure", "مطمئن نیستم"], ["prefer_not", "ترجیح می‌دهم پاسخ ندهم"],
  ] },
};

const SW_SAFETY_PATHWAY_MSG = "امنیت و رضایت تو همیشه مقدم است. لازم نیست برای بهتر شدن رابطه، کاری را برخلاف خواسته یا احساس امنیتت انجام دهی.";
const SW_SAFETY_RESOURCES = [
  ["💬", "گفت‌وگو با یک مشاور یا روان‌درمانگر مورد اعتماد", "یک فضای امن و محرمانه برای بررسی احساسات و مرزهای تو."],
  ["🤝", "کمک گرفتن از افراد مورد اعتماد", "اگر از امنیت جسمی یا احساسی خود نگرانی، حرف زدن با یک فرد قابل اعتماد قدم مهمی است."],
  ["☎️", "کمک فوری", "در موقعیت‌های فوری، اورژانس اجتماعی با شماره ۱۲۳ در دسترس است."],
];
const SW_SAFETY_CAUTION_NOTE = "از آنجا که گاهی احساس امنیت کامل نداری، تمرین‌های دونفره را در این مسیر کنار گذاشته‌ایم و تمرکز روی خودت است.";

const SW_RECS = {
  comm_i_statement: ["💬", "بیان یک نیاز با زبان «من»", "امروز یکی از خواسته‌هایت را با جمله‌ای که با «من» شروع می‌شود بگو؛ مثلاً: «من دوست دارم وقت‌های آرام‌تر و بدون عجله‌ای داشته باشیم.»", "۵ دقیقه", 1, 0],
  comm_10min: ["📵", "۱۰ دقیقه گفت‌وگو بدون گوشی", "ده دقیقه در روز را بدون گوشی و حواس‌پرتی صرف گفت‌وگوی ساده با همسرت کن.", "۱۰ دقیقه", 1, 0],
  comm_question: ["❓", "یک سؤال درباره ترجیحات او", "از همسرت بپرس: «چه چیزی باعث می‌شود تو احساس راحتی و لذت بیشتری کنی؟» فقط گوش بده؛ لازم نیست چیزی را اصلاح کنی.", "۵ دقیقه", 1, 0],
  comm_appreciation: ["🤍", "یک جمله قدردانی", "یک چیز مشخص که امروز از او دیدی یا احساس کردی را با یک جمله ساده قدردانی کن.", "۲ دقیقه", 1, 0],
  conn_10min: ["📵", "۱۰ دقیقه با هم، بدون گوشی", "ده دقیقه فقط کنار هم بودن — بدون گوشی، بدون کار، بدون هدف مشخص.", "۱۰ دقیقه", 1, 0],
  conn_walk: ["🚶", "پیاده‌روی ۲۰ دقیقه‌ای با هم", "یک پیاده‌روی کوتاه دو نفره؛ حرکت کنار هم، گفت‌وگو را راحت‌تر می‌کند.", "۲۰ دقیقه", 1, 0],
  conn_affection: ["🤍", "ابراز محبت بدون انتظار", "یک ابراز محبت ساده و بی‌انتظار — این تمرین لازم نیست به جایی برسد یا نتیجه‌ای داشته باشد.", "۵ دقیقه", 1, 0],
  conn_closeness: ["✨", "نزدیکی بدون هدف مشخص", "زمانی برای نزدیکی بدون هیچ انتظار یا هدفی مشخص کن؛ فقط همان لحظه بودن.", "به‌اختیار خودت", 1, 1],
  breath_4_8: ["🌿", "تمرین تنفس ۴–۸", "چهار ثانیه دم، هشت ثانیه بازدم؛ پنج دور. این تمرین کمک می‌کند بدن به حالت آرام‌تر برگردد.", "۳ دقیقه", 0, 0],
  wind_down: ["🌙", "روتین کوتاه آرام‌سازی شب", "قبل از خواب، پنج دقیقه یک روتین ثابت و آرام: نور کمتر، حرکات کششی نرم، چند نفس عمیق.", "۵ دقیقه", 0, 0],
  screen_off: ["📵", "کاهش صفحه‌نمایش قبل از خواب", "۳۰ دقیقه قبل از خواب، صفحه‌نمایش‌ها را کنار بگذار و جای آن‌ها یک فعالیت آرام انتخاب کن.", "۳۰ دقیقه", 0, 0],
  calm_activity: ["🍵", "یک فعالیت آرام‌بخش کوتاه", "چای دم کردن، چند دقیقه موسیقی آرام، یا دوش آب گرم — هر چیزی که به سیستم عصبی‌ات پیام آرامش بدهد.", "۱۰ دقیقه", 0, 0],
  light_move: ["🚶‍♀️", "حرکت سبک روزانه", "چند دقیقه حرکت سبک در روز — حتی کشش‌های ساده یا چند دقیقه پیاده‌روی — انرژی و آرامش را بالا می‌برد.", "۱۰ دقیقه", 0, 0],
  press_reframe: ["✨", "جابه‌جایی تمرکز از «عملکرد» به «لحظه»", "امروز هدف را از «خوب انجام دادن» به «همان لحظه بودن» تغییر بده؛ هیچ معیار موفقیتی لازم نیست.", "—", 1, 1],
  press_present: ["🤍", "تمرکز بر ارتباط و لحظه حال", "در زمان صمیمیت، توجهت را به حس‌های ساده ببر: گرمای دست، صدای نفس، نزدیکی.", "—", 1, 1],
  press_nopressure: ["💗", "نزدیکی بدون فشار و انتظار", "یک تجربه صمیمانه بدون هیچ توقعی از نتیجه؛ عجله و «باید» را بیرون بگذار.", "به‌اختیار خودت", 1, 1],
  des_sleep: ["😴", "بهبود خواب", "ساعت خواب منظم‌تر در این هفته؛ خواب کافی، یکی از مهم‌ترین پشتیبان‌های میل و انرژی است.", "—", 0, 0],
  des_stress: ["🌿", "کاهش استرس روزانه", "یک تمرین آرام‌سازی کوتاه در روز؛ فضای ذهنی آرام‌تر، فضای بیشتری برای میل ایجاد می‌کند.", "۵ دقیقه", 0, 0],
  des_connection: ["🤍", "نزدیکی عاطفی بدون فشار", "ارتباط عاطفی و وقت دو نفره، بدون هیچ انتظاری — صمیمیت عاطفی بستر خوبی برای میل است.", "—", 1, 0],
  des_activity: ["🚶", "فعالیت بدنی سبک", "چند دقیقه حرکت سبک در روز، انرژی و خلق‌وخو را بالا می‌برد.", "۱۰ دقیقه", 0, 0],
  des_lowpressure: ["💗", "صمیمیت کم‌فشار", "صمیمیت بدون انتظار برای نتیجه مشخص؛ فقط گرمی و نزدیکی، با هر شکلی که امروز برایت راحت است.", "به‌اختیار خودت", 1, 1],
  resp_slow: ["🐢", "آهسته‌تر کردن ریتم", "ریتم را آهسته‌تر کن؛ عجله نکردن، به ذهن و بدن فرصت همراه‌شدن می‌دهد.", "—", 1, 1],
  resp_nopressure: ["✨", "کاهش فشار و عجله", "هر «باید» یا عجله‌ای را از این تجربه حذف کن؛ آرامش، نقطه شروع خوبی است.", "—", 1, 1],
  resp_relax: ["🌿", "آرام‌سازی قبل از شروع", "چند دقیقه تنفس عمیق یا روتین آرام‌سازی قبل از زمان صمیمیت.", "۵ دقیقه", 0, 0],
  resp_present: ["🧘", "توجه به لحظه حال", "توجهت را به حس‌های همین لحظه ببر؛ ذهن‌پرسی را با نرمی به حس‌ها برگردان.", "—", 0, 0],
  resp_time: ["⏳", "زمان کافی برای هماهنگ‌شدن", "بدن و ذهن، زمان کافی برای همراه‌شدن می‌خواهند؛ بدون شتاب، فضای این هماهنگی را بده.", "—", 1, 1],
  pleas_nogoal: ["✨", "حذف اهداف عملکردی", "هر هدف یا معیاری که «باید» به نتیجه‌ای برسد را کنار بگذار؛ تجربه مهم‌تر از نتیجه است.", "—", 0, 1],
  pleas_experience: ["💗", "تمرکز بر تجربه، نه نتیجه", "امروز فقط از تجربه لذت ببر؛ توجه به حس‌های کوچک و خوشایند همین لحظه.", "—", 0, 1],
  pleas_preferences: ["💬", "گفت‌وگو درباره ترجیحات", "چیزی که برایت راحتی و لذت ایجاد می‌کند را بیان کن؛ ترجیحات تو مهم‌اند.", "۱۰ دقیقه", 1, 0],
  pleas_comfort: ["🩷", "شناسایی چیزهای راحت‌کننده و لذت‌بخش", "یک فهرست کوچک از چیزهایی که برایت راحتی و لذت ایجاد می‌کنند بنویس؛ از یکی از آن‌ها استفاده کن.", "۱۰ دقیقه", 0, 0],
  comf_education: ["🩷", "آشنایی با عوامل راحتی بدن", "آشنایی با عوامل رایج راحتی جسمی (مثل زمان کافی، آرامش و مرطوب‌سازی) می‌تواند تجربه را راحت‌تر کند.", "—", 0, 0],
  comf_signals: ["🧸", "توجه به نشانه‌های بدن", "بدنت را جدی بگیر: نشانه‌های راحتی و ناراحتی را بشناس و به آن‌ها احترام بگذار.", "—", 0, 0],
  comf_selfcare: ["🌿", "مراقبت عمومی از بدن", "خواب کافی، آب کافی و آرامش، پشتیبان راحتی جسمی‌اند.", "—", 0, 0],
  sleep_consistency: ["😴", "ساعت خواب منظم", "این هفته ساعت خواب و بیداری ثابت‌تری انتخاب کن؛ خواب منظم، انرژی کلی را بالا می‌برد.", "—", 0, 0],
  sleep_winddown: ["🌙", "روتین آرام شبانه", "پنج دقیقه روتین ثابت قبل از خواب: نور کم، نفس‌های آرام، بدن ریلکس.", "۵ دقیقه", 0, 0],
  sleep_screens: ["📵", "کاهش نور صفحه در شب", "نور صفحه‌نمایش‌ها را در ساعت پایانی شب کم کن.", "—", 0, 0],
  pf_awareness: ["🧘", "آگاهی از ناحیه لگن", "چند دقیقه توجه آرام به حس‌های ناحیه لگن — بدون هیچ فشار یا تمرین اجباری.", "۵ دقیقه", 0, 0],
  pf_relaxation: ["🌿", "آرام‌سازی عضلات لگن", "با تنفس آرام و طولانی، حس شل‌شدن و سبکی در ناحیه لگن تصور کن و بدنت را رها کن.", "۵ دقیقه", 0, 0],
  pf_body: ["🧸", "تمرین توجه بدنی", "چند دقیقه اسکن بدن از سر تا پا با نگاه مهربان و بدون قضاوت.", "۷ دقیقه", 0, 0],
  solo_need_note: ["📝", "یادداشت یک نیاز با زبان «من»", "یکی از نیازهایت را در یک جمله با زبان «من» بنویس؛ برای گفت‌وگوی بعدی آماده می‌شود.", "۵ دقیقه", 0, 0],
  walk_solo: ["🚶", "پیاده‌روی ۲۰ دقیقه‌ای", "بیست دقیقه پیاده‌روی در فضایی که دوست داری؛ حرکت، ذهن را آرام می‌کند.", "۲۰ دقیقه", 0, 0],
  body_kindness: ["🤍", "مهربانی با بدن", "چند دقیقه توجه آرام و بدون قضاوت به بدنت؛ بدنی که همین حالا هم برایت کار می‌کند.", "۵ دقیقه", 0, 0],
  self_checkin: ["🧘", "چک‌این احساسی ۵ دقیقه‌ای", "پنج دقیقه با خودت صادق باش: امروز چه حسی داری؟ چه چیزی بهت آرامش می‌دهد؟", "۵ دقیقه", 0, 0],
};
/* [emoji, title, desc, duration, requiresPartner, intimacy] */

const SW_PATTERNS = {
  communication_low: { id: "communication_low", rowId: "communication", insight: "ممکن است بیان خواسته‌ها و نیازها نیاز به توجه بیشتری داشته باشد.", recs: ["comm_i_statement", "comm_10min", "comm_question", "comm_appreciation"] },
  connection_low: { id: "connection_low", rowId: "intimacy", insight: "به نظر می‌رسد وقت دو نفره و نزدیکی بدون عجله می‌تواند فضای خوبی بسازد.", recs: ["conn_10min", "conn_walk", "conn_affection", "conn_closeness"] },
  mindbody_stress: { id: "mindbody_stress", rowId: "mindBody", insight: "به نظر می‌رسد استرس، خستگی یا فشار روزمره می‌تواند روی تجربه تو اثر بگذارد.", recs: ["breath_4_8", "wind_down", "screen_off", "calm_activity", "light_move"] },
  pressure_high: { id: "pressure_high", rowId: "mindBody", insight: "شاید فشار «خوب عمل کردن» جای تجربه لذت‌بخش‌تر را گرفته باشد.", recs: ["breath_4_8", "press_reframe", "press_present", "press_nopressure"] },
  desire_low: { id: "desire_low", rowId: "desire", insight: "میل، مانند موج، بالا و پایین دارد؛ گاهی توجه به انرژی، خواب و استرس، فضای بیشتری برایش می‌سازد.", recs: ["des_sleep", "des_stress", "des_connection", "des_activity", "des_lowpressure"], note: "اگر این حالت مدت‌ها ادامه داشته و برایت آزاردهنده است، یک ارزیابی تمرکزشده می‌تواند مفید باشد." },
  response_low: { id: "response_low", rowId: "response", insight: "به نظر می‌رسد ذهن و بدن تو به زمان و آرامش بیشتری برای همراه‌شدن نیاز دارند.", recs: ["resp_slow", "resp_nopressure", "resp_relax", "resp_present", "resp_time"], note: "اگر این موضوع تداوم داشته باشد یا برایت نگرانی ایجاد کرده، ارزیابی تمرکزشده می‌تواند مفید باشد." },
  pleasure_low: { id: "pleasure_low", rowId: "pleasure", insight: "شاید توجه بیشتر به همین بخش، تجربه تو را لذت‌بخش‌تر کند.", recs: ["pleas_nogoal", "pleas_experience", "pleas_preferences", "pleas_comfort"] },
  comfort_low: { id: "comfort_low", rowId: "comfort", insight: "راحتی جسمی با توجه‌های کوچک و ساده می‌تواند بهتر شود؛ نشانه‌های بدنت را جدی بگیر.", recs: ["comf_education", "comf_signals", "comf_selfcare"], note: "اگر ناراحتی تکرار شود یا ادامه پیدا کند، مشاوره حضوری می‌تواند کمک‌کننده باشد." },
  sleep_fatigue: { id: "sleep_fatigue", rowId: "mindBody", insight: "انرژی و خواب، پشتیبان‌های پنهان تجربه‌های خوب‌اند.", recs: ["sleep_consistency", "sleep_winddown", "sleep_screens", "light_move"] },
  pelvic_floor: { id: "pelvic_floor", rowId: "comfort", insight: "توجه آرام به عضلات ناحیه لگن — بدون فشار و بدون تمرین سخت — نقطه شروع خوبی است.", recs: ["pf_awareness", "pf_relaxation", "breath_4_8", "pf_body"], note: "اگر این علائم تکرار شوند یا نگرانی ایجاد کنند، متخصص سلامت ناحیه لگن بهترین راهنماست." },
};

/* ---------- Profile computation (band words only) ---------- */
const CY_FLOW = [
  { v: "none", label: "بدون خون‌ریزی" },
  { v: "spotting", label: "لکه‌بینی" },
  { v: "light", label: "خون‌ریزی کم" },
  { v: "medium", label: "خون‌ریزی متوسط" },
  { v: "heavy", label: "خون‌ریزی زیاد" },
];
const CY_SYMPTOM_L = {
  cramp: "درد شکم یا گرفتگی عضلات",
  headache: "سردرد",
  bloat: "نفخ",
  breast: "حساسیت پستان",
  acne: "آکنه",
  tired: "خستگی",
  gi: "علائم گوارشی",
  other: "سایر علائم",
};
const CY_PAIN = [
  { v: "mild", label: "خفیف" },
  { v: "moderate", label: "متوسط" },
  { v: "severe", label: "شدید" },
  { v: "vsevere", label: "خیلی شدید" },
];
const CY_MOOD_L = {
  good: "خوب",
  calm: "آرام",
  sens: "حساس",
  anx: "مضطرب",
  low: "کلافه",
  sad: "غمگین",
};
const CY_ENERGY = [
  { v: "low", label: "کم" },
  { v: "normal", label: "معمولی" },
  { v: "good", label: "خوب" },
];
const CY_SLEEP = [
  { v: "good", label: "خوب" },
  { v: "ok", label: "متوسط" },
  { v: "bad", label: "بد" },
];

/* داده‌های قدیمی «تقویم سلامت مردان» (MH_IND/MH_REC_POOL/MH_EXLIB و…) به
   mcal-data.js منتقل و بازطراحی شده‌اند؛ نسخهٔ فعال از آنجا بارگذاری می‌شود. */

/* ---------- ED/PE program flag (از نتایج SHIM/PEDT؛ بدون ذخیرهٔ نمره) ---------- */
var PP_DATA = {"sections":[{"id":"recovery","title":"من و بدنم","tagline":"بهبودی جسمی پس از زایمان","desc":"خونریزی، بخیه، سزارین، دردهای رایج و تغییرات بدن — با زبان ساده و بدون قضاوت.","color":"#B86F68","bg":"#F3E3DF","border":"#E9D6D2"},{"id":"feeding","title":"همراه شیردهی","tagline":"پشتیبانی بدون قضاوت","desc":"راهنمای کاربردی شیردهی، پاسخ سریع به دشواری‌های امروز، و احترام به هر نوع انتخاب تغذیه.","color":"#5C8A73","bg":"#E7EEE9","border":"#D8E4DD"},{"id":"mood","title":"حال من و اعتمادبه‌نفسم","tagline":"در این مسیر، تو هم مهمی","desc":"احساسات پس از زایمان، دفتر افتخارهای کوچک، و راه‌های مراقبت از خودِ تو.","color":"#806080","bg":"#EEE8EF","border":"#E1D7E3"},{"id":"dailylife","title":"خواب، انرژی و مراقبت از خود","tagline":"مدیریت روزها با انرژی امروز","desc":"خواب تکه‌تکه، درخواست کمک مشخص، تغذیه و برنامه‌ریزی واقع‌بینانه.","color":"#B88745","bg":"#F4EDE2","border":"#E7DBC8"},{"id":"pelvic","title":"بازیابی قدرت بدن","tagline":"کف لگن و فعالیت بدنی","desc":"کارکرد کف لگن، نشت ادرار، سنگینی لگن و بازگشت تدریجی به حرکت — با ارزیابی فردی.","color":"#24594F","bg":"#E7EEE9","border":"#D3E2DA"},{"id":"intimacy","title":"صمیمیت و زندگی زناشویی","tagline":"به سرعت خودت، بدون فشار","desc":"تغییرات میل، راحتی بدن، گفتگو با همسر و مسیر تدریجی بازگشت به صمیمیت.","color":"#7D6255","bg":"#F1EAE2","border":"#E4D8C9"},{"id":"support","title":"حمایت اطرافیان و پیگیری سلامت","tagline":"کمک بگیر؛ این کار مادر بودن را آسان‌تر نمی‌خواهد","desc":"ویزیت‌های پس از زایمان، سؤال‌های پزشک، چک‌لیست کمک از اطرافیان و اشتراک با همسر.","color":"#54726A","bg":"#E9EFEA","border":"#D5E0D9"}],"moods":[{"id":"good","label":"خوب","face":"☺"},{"id":"okay","label":"معمولی","face":"😐"},{"id":"low","label":"کمی ناراحت","face":"▸"},{"id":"rough","label":"روز سخت","face":"◦"}],"energies":[{"id":"empty","label":"تخلیه‌شده"},{"id":"low","label":"کم"},{"id":"okay","label":"متوسط"},{"id":"good","label":"خوب"}],"sleeps":[{"id":"poor","label":"تقریباً نخوابیدم"},{"id":"broken","label":"تکه‌تکه خوابیدم"},{"id":"rested","label":"تا حدی استراحت کردم"}],"symptoms":[{"id":"fatigue","label":"خستگی زیاد"},{"id":"perineal_pain","label":"درد بخیه یا پرینه"},{"id":"cs_pain","label":"درد محل سزارین"},{"id":"breast_pain","label":"سفتی یا درد سینه"},{"id":"urine_leak","label":"نشت ادرار"},{"id":"pelvic_pressure","label":"سنگینی یا فشار لگن"},{"id":"constipation","label":"یبوست"},{"id":"little_sleep","label":"کم‌خوابی"},{"id":"body_distress","label":"حس ناخوشایند درباره بدنم"},{"id":"fever","label":"تب یا لرز","urgent":true},{"id":"heavy_bleed","label":"خونریزی زیاد (خیس شدن پد در یک ساعت)","urgent":true},{"id":"severe_headache","label":"سردرد شدید یا تازه","urgent":true},{"id":"vision_change","label":"تاری دید یا جرقه در چشم","urgent":true},{"id":"chest_pain","label":"درد قفسه سینه","urgent":true},{"id":"breathless","label":"تنگی نفس ناگهانی","urgent":true},{"id":"calf_pain","label":"درد یا تورم ساق پا","urgent":true},{"id":"wound_sign","label":"قرمزی، چرک یا باز شدن محل بخیه/سزارین","urgent":true},{"id":"foul_smell","label":"بوی بد ترشحات","urgent":true},{"id":"harm_thoughts","label":"افکار آسیب به خودم یا نوزاد","urgent":true},{"id":"psychosis_signs","label":"دیدن یا شنیدن چیزهایی که دیگران نمی‌بینند، گیجی شدید","urgent":true}],"cards":[{"id":"rec-lochia","section":"recovery","title":"خونریزی و ترشحات پس از زایمان","experience":"در روزهای اول، خونریزی معمولاً شبیه پریود شدید است و کم‌کم در طول هفته‌ها کم‌رنگ‌تر و کمتر می‌شود؛ رنگ آن از قرمز به صورتی، قهوه‌ای و سپس روشن تغییر می‌کند. لخته‌های کوچک در روزهای نخست دیده می‌شود و این امر معمولاً طبیعی است. مدت این ترشحات در هر فرد متفاوت است و ممکن است تا چند هفته ادامه یابد.","why":"رحم پس از زایمان در حال پاک‌سازی و بازگشت به اندازهٔ طبیعی خود است و جای اتصال جفت هم ترمیم می‌شود؛ به همین دلیل خونریزی تدریجی کم می‌شود.","steps":["از پد بهداشتی استفاده کن و آن را مرتب عوض کن.","دست‌ها را قبل و بعد از تعویض پد بشو.","استراحت کوتاه در روز به کاهش خونریزی کمک می‌کند؛ فعالیت زیاد ممکن است موقتاً آن را بیشتر کند.","روند رنگ و مقدار خونریزی را چند روزی زیر نظر بگیر تا تغییرات غیرعادی را زودتر ببینی."],"avoid":["تا وقتی خونریزی تمام نشده از تامپون استفاده نکن؛ این کار خطر عفونت را بالا می‌برد.","مقدار خونریزی خودت را با دیگران مقایسه نکن؛ دامنهٔ طبیعی گسترده است.","اگر خونریزی ناگهان زیاد شد، منتظر نمان که «شاید خودش بهتر شود»."],"seekHelp":["اگر پد در حدود یک ساعت خیس می‌شود یا لختهٔ بزرگ داری، بدون معطلی با مرکز درمانی تماس بگیر.","اگر بعد از کم‌رنگ شدن، خونریزی دوباره قرمز روشن و زیاد شد، بررسی پزشکی لازم است.","تب، لرز یا بوی بد ترشحات نیازمند ارزیابی فوری است."],"source":"WHO 2022 · NHS Postnatal Care","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"rec-perineal","section":"recovery","title":"مراقبت از پرینه و بخیه","experience":"سوزش، تورم و درد ناحیهٔ پرینه در روزهای اول رایج است، چه بخیه داشته باشی چه نداشته باشی. بخیه‌ها معمولاً ظرف چند هفته جذب می‌شوند و حس گزگز یا کشش در هفته‌های اول طبیعی است. نشستن ممکن است ابتدا ناراحت‌کننده باشد و کم‌کم ساده‌تر شود.","why":"این ناحیه هنگام تولد نوزاد کشیده و فشرده می‌شود؛ بدن برای ترمیم بافت به زمان نیاز دارد و گردش خون بیشتر در این دوره باعث تورم اولیه می‌شود.","steps":["روی ناحیه آب خنک (دوش آب یا کیسهٔ سرد تمیز و پوشانده) چند دقیقه در روز می‌تواند آرامش‌بخش باشد.","هنگام شست‌وشو از آب ولرم استفاده کن و ناحیه را با حولهٔ تمیز به‌آرامی خشک کن؛ مالش نده.","برای نشستن از یک بالشتک حلقه‌ای یا نشستن روی یک بال سفتی استفاده کن.","فشار و درد هنگام اجابت مزاج را با نوشیدن آب کافی و حرکت ملایم کم کن.","مسکن و ملین مناسب شیردهی را فقط با توصیهٔ پزشک یا ماما استفاده کن."],"avoid":["از اسپری، صابون معطر یا دهان‌شویه روی این ناحیه استفاده نکن.","درد مداوم را «قابل تحمل تا هر وقت» فرض نکن؛ درد فزاینده نشانهٔ بررسی است.","برای «سریع‌تر جوش خوردن» کارهای سنگین یا فشارآور انجام نده."],"seekHelp":["دردی که به‌جای بهتر شدن بدتر می‌شود، با قرمزی، گرمی یا ترشح چرکی، نیاز به معاینه دارد.","تب یا بوی بد ترشحات را جدی بگیر.","بی‌اختیاری مدفوع یا ناتوانی در کنترل گاز نیاز به ارزیابی تخصصی دارد و درمان دارد."],"source":"WHO 2022 · NHS Perineal Care","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"rec-csection","section":"recovery","title":"مراقبت از محل عمل سزارین","experience":"محل بخیه در هفته‌های اول ممکن است دردناک، کشیده و کمی بی‌حس باشد؛ حس بی‌حسی دور اسکار می‌تواند ماه‌ها باقی بماند. راه رفتن با خم شدن و بلند کردن نوزاد در روزهای اول سخت است و کم‌کم با قدرت بازگشت، راحت‌تر می‌شود.","why":"سزارین یک عمل جراحی شکمی است؛ لایه‌های پوست، عضله و رحم به زمان مشخصی برای ترمیم نیاز دارند و این فرآیند را نمی‌توان با اراده سریع کرد.","steps":["محل زخم را تمیز و خشک نگه دار؛ معمولاً آب و صابون ملایم کافی است (دستور تیم درمانت را اولویت بده).","هنگام سرفه، عطسه یا خندیدن، یک بالشت را با فشار ملایم روی شکم نگه دار.","روزها چند بار کوتاه راه برو؛ حرکت ملایم به ترمیم و پیشگیری از لخته کمک می‌کند.","برای بلند شدن از تخت، اول به پهلوی بخواب و با کمک دست‌ها بالا بیا.","در هفته‌های اول چیزی سنگین‌تر از نوزادت بلند نکن."],"avoid":["روی زخم کرم یا داروی خانگی نگذار مگر با توصیهٔ پزشک.","تمرین‌های سنگین شکم را زود شروع نکن؛ بدنت هنوز در حال ترمیم است.","دردهای جراحی را با تحمل بی‌پایان مدیریت نکن؛ تسکین درد با راهنمای پزشک حق توست."],"seekHelp":["قرمزی فزاینده، تورم، ترشح چرکی، باز شدن بخیه یا تب نیاز به بررسی فوری دارد.","دردی که با مسکن تجویزشده کنترل نمی‌شود را گزارش بده.","تورم، درد یا گرمی در ساق پا می‌تواند نشانهٔ لخته باشد و باید فوری بررسی شود."],"source":"ACOG 2018 · NHS C-section Recovery","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است.","tags":["csection"]},{"id":"rec-discomforts","section":"recovery","title":"یبوست، تورم، درد و خستگی","experience":"یبوست در روزهای اول رایج است، به‌خصوص اگر از مسکن یا آهن استفاده کرده‌ای. تورم پاها و مچ‌ها معمولاً طبیعی است و طی یکی دو هفته کم می‌شود. خستگی عمیق هم هفته‌های اول همراهت است و نشانهٔ تنبلی یا ضعف تو نیست.","why":"بدن در حال ترمیم است، هورمون‌ها در حال تغییرند و خواب تکه‌تکه می‌شود؛ روده‌ها هم پس از زایمان کندتر کار می‌کنند. این‌ها مجموعه‌ای طبیعی و موقتی‌اند.","steps":["در هر وعدهٔ شیردهی یک لیوان آب بنوش؛ آب کافی به یبوست و انرژی کمک می‌کند.","میوه، سبزی، غلات کامل و حبوبات را کم‌کم به وعده‌ها اضافه کن.","چند بار در روز کوتاه قدم بزن؛ حرکت ملایم روده‌ها را فعال می‌کند.","دست‌وپاها را در ساعات استراحت بالاتر از سطح قلب بگذار تا تورم کمتر شود.","برای دردها از مسکن تأییدشده برای شیردهی، با مشورت پزشک استفاده کن."],"avoid":["خستگی را با «باید بیشتر تلاش کنم» جبران نکن؛ استراحت بخشی از درمان است.","ملین یا مسکن بدون مشورت حرفه‌ای مصرف نکن.","تورم را همیشه طبیعی فرض نکن؛ اگر ناگهانی و همراه با سردرد یا تاری دید بود، اورژانسی است."],"seekHelp":["یبوستی که بیش از چند روز با راهکارهای ساده بهتر نشود را با پزشک در میان بگذار.","تورم یک‌طرفهٔ ساق پا همراه با درد باید فوری بررسی شود.","خستگی شدیدِ مداوم می‌تواند نشانهٔ کم‌خونی یا مشکلات تیروئید باشد و قابل بررسی است."],"source":"WHO 2022 · NHS Postnatal Care","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"rec-body","section":"recovery","title":"تغییرات بدن و تصویر بدن","experience":"شکم هنوز نرم و برجسته است، وزن کم شدنش ماه‌ها زمان می‌برد، موها از حدود ماه سوم می‌ریزند و خط‌های کشیدگی کم‌رنگ اما حاضرند. ممکن است در برابر آینه احساس غریبگی کنی؛ این احساس بین مادرها بسیار رایج است.","why":"در نه ماه، خون، بافت‌ها و هورمون‌های بدن برای رشد نوزاد تغییر کرده‌اند؛ بازگشت تدریجی است و برای برخی تغییرات مثل ریزش مو، سیکل طبیعیِ خودش را دارد و معمولاً ظرف حدود یک سال بهتر می‌شود.","steps":["به جای «بازگشت به بدن قبلی»، هدف‌های کوچکِ مراقبت از خودت بگذار: آب، غذای ساده، خوابِ ممکن.","لباس‌هایی بپوش که الان راحت‌اند؛ لازم نیست منتظر «قدیمی‌ها» بمانی.","اگر حس می‌کنی شکمت به حالت قبلی برنمی‌گردد، جدا شدن عضلات راست شکم قابل بررسی و درمان است؛ از فیزیوتراپیست بپرس.","هر روز یک جملهٔ دلسوزانه به خودت بگو؛ بدنت این مدت کار بزرگی کرده است.","لحظه‌های خوب با بدنت را ثبت کن — در «دفتر افتخارهای کوچک» جای مناسبی است."],"avoid":["رژیم‌های سخت برای «سریع لاغر شدن» در دورهٔ بهبودی و شیردهی مناسب نیستند.","خودت را با عکس‌های قبل از بارداری یا با مادرهای دیگر مقایسه نکن؛ هر بدنی مسیر خودش را دارد.","به قول‌های جادویی «بازگشت بدن در X هفته» اعتماد نکن."],"seekHelp":["اگر ناراحتی از بدنت به اندازه‌ای است که حالت کلی را پایین می‌آورد، گفتگو با متخصص سلامت روان کمک‌کننده است.","درد یا برجستگی شکمی، نشت ادرار یا سنگینی لگن قابل ارزیابی و درمان‌اند.","ریزش موی شدیدِ غیرمعمول یا علائم تیروئیدی را با پزشک در میان بگذار."],"source":"ACOG 2018 · NHS Postnatal Body","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"fee-attachment","section":"feeding","title":"جای صحیح و گرفتن سینه","experience":"در روزهای اول شاید نشاندن نوزاد و گرفتن سینه به‌راحتی پیش نرود؛ دست‌ها ناشی‌اند، نوزاد بی‌قرار است و این حالت برای تقریباً همهٔ مادرها آشناست. وقتی گرفتن سینه درست باشد، شیردهی بیشتر «حس فشار ملایم» می‌دهد تا درد.","why":"شیردهی یک مهارت یادگرفتنی برای تو و نوزاد است؛ هماهنگی بین مادر و نوزاد به تمرین نیاز دارد و جای نشستن نامناسب، رایج‌ترین علت ناراحتی است.","steps":["اول خودت راحت بنشین؛ پشتت حمایت داشته باشد، آب و چیز لازم کنار دستت باشد.","تمام بدن نوزاد را رو به خودت نزدیک کن؛ گوش، شانه و لگن در یک خط باشد.","نوک سینه را مقابل بینی نوزاد بگیر تا با باز شدن دهان، سینه را بگیرد؛ چانه‌اش به سینه بچسبد.","نشانهٔ خوب گرفتن: دهان باز بزرگ، لب‌های برگشته به بیرون، چانه چسبیده و صدای بلع منظم.","اگر درد داشتی، با انگشت کوچک لبهٔ دهان نوزاد را باز کن و دوباره شروع کن؛ شکست مکرر طبیعی است."],"avoid":["تنها سر نوزاد را نگیر؛ بدنش باید هم حمایت شود.","درد مداوم را جزو «شرایط شیردهی» فرض نکن.","با گرسنه و بی‌قرار بودن نوزاد شروع به تمرین نکن؛ اول آرامش‌بخش باشد."],"seekHelp":["اگر در هر بار شیردهی درد شدید داری یا نوک سینه آسیب می‌بیند، با ماما یا مشاور شیردهی تماس بگیر؛ علت اغلب قابل اصلاح است.","اگر نوزاد به‌طور مداوم سینه را نمی‌گیرد، ارزیابی حضوری بسیار کمک می‌کند.","نگرانی دربارهٔ وزن‌گیری نوزاد را با پزشک کودکان در میان بگذار."],"source":"WHO 2022 · NHS Breastfeeding Positions","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"fee-nipple","section":"feeding","title":"درد و آسیب نوک سینه","experience":"حساسیت ملایم در روزهای نخست رایج است، اما درد شدید، سوزش در کل زمان شیردهی، ترک یا خون‌ریزی طبیعی محسوب نمی‌شود و نباید تحملش کنی. این درد معمولاً علت قابل‌رفع دارد.","why":"شایع‌ترین علت، جای گرفتن نامناسب نوزاد است؛ گاهی هم مکیدن نامتعادل، خشکی پوست یا عفونت‌هایی مثل قارچ نقش دارند. علت با معاینه مشخص می‌شود.","steps":["قبل از هر چیز، جای گرفتن نوزاد را دوباره بررسی کن؛ اغلب با اصلاح آن، درد کم می‌شود.","بعد از شیردهی، چند قطره شیر مادر را روی نوک بمال و بگذار خشک شود؛ برخی مادرها این کار را آرامش‌دهنده می‌دانند.","از پمپ‌های محافظ یا کرم‌های مناسب شیردهی می‌توان استفاده کرد؛ نوع مناسب را از ماما یا داروخانه بپرس.","پدهای شیردهی را مرتب عوض کن تا ناحیه خشک بماند.","برای آرامش موقت، کمپرس سرد کوتاه بعد از شیردهی کمک می‌کند."],"avoid":["نوک سینه را با صابون یا الکل نشوی؛ لایهٔ محافظ پوست از بین می‌رود.","درد را تحمل نکن و «سخت بگیر»؛ این کار مشکل را بدتر می‌کند و ماندگاری شیردهی را کم می‌کند.","شروع یا قطع شیردهی را بدون مشورت حرفه‌ای و در اثر درد تصمیم نگیر؛ راه‌های میانی هست."],"seekHelp":["دردی که در طول شیردهی ادامه دارد یا با آسیب همراه است، باید توسط ماما/مشاور شیردهی بررسی شود.","سفیدی دردناک نوک سینه یا درد تیز عمقی می‌تواند نشانهٔ قارچ یا اسپاسم عروقی باشد و درمان دارد.","تب همراه با درد سینه نیازمند بررسی سریع است."],"source":"WHO 2022 · NHS Sore Nipples","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"fee-engorgement","section":"feeding","title":"پُری، احتقان و ناراحتی سینه","experience":"در روزهای دو تا پنج، با رسیدن شیر، سینه‌ها بزرگ، سفت، گرم و حساس می‌شوند؛ نوک سینه ممکن است صاف و کشیده شود و گرفتن سینه برای نوزاد سخت‌تر شود. این پُری با تنظیم شدن شیر، در چند روز کاهش پیدا می‌کند.","why":"خون و شیر همزمان به سینه‌ها هجوم می‌آورند تا تولید تنظیم شود؛ بدن هنوز در حال «هم‌فهم شدن» با نیاز نوزاد است.","steps":["به‌طور منظم و به اقتضای نوزاد شیر بده؛ تخلیهٔ مؤثر مهم‌ترین عامل آرامش است.","قبل از شیردهی، با چند قطرهٔ دستی شیر را کمی بگیر تا هاله نرم شود و نوزاد راحت‌تر بگیرد.","بین شیردهی‌ها کمپرس سرد (پوشانده، چند دقیقه) ناراحتی را کم می‌کند.","لباس و سوتین راحت و غیرفشاری بپوش.","کمپرس گرم کوتاه فقط قبل از شیردهی یا تخلیه کمک می‌کند، نه طولانی‌مدت."],"avoid":["پمپاژ طولانی و زیاد را برای «خالی کردن کامل» تکرار نکن؛ تولید را بیشتر می‌کند.","سینه را ساعتی‌ها رها نکن؛ اگر نوزاد نمی‌خورد، مقدار کمی شیر بگیر تا راحت شوی.","سوتین تنگ یا سیم‌دارِ فشاری نپوش."],"seekHelp":["قرمزی موضعی مثل گُوه، درد شدید یک نقطه، تب و حالت آنفلوآنزایی می‌تواند نشانهٔ التهاب پستان باشد؛ سریع با پزشک تماس بگیر.","توده‌ای که با تخلیه بهتر نمی‌شود را بررسی کن.","اگر پُری و درد چند روز پیوسته بدتر شد، کمک تخصصی بگیر."],"source":"WHO 2022 · NHS Breast Engorgement","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"fee-supply","section":"feeding","title":"نگرانی دربارهٔ کم بودن شیر","experience":"«شاید شیرم کافی نباشد» یکی از رایج‌ترین نگرانی‌های مادرهاست؛ سینه‌های نرم‌تر از هفتهٔ اول، فاصلهٔ گرفتن شیرها یا نوزاد بی‌قرار، همه حس نگرانی می‌سازند. اما این حس‌ها به‌تنهایی سنجهٔ کافی بودن شیر نیستند.","why":"بدن پس از هفته‌های اول با نیاز واقعی نوزاد تنظیم می‌شود و سینه‌ها «حرفه‌ای‌تر» می‌شوند؛ بی‌قراری نوزاد هم اغلب جهش رشد، خواب یا نیاز به نوازش است، نه گرسنگی.","steps":["سنجه‌های قابل اتکا را ببین: تعداد پوشک‌های خیس و مدفوع مناسب سن، افزایش وزن در کنترل‌های پزشک، و بلع منظم هنگام شیر خوردن.","به اقتضای نوزاد شیر بده؛ شیردهی مکرر به بدن پیام «بیشتر تولید کن» می‌دهد.","تماس پوست‌به‌پوست، استراحت ممکن، آب و غذای کافی به تولید کمک می‌کنند.","برای اطمینان، وزن نوزاد را در نوبت‌های پیش‌بینی‌شدهٔ پزشک پیگیری کن.","اگر دلت نمی‌آرامد، یک مشورت با ماما یا مشاور شیردهی بگیر تا وضعیت عینی بررسی شود."],"avoid":["از روی احساس نگرانی، بدون مشورت، شیر خشک اضافه نکن؛ گاهی مشکل جای گرفتن یا برنامهٔ شیردهی است.","خودت را ملامت نکن؛ کم بودن شیر یک «قصور مادری» نیست.","دستگاه‌های پمپاژ را معیار سنجش تولید ندان؛ مقدار پمپ با نیاز نوزاد تفاوت دارد."],"seekHelp":["پوشک‌های خیس کمتر از حد طبیعی، بی‌حالی نوزاد یا عدم وزن‌گیری؛ در این موارد با پزشک کودکان تماس بگیر.","نوزادی که بعد از شیر مدام بی‌قرار است و وزن نمی‌گیرد، باید ارزیابی حضوری شود.","درد یا ترشح نوک سینه که مانع شیردهی مؤثر است، قابل کمک گرفتن است."],"source":"WHO 2022 · CDC Milk Supply","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"fee-express","section":"feeding","title":"شیردوشی و نگهداری شیر مادر","experience":"شاید برای استراحت، مراجعه یا کار بخواهی شیر بگیری؛ در شروع ممکن است مقدار کم باشد و این طبیعی است. نگهداری شیر قواعد ساده‌ای دارد که یادگرفتنش چند دقیقه بیشتر نمی‌گیرد.","why":"شیر مادر در شرایط تمیز و دمای مناسب زنده می‌ماند؛ شناخت این قواعد به تو آزادی و آرامش می‌دهد بدون اینکه کیفیت شیر به خطر بیفتد.","steps":["دست‌ها را بشو و از ظرف تمیز و درب‌دار استفاده کن؛ روی ظرف تاریخ بزن.","قاعدهٔ عمومی: دمای اتاق چند ساعت، یخچال چند روز (در عمق یخچال) و فریزر چند ماه؛ راهنمای دقیق را از ماما یا منابع معتبر بگیر.","برای یخ‌زدایی، ظرف را در یخچال یا آب ولرم بگذار؛ مایکروویو برای گرم کردن شیر مادر مناسب نیست.","شیر یخ‌زدایی‌شده را دوباره فریز نکن و باقیماندهٔ شیر یک وعده را نگه ندار.","با شیردوشی دستی شروع کن؛ برخی مادرها آن را راحت‌تر و بی‌هزینه می‌یابند."],"avoid":["از ظرف‌های غیربهداشتی یا شسته‌نشده استفاده نکن.","شیر را در درِ یخچال نگذار؛ دما نوسان دارد.","اگر شیر بوی نامعمول یا ظاهر عجیب داشت، محتاط باش و از منبع معتبر بپرس."],"seekHelp":["اگر شیردوشی دردناک یا بی‌نتیجه است، اندازهٔ فنجان شیردوش و تکنیک قابل تنظیم است؛ از مشاور شیردهی کمک بگیر.","برای بازگشت به کار و برنامهٔ شیردهی، مشورت زودهنگام کمک می‌کند.","سؤال دربارهٔ مقدار و وعده‌ها را با پزشک نوزاد در میان بگذار."],"source":"NHS Expressing & Storing · CDC Milk Storage","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"fee-mixed","section":"feeding","title":"تغذیه ترکیبی و شیر خشک — بدون قضاوت","experience":"شاید شرایط جسمی، روحی یا زندگی، تغذیهٔ ترکیبی یا شیر خشک را برایت آسان‌تر یا ضروری کند. شاید از ملاک‌های اطرافیان دلت گرفته باشد. هر انتخابی که با شناخت و آرامش انجام شود، برای نوزاد و برای تو ارزشمند است.","why":"تغذیه فقط یکی از ده‌ها راهی است که مادر با نوزادش پیوند و مراقبت می‌سازد؛ شیر خشک جایگزین تغذیه‌ای سالم و استاندارد است و پیوند مادری به روش تغذیه وابسته نیست.","steps":["برای انتخاب نوع و مقدار شیر خشک و طرز تهیهٔ اصولی، با پزشک نوزاد مشورت کن.","در تغذیهٔ ترکیبی، ترتیب و زمان‌بندی را با یک مشاور شیردهی بچین تا شیر مادر حفظ شود (اگر این هدف توست).","شیشه‌ها را طبق راهنمای بهداشتی تمیز و ضدعفونی کن.","هنگام شیر دادن، نوزاد را نزدیک نگه دار و تماس چشمی داشته باش؛ پیوند همین‌جا ساخته می‌شود.","مرزهای خودت را تعیین کن: می‌توانی بگویی «برای انتخاب تغذیه، نظر پزشک برای ما کافی است»."],"avoid":["به خودت نگوی «مادرِ ناقص»؛ روش تغذیه معیار محبت و توانمندی تو نیست.","به فشار اطرافیان بی‌گفت‌وگو تن نده؛ انتخاب تغذیه مال تو و خانوادهٔ توست.","مقدار شیر خشک را بدون مشورت پزشک کم و زیاد نکن."],"seekHelp":["برای هر تغییر در برنامهٔ تغذیه، پزشک نوزاد منبع درست تصمیم است.","اگر احساس گناه یا ناراحتی شدید دربارهٔ تغذیه داری، گفتگو با متخصص سلامت روان ارزشمند است.","نگرانی وزن یا رشد نوزاد را با پزشک پیگیری کن."],"source":"WHO 2022 · NHS Formula Feeding","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"moo-blues","section":"mood","title":"غصه‌های بعد از زایمان (baby blues)","experience":"در روزهای اول ممکن است بی‌دلیل گریه کنی، حساس‌تر از همیشه باشی، ناگهان نگران شوی یا احساس خالی بودن کنی. بسیاری از مادرها این روزها را تجربه می‌کنند؛ می‌تواند همزمان با لحظه‌های محبت و شادی هم باشد.","why":"افت سریع هورمون‌های بارداری، خواب ناکافی و فشار جلسهٔ جدید زندگی، این نوسانات را می‌سازند. این واکنش‌ها ضعف تو نیستند؛ پاسخ طبیعی بدن به یک تغییر بزرگ‌اند.","steps":["به خودت اجازه بده گریه کنی؛ احساس را سرکوب نکن.","یک نفر مطمئن را از حالت باخبر کن؛ حتی یک جملهٔ ساده: «این روزها سخت است.»","خوابِ ممکن، غذای ساده و کم کردن مهمان‌ها را جدی بگیر.","انتظار «مادر فوق‌العاده بی‌نقص» را از خودت بردار؛ همین که داری مراقبت می‌کنی، کافی است."],"avoid":["هر گریه‌ای را «طبیعی baby blues» فرض نکن؛ شدت و مدت مهم‌اند.","اگر بعد از حدود دو هفته حالت بهتر نشد یا بدتر شد، آن را رد نکن.","افکار آسیب‌رسانی به خود یا نوزاد را «حرف نزن تا رد شود» ندان؛ این‌ها نشانهٔ نیاز فوری به کمک‌اند."],"seekHelp":["اگر ناراحتی، گریه یا نگرانی بیش از حدود دو هفته ادامه دارد یا بدتر می‌شود، با پزشک، ماما یا متخصص سلامت روان تماس بگیر.","ناتوانی در انجام کارهای روزانه، بی‌خوابیِ حتی هنگام خستگی مفرط یا ناامیدی جدی، نیاز به ارزیابی دارد.","افکار آسیب به خود یا نوزاد همیشه اورژانسی است؛ همین حالا از یک بزرگسال مطمئن و خدمات درمانی کمک بگیر."],"source":"NHS Baby Blues & PND · CDC Maternal Depression","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"moo-overwhelm","section":"mood","title":"وقتی از همه‌چیز پر می‌شوی","experience":"نگرانی دائمی دربارهٔ نوزاد، ذهنی که مدام چک می‌کند «نفس می‌کشد؟»، تنش جسمی و حسی که اصلاً متوقف نمی‌شود؛ برخی مادرها آن را «پر شدن» می‌نامند. ممکن است با خستگی، بدتر هم بشود.","why":"ذهن در حال یادگیری یک مسئولیت جدید و حیاتی است؛ سیستم هشدار بدن موقتاً بیش از حد فعال است. نگرانی مداوم اگر شدید و مزاحم زندگی شود، قابل بررسی و درمان است — نه چیزی که فقط با تلاش بیشتر برطرف شود.","steps":["یک نگرانیِ قابل‌عمل را انتخاب کن و برایش یک قدم کوچک بردار؛ بقیه را بنویس تا از ذهنت بیرون بیاید.","از تمرین کوتاه «چند دقیقه برای آرامش» همین ماژول استفاده کن؛ اگر دلت خواست.","نگهبان‌های اضافی را کم کن: تعداد مهمان، تعداد تصمیم‌های روز، تعداد کارهای خانه.","نگرانی‌هایت را با یک نفر مطمئن در میان بگذار؛ گفتنِ بلند اغلب سبکشان می‌کند.","برای خودت یک «لحظهٔ بدون نوزاد» در روز تعیین کن، حتی ۱۰ دقیقه."],"avoid":["نگرانی شدید را با «همهٔ مادرها نگرانند» جمع‌بندی نکن؛ میان نگرانی عادی و اضطراب مزاحم تفاوت هست.","قبل از خواب، اخبار نگران‌کننده یا جستجوی بیماری در اینترنت را کنار بگذار.","الکل یا داروی بدون تجویز برای آرام شدن استفاده نکن."],"seekHelp":["اگر اضطراب مدام است، بدنت را بی‌قرار می‌کند یا خواب را می‌دزدد، با متخصص سلامت روان صحبت کن؛ درمان‌های مؤثری وجود دارد.","حمله‌های وحشت‌زدگی یا ناتوانی در مراقبت از نوزاد نیازمند ارزیابی سریع است.","همیشه می‌توانی از مسیر «به کمک حرفه‌ای نیاز دارم» در همین اپ شروع کنی."],"source":"NHS PND · CDC Maternal Depression","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"moo-compare","section":"mood","title":"تنهایی، احساس گناه و مقایسه","experience":"شاید احساس کنی کسی نمی‌فهمد، از استراحت کردن احساس گناه داری، یا خودت را با مادرهایی که «همه‌چیزشان مرتب است» مقایسه می‌کنی. این احساس‌ها با خستگی قوی‌تر می‌شوند و خیلی رایج‌اند.","why":"زندگی پس از زایمان ناگهان منزوی و تکراری می‌شود؛ شبکه‌های اجتماعی هم تصویرِ بریده‌شده و انتخاب‌شده از زندگی دیگران را نشان می‌دهند. احساس گناه دربارهٔ استراحت، حاصل فرهنگی است که «خودت را فراموش کن» می‌گوید — اما مراقبت از تو بخشی از مراقبت از نوزاد است.","steps":["هر روز یک تماس انسانی کوچک بگذار: یک پیام، یک تماس تلفنی، یک قدم بیرون.","برای درخواست کمک از جملات مشخص استفاده کن: «می‌شود امروز ناهار را تو بپزی؟» مشخص بودن، کمک را آسان می‌کند.","وقتی مقایسه شروع شد، یادت بیاور آن‌ها هم روزهای سخت دارند؛ فقط نمایش داده نمی‌شود.","یک افتخار کوچک امروزت را در «دفتر افتخارهای کوچک» بنویس؛ ذهن به دنبال اثبات کم‌کاری می‌گردد، به آن دادهٔ واقعی بده.","بگوید خواستی: «لازم نیست راه‌حل بدهی؛ فقط گوش بده.»"],"avoid":["استراحت را «تنبلی» ندان؛ استراحت بخشی از بهبودی جسمی و روحی است.","زندگی واقعی‌ات را با کلیپ‌های انتخاب‌شدهٔ دیگران بسنج.","احساس گناه را با کار بیشتر «جبران» نکن."],"seekHelp":["اگر احساس تنهایی به ناامیدی رسیده یا احساس گناه سنگین و دائمی شده، گفتگو با متخصص سلامت روان کمک می‌کند.","اگر در خانه کسی به حرفت گوش نمی‌دهد یا محیطت غیرحمایتی است، از ماما، مرکز بهداشت یا گروه‌های حمایتی مادران کمک بگیر.","هر احساسی که به فکر آسیب رساندن نزدیک شد، اورژانسی است."],"source":"CDC Maternal Depression · NHS Mental Health After Birth","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"moo-identity","section":"mood","title":"هویت من بعد از مادر شدن","experience":"شاید دلت برای «خودِ قبلی» تنگ شود: کار، دوستان، آزادی، یا حتی نامت که حالا همیشه «مامان» شده. می‌توان همزمان نوزادت را دوست داشته باشی و برای زندگی قبلی‌ات سوگواری کنی؛ این دو با هم تناقضی ندارند.","why":"مادر شدن یکی از بزرگ‌ترین گذرهای زندگی است؛ هویت در حال بازتعریف است. احساس از دست دادن، بخش طبیعی هر گذر بزرگ است و گفتنِ آن ممنوع نیست.","steps":["هر روز یک کار کوچک که «تو» را یادت می‌آورد انجام بده: موسیقی محبوب، یک صفحه کتاب، حرفه‌ای که دوست داری.","با کسی که قبلاً هم نزدیکت بود تماس بگیر؛ رابطه‌ها در این دوره به شناوری نیاز دارند.","به شریک زندگی‌ات بگو از چه لحظه‌هایی حس می‌کنی «خودت» می‌شوی تا آن‌ها را ممکن کند.","اهداف شخصی بزرگ را نگه دار، فقط تقویمشان را مهربان‌تر کن."],"avoid":["به خودت نگوی «دیگر فقط مادرم»؛ هویت‌ها جمع می‌شوند، جای هم را نمی‌گیرند.","غم برای زندگی قبلی را بی‌رحمی به نوزاد ندان.","برای بازگشتی که هنوز ممکن نیست، عجله نکن؛ قدم‌های کوچک واقعی‌ترند."],"seekHelp":["اگر حس از دست رفتن هویت به بی‌معنایی یا ناامیدی رسیده، گفتگو با متخصص سلامت روان ارزشمند است.","افسردگی پس از زایمان می‌تواند به شکل «من دیگر کیستم؟» خود را نشان دهد؛ بررسی حرفه‌ای کمک‌کننده است.","گروه‌های گفتگوی مادران می‌توانند حس تنهایی را کم کنند."],"source":"ACOG 2018 · CDC Maternal Depression","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"moo-ppd","section":"mood","title":"افسردگی پس از زایمان؛ اطلاعات، نه تشخیص","experience":"برخی مادرها در هفته‌ها و ماه‌های بعد از زایمان، غم مداوم، بی‌علاقگی، احساس بی‌ارزشی، خواب و اشتها به‌هم‌ریخته و ناامیدی را تجربه می‌کنند. این حالت‌ها به «ضعف اخلاقی» یا «بی‌مهرگی به نوزاد» ربطی ندارند؛ یک وضعیت پزشکی شناخته‌شده و درمان‌پذیرند.","why":"ترکیب تغییر هورمونی، کم‌خوابی، تجربهٔ زایمان و فشار زندگی جدید می‌تواند به افسردگی پس از زایمان منجر شود. این وضعیت با هیچ‌کدام از انتخاب‌های مادر «جذب» نمی‌شود و علل آن پیچیده و غیرقابل کنترل‌اند.","steps":["نشانه‌های جدی را بشناس: غم یا بی‌علاقگی بیشتر روزها در بیش از دو هفته، گریه‌های بی‌وقفه، بی‌خوابی حتی وقتی نوزاد خواب است، احساس بی‌ارزشی یا ناامیدی.","اگر این نشانه‌ها را می‌بینی، با پزشک، ماما یا متخصص سلامت روان صحبت کن؛ گفتنِ سادهٔ «حالم مدتی است خوب نیست» کافی است تا شروع شود.","درمان‌های مؤثری (روان‌درمانی، داروهای سازگار با شیردهی) وجود دارند؛ انتخاب با تو و پزشکت است.","برای ویزیت، فهرست حالت‌ها و روزها را از بخش «خلاصهٔ وضعیت» همین اپ بردار.","یک نفر حمایتگر را باخبر نگه دار تا در رفت‌وآمدها و مراقبت از نوزاد همراهت باشد."],"avoid":["این اپ و هیچ چک‌این روزانه‌ای نمی‌تواند افسردگی را تشخیص دهد یا رد کند؛ ابزار رسمی غربالگری فقط با متخصص معنا دارد.","«از نوزادت دور نشو» یا «فکرهای مثبت» جای درمان را نمی‌گیرند.","شروع درمان را به «وقتی اوضاع جا بیفتد» موکول نکن."],"seekHelp":["برای هر نشانهٔ پایدار فهرست بالا، مسیر حرفه‌ای را شروع کن؛ زودتر شروع کردن، بهبود را سریع‌تر می‌کند.","افکار آسیب به خود یا نوزاد، دیدن/شنیدن چیزهایی که دیگران نمی‌بینند یا گیجی شدید، اورژانسی‌اند؛ همین حالا کمک بگیر.","اگر پاسخ حرفه‌ای نگرفتی، مسیر دوم را امتحان کن: مرکز بهداشت، پزشک خانواده، یا بخش اورژانس بیمارستان."],"source":"NHS Postnatal Depression · CDC Maternal Depression · ACOG 2018","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"dai-sleep","section":"dailylife","title":"خواب تکه‌تکه — چگونه بیشتر استراحت کنم","experience":"خوابِ پیوسته فعلاً به «خاطره» شبیه است؛ بیداری‌های شبانه، چرت‌های نامنظم و حس خستگی همیشگی رایج‌اند. این وضعیت موقتی است و با کمک گرفتن، قابل بهتر شدن است.","why":"نوزادان در هفته‌های اول شب و روز را تفکیک نمی‌کنند و نیازهای تغذیه‌ایشان شبانه هم هست؛ بدن تو همزمان در حال ترمیم است، پس نیاز خوابت بیشتر از قبل شده است.","steps":["یک «بازهٔ استراحتِ محافظت‌شده» در روز بچین: کسی نوزاد را دارد و تو بدون گوشی استراحت می‌کنی.","شب را با شریک زندگی تقسیم کن؛ حتی یک نوبت بیداریِ جایگزین، فرق بزرگی می‌سازد.","کارهای غیرضروری را حذف کن؛ خانهٔ کم‌تر مرتب به بهبودی تو می‌ارزد.","وقتی نوزاد می‌خوابد، اول آب و غذا و بعد چرت کوتاه؛ پیام «همه‌چیز را تمیز کن» را فراموش کن.","قبل از خواب کوتاه، نور را کم کن تا بدن سریع‌تر خاموش شود."],"avoid":["خواب را با کارهای خانه معاوضه نکن.","کافئین نزدیک چرت‌ها مصرف نکن.","خوابیدن را «وقتی همه‌چیز تمام شد» موکول نکن؛ آن لحظه نمی‌رسد."],"seekHelp":["اگر خسته‌ای ولی اصلاً خوابت نمی‌برد، این می‌تواند نشانهٔ یک مشکل سلامت روان باشد؛ با پزشک صحبت کن.","خواب‌آلودگی شدید روزانه که ریسک می‌آفریند (مثلاً هنگام حمل نوزاد) را با اطرافیان و پزشک در میان بگذار.","نگرانی‌های شبانهٔ شدید را در بخش «حال من» دنبال کن."],"source":"NHS Tiredness After Birth · ACOG 2018","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"dai-askhelp","section":"dailylife","title":"درخواست کمک مشخص از اطرافیان","experience":"خیلی‌ها می‌گویند «هر کاری بگی هستیم»، اما مادرِ خسته نمی‌داند از کجا شروع کند. درخواستِ مشخص، کمک‌کردن را برای دیگران هم ساده‌تر می‌کند.","why":"اطرافیان اغلب صبر می‌کنند تا «شما بگویید»؛ بدون درخواست مشخص، پیش‌فرضشان همین می‌ماند. این‌که کمک نخواهی، نشانهٔ قدرت نیست.","steps":["سه کار امروز که می‌توانی واگذار کنی را بنویس: آشپزی، خرید، بغل کردن نوزاد وقتی دوش می‌گیری.","برای هر کار یک اسم بگذار و مستقیم بپرس؛ درخواست کمک عادی است.","از چک‌لیست «کمک از اطرافیان» در بخش حمایت استفاده کن و آن را برایشان بفرست.","به مهمان‌های بی‌خبر بگو چه کمکی می‌توانند بکنند؛ اگر نه، مهمانیِ ۱۵ دقیقه‌ای هم خوب است.","برای شب‌ها یک قرارداد کوچک ببند: چه کسی، چه ساعت‌هایی."],"avoid":["منتظر نمان دیگران حدس بزنند.","برای هر درخواست، اول «شرمنده نبودن» را تمرین کن؛ کمک‌گرفتن عادی است.","همهٔ فهرست را به یک نفر نده؛ تقسیم کن."],"seekHelp":["اگر کسی در خانه با تو همکاری نمی‌کند و بارِ همه‌چیز روی توست، این یک موضوع جدی حمایت است؛ با فرد مطمئن یا مشاور در میانش بگذار.","اگر احساس امنیت در خانه نداری، از خدمات حمایتی و افراد مورد اعتماد کمک بگیر.","برای حمایت عاطفیِ خانواده، راهنمای «چگونه کمک کنند» را در بخش حمایت ببین و برایشان بفرست."],"source":"ACOG 2018 (Support Systems) · WHO 2022","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"dai-nutrition","section":"dailylife","title":"آب و تغذیه در روزهای شلوغ","experience":"وقت غذا خوردن گم می‌شود؛ یا یک وعدهٔ نصفه سرِ شیردهی می‌خوری یا تا عصر چیزی نخورده‌ای. تشنگی هم در شیردهی بیشتر است و بی‌توجهی به آن خستگی را سنگین‌تر می‌کند.","why":"بدن برای ترمیم بافت، تولید شیر و جبران خونِ ازدست‌رفته به انرژی و مایعات بیشتری نیاز دارد؛ وعده‌های نامنظم، افت قند و خستگی را بیشتر می‌کنند.","steps":["هر جا می‌نشینی تا شیر بدهی، یک لیوان آب و یک چیز خوراکی کنارت باشد.","خوراکی‌های یک‌دستی آماده کن: میوه، مغزها، نان و پنیر، ماست، تخم‌مرغ آب‌پز.","غذای اصلی را لازم نیست تجملی بپزی؛ غذای سادهٔ خانگی کافی است.","از اطرافیان بخواه یک وعدهٔ روز را بر عهده بگیرند.","مکمل‌های توصیه‌شدهٔ پزشک (مثل آهن) را ادامه بده."],"avoid":["رژیم‌های سخت لاغری در این دوره شروع نکن.","چای/قهوه را جای آب نگذار.","وعده را به «وقتی نوزاد خوابید» گره نزن؛ همیشه این‌طور نمی‌شود."],"seekHelp":["سرگیجه، تپش قلب یا خستگی غیرمعمول می‌تواند نشانهٔ کم‌خونی باشد؛ بررسی پزشکی لازم است.","اگر اشتها برای هفته‌ها از بین رفته، این را در ویزیت مطرح کن؛ با حال روحی هم مرتبط است.","سؤال‌های تغذیهٔ شیردهی را با پزشک یا کارشناس تغذیه در میان بگذار."],"source":"WHO 2022 · NHS Diet After Birth","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"dai-pacing","section":"dailylife","title":"مدیریت روزها با انرژیِ موجود","experience":"برخی روزها فقط انرژیِ شیر دادن و آب خوردن هست؛ روزهای دیگر کمی بیشتر. تلاش برای «روز عادیِ قبلی» در این دوره نتیجه نمی‌دهد چون مبنایش اشتباه است، نه تو.","why":"انرژی بدن الان به ترمیم، تولید شیر و بیداری‌های شبانه اختصاص دارد؛ برنامه‌ریزی واقع‌بینانه یعنی تقسیم همین انرژی، نه اضافه‌بار.","steps":["هر شب یا صبح، «یک اولویت» برای روز انتخاب کن؛ بقیه اختیاری‌اند.","کارهای بزرگ را به تکه‌های ۱۰ دقیقه‌ای بشکن.","قاعدهٔ ساده: بعد از هر کارِ کوچک، چند نفس آرام یا یک لیوان آب.","برای برگشتن به کار، فعالیت‌های اجتماعی و ورزش، «فازبندی» کن: اول خودت و نوزاد، بعد یکی از آن‌ها.","چک‌این روزانهٔ همین اپ پیشنهادِ امروز را با انرژی‌ات تنظیم می‌کند."],"avoid":["فهرست بلندبالا «مادرِ خوب» نساز؛ هیچ‌کس آن را امتیاز نمی‌دهد.","روزهای کم‌انرژی را با کار بیشتر جبران نکن.","مقایسهٔ برنامهٔ روزت با مادرهای دیگر بی‌معناست؛ خواب و حمایت هر خانواده متفاوت است."],"seekHelp":["اگر حتی کارهای ضروری را نمی‌توانی انجام دهی، این می‌تواند نشانهٔ فشار روانی باشد؛ بخش «حال من» را ببین.","برای بازگشت به کار، حقوق و شرایط شیردهی را از منابع رسمی و محل کارت بپرس.","درد، خونریزی مجدد یا علائم جدید هنگام فعالیت بیشتر را با پزشک بررسی کن."],"source":"ACOG 2018 · WHO 2022","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"pel-function","section":"pelvic","title":"کف لگن چیست و چه نقشی دارد","experience":"شاید تا حالا اسمش را نشنیده باشی؛ اما این عضلات مثل یک تور نرم، مثانه، رحم و روده را نگه می‌دارند و در کنترل ادرار، مدفوع و رابطهٔ جنسی نقش دارند. در بارداری و زایمان تحت فشار و کشش زیادی قرار گرفته‌اند.","why":"نه ماه فشار وزن نوزاد و زایمان، این عضلات را کشیده و ضعیف می‌کند؛ این یک نتیجهٔ فیزیکی طبیعی است و ربطی به «توانمندی تو» ندارد. خوشبختانه این عضلات قابل ارزیابی و تمرین‌پذیرند.","steps":["نشانه‌های رایج را بشناس: نشت ادرار هنگام سرفه یا خندیدن، سنگینی یا فشار در پایین‌شکم، احساس بیرون‌زدگی.","این نشانه‌ها رایج‌اند اما «تقدیر همیشگی» نیستند؛ قابل بررسی و درمان‌اند.","قبل از شروع هر برنامهٔ تمرینی، به‌خصوص اگر درد داری، یک ارزیابی حرفه‌ای بگیر.","یبوست و بلند کردن اشیای سنگین را مدیریت کن؛ این‌ها فشار به کف لگن را کم می‌کنند."],"avoid":["به همه یک تمرین واحد (مثل کگل) توصیه نمی‌شود؛ تمرین باید با ارزیابی فردی تعیین شود.","اگر درد لگن داری، تمرین‌های انقباضیِ تکراری را بدون مشورت شروع نکن.","نشانه‌ها را «بعد از زایمان همه این‌طورند» فرض نکن؛ درمان وجود دارد."],"seekHelp":["نشت ادرار مداوم، سنگینی لگن یا بیرون‌زدگی احساس‌شده؛ ارزیابی توسط پزشک یا فیزیوتراپیست کف لگن لازم است.","درد هنگام نشستن، رابطه یا حرکت، نیاز به بررسی تخصصی دارد.","بی‌اختیاری مدفوع یا گاز نیز قابل درمان است؛ خجالت را کنار بگذار و گزارشش بده."],"source":"ACOG 2018 · NHS Pelvic Floor","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"pel-leak","section":"pelvic","title":"نشت ادرار","experience":"چند قطره ادرار هنگام سرفه، عطسه، خنده یا بلند کردن نوزاد — بسیار رایج است و بسیاری از مادرها آن را تجربه می‌کنند. برای بعضی در هفته‌های اول خودش کم می‌شود و برای بعضی ادامه پیدا می‌کند.","why":"کشش عضلات و اعصاب کف لگن در بارداری و زایمان، کنترل مثانه را موقتاً کم می‌کند. ادامه یا شدت آن می‌تواند نشانهٔ نیاز به تمرین‌های هدفمند یا درمان باشد.","steps":["اگر تمرین کف لگن به تو داده شده، قبل از سرفه یا عطسه آن را فعال کن.","یبوست را درمان کن؛ فشار مزمن به کف لگن آسیب می‌زند.","برای موقعیت‌های پرخطر شناخته‌شده برنامه داشته باش: دستشویی قبل از خروج، پد اضافه در کیف.","اگر علامت ادامه پیدا کرد، فیزیوتراپی کف لگن را جدی بگیر؛ شواهد آن قوی است.","ورزش‌های پرشی و سنگین را موقتاً به بعد موکول کن."],"avoid":["کاهش آب برای «کم شدن ادرار» کار اشتباهی است.","نشت را فقط با پد مدیریت نکن و ردش کن؛ علت قابل درمان است.","تمرین‌های اینترنتی عمومی را بی‌ارزیابی اجرا نکن."],"seekHelp":["اگر پس از چند هفته نشت ادامه دارد یا بدتر می‌شود، ارزیابی حرفه‌ای لازم است.","سوزش ادرار، درد یا خون در ادرار بررسی فوری می‌خواهد.","همزمانی نشت با سنگینی لگن را حتماً گزارش بده."],"source":"NHS Urinary Incontinence · ACOG 2018","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"pel-pressure","section":"pelvic","title":"سنگینی و فشار لگن","experience":"حس سنگینی، فشار یا «چیزی که پایین می‌آید» در واژن، مخصوصاً آخر روز یا بعد از ایستادن طولانی. گاهی همراه حس بیرون‌زدگی یا ناراحتی در پایین‌کمر است.","why":"این حس می‌تواند نتیجهٔ کشیدگی بافت‌های حمایت‌کننده باشد؛ در مواردی هم نشانهٔ افتادگی خفیف است. تشخیص فقط با معاینه ممکن است — نه با حدس و جستجوی اینترنتی.","steps":["ایستادن و بلند کردن طولانی را بشکن؛ بین کارها دراز بکش تا فشار کم شود.","یبوست را جدی بگیر؛ فشار هر بار اجابت مزاج عامل تشدیدکننده است.","هنگام بلند کردن نوزاد، از پاها کمک بگیر و نفس حبس نکن.","وقت ویزیت پس از زایمان، این علامت را حتماً مطرح کن تا معاینه شود.","اگر فیزیوتراپی تجویز شد، برنامه‌اش را در «ثبت تمرین‌ها» همین بخش پیگیری کن."],"avoid":["تمرین‌های شدید شکم یا بلند کردن سنگین را در این حالت ادامه نده.","فشار را با «شاید خیال است» کوچک نکن؛ گزارشش کن.","دستگاه‌های اینترنتی برای «جای‌گذاری رحم» نخر."],"seekHelp":["برجستگی محسوس در واژن یا فشارِ بدترشونده؛ معاینهٔ پزشکی لازم است.","درد جدید، خونریزی یا مشکل ادرار/مدفوع همراه فشار، بررسی فوری می‌خواهد.","افتادگی حتی در موارد خفیف راه‌های مدیریتی دارد؛ زودتر پرسیدن بهتر است."],"source":"ACOG 2018 · NHS Pelvic Organ Prolapse","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"pel-activity","section":"pelvic","title":"بازگشت تدریجی به فعالیت بدنی","experience":"بدن آمادهٔ حرکت است اما نه آمادهٔ مسابقه؛ قدم‌های کوتاه، کشش‌های ملایم و حس بهتر شدن تدریجی، تصویر واقعی این دوره است. ممکن است با فعالیت بیشتر، خونریزی موقتاً قرمزتر شود — این سیگنال مهمی است.","why":"عضلات شکمی و کف لگن و مفاصل بدن هنوز در حال بازگشت‌اند؛ شروع تدریجی ریسک آسیب و خونریزی را کم می‌کند و به بهبودی واقعی سرعت می‌دهد.","steps":["از پیاده‌روی‌های کوتاه شروع کن و هر چند روز کمی زیادش کن.","کشش‌های ملایم گردن، شانه و کمر برای بدنِ «بغل‌دارِ دائمی نوزاد» عالی است.","اگر خونریزی قرمز و زیاد شد، به یک سطح پایین‌تر برگرد و استراحت بده.","تنفس آرام و فعال کردن ملایم عضلات عمقی شکم (با راهنمای حرفه‌ای) نقطهٔ شروع خوبی است.","بعد از ویزیت جامع، برای برنامهٔ ورزشی جدی‌تر با پزشک حرف بزن."],"avoid":["ورزش‌های شدید شکم، پرش‌ها و وزنه‌های سنگین را در هفته‌های اول شروع نکن.","برای «سوزاندن شکم» برنامه‌های اینترنتی را دنبال نکن.","درد را «علامت اثر کردن» تفسیر نکن؛ درد نشانهٔ اصلاح برنامه است."],"seekHelp":["خونریزی شدید بعد از فعالیت، درد جدید یا ضعف غیرعادی؛ پزشک را ببین.","نشت ادرار با ورزش؛ فیزیوتراپیست کف لگن بهترین مرجع است.","اگر حس نگرانی یا افت روحی هنگام ورزش داری، ملایم‌تر ادامه بده و از حمایت بخواه."],"source":"WHO 2022 Physical Activity · ACOG 2018","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"pel-pt","section":"pelvic","title":"فیزیوتراپی کف لگن — ارزیابی فردی","experience":"شاید فکر کنی فیزیوتراپی فقط برای کمر است؛ اما فیزیوتراپیست کف لگن متخصص ارزیابی و تمرین‌دهی همین عضلات است. جلسه معمولاً شامل گفتگو، معاینه و یک برنامهٔ شخصی است.","why":"تمرین‌های کف لگن فقط وقتی اثر دارند که «درست و متناسب» انجام شوند؛ تشخیص ضعف، کشیدگی یا درد و طراحی برنامهٔ مناسب، کار حرفه‌ای است.","steps":["اگر نشت ادرار، سنگینی، درد لگن یا درد رابطه داری، از پزشکت دربارهٔ ارجاع به فیزیوتراپی کف لگن بپرس.","قبل از جلسه، فهرست علائم و روزهای ثبت‌شده در اپ را برایش آماده کن.","برنامهٔ داده‌شده را در «ثبت تمرین‌ها» اضافه کن تا منظم بماند.","اگر تمرینی درد ایجاد کرد، حتماً به متخصص بگو تا اصلاح شود.","بهبودی تدریجی است؛ هفته‌ها زمان می‌برد و این طبیعی است."],"avoid":["تمرین‌های عمومی اینترنتی را جای برنامهٔ اختصاصی نگذار.","با درد لگن، تمرین‌های انقباضیِ مکرر را خودسرانه شروع نکن.","نتایج را با دیگران مقایسه نکن؛ نقطهٔ شروع هرکس متفاوت است."],"seekHelp":["هر علائمی که مانع کارهای روزانه یا رابطه شده است، ارزش ارزیابی دارد.","اگر دسترسی به فیزیوتراپیست کف لگن نداری، با پزشک یا ماما دربارهٔ برنامهٔ ایمن و مناسب خودت مشورت کن.","تشدید علائم در مسیر بهبود را گزارش بده."],"source":"ACOG 2018 · NHS Pelvic Floor Physiotherapy","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"int-desire","section":"intimacy","title":"تغییرات میل جنسی پس از زایمان","experience":"برای بسیاری از مادرها، میل جنسی مدت‌ها کم است — هفته‌ها، گاهی ماه‌ها. خستگی، تغییر هورمون‌ها، درد، حس غریبگی با بدن و «تمام شدن» از مراقبت شبانه، همه در آن نقش دارند. این تجربه بسیار رایج است و به‌خودیِ خود یک «اختلال» نیست.","why":"شیردهی استروژن را پایین می‌آورد (شبیه دورهٔ پیش از یائسگی)، و ذهن و بدنی که در حالت مراقبت از نوزاد است، اولویتش امنیت و استراحت است، نه میل. میل ممکن است به‌جای «خودبه‌خودی»، پس از شروع نزدیکی و راحتی برسد (پاسخ‌دهنده شدن) — این هم الگوی طبیعی است.","steps":["میلِ کم را «قصور» فرض نکن؛ بدون ضرب‌الاجل بهتر می‌شود.","صمیمیت را از رابطهٔ جنسی جدا کن: بغل، بوسه، دست گرفتن، گفتگو کنار هم — این‌ها پیوند را نگه می‌دارند.","به شریک زندگی‌ات الگوی میلت را توضیح بده: «الان بیشتر وقتی گرم شدم میل می‌آید، نه از قبل».","خواب و تقسیم کار مراقبت، مستقیم‌ترین راهکار بلندمدت برای میل است.","اگر میل یا نگرانی‌ای دارد حالت روزانه‌ات را تحت‌تأثیر گذاشته، با متخصص صحبت کن."],"avoid":["کاهش میل به‌تنهایی، تشخیص بیماری نیست و برچسب «اختلال» نمی‌گیرد.","میل خودت را با گذشته یا با دیگران مقایسه نکن.","برای «برگشت میل» به‌خاطر خواستهٔ دیگری، خودت را مجبور نکن."],"seekHelp":["اگر ناراحتی از تغییر میل مدت‌ها ادامه دارد و روحیاتت را تحت فشار گذاشته، گفتگو با متخصص سلامت جنسی/روان مفید است.","درد هنگام رابطه را «فقط میل کم» تفسیر نکن؛ نیازمند بررسی است.","تغییرات شدید خلقی همراه میل را در ویزیت پس از زایمان مطرح کن."],"source":"NHS Sex After Birth · ACOG 2018","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"int-comfort","section":"intimacy","title":"خشکی، ناراحتی و راحتی بدن","experience":"خشکی واژن، حساس شدن ناحیه، درد هنگام ورود یا ترس از درد — به‌خصوص در شیردهی — رایج است. بدن در حال تغییر است و «همان‌طور که قبل بود» فرض درستی نیست.","why":"افت استروژن در شیردهی، بافت واژن را خشک‌تر و ظریف‌تر می‌کند؛ بخیه‌ها و تنش عضلانیِ کف لگن هم می‌توانند درد بسازند. همهٔ این‌ها قابل مدیریت‌اند.","steps":["لوبریکانت پایه‌آبی، راه‌حل ساده و بی‌خطر برای خشکی است؛ در دسترس نگه‌داشتنش فشار را کم می‌کند.","زمان را طولانی‌تر کن: نزدیکی بدون ورود، آرام‌سازی، و ورودِ خیلی تدریجی فقط وقتی بدن آماده است.","پوزیشن‌های راحت‌تر (مثلاً کنترل بیشتر دست خودت) را انتخاب کن.","قبل از شروع، دماغ و بدن را با تمرین آرام‌سازی کوتاه رها کن؛ تنش، درد را بیشتر می‌کند.","درد را جدی بگیر: درد اطلاعات می‌دهد، نه امتحان تحمل."],"avoid":["برای رضایت شریک زندگی، درد را تحمل نکن؛ این هرگز یک انتخاب سالم نیست.","تمرین تنفس را «درمان درد جنسی» ندان؛ درد مداوم نیاز به بررسی دارد.","لوبریکانت‌های حاوی مواد محرک/عطری را نخر.","به «روزی که باید رابطه برقرار شود» باور نکن؛ چنین روزی وجود ندارد."],"seekHelp":["درد مداوم یا شدید هنگام رابطه، باید توسط پزشک/فیزیوتراپیست کف لگن بررسی شود؛ درمان دارد.","خونریزی یا ترشح غیرعادی بعد از رابطه را گزارش بده.","اگر بخیه هنوز حساس است و درد ادامه دارد، معاینه ساده‌ای اوضاع را روشن می‌کند."],"source":"NHS Pain During Sex · ACOG 2018","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"int-communication","section":"intimacy","title":"گفتگو با همسر و حقِ «نه» گفتن","experience":"ممکن است یکی از شما آماده‌تر باشد؛ این ناهماهنگی رایج است و نشانهٔ ضعف رابطه نیست. گفتنِ «الان نه» می‌تواند سخت باشد، به‌خصوص وقتی احساس بدهکاری می‌کنی.","why":"پس از زایمان، نیازهای جسمی و روحی تو واقعی و موجه‌اند. رضایت، هر بار و در هر مرحله، حق توست؛ همسرِ محترم این را می‌فهمد و همراهی می‌کند.","steps":["زمانی آرام و بیرون از لحظهٔ نزدیکی، حرف بزن: «الان چه چیزی برایم راحت است، چه چیزی نه».","جایگزین‌های صمیمانه پیشنهاد بده: بغل شدن، ماساژ کوتاه، خوابیدن کنار هم.","از جمله‌های روشن استفاده کن: «هنوز آماده نیستم، اما نزدیکی بدون رابطه برایم خوب است».","برای گفتگوهای این‌چنینی از بخش «اشتراک‌گذاری با همسر» اپ می‌توانی استفاده کنی.","قاعده را برای هم تعریف کنید: هر کس هر لحظه می‌تواند بگوید «نه» و پاسخ، احترام است."],"avoid":["فشار مستقیم یا غیرمستقیم (گرفتگی، قهر، شرمنده کردن) هرگز ابزار تعیین رضایت نیست.","درد را با «شاید خودش بهتر شود» قبول نکن؛ اگر همسرت پافشاری می‌کند، این مسئله رابطه است و حمایت می‌خواهد.","میل همسرت را پیش‌بینی نکن؛ از خودش بپرس."],"seekHelp":["اگر گفتگوها به بن‌بست یا فشار می‌رسد، مشاورهٔ زوج‌درمانی می‌تواند کمک‌کننده باشد.","هر شکل از اجبار یا بی‌احترامی به «نه» تو، جدی گرفته شود و از حمایت اطراف استفاده کن.","برای بازسازی صمیمیت، راهنمای گام‌به‌گام «مسیر صمیمیت من» در همین بخش است."],"source":"ACOG 2018 · NHS Relationship After Birth","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"int-contraception","section":"intimacy","title":"پیشگیری از بارداری پس از زایمان","experience":"خیلی‌ها فکر می‌کنند تا پریود برنگشته باردار نمی‌شوند؛ این تصور درست نیست. تخمک‌گذاری می‌تواند قبل از اولین پریود رخ دهد، حتی وقتی شیر می‌دهی.","why":"بازگشت تخمک‌گذاری به عوامل فردی (میزان و الگوی شیردهی و…) بستگی دارد و قابل پیش‌بینی مطمئن نیست؛ شیردهی به‌تنهایی روش مطمئن پیشگیری نیست (مگر با معیارهای مشخص و موقت تحت نظر متخصص).","steps":["قبل از رابطهٔ محافظت‌نشده، دربارهٔ روش پیشگیری با پزشک یا ماما مشورت کن.","گزینه‌های سازگار با شیردهی وجود دارد؛ انتخاب را با ارزیابی فردی انجام بده.","به یاد داشته باش کاندوم هم به همسرت محافظت می‌کند هم جلوی عفونت را می‌گیرد.","اگر بین ۲۱ روز تا ۶ ماه پس از زایمان بارداری جدیدی نمی‌خواهی، این موضوع را در ویزیت مطرح کن.","فاصله‌گذاری بارداری برای بهبودی بدن تو هم مفید است؛ تصمیمش مال شماست اما اطلاعات را کامل بگیر."],"avoid":["به «شیردهی = ضدبارداری» به‌تنهایی اتکا نکن.","قرص‌های ترکیبی را بدون مشورت پزشک در دورهٔ شیردهی شروع نکن.","پیشگیری را به «وقتی پریود برگشت» موکول نکن."],"seekHelp":["برای انتخاب روش، با پزشک/ماما مشورت کن؛ روش‌های متعدد سازگار با شیردهی موجودند.","اگر نگران بارداری ناخواسته شدی (مثلاً شکست روش)، مشورت سریع پزشکی گزینه‌ها را توضیح می‌دهد.","خونریزی یا نشانه‌های غیرعادی همراه شروع روش پیشگیری را گزارش بده."],"source":"NHS Sex & Contraception After Birth · WHO 2022","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"int-readiness","section":"intimacy","title":"آمادگی هیجانی و رابطه با بدن","experience":"آمادگی برای صمیمیت فقط جسمی نیست؛ احساس امنیت، استراحت کافی، راضی بودن از آینه و آرامش ذهنی همه در آن نقش دارند. شاید از بدنی که «میزبان بارداری بوده» غریبه باشی.","why":"بدن تو یک گذر بزرگ را طی کرده است؛ تصویر بدن و اعتمادبه‌نفس در این دوره آسیب‌پذیرند. صمیمیت وقتی لذت‌بخش می‌شود که سرعت و مرزهایش را تو تعیین کنی.","steps":["اول «راحتی با بدن» را تمرین کن: حمام آرام، لباس راحت، لمس بدون هدف (ماساژ دست، بغل).","برای خودت مشخص کن چه چیزی «برای شروع» لازم است: خواب، تمیز بودن اتاق، بسته بودن در… این‌ها را با همسرت در میان بگذار.","از «مسیر صمیمیت من» در همین بخش استفاده کن؛ گام‌ها بدون فشار طراحی شده‌اند.","لحظه‌های صمیمانهٔ موفق را (هر اندازه کوچک) به دفتر افتخارها اضافه کن.","به بدنت بگو ممنون؛ این حرف ساده، رابطهٔ تو را با بدنت عوض می‌کند."],"avoid":["صمیمیت را «تقاضای همسر» ندان؛ نیاز مشترک هر دو نفر است.","پیشرفت رابطه‌ات را با داستان‌های دیگران بسنج.","اگر هنوز احساس امنیت نمی‌کنی، عجله نکن؛ این تأخیر سلامت‌مند است."],"seekHelp":["اگر اعتمادبه‌نفس بدنی به اندازهٔ کافی پایین آمده که روحیاتت را تحت فشار گذاشته، پشتیبانی روانی کمک می‌کند.","درد یا ترس مداوم از نزدیکی، با ارزیابی تخصصی قابل بررسی است.","اگر رابطه‌ات محیط امنی ندارد، از منابع حمایتی استفاده کن."],"source":"ACOG 2018 · NHS Sex After Birth","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"sup-visits","section":"support","title":"ویزیت‌های پس از زایمان","experience":"در این دوره، بدن و روح تو به پایش حرفه‌ای نیاز دارد؛ ملاقات‌های بعد از زایمان فقط برای نوزاد نیستند — برای تو هستند. خیلی از مادرها به دلیل درگیری با نوزاد، ویزیت خودشان را فراموش می‌کنند.","why":"توصیه‌های معتبر جهانی می‌گویند مادر و نوزاد در هفته‌های اول باید دیده شوند؛ فشار خون، خونریزی، بهبودی زخم، شیردهی و حال روحی، همه در این ویزیت‌ها بررسی می‌شوند.","steps":["یک تماس یا ویزیت در سه هفتهٔ اول با مراقب سلامتت (پزشک/ماما) داشته باش.","یک «ویزیت جامع پس از زایمان» تا حدود پایان هفتهٔ ۱۲ بگذار و علائمت را با آن مرور کن.","در هر ویزیت، حال روحی، شیردهی، خونریزی و دردها را صادقانه گزارش کن.","روی «یادآورهای ویزیت» در همین بخش بزن تا ببینی چه چیزی سر راه است.","اگر بین ویزیت‌ها نگرانی جدی داشتی، منتظر ویزیت نمان؛ تماس بگیر."],"avoid":["ویزیت خودت را به خاطر نوزاد لغو نکن.","علائم را برای «وقتی که فرصت شد» نگه ندار؛ عده‌ای از علائم جدی در همین دوره رخ می‌دهند.","فقط نشانه‌های جسمی را گزارش نکن؛ حال روحی هم بخش استاندارد ویزیت است."],"seekHelp":["تب، خونریزی زیاد، سردرد شدید، درد قفسهٔ سینه، تنگی نفس، تورم ساق پا و علائم مشابه را فوری بررسی کن (بخش علائم هشدار).","اگر مراقب سلامت در دسترس نیست، نزدیک‌ترین مرکز درمانی را پیدا کن.","همراه داشتن یک نفر در ویزیت‌های اول، کمک‌کننده است."],"source":"ACOG Optimizing Postpartum Care 2018 · WHO 2022","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"sup-questions","section":"support","title":"آماده‌سازی سؤال برای پزشک","experience":"سرِ ویزیت، ذهن پر است و سؤال‌های مهم یادت می‌رود؛ یا حجب می‌شوی سؤال «کوچک» بپرسی. نوشتن سؤال‌ها از قبل، این را ساده می‌کند.","why":"ویزیت پس از زایمان فرصت محدودی دارد؛ سؤال‌های نوشته‌شده باعث می‌شوند نگرانی‌های واقعی تو مطرح شوند، نه فقط موارد چک‌لیست.","steps":["هر وقت سؤالی به ذهنت رسید، در «سؤال‌های من برای پزشک» همین بخش بنویسش.","قبل از ویزیت، فهرست را مرور کن و مهم‌ترین‌ها را اول بگو.","از «خلاصهٔ وضعیت من» (چک‌این‌ها و علائم روزها) چاپ یا اسکرین‌شات بگیر و ببر.","جواب‌ها را همان‌جا یادداشت کن؛ یا اجازه بده همراهت بنویسد.","پرسیدن هر سؤالی که نگرانت کرده، درست است — «سؤال کوچک» وجود ندارد."],"avoid":["سؤال‌های جنسی، روحی یا ادراری را از شرم حذف نکن؛ این‌ها بخش عادی کار پزشکان‌اند.","فهرست را با «بعداً یادم می‌آید» ساده نگیر.","قبل از فهمیدن جواب، ویزیت را ترک نکن."],"seekHelp":["اگر پاسخی برایت مبهم بود، بخواه ساده‌تر توضیح بدهند.","اگر احساس کردی نگرانی‌ات جدی گرفته نشد، نظر دوم حق توست.","برای علائم هشدار، منتظر ویزیت نمان؛ فوری تماس بگیر."],"source":"ACOG 2018 · NHS Postnatal Check","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"sup-family","section":"support","title":"کمک گرفتن از اطرافیان — چک‌لیست عملی","experience":"«کمکم کنید» کلی است؛ «این هفته دوشنبه‌ها خرید با شما» عملی. وقتی فهرست مشخص بدهی، اطرافیان راحت‌تر و واقعی‌تر کمک می‌کنند.","why":"اطرافیان اغلب می‌خواهند کمک کنند اما نمی‌دانند از کجا. تقسیم مشخص کارها، فشار ذهنی «درخواست» را هم کم می‌کند.","steps":["از چک‌لیست کمک در همین بخش، موارد لازم را علامت بزن.","خلاصهٔ درخواست‌ها را کپی کن و برای خانواده بفرست.","برای هر کس یکی دو کار مشخص تعیین کن؛ همه‌چیز برای همه، هیچ‌چیز برای هیچ‌کس می‌شود.","راهنمای «چگونه به مادر کمک کنیم» را هم بفرست؛ مخصوصاً جملهٔ «لازم نیست راه‌حل بدهی».","بعد از هر کمک، تشکر کوتاه؛ بعد ادامهٔ برنامه."],"avoid":["همه‌چیز را خودت نگه ندار؛ «بهتر بلدم» تو را فرسوده می‌کند.","کمک‌ها را کنترل نکن؛ روشِ متفاوتِ شیشه‌شستن هم شستن است.","درخواست کمک را «مصیبت» نبین؛ مهارت زندگی مشترک است."],"seekHelp":["اگر کسی کمک واقعی نمی‌کند و فقط نصیحت دارد، انتظارت را مستقیم‌تر مطرح کن.","اگر در خانه به تو فشار یا بی‌احترامی می‌شود، این موضوع حمایتی جدی است.","مراکز بهداشت و مشاورهٔ خانواده می‌توانند در تعارض‌های خانوادگی راهنمایی بدهند."],"source":"WHO 2022 (Partner/Family Support) · ACOG 2018","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."},{"id":"sup-emotional","section":"support","title":"حمایت عاطفی: چه چیزی کمک می‌کند","experience":"مادرهای این دوره بیشتر از «راه‌حل»، به شنیده شدن نیاز دارند. اگر این بخش را برای اطرافیانت باز کنی یا بفرستی، گفتگوها راحت‌تر می‌شود.","why":"حمایت غلط (نصیحت، مقایسه، کوچک‌سازی: «همه مادرها این‌طوری‌اند») حس تنهایی را بیشتر می‌کند. حمایت درست، ساده است: گوش دادن، حضور و کار عملی.","steps":["به مادر بگو: «اینجا هستم، هر چیزی که حس می‌کنی درسته.»","پرسش‌های باز: «امروز چه جور گذشت؟» به‌جای «خوبی؟».","یک کار عملی هر روز بدون سؤال: غذا، شیشه، ماشین لباسشویی.","نگاه نوزاد را به مادر سپردن هم کمک است: «برو دوش بگیر، من هستم».","نشانه‌های هشدار سلامت روان را جدی بگیر و به مادر کمک کن مسیر حرفه‌ای را شروع کند."],"avoid":["نگوی «باید قوی باشی» یا «مادرها همه این را تحمل می‌کنند».","مقایسه با مادرهای دیگر نکن.","حرف‌های او را برای دیگران تعریف نکن؛ رازداری پایهٔ اعتماد است."],"seekHelp":["اگر مادر حرف‌های تکرارشونده از ناامیدی می‌زند، او را به ارزیابی حرفه‌ای برسان.","برای هر نشانهٔ اورژانسی (فکر آسیب، گیجی شدید) همین حالا خدمات درمانی را درگیر کن.","خودِ حمایتگر هم به استراحت نیاز دارد؛ تقسیم کن."],"source":"CDC Maternal Depression · WHO 2022","review":"پیش از انتشار عمومی نیازمند بازبینی متخصص سلامت مادر است."}],"breastTopics":[{"id":"bt-nipple","label":"درد نوک سینه هنگام شیردهی","situation":"درد در شروع یا طول شیردهی، سوزش، ترک یا حتی خون. این یکی از رایج‌ترین دشواری‌های هفته‌های اول است و تقریباً همیشه علت قابل‌رفع دارد.","steps":["جای گرفتن نوزاد را دوباره چک کن (دهان باز بزرگ، هالهٔ بیشتر پایین، چانه چسبیده).","بعد از شیردهی چند قطره شیر روی نوک بمال و بگذار در هوا خشک شود.","کرم محافظ مناسب شیردهی یا پد هیدروژل از داروخانه کمک می‌کند.","اگر درد در یک شیردهی بیش از حد شد، اول جدا کن و از سینهٔ کم‌دردتر شروع کن."],"avoid":["درد را تحمل نکن؛ ادامهٔ درد یعنی مشکل حل نشده است.","صابون و الکل روی نوک نزن.","شیردهی را قطع نکن؛ راه‌های کمکی هست."],"seekHelp":"دردی که با اصلاح جای گرفتن چند روز بهتر نشد، یا ترک/خون‌ریزی/سفیدی دردناک دارد، باید توسط ماما یا مشاور شیردهی حضوری بررسی شود.","cardId":"fee-nipple"},{"id":"bt-engorge","label":"سینه‌های سفت، پُر و درناک","situation":"سینه‌ها سخت، گرم و حساس‌اند؛ نوک سینه صاف شده و گرفتن سخت است. معمولاً روزهای ۲ تا ۵ شروع می‌شود و با تنظیم شیر کم می‌شود.","steps":["شیردهی مکرر و مؤثر؛ اولین و مؤثرترین راهکار.","قبل از شیردهی، مقدار کمی شیر با دست بگیر تا هاله نرم شود.","بین وعده‌ها کمپرس سرد کوتاه؛ بعد از وعده هم می‌تواند آرامش دهد.","سوتین راحت بدون فشار."],"avoid":["پمپاژ زیاد و طولانی «برای خالی شدن کامل» تولید را بیشتر می‌کند.","کمپرس گرم طولانی بدون تخلیه، تورم را بدتر می‌کند.","سینه‌های سفت را ساعتی‌ها رها نکن."],"seekHelp":"قرمزی گوه‌مانند، درد شدید موضعی، تب و لرز و بدن‌درد نشانهٔ التهاب پستان است؛ سریع با پزشک تماس بگیر.","cardId":"fee-engorgement"},{"id":"bt-supply","label":"نگرانی: آیا شیرم کافی است؟","situation":"حس «شاید کافی نباشد» بسیار رایج است؛ اما حس، سنجه نیست. سنجه‌های واقعی: پوشک‌های خیس و مدفوع مناسب سن، وزن‌گیری منظم در کنترل نوزاد و بلع منظم هنگام شیر خوردن.","steps":["به‌جای حدس، شمارش پوشک‌ها را چند روز یادداشت کن.","شیردهی را به اقتضای نوزاد افزایش بده؛ تولید با تقاضا تنظیم می‌شود.","تماس پوست‌به‌پوست و استراحت و آب کافی را جدی بگیر.","وزن نوزاد را در نوبت‌های توصیه‌شدهٔ پزشک چک کن."],"avoid":["بدون مشورت پزشک، شیر خشک اضافه نکن.","خودت را ملامت نکن؛ نگرانی به تولید شیر «تضمینِ» آسیبی نمی‌زند اما احساس گناه را بیشتر می‌کند.","مقدار پمپ را معیار تولید ندان."],"seekHelp":"پوشک خیس کم، بی‌حالی یا وزن نگرفتن نوزاد = تماس فوری با پزشک کودکان. برای اطمینان خاطر هم مشورت با مشاور شیردهی مفید است.","cardId":"fee-supply"},{"id":"bt-latch","label":"نوزاد سینه را نمی‌گیرد","situation":"نوزاد سرش را برمی‌گرداند، گریه می‌کند یا فقط نوک را می‌گیرد و رها می‌کند. این در هفته‌های اول بسیار رایج است و اغلب به تمرین و آرامش نیاز دارد، نه «ضعف نوزاد».","steps":["اول خودت را آرام کن؛ تنفس آرام چند دقیقه، بعد تلاش.","پوست‌به‌پوست در آرامش، بدون فشار، دعوت‌کننده‌ترین حالت برای گرفتن سینه است.","بدن نوزاد را کامل نزدیک کن؛ سرش نه عقب نه رو به جلو.","زمان گرسنگیِ ملایم (نشانه‌های اولیه: چرخش سر، دست به دهان) بهترین زمان تمرین است؛ گریهٔ شدید بدترین زمان."],"avoid":["سرِ نوزاد را به سینه فشار نده؛ مقاومت می‌کند.","هر شیردهی را جنگ نکن؛ استراحت و تلاش دوباره.","فوراً به شیشه پناه نبر؛ اگر لازم شد، با مشورت حرفه‌ای روش‌های میانی هست."],"seekHelp":"اگر چند وعده پیاپی نمی‌گیرد یا وزن/پوشک نگران‌کننده است، همان روز با ماما یا پزشک تماس بگیر؛ ارزیابی حضوری مسأله را حل می‌کند.","cardId":"fee-attachment"},{"id":"bt-night","label":"شب‌های سخت و خستگی","situation":"بیداری‌های شبانه بی‌پایان‌اند و روز هم نمی‌توانی جبران کنی. خستگی، هم شیردهی را سخت می‌کند هم حال روحی را پایین می‌آورد.","steps":["برای شب، محیط را از قبل آماده کن: آب، پد، نور کم، هرچی لازم کنارِ جا.","یک نوبت بیداری شب را با همسر/اطراف معاوضه کن (شیر گرفته‌شده یا شیر خشک با مشورت).","روز، یک چرتِ محافظت‌شده بگیر؛ حتی ۴۵ دقیقه.","کارهای خانهٔ شب را حذف کن."],"avoid":["برای «بیدار ماندن» چای و قهوه پیاپی ننوش.","تا «تمام شود» بیدار نمان.","خوابیدن نوزاد را معیار «مادر خوب» نگذار."],"seekHelp":"اگر خسته‌ای ولی اصلاً خوابت نمی‌برد یا خستگی به ناامیدی رسیده، این را با پزشک در میان بگذار؛ می‌تواند نشانهٔ مشکل سلامت روان باشد.","cardId":"dai-sleep"},{"id":"bt-mastitis","label":"قرمزی و درد موضعی سینه (نگرانی التهاب)","situation":"یک ناحیه از سینه قرمز، گرم و دردناک است؛ ممکن است تب و بدن‌درد هم داشته باشی. این وضعیت نیاز به تصمیم سریع دارد.","steps":["شیردهی را ادامه بده (از همان سینه هم بده)؛ تخلیه بخشی از درمان است.","کمپرس سرد/گرم کوتاه برای آرامش.","استراحت و مایعات."],"avoid":["سینهٔ دردناک را رها نکن.","سفت کردن و ماساژ شدیدِ ناحیهٔ ملتهب فشار را بیشتر می‌کند.","«شاید خودش رد شود» را معیار نگیر."],"seekHelp":"تب بالاتر از ۳۸، بدن‌درد، یا قرمزیِ دردناکِ موضعی = تماس سریع با پزشک؛ ممکن است درمان دارویی لازم باشد که با شیردهی سازگار است.","cardId":"fee-engorgement"},{"id":"bt-mixed","label":"تردید دربارهٔ ترکیب شیر مادر و شیر خشک","situation":"شرایط اجازهٔ کامل شیردهی نمی‌دهد یا دلت می‌خواهد ترکیب کنی اما نگران قضاوت یا «از دست دادن شیر» هستی. ترکیبی، یک انتخاب مشروع و رایج است.","steps":["ترتیب وعده‌ها را با یک مشورت بچین (مثلاً شیر مادر بیشتر در شب) تا اگر هدفت حفظ شیر است، حفظ شود.","روش شیشهٔ پاسخگو (آهسته) برای شیر خشک کمک می‌کند نوزاد زیاده‌روی نکند.","تهیهٔ اصولی و ضدعفونی شیشه را رعایت کن."],"avoid":["احساس گناه را معیار تصمیم نکن؛ سلامت تو هم بخشی از سلامت نوزاد است.","مقدار شیر خشک را بدون مشورت تغییر نده.","به نصیحت‌های قطعی اطرافیان بدون منبع اعتماد نکن."],"seekHelp":"برای چیدن برنامهٔ ترکیبی و انتخاب نوع شیر خشک، پزشک نوزاد و مشاور شیردهی مرجع‌اند.","cardId":"fee-mixed"}],"intimacySteps":[{"id":"st-feelings","title":"شناخت احساس فعلی من","desc":"بدون قضاوت، از خودت بپرس: این روزها با بدنم، خستگی‌ام و صمیمیت چه حسی دارم؟ فقط مشاهده کن و اگر خواستی بنویس. هیچ جواب «درست» وجود ندارد."},{"id":"st-comfort","title":"چه چیزی به من آرامش می‌دهد؟","desc":"فهرست کن چه چیزهایی حالت را بهتر می‌کند: خواب کافی، دوش آب گرم، بغل شدن بدون انتظار، محیط خصوصی… این‌ها نقشهٔ راحتی توست."},{"id":"st-talk","title":"گفتگو با همسر، بدون فشار","desc":"خارج از لحظهٔ نزدیکی، راجع به احساسات و مرزهایت حرف بزن. از «اشتراک‌گذاری با همسر» می‌توانی برای شروع مکالمه استفاده کنی. حق «نه» گفتن هر دو نفر محفوظ است."},{"id":"st-affection","title":"نزدیکی بدون انتظار رابطهٔ جنسی","desc":"بغل، دست گرفتن، نشستن کنار هم — بدون اینکه این لحظه به جایی «برسد». همین حضور، پیوند را حفظ می‌کند."},{"id":"st-pace","title":"کاوش در سرعتی که برای من راحت است","desc":"هر وقت احساس امنیت و راحتی کردی، قدم بعدی را خودت تعیین کن: بیشتر لمس، لوبریکانت پایه‌آبی، پوزیشن‌های کنترل‌شده. هر وقت خواستی توقف کن؛ توقف، شکست نیست."},{"id":"st-when","title":"کِی علائم نیاز به بررسی دارد؟","desc":"درد مداوم یا شدید، خونریزی غیرعادی، خشکی که با لوبریکانت هم راحت نمی‌شود یا نگرانی‌های پایدار؛ این‌ها را با پزشک در میان بگذار. زمان از زایمان به‌تنهایی معیار آمادگی یا ایمنی نیست."}],"helpNeeds":[{"id":"listen","label":"فقط می‌خواهم کسی به حرفم گوش بدهد.","action":"یک نفر مشخص را انتخاب کن و دقیق بگو چه می‌خواهی: «الان نیاز دارم فقط گوش بدهی، راه‌حل لازم نیست.»","steps":["اگر گوش‌دهندهٔ مناسبی سراغ نداری، یک جملهٔ نوشتاری هم کار می‌کند: برای کسی که اعتماد داری بنویس.","در بخش «حال من» می‌توانی احساس‌هایت را بخوانی یا ثبت کنی.","اگر حس می‌کنی کسی نیست که امن گوش بدهد، این خودش دلیلی برای مشورت حرفه‌ای است — نه شکست تو."],"target":"section:mood"},{"id":"rest","label":"امروز به زمان بیشتری برای استراحت نیاز دارم.","action":"یک بازهٔ ۲۰ تا ۹۰ دقیقه‌ای برای امروز مشخص کن و از یک نفر بخواه در آن بازه نوزاد را داشته باشد.","steps":["قبل از استراحت، آب و یک چیز خوراکی کنارت بگذار.","گوشی را دور بگذار؛ استراحت واقعی بدون مقایسهٔ شبکه‌ها است.","یک کار از برنامهٔ امروز را رسماً لغو کن؛ لغو کردن هم تصمیم است."],"target":"section:dailylife"},{"id":"feeding","label":"برای شیردهی به کمک نیاز دارم.","action":"دشواری امروزت را در «الان در شیردهی چه چیزی برایت سخت شده؟» پیدا کن؛ راهنمای متمرکز همان‌جاست.","steps":["اگر مشکل تکرارشونده است، یک نوبت مشورت حضوری با ماما/مشاور شیردهی بگذار.","برای نگرانی وزن یا پوشک، مستقیم با پزشک نوزاد تماس بگیر.","انتخاب تغذیهٔ ترکیبی یا شیر خشک هم محترم است؛ بدون قضاوت راهنمایی می‌شوی."],"target":"section:feeding"},{"id":"household","label":"می‌خواهم در کارهای خانه تنها نباشم.","action":"از چک‌لیست کمک در بخش حمایت، سه کارِ لازم برای امروز/این هفته را علامت بزن و برای خانواده بفرست.","steps":["درخواست‌ها را مشخص کن: «خرید فردا»، «بشقاب‌ها امشب»، «نوزاد از ۹ تا ۱۰ شب».","یک نفر را مسئول هماهنگی خانواده کن تا تو زیر سؤال‌ها دفن نشوی.","اگر کسی هست که «پیشنهاد می‌دهد ولی نمی‌کند»، مستقیم یک کار مشخص به او بده."],"target":"section:support"},{"id":"feelings","label":"می‌خواهم دربارهٔ احساساتم صحبت کنم.","action":"در بخش «حال من» احساس امروزت را ببین؛ اگر خواستی یک افتخار کوچک یا یک احساس سخت را بنویس.","steps":["نوشتن، حتی برای خودت، پردازش احساس را آسان می‌کند.","اگر احساس‌ها سنگین و پایدار شده‌اند، مسیر «به کمک حرفه‌ای نیاز دارم» همین بخش منتظرت است.","گفتگو با همسر را می‌توانی با «اشتراک‌گذاری با همسر» شروع کنی."],"target":"section:mood"},{"id":"professional","label":"به کمک حرفه‌ای نیاز دارم.","action":"یک تماس همین امروز: پزشک خودت، ماما، مرکز بهداشت یا متخصص سلامت روان. جملهٔ شروع ساده است: «مدتی است حال روحی‌ام خوب نیست و می‌خواهم بررسی شود.»","steps":["از «سؤال‌های من برای پزشک» و «خلاصهٔ وضعیت من» در بخش حمایت برای آماده شدن استفاده کن.","اگر افکار آسیب به خود یا نوزاد داری، یا چیزهایی می‌بینی/می‌شنوی که دیگران نمی‌بینند: همین حالا از خدمات اورژانس درمانی کمک بگیر و یک بزرگسال مطمئن را باخبر کن؛ مراقبت نوزاد را به فرد امنی بسپار.","درخواست کمک حرفه‌ای، نشانهٔ قدرت و مسئولیت است."],"target":"clinical"}],"familyChecklist":[{"id":"cook","label":"پختن یک وعدهٔ غذا"},{"id":"grocery","label":"خرید هفتگی"},{"id":"baby-hold","label":"نگه‌داشتن نوزاد تا من استراحت/دوش بگیرم"},{"id":"night","label":"یک نوبت بیداری شب"},{"id":"chores","label":"ظرف‌شویی و مرتب کردن آشپزخانه"},{"id":"laundry","label":"شست‌وشو و اتوی لباس‌ها"},{"id":"visit","label":"همراهی در ویزیت پزشک"},{"id":"listen","label":"نیم‌ساعت گوش دادن، بدون نصیحت"},{"id":"older-kids","label":"سرگرم کردن فرزند بزرگ‌تر (در صورت وجود)"},{"id":"guests","label":"مدیریت مهمان‌ها و کم کردن فشار مهمانی"}],"pridePrompts":[{"id":"pp-self","text":"امروز با وجود خستگی، به یکی از نیازهای خودم هم توجه کردم."},{"id":"pp-ask","text":"وقتی به کمک نیاز داشتم، آن را بیان کردم."},{"id":"pp-pro","text":"برای مشکلی که داشتم، از یک فرد آگاه کمک گرفتم."},{"id":"pp-compare","text":"امروز خودم را با دیگران مقایسه نکردم."},{"id":"pp-hard","text":"امروز روز سختی بود و پذیرفتم که لازم نیست همه کارها را انجام دهم."},{"id":"pp-joy","text":"برای چند دقیقه، کاری را انجام دادم که حالم را بهتر کرد."}],"breathing":[{"id":"br-daily","title":"آرامش روزانه","minutes":2,"mode":"ring","intro":"جایی راحت بنشین یا دراز بکش. لازم نیست نفس عمیق یا خاصی بکشی. فقط اجازه بده نفست به‌آرامی وارد و خارج شود. اگر دوست داشتی، بازدمت را کمی طولانی‌تر کن. هر زمان که خواستی می‌توانی تمرین را متوقف کنی.","phases":[{"kind":"in","seconds":4,"text":"دم… به‌آرامی"},{"kind":"out","seconds":6,"text":"بازدم… کمی طولانی‌تر"}],"outro":"لازم نبود هیچ کاری را درست انجام بدهی؛ فقط چند دقیقه به خودت وقت دادی."},{"id":"br-tension","title":"رهایی از تنش","minutes":3,"mode":"cues","intro":"این تمرین، توجهِ آرام به بدن است: فک، شانه‌ها، دست‌ها و نفس. هر جا تنش حس کردی و رهایش برایت راحت بود، همان را رها کن. هیچ کاری اجباری نیست.","cues":[{"at":0,"text":"راحت بنشین یا دراز بکش؛ چشمانت را ببند اگر راحتی."},{"at":25,"text":"به فکت توجه کن… دندان‌ها روی هم نیستند؛ فک را رها کن."},{"at":55,"text":"شانه‌ها… آنها را از گوش‌ها پایین بده؛ نرم و بی‌فشار."},{"at":90,"text":"دست‌ها… انگشت‌ها باز شوند؛ وزن دست‌ها را به زمین بسپار."},{"at":120,"text":"به نفس توجه کن… بدون تغییر دادنش؛ فقط تماشا کن."},{"at":155,"text":"هر تنشی که رهایش برایت راحت است، اکنون رها کن…"}],"outro":"این تمرین ابزاری برای آرامش است؛ برای علائم پزشکی یا مراقبت روانی، جایگزین کمک تخصصی نیست."},{"id":"br-couple","title":"آرامش و ارتباط دونفره","minutes":3,"mode":"cues","couple":true,"intro":"یک تمرین اختیاری برای شما دو نفر: کنار هم بنشینید، نفس‌ها را بدون تلاش برای یکسان شدن تماشا کنید، چند لحظه سکوتِ راحت، و بعد هر کس یک چیز که از دیگری قدر می‌داند بگوید. هر کدام هر وقت خواستید، می‌توانید تمرین را تمام کنید.","cues":[{"at":0,"text":"کنار هم راحت بنشینید؛ می‌توانید دست‌ها را در هم بگیرید."},{"at":30,"text":"به نفس‌کشیدن هم توجه کنید؛ لازم نیست هماهنگ شوند."},{"at":70,"text":"چند لحظه سکوتِ راحت؛ فقط حضور."},{"at":110,"text":"هر کدام یک چیز که از دیگری قدر می‌دانید، بگویید."},{"at":160,"text":"هر وقت خواستید تمام کنید؛ پایان دادن هم بخشی از تمرین است."}],"outro":"لازم نیست این لحظه به رابطه جنسی ختم شود. همین که بدون انتظار یا فشار کنار هم باشید، می‌تواند راهی برای حفظ ارتباط و صمیمیت باشد."}],"urgentIntro":"این علامت‌ها نشانه‌های هشدار جدی پس از زایمان هستند و ربطی به «عادی بودن روزهای اول» ندارند. اگر هرکدام را داری، بدون معطلی با خدمات درمانی تماس بگیر.","urgentList":[{"id":"heavy_bleed","label":"خونریزی زیاد — خیس شدن پد در حدود یک ساعت یا لختهٔ بزرگ"},{"id":"fever","label":"تب ۳۸ درجه یا بیشتر، یا لرز"},{"id":"severe_headache","label":"سردرد شدید یا تازه که با استراحت بهتر نمی‌شود"},{"id":"vision_change","label":"تاری دید، جرقه یا تورم صورت و دست‌ها"},{"id":"chest_pain","label":"درد قفسه سینه"},{"id":"breathless","label":"تنگی نفس ناگهانی یا مشکل تنفس"},{"id":"calf_pain","label":"درد، تورم یا گرمی ساق پا (معمولاً یک طرف)"},{"id":"wound_sign","label":"قرمزی، تورم، چرک یا باز شدن محل بخیه/سزارین"},{"id":"foul_smell","label":"بوی بد ترشحات واژن"}],"urgentAction":"همین حالا با نزدیک‌ترین مرکز درمانی، اورژانس محل زندگی‌ات یا پزشکت تماس بگیر و بگو «به‌تازگی زایمان کرده‌ام و این علامت را دارم.» برای این علائم، منتظر ویزیت بعدی نمان.","crisisCopy":{"title":"این علامت، اورژانسی است","body":"افکار آسیب رساندن به خودت یا نوزادت، دیدن یا شنیدن چیزهایی که دیگران نمی‌بینند، یا گیجی شدید، نشانه‌های وضعیتی اورژانسی‌اند که درمان فوری دارند — این‌ها نشانهٔ «مادر بد بودن» نیستند و با تو کاری ندارند.","steps":["همین حالا با اورژانس پزشکی محل زندگی‌ات یا نزدیک‌ترین اورژانس بیمارستان تماس بگیر.","یک بزرگسال مطمئن را باخبر کن تا همراهت باشد.","مراقبت از نوزاد را موقتاً به یک فرد امن بسپار؛ این کار مسئولیت‌پذیری است، نه ترک.","اگر احساس خطر فوری داری، منتظر نمان؛ کمک بگیر."],"note":"این مسیر جایگزین پروتکل‌های تأییدشدهٔ بالینی نیست؛ در نسخهٔ عمومی، مسیر اورژانس طبق تنظیمات منطقه‌ای و تأیید متخصصان نمایش داده می‌شود."},"visits":[{"key":"v-first","label":"تماس یا ویزیت اول","when":"تا پایان هفتهٔ ۳","note":"بررسی خونریزی، بهبودی زخم، شیردهی و حال روحی (توصیهٔ ACOG)."},{"key":"v-full","label":"ویزیت جامع پس از زایمان","when":"حدود هفتهٔ ۶ تا ۱۲","note":"ارزیابی کامل جسمی و روحی، بحث پیشگیری از بارداری و بازگشت فعالیت."},{"key":"v-baby","label":"کنترل‌های منظم نوزاد","when":"طبق برنامهٔ پزشک کودکان","note":"وزن، تغذیه و واکسن‌ها — یادآور عمومی؛ برنامهٔ دقیق با پزشک نوزاد."}]};
const PP_SECTIONS = PP_DATA.sections;
const PP_MOODS = PP_DATA.moods;
const PP_ENERGIES = PP_DATA.energies;
const PP_SLEEPS = PP_DATA.sleeps;
const PP_SYMPTOMS = PP_DATA.symptoms;
const PP_CARDS = PP_DATA.cards;
const PP_BREAST_TOPICS = PP_DATA.breastTopics;
const PP_INTIMACY_STEPS = PP_DATA.intimacySteps;
const PP_HELP_NEEDS = PP_DATA.helpNeeds;
const PP_FAMILY_CHECKLIST = PP_DATA.familyChecklist;
const PP_PRIDE_PROMPTS = PP_DATA.pridePrompts;
const PP_BREATHING = PP_DATA.breathing;

const PP_STAGE_INSIGHTS = {
  early: [
    "در روزهای اول، خونریزی شبیه پریود شدید است و کم‌کم کم می‌شود؛ رنگ آن هم قهوه‌ای‌تر می‌شود.",
    "انقباض‌های رحم در روزهای اول رایج‌اند؛ هنگام شیردهی ممکن است بیشتر حس شوند — نشانهٔ کوچک شدن رحم است.",
    "خستگی و حساسیت هیجانی در روزهای اول، پاسخ بدن به یک تغییر بزرگ است؛ نه نشانهٔ ضعف."
  ],
  blues: [
    "نوسان خلقی و گریه‌های ناگهانی در دو هفتهٔ اول بسیار رایج است؛ اگر بعد از حدود دو هفته بهتر نشد، گفتگو با متخصص کمک‌کننده است.",
    "با شیر رسیدن (روزهای ۲ تا ۵)، سینه‌ها پُر و حساس می‌شوند؛ شیردهی مکرر و کمپرس سرد کمک می‌کند.",
    "خوابِ تکه‌تکه، خستگی را بیشتر از چیزی که فکرش را می‌کنی سنگین می‌کند؛ بازهٔ استراحتِ محافظت‌شده روزانه ارزشمند است."
  ],
  rebuilding: [
    "از هفتهٔ سوم به بعد، بدن کم‌کم قدرت باز می‌گرداند؛ پیاده‌روی کوتاه روزانه شروع خوبی است.",
    "ترشحات در این هفته‌ها معمولاً خیلی کم شده‌اند؛ اگر ناگهان قرمز و زیاد شد، فعالیت را کم کن و اگر ادامه یافت بررسی کن.",
    "حس سنگینی لگن یا نشت ادرار در این دوره رایج است اما «تقدیر همیشگی» نیست؛ ارزیابی فیزیوتراپی کف لگن وجود دارد."
  ],
  checkup: [
    "ویزیت جامع پس از زایمان تا حدود هفتهٔ ۱۲ توصیه می‌شود؛ فرصت خوبی برای گفتن همهٔ نگرانی‌هاست.",
    "بازگشت به فعالیت، کار و روابط را فازبندی کن؛ لازم نیست همه‌چیز یک‌جا برگردد.",
    "پیشگیری از بارداری را قبل از نیاز با پزشک مطرح کن؛ تخمک‌گذاری می‌تواند قبل از اولین پریود رخ دهد."
  ],
  beyond: [
    "مسیر بهبودی خط مستقیم نیست؛ روزهای سخت بعد از هفته‌های خوب هم طبیعی‌اند.",
    "تغییرات بدن تا ماه‌ها ادامه دارند؛ ریزش موی پس از زایمان معمولاً حدود یک ساله به چرخهٔ عادی می‌رسد.",
    "حال روحی هم تا ماه‌ها می‌تواند نوسان داشته باشد؛ درخواست کمک در هر نقطه از مسیر، درست است."
  ]
};
const PP_MSG_ROUGH = [
  { id: "m-rough-1", text: "ممنون که درباره حالت گفتی. لازم نیست وانمود کنی که همه‌چیز خوب است. می‌توانیم از یک قدم کوچک شروع کنیم.", actions: [{ label: "یک تمرین آرامش کوتاه", target: "breathing" }, { label: "خواندن دربارهٔ حال من", target: "section:mood" }] },
  { id: "m-rough-2", text: "روز سخت، یعنی تو در مسیر سختی هستی، نه اینکه ضعیف باشی. همین که ادامه می‌دهی، کار بزرگی است.", actions: [{ label: "دفتر افتخارهای کوچک", target: "pride" }] },
  { id: "m-rough-3", text: "احساس‌هایت همه با هم می‌توانند باشند: عشق، خستگی، دلتنگی و امید. لازم نیست یکی را انتخاب کنی.", actions: [{ label: "الان به چه کمکی نیاز دارم؟", target: "help" }] }
];
const PP_MSG_LOW = [
  { id: "m-low-1", text: "امروز لازم نیست همه‌چیز را مدیریت کنی. استراحت و کمک خواستن هم بخشی از مراقبت از خودت و نوزادت است.", actions: [{ label: "درخواست کمک مشخص", target: "help" }] },
  { id: "m-low-2", text: "مادر بودن به معنی انجام دادن همه کارها به‌تنهایی نیست. کارهایی که انجام می‌دهی مهم‌اند، حتی اگر کسی همه آن‌ها را نبیند." }
];
const PP_MSG_ENERGY = [{ id: "m-energy-1", text: "انرژی امروزت واقعی است و باید محترم شمرده شود. فقط یک کارِ کوچک برای امروز لازم است — بقیه می‌توانند صبر کنند.", actions: [{ label: "چند دقیقه برای آرامش", target: "breathing" }] }];
const PP_MSG_BODY = [{ id: "m-body-1", text: "بدنت تغییرات بزرگی را پشت سر گذاشته است. لازم نیست خودت را با گذشته یا تصاویر دیگران مقایسه کنی. تو همین امروز هم ارزشمند هستی. اگر تغییری نگرانت کرده، می‌توانی درباره‌اش اطلاعات بگیری و برای بهتر شدنش کمک دریافت کنی.", actions: [{ label: "خواندن «تغییرات بدن و تصویر بدن»", target: "card:rec-body" }] }];
const PP_MSG_POS = [{ id: "m-pos-1", text: "خوشحالم که امروز لحظه‌ای برای خودت داشتی. اگر دوست داری، آن را در دفتر افتخارهای کوچک خودت ثبت کن تا بعداً بتوانی دوباره به یادش بیاوری.", actions: [{ label: "ثبت در دفتر افتخارها", target: "pride" }] }];
const PP_MSG_DEFAULT = [
  { id: "m-def-1", text: "در این مسیر، تو هم مهمی." },
  { id: "m-def-2", text: "به خودت افتخار کن که این مسیر را قدم‌به‌قدم طی می‌کنی. لازم نیست همیشه قوی باشی." },
  { id: "m-def-3", text: "تو حق داری استراحت کنی، کمک بخواهی، احساساتت را بیان کنی و برای بهبودی خودت زمان داشته باشی." },
  { id: "m-def-4", text: "هر روز لازم نیست چیزی را ثابت کنی؛ کافی است یک قدم کوچک برای بهتر شدن برداری." }
];

/* اولویت: روز سخت → ناراحت → انرژی تخلیه‌شده → ناراحتی بدنی → روز خوب → چرخش ملایم پیش‌فرض */

/* ============================================================
   راهنمای «همین حالا» — کارت‌های ۲ دقیقه‌ای با قالب ثابت
   چرا (یک جمله) → امروز چه کنم (۲ تا ۴ گام) → زمان → اگر نشد چه کنم
   سقف ۶۰ کلمه برای هر کارت؛ هر کارت یک نشانک پشتوانه دارد.
   منابع: راهنمای CSEP 2025 / خلاصهٔ WHO 2022 / توصیه‌های متداول.
   TODO-کارشناس: همهٔ کارت‌ها پیش از انتشار عمومی باید توسط ماما،
   پزشک یا فیزیوتراپیست کف لگن بازبینی شوند.
   ============================================================ */
const PP_GUIDE_CARDS = [
  {
    id: "g-walk", need: "حرکت", icon: "act", minutes: "۵–۱۰ دقیقه",
    title: "پیاده‌روی نرم",
    why: "حرکت ملایم به بهبودی و حال روحی کمک می‌کند.",
    steps: ["۵ تا ۱۰ دقیقه آهسته بیرون برو.", "اگر خونریزی یا درد بیشتر شد، امروز کمتر کن.", "هفته‌به‌هفته به ۱۲۰ دقیقه در هفته نزدیک شو."],
    fallback: "همان چند قدم داخل خانه هم حساب است؛ فردا دوباره.",
    source: "منبع معتبر — CSEP 2025", expertReview: true
  },
  {
    id: "g-pelvic", need: "کف لگن", icon: "sparkle", minutes: "۳ دقیقه",
    title: "کف لگن روزانه",
    why: "تمرین روزانهٔ عضلات کف لگن، خطر نشت ادرار را کم می‌کند.",
    steps: ["مانند نگه‌داشتن ادرار، عضلات را جمع کن.", "نفس نگه ندار؛ شکم و باسن را سفت نکن.", "چند نوبت در روز تکرار کن."],
    fallback: "فقط ۳ انقباض هم شروع است. نشت زیاد یا سنگینی؟ از فیزیوتراپیست کف لگن بپرس.",
    source: "منبع معتبر — CSEP 2025 · تکنیک نیازمند بازبینی فیزیوتراپیست", expertReview: true
  },
  {
    id: "g-sleep", need: "خواب", icon: "moon", minutes: "یک شب",
    title: "بلوک خواب محافظت‌شده",
    why: "خواب پیوسته، ذخیرهٔ انرژی تو را برمی‌گرداند.",
    steps: ["یک شیفت شبانه را به همسر یا یک نفر نزدیک بسپار.", "گوشی بیرون از اتاق؛ اتاق تاریک.", "شیرِ ذخیره یا شیشه را از قبل آماده کن."],
    fallback: "یک بازهٔ ۲۰ دقیقه‌ای در روز هم کمک می‌کند؛ بلوک کامل را به شب دیگری موکول کن.",
    source: "توصیهٔ متداول بهداشت خواب — بلوک ۴ ساعته اجماع متخصصان است، نه مطالعهٔ خاص", expertReview: false
  },
  {
    id: "g-breast", need: "شیردهی", icon: "lotus", minutes: "۵ دقیقه",
    title: "درد پستان و سفتی",
    why: "تخلیهٔ منظم شیر، سفتی و درد را کم می‌کند.",
    steps: ["نوزاد را منظم و درست به پستان بچسبان.", "دوش گرم قبل، کمپرس سرد بعد از شیردادن.", "لباس تنگ و فشار روی سینه را بردار."],
    fallback: "تب، قرمزیِ دردناک یا تودهٔ ماندگار؟ مسیر «علائم هشدار» را ببین.",
    source: "فشردهٔ محتوای آموزشی همین اپ · نیاز به تأیید مشاور شیردهی", expertReview: true
  },
  {
    id: "g-wound", need: "زخم و ترمیم", icon: "shield", minutes: "۵ دقیقه",
    title: "مراقبت از زخم و پرینه",
    why: "تمیزی ناحیه، ترمیم را راحت‌تر می‌کند.",
    steps: ["با آب نیم‌گرم آرام بشو و با حولهٔ تمیز خشک کن.", "روی بالشتک حلقه‌ای بنشین.", "دست‌ها را قبل و بعد از مراقبت بشو."],
    fallback: "قرمزی، چرک یا باز شدن بخیه؟ مسیر «علائم هشدار» را ببین.",
    source: "توصیهٔ متداول مامایی — نیاز به تأیید کارشناس", expertReview: true
  },
  {
    id: "g-food", need: "تغذیه", icon: "heart", minutes: "۲ دقیقه",
    title: "آهن، آب و تغذیه",
    why: "بدن بعد از زایمان برای ترمیم و شیر به آهن و آب نیاز دارد.",
    steps: ["هر وعده یک منبع پروتئین بگذار.", "آهن (گوشت، عدس، سبزی تیره) را با ویتامین C (مرکبات، فلفل دلمه‌ای) در همان وعده بخور.", "یک کاری آب در دیدِ دست بگذار."],
    fallback: "از همراهت بخواه برای فردا یک ظرف «آهن + ویتامین C» آماده کند.",
    source: "منبع معتبر — WHO 2022 · مقدار مکمل فقط با دستور متخصص", expertReview: false
  },
  {
    id: "g-mood", need: "حال روحی", icon: "cloud", minutes: "۵ دقیقه",
    title: "حال سنگین",
    why: "حال سنگینِ چندروزه ارزش توجه دارد، هر روز از زایمان که گذشته باشد.",
    steps: ["۵ دقیقه تنفس آرام (تمرین‌های همین اپ).", "یک جمله در دفتر شعله‌ها بنویس.", "با یک آدم نزدیک تماس بگیر یا پیام بده."],
    fallback: "حال سنگین ۳ روز شد؟ کارت حمایت و مسیر حرفه‌ای در «من و حمایت» منتظر توست.",
    source: "توصیهٔ متداول · مسیر حرفه‌ای در همین اپ", expertReview: true
  }
];

/* پرامپت‌های «دفتر شعله‌ها» — جای درون‌ریزی روزهای سخت؛ بدون نمره، خصوصی */
const PP_FLAME_PROMPTS = [
  { id: "fl-heavy", text: "امروز چه چیزی سنگین بود؟" },
  { id: "fl-tiny", text: "چه چیزی حتی یک کم کمک کرد؟" },
  { id: "fl-self", text: "یک جمله به خودِ خسته‌ام:" },
  { id: "fl-need", text: "اگر الان کسی پرسید، می‌خواستم بگویم…" },
  { id: "fl-free", text: "هرچه الان هست — بدون ویرایش." }
];
