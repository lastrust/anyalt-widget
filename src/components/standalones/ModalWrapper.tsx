import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalWrapper: FC<ModalWrapperProps> = ({ isOpen, onClose, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="brand.primary" maxW="528px">
        <ModalCloseButton color="white" />
        <Box padding="40px">{children}</Box>
      </ModalContent>
    </Modal>
  );
};

export default ModalWrapper;
