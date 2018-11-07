
// Required for dynamic memory allocation in WASM / AssemblyScript
import 'allocator/arena'
export { allocate_memory }

// Import APIs from graph-ts
import { store } from '@graphprotocol/graph-ts'


// Import event types from the registrar contract ABI
import {AuthorizedAddressAdded, AuthorizedAddressRemoved} from '../types/ERC20ProxyV2/ERC20ProxyV2'

// Import entity types from the schema
import {User} from '../types/schema'

// all this does is take the contract launch address of 0x (0x2d7dc2ef7c6f6a2cbc3dba4db97b2ddb40e20713) as caller, and the 0x Exchange contract (0x4f833a24e1f95d70f028921e27040ca56e09ab0b) as target
// so ultimately this just records: Authorizing/unauthorizing Exchange contract addresses from calling the transfer methods on this AssetProxy
// But there is no way to link this back to the specific proxy contract. and it only gets emitted twice in all the blocks. It isn't useful to the subgraph, so commenting out

export function handleAdded(event: AuthorizedAddressAdded): void {
  // let id = event.params.caller.toHex()
  // let user = store.get("User", id) as User | null
  //
  // if (user == null) {
  //   user = new User()
  //   user.proxiesApproved = []
  // }
  //
  // if (user != null) {
  //   let proxies = user.proxiesApproved
  //   proxies.push(event.params.target)
  //   user.proxiesApproved = proxies
  // }
  //
  // store.set('User', id, user as User)

}


export function handleRemoved(event: AuthorizedAddressRemoved): void {
}