import { Aptos, AptosConfig, Network, InputViewFunctionData } from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);

async function tokenAddressToMetadata() {
  const tokenModuleAddress = '0xda3c58693fec3b02a9004c8e3a693b4ea2d6def7cda3373e99c7e0b3fef6e3a5';
  const payload: InputViewFunctionData = {
    function: `${tokenModuleAddress}::fa_coin::get_metadata`,
    functionArguments: [],
  };
  const res = (
    await client.view<[{ inner: string }]>({
      payload,
    })
  )[0];

  console.log('tokenAddressToMetadata');
  console.log(res);
}

async function metadataToTokenAddress() {
  const metadataAddress = '0x29db0870d6e1d4d249d271643e9e90c3084cae047e9baea264a5a83157bbf004';

  const resource = await client.getAccountResource({
    accountAddress: metadataAddress,
    resourceType: `0x1::object::ObjectCore`,
  });

  console.log('metadataToTokenAddress');
  console.log(resource)
}

tokenAddressToMetadata();

metadataToTokenAddress();