import { Grid } from '@chakra-ui/react';
import { SelectSwap } from '../swap/SelectSwap';
import { RouteAccordion } from './route/RouteAccordion';

type Props = {
  loading: boolean;
  openSlippageModal: boolean;
  setOpenSlippageModal: (open: boolean) => void;
  minAmountIn: number;
};

export const RoutesWrapper = ({
  loading,
  openSlippageModal,
  setOpenSlippageModal,
  minAmountIn,
}: Props) => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gap="24px">
      <SelectSwap
        loading={loading}
        openSlippageModal={openSlippageModal}
        setOpenSlippageModal={setOpenSlippageModal}
        minAmountIn={minAmountIn}
      />
      <RouteAccordion />
    </Grid>
  );
};
