import { Grid } from '@chakra-ui/react';
import { SelectSwap } from '../swap/SelectSwap';
import { RouteAccordion } from './route/RouteAccordion';

type Props = {
  loading: boolean;
  openSlippageModal: boolean;
  setOpenSlippageModal: (open: boolean) => void;
};

export const RoutesWrapper = ({
  loading,
  openSlippageModal,
  setOpenSlippageModal,
}: Props) => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gap="24px">
      <SelectSwap
        loading={loading}
        openSlippageModal={openSlippageModal}
        setOpenSlippageModal={setOpenSlippageModal}
      />
      <RouteAccordion />
    </Grid>
  );
};
