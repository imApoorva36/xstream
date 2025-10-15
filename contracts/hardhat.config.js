require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require("@nomicfoundation/hardhat-ignition");

module.exports = {
  solidity: "0.8.28", 
  networks: {
    baseSepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, 
      accounts: [`0x${process.env.WALLET_PRIVATE_KEY}`], 
      chainId: 84532,
    },
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
  },
};