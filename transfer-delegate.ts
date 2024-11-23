import { Account, AccountAddress, Aptos, AptosConfig, Network, Ed25519PrivateKey, InputViewFunctionData } from "@aptos-labs/ts-sdk";

const network = Network.LOCAL;
const config = new AptosConfig({ network });
const client = new Aptos(config);

const faModuleAccount = AccountAddress.fromString('da3c58693fec3b02a9004c8e3a693b4ea2d6def7cda3373e99c7e0b3fef6e3a5');

const from = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey('0xff9002e00b19956f47cc7ad960262eb6147bfb43ac998afbfdb692e20c0320a0')
});

const to = AccountAddress.from('6f1d39283094758d5b9d9179fec7394c724d468133b690930c71411ecdca86dc')

const feePayerAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('0x0a71d2808d3401ae26eafa609042c12e530cad5d05ece033578ae7fa80ec65a4')
});

async function main() {
  const payload: InputViewFunctionData = {
    function: `${faModuleAccount.toString()}::fa_coin::get_metadata`,
    functionArguments: [],
  };
  const res = (await client.view<[{ inner: string }]>({
    payload,

  }))[0];

  const metadataAddress = res.inner;
  const amount = 10_000_000;

  const transaction = await client.transaction.build.simple({
    sender: from.accountAddress,
    withFeePayer: true,
    data: {
      function: "0x1::primary_fungible_store::transfer",
      typeArguments: ["0x1::fungible_asset::Metadata"],
      functionArguments: [metadataAddress, to, amount],
    },
  });


  const senderSignature = await client.transaction.sign({
    signer: from,
    transaction,
  });

  const sponsorSignature = await client.transaction.signAsFeePayer({
    signer: feePayerAccount,
    transaction,
  });

  const pendingTxn = await client.transaction.submit.simple({
    transaction,
    senderAuthenticator: senderSignature,
    feePayerAuthenticator: sponsorSignature,
  });

  const committed = await client.waitForTransaction({
    transactionHash: pendingTxn.hash,
  });
}

main();