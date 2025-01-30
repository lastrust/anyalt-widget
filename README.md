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

## Installation

```sh
npm install @anyalt/widget
```

or

```sh
yarn add @anyalt/widget
```

or

```sh
pnpm add @anyalt/widget
```

---

## Usage

Import and use the `WidgetProvider` and `AnyaltWidget` component in your project. Via `WidgetProvider`, you can customize the widget's appearance by modifying `defaultTheme`.

```tsx
import {
  AnyaltWidget,
  WidgetProvider,
  defaultTheme,
  ChainType,
  Token,
} from '@anyalt/widget';
import { useState } from 'react';

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

  const estimateCallback = async (amount: string) => {
    // Call API to get estimated output
    return {
      amountOut: '0.95',
      priceInUSD: '150',
    };
  };

  const executeCallBack = async (amount: string) => {
    // Call API to execute the transaction
    return {
      approvalTxHash: '0x123abc',
      executeTxHash: '0x456def',
      amountOut: '0.94',
    };
  };

  return (
    <WidgetProvider theme={defaultTheme}>
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
  );
};

export default Widget;
```

## Integation with Next.js

Please wrap your components with `'use client'` and use `dynamic` to import the widget to avoid server-side rendering issues.

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

## API Reference

### `AnyaltWidgetProps`

| Prop                | Type                                            | Description                              |
| ------------------- | ----------------------------------------------- | ---------------------------------------- |
| `isOpen`            | `boolean`                                       | Controls widget visibility               |
| `inputToken`        | `Token`                                         | Input token details                      |
| `finalToken`        | `Token`                                         | Output token details                     |
| `apiKey`            | `string`                                        | API key for Anyalt services              |
| `onClose`           | `() => void`                                    | Callback triggered when widget is closed |
| `estimateCallback`  | `(amount: string) => Promise<EstimateResponse>` | Function to estimate token swap          |
| `executeCallBack`   | `(amount: string) => Promise<ExecuteResponse>`  | Function to execute token swap           |
| `walletConnector?`  | `WalletConnector`                               | Optional custom wallet connector         |
| `minDepositAmount?` | `number`                                        | Minimum deposit amount                   |

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
