import React, { useState, useEffect } from 'react'
import { Alchemy, Network } from "alchemy-sdk";
const eth = require('./imgs/eth.png');




const Wallet = (props) => {


    const [addy, setAddy] = useState(props.addy);
    const [ENS, setENS] = useState("");

    const config = {
        apiKey: process.env.REACT_APP_ALCHEMY,
        network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(config);

    const walletAddress = addy;
    const ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
    const ens = async () => {
    const nfts = await alchemy.nft.getNftsForOwner(walletAddress, {
        contractAddresses: [ensContractAddress],
    });
    setENS(nfts)
    };


    useEffect(() => {
        ens()
    }, [addy]);

    window.ethereum.on('accountsChanged', async function (accounts) {
        if(window.ethereum){
        try {
            const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
            });
            setAddy(accounts[0]);
        } catch (error) {
            console.log('Error connecting to MetaMask');
        }
        } else {
        alert('Meta Mask not detected');
        } 
    })


    //styling
    const text = {
        color: "white"
    };

    const walletStyle = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "15px",
        width: "fit-content",
        marginRight: "35px",
        marginTop: "15px"
    };



    return (
    <>

    <div style={walletStyle}>


        <img src={eth} width="auto" height="50px" alt="eth"/>

        {
            ENS.length > 1 ? 
            <h3 style={text}>{ENS.ownedNfts[0].title}</h3>
            :
            <h3 style={text}>{addy}</h3>
        }

        
    </div>

    </>
    )
}


export default Wallet