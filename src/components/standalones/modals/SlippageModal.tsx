import { Box, Image, Input, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { FC, useRef } from 'react';
import { slippageAtom } from '../../../store/stateStore';
import { getImageURL } from '../../../utils';
import { SlippageItem } from '../../molecules/SlippageItem';

type Props = {
  onClose: () => void;
};

export const SlippageModal: FC<Props> = ({ onClose }) => {
  const [slippage, setSlippage] = useAtom(slippageAtom);
  const inputRef = useRef<HTMLInputElement>(null);

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
    >
      <Box
        width="100%"
        minH="198px"
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
          <Image
            src={getImageURL('info-icon.svg')}
            alt="info"
            width="16px"
            height="16px"
          />
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
          <Box display="flex" flexDir="row" gap="6px">
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
              borderColor="brand.secondary.12"
              display="flex"
              flexDir="row"
              alignItems="center"
              justifyContent="center"
              gap="2px"
            >
              <Text
                fontSize="16px"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                Custom %
              </Text>
              <Input
                value={slippage}
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
                placeholder=""
                outline="none"
                border="none"
                bgColor="transparent"
                focusBorderColor="transparent"
                fontSize="16px"
                h="30px"
                w="30px"
                padding="0"
                textAlign="center"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
