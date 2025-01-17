import { Grid } from '@chakra-ui/react';
import { SelectSwap } from '../selectSwap/SelectSwap';
import { RouteAccordion } from './route/RouteAccordion';

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
