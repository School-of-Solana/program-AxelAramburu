import { Address, createTransaction, getBase58Decoder, signAndSendTransactionMessageWithSigners } from 'gill'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useSolana } from '@/components/solana/use-solana'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { getCreateCrowdfundingInstruction } from '../../../../generated/ts/instructions/createCrowdfunding'
import { getDonateInstruction } from '../../../../generated/ts'


export function useDonateMutation({ account }: { account: UiWalletAccount; }) {
  const { client } = useSolana()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async (input: { participation: Address; vault: Address; amount: number; comment: string}) => {
      try {
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        const ix = getDonateInstruction({
              participant: signer,
              participation: input.participation,
              vault: input.vault,
              amount: Number(input.amount),
              comment: input.comment,
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
        console.log(" transaction:", transaction)
        console.log(" signatureBytes:", signatureBytes)
        console.log(" signature:", signature)

        console.log(signature)
        return signature
        // return "TEST"
      } catch (error: unknown) {
        console.log('error', `Transaction failed! ${error}`)
        toast.error('Failed to donate to the project');
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
