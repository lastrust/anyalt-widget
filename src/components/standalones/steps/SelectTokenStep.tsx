import { SelectSwap } from '../swap/SelectSwap';
import { SwappingWrapper } from '../wrappers/SwappingWrapper';

type Props = {
  failedToFetchRoute: boolean;
  loading: boolean;
  openSlippageModal: boolean;
  isValidAmountIn: boolean;
  onConfigClick: () => void;
  onGetQuote: () => void;
  setOpenSlippageModal: (open: boolean) => void;
};

export const SelectTokenStep = ({
  onConfigClick,
  failedToFetchRoute,
  onGetQuote,
  loading,
  openSlippageModal,
  setOpenSlippageModal,
  isValidAmountIn,
}: Props) => {
  return (
    <SwappingWrapper
      title={'Select Deposit Token'}
      onConfigClick={onConfigClick}
      failedToFetchRoute={failedToFetchRoute}
    >
      <SelectSwap
        buttonText={'Get Quote'}
        onButtonClick={onGetQuote}
        loading={loading}
        openSlippageModal={openSlippageModal}
        setOpenSlippageModal={setOpenSlippageModal}
        isValidAmountIn={isValidAmountIn}
      />
    </SwappingWrapper>
  );
};
