import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const Header = ({ children }: Props) => {
  return (
    <Box color="white" fontSize="24px" fontWeight="bold">
      {children}
    </Box>
  );
};
