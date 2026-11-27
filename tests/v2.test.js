const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

function dataBlock(id) {
  const m = html.match(new RegExp('<script id="' + id + '"[^>]*>([\\s\\S]*?)<\\/script>'));
  assert.ok(m, "нет script#" + id);
  return JSON.parse(m[1]);
}

test("версия v2.0_20261127 видна в title, бейдже и футере", () => {
  assert.match(html, /<title>[^<]*Sagitar · Шины и диски[^<]*v2\.0_20261127<\/title>/);
  assert.match(html, /id="verBadge"[^>]*>[\s\S]{0,160}?v2\.0_20261127/);
  assert.match(html, /<footer>[\s\S]*v2\.0_20261127[\s\S]*<\/footer>/);
});

test("юридический щит и ссылка на legal.html доступны", () => {
  assert.match(html, /id="legal-modal"/);
  assert.match(html, /id="legalAccept"/);
  assert.match(html, /href="legal\.html"/);
});

test("мобильный щит: кнопка принятия закреплена, версия не скрыта", () => {
  const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
  assert.match(css, /@media \(max-width:640px\)\{[\s\S]*?\.modal \.accept\{[^}]*position:sticky/);
  assert.match(html, /id="verBadge"[\s\S]{0,80}?class="ver-short"/);
});

test("четыре ссылки на бота и ни одной прямой t.me/c", () => {
  for (const topic of ["bug", "idea", "author", "partner"]) {
    assert.ok(html.includes("https://t.me/AzAppsFeedbackBot?start=sagitar_shiny_diski_" + topic), topic);
  }
  assert.equal(html.includes("t.me/c/"), false);
});

test("данные v1.3 и конфиг v2 встроены и полны", () => {
  const v13 = dataBlock("app-data");
  assert.equal(v13.tires.length, 97);
  assert.equal(v13.tests.length, 42);
  assert.equal(v13.rims.length, 27);
  assert.equal(v13.sources.length, 387);
  assert.deepEqual(v13.meta.unmatched, []);
  const cfg = dataBlock("v2-data");
  assert.equal(cfg.meta.version, "v2.0_20261127");
  assert.equal(cfg.platformIds.length, 21);
  assert.deepEqual(cfg.usedPlatformIds, ["avito", "drom_baza"]);
  for (const foreign of ["aliexpress_ru", "kaspi_kz", "onliner_by", "amazon_us", "ebay_us", "tire_rack"]) {
    assert.equal(cfg.platformIds.includes(foreign), false, foreign);
  }
});

const vm = require("node:vm");

// Объекты из vm-контекста имеют другой prototype: нормализуем перед deepStrictEqual.
const plain = (value) => JSON.parse(JSON.stringify(value));

function loadCore() {
  const m = html.match(/<script id="v2-app">([\s\S]*?)<\/script>/);
  assert.ok(m, "нет script#v2-app");
  const v13 = dataBlock("app-data");
  const cfg = dataBlock("v2-data");
  const sandbox = { console, Date, Math, JSON, Set, Object, Array, String, Number,
                    Boolean, encodeURIComponent, setTimeout, clearTimeout };
  sandbox.window = sandbox;
  sandbox.document = {
    getElementById: (id) => (id === "app-data" || id === "v2-data")
      ? { textContent: JSON.stringify(id === "app-data" ? v13 : cfg) } : null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  };
  sandbox.localStorage = { getItem: () => null, setItem: () => {} };
  vm.createContext(sandbox);
  vm.runInContext(m[1], sandbox);
  return sandbox.SagitarV2Core;
}

test("выбор = пересечение фильтра и кликов, сброс сохраняет город", () => {
  const C = loadCore(), s = C.createSelection();
  s.setFilter(["a", "b", "c"]); s.city = "Казань";
  assert.deepEqual(plain(s.active()), ["a", "b", "c"]);
  s.togglePin("b"); s.togglePin("c");
  assert.deepEqual(plain(s.active()), ["b", "c"]);
  s.reset();
  assert.deepEqual(plain(s.active()), []);
  assert.equal(s.city, "Казань");
});

test("условие строки наследует категорию, ручной выбор и сброс", () => {
  const C = loadCore(), s = C.createSelection();
  s.setGlobal("tire", "used"); s.setGlobal("wheel", "new");
  assert.equal(s.effectiveCondition("tire", "nokian-hakkapeliitta-r5"), "used");
  assert.equal(s.effectiveCondition("wheel", "vw-dover-16"), "new");
  s.setCondition("tire", "nokian-hakkapeliitta-r5", "new");
  assert.equal(s.effectiveCondition("tire", "nokian-hakkapeliitta-r5"), "new");
  assert.equal(s.effectiveCondition("tire", "other"), "used");
  s.resetPosition("tire", "nokian-hakkapeliitta-r5");
  assert.equal(s.effectiveCondition("tire", "nokian-hakkapeliitta-r5"), "used");
  s.setCondition("wheel", "vw-dover-16", "used");
  s.resetAllOverrides();
  assert.equal(s.effectiveCondition("wheel", "vw-dover-16"), "new");
});

test("запрос покупки: размер шины, маркировка диска, город, б/у", () => {
  const C = loadCore(), v13 = dataBlock("app-data"), cfg = dataBlock("v2-data");
  const tire = v13.tires[0];
  assert.match(C.buildQuery(tire, "tire", "Казань", "new", "205/55 R16"), /205\/55 R16/);
  assert.match(C.buildQuery(tire, "tire", "Казань", "new", "205/55 R16"), /Казань$/);
  const rim = v13.rims[0];
  const q = C.buildQuery(rim, "rim", "Уссурийск", "used", null, cfg);
  assert.match(q, /R16 6\.5J 5x112 ET46 ЦО 57\.1/);
  assert.match(q, /M14x1\.5 27 mm R13 ball seat/);
  assert.match(q, /б\/у/);
  assert.match(q, /Уссурийск$/);
});

test("URL площадки кодирует запрос, атрибуция и группы площадок", () => {
  const C = loadCore(), v13 = dataBlock("app-data"), cfg = dataBlock("v2-data");
  const p = v13.platforms.find(x => x.id === "yandex_market");
  const url = C.buildBuyUrl(p, "Michelin 205/55 R16 Казань");
  assert.match(url, /^https:\/\/market\.yandex\.ru\/search\?text=/);
  assert.match(url, /Michelin%20205%2F55%20R16/);
  assert.equal(C.attributionInterval(30), 25);
  assert.equal(C.attributionInterval(7), 3);
  assert.equal(C.attributionInterval(0), 25);
  assert.deepEqual(C.platformList(cfg, "used"), ["avito", "drom_baza"]);
  assert.equal(C.platformList(cfg, "new").length, 21);
  assert.equal(C.platformList(cfg, "all").length, 21);
});

test("цена только подтверждённая; статистика без персональных данных", () => {
  const C = loadCore();
  const offers = [{ sku: "formula-ice-fr|16", verified: true, price: 6450,
                    date: "2026-11-25", source: "ШИНА25.РУ" }];
  assert.equal(C.priceLabel(offers, { sku: "formula-ice-fr|16" }, "new"),
               "6 450 ₽/шт · 2026-11-25 · ШИНА25.РУ");
  assert.equal(C.priceLabel(offers, { sku: "unknown" }, "new"), "Цена уточняется ⚠️");
  assert.equal(C.priceLabel(offers, { sku: "formula-ice-fr|16" }, "used"), "Цена уточняется ⚠️");
  assert.equal(C.cityOkrug("Казань"), "ПФО");
  assert.equal(C.cityOkrug("Неизвестный"), "РФ");
  const payload = C.statsPayload("buy_click", "Казань", "2026-11-27");
  assert.deepEqual(plain(payload), { event: "buy_click", okrug: "ПФО", date: "2026-11-27" });
  assert.deepEqual(Object.keys(payload).sort(), ["date", "event", "okrug"]);
});

test("DOM-слой содержит город, два переключателя, таблицы и вкладку статистики", () => {
  for (const id of ["v2-root", "v2-city", "v2-city-list", "v2-tire-condition",
                    "v2-wheel-condition", "v2-reset-all", "v2-tire-table",
                    "v2-wheel-table", "v2-buy-modal", "v2-stats", "v2-confirmed"]) {
    assert.ok(html.includes('id="' + id + '"') || html.includes('"' + id + '"'), id);
  }
  assert.match(html, /Определение наличия и цены — на сайте магазина/);
  assert.match(html, /статистика событий недоступна/);
  assert.match(html, /Обновить переход/);
  assert.match(html, /Подтверждённые цены/);
});

test("v2-флаг принятия условий синхронизируется с наследуемым ключом", () => {
  assert.match(html, /sagitar_legal_v2/);
  const m = html.match(/<script id="v2-app">([\s\S]*?)<\/script>/);
  assert.match(m[1], /localStorage\.setItem\(LEGAL_KEY_V2, "1"\)/);
});

test("резервный фид цен и отсутствие рекламных меток", () => {
  const cfg = dataBlock("v2-data");
  assert.equal(cfg.meta.priceFeedUrl, "");
  assert.equal(html.includes("v2PriceFeedUrl"), true);
  assert.match(html, /цены не обновляются автоматически/i);
  const v13 = dataBlock("app-data");
  for (const p of v13.platforms) {
    assert.equal(p.sponsored == null || p.sponsored === false || p.sponsored === "", true, p.id);
    assert.equal(p.ERID == null || p.ERID === "", true, p.id);
  }
});
