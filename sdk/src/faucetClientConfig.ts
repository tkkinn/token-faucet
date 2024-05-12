import { AnchorProvider, Program } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { TokenFaucet } from "./types/token_faucet";

export type FaucetClientConfig = {
    wallet: NodeWallet;
    provider: AnchorProvider;
    program?: Program<TokenFaucet>;
    programId?: PublicKey;
    opts?: ConfirmOptions;
};