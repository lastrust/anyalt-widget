import { Box, BoxProps, Button, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { WarningIcon } from '../atoms/icons/transaction/WarningIcon';

type Props = BoxProps & {
  onClick: () => void;
};

export const TokenAcceptAlert: FC<Props> = ({ onClick, ...props }) => {
  return (
    <Box
      borderRadius="8px"
      bgColor="brand.primary"
      border="1px solid"
      borderColor="brand.border.error"
      padding="12px"
      {...props}
    >
      <Box display="flex" flexDir="row" alignItems="center" gap="8px" mb="8px">
        <WarningIcon />
        <Text color="brand.text.primary" fontSize="16px" fontWeight="bold">
          Warning
        </Text>
      </Box>
      <Text color="brand.text.primary" fontSize="14px" opacity={0.4} mb="12px">
        Anyone can create any token, including fake versions of the existing
        tokens. Take due care. Some tokens and their technical parameters may be
        incompatible with AnyAlt services. By importing this custom token you
        acknowledge and accept the risk.
      </Text>
      <Button
        bg="brand.buttons.action.bg"
        _hover={{
          bg: 'brand.buttons.action.hover',
        }}
        color="white"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        width="99px"
        onClick={onClick}
      >
        Accept
      </Button>
    </Box>
  );
};
