// First, check if MetaMask is installed and available
if (typeof window.ethereum !== "undefined") {
  console.log("MetaMask is installed!");
}

// When the user clicks the "Connect Wallet" button, prompt them to connect to their MetaMask wallet
const connectWalletButton = document.getElementById("connect-wallet-button");
connectWalletButton.addEventListener("click", async () => {
  try {
    // Request permission to access the user's MetaMask account
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const userWalletAddress = accounts[0];

    // Update the UI to display the user's wallet address
    connectWalletButton.innerHTML = `Connected: ${userWalletAddress}`;
  } catch (error) {
    console.error(error);
  }
});
