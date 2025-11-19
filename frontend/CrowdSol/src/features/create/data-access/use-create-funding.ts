import { Address, createNoopSigner, createTransaction, generateKeyPairSigner, getBase58Decoder, getSignatureFromTransaction, signAndSendTransactionMessageWithSigners, signTransactionMessageWithSigners } from 'gill'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useSolana } from '@/components/solana/use-solana'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { getCreateCrowdfundingInstruction } from '../../../../generated/ts/instructions/createCrowdfunding'
import { sendAndConfirmTransaction } from '@solana/web3.js'


export function useCreateFundingMutation({ account }: { account: UiWalletAccount; }) {

  const { client } = useSolana()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async (input: { vault: Address; duration: number; fundsGoal: number, title: string, description: string}) => {
      try {
        // const signer = createNoopSigner(sig.address);
        console.log(signer);

        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        const ix = getCreateCrowdfundingInstruction({
              vaultCreator: signer,
              vault: input.vault,
              duration: Number(input.duration),
              fundsGoal: Number(input.fundsGoal),
              title: input.title,
              description: input.description,
            });

        const transaction = createTransaction({
          feePayer: signer,
          version: 'legacy',
          latestBlockhash,
          instructions: [ix],
        })
        console.log(" transaction:", transaction)

        const signedTransaction = await signAndSendTransactionMessageWithSigners(transaction)
        console.log(signedTransaction)
        // const signature = getSignatureFromTransaction(signedTransaction);
        // console.log("Sending transaction:", signature);
        const signature = getBase58Decoder().decode(signedTransaction)
        // try {
        //   await client.sendAndConfirmTransaction(signedTransaction);
        
        //   console.log("Transaction confirmed!");
        // } catch (err) {
        //   console.error("Unable to send and confirm the transaction");
        //   console.error(err);
        // }
        // console.log(" signatureBytes:", signatureBytes)


        // console.log("Signer address:", signer)
        // console.log(" transaction:", transaction)
        // console.log(" signatureBytes:", signatureBytes)
        // console.log(" signature:", signature)

        // console.log(signature)
        // return signature
        return signature
      } catch (error: unknown) {
        console.log('error', `Transaction failed! ${error}`)
        toast.error('Failed to create crowdfunding');
        return
      }
    },
    onSuccess: async (tx) => {
      toastTx(tx)
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`)
    },
  })
}
