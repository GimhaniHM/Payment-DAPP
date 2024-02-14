import React, { useState, useEffect } from 'react';

import abi from "./Response.json";

const { ethers } = require("ethers")

export const Transact = () => {
    const [depositValue, setDepositValue] = useState(0);
    const [greet, setGreet] = useState('');
    const [greetingValue, setGreetingValue] = useState('');
    const [balance, setBalance] = useState();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0xe59CCD79416911F7c1cAa72E8f9feA6B800efe8D";
    const ABI = abi;

    const contract = new ethers.Contract(contractAddress, ABI, signer);
    
    // Call this once the page is loaded
    useEffect(() => {
        const connectWallet = async () => {
            // MetaMask requires requesting permission to connect users accounts
            // await provider.send("eth_requestAccounts", []);
            await window.ethereum.request({  method: "eth_requestAccounts" })

        }

        const getBalance = async () => {
            const balance = await provider.getBalance(contractAddress)
            const balanceFormatted = ethers.formatEther(balance);
            setGreet(balanceFormatted);
        }

        const getGreeting = async () => {
            // const greeting = await contract.greet();
            setGreet("greeting");
        }

        connectWallet()
            .catch(console.error);
        getBalance()
            .catch(console.error);
        getGreeting()
            .catch(console.error);
        

    },[])

    const handleDepositChange = (e) => {
        setDepositValue(e.target.value)
    }

    const handleGreetingChange = (e) => {
        setGreetingValue(e.target.value);
    }

    const handleDepositSubmit = (e) => {
        e.preventDefault();
        console.log(depositValue);
    }

    const handleGreetingSubmit = (e) => {
        e.preventDefault();
        console.log(greetingValue);
        
    }

    return (
        <div className="container">
            <div className="row mt-5">

                <div className="col">
                    <h3>{greet}</h3>
                    <p>Contract Balance: {balance}ETH</p>
                </div>

                <div className="col">
                    <div className="mb-3">
                        <h4>Deposit ETH</h4>
                        <form onSubmit={handleDepositSubmit}>
                            <div className="mb-3">
                                <input type="number" className="form-control" placeholder="0" onChange={handleDepositChange} value={depositValue} />
                            </div>
                            <button type="submit" className="btn btn-success">Deposit</button>
                        </form>

                        <h4 className="mt-3">Change Greeting</h4>
                        <form onSubmit={handleGreetingSubmit}>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="" onChange={handleGreetingChange} value={greetingValue} />
                            </div>
                            <button type="submit" className="btn btn-dark">Change</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
