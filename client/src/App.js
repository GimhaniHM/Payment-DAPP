import React, { useState, useEffect } from 'react';
import './App.css';
import { tokenContractAbi, invoiceContractAbi, tokenContractAddress, invoiceContractAddress } from './lib/constant';
import { ethers } from 'ethers';
import { PropagateLoader } from 'react-spinners';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [approvalStatus, setApprovalStatus] = useState('');
  const [approvalValue, setApprovalValue] = useState('0');
  const [isApproved, setIsApproved] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setCurrentAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(accounts[0]);
        setCurrentBalance(ethers.utils.formatEther(balance));
      } else {
        alert('Please install MetaMask wallet');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to MetaMask');
    }
  };

  const approvePayment = async () => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer)
      const result = await contract.approve("0x764c57b9e29492Cd677AD8FeAC29De07c4D8D1Ae", approvalValue);
      await result.wait();
      initialize();
      setIsLoading(false);
      setIsApproved(true);
      setApprovalStatus("Approved");
      setTimeout(() => {
        setApprovalStatus("");
      }, 3000); // Hide after 5 seconds
    } catch (error) {
      setIsLoading(false);
      console.error("Error approving payment:", error.message);
    }
  };

  // const payPayment = async () => {
  //   try {
  //     setIsLoading(true);
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(invoiceContractAddress, invoiceContractAbi, signer)
  //     const result = await contract.payInvoice('did:polygonid:polygon:mumbai:2qKGK5y3LoMMWeeDNF6pyJVhv7iqNkCDLXg1GFiQp5', approvalValue);
  //     await result.wait();
  //     // Hide after 5 seconds
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.error("Error paying:", error.message);
  //   }
  // };

  const createPayment = async () => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractInvoice = new ethers.Contract(invoiceContractAddress, invoiceContractAbi, signer)
      const resultToken = await contractInvoice.createInvoice('did:polygonid:polygon:mumbai:2qKGK5y3LoMMWeeDNF6pyJVhv7iqNkCDLXg1GFiQp5', approvalValue);
      await resultToken.wait();
      console.log("Created: ", resultToken);

      const contractToken = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer)
      const resultInvoice = await contractToken.transferFrom(currentAccount, "0x764c57b9e29492Cd677AD8FeAC29De07c4D8D1Ae", approvalValue);
      await resultInvoice.wait();
      console.log("Transfered: ", resultInvoice);

      const resultPay = await contractInvoice.payInvoice('did:polygonid:polygon:mumbai:2qKGK5y3LoMMWeeDNF6pyJVhv7iqNkCDLXg1GFiQp5', approvalValue);
      await resultPay.wait();
      console.log("Paid: ", resultPay);

      // --------------------------------------------------------

      const tokenBalance = await contractToken.balanceOf("0x764c57b9e29492Cd677AD8FeAC29De07c4D8D1Ae");
      // await tokenBalance.wait();
      console.log("Invoice Contract Balance: ", tokenBalance);

      const walletTokenBalance = await contractToken.balanceOf("0xe59CCD79416911F7c1cAa72E8f9feA6B800efe8D");
      // await walletTokenBalance.wait();
      console.log("Wallet Balance : ", walletTokenBalance);

      // --------------------------------------------------------

      // const result2 = await contract.payInvoice('did:polygonid:polygon:mumbai:2qKGK5y3LoMMWeeDNF6pyJVhv7iqNkCDLXg1GFiQp5', 0);
      // await result2.wait();
      // console.log("Paid: ", result2);
      // payPayment();
      initialize();
      setIsLoading(false);
      setIsApproved(true);
      setApprovalStatus("Created");
      
      setTimeout(() => {
        setApprovalStatus("");
      }, 3000); // Hide after 5 seconds
    } catch (error) {
      setIsLoading(false);
      console.error("Error paying amount:", error.message);
    }
  };

  const initialize = async () => {
    try {
      if (currentAccount) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
        const result = await contract.balanceOf(currentAccount);
        setTokenBalance(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initialize();
  }, [currentAccount]);

  return (
    <div className="App">
      {currentAccount ? (
        <>
          <div className="navbar">
            <p>Wallet Address: {currentAccount}</p>
            <p>Account balance: {currentBalance}</p>
          </div>
          <div className="header">
            <div className="container">
              {isLoading ? (
                <PropagateLoader color="#000" size={30} />
              ) : (
                <>
                  <h1>{isApproved ? 'Pay' : 'Approve Payment'}</h1>
                  {isApproved ? <label htmlFor="package">Package:</label> : <label htmlFor="package">Amount:</label>}
                  <input type="text" id="package" value={approvalValue} onChange={(e) => setApprovalValue(e.target.value)} />
                  <button onClick={isApproved ? createPayment : approvePayment}>{isApproved ? 'Pay' : 'Approve Payment'}</button>
                  {approvalStatus && <p>{approvalStatus}</p>}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>
          <h1>Welcome to Bethel Payment Gateway!</h1>
          <button onClick={connectWallet}>Connect to MetaMask</button>
        </div>
      )}
    </div>
  );
};

export default App;
