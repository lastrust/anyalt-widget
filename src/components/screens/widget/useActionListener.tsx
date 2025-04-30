import { useEffect } from 'react';
import { ActionType, useActionQueue } from '../../../store/stateStore';

type Props = {
  updateStepsOfCurrentRoute: () => Promise<void>;
};

function useActionListener({ updateStepsOfCurrentRoute }: Props) {
  const { actions, clearQueue } = useActionQueue();

  useEffect(() => {
    if (actions.length > 0) {
      actions.forEach((action) => {
        switch (action.type) {
          case ActionType.SWAP_FAILED:
            console.debug('Swap failed:', action.payload.error);
            // We're doing this in case there was a partial fail
            // In which case the backend might have modified the current step and added a new one
            updateStepsOfCurrentRoute();
            break;

          default:
            console.warn('Unknown action type:', action.type);
        }
      });

      // Clear the queue after processing
      clearQueue();
    }
  }, [actions, clearQueue]);
}

export default useActionListener;
