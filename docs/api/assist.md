# `POST /api/assist`

Production shape for ClearPath Financial Market Compliance Review. The static GitHub Pages build cannot host this route; production hosting (or a BFF) must.

Desk-style triage: draft issue spotting, optional vision on proof images, where/reason findings, creative callouts, and a short reviewer summary. Never return an approval decision.

## Request

```http
POST /api/assist
Content-Type: application/json
```

Body (subset of the review packet):

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
  "creativeImage": "data:image/svg+xml;base64,…"
}
```

`creativeImage` may be omitted when oversized; the client currently skips embedding above ~120k characters.

## Response

```json
{
  "summary": "2–4 sentences for the reviewer: claims, risk posture, what to verify before Approve.",
  "findings": [
    {
      "code": "missing_disclosure",
      "reason": "Rate claim lacks accompanying APR disclosure near the headline.",
      "where": "Banner headline / disclosure band"
    }
  ],
  "callouts": [
    {
      "id": "headline",
      "label": "Headline band (proof)",
      "detail": "From 6.99% APR — apply in minutes",
      "relatedCodes": ["trigger_terms_incomplete", "missing_disclosure"]
    }
  ]
}
```

- `summary` is required (non-empty string).
- `code` must be a known `ReasonCode`.
- `reason` and `where` are required non-empty strings on each finding.
- `callouts` may be empty; when present each needs `id`, `label`, `detail`.
- Never return an approval decision — assist only suggests findings for human review.

## Auth

API keys stay **server-side**. Browser-held keys are prototype-only via reviewer Assist settings.
