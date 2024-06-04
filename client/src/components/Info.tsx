import { FC, useEffect, useState } from 'react'

import {
	useAccount,
	useReadContract,
	useWaitForTransactionReceipt,
	useWriteContract
} from 'wagmi'
import {
	contracts,
	fiveMinutes,
	phazes,
	proofServer
} from '../helpers/constants'
import { Button, Heading, Stack, Text, theme, useToast } from '@chakra-ui/react'
import { formatStartTime, unixToDate } from '../helpers/formatting'
import { useCountdown } from '../hooks/useCountdown'
import axios from 'axios'

const formatCommitment = (comm: string) =>
	comm.slice(0, 5) + '...' + comm.slice(comm.length - 5) + ','

export const Info: FC = () => {
	const [commitments, setCommitments] = useState<any[]>([])
	const [targetDate, setTargetDate] = useState(new Date())
	const {
		data: startRevealTxHash,
		error: startRevealTxError,
		writeContract
	} = useWriteContract()
	const { isSuccess: startRevealTxSuccess } = useWaitForTransactionReceipt({
		hash: startRevealTxHash
	})

	const {
		data: finalizeTxHash,
		error: finalizeTxError,
		writeContract: writeContractFinalize
	} = useWriteContract()
	const { isSuccess: finalizeTxSuccess, data: finalizeTxData } =
		useWaitForTransactionReceipt({
			hash: finalizeTxHash
		})

	const toast = useToast()

	const [, , mins, secs] = useCountdown(targetDate)

	const account = useAccount()

	const { data: phaze, refetch: refetchPhaze } = useReadContract({
		abi: contracts.zkVote.abi,
		address: contracts.zkVote.address as `0x${string}`,
		functionName: 'phaze'
	})

	const { data: isJudge } = useReadContract({
		abi: contracts.zkVote.abi,
		address: contracts.zkVote.address as `0x${string}`,
		functionName: 'isJudge',
		args: [account.address]
	})

	const { data: votingStarted } = useReadContract({
		abi: contracts.zkVote.abi,
		address: contracts.zkVote.address as `0x${string}`,
		functionName: 'votingStarted'
	})

	useEffect(() => {
		if (startRevealTxSuccess) {
			toast({
				title: 'Commit success!',
				status: 'success'
			})
		}
	}, [startRevealTxSuccess])

	useEffect(() => {
		if (startRevealTxError) {
			console.log({ startRevealTxError })

			toast({
				title: startRevealTxError.toString(),
				status: 'error'
			})
		}
	}, [startRevealTxError])

	useEffect(() => {
		if (finalizeTxSuccess) {
			toast({
				title: 'Finalize success!',
				status: 'success'
			})
		}
	}, [finalizeTxSuccess])

	useEffect(() => {
		if (finalizeTxError) {
			console.log({ finalizeTxError })

			toast({
				title: finalizeTxError.toString(),
				status: 'error'
			})
		}
	}, [finalizeTxError])

	const fetchCommitments = async () => {
		try {
			const response = await axios.get(`${proofServer}/commitments`)

			setCommitments(response.data.commitments)
		} catch (error) {
			console.error(error)
		}
	}

	// console.log({ commitments })

	useEffect(() => {
		votingStarted &&
			setTargetDate(
				unixToDate(parseInt(votingStarted.toString(), 10) + fiveMinutes)
			)
	}, [votingStarted])

	const startReveal = async () => {
		writeContract({
			abi: contracts.zkVote.abi,
			address: contracts.zkVote.address as `0x${string}`,
			functionName: 'startReveal'
		})
	}

	const finalize = async () => {
		writeContractFinalize({
			abi: contracts.zkVote.abi,
			address: contracts.zkVote.address as `0x${string}`,
			functionName: 'finalize'
		})
	}

	return (
		<Stack
			bg={theme.colors.gray[50]}
			py={4}
			px={6}
			borderRadius={10}
			spacing={2}
		>
			<Heading as="h3" fontSize={24}>
				Info
			</Heading>

			<p>Current phaze: {phazes[phaze?.toString() ?? '0']}</p>
			<Button onClick={() => refetchPhaze()}>Refetch phaze</Button>

			<p>Signer is judge: {isJudge?.toString()}</p>
			<p>
				Voting start time: {formatStartTime(votingStarted?.toString())}
			</p>
			<p>
				Left: {mins}m {secs}s
			</p>

			<Button onClick={fetchCommitments}>Fetch commitments</Button>

			<Text>
				Commitments:{' '}
				{commitments.length > 0 &&
					commitments.map((comm) =>
						formatCommitment(comm.commitment)
					)}
			</Text>

			<Button onClick={startReveal}>Start reveal phaze</Button>

			<Button onClick={finalize}>Finalize</Button>
		</Stack>
	)
}
