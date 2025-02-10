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
      gap="4px"
      maxW="100px"
      {...props}
    >
      <Text color="white" textStyle={'extraBold.3'}>
        {tokenName}
      </Text>
      <Text color="white" textStyle={'regular.3'} opacity={0.4}>
        {subText}
      </Text>
    </Box>
  );
};
