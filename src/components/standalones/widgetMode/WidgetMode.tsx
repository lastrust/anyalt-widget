import { Button, HStack, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { ReactNode } from 'react';
import {
  selectedTokenOrFiatAmountAtom,
  widgetModeAtom,
} from '../../../store/stateStore';

type ModeButtonProps = {
  isActive: boolean;
  onClickHandler: () => void;
  children: ReactNode;
};

const ModeButton = ({
  isActive,
  onClickHandler,
  children,
}: ModeButtonProps) => {
  return (
    <Button
      p="8px 16px"
      maxH={'28px'}
      minH={'unset!important'}
      borderRadius={'32px'}
      background="#F2F3F4"
      color={
        isActive
          ? 'brand.buttons.widgetMode.primary'
          : 'brand.buttons.widgetMode.disabled'
      }
      border="1.5px solid"
      borderColor={
        isActive
          ? 'brand.buttons.widgetMode.border'
          : 'brand.buttons.widgetMode.disabled'
      }
      onClick={onClickHandler}
    >
      <Text textStyle={'bold.5'}>{children}</Text>
    </Button>
  );
};

export const WidgetMode = () => {
  const [widgetMode, setWidgetMode] = useAtom(widgetModeAtom);
  const [selectedTokenOrFiatAmount, setSelectedTokenOrFiatAmount] = useAtom(
    selectedTokenOrFiatAmountAtom,
  );

  const handleClick = (mode: 'crypto' | 'fiat') => {
    setWidgetMode(mode);
    if (selectedTokenOrFiatAmount) {
      setSelectedTokenOrFiatAmount('');
    }
  };

  return (
    <HStack>
      <ModeButton
        isActive={widgetMode === 'crypto'}
        onClickHandler={() => handleClick('crypto')}
      >
        Crypto Deposit
      </ModeButton>
      <ModeButton
        isActive={widgetMode === 'fiat'}
        onClickHandler={() => handleClick('fiat')}
      >
        Fiat Deposit
      </ModeButton>
    </HStack>
  );
};
