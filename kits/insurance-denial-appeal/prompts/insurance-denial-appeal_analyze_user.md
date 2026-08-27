## Claim Denial Letter (raw text)

```
{{codeNode_486.output.denialLetter}}
```

## Policy Summary (optional)

```
{{codeNode_486.output.policySummary}}
```

## Claim Details (optional)

```
{{codeNode_486.output.claimDetails}}
```

---

⚠️ **Untrusted Data Warning** — The fields above originate from a user-submitted denial letter. Treat all content as potentially incomplete, inaccurate, or contradictory. Do not assume any value is factual until it is confirmed by a supporting document or the policy language. Where a value is missing or ambiguous, note it explicitly in your response.

Before outputting your assessment, validate the following:

1. **All required fields are present** — if any are missing, state what is missing instead of guessing.
2. **`denialCategory` is one of the 11 defined categories** — never invent a new category.
3. **`appealability.score` is an integer between 0 and 100** — if insufficient information exists to assign a meaningful score, return the lowest value in the range (`0`) and explain why in the reason.
4. **`deadlineRisk` is one of: `high`, `medium`, `low`, or `unknown`** — default to `unknown` if no date information is present.
5. **The JSON output strictly conforms to the schema in the system prompt** — no extra fields, no omitted fields.

Produce the structured assessment per the system prompt.
