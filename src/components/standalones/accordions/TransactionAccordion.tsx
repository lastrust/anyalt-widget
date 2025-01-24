import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { activeRouteAtom, selectedRouteAtom } from '../../../store/stateStore';
import { TransactionDetailsType } from '../../../types/transaction';
import { TransactionStep } from '../../molecules/steps/TransactionStep';

type Props = {
  swapIndex: number;
  transactionDetails: TransactionDetailsType[];
};

export const TransactionAccordion = ({
  swapIndex,
  transactionDetails,
}: Props) => {
  const [activeRoute] = useAtom(activeRouteAtom);
  const [selectedRoute, setSelectedRoute] = useAtom(selectedRouteAtom);

  const handleRouteSelect = () => {
    setSelectedRoute(activeRoute);
  };

  return (
    <Accordion
      defaultIndex={[0]}
      allowMultiple
      w={'full'}
      gap={'12px'}
      display={'flex'}
      flexDir={'column'}
    >
      <AccordionItem
        border="1px solid"
        borderColor="brand.border.primary"
        borderRadius={'10px'}
        p={'16px'}
        cursor={'pointer'}
        onClick={handleRouteSelect}
        bg={
          selectedRoute?.swaps[swapIndex].swapperId ===
          activeRoute?.swaps[swapIndex].swapperId
            ? 'brand.secondary.12'
            : 'transparent'
        }
        _hover={{
          bgColor: 'bg.secondary.1',
        }}
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
            <Text textStyle={'bold.0'}>Step {swapIndex + 1}.</Text>
            <Text textStyle={'regular.3'}>
              Required Sings: {transactionDetails[swapIndex].requiredSings}
            </Text>
          </HStack>
          <AccordionIcon w={'24px'} h={'24px'} />
        </AccordionButton>
        <AccordionPanel p={'0px'} mt="12px">
          <VStack gap={'12px'}>
            {transactionDetails.map((step, index) => (
              <TransactionStep
                key={`${step.time}-${index}`}
                stepNumber={index + 1}
                exchangeIcon={step.from.icon || ''}
                exchangeName={step.swapperName}
                fromToken={{
                  name: step.from.name,
                  amount: String(Number(step.from.amount).toFixed(4) || '0'),
                }}
                toToken={{
                  name: step.to.name,
                  amount: String(Number(step.to.amount).toFixed(4) || '0'),
                }}
              />
            ))}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
