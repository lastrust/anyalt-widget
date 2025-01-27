import { Grid } from '@chakra-ui/react';
import { BestRouteAccordion } from '../accordions/BestRouteAccordion';
import { SelectSwap } from '../swap/SelectSwap';

type Props = {
  loading: boolean;
  buttonText: string;
  hideButton?: boolean;
  openSlippageModal: boolean;
  showConnectedWallets?: boolean;
  onButtonClick: () => void;
  handleWalletsOpen: () => void;
  setOpenSlippageModal: (open: boolean) => void;
};

export const RoutesWrapper = ({
  loading,
  buttonText,
  showConnectedWallets = false,
  hideButton,
  onButtonClick,
  openSlippageModal,
  setOpenSlippageModal,
  handleWalletsOpen: connectWalletsOpen,
}: Props) => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gap="24px">
      <SelectSwap
        buttonText={buttonText}
        hideButton={hideButton}
        onButtonClick={onButtonClick}
        loading={loading}
        openSlippageModal={openSlippageModal}
        setOpenSlippageModal={setOpenSlippageModal}
        showConnectedWallets={showConnectedWallets}
        handleWalletsOpen={connectWalletsOpen}
        isTokenInputReadonly={true}
      />
      <BestRouteAccordion />
    </Grid>
  );
};
