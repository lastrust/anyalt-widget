import {
  GetAllRoutesResponseItem,
  SupportedToken,
} from '@anyalt/sdk/dist/adapter/api/api';
import {
  AccordionButton,
  AccordionIcon,
  Box,
  BoxProps,
  Divider,
  Flex,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { EstimateResponse, Token } from '../../../..';
import { truncateToDecimals } from '../../../../utils/truncateToDecimals';
import { GasIcon } from '../../../atoms/icons/GasIcon';
import { StepsIcon } from '../../../atoms/icons/StepsIcon';
import { TimeIcon } from '../../../atoms/icons/TimeIcon';
import { RouteTag } from '../../../molecules/routeTag/RouteTag';
import { TokenRouteInfo } from '../../../molecules/TokenRouteInfo';
import { RouteTags } from './RouteTags';

type Props = {
  loading: boolean;
  slippage: string;
  widgetTemplate: string;
  route: GetAllRoutesResponseItem;
  protocolInputToken: SupportedToken | undefined;
  protocolFinalToken: Token | undefined;
  calcTokenPrice: (route: GetAllRoutesResponseItem) => string;
  calcFees: (route: GetAllRoutesResponseItem) => string;
  finalTokenEstimate: EstimateResponse | undefined;
  routeEstimates: Record<string, EstimateResponse> | undefined;
};

type AccordionCloseButtonProps = BoxProps;

const AccordionCloseButton = ({ ...props }: AccordionCloseButtonProps) => (
  <Box
    h={'24px'}
    w={'24px'}
    borderRadius={'50%'}
    bgColor="brand.bg.active"
    cursor="pointer"
    {...props}
  >
    <AccordionIcon w={'24px'} h={'24px'} color="brand.text.secondary.0" />
  </Box>
);

export const RouteHeader = ({
  route,
  loading,
  slippage,
  widgetTemplate,
  protocolInputToken,
  protocolFinalToken,
  finalTokenEstimate,
  routeEstimates,
  calcTokenPrice,
  calcFees,
}: Props) => {
  const isTagsPresented = useMemo(() => {
    return route.tags.length > 0 || route.isExecutable;
  }, [route]);

  return (
    <AccordionButton
      display={'flex'}
      flexDir={'column'}
      justifyContent={'space-between'}
      gap="8px"
      p={'0px'}
      w={'100%'}
      _hover={{
        bgColor: 'transparent',
      }}
    >
      {isTagsPresented && (
        <>
          <Flex w={'full'} justifyContent={'space-between'}>
            <RouteTags loading={loading} route={route} />
            <AccordionCloseButton ml={'5px'} />
          </Flex>

          <Divider bg="rgba(51, 51, 51, 0.20)" m="0px" />
        </>
      )}

      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems={'center'}
        gap="12px"
        w={'100%'}
      >
        <Flex alignItems="center" gap="8px" w={'100%'}>
          <RouteTag
            loading={loading}
            text={`${route.swapSteps.reduce((acc, swap) => acc + swap.estimatedTimeInSeconds, 0 + Number(finalTokenEstimate?.estimatedTimeInSeconds ?? 0)) || finalTokenEstimate?.estimatedTimeInSeconds}s`}
            icon={TimeIcon}
            textColor="brand.tags.route"
            bgColor="transparent"
          />
          <RouteTag
            loading={loading}
            text={calcFees(route)}
            icon={GasIcon}
            textColor="brand.tags.route"
            bgColor="transparent"
          />
          <RouteTag
            loading={loading}
            text={`${route.swapSteps.length + Number(widgetTemplate === 'DEPOSIT_TOKEN')}`}
            icon={StepsIcon}
            textColor="brand.tags.route"
            bgColor="transparent"
          />
        </Flex>
        {!isTagsPresented && <AccordionCloseButton />}
      </Flex>
      <TokenRouteInfo
        loading={loading}
        chainIcon={
          widgetTemplate === 'TOKEN_BUY'
            ? protocolInputToken?.chain?.logoUrl || ''
            : protocolInputToken?.chain?.logoUrl || ''
        }
        tokenName={
          widgetTemplate === 'TOKEN_BUY'
            ? protocolInputToken?.name || ''
            : protocolFinalToken?.name || ''
        }
        tokenIcon={
          widgetTemplate === 'TOKEN_BUY'
            ? protocolInputToken?.logoUrl || ''
            : protocolFinalToken?.logoUrl || ''
        }
        amount={
          widgetTemplate === 'TOKEN_BUY'
            ? route?.outputAmount || ''
            : truncateToDecimals(
                routeEstimates?.[route.routeId]?.amountOut ?? '0.00',
                4,
              )
        }
        price={
          widgetTemplate === 'TOKEN_BUY'
            ? calcTokenPrice(route)
            : truncateToDecimals(
                routeEstimates?.[route.routeId]?.priceInUSD ?? '0.00',
                4,
              )
        }
        slippage={slippage}
        network={
          widgetTemplate === 'TOKEN_BUY'
            ? `${protocolInputToken?.name} on ${protocolInputToken?.chain?.displayName}`
            : route.swapSteps[0]?.swapperName
        }
        borderRadius={'8px'}
      />
    </AccordionButton>
  );
};
