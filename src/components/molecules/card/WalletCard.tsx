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
      bg="brand.secondary.4"
      _hover={{ bg: 'brand.secondary.12' }}
      onClick={onClick}
    >
      <VStack w="100%" justify="space-between" align="start">
        <Text color="brand.secondary.5" fontSize="20px">
          {walletType}
        </Text>
        <Text color="brand.secondary.3" fontSize="16px">
          {network}
        </Text>
      </VStack>
    </Button>
  );
};
