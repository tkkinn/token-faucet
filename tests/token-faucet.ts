import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TokenFaucet } from "../target/types/token_faucet";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

describe("Token Faucet", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TokenFaucet as Program<TokenFaucet>;
  const admin = anchor.Wallet.local();
  const usdc_metadata = {
    token_symbol: "USDC",
    token_name: "USD Coin",
    token_decimals: 6,
    token_uri: ""
  };

  it("Create USDC token", async () => {
    const tx = await program.methods.createToken(usdc_metadata.token_symbol, usdc_metadata.token_decimals, usdc_metadata.token_name, usdc_metadata.token_uri)
      .accounts({
        signer: admin.publicKey
      }).rpc();

    console.log("Transaction Signature:", tx)
  });

  it("Mint USDC tokens", async () => {
    const admin_ata = getAssociatedTokenAddressSync(
			PublicKey.findProgramAddressSync([Buffer.from("mint"), Buffer.from(usdc_metadata.token_symbol)], program.programId)[0],
			admin.publicKey,
		);

    const tx = await program.methods.mintToken(usdc_metadata.token_symbol, new anchor.BN(1000000))
    .accounts({
      signer: admin.publicKey,
      associatedTokenAccount: admin_ata
    }).rpc();

    console.log("Transaction Signature:", tx)
  });

});