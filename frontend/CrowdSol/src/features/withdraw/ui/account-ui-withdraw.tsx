import { address, Address } from 'gill'
import { useState } from 'react'
import { UiWalletAccount } from '@wallet-ui/react'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useWithdrawMutation } from '../data-access/use-withdraw'
import { Button } from '@/components/ui/button'
import { getCSPVaultAddress } from '@/lib/utils'
import { PublicKey } from '@solana/web3.js'
import { CROWDSOL_PROGRAM_ADDRESS } from '../../../../generated/ts/programs/crowdsol'

export function AccountUiWithdrawFunding(props: { account: UiWalletAccount;}) {
  const mutation = useWithdrawMutation({ account: props.account})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {vaultAddress, bumpVault } = await getCSPVaultAddress(new PublicKey(props.account.publicKey), CROWDSOL_PROGRAM_ADDRESS);
    console.log('PDA is', vaultAddress.toBase58() as Address, 'with bump', bumpVault);
    await mutation.mutateAsync({
      vault: vaultAddress.toBase58() as Address
    })
    return false;
  }

  if (!props.account) {
    return <div>Wallet not connected</div>
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Withdraw my project</h2>
                  <span>This version is simple and one address can only have one project to make the DApp more simple, if you want to create another project, use another wallet</span>
                </div> 
                <div className="flex items-center justify-between border-t p-6">
                  <Button type="submit">Withdraw</Button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  )
}