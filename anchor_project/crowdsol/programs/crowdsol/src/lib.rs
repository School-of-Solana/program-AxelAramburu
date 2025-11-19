use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("8tyRHod4FeXM6ZH4ELCm3JifjsKCd1A7fAPJZrxAqJEw");

#[program]
pub mod crowdsol {
    use super::*;

    pub fn create_crowdfunding(ctx: Context<CreateFundingContext>, duration: u64, funds_goal: u64, title: String, description: String) -> Result<()> {
        create_funding(ctx, duration, funds_goal, title, description)
    }
    pub fn donate(ctx: Context<CreateParticipateContext>, amount: u64, comment: String) -> Result<()> {
        participate(ctx, amount, comment)
    }
    pub fn withdraw(ctx: Context<CreateWithdrawFundingContext>) -> Result<()> {
        withdraw_funding(ctx)
    }
}