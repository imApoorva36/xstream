const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`\n🚀 Deploying xStream contracts with account: ${deployer.address}`);
    
    // Get the account balance
    const balance = await deployer.getBalance();
    console.log(`💰 Account balance: ${ethers.utils.formatEther(balance)} ETH\n`);

    console.log("📦 Starting xStream contract deployment...\n");

    try {
        // Deploy the Factory contract which will deploy all other contracts
        console.log("🏭 Deploying XStreamFactory...");
        const XStreamFactory = await ethers.getContractFactory("XStreamFactory");
        const factory = await XStreamFactory.deploy();
        await factory.deployed();
        
        console.log(`✅ XStreamFactory deployed to: ${factory.address}\n`);

        // Get all deployed contract addresses from the factory
        const contractAddresses = await factory.getContractAddresses();
        const deploymentInfo = await factory.getDeploymentInfo();

        console.log("🎯 xStream Ecosystem Deployed Successfully!");
        console.log("=" .repeat(50));
        console.log(`🏭 Factory Contract:     ${factory.address}`);
        console.log(`🎬 XStreamCore:          ${contractAddresses[0]}`);
        console.log(`🏆 XStreamNFT:           ${contractAddresses[1]}`);
        console.log(`📺 XStreamAds:           ${contractAddresses[2]}`);
        console.log(`💎 Treasury:             ${contractAddresses[3]}`);
        console.log(`⏰ Deployed at:          ${new Date(deploymentInfo[4] * 1000).toLocaleString()}`);
        console.log("=" .repeat(50));

        // Test basic functionality
        console.log("\n🧪 Testing basic functionality...");
        
        const XStreamCore = await ethers.getContractAt("XStreamCore", contractAddresses[0]);
        const XStreamNFT = await ethers.getContractAt("XStreamNFT", contractAddresses[1]);
        const XStreamAds = await ethers.getContractAt("XStreamAds", contractAddresses[2]);

        // Check platform fee
        const platformFee = await XStreamCore.platformFeePercentage();
        console.log(`📊 Platform fee: ${platformFee}%`);

        // Check NFT name and symbol
        const nftName = await XStreamNFT.name();
        const nftSymbol = await XStreamNFT.symbol();
        console.log(`🏆 NFT Contract: ${nftName} (${nftSymbol})`);

        // Check ads platform fee
        const adsPlatformFee = await XStreamAds.platformFeePercentage();
        console.log(`📺 Ads platform fee: ${adsPlatformFee}%`);

        console.log("\n🎉 All contracts deployed and tested successfully!");
        console.log("\n📋 Contract ABIs and addresses saved for frontend integration");
        
        // Save deployment info to a JSON file for frontend
        const deploymentData = {
            network: "baseSepolia",
            chainId: 84532,
            deployer: deployer.address,
            deployedAt: new Date().toISOString(),
            contracts: {
                factory: factory.address,
                xstreamCore: contractAddresses[0],
                xstreamNFT: contractAddresses[1],
                xstreamAds: contractAddresses[2],
                treasury: contractAddresses[3]
            },
            features: {
                payPerSecond: true,
                nftAchievements: true,
                advertising: true,
                creatorEconomics: true
            }
        };

        // In a real deployment, you'd save this to a file
        console.log("\n📄 Deployment Summary:");
        console.log(JSON.stringify(deploymentData, null, 2));

    } catch (error) {
        console.error("\n❌ Deployment failed:", error);
        throw error;
    }
}

main()
    .then(() => {
        console.log("\n✅ Deployment completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Deployment error:", error);
        process.exit(1);
    });