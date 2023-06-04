const LZ_ENDPOINTS = require("../constants/layerzeroEndpoints.json")
const { ethers } = require("hardhat")

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log(`>>> your address: ${deployer}`)

    const lzEndpointAddress = LZ_ENDPOINTS[hre.network.name]
    console.log(`[${hre.network.name}] Endpoint Address: ${lzEndpointAddress}`)
    const sharedDecimals = 6

    await deploy("GravitaDebtToken", {
        from: deployer,
        args: [lzEndpointAddress, sharedDecimals],
        log: true,
        waitConfirmations: 1,
    })
}

module.exports.tags = ["GravitaDebtToken"]
