use crate::instructions::*;
use anchor_lang::prelude::*;
mod instructions;

declare_id!("2vVPTgsNXh5GtpLBRxxc12BmbyTbgDq6nbmFBRZfzoHY");

#[program]
pub mod token_faucet {
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        token_symbol: String,
        token_decimal: u8,
        token_name: String,
        token_uri: String,
    ) -> Result<()> {
        instructions::handle_create_token(ctx, token_symbol, token_decimal, token_name, token_uri)
    }

    pub fn mint_token(ctx: Context<MintToken>, token_symbol: String, amount: u64) -> Result<()> {
        instructions::mint_token(ctx, token_symbol, amount)
    }
}
