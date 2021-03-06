module.exports = {
    "env": {
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
      "beforeEach": false,
      "context": false,
      "describe": false,
      "ethers": false,
      "expect": false,
      "getChainId": false,
      "it": false,
      "waffle": false
    },
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    }
};
