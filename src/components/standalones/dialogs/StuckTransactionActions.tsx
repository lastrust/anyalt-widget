import { Box, BoxProps, Button, Flex, Icon, Text } from '@chakra-ui/react';
import { CustomButton } from '../../atoms/buttons/CustomButton';
import { WarningIcon } from '../../atoms/icons/transaction/WarningIcon';
import { TransactionStep } from '../../molecules/steps/TransactionStep';

type Token = {
  name: string;
  amount: string;
  tokenLogo: string;
  chainName: string;
  chainLogo: string;
};

type Props = {
  onUpdateTx: () => void;
  onWaitForTx: () => void;
  onAbandon: () => void;
  mainButtonText: string;
  stuckTxTokens: {
    from: Token;
    to: Token;
  };
} & BoxProps;

export const StuckTransactionActions = ({
  onUpdateTx,
  onWaitForTx,
  onAbandon,
  mainButtonText,
  stuckTxTokens,
}: Props) => {
  return (
    <Flex
      flexDirection="column"
      gap="16px"
      justifyItems={'center'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100%'}
    >
      <Icon my={8} as={WarningIcon} boxSize={12} color="#f9e154" />
      <Flex
        flexDirection="column"
        gap="16px"
        justifyItems={'center'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100%'}
      >
        <Text textAlign={'center'} textStyle={'heading.1'}>
          Transaction Stuck
        </Text>
        <Flex
          justifyItems={'center'}
          alignItems={'center'}
          justifyContent={'center'}
          w={'full'}
        >
          <Text
            textAlign={'center'}
            textStyle={'small.1'}
            textColor="gray"
            mr="12px"
            w="fit-content"
            h="full"
            whiteSpace={'nowrap'}
          >
            <strong>Transaction details:</strong>
          </Text>
          <Box mb="6px">
            <TransactionStep
              justify={'center'}
              fromToken={stuckTxTokens?.from}
              toToken={stuckTxTokens?.to}
            />
          </Box>
        </Flex>
        <Text textAlign={'center'} textStyle={'small.1'} textColor="gray">
          <strong>
            We would recommend you override the previous tranasaction. Should we
            intitate a transaction with higher gas?
          </strong>
        </Text>
      </Flex>

      <CustomButton onButtonClick={onUpdateTx}>{mainButtonText}</CustomButton>
      <Button
        p={'16px 20px'}
        width="100%"
        borderRadius="8px"
        fontSize="16px"
        fontWeight="700"
        lineHeight="120%"
        height={'unset'}
        _hover={{
          bg: 'brand.buttons.outline.hover',
        }}
        borderColor="brand.buttons.outline.border"
        borderWidth="1px"
        background={'none'}
        backdropFilter={'blur(50px)'}
        color={'brand.secondary.1'}
        onClick={onWaitForTx}
      >
        Wait & Keep Current Transaction
      </Button>
      <Flex
        justifyContent={'center'}
        justifyItems={'center'}
        alignContent={'center'}
        alignItems={'center'}
        gap={'8px'}
      >
        <Button
          p={'0'}
          width="100%"
          fontSize="16px"
          fontWeight="700"
          lineHeight="120%"
          height={'unset'}
          borderColor="brand.buttons.outline.border"
          borderBottomWidth="1px"
          borderRadius={0}
          background={'none'}
          backdropFilter={'blur(50px)'}
          color={'brand.secondary.1'}
          onClick={onAbandon}
        >
          Abandon & Start A New Route
        </Button>
      </Flex>
    </Flex>
  );
};
