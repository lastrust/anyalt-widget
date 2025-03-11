import { SupportedToken } from '@anyalt/sdk';
import {
  Box,
  FormControl,
  FormLabel,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';

import { CloseIcon } from '../../../atoms/icons/modals/CloseIcon';
import { SearchIcon } from '../../../atoms/icons/selectToken/SearchIcon';
import { TokenList } from './TokenList';
import { useTokenSelectModal } from './useTokenSelectModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onTokenSelect: (token: SupportedToken) => void;
};

export const TokenSelectModal = ({ isOpen, onClose, onTokenSelect }: Props) => {
  const {
    chains,
    isLoading,
    allTokens,
    showAccept,
    customToken,
    activeChain,
    setShowAccept,
    setActiveChain,
    isValidAddress,
    searchInputValue,
    setSearchInputValue,
  } = useTokenSelectModal();

  if (!isOpen) return null;

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
      bgColor="brand.secondary.7"
      backdropFilter="blur(10px)"
      zIndex="2000"
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
        maxW="512px"
        maxH="554px"
        padding="24px"
        margin="0 auto"
        borderRadius="16px 16px 12px 12px"
        bgColor="brand.bg.modal"
        color="brand.text.primary"
        overflow="hidden"
        position="relative"
        border="1px solid"
        borderColor="brand.secondary.8"
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
          <Icon as={CloseIcon} color="brand.secondary.9" />
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
                    ? 'brand.tertiary.1'
                    : 'brand.secondary.8'
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
                <Text fontSize="16px" color="brand.text.primary" opacity="0.6">
                  {chain.displayName}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        <FormControl>
          <FormLabel fontSize="20px" fontWeight="bold" mb="16px">
            Select A Token Or Paste A Contract Address
          </FormLabel>
          <InputGroup
            borderRadius="32px"
            border="1px solid"
            borderColor="brand.secondary.8"
            bgColor="brand.primary"
            opacity="0.4"
            mb="16px"
          >
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input
              border="none"
              outline="none"
              fontSize="16px"
              lineHeight="120%"
              bgColor="transparent"
              value={searchInputValue}
              color="brand.text.primary"
              focusBorderColor="transparent"
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Type a token or enter the contract address"
              _placeholder={{
                color: 'brand.text.primary',
              }}
            />
          </InputGroup>
          <Box overflow="auto" maxH="210px" scrollBehavior="smooth">
            <TokenList
              isValidAddress={isValidAddress}
              customToken={customToken}
              showAccept={showAccept}
              allTokens={allTokens}
              setShowAccept={setShowAccept}
              onTokenSelect={onTokenSelect}
              isLoading={isLoading}
            />
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};
