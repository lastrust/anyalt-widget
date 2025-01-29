import { Box, Button } from '@chakra-ui/react';
import { BackIcon } from '../../atoms/icons/transaction/BackIcon';

type Props = {
  activeStep: number;
  onBackClick: () => void;
};

export const Header = ({ activeStep, onBackClick }: Props) => {
  if (activeStep === 3) return null;

  return (
    <Box color="white" fontSize="24px" fontWeight="bold">
      {activeStep !== 0 && (
        <Button variant="ghost" onClick={onBackClick}>
          <BackIcon />
        </Button>
      )}
      {activeStep === 2 ? 'Transaction' : 'Start Transaction'}
    </Box>
  );
};
