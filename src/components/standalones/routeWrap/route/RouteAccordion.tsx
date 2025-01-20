import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  VStack,
} from '@chakra-ui/react';
import aarnaIcon from '../../../../assets/imgs/aarna.png';
import { GasIcon } from '../../../atoms/icons/GasIcon';
import { StepsIcon } from '../../../atoms/icons/StepsIcon';
import { TimeIcon } from '../../../atoms/icons/TimeIcon';
import { RouteStep } from '../../../molecules/route/RouteStep';
import { RouteTag } from '../../../molecules/routeTag/RouteTag';
import { TokenRouteInfo } from '../../../molecules/TokenRouteInfo';

export const RouteAccordion = () => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem
        border="1px solid"
        borderColor="border.primary"
        borderRadius={'10px'}
        p={'16px'}
        _hover={{
          bgColor: 'bg.secondary.1',
        }}
      >
        <h2>
          <AccordionButton
            display={'flex'}
            flexDir={'column'}
            justifyContent={'space-between'}
            gap="12px"
            p={'0px'}
          >
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              alignItems={'center'}
              gap="12px"
            >
              <Flex alignItems="center" gap="8px">
                <RouteTag
                  text="Fastest"
                  textColor="brand.secondary.1"
                  bgColor="bg.tertiary.100"
                />
                <RouteTag
                  text="16s"
                  icon={TimeIcon}
                  textColor="brand.tertiary.100"
                />
                <RouteTag
                  text="$13.30"
                  icon={GasIcon}
                  textColor="brand.tertiary.100"
                />
                <RouteTag
                  text="4"
                  icon={StepsIcon}
                  textColor="brand.tertiary.100"
                />
              </Flex>
              <Box
                h={'24px'}
                w={'24px'}
                borderRadius={'50%'}
                bgColor="brand.tertiary.100"
                cursor="pointer"
              >
                <AccordionIcon w={'24px'} h={'24px'} />
              </Box>
            </Flex>
            <TokenRouteInfo
              tokenName="aarna"
              tokenIcon={aarnaIcon}
              amount={10.19}
              price={2423.53}
              difference={0.5}
              network={'aarnâ Afi802 on Ethereum'}
            />
          </AccordionButton>
        </h2>
        <AccordionPanel p={'0px'} mt="12px">
          <VStack gap={'12px'}>
            <RouteStep
              stepNumber={1}
              exchangeIcon={aarnaIcon}
              exchangeName="aarna"
              fromToken={{ name: 'aarna', amount: '10.19' }}
              toToken={{ name: 'aarna', amount: '10.19' }}
            />
            <RouteStep
              stepNumber={2}
              exchangeIcon={aarnaIcon}
              exchangeName="aarna"
              fromToken={{ name: 'aarna', amount: '10.19' }}
              toToken={{ name: 'aarna', amount: '10.19' }}
            />
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
