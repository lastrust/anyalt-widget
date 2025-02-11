import { Box, BoxProps, Image, SkeletonCircle } from '@chakra-ui/react';
import { FC } from 'react';

type Props = BoxProps & {
  tokenName: string;
  tokenIcon: string;
  chainName: string;
  chainIcon: string;
  w?: string;
  h?: string;
  leftSmallImg?: string;
};

export const TokenIconBox: FC<Props> = ({
  tokenName,
  tokenIcon,
  chainName,
  chainIcon,
  w = '32px',
  h = '32px',
  leftSmallImg = '19px',
  ...props
}) => {
  return (
    <Box position="relative" {...props}>
      {tokenIcon !== '' ? (
        <Image
          src={tokenIcon}
          alt={`${tokenName} Icon`}
          marginRight={'8px'}
          width={w}
          height={h}
          borderRadius="50%"
        />
      ) : (
        <SkeletonCircle size="32px" bgColor="brand.secondary.4" />
      )}
      <Box position="absolute" bottom="0px" left={leftSmallImg}>
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
