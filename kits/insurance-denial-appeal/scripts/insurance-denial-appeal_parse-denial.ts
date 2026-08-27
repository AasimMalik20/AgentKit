// Script: insurance-denial-appeal_parse-denial.ts
// Normalizes the incoming denial letter and does lightweight regex extraction to
// give the analysis LLM structured hints (amounts, dates, policy/claim numbers).

const rawTrigger = {{triggerNode_1.output}};

const letter = (rawTrigger.denialLetter || "").toString();
const policy = (rawTrigger.policySummary || "").toString();
const claim = (rawTrigger.claimDetails || "").toString();

// Lightweight regex extraction — the LLM does the real interpretation.
const amounts = (letter.match(/\$\s?\d[\d,]*\.?\d*/g) || []);
const dates = (letter.match(/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/g) || []);
const cptCodes = (letter.match(/\b[0-9]{5}\b/g) || []);

function grab(label, regex) {
  const m = letter.match(regex);
  return m && m[1] ? m[1].trim() : "";
}

const policyNumber = grab(/policy\s*(?:#|number|no\.?|id)?\s*[:#]?\s*([A-Za-z0-9\-]{4,})/i);
const claimNumber = grab(/claim\s*(?:#|number|no\.?|id)?\s*[:#]?\s*([A-Za-z0-9\-]{4,})/i);
const memberName = grab(/member(?:s)?\s*(?:name)?\s*[:#]?\s*([A-Z][A-Za-z\s\.\-']+)/i);
const denialAmount = (amounts.length ? parseFloat(amounts[0].replace(/[$,]/g, "")) : null);

output = {
  denialLetter: letter,
  policySummary: policy,
  claimDetails: claim,
  extracted: {
    policyNumber: policyNumber,
    claimNumber: claimNumber,
    memberName: memberName,
    denialAmount: denialAmount,
    amounts: amounts,
    dates: dates,
    cptCodes: cptCodes
  },
  charCount: letter.length,
  wordCount: letter.trim() ? letter.trim().split(/\s+/).length : 0
};
