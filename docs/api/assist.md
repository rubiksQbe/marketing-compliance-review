# `POST /api/assist`

Production BFF shape. Static GitHub Pages cannot host this route.

Client resolution: **proxy → optional OpenAI key (AI assist page, via Vite `/api/openai` proxy in dev) → heuristic fallback**. Never auto-Approve.

## Request

```http
POST /api/assist
Content-Type: application/json
```

```json
{
  "id": "CP-1050",
  "title": "…",
  "product": "personal_loans",
  "channel": "affiliate",
  "assetType": "banner",
  "audience": "…",
  "body": "…",
  "disclosures": "…",
  "claimFlags": ["apr_or_rate"],
  "riskTier": "high",
  "destinationUrl": "https://…",
  "source": "affiliate",
  "partnerName": "…",
  "creativeImage": "data:image/svg+xml;charset=utf-8,…"
}
```

Omit `creativeImage` when oversized (~120k char client skip).

## Response

```json
{
  "summary": "Short plain-language triage note (no reason-code lists).",
  "findings": [
    {
      "code": "missing_disclosure",
      "reason": "Rate claim lacks accompanying APR disclosure near the headline.",
      "where": "Headline band"
    }
  ],
  "callouts": [
    {
      "id": "headline",
      "label": "Headline band",
      "detail": "From 6.99% APR — apply in minutes",
      "relatedCodes": ["trigger_terms_incomplete", "missing_disclosure"]
    }
  ]
}
```

- `summary`, and each finding’s `code` / `reason` / `where`, required  
- `callouts` optional; UI merges related callout detail into findings (one **On creative** line)  
- Optional `suggestedTier` (`low` | `medium` | `high`) when findings need a deeper checklist than the packet’s current tier; the client also infers this from content + finding codes  
- Auth: server-side keys only in production; browser OpenAI key is prototype-only via **Review queue → AI assist** (dev/preview)
