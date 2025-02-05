// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactNativePlugin from 'eslint-plugin-react-native';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["node_modules/", "build/", "dist/"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: "./"
      },
      globals: {
        __DEV__: "readonly",
        jasmine: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        test: "readonly",
        expect: "readonly",
        describe: "readonly",
        jest: "readonly",
        it: "readonly",
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react": reactPlugin,
      "react-native": reactNativePlugin,
    },
    rules: {
      // Import rules
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-restricted-paths": "error",
      "import/no-absolute-path": "error",
      "import/no-cycle": "error",
      "import/no-useless-path-segments": "error",
      "import/no-self-import": "error",
      "import/extensions": ["error", "never", { "svg": "always", "json": "always" }],

      // TypeScript rules
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/member-delimiter-style": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": "warn",

      // React Native rules
      "react-native/no-raw-text": "off",

      // React rules
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",

      // General rules
      "comma-dangle": "off",
      "multiline-ternary": "off",
      "no-undef": 1,
      "no-unused-vars": "off",
      "no-use-before-define": "off",
      "no-global-assign": "off",
      "quotes": "off",
      "space-before-function-paren": "off",
      "reactotron/no-tron-in-production": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        "typescript": {}
      }
    }
  },
);