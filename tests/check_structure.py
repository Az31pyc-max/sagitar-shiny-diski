# -*- coding: utf-8 -*-
"""Проверка: старые файлы проекта не изменены при сборке v2.0."""
from pathlib import Path
import hashlib, json, sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[2]
HASHES = Path(__file__).resolve().parent / "old_hashes.json"

hashes = json.loads(HASHES.read_text(encoding="utf-8"))
bad = []
for rel, expected in hashes.items():
    path = ROOT / rel
    if not path.exists():
        bad.append(f"{rel}: файл отсутствует")
        continue
    actual = hashlib.md5(path.read_bytes()).hexdigest()
    if actual != expected:
        bad.append(f"{rel}: {expected} -> {actual}")

print("Проверено старых файлов:", len(hashes))
print("Неожиданные изменения:", len(bad))
for line in bad:
    print(line)
sys.exit(1 if bad else 0)
