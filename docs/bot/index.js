/**
 * Az Apps Feedback Bot — production (Yandex Cloud Functions, nodejs22)
 * Два чата: приватный -1004488836100 (темы 3/4 — только владелец),
 * рабочий -1004468544127 (темы 54/55 — ошибки и улучшения).
 * Telegram API из YC доступен только через IP 149.154.167.220 (SNI api.telegram.org).
 * Маршрутизация: скрытый zero-width маркер + привязка «тема → пользователь» в S3.
 * Все пользовательские тексты: одна смысловая фраза — одна строка.
 * Секреты (TG_BOT_TOKEN, ключи S3) — только в env функции, в коде их нет.
 */
/** Скопировано из ⚙ Техническое/telegram_support_bot_yandex_cloud.js с реальными threadId. */
const BOT_TOKEN = process.env.TG_BOT_TOKEN || "";
const BOT_ID = 9077740806;

const DEFAULT_ROUTING_TABLE = {
  auto_kitay: {
    appName: "Авто из Китая — Расчёт и Сопровождение",
    welcome: "Здравствуйте!\nВы обратились по приложению <b>«Авто из Китая»</b>.\nВне приложения доступны только личный вопрос и взаимодействие.\nОшибки и улучшения принимаются только из приложения.\nВыберите тему обращения:",
    // Внешний доступ (кнопки бота): только приватные направления.
    buttons: [
      { id: "author",  label: "✉️ Связаться с автором",  chatId: -1004488836100, threadId: 3 },
      { id: "partner", label: "🤝 Взаимодействие",        chatId: -1004488836100, threadId: 4 }
    ],
    // Полный спектр из приложения: приватные направления + рабочие темы.
    appButtons: [
      { id: "author",  label: "✉️ Связаться с автором",       chatId: -1004488836100, threadId: 3 },
      { id: "idea",    label: "💡 Предложить улучшение",       chatId: -1004468544127, threadId: 54 },
      { id: "bug",     label: "🐞 Сообщить о проблеме",        chatId: -1004468544127, threadId: 55 },
      { id: "partner", label: "🤝 Взаимодействие",             chatId: -1004488836100, threadId: 4 }
    ]
  },
  sagitar_shiny_diski: {
    appName: "Sagitar · Шины и диски — подбор всей России",
    welcome: "Здравствуйте!\nВы обратились по приложению <b>«Sagitar · Шины и диски»</b> — подбор всей России.\nПриложение и тема уже определены — просто напишите обращение.\nЕсли хотите другую тему — выберите её кнопкой ниже.",
    buttons: [
      { id: "author",  label: "✉️ Связаться с автором",    chatId: -1004488836100, threadId: 39 },
      { id: "idea",    label: "💡 Предложить улучшение",    chatId: -1004468544127, threadId: 95 },
      { id: "bug",     label: "🐞 Сообщить о проблеме",     chatId: -1004468544127, threadId: 92 },
      { id: "partner", label: "🤝 Взаимодействие",          chatId: -1004488836100, threadId: 42 }
    ],
    appButtons: [
      { id: "author",  label: "✉️ Связаться с автором",    chatId: -1004488836100, threadId: 39 },
      { id: "idea",    label: "💡 Предложить улучшение",    chatId: -1004468544127, threadId: 95 },
      { id: "bug",     label: "🐞 Сообщить о проблеме",     chatId: -1004468544127, threadId: 92 },
      { id: "partner", label: "🤝 Взаимодействие",          chatId: -1004488836100, threadId: 42 }
    ]
  },
};

