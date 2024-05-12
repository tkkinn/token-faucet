var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  FaucetClient: () => FaucetClient
});
module.exports = __toCommonJS(src_exports);

// src/faucetClient.ts
var import_anchor = require("@coral-xyz/anchor");
var import_web3 = require("@solana/web3.js");

// src/idl/token_faucet.json
var token_faucet_default = {
  address: "2vVPTgsNXh5GtpLBRxxc12BmbyTbgDq6nbmFBRZfzoHY",
  metadata: {
    name: "token_faucet",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor"
  },
  instructions: [
    {
      name: "create_token",
      discriminator: [
        84,
        52,
        204,
        228,
        24,
        140,
        234,
        75
      ],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true
        },
        {
          name: "mint_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                kind: "arg",
                path: "token_symbol"
              }
            ]
          }
        },
        {
          name: "metadata_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                kind: "account",
                path: "token_metadata_program"
              },
              {
                kind: "account",
                path: "mint_account"
              }
            ],
            program: {
              kind: "account",
              path: "token_metadata_program"
            }
          }
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          name: "token_metadata_program",
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        },
        {
          name: "rent",
          address: "SysvarRent111111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "token_symbol",
          type: "string"
        },
        {
          name: "token_decimal",
          type: "u8"
        },
        {
          name: "token_name",
          type: "string"
        },
        {
          name: "token_uri",
          type: "string"
        }
      ]
    },
    {
      name: "mint_token",
      discriminator: [
        172,
        137,
        183,
        14,
        207,
        110,
        234,
        56
      ],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true
        },
        {
          name: "mint_account",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                kind: "arg",
                path: "token_symbol"
              }
            ]
          }
        },
        {
          name: "associated_token_account",
          writable: true
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111"
        }
      ],
      args: [
        {
          name: "token_symbol",
          type: "string"
        },
        {
          name: "amount",
          type: "u64"
        }
      ]
    }
  ]
};

// src/faucetClient.ts
var import_spl_token = require("@solana/spl-token");
var FaucetClient = class {
  constructor(config) {
    if (!config.program) {
      const a = JSON.stringify(token_faucet_default);
      const token_faucet_idl = JSON.parse(a);
      this.program = new import_anchor.Program(token_faucet_idl);
    } else {
      this.program = config.program;
    }
    this.provider = config.provider;
    this.wallet = config.wallet;
    this.opts = config.opts;
  }
  async buildCreateTokenTx(token_symbol, token_decimals, token_name, token_uri) {
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
  async buildMintTokenTx(token_symbol, amount) {
    const signer_ata = (0, import_spl_token.getAssociatedTokenAddressSync)(
      import_web3.PublicKey.findProgramAddressSync([Buffer.from("mint"), Buffer.from(token_symbol)], this.program.programId)[0],
      this.wallet.publicKey
    );
    const tx = await this.program.methods.mintToken(
      token_symbol,
      new import_anchor.BN(amount)
    ).accounts({
      signer: this.wallet.publicKey,
      associatedTokenAccount: signer_ata
    }).instruction();
    return tx;
  }
  async createToken(token_symbol, token_decimals, token_name, token_uri) {
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
  async mintToken(token_symbol, amount) {
    const signer_ata = (0, import_spl_token.getAssociatedTokenAddressSync)(
      import_web3.PublicKey.findProgramAddressSync([Buffer.from("mint"), Buffer.from(token_symbol)], this.program.programId)[0],
      this.wallet.publicKey
    );
    const mintToken = await this.program.methods.mintToken(
      token_symbol,
      new import_anchor.BN(amount)
    ).accounts({
      signer: this.wallet.publicKey,
      associatedTokenAccount: signer_ata
    }).signers([this.wallet.payer]).instruction();
    const transaction = await this.v0_pack([mintToken]);
    const txId = await this.provider.connection.sendTransaction(transaction, this.opts);
    return txId;
  }
  findTokenMintAddress(token_symbol) {
    return import_web3.PublicKey.findProgramAddressSync([Buffer.from("mint"), Buffer.from(token_symbol)], this.program.programId)[0];
  }
  async v0_pack(instructions) {
    const blockhash = await this.provider.connection.getLatestBlockhash().then((res) => res.blockhash);
    const messageV0 = new import_web3.TransactionMessage({
      payerKey: this.wallet.publicKey,
      recentBlockhash: blockhash,
      instructions
    }).compileToV0Message();
    const transaction = new import_web3.VersionedTransaction(messageV0);
    transaction.sign([this.wallet.payer]);
    return transaction;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FaucetClient
});
