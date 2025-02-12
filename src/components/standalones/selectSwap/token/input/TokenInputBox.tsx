import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { Box, BoxProps, Button, Input, Skeleton, Text } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useSolana } from '../../../../../providers/useSolana';
import {
  Box,
  BoxProps,
  Button,
  Icon,
  Input,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { FC } from 'react';
import { SelectTokenIcon } from '../../../../atoms/icons/selectToken/SelectTokenIcon';
import { TokenIconBox } from '../../../../molecules/TokenIconBox';
import { TokenInfoBox } from '../../../../molecules/TokenInfoBox';
import { truncateToDecimals } from '../../../accordions/BestRouteAccordion';
import { useTokenInputBox } from './useTokenInputBox';

type Props = BoxProps & {
  price: string;
  loading: boolean;
  readonly: boolean;
  isValidAmountIn: boolean;
  isTokenInputDisabled?: boolean;
  failedToFetchRoute?: boolean;
  openTokenSelectModal: () => void;
};

export const TokenInputBox: FC<Props> = ({
  loading,
  price,
  readonly,
  isValidAmountIn,
  openTokenSelectModal,
  failedToFetchRoute,
  ...props
}) => {
  const inToken = useAtomValue(inTokenAtom);
  const [inTokenAmount, setInTokenAmount] = useAtom(inTokenAmountAtom);
  const currentStep = useAtomValue(currentUiStepAtom);
  const { getSolanaTokenBalance } = useSolana();
  const { address: evmAddress } = useAccount();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const { account: bitcoinAccount, getBalance: getBitcoinBalance } =
    useBitcoinWallet();

  const getBalance = async () => {
    if (inToken) {
      console.log(inToken);
      if (inToken?.chain?.chainType === 'SOLANA' && publicKey) {
        const balance = await getSolanaTokenBalance(
          inToken.tokenAddress ?? '',
          publicKey.toString(),
        );
        setBalance(balance);
      } else if (inToken?.chain?.chainType === 'EVM' && evmAddress) {
        const balance = await getEvmTokenBalance(
          inToken.chain?.chainId ?? 1,
          inToken.tokenAddress ?? '',
          evmAddress,
        );
        setBalance(balance);
      } else if (inToken?.chain?.name === 'BTC' && bitcoinAccount) {
        console.log('BTC balance');
        const balance = await getBitcoinBalance();
        if (balance.value && balance.decimals) {
          setBalance(formatUnits(balance.value, balance.decimals));
        }
      }
    }
  };

  const maxButtonClick = async () => {
    setInTokenAmount(balance);
  };

  useEffect(() => {
    if (
      currentStep === 1 &&
      balance &&
      inTokenAmount &&
      parseFloat(balance) < parseFloat(inTokenAmount)
    ) {
      setInTokenAmount(balance);
    }
  }, [inTokenAmount, balance, currentStep]);

  useEffect(() => {
    getBalance();
  }, [inToken, evmAddress, publicKey, bitcoinAccount]);

  useEffect(() => {
    if (inTokenAmount) {
      setInTokenAmount(inTokenAmount.toString());
    }
  }, [inTokenAmount]);
  const {
    inToken,
    inTokenAmount,
    setInTokenAmount,
    maxButtonClick,
    balance,
    currentStep,
  } = useTokenInputBox();

  return (
    <Box {...props}>
      <Box
        display={readonly ? 'none' : 'flex'}
        justifyContent="space-between"
        alignItems="center"
        mb="12px"
      >
        <Text color={'brand.secondary.3'} textStyle={'bold.2'}>
          Choose Your Deposit
        </Text>
        <Box
          display={currentStep === 1 ? 'flex' : 'none'}
          flexDirection="row"
          alignItems="center"
          gap="4px"
        >
          <Text color={'brand.secondary.3'} textStyle={'bold.3'} opacity={0.4}>
            Balance: {balance ? truncateToDecimals(balance, 6) : ''}
          </Text>
          <Button
            bg="brand.tertiary.20"
            color="brand.tertiary.100"
            fontSize="12px"
            fontWeight="bold"
            borderRadius="4px"
            padding="4px 2px"
            maxH="16px"
            onClick={maxButtonClick}
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
        gap="16px"
        bgColor="brand.secondary.4"
        padding="16px"
        borderRadius="8px"
        border={!isValidAmountIn || failedToFetchRoute ? '1px solid' : 'none'}
        borderColor={
          !isValidAmountIn || failedToFetchRoute
            ? 'brand.quinary.100'
            : 'transparent'
        }
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            onClick={() => openTokenSelectModal()}
            cursor={'pointer'}
          >
            <TokenIconBox
              tokenName={inToken?.symbol ?? ''}
              tokenIcon={inToken?.logoUrl ?? ''}
              chainName={inToken?.chain?.displayName ?? ''}
              chainIcon={inToken?.chain?.logoUrl ?? ''}
              mr="8px"
            />
            <TokenInfoBox
              tokenName={inToken?.symbol ?? 'Select Token'}
              subText={
                inToken?.chain?.displayName
                  ? `On ${inToken?.chain?.displayName}`
                  : 'Select Chain'
              }
              mr="12px"
            />
            <Box
              cursor="pointer"
              color={'brand.tertiary.100'}
              _hover={{
                color: 'brand.tertiary.90',
              }}
            >
              <Icon as={SelectTokenIcon} />
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
              color="brand.text.primary"
              placeholder="0.00"
              textAlign="right"
              maxWidth="150px"
              padding="0px"
              _placeholder={{
                color: 'brand.text.primary',
                opacity: 0.4,
              }}
              value={inTokenAmount?.replace(',', '.')}
              onChange={(e) => {
                setInTokenAmount(e.target.value);
              }}
              readOnly={readonly}
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
          <Text color="brand.text.primary" fontSize="12px" opacity={0.4}>
            {inToken?.name ?? 'Token'}
          </Text>
          {loading ? (
            <Skeleton width="34px" height="14px" borderRadius="32px" />
          ) : (
            <Text color="brand.text.primary" fontSize="12px" opacity={0.4}>
              ~${price || '0.00'}
            </Text>
          )}
        </Box>
      </Box>
      {!isValidAmountIn && (
        <Box
          padding="4px"
          bgColor="brand.quinary.10"
          borderRadius="8px"
          width="100%"
        >
          <Text color="brand.quinary.100" fontSize="14px" fontWeight="bold">
            Amount not supported. Please try different amount.
          </Text>
        </Box>
      )}
      {failedToFetchRoute && (
        <Box
          mt="4px"
          padding="4px"
          bgColor="brand.quinary.10"
          borderRadius="8px"
          width="100%"
        >
          <Text color="brand.quinary.100" fontSize="14px" fontWeight="bold">
            No Available Route
          </Text>
        </Box>
      )}
    </Box>
  );
};
