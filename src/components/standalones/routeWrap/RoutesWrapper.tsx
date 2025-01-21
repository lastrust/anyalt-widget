import { Grid } from '@chakra-ui/react';
import { SelectSwap } from '../swap/SelectSwap';
import { RouteAccordion } from './route/RouteAccordion';

type Props = {
  loading: boolean;
};

export const BestRoutesWrapper = ({ loading }: Props) => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gap="24px">
      <SelectSwap loading={loading} />
      <RouteAccordion />
    </Grid>
  );
};
