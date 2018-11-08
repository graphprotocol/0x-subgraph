import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'

// Import event types from the registrar contract ABI
import {LogCancel, LogFill} from '../types/ExchangeV1/ExchangeV1'

// Import entity types from the schema
import {CancelledOrder, FilledOrder, User} from '../types/schema'


export function handleLogFill(event: LogFill): void {
  let id = event.params.orderHash.toHex()
  let order = new FilledOrder()

  order.maker = event.params.maker
  order.feeRecipient = event.params.feeRecipient
  order.taker = event.params.taker
  order.makerAssetFilledAmount = event.params.filledMakerTokenAmount
  order.takerAssetFilledAmount = event.params.filledTakerTokenAmount
  order.makerFeePaid = event.params.paidMakerFee
  order.takerFeePaid = event.params.paidTakerFee

  order.makerTokenAddrV1 = event.params.makerToken
  order.takerTokenAddrV1 =  event.params.takerToken
  order.tokensV1 = event.params.tokens

  store.set('FilledOrder', id, order)

  let maker = new User()
  let taker = new User()
  let feeRecipient = new User()

  let makerID = event.params.maker.toHex()
  let takerID = event.params.taker.toHex()
  let feeRecipientID = event.params.feeRecipient.toHex()

  store.set("User", makerID, maker)
  store.set("User", takerID, taker)
  store.set("User", feeRecipientID, feeRecipient)
}


export function handleLogCancel(event: LogCancel): void {
  let id = event.params.orderHash.toHex()
  let cancelledOrder = store.get("CancelledOrder", id) as CancelledOrder | null

  if (cancelledOrder == null) {
    cancelledOrder = new CancelledOrder()
  }

  cancelledOrder.maker = event.params.maker
  cancelledOrder.feeRecipient = event.params.feeRecipient

  cancelledOrder.makerTokenAddrV1 = event.params.makerToken
  cancelledOrder.takerTokenAddrV1 = event.params.takerToken
  cancelledOrder.makerTokenAmountV1 = event.params.cancelledMakerTokenAmount
  cancelledOrder.takerTokenAmountV1 = event.params.cancelledTakerTokenAmount
  cancelledOrder.tokensV1 = event.params.tokens


  store.set('CancelledOrder', id, cancelledOrder as CancelledOrder)

  let user = new User()
  let userid = event.params.maker.toHex()
  store.set("User", userid, user)

}