function resolveButton(cfg, topicId) {
  if (!cfg) return null;
  const list = cfg.appButtons || cfg.buttons || [];
  return list.find(b => b.id === String(topicId || "")) || null;
}
function parseStartPayload(arg, table) {
  const token = String(arg || "").trim();
  if (!token) return null;
  const keys = Object.keys(table || {}).sort((a, b) => b.length - a.length);
  for (const appKey of keys) {
    if (token === appKey) return { appKey, topicId: null };
    if (token.startsWith(appKey + "_")) {
      const topicId = token.slice(appKey.length + 1);
      return resolveButton(table[appKey], topicId)
        ? { appKey, topicId }
        : { appKey, topicId: null };
    }
  }
  return null;
}
function mergeRoutingTable(defaultTable, json) {
  if (!json) return defaultTable;
  let overrides;
  try { overrides = JSON.parse(json); } catch (e) { return defaultTable; }
  if (!overrides || typeof overrides !== "object") return defaultTable;
  const out = Object.assign({}, defaultTable);
  Object.keys(overrides).forEach(k => {
    out[k] = Object.assign({}, out[k] || {}, overrides[k] || {});
  });
  return out;
}
function buildDeepLink(appKey, topicId) {
  const suffix = topicId ? "_" + topicId : "";
  return "https://t.me/AzAppsFeedbackBot?start=" + String(appKey) + suffix;
}
function planStart(arg, table) {
  const route = parseStartPayload(arg, table);
  if (route && route.appKey && table[route.appKey]) {
    if (route.topicId && resolveButton(table[route.appKey], route.topicId))
      return { type: "prompt", appKey: route.appKey, topicId: route.topicId };
    return { type: "topics", appKey: route.appKey };
  }
  return { type: "apps" };
}

function getRoutingTable() {
  return mergeRoutingTable(DEFAULT_ROUTING_TABLE, process.env.BOT_ROUTES_JSON);
}
const userSessions = new Map();

// YC Functions не могут достучаться до DNS-адреса api.telegram.org (149.154.166.110),
// но альтернативный IP Telegram API 149.154.167.220 отвечает. Используем его с правильным SNI/Host.
const https = require("https");
const TG_API_IP = "149.154.167.220";

function tgApi(method, payload) {
  const body = JSON.stringify(payload);
  return new Promise((resolve) => {
    const req = https.request({
      host: TG_API_IP,
      port: 443,
      method: "POST",
      path: `/bot${BOT_TOKEN}/${method}`,
      servername: "api.telegram.org",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        Host: "api.telegram.org"
      },
      timeout: 8000
    }, (res) => {
      let data = "";
      res.on("data", (c) => data += c);
      res.on("end", () => {
        let out = {};
        try { out = JSON.parse(data); } catch (e) { out = { ok: false, description: data.slice(0, 120) }; }
        console.log(JSON.stringify({ method, ok: out.ok, message_id: out.result && out.result.message_id, chat: payload.chat_id, thread: payload.message_thread_id, error: out.description }));
        resolve(out);
      });
    });
    req.on("timeout", () => req.destroy(new Error("Telegram API timeout")));
    req.on("error", (e) => {
      console.log(JSON.stringify({ method, ok: false, error: String(e) }));
      resolve({ ok: false, description: String(e) });
    });
    req.write(body);
    req.end();
  });
}
// Постоянная привязка «тема → пользователь» в Yandex Object Storage (S3).
// Ключи доступа заданы в env функции, в коде секретов нет.
const crypto = require("crypto");
const S3_BUCKET = process.env.S3_BUCKET || "";
const S3_KEY = process.env.S3_KEY || "feedback_state.json";
const S3_REGION = process.env.S3_REGION || "ru-central1";
const S3_ENDPOINT = process.env.S3_ENDPOINT || "https://storage.yandexcloud.net";
const S3_ACCESS = process.env.AWS_ACCESS_KEY_ID || "";
const S3_SECRET = process.env.AWS_SECRET_ACCESS_KEY || "";

