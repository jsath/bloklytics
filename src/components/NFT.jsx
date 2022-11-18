import React, { useState } from 'react'
import './styles.css'
import {
    Link,
    Routes,
    Route
} from "react-router-dom";

const NFT = (props) => {

    const[nft] = useState(props.nft)
    

    const card = {
        backgroundColor: "#353840",
        height: "400px",
        width: "300px",
        color: "white",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
    };

    const img = {
        borderRadius: "15px 15px 0px 0px",
        height: "auto",
        width: "300px",
        maxHeight: "75%",
        overflow: "hidden"
    };

    const vidCenter = {
        display: "block",
        margin: "auto"
    };

    const text = {
        textDecoration: "none",
        color: "white",

    };  



    return (
    <>  
        <div style={card}>
            {
                (nft.media[0].gateway).includes("mp4")? 
                <>

                <video controls autoPlay loop muted className='hover' style={img}>
                    <source src={nft.media[0].gateway} type="video/mp4" style={vidCenter}></source>
                </video>
                <h4 style={text}><strong>{nft.title}</strong><br/><Link style={text} to={`/collection/${nft.contract.address}`}>{nft.contract.name}</Link></h4>
                </>
                :
                nft.contract.address === "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"?
                <>
                    <img src={nft.media[0].raw}alt={nft.title} style={img} className='hover'/>

                    <h4 style={text}><strong>{nft.title}</strong><br/><Link style={text} to={`/collection/${nft.contract.address}`}>ENS: Ethereum Name Service</Link></h4>
                </>
                :
                <>
                <img src={nft.media[0].gateway}alt={nft.title} style={img} className='hover'/>
                <h4 style={text}><strong>{nft.title}</strong><br/><Link style={text} to={`/collection/${nft.contract.address}`}>{nft.contract.name}</Link></h4>
                </>
            }
        </div>
    </>
    )
}

export default NFT