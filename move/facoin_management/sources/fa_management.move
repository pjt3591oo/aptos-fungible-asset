// https://github.com/aptos-labs/aptos-core/blob/main/aptos-move/move-examples/rewards_pool/sources/rewards_pool.move
module FacoinManagement::facoinManagement {
  use std::error;
  use std::signer;
  use std::string;
  use aptos_framework::event;
  use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, BurnRef, Metadata, FungibleAsset};
  use aptos_framework::object::{Self, Object};
  use aptos_framework::primary_fungible_store;

  // primary_fungible_store::transfer를 이용하여 module에서 token을 전송할 수 있다.
  public entry fun fa_transer(
    from: &signer,
    metadataAddress: Object<Metadata>,
    to: address,
    amount: u64
  ) {
    primary_fungible_store::transfer<Metadata>(from, metadataAddress, to, amount);
  }
}