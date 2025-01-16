import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { ElementType } from 'react';
import aarnaIcon from '../../../assets/imgs/aarna.png';
import { TokenRouteInfo } from '../../molecules/TokenRouteInfo';

type RouteTagProps = {
  text: string;
  textColor?: string;
  bgColor?: string;
  icon?: ElementType;
};

const RouteTag = ({ text, icon, textColor, bgColor }: RouteTagProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="4px"
      p="7px 12px"
      borderRadius={'32px'}
      bgColor={bgColor}
      border="1px solid #008080"
    >
      {icon && <Icon as={icon} w={'14px'} h={'14px'} />}
      <Text
        fontSize="14px"
        fontWeight="bold"
        color={textColor}
        lineHeight={'16px'}
      >
        {text}
      </Text>
    </Box>
  );
};

const TimeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M12.8337 7.00033C12.8337 10.222 10.222 12.8337 7.00033 12.8337C3.77866 12.8337 1.16699 10.222 1.16699 7.00033C1.16699 3.77866 3.77866 1.16699 7.00033 1.16699C10.222 1.16699 12.8337 3.77866 12.8337 7.00033Z"
        fill="#008080"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.00033 4.22949C7.24195 4.22949 7.43783 4.42537 7.43783 4.66699V6.81911L8.76802 8.1493C8.93887 8.32015 8.93887 8.59716 8.76802 8.76802C8.59716 8.93887 8.32015 8.93887 8.1493 8.76802L6.69097 7.30968C6.60892 7.22764 6.56283 7.11636 6.56283 7.00033V4.66699C6.56283 4.42537 6.7587 4.22949 7.00033 4.22949Z"
        fill="#121212"
      />
    </svg>
  );
};

const GasIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.83366 1.16699H5.25033C3.60041 1.16699 2.77545 1.16699 2.26289 1.67956C1.75033 2.19212 1.75033 3.01708 1.75033 4.66699V12.3962H1.16699C0.925368 12.3962 0.729492 12.592 0.729492 12.8337C0.729492 13.0753 0.925368 13.2712 1.16699 13.2712H10.0628C10.3045 13.2712 10.5003 13.0753 10.5003 12.8337C10.5003 12.592 10.3045 12.3962 10.0628 12.3962H9.33366V10.3545H10.2503C10.4689 10.3545 10.6462 10.5317 10.6462 10.7503V10.792C10.6462 11.5169 11.2338 12.1045 11.9587 12.1045C12.6835 12.1045 13.2712 11.5169 13.2712 10.792V4.43469C13.2712 4.34331 13.2712 4.28025 13.2677 4.21876C13.2352 3.64069 12.9749 3.09907 12.5438 2.7126C12.498 2.6715 12.4487 2.63211 12.3774 2.57503L11.6486 1.99204C11.46 1.8411 11.1846 1.87169 11.0337 2.06037C10.8828 2.24905 10.9133 2.52436 11.102 2.67531L11.8213 3.25074C11.9056 3.31817 11.9345 3.34147 11.9598 3.36414C12.2184 3.59602 12.3746 3.92099 12.3941 4.26783C12.396 4.30173 12.3962 4.33883 12.3962 4.44677V4.66699H11.9587C11.4754 4.66699 11.0837 5.05874 11.0837 5.54199V6.95299C11.0837 7.32962 11.3247 7.66399 11.682 7.78309L12.3962 8.02116V10.792C12.3962 11.0336 12.2003 11.2295 11.9587 11.2295C11.717 11.2295 11.5212 11.0336 11.5212 10.792V10.7503C11.5212 10.0485 10.9522 9.47951 10.2503 9.47951H9.33366V4.66699C9.33366 3.01708 9.33366 2.19212 8.8211 1.67956C8.30853 1.16699 7.48357 1.16699 5.83366 1.16699ZM5.76708 5.45851C5.97428 5.58282 6.04146 5.85156 5.91715 6.05875L5.4397 6.85449H6.41699C6.57461 6.85449 6.72005 6.93928 6.79771 7.07644C6.87536 7.2136 6.87324 7.38193 6.79215 7.51708L5.91715 8.97542C5.79283 9.18261 5.52409 9.24979 5.3169 9.12548C5.10971 9.00116 5.04252 8.73242 5.16684 8.52523L5.64428 7.72949H4.66699C4.50937 7.72949 4.36394 7.64471 4.28628 7.50755C4.20862 7.37039 4.21074 7.20206 4.29184 7.0669L5.16684 5.60857C5.29115 5.40138 5.55989 5.33419 5.76708 5.45851Z"
        fill="#008080"
      />
    </svg>
  );
};

const StepsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M7 7C6.63168 7 6.26336 6.93465 5.97625 6.80395L1.92937 4.95852C1.74426 4.8743 1.3125 4.62793 1.3125 4.16281C1.3125 3.6977 1.74426 3.45187 1.92992 3.36656L6.0118 1.50527C6.57426 1.24824 7.42301 1.24824 7.98574 1.50527L12.0701 3.36656C12.2557 3.45105 12.6875 3.69742 12.6875 4.16281C12.6875 4.6282 12.2557 4.87375 12.0701 4.95879L8.0232 6.80395C7.73664 6.93465 7.36832 7 7 7Z"
        fill="#008080"
      />
      <path
        d="M12.0684 6.20184L11.6558 6.01562L10.5957 6.5007L8.02539 7.67648C7.73828 7.80773 7.36914 7.87309 7.00164 7.87309C6.63414 7.87309 6.26527 7.80773 5.97844 7.67648L3.40621 6.5007L2.34582 6.01562L1.92965 6.20266C1.74426 6.28715 1.3125 6.53516 1.3125 7C1.3125 7.46484 1.74426 7.71313 1.92937 7.79762L5.97625 9.64687C6.26172 9.77812 6.63059 9.84375 7 9.84375C7.36941 9.84375 7.73664 9.77813 8.02375 9.64715L12.0671 7.79844C12.2533 7.71395 12.6875 7.4673 12.6875 7C12.6875 6.5327 12.2563 6.28715 12.0684 6.20184Z"
        fill="#008080"
      />
      <path
        d="M12.0684 9.04531L11.6558 8.85938L10.5957 9.34418L8.02539 10.5186C7.73828 10.6493 7.36914 10.7149 7.00164 10.7149C6.63414 10.7149 6.26527 10.6496 5.97844 10.5186L3.40621 9.34281L2.34582 8.85938L1.92965 9.04641C1.74426 9.1309 1.3125 9.37891 1.3125 9.84375C1.3125 10.3086 1.74426 10.5566 1.92937 10.6408L5.97625 12.489C6.26172 12.6197 6.63195 12.6875 7 12.6875C7.36805 12.6875 7.735 12.6197 8.02211 12.4887L12.0668 10.6411C12.2533 10.5569 12.6875 10.3102 12.6875 9.84375C12.6875 9.37727 12.2563 9.1309 12.0684 9.04531Z"
        fill="#008080"
      />
    </svg>
  );
};

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
        <AccordionPanel p={'0px'}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
