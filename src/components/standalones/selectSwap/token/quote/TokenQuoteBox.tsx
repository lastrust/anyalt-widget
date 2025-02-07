import { Box, BoxProps, Skeleton, Text, VStack } from '@chakra-ui/react';
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
    <VStack
      gap={'12px'}
      alignItems={'flex-start'}
      padding="0px 16px"
      w={'full'}
      {...props}
    >
      {headerText && (
        <Box>
          <Text textStyle={'bold.5'} color="brand.secondary.3">
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
            <Skeleton
              width="70px"
              height="25px"
              borderRadius="10px"
              mb="10px"
            />
          ) : (
            <Text fontSize="24px" fontWeight="bold">
              {amount}
            </Text>
          )}
          {loading ? (
            <Skeleton width="34px" height="18px" borderRadius="10px" />
          ) : (
            <Text fontSize="12px" fontWeight="regular" opacity={0.4}>
              ~${price || '0.00'}
            </Text>
          )}
        </Box>
      </Box>
    </VStack>
  );
};
