import { Box, BoxProps, Image } from '@chakra-ui/react';
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
      <Image
        src={tokenIcon}
        alt={`${tokenName} Icon`}
        marginRight={'8px'}
        width="40px"
        height="40px"
      />
      <Box position="absolute" bottom="0px" left="26px">
        <Image src={chainIcon} alt={`${chainName} Icon`} />
      </Box>
    </Box>
  );
};
