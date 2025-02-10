import { useBitcoinWallet } from '@ant-design/web3-bitcoin';
import { Box, BoxProps, Button, Input, Skeleton, Text } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAtom, useAtomValue } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useSolana } from '../../../../../providers/useSolana';
import {
  currentUiStepAtom,
  inTokenAmountAtom,
  inTokenAtom,
} from '../../../../../store/stateStore';
import { getEvmTokenBalance } from '../../../../../utils';
import { TokenIconBox } from '../../../../molecules/TokenIconBox';
import { TokenInfoBox } from '../../../../molecules/TokenInfoBox';

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

  return (
    <Box {...props}>
      <Box
        display={readonly ? 'none' : 'flex'}
        justifyContent="space-between"
        alignItems="center"
        mb="16px"
      >
        <Text color="white" fontSize="14px" fontWeight="bold" opacity={0.32}>
          Choose Your Deposit
        </Text>
        <Box
          display={currentStep === 1 ? 'flex' : 'none'}
          flexDirection="row"
          alignItems="center"
          gap="4px"
        >
          <Text color="white" fontSize="12px" opacity={0.4}>
            Balance: {balance ? parseFloat(balance).toFixed(6) : ''}
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
        gap="34px"
        bgColor="brand.secondary.4"
        padding="16px"
        borderRadius="8px"
        border={!isValidAmountIn || failedToFetchRoute ? '1px solid' : 'none'}
        borderColor={
          !isValidAmountIn || failedToFetchRoute
            ? 'brand.quinary.100'
            : 'transparent'
        }
        mb="8px"
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
            <Box cursor="pointer">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="20"
                  height="20"
                  rx="10"
                  transform="matrix(-4.37114e-08 1 1 4.37114e-08 0 0)"
                  fill="#008080"
                />
                <path
                  d="M9.375 7.5L11.875 10L9.375 12.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              placeholder="0.00"
              textAlign="right"
              maxWidth="150px"
              padding="0px"
              value={inTokenAmount}
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
          <Text color="white" fontSize="12px" opacity={0.4}>
            {inToken?.name ?? 'Token'}
          </Text>
          {loading ? (
            <Skeleton width="34px" height="14px" borderRadius="32px" />
          ) : (
            <Text color="white" fontSize="12px" opacity={0.4}>
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
