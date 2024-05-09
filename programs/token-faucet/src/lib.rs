use anchor_lang::prelude::*;

declare_id!("2vVPTgsNXh5GtpLBRxxc12BmbyTbgDq6nbmFBRZfzoHY");

#[program]
pub mod token_faucet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
