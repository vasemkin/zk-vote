import { FC } from 'react'

import { Navbar } from './Navbar'
import { useAccount, useReadContract } from 'wagmi'
import { contracts } from '../helpers/constants'
import { Box } from '@chakra-ui/react'

const phazes: Record<string, string> = {
	'0': 'Initial',
	'1': 'Commit',
	'2': 'Reveal',
	'3': 'Finalized'
}

export const Main: FC = () => {
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

	return (
		<>
			<Navbar />
			<Box py={6} px={10}>
				<p>Current phaze: {phazes[phaze?.toString() ?? '0']}</p>
				<p>isJudge: {isJudge?.toString()}</p>
			</Box>
		</>
	)
}
