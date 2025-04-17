import { SupportedChain } from '@anyalt/sdk';
import { Button, Image, Text } from '@chakra-ui/react';

type Props = {
  chain: SupportedChain;
  activeChain: SupportedChain | null;
  setActiveChain: (value: React.SetStateAction<SupportedChain | null>) => void;
};

export const ChainButton = ({ chain, activeChain, setActiveChain }: Props) => {
  return (
    <Button
      key={chain.id}
      alignItems="center"
      maxH={'32px'}
      cursor="pointer!important"
      padding="4px"
      borderRadius="32px"
      border="1px solid"
      borderColor={
        activeChain?.id === chain.id
          ? 'brand.border.active'
          : 'brand.border.secondary'
      }
      bgColor="brand.primary"
      width="fit-content"
      onClick={() => setActiveChain(chain)}
      leftIcon={
        <Image
          src={chain.logoUrl ?? ''}
          alt={chain.displayName ?? ''}
          width="24px"
          height="24px"
        />
      }
    >
      <Text fontSize="16px" color="brand.text.primary" opacity="0.6">
        {chain.displayName}
      </Text>
    </Button>
  );
};
