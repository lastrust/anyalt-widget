import { Box, Text } from '@chakra-ui/react';
import { AnyaltLogo } from '../../atoms/icons/AnyAltLogo';

export const Footer = () => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize="12px" color="#fff6" mr="8px">
        Powered by
      </Text>
      <AnyaltLogo width="84px" height="24px" />
    </Box>
  );
};
