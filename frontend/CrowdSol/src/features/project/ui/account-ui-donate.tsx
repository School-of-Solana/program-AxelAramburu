import { address, Address } from 'gill'
import { useState } from 'react'
import { UiWalletAccount } from '@wallet-ui/react'
import { AppModal } from '@/components/app-modal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
// import { useCreateFundingMutation } from '../data-access/use-donate'
import { Button } from '@/components/ui/button'
import Image from "next/image"
import { projects } from "@/lib/datas"
import { getCSPVaultAddress, getUserParticipationAddress } from '@/lib/utils'
import { PublicKey } from '@solana/web3.js'
import { CROWDSOL_PROGRAM_ADDRESS } from '../../../../generated/ts/programs/crowdsol'
import { Send } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useDonateMutation } from '../data-access/use-donate'
import placeholder from '../../../../placeholder.png'

export function AccountUiDonate(props: { account: UiWalletAccount; id: string}) {
  const mutation = useDonateMutation({ account: props.account})
  const router = useRouter()

  const project = projects.find((p) => p.id === props.id.toString());

  const [formData, setFormData] = useState({
    amount: "",
    comment: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (!project) {
    return (
    <div className="container px-4 py-12 md:px-6 md:py-24 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">This project not exist...</h1>
        <p className="text-muted-foreground mt-2">You can search it on the projects page</p>
        <Button className="mt-4" onClick={() => router.push("/projects")}>
        See Projects
        </Button>
    </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    const {vaultAddress, bumpVault } = await getCSPVaultAddress(new PublicKey(project.id as unknown as PublicKey), CROWDSOL_PROGRAM_ADDRESS);
    console.log('PDA Vault is', vaultAddress.toBase58() as Address, 'with bump', bumpVault);
    // TODO Fetch data for nonce
    const nonce = 0;
    const {upAddress, bumpUp } = await getUserParticipationAddress(vaultAddress, new PublicKey(props.account.publicKey), nonce, CROWDSOL_PROGRAM_ADDRESS);
    console.log('PDA UP is', upAddress.toBase58() as Address, 'with bump', bumpUp);
    await mutation.mutateAsync({
      participation: upAddress.toBase58() as Address,
      vault: vaultAddress.toBase58() as Address,
      amount: Number(formData.amount), // In lamports
      comment: formData.comment,
    })
    return false;
  }

  if (!props.account) {
    return <div>Wallet not connected</div>
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="flex items-center justify-center overflow-hidden rounded-lg bg-muted">
          <Image
            src={placeholder}
            alt={project.name}
            width={600}
            height={600}
            className="aspect-square object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {/* <p className="text-xl font-semibold mt-2">¥{project.price.toFixed(2)}</p> */}
          </div>

          <div className="prose max-w-none">
            <p>{project.description}</p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm font-medium">Amount :</span>
            <div className="grid gap-2">
                <Input
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                type='number'
                min={1}
                max={100000000000}  // 100 SOL
                />
            </div>
            <span className="text-sm font-medium">{"(in lamports)"}</span>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm font-medium">Comment :</span>
            <div className="grid gap-2">
                <Input
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                required
                />
            </div>
          </div>

          <Button className="mt-6" size="lg" onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Donate to the project
          </Button>

          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Infos</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div className="font-medium">Actual amounts : </div>
                <div>{project.amount} SOL</div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div className="font-medium">Goal :</div>
                <div>{project.fundsGoal} SOL</div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div className="font-medium">Creator : </div>
                <div>{project.creator}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-b pb-3">
                <div className="font-medium">Vault address : </div>
                <div>{project.id.substr(0, 4)}....{project.id.substr(project.id.length - 4, project.id.length)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}