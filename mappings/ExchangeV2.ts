// Import event types from the registrar contract ABI
import {Fill, Cancel, SignatureValidatorApproval} from '../types/ExchangeV2/ExchangeV2'

// Import entity types from the schema
import {CancelledOrder, FilledOrder, User} from '../types/schema'

// Works right now
export function handleFill(event: Fill): void {
  let id = event.params.orderHash.toHex()
  let order = new FilledOrder(id)
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
  order.save()

  let makerID = event.params.makerAddress.toHex()
  let maker = new User(makerID)
  maker.save()

  let takerID = event.params.takerAddress.toHex()
  let taker = new User(takerID)
  taker.save()

  let feeRecipientID = event.params.feeRecipientAddress.toHex()
  let feeRecipient = new User(feeRecipientID)
  feeRecipient.save()
}

// Works
export function handleCancel(event: Cancel): void {
  let id = event.params.orderHash.toHex()

  let cancelledOrder = CancelledOrder.load(id)
  if (cancelledOrder == null) {
    cancelledOrder = new CancelledOrder(id)
  }

  cancelledOrder.maker = event.params.makerAddress
  cancelledOrder.feeRecipient = event.params.feeRecipientAddress
  cancelledOrder.senderV2 = event.params.senderAddress
  cancelledOrder.makerAssetDataV2 = event.params.makerAssetData
  cancelledOrder.takerAssetDataV2 = event.params.takerAssetData
  cancelledOrder.save()

  let userID = event.params.makerAddress.toHex()
  let user = new User(userID)
  user.save()
}

// NOTE - this event appears to never get emitted. Possibly a feature that no one uses in the protocol
// NOTE - haven't been able to test the logic, because this event never gets emitted. It might crash the subgraph if there is an error in splice and indexOf ussage
export function handleSignatureValidatorApproval(event: SignatureValidatorApproval): void {
  let id = event.params.signerAddress.toHex()
  let user = User.load(id)
  if (user == null) {
    user = new User(id)
    user.validatorsApproved = []
  }

  let proxies = user.validatorsApproved

  if (event.params.approved == true) {
    proxies.push(event.params.validatorAddress)
  } else {
    let i = proxies.indexOf(event.params.validatorAddress, 0)
    proxies.splice(i, 1)
  }

  user.save()
}

// Handles registration of ERC720 and ERC20 proxy contracts. Only 2 events
// Not handling, since it is only 2 events. This is only really important if you want to be notified of 0x changing their core contract addresses
// export function handleAssetProxyRegistered(event: AssetProxyRegistered): void {
//   let id = event.params.id.toHex()
//   let proxy = new ApprovedProxy()
//   proxy.assetProxyAddress = event.params.assetProxy
//   store.set("ApprovedProxy", id, proxy)
// }



// Not really needed, can just follow the cancelled events
// export function handleCancelUpTo(event: CancelUpTo): void {
//   let id = event.params.makerAddress.toHex()
//
// }
