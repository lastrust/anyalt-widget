import { Box, Text } from '@chakra-ui/react';
import { FC } from 'react';

type Props = {
  value: number;
  slippage: string;
  setSlippage: (slippage: string) => void;
};

export const SlippageItem: FC<Props> = ({ value, slippage, setSlippage }) => {
  return (
    <Box
      width="100%"
      h="48px"
      bgColor="brand.primary"
      borderRadius="8px"
      border="1px solid"
      borderColor={
        parseFloat(slippage) === value
          ? 'brand.border.active'
          : 'brand.border.secondary'
      }
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      onClick={() => setSlippage(value.toString())}
    >
      <Text fontSize="16px">{value}%</Text>
    </Box>
  );
};
