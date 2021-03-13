require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "ioanadumitrascu.go.ro",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}
