import { Button, HStack, Text } from '@chakra-ui/react';
import { BackIcon } from '../../atoms/icons/transaction/BackIcon';

type Props = {
  activeStep: number;
  onBackClick: () => void;
};

export const Header = ({ activeStep, onBackClick }: Props) => {
  if (activeStep === 3) return null;

  return (
    <HStack alignItems={'center'} color="white" gap={'5px'}>
      {activeStep == 2 && (
        <Button variant="ghost" onClick={onBackClick}>
          <BackIcon />
        </Button>
      )}
      <Text textStyle={'bold.0'}>
        {activeStep === 2 ? 'Transaction' : 'Start Transaction'}
      </Text>
    </HStack>
  );
};
