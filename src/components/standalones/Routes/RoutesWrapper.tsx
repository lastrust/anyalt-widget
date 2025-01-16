import { Grid } from '@chakra-ui/react';
import { RouteAccordion } from '../Route/RouteAccordion';
import { SelectSwap } from '../SelectSwap/SelectSwap';

type Props = {
  loading: boolean;
};

export const RoutesWrapper = ({ loading }: Props) => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gap="24px">
      <SelectSwap loading={loading} />
      <RouteAccordion />
    </Grid>
  );
};
