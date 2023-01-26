import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import { ConnectWallet } from "@thirdweb-dev/react";
import Axios from 'axios';
import '../Swap.css'
import styled from 'styled-components';
import {NotificationManager} from 'react-notifications';
var BigNumber = require('big-number');
const qs = require('qs');
const Web3 = require('web3');


const Swap = (props) => {

    const[modalState, setModalState] = useState(false);
    const[walletAddress, setWalletAddress] = useState("");
    const[tokens, setTokens] = useState([])
    const[search, setSearch] = useState('')


    const[tradeSide, setTradeSide] = useState('')
    const[selectTo, setSelectTo] = useState('SELECT A TOKEN')
    const[selectFrom, setSelectFrom] = useState('SELECT A TOKEN')

    const[trade, setTrade] = useState({})

    const[priceData, setPriceData] = useState({})
    const[swapQuoteData, setQuoteData] = useState({})


    useEffect(() => {
        document.body.style.backgroundColor = '#202225';
        getAccount();
        getTokens();

    }, []);

    const getTokens = () => {
        Axios.get(`https://tokens.coingecko.com/uniswap/all.json`).then(
            (res) => {setTokens(res.data.tokens)}
        );
    }


    async function getAccount() { 
        if(typeof window.ethereum !== 'undefined'){
        try {
            const accounts = await window.ethereum.request({
            method: "eth_requestAccounts", 
            });
            setWalletAddress(accounts[0]);
        } catch(error) {
            NotificationManager.error('Error connecting to wallet');
        }finally{
            document.getElementById("swap_button").disabled = false;
        }
        }
    }

    if(typeof window.ethereum !== 'undefined'){
        window.ethereum.on('accountsChanged', async function (accounts) {
            if(window.ethereum){
            try {
                const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
                });
                setWalletAddress(accounts[0]);
            } catch (error) {
                NotificationManager.error('Error connecting to wallet');
            }
            }
        })
    }


    let filtered = tokens.filter((token) => {
        return token.name.toLowerCase().includes(search.toLowerCase())
    });

    const handleSelect = (token) => {
        setModalState(false)
        setSearch('')
        let newTrade = trade;
        newTrade[tradeSide] = token;
        setTrade(newTrade)
        if(trade.from){
            setSelectFrom('')
            document.getElementById('from_token_img').src = trade.from.logoURI;
            document.getElementById('from_token_text').innerHTML = trade.from.symbol;
        }
        if(trade.to){
            setSelectTo('')
            document.getElementById('to_token_img').src = trade.to.logoURI;
            document.getElementById('to_token_text').innerHTML = trade.to.symbol;
        }
    }

    const getPrice = () => {

        if (!trade.from || !trade.to || !document.getElementById("from_amount").value){
            NotificationManager.error('Please Fill in required fields');
            return;
        }
        let amount = Number(document.getElementById("from_amount").value * 10 ** trade.from.decimals);
        const params = {
            sellToken: trade.from.address,
            buyToken: trade.to.address,
            sellAmount: amount,
        }
        Axios.get(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`).then(
            (res) => {setPriceData(res.data)}
        ).catch((err)=>{console.log(err)})

        if((priceData.buyAmount / (10 ** trade.to.decimals)) < 1 || isNaN((priceData.buyAmount / (10 ** trade.to.decimals)))){
            document.getElementById('to_amount').value = '< 1';
        }else{
            document.getElementById('to_amount').value = priceData.buyAmount / (10 ** trade.to.decimals);
            document.getElementById('gas_estimate').innerHTML = "Estimated Gas:" + priceData.estimatedGas;
        }
    }


    const getQuote = () => {
        if (!trade.from || !trade.to || !document.getElementById("from_amount").value) return;
        let amount = Number(document.getElementById("from_amount").value * 10 ** trade.from.decimals);
        const params = {
            buyToken: trade.to.address,
            sellToken: trade.from.address,
            sellAmount: amount
            //takerAddress: account
        }
        console.log('data you need', qs.stringify(params))
        Axios.get(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}&feeRecipient=0x1e914D794019ae81c8BBfcAFa09C4a7E57325C7e&buyTokenPercentageFee=0.1`).then(
            (res) => {setQuoteData(res.data)}
        ).catch((err)=>{console.log(err)})

        document.getElementById("to_amount").value = swapQuoteData.buyAmount / (10 ** trade.to.decimals);
        document.getElementById("gas_estimate").innerHTML = swapQuoteData.estimatedGas;
    
        return swapQuoteData;
    }

    const trySwap = async() => {
        if (!trade.from || !trade.to || !document.getElementById("from_amount").value) {
            NotificationManager.error('Request a quote first');
            return;
        }
        const erc20abi= [{ "inputs": [ { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "burnFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" } ], "name": "decreaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" } ], "name": "increaseAllowance", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }]

        const Web3 = require('web3');
        const web3 = new Web3(Web3.givenProvider);
    
        let accounts =  await window.ethereum.request({ method: "eth_accounts" });
        let takerAddress = accounts[0];
        web3.eth.defaultAccount = takerAddress;

        const liveQuote = (getQuote());

        const fromTokenAddress = trade.from.address;
        const maxApproval = new BigNumber(2).pow(256).minus(1);
        console.log("approval amount: ", maxApproval);
        const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromTokenAddress);
        console.log("setup ERC20TokenContract: ", ERC20TokenContract);
    
        // //Grant the allowance target an allowance to spend our tokens.
        const tx = await ERC20TokenContract.methods.approve(
            liveQuote.allowanceTarget,
            maxApproval,
        ).send({ from: takerAddress })
        .then(tx => {
            console.log("tx: ", tx)
        });

        // // Perform the swap
        const receipt = await web3.eth.sendTransaction(liveQuote);
        console.log("receipt: ", receipt);
    }


    //stlying
    const ThirdHolder = styled.div`
    margin-top: 15vh;
    width: fit-content; 
    margin-left: auto;
    margin-right: auto;
`
    const UserWallet = styled.div`
        width: fit-content;
        margin-left: 10vw; 
        margin-top: 2vh;
        color: white;
        display: flex;
        width: fit-content;
        height: fit-content;
        padding: 3px;
        min-height: fit-content;
        min-width: fit-content;
        background-color: #0d111c;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #565d6f;
        &:hover {
            transform: scale(1.02);
            box-shadow: 5px 5px 5px #565d6f;
        }
        @media (max-width: 768px) {
            margin: auto;
            margin-top: 2vh;
        }
    `;

    const Wallet = styled.h3`
        color: white; 
    `;

    const StyledButton = styled.button`
    background-color: rgb(0, 33, 65);
    color: white;
    width: 15vw;
    border-radius: 20px;
    font-size: 2vh;
    min-width: 30px;
    height: fit-content;
    padding: 10px;
    `;

    const ButtonHolder = styled.div`
        display: flex;
        flex-direction: row; 
        justify-content: space-between;
    `



    return (
        <>
    {
        walletAddress ? 
        <>
        <UserWallet>
            <Wallet>User: {walletAddress}</Wallet>
        </UserWallet>
        <div className='swapBox'>
        <h1>ERC20 Swap</h1>
        <div className='swapHolder'>
            <div className="swapbox_select token_select" id="from_token_select" onClick={()=>{setModalState(true);setTradeSide('from')}}>
                <img className="token_img" id="from_token_img"/>
                <span id="from_token_text"></span>
                {selectFrom}
            </div>
            <div className="swapbox_select">
                <input className="form-control" type='number' placeholder="amount" id="from_amount"/>
            </div>
        </div>
        <div className='swapHolder'>
            <div className="swapbox_select token_select" id="to_token_select" onClick={()=>{setModalState(true);setTradeSide('to')}}>
                <img className="token_img" id="to_token_img"/>
                <span id="to_token_text"></span>
                {selectTo}
            </div>
            <div className="swapbox_select">
                <input className="form-control" readOnly='true' placeholder="amount" id="to_amount"/>
            </div>
        </div>
        <h3><span id='gas_estimate'></span></h3>
        <ButtonHolder>
            <StyledButton onClick={()=> {getPrice()}}>Request Price</StyledButton>
            <StyledButton id='swap_button' onClick={()=>{trySwap()}}>Swap</StyledButton>
        </ButtonHolder>
        </div>
        <Modal show={modalState} className='modalHolder'>
            <Modal.Header>
            <div className='modalTop'>
            <Modal.Title><h2 className='center'>Select a token</h2></Modal.Title>
            <CloseButton className="btn-close" onClick={()=> {setModalState(false);setSearch('')}}>X</CloseButton>
            </div>
            </Modal.Header>
            <Modal.Body>
            <div className="searchHolder">
            <input onChange={(e)=>{setSearch(e.target.value)}} placeholder='Search token name' className='tokenSearch'/>
            </div>
            <div>
                {
                    filtered.map((token)=>{
                        return <div className='optionToken' onClick={() => handleSelect(token, tradeSide)} key={JSON.stringify(token)}>
                                    <img src={token.logoURI} width='25vh' alt='img'/>
                                    <h3>{token.name}</h3>
                            </div>
                    })
                }
            </div>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    </>
    :
    <ThirdHolder>
        <ConnectWallet accentcolor="#002141" />
    </ThirdHolder>
    }
    </>
    )
}

export default Swap