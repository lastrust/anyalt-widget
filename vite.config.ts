// vite.config.js
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const externalPackages = [
  'react',
  'react-dom',
  '@fontsource/rethink-sans',
  '@rainbow-me/rainbowkit',
  '@reown/appkit',
  '@reown/appkit-adapter-wagmi',
  '@solana/spl-token',
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-react-ui',
  '@solana/wallet-adapter-wallets',
  '@solana/web3.js',
  '@tanstack/react-query',
  '@wagmi/core',
  '@wallet-standard/core',
  '@wallet-standard/features',
  'ethers',
  'framer-motion',
  'jotai',
  'next-themes',
  'prettier',
  'react-icons',
  'viem',
  'wagmi',
];

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'AnyaltWidget',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => `anyalt-widget.${format}.js`,
    },
    rollupOptions: {
      // Do NOT bundle these packages into your output;
      // let the consuming project install them (peer deps).
      external: externalPackages,

      output: {
        // Optional: UMD globals if someone uses the UMD bundle
        // in a <script> tag (not very common for React libs).
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@fontsource/rethink-sans': 'FontsourceRethinkSans',
          '@rainbow-me/rainbowkit': 'RainbowKit',
          '@reown/appkit': 'ReownAppKit',
          '@reown/appkit-adapter-wagmi': 'ReownAppKitAdapterWagmi',
          '@solana/spl-token': 'SolanaSplToken',
          '@solana/wallet-adapter-base': 'SolanaWalletAdapterBase',
          '@solana/wallet-adapter-react': 'SolanaWalletAdapterReact',
          '@solana/wallet-adapter-react-ui': 'SolanaWalletAdapterReactUI',
          '@solana/wallet-adapter-wallets': 'SolanaWalletAdapterWallets',
          '@solana/web3.js': 'SolanaWeb3',
          '@tanstack/react-query': 'TanstackReactQuery',
          '@wagmi/core': 'WagmiCore',
          '@wallet-standard/core': 'WalletStandardCore',
          '@wallet-standard/features': 'WalletStandardFeatures',
          ethers: 'Ethers',
          'framer-motion': 'FramerMotion',
          jotai: 'Jotai',
          'next-themes': 'NextThemes',
          prettier: 'Prettier',
          'react-icons': 'ReactIcons',
          viem: 'Viem',
          wagmi: 'Wagmi',
        },
      },
    },
    minify: 'terser',
  },
});
