<a href="https://studio.lamatic.ai/template/insurance-denial-appeal" target="_blank" style="text-decoration:none;">
  <div align="right">
    <span style="display:inline-block;background:#e63946;color:#fff;border-radius:6px;padding:10px 22px;font-size:16px;font-weight:bold;letter-spacing:0.5px;text-align:center;transition:background 0.2s;box-shadow:0 2px 8px 0 #0001;">Deploy on Lamatic</span>
  </div>
</a>

# Insurance Denial Appeal

## About This Flow

This template turns an insurance claim denial letter into a complete appeal package. Paste the denial notice text and get back:

- **What was denied and why** — a structured summary (service, amount, dates, denial category)
- **An appealability score (0-100)** — is this denial worth appealing, and why
- **A draft appeal letter** — persuasive, formally correct, ready to review and sign
- **An evidence checklist** — exactly which documents to attach, specific to the denial reason
- **An escalation path** — what to do if the first appeal is denied

Most denials are never appealed, and the reason is usually "I didn't know how." This flow removes that barrier.

## Flow Components

This workflow includes the following node types:
- **graphqlNode** — API trigger (realtime)
- **codeNode ×3** — regex extraction, deterministic evidence checklist, response assembly
- **LLMNode ×2** — structured denial analysis, then appeal letter drafting
- **graphqlResponseNode** — API response

```
Trigger API → Parse Denial → Analyze Denial (LLM) → Build Evidence Checklist → Draft Appeal Letter (LLM) → Assemble Response → API Response
```

## Files Included

```
insurance-denial-appeal/
├── lamatic.config.ts                        # Project metadata (template, single flow)
├── agent.md                                 # Agent identity & capability doc
├── README.md                                # This file
├── flows/
│   └── insurance-denial-appeal.ts           # Self-contained flow graph
├── constitutions/
│   └── default.md                           # Guardrails (identity, safety, data handling, tone)
├── scripts/
│   ├── insurance-denial-appeal_parse-denial.ts       # Regex extraction + normalization
│   ├── insurance-denial-appeal_build-checklist.ts    # Denial category → evidence checklist
│   └── insurance-denial-appeal_assemble-response.ts  # Final response assembly
├── model-configs/
│   ├── insurance-denial-appeal_analyze.ts            # Model config (Analyze Denial node)
│   └── insurance-denial-appeal_draft.ts              # Model config (Draft Appeal Letter node)
└── prompts/
    ├── insurance-denial-appeal_analyze_system.md
    ├── insurance-denial-appeal_analyze_user.md
    ├── insurance-denial-appeal_draft_system.md
    └── insurance-denial-appeal_draft_user.md
```

## Usage

### 1. Import into Lamatic Studio

