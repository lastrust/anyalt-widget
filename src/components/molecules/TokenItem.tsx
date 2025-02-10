import { Box, BoxProps, Divider, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';

type Props = BoxProps & {
  tokenSymbol: string;
  tokenIcon: string;
  chainName: string;
  onClick: () => void;
};

export const TokenItem: FC<Props> = ({
  tokenSymbol,
  tokenIcon,
  chainName,
  onClick,
  ...props
}) => {
  return (
    <>
      <Box
        display="flex"
        flexDir="row"
        alignItems="center"
        pb="8px"
        gap="16px"
        _last={{
          borderBottom: 'none',
        }}
        cursor="pointer"
        _hover={{
          bgColor: 'brand.secondary.4',
        }}
        onClick={onClick}
        {...props}
      >
        <Image
          src={tokenIcon}
          alt={tokenSymbol}
          width="32px"
          height="32px"
          borderRadius="50%"
        />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="flex-start"
          gap="6px"
        >
          <Text color="white" textStyle="bold.0">
            {tokenSymbol}
          </Text>
          <Text color="white" textStyle={'regular.1'} opacity={0.4}>
            {chainName}
          </Text>
        </Box>
      </Box>
      <Divider w="100%" h="1px" bgColor="brand.secondary.12" my="8px" />
    </>
  );
};
