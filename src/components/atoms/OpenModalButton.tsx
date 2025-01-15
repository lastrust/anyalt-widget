import { Button } from '@chakra-ui/react';
import { FC } from 'react';

interface OpenModalButtonProps {
  onOpen: () => void;
}

export const OpenModalButton: FC<OpenModalButtonProps> = ({ onOpen }) => {
  return (
    <Button onClick={onOpen} colorScheme="teal">
      Open Anyalt Widget
    </Button>
  );
};
