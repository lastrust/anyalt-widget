import { Box, Button, Image, Text } from '@chakra-ui/react';
import aarnaIcon from '../../../assets/imgs/aarna.png';
import configIcon from '../../../assets/imgs/config-icon.svg';
import ethereumIcon from '../../../assets/imgs/ethereum.svg';
import usdcIcon from '../../../assets/imgs/usdc.png';
import { TokenInputBox } from '../../molecules/TokenInputBox';
import { TokenQuoteBox } from '../../molecules/TokenQuoteBox';

export const Container = () => {
  return (
    <Box
      margin="24px 0px"
      padding="24px"
      border="1px solid"
      borderColor="brand.secondary.12"
      borderRadius="12px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="16px"
      >
        <Text color="white" fontSize="24px" fontWeight="semiBold">
          Select Deposit Token
        </Text>
        <Box cursor="pointer">
          <Image src={configIcon} alt="config" />
        </Box>
      </Box>

      <TokenInputBox mb="16px" />

      <TokenQuoteBox
        headerText="Vault Is Expecting"
        tokenName="USDC"
        tokenLogo={usdcIcon}
        chainName="Ethereum"
        chainLogo={ethereumIcon}
        amount={2420.9}
        price={2423.53}
        mb="16px"
      />

      <Box width="100%" height="1px" bgColor="brand.secondary.12" mb="16px" />
      <TokenQuoteBox
        headerText="What You Are Getting"
        tokenName="Aarnâ Afi802"
        tokenLogo={aarnaIcon}
        chainName="Ethereum"
        chainLogo={ethereumIcon}
        amount={10.19}
        price={2423.53}
        mb="16px"
      />
      <Button
        width="100%"
        bg="brand.tertiary.100"
        color="white"
        fontSize="16px"
        fontWeight="bold"
        borderRadius="8px"
        h="64px"
      >
        Connect Wallet/s To Start Transaction
      </Button>
    </Box>
  );
};
