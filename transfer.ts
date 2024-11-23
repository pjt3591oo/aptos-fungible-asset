import { Account, AccountAddress, Aptos, AptosConfig, Network, Ed25519PrivateKey, InputViewFunctionData } from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);

const faModuleAccount = AccountAddress.fromString('da3c58693fec3b02a9004c8e3a693b4ea2d6def7cda3373e99c7e0b3fef6e3a5');

const from = Account.fromPrivateKey({
    privateKey: new Ed25519PrivateKey('0xff9002e00b19956f47cc7ad960262eb6147bfb43ac998afbfdb692e20c0320a0')
});

const to = AccountAddress.from('6f1d39283094758d5b9d9179fec7394c724d468133b690930c71411ecdca86dc')

async function main() {

    const payload: InputViewFunctionData = {
        function: `${faModuleAccount.toString()}::fa_coin::get_metadata`,
        functionArguments: [],
    };
    const res = (await client.view<[{ inner: string }]>({
        payload,
    }))[0];

    const metadataAddress = res.inner;

    const transferFungibleAssetRawTransaction = await client.transferFungibleAsset({
        sender: from,
        recipient: to,
        amount: 100_000_000,
        fungibleAssetMetadataAddress: metadataAddress,
    });

    const transferFungibleAssetTransaction = await client.signAndSubmitTransaction({
        signer: from,
        transaction: transferFungibleAssetRawTransaction,
    });

    await client.waitForTransaction({ transactionHash: transferFungibleAssetTransaction.hash });
}

main();