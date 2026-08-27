// Model config: insurance-denial-appeal (Analyze Denial node)
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
  "memories": "@model-configs/insurance-denial-appeal_analyze.ts",
  "messages": "@model-configs/insurance-denial-appeal_analyze.ts",
  "attachments": "@model-configs/insurance-denial-appeal_analyze.ts",
  "credentials": "@model-configs/insurance-denial-appeal_analyze.ts"
};
