export default [
  {
    ignores: [".next/**", "node_modules/**", "public/**", "supabase/**"]
  },
  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {}
  }
];
