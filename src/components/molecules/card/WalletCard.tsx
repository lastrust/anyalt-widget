import { Button, Text, VStack } from '@chakra-ui/react';
import { FC } from 'react';

interface WalletCardProps {
  walletType: string;
  network: string;
  icon: string;
  onClick: () => void;
}

export const WalletCard: FC<WalletCardProps> = ({
  walletType,
  network,
  onClick,
}) => {
  return (
    <Button
      w="100%"
      h="auto"
      p="16px"
      bg="brand.bg.card"
      _hover={{ bg: 'brand.bg.hover' }}
      onClick={onClick}
    >
      <VStack w="100%" justify="space-between" align="start">
        <Text color="brand.text.secondary.0" fontSize="20px">
          {walletType}
        </Text>
        <Text color="brand.text.secondary.2" fontSize="16px">
          {network}
        </Text>
      </VStack>
    </Button>
  );
};
