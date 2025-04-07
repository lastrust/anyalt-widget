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
      maxW="120px"
      {...props}
    >
      <Text
        color="brand.text.primary"
        textStyle={'extraBold.3'}
        whiteSpace={'nowrap'}
      >
        {tokenName}
      </Text>
      {subText && (
        <Text color="brand.text.primary" textStyle={'regular.3'} opacity={0.4}>
          {subText}
        </Text>
      )}
    </Box>
  );
};
