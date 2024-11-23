import { Aptos, AptosConfig, Network, InputViewFunctionData, AccountAddress } from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network, clientConfig: {WITH_CREDENTIALS: true}});
const client = new Aptos(config);

const faModuleAccount = AccountAddress.fromString('da3c58693fec3b02a9004c8e3a693b4ea2d6def7cda3373e99c7e0b3fef6e3a5');

async function main() {
  const payload: InputViewFunctionData = {
    function: `${faModuleAccount}::fa_coin::get_metadata`,
    functionArguments: [],
  };
  
  const res = (await client.view<[{ inner: string }]>({
    payload,
  }))[0];
  
  const metadataAddress = res.inner;
  console.log(metadataAddress)

  const metadataByIndexer = await client.getFungibleAssetMetadata({
    options: {
      where: {
        creator_address: { _eq: faModuleAccount.toString() },
        asset_type: { _eq: `0x${'0'.repeat(64-metadataAddress.slice(2).length)}${metadataAddress.slice(2)}` },
      }
    }
  });
  console.log(metadataByIndexer)


  const metadataByResource = await client.getAccountResource({
    accountAddress: metadataAddress,
    resourceType: `0x1::fungible_asset::Metadata`,
  });
  console.log(metadataByResource)

}

main();