import { Divider, Flex } from '@chakra-ui/react';
import aarnaIcon from '../../../assets/imgs/aarna.png';
import ethereumIcon from '../../../assets/imgs/ethereum.svg';
import usdcIcon from '../../../assets/imgs/usdc.png';
import { TokenInputBox } from '../TokenInputBox';
import { TokenQuoteBox } from '../TokenQuoteBox';

type Props = {
  loading: boolean;
};

export const SelectSwap = ({ loading }: Props) => {
  return (
    <Flex flexDirection="column" gap="16px" mb="16px">
      <TokenInputBox />
      <TokenQuoteBox
        loading={loading}
        headerText="Vault Is Expecting"
        tokenName="USDC"
        tokenLogo={usdcIcon}
        chainName="Ethereum"
        chainLogo={ethereumIcon}
        amount={2420.9}
        price={2423.53}
      />
      <Divider w="100%" h="1px" bgColor="brand.secondary.12" />
      <TokenQuoteBox
        loading={loading}
        headerText="What You Are Getting"
        tokenName="Aarnâ Afi802"
        tokenLogo={aarnaIcon}
        chainName="Ethereum"
        chainLogo={ethereumIcon}
        amount={10.19}
        price={2423.53}
      />
    </Flex>
  );
};
