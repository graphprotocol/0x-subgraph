# 0x Subgraph

This is a subgraph for the [0x Protocol](https://github.com/0xProject).

This requires the Exchange Contract (v1 and v2) to be ingested by the subgraph, with the events that were sourced to be stored in the subgraph database:

* Exchange.sol (v2)/ MExchangeCore.sol
    * event Fill
    * event Cancel
* MixinSignatureValidator.sol / MSignatureValidator.sol (v2)
    * event SignatureValidatorApproval
* Exchange.sol (v1)
    * event LogCancel
    * event LogFill

Events Not Included

* Exchange.sol / MExchangeCore.sol (v2)
    * event CancelUpTo - Can just use normal cancel events
    * event AssetProxyRegistered - Just emitted once or two to register proxies
* Exchange.sol (v1)
    * event LogError - No use in tracking this anymore, with solidity error messages added
    * event LogAuthorizedAddressAdded - Just emitted once to authorize Exchange contract  
    * event LogAuthorizedAddressRemoved - Just emitted once to authorize Exchange contract                            
                                                                   
Contracts Not Included
* TokenRegistry.sol (v1)
    * This is not included because it was removed after v1, since 0x could not keep up with the tokens being add
* TokenTransferProxy.sol (v1)
    * This was not included because it just authorizes the Exchange contract, and only gets emitted once
* ERC20Proxy.sol (v2)
    * This was not included because it just authorizes the Exchange contract, and only gets emitted once
* ERC721Proxy.sol (v2)
    * This was not included because it just authorizes the Exchange contract, and only gets emitted once

All of the other contracts don't emit events that are relevant for this subgraph.

This can be used for the Kovan, Ropsten and Mainnet contracts. In order to do
so the `subgraph.yaml` file will need to have the contract addresses changed to point to the 
correct address for each respective network.

Expect the subgraph to take ~10 hours to ingest all the events when connected to infura for mainnet

## Brief Description of The Graph Node Setup

A Graph Node can run multiple subgraphs, and in this case it can have a subgraph for Ropsten, Mainnet and Kovan. The subgraph ingests event data by calling to Infura through http. It can also connect to any geth node or parity node that accepts RPC calls. Fast synced geth nodes work. To use parity, the `--no-warp` flag must be used. Setting up a local Ethereum node is more reliable and faster, but Infura is the easiest way to get started. 

This subgraph has three types of files which tell the Graph Node to ingest events from specific contracts. They are:
* The subgraph manifest (subgraph.yaml)
* A GraphQL schema      (schema.graphql)
* Mapping scripts       (ExchangeV1.sol, ExchangeV2.sol) 

This repository has these files created and ready to compile, so a user can start this subgraph on their own. The only thing that needs to be edited is the contract addresses in the `subgraph.yaml` file to change between Kovan, Ropsten or Mainnet.  

We have provided a quick guide on how to start up the 0x-Subgraph graph node. If these steps aren't descriptive enough, the [getting started guide](https://github.com/graphprotocol/graph-node/blob/master/docs/getting-started.md) has in depth details on running a subgraph. 

## Brief Description of 0x Contracts

All of the contracts were examined for the 0x ecosystem. It was originally determined that the only relevant events are emitted from the exchange, and the proxy contracts. But then the proxy contracts really only register an event once or two, upon being published to the network. This isn't too important right now, although this would be easy to add.

0x upgraded their contracts to a V2 in September 2018. V1 is still running, and emitting events. This subgraph tracks both of these versions. The simplest way to look at it is that both of these contracts exist on the network, V1 has been around over a year, and V2 a few months. The subgraph ingests both of their events. In order to do this, mappings were written for each version, and then the schemas were adjusted to support both V1 and V2 fields. The `subgraph.yaml` file also must track both of the contract addresses.

## Steps to get the 0x-Subgraph Running 
  1. Install IPFS and run `ipfs init` followed by `ipfs daemon`
  2. Install PostgreSQL and run `initdb -D .postgres` followed by `pg_ctl -D .postgres start` and `createdb 0x-subgraph-mainnet` (note this db name is used in the commands below for the mainnet examples)
  3. If using Ubuntu, you may need to install additional packages: `sudo apt-get install -y clang libpq-dev libssl-dev pkg-config`
  4. Clone this repository, and run the following:
     * `yarn`
     * `yarn codegen` 
  5. Clone https://github.com/graphprotocol/graph-node from master and `cargo build` (this might take a while)
  6. a) Now that all the dependencies are running, you can run the following command to connect to Infura Mainnet (it may take a few minutes for Rust to compile). Password might be optional, it depends on your postrgres setup:

