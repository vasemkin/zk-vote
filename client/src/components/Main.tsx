import { FC, useEffect, useState } from 'react'

import { Navbar } from './Navbar'
import {
	Button,
	Flex,
	Grid,
	Heading,
	Input,
	Stack,
	Text,
	theme,
	useToast
} from '@chakra-ui/react'
import { Info } from './Info'
import axios from 'axios'
import { proofServer, contracts } from '../helpers/constants'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

export const Main: FC = () => {
	const [scoreToCommit, setScoreToCommit] = useState(0)
	const [commitmentStored, setCommitmentStored] = useState(false)
	const [commitment, setCommitment] = useState<any>(null)
	const [commitmentData, setCommitmentData] = useState<string | null>(null)
	const [proof, setProof] = useState<any>(null)
	const toast = useToast()
	const {
		data: commitTxHash,
		error: commitTxError,
		writeContractAsync
	} = useWriteContract()

	const {
		data: revealTxHash,
		error: revealTxError,
		writeContractAsync: writeContractAsyncReveal
	} = useWriteContract()

	const handleCommitmentInput = (evt: React.FormEvent<HTMLInputElement>) => {
		setScoreToCommit(parseInt((evt.target as HTMLInputElement).value))
	}

	const { isSuccess: commitTxSuccess } = useWaitForTransactionReceipt({
		hash: commitTxHash
	})

	const { isSuccess: revealTxSuccess } = useWaitForTransactionReceipt({
		hash: revealTxHash
	})

	useEffect(() => {
		if (commitTxError) {
			console.log({ commitTxError })

			toast({
				title: commitTxError.toString(),
				status: 'error'
			})
		}
	}, [commitTxError])

	useEffect(() => {
		if (commitTxSuccess && !commitmentStored) {
			toast({
				title: 'Commit success!',
				status: 'success'
			})

			storeCommitment()
			setCommitmentStored(true)
		}
	}, [commitTxSuccess])

	useEffect(() => {
		if (revealTxError) {
			console.log({ revealTxError })

			toast({
				title: revealTxError.toString(),
				status: 'error'
			})
		}
	}, [revealTxError])

	useEffect(() => {
		if (revealTxSuccess) {
			toast({
				title: 'Reveal success!',
				status: 'success'
			})
		}
	}, [revealTxSuccess])

	const generateCommitment = async (score: number) => {
		try {
			const response = await axios.get(
				`${proofServer}/generate-commitment/${score}`
			)

			return response.data
		} catch (error) {
			console.error(error)
		}
	}

	const handleCommtimentGeneration = async () => {
		const commitmentData = await generateCommitment(scoreToCommit)
		console.log({ commitmentData })
		setCommitment(commitmentData)
		setCommitmentData(commitmentData.commitment)
	}

	const storeCommitment = async () => {
		try {
			const request = await axios.post(
				`${proofServer}/store-commitment/`,
				{
					commitment
				}
			)

			console.log({ request })

			return request.data
		} catch (error) {
			console.log({ error })
			console.error(error)
		}
	}

	const commit = async () => {
		const args = [BigInt(commitmentData!)]

		const res = await writeContractAsync({
			address: contracts.zkVote.address as `0x${string}`,
			abi: contracts.zkVote.abi,
			functionName: 'commitScore',
			args
		})

		console.log({ res })
	}

	const reveal = async () => {
		const args = [
			BigInt(proof.score),
			BigInt(proof.nullifierHash),
			BigInt(proof.root),
			proof.proof_a,
			proof.proof_b,
			proof.proof_c
		]

		const res = await writeContractAsyncReveal({
			address: contracts.zkVote.address as `0x${string}`,
			abi: contracts.zkVote.abi,
			functionName: 'revealScore',
			args
		})

		console.log({ res })
	}

	const generateProof = async () => {
		try {
			const request = await axios.post(`${proofServer}/generate-proof/`, {
				commitment
			})

			setProof(request.data.proof)
		} catch (error) {
			console.log({ error })
			console.error(error)
		}
	}

	return (
		<>
			<Navbar />

			<Grid templateColumns="1fr 2fr" py={6} px={10} gap={6}>
				<Info />

				<Stack bg={theme.colors.gray[50]} py={4} px={6} spacing={2}>
					<Heading as="h3" fontSize={24}>
						Actions
					</Heading>

					<Heading as="h4" size="m">
						Commit phaze
					</Heading>
					<Flex gap={2}>
						<Input
							type="number"
							placeholder="Your score"
							bg={theme.colors.white}
							onInput={handleCommitmentInput}
						/>

						<Button onClick={handleCommtimentGeneration}>
							Generate
						</Button>
					</Flex>

					{commitment && (
						<Stack
							justifyContent="flex-start"
							alignItems="flex-start"
						>
							<Text>Your commitment:</Text>
							<Text fontSize={12}>
								nullifier: {commitment.nullifier}
							</Text>
							<Text fontSize={12}>
								secret: {commitment.secret}
							</Text>
							<Text fontSize={12}>score: {commitment.score}</Text>
							<Text fontSize={12}>
								commitment: {commitment.commitment}
							</Text>
							<Text fontSize={12}>
								nullifierHash: {commitment.nullifierHash}
							</Text>

							<Button onClick={commit}>Commit</Button>
						</Stack>
					)}

					<br />

					<Heading as="h4" size="m">
						Reveal phaze
					</Heading>

					<Stack
						spacing={2}
						direction="column"
						alignItems="flex-start"
						justifyContent="flex-start"
					>
						<Button onClick={generateProof}>Generate proof</Button>
						{proof && (
							<>
								<Text fontSize={12}>
									Tree root: {proof.root}
								</Text>
								<Text fontSize={12}>
									Proof a[0]: {proof.proof_a[0]}
								</Text>
								<Text fontSize={12}>
									Proof a[1]: {proof.proof_a[1]}
								</Text>
								<Text fontSize={12}>
									Proof b[0][0]: {proof.proof_b[0][0]}
								</Text>
								<Text fontSize={12}>
									Proof b[0][1]: {proof.proof_b[0][1]}
								</Text>
								<Text fontSize={12}>
									Proof b[1][0]: {proof.proof_b[1][0]}
								</Text>
								<Text fontSize={12}>
									Proof b[1][1]: {proof.proof_b[1][1]}
								</Text>
								<Text fontSize={12}>
									Proof c[0]: {proof.proof_c[0]}
								</Text>
								<Text fontSize={12}>
									Proof c[1]: {proof.proof_c[1]}
								</Text>
							</>
						)}
						<Button onClick={reveal}>Submit and reveal</Button>
					</Stack>
				</Stack>
			</Grid>
		</>
	)
}
