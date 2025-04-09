import { SupportedToken } from '@anyalt/sdk';
import {
  Box,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react';

import { CloseIcon } from '../../../atoms/icons/modals/CloseIcon';
import { SearchIcon } from '../../../atoms/icons/selectToken/SearchIcon';
import { ChainButton } from './ChainButton';
import { CurrenciesList } from './CurrencyList';
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
    widgetMode,
    labelText,
    inputPlaceholder,
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
      bgColor="brand.bg.selectToken"
      backdropFilter="blur(10px)"
      zIndex="2000"
      _hover={{
        backdropFilter: 'blur(11px)',
      }}
      id="token-select-box-container"
      onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if ((e.target as HTMLDivElement).id === 'token-select-box-container') {
          (e.target as HTMLDivElement).style.cursor = 'pointer';
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
        borderColor="brand.border.secondary"
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
          <Icon as={CloseIcon} color="brand.buttons.close.primary" />
        </Box>
        {widgetMode === 'crypto' && (
          <Box mb="16px">
            <Text fontSize="20px" fontWeight="bold" mb="16px">
              Select A Chain
            </Text>
            <Box display="flex" flexWrap="wrap" gap="6px" mb="12px">
              {chains.map((chain) => (
                <ChainButton
                  chain={chain}
                  activeChain={activeChain}
                  setActiveChain={setActiveChain}
                />
              ))}
            </Box>
          </Box>
        )}

        <FormControl>
          <FormLabel fontSize="20px" fontWeight="bold" mb="16px">
            {labelText}
          </FormLabel>
          <InputGroup
            borderRadius="32px"
            border="1px solid"
            borderColor="brand.border.secondary"
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
              placeholder={inputPlaceholder}
              _placeholder={{
                color: 'brand.text.primary',
              }}
            />
          </InputGroup>
          <Box overflow="auto" maxH="210px" scrollBehavior="smooth">
            {widgetMode === 'crypto' ? (
              <TokenList
                isValidAddress={isValidAddress}
                customToken={customToken}
                showAccept={showAccept}
                allTokens={allTokens}
                setShowAccept={setShowAccept}
                onTokenSelect={onTokenSelect}
                isLoading={isLoading}
              />
            ) : (
              <CurrenciesList
                allCurrencies={[
                  {
                    name: 'USD',
                    label: 'USD',
                    logoUrl: 'USDLOGO',
                    id: '1',
                  },
                ]}
                isLoading={false}
                onCurrencySelect={(currency) => {
                  console.log(currency);
                }}
              />
            )}
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};
