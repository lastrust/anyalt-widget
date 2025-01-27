import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { FC } from 'react';
import {
  finalTokenAmountAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../../../store/stateStore';
import { getImageURL } from '../../../utils';
import { TokenIconBox } from '../../molecules/TokenIconBox';

type Props = {
  onTransactionDoneClick: () => void;
};

export const TransactionComplete: FC<Props> = ({ onTransactionDoneClick }) => {
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenAmount = useAtomValue(finalTokenAmountAtom);

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Image
        src={getImageURL('thumb-icon.svg')}
        alt="thumb-icon"
        width="64px"
        height="64px"
        mb="24px"
      />
      <Text
        fontSize="32px"
        fontWeight="bold"
        color="brand.white"
        textAlign="center"
        mb="24px"
      >
        You’re all done!
        <br /> Transaction completed!
      </Text>
      <Text
        fontSize="16px"
        fontWeight="400"
        color="brand.secondary.100"
        textAlign="center"
      >
        You have got
      </Text>
      <Flex flexDirection="row" alignItems="center" mb="64px">
        <TokenIconBox
          tokenName={protocolFinalToken?.symbol || ''}
          tokenIcon={protocolFinalToken?.logoUrl || ''}
          chainName={protocolInputToken?.chain?.displayName || ''}
          chainIcon={protocolInputToken?.chain?.logoUrl || ''}
          mr="8px"
        />
        <Text fontSize="24px" fontWeight="bold" color="brand.white" mr="4px">
          {finalTokenAmount}
        </Text>
        <Text fontSize="16px" fontWeight="400" color="brand.secondary.100">
          {protocolFinalToken?.symbol} On{' '}
          {protocolInputToken?.chain?.displayName}
        </Text>
      </Flex>
      <Button
        width={'100%'}
        bg="brand.tertiary.100"
        _hover={{
          bg: 'brand.tertiary.20',
        }}
        color="brand.white"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        h="64px"
        onClick={onTransactionDoneClick}
      >
        Done
      </Button>
    </Flex>
  );
};
