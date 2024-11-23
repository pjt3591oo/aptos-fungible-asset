# fungible assets

```sh
$ npm i
```

* create aptos profile

```sh
$ aptos init --profile [PROFILE NAME] --network [testnet or devnet or mainnet]
```

```sh
$ aptos init --profile MUNG_TOKEN --network testnet
```

### create FA

deployed `token module` created `metadata` object

```sh
$ ts-node create-token-and-metadata.ts
```

### metadata

```sh
$ ts-node get-metadata.ts
```

### convert

```sh
$ tokenmodule-metadata-convert.ts
```

### mint

```
$ ts-node mint.ts
```

### balance

```sh
$ ts-node get-balance.ts
```

# transfer

```sh
$ ts-node transfer.ts
```

```sh
$ ts-node transfer-delegate.ts
```