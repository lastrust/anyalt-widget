import { Box, BoxProps, Skeleton, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { TokenIconBox } from '../../../../molecules/TokenIconBox';
import { TokenInfoBox } from '../../../../molecules/TokenInfoBox';

type Props = {
  loading: boolean;
  headerText: string;
  tokenName: string;
  tokenLogo: string;
  chainName: string;
  chainLogo: string;
  amount: string;
  price: string;
} & BoxProps;

export const TokenQuoteBox: FC<Props> = ({
  loading,
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
      {headerText && (
        <Box mb="16px">
          <Text color="white" fontSize="14px" fontWeight="bold" opacity={0.32}>
            {headerText}
          </Text>
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Box display="flex" flexDirection="row" alignItems="center">
          <TokenIconBox
            tokenName={tokenName}
            tokenIcon={tokenLogo}
            chainName={chainName}
            chainIcon={chainLogo}
            mr="8px"
          />
          <TokenInfoBox
            tokenName={tokenName}
            subText={`On ${chainName}`}
            mr="12px"
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          gap={'2px'}
        >
          {loading ? (
            <Skeleton width="70px" height="19px" borderRadius="32px" />
          ) : (
            <Text fontSize="24px" fontWeight="bold">
              {amount}
            </Text>
          )}
          {loading ? (
            <Skeleton width="34px" height="14px" borderRadius="32px" />
          ) : (
            <Text fontSize="12px" fontWeight="regular" opacity={0.4}>
              ~${price || '0.00'}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};