1. Open [Lamatic Studio](https://studio.lamatic.ai)
2. Create a new project (or open an existing one)
3. Import this template, or recreate the 7-node flow using the exported `flows/insurance-denial-appeal.ts`

### 2. Configure Models

On the **Analyze Denial** and **Draft Appeal Letter** nodes, select a generative model in the private input. A strong reasoning model (e.g., Claude Sonnet) works well for **Analyze**; a strong writer for **Draft**. Set your provider API key (e.g., `ANTHROPIC_API_KEY`) in the project settings.

### 3. Deploy

Click **Deploy** in Studio. Note the Flow ID for API calls.

### 4. Invoke via API

```bash
curl -X POST https://your-lamatic-endpoint/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation Appeal($input: AppealInput!) { appealDenial(input: $input) { appealLetter { subject letterBody } appealability { score verdict } } }",
    "variables": {
      "input": {
        "denialLetter": "Apex Health Insurance\nClaims Department\n\nDenial Notice\n\nMember: Jordan Smith\nPolicy #: AHC-448921\nClaim #: CLM-2026-77412\nDate of Service: 06/14/2026\nAmount Billed: $12,450.00\n\nRE: Denial of Claim CLM-2026-77412\n\nAfter review, this claim has been denied. Our records indicate the service is not medically necessary for your condition.\n\nYou have the right to appeal within 180 days.\n\nSincerely,\nClaims Review Department",
        "policySummary": "Plan AHC-448921 covers medically necessary outpatient surgical procedures. Pre-authorization is not required for this CPT code."
      }
    }
  }'
```

### 5. Example Response

```json
{
  "denialSummary": {
    "insurer": "Apex Health Insurance",
    "policyNumber": "AHC-448921",
    "claimNumber": "CLM-2026-77412",
    "serviceDenied": "Outpatient Surgical Procedure (CPT 29881)",
    "denialAmount": 12450,
    "dateOfService": "06/14/2026",
    "denialCategory": "not-medically-necessary"
  },
  "appealability": {
    "score": 72,
    "verdict": "strong-case",
    "reason": "The letter asserts a lack of medical necessity without citing any independent clinical review; the CPT code is a standard covered procedure and the policy covers it."
  },
  "keyArguments": [
    "The procedure is a standard covered benefit under the policy",
    "The denial letter provides no clinical basis for questioning medical necessity",
    "The treating physician's records document the clinical need for the arthroscopic procedure"
  ],
  "evidenceChecklist": [
    "Treating physician's letter of medical necessity (on letterhead)",
    "Clinical notes / treatment records covering the dates of service",
    "Peer-reviewed literature supporting the treatment for this condition",
    "Records of any prior approvals for the same treatment"
  ],
  "escalationPath": [
    "Internal appeal (deadline: within 180 days of the denial date)",
    "External review by an independent reviewer (ERISA plans and most states)",
    "State Department of Insurance complaint",
    "State consumer assistance program"
  ],
  "deadlineRisk": "low",
  "appealLetter": {
    "subject": "Appeal of Claim CLM-2026-77412 — Denial of Outpatient Surgical Procedure (CPT 29881), Date of Service 06/14/2026",
    "recipientName": "Claims Review Department",
    "letterBody": "To the Appeals Department... [full letter]",
    "attachedDocuments": ["Physician letter of medical necessity", "Clinical records", "Supporting literature"]
  },
  "nextStep": "File the internal appeal now — include the evidence checklist and the drafted letter. Most denials are overturned at this first stage."
}
```

## Input Parameters

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `denialLetter` | string | Yes | — | Full text of the denial notice / EOB denial page |
| `policySummary` | string | No | — | Coverage details or relevant policy document text |
| `claimDetails` | string | No | — | What was claimed: dates, amounts, provider |

## Denial Categories

| Category | Meaning | Typical best argument |
|----------|---------|----------------------|
| `not-medically-necessary` | Insurer disputes clinical need | Physician letter of necessity + clinical records |
| `out-of-network` | Provider/facility outside network | In-network availability proof + gap exception |
| `experimental-investigational` | Treatment deemed unestablished | Published clinical evidence + FDA status |
| `coding-error` | Wrong CPT/HCPCS/ICD code | Corrected claim + records supporting the code |
| `missing-documentation` | Records/forms not provided | Provide the specific missing documents |
| `pre-existing` | Condition predated coverage | Evidence of later onset + ACA protections |
| `coverage-limit` | Benefit maximum reached | Policy language + exception request |
| `authorization-not-obtained` | Prior auth missing | Retroactive auth + clinical urgency proof |
| `incorrectly-billed` | Provider billing error | Itemized bill + corrected claim |
| `unclear` | No specific reason stated | Request itemized EOB + full policy |
| `other` | Anything else | Itemized EOB + full policy |

## Extending

- Add a **document-parsing flow** upstream to extract the denial letter from a PDF or URL (becomes a **bundle**)
- Add a **webhook node** after the response to email the letter or file the appeal automatically
- Add a **memory node** to track multiple appeals for the same policyholder over time
- Wrap in a **Next.js app** where users paste letters and download the appeal package (becomes a **kit**)

## Support

- Review node documentation for specific integrations
- Check Lamatic documentation at [docs.lamatic.ai](https://docs.lamatic.ai)
- Ask in [GitHub Discussions](https://github.com/Lamatic/AgentKit/discussions)

## Tags

Insurance, Healthcare, Appeal, Document, Letter
