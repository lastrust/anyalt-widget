import { Box, Button, Grid, Image, Text } from '@chakra-ui/react';
import configIcon from '../../../assets/imgs/config-icon.svg';
import { RoutesWrapper } from '../../standalones/Routes/RoutesWrapper';
import { SelectSwap } from '../../standalones/SelectSwap/SelectSwap';
import CustomStepper from '../../standalones/stepper/Stepper';

type Props = {
  title: string;
  loading: boolean;
  buttonText: string;
  onButtonClick: () => void;
  activeStep: number;
};

export const SwappingWrapper = ({
  title,
  loading,
  buttonText,
  onButtonClick,
  activeStep,
}: Props) => {
  return (
    <Box
      margin="24px 0px"
      padding="24px"
      border="1px solid"
      borderColor="brand.secondary.12"
      borderRadius="12px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="16px"
      >
        <Text color="white" fontSize="24px" fontWeight="bold">
          {title}
        </Text>
        <Box cursor="pointer">
          <Image src={configIcon} alt="config" />
        </Box>
      </Box>

      <CustomStepper activeStep={activeStep}>
        <SelectSwap loading={loading} />
        <Grid gridTemplateColumns="1fr 1fr" gap="24px">
          <SelectSwap loading={loading} />
          <RoutesWrapper />
        </Grid>
      </CustomStepper>

      <Button
        width="100%"
        bg="brand.tertiary.100"
        color="white"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        h="64px"
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </Box>
  );
};
