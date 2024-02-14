const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  const CONTRACT_ADDRESS = '0xf0Cd523796bAadE09C9709aCe9B3a48464c1149D';

  console.log('Deploying contracts with the account:', deployer.address);

  const BethelInvoice = await ethers.getContractFactory('BethelInvoice'); // Fetching bytecode and ABI
  const bethelinvoice = await BethelInvoice.deploy(CONTRACT_ADDRESS);   // Create the instance of our smart contract
  await bethelinvoice.deployed(); // Deploy our smart contract

  console.log('Storage deployed to :', bethelinvoice.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
