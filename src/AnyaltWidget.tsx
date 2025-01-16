import { AnyAlt } from '@anyalt/sdk';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { Container } from './components/organisms/Container';
import { Footer } from './components/organisms/Footer';
import { Header } from './components/organisms/Header';
import ModalWrapper from './components/standalones/ModalWrapper';
import { anyaltInstanceAtom } from './store/stateStore';
import { Token } from './types/types';

export { OpenModalButton } from './components/atoms/OpenModalButton';
export { useModal } from './hooks/useModal';
export { WidgetProvider } from './providers/WidgetProvider';
export {
  defaultTheme,
  defaultTheme as standardTheme,
} from './theme/defaultTheme';

type Props = {
  logo: string;
  isOpen: boolean;
  inputToken: Token;
  walletConnector: unknown;
  onClose: () => void;
  anyaltInstance: AnyAlt;
};

export const AnyaltWidget = ({ isOpen, onClose, anyaltInstance }: Props) => {
  const [, setAnyaltInstance] = useAtom(anyaltInstanceAtom);

  useEffect(() => {
    setAnyaltInstance(anyaltInstance);
  }, []);

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <Header />
      <Container />
      <Footer />
    </ModalWrapper>
  );
};
