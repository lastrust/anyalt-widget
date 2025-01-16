import { Box, BoxProps, Button, Image, Input, Text } from '@chakra-ui/react';
import { FC } from 'react';
import chevronRight from '../../assets/imgs/chevron-right.svg';
import popcatIcon from '../../assets/imgs/popcat.png';
import solanaIcon from '../../assets/imgs/solana.svg';
import { TokenIconBox } from '../molecules/TokenIconBox';
import { TokenInfoBox } from '../molecules/TokenInfoBox';

type Props = BoxProps;

export const TokenInputBox: FC<Props> = ({ ...props }) => {
  return (
    <Box {...props}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="12px"
      >
        <Text color="white" fontSize="14px" fontWeight="bold" opacity={0.32}>
          Choose Your Deposit
        </Text>
        <Box display="flex" flexDirection="row" alignItems="center" gap="4px">
          <Text color="white" fontSize="12px" opacity={0.4}>
            Balance: 0
          </Text>
          <Button
            bg="brand.tertiary.20"
            color="brand.tertiary.100"
            fontSize="12px"
            fontWeight="bold"
            borderRadius="4px"
            padding="4px 2px"
            maxH="16px"
          >
            Max
          </Button>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        gap="34px"
        bgColor="brand.secondary.4"
        padding="16px"
        borderRadius="8px"
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Box display="flex" flexDirection="row" alignItems="center">
            <TokenIconBox
              tokenName="POPCAT"
              tokenIcon={popcatIcon}
              chainName="Solana"
              chainIcon={solanaIcon}
              mr="8px"
            />
            <TokenInfoBox tokenName="POPCAT" chainName="Solana" mr="12px" />
            <Box>
              <Image
                src={chevronRight}
                alt="Chevron Right"
                minW="20px"
                minH="20px"
              />
            </Box>
          </Box>
          <Box>
            <Input
              type="number"
              fontSize="32px"
              fontWeight="bold"
              border="none"
              outline="none"
              focusBorderColor="transparent"
              bgColor="transparent"
              color="white"
              placeholder="1000.00"
              textAlign="right"
              maxWidth="150px"
            />
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Text color="white" fontSize="12px" opacity={0.4}>
            Popcat Token
          </Text>
          <Text color="white" fontSize="12px" opacity={0.4}>
            ~$2,423.53
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
