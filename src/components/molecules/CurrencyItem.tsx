import { Box, BoxProps, Divider, Image, Text } from '@chakra-ui/react';
import { FC } from 'react';

type Props = BoxProps & {
  tokenSymbol: string;
  tokenIcon: string;
  onClick: () => void;
};

export const CurrencyItem: FC<Props> = ({
  tokenSymbol,
  tokenIcon,
  onClick,
  ...props
}) => {
  return (
    <>
      <Box
        py="8px"
        gap="16px"
        display="flex"
        flexDir="row"
        alignItems="center"
        cursor="pointer"
        borderRadius={'8px'}
        _last={{
          borderBottom: 'none',
        }}
        _hover={{
          bgColor: 'brand.bg.card',
        }}
        px="8px"
        onClick={onClick}
        {...props}
      >
        <Image
          src={tokenIcon}
          alt={tokenSymbol}
          width="32px"
          height="32px"
          borderRadius="50%"
          loading="lazy"
        />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="flex-start"
          gap="6px"
          width="100%"
          marginX="6px"
        >
          <Text color="brand.text.primary" textStyle="bold.0">
            {tokenSymbol}
          </Text>
        </Box>
      </Box>
      <Divider w="100%" h="1px" bgColor="brand.bg.primary" my="8px" />
    </>
  );
};
