import { FC, useEffect, useRef } from 'react'
import {
	Box,
	Button,
	Flex,
	Heading,
	Stack,
	Text,
	theme,
	useToast
} from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { watchAccount } from 'wagmi/actions'
import { config } from '../wagmi'
import { formatAddress } from '../helpers/formatting'

export const Navbar: FC = () => {
	const toastRef = useRef(false)

	const account = useAccount()
	const { connectors, connect } = useConnect()
	const { disconnect } = useDisconnect()

	const toast = useToast()

	const unwatch = watchAccount(config, {
		onChange(data) {
			if (!toastRef.current) {
				if (data.chainId !== 31337) {
					toastRef.current = true

					toast({
						status: 'error',
						title: 'Wrong Network Detected! Switch to 31337',
						onCloseComplete: () => {
							toastRef.current = false
						}
					})
				}
			}
		}
	})

	useEffect(() => {
		unwatch()
	}, [])

	return (
		<Box bg={theme.colors.gray[50]} px={10} py={6}>
			<Flex justifyContent="space-between">
				<Box>
					<Heading as="h1" size="2xl" noOfLines={1}>
						Zk Vote
					</Heading>
				</Box>

				<Stack direction="row" spacing={2} align="center">
					{account.status === 'connected' && (
						<Stack
							direction="row"
							spacing={2}
							align="center"
							bg={theme.colors.white}
							paddingLeft={2}
							borderRadius={6}
						>
							<Text>Address:</Text>
							<Box
								bg={theme.colors.gray[200]}
								p={2}
								borderRadius={6}
							>
								{formatAddress(
									account?.addresses?.[0].toString()
								)}
							</Box>
						</Stack>
					)}

					{account.status === 'connected' && (
						<Button type="button" onClick={() => disconnect()}>
							Disconnect
						</Button>
					)}

					{connectors
						.filter((e) => e.name === 'MetaMask')
						.map((connector) => (
							<Button
								isDisabled={account.status === 'connected'}
								key={connector.uid}
								onClick={() => connect({ connector })}
								type="button"
							>
								Connect
							</Button>
						))}
				</Stack>
			</Flex>
		</Box>
	)
}