```
  cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/mainnet-0x-subgraph \
  --ipfs 127.0.0.1:5001 \
  --ethereum-rpc mainnet-infura:https://mainnet.infura.io --debug
```
  6. b) Or Mainnet Local:
```
  cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/mainnet-0x-subgraph \
  --ipfs 127.0.0.1:5001 \
  --ethereum-rpc mainnet-local:http://127.0.0.1:8545 
```
  6. c) Or Infura Kovan _(NOTE: Infura Kovan is not reliable right now, we get inconsistent results returned. If Kovan data is needed, it is suggested to run your own Kovan node)_
```
    cargo run -p graph-node --release --   
    --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/0x-kovan-subgraph 
    --ipfs 127.0.0.1:5001
    --ethereum-rpc kovan-infura:https://kovan.infura.io 

```
 6. d) Or a Kovan local node which was started with `parity --chain=kovan --no-warp  --jsonrpc-apis="all" `:
 
 ```
   cargo run -p graph-node --release -- \
   --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/0x-kovan-subgraph \
   --ipfs 127.0.0.1:5001 \
   --ethereum-rpc kovan-local:http://127.0.0.1:8545
 
 ```
 
 6. e) You can also connect to ropsten, just follow the syntax that was used with the kovan example. 
 
 7. Now deploy the 0x-Subgraph to The Graph Node with `yarn deploy --verbosity debug`. You should see a lot of blocks being skipped in the `graph-node` terminal, and then it will start ingesting events from the moment the contracts were uploaded to the network. 

Now that you have subgraph is running you may open a [Graphiql](https://github.com/graphql/graphiql) browser at `127.0.0.1:8000` and get started with querying.

## Getting started with Querying 

Below are a few ways to show how to query the 0x-Subgraph for data. 

### Querying all possible data that is being stored
The query below shows all the information that is possible to query, but is limited to the first 5 instances. There are many other filtering options that can be used, just check out the [querying api](https://github.com/graphprotocol/graph-node/blob/master/docs/graphql-api.md).

```
{
  users(first: 5){
  # users(where: {id: "0x000b75fcdc15d41277deb033c72d2c8d774ccced"}) {
    id
    validatorsApproved
    filledOrdersMaker {
      id
      maker
      makerFeePaid
      makerAssetDataV2
      makerAssetFilledAmount
      taker
      takerFeePaid
      takerAssetDataV2
      takerAssetFilledAmount
      senderV2
      feeRecipient
      tokensV1
      makerTokenAddrV1
      takerTokenAddrV1
    }
    filledOrdersTaker {
      id
      maker
      makerFeePaid
      makerAssetDataV2
      makerAssetFilledAmount
      taker
      takerFeePaid
      takerAssetDataV2
      takerAssetFilledAmount
      senderV2
      feeRecipient
      tokensV1
      makerTokenAddrV1
      takerTokenAddrV1
    }
    filledOrdersFeeRecipient {
      id
      maker
      makerFeePaid
      makerAssetDataV2
      makerAssetFilledAmount
      taker
      takerFeePaid
      takerAssetDataV2
      takerAssetFilledAmount
      senderV2
      feeRecipient
      tokensV1
      makerTokenAddrV1
      takerTokenAddrV1
    }
    validatorsApproved
    cancelled {
      id
      maker
      makerAssetDataV2
      takerAssetDataV2
      feeRecipient
      senderV2
      makerTokenAddrV1
      takerTokenAddrV1
      makerTokenAmountV1
      takerTokenAmountV1
      tokensV1
    }
  }
  cancelledOrders(first: 5, orderBy: id) {
    id
    maker
    makerAssetDataV2
    takerAssetDataV2
    feeRecipient
    senderV2
    makerTokenAddrV1
    takerTokenAddrV1
    makerTokenAmountV1
    takerTokenAmountV1
    tokensV1
  }
}

```
The command above can be copy pasted into the Graphiql interface in your browser at `127.0.0.1:8000`.

