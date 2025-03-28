import { AnyAlt, PendingTransactionRequestDto } from '@anyalt/sdk';

// Function to submit the pending transaction
export const submitPendingTransaction = async (
  aaInstance: AnyAlt,
  request: PendingTransactionRequestDto,
) => {
  try {
    await aaInstance.submitPendingTransaction({
      operationId: request.operationId,
      type: request.type,
      txHash: request.txHash,
      nonce: request.nonce,
      signerAddress: request.signerAddress,
    });
    console.log('Pending transaction submitted:', request);
  } catch (error) {
    console.error('Error submitting pending transaction:', error);
    throw new Error('Failed to submit pending transaction.');
  }
};
