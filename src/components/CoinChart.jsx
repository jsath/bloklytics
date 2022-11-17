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
const[end, setEnd] = useState(date);
const[start, setStart] = useState(end-31556926000)
const[int, setInt] = useState('d1');



//formatting
const format = Intl.NumberFormat('en-US');

useEffect(() => {
    // Axios.get(`https://api.coincap.io/v2/assets/${id}`).then(
    //     (res) => {setCoin(res.data.data)}
    // )

    Axios.get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false`).then(
        (res) => {setCoin(res.data)}
    )
}, [id]);


useEffect(() => {
    Axios.get(`https://api.coincap.io/v2/assets/${id}/history?interval=${int}&start=${start}&end=${end}`).then(
        (res) => {setResponse(res.data.data)}
    );
},[id, start, int]);

//live updates
// const client = new  W3CWebSocket(`wss://ws.coincap.io/prices?assets=${id}`)
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
//             setPrice(message[key])
//         }

//     }
// }, [id, coin]);


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
    marginLeft: '20%'

}

const chartContain = {
    position: 'relative',
    height:'30vh',
    width:'60vw',
    marginLeft: 'auto',
    marginRight: 'auto'
};

const chartDescription = {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'center',
    gap: '15px',
    marginLeft: 'auto',
    marginRight: 'auto'
};

const description = {
    width: '25%'
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
    },2000);
return (
    <div>
        { load === 'Loading' ?
        <>
        <h1 style={mid}>{load}</h1>
        <img src={loadGif} alt={'Loading'}/>
        </>
        :
        <>
        <span><h1 style={mid}>{load}</h1><Link to={'/market'}><span style={blue}><Back/></span></Link></span>
        </>
        }
    </div>
)
}
if(!coin) {
    setInterval(() => {
        setLoad("Coin Not Found")
    },2000);
return (
    <div>
        { load === 'Loading' ?
        <>
        <h1 style={mid}>{load}</h1>
        <img src={loadGif} alt={'Loading'}/>
        </>
        :
        <>
        <span><h1 style={mid}>{load}</h1><Link to={'/market'}><span style={blue}><Back/></span></Link></span>
        </>
        }
    </div>
)
}

let coinChartData = response.map(value => ({ x: value.time, y: value.priceUsd }));
let rgb = ''
response[response.length-1].priceUsd > response[0].priceUsd ? rgb = 'rgb(0,128,0)' :  rgb = 'rgb(255,0,0)'
console.log(response)
let options = {
responsive: true
}
let data = {
labels: coinChartData.map(value => moment(value.x).format('DD MMM YYYY')),
datasets: [
    {
    fill: true,
    label: id,
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
        <Dates end={end} setStart={setStart} setInt={setInt}/>
    </div>
    <div>
    <span style={chartDescription}>
    <div style={description}>
    <h4>24h Low: <span style={red}>${format.format(coin.market_data.low_24h.usd)}</span>&nbsp; 24h High: <span style={green}>${format.format(coin.market_data.high_24h.usd)}</span></h4>
    <h4>Market Cap: ${format.format(coin.market_data.market_cap.usd)}</h4>
    {
    coin.description?
    <>
    <h3>Coin Description</h3>
    <p dangerouslySetInnerHTML={{ __html: coin.description.en }} className='text'></p>
    </>
    : <></>
    }
    </div>
    <div style={chartContain}>
    <Line options={options} data={data} />
    </div>
    </span>
    </div>





    

    </>
</div>
)
}

export default HistoryChart