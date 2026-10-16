# `POST /api/assist`

Production shape for ClearPath Financial Market Compliance Review. The static GitHub Pages build cannot host this route; production hosting (or a BFF) must.

## Request

```http
POST /api/assist
Content-Type: application/json
```

Body (subset of the review packet):

```json
{
  "id": "CP-1042",
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
  "creativeImage": "data:image/png;base64,…" 
}
```

`creativeImage` may be omitted when oversized; the client currently skips embedding above ~120k characters.

## Response

```json
{
  "findings": [
    {
      "code": "missing_disclosure",
      "reason": "Rate claim lacks accompanying APR disclosure near the headline.",
      "where": "Banner headline / disclosure band"
    }
  ]
}
```

- `code` must be a known `ReasonCode`.
- `reason` and `where` are required non-empty strings.
- Never return an approval decision — assist only suggests findings for human review.

## Auth

API keys stay **server-side**. Browser-held keys are prototype-only via reviewer settings.
