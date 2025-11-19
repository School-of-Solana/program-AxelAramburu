import { Address, createTransaction, getBase58Decoder, signAndSendTransactionMessageWithSigners } from 'gill'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useSolana } from '@/components/solana/use-solana'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { getWithdrawInstruction } from '../../../../generated/ts'


export function useWithdrawMutation({ account }: { account: UiWalletAccount; }) {
  const { client } = useSolana()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async (input: { vault: Address;}) => {
      try {
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        const ix = getWithdrawInstruction({
              owner: signer,
              vault: input.vault,
            });

        const transaction = createTransaction({
          feePayer: signer,
          version: 'legacy',
          latestBlockhash,
          instructions: [ix],
        })
        console.log(" transaction:", transaction)

        const signatureBytes = await signAndSendTransactionMessageWithSigners(transaction)
        console.log(" signatureBytes:", signatureBytes)
        const signature = getBase58Decoder().decode(signatureBytes)

        console.log("Signer address:", signer)
        console.log(" transaction:", transaction)
        console.log(" signatureBytes:", signatureBytes)
        console.log(" signature:", signature)

        console.log(signature)
        return signature
        // return "TEST"
      } catch (error: unknown) {
        console.log('error', `Transaction failed! ${error}`)
        toast.error('Failed to withdraw project');
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
