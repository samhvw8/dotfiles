# Language Matrix

Field-to-language mapping for conditional research languages beyond EN/ZH/RU.

## Tier Definitions

| Tier | Meaning | Action |
|------|---------|--------|
| **T1** | Global leader; unique non-duplicative content | MUST search |
| **T2** | Strong contributor; useful signal | RECOMMENDED |
| **T3** | Emerging; search only if T1/T2 insufficient | OPTIONAL |

## Field Matrix

| Field | JA | KO | DE | PT-BR | VI |
|-------|----|----|----|----|-----|
| AI/ML, LLMs | T3 | T3 | T3 | - | - |
| Mobile dev | T2 | T2 | - | T3 | - |
| Game dev | **T1** | **T1** | - | - | - |
| Embedded/IoT | **T1** | - | T2 | - | - |
| Fintech/payments | - | T2 | - | **T2** | - |
| E-commerce | T2 | T2 | - | T3 | - |
| Security/pentesting | T2 | **T1** | - | - | T2 |
| Robotics/automation | **T1** | T2 | **T1** | - | - |
| Manufacturing/Industry 4.0 | **T1** | T2 | **T1** | - | - |
| Automotive SW | **T1** | - | **T1** | - | - |
| Frontend/UI | T2 | T2 | - | - | - |
| Competitive programming | T2 | T2 | - | - | - |
| Healthcare/biotech SW | T2 | - | T2 | - | - |

## UNIQUE Decision Test

Before adding a language, score these 5 criteria (YES=1, NO=0). Add if >= 4.

```
U - Unique: Non-duplicative insights (not EN translations)?
N - Non-trivial volume: >1000 relevant articles/discussions?
I - Indexed: Search engines + AI models can access?
Q - Quality: Platform with quality enforcement exists?
E - Expert practitioners: Domain experts publish in this language?
```

## Key Platforms

| Language | Platform | Type | Strength |
|----------|----------|------|----------|
| JA | Qiita | Blog | ~2M users; short technical articles |
| JA | Zenn | Blog/Books | GitHub-integrated; longer-form |
| KO | Velog | Blog | Developer-focused; Korean Dev.to |
| KO | Tistory | Blog | Kakao-owned; mixed quality |
| DE | Heise.de | News | Premier German tech news |
| DE | Golem.de | News | IT deep technical articles |
| PT-BR | TabNews | Forum | Brazilian HN-style |
| VI | Viblo | Platform | Blog+CTF+learning integrated |

## Related

- [SKILL.md](../SKILL.md) — main research methodology
- [query-templates.md](query-templates.md) — search queries per language