async function s3Fetch(method, body, objectKey) {
  const key = objectKey || S3_KEY;
  const url = `${S3_ENDPOINT}/${S3_BUCKET}/${key}`;
  const path = `/${S3_BUCKET}/${key}`;
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = crypto.createHash("sha256").update(body || "").digest("hex");
  const headers = {
    host: "storage.yandexcloud.net",
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate
  };
  const names = Object.keys(headers).sort();
  const canonicalHeaders = names.map(k => `${k}:${String(headers[k]).trim()}\n`).join("");
  const canonicalRequest = [method, path, "", canonicalHeaders, names.join(";"), payloadHash].join("\n");
  const scope = `${dateStamp}/${S3_REGION}/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope,
    crypto.createHash("sha256").update(canonicalRequest).digest("hex")].join("\n");
  const hmac = (key, msg) => crypto.createHmac("sha256", key).update(msg).digest();
  const signing = hmac(hmac(hmac(hmac("AWS4" + S3_SECRET, dateStamp), S3_REGION), "s3"), "aws4_request");
  headers.Authorization = `AWS4-HMAC-SHA256 Credential=${S3_ACCESS}/${scope}, SignedHeaders=${names.join(";")}, Signature=${hmac(signing, stringToSign).toString("hex")}`;
  return fetch(url, { method, headers, body: body || undefined });
}
async function loadState() {
  try {
    const res = await s3Fetch("GET", "");
    if (!res.ok) return {};
    const data = JSON.parse((await res.text()) || "{}");
    return data && typeof data === "object" ? data : {};
  } catch (e) { console.log(JSON.stringify({ s3: "load", ok: false, error: String(e) })); return {}; }
}
async function saveState(state) {
  try {
    const res = await s3Fetch("PUT", JSON.stringify(state));
    console.log(JSON.stringify({ s3: "save", ok: res.ok, status: res.status }));
  } catch (e) { console.log(JSON.stringify({ s3: "save", ok: false, error: String(e) })); }
}
// Ключ включает чат: в разных группах могут совпадать номера тем.
function threadKey(chatId, threadId) { return `${chatId}:${threadId}`; }
async function rememberThreadUser(chatId, threadId, userId, userName) {
  const key = threadKey(chatId, threadId);
  const state = await loadState();
  state[key] = { uid: userId, name: userName, at: Date.now(), chatId: chatId, threadId: threadId };
  await saveState(state);
  // Новое обращение из Telegram перекрывает тикет приложения в этой теме.
  const store = await loadTickets();
  if (store.byThread[key]) {
    delete store.byThread[key];
    await saveTickets(store);
  }
}
async function getThreadUser(chatId, threadId) {
  const state = await loadState();
  const rec = state[threadKey(chatId, threadId)];
  return rec && rec.uid ? rec : null;
}
async function clearThreadUser(chatId, threadId) {
  const state = await loadState();
  const key = threadKey(chatId, threadId);
  if (state[key]) {
    delete state[key];
    await saveState(state);
  }
}

// Тикеты приложения: обращение из приложения получает секретный ID,
// по которому приложение забирает ответ админа без входа в Telegram.
const S3_TICKETS_KEY = process.env.S3_TICKETS_KEY || "feedback_tickets.json";
async function loadTickets() {
  try {
    const res = await s3Fetch("GET", "", S3_TICKETS_KEY);
    if (!res.ok) return { tickets: {}, byThread: {} };
    const data = JSON.parse((await res.text()) || "{}");
    return { tickets: (data && data.tickets) || {}, byThread: (data && data.byThread) || {} };
  } catch (e) {
    console.log(JSON.stringify({ s3: "tickets load", ok: false, error: String(e) }));
    return { tickets: {}, byThread: {} };
  }
}
async function saveTickets(store) {
  try {
    const res = await s3Fetch("PUT", JSON.stringify(store), S3_TICKETS_KEY);
    console.log(JSON.stringify({ s3: "tickets save", ok: res.ok, status: res.status }));
    return res.ok;
  } catch (e) {
    console.log(JSON.stringify({ s3: "tickets save", ok: false, error: String(e) }));
    return false;
  }
}
function getTicketFromReply(text) {
  const src = String(text || "");
  const hidden = decodeRouteMarker(src).match(/#ticket:([a-f0-9]{12,32})/i);
  return hidden ? hidden[1] : (src.match(/#ticket:([a-f0-9]{12,32})/i) || [])[1] || "";
}
async function storeTicketReply(ticketId, msg) {
  const store = await loadTickets();
  const rec = store.tickets[ticketId];
  if (!rec) return false;
  const text = String(msg.text || msg.caption || "📎 Вложение без подписи").trim();
  rec.replies.push({ at: Date.now(), text: text });
  rec.status = "replied";
  rec.answeredAt = Date.now();
  // После ответа тема снова доступна для обращений из Telegram.
  if (rec.threadId && store.byThread[threadKey(rec.chatId, rec.threadId)] === ticketId) {
    delete store.byThread[threadKey(rec.chatId, rec.threadId)];
  }
  await saveTickets(store);
  return true;
}
async function confirmTicketReply(msg, ticketId) {
  const short = String(ticketId).slice(0, 6).toUpperCase();
  await tgApi("sendMessage", {
    chat_id: msg.chat.id,
    message_thread_id: msg.message_thread_id || undefined,
    reply_to_message_id: msg.message_id,
    text: `✅ Ответ сохранён.\nОн появится в приложении по тикету ${short}.`
  });
}
function apiHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  };
}
const appSubmitThrottle = new Map();
function requestIp(event) {
  const ff = (event.headers && (event.headers["x-forwarded-for"] || event.headers["X-Forwarded-For"])) || "";
  if (ff) return String(ff).split(",")[0].trim();
  return String((event.requestContext && event.requestContext.http && event.requestContext.http.sourceIp) || "unknown");
}

// Маршрут прячем в невидимые zero-width символы: пользователь видит чистое
// сообщение, а Telegram при ответе цитирует исходный текст вместе с маркером.
// Бот читает маркер из цитаты и выбирает тему даже на другом инстансе функции.
function encodeRouteMarker(text) {
  const ZWSP = "\u200B", ZWNJ = "\u200C", ZWJ = "\u200D";
  let out = ZWJ;
  for (const ch of String(text)) {
    const code = ch.charCodeAt(0);
    for (let bit = 7; bit >= 0; bit--) out += ((code >> bit) & 1) ? ZWNJ : ZWSP;
  }
  return out + ZWJ;
}
function decodeRouteMarker(text) {
  const ZWJ = "\u200D";
  const parts = String(text || "").split(ZWJ);
  if (parts.length < 3) return "";
  const bits = parts[1].replace(/\u200B/g, "0").replace(/\u200C/g, "1");
  if (!bits || bits.length % 8 !== 0 || bits.length > 8 * 64) return "";
  let out = "";
  for (let i = 0; i < bits.length; i += 8) out += String.fromCharCode(parseInt(bits.slice(i, i + 8), 2));
  return out;
}
function getRouteFromReply(text) {
  const src = String(text || "");
  return decodeRouteMarker(src).match(/#route:([a-z0-9_]+):([a-z0-9_]+)/i) || src.match(/#route:([a-z0-9_]+):([a-z0-9_]+)/i);
}
function buildAppSelectKeyboard(table) {
  return { inline_keyboard: Object.keys(table).map(k => ([{ text: "📱 " + table[k].appName, callback_data: "app:" + k }])) };
}
function buildTopicKeyboard(appKey, appCfg) {
  return { inline_keyboard: (appCfg.appButtons || appCfg.buttons || []).map(b => ([{ text: b.label, callback_data: `topic:${appKey}:${b.id}` }])) };
}
async function sendWritePrompt(userId, appKey, topicId, appCfg, btn) {
  userSessions.set(userId, { appKey, topicId });
  await tgApi("sendMessage", {
    chat_id: userId,
    text: `✍️ <b>Напишите обращение</b>\n<b>${escapeHtml(appCfg.appName)}</b>\n→ <b>${escapeHtml(btn.label)}</b>\n\nТекст или скриншот сразу уйдёт автору в нужную тему.${encodeRouteMarker(`#route:${appKey}:${topicId}`)}`,
    parse_mode: "HTML",
    reply_markup: { force_reply: true, selective: true }
  });
}
function escapeHtml(s) { return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
async function sendReplyToUser(msg, targetUserId) {
  const replyText = msg.text || msg.caption || "";
  if (replyText) {
    await tgApi("sendMessage", { chat_id: targetUserId,
      text: `💬 <b>Ответ от автора/поддержки:</b>\n\n${escapeHtml(replyText)}`, parse_mode: "HTML" });
  } else {
    await tgApi("copyMessage", { chat_id: targetUserId, from_chat_id: msg.chat.id, message_id: msg.message_id });
  }
  await tgApi("sendMessage", { chat_id: msg.chat.id, message_thread_id: msg.message_thread_id || undefined,
    reply_to_message_id: msg.message_id, text: "✅ Ответ отправлен пользователю в личку." });
}

const APP_TOPIC_ALIASES = { key: "author", question: "author", change_card: "author" };
function findAppButton(table, topic, appKey) {
  const cfg = table[appKey] || table.auto_kitay;
  const normalized = APP_TOPIC_ALIASES[topic] || topic;
  return (cfg.appButtons || cfg.buttons || []).find(b => b.id === normalized) || null;
}

async function handleAppApi(payload, event) {
  const headers = apiHeaders();
  const table = getRoutingTable();
  const requestedApp = String(payload.appKey || "");
  const appKey = table[requestedApp] ? requestedApp : "auto_kitay";
  const action = String(payload.action || "");
  if (action === "app:submit") {
    const ip = requestIp(event);
    const now = Date.now();
    const last = appSubmitThrottle.get(ip) || 0;
    if (now - last < 4000) {
      return { statusCode: 429, headers, body: JSON.stringify({ ok: false, error: "Слишком часто. Подождите 4 секунды." }) };
    }
    appSubmitThrottle.set(ip, now);
    const topic = String(payload.topic || "author");
    const btn = findAppButton(table, topic, appKey);
    const text = String(payload.text || "").trim();
    if (!btn) return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "Неизвестная тема обращения." }) };
    if (!text || text.length > 1500) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "Текст обращения должен быть от 1 до 1500 символов." }) };
    }
    const ticketId = crypto.randomBytes(12).toString("hex");
    const short = ticketId.slice(0, 6).toUpperCase();
    const contact = String(payload.replyContact || payload.contact || "").trim().slice(0, 200);
    const uid = String(payload.uid || "").trim().slice(0, 80);
    const cfg = table[appKey];
    const version = String(payload.appVersion || "").trim().slice(0, 40);
    const product = String(payload.appName || "").trim().slice(0, 80);
    const role = String(payload.role || "").trim().slice(0, 40);
    const screen = String(payload.screen || "").trim().slice(0, 60);
    const environment = String(payload.environment || "").trim().slice(0, 120);
    const logs = String(payload.logs || "").trim().slice(-1000);
    const lines = [
      `📩 ${escapeHtml(cfg.appName)}`,
      `· ${escapeHtml(btn.label)}`,
      "📱 Из приложения",
      `🎫 ${short}`,
      contact ? `👤 ${escapeHtml(contact)}` : "👤 Контакт не указан",
      uid ? `🆔 ${escapeHtml(uid)}` : "",
      version ? `🏷 Версия: ${escapeHtml(version)}` : "",
      product ? `🧩 Продукт: ${escapeHtml(product)}` : "",
      role ? `👥 Роль: ${escapeHtml(role)}` : "",
      screen ? `🖥 Экран: ${escapeHtml(screen)}` : "",
      environment ? `🌐 Среда: ${escapeHtml(environment)}` : "",
      logs ? `📋 Логи приложения:\n${escapeHtml(logs)}` : ""
    ].filter(Boolean);
    const marker = encodeRouteMarker(`#ticket:${ticketId}`);
    const sent = await tgApi("sendMessage", {
      chat_id: btn.chatId,
      message_thread_id: btn.threadId,
      text: `${lines.join("\n")}\n\n${escapeHtml(text)}${marker}`,
      parse_mode: "HTML"
    });
    if (!sent.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: "Не удалось доставить сообщение в тему." }) };
    }
    const store = await loadTickets();
    store.tickets[ticketId] = {
      id: ticketId, short: short, appKey: appKey, topicId: btn.id,
      chatId: btn.chatId, threadId: btn.threadId, createdAt: now, status: "open",
      contact: contact, uid: uid, role: role, screen: screen,
      meta: { appVersion: version, appName: product, environment: environment, logs: logs },
      replies: []
    };
    store.byThread[threadKey(btn.chatId, btn.threadId)] = ticketId;
    const saved = await saveTickets(store);
    if (!saved) {
      return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: "Обращение отправлено, но тикет не сохранён.\nНапишите через бота в Telegram." }) };
    }
    return {
      statusCode: 200, headers,
      body: JSON.stringify({ ok: true, ticket: ticketId, short: short,
        messageId: (sent.result && sent.result.message_id) || 0,
        message: "✅ Обращение отправлено.\nОтвет появится здесь, в приложении." })
    };
  }
  if (action === "app:poll") {
    const ticketId = String(payload.ticket || "").trim();
    if (!/^[a-f0-9]{12,32}$/i.test(ticketId)) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "Неверный номер обращения." }) };
    }
    const store = await loadTickets();
    const rec = store.tickets[ticketId];
    if (!rec) return { statusCode: 404, headers, body: JSON.stringify({ ok: false, error: "Обращение не найдено." }) };
    return { statusCode: 200, headers, body: JSON.stringify({
      ok: true, ticket: ticketId, status: rec.status, replies: rec.replies || [],
      short: rec.short || ticketId.slice(0, 6).toUpperCase()
    }) };
  }
  return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "Неизвестное действие." }) };
}

