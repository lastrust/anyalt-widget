import { AnyAlt } from '@anyalt/sdk';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Footer } from './components/organisms/Footer';
import { Header } from './components/organisms/Header';
import { SwappingWrapper } from './components/organisms/SwappingWrapper';
import ModalWrapper from './components/standalones/ModalWrapper';
import { RoutesWrapper } from './components/standalones/Routes/RoutesWrapper';
import { SelectSwap } from './components/standalones/SelectSwap/SelectSwap';
import CustomStepper from './components/standalones/stepper/Stepper';
import { useSteps } from './components/standalones/stepper/useSteps';
import {
  activeRouteAtom,
  allChainsAtom,
  anyaltInstanceAtom,
  finalTokenEstimateAtom,
  inTokenAmountAtom,
  inTokenAtom,
  protocolFinalTokenAtom,
  protocolInputTokenAtom,
  slippageAtom,
} from './store/stateStore';
import { EstimateResponse, Token } from './types/types';

export { OpenModalButton } from './components/atoms/OpenModalButton';
export { useModal } from './hooks/useModal';
export { WidgetProvider } from './providers/WidgetProvider';
export {
  defaultTheme,
  defaultTheme as standardTheme,
} from './theme/defaultTheme';

// TODO: As it's going to be mutliple steps widget with deposit it must accept all needed data to show for the last mile tx.
// TODO: check and prepare all needed data for the last mile tx.
type Props = {
  isOpen: boolean;
  inputToken: Token;
  finalToken: Token;
  walletConnector: unknown;
  onClose: () => void;
  anyaltInstance: AnyAlt;
  estimateCallback: (amountIn: number) => Promise<EstimateResponse>;
};

export const AnyaltWidget = ({
  isOpen,
  onClose,
  anyaltInstance,
  inputToken,
  finalToken,
  estimateCallback,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const { activeStep, nextStep } = useSteps({ stepsAmount: 1 });
  const [, setAnyaltInstance] = useAtom(anyaltInstanceAtom);
  const [allChains, setAllChains] = useAtom(allChainsAtom);
  const [protocolInputToken, setProtocolInputToken] = useAtom(
    protocolInputTokenAtom,
  );
  const [, setProtocolFinalToken] = useAtom(protocolFinalTokenAtom);
  const [openSlippageModal, setOpenSlippageModal] = useState(false);
  const inToken = useAtomValue(inTokenAtom);
  const slippage = useAtomValue(slippageAtom);
  const inTokenAmount = useAtomValue(inTokenAmountAtom);
  const [activeRoute, setActiveRoute] = useAtom(activeRouteAtom);
  const [, setFinalTokenEstimate] = useAtom(finalTokenEstimateAtom);

  useEffect(() => {
    if (activeRoute) {
      estimateCallback(parseFloat(activeRoute.outputAmount)).then((res) => {
        setFinalTokenEstimate(res);
      });
    }
  }, [activeRoute]);

  useEffect(() => {
    setAnyaltInstance(anyaltInstance);
    if (anyaltInstance) {
      anyaltInstance.getChains().then((res) => {
        setAllChains(res.chains);
      });
    }
    setProtocolFinalToken(finalToken);
  }, []);

  useEffect(() => {
    const inputTokenChain = allChains.find(
      (chain) =>
        chain.chainId === inputToken.chainId &&
        chain.chainType === inputToken.chainType,
    );

    if (inputTokenChain) {
      anyaltInstance
        ?.getToken(inputTokenChain.id, inputToken.address)
        .then((res) => {
          setProtocolInputToken(res);
        });
    }
  }, [allChains]);

  const onButtonClick = async () => {
    if (!inToken || !protocolInputToken || !inTokenAmount) return;

    const route = await anyaltInstance?.getBestRoute({
      from: inToken.id,
      to: protocolInputToken?.id,
      amount: inTokenAmount,
      slippage,
    });

    setActiveRoute(route);
    setLoading(false);
    nextStep();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      size={activeStep === 1 ? '4xl' : 'lg'}
    >
      <Header />
      <CustomStepper activeStep={activeStep}>
        <SwappingWrapper
          title={loading ? 'Calculation' : 'Select Deposit Token'}
          buttonText={'Get Quote'}
          onButtonClick={onButtonClick}
          onConfigClick={() => {
            setOpenSlippageModal(true);
          }}
        >
          <SelectSwap
            loading={loading}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
          />
        </SwappingWrapper>
        <SwappingWrapper
          title={loading ? 'Calculation' : 'Select Deposit Token'}
          secondTitle="Routes"
          secondSubtitle="Please select preferred route"
          buttonText={
            loading ? 'Connect Wallet/s To Start Transaction' : 'Get Quote'
          }
          onButtonClick={() => {
            setLoading(true);
            nextStep();
            console.log('clicking');
          }}
          onConfigClick={() => {
            setOpenSlippageModal(true);
          }}
        >
          <RoutesWrapper
            loading={loading}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
          />
        </SwappingWrapper>
      </CustomStepper>
      <Footer />
    </ModalWrapper>
  );
};
