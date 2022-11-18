import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import loadGif from './imgs/load.gif'
import { Back } from './icons/icons';
import Dates from './Dates';
import Axios from "axios"
import './styles.css'
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Filler,
Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from "moment";
import { Link } from 'react-router-dom'
ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Filler,
Legend
);

const HistoryChart = () => {
const { id } = useParams();
const[response, setResponse] = useState();
const[load, setLoad] = useState("Loading");
const[price, setPrice] = useState();
const[coin, setCoin] = useState();

//time changing for graph
const date = Date.now();
const[end] = useState(Math.floor(date/1000));
const[start, setStart] = useState(end-31556926);
//const[start, setStart] = useState(end-31556926000)
const[int, setInt] = useState('d1');
const[dateFormat, setDateFormat] = useState("D MMM 'YY")

/*Change above state variables to seconds UNIX timestamp to use old coincap api */



//formatting
const format = Intl.NumberFormat('en-US');

useEffect(() => {
    Axios.get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`).then(
        (res) => {setCoin(res.data);setPrice(res.data.market_data.current_price.usd)}
    )
}, [id]);


useEffect(() => {
    Axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${start}&to=${end}`).then(
        (res) => {setResponse(res.data)}
    );

},[id, start, int, end]);

//live updates
const client = new  W3CWebSocket(`wss://ws.coincap.io/prices?assets=${id}`)
useEffect(() => {
    
    client.onmessage = (msg) => {
        let message = JSON.parse(msg.data);
        for(let key in message){
            setPrice(message[key])
        }

    }
}, [id, coin]);


//styling
const mid = {
    margin: 'auto',
    marginTop: '15%'
}

const blue = {
    color: '#3861fb'
}

const red = {
    color: 'red',
    alignItems: 'center'
}

const green = {
    color: 'green',
    alignItems: 'center'
}

const topHolder = {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: '24vw',
    marginRight: '2vw'

}

const chartContain = {
    height:'30vh',
    width:'60vw',
    marginLeft: 'auto'
};

const chartDescription = {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    justifyContent: 'center',
    gap: '15px',
    marginLeft: 'auto',
    marginRight: 'auto',
    verticalAlign: 'text-top'
};

const description = {
    width: '25%',
    marginTop: '-40vh'
};



const line = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    fontWeight: 'bold',
    color: 'black'
}



if(!response) {
    setInterval(() => {
        setLoad("Coin Not Found")
    },1500);
return (
    <div>
        { load === 'Loading' ?
        <>
        <h1 style={mid}>{load}</h1>
        <img src={loadGif} alt={'Loading'}/>
        </>
        :
        <>
        <span><h1 style={mid}>{load}</h1><Link to={'/'}><span style={blue}><Back/></span></Link></span>
        </>
        }
    </div>
)
}
if(!coin) {
    setInterval(() => {
        setLoad("Coin Not Found")
    },1500);
return (
    <div>
        { load === 'Loading' ?
        <>
        <h1 style={mid}>{load}</h1>
        <img src={loadGif} alt={'Loading'}/>
        </>
        :
        <>
        <span><h1 style={mid}>{load}</h1><Link to={'/'}><span style={blue}><Back/></span></Link></span>
        </>
        }
    </div>
)
}

    let coinChartData = response.prices.map(value => ({ x: value[0], y: value[1] }))
    let rgb = ''
    response.prices[response.prices.length-1][1] > response.prices[0][1] ? rgb = 'rgba(0,128,0,0.6)' :  rgb = 'rgba(255, 0, 0, 0.6)'
    let options = {
    responsive: true
    }
    let data = {
    labels: coinChartData.map(value => moment(value.x).format(dateFormat)),
    datasets: [
        {
        fill: true,
        label: coin.name,
        data: coinChartData.map(val => val.y),
        borderColor: 'black',
        backgroundColor: rgb
        }
    ]
    }

return (
<div>
    <>
    <div style={topHolder}>
        <span>
        <h3 style={line}>{coin.image? <img src={coin.image.small} alt={coin.name} width='35px' />: ''}{coin.name} Price({coin.symbol})<br/>
        {/*Render Live prices via websocket if available*/}
        </h3>
        <h2>
        ${price ? format.format(price) : format.format(parseInt(coin.market_data.current_price.usd).toFixed(5))}
        </h2>
        </span>
        <Dates end={end} setStart={setStart} setInt={setInt} setDateFormat={setDateFormat}/>
    </div>
    <div>
    <span style={chartDescription}>

    <div style={chartContain}>
    <Line options={options} data={data} />
    </div>


    <div style={description}>
    <table className='styled-table2'>
        <thead>
            <tr>
                <th>Market Stats</th>
            </tr>
        </thead>
        <tbody>
        <tr>
            <td><strong>Market Cap: </strong>${format.format(coin.market_data.market_cap.usd)}</td>
        </tr>
        <tr>
            <td><strong>Market Cap Rank: </strong>#{coin.market_cap_rank}</td>
        </tr>
        <tr>
            <td><strong>Total Volume(USD): </strong>${format.format(coin.market_data.total_volume.usd)}</td>
        </tr>
        <tr>
            <td><strong>24h Low: </strong><span style={red}>${format.format(coin.market_data.low_24h.usd)}</span>&nbsp;</td>
            </tr>
            <tr>
            <td><strong> 24h High: </strong><span style={green}>${format.format(coin.market_data.high_24h.usd)}</span></td>
        </tr>
        <tr>
            <td><strong>24h Change(USD): </strong>{coin.market_data.price_change_24h_in_currency.usd > 0 ? <span style={green}>${format.format(coin.market_data.price_change_24h_in_currency.usd)}</span>: <span style={red}>${format.format(coin.market_data.price_change_24h_in_currency.usd)}</span>}</td>
        </tr>
        </tbody>
    </table>
    {
    coin.description?
    <>
    <table className='styled-table2'>
        <thead>
            <tr>
            <th>{coin.name} Summary</th>
            </tr>
        </thead>

        <tbody className='textHolder'>
            <tr>
            <td dangerouslySetInnerHTML={{ __html: coin.description.en }} className='text'></td>
            </tr>
        </tbody>
    </table>
    </>
    : <></>
    }
    </div>
    </span>

    </div>





    

    </>
</div>
)
}

export default HistoryChart