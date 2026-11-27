/* ============================================================
   ПОДБОР РЕЗИНЫ v1.7 — движок интерфейса
   Правило v1.3: в подбор попадает только то, что можно открыть
   и проверить по ссылке. Цены/наличие — ИСКЛЮЧИТЕЛЬНО из PROJECT.offers[];
   ссылки «где купить» — из PROJECT.buyLinks[] и PROJECT.offers[].
   Адреса и маршруты — только Яндекс.Карты (24.11.2026).
   ============================================================ */
(function () {
  "use strict";
  const P = window.PROJECT;
  const SORT = window.TireSort;
  if (!SORT) throw new Error("sort.js не загружен");
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = n => (n == null ? "—" : Math.round(n).toLocaleString("ru-RU") + " ₽");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const byId = arr => arr.reduce((m, x) => (m[x.id] = x, m), {});

  /* Только реальные физические точки в Уссурийске: пункты выдачи,
     доставка, маркетплейсы и иногородние юрлица в интерфейс не попадают.
     Фильтр работает по данным shops, ничего не хардкодим. */
  const LOCAL_SHOPS = (P.shops || []).filter(s => s && s.storeType === "physical" &&
    /Уссурийск/i.test(String(s.address || "")));
  const LOCAL_SHOP_IDS = new Set(LOCAL_SHOPS.map(s => String(s.id)));
  const SHOPS = byId(LOCAL_SHOPS);
  const DIMS = { ice: "Лёд", snow: "Снег", wet: "Мокрое", dry: "Сухое", comfort: "Комфорт", quiet: "Тишина", value: "Цена" };
  const OFFERS = (P.offers || []).filter(o => o && o.shop && LOCAL_SHOP_IDS.has(String(o.shop)));
  const WOFFERS = (P.wheelOffers || []).filter(o => o && o.shop && LOCAL_SHOP_IDS.has(String(o.shop)));
  const VARIANTS = P.variants || [];
  const HAS_OFFERS = OFFERS.length > 0;
  const ORIGIN = P.meta.origins;
  const offById = id => OFFERS.find(o => o.id === id);
  const woById = id => WOFFERS.find(o => o.id === id);
  const wOfferSetPrice = o => (typeof o.price !== "number" ? null : (o.qty === 4 ? o.price : o.price * 4));
  const norm = x => String(x == null ? "" : x).toLowerCase().replace(/[^a-zа-я0-9]/gi, "");

  /* ---------- состояние ---------- */
  const LS = "pr_sel_v3";
  const state = {
    tSize: "all", tType: "all", tShop: "all", tSearch: "", tGroup: "type",
    tSort: { key: "score", dir: -1 },
    wSize: "all", wType: "all", wGroup: "none",
    wSort: { key: "name", dir: 1 },
    oSize: "all", oType: "all",
    weights: Object.assign({}, P.meta.weights),
    preset: "best",
    onlySelected: false,
    maxPrice: null,
    priority: [{ key: "score", dir: -1 }],
    shopIds: [],
    oneShopOnly: false,
    offerFilter: null,
    offersFromSelection: false,
    wheelOffersFromSelection: false,
    sel: { tires: [], wheels: [], offers: [], wheelOffers: [] },
    order: [] // приоритет групп дисков в памятке: сверху — основной комплект
  };
  let lastSortResult = { rows: [], hidden: 0, total: null, shops: [] };
  try {
    let saved = JSON.parse(localStorage.getItem(LS) || "null");
    if (!saved) saved = JSON.parse(localStorage.getItem("pr_sel_v2") || "null"); // миграция только базовых полей
    if (saved && saved.tires) {
      state.sel = { tires: saved.tires || [], wheels: saved.wheels || [], offers: saved.offers || [], wheelOffers: saved.wheelOffers || [] };
      if (Array.isArray(saved.order)) state.order = saved.order;
      if (saved.weights) state.weights = Object.assign({}, state.weights, saved.weights);
      if (saved.preset) state.preset = saved.preset;
      state.onlySelected = !!saved.onlySelected;
      if (saved.maxPrice != null && Number.isFinite(Number(saved.maxPrice))) state.maxPrice = Number(saved.maxPrice);
      if (Array.isArray(saved.priority) && saved.priority.length) {
        state.priority = saved.priority.filter(p => p && SORT.KEYS.includes(p.key))
          .map(p => ({ key: p.key, dir: p.dir < 0 ? -1 : 1 }));
      }
      if (Array.isArray(saved.shopIds)) state.shopIds = saved.shopIds.map(String);
      state.oneShopOnly = !!saved.oneShopOnly;
      state.offersFromSelection = !!saved.offersFromSelection;
      state.wheelOffersFromSelection = !!saved.wheelOffersFromSelection;
    }
  } catch (e) { }

  function saveSel() {
    try {
      localStorage.setItem(LS, JSON.stringify({
        tires: state.sel.tires, wheels: state.sel.wheels, offers: state.sel.offers,
        wheelOffers: state.sel.wheelOffers, order: state.order,
        weights: state.weights, preset: state.preset, onlySelected: state.onlySelected,
        maxPrice: state.maxPrice, priority: state.priority, shopIds: state.shopIds,
        oneShopOnly: state.oneShopOnly,
        offersFromSelection: state.offersFromSelection,
        wheelOffersFromSelection: state.wheelOffersFromSelection
      }));
    } catch (e) { }
    renderBasket(); renderSergey();
  }
  const isSelTire = k => state.sel.tires.includes(k);
  const isSelWheel = id => state.sel.wheels.includes(id);

  /* ---------- предложения: единственный источник цен ---------- */
  const offersFor = key => OFFERS.filter(o => o.sku === key && o.source);
  function priceFor(key) {
    const a = offersFor(key).filter(o => typeof o.price === "number").map(o => o.price);
    return a.length ? Math.min.apply(null, a) : null;
  }
  function valueScore(sku) {
    if (!HAS_OFFERS) return 5;                    // данных нет — нейтрально, не выдумываем
    const p = priceFor(sku.key);
    if (p == null) return 4;                      // на эту позицию предложений нет
    const all = OFFERS.filter(o => o.sku && o.sku.indexOf("|" + sku.d) > -1 && typeof o.price === "number").map(o => o.price);
    const min = all.length ? Math.min.apply(null, all) : p;
    return clamp(10 * min / p, 1, 10);
  }
  function scoreOf(s) {
    const t = s.tire.scores, w = state.weights;
    if (!SORT.hasScores(t)) return null; // новых моделей баллы не выдумываем
    const sum = Object.keys(DIMS).reduce((a, k) => a + (w[k] || 0), 0) || 1;
    const raw =
      (w.ice || 0) * t.ice + (w.snow || 0) * t.snow + (w.wet || 0) * t.wet +
      (w.dry || 0) * t.dry + (w.comfort || 0) * t.comfort + (w.quiet || 0) * t.quiet +
      (w.value || 0) * valueScore(s);
    return raw / sum;
  }

  /* ---------- плоский список шин ---------- */
  const SKUS = [];
  P.tires.forEach(t => t.variants.forEach(v => {
    const d = parseInt(v.size.replace(/^.*?R/, ""), 10);
    const key = t.id + "|" + d;
    SKUS.push({ key, tire: t, v, d, scores: t.scores, name: t.brand + " " + t.model, offerCount: offersFor(key).length });
  }));
  const skuById = k => SKUS.find(s => s.key === k);

  function ranksFor(rows) {
    const m = {};
    [16, 17].forEach(d => {
      rows.filter(s => s.d === d).slice().sort((a, b) => {
        const va = scoreOf(a), vb = scoreOf(b);
        return (vb == null ? -1e9 : vb) - (va == null ? -1e9 : va);
      }).forEach((s, i, arr) => { m[s.key] = { rank: i + 1, of: arr.length }; });
    });
    return m;
  }

  /* ---------- ссылки (только Яндекс, от конкретной точки) ---------- */
  function mapUrl(shop) {
    return shop.map || ("https://yandex.ru/maps/?text=" + encodeURIComponent(shop.address));
  }
  function navUrl(shop, from) {
    return "https://yandex.ru/maps/?rtext=" + encodeURIComponent(from) + "~" +
      encodeURIComponent(shop.address) + "&rtt=auto";
  }
  function navCar(shop) { return navUrl(shop, ORIGIN.car); }
  function navHotel(shop) { return navUrl(shop, ORIGIN.hotel); }
  function navCoords(from, coords) {
    return "https://yandex.ru/maps/?rtext=" + encodeURIComponent(from) + "~" +
      encodeURIComponent(coords) + "&rtt=auto";
  }
  function offerChecked(id) { return state.sel.offers.includes(id); }
  function offersWord(n) { return n === 1 ? "объявление" : (n >= 2 && n <= 4 ? "объявления" : "объявлений"); }
  function offerSetPrice(o) { return o.qty === 4 ? o.price : o.price * 4; }

  /* ============================================================
     ТАБЛИЦА ШИН
     ============================================================ */
  const T_COLS = [
    { key: "name", label: "Шина", type: "s" },
    { key: "type", label: "Тип", type: "s" },
    { key: "d", label: "Размер", type: "n" },
    { key: "studs", label: "Шипов", type: "n" },
    { key: "ice", label: "Лёд", type: "n" },
    { key: "snow", label: "Снег", type: "n" },
    { key: "wet", label: "Мокрое", type: "n" },
    { key: "dry", label: "Сухое", type: "n" },
    { key: "comfort", label: "Комфорт", type: "n" },
    { key: "quiet", label: "Тишина", type: "n" },
    { key: "price", label: "Цена/шт", type: "n" },
    { key: "approx", label: "Примерная стоимость", type: "n" },
    { key: "braking", label: "Торможение", type: "n" },
    { key: "score", label: "Балл", type: "n" },
    { key: "rank", label: "Место", type: "n" },
    { key: "offer", label: "Проверенное предложение", type: "s" }
  ];

  function groupKeyT(s) {
    if (state.tGroup === "type") return s.tire.type === "studded" ? "1|Шипы" : "2|Липучка";
    if (state.tGroup === "size") return "3|" + s.v.size + ' (' + s.d + '")';
    if (state.tGroup === "brand") return "4|" + s.tire.brand;
    return "";
  }
  const groupLabelT = k => k.split("|")[1] || k;

  function filteredTires() {
    let a = SKUS.slice();
    if (state.tSize !== "all") a = a.filter(s => s.d === +state.tSize);
    if (state.tType !== "all") a = a.filter(s => s.tire.type === state.tType);
    if (state.onlySelected) a = a.filter(s => isSelTire(s.key));
    if (state.tShop !== "all") a = a.filter(s => offersFor(s.key).some(o => o.shop === state.tShop));
    if (state.tSearch.trim()) {
      const q = state.tSearch.trim().toLowerCase();
      a = a.filter(s => (s.tire.brand + " " + s.tire.model + " " + s.v.size).toLowerCase().includes(q));
    }
    lastSortResult = SORT.sortRows(a, {
      offers: OFFERS, wheelOffers: WOFFERS, shops: LOCAL_SHOPS,
      priority: state.priority.map(p => ({ ...p })),
      maxPrice: state.maxPrice,
      shopIds: state.shopIds,
      oneShopOnly: state.oneShopOnly,
      groupOf: state.tGroup === "none" ? null : groupKeyT,
      scoreOf: s => scoreOf(s)
    });
    /* Сортировка по заголовкам остаётся быстрым локальным режимом;
       управляемая иерархия приоритетов — через SORT.sortRows. */
    const k = state.tSort.key, dir = state.tSort.dir;
    if (!["score", "ice", "snow", "wet", "dry", "comfort", "quiet", "price", "approx", "braking"].includes(k)) {
      const val = (s, key) => {
        if (key === "name") return s.tire.brand + " " + s.tire.model;
        if (key === "type") return s.tire.type === "studded" ? "1" : "2";
        if (key === "rank") return (ranksFor(lastSortResult.rows)[s.key] || {}).rank || 99;
        if (key === "offer") return s.offerCount;
        if (key === "d") return s.d;
        return s[key] || 0;
      };
      lastSortResult.rows.sort((x, y) => {
        if (state.tGroup !== "none") {
          const gx = groupKeyT(x), gy = groupKeyT(y);
          if (gx !== gy) return gx.localeCompare(gy, "ru");
        }
        const vx = val(x, k), vy = val(y, k);
        if (typeof vx === "string") return vx.localeCompare(vy, "ru") * dir;
        return (vx - vy) * dir;
      });
    }
    return lastSortResult.rows;
  }

  function offerCell(key) {
    const os = offersFor(key);
    if (!os.length) return '<span class="muted">уточнить по телефону</span>';
    return os.map(o => {
      const shop = SHOPS[o.shop] ? SHOPS[o.shop].name : (o.seller || o.shop || "продавец");
      return `<span class="offer-mini"><a class="tag good" href="#sec-offers" data-offer-sku="${esc(key)}" title="Показать объявления в таблице: ${esc(shop)} · ${esc(o.date)}">${esc(shop)} · ${money(o.price)} · ${esc(o.date)} →</a> ` +
        `<a class="src-ext" href="${esc(o.url)}" target="_blank" rel="noopener" title="Открыть источник: ${esc(o.source || "")}">↗</a></span>`;
    }).join(" ");
  }

  /* Проверенные предложения по дискам берём ТОЛЬКО из wheelOffers[]:
     это реальные объявления с ссылкой и датой. В-table выдаём количество
     и минимальную цену за комплект, не выдумывая ничего сверх данных. */
  const wheelOffersFor = w => WOFFERS.filter(o => o.diameter === w.diameter && o.type === w.type);
  function wheelOfferCell(w) {
    const os = wheelOffersFor(w);
    if (!os.length) return '<span class="muted">проверенных предложений пока нет</span>';
    const prices = os.map(wOfferSetPrice).filter(p => p != null);
    const from = prices.length ? ` · от ${money(Math.min.apply(null, prices))} за 4 шт` : "";
    return `<a class="tag good" href="#sec-wheel-offers" title="Перейти к таблице «Отдельные диски: где купить»">${os.length} проверенных предложений${from} →</a>`;
  }

  function renderTireTable() {
    const rows = filteredTires(), ranks = ranksFor(rows);
    const tbody = $("#tire-tbody");
    if (!tbody) return;
    const counts = {};
    rows.forEach(r => { const g = groupKeyT(r); counts[g] = (counts[g] || 0) + 1; });
    let html = "", lastGroup = null;
    rows.forEach(s => {
      if (state.tGroup !== "none") {
        const gk = groupKeyT(s);
        if (gk !== lastGroup) {
          html += `<tr class="group-row"><td colspan="${T_COLS.length + 1}">${esc(groupLabelT(gk))} · ${counts[gk]} поз.</td></tr>`;
          lastGroup = gk;
        }
      }
      const sel = isSelTire(s.key);
      const sc = s.tire.scores || {};
      const cell = v => (v == null ? "—" : v);
      const p = SORT.priceOf(s, OFFERS);
      const approx = p == null ? "уточнить по телефону" : money(p * 4);
      const score = scoreOf(s);
      html += `<tr data-sku="${s.key}" class="${sel ? "is-selected" : ""}">
        <td class="sticky"><input class="check" type="checkbox" data-check-tire="${s.key}" ${sel ? "checked" : ""} aria-label="Выбрать шину"></td>
        <td class="sticky" style="left:38px"><span class="name" data-open-tire="${s.key}">${esc(s.tire.brand)} ${esc(s.tire.model)}</span>${s.v.xl ? '<span class="tag dim">XL</span>' : ""}</td>
        <td>${s.tire.type === "studded" ? `<span class="tag stud">шипы ${s.tire.studs}</span>` : '<span class="tag fric">липучка</span>'}</td>
        <td><span class="tag size${s.d}" data-size="${s.d}" title="Показать только ${s.d}&quot;">${esc(s.v.size)}</span></td>
        <td class="num">${s.tire.studs || "—"}</td>
        <td class="num">${cell(sc.ice)}</td>
        <td class="num">${cell(sc.snow)}</td>
        <td class="num">${cell(sc.wet)}</td>
        <td class="num">${cell(sc.dry)}</td>
        <td class="num">${cell(sc.comfort)}</td>
        <td class="num">${cell(sc.quiet)}</td>
        <td class="num">${p == null ? '<span class="muted">уточнить по телефону</span>' : `<a href="#sec-offers" data-offer-sku="${esc(s.key)}" title="Показать пункты продажи">${money(p)}</a>`}</td>
        <td class="num">${p == null ? '<span class="muted">уточнить по телефону</span>' : `<a href="#sec-offers" data-offer-sku="${esc(s.key)}" title="Показать пункты продажи">${approx}</a><br><small>без монтажа</small>`}</td>
        <td class="num">${cell(SORT.braking(sc))}</td>
        <td class="num"><b>${score == null ? "—" : score.toFixed(1)}</b></td>
        <td class="num">${(ranks[s.key] || {}).rank || "—"} <small>/ ${(ranks[s.key] || {}).of || "—"}</small></td>
        <td>${offerCell(s.key)}</td>
      </tr>`;
    });
    tbody.innerHTML = html || `<tr><td colspan="${T_COLS.length + 1}" style="padding:30px;text-align:center;color:#5d6b78">Нет позиций. Сбросьте фильтры или отключите «только выбранное».</td></tr>`;
    $("#tire-count").textContent = rows.length + " позиций";
    const note = $("#tire-filter-note");
    if (note) note.textContent = lastSortResult.hidden ? `Скрыто фильтрами: ${lastSortResult.hidden} поз.` : "";
    const total = $("#shop-total");
    if (total) total.textContent = state.oneShopOnly && lastSortResult.total
      ? "Комплект в одном магазине: " + money(lastSortResult.total) : "";
  }
  function renderTireHead() {
    const tr = $("#tire-head");
    if (!tr) return;
    tr.innerHTML = `<th class="sticky" style="width:38px"><span class="small">☑</span></th>` +
      T_COLS.map(c => `<th class="${c.type === "n" ? "num" : ""}" data-sort-t="${c.key}">${c.label}<span class="arr">${state.tSort.key === c.key ? (state.tSort.dir < 0 ? "▼" : "▲") : "↕"}</span></th>`).join("");
  }

  /* ============================================================
     ТАБЛИЦА ДИСКОВ
     ============================================================ */
  const W_COLS = [
    { key: "name", label: "Диск", type: "s" },
    { key: "type", label: "Тип", type: "s" },
    { key: "condition", label: "Состояние", type: "s" },
    { key: "diameter", label: "Ø", type: "n" },
    { key: "widthJ", label: "J", type: "n" },
    { key: "et", label: "ET", type: "n" },
    { key: "pcd", label: "PCD", type: "s" },
    { key: "cb", label: "ЦО", type: "n" },
    { key: "weight", label: "Вес, кг", type: "n" },
    { key: "offer", label: "Проверенные предложения", type: "s" }
  ];
  const WTYPE = { steel: "штамповка", cast: "литьё", forged: "ковка" };
  const WCOND = { new: "новый", used: "б/у" };

  function filteredWheels() {
    let a = P.wheels.slice();
    if (state.wSize !== "all") a = a.filter(w => w.diameter === +state.wSize);
    if (state.wType !== "all") a = a.filter(w => w.type === state.wType);
    if (state.onlySelected) a = a.filter(w => isSelWheel(w.id));
    if (state.shopIds.length) {
      const ids = new Set(state.shopIds);
      a = a.filter(w => WOFFERS.some(o => ids.has(String(o.shop)) && o.diameter === w.diameter && o.type === w.type));
    }
    if (state.oneShopOnly) {
      const both = new Set(SORT.shopsWithBoth({
        offers: OFFERS, wheelOffers: WOFFERS, shops: LOCAL_SHOPS, shopIds: state.shopIds
      }));
      a = a.filter(w => WOFFERS.some(o => both.has(String(o.shop)) && o.diameter === w.diameter && o.type === w.type));
    }
    const k = state.wSort.key, dir = state.wSort.dir;
    a.sort((x, y) => {
      let vx, vy;
      if (k === "name") { vx = x.brand + " " + x.model; vy = y.brand + " " + y.model; }
      else if (k === "type") { vx = WTYPE[x.type]; vy = WTYPE[y.type]; }
      else if (k === "condition") { vx = WCOND[x.condition]; vy = WCOND[y.condition]; }
      else if (k === "offer") { vx = wheelOffersFor(x).length; vy = wheelOffersFor(y).length; }
      else { vx = x[k]; vy = y[k]; }
      if (typeof vx === "string") return vx.localeCompare(vy, "ru") * dir;
      return (vx - vy) * dir;
    });
    return a;
  }
  function renderWheelTable() {
    const rows = filteredWheels(), tbody = $("#wheel-tbody");
    if (!tbody) return;
    let html = "", lastGroup = null;
    rows.forEach(w => {
      if (state.wGroup !== "none") {
        const g = state.wGroup === "type" ? WTYPE[w.type] : w.diameter + '"';
        if (g !== lastGroup) {
          html += `<tr class="group-row"><td colspan="${W_COLS.length + 1}">${esc(g)}</td></tr>`;
          lastGroup = g;
        }
      }
      html += `<tr data-wheel="${w.id}" class="${isSelWheel(w.id) ? "is-selected" : ""}">
        <td class="sticky"><input class="check" type="checkbox" data-check-wheel="${w.id}" ${isSelWheel(w.id) ? "checked" : ""} aria-label="Выбрать диск"></td>
        <td class="sticky" style="left:38px"><span class="name" data-goto="offers" title="Перейти к таблице «Отдельные диски: где купить»">${esc(w.brand)} ${esc(w.model)}</span><br><button class="btn ghost" type="button" data-open-wheel="${esc(w.id)}" title="Открыть карточку диска">карточка</button></td>
        <td><span class="tag ${w.type === "steel" ? "dim" : "size17"}">${WTYPE[w.type]}</span></td>
        <td><span class="tag ${w.condition === "used" ? "stud" : "good"}">${WCOND[w.condition]}</span></td>
        <td class="num"><span class="tag size${w.diameter}" data-size="${w.diameter}">${w.diameter}"</span></td>
        <td class="num">${w.widthJ}</td><td class="num">${w.et}</td>
        <td>${esc(w.pcd)}</td><td class="num">${w.cb}</td><td class="num">${w.weight}</td>
        <td>${wheelOfferCell(w)}</td>
      </tr>`;
    });
    tbody.innerHTML = html || `<tr><td colspan="${W_COLS.length + 1}" style="padding:30px;text-align:center;color:#5d6b78">Нет позиций.</td></tr>`;
    $("#wheel-count").textContent = rows.length + " позиций";
  }
  function renderWheelHead() {
    const tr = $("#wheel-head");
    if (!tr) return;
    tr.innerHTML = `<th class="sticky" style="width:38px"><span class="small">☑</span></th>` +
      W_COLS.map(c => `<th class="${c.type === "n" ? "num" : ""}" data-sort-w="${c.key}">${c.label}<span class="arr">${state.wSort.key === c.key ? (state.wSort.dir < 0 ? "▼" : "▲") : "↕"}</span></th>`).join("");
  }

  /* ============================================================
     КАРТОЧКИ
     ============================================================ */
  function checkNote(shops, os) {
    const direct = (os || []).filter(o => o && o.url).map(o => {
      const shop = SHOPS[o.shop] ? SHOPS[o.shop].name : (o.source || o.seller || "продавец");
      const warn = o.verified === false ? " · уточнить карточку перед покупкой" : "";
      return `<a class="btn primary" href="${esc(o.url)}" target="_blank" rel="noopener" title="${esc(shop)} · ${esc(o.source || "")} · ${esc(o.date || "")}">${esc(shop)} — открыть товар${warn}</a>`;
    }).join(" ");
    /* Пункты выдачи и доставка не являются магазином с шинами на месте
       и не шиномонтаж. Пометка выводится только если такая точка есть
       в самих данных — без хардкода конкретных магазинов. */
    const pickupLike = x => x && (x.pickup === true || x.storeType === "pickup" ||
      /пункт выдачи|ПВЗ|доставка|pickup/i.test(String(x.name || "") + " " + String(x.address || "") + " " + String(x.source || "")));
    const isPickup = (os || []).some(pickupLike) || (shops || []).some(pickupLike);
    const pickupNote = isPickup
      ? '<p class="small note warn">Пункт выдачи, не шиномонтаж: уточните срок получения и монтаж по 8-800-505-00-34 до поездки</p>'
      : "";
    const addr = (shops || []).slice(0, 4).map(sh =>
      `<a class="btn ghost" href="${esc(mapUrl(sh))}" target="_blank" rel="noopener">${esc(sh.name)} · ${esc(sh.address)}</a>`).join(" ");
    return `<p class="small"><b>Прямая ссылка на товар:</b></p>${direct || '<div class="note warn">Прямых предложений нет — уточните наличие в точках ниже.</div>'}
      ${pickupNote}
      <p class="small" style="margin-top:10px"><b>Адреса точек (Яндекс.Карты, 24.11.2026):</b></p>${addr || '<span class="tag dim">адреса не проверены</span>'}`;
  }
  function openTire(key) {
    const s = skuById(key); if (!s) return;
    const t = s.tire, os = offersFor(key);
    const sc = t.scores || {}, scCell = v => (v == null ? "—" : v), score = scoreOf(s);
    const near = LOCAL_SHOPS.slice().sort((a, b) => a.kmCar - b.kmCar);
    const box = $("#detail-tire");
    box.innerHTML = `<div class="detail-h"><div>
        <h3>${esc(t.brand)} ${esc(t.model)} <span class="tag size${s.d}">${esc(s.v.size)}</span></h3>
        <div class="small">${t.type === "studded" ? "Шипованная" : "Липучка (фрикционная)"} · шипов: ${t.studs || 0} · ${esc(t.country)}</div>
      </div><div class="x"><button class="btn" data-close-detail="tire">✕ Закрыть</button></div></div>
      <div class="detail-body"><div>
        <p>${esc(t.summary)}</p>
        <div class="specs">
          <div><b>Тип</b>${t.type === "studded" ? "шипы" : "липучка"}</div>
          <div><b>Шипов</b>${t.studs || 0}</div>
          <div><b>Размер</b>${esc(s.v.size)} ${esc(s.v.load)}${s.v.xl ? " XL" : ""}</div>
          <div><b>Лёд / снег / мокро / сухо</b>${scCell(sc.ice)} / ${scCell(sc.snow)} / ${scCell(sc.wet)} / ${scCell(sc.dry)}</div>
          <div><b>Комфорт / тишина</b>${scCell(sc.comfort)} / ${scCell(sc.quiet)}</div>
          <div><b>Балл по текущим весам</b>${score == null ? "— (оценок нет)" : score.toFixed(1) + " / 10"}</div>
        </div>
        <div class="note">${esc(P.meta.testNote)}</div>
        <div class="grid2" style="margin-top:14px">
          <div><b>Плюсы</b><ul class="small" style="margin:6px 0 0 18px;padding:0">${t.pros.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
          <div><b>Минусы</b><ul class="small" style="margin:6px 0 0 18px;padding:0">${t.cons.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
        </div>
      </div><div>
        <h4 style="margin:0 0 8px">Проверенные предложения</h4>
        ${os.length ? os.map(o => `<div class="shoprow">
          <div class="top-line"><span class="nm">${esc(SHOPS[o.shop] ? SHOPS[o.shop].name : o.shop)}</span><span class="price">${money(o.price)}</span></div>
          <div class="addr">Источник: ${esc(o.source)} · ${esc(o.date)} · ${esc(o.address || "")}</div>
          <div class="addr">${routeButtons(o.coords, SHOPS[String(o.shop)] || null)}</div>
          <div class="acts"><a class="btn primary" href="${esc(o.url)}" target="_blank" rel="noopener">Открыть объявление</a></div>
        </div>`).join("") : `<div class="s-empty">Проверенных предложений нет — цена и наличие не показываются.</div>`}
        <p class="small" style="margin-top:12px"><b>Где проверить наличие:</b> ближайшие точки из Яндекс.Карт (24.11.2026):</p>
        ${checkNote(near, os)}
      </div></div>`;
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function openWheel(id) {
    const w = P.wheels.find(x => x.id === id); if (!w) return;
    /* Прямые предложения по диску — из wheelOffers[]: там ссылка, источник и дата.
       offer-записи по SKU диска в данных отсутствуют. */
    const label = norm(w.brand + " " + w.model);
    const os = WOFFERS.filter(o => o.wheelId === id ||
      (norm((o.name || "") + " " + (o.model || "")) === label && o.diameter === w.diameter));
    const near = LOCAL_SHOPS.slice().sort((a, b) => a.kmCar - b.kmCar);
    const box = $("#detail-wheel");
    box.innerHTML = `<div class="detail-h"><div>
        <h3>${esc(w.brand)} ${esc(w.model)} <span class="tag size${w.diameter}">${w.diameter}"</span></h3>
        <div class="small">${WTYPE[w.type]} · ${WCOND[w.condition]} · ${w.widthJ}J×${w.diameter} · ET${w.et} · ${esc(w.pcd)} · ЦО ${w.cb}</div>
      </div><div class="x"><button class="btn" data-close-detail="wheel">✕ Закрыть</button></div></div>
      <div class="detail-body"><div>
        <p>${esc(w.note)}</p>
        <div class="specs">
          <div><b>Тип / состояние</b>${WTYPE[w.type]} · ${WCOND[w.condition]}</div>
          <div><b>Диаметр / ширина</b>${w.diameter}" · ${w.widthJ}J</div>
          <div><b>Вылет</b>ET${w.et} (штатно 46–51)</div>
          <div><b>Сверловка / ЦО</b>${esc(w.pcd)} · ${w.cb} мм</div>
          <div><b>Вес / нагрузка</b>${w.weight} кг · ${w.load} кг</div>
        </div>
        <div class="note">Проверка перед покупкой: приложить к машине, покрутить на балансировочном станке, проверить биение и состояние ЛКП. Болты — M14×1,5×27, сфера R13 (штатные) или конус 60° (неоригинал).</div>
      </div><div>
        <h4 style="margin:0 0 8px">Проверенные предложения</h4>
        ${os.length ? os.map(o => `<div class="shoprow">
          <div class="top-line"><span class="nm">${esc(SHOPS[o.shop] ? SHOPS[o.shop].name : o.shop)}</span><span class="price">${money(o.price)}</span></div>
          <div class="addr">Источник: ${esc(o.source)} · ${esc(o.date)} · ${esc(o.address || "")}</div>
          <div class="addr">${routeButtons(o.coords, SHOPS[String(o.shop)] || null)}</div>
          <div class="acts"><a class="btn primary" href="${esc(o.url)}" target="_blank" rel="noopener">Открыть объявление</a></div>
        </div>`).join("") : `<div class="s-empty">Проверенных предложений нет — цена и наличие не показываются.</div>`}
        <p class="small" style="margin-top:12px"><b>Где проверить наличие:</b></p>${checkNote(near, os)}
      </div></div>`;
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ============================================================
     ГРАФИКИ — только сравнительные оценки, без цен и тормозного пути
     ============================================================ */
  function chartRows(items, valFn, fmt, bestMin) {
    const all = items.map(valFn);
    const best = bestMin ? Math.min.apply(null, all) : Math.max.apply(null, all);
    return items.map(it => {
      const v = valFn(it), w = clamp(v / 10 * 100, 2, 100);
      return `<div class="crow ${v === best ? "best" : ""}" data-open-tire="${it.key}">
        <span class="lbl" title="${esc(it.tire.brand + " " + it.tire.model)}">${esc(it.tire.brand)} ${esc(it.tire.model.replace(/^Winter\s+/i, ""))}</span>
        <span class="track"><span class="fill" style="width:${w.toFixed(1)}%"></span></span>
        <span class="val">${fmt(v)}</span></div>`;
    }).join("");
  }
  function renderCharts() {
    const d = state.tSize === "all" ? 16 : +state.tSize;
    /* Графики строятся по тем же видимым строкам, что и таблицы подбора. */
    const visible = filteredTires();
    const base = visible.filter(s => SORT.hasScores(s.tire.scores));
    const top = n => base.slice().sort((a, b) => {
      const va = scoreOf(a), vb = scoreOf(b);
      return (vb == null ? -1e9 : vb) - (va == null ? -1e9 : va);
    }).slice(0, n);
    const c1 = $("#chart-price");
    if (c1) {
      const keys = new Set(visible.map(s => s.key));
      const priceOffers = OFFERS.filter(o => o.price != null && o.sku && keys.has(o.sku));
      c1.innerHTML = priceOffers.length ? priceOffers.map(o => `<div class="crow"><span class="lbl">${esc(SHOPS[o.shop] ? SHOPS[o.shop].name : o.shop)}</span><span class="val">${money(o.price)}</span></div>`).join("")
        : `<div class="s-empty">Проверенных цен нет. График появится после подтверждения предложений.</div>`;
      $("#chart-price-sub").textContent = "Только предложения со ссылкой-источником";
    }
    const put = (sel, subSel, key, label) => {
      const c = $(sel); if (!c) return;
      c.innerHTML = chartRows(top(12), s => s.tire.scores[key], v => String(v), false);
      $(subSel).textContent = label + " · " + d + '" · сравнительная оценка, не измерение';
    };
    put("#chart-ice", "#chart-ice-sub", "ice", "Лёд");
    put("#chart-snow", "#chart-snow-sub", "snow", "Снег");
    put("#chart-noise", "#chart-noise-sub", "quiet", "Тишина");
  }

  /* ============================================================
     КОМПЛЕКТЫ — только из проверенных предложений в одной точке
     ============================================================ */
  function renderSets() {
    const box = $("#sets-body"); if (!box) return;
    const rows = [];
    OFFERS.forEach(to => {
      if (!to.sku || to.sku.indexOf("|") < 0 || to.price == null) return;
      WOFFERS.forEach(wo => {
        const woSku = wo.sku || wo.wheelId;
        if (!woSku || woSku.indexOf("|") > -1 || wo.price == null) return;
        if (to.shop !== wo.shop) return;
        const s = skuById(to.sku), w = P.wheels.find(x => x.id === woSku);
        if (!s || !w || s.d !== w.diameter) return;
        const mount = P.meta.mounting == null ? null : P.meta.mounting;
        const total = mount == null ? null : to.price * 4 + wo.price * 4 + mount;
        rows.push({ s, w, shop: SHOPS[to.shop], to, wo, mount, total });
      });
    });
    rows.sort((a, b) => (a.total == null ? 9e9 : a.total) - (b.total == null ? 9e9 : b.total));
    box.innerHTML = rows.length ? rows.map((r, i) => `<tr>
        <td><input class="check" type="checkbox" data-check-set="${r.s.key}|${r.w.id}" ${isSelTire(r.s.key) && isSelWheel(r.w.id) ? "checked" : ""} aria-label="Выбрать комплект"></td>
        <td class="num">${i + 1}</td>
        <td><span class="name" data-open-tire="${r.s.key}">${esc(r.s.tire.brand)} ${esc(r.s.tire.model)}</span><br><small>${esc(r.s.v.size)}</small></td>
        <td><span class="name" data-goto="offers" title="Перейти к таблице «Отдельные диски: где купить»">${esc(r.w.brand)} ${esc(r.w.model)}</span><br><small>${WTYPE[r.w.type]} ${r.w.widthJ}J×${r.w.diameter} ET${r.w.et}</small></td>
        <td>${esc(r.shop ? r.shop.name : r.to.shop)}<br><small>${esc(r.shop ? r.shop.address : "")}</small></td>
        <td class="num">${money(r.to.price * 4)}</td><td class="num">${money(r.wo.price * 4)}</td>
        <td class="num">${money(r.mount)}</td><td class="num"><b>${money(r.total)}</b></td>
        <td class="route-cell">${r.shop ? routeButtons(null, r.shop) : '<span class="muted">адрес не проверен</span>'}</td>
      </tr>`).join("")
      : `<tr><td colspan="10" style="padding:30px;text-align:center;color:#5d6b78">Проверенных комплектов нет: в подбор попадают только шины и диски с открытыми ссылками-источниками и подтверждённым наличием.</td></tr>`;
    $("#sets-note").textContent = rows.length
      ? `Показано комплектов: ${rows.length}. ${esc(P.meta.mountsNote)}`
      : "Комплектов нет: нужны проверенные предложения шин и дисков в одной точке. " + P.meta.mountsNote;
  }

  /* ============================================================
     ПРОВЕРЕННЫЕ ОБЪЯВЛЕНИЯ — только физические магазины Уссурийска с адресом
     ============================================================ */
  /* Сегмент «Только выбранные» и старый чекбокс умножаются (AND).
     Пустой выбор намеренно показывает все строки — с поясняющей плашкой. */
  function matchesSelectedTire(o) {
    if (!state.sel.tires.length) return true;
    if (o.sku && state.sel.tires.includes(o.sku)) return true;
    const s = skuById(o.sku);
    if (s) return state.sel.tires.includes(s.key);
    return state.sel.tires.some(k => {
      const t = skuById(k);
      return t && norm(t.v.size) === norm(o.size) &&
        (norm(o.name) + " " + norm(o.model)).includes(norm(t.tire.model));
    });
  }
  function matchesSelectedWheel(o) {
    if (!state.sel.wheels.length) return true;
    if (o.wheelId && state.sel.wheels.includes(o.wheelId)) return true;
    const label = norm((o.name || "") + " " + (o.model || ""));
    return state.sel.wheels.some(id => {
      const w = P.wheels.find(x => x.id === id) || woById(id);
      if (!w) return label.includes(norm(o.model || ""));
      return norm(w.brand + " " + w.model) === label && w.diameter === o.diameter;
    });
  }

  function filteredOffers() {
    let a = OFFERS.slice();
    if (state.offerFilter) {
      const s = skuById(state.offerFilter);
      if (s) a = a.filter(o => o.sku === s.key ||
        (norm(o.size) === norm(s.v.size) &&
          (norm(o.name) + norm(o.model)).includes(norm(s.tire.model))));
    }
    if (state.offersFromSelection) a = a.filter(matchesSelectedTire);
    if (state.oSize !== "all") a = a.filter(o => o.d === +state.oSize);
    if (state.oType !== "all") a = a.filter(o => o.type === state.oType);
    if (state.onlySelected) a = a.filter(o => offerChecked(o.id));
    const km = s => { const n = parseFloat(String(s).replace(",", ".")); return isNaN(n) ? 99 : n; };
    a.sort((x, y) => (x.coords ? 0 : 1) - (y.coords ? 0 : 1) || km(x.distCar) - km(y.distCar));
    return a;
  }
  /* Расстояние и время — отдельными строками. Кнопки проезда уезжают в ячейку
     продавца/адреса: единый шаблон для ВСЕХ таблиц точек покупки. */
  function offerDistCell(o, from, dist, time) {
    const t = time == null ? "" : `<span class="route-time">${time} мин в пути</span>`;
    if (!dist) return `<span class="tag dim">не проверено</span>${t}`;
    return `<b>${esc(dist)}</b>${t}`;
  }
  function routeButtons(coords, shop) {
    const car = shop ? navCar(shop) : (coords ? navCoords(ORIGIN.car, coords) : null);
    const hotel = shop ? navHotel(shop) : (coords ? navCoords(ORIGIN.hotel, coords) : null);
    if (!car || !hotel) return '<span class="muted">координат нет — маршрут не строится</span>';
    return `<span class="route-buttons">
      <a class="btn ghost" href="${esc(car)}" target="_blank" rel="noopener">🧭 от Пролетарской</a>
      <a class="btn ghost" href="${esc(hotel)}" target="_blank" rel="noopener">🧭 от Маяка</a>
    </span>`;
  }
  function renderOffers() {
    const tbody = $("#offers-body"); if (!tbody) return;
    const rows = filteredOffers();
    const chip = $("#offer-filter-chip");
    if (chip) {
      const s = state.offerFilter && skuById(state.offerFilter);
      if (s) {
        chip.hidden = false;
        chip.innerHTML = `Шина: ${esc(s.tire.brand)} ${esc(s.tire.model)} · ${esc(s.v.size)} · <button type="button" id="offer-filter-reset">Сбросить фильтр</button>`;
      } else {
        chip.hidden = true;
        chip.innerHTML = "";
      }
    }
    const note = $("#offers-sel-note");
    if (note) note.hidden = !(state.offersFromSelection && !state.sel.tires.length);
    tbody.innerHTML = rows.map(o => `<tr class="${offerChecked(o.id) ? "is-selected" : ""}">
      <td class="sticky"><input class="check" type="checkbox" data-check-offer="${o.id}" ${offerChecked(o.id) ? "checked" : ""} aria-label="Выбрать объявление"></td>
      <td class="sticky" style="left:38px"><a class="name" href="${esc(o.url)}" target="_blank" rel="noopener">${esc(o.name)}</a><br><small>${esc(o.model)}</small></td>
      <td><span class="tag size${o.d}">${esc(o.size)}</span></td>
      <td>${o.type === "studded" ? '<span class="tag stud">шипы</span>' : o.type === "friction" ? '<span class="tag fric">липучка</span>' : '<span class="tag dim">комплект</span>'}
        <small>${esc(o.condition)}${o.year ? ", " + esc(o.year) : ""}${o.note ? "<br>" + esc(o.note) : ""}</small></td>
      <td class="num"><b>${money(o.price)}</b><br><small>за ${o.qty} шт · ${money(offerSetPrice(o))} за комплект 4</small></td>
      <td class="route-cell"><small>${esc(o.seller)}<br>${esc(o.date)}</small>${routeButtons(o.coords)}</td>
      <td class="num">${offerDistCell(o, ORIGIN.car, o.distCar, o.timeCar)}</td>
      <td class="num">${offerDistCell(o, ORIGIN.hotel, o.distHotel, o.timeHotel)}</td>
      <td class="col-traffic"><span class="tag dim">${esc(o.traffic)}</span></td>
      <td><a class="btn primary" href="${esc(o.url)}" target="_blank" rel="noopener">Открыть</a><br><small>${esc(o.source)} · ${esc(o.sourceDate)}</small><br><small class="src-url">${esc(o.url)}</small></td>
    </tr>`).join("") || `<tr><td colspan="10" style="padding:26px;text-align:center;color:#5d6b78">Проверенных объявлений нет. Сбросьте фильтры.</td></tr>`;
    if ($("#offer-count")) $("#offer-count").textContent = rows.length + " из " + OFFERS.length + " проверенных " + offersWord(OFFERS.length);
  }

  /* ============================================================
     КУПИТЬ — прямые ссылки из исходного HTML владельца + объявления
     ============================================================ */
  function renderBuy() {
    const box = $("#buy-links");
    if (!box) return;
    const groups = new Map();
    (P.buyLinks || []).forEach(l => {
      if (!groups.has(l.group)) groups.set(l.group, []);
      groups.get(l.group).push(l);
    });
    const shopCards = LOCAL_SHOPS.slice().sort((a, b) => (a.kmCar || 9e9) - (b.kmCar || 9e9))
      .map(sh => `<div class="buy-link" style="display:block">
        <b>${esc(sh.name)} · ${esc(sh.address)}</b>
        <span>от Пролетарской 147: ${esc(sh.distCar)} · ${sh.timeCar} мин · от Маяка: ${esc(sh.distHotel)} · ${sh.timeHotel} мин</span>
        <span class="route-buttons">${routeButtons(null, sh)}</span>
        <small><a href="${esc(mapUrl(sh))}" target="_blank" rel="noopener">Карточка на карте</a> · ${esc(sh.sourceDate || "")}</small>
      </div>`).join("");
    box.innerHTML = `<div class="buy-group">
        <h3>Адреса и маршруты — нажмите кнопку и скиньте человеку</h3>
        <div class="buy-grid">${shopCards}</div>
      </div>` + Array.from(groups, ([name, links]) => `
      <div class="buy-group">
        <h3>${esc(name)}</h3>
        <div class="buy-grid">${links.map(l => `
          <a class="buy-link" href="${esc(l.url)}" target="_blank" rel="noopener">
            <b>${esc(l.name)}</b>
            <span>${esc(l.note)}</span>
            <small>${esc(l.source)} · ${esc(l.url)}</small>
          </a>`).join("")}</div>
      </div>`).join("");

    const offersBox = $("#buy-offers");
    if (offersBox) {
      offersBox.innerHTML = [[16, "205/55 R16 — готовые объявления"], [17, "225/45 R17 — готовые объявления"]]
        .map(([d, label]) => {
          const list = OFFERS.filter(o => o.d === d);
          return `<h3>${label} · ${list.length}</h3><div class="buy-grid">` + list.map(o => `
            <a class="buy-link" href="${esc(o.url)}" target="_blank" rel="noopener">
              <b>${esc(o.name)} ${esc(o.model)}</b>
              <span>${money(o.price)} ₽ за ${o.qty} шт · ${esc(o.seller)} · ${esc(o.date)}</span>
              <small>${esc(o.distCar)} от Пролетарской 147 · ${esc(o.distHotel)} от Маяка</small>
            </a>`).join("") + `</div>`;
        }).join("");
    }
  }

  /* ============================================================
     ОТДЕЛЬНЫЕ ДИСКИ И ЧЕТЫРЕ ВАРИАНТА КОМПЛЕКТОВ
     ============================================================ */
  function woDist(o, from, dist, time) {
    return offerDistCell(o, from, dist, time);
  }

  function renderWheelOffers() {
    const tbody = $("#wheel-offers-body"); if (!tbody) return;
    const note = $("#wheel-offers-sel-note");
    if (note) note.hidden = !(state.wheelOffersFromSelection && !state.sel.wheels.length);
    const source = state.wheelOffersFromSelection ? WOFFERS.filter(matchesSelectedWheel) : WOFFERS;
    const sorted = source.slice().sort((a, b) =>
      (a.diameter || 0) - (b.diameter || 0) ||
      ((a.type === b.type) ? 0 : (a.type === "steel" ? -1 : 1)) ||
      ((typeof a.price === "number" ? a.price : 9e9) - (typeof b.price === "number" ? b.price : 9e9)));
    /* Четыре группы в фиксированном порядке: 16/17 × штамповка/литьё. */
    const groups = [[16, "steel"], [16, "cast"], [17, "steel"], [17, "cast"]];
    const rowHtml = o => {
      const group = `${o.diameter || "?"}″ · ${WTYPE[o.type] || o.type || "тип не указан"}`;
      const sel = state.sel.wheelOffers.includes(o.id);
      const params = [o.widthJ ? o.widthJ + "J×" + o.diameter : null,
        o.et != null ? "ET" + o.et : null, o.pcd, o.cb != null ? "ЦО " + o.cb : null].filter(Boolean).join(" · ");
      const price = typeof o.price === "number"
        ? `<b>${money(o.price)}</b><br><small>за ${o.qty || 1} шт${o.qty === 4 ? " · комплект" : ""}</small>`
        : `<span class="tag dim">цена не указана</span>`;
      return `<tr class="${sel ? "is-selected" : ""}">
        <td class="sticky"><input class="check" type="checkbox" data-check-woffer="${esc(o.id)}" ${sel ? "checked" : ""} aria-label="Выбрать диск"></td>
        <td class="sticky" style="left:38px"><span class="grp ${esc(o.type)}">${esc(group)}</span><br><b>${esc(o.name)}</b><br><small>${esc(o.model || "")}</small></td>
        <td>${esc(params || "параметры не указаны")}</td>
        <td>${esc(o.condition || "—")}</td>
        <td class="num">${price}</td>
        <td class="route-cell"><small>${esc(o.seller || "продавец не указан")}<br>${esc(o.date || "дата не указана")}<br>${esc(o.address || "")}</small>${routeButtons(o.coords, SHOPS[String(o.shop)] || null)}</td>
        <td class="num">${woDist(o, ORIGIN.car, o.distCar, o.timeCar)}</td>
        <td class="num">${woDist(o, ORIGIN.hotel, o.distHotel, o.timeHotel)}</td>
        <td><a class="btn primary" href="${esc(o.url)}" target="_blank" rel="noopener">Открыть</a><br><small>${esc(o.source || "")} · ${esc(o.sourceDate || "")}</small><br><small class="src-url">${esc(o.url)}</small></td>
      </tr>`;
    };
    let html = "";
    const shown = new Set();
    groups.forEach(([d, t]) => {
      const label = `${d}″ · ${WTYPE[t] || t}`;
      const rows = sorted.filter(o => o.diameter === d && o.type === t);
      rows.forEach(o => shown.add(o.id));
      html += `<tr class="group-row"><td colspan="9">${esc(label)}</td></tr>`;
      if (!rows.length) {
        const hint = (d === 17 && t === "steel")
          ? `Штамповки 17″ 5×112 в проверенных локальных точках не найдено — уточните по телефону.`
          : `Позиций с действующей ссылкой-источником нет; без ссылки ничего не подставляется.`;
        html += `<tr><td colspan="9" class="no-data">${hint}</td></tr>`;
        return;
      }
      html += rows.map(rowHtml).join("");
    });
    const other = sorted.filter(o => !shown.has(o.id));
    if (other.length) {
      html += `<tr class="group-row"><td colspan="9">Другие проверенные позиции</td></tr>` + other.map(rowHtml).join("");
    }
    tbody.innerHTML = html || `<tr><td colspan="9" class="no-data">Проверенных предложений по дискам пока нет.</td></tr>`;
    const cnt = $("#wheel-offers-count");
    if (cnt) cnt.textContent = source.length + " проверенных";
  }

  function renderVariants() {
    const tbody = $("#variants-body"); if (!tbody) return;
    if (!VARIANTS.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="no-data">Варианты ещё не собраны: нет проверенных дисков и шин.</td></tr>`;
      if ($("#variants-note")) $("#variants-note").textContent = "Нет данных";
      return;
    }
    tbody.innerHTML = VARIANTS.map((v, i) => {
      const w = woById(v.wheelId), t = offById(v.tireId);
      const wp = w ? wOfferSetPrice(w) : null, tp = t ? offerSetPrice(t) : null;
      const sum = (wp != null && tp != null) ? wp + tp : null;
      const wcell = w
        ? `<a class="name" href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.name)}</a><br><small>${esc(WTYPE[w.type] || w.type)} · ${w.widthJ}J×${w.diameter} · ET${w.et} · ${esc(w.pcd)} · ЦО ${w.cb}</small>${routeButtons(w.coords)}`
        : `<span class="tag bad">нет проверенного диска</span>`;
      const tcell = t
        ? `<a class="name" href="${esc(t.url)}" target="_blank" rel="noopener">${esc(t.name)} ${esc(t.model)}</a><br><small>${esc(t.size)} · ${t.type === "studded" ? "шипы" : "липучка"} · ${esc(t.condition)}</small>${routeButtons(t.coords)}`
        : `<span class="tag bad">нет проверенной шины</span>`;
      return `<tr>
        <td class="num">${i + 1}</td>
        <td><span class="var-name">${esc(v.title)}</span><br><small>${esc(v.note || "")}</small></td>
        <td>${wcell}</td><td>${tcell}</td>
        <td class="num">${wp != null ? money(wp) : "—"}</td>
        <td class="num">${tp != null ? money(tp) : "—"}</td>
        <td class="num"><span class="var-total">${sum != null ? money(sum) : "—"}</span></td>
        <td><button class="btn primary" data-variant-pick="${esc(v.id)}">В памятку</button></td>
      </tr>`;
    }).join("");
    if ($("#variants-note")) $("#variants-note").textContent = VARIANTS.length + " варианта · 16″ и 17″ × штамповка и литьё · монтаж не включён";
  }

  /* ============================================================
     ШИНОМОНТАЖИ — проверенные координаты Яндекс.Карт
     ============================================================ */
  function renderFitters() {
    const box = $("#fitter-body"); if (!box) return;
    const list = P.shops.filter(s => s.kind === "service").slice().sort((a, b) => a.kmCar - b.kmCar);
    box.innerHTML = `<table class="tbl" style="min-width:760px"><thead><tr>
        <th>Шиномонтаж</th><th>Адрес</th>
        <th class="num">от Пролетарской</th><th class="num">от Маяка</th>
        <th>Пробки</th><th>Источник / маршруты</th></tr></thead><tbody>
      ${list.map(sh => `<tr>
        <td><b>${esc(sh.name)}</b></td>
        <td class="fitter-addr"><span class="fitter-addr-txt">${esc(sh.address)}</span>
          ${routeButtons(null, sh)}</td>
        <td class="num"><b>${esc(sh.distCar)}</b><span class="fitter-time">${sh.timeCar} мин в пути</span></td>
        <td class="num"><b>${esc(sh.distHotel)}</b><span class="fitter-time">${sh.timeHotel} мин в пути</span></td>
        <td><span class="tag dim">${esc(sh.traffic)}</span></td>
        <td><a href="${esc(mapUrl(sh))}" target="_blank" rel="noopener">Карточка в Яндексе</a><br><small>${esc(sh.sourceDate)}</small></td>
      </tr>`).join("")}
      </tbody></table>
      <div class="legend-line"><span>Расстояние — отдельной строкой, время — строкой ниже; кнопки «🧭 от Пролетарской» и «🧭 от Маяка» — сразу под адресом.</span><span>Расстояние «590 м» для Shinomaster8 (Волочаевская 69) приведено дословно, без пересчёта в км. Признак пробки в ответах Яндекса не показан — это не значит, что пробок нет.</span></div>`;
  }

  /* ============================================================
     ПАМЯТКА ДЛЯ СЕРГЕЯ
     ============================================================ */
  function renderBasket() {
    const bar = $("#basket"); if (!bar) return;
    const n = state.sel.tires.length + state.sel.wheels.length + state.sel.offers.length + state.sel.wheelOffers.length;
    bar.classList.toggle("open", n > 0);
    document.body.classList.toggle("has-basket", n > 0);
    $("#basket-txt").innerHTML = n
      ? `Выбрано: <b>${state.sel.tires.length}</b> шин · <b>${state.sel.wheels.length}</b> дисков · <b>${state.sel.offers.length}</b> ${offersWord(state.sel.offers.length)} · <b>${state.sel.wheelOffers.length}</b> дисков по объявлениям` : "";
    const btn = $("#basket-open");
    if (btn) btn.dataset.empty = n ? "0" : "1";
  }

  function diameterGroups() {
    const ds = new Set();
    state.sel.wheels.forEach(id => { const w = P.wheels.find(x => x.id === id); if (w) ds.add(w.diameter); });
    state.sel.tires.forEach(k => { const s = skuById(k); if (s) ds.add(s.d); });
    const groups = Array.from(ds).sort((a, b) => a - b);
    state.order = state.order.filter(d => groups.includes(d));
    groups.forEach(d => { if (!state.order.includes(d)) state.order.push(d); });
    return state.order;
  }

  function renderSergey() {
    const box = $("#sergey-body"); if (!box) return;
    const tires = state.sel.tires.map(skuById).filter(Boolean);
    const wheels = state.sel.wheels.map(id => P.wheels.find(w => w.id === id)).filter(Boolean);
    const chosenOffers = state.sel.offers.map(offById).filter(Boolean);
    const chosenWOffers = state.sel.wheelOffers.map(woById).filter(Boolean);
    let html = "";
    if (!tires.length && !wheels.length && !chosenOffers.length && !chosenWOffers.length) {
      html = `<div class="s-empty" style="padding:26px;text-align:center;font-size:18px">
        Памятка пуста: владелец ещё не отметил позиции.<br>
        Отметьте галочками объявления в таблице проверенных предложений — здесь появятся цена, расстояния и ссылки.
        Ничего не подставляется «наобум».</div>`;
    } else {
      const groups = diameterGroups();
      html = `<h2>Памятка: что купить и куда ехать</h2>
        <div class="when">Уссурийск${groups.length ? " · " + groups.map(d => d + '"').join(" и ") : ""} · забрать и переобуть сегодня</div>`;
      groups.forEach((d, idx) => {
        const gt = tires.filter(t => t.d === d), gw = wheels.filter(w => w.diameter === d);
        html += `<div class="s-card">
          <div class="role">Комплект ${idx + 1} · ${d}" ${idx === 0 ? "· основной" : "· запасной"}</div>
          <div class="no-print" style="display:flex;gap:8px;margin-bottom:8px">
            <button class="btn" data-priority="${d}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>↑ выше</button>
            <button class="btn" data-priority="${d}" data-dir="1" ${idx === groups.length - 1 ? "disabled" : ""}>↓ ниже</button>
          </div>
          ${gt.length ? `<div class="ttl">Шины · нужно 4 шт</div>
            <table class="tbl" style="min-width:520px"><thead><tr><th>Модель</th><th>Размер</th><th>Тип</th><th>Предложение</th></tr></thead><tbody>
            ${gt.map(t => `<tr><td>${esc(t.tire.brand)} ${esc(t.tire.model)}</td><td>${esc(t.v.size)} ${esc(t.v.load)}</td>
              <td>${t.tire.type === "studded" ? "шипы" : "липучка"}</td><td>${offerCell(t.key)}</td></tr>`).join("")}
            </tbody></table>` : `<div class="addr">Шины ${d}" не выбраны.</div>`}
          ${gw.length ? `<div class="ttl" style="margin-top:10px">Диски · нужно 4 шт</div>
            <table class="tbl" style="min-width:520px"><thead><tr><th>Модель</th><th>Параметры</th><th>Состояние</th><th>Предложение</th></tr></thead><tbody>
            ${gw.map(w => `<tr><td>${esc(w.brand)} ${esc(w.model)}</td><td>${w.widthJ}J×${w.diameter} ET${w.et} · ${esc(w.pcd)} · ЦО ${w.cb}</td>
              <td>${WCOND[w.condition]}</td><td>${offerCell(w.id)}</td></tr>`).join("")}
            </tbody></table>` : d === 16 ? `<div class="addr">Для 16" нужны отдельные диски 5×112: штатные 17" не подойдут.</div>` : ""}
        </div>`;
      });

      // несовместимость 16/17 честно показываем как отдельное предупреждение
      if (groups.includes(16) && groups.includes(17)) {
        html += `<div class="s-card"><div class="role">Два разных комплекта</div>
          <div class="addr">205/55 R16 ставится только на диски 16", 225/45 R17 — только на диски 17". Это два отдельных набора: смешивать диски и резину разных диаметров нельзя.</div></div>`;
      }

      // отмеченные объявления: единственный источник цены и distances
      if (chosenOffers.length) {
        html += `<div class="s-card"><div class="role">Отмеченные объявления — открыть и проверить</div>` +
          chosenOffers.map(o => `<div style="margin-bottom:16px">
            <div class="ttl">${esc(o.name)} ${esc(o.model)}</div>
            <div class="addr">${esc(o.size)} · ${esc(o.condition)}${o.year ? ", " + esc(o.year) : ""} · ${money(o.price)} за ${o.qty} шт · ${money(offerSetPrice(o))} за комплект 4</div>
            <div class="addr">Продавец: ${esc(o.seller)} · ${esc(o.date)} · источник: ${esc(o.source)}, ${esc(o.sourceDate)}</div>
            <div class="addr">Уличный адрес не раскрыт; координаты из объявления: ${esc(o.coords || "нет")}</div>
            <div class="addr">от Пролетарской 147: <b>${esc(o.distCar)}</b>${o.timeCar != null ? " · " + o.timeCar + " мин в пути" : ""}</div>
            <div class="addr">от Маяка, Краснознамённая 56: <b>${esc(o.distHotel)}</b>${o.timeHotel != null ? " · " + o.timeHotel + " мин в пути" : ""}</div>
            <div class="addr">${routeButtons(o.coords)}</div>
            <div class="addr">${esc(o.traffic)}</div>
            <a class="nav-big" href="${esc(o.url)}" target="_blank" rel="noopener">Открыть объявление</a>
          </div>`).join("") + `</div>`;
        html += `<div class="s-card"><div class="role">Сколько денег брать</div>
          <div class="ttl">${money(chosenOffers.reduce((a, o) => a + offerSetPrice(o), 0))}</div>
          <div class="addr">Сумма — только по отмеченным объявлениям со ссылками, из расчёта комплект 4 шт. ${esc(P.meta.mountsNote)}</div></div>`;
      }

      // отдельные диски: только отмеченные объявления с проверенными ссылками
      if (chosenWOffers.length) {
        html += `<div class="s-card"><div class="role">Отдельные диски — открыть и проверить</div>` +
          chosenWOffers.map(w => {
            const pr = wOfferSetPrice(w);
            const params = [w.widthJ ? w.widthJ + "J×" + w.diameter : null,
              w.et != null ? "ET" + w.et : null, w.pcd, w.cb != null ? "ЦО " + w.cb : null].filter(Boolean).join(" · ");
            return `<div style="margin-bottom:16px">
              <div class="ttl">${esc(w.name)}</div>
              <div class="addr">${esc(WTYPE[w.type] || w.type || "")} · ${esc(params || "параметры не указаны")} · ${esc(w.condition || "")}</div>
              <div class="addr">${pr != null ? money(pr) + " за 4 диска" : "цена не указана"} · ${esc(w.seller || "продавец не указан")} · ${esc(w.date || "")}</div>
              ${w.distCar ? `<div class="addr">от Пролетарской 147: <b>${esc(w.distCar)}</b>${w.timeCar != null ? " · " + w.timeCar + " мин в пути" : ""}</div>` : ""}
              ${w.distHotel ? `<div class="addr">от Маяка, Краснознамённая 56: <b>${esc(w.distHotel)}</b>${w.timeHotel != null ? " · " + w.timeHotel + " мин в пути" : ""}</div>` : ""}
              <div class="addr">${routeButtons(w.coords)}</div>
              <div class="addr">источник: ${esc(w.source || "")}, ${esc(w.sourceDate || "")}</div>
              <a class="nav-big" href="${esc(w.url)}" target="_blank" rel="noopener">Открыть предложение по дискам</a>
            </div>`;
          }).join("") + `</div>`;
      }

      // точки из карточек магазинов, привязанные к выбранным позициям
      const keys = tires.map(t => t.key).concat(wheels.map(w => w.id));
      const rowsOffers = OFFERS.filter(o => keys.includes(o.sku));
      if (rowsOffers.length) {
        const ids = Array.from(new Set(rowsOffers.map(o => o.shop))).sort((a, b) => (SHOPS[a] ? SHOPS[a].kmCar : 9e9) - (SHOPS[b] ? SHOPS[b].kmCar : 9e9));
        html += `<div class="s-card"><div class="role">Куда ехать — только проверенные точки</div>
          ${ids.map(id => {
            const sh = SHOPS[id]; if (!sh) return "";
            return `<div style="margin-bottom:12px"><div class="ttl">${esc(sh.name)}</div>
              <div class="addr">${esc(sh.address)}</div>
              <div class="addr">от Пролетарской 147: ${esc(sh.distCar)} · ${sh.timeCar} мин · от Маяка: ${esc(sh.distHotel)} · ${sh.timeHotel} мин · ${esc(sh.traffic)}</div>
              <a class="nav-big" href="${esc(navCar(sh))}" target="_blank" rel="noopener">🧭 от Пролетарской 147</a>
              <a class="nav-big" href="${esc(navHotel(sh))}" target="_blank" rel="noopener">🧭 от Маяка</a>
              <a class="tel-big" href="${esc(mapUrl(sh))}" target="_blank" rel="noopener">Карточка в Яндексе</a></div>`;
          }).join("")}</div>`;
      }
      if (!rowsOffers.length && !chosenOffers.length && !chosenWOffers.length) {
        html += `<div class="s-card"><div class="role">Куда ехать</div>
          <div class="addr">Проверенных предложений по выбранным позициям нет: адрес и цена не выдумываются. Отметьте галочками объявления в таблице проверенных предложений — там есть ссылка и расстояния от обеих точек.</div></div>`;
      }

      html += `<div class="s-card"><div class="role">Проверь при покупке</div>
        <div class="s-check">Шины: 4 одинаковые, размер 205/55 R16 или 225/45 R17, дата DOT не старше 2 лет</div>
        <div class="s-check">Диски: 5×112, ЦО 57,1, ET 46–51, без биения</div>
        <div class="s-check">Болты: M14×1,5×27, затяжка 120 Н·м крест-накрест</div>
        <div class="s-check">Метки: жёлтая точка шины — напротив вентиля</div>
        <div class="s-check">Балансировка: грузиков не больше 60–80 г на колесо</div>
        <div class="s-check">Дотяжка болтов через 50–100 км</div></div>`;
    }
    html += `<div class="no-print" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
      <button class="btn primary" id="print-btn">🖨 Распечатать / сохранить PDF</button>
      <button class="btn" data-goto="tires">← Вернуться к выбору шин</button></div>`;
    box.innerHTML = html;
  }

  /* ============================================================
     ПОЛЗУНКИ И ПРЕСЕТЫ
     ============================================================ */
  function renderWeights() {
    $$("[data-weight]").forEach(el => {
      const k = el.dataset.weight;
      el.value = state.weights[k] || 0;
      const out = $(" [data-weight-val='" + k + "']");
      if (out) out.textContent = (state.weights[k] || 0) + "%";
    });
    $$("[data-preset]").forEach(b => b.setAttribute("aria-pressed", b.dataset.preset === state.preset ? "true" : "false"));
    const cb = $("#only-selected"); if (cb) cb.checked = state.onlySelected;
    const cb2 = $("#offers-only-selected"); if (cb2) cb2.checked = state.onlySelected;
  }
  function applyPreset(id) {
    const pr = P.meta.presets.find(p => p.id === id); if (!pr) return;
    state.preset = id;
    state.weights = Object.assign({}, pr.w);
    renderWeights(); saveSel();
    renderTireTable(); renderCharts();
  }

  /* ============================================================
     СОБЫТИЯ
     ============================================================ */
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-open-tire],[data-open-wheel],[data-sort-t],[data-sort-w],[data-close-detail],[data-goto],[data-size],[data-preset],[data-priority],[data-variant-pick],#print-btn,.zoomable");
    if (!t) return;
    if (t.matches("[data-size]")) {
      const d = t.dataset.size;
      if (t.closest("#wheel-tbody")) { state.wSize = d; setSeg("#seg-wsize", d); renderWheelTable(); }
      else { state.tSize = d; setSeg("#seg-tsize", d); renderTireTable(); renderCharts(); renderSets(); }
      return;
    }
    if (t.matches("[data-open-tire]")) { openTire(t.dataset.openTire); return; }
    if (t.matches("[data-open-wheel]")) { openWheel(t.dataset.openWheel); return; }
    if (t.matches("[data-close-detail]")) { $("#detail-" + t.dataset.closeDetail).hidden = true; return; }
    if (t.matches("#print-btn")) { window.print(); return; }
    if (t.matches("[data-goto]")) {
      const g = t.dataset.goto;
      const id = g === "tires" ? "sec-tires" : g === "offers" ? "sec-wheel-offers" : "sec-wheels";
      $("#" + id).scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (t.matches(".zoomable")) { window.open(t.src, "_blank"); return; }
    if (t.matches("[data-sort-t]")) {
      const k = t.dataset.sortT;
      state.tSort = { key: k, dir: state.tSort.key === k ? -state.tSort.dir : (["name", "type", "offer"].includes(k) ? 1 : -1) };
      renderTireHead(); renderTireTable(); return;
    }
    if (t.matches("[data-sort-w]")) {
      const k = t.dataset.sortW;
      state.wSort = { key: k, dir: state.wSort.key === k ? -state.wSort.dir : (["name", "type", "condition"].includes(k) ? 1 : -1) };
      renderWheelHead(); renderWheelTable(); return;
    }
    if (t.matches("[data-preset]")) { applyPreset(t.dataset.preset); return; }
    if (t.matches("[data-variant-pick]")) {
      const v = VARIANTS.find(x => x.id === t.dataset.variantPick); if (!v) return;
      if (v.wheelId) state.sel.wheelOffers = [...new Set([...state.sel.wheelOffers, v.wheelId])];
      if (v.tireId) state.sel.offers = [...new Set([...state.sel.offers, v.tireId])];
      saveSel(); renderWheelOffers(); renderOffers(); return;
    }
    if (t.matches("[data-priority]")) {
      const d = +t.dataset.priority, dir = +t.dataset.dir;
      const g = diameterGroups(), i = g.indexOf(d), j = i + dir;
      if (i > -1 && j > -1 && j < g.length) {
        [g[i], g[j]] = [g[j], g[i]];
        state.order = g; saveSel();
      }
      return;
    }
  });

  document.addEventListener("change", e => {
    const c = e.target;
    if (c.matches("[data-check-tire]")) {
      const k = c.dataset.checkTire;
      state.sel.tires = c.checked ? [...new Set([...state.sel.tires, k])] : state.sel.tires.filter(x => x !== k);
      saveSel(); renderTireTable(); renderSets(); renderCharts();
      if (state.offersFromSelection) renderOffers();
      return;
    }
    if (c.matches("[data-check-wheel]")) {
      const id = c.dataset.checkWheel;
      state.sel.wheels = c.checked ? [...new Set([...state.sel.wheels, id])] : state.sel.wheels.filter(x => x !== id);
      saveSel(); renderWheelTable(); renderSets();
      if (state.wheelOffersFromSelection) renderWheelOffers();
      return;
    }
    if (c.matches("[data-check-set]")) {
      const parts = c.dataset.checkSet.split("|");
      const key = parts[0] + "|" + parts[1], id = parts[2];
      state.sel.tires = c.checked ? [...new Set([...state.sel.tires, key])] : state.sel.tires.filter(x => x !== key);
      state.sel.wheels = c.checked ? [...new Set([...state.sel.wheels, id])] : state.sel.wheels.filter(x => x !== id);
      saveSel(); renderTireTable(); renderWheelTable(); renderSets(); return;
    }
    if (c.id === "t-group") { state.tGroup = c.value; renderTireTable(); }
    if (c.id === "w-group") { state.wGroup = c.value; renderWheelTable(); }
    if (c.id === "t-shop") { state.tShop = c.value; renderTireTable(); }
    if (c.id === "offer-size") { state.oSize = c.value; renderOffers(); }
    if (c.id === "offer-type") { state.oType = c.value; renderOffers(); }
    if (c.id === "offers-only-selected") {
      state.onlySelected = c.checked;
      const twin = $("#only-selected"); if (twin) twin.checked = c.checked;
      saveSel(); renderTireTable(); renderWheelTable(); renderCharts(); renderOffers();
    }
    if (c.matches("[data-check-offer]")) {
      const id = c.dataset.checkOffer;
      state.sel.offers = c.checked ? [...new Set([...state.sel.offers, id])] : state.sel.offers.filter(x => x !== id);
      saveSel(); renderOffers(); return;
    }
    if (c.matches("[data-check-woffer]")) {
      const id = c.dataset.checkWoffer;
      state.sel.wheelOffers = c.checked ? [...new Set([...state.sel.wheelOffers, id])] : state.sel.wheelOffers.filter(x => x !== id);
      saveSel(); renderWheelOffers(); return;
    }
    if (c.id === "only-selected") {
      state.onlySelected = c.checked; saveSel(); renderTireTable(); renderWheelTable(); renderCharts(); renderOffers();
    }
  });

  document.addEventListener("input", e => {
    if (e.target.id === "t-search") { state.tSearch = e.target.value; renderTireTable(); return; }
    if (e.target.matches("[data-weight]")) {
      state.weights[e.target.dataset.weight] = +e.target.value;
      state.preset = "custom";
      renderWeights(); saveSel(); renderTireTable(); renderCharts();
    }
  });

  function showOffersFor(sku) {
    state.offerFilter = sku;
    renderOffers();
    $("#sec-offers")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  /* Дрилл-даун по цене не трогает сегменты «Все / Только выбранные». */
  document.addEventListener("click", e => {
    const a = e.target && e.target.closest && e.target.closest("[data-offer-sku]");
    if (a) { e.preventDefault(); showOffersFor(a.dataset.offerSku); return; }
    if (e.target && e.target.closest && e.target.closest("#offer-filter-reset")) {
      state.offerFilter = null; renderOffers();
    }
  });

  function bindBoolSeg(sel, key, after) {
    const sync = () => $$(sel + " button").forEach(x =>
      x.setAttribute("aria-pressed", x.dataset.v === "selected" ? "true" : "false"));
    $$(sel + " button").forEach(b => b.addEventListener("click", () => {
      state[key] = b.dataset.v === "selected";
      sync(); saveSel(); after();
    }));
    sync();
  }
  function bootRefreshControls() {
    const mp = $("#max-price"); if (mp) mp.value = state.maxPrice == null ? "" : String(state.maxPrice);
    ["pri-1", "pri-2", "pri-3"].forEach((id, i) => {
      const el = $("#" + id); if (!el) return;
      el.value = (state.priority[i] || {}).key || "score";
      const btn = $(`[data-dir="${id}"]`);
      if (btn) btn.textContent = (state.priority[i] || {}).dir < 0 ? "↓" : "↑";
    });
    const multi = $("#shop-multi");
    if (multi) Array.from(multi.options).forEach(o => {
      o.selected = state.shopIds.includes(o.value);
    });
    const one = $("#one-shop"); if (one) one.checked = state.oneShopOnly;
    const syncSeg = (sel, on) => $$(sel + " button").forEach(x =>
      x.setAttribute("aria-pressed", (x.dataset.v === "selected") === on ? "true" : "false"));
    syncSeg("#seg-offers-sel", state.offersFromSelection);
    syncSeg("#seg-wheel-offers-sel", state.wheelOffersFromSelection);
  }

  function bindSeg(sel, key, after) {
    $$(sel + " button").forEach(b => b.addEventListener("click", () => {
      state[key] = b.dataset.v;
      $$(sel + " button").forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
      after();
    }));
  }
  function setSeg(sel, v) {
    $$(sel + " button").forEach(x => x.setAttribute("aria-pressed", x.dataset.v === v ? "true" : "false"));
  }

  function boot() {
    renderTireHead(); renderTireTable();
    renderWheelHead(); renderWheelTable();
    renderBuy(); renderWheelOffers(); renderVariants(); renderCharts(); renderSets(); renderOffers();
    renderFitters(); renderBasket(); renderSergey(); renderWeights();

    bindSeg("#seg-tsize", "tSize", () => { renderTireTable(); renderCharts(); renderSets(); });
    bindSeg("#seg-ttype", "tType", renderTireTable);
    bindSeg("#seg-wsize", "wSize", renderWheelTable);
    bindSeg("#seg-wtype", "wType", renderWheelTable);

    const shopSel = $("#t-shop");
    if (shopSel) {
      shopSel.innerHTML = `<option value="all">Все точки</option>` +
        LOCAL_SHOPS.map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join("");
      shopSel.value = state.tShop;
    }
    const weightBox = $("#weight-box");
    if (weightBox) {
      weightBox.innerHTML = `<div class="preset-row">` + P.meta.presets.map(p =>
        `<button class="btn" data-preset="${p.id}" aria-pressed="false">${esc(p.label)}</button>`).join("") + `</div>` +
        `<div class="weight-rows">` + Object.keys(DIMS).map(k => `<label class="weight-row"><span>${DIMS[k]}</span>
          <input type="range" min="0" max="50" step="5" data-weight="${k}" aria-label="Вес: ${DIMS[k]}">
          <b data-weight-val="${k}">0%</b></label>`).join("") + `</div>` +
        `<div class="legend-line" title="${esc(P.meta.testNote)}"><span>${esc(P.meta.testNote)}</span><span>${HAS_OFFERS ? "" : "Цена не влияет на сортировку, пока нет проверенных предложений."}</span></div>`;
    }
    /* v1.6: панель сортировки, лимита цены и выбора магазинов */
    const priorityLabels = {
      score: "Общий балл", price: "Цена/шт", approx: "Комплект ×4", braking: "Торможение",
      ice: "Лёд", snow: "Снег", wet: "Мокрое", dry: "Сухое",
      comfort: "Комфорт", quiet: "Тишина", shop: "Магазин", name: "Название"
    };
    ["pri-1", "pri-2", "pri-3"].forEach(id => {
      const el = $("#" + id); if (!el) return;
      el.innerHTML = `<option value="">— не использовать —</option>` +
        SORT.KEYS.map(k => `<option value="${k}">${esc(priorityLabels[k] || k)}</option>`).join("");
      el.addEventListener("change", () => {
        const i = +id.slice(-1) - 1;
        if (!el.value) delete state.priority[i];
        else state.priority[i] = { key: el.value, dir: (state.priority[i] || {}).dir || -1 };
        state.priority = state.priority.filter(Boolean).slice(0, 3);
        saveSel(); renderTireTable();
      });
    });
    $$("[data-dir]").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.dir.slice(-1) - 1, p = state.priority[i];
      if (!p) return;
      p.dir = -p.dir; b.textContent = p.dir < 0 ? "↓" : "↑";
      saveSel(); renderTireTable();
    }));
    const mp = $("#max-price");
    if (mp) mp.addEventListener("input", () => {
      const v = String(mp.value).trim();
      state.maxPrice = v === "" ? null : Number(v);
      saveSel(); renderTireTable(); renderCharts();
    });
    const shopMulti = $("#shop-multi");
    if (shopMulti) {
      shopMulti.innerHTML = LOCAL_SHOPS
        .map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join("");
      shopMulti.addEventListener("change", () => {
        state.shopIds = Array.from(shopMulti.selectedOptions).map(o => o.value);
        saveSel(); renderTireTable(); renderWheelTable(); renderCharts();
      });
    }
    const oneShop = $("#one-shop");
    if (oneShop) oneShop.addEventListener("change", () => {
      state.oneShopOnly = oneShop.checked;
      saveSel(); renderTireTable(); renderWheelTable();
    });
    $("#sort-reset")?.addEventListener("click", () => {
      state.maxPrice = null; state.priority = [{ key: "score", dir: -1 }];
      state.shopIds = []; state.oneShopOnly = false;
      bootRefreshControls(); saveSel();
      renderTireTable(); renderWheelTable(); renderCharts();
    });
    $("#select-visible")?.addEventListener("click", () => {
      const vis = filteredTires();
      state.sel.tires = [...new Set([...state.sel.tires, ...vis.map(s => s.key)])];
      saveSel(); renderTireTable(); renderSets(); renderCharts();
    });
    $("#select-visible-wheels")?.addEventListener("click", () => {
      const vis = filteredWheels();
      state.sel.wheels = [...new Set([...state.sel.wheels, ...vis.map(w => w.id)])];
      saveSel(); renderWheelTable(); renderSets();
    });
    bindBoolSeg("#seg-offers-sel", "offersFromSelection", renderOffers);
    bindBoolSeg("#seg-wheel-offers-sel", "wheelOffersFromSelection", renderWheelOffers);
    bootRefreshControls();

    $("#basket-open")?.addEventListener("click", () => $("#sec-sergey").scrollIntoView({ behavior: "smooth" }));
    $("#basket-clear")?.addEventListener("click", () => {
      state.sel = { tires: [], wheels: [], offers: [], wheelOffers: [] }; state.order = [];
      saveSel(); renderTireTable(); renderWheelTable(); renderSets(); renderOffers(); renderWheelOffers();
    });
    const footVer = $("#ver-foot"); if (footVer) footVer.textContent = "v" + P.meta.version;
    const os = $("#offer-size"), ot = $("#offer-type");
    if (os) os.value = state.oSize;
    if (ot) ot.value = state.oType;

    // Юр. щит v1.0 — без изменений (§0.8 AGENTS.md)
    const LEGAL_KEY = "sagitar-legal-accepted-v1";
    const modal = $("#legal-modal");
    const isFirst = () => { try { return localStorage.getItem(LEGAL_KEY) !== "1"; } catch (e) { return true; } };
    const closeLegal = () => {
      if (!modal || modal.dataset.first === "1") return;
      modal.classList.remove("open");
      document.body.classList.remove("legal-lock");
    };
    if (modal && isFirst()) {
      modal.dataset.first = "1";
      modal.classList.add("open");
      document.body.classList.add("legal-lock");
    }
    $$("[data-legal]").forEach(b => b.addEventListener("click", ev => {
      ev.preventDefault(); if (!modal) return;
      modal.classList.add("open"); document.body.classList.add("legal-lock");
    }));
    $$("[data-accept-legal]").forEach(b => b.addEventListener("click", () => {
      try { localStorage.setItem(LEGAL_KEY, "1"); } catch (e) { }
      if (modal) { delete modal.dataset.first; modal.classList.remove("open"); }
      document.body.classList.remove("legal-lock");
    }));
    $$("#legal-modal [data-close]").forEach(b => b.addEventListener("click", closeLegal));
    modal?.addEventListener("click", ev => { if (ev.target.id === "legal-modal") closeLegal(); });
    document.addEventListener("keydown", ev => { if (ev.key === "Escape") closeLegal(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
