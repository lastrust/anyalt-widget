import { WalletConnector } from '../../..';
import { SelectSwap } from '../swap/SelectSwap';

type Props = {
  loading: boolean;
  buttonText: string;
  openSlippageModal: boolean;
  showConnectedWallets?: boolean;
  failedToFetchRoute: boolean;
  walletConnector?: WalletConnector;
  onButtonClick: () => void;
  handleWalletsOpen: () => void;
  setOpenSlippageModal: (open: boolean) => void;
};

export const RoutesWrapper = ({
  loading,
  buttonText,
  walletConnector,
  onButtonClick,
  openSlippageModal,
  setOpenSlippageModal,
  showConnectedWallets = false,
  failedToFetchRoute,
  handleWalletsOpen: connectWalletsOpen,
}: Props) => {
  return (
    <SelectSwap
      loading={loading}
      buttonText={buttonText}
      onButtonClick={onButtonClick}
      walletConnector={walletConnector}
      openSlippageModal={openSlippageModal}
      handleWalletsOpen={connectWalletsOpen}
      setOpenSlippageModal={setOpenSlippageModal}
      showConnectedWallets={showConnectedWallets}
      failedToFetchRoute={failedToFetchRoute}
    />
  );
};
