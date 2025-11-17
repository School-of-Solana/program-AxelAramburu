"use client"

import type React from "react"
import { useSolana } from "@/components/solana/use-solana"
import { AccountUiCreateFunding } from "@/features/create/ui/account-ui-create-funding"
import { ErrorBoundary } from "next/dist/client/components/error-boundary"

export default function CreatePage() {
    const { account } = useSolana()

  return (
    account ?
        <ErrorBoundary errorComponent={() => null}>
          <AccountUiCreateFunding account={account}></AccountUiCreateFunding>
        </ErrorBoundary>
      : 
      <div className="flex justify-center items-center">
        Connect your wallet to create a crowdfunding project.
      </div>
  )
}
