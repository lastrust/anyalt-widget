import { SupportedToken } from '@anyalt/sdk';
import { Box, Image, Input, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { getImageURL } from '../../../../utils';
import { TokenAccept } from '../../../molecules/TokenAccept';
import { TokenItem } from '../../../molecules/TokenItem';
import { useTokenSelectBox } from './useTokenSelectBox';

type Props = {
  onClose: () => void;
  onTokenSelect: (token: SupportedToken) => void;
};

export const TokenSelectBox: FC<Props> = ({ onClose, onTokenSelect }) => {
  const {
    showAccept,
    setShowAccept,
    isValidAddress,
    setSearchInputValue,
    customToken,
    chains,
    allTokens,
    activeChain,
    setActiveChain,
    showAllChains,
    setShowAllChains,
    searchInputValue,
  } = useTokenSelectBox();

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
        maxH="504px"
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
                key={chain.id}
                display="flex"
                flexDir="row"
                alignItems="center"
                gap="6px"
                cursor="pointer"
                padding="4px"
                borderRadius="32px"
                border="1px solid"
                borderColor={
                  activeChain?.id === chain.id
                    ? 'brand.tertiary.100'
                    : 'brand.secondary.12'
                }
                bgColor="brand.primary"
                width="fit-content"
                onClick={() => setActiveChain(chain)}
              >
                <Image
                  src={chain.logoUrl ?? ''}
                  alt={chain.displayName ?? ''}
                  width="24px"
                  height="24px"
                />
                <Text fontSize="16px" color="white" opacity="0.6">
                  {chain.displayName}
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
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Type a token or enter the contract address"
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
          <Box overflow="auto" maxH="210px" scrollBehavior="smooth">
            {isValidAddress && customToken ? (
              <>
                {showAccept ? (
                  <TokenAccept
                    onClick={() => {
                      setShowAccept(false);
                      onTokenSelect(customToken);
                    }}
                  />
                ) : (
                  <TokenItem
                    tokenSymbol={customToken.symbol}
                    tokenIcon={customToken.logoUrl}
                    chainName={customToken.chain?.displayName ?? ''}
                    onClick={() => {
                      setShowAccept(true);
                    }}
                  />
                )}
              </>
            ) : (
              allTokens.map((token) => (
                <TokenItem
                  key={token.id}
                  tokenSymbol={token.symbol}
                  tokenIcon={token.logoUrl}
                  chainName={token.chain?.displayName ?? ''}
                  onClick={() => {
                    onTokenSelect(token);
                  }}
                />
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
