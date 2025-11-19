use anchor_lang::prelude::*;

pub const TITLE_LENGTH: usize = 50;
pub const DESC_LENGTH: usize = 500;
pub const COMMENT_LENGTH: usize = 200;
pub const MIN_DURATION: u64 = 604800; // 1 week in seconds
pub const MAX_DURATION: u64 = 7889238; // 3 months in seconds

pub const CSP_VAULT: &str = "csp_vault";
pub const USER_PARTICIPATION: &str = "user_participation";

#[derive(AnchorDeserialize, AnchorSerialize, Clone, InitSpace)]
pub enum VaultStatus {
    Open,
    Withdrawn,
}

#[account]
#[derive(InitSpace)]
pub struct CSPVault {
    pub owner: Pubkey,
    pub begin: u64,
    pub duration: u64,
    #[max_len(TITLE_LENGTH)]
    pub title: String,
    #[max_len(DESC_LENGTH)]
    pub description: String,
    pub amount: u64,
    pub funds_goal: u64,
    pub nonce: u64,
    pub status: VaultStatus,
    pub bump: u8,
}
#[account]
#[derive(InitSpace)]
pub struct UserParticipation {
    pub user: Pubkey,
    pub csp_vault: Pubkey,
    pub time: u64,
    pub amount: u64,
        #[max_len(COMMENT_LENGTH)]
    pub comment: String,
    pub vault_nonce: u64,
    pub bump: u8,
}