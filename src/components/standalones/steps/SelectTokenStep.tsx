import { useMemo } from 'react';
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
  const title = useMemo(() => {
    return widgetTemplate === 'TOKEN_BUY'
      ? 'Calculation'
      : 'Select Deposit Token';
  }, [widgetTemplate]);

  return (
    <SwappingTemplate
      title={title}
      onConfigClick={onConfigClick}
      enableWidgetMode
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
