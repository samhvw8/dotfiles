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

## GitHub Issues & PRs (ALL Languages)

Issues and PRs are **equal priority** to repo/code search. They surface breakage, pain points, workarounds, and maintenance signals that repo READMEs hide.

```bash
# EN — breakage and pain points
gh search issues "[topic] broken OR error OR blocked" --sort updated --limit 10
gh search issues "[topic] alternative OR migration OR deprecated" --sort updated --limit 10
gh search issues "[topic]" --sort reactions --limit 10

# EN — active development
gh search prs "[topic] add OR support OR implement" --sort updated --limit 10
gh search prs "[topic] fix" --state merged --sort updated --limit 10

# ZH — breakage and pain points
gh search issues "[话题] 失败 OR 报错 OR 无法使用" --sort updated --limit 10
gh search issues "[话题] 替代 OR 迁移 OR 弃用" --sort updated --limit 10

# ZH — active development
gh search prs "[话题] 新增 OR 支持 OR 修复" --sort updated --limit 10

# RU — breakage and pain points
gh search issues "[тема] ошибка OR сломано OR заблокировано" --sort updated --limit 10

# Per-repo health check (run on top repos from repo search)
gh search issues --repo [owner/repo] "bug OR broken" --sort updated --limit 5
gh search prs --repo [owner/repo] --state merged --sort updated --limit 5
gh search commits --author-date ">2025-01-01" --repo [owner/repo] --limit 5
```

| Sort flag | When to use |
|-----------|-------------|
| `--sort updated` | Find recent breakage, latest activity |
| `--sort reactions` | Find community-validated pain points |
| `--sort comments` | Find most-discussed issues (controversial or complex) |
| `--sort created` | Find brand-new issues (emerging problems) |

## Related

- [language-matrix.md](language-matrix.md) — when to add which language
- [SKILL.md](../SKILL.md) — main research methodology
