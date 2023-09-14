# 📈 ZKVote

Anonymous voting in Solidity.
This is based on [zk-merkle-tree](https://github.com/TheBojda/zk-merkle-tree) library by TheBodja.

Here the circuits are modified with a value called `score` which allows to store additional data in the commitment.

Also a PoC voting app is provided (`ZKVote.sol`), here is a simplififed diagram for the core privacy layer:

```mermaid
sequenceDiagram
    participant J as Judge
    participant PJ as Judge's secret account
    participant ZK as ZKVote
    participant H as Malicious Actor

    J->>ZK: commit with MiMC(nullifier,secret,score)
    ZK-->>ZK: store the commitment in zk tree
    PJ->>ZK: zk proof for the commitment + score
    ZK-->>ZK: any calculations with the given score
    note left of H: Malicious actor only knows that:
    note left of H: a) the Judge provided a commitment
    note left of H: b) some random account provided a score
    H-->ZK: can't dox the judge
```

## 🔧 Setting up Local Development

```bash
$ git clone https://github.com/vasemkin/zk-vote.git
$ cd zk-vote
$ nvm install
$ nvm use
$ npm i -g pnpm
$ pnpm install
$ pnpm prepare
```

## Testing

```bash
$ pnpm test
```
