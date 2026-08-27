# Insurance Denial Appeal — Agent

## Overview

This agent helps policyholders understand and respond to insurance claim denials. It parses a denial letter, classifies the denial reason, scores the strength of an appeal case, and produces a draft appeal letter with an evidence checklist and escalation path.

## Purpose

Insurance claim denials are common, but most policyholders do not appeal them — often because the process feels overwhelming. This agent lowers that barrier by turning a denial letter into a clear, structured action plan: here is what was denied, here is whether appealing makes sense, here is your draft letter, and here is what to do if it does not.

## Flows

### `insurance-denial-appeal` — Main Appeal Pipeline

**Trigger:** API request (`denialLetter`, optional `policySummary`, optional `claimDetails`)

**Processing:**

1. **Parse Denial** — regex extraction of amounts, dates, CPT/ICD codes, insurer name, policy/claim numbers
2. **Analyze Denial** (LLM) — classifies denial into one of 11 categories, scores appealability (0–100), extracts key arguments, builds evidence checklist, defines escalation path and deadline risk
3. **Build Evidence Checklist** — deterministic mapping from denial category to required supporting documents
4. **Draft Appeal Letter** (LLM) — generates a formal, persuasive appeal letter with subject line, recipient, body, and attached document list
5. **Assemble Response** — combines all outputs into a single JSON response

**Response:** Structured JSON with denial summary, appealability score, key arguments, evidence checklist, escalation path, deadline risk, and the draft appeal letter.

**When to use:** When a user has a denial letter and wants to understand their appeal options. The flow handles the full pipeline from raw text to actionable output in one API call.

**Output format:** JSON object containing `denialSummary`, `appealability`, `keyArguments`, `evidenceChecklist`, `escalationPath`, `deadlineRisk`, `appealLetter`, and `nextStep`.

## Guardrails

- Never fabricate policy language, clinical facts, dates, codes, or legal citations
- Never impersonate an attorney, physician, or insurer employee in any output
- Do not include PII (SSN, home address, phone number) in the appeal letter body
- If the denial category does not match any of the 11 defined categories, classify as `other` — never invent a new category
- If information is missing from the input, state what is missing rather than guessing

## Integration Reference

- **Lamatic Studio** — import the template or recreate the 7-node flow from `flows/insurance-denial-appeal.ts`
- **Generative model** — configure a model on both LLM nodes (Analyze Denial, Draft Appeal Letter). Claude Sonnet or Gemini recommended.
- **API key** — set your provider API key (e.g., `ANTHROPIC_API_KEY`) in the project settings

## Environment Setup

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | API key for the generative model on the LLM nodes |
| `LAMATIC_FLOW_ID` | Flow ID assigned by Studio after deployment (for API calls) |

## Quickstart

1. Import this template into [Lamatic Studio](https://studio.lamatic.ai)
2. Configure model credentials in the project settings
3. Deploy the flow and note the Flow ID
4. Call the API with your denial letter text
5. Review and send the drafted appeal letter

## Common Failure Modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Empty `appealLetter.letterBody` | LLM node had no model configured or API key missing | Configure a generative model on the Draft node and set the API key |
| `denialCategory` is blank | Denial letter did not contain clear keywords for any category | Check that the denial letter text is complete; the `unclear` category will be used as a fallback |
| `appealability.score` is 0 | Insufficient information provided (no policy summary, no claim details) | Provide `policySummary` and/or `claimDetails` to improve scoring accuracy |
| 404 on API call | Flow ID incorrect or flow not deployed | Verify the Flow ID in Studio and redeploy if necessary |
