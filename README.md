# 0x Subgraph

This is a subgraph for the [0x Protocol](https://github.com/0xProject). 

This requires the following (TODO: number of contracts) contracts to be ingested by the subgraph, with the events that were sourced to be stored in the subgraph database:

TODO: list contracts and events 

This can be used for the Kovan, Ropsten and Mainnet contracts. In order to do
so the `subgraph.yaml` file will need to have the contract addresses changed to point to the 
correct address for each respective network.

## Brief Description of The Graph Node Setup

A Graph Node can run multiple subgraphs, and in this case it can have a subgraph Ropsten, Mainnet and Kovan. The subgraph ingests event data by calling to Infura through http. It can also connect to any geth node or parity node that accepts RPC calls. Fast synced geth nodes work. To use parity, the `--no-warp` flag must be used. Setting up a local Ethereum node is more reliable and faster, but Infura is the easiest way to get started. 

This subgraph has three types of files which tell the Graph Node to ingest events from specific contracts. They are:
* The subgraph manifest (subgraph.yaml)
* A GraphQL schema      (schema.graphql)
* Mapping scripts      (TODO: LIST FILES HERE)

This repository has these files created and ready to compile. The only thing that needs to be edited is the contract addresses in the `subgraph.yaml` file to change between Kovan, Ropsten or Mainnet.  

We have provided a quick guide on how to start up the 0x-Subgraph graph node. If these steps aren't descriptive enough, the [getting started guide](https://github.com/graphprotocol/graph-node/blob/master/docs/getting-started.md) has in depth details on running a subgraph. 

## Brief Description of 0x Contracts

TODO: mention how we need to source two versions of the contracts 


## Steps to get the 0x-Subgraph Running 
  1. Install IPFS and run `ipfs init` followed by `ipfs daemon`
  2. Install PostgreSQL and run `initdb -D .postgres` followed by `pg_ctl -D .postgres start` and `createdb mainnet-0x-subgraph` (note this db name is used in the commands below for the mainnet examples)
  3. If using Ubuntu, you may need to install additional packages: `sudo apt-get install -y clang libpq-dev libssl-dev pkg-config`
  4. Clone this repository, and run the following:
     * `yarn`
     * `yarn codegen` 
  5. Clone https://github.com/graphprotocol/graph-node from master and `cargo build` (this might take a while)
  6. a) Now that all the dependencies are running, you can run the following command to connect to Infura Mainnet (it may take a few minutes to compile). Password might be optional, it depends on your postrgres setup:

```
  cargo run -p graph-node --release -- \
  --postgres-url postgresql://USERNAME:[PASSWORD]@localhost:5432/mainnet-0x-subgraph \
  --ipfs 127.0.0.1:5001 \
  --ethereum-rpc mainnet-infura:https://mainnet.infura.io 
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
 
 TODO: Add in Ropsten

 7. Now deploy the 0x-Subgraph to The Graph Node with `yarn deploy --verbosity debug`. You should see a lot of blocks being skipped, and then it will start ingesting events from the moment the contracts were uploaded to the network. 

Now that you have subgraph is running you may open a [Graphiql](https://github.com/graphql/graphiql) browser at `127.0.0.1:8000` and get started with querying.

## Getting started with Querying 

Below are a few ways to show how to query the 0x-Subgraph for data. 

### Querying all possible data that is being stored
The query below shows all the information that is possible to query, but is limited to the first 5 instances. There are many other filtering options that can be used, just check out the [querying api](https://github.com/graphprotocol/graph-node/blob/master/docs/graphql-api.md).

```
{
TODO: add in queries 
}
```
The command above can be copy pasted into the Graphiql interface in your browser at `127.0.0.1:8000`.

