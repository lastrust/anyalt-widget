import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { SelectToken } from '../selectSwap/SelectToken';

type Props = {
  failedToFetchRoute: boolean;
  loading: boolean;
  openSlippageModal: boolean;
  isValidAmountIn: boolean;
  isTokenBuyTemplate: boolean;
  onConfigClick: () => void;
  onGetQuote: (withGoNext: boolean) => void;
  setOpenSlippageModal: (open: boolean) => void;
  isButtonDisabled: boolean;
};

export const SelectTokenStep = ({
  onConfigClick,
  failedToFetchRoute,
  onGetQuote,
  loading,
  openSlippageModal,
  setOpenSlippageModal,
  isValidAmountIn,
  isTokenBuyTemplate,
  isButtonDisabled,
}: Props) => {
  return (
    <SwappingTemplate
      title={isTokenBuyTemplate ? 'Calculation' : 'Select Deposit Token'}
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
        isButtonDisabled={isButtonDisabled}
      />
    </SwappingTemplate>
  );
};
