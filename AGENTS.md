# AGENTS.md — «Sagitar · Шины и диски» v2.0_20261127

Канонический файл подразделения: `index.html`. Версия `v2.0_20261127` обязательна в
`<title>`, бейдже в шапке, футере и архивной копии (`99_Архив/index_v2.0_20261127.html`).

## Правила

1. Старые папки проекта `03_Сайт`, `05_Универсальный_подбор`, `02_Иллюстрации` и
   `Таблица_для_продавца_v3.3_20261126.html` не редактируются. Их копии здесь сделаны
   только для автономной работы; см. `ПУТЬ_К_ДОКУМЕНТАЦИИ.md`.
2. Новый код живёт только в изолированных блоках `style#v2-style`,
   `script#app-data`, `script#v2-data`, `script#v2-app` внутри `index.html`.
3. Чистая логика вынесена в `window.SagitarV2Core` и тестируется без браузера:
   `node --test tests/v2.test.js`.
4. Проверки перед сдачей:
   - `python tests/check_structure.py` (старые файлы не тронуты);
   - `python tests/check_legal.py` (юридический текст на месте);
   - `node --test tests/v2.test.js`;
   - `python C:\Users\Az\.config\opencode\scripts\scope_guard.py check ...` с якорем
     `06_Подбор_Вся_Россия/index.html`.
5. Партнёрских меток и ERID нет до регистрации владельца; Ozon — нейтральный поиск;
   цен б/у не показываем; персональные данные не собираем.
6. Обратная связь — только `https://t.me/AzAppsFeedbackBot?start=sagitar_shiny_diski_<topic>`,
   темы `bug|idea|author|partner`. Прямых `t.me/c/...` в интерфейсе нет.
7. Замок на время работ: 🔒 opencode · big-pickle · 01. Big Pickle (Z free).

Источники требований: `docs/superpowers/specs/2026-11-27-v20-merge-design.md` и
`docs/superpowers/plans/2026-11-27-v20-sagitar-shiny-diski.md` в корне проекта.
Текущее состояние — в `ПЕРЕДАЧА.md`.
