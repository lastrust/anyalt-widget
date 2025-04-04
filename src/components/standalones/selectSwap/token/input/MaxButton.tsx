import { Box, Button, Text } from '@chakra-ui/react';
import { truncateToDecimals } from '../../../../../utils/truncateToDecimals';

type Props = {
  balance: string | undefined;
  activeStep: number;
  isWalletConnected: boolean;
  maxButtonClick: () => void;
};

export const MaxButton = ({
  balance,
  activeStep,
  isWalletConnected,
  maxButtonClick,
}: Props) => {
  return (
    <Box
      display={activeStep === 1 && isWalletConnected ? 'flex' : 'none'}
      flexDirection="row"
      alignItems="center"
      gap="4px"
    >
      <Text color={'brand.text.secondary.2'} textStyle={'bold.3'} opacity={0.4}>
        Balance: {balance ? truncateToDecimals(balance, 6) : ''}
      </Text>
      <Button
        bg="brand.buttons.action.bgFaded"
        color="brand.text.active"
        fontSize="12px"
        fontWeight="bold"
        borderRadius="4px"
        padding="4px 2px"
        maxH="16px"
        onClick={maxButtonClick}
        isDisabled={!isWalletConnected}
      >
        Max
      </Button>
    </Box>
  );
};
