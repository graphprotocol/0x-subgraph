// Import APIs from graph-ts
// Import event types from the registrar contract ABI
import {LogCancel, LogFill} from '../types/ExchangeV1/ExchangeV1'

// Import entity types from the schema
import {CancelledOrder, FilledOrder, User} from '../types/schema'


export function handleLogFill(event: LogFill): void {
  let id = event.params.orderHash.toHex()
  let order = new FilledOrder(id)

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
  order.save()

  let makerID = event.params.maker.toHex()
  let maker = new User(makerID)
  maker.save()

  let takerID = event.params.taker.toHex()
  let taker = new User(takerID)
  taker.save()

  let feeRecipientID = event.params.feeRecipient.toHex()
  let feeRecipient = new User(feeRecipientID)
  feeRecipient.save()
}


export function handleLogCancel(event: LogCancel): void {
  let id = event.params.orderHash.toHex()

  let cancelledOrder = CancelledOrder.load(id)
  if (cancelledOrder == null) {
    cancelledOrder = new CancelledOrder(id)
  }

  cancelledOrder.maker = event.params.maker
  cancelledOrder.feeRecipient = event.params.feeRecipient

  cancelledOrder.makerTokenAddrV1 = event.params.makerToken
  cancelledOrder.takerTokenAddrV1 = event.params.takerToken
  cancelledOrder.makerTokenAmountV1 = event.params.cancelledMakerTokenAmount
  cancelledOrder.takerTokenAmountV1 = event.params.cancelledTakerTokenAmount
  cancelledOrder.tokensV1 = event.params.tokens
  cancelledOrder.save()

  let userID = event.params.maker.toHex()
  let user = new User(userID)
  user.save()
}
