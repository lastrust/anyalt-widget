import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

type ModalWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
} & ModalProps;

const ModalWrapper: FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl" {...props}>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        bg="brand.primary"
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
