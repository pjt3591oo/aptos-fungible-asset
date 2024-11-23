import { Account, AccountAddress, Aptos, AptosConfig, Network, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);

// Token Module Account의 privatekey
const faModuleAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x6b48fe53f1cc65e9832b73a35fd4b7571fb7dffa4a0c90a4b653a612dde82c30')
});

const receiver = AccountAddress.fromString('0x8b4a3f6aa62686f86a2e1c1132d366f19cba0ff392e3fee9e6f5b6eeb2a45fc5');

async function main() {
  const amount = 100_000_000;
  const transaction = await client.transaction.build.simple({
    sender: faModuleAccount.accountAddress,
    data: {
      function: `${faModuleAccount.accountAddress}::fa_coin::mint`,
      functionArguments: [receiver, (amount * 100_000_000).toFixed()],
    },
  });

  const senderAuthenticator = await client.transaction.sign({ signer: faModuleAccount, transaction });
  const pendingTxn = await client.transaction.submit.simple({ transaction, senderAuthenticator });
  console.log(pendingTxn)
}

main();
