
// Required for dynamic memory allocation in WASM / AssemblyScript
import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'


// Import event types from the registrar contract ABI
import {AuthorizedAddressAdded, AuthorizedAddressRemoved} from '../types/ERC721ProxyV2/ERC721ProxyV2'

// Import entity types from the schema
import {User} from '../types/schema'

// TODO: I dont think this does what I think it is supposed to, it only registers the exchange address twice, under the contract they launched all the 0x contracts from. And yes, each comes from erc20 and ecr721 calling, so I need to figure out what this really is
export function handleAdded(event: AuthorizedAddressAdded): void {
  let id = event.params.caller.toHex()
  let user = store.get("User", id) as User | null

  if (user == null) {
    user = new User()
    user.proxiesApproved = []
  }

  //this != is supposed to prevent double from showing up in proxiesApproved - DONT THINK THIS IS ACTUALLY NEEDED !
  // or maybe the event is allowed to happen twice? or maybe it got added, removed , and added . huh
  if (user != null) {
    let proxies = user.proxiesApproved
    proxies.push(event.params.target)
  }

  store.set('User', id, user as User)

}


// TODO: This is never called, because it is described as above. It either pushes or pops, and i need to look at typescirpt types
export function handleRemoved(event: AuthorizedAddressRemoved): void {

  // how to remove ? what func do we have

  // SEE POP AND FILTER - assembly script

}