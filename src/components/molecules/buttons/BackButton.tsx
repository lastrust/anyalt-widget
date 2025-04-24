import { Button, Icon } from '@chakra-ui/react';
import { SelectTokenIcon } from '../../atoms/icons/selectToken/SelectTokenIcon';

type Props = {
  onBackClick: (() => void) | undefined;
};

export const BackButton = ({ onBackClick }: Props) => {
  if (!onBackClick) return null;

  return (
    <Button
      cursor="pointer"
      color={'brand.buttons.action.bg'}
      _hover={{
        color: 'brand.buttons.action.hover',
      }}
      onClick={onBackClick}
      transform={'rotate(180deg)'}
      p={'0'}
    >
      <Icon as={SelectTokenIcon} w={'24px'} h={'24px'} />
    </Button>
  );
};
