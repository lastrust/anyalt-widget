import {
  BitcoinWeb3ConfigProvider,
  OkxWallet,
  PhantomWallet,
  UnisatWallet,
  XverseWallet,
} from '@ant-design/web3-bitcoin';
import { ConfigProvider, theme } from 'antd';

export function BitcoinProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <BitcoinWeb3ConfigProvider
        wallets={[XverseWallet(), UnisatWallet(), OkxWallet(), PhantomWallet()]}
      >
        {children}
      </BitcoinWeb3ConfigProvider>
    </ConfigProvider>
  );
}
