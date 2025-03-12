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
import '@fontsource/rethink-sans/400.css';
import '@fontsource/rethink-sans/500.css';
import '@fontsource/rethink-sans/600.css';

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
      <WidgetProvider>...</WidgetProvider>
    </QueryClientProvider>
  );
};
```

> **_NOTE:_** Via `WidgetProvider`, you can customize the widget's appearance by modifying `defaultTheme`.

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
    logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  };

  const finalToken: Token = {
    symbol: 'SOL',
    address: 'So11111111111111111111111111111111111111112',
    chainType: ChainType.SOLANA,
    logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  };

  const estimateCallback = async (token: Token): Promise<EstimateResponse> => {
    // Call API to get estimated output
    return {
      amountOut: '0.95',
      priceInUSD: '150',
      estimatedTimeInSeconds: 10,
      estimatedFeeInUSD: '0.01',
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
          isTokenBuyTemplate={false}
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

| Prop                 | Type                                          | Description                              |
| -------------------- | --------------------------------------------- | ---------------------------------------- |
| `isOpen`             | `boolean`                                     | Controls widget visibility               |
| `isTokenBuyTemplate` | `boolean`                                     | true, in case of token purchase          |
| `inputToken`         | `Token`                                       | Input token details                      |
| `finalToken?`        | `Token`                                       | Output token details                     |
| `apiKey`             | `string`                                      | API key for Anyalt services              |
| `onClose`            | `() => void`                                  | Callback triggered when widget is closed |
| `estimateCallback`   | `(token: Token) => Promise<EstimateResponse>` | Function to estimate token swap          |
| `executeCallBack`    | `(token: Token) => Promise<ExecuteResponse>`  | Function to execute token swap           |
| `walletConnector?`   | `WalletConnector`                             | Optional custom wallet connector         |
| `minDepositAmount?`  | `number`                                      | Minimum deposit amount in USD equivalent |

`isTokenBuyTemplate` is used to determine if the widget is in token buy template mode.

If true, the widget will be in token buy template mode. And `inputToken` will be the token that the user wants to buy. Also `finalToken` is not required.

#### Props Types

```ts
export type AnyaltWidgetProps = {
  isOpen: boolean;
  apiKey: string;
  inputToken: Token;
  finalToken?: Token;
  minDepositAmount?: number;
  isTokenBuyTemplate?: boolean;
  walletConnector?: WalletConnector;
  onClose: () => void;
  estimateCallback: (token: Token) => Promise<EstimateResponse>;
  executeCallBack: (token: Token) => Promise<ExecuteResponse>;
};
```

#### `Token`

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
  estimatedTimeInSeconds?: number;
  estimatedFeeInUSD?: string;
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

You can customize the widget's appearance by extending the default theme. The widget uses Chakra UI's theming system under the hood.

### Color Customization

```tsx
import { defaultTheme } from '@anyalt/widget';
import { WidgetProvider } from '@anyalt/widget';

const customTheme = {
  ...defaultTheme,
  colors: {
    brand: {
      primary: '#121212', // Main background color
      border: {
        tag: '#008080', // Tag border color
        active: '#008080', // Active state border
        bestRoute: '#008080', // Best route indicator
        secondary: '#919eab1f', // Secondary borders
        error: '#E53030', // Error state border
        primary: 'rgba(145, 158, 171, 0.12)', // Primary border color
      },
      bg: {
        primary: '#919eab1f', // Primary background
        active: '#008080', // Active state background
        hover: '#919eab1f', // Hover state background
        error: '#E530301a', // Error state background
        tag: 'transparent', // Tag background
        modal: '#0C0600', // Modal background
        cardBg: '#919eab0a', // Card background
        selectToken: 'rgba(0, 0, 0, 0.5)', // Token selector background
        skeleton: '#919eab', // Loading skeleton color
      },
      text: {
        primary: '#fff', // Primary text color
        warning: '#f9e154', // Warning text color
        error: '#E53030', // Error text color
        active: '#008080', // Active state text
        secondary: {
          0: '#ffffff', // Pure white text
          1: 'rgba(255, 255, 255, 0.80)', // High emphasis text
          2: 'rgba(255, 255, 255, 0.40)', // Medium emphasis text
          3: 'rgba(255, 255, 255, 0.08)', // Low emphasis text
          4: '#919eab', // Muted text
        },
      },
      buttons: {
        close: {
          primary: '#919eab', // Close button color
        },
        back: {
          primary: '#fff', // Back button color
        },
        accordion: {
          primary: '#fff', // Accordion button color
        },
        action: {
          bg: '#008080', // Action button background
          bgFaded: '#00808033', // Faded action button
          hover: '#006666', // Action button hover
          disabled: '#00808033', // Disabled action button
        },
        disabled: '#0B3E3E', // General disabled state
      },
      footer: {
        text: '#fff', // Footer text color
      },
    },
  },
};

// Use the custom theme in your app
const App = () => {
  return (
    <WidgetProvider theme={customTheme}>
      <AnyaltWidget
      // ... other props
      />
    </WidgetProvider>
  );
};
```

### Quick Theme Customization Examples

Here are some common customization scenarios:

#### Change Primary Colors

```tsx
const customTheme = {
  ...defaultTheme,
  colors: {
    brand: {
      ...defaultTheme.colors.brand,
      primary: '#000000', // Main background
      bg: {
        ...defaultTheme.colors.brand.bg,
        active: '#3498db', // Active states
        hover: 'rgba(52, 152, 219, 0.1)', // Hover states
      },
      buttons: {
        ...defaultTheme.colors.brand.buttons,
        action: {
          bg: '#3498db', // Main action button
          bgFaded: '#3498db33', // Faded state
          hover: '#2980b9', // Hover state
          disabled: '#3498db33', // Disabled state
        },
      },
    },
  },
};
```

#### Customize Text Colors

```tsx
const customTheme = {
  ...defaultTheme,
  colors: {
    brand: {
      ...defaultTheme.colors.brand,
      text: {
        primary: '#ffffff', // Main text
        warning: '#f39c12', // Warnings
        error: '#e74c3c', // Errors
        secondary: {
          1: 'rgba(255, 255, 255, 0.9)', // Primary text
          2: 'rgba(255, 255, 255, 0.6)', // Secondary text
          3: 'rgba(255, 255, 255, 0.1)', // Disabled text
          4: '#95a5a6', // Muted text
        },
      },
    },
  },
};
```

Remember to maintain sufficient contrast ratios for accessibility when customizing colors.

---

## Contributing

We welcome contributions! Feel free to open an issue or submit a pull request.
