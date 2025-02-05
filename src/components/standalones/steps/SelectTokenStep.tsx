import { SelectSwap } from '../swap/SelectSwap';
import { SwappingWrapper } from '../wrappers/SwappingWrapper';

type Props = {
  failedToFetchRoute: boolean;
  loading: boolean;
  openSlippageModal: boolean;
  isValidAmountIn: boolean;
  onConfigClick: () => void;
  onGetQuote: (withGoNext: boolean    ) => void;
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
    >
      <SelectSwap
        refetchCallback={onGetQuote}
        buttonText={'Get Quote'}
        onButtonClick={() => onGetQuote(false)}
        loading={loading}
        openSlippageModal={openSlippageModal}
        setOpenSlippageModal={setOpenSlippageModal}
        isValidAmountIn={isValidAmountIn}
        failedToFetchRoute={failedToFetchRoute}
        // borderRadius="12px"
        // p="24px"
        // borderWidth="1px"
        // borderColor="brand.border.primary"
      />
    </SwappingWrapper>
  );
};
