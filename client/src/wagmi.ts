import { http, createConfig } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
	chains: [hardhat],
	connectors: [
		injected(),
		coinbaseWallet({ appName: 'Create Wagmi' }),
		walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID })
	],
	transports: {
		[hardhat.id]: http()
	}
})

declare module 'wagmi' {
	interface Register {
		config: typeof config
	}
}
