# Insurance Denial Appeal

## Overview
An AI agent that transforms an insurance claim denial letter into a complete, actionable appeal package. It parses the denial, classifies the reason, scores appealability, drafts a formal appeal letter, and produces a targeted evidence checklist with an escalation path.

## Purpose
Most insurance claim denials are never appealed — not because the denial is correct, but because the policyholder doesn't know how to challenge it. This agent removes that barrier by producing a structured, persuasive appeal letter and a concrete checklist of documents to gather, grounded in the specific denial reason.

## Flows

### insurance-denial-appeal
- **Trigger:** Realtime GraphQL API — accepts `denialLetter`, `policySummary` (optional), `claimDetails` (optional)
- **Parse Denial:** Light regex extraction of amounts, dates, CPT/ICD codes, policy and claim numbers
- **Analyze Denial (LLM):** Extracts facts, classifies into one of 11 denial categories, scores appealability (0–100), recommends arguments, identifies recipient and escalation path
- **Build Evidence Checklist:** Deterministically maps the denial category to a specific evidence checklist — no LLM, fully reproducible
- **Draft Appeal Letter (LLM):** Writes a formal, persuasive appeal letter using the analysis and checklist
- **Assemble Response:** Combines all outputs into a single structured response
- **Response:** Returns JSON with denial summary, appealability, key arguments, evidence checklist, escalation path, deadline risk, appeal letter, and next step

**When to use:** Any time a policyholder receives a claim denial and wants to understand what was denied, whether it's worth appealing, and how to proceed.

## Guardrails
- Never fabricate dates, codes, policy language, or legal authority
- Never impersonate an attorney, physician, or insurer employee
- Never include PII (SSN, address, phone) in output
- Letters are drafted on behalf of the policyholder, not as legal advice
- If the denial letter is vague or missing information, flag it — do not guess

## Integration Reference
- **LLM Provider:** Any provider configured in Lamatic Studio (Gemini, Anthropic, OpenAI)
- **No external API calls** beyond the LLM
- **No database or persistent storage** required

## Environment Setup
No environment variables are required. Configure the LLM model and credentials inside Lamatic Studio.

## Quickstart
1. Import the `insurance-denial-appeal.ts` flow into Lamatic Studio
2. Select a generative model for the two LLM nodes (Analyze Denial, Draft Appeal Letter)
3. Deploy the flow
4. Send a POST to the flow endpoint with `denialLetter`, `policySummary`, and `claimDetails`
5. Receive the full appeal package as JSON

## Common Failure Modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| "Invalid node reference" | `{{...}}` variable names don't match actual node IDs in Studio | Ensure all template vars use the node IDs shown in Studio |
| LLM returns unstructured text | LLM node not set to structured-output mode | Enable JSON/schema mode on the node if available |
| Empty checklist for a category | Denial category doesn't match any key in CHECKLISTS object | Verify the LLM's `denialCategory` output matches one of the 11 defined keys |
| Appeal letter is generic | Analysis didn't extract specific facts | Ensure the analysis prompt is referenced correctly and the denial letter is non-empty |
