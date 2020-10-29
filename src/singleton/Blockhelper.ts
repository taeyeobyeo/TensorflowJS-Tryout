import * as _ from "lodash";
import Vuex from "../store/index";

enum blockType {
      block = "block",
      unblock = "unblock",
      force = "forceUnblock",
}

class BlockHelper {
      constructor() {
            this.block = _.debounce(this.block, 300);
            this.unblock = _.debounce(this.unblock, 300);
            this.forceUnblock = _.debounce(this.forceUnblock, 300);
      }
      block() {
            // Vuex.commit(blockType.block, {block: Vuex.state.block + 1});
            Vuex.replaceState({block: Vuex.state.block + 1});
      }
      unblock() {
            const block = Vuex.state.block - 1 >= 0 ? Vuex.state.block - 1 : 0; 
            Vuex.replaceState({block});
      }
      forceUnblock() {
            Vuex.replaceState({block: 0});
            // Vuex.commit(blockType.force);
      }
}

const ___blockHelper: BlockHelper = new BlockHelper();

export default ___blockHelper;