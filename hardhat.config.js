// require("@nomicfoundation/hardhat-toolbox");

// module.exports = {
//   solidity: "0.8.18",
//   networks: {
//     hardhat: {
//       chainId: 1337,
//     },
//   },
// };

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.18",
  networks: {
    localganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [
        `0x${"c7eb17a7f3a0b121bab8966baa60d5a182f1412d1461e7a4dac64942e36ff78e"}`,
      ],
    },
  },
};
