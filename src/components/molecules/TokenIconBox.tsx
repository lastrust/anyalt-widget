import { Box, BoxProps, Image } from '@chakra-ui/react';
import { FC } from 'react';

type Props = BoxProps & {
  tokenName: string;
  tokenIcon: string;
  chainName: string;
  chainIcon: string;
  w?: string;
  h?: string;
  networkWidth?: string;
  networkHeight?: string;
  leftSmallImg?: string;
};

export const TokenIconBox: FC<Props> = ({
  tokenName,
  tokenIcon,
  chainName,
  chainIcon,
  w = '32px',
  h = '32px',
  networkWidth = '14px',
  networkHeight = '14px',
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
        <Box
          w="32px"
          h="32px"
          borderRadius="50%"
          bgColor="rgba(145,158,171, 0.3)"
        />
      )}
      <Box position="absolute" bottom="0px" left={leftSmallImg}>
        {chainIcon !== '' ? (
          <Image
            src={chainIcon}
            alt={`${chainName} Icon`}
            width={networkWidth}
            height={networkHeight}
            borderRadius="50%"
          />
        ) : (
          <Box w="14px" h="14px" borderRadius="50%" bgColor="#919EAB" />
        )}
      </Box>
    </Box>
  );
};
