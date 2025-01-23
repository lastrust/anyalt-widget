import { ConnectWalletsModal } from '../../standalones/modals/ConnectWalletsModal';
import ModalWrapper from '../../standalones/modals/ModalWrapper';
import CustomStepper from '../../standalones/stepper/Stepper';
import { SelectSwap } from '../../standalones/swap/SelectSwap';
import { Footer } from '../../standalones/widget/Footer';
import { Header } from '../../standalones/widget/Header';

export { useModal } from '../../../hooks/useModal';
export {
  defaultTheme,
  defaultTheme as standardTheme,
} from '../../../theme/defaultTheme';
export { OpenModalButton } from '../../atoms/buttons/OpenModalButton';

import { AnyaltWidgetProps } from '../../..';
import { useAnyaltWidget } from '../../../hooks/useAnyaltWidget';
import { TransactionSwap } from '../../standalones/transaction/TransactionSwap';
import { RoutesWrapper } from '../../standalones/wrappers/RoutesWrapper';
import { SwappingWrapper } from '../../standalones/wrappers/SwappingWrapper';

export const AnyaltWidgetWrapper = ({
  isOpen,
  onClose,
  apiKey,
  inputToken,
  finalToken,
  estimateCallback,
}: AnyaltWidgetProps) => {
  const {
    loading,
    activeRoute,
    activeStep,
    onCalculateButtonClick,
    onChooseRouteButtonClick,
    onConfigClick,
    isSolanaConnected,
    isEvmConnected,
    openSlippageModal,
    setOpenSlippageModal,
    isConnectWalletsOpen,
    connectWalletsClose,
  } = useAnyaltWidget({
    estimateCallback,
    inputToken,
    finalToken,
    apiKey,
  });

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      size={activeStep === 0 ? 'lg' : '4xl'}
    >
      <Header>{activeStep === 2 ? 'Transaction' : 'Start Transaction'}</Header>
      <CustomStepper activeStep={activeStep}>
        <SwappingWrapper
          loading={loading}
          title={loading ? 'Calculation' : 'Select Deposit Token'}
          buttonText={'Get Quote'}
          onButtonClick={onCalculateButtonClick}
          onConfigClick={onConfigClick}
        >
          <SelectSwap
            loading={loading}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
          />
        </SwappingWrapper>
        <SwappingWrapper
          loading={loading}
          title={'Calculation'}
          secondTitle="Routes"
          secondSubtitle="Please select preferred route"
          buttonText={
            activeRoute
              ? isSolanaConnected && isEvmConnected
                ? 'Start Transaction'
                : 'Connect Wallet/s To Start Transaction'
              : 'Get Quote'
          }
          onButtonClick={onChooseRouteButtonClick}
          onConfigClick={onConfigClick}
        >
          <RoutesWrapper
            loading={loading}
            openSlippageModal={openSlippageModal}
            setOpenSlippageModal={setOpenSlippageModal}
          />
        </SwappingWrapper>
        <SwappingWrapper
          hideButton
          loading={loading}
          buttonText="Approve"
          onButtonClick={() => {
            console.log('Approve');
          }}
          onConfigClick={onConfigClick}
        >
          <TransactionSwap
            exchangeName="Anyalt"
            transactionDetails={{
              requestId: 'j48n3b',
              gasPrice: '1.5',
              time: '50',
              profit: '-0.05%',
              from: {
                name: 'ETH',
                icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
                amount: '1.000',
                usdAmount: '2430',
                chainName: 'Ethereum',
                chainIcon:
                  'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
              },
              to: {
                name: 'ETH',
                icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
                amount: '1.000',
                usdAmount: '2430',
                chainName: 'Ethereum',
                chainIcon:
                  'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
              },
              status: 'pending',
            }}
          />
        </SwappingWrapper>
      </CustomStepper>
      <Footer />
      <ConnectWalletsModal
        isSolanaConnected={isSolanaConnected}
        isEvmConnected={isEvmConnected}
        isOpen={isConnectWalletsOpen}
        onClose={() => {
          connectWalletsClose();
        }}
        onConfirm={connectWalletsClose}
        title="Connect Wallet's"
      />
    </ModalWrapper>
  );
};
