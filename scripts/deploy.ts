const SEED = "mimcsponge";
const TREE_LEVELS = 20;
import hre from "hardhat";

import { mimcSpongecontract } from "circomlibjs";
import { BigNumber } from "ethers";
const FIVE_MINUTES = 60 * 5;

async function main() {
	const signers = await hre.ethers.getSigners();
	const MiMCSponge = new hre.ethers.ContractFactory(
		mimcSpongecontract.abi,
		mimcSpongecontract.createCode(SEED, 220),
		signers[0]
	);

	const mimcsponge = await MiMCSponge.deploy();
	const Verifier = await hre.ethers.getContractFactory("Verifier");
	const verifier = await Verifier.deploy();

	const zkVoteFactory = await hre.ethers.getContractFactory("ZKVote");

	const zkVote = await zkVoteFactory.deploy(
		hre.ethers.BigNumber.from(TREE_LEVELS),
		mimcsponge.address,
		verifier.address
	);
	await zkVote.deployed();

	const [
		judge,
		otherJudge,
		judgePrivate,
		otherJudgePrivate,
		thirdJudge,
		thirdJudgePrivate,
	] = signers;

	const deployer = judge;

	await zkVote
		.connect(deployer)
		.init(
			hre.ethers.utils.formatBytes32String("my proposal"),
			[judge.address, otherJudge.address, thirdJudge.address],
			BigNumber.from(FIVE_MINUTES)
		);

	console.log(`mimcSponge: ${mimcsponge.address}`);
	console.log(`verifier: ${verifier.address}`);
	console.log(`zkVote: ${zkVote.address}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
