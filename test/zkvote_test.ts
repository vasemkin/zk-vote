import { expect } from "chai";
import { ethers } from "hardhat";
import {
    generateCommitment,
    calculateMerkleRootAndZKProof,
} from "../src/zktree";
import { mimcSpongecontract } from "circomlibjs";
import { time } from "@nomicfoundation/hardhat-network-helpers";

import type { ZKVote, ZKVote__factory } from "../typechain-types";
import { BigNumber } from "ethers";

const FIVE_MINUTES = 60 * 5;
const SEED = "mimcsponge";
const TREE_LEVELS = 20;

describe.only("ZKVote Tests", function () {
    let zkVote: ZKVote;

    const getSigners = async () => {
        const [
            deployer,
            judge,
            otherJudge,
            judgePrivate,
            otherJudgePrivate,
            stranger,
        ] = await ethers.getSigners();

        return {
            deployer,
            judge,
            otherJudge,
            judgePrivate,
            otherJudgePrivate,
            stranger,
        };
    };

    this.beforeAll(async () => {
        const signers = await ethers.getSigners();
        const MiMCSponge = new ethers.ContractFactory(
            mimcSpongecontract.abi,
            mimcSpongecontract.createCode(SEED, 220),
            signers[0]
        );

        const mimcsponge = await MiMCSponge.deploy();
        const Verifier = await ethers.getContractFactory("Verifier");
        const verifier = await Verifier.deploy();

        const zkVoteFactory: ZKVote__factory = await ethers.getContractFactory(
            "ZKVote"
        );

        zkVote = (await zkVoteFactory.deploy(
            ethers.BigNumber.from(TREE_LEVELS),
            mimcsponge.address,
            verifier.address
        )) as ZKVote;
        await zkVote.deployed();
    });

    describe("ZKVote E2E", () => {
        it("Works as expected", async function () {
            const {
                deployer,
                judge,
                otherJudge,
                judgePrivate,
                otherJudgePrivate,
                stranger,
            } = await getSigners();

            await zkVote
                .connect(deployer)
                .init(ethers.utils.formatBytes32String("my proposal"), [
                    judge.address,
                    otherJudge.address,
                ]);

            const judgeComm = await generateCommitment(BigNumber.from(8));
            const otherJudgeComm = await generateCommitment(BigNumber.from(10));

            await zkVote.connect(judge).commitScore(judgeComm.commitment);

            // stranger can't vote
            await expect(
                zkVote.connect(stranger).commitScore(otherJudgeComm.commitment)
            ).to.be.revertedWith("JP: Not a judge");

            await zkVote.connect(judge).commitScore(otherJudgeComm.commitment);

            await time.increase(FIVE_MINUTES + 1);

            await zkVote.connect(deployer).startReveal();

            const judgeProof = await calculateMerkleRootAndZKProof(
                zkVote.address,
                judgePrivate,
                TREE_LEVELS,
                judgeComm,
                "build/Verifier.zkey"
            );

            const otherJudgeProof = await calculateMerkleRootAndZKProof(
                zkVote.address,
                otherJudgePrivate,
                TREE_LEVELS,
                otherJudgeComm,
                "build/Verifier.zkey"
            );

            await zkVote.connect(judgePrivate).revealScore(
                BigNumber.from(8),
                judgeComm.nullifierHash,
                judgeProof.root,
                //@ts-ignore
                judgeProof.proof_a,
                judgeProof.proof_b,
                judgeProof.proof_c
            );

            // can't submit a false score
            await expect(
                zkVote.connect(otherJudgePrivate).revealScore(
                    BigNumber.from(9),
                    otherJudgeComm.nullifierHash,
                    otherJudgeProof.root,
                    //@ts-ignore
                    otherJudgeProof.proof_a,
                    otherJudgeProof.proof_b,
                    otherJudgeProof.proof_c
                )
            ).to.be.revertedWith("Invalid proof");

            await zkVote.connect(otherJudgePrivate).revealScore(
                BigNumber.from(10),
                otherJudgeComm.nullifierHash,
                otherJudgeProof.root,
                //@ts-ignore
                otherJudgeProof.proof_a,
                otherJudgeProof.proof_b,
                otherJudgeProof.proof_c
            );

            await zkVote.finalize();
            expect(await zkVote.getMedian()).to.eq(BigNumber.from(9));
        });
    });
});
