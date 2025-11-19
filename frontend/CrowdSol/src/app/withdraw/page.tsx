"use client"

import type React from "react"
import { useSolana } from "@/components/solana/use-solana"
import { AccountUiWithdrawFunding } from "@/features/withdraw/ui/account-ui-withdraw"

export default function WithdrawPage() {
  const { account } = useSolana()

  return (
    account ?
          <AccountUiWithdrawFunding account={account}/>
      : 
      <div className="flex justify-center items-center">
        Connect your wallet to create a crowdfunding project.
      </div>
  )
}
