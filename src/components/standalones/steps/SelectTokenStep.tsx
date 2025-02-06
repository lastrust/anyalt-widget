import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { SelectToken } from '../selectSwap/SelectToken';

type Props = {
  failedToFetchRoute: boolean;
  loading: boolean;
  openSlippageModal: boolean;
  isValidAmountIn: boolean;
  onConfigClick: () => void;
  onGetQuote: (withGoNext: boolean) => void;
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
    <SwappingTemplate
      title={'Select Deposit Token'}
      onConfigClick={onConfigClick}
    >
      <SelectToken
        buttonText={'Get Quote'}
        onButtonClick={() => onGetQuote(true)}
        loading={loading}
        openSlippageModal={openSlippageModal}
        setOpenSlippageModal={setOpenSlippageModal}
        isValidAmountIn={isValidAmountIn}
        failedToFetchRoute={failedToFetchRoute}
      />
    </SwappingTemplate>
  );
};
