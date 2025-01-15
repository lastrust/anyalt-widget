import React, { FC, ReactNode } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalWrapper: FC<ModalWrapperProps> = ({ isOpen, onClose, children }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg="brand.primary"
        maxW="528px"
        borderRadius="12px"
        border="1px solid"
        borderColor="brand.secondary.12"
      >
        <ModalCloseButton color="white" />
        <Box padding="40px">{children}</Box>
      </ModalContent>
    </Modal>
  );
};

export default ModalWrapper;
