# Insurance Denial Appeal

A **template** that turns an insurance claim denial letter into a complete appeal package: structured analysis, an appealability score, a draft appeal letter, an evidence checklist, and an escalation path.

## What This Flow Does

You paste the denial letter text. The flow returns:

- **What was denied and why** — service, amount, dates, denial category
- **An appealability score (0–100)** — is this denial worth appealing
- **A draft appeal letter** — persuasive, formally correct, ready to review
- **An evidence checklist** — which documents to attach, specific to the denial reason
- **An escalation path** — what to do if the first appeal is denied

## When to Use This

Use this when a policyholder has received a written denial for a claim and wants to understand their options and prepare an appeal. It is most useful for health insurance denials (surgical, diagnostic, prescription, inpatient), but works for any insurance type where denials follow a similar format.

## Flow Details

**7 nodes** in a single sequential pipeline:

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | Trigger API | `graphqlNode` | API intake: `denialLetter`, `policySummary`, `claimDetails` |
| 2 | Parse Denial | `codeNode` | Regex extraction of amounts, dates, CPT/ICD codes, policy/claim numbers |
| 3 | Analyze Denial | `LLMNode` | Classifies denial, scores appealability, extracts arguments and escalation path |
| 4 | Build Evidence Checklist | `codeNode` | Maps denial category to required supporting documents |
| 5 | Draft Appeal Letter | `LLMNode` | Generates a formal, persuasive appeal letter with subject, recipient, body |
| 6 | Assemble Response | `codeNode` | Combines all outputs into a single JSON response |
| 7 | API Response | `graphqlResponseNode` | Returns the structured JSON |

## Prerequisites

- A Lamatic Studio account
- An active generative model configured in Studio (Claude Sonnet or Gemini recommended for the two LLM nodes)
- API keys for the model provider (e.g., `ANTHROPIC_API_KEY`) in project settings

## Usage

### 1. Import into Studio

Open [Lamatic Studio](https://studio.lamatic.ai), create a new project, and import the `insurance-denial-appeal` template, or recreate the flow using the exported `flows/insurance-denial-appeal.ts`.

### 2. Deploy

Click **Deploy**. Note the Flow ID for API calls.

### 3. Invoke via API

Use the Lamatic workflow endpoint with your project credentials:

```bash
curl -X POST https://your-lamatic-endpoint/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "x-project-id: YOUR_PROJECT_ID" \
  -d '{
    "query": "mutation ExecuteWorkflow($workflowId: String!, $payload: JSON!) { executeWorkflow(workflowId: $workflowId, payload: $payload) { status result } }",
    "variables": {
      "workflowId": "YOUR_FLOW_ID",
      "payload": {
        "denialLetter": "[paste denial letter text here]",
        "policySummary": "[optional: policy coverage summary]",
        "claimDetails": "[optional: claim date, amount, provider]"
      }
    }
  }'
```

## Expected Output

A single JSON object containing:

```json
{
  "denialSummary": {
    "insurer": "String",
    "policyNumber": "String or null",
    "claimNumber": "String or null",
    "serviceDenied": "String",
    "denialAmount": "Number or null",
    "dateOfService": "String or null",
    "denialCategory": "String (one of 11 categories)"
  },
  "appealability": {
    "score": "Integer 0–100",
    "verdict": "low-case | moderate-case | strong-case | no-appeal",
    "reason": "String"
  },
  "keyArguments": ["String", "String", "String"],
  "evidenceChecklist": ["String", "String", "String"],
  "escalationPath": ["String"]
  "deadlineRisk": "high | medium | low | unknown",
  "appealLetter": {
    "subject": "String",
    "recipientName": "String",
    "letterBody": "String",
    "attachedDocuments": ["String", "String"]
  },
  "nextStep": "String"
}
```

## Extending

- **Add a document parser** upstream to extract denial letters from PDFs or URLs → becomes a **bundle**
- **Add a webhook** after the response node to email the letter or file the appeal automatically
- **Add a memory node** to track multiple appeals for the same policyholder over time
- **Wrap in a Next.js app** where users paste letters and download the appeal package → becomes a **kit**

## Support

- Review node documentation for specific integrations
- Check Lamatic documentation at [docs.lamatic.ai](https://docs.lamatic.ai)
- Ask in [GitHub Discussions](https://github.com/Lamatic/AgentKit/discussions)
