import "@matterlabs/hardhat-zksync-deploy"
import "@matterlabs/hardhat-zksync-solc"
import "@matterlabs/hardhat-zksync-verify"

require("dotenv").config()

function accounts() {
    return [`${process.env.DEPLOYER_PRIVATEKEY}`]
}

module.exports = {
    zksolc: {
        version: "1.3.10",
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
            // {
            //     version: "0.7.6",
            //     settings: {
            //         optimizer: {
            //             enabled: true,
            //             runs: 200,
            //         },
            //     },
            // },
        ],
    },
    defaultNetwork: "zkSyncTestnet",
    networks: {
        zkSyncTestnet: {
            url: "https://testnet.era.zksync.dev",
            ethNetwork: "goerli",
            zksync: true,
            // verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification'
            verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification'

        },
    },
    goerli: {
        url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161", // public infura endpoint
        chainId: 5,
        accounts: accounts(),
    },
}
