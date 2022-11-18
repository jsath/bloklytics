import React, { useState, useEffect } from 'react'
import Stats from './Stats';
import Connect from './Connect';
import { Go } from './icons/icons';


const MetaConnect = () => {


    const [walletAddress, setWalletAddress] = useState("");
    //const [accounts, setAccounts] = useState("")

    const btnStyle = {
        backgroundColor: "rgb(0, 33, 65)",
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

    if(typeof window.ethereum !== 'undefined'){
        window.ethereum.on('accountsChanged', async function (accounts) {
            if(window.ethereum){
            try {
                const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
            } catch (error) {
                alert('Error connecting to MetaMask');
            }
            }
        })
    }



    async function getAccount() { 
        if(typeof window.ethereum !== 'undefined'){
        try {
            const accounts = await window.ethereum.request({
            method: "eth_requestAccounts", 
            });
            setWalletAddress(accounts[0]);
        } catch(error) {
            alert('Error connecting to MetaMask');
        }
        }
    }



    return (
    <>
        {
        walletAddress ?
        ''
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
            <a href='https://metamask.io/' target="_blank" rel="noreferrer noopener"><h1 style={text}>GET METAMASK<Go/></h1></a>
        }

    
    </>
    )
}

export default MetaConnect