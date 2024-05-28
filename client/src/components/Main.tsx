import { FC, useState } from 'react'

import { Navbar } from './Navbar'
import {
	Button,
	Flex,
	Grid,
	Heading,
	Input,
	Stack,
	Text,
	theme
} from '@chakra-ui/react'
import { Info } from './Info'
import { BigNumber } from 'ethers'

/// todo: resolve commonjs stuff
/// import { generateCommitment } from '../../../src/zktree'

const mockGenerateCommitment = async (_: BigNumber) => ({
	commitment: 'epicCommitment!'
})

export const Main: FC = () => {
	const [scoreToCommit, setScoreToCommit] = useState(BigNumber.from('0'))
	const [commitment, setCommitment] = useState<string | null>(null)

	const handleCommitmentInput = (evt: React.FormEvent<HTMLInputElement>) => {
		setScoreToCommit(BigNumber.from((evt.target as HTMLInputElement).value))
	}

	const handleCommtimentGeneration = async () => {
		const commitmentData = await mockGenerateCommitment(scoreToCommit)
		console.log({ commitmentData })
		setCommitment(commitmentData.commitment)
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

					{commitment && <Text>{commitment}</Text>}
				</Stack>
			</Grid>
		</>
	)
}
