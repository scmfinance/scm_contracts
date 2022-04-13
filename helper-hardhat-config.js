/* eslint-disable */

const localChainID = 33142;
const developmentChains = ["hardhat", "localhost"]
const serverWalletAddress = "";

const networkConfig = {
    default: {
        name: 'hardhat',
        proxyRegisteryAddress: '0x0000000000000000000000000000000000000000',
        jobId: '29fa9aa13bf1468788b7cc4a500a45b8',
        router: "0x0000000000000000000000000000000000000000"
    },
    [localChainID]: {
        name: 'localhost',
        proxyRegisteryAddress: '0xf57b2c51ded3a29e6891aba85459d600256cf317',
        jobId: '29fa9aa13bf1468788b7cc4a500a45b8',
        router: "0x0000000000000000000000000000000000000000"
    },
    42: {
        name: 'kovan',
        router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    4: {
        name: 'rinkeby',
        proxyRegisteryAddress: '0xf57b2c51ded3a29e6891aba85459d600256cf317',
        jobId: '6d1bfe27e7034b1d87b5270556b17277',
    },
    3: {
        name: 'ropsten',
        proxyRegisteryAddress: '0xf57b2c51ded3a29e6891aba85459d600256cf317',
        jobId: '6d1bfe27e7034b1d87b5270556b17277',
    },
    1: {
        name: 'mainnet',
        proxyRegisteryAddress: '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
    },
    5: {
        name: 'goerli',
    },
    80001: {
        name: 'mumbai',
        proxyRegisteryAddress: '0x0000000000000000000000000000000000000000',
        jobId: 'da20aae0e4c843f6949e5cb3f7cfe8c4',
    },
    137: {
        name: 'polygon',
        proxyRegisteryAddress: '0x0000000000000000000000000000000000000000',
        jobId: '12b86114fa9e46bab3ca436f88e1a912'
    },
    56: {
        name: 'bsc',
        router: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    },
}

const getNetworkIdFromName = async (networkIdName) => {
    for (const id in networkConfig) {
        if (networkConfig[id]['name'] == networkIdName) {
            return id
        }
    }
    return null
}

module.exports = {
    networkConfig,
    getNetworkIdFromName,
    developmentChains,
    localChainID,
    serverWalletAddress
}