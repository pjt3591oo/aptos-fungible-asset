import { compilePackage, getPackageBytesToPublish } from "./utils";
import { Account, AccountAddress, Aptos, AptosConfig, Network, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);

const faModuleAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x6b48fe53f1cc65e9832b73a35fd4b7571fb7dffa4a0c90a4b653a612dde82c30')
})

async function main() {
  // compile
  compilePackage(
    "move/facoin",
    "move/facoin/facoin.json",
    [{ name: "FACoin", address: faModuleAccount.accountAddress }]
  );

  // publish
  const { metadataBytes, byteCode } = getPackageBytesToPublish("move/facoin/facoin.json");

  const transaction = await client.publishPackageTransaction({
    account: faModuleAccount.accountAddress,
    metadataBytes,
    moduleBytecode: byteCode,
  });
  const response = await client.signAndSubmitTransaction({
    signer: faModuleAccount,
    transaction,
  });

  console.log(`Transaction hash: ${response.hash}`);
  await client.waitForTransaction({
    transactionHash: response.hash,
  });
}

main();