/* ============================================================================
   pp-support-render.test.js — تست رندر «من هم مهمم» | نسخهٔ ۲ (بدون مرورگر)
   اجرا:  node pp-support-render.test.js
   بررسی می‌کند HTML بخش ساخته می‌شود، اجزای تازه (ورود با حال، شخصی‌سازی،
   پیوستگی، «چرا این‌جا») حضور دارند و ساختار چهار تبِ همراه مادر دست‌نخورده است.
   ============================================================================ */
const fs = require("fs");
const path = require("path");
const base = path.join(__dirname, "/");
const files = ["pp-content.js", "pp-companion.js", "pp-support-content.js", "pp-support.js"];

const fakeLS = { getItem(){ return null; }, setItem(){}, removeItem(){} };
function CapEl() {
  return { innerHTML:"", hidden:false, value:"", textContent:"",
    classList:{ add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    setAttribute(){}, getAttribute(){ return null; }, addEventListener(){},
    querySelector(){ return CapEl(); }, querySelectorAll(){ return []; },
    appendChild(){}, insertBefore(){}, focus(){}, click(){}, isConnected:true };
}
const fakeDoc = { addEventListener(){}, getElementById(){ return null; }, querySelector(){ return null; }, createElement(){ return CapEl(); }, body: CapEl(), hidden:false };
const fakeJAL = {
  keyToJdn(k){ const p = String(k).split("-"); return (+p[0])*10000 + (+p[1])*100 + (+p[2]); },
  d2j(j){ const y=Math.floor(j/10000), r=j%10000, m=Math.floor(r/100), d=r%100; return {jy:y,jm:m,jd:d}; },
  keyOf(a,b,c){ return a+"-"+String(b).padStart(2,"0")+"-"+String(c).padStart(2,"0"); },
  today(){ return {jy:1405,jm:7,jd:25}; }, monthLen(a,b){ return b<=6?31:b<=11?30:30; },
  MONTHS:["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"]
};
const win = {};
files.forEach(f => new Function("window","document","localStorage", fs.readFileSync(base+f,"utf8"))(win, fakeDoc, fakeLS));
let db = null;
const adapter = { today(){ return 14050725; }, load(){ if(!db) db={v:1,profile:null,checkins:{},tasks:{},needs:[],screen:{},seen:{},baby:null,weights:{},night:false}; return db; }, save(d){ db=d; }, clear(){ db=null; } };
const mount = CapEl();
const api = win.SamanPostpartum.init({ mount, adapter, jal: fakeJAL });
api._state.db.profile = { deliveryKey: "1405-07-05", type:"vaginal", feeding:"breast" };

/* دادهٔ نمونه برای پیوستگی: دو چک‌این و یک یادداشت */
api._state.db.checkins["1405-07-24"] = { mood: "okay", day: 19 };
api._state.db.checkins["1405-07-25"] = { mood: "low", day: 20 };
api._state.db.support = { journal: { jA: { text: "امروز سخت بود", ts: Date.now(), promptId: null } }, seen: {}, daily: {} };

const supNode = CapEl();
win.SamanSupport.mount(supNode);
const supHtml = supNode.innerHTML;

let pass=0, fail=0;
const ok = (n,c,x) => { c ? pass++ : (fail++, console.log("  ✗ "+n+(x!==undefined?"  → "+x:""))); };

/* بخش جدید */
[ "من هم مهمم", "الان چه حالی داری؟", "یک همراهی کوچک برای امروز",
  "حرف دلم رو بنویسم", "وقتی دلم می‌گیره", "وقتی به خودم شک می‌کنم", "بدنم هم به زمان نیاز داره",
  "pp-sup-grid", 'data-ss="open"', "pp-sup-state", "pp-sup-personal"
].forEach(t => ok("بخش: " + t, supHtml.indexOf(t) >= 0));

ok("پیوستگی «یادش می‌ماند»", supHtml.indexOf("یادش می‌ماند") >= 0);
ok("لینک «چرا این‌جا»", supHtml.indexOf("چرا این‌جا") >= 0);
ok("بدون خطای رندر (طول HTML)", supHtml.length > 1500, supHtml.length);

/* حفظ ساختار چهار تب میزبان */
const shell = mount.innerHTML;
["data-pp-pane=\"today\"","data-pp-pane=\"charts\"","data-pp-pane=\"care\"","data-pp-pane=\"guides\"","id=\"ppTabbar\""]
  .forEach(t => ok("ساختار حفظ‌شده: " + t, shell.indexOf(t) >= 0));

console.log("\nرندر: " + pass + " موفق، " + fail + " ناموفق");
process.exit(fail ? 1 : 0);
