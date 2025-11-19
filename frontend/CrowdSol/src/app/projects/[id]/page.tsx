"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projects } from "@/lib/datas"
import { Input } from "@/components/ui/input"
import { useSolana } from "@/components/solana/use-solana"
import { AccountUiDonate } from "@/features/project/ui/account-ui-donate"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { account } = useSolana()
  const { id } = use(params); 
  return (
    account ? 
     <AccountUiDonate account={account} id={id}/>
           : 
      <div className="flex justify-center items-center">
        Connect your wallet to create a crowdfunding project.
      </div>
  )
}
