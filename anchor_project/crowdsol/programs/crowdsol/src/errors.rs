use anchor_lang::prelude::*;

#[error_code]
pub enum CSError {
    #[msg("Duration of the campaign is too short")]
    DurationTooShort,
    #[msg("Duration of the campaign is too long")]
    DurationTooLong,
    #[msg("Title length is incorrect")]
    TitleWrongLength,
    #[msg("Description length is incorrect")]
    DescriptionWrongLength,
    #[msg("Comment length is incorrect")]
    CommentWrongLength,
    #[msg("Campaign vault is ended")]
    VaultEnded,
    #[msg("Campaign vault is not ended")]
    VaultNotEnded,
    #[msg("Vault is already withdrawn")]
    VaultAlreadyWithdrawn,
    #[msg("Amount is zero")]
    AmountZero,

}