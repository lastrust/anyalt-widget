# Anyalt Widget

## Overview

**Anyalt Widget** is a versatile widget designed for last-mile transactions, whether they occur within a chain, across chains, or using fiat currency.

Anyalt supports a wide range of chains, including Bitcoin, Solana, Ethereum, Base, Arbitrum, Optimism, Blast, Scroll, Linea, Binance Smart Chain, Polygon, ZK Sync Era, and Avalanche.

It assists protocols with deposit functions within contracts, such as a user depositing ETH to receive stETH in Lido Finance.

## Key features of Anyalt Widget include:

- Quick and easy 10-minute integration
- Complete UI integration that minimizes user friction
- Integration with multiple wallets
- Theme customization support
- Seamless compatibility with Next.js and React applications

---

## Setup

```sh
npm install @anyalt/widget @tanstack/react-query
```

or

```sh
yarn add @anyalt/widget @tanstack/react-query
```

or

```sh
pnpm add @anyalt/widget @tanstack/react-query
```

- Apply styles for the wallets to display them correctly on your app.
```tsx
import '@solana/wallet-adapter-react-ui/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
```

- From `@tanstack/react-query`, import the `QueryClientProvider` component and `QueryClient` class. 
- From `@anyalt/widget/` import the `WidgetProvider` and `AnyaltWidget` components.
- Wrap your app with the providers:
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WidgetProvider, AnyaltWidget } from '@anyalt/widget';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WidgetProvider>
        ...
      </WidgetProvider>
    </QueryClientProvider>
  );
};
```

> **_NOTE:_**  Via `WidgetProvider`, you can customize the widget's appearance by modifying `defaultTheme`.

## Example Usage

```tsx
import {
  AnyaltWidget,
  WidgetProvider,
  defaultTheme,
  ChainType,
  Token,
} from '@anyalt/widget';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@solana/wallet-adapter-react-ui/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const Widget = () => {
  const [isOpen, setIsOpen] = useState(true);

  const inputToken: Token = {
    symbol: 'ETH',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    chainId: 1,
    chainType: ChainType.EVM,
  };

  const finalToken: Token = {
    symbol: 'SOL',
    address: 'So11111111111111111111111111111111111111112',
    chainType: ChainType.SOLANA,
  };

  const estimateCallback = async (token: Token): Promise<EstimateResponse> => {
    // Call API to get estimated output
    return {
      amountOut: '0.95',
      priceInUSD: '150',
    };
  };

  const executeCallBack = async (token: Token): Promise<ExecuteResponse> => {
    // Call API to execute the transaction
    return {
      approvalTxHash: '0x123abc',
      executeTxHash: '0x456def',
      amountOut: '0.94',
    };
  };

  return (
    <QueryClientProvider client={queryClient}>
      <WidgetProvider theme={defaultTheme}>
        <button onClick={() => setIsOpen(true)}>Open Widget</button>
        <AnyaltWidget
          isOpen={isOpen}
          inputToken={inputToken}
          finalToken={finalToken}
          apiKey="your-api-key"
          onClose={() => setIsOpen(false)}
          estimateCallback={estimateCallback}
          executeCallBack={executeCallBack}
          minDepositAmount={10}
        />
      </WidgetProvider>
    </QueryClientProvider>
  );
};

export default Widget;
```

## Integration with Next.js

Please declare your components with `'use client'` and use `dynamic` to import the widget to avoid server-side rendering issues.


```tsx
'use client';

import dynamic from 'next/dynamic';

export const ClientWidgetWrapper = dynamic(
  () => import('../components/Widget').then((mod) => mod.default),
  {
    ssr: false,
  },
);
```

---


### Props

| Prop                | Type                                          | Description                              |
| ------------------- | --------------------------------------------- | ---------------------------------------- |
| `isOpen`            | `boolean`                                     | Controls widget visibility               |
| `inputToken`        | `Token`                                       | Input token details                      |
| `finalToken`        | `Token`                                       | Output token details                     |
| `apiKey`            | `string`                                      | API key for Anyalt services              |
| `onClose`           | `() => void`                                  | Callback triggered when widget is closed |
| `estimateCallback`  | `(token: Token) => Promise<EstimateResponse>` | Function to estimate token swap          |
| `executeCallBack`   | `(token: Token) => Promise<ExecuteResponse>`  | Function to execute token swap           |
| `walletConnector?`  | `WalletConnector`                             | Optional custom wallet connector         |
| `minDepositAmount?` | `number`                                      | Minimum deposit amount in USD equivalent |

### `Token`

```ts
export interface Token {
  symbol: string;
  address: string;
  chainId?: number;
  chainType: ChainType;
  logoUrl?: string;
}
```

### `EstimateResponse`

```ts
export interface EstimateResponse {
  amountOut: string;
  priceInUSD: string;
}
```

### `ExecuteResponse`

```ts
export interface ExecuteResponse {
  approvalTxHash?: string;
  executeTxHash?: string;
  amountOut: string;
}
```

### `WalletConnector`

```ts
export interface WalletConnector {
  address: string;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: unknown) => Promise<string>;
  getChain: () => Promise<number>;
  switchChain: (chainId: number) => Promise<void>;
}
```

---

## Theming

You can customize the widget’s appearance by modifying `defaultTheme`.

```ts
import { defaultTheme } from '@anyalt/widget';

defaultTheme.colors.primary = '#ff5733';
```

---

## Contributing

We welcome contributions! Feel free to open an issue or submit a pull request.
