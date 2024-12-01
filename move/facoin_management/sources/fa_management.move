module FacoinManagementAddr::facoinManagement {
  use std::signer;
  use std::bcs;
  use aptos_framework::fungible_asset::{Self, Metadata};
  use aptos_framework::object::{Self, Object, ExtendRef};
  use aptos_framework::primary_fungible_store;

  struct Pool has key, store {
    s: ExtendRef,
  }

  struct PoolRef has key {
    extend_ref: ExtendRef,
  }

  // account is system owner
  public entry fun createPool(account: &signer, poolId: u64) {
    let caller_address = signer::address_of(account);
    
    if (!has_object(caller_address, poolId)) {
      let constructor_ref = object::create_named_object(account, bcs::to_bytes<u64>(&poolId));

      let object_signer = object::generate_signer(&constructor_ref);
      
      move_to(&object_signer, PoolRef {
        extend_ref: object::generate_extend_ref(&constructor_ref),
      });
    } 
  }

  public entry fun staking(from: &signer, to: address, amount: u64, fa_metadata_address: Object<Metadata>) {
    primary_fungible_store::transfer<Metadata>(from, fa_metadata_address, to, amount);
  }

  public entry fun unstaking(account: &signer, pool_object_addr: address, amount: u64, fa_metadata_address: Object<Metadata>) acquires PoolRef {
    let caller_address = signer::address_of(account);
    let pool_ref = borrow_global<PoolRef>(pool_object_addr);

    let object_signer = object::generate_signer_for_extending(&pool_ref.extend_ref);

    primary_fungible_store::transfer<Metadata>(&object_signer, fa_metadata_address, caller_address, amount);
  }
  
  #[view]
  public fun has_object(creator: address, poolId: u64): bool {
    let object_address = object::create_object_address(&creator, bcs::to_bytes<u64>(&poolId));
    object::object_exists<0x1::object::ObjectCore>(object_address)
  }

  #[view]
  public fun get_object(creator: address, poolId: u64): address {
    let object_address = object::create_object_address(&creator, bcs::to_bytes<u64>(&poolId));
    // object_address
    object_address
  }

  #[view]
  public fun get_test0(creator: address): address {
    creator
  }
}