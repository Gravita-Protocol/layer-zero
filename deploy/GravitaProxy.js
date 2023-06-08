const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const { ethers } = require("hardhat")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    const lzEndpointAddress = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint Address: ${lzEndpointAddress}`)
    const sharedDecimals = 6
    let token
    if ([hre.network.name] == "ethereum") {
        token = "0x15f74458aE0bFdAA1a96CA1aa779D715Cc1Eefe4" // mainnet Debt Token
    } else {
        token = "0x78076562e30Fd49c70C4E91f65644d15C32C1839" // goerli Debt Token
    }

    await deploy("GravitaProxy", {
        from: deployer,
        args: [token, sharedDecimals, lzEndpointAddress],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["GravitaProxy"]
