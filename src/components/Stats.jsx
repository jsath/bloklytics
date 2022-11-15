import React, {useEffect, useState} from 'react'
import { Alchemy, Network } from "alchemy-sdk";
import NFT from './NFT';


const Stats = (props) => {

    const [balance, setBalance] = useState("");
    const [userNfts, setNfts] = useState([])
    const [totalNfts, setTotalNfts] = useState([])
    const [addy, setAddy] = useState(props.addy)

    //balance and token data for wallet updated on change of wallet

    const config = {
        apiKey: "64QjIB-4lZRtVBmDWcvJNjsUjLaQEqhs",
        network: Network.ETH_MAINNET,
    };
    const connection = new Alchemy(config);

    //updating page data if user switches wallets
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


    const fetchnfts = async () => {
    const nfts = await connection.nft.getNftsForOwner(addy);
    setNfts(nfts.ownedNfts);
    setTotalNfts(nfts.totalCount);
    };

    const Web3 = require('web3')
    const web3 = new Web3('https://mainnet.infura.io/v3/2d6a26fef3c74387b489a81beb1acce1');

    const getBalance = () => {
        web3.eth.getBalance(addy)
        .then(balance => setBalance(web3.utils.fromWei(balance)))
    }

    useEffect(() => {
        document.body.style.backgroundColor = '#202225';
        getBalance()
        fetchnfts()
    }, [addy]);


    //styling

    const container = {
        display: "flex",
        flexDirection: "row",
        width: "97%",
        justifyContent: "center",
        marginRight: "auto",
        marginLeft: "auto",
        flexWrap: "wrap",
        gap: "15px"
    };

    const text = {
        color: "white"
    };



return (
    <>
    <h4 style={text}>{balance} ETH</h4>
    <h4 style={text}>Collected {totalNfts}</h4>


    <div style={container}>
    {
        userNfts.map((nft,i) => {
            return(
            <NFT key={i} nft={nft}/>
            );
            })
    }
    </div>
    </>
)
}

export default Stats