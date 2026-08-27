/*
 * # Insurance Denial Appeal
 * Turns an insurance claim denial letter into a complete appeal package: structured analysis, appealability score, draft appeal letter, evidence checklist, and escalation path.
 *
 * ## Purpose
 * This flow automates the most common barrier to appealing an insurance claim denial: not knowing how. It receives a denial letter (and optional supporting documents), classifies the denial reason, scores how likely an appeal is to succeed, drafts a formal appeal letter on the policyholder's behalf, and produces a targeted evidence checklist specific to the denial category.
 *
 * ## When To Use
 * - A policyholder has received a claim denial letter and wants to understand what was denied, whether it's worth appealing, and how to proceed
 * - A healthcare advocate or billing specialist needs a quick appealability assessment for a denied claim
 * - An automation system needs to triage incoming denials and route strong cases to fast-track appeals
 *
 * ## When Not To Use
 * - The claim was approved (no denial to appeal)
 * - The denial is for a service not covered by any policyholder insurance plan
 * - The user needs legal representation (this drafts letters, not legal filings)
 *
 * ## Inputs
 * | Field | Type | Required | Default | Description |
 * |-------|------|----------|---------|-------------|
 * | `denialLetter` | string | Yes | — | Full text of the denial notice / EOB denial page |
 * | `policySummary` | string | No | — | Coverage details or relevant policy document text |
 * | `claimDetails` | string | No | — | What was claimed: dates, amounts, provider |
 *
 * ## Outputs
 * | Field | Type | Description |
 * |-------|------|-------------|
 * | `denialSummary` | object | Insurer, policy/claim numbers, service denied, amount, date, category |
 * | `appealability` | object | Score (0-100), verdict (strong-case/uncertain/weak-case), reason |
 * | `keyArguments` | string[] | 2-4 concrete arguments the appeal should make |
 * | `evidenceChecklist` | string[] | Specific documents to attach, tied to the denial category |
 * | `escalationPath` | string[] | Ordered next steps if the internal appeal is denied |
 * | `deadlineRisk` | string | high / medium / low / unknown |
 * | `appealLetter` | object | subject, recipientName, letterBody, attachedDocuments |
 * | `nextStep` | string | Plain-language recommendation for the policyholder |
 */

// Flow: insurance-denial-appeal

// -- Meta --
export const meta = {
  "name": "insurance-denial-appeal",
  "description": "Parses an insurance claim denial letter, classifies the denial reason, assesses appealability, drafts a persuasive appeal letter, and returns a concrete evidence checklist plus escalation path.",
  "tags": ["insurance", "healthcare", "appeal", "document", "letter"],
  "testInput": null,
  "githubUrl": "https://github.com/Lamatic/AgentKit/tree/main/kits/insurance-denial-appeal",
  "documentationUrl": "",
  "deployUrl": "",
  "author": {
    "name": "Aasim Malik",
    "email": "aasimmalik29@gmail.com"
  }
};

// -- Inputs --
export const inputs = {
  "LLMNode_446": [
    {
      "name": "generativeModelName",
      "label": "Generative Model Name",
      "type": "model"
    }
  ],
  "LLMNode_529": [
    {
      "name": "generativeModelName",
      "label": "Generative Model Name",
      "type": "model"
    }
  ]
};

// -- References --
export const references = {
  "constitutions": {
    "default": "@constitutions/default.md"
  },
  "prompts": {
    "insurance_denial_appeal_analyze_system": "@prompts/insurance-denial-appeal_analyze_system.md",
    "insurance_denial_appeal_analyze_user": "@prompts/insurance-denial-appeal_analyze_user.md",
    "insurance_denial_appeal_draft_system": "@prompts/insurance-denial-appeal_draft_system.md",
    "insurance_denial_appeal_draft_user": "@prompts/insurance-denial-appeal_draft_user.md"
  },
  "modelConfigs": {
    "insurance_denial_appeal_analyze": "@model-configs/insurance-denial-appeal_analyze.ts",
    "insurance_denial_appeal_draft": "@model-configs/insurance-denial-appeal_draft.ts"
  },
  "scripts": {
    "insurance_denial_appeal_parse_denial": "@scripts/insurance-denial-appeal_parse-denial.ts",
    "insurance_denial_appeal_build_checklist": "@scripts/insurance-denial-appeal_build-checklist.ts",
    "insurance_denial_appeal_assemble_response": "@scripts/insurance-denial-appeal_assemble-response.ts"
  }
};

