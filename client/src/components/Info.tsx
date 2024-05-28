import { FC, useEffect, useState } from 'react'

import { useAccount, useReadContract } from 'wagmi'
import { contracts, fiveMinutes, phazes } from '../helpers/constants'
import { Heading, Stack, theme } from '@chakra-ui/react'
import { formatStartTime, unixToDate } from '../helpers/formatting'
import { useCountdown } from '../hooks/useCountdown'

export const Info: FC = () => {
	const [targetDate, setTargetDate] = useState(new Date())

	const [, , mins, secs] = useCountdown(targetDate)

	const account = useAccount()

	const { data: phaze } = useReadContract({
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
		votingStarted &&
			setTargetDate(
				unixToDate(parseInt(votingStarted.toString(), 10) + fiveMinutes)
			)
	}, [votingStarted])

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
			<p>Signer is judge: {isJudge?.toString()}</p>
			<p>
				Voting start time: {formatStartTime(votingStarted?.toString())}
			</p>
			<p>
				Left: {mins}m {secs}s
			</p>
		</Stack>
	)
}
