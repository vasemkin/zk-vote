export const phazes: Record<string, string> = {
	'0': 'Initial',
	'1': 'Commit',
	'2': 'Reveal',
	'3': 'Finalized'
}

export const fiveMinutes = 5 * 60

/// note: pre-detemined addresses for
/// 0x9F3Ec714885B53173D4E3165C5Edbf29FAa34Dc8
/// deployer address with no previous deployments
export const contracts = {
	mimcSponge: {
		address: '0xE987EF18B24bD93DE32126512CfFd3e3CfEa4Dd9'
	},
	verifier: {
		address: '0x4A1145ba1e0b03CF972af815C894c70FcE07390F',
		abi: [
			{
				inputs: [
					{
						internalType: 'uint256[2]',
						name: 'a',
						type: 'uint256[2]'
					},
					{
						internalType: 'uint256[2][2]',
						name: 'b',
						type: 'uint256[2][2]'
					},
					{
						internalType: 'uint256[2]',
						name: 'c',
						type: 'uint256[2]'
					},
					{
						internalType: 'uint256[3]',
						name: 'input',
						type: 'uint256[3]'
					}
				],
				name: 'verifyProof',
				outputs: [
					{
						internalType: 'bool',
						name: 'r',
						type: 'bool'
					}
				],
				stateMutability: 'view',
				type: 'function'
			}
		]
	},
	zkVote: {
		address: '0xa62cE7791442539a8A40840E5526E1E1276C3FA5',
		abi: [
			{
				inputs: [
					{
						internalType: 'uint32',
						name: '_levels',
						type: 'uint32'
					},
					{
						internalType: 'contract IHasher',
						name: '_hasher',
						type: 'address'
					},
					{
						internalType: 'contract IVerifier',
						name: '_verifier',
						type: 'address'
					}
				],
				stateMutability: 'nonpayable',
				type: 'constructor'
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'bytes32',
						name: 'commitment',
						type: 'bytes32'
					},
					{
						indexed: false,
						internalType: 'uint32',
						name: 'leafIndex',
						type: 'uint32'
					},
					{
						indexed: false,
						internalType: 'uint256',
						name: 'timestamp',
						type: 'uint256'
					}
				],
				name: 'Commit',
				type: 'event'
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: true,
						internalType: 'address',
						name: 'previousOwner',
						type: 'address'
					},
					{
						indexed: true,
						internalType: 'address',
						name: 'newOwner',
						type: 'address'
					}
				],
				name: 'OwnershipTransferred',
				type: 'event'
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'uint256',
						name: 'score',
						type: 'uint256'
					}
				],
				name: 'VotingEnded',
				type: 'event'
			},
			{
				anonymous: false,
				inputs: [
					{
						indexed: false,
						internalType: 'address',
						name: 'validator',
						type: 'address'
					}
				],
				name: 'VotingStarted',
				type: 'event'
			},
			{
				inputs: [],
				name: 'FIELD_SIZE',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'ROOT_HISTORY_SIZE',
				outputs: [
					{
						internalType: 'uint32',
						name: '',
						type: 'uint32'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'ZERO_VALUE',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'commitment',
						type: 'uint256'
					}
				],
				name: 'commitScore',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'bytes32',
						name: '',
						type: 'bytes32'
					}
				],
				name: 'commitments',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'currentRootIndex',
				outputs: [
					{
						internalType: 'uint32',
						name: '',
						type: 'uint32'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'duration',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256'
					}
				],
				name: 'filledSubtrees',
				outputs: [
					{
						internalType: 'bytes32',
						name: '',
						type: 'bytes32'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'finalize',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function'
			},
			{
				inputs: [],
				name: 'getLastRoot',
				outputs: [
					{
						internalType: 'bytes32',
						name: '',
						type: 'bytes32'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'getMedian',
				outputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '_left',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: '_right',
						type: 'uint256'
					}
				],
				name: 'hashLeftRight',
				outputs: [
					{
						internalType: 'bytes32',
						name: '',
						type: 'bytes32'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'hasher',
				outputs: [
					{
						internalType: 'contract IHasher',
						name: '',
						type: 'address'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'bytes32',
						name: 'proposal',
						type: 'bytes32'
					},
					{
						internalType: 'address[]',
						name: 'judges',
						type: 'address[]'
					},
					{
						internalType: 'uint256',
						name: '_duration',
						type: 'uint256'
					}
				],
				name: 'init',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: '_address',
						type: 'address'
					}
				],
				name: 'isJudge',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'bytes32',
						name: '_root',
						type: 'bytes32'
					}
				],
				name: 'isKnownRoot',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'levels',
				outputs: [
					{
						internalType: 'uint32',
						name: '',
						type: 'uint32'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'nextIndex',
				outputs: [
					{
						internalType: 'uint32',
						name: '',
						type: 'uint32'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'bytes32',
						name: '',
						type: 'bytes32'
					}
				],
				name: 'nullifiers',
				outputs: [
					{
						internalType: 'bool',
						name: '',
						type: 'bool'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'owner',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'phaze',
				outputs: [
					{
						internalType: 'enum ZKVote.Phaze',
						name: '',
						type: 'uint8'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'renounceOwnership',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'score',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'nullifierHash',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: '_root',
						type: 'uint256'
					},
					{
						internalType: 'uint256[2]',
						name: '_proof_a',
						type: 'uint256[2]'
					},
					{
						internalType: 'uint256[2][2]',
						name: '_proof_b',
						type: 'uint256[2][2]'
					},
					{
						internalType: 'uint256[2]',
						name: '_proof_c',
						type: 'uint256[2]'
					}
				],
				name: 'revealScore',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: '',
						type: 'uint256'
					}
				],
				name: 'roots',
				outputs: [
					{
						internalType: 'bytes32',
						name: '',
						type: 'bytes32'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'startReveal',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'address',
						name: 'newOwner',
						type: 'address'
					}
				],
				name: 'transferOwnership',
				outputs: [],
				stateMutability: 'nonpayable',
				type: 'function'
			},
			{
				inputs: [],
				name: 'validator',
				outputs: [
					{
						internalType: 'address',
						name: '',
						type: 'address'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'verifier',
				outputs: [
					{
						internalType: 'contract IVerifier',
						name: '',
						type: 'address'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [],
				name: 'votingStarted',
				outputs: [
					{
						internalType: 'uint64',
						name: '',
						type: 'uint64'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'i',
						type: 'uint256'
					}
				],
				name: 'zeros',
				outputs: [
					{
						internalType: 'bytes32',
						name: '',
						type: 'bytes32'
					}
				],
				stateMutability: 'pure',
				type: 'function'
			}
		]
	}
}
