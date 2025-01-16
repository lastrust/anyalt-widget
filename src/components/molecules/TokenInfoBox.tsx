import { Box, BoxProps, Text } from '@chakra-ui/react';
import { FC } from 'react';

type Props = BoxProps & {
  tokenName: string;
  subText: string;
};

export const TokenInfoBox: FC<Props> = ({ tokenName, subText, ...props }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-start"
      gap="7px"
      {...props}
    >
      <Text color="white" fontSize="16px" fontWeight="bold">
        {tokenName}
      </Text>
      <Text color="white" fontSize="12px" fontWeight="regular" opacity={0.4}>
        {subText}
      </Text>
    </Box>
  );
};
