use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

use crate::states::{CSP_VAULT, USER_PARTICIPATION};
use crate::{errors::CSError, states::{COMMENT_LENGTH, CSPVault, UserParticipation}};

pub fn participate(ctx: Context<CreateParticipateContext>, amount: u64, comment: String) -> Result<()> {
    let participation = &mut ctx.accounts.participation;
    let vault = &mut ctx.accounts.vault;
    let now = Clock::get()?.unix_timestamp as u64;

    if comment.len() > COMMENT_LENGTH {
        return Err(CSError::CommentWrongLength.into());
    }
    if now >= vault.begin + vault.duration {
        return Err(CSError::VaultEnded.into());
    }
    if amount == 0 {
        return Err(CSError::AmountZero.into());
    }

    msg!("Transfer lamports to CSP Vault");
    invoke(
        &system_instruction::transfer(
            &ctx.accounts.participant.key(),
            &vault.key(),
            amount
        ),
        &[
            ctx.accounts.participant.to_account_info(),
            vault.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;

    participation.user = ctx.accounts.participant.key();
    participation.csp_vault = vault.key();
    participation.time = now;
    participation.amount = amount;
    participation.comment = comment;
    participation.vault_nonce = vault.nonce;
    participation.bump = ctx.bumps.participation;

    let nonce = vault.nonce.checked_add(1).unwrap();
    vault.nonce = nonce;
    vault.amount = vault.amount.checked_add(amount).unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct CreateParticipateContext<'info> {
    #[account(mut)]
    pub participant: Signer<'info>,
    #[account(
        init, 
        payer = participant, 
        space = 8 + UserParticipation::INIT_SPACE,
        seeds = [USER_PARTICIPATION.as_bytes(), vault.key().as_ref(), participant.key().as_ref(), vault.nonce.to_le_bytes().as_ref()],
        bump
    )]
    pub participation: Account<'info, UserParticipation>,
    #[account(
        mut,
        seeds = [CSP_VAULT.as_bytes(), vault.owner.as_ref()],
        bump
    )]
    pub vault: Account<'info, CSPVault>,
    pub system_program: Program<'info, System>,
}