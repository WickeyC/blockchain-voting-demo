const hre = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  // const lockedAmount = hre.ethers.utils.parseEther("0.001");

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  // const voting = await Voting.deploy(unlockTime, { value: lockedAmount });

  await voting.deployed();

  console.log("Smart contract is deployed to:", voting.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
