import { SwappingWrapper } from '../wrappers/SwappingWrapper';
import { TransactionComplete } from '../wrappers/TransactionComplete';

type Props = {
  onConfigClick: () => void;
  onClose: () => void;
  setActiveStep: (step: number) => void;
};

export const CompleteStep = ({
  onConfigClick,
  onClose,
  setActiveStep,
}: Props) => {
  return (
    <SwappingWrapper failedToFetchRoute={false} onConfigClick={onConfigClick}>
      <TransactionComplete
        onTransactionDoneClick={() => {
          onClose();
          setActiveStep(0);
        }}
      />
    </SwappingWrapper>
  );
};
