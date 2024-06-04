import { Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';
import {
  generateCommitment,
  Commitment,
  calculateMerkleRootAndZKProofLocal,
} from '../../src/zktree';

type InMemoryDb = {
  commitments: Set<Commitment>;
};

@Injectable()
export class AppService {
  signer: ethers.Signer;

  inMemoryDb: InMemoryDb = {
    commitments: new Set(),
  };

  constructor() {
    this.signer = ethers.Wallet.createRandom();
  }

  async generateCommitment(score: BigNumber): Promise<Commitment> {
    return await generateCommitment(score);
  }

  async storeCommitment(commitment: Commitment) {
    this.inMemoryDb.commitments.add(commitment);
  }

  getCommitments(): Array<Commitment> {
    console.log({ db: this.inMemoryDb });
    return Array.from(this.inMemoryDb.commitments);
  }

  async calculateProof(commitment: Commitment) {
    return await calculateMerkleRootAndZKProofLocal(
      20,
      Array.from(this.inMemoryDb.commitments).map((el) => el.commitment),
      commitment,
      '/Users/vasemkin/Desktop/dev/pets/zk-tree-vote/build/Verifier_js/Verifier.wasm',
      '/Users/vasemkin/Desktop/dev/pets/zk-tree-vote/build/Verifier.zkey',
    );
  }
}
