
// Required for dynamic memory allocation in WASM / AssemblyScript
import 'allocator/arena'
export { allocate_memory }

// Import types and APIs from graph-ts
import { Entity, store, Value } from '@graphprotocol/graph-ts'

import {Transfer, Approval} from '../types/'

export function handleAdded(event: Transfer): void {
  let owner = new Entity()
  let id = event.params._to.toHex()

  owner.setString('id', id)
  owner.setU256('amount', event.params._value)
  owner.setArray('allowance', new Array<Value>())

  store.set('ZRXTokenOwner', id, owner)
}
export function handleRemoved(event: Approval): void {
  let approval = new Entity()
  let id = event.params._owner.toHex()

  approval.setU256('amount', event.params._value)
  approval.setAddress('approvedAddress', event.params._spender)

  store.set('AllowanceApproval', id, approval)

}