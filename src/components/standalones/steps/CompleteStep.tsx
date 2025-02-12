import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import {
  finalTokenAmountAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
} from '../../../store/stateStore';
import { ThumbIcon } from '../../atoms/icons/transaction/ThumbIcon';
import { TokenIconBox } from '../../molecules/TokenIconBox';
import { SwappingTemplate } from '../../templates/SwappingTemplate';

type Props = {
  onConfigClick: () => void;
  onClose: () => void;
  setActiveStep: (step: number) => void;
};

export const CompleteStep = ({
  onConfigClick,
  onClose,
  setActiveStep,
}: Props) => {
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
          <Text
            fontSize="24px"
            fontWeight="bold"
            color="brand.text.primary"
            mr="4px"
          >
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
            bg: 'brand.tertiary.90',
          }}
          color="brand.white"
          fontSize="16px"
          fontWeight="bold"
          borderRadius="8px"
          h="64px"
          onClick={() => {
            onClose();
            setActiveStep(0);
          }}
        >
          Done
        </Button>
      </Flex>
    </SwappingTemplate>
  );
};
