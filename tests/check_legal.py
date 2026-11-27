# -*- coding: utf-8 -*-
from pathlib import Path
import sys
sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent.parent
pages = [(HERE / "legal.html").read_text(encoding="utf-8"),
         (HERE / "LEGAL.md").read_text(encoding="utf-8")]
index = (HERE / "index.html").read_text(encoding="utf-8")
required = [
  '152-ФЗ', 'персональные данные не собираются',
  'sagitar_legal_v2', 'sagitar_link_', 'как есть',
  'не является юридическим заключением', 'не аффилирован',
  'Реклама', 'ERID', 'налог', 'VW'
]
missing = []
for label, text in [("legal.html", pages[0]), ("LEGAL.md", pages[1])]:
    for phrase in required:
        if phrase.lower() not in text.lower():
            missing.append(label + ": " + phrase)
if 'href="legal.html"' not in index:
    missing.append("index.html: нет ссылки на legal.html")
print("Проверено требований:", len(required) * 2 + 1)
print("Недостаёт:", len(missing))
for line in missing:
    print(line)
sys.exit(1 if missing else 0)
