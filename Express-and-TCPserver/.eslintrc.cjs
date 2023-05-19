module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true, // 添加jest環境
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react"],
    rules: {},
};
