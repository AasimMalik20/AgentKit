// Model config: insurance-denial-appeal (Draft Appeal Letter node)
export default {
  "generativeModelName": [
    {
      "type": "generator/text",
      "params": {},
      "configName": "configA",
      "model_name": "gemini-3-flash-preview",
      "credentialId": "gemini",
      "provider_name": "gemini",
      "credential_name": "gemini"
    }
  ],
  "memories": "@model-configs/insurance-denial-appeal_draft.ts",
  "messages": "@model-configs/insurance-denial-appeal_draft.ts",
  "attachments": "@model-configs/insurance-denial-appeal_draft.ts",
  "credentials": "@model-configs/insurance-denial-appeal_draft.ts"
};
