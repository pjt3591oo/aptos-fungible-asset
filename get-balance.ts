import { Aptos, AptosConfig, Network, InputViewFunctionData, AccountAddress } from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network, clientConfig: {WITH_CREDENTIALS: true}});
const client = new Aptos(config);

const faModuleAccount = AccountAddress.fromString('da3c58693fec3b02a9004c8e3a693b4ea2d6def7cda3373e99c7e0b3fef6e3a5');
const userAccountAddress = AccountAddress.fromString('0x8b4a3f6aa62686f86a2e1c1132d366f19cba0ff392e3fee9e6f5b6eeb2a45fc5');

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
  // get balance
  const balanceOwners = await client.getCurrentFungibleAssetBalances({
    options: {
      where: {
        owner_address: { _eq: userAccountAddress.toString() },
        asset_type: { _eq: `0x${'0'.repeat(64 - metadataAddress.slice(2).length)}${metadataAddress.slice(2)}` },
      },
    },
  });

  console.log(balanceOwners)

  const metadata = await client.getFungibleAssetMetadata({
    options: {
      where: {
        creator_address: { _eq: faModuleAccount.toString() },
        asset_type: { _eq: `0x${'0'.repeat(64-metadataAddress.slice(2).length)}${metadataAddress.slice(2)}` },
      }
    }
  });
  console.log(metadata)

  // console.log(balanceOwners);

  // const metadata = await client.getFungibleAssetMetadata({
  //   options: {
  //     where: {
  //       creator_address: { _eq: faModuleAccount.toString() },
  //       // asset_type: { _eq: `0x${'0'.repeat(64-metadataAddress.slice(2).length)}${metadataAddress.slice(2)}` },
  //     }
  //   }
  // });
  // console.log(metadata)
  // // 
  // // 0x174cc0e39484f5f2a26af158cfb313f31fb36342791a003a8b7f301a733f87a
  // // 0x0174cc0e39484f5f2a26af158cfb313f31fb36342791a003a8b7f301a733f87a


  // const ts = await client.getCurrentFungibleAssetBalances({
  //   options: {
  //     where: {
  //       owner_address: { _eq: '0x6a869af4da6f18f4fd87c610746868da66eb6e961ee69527cec6bee8356408a3' },
  //     },
  //   },
  // });
  // console.log(ts)
  // for await (const t of ts) {
  //   const metadata = await client.getFungibleAssetMetadata({
  //     options: {
  //       where: {
  //         // creator_address: { _eq: faModuleAccount.accountAddress.toString()},
  //         asset_type: { _eq: `0x${'0'.repeat(64 - (t.asset_type || '').slice(2).length)}${(t.asset_type || '').slice(2)}` },
  //       }
  //     }
  //   });
  //   console.log(metadata)
  //   // const payload0: InputViewFunctionData = {
  //   //   function: `${`t.asset_type`}::fa_coin::get_metadata`,
  //   //   functionArguments: [],
  //   // };
  //   // const res0 = (await client.view<[{ inner: string }]>({ 
  //   //     payload: payload0, 
  //   //     // options: {
  //   //     //     ledgerVersion: 2n
  //   //     // } 
  //   // }))[0];
  //   // console.log(t)
  //   // console.log(res0)
  // }

}

main();