import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { FaucetClientConfig } from "./faucetClientConfig";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { ConfirmOptions, PublicKey, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { TokenFaucet } from "./types/token_faucet";
import idl from "./idl/token_faucet.json";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export class FaucetClient {
	provider: AnchorProvider;
	wallet: NodeWallet;
	public program: Program<TokenFaucet>;
	opts?: ConfirmOptions;

	public constructor(config: FaucetClientConfig) {
		if (!config.program) {
			const a = JSON.stringify(idl)
			const token_faucet_idl = JSON.parse(a)
			this.program = new Program(token_faucet_idl);
		} else {
			this.program = config.program;
		}
		this.provider = config.provider;
		this.wallet = config.wallet;
		this.opts = config.opts;
	}

	public async buildCreateTokenTx(
		token_symbol: string,
		token_decimals: number,
		token_name: string,
		token_uri: string
	) {
		const tx = await this.program.methods.createToken(
			token_symbol,
			token_decimals,
			token_name,
			token_uri
		).accounts({
			signer: this.wallet.publicKey
		}).instruction();

		return tx;
	}

	public async buildMintTokenTx(
		token_symbol: string,
		amount: number
	) {
		const signer_ata = getAssociatedTokenAddressSync(
			PublicKey.findProgramAddressSync([Buffer.from("mint"), Buffer.from(token_symbol)], this.program.programId)[0],
			this.wallet.publicKey,
		);

		const tx = await this.program.methods.mintToken(
			token_symbol,
			new BN(amount)
		).accounts({
			signer: this.wallet.publicKey,
			associatedTokenAccount: signer_ata
		}).instruction();

		return tx;
	}

	public async createToken(
		token_symbol: string,
		token_decimals: number,
		token_name: string,
		token_uri: string
	) {
		const createToken = await this.program.methods.createToken(
			token_symbol,
			token_decimals,
			token_name,
			token_uri
		).accounts({
			signer: this.wallet.publicKey
		}).instruction();
		
		const transaction = await this.v0_pack([createToken]);
		const txId = await this.provider.connection.sendTransaction(transaction, this.opts);
		return txId;
	}

	public async mintToken(
		token_symbol: string,
		amount: number
	) {
		const signer_ata = getAssociatedTokenAddressSync(
			PublicKey.findProgramAddressSync([Buffer.from("mint"), Buffer.from(token_symbol)], this.program.programId)[0],
			this.wallet.publicKey,
		);

		const mintToken = await this.program.methods.mintToken(
			token_symbol,
			new BN(amount)
		).accounts({
			signer: this.wallet.publicKey,
			associatedTokenAccount: signer_ata
		}).signers([this.wallet.payer]).instruction();

		const transaction = await this.v0_pack([mintToken]);
		const txId = await this.provider.connection.sendTransaction(transaction, this.opts);
		return txId;
	}

	async v0_pack(instructions: TransactionInstruction[]) {
		const blockhash = await this.provider.connection
        .getLatestBlockhash()
        .then(res => res.blockhash);

		const messageV0 = new TransactionMessage({
			payerKey: this.wallet.publicKey,
			recentBlockhash: blockhash,
			instructions,
		}).compileToV0Message();
		
		const transaction = new VersionedTransaction(messageV0);
		transaction.sign([this.wallet.payer]);

		return transaction;
	}

}