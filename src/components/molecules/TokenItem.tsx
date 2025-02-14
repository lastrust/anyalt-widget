import { Box, BoxProps, Divider, Flex, Image, Text } from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';
import { CopyIcon } from '../atoms/icons/CopyIcon';

type Props = BoxProps & {
  tokenSymbol: string;
  tokenIcon: string;
  tokenAddress: string;
  onClick: () => void;
};

export const TokenItem: FC<Props> = ({
  tokenSymbol,
  tokenIcon,
  tokenAddress,
  onClick,
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, []);

  return (
    <>
      <Box
        display="flex"
        flexDir="row"
        alignItems="center"
        py="8px"
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
          width="100%"
          marginX="6px"
        >
          <Text color="brand.text.primary" textStyle="bold.0">
            {tokenSymbol}
          </Text>
          <Flex
            width="100%"
            justifyContent="space-between"
            display={tokenAddress === 'Unknown' ? 'none' : 'flex'}
          >
            <Text
              color="brand.text.primary"
              textStyle={'regular.2'}
              opacity={0.4}
              marginRight={'2px'}
            >
              {isCopied ? 'Address copied' : tokenAddress}
            </Text>
            <Box
              borderRadius={'4px'}
              padding={'3px'}
              _hover={{
                bgColor: !isCopied && 'rgba(255, 255, 255, 0.1)',
                cursor: !isCopied ? 'pointer' : 'default',
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigator.clipboard.writeText(tokenAddress);
                handleCopy();
              }}
            >
              <CopyIcon />
            </Box>
          </Flex>
        </Box>
      </Box>
      <Divider w="100%" h="1px" bgColor="brand.secondary.12" my="8px" />
    </>
  );
};
