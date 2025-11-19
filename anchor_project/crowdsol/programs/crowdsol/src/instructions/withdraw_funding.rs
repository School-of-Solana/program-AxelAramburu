use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

use crate::states::{CSP_VAULT, VaultStatus};
use crate::{errors::CSError, states::{CSPVault}};

pub fn withdraw_funding(ctx: Context<CreateWithdrawFundingContext>) -> Result<()> {
    let owner = &mut ctx.accounts.owner;
    let vault = &mut ctx.accounts.vault;
    let now = Clock::get()?.unix_timestamp as u64;

    if now < vault.begin + vault.duration {
        return Err(CSError::VaultNotEnded.into());
    }
    match vault.status {
        VaultStatus::Open => {},
        VaultStatus::Withdrawn => {
            return Err(CSError::VaultAlreadyWithdrawn.into());
        }
    }

    msg!("Transfer lamports of the CSP Vault to owner");
    let amount = vault.amount;
    **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
    **owner.to_account_info().try_borrow_mut_lamports()? += amount;        

    vault.amount = 0;
    vault.status = VaultStatus::Withdrawn;

    Ok(())
}

#[derive(Accounts)] pub struct CreateWithdrawFundingContext<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [CSP_VAULT.as_bytes(), owner.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, CSPVault>,
    pub system_program: Program<'info, System>,
}