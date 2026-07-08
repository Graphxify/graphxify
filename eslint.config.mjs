import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "supabase/**",
      "next-env.d.ts",
      "PROJECT_FILES_DUMP.txt"
    ]
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // Surface, but don't fail on, escape hatches — keeps CI green while flagging debt.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      // Allow the shadcn/ui pattern `interface Props extends X {}` (extends-only).
      "@typescript-eslint/no-empty-object-type": ["warn", { allowInterfaces: "with-single-extends" }]
    }
  }
);
