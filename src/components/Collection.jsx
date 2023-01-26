import React, { useEffect, useState }from 'react'
import { useParams } from 'react-router-dom'
import { Alchemy, Network } from 'alchemy-sdk';
import NFT from './NFT';
import etherscan from './imgs/etherscan.png'

const Collection = () => {
    //getting collection address through state 
    const { addy } = useParams();
    const[collection, setCollection] = useState([]);
    const[collectionData, setCollectionData] = useState([]);

    //config
    const config = {
        apiKey: process.env.REACT_APP_ALCHEMY,
        network: Network.ETH_MAINNET,
    };
    const connection = new Alchemy(config);

    //getting collection nfts 
    const fetchCollectionNfts = async () => {
        const omitMetadata = false;

        // Get all NFTs
        const response = await connection.nft.getNftsForContract(addy, {
        omitMetadata: omitMetadata,
        });
        setCollection(response.nfts)
        setCollectionData(response.nfts[0].contract)
    };



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

    const nav = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    };

    const scan ={
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "end",
        gap: "7px"
    }





    useEffect(() => {
        document.body.style.backgroundColor = '#202225';
        fetchCollectionNfts()
    }, []);

    return (
    <>
    <div>
        {
            <>
            <div style={nav}>
            <h1 style={text}>{collectionData.name}<br/></h1>
                <div style={scan}>
                    <h5 style={text}>Token Type: {collectionData.tokenType}</h5>
                    <a href={`https://etherscan.io/address/${addy}`} target="_blank" rel="noreferrer noopener">
                        <img src={etherscan} width="30px"/>
                    </a>
                </div>
            </div>
            </>
        }
    </div>

    <div style={container}>
    
    {
        //display of collections nfts
        collection.map((nft,i) => <NFT key={i} nft={nft}/>)
    }
    </div>
    
    </>
    )
}

export default Collection