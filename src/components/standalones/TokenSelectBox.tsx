import { Box, Image, Input, Text } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { CHAIN_LIST, ChainModel } from '../../constants/chains';
import { anyaltInstanceAtom } from '../../store/stateStore';
import { getImageURL } from '../../utils';

type Props = {
  onClose: () => void;
};

export const TokenSelectBox: FC<Props> = ({ onClose }) => {
  const [showAllChains, setShowAllChains] = useState<boolean>(false);
  const [chains, setChains] = useState<ChainModel[]>(CHAIN_LIST.slice(0, 8));
  useAtomValue(anyaltInstanceAtom);

  useEffect(() => {
    if (showAllChains) {
      setChains(CHAIN_LIST);
    } else {
      setChains(CHAIN_LIST.slice(0, 8));
    }
  }, [showAllChains]);

  return (
    <Box
      position="absolute"
      width="100%"
      height="100%"
      top="0"
      left="0"
      display="flex"
      flexDir="column"
      justifyContent="flex-end"
      bgColor="rgba(0, 0, 0, 0.5)"
    >
      <Box
        width="100%"
        minH="504px"
        padding="24px"
        borderRadius="16px 16px 12px 12px"
        bgColor="brand.quaternary"
        color="white"
        overflow="hidden"
        position="relative"
        border="1px solid"
        borderColor="brand.secondary.12"
        borderBottom="none"
        zIndex="100"
      >
        <Box
          cursor="pointer"
          position="absolute"
          top="16px"
          right="16px"
          onClick={onClose}
        >
          Close
        </Box>
        <Box mb="16px">
          <Text fontSize="20px" fontWeight="bold" mb="16px">
            Select A Chain
          </Text>
          <Box display="flex" flexWrap="wrap" gap="6px" mb="12px">
            {chains.map((chain) => (
              <Box
                key={chain.name}
                display="flex"
                flexDir="row"
                alignItems="center"
                gap="6px"
                cursor="pointer"
                padding="4px"
                borderRadius="32px"
                border="1px solid"
                borderColor="brand.tertiary.100"
                bgColor="brand.primary"
                width="fit-content"
              >
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  width="24px"
                  height="24px"
                />
                <Text fontSize="16px" color="white" opacity="0.6">
                  {chain.name}
                </Text>
              </Box>
            ))}
          </Box>
          <Text
            cursor="pointer"
            fontSize="14px"
            color="brand.secondary.100"
            textDecoration="underline"
            textAlign="center"
            onClick={() => setShowAllChains(!showAllChains)}
          >
            {showAllChains ? 'Show less chains' : 'Show more chains'}
          </Text>
        </Box>
        <Box overflow="auto">
          <Text fontSize="20px" fontWeight="bold" mb="16px">
            Select A Token Or Paste A Contract Address
          </Text>
          <Box
            display="flex"
            flexDir="row"
            alignItems="center"
            h="38px"
            gap="8px"
            padding="9px 8px"
            borderRadius="32px"
            border="1px solid"
            borderColor="brand.secondary.12"
            bgColor="brand.primary"
            opacity="0.4"
            mb="16px"
          >
            <Image
              src={getImageURL('search-icon.svg')}
              alt="search"
              width="20px"
              height="20px"
            />
            <Input
              placeholder="Type a token"
              outline="none"
              border="none"
              bgColor="transparent"
              color="white"
              h="30px"
              fontSize="16px"
              focusBorderColor="transparent"
              padding="0"
              _placeholder={{
                color: 'white',
              }}
            />
          </Box>
          <Box>
            <Box
              display="flex"
              flexDir="row"
              alignItems="center"
              borderBottom="1px solid"
              borderColor="brand.secondary.12"
              pb="8px"
              mb="8px"
              gap="16px"
            >
              <Image
                src={getImageURL('usdc.png')}
                alt="usdc"
                width="32px"
                height="32px"
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                alignItems="flex-start"
                gap="6px"
              >
                <Text color="white" fontSize="20px" fontWeight="bold">
                  USDC
                </Text>
                <Text
                  color="white"
                  fontSize="16px"
                  fontWeight="regular"
                  opacity={0.4}
                >
                  Ethereum
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
