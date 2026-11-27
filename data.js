/* v1.7 — TOP-30 некитайских зимних нешипованных 205/55 R16 и диски 16″ 5×112/57,1.
   Только физические магазины в Уссурийске. Пункты выдачи, доставка и маркетплейсы удалены 25.11.2026.
   Новые кандидаты в tires[] без оценок и цен: данные уточняются дип-ресерчем. */
window.PROJECT = {
  "meta": {
    "version": "1.7",
    "updated": "2026-11-25",
    "car": "Volkswagen Sagitar 2023 · 1.4T · 2WD",
    "city": "Уссурийск → Белгород",
    "vin": "LFV2A2BUXN4498427",
    "origins": {
      "car": "Уссурийск, ул. Пролетарская, 147",
      "hotel": "Уссурийск, ул. Краснознамённая, 56, гостиница Маяк"
    },
    "sourcesNote": "Адреса — Яндекс.Карты, 24.11.2026. В подборе остались только реальные магазины Уссурийска; пункты выдачи и маркетплейсы удалены 25.11.2026 по указанию владельца.",
    "testNote": "Сравнительные оценки (лёд/снег/мокро/сухо/комфорт/тишина) — экспертная сводка проекта по открытым тестам 2022–2025 (ЗР, Авторевю, ADAC, Test World). Это НЕ протокол измерений и не место в конкретном тесте. Используются только для сортировки.",
    "offersNote": "Показываются только предложения физических магазинов с подтверждённым адресом в Уссурийске. Объявления маркетплейсов, пункты выдачи и доставки исключены полностью.",
    "buyNote": "Прямые ссылки только на каталоги физических магазинов в Уссурийске. Цены без действующей ссылки-источника не показываются.",
    "wheelOffersNote": "Диски 16″ 5×112/57,1 ET46–51 показываются как кандидаты; проверенных цен на диски в физических магазинах Уссурийска нет — уточнять по телефону.",
    "mountsNote": "Стоимость монтажа проверенным источником не подтверждена — в подбор не включается. Уточняйте в шиномонтаже по факту.",
    "mounting": null,
    "sources": [
      {
        "name": "Яндекс.Карты — адреса и маршруты",
        "url": "https://yandex.ru/maps/",
        "date": "2026-11-24"
      },
      {
        "name": "ШИНА25.РУ — каталог шин",
        "url": "https://shina25.ru/catalog/tires/",
        "date": "2026-11-25",
        "note": "Уссурийск, ул. Краснознамённая, 198В"
      }
    ],
    "weights": {
      "ice": 30,
      "snow": 20,
      "wet": 15,
      "dry": 10,
      "comfort": 10,
      "quiet": 5,
      "value": 10
    },
    "presets": [
      {
        "id": "best",
        "label": "Лучшая резина за лучшую цену",
        "w": {
          "ice": 30,
          "snow": 20,
          "wet": 20,
          "dry": 10,
          "comfort": 10,
          "quiet": 5,
          "value": 5
        }
      },
      {
        "id": "ice",
        "label": "Максимум на льду и снегу",
        "w": {
          "ice": 45,
          "snow": 30,
          "wet": 10,
          "dry": 5,
          "comfort": 5,
          "quiet": 5,
          "value": 0
        }
      },
      {
        "id": "wet",
        "label": "Мокрый асфальт и реагенты",
        "w": {
          "ice": 15,
          "snow": 10,
          "wet": 40,
          "dry": 20,
          "comfort": 10,
          "quiet": 5,
          "value": 0
        }
      },
      {
        "id": "quiet",
        "label": "Тишина и комфорт",
        "w": {
          "ice": 10,
          "snow": 10,
          "wet": 15,
          "dry": 10,
          "comfort": 30,
          "quiet": 25,
          "value": 0
        }
      },
      {
        "id": "value",
        "label": "Цена и разумный компромисс",
        "w": {
          "ice": 15,
          "snow": 15,
          "wet": 15,
          "dry": 10,
          "comfort": 10,
          "quiet": 5,
          "value": 30
        }
      }
    ],
    "importNote": "v1.6: только физические магазины Уссурийска, только 205/55 R16 зимняя липучка, только некитайские бренды. Пункты выдачи, доставка, маркетплейсы, шипы, 205/60 и 225/45 R17 удалены. Нет проверенной цены — «уточнить по телефону».",
    "top30Note": "TOP-30 знаменитых некитайских зимних нешипованных шин 205/55 R16 для Volkswagen Sagitar. Все 30_modelей в таблице. Новые позиции без оценок и без цен — данные ждут дип-ресерч. Китайские, тайваньские и шипованные модели, 205/60 и 225/45 R17 исключены.",
    "variantsNote": "Проверенные комплекты «диск + резина» появятся после дип-ресерча; без цены комплект не показывается."
  },
  "shops": [
    {
      "id": "shina25",
      "name": "Шина25ру",
      "kind": "shop",
      "address": "Краснознамённая ул., 198В, Уссурийск",
      "distCar": "1,77 км",
      "kmCar": 1.77,
      "timeCar": 4,
      "distHotel": "3,2 км",
      "kmHotel": 3.2,
      "timeHotel": 6,
      "map": "https://yandex.ru/maps/org/shina25ru/20051045057/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "germes",
      "name": "Гермес",
      "kind": "shop",
      "address": "ул. Тургенева, 73Б, стр. 14, Уссурийск",
      "distCar": "2,34 км",
      "kmCar": 2.34,
      "timeCar": 6,
      "distHotel": "4,6 км",
      "kmHotel": 4.6,
      "timeHotel": 9,
      "map": "https://yandex.ru/maps/org/germes/130748632506/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "shinatreyd",
      "name": "Шинатрейд",
      "kind": "shop",
      "address": "Целинная ул., 2/3, Уссурийск",
      "distCar": "4,8 км",
      "kmCar": 4.8,
      "timeCar": 9,
      "distHotel": "6,4 км",
      "kmHotel": 6.4,
      "timeHotel": 10,
      "map": "https://yandex.ru/maps/org/shinatreyd/141550742952/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "shiny-diski",
      "name": "Шины и диски",
      "kind": "shop",
      "address": "Московская ул., 38, Уссурийск",
      "distCar": "6,1 км",
      "kmCar": 6.1,
      "timeCar": 10,
      "distHotel": "4,8 км",
      "kmHotel": 4.8,
      "timeHotel": 8,
      "map": "https://yandex.ru/maps/org/shiny_i_diski/65489451595/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "shinny-dvor",
      "name": "Шинный двор",
      "kind": "shop",
      "address": "Краснознамённая ул., 6А, стр. 2, Уссурийск",
      "distCar": "3,4 км",
      "kmCar": 3.4,
      "timeCar": 6,
      "distHotel": "1,24 км",
      "kmHotel": 1.24,
      "timeHotel": 3,
      "map": "https://yandex.ru/maps/org/shinny_dvor/187297430661/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "shiny-optima",
      "name": "Шины Оптима",
      "kind": "shop",
      "address": "Московская ул., 12, Уссурийск",
      "distCar": "7 км",
      "kmCar": 7,
      "timeCar": 11,
      "distHotel": "4,8 км",
      "kmHotel": 4.8,
      "timeHotel": 7,
      "map": "https://yandex.ru/maps/org/shiny_optima/58227786341/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "drayv-shina",
      "name": "Драйв-шина",
      "kind": "shop",
      "address": "ул. Кирова, 5, Уссурийск",
      "distCar": "1,33 км",
      "kmCar": 1.33,
      "timeCar": 4,
      "distHotel": "2,72 км",
      "kmHotel": 2.72,
      "timeHotel": 6,
      "map": "https://yandex.ru/maps/org/drayv_shina/62302754993/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "arden",
      "name": "Арден",
      "kind": "shop",
      "address": "Новоникольское ш., 2В, Уссурийск",
      "distCar": "5,2 км",
      "kmCar": 5.2,
      "timeCar": 9,
      "distHotel": "6,8 км",
      "kmHotel": 6.8,
      "timeHotel": 10,
      "map": "https://yandex.ru/maps/org/arden/1011328262/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "avto-moto",
      "name": "Авто-мото шиномонтаж",
      "kind": "service",
      "address": "Краснознамённая ул., 192А, Уссурийск",
      "distCar": "1,31 км",
      "kmCar": 1.31,
      "timeCar": 4,
      "distHotel": "2,7 км",
      "kmHotel": 2.7,
      "timeHotel": 5,
      "map": "https://yandex.ru/maps/org/avto_moto_shinomontazh/15440123643/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "avtoekspert",
      "name": "Автоэксперт. ДВ",
      "kind": "service",
      "address": "ул. Орджоникидзе, 39, Уссурийск",
      "distCar": "2,93 км",
      "kmCar": 2.93,
      "timeCar": 7,
      "distHotel": "4,3 км",
      "kmHotel": 4.3,
      "timeHotel": 9,
      "map": "https://yandex.ru/maps/org/avtoekspert_dv/97451340472/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "shinomaster-vol",
      "name": "Shinomaster8 (Волочаевская)",
      "kind": "service",
      "address": "Волочаевская ул., 69, Уссурийск",
      "distCar": "590 м (дословно)",
      "kmCar": 0.59,
      "timeCar": 2,
      "distHotel": "1,73 км",
      "kmHotel": 1.73,
      "timeHotel": 4,
      "map": "https://yandex.ru/maps/org/shinomaster8/13706065338/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "shinomaster-push",
      "name": "Shinomaster8 (Пушкина)",
      "kind": "service",
      "address": "ул. Пушкина, 128, стр. 2, Уссурийск",
      "distCar": "1,19 км",
      "kmCar": 1.19,
      "timeCar": 3,
      "distHotel": "2,62 км",
      "kmHotel": 2.62,
      "timeHotel": 5,
      "map": "https://yandex.ru/maps/org/shinomaster8/165504178956/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "shinomontazh-push5",
      "name": "Шиномонтаж (Пушкина, 5)",
      "kind": "service",
      "address": "ул. Пушкина, 5, Уссурийск",
      "distCar": "2,62 км",
      "kmCar": 2.62,
      "timeCar": 7,
      "distHotel": "3,5 км",
      "kmHotel": 3.5,
      "timeHotel": 6,
      "map": "https://yandex.ru/maps/org/shinomontazh/166443756380/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "shinomontazh-terem",
      "name": "Шиномонтаж (Теремецкого, 5Б)",
      "kind": "service",
      "address": "ул. Теремецкого, 5Б, Уссурийск",
      "distCar": "3 км",
      "kmCar": 3,
      "timeCar": 6,
      "distHotel": "4,4 км",
      "kmHotel": 4.4,
      "timeHotel": 7,
      "map": "https://yandex.ru/maps/org/shinomontazh/45103055519/",
      "city": "Уссурийск",
      "verified": true,
      "source": "Яндекс.Карты, 24.11.2026",
      "traffic": "признак пробки не показан",
      "sourceDate": "2026-11-24",
      "storeType": "physical"
    },
    {
      "id": "avtonarodnye",
      "name": "Сеть магазинов «Автонародные»",
      "kind": "shop",
      "storeType": "physical",
      "address": "Уссурийск: ул. Арсеньева, 23А; ул. Некрасова, 251; ул. Агеева, 20А; Новоникольское ш., 2Б/1; ул. С. Ушакова, 45А",
      "city": "Уссурийск",
      "source": "Яндекс.Карты, 24.11.2026",
      "sourceDate": "2026-11-24",
      "verified": true
    }
  ],
  "tires": [
    {
      "id": "hakka-r5",
      "brand": "Nokian",
      "model": "Hakkapeliitta R5",
      "type": "friction",
      "studs": 0,
      "country": "Финляндия (параллельный импорт)",
      "scores": {
        "ice": 10,
        "snow": 9,
        "wet": 8,
        "dry": 8,
        "comfort": 9,
        "quiet": 9
      },
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94R",
          "xl": true
        }
      ],
      "pros": [
        "Лучший лёд среди липучек",
        "Тихая, мягкая",
        "Отличная управляемость на снегу"
      ],
      "cons": [
        "Самая дорогая",
        "Боковина нежная для ям"
      ],
      "summary": "Эталон зимней липучки. Если бюджет позволяет — лучший выбор для Белгорода: лёд, каша, мокрый асфальт."
    },
    {
      "id": "xice-snow",
      "brand": "Michelin",
      "model": "X-Ice Snow",
      "type": "friction",
      "studs": 0,
      "country": "Европа (параллельный импорт)",
      "scores": {
        "ice": 9,
        "snow": 9,
        "wet": 10,
        "dry": 9,
        "comfort": 9,
        "quiet": 9
      },
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94H",
          "xl": true
        }
      ],
      "pros": [
        "Лучшая на мокром асфальте",
        "Долго держит свойства",
        "Тихая"
      ],
      "cons": [
        "Дорогая",
        "На чистом льду чуть уступает R5"
      ],
      "summary": "Лучший баланс «мокрый асфальт + лёд». Для города с реагентами и частыми оттепелями — идеально."
    },
    {
      "id": "viking-ct7",
      "brand": "Continental",
      "model": "VikingContact 7",
      "type": "friction",
      "studs": 0,
      "country": "Германия / Чехия",
      "scores": {
        "ice": 9,
        "snow": 8,
        "wet": 10,
        "dry": 9,
        "comfort": 9,
        "quiet": 8
      },
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": true
        }
      ],
      "pros": [
        "Сильная на мокром и в каше",
        "Предсказуемая",
        "Крепкая боковина"
      ],
      "cons": [
        "Шумнее R5",
        "Цена высокая"
      ],
      "summary": "Европейский характер: асфальт и слякоть. Для Белгорода с реагентами — очень уместно."
    },
    {
      "id": "blizzak-vrx3",
      "brand": "Bridgestone",
      "model": "Blizzak VRX3",
      "type": "friction",
      "studs": 0,
      "country": "Япония (параллельный импорт)",
      "scores": {
        "ice": 9,
        "snow": 9,
        "wet": 8,
        "dry": 8,
        "comfort": 8,
        "quiet": 8
      },
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94R",
          "xl": false
        }
      ],
      "pros": [
        "Отличный лёд",
        "Надёжная на снегу",
        "Хорошая износостойкость"
      ],
      "cons": [
        "Цена",
        "Шум на асфальте"
      ],
      "summary": "Японская липучка с сильным льдом. Альтернатива Nokian, если той нет в наличии."
    },
    {
      "id": "gis-softfrost200",
      "brand": "Gislaved",
      "model": "Soft Frost 200",
      "type": "friction",
      "studs": 0,
      "country": "Россия / Европа",
      "scores": {
        "ice": 8,
        "snow": 8,
        "wet": 8,
        "dry": 7,
        "comfort": 8,
        "quiet": 8
      },
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": true
        }
      ],
      "pros": [
        "Цена/качество",
        "Мягкая на мелких неровностях",
        "Есть почти везде"
      ],
      "cons": [
        "Не топ на льду",
        "Боковина средняя"
      ],
      "summary": "Разумный «средний+» вариант: заметно лучше дешёвых, но без переплаты за бренд."
    },
    {
      "id": "hankook-iz3",
      "brand": "Hankook",
      "model": "Winter i*cept iZ3 W636",
      "type": "friction",
      "studs": 0,
      "country": "Корея / Венгрия",
      "scores": {
        "ice": 8,
        "snow": 8,
        "wet": 8,
        "dry": 8,
        "comfort": 8,
        "quiet": 8
      },
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94H",
          "xl": true
        }
      ],
      "pros": [
        "Сбалансированная",
        "Крепкая",
        "Хороша на асфальте"
      ],
      "cons": [
        "Лёд — не сильнейшая сторона"
      ],
      "summary": "Корейский середняк-плюс. Ровно то, что нужно, если топ дорог."
    },
    {
      "id": "ikon-snow2",
      "brand": "Ikon",
      "model": "Character Snow 2",
      "type": "friction",
      "studs": 0,
      "country": "Россия (бывший Nordman RS2)",
      "scores": {
        "ice": 7,
        "snow": 8,
        "wet": 7,
        "dry": 7,
        "comfort": 7,
        "quiet": 7
      },
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": true
        }
      ],
      "pros": [
        "Дешёвая",
        "Проверенная конструкция",
        "Есть в наличии в РФ"
      ],
      "cons": [
        "Шумнее топов",
        "Лёд средне"
      ],
      "summary": "Бюджетная липучка «на каждый день». Для спокойной городской езды хватает."
    },
    {
      "id": "cordiant-wd2",
      "brand": "Cordiant",
      "model": "Winter Drive 2",
      "type": "friction",
      "studs": 0,
      "country": "Россия",
      "scores": {
        "ice": 6,
        "snow": 7,
        "wet": 7,
        "dry": 6,
        "comfort": 6,
        "quiet": 6
      },
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": true
        }
      ],
      "pros": [
        "Очень дешёвая",
        "Не жалко",
        "Ремонтопригодная"
      ],
      "cons": [
        "Слабый лёд",
        "Шумная",
        "Быстро дубеет на морозе"
      ],
      "summary": "Вариант «доехать и пережить зиму». Для ежедневной езды 3–4 года — на грани."
    },
    {
      "id": "viatti-521",
      "brand": "Viatti",
      "model": "Brina V-521",
      "type": "friction",
      "studs": 0,
      "country": "Россия",
      "scores": {
        "ice": 6,
        "snow": 6,
        "wet": 6,
        "dry": 6,
        "comfort": 6,
        "quiet": 6
      },
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": false
        }
      ],
      "pros": [
        "Самая дешёвая",
        "Есть везде"
      ],
      "cons": [
        "Слабые сцепные",
        "Шумная",
        "Не для активной езды"
      ],
      "summary": "Абсолютный бюджет. Брать только если денег в обрез и ездить мало."
    },
    {
      "id": "formula-ice-fr",
      "brand": "Formula",
      "model": "Ice FR",
      "type": "friction",
      "studs": 0,
      "country": "Италия (Continental)",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "nexen-wgi3",
      "brand": "Nexen",
      "model": "Winguard Ice 3",
      "type": "friction",
      "studs": 0,
      "country": "Южная Корея",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "yokohama-ig50plus",
      "brand": "Yokohama",
      "model": "Ice Guard IG50 Plus",
      "type": "friction",
      "studs": 0,
      "country": "Япония",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "yokohama-ig60",
      "brand": "Yokohama",
      "model": "Ice Guard IG60",
      "type": "friction",
      "studs": 0,
      "country": "Япония",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "dunlop-wm02",
      "brand": "Dunlop",
      "model": "Winter Maxx WM02",
      "type": "friction",
      "studs": 0,
      "country": "Япония / Германия",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "kumho-wi51",
      "brand": "Kumho",
      "model": "WinterCraft Ice WI51",
      "type": "friction",
      "studs": 0,
      "country": "Южная Корея",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "ikon-autograph-snow5",
      "brand": "Ikon",
      "model": "Autograph Snow 5",
      "type": "friction",
      "studs": 0,
      "country": "Россия (бренд Nokian)",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94R",
          "xl": true
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "cordiant-wd",
      "brand": "Cordiant",
      "model": "Winter Drive",
      "type": "friction",
      "studs": 0,
      "country": "Россия",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "laufenn-lw51",
      "brand": "Laufenn",
      "model": "I FIT IZ LW51",
      "type": "friction",
      "studs": 0,
      "country": "Южная Корея (Hankook)",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "91T",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "kumho-wp51",
      "brand": "Kumho",
      "model": "WP51 Wintercraft",
      "type": "friction",
      "studs": 0,
      "country": "Южная Корея",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "pirelli-icezero-fr",
      "brand": "Pirelli",
      "model": "Ice Zero FR",
      "type": "friction",
      "studs": 0,
      "country": "Италия",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "gislaved-arcticcontrol",
      "brand": "Gislaved",
      "model": "ArcticControl",
      "type": "friction",
      "studs": 0,
      "country": "Швеция / Германия",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94T",
          "xl": true
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "ikon-nordman-rs2",
      "brand": "Ikon",
      "model": "Nordman RS2",
      "type": "friction",
      "studs": 0,
      "country": "Россия (бренд Nokian)",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94R",
          "xl": true
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "kumho-wp52plus",
      "brand": "Kumho",
      "model": "WinterCraft WP52+",
      "type": "friction",
      "studs": 0,
      "country": "Южная Корея",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "91H",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "nexen-ws2",
      "brand": "Nexen",
      "model": "Winguard Sport 2",
      "type": "friction",
      "studs": 0,
      "country": "Южная Корея",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "91H",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "ikon-autograph-snow3",
      "brand": "Ikon",
      "model": "Autograph Snow 3",
      "type": "friction",
      "studs": 0,
      "country": "Россия (бренд Nokian)",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "94R",
          "xl": true
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Модель из отчёта / каталога 25.11.2026. Сравнительных оценок проекта нет — scores: null.",
      "sourceDate": "2026-11-25",
      "verified": true
    },
    {
      "id": "goodyear-ultragrip-ice-plus",
      "brand": "Goodyear",
      "model": "UltraGrip Ice+",
      "type": "friction",
      "studs": 0,
      "country": "США",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Кандидат TOP-30, добавлен 25.11.2026. Оценки, цена и наличие в Уссурийске уточняются дип-ресерчем; данные не выдумываются.",
      "sourceDate": "2026-11-25",
      "verified": false
    },
    {
      "id": "toyo-observe-gsi6",
      "brand": "Toyo",
      "model": "Observe GSi-6",
      "type": "friction",
      "studs": 0,
      "country": "Япония",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Кандидат TOP-30, добавлен 25.11.2026. Оценки, цена и наличие в Уссурийске уточняются дип-ресерчем; данные не выдумываются.",
      "sourceDate": "2026-11-25",
      "verified": false
    },
    {
      "id": "falken-eurowinter-hs449",
      "brand": "Falken",
      "model": "Eurowinter HS449",
      "type": "friction",
      "studs": 0,
      "country": "Япония",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Кандидат TOP-30, добавлен 25.11.2026. Оценки, цена и наличие в Уссурийске уточняются дип-ресерчем; данные не выдумываются.",
      "sourceDate": "2026-11-25",
      "verified": false
    },
    {
      "id": "bridgestone-blizzak-vrx",
      "brand": "Bridgestone",
      "model": "Blizzak VRX",
      "type": "friction",
      "studs": 0,
      "country": "Япония",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Кандидат TOP-30, добавлен 25.11.2026. Оценки, цена и наличие в Уссурийске уточняются дип-ресерчем; данные не выдумываются.",
      "sourceDate": "2026-11-25",
      "verified": false
    },
    {
      "id": "barum-polaris-5",
      "brand": "Barum",
      "model": "Polaris 5",
      "type": "friction",
      "studs": 0,
      "country": "Чехия (Continental)",
      "scores": null,
      "variants": [
        {
          "size": "205/55 R16",
          "load": "",
          "xl": false
        }
      ],
      "pros": [],
      "cons": [],
      "summary": "Кандидат TOP-30, добавлен 25.11.2026. Оценки, цена и наличие в Уссурийске уточняются дип-ресерчем.",
      "sourceDate": "2026-11-25",
      "verified": false
    }
  ],
  "wheels": [
    {
      "id": "w-kk-ks676",
      "brand": "K&K",
      "model": "КС676",
      "type": "steel",
      "condition": "new",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 50,
      "pcd": "5×112",
      "cb": 57.1,
      "weight": 8.9,
      "load": 620,
      "color": "серебро",
      "note": "Штамповка под штатный колпак VW. Лучший «рабочий» вариант на зиму."
    },
    {
      "id": "w-eurodisk",
      "brand": "Eurodisk",
      "model": "Стальной 6.5×16",
      "type": "steel",
      "condition": "new",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 50,
      "pcd": "5×112",
      "cb": 57.1,
      "weight": 9,
      "load": 600,
      "color": "серебро",
      "note": "Бюджетная штамповка. Проверять балансировку при покупке."
    },
    {
      "id": "w-trebl",
      "brand": "Trebl",
      "model": "Стальной 6.5×16",
      "type": "steel",
      "condition": "new",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 50,
      "pcd": "5×112",
      "cb": 57.1,
      "weight": 9.2,
      "load": 600,
      "color": "чёрный",
      "note": "Вариант «максимально сэкономить». Обязательно проверить биение."
    },
    {
      "id": "w-oem-used",
      "brand": "VW (OEM)",
      "model": "Штамповка б/у 6.5×16",
      "type": "steel",
      "condition": "used",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 50,
      "pcd": "5×112",
      "cb": 57.1,
      "weight": 9,
      "load": 620,
      "color": "серебро",
      "note": "Родные штампы с разборки в Уссурийске. Проверить биение и ржавчину; предложений с проверенной ценой нет."
    },
    {
      "id": "w-replica16",
      "brand": "Replica VW",
      "model": "Литой 6.5×16",
      "type": "cast",
      "condition": "new",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 50,
      "pcd": "5×112",
      "cb": 57.1,
      "weight": 8.6,
      "load": 650,
      "color": "серебро",
      "note": "Если хочется вид получше, но 17\" не нужен."
    },
    {
      "id": "w-skad16",
      "brand": "Скад",
      "model": "Литой 6.5×16",
      "type": "cast",
      "condition": "new",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 50,
      "pcd": "5×112",
      "cb": 57.1,
      "weight": 8.8,
      "load": 640,
      "color": "графит",
      "note": "Практичное литьё на зиму: не жалко, если поймал яму."
    }
  ],
  "offers": [
    {
      "source": "ШИНА25.РУ",
      "sourceDate": "2026-11-25",
      "pubDate": "не указана",
      "pubDateRaw": "не указана",
      "condition": "Новая",
      "price": 6450,
      "qty": 1,
      "verified": true,
      "shop": "shina25",
      "seller": "ШИНА25.РУ",
      "address": "Уссурийск, ул. Краснознамённая, 198В (в наличии 4 шт., резерв 1 раб. день при оплате в магазине); курьер по городу — в течение 2 ч после оплаты (1 000 ₽)",
      "url": "https://shina25.ru/catalog/tires/formula/formula-ice-fr/formula-ice-fr-avtoshiny-r16-205-55-94t-formula-ice-fr-xl/",
      "date": "2026-11-25",
      "priceNote": "6 450 ₽/шт.",
      "sourceNote": "Прямая карточка открылась, вход не нужен; суббренд Pirelli (РФ); наличие маркировки 3PMSF в карточке не указано — проверить на боковине",
      "reportRow": 3,
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "",
      "timeCar": null,
      "distHotel": "",
      "timeHotel": null,
      "id": "r25-03",
      "kind": "tire",
      "sku": "formula-ice-fr|16",
      "name": "Formula Ice FR",
      "tireId": "formula-ice-fr",
      "model": "205/55 R16 94T XL",
      "size": "205/55 R16",
      "d": 16,
      "type": "friction",
      "year": ""
    },
    {
      "source": "ШИНА25.РУ",
      "sourceDate": "2026-11-25",
      "pubDate": "не указана",
      "pubDateRaw": "не указана",
      "condition": "Новая",
      "price": 7700,
      "qty": 1,
      "verified": true,
      "shop": "shina25",
      "seller": "ШИНА25.РУ",
      "address": "Уссурийск, ул. Краснознамённая, 198В (в наличии 4 шт.)",
      "url": "https://shina25.ru/catalog/tires/ikon-tyres/ikon-tyres-character-snow-2/ikon-tyres-character-snow-2-avtoshiny-r16-205-55-94r-ikon-tyres-character-snow-2-xl/",
      "date": "2026-11-25",
      "priceNote": "7 700 ₽/шт.",
      "sourceNote": "Прямая карточка открылась 25.11.2026: в Уссурийске 4 шт.; сравнение имеет оценки ice7/snow8/wet7/dry7. 3PMSF на боковине проверить при получении.",
      "reportRow": 5,
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "",
      "timeCar": null,
      "distHotel": "",
      "timeHotel": null,
      "id": "r25-05",
      "kind": "tire",
      "sku": "ikon-snow2|16",
      "name": "Ikon Character Snow 2",
      "tireId": "ikon-snow2",
      "model": "205/55 R16 94R XL",
      "size": "205/55 R16",
      "d": 16,
      "type": "friction",
      "year": ""
    }
  ],
  "wheelOffers": [
    {
      "source": "ШИНА25.РУ",
      "sourceDate": "2026-11-25",
      "condition": "новые, 4 шт. в остатке сети; presence в Уссурийске уточнить",
      "price": 8500,
      "qty": 1,
      "verified": true,
      "shop": "shina25",
      "seller": "ШИНА25.РУ",
      "address": "Уссурийск, ул. Краснознамённая, 198В",
      "url": "https://shina25.ru/catalog/wheels/carwel/carwel-khanto/",
      "date": "2026-11-25",
      "priceNote": "8 500 ₽/диск · 34 000 ₽ за 4",
      "sourceNote": "Прямая карточка производителя; в Уссурийске наличие не подтверждено — звонить",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "1,77 км",
      "timeCar": 4,
      "distHotel": "3,2 км",
      "timeHotel": 6,
      "id": "wo-carwel-16",
      "diameter": 16,
      "widthJ": 6.0,
      "et": 50,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "cast",
      "name": "Carwel Ханто Hyper BLK",
      "model": "6,0J×16 5×112 ET50 ЦО 57,1"
    },
    {
      "source": "Drom",
      "sourceDate": "2026-11-25",
      "condition": "новые не подтверждены; под заказ ~10 дней",
      "price": 5810,
      "qty": 1,
      "verified": true,
      "shop": "shina25",
      "seller": "Drom / Уссурийск",
      "address": "Уссурийск; точка встречи уточняется в объявлении",
      "url": "https://baza.drom.ru/ussuriisk/wheel/disc/+/LegeArtis+Optima+SK23/",
      "date": "2026-11-25",
      "priceNote": "5 810 ₽/диск · 23 240 ₽ за 4",
      "sourceNote": "Расчётный кандидат P1; город и новизна продавца не подтверждены",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "1,77 км",
      "timeCar": 4,
      "distHotel": "3,2 км",
      "timeHotel": 6,
      "id": "wo-legeartis-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 46,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "cast",
      "name": "LegeArtis Optima SK23 S",
      "model": "6,5J×16 5×112 ET46 ЦО 57,1"
    },
    {
      "source": "FarPost",
      "sourceDate": "2026-11-25",
      "condition": "б/у, без пробега по РФ",
      "price": 5000,
      "qty": 1,
      "verified": true,
      "shop": "shiny-diski",
      "seller": "FarPost №138478583",
      "address": "Уссурийск, Московская ул., 38 (магазин «Шины и диски») — точка встречи уточняется",
      "url": "https://www.farpost.ru/ussuriisk/auto/wheel/disc/lite-eurodesign-r16-5-112-co-57-1-volkswagen-audi-6-5j-bez-probega-138478583.html",
      "date": "2026-11-25",
      "priceNote": "5 000 ₽/диск · 19 999 ₽ за 4",
      "sourceNote": "Топ-1 P2 по отчёту №2; R13 и ЦО измерить на месте",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "6,1 км",
      "timeCar": 10,
      "distHotel": "4,8 км",
      "timeHotel": 8,
      "id": "wo-eurodesign-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 45,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "cast",
      "name": "Manaray Sport Euro Design №138478583",
      "model": "6,5J×16 5×112 ET45 ЦО 57,1"
    },
    {
      "source": "FarPost",
      "sourceDate": "2026-11-25",
      "condition": "б/у, без пробега по РФ",
      "price": 5000,
      "qty": 1,
      "verified": true,
      "shop": "shiny-diski",
      "seller": "FarPost №136573751",
      "address": "Уссурийск, Московская ул., 38 (магазин «Шины и диски») — точка встречи уточняется",
      "url": "https://www.farpost.ru/ussuriisk/auto/wheel/disc/diski-5.112-r16-6.5-j-et48-b-p-po-rf-136573751.html",
      "date": "2026-11-25",
      "priceNote": "5 000 ₽/диск · 20 000 ₽ за 4",
      "sourceNote": "Равноценная альтернатива топ-1; измерить ЦО и R13",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "6,1 км",
      "timeCar": 10,
      "distHotel": "4,8 км",
      "timeHotel": 8,
      "id": "wo-eurotech-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 48,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "cast",
      "name": "Manaray Sport Eurotech №136573751",
      "model": "6,5J×16 5×112 ET48 ЦО 57,1"
    },
    {
      "source": "FarPost",
      "sourceDate": "2026-11-25",
      "condition": "б/у",
      "price": 7250,
      "qty": 1,
      "verified": true,
      "shop": "shiny-diski",
      "seller": "FarPost №137862041",
      "address": "Уссурийск, Московская ул., 38 (магазин «Шины и диски») — точка встречи уточняется",
      "url": "https://www.farpost.ru/ussuriisk/auto/wheel/disc/diski-volkswagen-r16-x-6j-48-5-112-germany-137862041.html",
      "date": "2026-11-25",
      "priceNote": "7 250 ₽/диск · 29 000 ₽ за 4",
      "sourceNote": "Топ-3: заводская сфера R13, проверить на месте",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "6,1 км",
      "timeCar": 10,
      "distHotel": "4,8 км",
      "timeHotel": 8,
      "id": "wo-vw-oem-16",
      "diameter": 16,
      "widthJ": 6.0,
      "et": 48,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "cast",
      "name": "Volkswagen Germany OEM №137862041",
      "model": "6,0J×16 5×112 ET48 ЦО 57,1"
    },
    {
      "source": "Drom",
      "sourceDate": "2026-11-25",
      "condition": "б/у",
      "price": 4999,
      "qty": 1,
      "verified": true,
      "shop": "shinatreyd",
      "seller": "Drom / Уссурийск",
      "address": "Уссурийск, Целинная ул., 2/3 (магазин «Шинатрейд») — точка встречи уточняется",
      "url": "https://baza.drom.ru/ussuriisk/wheel/disc/?condition%5B%5D=used&diskType%5B%5D=%EB%E8%F2%EE%E9&wheelDiameter%5B%5D=16",
      "date": "2026-11-25",
      "priceNote": "4 999 ₽/диск · 19 996 ₽ за 4",
      "sourceNote": "Лучшая цена P2; осмотреть металл и биение",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "4,8 км",
      "timeCar": 9,
      "distHotel": "6,4 км",
      "timeHotel": 10,
      "id": "wo-used-cast-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 45,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "cast",
      "name": "Б/у литой 6,5J×16 (модель не указана)",
      "model": "6,5J×16 5×112 ET45 ЦО 57,1"
    },
    {
      "source": "FarPost",
      "sourceDate": "2026-11-25",
      "condition": "б/у",
      "price": null,
      "qty": 1,
      "verified": true,
      "shop": "shiny-diski",
      "seller": "FarPost №138065955",
      "address": "Уссурийск, Московская ул., 38 (магазин «Шины и диски») — точка встречи уточняется",
      "url": "https://www.farpost.ru/ussuriisk/auto/wheel/disc/litje-5-112-16-138065955.html",
      "date": "2026-11-25",
      "priceNote": "цена не указана",
      "sourceNote": "Дополнительный лот: измерить ЦО и R13",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "6,1 км",
      "timeCar": 10,
      "distHotel": "4,8 км",
      "timeHotel": 8,
      "id": "wo-eurotech-et46-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 46,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "cast",
      "name": "Manaray Sport Eurotech ET46 №138065955",
      "model": "6,5J×16 5×112 ET46 ЦО уточнить"
    },
    {
      "source": "FarPost",
      "sourceDate": "2026-11-25",
      "condition": "б/у без пробега по РФ",
      "price": null,
      "qty": 1,
      "verified": true,
      "shop": "shiny-diski",
      "seller": "FarPost №88654766",
      "address": "Уссурийск, Московская ул., 38 (магазин «Шины и диски») — точка встречи уточняется",
      "url": "https://www.farpost.ru/ussuriisk/auto/wheel/disc/oettinger-r16-5-112-6.5-j-et47-bp-po-rf-video-88654766.html",
      "date": "2026-11-25",
      "priceNote": "цена не указана",
      "sourceNote": "На соседнем лоте ЦО 72 мм — измерить на месте",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "6,1 км",
      "timeCar": 10,
      "distHotel": "4,8 км",
      "timeHotel": 8,
      "id": "wo-oettinger-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 47,
      "pcd": "5×112",
      "cb": null,
      "type": "cast",
      "name": "Oettinger №88654766",
      "model": "6,5J×16 5×112 ET47 ЦО уточнить"
    },
    {
      "source": "Drom",
      "sourceDate": "2026-11-25",
      "condition": "б/у",
      "price": 3000,
      "qty": 1,
      "verified": true,
      "shop": "shinatreyd",
      "seller": "Drom №135757260",
      "address": "Уссурийск, Целинная ул., 2/3 (магазин «Шинатрейд») — точка встречи уточняется",
      "url": "https://baza.drom.ru/ussuriisk/wheel/disc/1sht-disk-original-volkswagen-r16-bez-probega-po-rf-135757260.html",
      "date": "2026-11-25",
      "priceNote": "3 000 ₽/диск · 12 000 ₽ за 4",
      "sourceNote": "Исключено: ET50 вне окна 44–48 — только для сравнения",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "4,8 км",
      "timeCar": 9,
      "distHotel": "6,4 км",
      "timeHotel": 10,
      "id": "wo-vw-stamp-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 50,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "steel",
      "name": "Штампованные VW №135757260",
      "model": "6,5J×16 5×112 ET50 ЦО 57,1"
    },
    {
      "source": "Drom",
      "sourceDate": "2026-11-25",
      "condition": "новые под заказ",
      "price": null,
      "qty": 1,
      "verified": true,
      "shop": "shina25",
      "seller": "Drom / Уссурийск",
      "address": "Уссурийск, ул. Краснознамённая, 198В (заказ дисков через ШИНА25.РУ)",
      "url": "https://baza.drom.ru/ussuriisk/wheel/disc/+/Volkswagen/?wheelDiameter%5B%5D=16",
      "date": "2026-11-25",
      "priceNote": "цена не указана",
      "sourceNote": "Volkswagen 16″: проверить геометрию по телефону",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "1,77 км",
      "timeCar": 4,
      "distHotel": "3,2 км",
      "timeHotel": 6,
      "id": "wo-vw16-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 46,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "steel",
      "name": "Volkswagen 16″ — подбор Drom",
      "model": "6,5J×16 5×112 ET46 ЦО 57,1"
    },
    {
      "source": "Drom",
      "sourceDate": "2026-11-25",
      "condition": "б/у",
      "price": null,
      "qty": 1,
      "verified": true,
      "shop": "shinatreyd",
      "seller": "Drom / Уссурийск",
      "address": "Уссурийск, Целинная ул., 2/3 (магазин «Шинатрейд») — точка встречи уточняется",
      "url": "https://baza.drom.ru/ussuriisk/wheel/wheel/",
      "date": "2026-11-25",
      "priceNote": "цена не указана",
      "sourceNote": "Все колёса и диски в Уссурийске — поиск по объявлениям",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "4,8 км",
      "timeCar": 9,
      "distHotel": "6,4 км",
      "timeHotel": 10,
      "id": "wo-all-wheels-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 46,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "steel",
      "name": "Все колёса и диски — Drom Уссурийск",
      "model": "подбор 16″ 5×112 ЦО 57,1"
    },
    {
      "source": "Avito",
      "sourceDate": "2026-11-25",
      "condition": "б/у",
      "price": null,
      "qty": 1,
      "verified": true,
      "shop": "shinny-dvor",
      "seller": "Avito / Уссурийск",
      "address": "Уссурийск, Краснознамённая ул., 6А, стр. 2 (магазин «Шинный двор») — точка встречи уточняется",
      "url": "https://www.avito.ru/ussuriysk/zapchasti_i_aksessuary/shiny_diski_i_kolesa/kolesa-ASgBAgICAkQKJooL~pwB",
      "date": "2026-11-25",
      "priceNote": "цена не указана",
      "sourceNote": "Колёса и диски в Уссурийске — проверить по объявлениям",
      "city": "Уссурийск",
      "traffic": "признак пробки не показан",
      "coords": "",
      "distCar": "3,4 км",
      "timeCar": 6,
      "distHotel": "1,24 км",
      "timeHotel": 3,
      "id": "wo-avito-wheels-16",
      "diameter": 16,
      "widthJ": 6.5,
      "et": 46,
      "pcd": "5×112",
      "cb": 57.1,
      "type": "cast",
      "name": "Колёса и диски — Avito Уссурийск",
      "model": "подбор 16″ 5×112 ЦО 57,1"
    }
  ],
  "rejected": [],
  "buyLinks": [
    {
      "group": "Шины — новая резина, физические магазины Уссурийска",
      "name": "Formula Ice FR XL · 205/55 R16 94T XL",
      "note": "6 450 ₽/шт · в наличии 4 шт в Уссурийске (самовывоз Краснознамённая, 198В; курьер по городу 1 000 ₽); суббренд Pirelli; 3PMSF уточнить на боковине",
      "source": "ШИНА25.РУ",
      "url": "https://shina25.ru/catalog/tires/formula/formula-ice-fr/formula-ice-fr-avtoshiny-r16-205-55-94t-formula-ice-fr-xl/"
    },
    {
      "group": "Шины — новая резина, физические магазины Уссурийска",
      "name": "Ikon Character Snow 2 XL · 205/55 R16 94R XL",
      "note": "7 700 ₽/шт · в наличии 4 шт в Уссурийске; 3PMSF уточнить на боковине",
      "source": "ШИНА25.РУ",
      "url": "https://shina25.ru/catalog/tires/ikon-tyres/ikon-tyres-character-snow-2/ikon-tyres-character-snow-2-avtoshiny-r16-205-55-94r-ikon-tyres-character-snow-2-xl/"
    },
    {
      "group": "Шины — новая резина, физические магазины Уссурийска",
      "name": "Ikon Autograph Snow 3 XL · 205/55 R16 94R XL",
      "note": "Карточка в наличии в Уссурийске; остатки и цена уточнить по карточке",
      "source": "ШИНА25.РУ",
      "url": "https://shina25.ru/catalog/tires/ikon-tyres/ikon-tyres-autograph-snow-3/ikon-tyres-autograph-snow-3-avtoshiny-r16-205-55-94r-ikon-tyres-autograph-snow-3-xl/"
    },
    {
      "group": "Шины — новая резина, физические магазины Уссурийска",
      "name": "Yokohama Ice Guard IG60 · 205/55 R16 91Q",
      "note": "7 191 ₽/шт · в наличии в Уссурийске по карточке; 3PMSF уточнить",
      "source": "ШИНА25.РУ",
      "url": "https://shina25.ru/catalog/tires/yokohama/yokohama-ice-guard-ig60/yokohama-ice-guard-ig60-avtoshiny-r16-205-55-91q-yokohama-ice-guard-ig60/"
    },
    {
      "group": "Шины — шипованные и 17″, физические магазины Уссурийска",
      "name": "Pirelli Ice Zero FR · 225/45 R17 2024",
      "note": "Карточка в наличии в Уссурийске по ШИНА25.РУ; 3PMSF уточнить",
      "source": "ШИНА25.РУ",
      "url": "https://shina25.ru/catalog/tires/pirelli/pirelli-ice-zero-fr/pirelli-ice-zero-fr-avtoshiny-r17-225-45-94h-pirelli-ice-zero-fr-xl-2024-god/"
    },
    {
      "group": "Шины — шипованные и 17″, физические магазины Уссурийска",
      "name": "Kumho Wi51 · 225/45 R17 2023",
      "note": "Карточка в наличии в Уссурийске по ШИНА25.РУ; 3PMSF уточнить",
      "source": "ШИНА25.РУ",
      "url": "https://shina25.ru/catalog/tires/kumho/kumho-wintercraft-ice-wi51/kumho-wintercraft-ice-wi51-avtoshiny-r17-225-45-94t-kumho-wintercraft-ice-wi51-2023-god/"
    },
    {
      "group": "Шины — шипованные и 17″, физические магазины Уссурийска",
      "name": "Cordiant Winter Drive 2 · 225/45 R17",
      "note": "Карточка в наличии в Уссурийске по ШИНА25.РУ; 3PMSF уточнить",
      "source": "ШИНА25.РУ",
      "url": "https://shina25.ru/catalog/tires/cordiant/cordiant-winter-drive-2/cordiant-winter-drive-2-avtoshiny-r17-225-45-94t-cordiant-winter-drive-2/"
    },
    {
      "group": "Диски — литые и б/у, физические магазины Уссурийска",
      "name": "Carwel Ханто · литой диск 6.5J",
      "note": "34 000 ₽ за диск · магазин ШИНА25.РУ, Уссурийск",
      "source": "ШИНА25.РУ",
      "url": "https://shina25.ru/catalog/wheels/carwel/carwel-khanto/"
    },
    {
      "group": "Диски — литые и б/у, физические магазины Уссурийска",
      "name": "LegeArtis Optima SK23 · б/у литой диск 6.5J",
      "note": "Предложение Drom, Уссурийск",
      "source": "Drom",
      "url": "https://baza.drom.ru/ussuriisk/wheel/disc/+/LegeArtis+Optima+SK23/"
    },
    {
      "group": "Диски — литые и б/у, физические магазины Уссурийска",
      "name": "Euro Design №138478583 · литой диск 5×112 ET44–48",
      "note": "Предложение FarPost, Уссурийск",
      "source": "FarPost",
      "url": "https://www.farpost.ru/ussuriisk/auto/wheel/disc/lite-eurodesign-r16-5-112-co-57-1-volkswagen-audi-6-5j-bez-probega-138478583.html"
    },
    {
      "group": "Контакты — звонки перед поездкой",
      "name": "Контакты ШИНА25.РУ · Уссурийск",
      "note": "Телефон для звонка перед поездкой; прямая карточка магазина",
      "source": "ШИНА25.РУ",
      "url": "https://shina25.ru/contacts/447822/"
    }
  ],
  "variants": [],
  "kits": []
};
