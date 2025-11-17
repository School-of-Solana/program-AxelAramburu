import { ReactNode } from 'react'
import { createSolanaDevnet, createSolanaLocalnet, createWalletUiConfig, WalletUi } from '@wallet-ui/react'
import { WalletUiGillProvider } from '@wallet-ui/react-gill'
import { solanaMobileWalletAdapter } from './solana-mobile-wallet-adapter'

const config = createWalletUiConfig({
  clusters: [createSolanaDevnet('https://solana-devnet.g.alchemy.com/v2/FHHiXr7TW00yoeb7DsUPhST0r-4Ad0bF'), createSolanaLocalnet()],
})

solanaMobileWalletAdapter({ clusters: config.clusters })

export function SolanaProvider({ children }: { children: ReactNode }) {
  return (
    <WalletUi config={config}>
      <WalletUiGillProvider>{children}</WalletUiGillProvider>
    </WalletUi>
  )
}
