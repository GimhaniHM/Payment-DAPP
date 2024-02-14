require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

// require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      chainId: 80001,
      url: `${process.env.ALCHEMY_MUMBAI_URL}`,
      accounts: [`0x${process.env.MUMBAI_PRIVATE_KEY}`]
    }
  }
};
