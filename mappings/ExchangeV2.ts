import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {Fill, Cancel, SignatureValidatorApproval} from '../types/ExchangeV2/ExchangeV2'

// Import entity types from the schema
import {CancelledOrder, FilledOrder, User} from '../types/schema'

// Works right now
export function handleFill(event: Fill): void {
  let id = event.params.orderHash.toHex()
  let order = new FilledOrder()

  order.maker = event.params.makerAddress
  order.feeRecipient = event.params.feeRecipientAddress
  order.taker = event.params.takerAddress
  order.senderV2 = event.params.senderAddress
  order.makerAssetFilledAmount = event.params.makerAssetFilledAmount
  order.takerAssetFilledAmount = event.params.takerAssetFilledAmount
  order.makerFeePaid = event.params.makerFeePaid
  order.takerFeePaid = event.params.takerFeePaid
  order.makerAssetDataV2 = event.params.makerAssetData
  order.takerAssetDataV2 =  event.params.takerAssetData

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
  cancelledOrder.senderV2 = event.params.senderAddress
  cancelledOrder.makerAssetDataV2 = event.params.makerAssetData
  cancelledOrder.takerAssetDataV2 = event.params.takerAssetData
  store.set('CancelledOrder', id, cancelledOrder as CancelledOrder)

  let user = new User()
  let userid = event.params.makerAddress.toHex()
  store.set("User", userid, user)

}

// NOTE - this event appears to never get emitted. Possibly a feature that no one uses in the protocol
// NOTE - haven't been able to test the logic, because this event never gets emitted. It might crash the subgraph if there is an error in splice and indexOf ussage
export function handleSignatureValidatorApproval(event: SignatureValidatorApproval): void {
  let id = event.params.signerAddress.toHex()
  let user = store.get("User", id) as User | null

  if (user == null) {
    user = new User()
    user.validatorsApproved = []
  }

  let proxies = user.validatorsApproved

  if(event.params.approved == true){
    proxies.push(event.params.validatorAddress)
  } else {
    let i = proxies.indexOf(event.params.validatorAddress, 0)
    proxies.splice(i, 1)
  }
  store.set('User', id, user as User)

}

// Handles registration of ERC720 and ERC20 proxy contracts. Only 2 events
// REMOVED for now. Will completely remove in the future
// export function handleAssetProxyRegistered(event: AssetProxyRegistered): void {
//   let id = event.params.id.toHex()
//   let proxy = new ApprovedProxy()
//   proxy.assetProxyAddress = event.params.assetProxy
//   store.set("ApprovedProxy", id, proxy)
// }



// Could add this in the future, although I don't believe it adds much value. Would need to have someone request it
// export function handleCancelUpTo(event: CancelUpTo): void {
//   let id = event.params.makerAddress.toHex()
//
// }