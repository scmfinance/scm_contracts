require("dotenv").config();
//require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

require('hardhat-deploy');
require("hardhat-gas-reporter");
require("solidity-coverage");

/** TASKS */
require("./tasks/accounts");
require("./tasks/balance");
require("./tasks/block-number");

const { localChainID } = require("./helper-hardhat-config");

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/your-api-key"
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/your-api-key"
const ROPSTEN_RPC_URL = process.env.ROPSTEN_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/your-api-key"
const KOVAN_RPC_URL = process.env.KOVAN_RPC_URL || "https://eth-kovan.alchemyapi.io/v2/your-api-key"
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "https://polygon-mumbai.alchemyapi.io/v2/your-api-key"
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || "https://polygon-mainnet.alchemyapi.io/v2/your-api-key"
const MNEMONIC = process.env.MNEMONIC || "your mnemonic"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Your etherscan API key"
const REPORT_GAS = process.env.REPORT_GAS || true
const PRIVATE_KEY = process.env.PRIVATE_KEY || "your private key"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: localChainID,
            mining: {
                auto: true,
                interval: 1000
            }
        },
        localhost: {
            chainId: localChainID,
        },
        kovan: {
            url: KOVAN_RPC_URL,
            accounts: [PRIVATE_KEY],
            //accounts: {
            //    mnemonic: MNEMONIC,
            //},
            saveDeployments: true,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            //accounts: {
            //    mnemonic: MNEMONIC,
            //},
            saveDeployments: true,
        },
        ropsten: {
            url: ROPSTEN_RPC_URL,
            // accounts: [PRIVATE_KEY],
            accounts: {
                mnemonic: MNEMONIC,
            },
            saveDeployments: true,
        },
        ganache: {
            url: 'http://localhost:8545',
            accounts: {
                mnemonic: MNEMONIC,
            }
        },
        mainnet: {
            url: MAINNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            //accounts: {
            //    mnemonic: MNEMONIC,
            //},
            saveDeployments: true,
        },
        'bsc-mainnet': {
            url: "https://bsc-dataseed.binance.org/",
            chainId: 56,
            //gasPrice: 20000000000,
            accounts: [PRIVATE_KEY]
        },
        mumbai: {
            url: MUMBAI_RPC_URL,
            accounts: {
                mnemonic: MNEMONIC,
            }, //test if this works with mnemonic
            saveDeployments: true,
        },
        polygon: {
            url: POLYGON_MAINNET_RPC_URL,
            accounts: {
                mnemonic: MNEMONIC,
            },
            saveDeployments: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        feeCollector: {
            default: 1
        }
    },
    gasReporter: {
        enabled: REPORT_GAS !== undefined,
        currency: "USD",
        gasPrice: 100,
        //outputFile: "./reports/gasReport.txt",
        showTimeSpent: true,
        excludeContracts: ['test/']
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    mocha: {
        timeout: 100000
    },
    solidity: {
        compilers: [
            {
                version: "0.8.13",
                 settings: {
                     optimizer: {
                         enabled: true,
                         runs: 1000,
                     },
                 },
                
            }
        ]
    },
};
