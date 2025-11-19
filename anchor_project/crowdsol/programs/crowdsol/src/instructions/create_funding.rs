use anchor_lang::prelude::*;

use crate::{errors::CSError, states::{CSP_VAULT, CSPVault, DESC_LENGTH, MAX_DURATION, MIN_DURATION, TITLE_LENGTH, VaultStatus}};

pub fn create_funding(ctx: Context<CreateFundingContext>, duration: u64, funds_goal: u64, title: String, description: String) -> Result<()> {
    if duration < MIN_DURATION {
        return Err(CSError::DurationTooShort.into());
    }
    if duration > MAX_DURATION {
        return Err(CSError::DurationTooLong.into());
    }
    if title.len() > TITLE_LENGTH || title.len() == 0 {
        return Err(CSError::TitleWrongLength.into());
    }
    if description.len() > DESC_LENGTH || description.len() == 0 {
        return Err(CSError::DescriptionWrongLength.into());
    }

    let vault = &mut ctx.accounts.vault;
    let now = Clock::get()?.unix_timestamp as u64;

    vault.owner = ctx.accounts.vault_creator.key();
    vault.begin = now;
    vault.duration = duration;
    vault.title = title;
    vault.description = description;
    vault.amount= 0;
    vault.funds_goal = funds_goal;
    vault.nonce = 0;
    vault.status = VaultStatus::Open;
    vault.bump = ctx.bumps.vault;
    Ok(())
}

#[derive(Accounts)]
pub struct CreateFundingContext<'info> {
    #[account(mut)]
    pub vault_creator: Signer<'info>,
    #[account(
        init, 
        payer = vault_creator, 
        space = 8 + CSPVault::INIT_SPACE,
        seeds = [CSP_VAULT.as_bytes(), vault_creator.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, CSPVault>,
    pub system_program: Program<'info, System>,
}