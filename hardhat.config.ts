import "@matterlabs/hardhat-zksync-deploy"
import "@matterlabs/hardhat-zksync-solc"
import "@matterlabs/hardhat-zksync-verify"

require("hardhat-deploy")
require("hardhat-deploy-ethers")

require("dotenv").config()
require('./tasks')

const accounts = () => [`${process.env.DEPLOYER_PRIVATEKEY}`]

module.exports = {
    zksolc: {
        version: "1.3.12",
        compilerSource: "binary",
        settings: {},
    },
    solidity: {
        compilers: [
            {
                version: "0.8.12",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    defaultNetwork: "zkSyncTestnet",
    networks: {
        zkSyncTestnet: {
            url: "https://testnet.era.zksync.dev",
            ethNetwork: "goerli",
            zksync: true,
            verifyURL: "https://zksync2-testnet-explorer.zksync.dev/contract_verification",
        },
        zksync: {
            url: "https://mainnet.era.zksync.io",
            ethNetwork: "mainnet",
            zksync: true,
            verifyURL: "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
        },
    },
}
