const ethers = require("ethers")
const fs = require("fs")

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const template = require("./template.json")
const remoteNetworkName = "mantle"
const remoteChainId = 181 // layerzeroEndpointChainId for mantle
const remoteAddress = "0x894134a25a5faC1c2C26F1d8fBf05111a3CB9487" // GRAI on mantle
const localContracts = [
    {
        name: "mainnet",
        chainId: 1,
        address: "0xA8C6B0d3a06E834A8F0F70603625a475b87703a0",
    },
    {
        name: "arbitrum",
        chainId: 42161,
        address: "0x894134a25a5faC1c2C26F1d8fBf05111a3CB9487",
    },
    {
        name: "optimism",
        chainId: 10,
        address: "0x894134a25a5faC1c2C26F1d8fBf05111a3CB9487",
    },
    {
        name: "base",
        chainId: 8453,
        address: "0xCA68ad4EE5c96871EC6C6dac2F714a8437A3Fe66",
    },
    {
        name: "linea",
        chainId: 59144,
        address: "0x894134a25a5faC1c2C26F1d8fBf05111a3CB9487",
    },
    {
        name: "polygon-zkevm",
        chainId: 1101,
        address: "0xCA68ad4EE5c96871EC6C6dac2F714a8437A3Fe66",
    },
    {
        name: "zksync",
        chainId: 324,
        address: "0x5FC44E95eaa48F9eB84Be17bd3aC66B6A82Af709",
    },
]

async function generateTxs() {
    fs.mkdirSync(`./output/${remoteNetworkName}`, { recursive: true })
    for (const localContract of localContracts) {
        const remoteAndLocal = ethers.utils.solidityPack(["address", "address"], [remoteAddress, localContract.address])
        template.chainId = `${localContract.chainId}`
        template.transactions[0].to = localContract.address
        template.transactions[0].contractInputsValues._remoteChainId = `${remoteChainId}`
        template.transactions[0].contractInputsValues._path = remoteAndLocal
        const data = JSON.stringify(template, null, "\t")
        fs.writeFileSync(`./output/${remoteNetworkName}/${localContract.name}.json`, data)
    }
}

// to run: `node generateSetTrustedRemoteTxs`
generateTxs().then((res) => console.log("\nComplete!"))
