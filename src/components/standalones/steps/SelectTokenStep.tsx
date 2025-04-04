import { WidgetTemplateType } from '../../..';
import { SwappingTemplate } from '../../templates/SwappingTemplate';
import { SelectToken } from '../selectSwap/SelectToken';

type Props = {
  loading: boolean;
  activeStep: number;
  isValidAmountIn: boolean;
  isButtonDisabled: boolean;
  openSlippageModal: boolean;
  failedToFetchRoute: boolean;
  widgetTemplate: WidgetTemplateType;
  onConfigClick: () => void;
  setOpenSlippageModal: (open: boolean) => void;
};

export const SelectTokenStep = ({
  activeStep,
  loading,
  widgetTemplate,
  isValidAmountIn,
  isButtonDisabled,
  openSlippageModal,
  failedToFetchRoute,
  onConfigClick,
  setOpenSlippageModal,
}: Props) => {
  return (
    <SwappingTemplate
      title={
        widgetTemplate === 'TOKEN_BUY' ? 'Calculation' : 'Select Deposit Token'
      }
      onConfigClick={onConfigClick}
    >
      <SelectToken
        activeStep={activeStep}
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
