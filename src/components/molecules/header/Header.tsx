import { HStack, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

type Props = {
  activeStep: number;
  customText?: string;
};

export const Header = ({ activeStep, customText }: Props) => {
  if (activeStep === 3) return null;

  const regularText = useMemo(() => {
    if (activeStep === 2) {
      return 'Transaction';
    } else {
      return 'Start Transaction';
    }
  }, [activeStep]);

  return (
    <HStack alignItems={'center'} color="brand.text.primary" gap={'5px'}>
      <Text textStyle={'bold.0'}>{customText ? customText : regularText}</Text>
    </HStack>
  );
};
