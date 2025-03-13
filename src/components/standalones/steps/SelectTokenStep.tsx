import { WidgetTemplateType } from '../../../types/global';
import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { SelectToken } from '../selectSwap/SelectToken';

type Props = {
  failedToFetchRoute: boolean;
  loading: boolean;
  openSlippageModal: boolean;
  isValidAmountIn: boolean;
  widgetTemplate: WidgetTemplateType;
  onConfigClick: () => void;
  setOpenSlippageModal: (open: boolean) => void;
  isButtonDisabled: boolean;
};

export const SelectTokenStep = ({
  onConfigClick,
  failedToFetchRoute,
  loading,
  openSlippageModal,
  setOpenSlippageModal,
  isValidAmountIn,
  widgetTemplate,
  isButtonDisabled,
}: Props) => {
  return (
    <SwappingTemplate
      title={
        widgetTemplate === 'TOKEN_BUY' ? 'Calculation' : 'Select Deposit Token'
      }
      onConfigClick={onConfigClick}
    >
      <SelectToken
        buttonText={'Get Quote'}
        onButtonClick={() => {}}
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
