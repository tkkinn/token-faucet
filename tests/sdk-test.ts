import * as anchor from "@coral-xyz/anchor";
import { FaucetClient } from "../sdk/src"

describe("Token Faucet SDK", () => {
    let faucetClient: FaucetClient;
    faucetClient = new FaucetClient({
        provider: anchor.AnchorProvider.env(),
        wallet: anchor.Wallet.local()
    });

    it("Create USDC token", async () => {
        const tx = await faucetClient.createToken("devUSDC", 6, "USD Coin", "");
        console.log("Transaction Signature:", tx)
    });

    it("Mint 100 USDC tokens", async () => {
        const tx = await faucetClient.mintToken("devUSDC", 100);
        console.log("Transaction Signature:", tx)
    });
});