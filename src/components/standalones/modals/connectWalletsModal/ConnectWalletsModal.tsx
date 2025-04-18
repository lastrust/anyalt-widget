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
import { WalletConnector } from '../../../..';
import { CustomButton } from '../../../atoms/buttons/CustomButton';
import { WalletButton } from '../../../molecules/buttons/WalletButton';
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
    requiredWallets,
    isBitcoinModalOpen,
    walletStatus,
    setWalletStatus,
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
        minW={'385px'}
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
          <CloseButton onClick={onClose} color="brand.buttons.close.primary" />
        </ModalHeader>
        <ModalBody p="0">
          <Text color="brand.text.secondary.1" mb="16px">
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
                setWalletStatus={setWalletStatus}
              />
            ))}
            <CustomButton
              isDisabled={!walletStatus?.every((wallet) => wallet.isConnected)}
              onButtonClick={() => onClose()}
            >
              {walletStatus?.every((wallet) => wallet.isConnected)
                ? 'Continue'
                : 'Please Connect Required Wallets'}
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
