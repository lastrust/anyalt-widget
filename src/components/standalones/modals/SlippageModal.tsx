import { Box, Flex, Icon, Input, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import { slippageAtom } from '../../../store/stateStore';
import { CloseIcon } from '../../atoms/icons/modals/CloseIcon';
import { InfoIcon } from '../../atoms/icons/modals/InfoIcon';
import { SlippageItem } from '../../molecules/SlippageItem';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SlippageModal = ({ isOpen, onClose }: Props) => {
  const [slippage, setSlippage] = useAtom(slippageAtom);
  const inputRef = useRef<HTMLInputElement>(null);

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
      bgColor="rgba(0, 0, 0, 0.5)"
      backdropFilter="blur(10px)"
      zIndex="2000"
    >
      <Box
        width="100%"
        minH="198px"
        padding="24px"
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
        <Box
          display="flex"
          flexDir="row"
          alignItems="center"
          gap="10px"
          mb="24px"
        >
          <Text fontSize="20px" fontWeight="bold">
            Slippage tolerance per swap
          </Text>
          <InfoIcon />
        </Box>
        <Box>
          <Box display="flex" flexDir="row" gap="6px" mb="6px">
            <SlippageItem
              value={0.5}
              slippage={slippage}
              setSlippage={setSlippage}
            />
            <SlippageItem
              value={1}
              slippage={slippage}
              setSlippage={setSlippage}
            />
          </Box>
          <Flex flexDir="row" gap="6px">
            <SlippageItem
              value={3}
              slippage={slippage}
              setSlippage={setSlippage}
            />
            <Box
              width="100%"
              h="48px"
              bgColor="brand.primary"
              borderRadius="8px"
              border="1px solid"
              borderColor="brand.secondary.8"
              display="flex"
              flexDir="row"
              alignItems="center"
              justifyContent="center"
              gap="2px"
            >
              <Input
                onChange={(e) => {
                  setSlippage(e.target.value);
                  if (parseFloat(e.target.value) > 100) {
                    setSlippage('100');
                  } else if (parseFloat(e.target.value) < 0) {
                    setSlippage('0');
                  }
                }}
                ref={inputRef}
                type="number"
                placeholder="Custom %"
                outline="none"
                border="none"
                bgColor="transparent"
                focusBorderColor="transparent"
                fontSize="16px"
                h="30px"
                padding="0"
                textAlign="center"
              />
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
