import { Connector } from '@ant-design/web3';
import {
  CloseButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { WalletConnector } from '../../..';
import { CustomButton } from '../../atoms/buttons/CustomButton';
import { WalletButton } from '../../molecules/buttons/WalletButton';
import { useConnectWalletsModal } from './useConnectWalletsModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  areWalletsConnected: boolean;
  walletConnector?: WalletConnector;
}

export const ConnectWalletsModal: FC<Props> = ({
  isOpen,
  onClose,
  title,
  areWalletsConnected,
  walletConnector,
}) => {
  const {
    isBitcoinModalOpen,
    requiredWallets,
    setIsBitcoinModalOpen,
    onBitcoinConnected,
    handleWalletClick,
  } = useConnectWalletsModal({
    walletConnector,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay backdropFilter="blur(4px)" zIndex={1000} />
      <ModalContent
        bg="brand.primary"
        p="24px"
        containerProps={{ zIndex: 1000 }}
      >
        <ModalHeader
          color="brand.text.primary"
          p="0"
          mb="24px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {title}
          <CloseButton onClick={onClose} color="brand.secondary.100" />
        </ModalHeader>
        <ModalBody p="0">
          <Text color="brand.secondary.2" mb="16px">
            {areWalletsConnected
              ? 'All wallets connected. You can proceed to the next step.'
              : 'Connect wallets to proceed to the next step.'}
          </Text>
          <VStack spacing="12px" align="stretch">
            {requiredWallets.map((wallet) => (
              <WalletButton
                key={wallet.walletType}
                walletType={wallet.walletType}
                network={wallet.network}
                onConnect={() => handleWalletClick(wallet.walletType)}
                isDisabled={wallet.isDisabled}
                walletConnector={walletConnector}
              />
            ))}
            <CustomButton onButtonClick={() => onClose()}>
              Continue
            </CustomButton>
          </VStack>
          <Connector
            children={<></>}
            modalProps={{
              open: isBitcoinModalOpen,
              onCancel: () => setIsBitcoinModalOpen(false),
              group: false,
              mode: 'simple',
            }}
            onConnected={onBitcoinConnected}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
