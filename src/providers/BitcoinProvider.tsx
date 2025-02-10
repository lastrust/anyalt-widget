import {
  BitcoinWeb3ConfigProvider,
  OkxWallet,
  PhantomWallet,
  UnisatWallet,
  XverseWallet,
} from '@ant-design/web3-bitcoin';

export function BitcoinProvider({ children }: { children: React.ReactNode }) {
  return (
    <BitcoinWeb3ConfigProvider
      wallets={[XverseWallet(), UnisatWallet(), OkxWallet(), PhantomWallet()]}
    >
      {children}
    </BitcoinWeb3ConfigProvider>
  );
}
