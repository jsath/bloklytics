import React, { useEffect, useState } from 'react'
import Axios from 'axios';

const Market = () => {

    const[coins, setCoins] = useState([]);
    const[search, setSearch] = useState('');

    //styling

    const red = {
        color: 'red'
    }

    const line = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        fontWeight: 'bold'
    }

    const symbol = {
        color: 'gray',
    }

    const green = {
        color: 'green'
    }


    useEffect(() => {
        document.body.style.backgroundColor = 'white';

        Axios.get('https://api.coinstats.app/public/v1/coins?skip=0').then(
            (res) => {setCoins(res.data.coins)}
        )
    }, []);


    const filtered = coins.filter((coin) => {
        return coin.name.toLowerCase().includes(search.toLowerCase())
    });

    return (

    <>
    <h1>Market Data</h1>

    <input type='text' placeholder='Search' onChange={(e) => {setSearch(e.target.value)}}/>

    <table>

        <thead>
            <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Rank</th>
            <th>1h%</th>
            <th>24h%</th>
            <th>7d%</th>
            </tr>
        </thead>
        <tbody>
            {
            filtered ? filtered.map((coin) => {
                return (
                    <tr key={coin.id}>
                        <td style={line}><img src={coin.icon} width='35px'/> {coin.name}  <span style={symbol}>{coin.symbol}</span></td>
                        <td>{coin.price.toFixed(3)}</td>
                        <td>{coin.rank}</td>
                        {coin.priceChange1h > 0 ?
                        <td style={green}>{coin.priceChange1d}</td>
                        :
                        <td style={red}>{coin.priceChange1d}</td>
                        }
                        {coin.priceChange1d > 0 ?
                        <td style={green}>{coin.priceChange1d}</td>
                        :
                        <td style={red}>{coin.priceChange1d}</td>
                        }
                        {coin.priceChange1w > 0 ?
                        <td style={green}>{coin.priceChange1w}</td>
                        :
                        <td style={red}>{coin.priceChange1w}</td>
                        }
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