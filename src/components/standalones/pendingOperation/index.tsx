import { BestRouteResponse } from '@anyalt/sdk';
import { Grid } from '@chakra-ui/react';
import { Token } from '../../..';
import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { TransactionList } from '../transaction/transactionList/TransactionsList';
import { Actions } from './Actions';

type Props = {
  pendingOperation: BestRouteResponse;
  destinationToken: Token;
};

export const PendingOperation = ({
  pendingOperation,
  destinationToken,
}: Props) => {
  return (
    <Grid templateColumns="1fr 1fr" gap="16px" m="24px 0px 16px">
      <SwappingTemplate m="0" h="100%" maxH={'520px'} overflow={'scroll'}>
        <Actions
          onContinuePendingOperation={() => ({})}
          onDismissPendingOperation={() => ({})}
          pendingOperation={pendingOperation}
          destinationToken={destinationToken}
        />
      </SwappingTemplate>
      <SwappingTemplate m="0" maxH={'520px'} overflow={'scroll'}>
        <TransactionList />
      </SwappingTemplate>
    </Grid>
  );
};
