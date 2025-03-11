import { Button, ButtonProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  onButtonClick: () => void;
  children: ReactNode;
} & ButtonProps;

export const CustomButton = ({ onButtonClick, children, ...props }: Props) => {
  return (
    <Button
      p={'16px 20px'}
      width="100%"
      color="white"
      borderRadius="8px"
      fontSize="16px"
      fontWeight="700"
      lineHeight="120%"
      height={'unset'}
      bg="brand.buttons.action.bg"
      _hover={{
        bg: 'brand.buttons.action.hover',
      }}
      onClick={() => {
        onButtonClick();
      }}
      _disabled={{
        bg: 'brand.buttons.disabled',
        cursor: 'not-allowed',
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
