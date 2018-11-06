import 'allocator/arena'
import {AuthorizedAddressRemoved} from "../types/ERC721ProxyV2/ERC721ProxyV2";
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {Fill, Cancel, CancelUpTo, AssetProxyRegistered, SignatureValidatorApproval} from '../types/ExchangeV2/ExchangeV2'

// Import entity types from the schema
import {CancelledOrder, FilledOrder, User, ApprovedProxy} from '../types/schema'

// Works right now
export function handleFill(event: Fill): void {
  let id = event.params.orderHash.toHex()
  let order = new FilledOrder()

  order.maker = event.params.makerAddress
  order.feeRecipient = event.params.feeRecipientAddress
  order.taker = event.params.takerAddress
  order.sender = event.params.senderAddress
  order.makerAssetFilledAmount = event.params.makerAssetFilledAmount
  order.takerAssetFilledAmount = event.params.takerAssetFilledAmount
  order.makerFeePaid = event.params.makerFeePaid
  order.takerFeePaid = event.params.takerFeePaid
  order.makerAssetData = event.params.makerAssetData
  order.takerAssetData =  event.params.takerAssetData

  store.set('FilledOrder', id, order)

  let maker = new User()
  let taker = new User()
  let feeRecipient = new User()

  let makerID = event.params.makerAddress.toHex()
  let takerID = event.params.takerAddress.toHex()
  let feeRecipientID = event.params.feeRecipientAddress.toHex()

  store.set("User", makerID, maker)
  store.set("User", takerID, taker)
  store.set("User", feeRecipientID, feeRecipient)
}

// Works
export function handleCancel(event: Cancel): void {
  let id = event.params.orderHash.toHex()
  let cancelledOrder = store.get("CancelledOrder", id) as CancelledOrder | null

  if (cancelledOrder == null) {
    cancelledOrder = new CancelledOrder()
  }

  cancelledOrder.maker = event.params.makerAddress
  cancelledOrder.feeRecipient = event.params.feeRecipientAddress
  cancelledOrder.sender = event.params.senderAddress
  cancelledOrder.makerAssetData = event.params.makerAssetData
  cancelledOrder.takerAssetData = event.params.takerAssetData
  store.set('CancelledOrder', id, cancelledOrder as CancelledOrder)

  let user = new User()
  let userid = event.params.makerAddress.toHex()
  store.set("User", userid, user)

}

// Handles registration of ERC720 and ERC20 proxy contracts. Only 2 events
// Works 100%
export function handleAssetProxyRegistered(event: AssetProxyRegistered): void {
  let id = event.params.id.toHex()
  let proxy = new ApprovedProxy()
  proxy.assetProxyAddress = event.params.assetProxy
  store.set("ApprovedProxy", id, proxy)
}

//TODO - can be true or false from the event , so need to udate
//NOTE - this event appears to never get emitted. TODO: Double check when I run through V1 of the contracts
export function handleSignatureValidatorApproval(event: SignatureValidatorApproval): void {
  let id = event.params.signerAddress.toHex()
  let user = store.get("User", id) as User | null

  if (user == null) {
    user = new User()
    user.validatorsApproved = []
  }

  let proxies = user.proxiesApproved
  proxies.push(event.params.validatorAddress)
  store.set('User', id, user as User)

}

// TODO: add this in because it gets emitted a lot by the contracts
// export function handleCancelUpTo(event: CancelUpTo): void {
//   let id = event.params.makerAddress.toHex()
//
// }