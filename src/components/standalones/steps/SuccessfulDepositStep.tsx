import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import {
  finalTokenAmountAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../../../store/stateStore';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { ThumbIcon } from '../../atoms/icons/transaction/ThumbIcon';
import { TokenIconBox } from '../../molecules/TokenIconBox';
import { SwappingTemplate } from '../../templates/SwappingTemplate';

type Props = {
  onConfigClick: () => void;
  onComplete: () => void;
};

export const SuccessfulDepositStep = ({ onConfigClick, onComplete }: Props) => {
  const protocolInputToken = useAtomValue(protocolInputTokenAtom);
  const protocolFinalToken = useAtomValue(protocolFinalTokenAtom);
  const finalTokenAmount = useAtomValue(finalTokenAmountAtom);

  return (
    <SwappingTemplate onConfigClick={onConfigClick}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Box mb="24px">
          <ThumbIcon />
        </Box>
        <Text
          fontSize="32px"
          fontWeight="bold"
          color="brand.text.primary"
          textAlign="center"
          mb="24px"
        >
          You’re all done!
          <br /> Transaction completed!
        </Text>
        <Text
          fontSize="16px"
          fontWeight="400"
          color="brand.secondary.9"
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
          <Text
            fontSize="24px"
            fontWeight="bold"
            color="brand.text.primary"
            mr="4px"
          >
            {truncateToDecimals(finalTokenAmount, 4)}
          </Text>
          <Text fontSize="16px" fontWeight="400" color="brand.secondary.9">
            {protocolFinalToken?.symbol} On{' '}
            {protocolInputToken?.chain?.displayName}
          </Text>
        </Flex>
        <Button
          width={'100%'}
          bg="brand.tertiary.1"
          _hover={{
            bg: 'brand.tertiary.2',
          }}
          color="white"
          fontSize="16px"
          fontWeight="bold"
          borderRadius="8px"
          h="64px"
          onClick={onComplete}
        >
          Done
        </Button>
      </Flex>
    </SwappingTemplate>
  );
};
