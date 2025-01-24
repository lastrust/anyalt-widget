import { Grid } from '@chakra-ui/react';
import { BestRouteAccordion } from '../accordions/BestRouteAccordion';
import { SelectSwap } from '../swap/SelectSwap';

type Props = {
  loading: boolean;
  openSlippageModal: boolean;
  showConnectedWallets?: boolean;
  handleWalletsOpen: () => void;
  buttonText: string;
  hideButton?: boolean;
  onButtonClick: () => void;
  setOpenSlippageModal: (open: boolean) => void;
};

export const RoutesWrapper = ({
  loading,
  openSlippageModal,
  setOpenSlippageModal,
  handleWalletsOpen: connectWalletsOpen,
  showConnectedWallets = false,
  buttonText,
  hideButton,
  onButtonClick,
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
      />
      <BestRouteAccordion />
    </Grid>
  );
};
