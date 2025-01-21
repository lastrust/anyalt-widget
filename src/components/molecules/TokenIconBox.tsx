import { Box, BoxProps, Image, SkeletonCircle } from '@chakra-ui/react';
import { FC } from 'react';

type Props = BoxProps & {
  tokenName: string;
  tokenIcon: string;
  chainName: string;
  chainIcon: string;
};

export const TokenIconBox: FC<Props> = ({
  tokenName,
  tokenIcon,
  chainName,
  chainIcon,
  ...props
}) => {
  return (
    <Box position="relative" {...props}>
      {tokenIcon !== '' ? (
        <Image
          src={tokenIcon}
          alt={`${tokenName} Icon`}
          marginRight={'8px'}
          width="32px"
          height="32px"
          borderRadius="50%"
        />
      ) : (
        <SkeletonCircle size="32px" bgColor="brand.secondary.4" />
      )}
      <Box position="absolute" bottom="0px" left="19px">
        {chainIcon !== '' ? (
          <Image
            src={chainIcon}
            alt={`${chainName} Icon`}
            width="14px"
            height="14px"
            borderRadius="50%"
          />
        ) : (
          <SkeletonCircle size="14px" bgColor="brand.secondary.100" />
        )}
      </Box>
    </Box>
  );
};
