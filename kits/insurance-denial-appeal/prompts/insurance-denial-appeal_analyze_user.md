## Claim Denial Letter (raw text)
```
{{codeNode_486.output.denialLetter}}
```
## Policy / Coverage Summary (if provided)
```
{{codeNode_486.output.policySummary}}
```
## Claim Details (if provided)
```
{{codeNode_486.output.claimDetails}}
```
## Structured Hints (regex extraction, verify with the letter)
- Policy number: `{{codeNode_486.output.extracted.policyNumber}}`
- Claim number: `{{codeNode_486.output.extracted.claimNumber}}`
- Member name: `{{codeNode_486.output.extracted.memberName}}`
- First dollar amount found: `{{codeNode_486.output.extracted.denialAmount}}`
- Dates found: `{{codeNode_486.output.extracted.dates}}`
- 5-digit codes found: `{{codeNode_486.output.extracted.cptCodes}}`
Produce the structured assessment per the system prompt. If the letter text is empty or unreadable, report `unclear` for the category and explain what is missing.