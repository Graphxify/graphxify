import { expect, test } from "@playwright/test";
import { AI_SOURCE_REGEX, classifyAiReferral } from "../../src/lib/ai-referrals";

test("classifies known AI referrers by host", () => {
  expect(classifyAiReferral({ referrer: "https://chatgpt.com/" })).toBe("ChatGPT");
  expect(classifyAiReferral({ referrer: "https://www.perplexity.ai/search?q=x" })).toBe("Perplexity");
  expect(classifyAiReferral({ referrer: "https://claude.ai/chat/abc" })).toBe("Claude");
  expect(classifyAiReferral({ referrer: "https://gemini.google.com/app" })).toBe("Gemini");
  expect(classifyAiReferral({ referrer: "https://copilot.microsoft.com/" })).toBe("Microsoft Copilot");
});

test("classifies by utm_source when there is no referrer", () => {
  expect(classifyAiReferral({ referrer: "", utmSource: "chatgpt.com" })).toBe("ChatGPT");
  expect(classifyAiReferral({ utmSource: "Perplexity" })).toBe("Perplexity");
});

test("does not label ordinary traffic as AI", () => {
  expect(classifyAiReferral({ referrer: "https://www.google.com/" })).toBeNull();
  expect(classifyAiReferral({ referrer: "https://www.bing.com/search?q=x" })).toBeNull();
  expect(classifyAiReferral({ referrer: "https://notchatgpt.com/" })).toBeNull();
  expect(classifyAiReferral({ referrer: "not a url", utmSource: "newsletter" })).toBeNull();
  expect(classifyAiReferral({})).toBeNull();
});

test("GA4 source regex matches the same hosts", () => {
  const re = new RegExp(AI_SOURCE_REGEX);
  for (const s of ["chatgpt.com", "perplexity.ai", "claude.ai", "gemini.google.com", "copilot.microsoft.com"]) expect(re.test(s)).toBe(true);
  for (const s of ["google", "bing", "(direct)", "facebook.com"]) expect(re.test(s)).toBe(false);
});
