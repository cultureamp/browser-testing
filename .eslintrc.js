module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true
  },
  globals: {
    expect: true,
    browser: true,
    $: true,
    $$: true
  },
  extends: ["eslint:recommended", "plugin:import/errors"],
  plugins: ["mocha", "import", "prettier"],
  settings: {
    "import/resolver": {
      "babel-module": {}
    }
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    /**
     * Strict mode
     */
    // babel inserts "use strict"; for us
    strict: [2, "never"], // http://eslint.org/docs/rules/strict

    /**
     * Variables
     */
    "no-shadow": 2, // http://eslint.org/docs/rules/no-shadow
    "no-shadow-restricted-names": 2, // http://eslint.org/docs/rules/no-shadow-restricted-names
    "no-unused-vars": [
      2,
      {
        // http://eslint.org/docs/rules/no-unused-vars
        vars: "local",
        args: "after-used"
      }
    ],
    "no-use-before-define": [2, "nofunc"], // http://eslint.org/docs/rules/no-use-before-define

    /**
     * Possible errors
     */
    // "comma-dangle": [2, "always-multiline"], // http://eslint.org/docs/rules/comma-dangle
    "no-cond-assign": [2, "always"], // http://eslint.org/docs/rules/no-cond-assign
    "no-console": 2, // http://eslint.org/docs/rules/no-console
    "no-debugger": 1, // http://eslint.org/docs/rules/no-debugger
    "no-alert": 0, // http://eslint.org/docs/rules/no-alert
    "no-constant-condition": 1, // http://eslint.org/docs/rules/no-constant-condition
    "no-dupe-keys": 2, // http://eslint.org/docs/rules/no-dupe-keys
    "no-duplicate-case": 2, // http://eslint.org/docs/rules/no-duplicate-case
    "no-empty": 2, // http://eslint.org/docs/rules/no-empty
    "no-ex-assign": 2, // http://eslint.org/docs/rules/no-ex-assign
    "no-extra-boolean-cast": 0, // http://eslint.org/docs/rules/no-extra-boolean-cast
    "no-extra-semi": 2, // http://eslint.org/docs/rules/no-extra-semi
    "no-func-assign": 2, // http://eslint.org/docs/rules/no-func-assign
    "no-inner-declarations": 2, // http://eslint.org/docs/rules/no-inner-declarations
    "no-invalid-regexp": 2, // http://eslint.org/docs/rules/no-invalid-regexp
    "no-irregular-whitespace": 2, // http://eslint.org/docs/rules/no-irregular-whitespace
    "no-obj-calls": 2, // http://eslint.org/docs/rules/no-obj-calls,
    "quote-props": [2, "as-needed", { unnecessary: false }], // http://eslint.org/docs/rules/quote-props
    "no-sparse-arrays": 2, // http://eslint.org/docs/rules/no-sparse-arrays
    "no-unexpected-multiline": 0, // http://eslint.org/docs/rules/no-unexpected-multiline
    "no-unreachable": 2, // http://eslint.org/docs/rules/no-unreachable
    "use-isnan": 2, // http://eslint.org/docs/rules/use-isnan
    "block-scoped-var": 2, // http://eslint.org/docs/rules/block-scoped-var

    /**
     * Best practices
     */
    "consistent-return": 0, // http://eslint.org/docs/rules/consistent-return
    "default-case": 2, // http://eslint.org/docs/rules/default-case
    "dot-notation": [
      2,
      {
        // http://eslint.org/docs/rules/dot-notation
        allowKeywords: true
      }
    ],
    eqeqeq: [2, "smart"], // http://eslint.org/docs/rules/eqeqeq
    "guard-for-in": 2, // http://eslint.org/docs/rules/guard-for-in
    "no-caller": 2, // http://eslint.org/docs/rules/no-caller
    "no-else-return": 2, // http://eslint.org/docs/rules/no-else-return
    "no-eq-null": 0, // http://eslint.org/docs/rules/no-eq-null
    "no-eval": 2, // http://eslint.org/docs/rules/no-eval
    "no-extend-native": 2, // http://eslint.org/docs/rules/no-extend-native
    "no-extra-bind": 2, // http://eslint.org/docs/rules/no-extra-bind
    "no-fallthrough": 2, // http://eslint.org/docs/rules/no-fallthrough
    "no-floating-decimal": 2, // http://eslint.org/docs/rules/no-floating-decimal
    "no-implied-eval": 2, // http://eslint.org/docs/rules/no-implied-eval
    "no-lone-blocks": 2, // http://eslint.org/docs/rules/no-lone-blocks
    "no-loop-func": 2, // http://eslint.org/docs/rules/no-loop-func
    "no-multi-str": 2, // http://eslint.org/docs/rules/no-multi-str
    "no-native-reassign": 2, // http://eslint.org/docs/rules/no-native-reassign
    "no-new": 2, // http://eslint.org/docs/rules/no-new
    "no-new-func": 2, // http://eslint.org/docs/rules/no-new-func
    "no-new-wrappers": 2, // http://eslint.org/docs/rules/no-new-wrappers
    "no-octal": 2, // http://eslint.org/docs/rules/no-octal
    "no-octal-escape": 2, // http://eslint.org/docs/rules/no-octal-escape
    "no-param-reassign": 2, // http://eslint.org/docs/rules/no-param-reassign
    "no-proto": 2, // http://eslint.org/docs/rules/no-proto
    "no-redeclare": 2, // http://eslint.org/docs/rules/no-redeclare
    "no-return-assign": 0, // http://eslint.org/docs/rules/no-return-assign
    "no-script-url": 2, // http://eslint.org/docs/rules/no-script-url
    "no-self-compare": 2, // http://eslint.org/docs/rules/no-self-compare
    "no-sequences": 2, // http://eslint.org/docs/rules/no-sequences
    "no-throw-literal": 2, // http://eslint.org/docs/rules/no-throw-literal
    "no-unsafe-finally": 0, // http://eslint.org/docs/rules/no-unsafe-finally
    "no-with": 2, // http://eslint.org/docs/rules/no-with
    radix: 2, // http://eslint.org/docs/rules/radix
    "vars-on-top": 2, // http://eslint.org/docs/rules/vars-on-top
    "wrap-iife": [2, "any"], // http://eslint.org/docs/rules/wrap-iife
    yoda: 2, // http://eslint.org/docs/rules/yoda

    /**
     * Style
     */
    "prettier/prettier": [
      2,
      {
        trailingComma: "es5",
        singleQuote: true
      }
    ],
    camelcase: [
      2,
      {
        // http://eslint.org/docs/rules/camelcase
        properties: "never"
      }
    ],
    "new-cap": [
      2,
      {
        // http://eslint.org/docs/rules/new-cap
        newIsCap: true,
        capIsNew: false
      }
    ],
    "no-nested-ternary": 2, // http://eslint.org/docs/rules/no-nested-ternary
    "no-new-object": 2, // http://eslint.org/docs/rules/no-new-object
    "no-underscore-dangle": 0, // http://eslint.org/docs/rules/no-underscore-dangle
    "one-var": [2, "never"], // http://eslint.org/docs/rules/one-var
    "spaced-comment": [
      2,
      "always",
      {
        // http://eslint.org/docs/rules/spaced-comment
        markers: ["="] // Sprockets directives
      }
    ],
    // http://eslint.org/docs/rules/no-case-declarations
    // note: you can wrap case bodies in {} blocks if you really want declarations in them
    "no-case-declarations": [2],

    /**
     * ES6 imports
     */
    // in addition to the extended plugin:import/errors config
    "import/no-named-as-default-member": 2,
    "import/no-duplicates": 2
  }
};
