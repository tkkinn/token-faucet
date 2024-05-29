# Token Faucet
## Build the program
Before building the program, replace the program id to your own key. [PATH](programs/token-faucet/src/lib.rs)
```
declare_id!("your_own_program_id");
```
Build the program:
```
anchor build
```
## Deploy the program to localnet
### Though `solana-test-validator`
You may use the my released program directly with this method
```
solana-test-validator \
    --clone metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s -u m \
    --bpf-program 2vVPTgsNXh5GtpLBRxxc12BmbyTbgDq6nbmFBRZfzoHY "./path/to/program.so"
```
### Though `Anchor.toml`
You may use the my released program directly with this method
```
[[test.validator.clone]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"

[[test.genesis]]
address = "2vVPTgsNXh5GtpLBRxxc12BmbyTbgDq6nbmFBRZfzoHY"
program = "./path/to/program.so"
```
### Though `solana program deploy`
You should have mpl-metadata program (metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s) on your validator. 
```
solana program deploy <PROGRAM_FILEPATH> /path/to/program.so --keypair <KEYPAIR>
```

## SDK
### Install the SDK
```
yarn add @tkkinn/token-faucet-sdk
```
### Initialize the client
```
const faucetClient = new FaucetClient({
    provider
    wallet
});
```
### Create token
```
const txSig = await faucetClient.createToken(TOKEN_SYMBOL, TOKEN_DECIMAL, TOKEN_NAME, TOKEN_URI)
```
### Mint token
```
const txSig = await faucetClient.mintToken(TOKEN_SYMBOL, UI_TOKEN_NUMBER)
```
### Get token mint account address
```
const address = faucetClient.findTokenMintAddress(TOKEN_SYMBOL)
```