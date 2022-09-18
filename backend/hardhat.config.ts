import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import 'dotenv/config'

import { HardhatUserConfig, task } from 'hardhat/config'

// syntactic sugar to add accounts element only if property exists
const accounts = process.env.NETWORK_RPC_ENDPOINT_PRIVATE_KEY && {accounts: [process.env.NETWORK_RPC_ENDPOINT_PRIVATE_KEY]}

task('accounts', 'print all accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  console.log("Accounts: ", accounts.map(v => v.address))
})

const testAccounts = {
  mnemonic: "test test test test test test test test test test test junk",
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: "",
}

const config: HardhatUserConfig = {
  solidity: "0.8.7",
  typechain: {
    outDir: 'mock/types',
    target: 'ethers-v5',
    // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    alwaysGenerateOverloads: false,
    // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    externalArtifacts: ['externalArtifacts/*.json'],
  },
  paths: {
    artifacts: 'mock/artifacts',
    sources: 'test'
  },
  mocha: {
    timeout: 100000000000
  },
  defaultNetwork: "hardhat_node",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: testAccounts,
    },
    ganache: {
      chainId: 1337, //event though config says it's 5777
      url: "http://127.0.0.1:7545",
      accounts: testAccounts,
    },
    hardhat_node: {
      chainId: 1337,
      url: "http://127.0.0.1:8545",
      accounts: testAccounts,
    }
  }

}
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default config
