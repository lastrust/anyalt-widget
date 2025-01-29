# anyalt-widget

Anyalt Widget is a React component library for building anyalt widget.

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls the visibility of the widget |
| `onClose` | `() => void` | Callback function when widget is closed |
| `apiKey` | `string` | Your Anyalt API key |
| `inputToken` | `Token` | Source token configuration |
| `finalToken` | `Token` | Destination token configuration |
| `estimateCallback` | `(amountIn: number) => Promise<EstimateResponse>` | Callback to get price estimate |
| `executeCallBack` | `(amountIn: number) => Promise<ExecuteResponse>` | Callback to execute the swap |

### Optional Props

| Prop | Type | Description |
|------|------|-------------|
| `minDepositAmount` | `number` | Minimum amount required for deposit |
| `walletConnector` | `unknown` | Custom wallet connector configuration |
