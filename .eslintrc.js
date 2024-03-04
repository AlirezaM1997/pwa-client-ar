module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    commonjs: true,
    "amd": true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    'no-unused-vars': 'off',
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "eslint-disable-next-line": "off",
    "react/no-unknown-property": ['error', { ignore: ['css'] }],
    "no-extra-boolean-cast":"off"
  },
};
