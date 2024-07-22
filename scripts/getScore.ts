import { ethers } from "hardhat";

(async () => {
	const zkVote = await ethers.getContractAt(
		"ZKVote",
		"0xa62cE7791442539a8A40840E5526E1E1276C3FA5"
	);
	const score = await zkVote.getMedian();

	console.log({ score });
})();
