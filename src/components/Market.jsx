import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Trend from './Trend';
import { TrendingUp, TrendingDown } from './icons/icons';
import { Link } from 'react-router-dom'
import './styles.css'


const Market = () => {




    const[coins, setCoins] = useState([]);
    const[search, setSearch] = useState('');


    const[searchBarText, setBarText] = useState('Search');

    //styling

    const red = {
        color: 'red',
        alignItems: 'center'
    }

    const green = {
        color: 'green',
        alignItems: 'center'
    }

    const line = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        fontWeight: 'bold',
        color: 'black'
    }

    const symbol = {
        color: 'gray',
    }

    const center = {
        display: 'flex',
        alignItems: 'center'
    }

    const input = {
        width: '360px',
		background: '#fff',
		boxShadow: '0 6px 10px 0 rgba(0, 0, 0 , .1)',
		border: '0px',
		outline: '0px',
		padding: '22px 18px'
    };

    const inputHeader = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
    };

    //Live Updates/original data rendering

    useEffect(() => {
        document.body.style.backgroundColor = 'white';
        Axios.get('https://api.coinstats.app/public/v1/coins?skip=0').then(
            (res) => {setCoins(res.data.coins)}
        )
    }, []);


    //live updates
    // const client = new  W3CWebSocket('wss://ws.coincap.io/prices?assets=ALL')

    // useEffect(() => {

    //     client.onclose = function(event) {
    //         if (event.wasClean) {
    //         alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    //         } else {
    //           // e.g. server process killed or network down
    //           // event.code is usually 1006 in this case
    //         alert('[close] Connection died');
    //         }
    //     };
        
    //     client.onmessage = (msg) => {
    //         let message = JSON.parse(msg.data);
    //         for(let key in message){
    //             let updateCoin = coins.find((coin) => (coin.id === key));
    //             if(updateCoin){
    //                 updateCoin.price = message[key]
    //                 setCoins([...coins])
    //             }

    //         }
    //     }
    // }, [coins]);



    const filtered = coins.filter((coin) => {
        return coin.name.toLowerCase().includes(search.toLowerCase())
    });




    //formatting for numbers 
    const format = Intl.NumberFormat('en-US');

    return (

    <>
    <div style={inputHeader}>
    <h1>Trending Cryptocurrencies</h1>
    <input placeholder={searchBarText} onChange={(e) => {setSearch(e.target.value)}} onMouseEnter={() => setBarText('Search for popular cryptocurrencies')} onMouseOut={()=>{setBarText("Search")}} style={input}/>
    </div>
    <table className='styled-table'>
        <thead>
            <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>1h%</th>
            <th>24h%</th>
            <th>7d%</th>
            <th>Market Cap</th>
            </tr>
        </thead>
        <tbody>
            {
            filtered ? filtered.map((coin) => {
                return (
                    <tr key={coin.id}>
                        <td>{coin.rank}</td>
                        <td><Link to={`/currencies/${coin.id}`}><span style={line}><img src={coin.icon} width='35px' alt={coin.symbol}/> {coin.name}  <span style={symbol}>{coin.symbol}</span></span></Link></td>
                        <td>${format.format(coin.price)}</td>
                        {coin.priceChange1h > 0 ?
                        <td style={green}><span style={center}><TrendingUp/>{coin.priceChange1d}%</span></td>
                        :
                        <td style={red}><span style={center}><TrendingDown/>{Math.abs(coin.priceChange1d)}%</span></td>
                        }
                        {coin.priceChange1d > 0 ?
                        <td style={green}><span style={center}><TrendingUp/>{coin.priceChange1d}%</span></td>
                        :
                        <td style={red}><span style={center}><TrendingDown/>{Math.abs(coin.priceChange1d)}%</span></td>
                        }
                        {coin.priceChange1w > 0 ?
                        <td style={green}><span style={center}><TrendingUp/>{coin.priceChange1w}%</span></td>
                        :
                        <td style={red}><span style={center}><TrendingDown/>{Math.abs(coin.priceChange1w)}%</span></td>
                        }
                        <td>${format.format(coin.marketCap)}</td>
                        
                    </tr>
                )
            })
        : <tr></tr>}
        </tbody>
    </table>

    
    </>
    )

}


export default Market