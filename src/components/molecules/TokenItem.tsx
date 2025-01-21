import { Box, BoxProps, Image, Text } from '@chakra-ui/react';
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
    <Box
      display="flex"
      flexDir="row"
      alignItems="center"
      borderBottom="1px solid"
      borderColor="brand.secondary.12"
      pb="8px"
      mb="8px"
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
        <Text color="white" fontSize="20px" fontWeight="bold">
          {tokenSymbol}
        </Text>
        <Text color="white" fontSize="16px" fontWeight="regular" opacity={0.4}>
          {chainName}
        </Text>
      </Box>
    </Box>
  );
};
