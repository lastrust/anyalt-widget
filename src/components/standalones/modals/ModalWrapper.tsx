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
  maxWidthCustom?: string;
} & ModalProps;

const ModalWrapper: FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
  maxWidthCustom,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl" {...props}>
      <ModalOverlay backdropFilter="blur(4px)" zIndex={1000} />
      <ModalContent
        bg="brand.primary"
        borderRadius="12px"
        border="1px solid"
        borderColor="brand.secondary.12"
        maxW={maxWidthCustom || '1000px'}
        containerProps={{ zIndex: 1000 }}
      >
        <Box color="brand.buttons.close.primary">
          <ModalCloseButton />
        </Box>
        <Box padding="32px">{children}</Box>
      </ModalContent>
    </Modal>
  );
};

export default ModalWrapper;
