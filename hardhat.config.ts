import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "hardhat-gas-reporter";

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
				{
					privateKey:
						"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
					balance: "100000000000000000000",
				},
				{
					privateKey:
						"0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
					balance: "100000000000000000000",
				},
			],
		},
	},
	gasReporter: {
		enabled: true,
	},
};

export default config;