exports.handler = async function (event) {
  const method = String(event.httpMethod || (event.requestContext && event.requestContext.http && event.requestContext.http.method) || "POST").toUpperCase();
  if (method === "OPTIONS") return { statusCode: 204, headers: apiHeaders(), body: "" };
  let update;
  try { update = typeof event.body === "string" ? JSON.parse(event.body) : (event.body || {}); }
  catch (e) { return { statusCode: 200, body: "ok" }; }
  if (update && update.action && String(update.action).indexOf("app:") === 0) {
    return await handleAppApi(update, event);
  }
  if (!BOT_TOKEN) return { statusCode: 500, body: "TG_BOT_TOKEN is not set" };
  const table = getRoutingTable();

  if (update.callback_query) {
    const cq = update.callback_query; const userId = cq.from.id; const data = String(cq.data || "");
    if (data.startsWith("app:")) {
      const appKey = data.slice(4); const appCfg = table[appKey];
      if (appCfg) {
        userSessions.set(userId, { appKey, topicId: null });
        await tgApi("sendMessage", { chat_id: userId, text: appCfg.welcome, parse_mode: "HTML", reply_markup: buildTopicKeyboard(appKey, appCfg) });
      }
    } else if (data.startsWith("topic:")) {
      const [, appKey, topicId] = data.split(":"); const appCfg = table[appKey];
      const btn = resolveButton(appCfg, topicId);
      if (appCfg && btn) {
        // Stateless fallback: ForceReply заставляет клиент процитировать это сообщение,
        // а маркер в тексте однозначно определяет тему даже на другом инстансе функции.
        await sendWritePrompt(userId, appKey, topicId, appCfg, btn);
      }
    }
    await tgApi("answerCallbackQuery", { callback_query_id: cq.id });
    return { statusCode: 200, body: "ok" };
  }

  const msg = update.message;
  if (!msg) return { statusCode: 200, body: "ok" };

  if (msg.chat && msg.chat.type !== "private" && msg.text && msg.text.startsWith("/id")) {
    await tgApi("sendMessage", { chat_id: msg.chat.id, message_thread_id: msg.message_thread_id || undefined, text: `ℹ️ <b>Параметры этой темы:</b>\n<code>chatId: ${msg.chat.id}</code>\n<code>threadId: ${msg.message_thread_id || 1}</code>`, parse_mode: "HTML" });
    return { statusCode: 200, body: "ok" };
  }

  if (msg.chat && msg.chat.type !== "private" && msg.reply_to_message) {
    const refText = msg.reply_to_message.text || msg.reply_to_message.caption || "";
    const ticketId = getTicketFromReply(refText);
    if (ticketId && await storeTicketReply(ticketId, msg)) {
      await confirmTicketReply(msg, ticketId);
      return { statusCode: 200, body: "ok" };
    }
    const match = refText.match(/#uid_(\d+)/);
    if (match) {
      await sendReplyToUser(msg, Number(match[1]));
      return { statusCode: 200, body: "ok" };
    }
    if (msg.reply_to_message.from && msg.reply_to_message.from.id === BOT_ID) {
      await tgApi("sendMessage", { chat_id: msg.chat.id, message_thread_id: msg.message_thread_id || undefined,
        reply_to_message_id: msg.message_id,
        text: "⚠️ В цитируемом сообщении нет метки #uid_.\nОтветьте на шапку обращения\nили на пересланное вложение —\nтогда ответ уйдёт пользователю." });
      return { statusCode: 200, body: "ok" };
    }
  }

  // Обычное сообщение прямо в теме: адресата берём из постоянной привязки темы.
  if (msg.chat && msg.chat.type !== "private" && msg.message_thread_id) {
    const replyText = msg.text || msg.caption || "";
    if (replyText) {
      const tickets = await loadTickets();
      const activeTicket = tickets.byThread[threadKey(msg.chat.id, msg.message_thread_id)];
      if (activeTicket && await storeTicketReply(activeTicket, msg)) {
        await confirmTicketReply(msg, activeTicket);
        return { statusCode: 200, body: "ok" };
      }
      const rec = await getThreadUser(msg.chat.id, msg.message_thread_id);
      if (rec) {
        await sendReplyToUser(msg, rec.uid);
        return { statusCode: 200, body: "ok" };
      }
      await tgApi("sendMessage", { chat_id: msg.chat.id, message_thread_id: msg.message_thread_id,
        reply_to_message_id: msg.message_id,
        text: "⚠️ Не знаю, кому адресован ответ:\nв этой теме ещё не было обращения.\nОтветьте на сообщение с меткой #uid_." });
    }
    return { statusCode: 200, body: "ok" };
  }

  if (msg.chat && msg.chat.type === "private") {
    const userId = msg.from.id; const text = String(msg.text || "");
    if (text.startsWith("/start")) {
      const plan = planStart(text.split(/\s+/)[1] || "", table);
      if (plan.type === "prompt") {
        const appCfg = table[plan.appKey];
        await sendWritePrompt(userId, plan.appKey, plan.topicId, appCfg, resolveButton(appCfg, plan.topicId));
      } else if (plan.type === "topics") {
        const appCfg = table[plan.appKey];
        userSessions.set(userId, { appKey: plan.appKey, topicId: null });
        await tgApi("sendMessage", { chat_id: userId, text: appCfg.welcome, parse_mode: "HTML", reply_markup: buildTopicKeyboard(plan.appKey, appCfg) });
      } else {
        await tgApi("sendMessage", { chat_id: userId, text: "Здравствуйте!\nВыберите приложение, по которому хотите написать:", reply_markup: buildAppSelectKeyboard(table) });
      }
      return { statusCode: 200, body: "ok" };
    }
    const refText = (msg.reply_to_message && (msg.reply_to_message.text || msg.reply_to_message.caption)) || "";
    const routeMatch = getRouteFromReply(refText);
    const sess = routeMatch
      ? { appKey: routeMatch[1], topicId: routeMatch[2] }
      : (userSessions.get(userId) || {});
    if (!sess.appKey || !sess.topicId) {
      const appCfg = sess.appKey ? table[sess.appKey] : null;
      if (appCfg) await tgApi("sendMessage", { chat_id: userId, text: "Сначала выберите раздел обращения кнопкой ниже:", reply_markup: buildTopicKeyboard(sess.appKey, appCfg) });
      else await tgApi("sendMessage", { chat_id: userId, text: "Выберите приложение кнопкой ниже:", reply_markup: buildAppSelectKeyboard(table) });
      return { statusCode: 200, body: "ok" };
    }
    const appCfg = table[sess.appKey];
    if (!appCfg) return { statusCode: 200, body: "ok" };
    const btn = resolveButton(appCfg, sess.topicId) || resolveButton(appCfg, "author") || (appCfg.appButtons || appCfg.buttons || [])[0];
    const userName = [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ") || "Пользователь";
    const userHandle = msg.from.username ? `@${msg.from.username}` : "без @username";
    const uidTag = `#uid_${userId}`;
    const header = `📩 <b>${escapeHtml(appCfg.appName)}</b>\n· ${escapeHtml(btn.label)}\n👤 ${escapeHtml(userName)} (${escapeHtml(userHandle)}) · ${uidTag}`;
    if (msg.text) {
      await tgApi("sendMessage", { chat_id: btn.chatId, message_thread_id: btn.threadId === 1 ? undefined : btn.threadId, text: `${header}\n\n${escapeHtml(msg.text)}`, parse_mode: "HTML" });
    } else {
      await tgApi("sendMessage", { chat_id: btn.chatId, message_thread_id: btn.threadId === 1 ? undefined : btn.threadId, text: header, parse_mode: "HTML" });
      await tgApi("copyMessage", { chat_id: btn.chatId, message_thread_id: btn.threadId === 1 ? undefined : btn.threadId,
        from_chat_id: userId, message_id: msg.message_id,
        caption: [msg.caption, uidTag].filter(Boolean).join("\n") });
    }
    await rememberThreadUser(btn.chatId, btn.threadId, userId, userName);
    await tgApi("sendMessage", { chat_id: userId, text: "✅ Сообщение отправлено автору!\nКак только появится ответ — он придёт вам прямо сюда." });
  }
  return { statusCode: 200, body: "ok" };
};

exports.__test = {
  parseStartPayload,
  mergeRoutingTable,
  resolveButton,
  buildDeepLink,
  planStart,
  table: () => DEFAULT_ROUTING_TABLE
};
