import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
	solidity: "0.8.17",
	networks: {
		hardhat: {
			accounts: [
				{
					privateKey: process.env.VOTER_1_PUBLIC_KEY ?? "",
					balance: "100000000000000000000",
				},
				{
					privateKey: process.env.VOTER_1_SECRET_KEY ?? "",
					balance: "100000000000000000000",
				},
				{
					privateKey: process.env.VOTER_2_PUBLIC_KEY ?? "",
					balance: "100000000000000000000",
				},
				{
					privateKey: process.env.VOTER_2_SECRET_KEY ?? "",
					balance: "100000000000000000000",
				},
				{
					privateKey: process.env.VOTER_3_PUBLIC_KEY ?? "",
					balance: "100000000000000000000",
				},
				{
					privateKey: process.env.VOTER_3_SECRET_KEY ?? "",
					balance: "100000000000000000000",
				},
			],
			mining: {
				auto: true,
			},
		},
	},
};

export default config;
