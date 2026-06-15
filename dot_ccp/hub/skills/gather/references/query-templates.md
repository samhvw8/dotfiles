# Query Templates

Search query patterns by language. Use the correct language — do NOT search in English expecting foreign results.

## Japanese (JA)

```
"[topic] ベストプラクティス"        (best practices)
"[topic] 設計パターン"              (design patterns)
"[topic] 実装方法"                  (implementation method)
"[topic] 組み込み 開発"             (embedded development)
"[topic] 性能改善"                  (performance improvement)
"[topic] ゲーム開発 最適化"         (game dev optimization)
"[topic] ロボット 制御"             (robot control)
```

## Korean (KO)

```
"[topic] 개발 가이드"               (development guide)
"[topic] 모바일 게임 최적화"        (mobile game optimization)
"[topic] 보안 취약점"               (security vulnerabilities)
"[topic] 핀테크 결제"               (fintech payments)
"[topic] 구현 방법"                 (implementation method)
```

## German (DE)

```
"[topic] Industrie 4.0 Umsetzung"   (Industry 4.0 implementation)
"[topic] Embedded Entwicklung"       (embedded development)
"[topic] Automatisierung Robotik"    (automation robotics)
"[topic] AUTOSAR Architektur"        (AUTOSAR architecture)
"[topic] Fertigung Digitalisierung"  (manufacturing digitalization)
```

## Portuguese (PT-BR)

```
"[topic] fintech implementacao"      (fintech implementation)
"[topic] pagamento digital PIX"      (digital payment PIX)
"[topic] desenvolvimento mobile"     (mobile development)
"[topic] banco central regulacao"    (central bank regulation)
```

## Vietnamese (VI)

```
"[topic] huong dan lap trinh"        (programming guide)
"[topic] bao mat web"               (web security)
"[topic] phat trien ung dung"       (application development)
```

## GitHub Queries (Conditional Languages)

```bash
# Japanese
gh search repos "[topic] [日本語キーワード]" --sort stars --limit 10
gh search code "[日本語キーワード]" --limit 10

# Korean
gh search repos "[topic] [한국어]" --sort stars --limit 10

# German
gh search repos "[topic] [Deutsche Begriffe]" --sort stars --limit 10
```

## Related

- [language-matrix.md](language-matrix.md) — when to add which language
- [SKILL.md](../SKILL.md) — main research methodology
