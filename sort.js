/* v1.6: чистый модуль сортировки — без DOM и без window.PROJECT на входе. */
(function (root) {
  "use strict";

  const KEYS = ["price", "approx", "braking", "ice", "snow", "wet", "dry", "comfort", "quiet", "score", "shop", "name"];
  const SCORE_KEYS = ["ice", "snow", "wet", "dry", "comfort", "quiet"];

  const hasScores = t => !!t && SCORE_KEYS.every(k => Number.isFinite(t[k]));
  const braking = t => (t && Number.isFinite(t.wet) && Number.isFinite(t.dry))
    ? (t.wet + t.dry) / 2
    : null;

  const list = a => (Array.isArray(a) ? a : []);
  const shopId = s => (s == null ? "" : String(s));

  /* Цена всегда за один баллон/диск. qty: 4 без computed — цена за 4 шт.,
     с computed: true price уже сохранён за баллон — делить повторно нельзя. */
  function unitPrice(o) {
    if (!o || !Number.isFinite(o.price) || o.price <= 0) return null;
    if (o.qty === 4) return o.computed === true ? o.price : o.price / 4;
    return o.price;
  }

  const priceOf = (row, offers) => {
    if (!row) return null;
    const a = list(offers)
      .filter(o => o && o.sku === row.key)
      .map(unitPrice)
      .filter(p => p != null);
    return a.length ? Math.min.apply(null, a) : null;
  };

  /* Лимит цены — только по проверенным предложениям. */
  function verifiedPriceOf(row, offers) {
    if (!row) return null;
    const a = list(offers)
      .filter(o => o && o.sku === row.key && o.verified === true)
      .map(unitPrice)
      .filter(p => p != null);
    return a.length ? Math.min.apply(null, a) : null;
  }

  const shopOf = (row, offers) => {
    if (!row) return "";
    const a = list(offers).filter(o => o && o.sku === row.key && o.shop);
    return a.length ? shopId(a[0].shop) : "";
  };

  const shopsWithBoth = ctx => {
    const c = ctx || {};
    const selected = list(c.shopIds).map(shopId).filter(Boolean);
    const ids = selected.length ? new Set(selected) : null;
    const physical = new Set(list(c.shops)
      .filter(s => s && s.storeType === "physical" && s.id)
      .map(s => shopId(s.id)));
    const eligible = shop => physical.has(shop) && (!ids || ids.has(shop));

    const withTires = new Set(list(c.offers)
      .filter(o => o && o.shop && eligible(shopId(o.shop)) && unitPrice(o) != null)
      .map(o => shopId(o.shop)));
    const withWheels = new Set(list(c.wheelOffers)
      .filter(o => o && o.shop && eligible(shopId(o.shop)) && Number(o.diameter) === 16 && unitPrice(o) != null)
      .map(o => shopId(o.shop)));
    return Array.from(withTires).filter(s => withWheels.has(s));
  };

  function wheelPrice(ctx, shop) {
    const a = list(ctx && ctx.wheelOffers)
      .filter(o => o && shopId(o.shop) === shopId(shop) && Number(o.diameter) === 16)
      .map(unitPrice)
      .filter(p => p != null);
    return a.length ? Math.min.apply(null, a) : null;
  }

  function value(row, key, c) {
    if (!row) return null;
    if (key === "price") return priceOf(row, c.offers);
    if (key === "approx") {
      const p = priceOf(row, c.offers);
      return p == null ? null : p * 4;
    }
    if (key === "braking") return braking(row.scores);
    if (key === "shop") return shopOf(row, c.offers);
    if (key === "name") return String(row.name || "");
    if (key === "score") {
      if (typeof c.scoreOf === "function") {
        try {
          const v = c.scoreOf(row);
          return Number.isFinite(v) ? v : null;
        } catch (e) {
          return null;
        }
      }
      return Number.isFinite(row.score) ? row.score : null;
    }
    return row.scores && Number.isFinite(row.scores[key]) ? row.scores[key] : null;
  }

  function sortRows(rows, ctx) {
    const c = Object.assign({ offers: [], wheelOffers: [], shops: [], shopIds: [], priority: [] }, ctx || {});
    const priority = list(c.priority);
    const all = list(rows);
    let out = all.slice();

    if (c.maxPrice != null && Number.isFinite(Number(c.maxPrice))) {
      const limit = Number(c.maxPrice);
      out = out.filter(r => {
        const p = verifiedPriceOf(r, c.offers);
        return p != null && p <= limit;
      });
    }

    const selectedIds = list(c.shopIds).map(shopId).filter(Boolean);
    if (selectedIds.length) {
      const ids = new Set(selectedIds);
      out = out.filter(r => list(c.offers).some(o =>
        o && o.sku === r.key && ids.has(shopId(o.shop)) && unitPrice(o) != null));
    }

    let both = [];
    if (c.oneShopOnly) {
      both = shopsWithBoth(c);
      const ids = new Set(both);
      out = out.filter(r => list(c.offers).some(o =>
        o && o.sku === r.key && ids.has(shopId(o.shop)) && unitPrice(o) != null));
    }

    out.sort((a, b) => {
      if (typeof c.groupOf === "function") {
        const ga = c.groupOf(a) == null ? "" : String(c.groupOf(a));
        const gb = c.groupOf(b) == null ? "" : String(c.groupOf(b));
        if (ga !== gb) return ga.localeCompare(gb, "ru");
      }
      for (const p of priority) {
        if (!p || !KEYS.includes(p.key)) continue;
        const va = value(a, p.key, c);
        const vb = value(b, p.key, c);
        if (va == null && vb == null) continue;
        if (va == null) return 1;   // null всегда внизу, независимо от dir
        if (vb == null) return -1;
        const cmp = (typeof va === "string" || typeof vb === "string")
          ? String(va).localeCompare(String(vb), "ru")
          : va - vb;
        if (cmp) return cmp * (p.dir < 0 ? -1 : 1);
      }
      const byName = String(a.name || "").localeCompare(String(b.name || ""), "ru");
      return byName || String(a.key || "").localeCompare(String(b.key || ""), "ru");
    });

    let total = null;
    if (c.oneShopOnly && both.length) {
      const candidates = [];
      for (const shop of both) {
        /* Сумма — для первой видимой шины, у которой есть предложения
           в этом магазине; цена берётся минимальной среди её предложений. */
        let tire = null;
        for (const r of out) {
          const tirePrices = list(c.offers)
            .filter(o => o && o.sku === r.key && shopId(o.shop) === shop)
            .map(unitPrice)
            .filter(p => p != null);
          if (tirePrices.length) {
            tire = Math.min.apply(null, tirePrices);
            break;
          }
        }
        const wheel = wheelPrice(c, shop);
        if (tire != null && wheel != null) candidates.push(Math.round(tire * 4 + wheel * 4));
      }
      if (candidates.length) total = Math.min.apply(null, candidates);
    }

    return { rows: out, hidden: all.length - out.length, total, shops: both };
  }

  const api = { KEYS, hasScores, braking, priceOf, shopOf, shopsWithBoth, sortRows };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.TireSort = api;
})(typeof window !== "undefined" ? window : globalThis);
