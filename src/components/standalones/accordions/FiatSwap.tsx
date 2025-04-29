import { FiatStep } from '@anyalt/sdk/dist/adapter/api/api';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { selectedTokenOrFiatAmountAtom } from '../../../store/stateStore';
import { truncateToDecimals } from '../../../utils/truncateToDecimals';
import { ArrowRightIcon } from '../../atoms/icons/transaction/ArrowRightIcon';
import { CheckIcon } from '../../atoms/icons/transaction/CheckIcon';

type Props = {
  fiatStep: FiatStep | undefined;
  index: number;
  currentStep: number;
  operationType: 'CURRENT' | 'PENDING';
};

export const FiatSwap = ({
  fiatStep,
  index,
  currentStep,
  operationType,
}: Props) => {
  const inputTokenAmount = useAtomValue(selectedTokenOrFiatAmountAtom);
  if (!fiatStep) return null;

  return (
    <AccordionItem
      key={`${fiatStep.payout}-${index}`}
      p={'16px'}
      bg="brand.text.secondary.3"
      borderRadius={'10px'}
      borderWidth={'3px!important'}
      borderColor={
        currentStep - 1 === index ? 'brand.border.active' : 'transparent'
      }
      w={'100%'}
    >
      <AccordionButton
        display={'flex'}
        flexDir={'row'}
        justifyContent={'space-between'}
        gap="12px"
        p={'0px'}
      >
        <HStack justifyContent={'flex-start'}>
          <Text textStyle={'bold.1'} mr="8px">
            Transaction {index + 1}
          </Text>
          {currentStep - 1 > index &&
            (operationType === 'CURRENT' ? (
              <CheckIcon />
            ) : (
              <Text textStyle={'bold.2'} color="brand.text.highlight">
                Completed
              </Text>
            ))}
        </HStack>
        <Box
          bg="brand.bg.active"
          borderRadius={'50%'}
          w={'24px'}
          h={'24px'}
          color="brand.primary"
        >
          <AccordionIcon
            pt={'2px'}
            w={'24px'}
            h={'24px'}
            color="brand.buttons.accordion.primary"
          />
        </Box>
      </AccordionButton>
      <AccordionPanel p={'0px'} mt="12px">
        <Text textStyle={'regular.1'} color="brand.text.secondary.2">
          Convert fiat to base L1 token
        </Text>
        <VStack gap={'12px'} alignItems={'flex-start'} mt="20px">
          <HStack>
            <Image src={fiatStep.fiat.logo} w="20px" h="20px" />
            <Text color="brand.text.secondary.2" textStyle={'bold.3'}>
              Onramper:
            </Text>
            <HStack>
              <Image src={fiatStep.fiat.logo} w="20px" h="20px" />
              <Text
                color="brand.text.secondary.2"
                fontSize="12px"
                fontWeight="regular"
              >
                {inputTokenAmount}{' '}
                <span style={{ fontSize: '12px' }}>{fiatStep.fiat.code}</span>
              </Text>
            </HStack>
            <Box>
              <ArrowRightIcon />
            </Box>
            <Image src={fiatStep.middleToken.logoUrl} w="20px" h="20px" />
            <Text
              color="brand.text.secondary.2"
              fontSize="12px"
              fontWeight="regular"
            >
              {truncateToDecimals(fiatStep.payout, 3)}{' '}
              {fiatStep.middleToken.symbol} on {fiatStep.middleToken.chainName}
            </Text>
          </HStack>
        </VStack>
      </AccordionPanel>
    </AccordionItem>
  );
};
