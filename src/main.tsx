import React from "react";
import ReactDOM from "react-dom/client";
import AnyaltWidget, { ChainType } from "./AnyaltWidget";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AnyaltWidget
      logo="test"
      walletConnector={{}}
      inputToken={{
        address: "0x123",
        chainId: 1,
        chainType: ChainType.EVM,
      }}
    />
  </React.StrictMode>
);
