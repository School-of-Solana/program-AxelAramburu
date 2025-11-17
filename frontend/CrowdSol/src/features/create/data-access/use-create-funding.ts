import { Address, createSolanaClient, createTransaction, getBase58Decoder, getExplorerLink, getSignatureFromTransaction, sendAndConfirmTransactionFactory, sendTransactionWithoutConfirmingFactory, signAndSendTransactionMessageWithSigners, signTransactionMessageWithSigners } from 'gill'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useSolana } from '@/components/solana/use-solana'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
// import { useInvalidateGetBalanceQuery } from './use-invalidate-get-balance-query'
// import { useInvalidateGetSignaturesQuery } from './use-invalidate-get-signatures-query'
import { getCreateCrowdfundingInstruction } from '../../../../generated/ts/instructions/createCrowdfunding'
import { simulateTransaction } from '@coral-xyz/anchor/dist/cjs/utils/rpc'

export function useCreateFundingMutation({ account }: { account: UiWalletAccount; }) {
  const { client } = useSolana()
  const signer = useWalletUiSigner({ account })
  // const invalidateBalanceQuery = useInvalidateGetBalanceQuery({ address })
  // const invalidateSignaturesQuery = useInvalidateGetSignaturesQuery({ address })

  return useMutation({
    mutationFn: async (input: { vault: Address; duration: number; fundsGoal: number, title: string, description: string}) => {
      try {
        const ix = getCreateCrowdfundingInstruction({
              vaultCreator: signer,
              vault: input.vault,
              duration: Number(input.duration),
              fundsGoal: Number(input.fundsGoal),
              title: input.title,
              description: input.description,
            });
          
        console.log('Simulating instruction:', ix.accounts);
        console.log('Simulating instruction:', ix.data);
        console.log('Signer:', signer.address);
        console.log(client.rpc)
        console.log(client.rpcSubscriptions)
        console.log('Creating crowdfunding with input:', input)
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed', }).send()
        console.log('Latest blockhash:', latestBlockhash)
        const transaction = createTransaction({
          feePayer: signer.address,
          version: 'legacy',
          latestBlockhash,
          instructions: [ix],
        })

        console.log('Transaction created:', transaction.instructions)
        console.log('Transaction created:', transaction.lifetimeConstraint)
        console.log('Transaction created:', transaction.feePayer)
        console.log('Transaction created:', transaction.feePayer.address)

        const signedTx = await signTransactionMessageWithSigners(transaction);
        console.log('Signature Tx:', signedTx);
        // const signature = getSignatureFromTransaction(signedTx);
        // console.log('Signature :', signature);

        // console.log(getExplorerLink({ transaction: signature }));

        // const sig = await sendAndConfirmTransaction(signedTx);
        // const signatureBytes = await signAndSendTransactionMessageWithSigners(transaction);
        // console.log('Signature bytes:', signatureBytes);
        // const signature = getBase58Decoder().decode(signatureBytes);
        // console.log('Signature:', sig);
        // console.log(sig)
        // toastTx(sig, 'Crowdfunding created!');
        return "TEST"
      } catch (error: unknown) {
        console.log('error', `Transaction failed! ${error}`)
        toast.error('Failed to create crowdfunding');
        return
      }
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      // await Promise.all([invalidateBalanceQuery(), invalidateSignaturesQuery()])
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`)
    },
  })
}
