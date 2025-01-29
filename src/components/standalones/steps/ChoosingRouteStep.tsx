import { BestRouteResponse } from '@anyalt/sdk';
import { RoutesWrapper } from '../wrappers/RoutesWrapper';
import { SwappingWrapper } from '../wrappers/SwappingWrapper';

type Props = {
  loading: boolean;
  openSlippageModal: boolean;
  failedToFetchRoute: boolean;
  areWalletsConnected: boolean;
  activeRoute: BestRouteResponse | undefined;
  onConfigClick: () => void;
  connectWalletsOpen: () => void;
  onChooseRouteButtonClick: () => void;
  setOpenSlippageModal: (open: boolean) => void;
};

export const ChoosingRouteStep = ({
  onConfigClick,
  failedToFetchRoute,
  activeRoute,
  areWalletsConnected,
  onChooseRouteButtonClick,
  loading,
  openSlippageModal,
  setOpenSlippageModal,
  connectWalletsOpen,
}: Props) => {
  return (
    <SwappingWrapper
      title={'Calculation'}
      secondTitle="Routes"
      secondSubtitle="Please select preferred route"
      onConfigClick={onConfigClick}
      failedToFetchRoute={failedToFetchRoute}
    >
      <RoutesWrapper
        buttonText={
          activeRoute
            ? areWalletsConnected
              ? 'Start Transaction'
              : 'Connect Wallet/s To Start Transaction'
            : 'Get Quote'
        }
        onButtonClick={onChooseRouteButtonClick}
        loading={loading}
        openSlippageModal={openSlippageModal}
        setOpenSlippageModal={setOpenSlippageModal}
        showConnectedWallets={true}
        handleWalletsOpen={connectWalletsOpen}
      />
    </SwappingWrapper>
  );
};
