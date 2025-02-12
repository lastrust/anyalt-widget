import { HStack, Text } from '@chakra-ui/react';

type Props = {
  activeStep: number;
};

export const Header = ({ activeStep }: Props) => {
  if (activeStep === 3) return null;

  return (
    <HStack alignItems={'center'} color="brand.text.primary" gap={'5px'}>
      <Text textStyle={'bold.0'}>
        {activeStep === 2 ? 'Transaction' : 'Start Transaction'}
      </Text>
    </HStack>
  );
};
