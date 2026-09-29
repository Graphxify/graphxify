// Classifies a visit as "Known AI referral traffic" from its referrer host or
// utm_source. It only recognises platforms that pass a referrer or tag their
// links; AI answers that send no referrer land in Direct and cannot be
// attributed. Keep this list in sync with docs/AI-REFERRAL-MEASUREMENT.md.

export const AI_REFERRAL_CHANNEL = "Known AI referral traffic";

export type AiPlatform =
  | "ChatGPT"
  | "Perplexity"
  | "Claude"
  | "Gemini"
  | "Microsoft Copilot"
  | "DeepSeek"
  | "Meta AI"
  | "Mistral"
  | "Grok"
  | "You.com"
  | "Phind";

// Host suffixes (matched against the referrer hostname, "www." stripped).
const AI_REFERRER_HOSTS: ReadonlyArray<readonly [string, AiPlatform]> = [
  ["chatgpt.com", "ChatGPT"],
  ["chat.openai.com", "ChatGPT"],
  ["perplexity.ai", "Perplexity"],
  ["claude.ai", "Claude"],
  ["gemini.google.com", "Gemini"],
  ["bard.google.com", "Gemini"],
  ["copilot.microsoft.com", "Microsoft Copilot"],
  ["copilot.cloud.microsoft", "Microsoft Copilot"],
  ["chat.deepseek.com", "DeepSeek"],
  ["meta.ai", "Meta AI"],
  ["chat.mistral.ai", "Mistral"],
  ["grok.com", "Grok"],
  ["you.com", "You.com"],
  ["phind.com", "Phind"]
];

// utm_source values some assistants append (ChatGPT search adds utm_source=chatgpt.com).
const AI_UTM_SOURCES: ReadonlyArray<readonly [string, AiPlatform]> = [
  ["chatgpt.com", "ChatGPT"],
  ["chatgpt", "ChatGPT"],
  ["openai", "ChatGPT"],
  ["perplexity", "Perplexity"],
  ["perplexity.ai", "Perplexity"],
  ["claude", "Claude"],
  ["claude.ai", "Claude"],
  ["gemini", "Gemini"],
  ["copilot", "Microsoft Copilot"],
  ["deepseek", "DeepSeek"]
];

/** Regex for GA4 channel-group / exploration filters on session source. */
export const AI_SOURCE_REGEX =
  "chatgpt\\.com|chat\\.openai\\.com|openai|perplexity|claude\\.ai|gemini\\.google\\.com|bard\\.google\\.com|copilot\\.microsoft\\.com|copilot\\.cloud\\.microsoft|deepseek|meta\\.ai|mistral\\.ai|grok\\.com|you\\.com|phind\\.com";

function hostOf(referrer: string): string | null {
  try {
    return new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function classifyAiReferral(input: {
  referrer?: string | null;
  utmSource?: string | null;
}): AiPlatform | null {
  const host = input.referrer ? hostOf(input.referrer) : null;
  if (host) {
    for (const [suffix, platform] of AI_REFERRER_HOSTS) {
      if (host === suffix || host.endsWith(`.${suffix}`)) return platform;
    }
  }

  const utm = input.utmSource?.trim().toLowerCase();
  if (utm) {
    for (const [source, platform] of AI_UTM_SOURCES) {
      if (utm === source) return platform;
    }
  }

  return null;
}
