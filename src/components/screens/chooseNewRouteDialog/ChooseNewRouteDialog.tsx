import { Center, Grid, Icon, Text } from '@chakra-ui/react';
import { EstimateResponse } from '../../..';
import { CustomButton } from '../../atoms/buttons/CustomButton';
import { NewRouteIcon } from '../../atoms/icons/NewRouteIcon';
import { ChoosingRouteAccordion } from '../../standalones/accordions/choosingRouteAccordion/ChoosingRouteAccordion';
import { SwappingTemplate } from '../../templates/SwappingTemplate';

type Props = {
  loading: boolean;
  onChooseRouteButtonClick: () => Promise<void>;
};

const ArrowIcon = () => (
  <svg
    width="12"
    height="10"
    viewBox="0 0 12 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 1L11 5M11 5L7 9M11 5L1 5"
      stroke="#999999"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChooseNewRouteDialog = ({
  loading,
  onChooseRouteButtonClick,
}: Props) => {
  return (
    <Grid templateColumns="1fr 1fr" gap="16px" m="24px 0px 16px">
      <SwappingTemplate>
        <Center h="100%" flexDir={'column'} gap={'24px'} textAlign={'center'}>
          <Icon as={NewRouteIcon} />
          <Text textStyle={'heading.1'} color={'brand.text.active'}>
            Refreshed Routes
          </Text>
          <Text
            textStyle={'regular.2'}
            color={'brand.text.secondary.2'}
            opacity={'0.6'}
          >
            Your Onramp transaction took a bit more time than <br /> expected.
            We have updated the routes according to new information.{' '}
          </Text>
          <Text
            textStyle={'bold.2'}
            color={'brand.text.active'}
            opacity={'0.6'}
          >
            Please select preferred route on the right <br />
            to continue your transaction{' '}
            <Icon as={ArrowIcon} display={'inline-block'} />
          </Text>
          <CustomButton
            isLoading={loading}
            onButtonClick={() => onChooseRouteButtonClick()}
          >
            Confirm Route
          </CustomButton>
        </Center>
      </SwappingTemplate>
      <SwappingTemplate withDisclaimer title={'Routes'}>
        <ChoosingRouteAccordion
          loading={loading}
          estimateOutPut={() => Promise.resolve({} as EstimateResponse)}
          failedToFetchRoute={false}
        />
      </SwappingTemplate>
    </Grid>
  );
};
