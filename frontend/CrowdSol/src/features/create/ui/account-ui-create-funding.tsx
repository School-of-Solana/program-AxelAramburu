import { address, Address } from 'gill'
import { useState } from 'react'
import { UiWalletAccount } from '@wallet-ui/react'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useCreateFundingMutation } from '../data-access/use-create-funding'
import { Button } from '@/components/ui/button'
import { getCSPVaultAddress } from '@/lib/utils'
import { PublicKey } from '@solana/web3.js'
import { CROWDSOL_PROGRAM_ADDRESS } from '../../../../generated/ts/programs/crowdsol'

export function AccountUiCreateFunding(props: { account: UiWalletAccount;}) {
  const mutation = useCreateFundingMutation({ account: props.account})

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fundsGoal: "",
    duration: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    console.log('Submitting form with data:', formData);
    const {vaultAddress, bump } = await getCSPVaultAddress(new PublicKey(props.account.publicKey), CROWDSOL_PROGRAM_ADDRESS);
    console.log('PDA is', vaultAddress.toBase58() as Address, 'with bump', bump);
    await mutation.mutateAsync({
      vault: vaultAddress.toBase58() as Address,
      duration: Number(formData.duration) * 86400, // Convert days to seconds,
      fundsGoal: Number(formData.fundsGoal) * 1_000_000_000, // Convert SOL to lamports,
      title: formData.title,
      description: formData.description,
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
                  <h2 className="text-xl font-semibold mb-4">Create a Crowdfunding Project</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        maxLength={500}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fundsGoal">Funds Goal in SOL (Max. 100 SOL)</Label>
                      <Input
                        id="fundsGoal"
                        name="fundsGoal"
                        value={formData.fundsGoal}
                        onChange={handleInputChange}
                        required
                        type="number"
                        min={1}
                        max={100}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duration (~ 1 week to 3 months)</Label>
                      <Input
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                        type="number"
                        min={7}
                        max={90}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t p-6">
                  <Button type="submit">Create a project</Button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  )
}