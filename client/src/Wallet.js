import React, { useState, useEffect } from 'react';
import abi from "./Response.json";

const { ethers } = require("ethers");

export const Wallet = () => {

    let contractAddress = "0xafbEE3E0C13efBE23B632246D982c8fd531428C7";
    let contractABI = abi;

    console.log("Abi: ", {contractABI});
    //   const [state, setState] = useState({ provider: null, signer: null, contract: null })

    // Define state variables

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const [userBalance, setUserBalance] = useState(null);
    const [tokenName, setTokenName] = useState("Token");

    // Function to connect wallet
    const connectWallet = async () => {
        // const { ethereum } = window;

        if (window.ethereum && window.ethereum.isMetaMask) {
            // connect to metamask
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    accountChanged(result[0]);
                    setConnButtonText('Wallet Connected');
                    // getUserBalance([result[0]]);
                })
        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Install MetaMask please!!')
        }
    };

    const accountChanged = (accountName) => {
        setDefaultAccount(accountName)
        updateEthers();
    }

    const updateBalance = async() => {

        console.log("CONTRACT: ", contract);
        
        let balanceBigN = await contract.balanceOf(defaultAccount);
        console.log("BALANCE NUMBER: ", balanceBigN);

        let balanceNumber = balanceBigN.toNumber();

        let tokenDecimals = await contract.decimals();
        let tokenBalance = balanceNumber / Math.pow(10, tokenDecimals);

        setUserBalance(toFixed(tokenBalance));
    
        console.log("TOKEN BALANCE: ", tokenDecimals);

        // setBalance(toFixed(tokenBalance));

    }

    function toFixed(x) {
        if (Math.abs(x) < 1.0) {
           var e = parseInt(x.toString().split('e-')[1]);
           if (e) {
              x *= Math.pow(10, e - 1);
              x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
           }
        } else {
           var e = parseInt(x.toString().split('+')[1]);
           if (e > 20) {
              e -= 20;
              x /= Math.pow(10, e);
              x += (new Array(e + 1)).join('0');
           }
        }
        return x;
     }

    const chainChangedHandler = () => {
        window.location.reload();
    }

    // listen for account changes
    window.ethereum.on('accountChanged', accountChanged);

    window.ethereum.on('chainChanged', chainChangedHandler);

    const updateEthers = () => {
        let tempProvider = new ethers.BrowserProvider(window.ethereum);
		setProvider(tempProvider);
        console.log("PROVIDER: ", tempProvider);

		let tempSigner = tempProvider.getSigner();
        console.log("SIGNER: ", tempSigner);
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner);
        console.log("CONTRACT: ", tempContract);
		setContract(tempContract);

    }

    useEffect(() => {
		if (contract != null) {
			updateBalance();
		}
	}, [contract]);
    

    return (
        <div>
            <h1>Bex ERC-20 Wallet</h1>
            <button onClick={connectWallet}>{connButtonText}</button>
            <h3>Address: {defaultAccount}</h3>
            <h3>Bex Balance: $ {userBalance}</h3>

            {errorMessage}
        </div>
    );
}

// export default Wallet;
