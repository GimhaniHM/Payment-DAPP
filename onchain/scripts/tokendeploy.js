const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const BethToken = await ethers.getContractFactory('BethToken');
  const bethtoken = await BethToken.deploy();
  await bethtoken.deployed();

  console.log('Storage deployed to :', bethtoken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