// -- Nodes & Edges --
export const nodes = [
  {
    "id": "triggerNode_1",
    "type": "triggerNode",
    "position": {
      "x": 0,
      "y": 0
    },
    "data": {
      "nodeId": "graphqlNode",
      "trigger": true,
      "values": {
        "nodeName": "API Request",
        "responeType": "realtime",
        "advance_schema": {
          "claimDetails": "string",
          "denialLetter": "string",
          "policySummary": "string"
        }
      }
    }
  },
  {
    "id": "codeNode_486",
    "type": "dynamicNode",
    "position": {
      "x": 0,
      "y": 0
    },
    "data": {
      "nodeId": "codeNode",
      "values": {
        "code": "@scripts/insurance-denial-appeal_parse-denial.ts",
        "nodeName": "Parse Denial"
      }
    }
  },
  {
    "id": "LLMNode_446",
    "type": "dynamicNode",
    "position": {
      "x": 0,
      "y": 0
    },
    "data": {
      "nodeId": "LLMNode",
      "values": {
        "tools": [],
        "prompts": [
          {
            "id": "187c2f4b-c23d-4545-abef-73dc897d6b7b",
            "role": "system",
            "content": "@prompts/insurance-denial-appeal_analyze_system.md"
          },
          {
            "id": "187c2f4b-c23d-4545-abef-73dc897d6b7d",
            "role": "user",
            "content": "@prompts/insurance-denial-appeal_analyze_user.md"
          }
        ],
        "memories": "@model-configs/insurance-denial-appeal_analyze.ts",
        "messages": "@model-configs/insurance-denial-appeal_analyze.ts",
        "nodeName": "Analyze Denial",
        "attachments": "@model-configs/insurance-denial-appeal_analyze.ts",
        "credentials": "@model-configs/insurance-denial-appeal_analyze.ts",
        "generativeModelName": "@model-configs/insurance-denial-appeal_analyze.ts"
      }
    }
  },
  {
    "id": "codeNode_734",
    "type": "dynamicNode",
    "position": {
      "x": 0,
      "y": 0
    },
    "data": {
      "nodeId": "codeNode",
      "values": {
        "code": "@scripts/insurance-denial-appeal_build-checklist.ts",
        "nodeName": "Build Evidence Checklist"
      }
    }
  },
  {
    "id": "LLMNode_529",
    "type": "dynamicNode",
    "position": {
      "x": 0,
      "y": 0
    },
    "data": {
      "nodeId": "LLMNode",
      "values": {
        "tools": [],
        "prompts": [
          {
            "id": "187c2f4b-c23d-4545-abef-73dc897d6b7b",
            "role": "system",
            "content": "@prompts/insurance-denial-appeal_draft_system.md"
          },
          {
            "id": "187c2f4b-c23d-4545-abef-73dc897d6b7d",
            "role": "user",
            "content": "@prompts/insurance-denial-appeal_draft_user.md"
          }
        ],
        "memories": "@model-configs/insurance-denial-appeal_draft.ts",
        "messages": "@model-configs/insurance-denial-appeal_draft.ts",
        "nodeName": "Draft Appeal Letter",
        "attachments": "@model-configs/insurance-denial-appeal_draft.ts",
        "credentials": "@model-configs/insurance-denial-appeal_draft.ts",
        "generativeModelName": "@model-configs/insurance-denial-appeal_draft.ts"
      }
    }
  },
  {
    "id": "codeNode_893",
    "type": "dynamicNode",
    "position": {
      "x": 0,
      "y": 0
    },
    "data": {
      "nodeId": "codeNode",
      "values": {
        "code": "@scripts/insurance-denial-appeal_assemble-response.ts",
        "nodeName": "Assemble Response"
      }
    }
  },
  {
    "id": "responseNode_triggerNode_1",
    "type": "responseNode",
    "position": {
      "x": 0,
      "y": 0
    },
    "data": {
      "nodeId": "graphqlResponseNode",
      "values": {
        "headers": "{\"content-type\":\"application/json\"}",
        "retries": "0",
        "nodeName": "API Response",
        "webhookUrl": "",
        "retry_delay": "0",
        "outputMapping": "{ \"denialSummary\": \"{{codeNode_893.output.denialSummary}}\", \"appealability\": \"{{codeNode_893.output.appealability}}\", \"keyArguments\": \"{{codeNode_893.output.keyArguments}}\", \"evidenceChecklist\": \"{{codeNode_893.output.evidenceChecklist}}\", \"escalationPath\": \"{{codeNode_893.output.escalationPath}}\", \"deadlineRisk\": \"{{codeNode_893.output.deadlineRisk}}\", \"appealLetter\": \"{{codeNode_893.output.appealLetter}}\", \"nextStep\": \"{{codeNode_893.output.nextStep}}\" }"
      }
    }
  }
];

export const edges = [
  {
    "id": "triggerNode_1-codeNode_486",
    "source": "triggerNode_1",
    "target": "codeNode_486",
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "type": "defaultEdge"
  },
  {
    "id": "codeNode_486-LLMNode_446",
    "source": "codeNode_486",
    "target": "LLMNode_446",
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "type": "defaultEdge"
  },
  {
    "id": "LLMNode_446-codeNode_734",
    "source": "LLMNode_446",
    "target": "codeNode_734",
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "type": "defaultEdge"
  },
  {
    "id": "codeNode_734-LLMNode_529",
    "source": "codeNode_734",
    "target": "LLMNode_529",
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "type": "defaultEdge"
  },
  {
    "id": "LLMNode_529-codeNode_893",
    "source": "LLMNode_529",
    "target": "codeNode_893",
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "type": "defaultEdge"
  },
  {
    "id": "codeNode_893-responseNode_triggerNode_1",
    "source": "codeNode_893",
    "target": "responseNode_triggerNode_1",
    "sourceHandle": "bottom",
    "targetHandle": "top",
    "type": "defaultEdge"
  },
  {
    "id": "response-responseNode_triggerNode_1",
    "source": "triggerNode_1",
    "target": "responseNode_triggerNode_1",
    "sourceHandle": "to-response",
    "targetHandle": "from-trigger",
    "type": "responseEdge"
  }
];

export default { meta, inputs, references, nodes, edges };
