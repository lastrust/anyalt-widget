import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import {
  lastMileTokenAmountAtom,
  lastMileTokenAtom,
  swapResultTokenAtom,
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
  const swapResultToken = useAtomValue(swapResultTokenAtom);
  const lastMileToken = useAtomValue(lastMileTokenAtom);
  const lastMileTokenAmount = useAtomValue(lastMileTokenAmountAtom);

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
          color="brand.text.secondary.4"
          textAlign="center"
        >
          You have got
        </Text>
        <Flex flexDirection="row" alignItems="center" mb="64px">
          <TokenIconBox
            tokenName={lastMileToken?.symbol || ''}
            tokenIcon={lastMileToken?.logoUrl || ''}
            chainName={swapResultToken?.chain?.displayName || ''}
            chainIcon={swapResultToken?.chain?.logoUrl || ''}
            mr="8px"
          />
          <Text
            fontSize="24px"
            fontWeight="bold"
            color="brand.text.primary"
            mr="4px"
          >
            {truncateToDecimals(lastMileTokenAmount, 4)}
          </Text>
          <Text fontSize="16px" fontWeight="400" color="brand.text.secondary.4">
            {lastMileToken?.symbol} On {swapResultToken?.chain?.displayName}
          </Text>
        </Flex>
        <Button
          width={'100%'}
          bg="brand.buttons.action.bg"
          _hover={{
            bg: 'brand.buttons.action.hover',
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
