let { localChainID, networkConfig } = require("../helper-hardhat-config")

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    let SCM;

    try {
        SCM = await deploy('SCM', { 
            from: deployer, 
            log: true,
            waitConfirmations: 5,
            args: [
                networkConfig[chainId]["router"]
            ],
            proxy: {
                //owner: deployer,            
                proxyContract: "OpenZeppelinTransparentProxy",
                methodName: "initialize"
            }
        });
    } catch(e) {
        console.log(e)
        return;
    }

    log("SCM deployed");
    log("")
    log(`Submitting SCM code for verification on etherscan`)
    try {
        await hre.run("verify:verify", {
            address: SCM.implementation,
            network: networkConfig[chainId]["name"],
            constructorArguments: [
                networkConfig[chainId]["router"]
            ]
          });
    } catch (e) {
        console.log(e)
    }

}
module.exports.tags = ['all', 'mocks', 'main']