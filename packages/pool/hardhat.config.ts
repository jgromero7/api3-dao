import { HardhatUserConfig } from "hardhat/types"
import "@nomiclabs/hardhat-waffle"
import "hardhat-typechain"
import dotenv from "dotenv";
import "hardhat-gas-reporter";

dotenv.config()

const { 
  INFURA_ID, 
  RINKEBY_PRIVATE_KEY, 
  RINKEBY_INFURA_URL,

} = process.env

console.log(
  INFURA_ID, 
  RINKEBY_PRIVATE_KEY, 
  RINKEBY_INFURA_URL,
);

const url = `${RINKEBY_INFURA_URL}${INFURA_ID}`;

const accounts = [`0x${RINKEBY_PRIVATE_KEY}`];

const rinkeby = {
  url,
  accounts,
}

const networks = {
  rinkeby,
}

const compilers = [{ version: "0.6.12", settings: {} }]

const solidity = {
  compilers,
}

// const config: HardhatUserConfig = {
//   solidity,
//   networks,
// }

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
}

module.exports = {
  ...config,
  gasReporter: {
    enabled: false,
    currency: 'USD',
    coinmarketcap: '61f2d7e8-6385-4d8e-8932-bde736ba05bf'
  }
}
