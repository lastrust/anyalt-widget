import { Box, BoxProps, Text } from '@chakra-ui/react';
import { FC } from 'react';

type Props = BoxProps & {
  tokenName: string;
  chainName: string;
};

export const TokenInfoBox: FC<Props> = ({ tokenName, chainName, ...props }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      gap="4px"
      {...props}
    >
      <Text color="white" fontSize="16px" fontWeight="extrabold">
        {tokenName}
      </Text>
      <Text color="white" fontSize="12px" fontWeight="regular" opacity={0.4}>
        On {chainName}
      </Text>
    </Box>
  );
};
