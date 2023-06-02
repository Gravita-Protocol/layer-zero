const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const { ethers } = require("hardhat")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    const lzEndpointAddress = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint Address: ${lzEndpointAddress}`)
    const sharedDecimals = 6
    const token = "0x78076562e30Fd49c70C4E91f65644d15C32C1839" // goerli Debt Token

    await deploy("ExampleProxyOFTV2", {
        from: deployer,
        args: [token, sharedDecimals, lzEndpointAddress],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["ExampleProxyOFTV2"]
