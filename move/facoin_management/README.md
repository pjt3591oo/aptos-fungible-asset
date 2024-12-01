* create profile 

```sh
 aptos init --profile default --network testnet
```

* compile 

```sh
aptos move compile  --named-addresses FacoinManagement=default
```

* publish

```sh
aptos move publish  --named-addresses FacoinManagement=default
```

