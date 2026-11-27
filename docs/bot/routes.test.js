'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const bot = require('./index.js');

test('глубокая ссылка определяет приложение и тему без вопроса', () => {
  assert.deepEqual(bot.__test.parseStartPayload('sagitar_shiny_diski_bug', bot.__test.table()),
    { appKey: 'sagitar_shiny_diski', topicId: 'bug' });
  assert.deepEqual(bot.__test.parseStartPayload('sagitar_shiny_diski_author', bot.__test.table()),
    { appKey: 'sagitar_shiny_diski', topicId: 'author' });
  assert.deepEqual(bot.__test.parseStartPayload('sagitar_shiny_diski_partner', bot.__test.table()),
    { appKey: 'sagitar_shiny_diski', topicId: 'partner' });
});

test('_start только с приложением не спрашивает, какое приложение', () => {
  assert.deepEqual(bot.__test.parseStartPayload('sagitar_shiny_diski', bot.__test.table()),
    { appKey: 'sagitar_shiny_diski', topicId: null });
});

test('BOT_ROUTES_JSON не стирает новые ключи', () => {
  const merged = bot.__test.mergeRoutingTable(bot.__test.table(), '{"auto_kitay":{"appName":"Другое имя"}}');
  assert.equal(merged.auto_kitay.appName, 'Другое имя');
  assert.ok(merged.sagitar_shiny_diski);
});

test('тема bug/idea находится даже вне кнопок приватного меню', () => {
  const cfg = bot.__test.table().sagitar_shiny_diski;
  assert.equal(bot.__test.resolveButton(cfg, 'bug').threadId, 92);
  assert.equal(bot.__test.resolveButton(cfg, 'idea').threadId, 95);
  assert.equal(bot.__test.resolveButton(cfg, 'author').threadId, 39);
  assert.equal(bot.__test.resolveButton(cfg, 'partner').threadId, 42);
});

test('/start с темой сразу предлагает написать обращение, без выбора приложения', () => {
  assert.deepEqual(bot.__test.planStart('sagitar_shiny_diski_bug', bot.__test.table()),
    { type: 'prompt', appKey: 'sagitar_shiny_diski', topicId: 'bug' });
  assert.deepEqual(bot.__test.planStart('sagitar_shiny_diski_idea', bot.__test.table()),
    { type: 'prompt', appKey: 'sagitar_shiny_diski', topicId: 'idea' });
  assert.notEqual(bot.__test.planStart('sagitar_shiny_diski_bug', bot.__test.table()).type, 'apps');
});

test('ссылка на бота содержит приложение и тему', () => {
  assert.equal(bot.__test.buildDeepLink('sagitar_shiny_diski', 'bug'),
    'https://t.me/AzAppsFeedbackBot?start=sagitar_shiny_diski_bug');
});

test('старые ключи sagitar_tires и sagitar_site удалены', () => {
  const table = bot.__test.table();
  assert.equal(table.sagitar_tires, undefined);
  assert.equal(table.sagitar_site, undefined);
  assert.equal(table.sagitar_shiny_diski.appName,
    'Sagitar · Шины и диски — подбор всей России');
});
