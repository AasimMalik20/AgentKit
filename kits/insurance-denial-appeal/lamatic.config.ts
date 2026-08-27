export default {
  name: "Insurance Denial Appeal",
  description: "Parses an insurance claim denial letter, classifies the denial reason, assesses appealability, drafts a persuasive appeal letter, and returns a concrete evidence checklist plus escalation path.",
  version: "1.0.0",
  type: "template" as const,
  author: { name: "Aasim Malik", email: "aasimmalik29@gmail.com" },
  tags: ["insurance", "healthcare", "appeal", "document", "letter"],
  steps: [
    { id: "insurance-denial-appeal", type: "mandatory" as const }
  ],
  links: {
    demo: "https://studio.lamatic.ai/template/insurance-denial-appeal",
    github: "https://github.com/Lamatic/AgentKit/tree/main/kits/insurance-denial-appeal"
  }
};
