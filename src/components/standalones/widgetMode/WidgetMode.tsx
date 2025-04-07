import { Button, HStack, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { ReactNode } from 'react';
import { widgetModeAtom } from '../../../store/stateStore';

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

  return (
    <HStack>
      <ModeButton
        isActive={widgetMode === 'crypto'}
        onClickHandler={() => setWidgetMode('crypto')}
      >
        Crypto
      </ModeButton>
      <ModeButton
        isActive={widgetMode === 'fiat'}
        onClickHandler={() => setWidgetMode('fiat')}
      >
        Fiat
      </ModeButton>
    </HStack>
  );
};
