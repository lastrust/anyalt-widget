import {
  Box,
  BoxProps,
  Button,
  Image,
  Input,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useAtom, useAtomValue } from 'jotai';
import { FC } from 'react';
import chevronRight from '../../../../assets/imgs/chevron-right.svg';
import { inTokenAmountAtom, inTokenAtom } from '../../../../store/stateStore';
import { TokenIconBox } from '../../../molecules/TokenIconBox';
import { TokenInfoBox } from '../../../molecules/TokenInfoBox';

type Props = BoxProps & {
  openTokenSelectModal: () => void;
  loading: boolean;
  price: string;
  isValidAmountIn: boolean;
  isTokenInputDisabled?: boolean;
  readonly: boolean;
};

export const TokenInputBox: FC<Props> = ({
  openTokenSelectModal,
  loading,
  price,
  isValidAmountIn,
  isTokenInputDisabled = false,
  readonly,
  ...props
}) => {
  const inToken = useAtomValue(inTokenAtom);
  const [inTokenAmount, setInTokenAmount] = useAtom(inTokenAmountAtom);

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
        <Box display="none" flexDirection="row" alignItems="center" gap="4px">
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
        border={isValidAmountIn ? 'none' : '1px solid'}
        borderColor={isValidAmountIn ? 'transparent' : 'brand.quinary.100'}
        mb="8px"
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
            <Box cursor="pointer" onClick={() => openTokenSelectModal()}>
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
              padding="0px"
              value={inTokenAmount}
              onChange={(e) => setInTokenAmount(e.target.value)}
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
              ~${price}
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
    </Box>
  );
};
