import { Box, BoxProps, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { TokenIconBox } from '../molecules/TokenIconBox';
import { TokenInfoBox } from '../molecules/TokenInfoBox';

type Props = {
  headerText: string;
  tokenName: string;
  tokenLogo: string;
  chainName: string;
  chainLogo: string;
  amount: number;
  price: number;
} & BoxProps;

export const TokenQuoteBox: FC<Props> = ({
  headerText,
  tokenName,
  tokenLogo,
  chainName,
  chainLogo,
  amount,
  price,
  ...props
}) => {
  return (
    <Box padding="4px 16px" {...props}>
      <Box mb="12px">
        <Text color="white" fontSize="14px" fontWeight="bold" opacity={0.32}>
          {headerText}
        </Text>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Box display="flex" flexDirection="row" alignItems="center" >
          <TokenIconBox
            tokenName={tokenName}
            tokenIcon={tokenLogo}
            chainName={chainName}
            chainIcon={chainLogo}
            mr="8px"
          />
          <TokenInfoBox tokenName={tokenName} chainName={chainName} mr="12px" />
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Text fontSize="24px" fontWeight="bold">
            {amount}
          </Text>
          <Text fontSize="12px" fontWeight="regular" opacity={0.4}>
            ~${price}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
