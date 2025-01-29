import { Grid } from '@chakra-ui/react';
import { WalletConnector } from '../../..';
import { BestRouteAccordion } from '../accordions/BestRouteAccordion';
import { SelectSwap } from '../swap/SelectSwap';

type Props = {
  loading: boolean;
  buttonText: string;
  hideButton?: boolean;
  openSlippageModal: boolean;
  showConnectedWallets?: boolean;
  failedToFetchRoute: boolean;
  onButtonClick: () => void;
  walletConnector?: WalletConnector;
  handleWalletsOpen: () => void;
  setOpenSlippageModal: (open: boolean) => void;
};

export const RoutesWrapper = ({
  loading,
  buttonText,
  hideButton,
  walletConnector,
  onButtonClick,
  openSlippageModal,
  setOpenSlippageModal,
  showConnectedWallets = false,
  failedToFetchRoute,
  handleWalletsOpen: connectWalletsOpen,
}: Props) => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gap="24px">
      <SelectSwap
        loading={loading}
        isTokenInputReadonly
        buttonText={buttonText}
        hideButton={hideButton}
        onButtonClick={onButtonClick}
        walletConnector={walletConnector}
        openSlippageModal={openSlippageModal}
        handleWalletsOpen={connectWalletsOpen}
        setOpenSlippageModal={setOpenSlippageModal}
        showConnectedWallets={showConnectedWallets}
        failedToFetchRoute={failedToFetchRoute}
      />
      <BestRouteAccordion />
    </Grid>
  );
};
