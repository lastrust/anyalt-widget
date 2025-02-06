import { SupportedToken } from '@anyalt/sdk';
import { Box, Image, Input, Text } from '@chakra-ui/react';
import { FC } from 'react';

import { useTokenSelectBox } from './useTokenSelectBox';
import { SearchIcon } from '../../../../atoms/icons/selectToken/SearchIcon';
import { TokenAccept } from '../../../../molecules/TokenAccept';
import { TokenItem } from '../../../../molecules/TokenItem';

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
      backdropFilter="blur(10px)"
      _hover={{
        backdropFilter: 'blur(11px)',
      }}
      id="token-select-box-container"
      onMouseMove={(e) => {
        if ((e.target as HTMLDivElement).id === 'token-select-box-container') {
          (e.target as HTMLDivElement).style.cursor = 'pointer';
        } else {
          // (e.target as HTMLDivElement).style.cursor = 'default';
        }
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLDivElement).id === 'token-select-box-container') {
          onClose();
        }
      }}
    >
      <Box
        id="token-select-box"
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M14.375 14.3748L5.625 5.62482"
              stroke="#919EAB"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.375 5.62482L5.625 14.3748"
              stroke="#919EAB"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
                cursor="pointer!important"
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
            fontSize="14px"
            cursor="pointer!important"
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
            <SearchIcon />
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
