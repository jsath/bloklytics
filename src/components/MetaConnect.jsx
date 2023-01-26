import React, { useState, useEffect } from 'react'
import { ConnectWallet } from "@thirdweb-dev/react";
import Stats from './Stats';
import Connect from './Connect';
import { Go } from './icons/icons';
import styled from 'styled-components';


const MetaConnect = () => {


    const [walletAddress, setWalletAddress] = useState("");
    //const [accounts, setAccounts] = useState("")

    const Text = styled.h3`
        color: "white";
        font-decoration: underline; 
    `

    const ThirdHolder = styled.div`
        width: fit-content; 
        margin-left: auto;
        margin-right: auto;
    `


    


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
            console.log('Error connecting to MetaMask');
        }
        }
    }

    return (
    <>
        {
        walletAddress ?
        ''
        :
        <>
            <Connect/>
            <ThirdHolder>
                <ConnectWallet accentcolor="#f213a4" />
            </ThirdHolder>
        </>
        }
        {
            walletAddress ? 
            <Stats addy={walletAddress}/>
            :
            <a href='https://moralis.io/what-is-a-web3-wallet-web3-wallets-explained/' target="_blank" rel="noreferrer noopener"><Text>If you don't have a wallet, here's how to start<Go/></Text></a>
        }
    </>
    )
}

export default MetaConnect