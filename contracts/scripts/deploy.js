const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with account: ${deployer.address}`);
    
    // Get the account balance
    const balance = await deployer.getBalance();
    console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);

    // Deploy Lock contract with unlock time 1 year from now
    const unlockTime = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60); // 1 year from now
    
    console.log(`Setting unlock time to: ${new Date(unlockTime * 1000).toLocaleString()}`);
    
    const Lock = await ethers.getContractFactory("Lock");
    
    // Deploy with 0.001 ETH locked in the contract
    const lockAmount = ethers.utils.parseEther("0.001");
    console.log(`Deploying Lock contract with ${ethers.utils.formatEther(lockAmount)} ETH locked...`);
    
    const lock = await Lock.deploy(unlockTime, { value: lockAmount });
    await lock.deployed();
    
    console.log(`Lock contract deployed to: ${lock.address}`);
    console.log(`Unlock time: ${unlockTime}`);
    console.log(`Lock amount: ${ethers.utils.formatEther(lockAmount)} ETH`);
    console.log(`Owner: ${await lock.owner()}`);
    
    // Verify deployment
    const contractBalance = await ethers.provider.getBalance(lock.address);
    console.log(`Contract balance: ${ethers.utils.formatEther(contractBalance)} ETH`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });