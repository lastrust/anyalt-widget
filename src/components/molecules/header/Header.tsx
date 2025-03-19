import { HStack, Text } from '@chakra-ui/react';

type Props = {
  activeStep: number;
  showPendingOperationDialog: boolean;
};

export const Header = ({ activeStep, showPendingOperationDialog }: Props) => {
  if (activeStep === 3) return null;

  return (
    <HStack alignItems={'center'} color="brand.text.primary" gap={'5px'}>
      <Text textStyle={'bold.0'}>
        {activeStep === 2 || showPendingOperationDialog
          ? 'Transaction'
          : 'Start Transaction'}
      </Text>
    </HStack>
  );
};
