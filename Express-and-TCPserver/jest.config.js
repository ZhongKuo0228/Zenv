export default {
    moduleFileExtensions: ["js", "jsx"],
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
};
