import { BestRouteResponse } from '@anyalt/sdk';
import { Grid } from '@chakra-ui/react';
import { WalletConnector } from '../../..';
import { BestRouteAccordion } from '../accordions/BestRouteAccordion';
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
    <Grid gridTemplateColumns="448px 448px" gap="24px">
      <SwappingWrapper title={'Calculation'} onConfigClick={onConfigClick}>
        <RoutesWrapper
          loading={loading}
          buttonText={buttonText}
          showConnectedWallets={true}
          walletConnector={walletConnector}
          openSlippageModal={openSlippageModal}
          handleWalletsOpen={connectWalletsOpen}
          onButtonClick={onChooseRouteButtonClick}
          setOpenSlippageModal={setOpenSlippageModal}
          failedToFetchRoute={failedToFetchRoute}
        />
      </SwappingWrapper>
      <SwappingWrapper
        title={'Routes'}
        subtitle="Please select preferred route"
      >
        <BestRouteAccordion />
      </SwappingWrapper>
    </Grid>
  );
};
