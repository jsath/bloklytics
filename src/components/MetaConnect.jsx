import React, { useState, useEffect } from 'react'
import Stats from './Stats';
import Wallet from './Wallet';
import Connect from './Connect';


const MetaConnect = () => {


    const [walletAddress, setWalletAddress] = useState("");
    //const [accounts, setAccounts] = useState("")

    const btnStyle = {
        backgroundColor: "#027dd5",
        color: "rgb(255,255,255)",
        borderRadius: "25px",
        height: "50px", 
        width: "200px",
        fontSize: "22px"
    };

    const text = {
        color: "white"
    };



    useEffect(() => {
        document.body.style.backgroundColor = '#202225';
        getAccount()
    }, [walletAddress]);

    
    window.ethereum.on('accountsChanged', async function (accounts) {
        if(window.ethereum){
        try {
            const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
            });
            setWalletAddress(accounts[0]);
        } catch (error) {
            console.log('Error connecting to MetaMask');
        }
        } else {
        alert('Meta Mask not detected');
        } 
    })



    async function getAccount() { 
        if(window.ethereum) {
        try {
            const accounts = await window.ethereum.request({
            method: "eth_requestAccounts", 
            });
            console.log(accounts)
            setWalletAddress(accounts[0]);
        } catch (error) {
            console.log('Error connecting to MetaMask');
        }
        } else {
        alert('Meta Mask not detected');
        }
    }



    return (
    <>
        {
        walletAddress ?
        <Wallet addy={walletAddress}/>
        :
        <div>
            <Connect/>
            <button onClick={getAccount} style={btnStyle}>Connect Wallet</button>
        </div>
    }



    {
        walletAddress ? 
        <Stats addy={walletAddress}/>
        :
        <p style={text}>Connect to see assets</p>
    }

    
    </>
    )
}

export default MetaConnect