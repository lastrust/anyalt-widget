import { BestRouteResponse } from '@anyalt/sdk';
import { WalletConnector } from '../../..';
import { RoutesWrapper } from '../wrappers/RoutesWrapper';
import { SwappingWrapper } from '../wrappers/SwappingWrapper';

type Props = {
  loading: boolean;
  openSlippageModal: boolean;
  failedToFetchRoute: boolean;
  areWalletsConnected: boolean;
  walletConnector?: WalletConnector;
  activeRoute: BestRouteResponse | undefined;
  onConfigClick: () => void;
  connectWalletsOpen: () => void;
  onChooseRouteButtonClick: () => void;
  setOpenSlippageModal: (open: boolean) => void;
};

export const ChoosingRouteStep = ({
  loading,
  activeRoute,
  failedToFetchRoute,
  walletConnector,
  areWalletsConnected,
  onConfigClick,
  openSlippageModal,
  connectWalletsOpen,
  setOpenSlippageModal,
  onChooseRouteButtonClick,
}: Props) => {
  const buttonText = activeRoute
    ? areWalletsConnected
      ? 'Start Transaction'
      : 'Connect Wallet/s To Start Transaction'
    : 'Get Quote';

  return (
    <SwappingWrapper
      title={'Calculation'}
      secondTitle="Routes"
      secondSubtitle="Please select preferred route"
      onConfigClick={onConfigClick}
      failedToFetchRoute={failedToFetchRoute}
    >
      <RoutesWrapper
        loading={loading}
        buttonText={buttonText}
        showConnectedWallets={true}
        walletConnector={walletConnector}
        openSlippageModal={openSlippageModal}
        handleWalletsOpen={connectWalletsOpen}
        onButtonClick={onChooseRouteButtonClick}
        setOpenSlippageModal={setOpenSlippageModal}
      />
    </SwappingWrapper>
  );
};
