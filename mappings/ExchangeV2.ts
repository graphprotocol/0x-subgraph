import 'allocator/arena'
import {AuthorizedAddressRemoved} from "../types/ERC721ProxyV2/ERC721ProxyV2";
export { allocate_memory }

import { Entity, store, Value } from '@graphprotocol/graph-ts'
import {Fill, Cancel, CancelUpTo, AssetProxyRegistered, SignatureValidatorApproval} from '../types/ExchangeV2/ExchangeV2'

export function handleFill(event: Fill): void {
  let id = event.params.orderHash.toHex()
  let order = new Entity()

  order.setString('id', id)
  order.setAddress('maker', event.params.makerAddress)
  order.setAddress('feeRecipient', event.params.feeRecipientAddress)
  order.setAddress('taker', event.params.takerAddress)
  order.setAddress('sender', event.params.senderAddress)
  order.setU256('makerAssetFilledAmount', event.params.makerAssetFilledAmount)
  order.setU256('takerAssetFilledAmount', event.params.takerAssetFilledAmount)
  order.setU256('makerFeePaid', event.params.makerFeePaid)
  order.setU256('takerFeePaid', event.params.takerFeePaid)
  order.setBytes('makerAssetData', event.params.makerAssetData)
  order.setBytes('takerAssetData', event.params.takerAssetData)
  order.setString('user', id)

  store.set('FilledOrder', id, order)

  let maker = new Entity()
  let taker = new Entity()
  let feeRecipient = new Entity()

  let makerID = event.params.makerAddress.toHex()
  let takerID = event.params.takerAddress.toHex()
  let feeRecipientID = event.params.feeRecipientAddress.toHex()

  store.set("User", makerID, maker)
  store.set("User", takerID, taker)
  store.set("User", feeRecipientID, feeRecipient)
}

export function handleCancel(event: Cancel): void {
  let id = event.params.orderHash.toHex()
  let cancelledOrder = store.get("CancelledOrder", id)

  if (cancelledOrder == null) {
    let cancelledOrder = new Entity()
    cancelledOrder.setString("id", id)
  }

  cancelledOrder.setAddress('maker', event.params.makerAddress)
  cancelledOrder.setAddress('feeRecipient', event.params.feeRecipientAddress)
  cancelledOrder.setAddress('sender', event.params.senderAddress)
  cancelledOrder.setBytes('makerAssetData', event.params.makerAssetData)
  cancelledOrder.setBytes('takerAssetData', event.params.takerAssetData)

  store.set('CancelledOrder', id, cancelledOrder as Entity)

  let userid = event.params.makerAddress.toHex()
  let user = store.get("User", userid)

  if (user == null) {
    let newUser = new Entity()
    user.setString("id", userid)
    store.set("User", userid, user as Entity)
  }

  // let user = new Entity()
  // let userid = event.params.makerAddress.toHex()
  // store.set("User", userid, user as Entity)

}

export function handleCancelUpTo(event: CancelUpTo): void {
  let id = event.params.makerAddress.toHex()

}

export function handleAssetProxyRegistered(event: AssetProxyRegistered): void {

//   event AssetProxyRegistered(
//     bytes4 id,              // Id of new registered AssetProxy.
//     address assetProxy      // Address of new registered AssetProxy.
// );


}

export function handleSignatureValidatorApproval(event: SignatureValidatorApproval): void {

//   event SignatureValidatorApproval(
//     address indexed signerAddress,     // Address that approves or disapproves a contract to verify signatures.
//     address indexed validatorAddress,  // Address of signature validator contract.
//     bool approved                      // Approval or disapproval of validator contract.
// );

  let id = event.params.signerAddress.toHex()
  let user = store.get("User", id)

  if (user == null) {
    user = new Entity()
    user.setString('id', id)
    user.setArray('validatorsApproved', new Array<Value>())
  }

  let proxies = user.getArray('proxiesApproved')
  proxies.push(Value.fromAddress(event.params.validatorAddress))

  store.set('User', id, user as Entity)

}