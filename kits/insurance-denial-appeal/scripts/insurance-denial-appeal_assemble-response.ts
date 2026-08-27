// Flatten and assemble the full response for the API caller.
// All PII (policyNumber, claimNumber) is included in denialSummary for reference only;
// the appeal letter body deliberately omits the policyholder's personal name and address.

output = {
  denialSummary: {
    insurer: summary.insurer || null,
    policyNumber: summary.policyNumber || null,
    claimNumber: summary.claimNumber || null,
    serviceDenied: summary.serviceDenied || null,
    denialAmount: summary.denialAmount || null,
    dateOfService: summary.dateOfService || null,
    denialCategory: analysis.denialCategory || null,
  },
  appealability: {
    score: analysis.appealability?.score || null,
    verdict: analysis.appealability?.verdict || null,
    reason: analysis.appealability?.reason || null,
  },
  keyArguments: analysis.keyArguments || [],
  evidenceChecklist: analysis.evidenceChecklist || [],
  escalationPath: analysis.escalationPath || [],
  deadlineRisk: analysis.deadlineRisk || null,
  appealLetter: {
    subject: draft.subject || null,
    recipientName: draft.recipientName || null,
    letterBody: draft.letterBody || null,
    attachedDocuments: draft.attachedDocuments || [],
  },
  nextStep: getNextStep(analysis, draft),
};

function getNextStep(a, d) {
  const verdict = a.appealability?.verdict || "";
  const risk = a.deadlineRisk || "unknown";
  const subject = d.subject || "";

  if (verdict === "no-appeal") {
    return (
      "The denial appears unlikely to be overturned on appeal. " +
      "Review the escalation path and consider filing a State Department of Insurance complaint or seeking independent legal counsel."
    );
  }

  if (risk === "high") {
    return (
      "File the internal appeal immediately — the deadline risk is high. " +
      "Include the evidence checklist and the drafted letter."
    );
  }

  if (subject && subject.length > 5) {
    return (
      "Review the drafted appeal letter with your provider, attach the evidence checklist, and file the internal appeal before the deadline."
    );
  }

  return (
    "Review the denial analysis and evidence checklist, then proceed with the appeal process outlined in the escalation path."
  );
}
