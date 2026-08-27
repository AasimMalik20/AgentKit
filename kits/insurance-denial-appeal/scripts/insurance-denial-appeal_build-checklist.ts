// Script: insurance-denial-appeal_build-checklist.ts
// Deterministically maps the denial category from the analysis LLM to the
// concrete evidence checklist the policyholder needs to gather. No LLM here —
// this is stable, rule-based structure (LLM for judgment, code for certainty).

const analysis = {{LLMNode_446.output}};

// Denial category -> required supporting documents
const CHECKLISTS = {
  "not-medically-necessary": [
    "Treating physician's letter of medical necessity (on letterhead)",
    "Clinical notes / treatment records covering the dates of service",
    "Peer-reviewed literature supporting the treatment for this condition",
    "Records of any prior approvals for the same treatment",
  ],
  "out-of-network": [
    "Screenshot of insurer's provider directory showing no in-network provider for this specialty",
    "Itemized out-of-network bill from the provider",
    "Evidence the service was emergent, if applicable",
    "Gap-exception / continuity-of-care request form if an in-network option does not exist",
  ],
  "experimental-investigational": [
    "Published clinical evidence (RCTs or major guidelines) that the treatment is standard of care",
    "FDA approval status of the drug or device",
    "Medicare NCD/LCD or insurer medical policy citing coverage",
    "Physician letter explaining why the treatment is appropriate for this patient",
  ],
  "coding-error": [
    "Corrected claim with the correct CPT/HCPCS and ICD-10 codes",
    "Medical records supporting the corrected codes",
    "Billing department's written confirmation of the coding correction",
  ],
  "missing-documentation": [
    "The specific records the insurer said were missing",
    "Clinical notes for every date of service in the claim",
    "Provider attestation / corrected submission",
  ],
  "pre-existing": [
    "Evidence the condition was first treated after the coverage effective date",
    "Prior insurance records showing no earlier diagnosis or treatment",
    "State or ACA pre-existing-condition protections applicable to this plan",
  ],
  "coverage-limit": [
    "Policy language showing this benefit is covered under the plan",
    "Benefit accumulation / usage records for the current plan year",
    "Exception or extension request if the limit was exhausted",
  ],
  "authorization-not-obtained": [
    "Retroactive authorization request",
    "Clinical urgency documentation from the provider",
    "Insurer's own authorization guidelines showing the service type",
  ],
  "incorrectly-billed": [
    "Itemized bill from the provider",
    "Corrected billing codes / re-billed claim",
    "Written explanation from the provider's billing office",
  ],
  "unclear": [
    "Request the insurer's itemized explanation of benefits",
    "Full policy document / certificate of coverage",
    "A copy of the claim file",
  ],
  "other": [
    "Request the insurer's itemized explanation of benefits",
    "Full policy document / certificate of coverage",
    "The insurer's internal appeal form (all appeals must include one)",
  ],
};

// Appealability verdict from the 0-100 score
function verdictFor(score) {
  if (score == null) return "moderate-case";
  if (score >= 51) return "strong-case";
  if (score >= 21) return "moderate-case";
  if (score >= 1) return "low-case";
  return "no-appeal";
}

// Plain-language next step for the policyholder
function nextStepFor(category, verdict) {
  if (verdict === "strong-case") {
    return "File the internal appeal now — include the evidence checklist and the drafted letter. Escalate to external review or your state insurance department if the first appeal is denied.";
  }
  if (verdict === "moderate-case") {
    return "Gather the evidence checklist first, then file the internal appeal. If it is denied again, escalate to an external review or your state insurance department.";
  }
  return "Consider whether an appeal is worth the effort — or request the insurer's internal appeal form and a full itemized explanation before deciding. A state insurance department complaint may surface errors the letter cannot.";
}

const category = (analysis.denialCategory || "other").toLowerCase();
const evidenceChecklist = CHECKLISTS[category] || CHECKLISTS["other"];

const appealabilityScore = Number(analysis.appealability?.score);
const verdict = verdictFor(appealabilityScore);
const nextStep = nextStepFor(category, verdict);

output = {
  analysis: analysis,
  evidenceChecklist: evidenceChecklist,
  appealability: {
    score: appealabilityScore,
    verdict: verdict,
    reason: analysis.appealabilityReason || "",
  },
  nextStep: nextStep,
};
