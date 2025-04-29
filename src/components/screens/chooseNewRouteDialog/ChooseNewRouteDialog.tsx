import { Center, Grid, Text } from '@chakra-ui/react';
import { EstimateResponse } from '../../..';
import { CustomButton } from '../../atoms/buttons/CustomButton';
import { ChoosingRouteAccordion } from '../../standalones/accordions/choosingRouteAccordion/ChoosingRouteAccordion';
import { SwappingTemplate } from '../../templates/SwappingTemplate';

type Props = {
  loading: boolean;
  onChooseRouteButtonClick: () => Promise<void>;
};

export const ChooseNewRouteDialog = ({
  loading,
  onChooseRouteButtonClick,
}: Props) => {
  return (
    <Grid templateColumns="1fr 1fr" gap="16px" m="24px 0px 16px">
      <SwappingTemplate>
        <Center h="100%" flexDir={'column'} gap={'16px'} textAlign={'center'}>
          <Text textStyle={'heading.1'}>Refreshed Routes</Text>
          <Text textStyle={'regular.2'}>
            Your Onramp transaction took a bit more time than <br /> expected.
            We have updated the routes according to new information.{' '}
          </Text>
          <Text textStyle={'regular.2'}>
            Please select preferred route on the right <br />
            to continue your transaction
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
