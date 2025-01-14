import React, { FC } from 'react';
import { Button } from '@chakra-ui/react';

interface OpenModalButtonProps {
  onOpen: () => void;
}

const OpenModalButton: FC<OpenModalButtonProps> = ({ onOpen }) => {
  return (
    <Button onClick={onOpen} colorScheme="teal">
      Open Anyalt Widget
    </Button>
  );
};

export default OpenModalButton;
