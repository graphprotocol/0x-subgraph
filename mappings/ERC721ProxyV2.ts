
// Required for dynamic memory allocation in WASM / AssemblyScript
import 'allocator/arena'
export { allocate_memory }

// Import types and APIs from graph-ts
import { Entity, store, Value } from '@graphprotocol/graph-ts'

import {AuthorizedAddressAdded, AuthorizedAddressRemoved} from '../types/ERC721ProxyV2/ERC721ProxyV2'

// TODO: I dont think this does what I think it is supposed to, it only registers the exchange address twice, under the contract they launched all the 0x contracts from. And yes, each comes from erc20 and ecr721 calling, so I need to figure out what this really is
export function handleAdded(event: AuthorizedAddressAdded): void {
  let userID = event.params.caller.toHex()
  let user = store.get("User", userID)

  if (user == null) {
    user = new Entity()
    user.setString('id', userID)
    user.setArray('proxiesApproved', new Array<Value>())
  }

  //this != is supposed to prevent double from showing up in proxiesApproved - DONT THINK THIS IS ACTUALLY NEEDED !
  // or maybe the event is allowed to happen twice? or maybe it got added, removed , and added . huh
  if (user != null) {
    let proxies = user.getArray('proxiesApproved')
    proxies.push(Value.fromAddress((event.params.target)))
  }

  store.set('User', userID, user as Entity)

}


// TODO: This is never called, because it is described as above
export function handleRemoved(event: AuthorizedAddressRemoved): void {

  // how to remove ? what func do we have

  // SEE POP AND FILTER - assembly script

}