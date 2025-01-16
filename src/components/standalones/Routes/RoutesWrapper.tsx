import { Grid } from '@chakra-ui/react';
import { SelectSwap } from '../SelectSwap/SelectSwap';

type Props = {
  loading: boolean;
};

export const RoutesWrapper = ({ loading }: Props) => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gap="24px">
      <SelectSwap loading={loading} />
      <div>RoutesWrapper</div>;
    </Grid>
  );
};
