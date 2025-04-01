import { GetAllRoutesResponseItem } from '@anyalt/sdk/dist/adapter/api/api';
import { Grid } from '@chakra-ui/react';
import { EstimateResponse, WalletConnector } from '../../..';
import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { ChoosingRouteAccordion } from '../accordions/choosingRouteAccordion/ChoosingRouteAccordion';
import { SelectToken } from '../selectSwap/SelectToken';

type Props = {
  loading: boolean;
  openSlippageModal: boolean;
  failedToFetchRoute: boolean;
  areWalletsConnected: boolean;
  walletConnector?: WalletConnector;
  allRoutes: GetAllRoutesResponseItem[] | undefined;
  onConfigClick: () => void;
  connectWalletsOpen: () => void;
  onChooseRouteButtonClick: () => void;
  setOpenSlippageModal: (open: boolean) => void;
  estimateOutPut: (
    route: GetAllRoutesResponseItem,
  ) => Promise<EstimateResponse>;
};

export const ChoosingRouteStep = ({
  loading,
  allRoutes,
  failedToFetchRoute,
  walletConnector,
  areWalletsConnected,
  onConfigClick,
  estimateOutPut,
  openSlippageModal,
  connectWalletsOpen,
  setOpenSlippageModal,
  onChooseRouteButtonClick,
}: Props) => {
  const buttonText = allRoutes
    ? areWalletsConnected
      ? 'Start Transaction'
      : 'Connect Wallet/s To Start Transaction'
    : 'Get Quote';

  return (
    <Grid gridTemplateColumns="448px 448px" gap="24px">
      <SwappingTemplate title={'Calculation'} onConfigClick={onConfigClick}>
        <SelectToken
          loading={loading}
          buttonText={buttonText}
          onButtonClick={onChooseRouteButtonClick}
          walletConnector={walletConnector}
          openSlippageModal={openSlippageModal}
          handleWalletsOpen={connectWalletsOpen}
          setOpenSlippageModal={setOpenSlippageModal}
          showConnectedWallets={areWalletsConnected}
          failedToFetchRoute={failedToFetchRoute}
        />
      </SwappingTemplate>
      <SwappingTemplate
        withDisclaimer
        title={'Routes'}
        subtitle={
          failedToFetchRoute
            ? 'Please change the amount or token'
            : 'Please select preferred route'
        }
      >
        <ChoosingRouteAccordion
          loading={loading}
          estimateOutPut={estimateOutPut}
          failedToFetchRoute={failedToFetchRoute}
        />
      </SwappingTemplate>
    </Grid>
  );
};
